const crypto = require('node:crypto');
const store = require('./governanceStore');
const { hasActiveSubscription } = require('../middleware/access.middleware');
const fail = (message, statusCode = 400, code = 'CONTENT_PUBLICATION_INVALID') => { throw Object.assign(new Error(message), { statusCode, code }); };
const clone = value => JSON.parse(JSON.stringify(value));
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const validId = value => /^[a-f0-9]{24}$/.test(String(value));
const topics = () => new Set(require('../../../shared/content-inventory.json').assets.map(row => row.topicId));
const fields = ['title','body','creator','licenseName','sourceURL','licenseURL','attribution','permissionReference','validUntil','assetId','assetHash','commercialUseAllowed','offlineRedistributionAllowed','platforms','topicId','audience','mediaLinks','status','createdBy','updatedBy','updatedAt','reviewedBy','reviewedAt','reviewHash'];
function snapshot(data) { return clone(Object.fromEntries(fields.filter(key => data[key] !== undefined).map(key => [key, data[key]]))); }
const versionKey = (id, revision) => `content-version:${id}:${revision}`;
function recordVersion(state, doc, actor, now, event = 'saved', note = '') {
  const contentId = doc.key.slice(8), key = versionKey(contentId, doc.revision);
  if (state.governance.some(row => row.key === key)) return;
  const saved = snapshot(doc.data), at = new Date(now).toISOString();
  state.governance.push({ key, kind: 'content-version', ownerId: '', schoolId: '', revision: 1, createdAt: at, updatedAt: at,
    data: { contentId, contentRevision: doc.revision, event, note, recordedBy: String(actor._id), recordedAt: at, snapshot: saved, snapshotHash: hash(saved),
      ...(event === 'published' ? { chemistryReviewedBy: String(actor._id), chemistryReviewedAt: at, chemistryReviewHash: hash(saved) } : {}) } });
}
function intact(version) { return Boolean(version?.kind === 'content-version' && version.data?.snapshot && hash(version.data.snapshot) === version.data.snapshotHash); }
function publicationAction(state, doc, action, actor, body, now) {
  if (doc.data.recycleBin) fail('Restore this material before changing publication.', 409);
  if (!Number.isInteger(body.revision) || body.revision !== doc.revision) fail('This draft changed. Refresh before continuing.', 409, 'CONTENT_CONFLICT');
  if (body.confirmation !== doc.data.title) fail('Type the exact material title to confirm.');
  const note = typeof body.reason === 'string' ? body.reason.trim() : '';
  if (note.length < 8 || note.length > 400) fail('Record a review or withdrawal reason of 8–400 characters.');
  let restored;
  if (action === 'publish-content') {
    if (!topics().has(doc.data.topicId) || !['free','premium'].includes(doc.data.audience)) fail('Choose a syllabus topic and learner access before publication.');
    if (!require('./adminRecords.service').canRedistribute(doc.data, 'web', { now })) fail('This exact draft needs a current rights review covering commercial web use before publication.', 409, 'CONTENT_RIGHTS_REQUIRED');
    if (!require('./contentMedia.service').validLinks(doc.data.mediaLinks, state.governance, now)) fail('An attached image changed or needs a current image and rights review. Re-save this draft and review it before publishing.', 409, 'CONTENT_MEDIA_REVIEW_REQUIRED');
    if (doc.data.mediaLinks?.length) require('./contentMedia.service').touchStorage(state, now);
    if (body.confirmChemistryReview !== true) fail('Confirm the chemistry, syllabus alignment and source attribution review.');
  } else if (action === 'unpublish-content') {
    if (doc.data.publication?.status !== 'published') fail('This material is not currently published.', 409);
  } else if (action === 'rollback-content') {
    if (!Number.isInteger(body.version) || body.version < 1) fail('Choose a saved version.');
    const source = state.governance.find(row => row.key === versionKey(doc.key.slice(8), body.version));
    if (!intact(source)) fail('The saved version is missing or failed its integrity check.', 409);
    restored = snapshot(source.data.snapshot);
  } else fail('Unknown publication action.');
  recordVersion(state, doc, actor, now);
  const at = new Date(now).toISOString(), publication = doc.data.publication || null, createdBy = doc.data.createdBy;
  if (restored) {
    doc.data = { ...restored, status: 'draft', createdBy, publication, recycleBin: null };
    delete doc.data.reviewHash; delete doc.data.reviewedAt; delete doc.data.reviewedBy;
  }
  doc.revision++; doc.updatedAt = at; doc.data.updatedAt = at; doc.data.updatedBy = String(actor._id);
  if (action === 'publish-content') doc.data.publication = { status: 'published', version: doc.revision, publishedAt: at, publishedBy: String(actor._id) };
  if (action === 'unpublish-content') doc.data.publication = { ...publication, status: 'withdrawn', withdrawnAt: at, withdrawnBy: String(actor._id) };
  const event = action === 'publish-content' ? 'published' : action === 'unpublish-content' ? 'withdrawn' : 'restored-draft';
  recordVersion(state, doc, actor, now, event, note);
  state.adminLogs.push({ _id: store.id(), admin: String(actor._id), targetUser: null, action: 'CONTENT_' + event.toUpperCase().replace('-', '_'), details: { contentId: doc.key.slice(8), revision: doc.revision, ...(restored ? { sourceVersion: body.version } : {}) }, createdAt: at, updatedAt: at });
  return { success: true, message: restored ? 'Earlier version restored as a new draft. Review it before publishing; the current publication is unchanged.' : event === 'published' ? 'Reviewed material published to learners.' : 'Publication withdrawn. It will no longer be returned to learners.' };
}
function importMaterial(body) {
  if (!body || body.schemaVersion !== 1 || !body.material || typeof body.material !== 'object' || Array.isArray(body.material)) fail('Import a JSON object with schemaVersion 1 and a material object.');
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > 131072) fail('Material imports cannot exceed 128 KiB.');
  const allowed = ['mediaIds', ...fields.filter(key => !['assetHash','createdBy','updatedBy','updatedAt','reviewedBy','reviewedAt','reviewHash','mediaLinks'].includes(key))];
  if (Object.keys(body).some(key => !['schemaVersion','material'].includes(key)) || Object.keys(body.material).some(key => !allowed.includes(key))) fail('The import contains unsupported fields. Use the documented material JSON format.');
  return { ...clone(body.material), status: 'draft', revision: 0, confirmRightsReview: false };
}
function pageRows(rows, query = {}, maximum = 20) {
  const page = Math.max(1, Math.min(100000, Math.floor(Number(query.page) || 1))), limit = Math.max(1, Math.min(maximum, Math.floor(Number(query.limit) || 12)));
  return { items: rows.slice((page - 1) * limit, page * limit), pagination: { page, limit, total: rows.length, pages: Math.max(1, Math.ceil(rows.length / limit)) } };
}
async function history(contentId, query = {}) {
  if (!validId(contentId)) fail('Invalid material identifier.');
  const doc = await store.get('content:' + contentId);
  if (!doc || doc.kind !== 'content-draft') fail('Material not found.', 404);
  const rows = (await store.list({ kind: 'content-version', 'data.contentId': contentId })).filter(intact).sort((a,b) => b.data.contentRevision-a.data.contentRevision);
  return { ...pageRows(rows.map(row => ({ ...row.data, version: row.data.contentRevision })), query, 12), revision: doc.revision, current: snapshot(doc.data), images: await require('./contentMedia.service').adminImages(doc.data.mediaLinks), recycled: Boolean(doc.data.recycleBin), publication: doc.data.publication || null };
}
function visiblePublication(doc, version, user, now = Date.now()) {
  const pointer = doc?.data?.publication;
  if (!doc || doc.kind !== 'content-draft' || doc.data.recycleBin || pointer?.status !== 'published' || !intact(version) || version.key !== versionKey(doc.key.slice(8), pointer.version)) return null;
  const data = version.data, material = data.snapshot;
  if (data.event !== 'published' || data.chemistryReviewHash !== data.snapshotHash || !data.chemistryReviewedBy || !topics().has(material.topicId) || !['free','premium'].includes(material.audience)) return null;
  if (!require('./adminRecords.service').canRedistribute(material, 'web', { now }) || material.audience === 'premium' && !hasActiveSubscription(user)) return null;
  return { id: doc.key.slice(8), version: pointer.version, publishedAt: pointer.publishedAt, title: material.title, body: material.body, topicId: material.topicId, audience: material.audience,
    creator: material.creator, licenseName: material.licenseName, sourceURL: material.sourceURL, licenseURL: material.licenseURL, attribution: material.attribution, validUntil: material.validUntil || null, ...(material.mediaLinks === undefined ? {} : { mediaLinks: material.mediaLinks }) };
}
async function resolveImages(material) {
  if (!material) return null;
  const { mediaLinks, ...safe } = material;
  const images = await require('./contentMedia.service').resolveLinks(mediaLinks);
  return images ? { ...safe, images } : null;
}
async function publicRows(user) {
  const documents = await store.list({ kind: 'content-draft', 'data.publication.status': 'published' });
  const versions = await Promise.all(documents.map(doc => store.get(versionKey(doc.key.slice(8), doc.data.publication.version))));
  const now = Date.now();
  const candidates = documents.map((doc,index) => visiblePublication(doc, versions[index], user, now)).filter(Boolean);
  const resolved = await Promise.all(candidates.map(resolveImages));
  return resolved.filter(Boolean).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
}
async function publishedList(user, query = {}, credits = false) {
  const search = String(query.search || '').slice(0,200).trim().toLowerCase(), topic = String(query.topicId || '');
  const rows = (await publicRows(user)).filter(row => (!topic || row.topicId === topic) && (!search || (row.title + ' ' + row.creator + ' ' + row.body).toLowerCase().includes(search)));
  return { ...pageRows(rows.map(({ body, ...row }) => row), query), notice: credits ? 'Sources for the reviewed materials available to your account. The separate built-in course inventory remains under source review.' : 'Published materials are checked online. Drafts and withdrawn, expired or inaccessible publications are excluded.' };
}
async function publishedMaterial(user, contentId) {
  if (!validId(contentId)) fail('Material not found.', 404, 'CONTENT_NOT_AVAILABLE');
  const doc = await store.get('content:' + contentId), pointer = doc?.data?.publication;
  const version = pointer ? await store.get(versionKey(contentId, pointer.version)) : null;
  const material = await resolveImages(visiblePublication(doc, version, user));
  if (!material) fail('This material is no longer available to this account. Refresh the lesson list.', 404, 'CONTENT_NOT_AVAILABLE');
  return { material };
}
module.exports = { snapshot, recordVersion, publicationAction, importMaterial, history, visiblePublication, publishedList, publishedMaterial };
