const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const jwt = require('jsonwebtoken');
const { configureFixture } = require('../scripts/lib/fixture-config.cjs');
const fixture = configureFixture('admin-recycle');
const { acceptedPrivacy } = require('../scripts/lib/privacy-fixture.cjs');
const local = require('../backend/src/data/localModels');
const { User } = local;
const records = require('../backend/src/services/adminRecords.service');
const store = require('../backend/src/services/governanceStore');
const { guardianHeadKey } = require('../backend/src/services/privacy.service');
let instance, base, admin, sequence = 0;
const DAY = 86400000;
const token = user => jwt.sign({ id: user._id, purpose: 'access', authVersion: user.authVersion || 0 }, process.env.JWT_SECRET);
async function person(status = 'suspended', role = 'student') { return User.create({ name: 'Synthetic retained adult ' + (++sequence), email: 'recycle-' + sequence + '@archive.test', password: 'synthetic-hash-' + sequence, passwordPolicyVersion: 1, accountStatus: status, role, privacy: acceptedPrivacy() }); }
async function api(path, method = 'GET', body, auth = token(admin)) { const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: 'Bearer ' + auth } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: res.status, data: await res.json() }; }
const trash = user => api('/api/admin/users/' + user._id + '/trash', 'POST', { confirmation: user.email, reason: 'Synthetic lifecycle review completed' });
const bin = user => '/api/admin/recycle-bin/account:' + user._id;
function ageAccount(user, days = 91) { local.atomicAdminMutation(state => { const row = state.users.find(u => u._id === user._id); row.recycleBin.deletedAt = new Date(Date.now() - days * DAY).toISOString(); row.recycleBin.purgeEligibleAt = new Date(Date.now() - (days - 90) * DAY).toISOString(); }); }
const draftInput = () => ({ title: 'Synthetic original material ' + (++sequence), body: 'This is an original synthetic chemistry explanation.', creator: 'Synthetic author', licenseName: 'Original ChemWiz test work', status: 'draft' });
async function createDraft(body = draftInput()) { const value = await api('/api/admin/content', 'POST', body); assert.equal(value.status, 200); return value.data.draft; }
test.before(async () => { await require('../backend/src/config/db')(); instance = {server: require('node:http').createServer(require('../backend/app'))}; await new Promise(resolve => instance.server.listen(0, '127.0.0.1', resolve)); base = 'http://127.0.0.1:' + instance.server.address().port; admin = await User.findOne({ role: 'admin' }); });
test.after(async () => { await new Promise(resolve => instance.server.close(resolve)); fixture.cleanup(); });

