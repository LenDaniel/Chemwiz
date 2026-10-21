const crypto = require('node:crypto');
const store = require('./governanceStore');
const { normalizeImage, MAX_BYTES, MAX_PIXELS, MAX_EDGE } = require('./imageNormalization');
const MAX_STORAGE = 32 * 1024 * 1024, MAX_FILES = 200, MAX_ATTACHMENTS = 6, MAX_LESSON_BYTES = 4 * 1024 * 1024;
const fail = (message, statusCode = 400, code = 'CONTENT_MEDIA_INVALID') => { throw Object.assign(new Error(message), { statusCode, code }); };
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const text = (value, maximum) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';
const validId = id => /^[a-f0-9]{24}$/.test(String(id));
const metadata = state => state.governance.filter(doc => doc.kind === 'content-media');
const find = (state, id) => metadata(state).find(doc => doc.key === 'media:' + id);
function touchStorage(state, now) {
  let head = state.governance.find(doc => doc.key === 'media-storage');
  if (!head) { head = { key: 'media-storage', kind: 'content-media-budget', ownerId: '', schoolId: '', revision: 0, data: {}, createdAt: new Date(now).toISOString() }; state.governance.push(head); }
  head.revision++; head.updatedAt = new Date(now).toISOString(); head.data = { touchedAt: head.updatedAt };
}
function reviewFields(data) {
  return Object.fromEntries(['title','altText','caption','creator','licenseName','sourceURL','licenseURL','attribution','permissionReference','validUntil','commercialUseAllowed','offlineRedistributionAllowed','platforms','fileHash','mime','width','height','byteLength','normalization','clearanceGeneration'].map(key => [key, data[key]]));
}
function canUse(data, now = Date.now()) {
  return Boolean(data && !data.recycleBin && data.status === 'cleared' && data.normalization === 'decoded-and-reencoded-v1' && data.altText && data.reviewHash === hash(reviewFields(data)) && data.commercialUseAllowed && data.platforms?.includes('web') && (!data.validUntil || Number.isFinite(Date.parse(data.validUntil)) && now < Date.parse(data.validUntil) + 86400000));
}
function format(doc) { return { id: doc.key.slice(6), revision: doc.revision, ...doc.data, eligible: canUse(doc.data) }; }
function publicMetadata(doc) {
  const data = doc.data;
  return { id: doc.key.slice(6), version: doc.revision, ...Object.fromEntries(['title','altText','caption','creator','licenseName','sourceURL','licenseURL','attribution','validUntil','mime','width','height','byteLength'].map(key => [key, data[key]])) };
}
function link(doc) { return { id: doc.key.slice(6), fileHash: doc.data.fileHash, generation: doc.data.clearanceGeneration, reviewHash: doc.data.reviewHash || null }; }
function linksForDraft(state, ids) {
  if (!Array.isArray(ids) || ids.length > MAX_ATTACHMENTS || new Set(ids).size !== ids.length || ids.some(id => !validId(id))) fail('Choose up to six different images from the media library.');
  const docs = ids.map(id => { const doc = find(state, id); if (!doc || doc.data.recycleBin) fail('An attached image is unavailable. Refresh your selection.', 409); return doc; });
  if (docs.reduce((sum, doc) => sum + doc.data.byteLength, 0) > MAX_LESSON_BYTES) fail('Attached images must total no more than 4 MiB per lesson.');
  return docs.map(link);
}
function validLinks(links, docs, now = Date.now()) {
  if (links === undefined) return true; // Preserve reviewed text-only publications from v1.8.
  return Array.isArray(links) && links.length <= MAX_ATTACHMENTS && new Set(links.map(item => item.id)).size === links.length && links.every(item => {
    const doc = docs.find(doc => doc.key === 'media:' + item.id && doc.kind === 'content-media');
    return doc && canUse(doc.data, now) && hash(link(doc)) === hash(item);
  });
}
function references(state, mediaId) {
  return new Set(state.governance.filter(doc => (doc.kind === 'content-draft' ? doc.data.mediaLinks : doc.kind === 'content-version' ? doc.data.snapshot?.mediaLinks : [])?.some(item => item.id === mediaId)).map(doc => doc.kind === 'content-draft' ? doc.key.slice(8) : doc.data.contentId)).size;
}
function audit(state, actor, action, mediaId, now) { state.adminLogs.push({ _id: store.id(), admin: String(actor._id), targetUser: null, action, details: { mediaId }, createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() }); }
function transition(state, action, id, actor, body, now) {
  const at = new Date(now).toISOString(), previous = find(state, id);
  if (action === 'upload-media') {
    if (previous || state.governance.some(doc => doc.key === 'media-file:' + id)) fail('Image identifier already exists.', 409);
    // Upload bytes were normalized in-process before entering the transaction. Never accept these fields from JSON routes.
    const normalized = body.normalized;
    if (!normalized || !Buffer.isBuffer(normalized.bytes)) fail('Choose an image file.');
    const rows = metadata(state);
    if (rows.length >= MAX_FILES || rows.reduce((sum, doc) => sum + doc.data.byteLength, 0) + normalized.byteLength > MAX_STORAGE) fail('The media library storage limit is reached. Eligible, unreferenced recycle-bin images can be purged to free space.', 409, 'CONTENT_MEDIA_QUOTA');
    const { bytes, ...file } = normalized;
    const data = { ...file, title: text(body.filename, 200).replace(/[\x00-\x1f\x7f]/g, '') || 'Untitled image', altText: '', caption: '', creator: '', licenseName: '', sourceURL: '', licenseURL: '', attribution: '', permissionReference: '', validUntil: '', commercialUseAllowed: false, offlineRedistributionAllowed: false, platforms: ['web'], status: 'draft', clearanceGeneration: 1, createdBy: String(actor._id), updatedBy: String(actor._id), updatedAt: at, recycleBin: null };
    state.governance.push({ key: 'media:' + id, kind: 'content-media', ownerId: '', schoolId: '', revision: 1, createdAt: at, updatedAt: at, data }, { key: 'media-file:' + id, kind: 'content-media-file', ownerId: '', schoolId: '', revision: 1, createdAt: at, updatedAt: at, data: { base64: bytes.toString('base64'), fileHash: file.fileHash } });
    touchStorage(state, now); audit(state, actor, 'CONTENT_MEDIA_UPLOADED', id, now);
    return { success: true, media: format(find(state, id)), message: 'Image uploaded privately. Complete its image and rights reviews before publication.' };
  }
  if (!previous) fail('Image not found.', 404);
  if (body.revision !== previous.revision) fail('This image changed. Refresh before continuing.', 409, 'CONTENT_CONFLICT');
  if (action === 'update-media') {
    if (previous.data.recycleBin) fail('Restore this image before editing.', 409);
    const altText = text(body.altText, 600), caption = text(body.caption, 1000);
    const common = require('./adminRecords.service').draftData({ ...body, body: previous.data.fileHash, assetId: '', topicId: '', audience: 'free' }, actor, now, previous.data);
    if (common.status === 'cleared' && (!altText || !caption || body.confirmImageReview !== true)) fail('Add alternative text and a caption, then confirm the image, chemistry and accessibility review.');
    const { title, creator, licenseName, sourceURL, licenseURL, attribution, permissionReference, validUntil, commercialUseAllowed, offlineRedistributionAllowed, platforms, status, reviewedBy, reviewedAt } = common;
    previous.data = { ...previous.data, title, creator, licenseName, sourceURL, licenseURL, attribution, permissionReference, validUntil, commercialUseAllowed, offlineRedistributionAllowed, platforms, status, reviewedBy, reviewedAt, altText, caption, updatedAt: at, updatedBy: String(actor._id), clearanceGeneration: previous.data.clearanceGeneration + 1 };
    delete previous.data.reviewHash;
    if (status === 'cleared') previous.data.reviewHash = hash(reviewFields(previous.data));
  } else {
    if (body.confirmation !== previous.data.title) fail('Type the exact image title to confirm.');
    if (action === 'trash-media') {
      if (previous.data.recycleBin) fail('This image is already in the recycle bin.', 409);
      const reason = text(body.reason, 400); if (reason.length < 8) fail('Record a deletion reason of at least eight characters.');
      previous.data.recycleBin = { deletedAt: at, purgeEligibleAt: new Date(now + 90 * 86400000).toISOString(), deletedBy: String(actor._id), reason, retentionDays: 90 };
    } else {
      if (!previous.data.recycleBin) fail('This image is not in the recycle bin.', 404);
      if (action === 'restore-media') previous.data.recycleBin = null;
      else if (action === 'purge-media') {
        const bin = previous.data.recycleBin, deleted = Date.parse(bin.deletedAt), due = Date.parse(bin.purgeEligibleAt);
        if (!Number.isFinite(deleted) || !Number.isFinite(due) || now < Math.max(due, deleted + 90 * 86400000)) fail('Permanent deletion is locked for at least 90 days.', 409, 'RECYCLE_RETENTION_ACTIVE');
        if (text(body.reason, 400).length < 8) fail('Record a permanent deletion reason of at least eight characters.');
        if (references(state, id)) fail('Retained material drafts or versions reference this image. Permanently delete those materials first.', 409, 'CONTENT_MEDIA_REFERENCE_HOLD');
        state.governance = state.governance.filter(doc => !['media:' + id, 'media-file:' + id].includes(doc.key));
        state.adminLogs = state.adminLogs.map(log => log.details?.mediaId === id ? { ...log, details: { redactedAt: at, reason: 'Permanent image erasure' } } : log);
        touchStorage(state, now);
        state.adminLogs.push({ _id: store.id(), admin: String(actor._id), targetUser: null, action: 'RECYCLE_ENTRY_PERMANENTLY_DELETED', details: { type: 'media', completedAt: at }, createdAt: at, updatedAt: at });
        return { success: true, message: 'Image bytes and their stored metadata permanently deleted.' };
      } else fail('Unknown image action.');
    }
    previous.data.status = 'draft'; previous.data.clearanceGeneration++; delete previous.data.reviewHash; delete previous.data.reviewedBy; delete previous.data.reviewedAt;
  }
  previous.revision++; previous.updatedAt = at;
  audit(state, actor, 'CONTENT_MEDIA_' + action.split('-')[0].toUpperCase(), id, now);
  return { success: true, media: format(previous), message: action === 'update-media' ? 'Image review saved. Re-save, review and publish lessons that use it.' : action === 'trash-media' ? 'Image recycled for at least 90 days. Linked lessons are now unavailable.' : 'Image restored as a draft. Review it and re-save linked lessons before publishing.' };
}
function mutationFilter(action, id) {
  return { $or: [{ kind: 'content-media' }, { key: 'media-storage' }, ...(action === 'purge-media' ? [{ key: 'media-file:' + id }, { kind: 'content-draft', 'data.mediaLinks.id': id }, { kind: 'content-version', 'data.snapshot.mediaLinks.id': id }] : [])] };
}
async function upload(actor, bytes, mime, filename) { return require('./adminRecords.service').mutate('upload-media', store.id(), actor, { normalized: normalizeImage(bytes, mime), filename }); }
async function list(query = {}) {
  const docs = await store.list({ kind: 'content-media' }), search = text(query.search, 200).toLowerCase();
  const rows = docs.filter(doc => !doc.data.recycleBin && (!search || (doc.data.title + ' ' + doc.data.creator).toLowerCase().includes(search))).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const page = Math.max(1, Math.min(100000, Math.floor(Number(query.page) || 1))), limit = Math.max(1, Math.min(50, Math.floor(Number(query.limit) || 20)));
  return { items: rows.slice((page-1)*limit, page*limit).map(format), pagination: { page, limit, total: rows.length, pages: Math.max(1, Math.ceil(rows.length/limit)) }, storage: { bytes: docs.reduce((sum,doc) => sum + doc.data.byteLength, 0), files: docs.length, maxBytes: MAX_STORAGE, maxFiles: MAX_FILES, maxFileBytes: MAX_BYTES, maxPixels: MAX_PIXELS, maxEdge: MAX_EDGE }, notice: 'Images remain private until reviewed and attached to a published lesson. Recycled images count toward storage until explicitly purged.' };
}
async function adminImages(links) {
  const docs = await Promise.all((links || []).map(item => store.get('media:' + item.id)));
  return docs.filter(Boolean).map(doc => ({ ...format(doc), version: doc.revision, matchesSavedReview: (links || []).some(item => item.id === doc.key.slice(6) && hash(item) === hash(link(doc))) }));
}
async function resolveLinks(links) {
  const docs = await Promise.all((links || []).map(item => store.get('media:' + item.id)));
  if (!validLinks(links, docs.filter(Boolean))) return null;
  return docs.map(publicMetadata);
}
async function file(id, expectedVersion) {
  if (!validId(id)) fail('Image not available.', 404);
  const [doc, stored] = await Promise.all([store.get('media:' + id), store.get('media-file:' + id)]);
  if (!doc || doc.kind !== 'content-media' || doc.data.recycleBin || !stored || stored.kind !== 'content-media-file') fail('Image not available.', 404);
  if (expectedVersion !== undefined && (doc.revision !== expectedVersion || !canUse(doc.data))) fail('Image review changed. Refresh this lesson.', 404, 'CONTENT_NOT_AVAILABLE');
  const bytes = Buffer.from(stored.data.base64, 'base64');
  if (bytes.length !== doc.data.byteLength || crypto.createHash('sha256').update(bytes).digest('hex') !== doc.data.fileHash || stored.data.fileHash !== doc.data.fileHash) fail('Image integrity check failed.', 409);
  return { bytes, mime: doc.data.mime };
}
function sendFile(res, result) { res.set({ 'Content-Type': result.mime, 'Content-Length': result.bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline; filename="illustration.' + (result.mime === 'image/png' ? 'png' : 'jpg') + '"' }); res.send(result.bytes); }
async function publishedFile(user, contentId, mediaId) {
  const { material } = await require('./contentEditorial.service').publishedMaterial(user, contentId);
  const image = material.images.find(item => item.id === mediaId);
  if (!image) fail('Image not available for this lesson.', 404, 'CONTENT_NOT_AVAILABLE');
  return file(mediaId, image.version);
}
module.exports = { transition, mutationFilter, upload, list, file, sendFile, publishedFile, linksForDraft, validLinks, resolveLinks, adminImages, references, touchStorage, canUse, MAX_STORAGE, MAX_FILES };
