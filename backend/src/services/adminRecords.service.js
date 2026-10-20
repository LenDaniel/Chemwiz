const crypto = require('node:crypto');
const { User } = require('../data/modelProvider');
const { getDataMode } = require('../config/runtime');
const { modelForRuntime } = require('../data/workerMongoContext');
const store = require('./governanceStore');
const { guardianHeadKey } = require('./privacy.service');
const RETENTION_DAYS = 90;
const DAY = 86400000;
const fail = (message, statusCode = 400, code = 'ADMIN_RECORD_INVALID') => { throw Object.assign(new Error(message), { statusCode, code }); };
const copy = value => JSON.parse(JSON.stringify(value));
const id = value => { if (!/^[a-f0-9]{24}$/.test(String(value))) fail('Invalid record identifier.'); return String(value); };
const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const iso = now => new Date(now).toISOString();
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const reason = body => { const value = text(body.reason, 400); if (value.length < 8) fail('Record a deletion reason of at least eight characters.'); return value; };
const authorize = actor => { if (actor?.role !== 'admin' || actor.accountStatus !== 'active') fail('An active platform administrator is required.', 403); };
const stamp = (actor, body, now) => ({ deletedAt: iso(now), purgeEligibleAt: iso(now + RETENTION_DAYS * DAY), deletedBy: String(actor._id), reason: reason(body), retentionDays: RETENTION_DAYS });
function confirm(body, expected) { if (body.confirmation !== expected) fail('The confirmation does not match. Nothing was deleted.'); }
function due(bin, now) {
  const deleted = Date.parse(bin?.deletedAt), eligible = Date.parse(bin?.purgeEligibleAt);
  if (!Number.isFinite(deleted) || !Number.isFinite(eligible) || now < Math.max(eligible, deleted + RETENTION_DAYS * DAY)) fail('Permanent deletion is locked for at least 90 days after deletion.', 409, 'RECYCLE_RETENTION_ACTIVE');
}
function audit(state, actor, action, targetUser, details, now) {
  state.adminLogs.push({ _id: store.id(), admin: String(actor._id), targetUser: targetUser || null, action, details, createdAt: iso(now), updatedAt: iso(now) });
}
function accountAction(state, action, userId, actor, body, now) {
  const user = state.users.find(row => String(row._id) === userId);
  if (!user) fail('Account not found.', 404);
  if (user.role === 'admin' || userId === String(actor._id)) fail('Administrator accounts require a separate staff handover and cannot enter this recycle bin.', 409);
  confirm(body, user.email);
  if (action === 'trash-account') {
    if (user.recycleBin) fail('This account is already in the recycle bin.', 409);
    if (!['suspended', 'disabled'].includes(user.accountStatus)) fail('Suspend or disable the account before deleting it.', 409);
    if (user.privacy?.deletionApprovedAt) fail('Use the already approved privacy-erasure procedure for this account.', 409);
    user.recycleBin = { ...stamp(actor, body, now), previousStatus: user.accountStatus };
    user.accountStatus = 'disabled'; user.authVersion = (user.authVersion || 0) + 1; user.passwordReset = null;
    for (const doc of state.governance) {
      if (doc.kind === 'membership' && doc.ownerId === userId) { doc.data = { ...doc.data, status: 'revoked', sharing: false, revokedAt: iso(now), reason: 'Account moved to recycle bin' }; doc.revision++; doc.updatedAt = iso(now); }
      if (doc.kind === 'school' && doc.data.reservedUserIds?.includes(userId)) { doc.data.reservedUserIds = doc.data.reservedUserIds.filter(value => value !== userId); doc.revision++; doc.updatedAt = iso(now); }
    }
    audit(state, actor, 'ACCOUNT_RECYCLED', userId, { purgeEligibleAt: user.recycleBin.purgeEligibleAt }, now);
  } else {
    if (!user.recycleBin) fail('This account is not in the recycle bin.', 404);
    if (action === 'restore-account') {
      if (user.privacy?.deletionApprovedAt) fail('This account has an approved privacy-erasure request and cannot be restored here.', 409);
      user.accountStatus = user.recycleBin.previousStatus === 'suspended' ? 'suspended' : 'disabled';
      user.recycleBin = null; user.authVersion = (user.authVersion || 0) + 1; user.passwordReset = null;
      audit(state, actor, 'ACCOUNT_RESTORED', userId, { accountStatus: user.accountStatus, schoolMemberships: 'Reassignment and fresh confirmation required' }, now);
    } else if (action === 'purge-account') {
      due(user.recycleBin, now);
      if (state.governance.some(doc => doc.kind === 'guardian' && doc.data.parentEmail === user.email && doc.data.userId !== userId)) fail('Guardian authority for another learner needs a retention review before permanent deletion.', 409, 'ACCOUNT_RETENTION_HOLD');
      state.users = state.users.filter(row => String(row._id) !== userId);
      state.learningStates = state.learningStates.filter(row => String(row.userId) !== userId);
      state.governance = state.governance.filter(doc => doc.ownerId !== userId && doc.key !== guardianHeadKey(user.email) && !(doc.kind === 'guardian' && doc.data.childEmail === user.email));
      state.adminLogs = state.adminLogs.map(log => String(log.targetUser) === userId || String(log.admin) === userId ? { ...log, admin: String(log.admin) === userId ? null : log.admin, targetUser: String(log.targetUser) === userId ? null : log.targetUser, details: { redactedAt: iso(now), reason: 'Permanent account erasure' } } : log);
      audit(state, actor, 'RECYCLE_ENTRY_PERMANENTLY_DELETED', null, { type: 'account', completedAt: iso(now) }, now);
      return { success: true, message: 'Account and linked application records permanently deleted.' };
    } else fail('Unknown account action.');
  }
  user.updatedAt = iso(now);
  return { success: true, message: action === 'trash-account' ? 'Account moved to the recycle bin for at least 90 days.' : 'Account restored to its previous suspended or inactive status. Reactivation is a separate action.', id: userId };
}
function safeURL(value) { const result = text(value, 1000); if (result) { let parsed; try { parsed = new URL(result); } catch { fail('Enter a full http or https source URL.'); } if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) fail('Only public http or https source links are supported.'); } return result; }
function draftData(body, actor, now, previous) {
  if (typeof body.body === 'string' && body.body.trim().length > 20000) fail('Draft text cannot exceed 20,000 characters. Split it into smaller drafts.');
  const validUntil = text(body.validUntil, 10);
  if (validUntil && (!/^\d{4}-\d\d-\d\d$/.test(validUntil) || !Number.isFinite(Date.parse(validUntil)) || new Date(validUntil).toISOString().slice(0,10) !== validUntil)) fail('Enter a valid permission expiry date.');
  const title = text(body.title, 200), content = text(body.body, 20000), creator = text(body.creator, 200), licenseName = text(body.licenseName, 200);
  if (!title || !content || !creator || !licenseName) fail('Complete the title, draft text, creator and license or ownership description.');
  const assetId = text(body.assetId, 200);
  const asset = assetId ? inventory().find(row => row.assetId === assetId) : null;
  if (assetId && !asset) fail('Choose an asset from the current content inventory.');
  if (!['draft', 'review', 'cleared'].includes(body.status)) fail('Choose draft, review or cleared.');
  const data = { title, body: content, creator, licenseName, assetId, assetHash: asset?.assetHash || null,
    validUntil, sourceURL: safeURL(body.sourceURL), licenseURL: safeURL(body.licenseURL), attribution: text(body.attribution, 1500), permissionReference: text(body.permissionReference, 400),
    commercialUseAllowed: body.commercialUseAllowed === true, offlineRedistributionAllowed: body.offlineRedistributionAllowed === true,
    platforms: [...new Set(Array.isArray(body.platforms) ? body.platforms.filter(value => ['web', 'android', 'windows'].includes(value)) : [])],
    status: body.status, createdBy: previous?.createdBy || String(actor._id), updatedBy: String(actor._id), updatedAt: iso(now), recycleBin: null };
  if (data.status === 'cleared') {
    if (validUntil && Date.parse(validUntil) + DAY <= now) fail('This permission has expired. Complete a new rights review before clearance.');
    if (body.confirmRightsReview !== true || !data.permissionReference || !data.attribution || !data.commercialUseAllowed || !data.platforms.length) fail('Record permission/ownership evidence, attribution, commercial/platform scope and confirm your rights review before clearance.');
    data.reviewedBy = String(actor._id); data.reviewedAt = iso(now); data.reviewHash = digest(reviewFields(data));
  }
  return data;
}
const reviewFields = data => ({ title: data.title, body: data.body, creator: data.creator, licenseName: data.licenseName, validUntil: data.validUntil, sourceURL: data.sourceURL, licenseURL: data.licenseURL, attribution: data.attribution, permissionReference: data.permissionReference, assetId: data.assetId, assetHash: data.assetHash, commercialUseAllowed: data.commercialUseAllowed, offlineRedistributionAllowed: data.offlineRedistributionAllowed, platforms: data.platforms });
function canRedistribute(data, platform, { offline = false, now = Date.now() } = {}) {
  return Boolean(data && !data.recycleBin && data.status === 'cleared' && data.reviewHash === digest(reviewFields(data)) && data.commercialUseAllowed && (!data.validUntil || Number.isFinite(Date.parse(data.validUntil)) && now < Date.parse(data.validUntil) + DAY) && Array.isArray(data.platforms) && data.platforms.includes(platform) && (!offline || data.offlineRedistributionAllowed) && (!data.assetId || inventory().some(row => row.assetId === data.assetId && row.assetHash === data.assetHash)));
}
function contentAction(state, action, draftId, actor, body, now) {
  const key = 'content:' + draftId, previous = state.governance.find(doc => doc.key === key);
  if (action === 'save-content' || action === 'update-content') {
    if (action === 'update-content' && !previous) fail('Draft not found. A purged draft cannot be restored by saving an old editor.', 404);
    if ((previous?.revision || 0) !== body.revision) fail('This draft changed. Refresh before saving.', 409, 'CONTENT_CONFLICT');
    if (previous?.data.recycleBin) fail('Restore the draft from the recycle bin before editing.', 409);
    const data = draftData(body, actor, now, previous?.data);
    const doc = { key, kind: 'content-draft', ownerId: '', schoolId: '', revision: (previous?.revision || 0) + 1, createdAt: previous?.createdAt || iso(now), updatedAt: iso(now), data };
    state.governance = [...state.governance.filter(row => row.key !== key), doc];
    audit(state, actor, 'CONTENT_DRAFT_SAVED', null, { contentId: draftId, revision: doc.revision, status: data.status }, now);
    return { success: true, draft: formatDraft(doc) };
  }
  if (!previous || previous.kind !== 'content-draft') fail('Draft not found.', 404);
  confirm(body, previous.data.title);
  if (body.revision !== previous.revision) fail('This draft changed. Refresh before continuing.', 409, 'CONTENT_CONFLICT');
  if (action === 'trash-content') {
    if (previous.data.recycleBin) fail('This draft is already in the recycle bin.', 409);
    previous.data.recycleBin = stamp(actor, body, now); previous.data.status = 'draft'; delete previous.data.reviewHash;
  } else {
    if (!previous.data.recycleBin) fail('This draft is not in the recycle bin.', 404);
    if (action === 'restore-content') { previous.data.recycleBin = null; previous.data.status = 'draft'; delete previous.data.reviewHash; }
    else if (action === 'purge-content') {
      due(previous.data.recycleBin, now);
      state.governance = state.governance.filter(doc => doc.key !== key);
      state.adminLogs = state.adminLogs.map(log => log.details?.contentId === draftId ? { ...log, details: { redactedAt: iso(now), reason: 'Permanent material erasure' } } : log);
      audit(state, actor, 'RECYCLE_ENTRY_PERMANENTLY_DELETED', null, { type: 'material', completedAt: iso(now) }, now);
      return { success: true, message: 'Draft material and its saved provenance permanently deleted.' };
    } else fail('Unknown material action.');
  }
  previous.revision++; previous.updatedAt = iso(now);
  audit(state, actor, action === 'trash-content' ? 'CONTENT_RECYCLED' : 'CONTENT_RESTORED', null, { contentId: draftId, revision: previous.revision }, now);
  return { success: true, message: action === 'trash-content' ? 'Draft moved to the recycle bin for at least 90 days.' : 'Material restored as a draft. Rights review is required again.' };
}
function transition(state, action, targetId, actor, body = {}, now = Date.now()) {
  authorize(actor); id(targetId);
  return action.endsWith('account') ? accountAction(state, action, targetId, actor, body, now) : contentAction(state, action, targetId, actor, body, now);
}
async function mutate(action, targetId, actor, body) {
  const now = Date.now(); authorize(actor); id(targetId);
  if (getDataMode() === 'local') return require('../data/localModels').atomicAdminMutation(state => transition(state, action, targetId, actor, body, now));
  const Governance = modelForRuntime(require('../models/Governance'));
  const LearningState = modelForRuntime(require('../models/LearningState'));
  const AdminLog = modelForRuntime(require('../models/AdminLog'));
  await Promise.all([User.init(), Governance.init(), LearningState.init(), AdminLog.init()]);
  const session = await User.db.startSession(); let result;
  try {
    await session.withTransaction(async () => {
      const account = action.endsWith('account');
      const user = account ? await User.findById(targetId).select('+passwordReset').session(session).lean() : null;
      const filter = account ? { $or: [{ ownerId: targetId }, { kind: 'guardian', 'data.childEmail': user?.email }, { kind: 'guardian', 'data.parentEmail': user?.email }, { key: guardianHeadKey(user?.email || '') }, { kind: 'school', 'data.reservedUserIds': targetId }] } : { key: 'content:' + targetId };
      const logs = action.startsWith('purge') ? await AdminLog.find(account ? { $or: [{ targetUser: targetId }, { admin: targetId }] } : { 'details.contentId': targetId }).session(session).lean() : [];
      const before = copy({ users: user ? [user] : [], governance: await Governance.find(filter).session(session).lean(), learningStates: [], adminLogs: logs });
      const next = copy(before); result = transition(next, action, targetId, actor, body, now);
      if (account && user) {
        if (next.users.length) {
          const saved = next.users[0];
          const updated = await User.updateOne({ _id: targetId }, { $set: { accountStatus: saved.accountStatus, authVersion: saved.authVersion, passwordReset: saved.passwordReset, recycleBin: saved.recycleBin, updatedAt: saved.updatedAt } }, { session });
          if (updated.matchedCount !== 1) fail('Account changed during the operation. Refresh and retry.',409);
        } else {
          await LearningState.deleteMany({ userId: targetId }).session(session);
          if ((await User.deleteOne({ _id: targetId }).session(session)).deletedCount !== 1) fail('Account changed during the operation. Refresh and retry.',409);
        }
      }
      for (const old of before.governance) {
        const saved = next.governance.find(doc => doc.key === old.key);
        if (!saved) { if ((await Governance.deleteOne({key:old.key,revision:old.revision}).session(session)).deletedCount !== 1) fail('Linked records changed. Refresh and retry.',409); }
        else if (JSON.stringify(saved) !== JSON.stringify(old)) {
          const updated = await Governance.updateOne({key:old.key,revision:old.revision},{$set:{data:saved.data,revision:saved.revision,updatedAt:saved.updatedAt || iso(now)}},{session});
          if (updated.matchedCount !== 1) fail('Linked records changed. Refresh and retry.',409);
        }
      }
      for (const added of next.governance.filter(doc => !before.governance.some(old => old.key === doc.key))) await Governance.create([added], { session });
      for (const log of next.adminLogs) {
        const old = before.adminLogs.find(row => row._id === log._id);
        if (!old) await AdminLog.create([log], { session });
        else if (JSON.stringify(log) !== JSON.stringify(old)) await AdminLog.replaceOne({ _id: log._id }, log, { session });
      }
    }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    return result;
  } finally { await session.endSession(); }
}
let inventoryCache;
function inventory() { return inventoryCache ||= require('../../../shared/content-inventory.json').assets; }
function pageRows(rows, query = {}) {
  const page = Math.max(1, Math.min(100000, Math.floor(Number(query.page) || 1))), limit = Math.max(1, Math.min(50, Math.floor(Number(query.limit) || 20)));
  return { items: rows.slice((page - 1) * limit, page * limit), pagination: { page, limit, total: rows.length, pages: Math.max(1, Math.ceil(rows.length / limit)) } };
}
const formatDraft = doc => ({ id: doc.key.slice(8), revision: doc.revision, ...doc.data, eligibility: { webOffline: canRedistribute(doc.data, 'web', { offline: true }), androidOffline: canRedistribute(doc.data, 'android', { offline: true }), windowsOffline: canRedistribute(doc.data, 'windows', { offline: true }) } });
async function drafts(query) { const search = text(query.search, 200).toLowerCase(); return pageRows((await store.list({ kind: 'content-draft' })).filter(doc => !doc.data.recycleBin && (!search || (doc.data.title + ' ' + doc.data.creator).toLowerCase().includes(search))).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(formatDraft), query); }
function sourceInventory(query) { const search = text(query.search, 200).toLowerCase(); return { ...pageRows(inventory().filter(row => !search || (row.title + ' ' + row.topicId + ' ' + row.assetId).toLowerCase().includes(search)), query), notice: 'Inventory entries identify existing source files and content hashes. Their provenance requires review; inventory does not grant redistribution permission.' }; }
async function recycleBin(query = {}) {
  const now = Date.now(), search = text(query.search, 200).toLowerCase(); const entries = [];
  for (const user of await User.find({ recycleBin: { $ne: null } }).select('-password')) if (user.recycleBin) entries.push({ entryId: 'account:' + user._id, targetId: String(user._id), type: 'account', title: user.name, confirmation: user.email, accountStatus: user.accountStatus, ...user.recycleBin });
  for (const doc of await store.list({ kind: 'content-draft' })) if (doc.data.recycleBin) entries.push({ entryId: 'material:' + doc.key.slice(8), targetId: doc.key.slice(8), revision: doc.revision, type: 'material', title: doc.data.title, confirmation: doc.data.title, ...doc.data.recycleBin });
  return { ...pageRows(entries.filter(row => (!query.type || row.type === query.type) && (!search || (row.title + ' ' + row.confirmation).toLowerCase().includes(search))).map(row => ({ ...row, canPurge: Number.isFinite(Date.parse(row.deletedAt)) && Number.isFinite(Date.parse(row.purgeEligibleAt)) && now >= Math.max(Date.parse(row.purgeEligibleAt), Date.parse(row.deletedAt) + RETENTION_DAYS * DAY) })).sort((a, b) => b.deletedAt.localeCompare(a.deletedAt)), query), retentionDays: RETENTION_DAYS };
}
function entryAction(action, entryId, actor, body) { const match = /^(account|material):([a-f0-9]{24})$/.exec(entryId); if (!match) fail('Invalid recycle-bin entry.'); return mutate(action + '-' + (match[1] === 'account' ? 'account' : 'content'), match[2], actor, body); }
module.exports = { RETENTION_DAYS, transition, mutate, recycleBin, drafts, sourceInventory, entryAction, canRedistribute };