test('all new record routes refuse anonymous and learner authority', async () => {
  const user = await person('active');
  for (const [path, method] of [['/api/admin/recycle-bin','GET'], ['/api/admin/content','GET'], ['/api/admin/content-inventory','GET'], ['/api/admin/users/'+user._id+'/trash','POST'], [bin(user)+'/restore','POST'], [bin(user),'DELETE'], ['/api/admin/content','POST'], ['/api/admin/content/'+user._id,'PUT'], ['/api/admin/content/'+user._id,'DELETE']]) {
    assert.equal((await api(path, method, method === 'GET' ? null : {}, '')).status, 401);
    assert.equal((await api(path, method, method === 'GET' ? null : {}, token(user))).status, 403);
  }
});
test('active, self and other administrator accounts cannot be trashed', async () => {
  for (const user of [await person('active'), admin, await person('disabled', 'admin')]) { assert.equal((await trash(user)).status, 409); assert.equal((await User.findById(user._id)).recycleBin, null); }
});
test('account deletion requires an exact email confirmation and a reason', async () => {
  const user = await person();
  for (const body of [{ confirmation: 'wrong@archive.test', reason: 'A detailed synthetic reason' }, { confirmation: user.email, reason: 'short' }]) assert.equal((await api('/api/admin/users/'+user._id+'/trash', 'POST', body)).status, 400);
  assert.equal((await User.findById(user._id)).recycleBin, null);
});
test('trash preserves records, revokes sessions and hides accounts from users/stats/lookup', async () => {
  const user = await person();
  await local.LearningState.compareAndSet(user._id, 0, { retained: true, secret:'SYNTHETIC-LEARNING-CONTENT-ONLY' });
  await User.findOneAndUpdate({ _id: user._id }, { $set: { passwordReset: { tokenHash: 'synthetic-reset-private' } } }, { new: true });
  const count = (await api('/api/admin/stats')).data.stats.totalUsers;
  assert.equal((await trash(user)).status, 200);
  const stored = await User.findById(user._id).select('+passwordReset');
  assert.equal(stored.password, user.password); assert.equal(stored.accountStatus, 'disabled'); assert.equal(stored.passwordReset, null); assert.equal(stored.authVersion, 1);
  assert.equal(Date.parse(stored.recycleBin.purgeEligibleAt)-Date.parse(stored.recycleBin.deletedAt), 90*DAY);
  assert.equal((await local.LearningState.get(user._id)).state.retained, true);
  assert.equal((await api('/api/admin/users?search='+user.email)).data.users.length, 0);
  assert.equal((await api('/api/admin/stats')).data.stats.totalUsers, count-1);
  assert.equal((await api('/api/auth/me','GET',null,token(user))).status,401);
  const result = await api('/api/admin/recycle-bin?search='+user.email); assert.equal(result.data.items[0].canPurge,false);
  for (const value of ['passwordReset', user.password, 'synthetic-reset-private', 'SYNTHETIC-LEARNING-CONTENT-ONLY']) assert.ok(!JSON.stringify(result.data).includes(value));
});
test('inactive disabled accounts are eligible and stale document saves cannot resurrect them', async () => {
  const user = await person('disabled'), stale = await User.findById(user._id); await trash(user);
  stale.accountStatus = 'active'; await assert.rejects(stale.save(), /account changed/i);
  for (const [suffix,body] of [['status',{accountStatus:'active'}],['role',{role:'admin'}],['subscription',{subscriptionTier:'premium'}]]) assert.equal((await api('/api/admin/users/'+user._id+'/'+suffix,'PATCH',body)).status,404);
  assert.ok((await User.findById(user._id)).recycleBin);
});
test('school memberships revoke and seats release without silently restoring school access', async () => {
  const user = await person(); const schoolId = store.id();
  await store.put('school:'+schoolId,0,{reservedUserIds:[user._id]},{kind:'school',schoolId});
  await store.put('membership:'+schoolId+':'+user._id,0,{role:'teacher',status:'active',sharing:true,classIds:['L6']},{kind:'membership',schoolId,ownerId:user._id});
  await trash(user); assert.deepEqual((await store.get('school:'+schoolId)).data.reservedUserIds,[]);
  assert.equal((await store.get('membership:'+schoolId+':'+user._id)).data.status,'revoked');
  assert.equal((await api(bin(user)+'/restore','POST',{confirmation:user.email})).status,200);
  assert.equal((await User.findById(user._id)).accountStatus,'suspended');
  assert.equal((await store.get('membership:'+schoolId+':'+user._id)).data.status,'revoked');
});
test('restoring preserves learning records and old tokens stay revoked', async () => {
  const user = await person('disabled'), old = token(user); await local.LearningState.compareAndSet(user._id,0,{ retained:true }); await trash(user);
  await api(bin(user)+'/restore','POST',{confirmation:user.email});
  await api('/api/admin/users/'+user._id+'/status','PATCH',{accountStatus:'active'});
  assert.equal((await api('/api/auth/me','GET',null,old)).status,401);
  assert.equal((await api('/api/auth/me','GET',null,token(await User.findById(user._id)))).status,200);
  assert.equal((await local.LearningState.get(user._id)).state.retained,true);
});
test('client dates and a tampered early eligibility timestamp cannot bypass the minimum 90 days', async () => {
  const user=await person(); await api('/api/admin/users/'+user._id+'/trash','POST',{confirmation:user.email,reason:'Synthetic date injection test',deletedAt:'2000-01-01',purgeEligibleAt:'2000-01-01'});
  assert.equal((await api(bin(user),'DELETE',{confirmation:user.email,now:Date.now()+1000*DAY})).data.code,'RECYCLE_RETENTION_ACTIVE');
  local.atomicAdminMutation(state=>{state.users.find(row=>row._id===user._id).recycleBin.purgeEligibleAt='2000-01-01';});
  assert.equal((await api(bin(user),'DELETE',{confirmation:user.email})).status,409); assert.ok(await User.findById(user._id));
});
test('the precise 90-day boundary is enforced by the domain clock', async () => {
  const user=await person(), state={users:[JSON.parse(JSON.stringify(user))],governance:[],learningStates:[],adminLogs:[]}, now=Date.now();
  records.transition(state,'trash-account',user._id,admin,{confirmation:user.email,reason:'Synthetic exact-boundary test'},now);
  assert.throws(()=>records.transition(structuredClone(state),'purge-account',user._id,admin,{confirmation:user.email},now+90*DAY-1),/90 days/);
  records.transition(state,'purge-account',user._id,admin,{confirmation:user.email},now+90*DAY); assert.equal(state.users.length,0);
});
test('permanent account purge erases linked local records and redacts audit references', async () => {
  const user=await person(); await local.LearningState.compareAndSet(user._id,0,{secret:'synthetic learning detail'});
  await store.put('consent:'+store.id(),0,{privateDetail:user.email},{kind:'consent',ownerId:user._id});
  await store.put(guardianHeadKey(user.email),0,{currentId:'synthetic'},{kind:'guardian-head',ownerId:user._id});
  await local.AdminLog.create({admin:admin._id,targetUser:user._id,action:'SYNTHETIC_LINK',details:{targetEmail:user.email}});
  await trash(user);ageAccount(user);
  assert.equal((await api(bin(user),'DELETE',{confirmation:user.email})).status,200);
  assert.equal(await User.findById(user._id),null);assert.equal(await local.LearningState.get(user._id),null);assert.equal((await store.list({ownerId:user._id})).length,0);
  const raw=fs.readFileSync(local.DATA_FILE,'utf8');for(const value of [user.email,user.password,user._id,'synthetic learning detail'])assert.ok(!raw.includes(value),value);
  assert.equal((await api(bin(user)+'/restore','POST',{confirmation:user.email})).status,404);
});
test('guardian dependencies hold a purge while unrelated accounts remain recoverable', async () => {
  const user=await person();await store.put('guardian:'+store.id(),0,{parentEmail:user.email,userId:'another-learner',status:'used'},{kind:'guardian'});await trash(user);ageAccount(user);
  assert.equal((await api(bin(user),'DELETE',{confirmation:user.email})).data.code,'ACCOUNT_RETENTION_HOLD');assert.ok(await User.findById(user._id));
});
test('approved privacy erasure keeps its existing procedure and cannot be restored from this bin', async () => {
  const user=await person();await User.findOneAndUpdate({_id:user._id},{$set:{privacy:{...user.privacy,deletionApprovedAt:new Date().toISOString()}}},{new:true});assert.equal((await trash(user)).status,409);
  const other=await person();await trash(other);await User.findOneAndUpdate({_id:other._id},{$set:{privacy:{...other.privacy,deletionApprovedAt:new Date().toISOString()}}},{new:true});assert.equal((await api(bin(other)+'/restore','POST',{confirmation:other.email})).status,409);
});
test('a failed atomic file replacement commits neither deletion nor audit changes', async () => {
  const user=await person(), before=fs.readFileSync(local.DATA_FILE,'utf8'), rename=fs.renameSync;
  try{fs.renameSync=()=>{throw new Error('Synthetic atomic write failure');};await assert.rejects(records.mutate('trash-account',user._id,admin,{confirmation:user.email,reason:'Synthetic disk failure test'}),/atomic write/);}finally{fs.renameSync=rename;}
  assert.equal(fs.readFileSync(local.DATA_FILE,'utf8'),before);assert.equal((await User.findById(user._id)).recycleBin,null);
});
test('concurrent trash attempts create one recoverable account entry', async () => {
  const user=await person(), responses=await Promise.all([trash(user),trash(user)]);assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
  assert.equal((await api('/api/admin/recycle-bin?search='+user.email)).data.items.length,1);
});
test('inventory covers 24 topic modules, 255 chapters and 218 diagrams without declaring rights cleared', async () => {
  const inventory=require('../shared/content-inventory.json');assert.deepEqual(inventory.counts,{'topic-source':24,chapter:255,diagram:218});assert.equal(new Set(inventory.assets.map(row=>row.assetId)).size,497);
  assert.ok(inventory.assets.every(row=>row.rightsStatus==='unreviewed'&&/^[a-f0-9]{64}$/.test(row.assetHash)));
  const r=await api('/api/admin/content-inventory?search=atomic');assert.equal(r.status,200);assert.ok(r.data.items.length);assert.ok(r.data.items.some(row=>row.topicId==='atomic'));
});
test('draft validation rejects dangerous source URLs and incomplete rights claims', async () => {
  for(const body of [{...draftInput(),sourceURL:'javascript:alert(1)'},{...draftInput(),status:'cleared'},{...draftInput(),assetId:'unknown-asset'}])assert.equal((await api('/api/admin/content','POST',body)).status,400);
});
test('draft edits require the latest revision and cannot change a trashed draft', async () => {
  let draft=await createDraft();const changed=await api('/api/admin/content/'+draft.id,'PUT',{...draft,title:'Updated original material'});assert.equal(changed.status,200);
  assert.equal((await api('/api/admin/content/'+draft.id,'PUT',{...draft,title:'Stale replacement'})).status,409);draft=changed.data.draft;
  assert.equal((await api('/api/admin/content/'+draft.id,'DELETE',{revision:draft.revision,confirmation:draft.title,reason:'Synthetic draft lifecycle test'})).status,200);
  assert.equal((await api('/api/admin/content/'+draft.id,'PUT',{...draft,revision:draft.revision+1})).status,409);
});
test('redistribution checks require matching review hashes and exact offline/platform scope', async () => {
  const draft=await createDraft({...draftInput(),status:'cleared',permissionReference:'SYNTHETIC-OWNERSHIP-REFERENCE',attribution:'Synthetic author',commercialUseAllowed:true,offlineRedistributionAllowed:false,platforms:['web'],confirmRightsReview:true});
  assert.equal(draft.eligibility.webOffline,false);assert.equal(records.canRedistribute(draft,'web'),true);assert.equal(records.canRedistribute(draft,'android'),false);
  assert.equal(records.canRedistribute({...draft,body:'Changed after review'},'web'),false);
  assert.equal((await api('/api/admin/content/'+draft.id,'PUT',{...draft,confirmRightsReview:false})).status,400);
});
test('material restore returns a draft for fresh review, and a later purge removes the complete saved material', async () => {
  let draft=await createDraft({...draftInput(),status:'cleared',permissionReference:'SYNTHETIC-PERMISSION',attribution:'Synthetic author',commercialUseAllowed:true,offlineRedistributionAllowed:true,platforms:['web'],confirmRightsReview:true});assert.equal(draft.eligibility.webOffline,true);
  const body={revision:draft.revision,confirmation:draft.title,reason:'Synthetic recoverable draft deletion'};
  await api('/api/admin/content/'+draft.id,'DELETE',body);
  let entry=(await api('/api/admin/recycle-bin?search='+encodeURIComponent(draft.title))).data.items[0];assert.equal(entry.type,'material');assert.equal(entry.body,undefined);
  assert.equal((await api('/api/admin/recycle-bin/'+entry.entryId,'DELETE',{confirmation:entry.confirmation,revision:entry.revision})).status,409);
  await api('/api/admin/recycle-bin/'+entry.entryId+'/restore','POST',{confirmation:entry.confirmation,revision:entry.revision});
  draft=(await store.get('content:'+draft.id));assert.equal(draft.data.status,'draft');assert.equal(records.canRedistribute(draft.data,'web',{offline:true}),false);
  await api('/api/admin/content/'+draft.key.slice(8),'DELETE',{revision:draft.revision,confirmation:draft.data.title,reason:'Synthetic final material deletion'});
  local.atomicAdminMutation(state=>{const doc=state.governance.find(row=>row.key===draft.key);doc.data.recycleBin.deletedAt=new Date(Date.now()-91*DAY).toISOString();doc.data.recycleBin.purgeEligibleAt=new Date(Date.now()-DAY).toISOString();});
  entry=(await api('/api/admin/recycle-bin?search='+encodeURIComponent(draft.data.title))).data.items[0];assert.equal(entry.canPurge,true);
  assert.equal((await api('/api/admin/recycle-bin/'+entry.entryId,'DELETE',{confirmation:entry.confirmation,revision:entry.revision})).status,200);
  assert.equal(await store.get(draft.key),null);assert.ok(!fs.readFileSync(local.DATA_FILE,'utf8').includes(draft.data.title));
});

