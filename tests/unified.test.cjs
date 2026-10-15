const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-integrated-'));
process.env.LOCAL_DATA_FILE = path.join(temp, 'local.json');
process.env.DATA_MODE = 'local';
process.env.JWT_SECRET = 'unified-tests-unique-secret-32-characters';
process.env.NODE_ENV = 'test';
process.env.LOCAL_ADMIN_EMAIL = 'admin@unified.test';
process.env.LOCAL_ADMIN_PASSWORD = 'Admin-test-password!2026';
process.env.LOCAL_STUDENT_EMAIL = 'student@unified.test';
process.env.LOCAL_STUDENT_PASSWORD = 'Student-test-password!2026';
const { createApplication } = require('../server');
const { defaultState } = require('../backend/src/services/learningState.service');
let instance, base, admin, first, second;
async function request(route, token, method = 'GET', body, extra = {}) {
  const response = await fetch(`${base}${route}`, {
    method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...(extra.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  const text = await response.text();
  return { status: response.status, headers: response.headers, text, data: response.headers.get('content-type')?.includes('application/json') ? JSON.parse(text) : null };
}
test.before(async () => {
  instance = await createApplication();
  await new Promise((resolve) => instance.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${instance.server.address().port}`;
  admin = (await request('/api/auth/login', null, 'POST', { email: process.env.LOCAL_ADMIN_EMAIL, password: process.env.LOCAL_ADMIN_PASSWORD })).data;
  first = (await request('/api/auth/register', null, 'POST', { name: 'First', email: 'first@unified.test', password: 'Learner-password!2026', role: 'admin' })).data;
  second = (await request('/api/auth/register', null, 'POST', { name: 'Second', email: 'second@unified.test', password: 'Learner-password!2026' })).data;
});
test.after(async () => {
  if (instance?.server.listening) await new Promise((resolve) => instance.server.close(resolve));
  fs.rmSync(temp, { recursive: true, force: true });
});

test('one production server serves home, both workspaces and API readiness', async () => {
  for (const route of ['/', '/student/', '/admin/', '/student/revision', '/admin/users']) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(response.text, /ChemWiz/);
    assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
  }
  for (const route of ['/student', '/admin']) {
    const response = await request(route);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), `${route}/`);
  }
  assert.equal((await request('/api/ready')).data.success, true);
  assert.equal((await request('/api/health')).data.service, 'chemwiz-unified');
});
test('missing API routes and assets never become a workspace HTML page; private files are not served', async () => {
  for (const route of ['/api/does-not-exist', '/assets/missing.js', '/student/missing.js', '/.env', '/data/local-db.json', '/backend/src/models/User.js']) {
    const response = await request(route);
    assert.equal(response.status, 404, route);
    assert.equal(response.data.success, false);
  }
  assert.equal((await request('/api/progress/me', null, 'GET', null, { headers: { Origin: base } })).status, 401);
  assert.equal((await request('/api/health', null, 'GET', null, { headers: { Origin: 'https://untrusted.test' } })).status, 403);
});
test('only admin accounts reach administration; public registration cannot set a role', async () => {
  assert.equal(first.user.role, 'student');
  assert.equal((await request('/api/admin/users')).status, 401);
  assert.equal((await request('/api/admin/users', first.token)).status, 403);
  const listing = await request('/api/admin/users', admin.token);
  assert.equal(listing.status, 200);
  assert.ok(listing.data.users.length >= 4);
  assert.ok(listing.data.users.every((user) => user.password === undefined));
  assert.equal((await request('/api/admin/users/' + first.user.id + '/subscription', admin.token, 'PATCH', { subscriptionTier: 'premium' })).status, 200);
  assert.equal((await request('/api/auth/me', first.token)).data.user.access.isPremium, true);
});
test('learner settings, progress, streak and mistakes save to the authenticated account and survive a new process', async () => {
  const state = defaultState();
  state.settings.theme = 'light';
  state.progress.atomic = { chaptersRead: ['at1'], quizzesTaken: 1, percent: 45, lastScore: 90 };
  state.streak = { current: 2, longest: 5, lastDate: 'Mon Oct 12 2026' };
  state.mistakes = [{ q: 'Which particle is negative?', opts: ['Proton', 'Electron'], ans: 1, picked: 0, hint: 'Electrons are negative.', topicId: 'atomic', t: Date.now() }];
  const saved = await request('/api/progress/me', first.token, 'PUT', { revision: 0, state, userId: second.user.id });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.revision, 1);
  assert.deepEqual((await request('/api/progress/me', first.token)).data.state, state);
  assert.deepEqual((await request('/api/progress/me', second.token)).data.state, defaultState());
  const root = path.resolve(__dirname, '..');
  const restarted = spawnSync(process.execPath, ['-e', "require('./backend/src/services/learningState.service').getState(process.env.TEST_OWNER_ID).then(s=>process.stdout.write(JSON.stringify(s)))"], {
    cwd: root, env: { ...process.env, TEST_OWNER_ID: first.user.id }, encoding: 'utf8',
  });
  assert.equal(restarted.status, 0, restarted.stderr);
  assert.deepEqual(JSON.parse(restarted.stdout).state, state);
  const disk = JSON.parse(fs.readFileSync(process.env.LOCAL_DATA_FILE, 'utf8'));
  assert.equal(disk.learningStates.length, 1);
  assert.ok(!fs.readdirSync(temp).some((file) => file.endsWith('.tmp')));
});
test('stale saves conflict instead of replacing newer work; account changes preserve learning records', async () => {
  const conflict = await request('/api/progress/me', first.token, 'PUT', { revision: 0, state: defaultState() });
  assert.equal(conflict.status, 409);
  assert.equal(conflict.data.code, 'PROGRESS_CONFLICT');
  assert.equal(conflict.data.state.settings.theme, 'light');
  await request('/api/admin/users/' + first.user.id + '/status', admin.token, 'PATCH', { accountStatus: 'suspended' });
  assert.equal((await request('/api/progress/me', first.token)).status, 403);
  await request('/api/admin/users/' + first.user.id + '/status', admin.token, 'PATCH', { accountStatus: 'active' });
  assert.equal((await request('/api/progress/me', first.token)).data.state.settings.theme, 'light');
});
test('learning data and imported backups are validated before saving', async () => {
  const invalid = defaultState();
  invalid.progress.atomic = { chaptersRead: [], percent: 101 };
  assert.equal((await request('/api/progress/me', second.token, 'PUT', { revision: 0, state: invalid })).status, 400);
  assert.equal((await request('/api/progress/me', second.token)).data.revision, 0);
  assert.equal((await request('/api/progress/validate', second.token, 'POST', { state: defaultState() })).status, 200);
  assert.equal((await request('/api/progress/validate', null, 'POST', { state: defaultState() })).status, 401);
  const hostile = JSON.parse(JSON.stringify(defaultState()));
  hostile.progress = JSON.parse('{"__proto__":{"chaptersRead":[],"percent":0,"quizzesTaken":0}}');
  assert.equal((await request('/api/progress/validate', second.token, 'POST', { state: hostile })).status, 400);
});
test('a corrupt local database is preserved and startup fails with a useful message', () => {
  const corrupted = path.join(temp, 'corrupted.json');
  fs.writeFileSync(corrupted, '{broken-json');
  const result = spawnSync(process.execPath, ['-e', "require('./backend/src/data/localModels').initializeLocalStore().catch(e=>{console.error(e.message);process.exitCode=1;})"], {
    cwd: path.resolve(__dirname, '..'), env: { ...process.env, LOCAL_DATA_FILE: corrupted }, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /has not reset it/);
  assert.equal(fs.readFileSync(corrupted, 'utf8'), '{broken-json');
});
test('migration copies account IDs, hashes, subscriptions and logs without overwriting existing data', () => {
  const { importLocal } = require('../scripts/import-local.cjs');
  const target = path.join(temp, 'imported.json');
  const result = importLocal(process.env.LOCAL_DATA_FILE, target);
  assert.ok(result.users >= 4);
  assert.equal(fs.readFileSync(target, 'utf8'), fs.readFileSync(process.env.LOCAL_DATA_FILE, 'utf8'));
  assert.throws(() => importLocal(process.env.LOCAL_DATA_FILE, target), /destination already/);
});
test('configuration import preserves backend settings, normalizes aliases and retains the new web address', () => {
  const { importConfig } = require('../scripts/import-config.cjs');
  const previous = path.join(temp, 'old.env');
  const target = path.join(temp, 'new.env');
  fs.writeFileSync(previous, 'JWT_SECRET=previous-secret-that-is-never-printed\nAI_API_KEY=previous-provider-key\nMONGO_URI=mongodb://example/chemwiz\nFRONTEND_URL=http://old-student.test\nPORT=5001\n');
  fs.writeFileSync(target, 'JWT_SECRET=current-secret\nOPENAI_API_KEY=\nMONGODB_URI=\nAPP_URL=http://localhost:5000\nPORT=5000\n');
  assert.equal(importConfig(previous, target), 3);
  const result = require('dotenv').parse(fs.readFileSync(target));
  assert.equal(result.JWT_SECRET, 'previous-secret-that-is-never-printed');
  assert.equal(result.OPENAI_API_KEY, 'previous-provider-key');
  assert.equal(result.MONGODB_URI, 'mongodb://example/chemwiz');
  assert.equal(result.APP_URL, 'http://localhost:5000');
  assert.equal(result.PORT, '5000');
  assert.equal(result.FRONTEND_URL, undefined);
  assert.ok(fs.readdirSync(temp).some((file) => file.startsWith('new.env.backup-')));
});
