const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_FILE = process.env.LOCAL_DATA_FILE
  ? path.resolve(process.cwd(), process.env.LOCAL_DATA_FILE)
  : path.resolve(__dirname, '../../../data/local-db.json');

let cache = null;

function emptyStore() {
  return { users: [], adminLogs: [], learningStates: [] };
}

function ensureDir() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function loadStore() {
  if (cache) return cache;
  ensureDir();

  if (!fs.existsSync(DATA_FILE)) {
    cache = emptyStore();
    persist();
    return cache;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.adminLogs) ||
        (parsed.learningStates !== undefined && !Array.isArray(parsed.learningStates))) {
      throw new Error('The local database structure is invalid.');
    }
    cache = {
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      adminLogs: Array.isArray(parsed.adminLogs) ? parsed.adminLogs : [],
      learningStates: Array.isArray(parsed.learningStates) ? parsed.learningStates : [],
    };
  } catch (error) {
    cache = null;
    throw new Error(`Local data file could not be read. Restore a valid backup; ChemWiz has not reset it. ${error.message}`);
  }

  return cache;
}

function persist(next = cache) {
  ensureDir();
  const temporary = `${DATA_FILE}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, JSON.stringify(next || emptyStore(), null, 2), { mode: 0o600 });
    fs.renameSync(temporary, DATA_FILE);
    cache = next;
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function makeId() {
  return crypto.randomUUID().replaceAll('-', '').slice(0, 24);
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeUser(raw = {}) {
  const createdAt = raw.createdAt || nowIso();
  return {
    _id: raw._id || makeId(),
    name: raw.name || 'ChemWiz User',
    email: String(raw.email || '').trim().toLowerCase(),
    password: raw.password || '',
    role: raw.role || 'student',
    level: raw.level || 'A-Level Chemistry',
    subscriptionTier: raw.subscriptionTier || 'free',
    subscriptionStatus: raw.subscriptionStatus || 'active',
    subscriptionExpiresAt: raw.subscriptionExpiresAt || null,
    trialStartedAt: raw.trialStartedAt || createdAt,
    tutorUsage: raw.tutorUsage || { day: '', count: 0 },
    accountStatus: raw.accountStatus || 'active',
    createdAt,
    updatedAt: raw.updatedAt || createdAt,
  };
}

function matchValue(actual, expected) {
  if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
    if ('$regex' in expected) {
      const flags = String(expected.$options || '').replace(/[^gimsuy]/g, '');
      return new RegExp(expected.$regex, flags).test(String(actual ?? ''));
    }
  }

  return String(actual ?? '') === String(expected ?? '');
}

function matchesFilter(doc, filter = {}) {
  for (const [key, expected] of Object.entries(filter || {})) {
    if (key === '$or') {
      if (!Array.isArray(expected) || !expected.some((part) => matchesFilter(doc, part))) {
        return false;
      }
      continue;
    }

    if (!matchValue(doc[key], expected)) return false;
  }

  return true;
}

class LocalUserDocument {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const store = loadStore();
    const index = store.users.findIndex((user) => String(user._id) === String(this._id));
    const existing = index >= 0 ? store.users[index] : {};

    const merged = normalizeUser({
      ...existing,
      ...this,
      password: this.password || existing.password || '',
      updatedAt: nowIso(),
    });

    if (index >= 0) store.users[index] = merged;
    else store.users.push(merged);

    Object.assign(this, merged);
    persist();
    return this;
  }

  toJSON() {
    return { ...this };
  }
}

function projectUser(data, selectSpec) {
  if (!data) return null;
  const projected = { ...data };

  if (typeof selectSpec === 'string' && selectSpec.includes('-password')) {
    delete projected.password;
  }

  return new LocalUserDocument(projected);
}

function sortArray(items, sortSpec) {
  if (!sortSpec || typeof sortSpec !== 'object') return items;
  const [key, direction] = Object.entries(sortSpec)[0] || [];
  if (!key) return items;

  const dir = Number(direction) < 0 ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a[key] ?? '';
    const bv = b[key] ?? '';
    if (av === bv) return 0;
    return av > bv ? dir : -dir;
  });
}

class LocalQuery {
  constructor(executor, kind = 'user') {
    this.executor = executor;
    this.kind = kind;
    this.selectSpec = null;
    this.sortSpec = null;
    this.skipCount = 0;
    this.limitCount = null;
    this.populateFields = [];
  }

  select(spec) {
    this.selectSpec = spec;
    return this;
  }

  sort(spec) {
    this.sortSpec = spec;
    return this;
  }

  skip(count) {
    this.skipCount = Math.max(Number(count) || 0, 0);
    return this;
  }

  limit(count) {
    this.limitCount = Math.max(Number(count) || 0, 0);
    return this;
  }

  populate(field, fields = '') {
    this.populateFields.push({ field, fields });
    return this;
  }

  async exec() {
    let value = await this.executor();

    if (Array.isArray(value)) {
      value = sortArray(value, this.sortSpec);
      if (this.skipCount) value = value.slice(this.skipCount);
      if (this.limitCount !== null) value = value.slice(0, this.limitCount);
    }

    if (this.kind === 'user') {
      if (Array.isArray(value)) return value.map((item) => projectUser(item, this.selectSpec));
      return projectUser(value, this.selectSpec);
    }

    if (this.kind === 'log') {
      const store = loadStore();
      const populateLog = (log) => {
        const next = { ...log };

        for (const { field } of this.populateFields) {
          if (!['admin', 'targetUser'].includes(field)) continue;
          const id = next[field];
          if (!id) {
            next[field] = null;
            continue;
          }

          const user = store.users.find((item) => String(item._id) === String(id));
          next[field] = user
            ? { _id: user._id, name: user.name, email: user.email, role: user.role }
            : null;
        }

        return next;
      };

      if (Array.isArray(value)) return value.map(populateLog);
      return value ? populateLog(value) : null;
    }

    return value;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

const User = {
  findOne(filter = {}) {
    return new LocalQuery(() => loadStore().users.find((user) => matchesFilter(user, filter)) || null);
  },

  findById(id) {
    return new LocalQuery(() => loadStore().users.find((user) => String(user._id) === String(id)) || null);
  },

  find(filter = {}) {
    return new LocalQuery(() => loadStore().users.filter((user) => matchesFilter(user, filter)));
  },

  async countDocuments(filter = {}) {
    return loadStore().users.filter((user) => matchesFilter(user, filter)).length;
  },

  async create(payload) {
    const store = loadStore();
    const candidate = normalizeUser(payload);

    const duplicate = store.users.find(
      (user) => String(user.email).toLowerCase() === String(candidate.email).toLowerCase()
    );

    if (duplicate) {
      const error = new Error('Duplicate email');
      error.code = 11000;
      throw error;
    }

    store.users.push(candidate);
    persist();
    return new LocalUserDocument(candidate);
  },

  findByIdAndUpdate(id, update = {}, options = {}) {
    return new LocalQuery(() => {
      const store = loadStore();
      const index = store.users.findIndex((user) => String(user._id) === String(id));
      if (index < 0) return null;

      const before = { ...store.users[index] };
      const next = normalizeUser({ ...before, ...update, _id: before._id, createdAt: before.createdAt, updatedAt: nowIso() });
      store.users[index] = next;
      persist();
      return options.new === false ? before : next;
    });
  },
};

const AdminLog = {
  async create(payload) {
    const store = loadStore();
    const now = nowIso();
    const log = {
      _id: makeId(),
      admin: payload.admin,
      targetUser: payload.targetUser || null,
      action: payload.action,
      details: payload.details || {},
      createdAt: now,
      updatedAt: now,
    };

    store.adminLogs.push(log);
    persist();
    return log;
  },

  find(filter = {}) {
    return new LocalQuery(
      () => loadStore().adminLogs.filter((log) => matchesFilter(log, filter)),
      'log'
    );
  },
};

async function initializeLocalStore() {
  const store = loadStore();
  let changed = false;

  const adminEmail = String(process.env.LOCAL_ADMIN_EMAIL || 'admin@chemwiz.local')
    .trim()
    .toLowerCase();
  const adminPassword = process.env.LOCAL_ADMIN_PASSWORD || 'ChemWiz123!';

  if (!store.users.some((user) => user.role === 'admin')) {
    if (process.env.NODE_ENV === 'production' && (!process.env.LOCAL_ADMIN_PASSWORD || adminPassword === 'ChemWiz123!')) {
      throw new Error('Set a private LOCAL_ADMIN_PASSWORD before initializing local data in production.');
    }
    const now = nowIso();
    store.users.push(
      normalizeUser({
        name: 'ChemWiz Local Admin',
        email: adminEmail,
        password: bcrypt.hashSync(adminPassword, 10),
        role: 'admin',
        subscriptionTier: 'admin',
        subscriptionStatus: 'active',
        accountStatus: 'active',
        createdAt: now,
        updatedAt: now,
      })
    );
    changed = true;
  }

  const studentEmail = String(process.env.LOCAL_STUDENT_EMAIL || 'student@chemwiz.local')
    .trim()
    .toLowerCase();
  const studentPassword = process.env.LOCAL_STUDENT_PASSWORD || 'ChemWiz123!';

  if (process.env.NODE_ENV !== 'production' && !store.users.some((user) => user.email === studentEmail)) {
    const now = nowIso();
    store.users.push(
      normalizeUser({
        name: 'ChemWiz Local Student',
        email: studentEmail,
        password: bcrypt.hashSync(studentPassword, 10),
        role: 'student',
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        accountStatus: 'active',
        createdAt: now,
        updatedAt: now,
      })
    );
    changed = true;
  }

  if (changed) persist();
  return { file: DATA_FILE, users: store.users.length };
}

function resetLocalStore() {
  cache = emptyStore();
  persist();
}

const LearningState = {
  async get(userId) {
    const doc = loadStore().learningStates.find((item) => item.userId === String(userId));
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  },
  async compareAndSet(userId, revision, state) {
    const store = loadStore();
    const previous = store.learningStates.find((item) => item.userId === String(userId));
    if ((previous?.revision || 0) !== revision) return null;
    const document = { userId: String(userId), revision: revision + 1, state, updatedAt: nowIso() };
    const next = { ...store, learningStates: [...store.learningStates.filter((item) => item.userId !== String(userId)), document] };
    persist(next);
    return JSON.parse(JSON.stringify(document));
  },
};

module.exports = {
  User,
  AdminLog,
  LearningState,
  initializeLocalStore,
  resetLocalStore,
  DATA_FILE,
};