test('an old editor cannot recreate a purged material through the update endpoint', async () => {
  const id=store.id();assert.equal((await api('/api/admin/content/'+id,'PUT',{...draftInput(),revision:0})).status,404);
});
test('unrelated saved fields survive recycle and restore unchanged', async () => {
  const user=await person();local.atomicAdminMutation(state=>{state.users.find(row=>row._id===user._id).futurePreference={retained:'synthetic preference'};});
  await trash(user);await api(bin(user)+'/restore','POST',{confirmation:user.email});
  const data=JSON.parse(fs.readFileSync(local.DATA_FILE));assert.deepEqual(data.users.find(row=>row._id===user._id).futurePreference,{retained:'synthetic preference'});
});

test('permission expiry gates redistribution and overly long drafts are rejected without truncation', async () => {
  const reviewed={...draftInput(),status:'cleared',permissionReference:'SYNTHETIC-LIMITED-RIGHTS',attribution:'Synthetic author',commercialUseAllowed:true,offlineRedistributionAllowed:true,platforms:['web'],confirmRightsReview:true};
  assert.equal((await api('/api/admin/content','POST',{...reviewed,validUntil:'2000-01-01'})).status,400);
  const expiry=new Date(Date.now()+5*DAY).toISOString().slice(0,10),draft=await createDraft({...reviewed,validUntil:expiry});
  assert.equal(records.canRedistribute(draft,'web',{offline:true}),true);
  assert.equal(records.canRedistribute(draft,'web',{offline:true,now:Date.parse(expiry)+DAY}),false);
  assert.equal((await api('/api/admin/content','POST',{...draftInput(),body:'x'.repeat(20001)})).status,400);
});
