const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const jwt = require('jsonwebtoken');
const fixture = require('../scripts/lib/fixture-config.cjs').configureFixture('content-publishing');
const { acceptedPrivacy } = require('../scripts/lib/privacy-fixture.cjs');
const local = require('../backend/src/data/localModels');
const store = require('../backend/src/services/governanceStore');
const editorial = require('../backend/src/services/contentEditorial.service');
let server, base, admin, learner, sequence = 0;
const token = user => jwt.sign({ id:user._id,purpose:'access',authVersion:user.authVersion||0 },process.env.JWT_SECRET);
async function api(path,method='GET',body,auth=token(admin)) { const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+auth}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,headers:response.headers,data:await response.json()}; }
const draft = (extra={}) => ({title:'Original publication test '+(++sequence),body:'The atomic number is the number of protons in a nucleus.',creator:'Synthetic chemistry teacher',licenseName:'Original test work',topicId:'atomic',audience:'free',status:'draft',...extra});
const rights = extra => ({status:'cleared',commercialUseAllowed:true,platforms:['web'],attribution:'Original explanation by Synthetic chemistry teacher',permissionReference:'SYNTHETIC-OWNERSHIP-EVIDENCE',confirmRightsReview:true,...extra});
async function create(extra={}) {const r=await api('/api/admin/content','POST',draft(extra));assert.equal(r.status,200,JSON.stringify(r.data));return r.data.draft;}
async function current(id) {const r=await api('/api/admin/content?limit=50');return r.data.items.find(row=>row.id===id);}
const action = row => ({revision:row.revision,confirmation:row.title,reason:'Synthetic chemistry and source review',confirmChemistryReview:true});
async function publish(row) {return api('/api/admin/content/'+row.id+'/publish','POST',action(row));}
async function published(extra={}) {const row=await create(rights(extra));assert.equal((await publish(row)).status,200);return current(row.id);}
test.before(async()=>{await require('../backend/src/config/db')();server=require('node:http').createServer(require('../backend/app'));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;admin=await local.User.findOne({role:'admin'});learner=await local.User.create({name:'Synthetic published learner',email:'published-learner@build-gate.test',password:'synthetic-test-hash',passwordPolicyVersion:1,accountStatus:'active',privacy:acceptedPrivacy()});});
test.after(async()=>{await new Promise(resolve=>server.close(resolve));fixture.cleanup();});
test('publication routes require authentication and active admin authority',async()=>{
  const row=await create();
  for(const [path,method] of [['/api/admin/content/import','POST'],['/api/admin/content/'+row.id+'/history','GET'],...['publish','unpublish','rollback'].map(name=>['/api/admin/content/'+row.id+'/'+name,'POST'])]){
    assert.equal((await api(path,method,method==='GET'?null:{},'')).status,401);assert.equal((await api(path,method,method==='GET'?null:{},token(learner))).status,403);
  }
  for(const path of ['/api/content','/api/content/credits','/api/content/'+row.id])assert.equal((await api(path,'GET',null,'')).status,401);
});
test('JSON imports create unreviewed drafts and reject unsupported, oversized and malformed input',async()=>{
  const input={schemaVersion:1,material:draft(rights())};
  delete input.material.confirmRightsReview;
  const imported=await api('/api/admin/content/import','POST',input);assert.equal(imported.status,200);assert.equal(imported.data.draft.status,'draft');assert.equal(imported.data.draft.reviewHash,undefined);assert.equal(imported.data.draft.publication,null);
  for(const body of [{material:draft()}, {schemaVersion:1,material:[]}, {schemaVersion:1,material:{...draft(),publication:{status:'published'}}}, {schemaVersion:1,material:{...draft(),body:'x'.repeat(131073)}},JSON.parse('{"schemaVersion":1,"material":{"__proto__":{"role":"admin"}}}')])assert.equal((await api('/api/admin/content/import','POST',body)).status,400);
  assert.equal({}.role,undefined);
});
test('unreviewed, wrong-platform, topicless and unconfirmed drafts cannot be published',async()=>{
  const unreviewed=await create();assert.equal((await publish(unreviewed)).data.code,'CONTENT_RIGHTS_REQUIRED');
  const android=await create(rights({platforms:['android']}));assert.equal((await publish(android)).status,409);
  const topicless=await create(rights({topicId:''}));assert.equal((await publish(topicless)).status,400);
  const valid=await create(rights());assert.equal((await api('/api/admin/content/'+valid.id+'/publish','POST',{...action(valid),confirmChemistryReview:false})).status,400);
  assert.equal((await api('/api/admin/content/'+valid.id+'/publish','POST',{...action(valid),confirmation:'wrong'})).status,400);
  assert.equal((await api('/api/admin/content/'+valid.id+'/publish','POST',{...action(valid),reason:'short'})).status,400);
});
test('published detail and credits expose only approved public fields and are never cacheable',async()=>{
  const row=await published({permissionReference:'SYNTHETIC-CONFIDENTIAL-LICENSE-CASE'});
  for(const path of ['/api/content','/api/content/credits','/api/content/'+row.id]){
    const r=await api(path,'GET',null,token(learner));assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);const raw=JSON.stringify(r.data);
    for(const secret of ['SYNTHETIC-CONFIDENTIAL-LICENSE-CASE','permissionReference','reviewedBy','recordedBy','reviewHash',String(admin._id)])assert.ok(!raw.includes(secret),secret);
  }
  const detail=(await api('/api/content/'+row.id,'GET',null,token(learner))).data.material;assert.equal(detail.body,row.body);assert.equal(detail.attribution,row.attribution);
});
test('saving a later draft leaves the reviewed publication and its immutable snapshot unchanged',async()=>{
  const row=await published();const original=await store.get('content-version:'+row.id+':'+row.publication.version);
  const changed=await api('/api/admin/content/'+row.id,'PUT',{...row,status:'draft',body:'A private, unfinished correction.'});assert.equal(changed.status,200);
  assert.equal((await api('/api/content/'+row.id,'GET',null,token(learner))).data.material.body,row.body);
  assert.deepEqual(await store.get(original.key),original);assert.equal(changed.data.draft.publication.version,row.publication.version);
});
test('two concurrent publication requests yield one version and a stale-revision conflict',async()=>{
  const row=await create(rights());const results=await Promise.all([publish(row),publish(row)]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
  const history=(await api('/api/admin/content/'+row.id+'/history')).data;assert.equal(history.items.filter(item=>item.event==='published').length,1);
});
test('restoring an old version creates a new draft, preserves the live version and requires fresh rights review',async()=>{
  let row=await published();const old=await api('/api/admin/content/'+row.id+'/history');assert.ok(old.data.items.some(item=>item.version===1));
  assert.equal((await api('/api/admin/content/'+row.id+'/rollback','POST',{...action(row),version:1})).status,200);row=await current(row.id);
  assert.equal(row.status,'draft');assert.equal(row.reviewHash,undefined);assert.equal((await publish(row)).data.code,'CONTENT_RIGHTS_REQUIRED');
  assert.equal((await api('/api/content/'+row.id,'GET',null,token(learner))).status,200);
  assert.equal((await api('/api/admin/content/'+row.id+'/rollback','POST',{...action(row),version:9999})).status,409);
});
test('withdrawn publications disappear from list, detail and credits while admin history survives',async()=>{
  const row=await published();assert.equal((await api('/api/admin/content/'+row.id+'/unpublish','POST',action(row))).status,200);
  assert.equal((await api('/api/content/'+row.id,'GET',null,token(learner))).status,404);
  for(const path of ['/api/content','/api/content/credits'])assert.ok(!(await api(path+'?search='+encodeURIComponent(row.title),'GET',null,token(learner))).data.items.some(item=>item.id===row.id));
  assert.ok((await api('/api/admin/content/'+row.id+'/history')).data.items.some(item=>item.event==='withdrawn'));
});
test('free learners cannot enumerate or read Premium material and current subscription expiry revokes access',async()=>{
  const row=await published({audience:'premium'});assert.equal((await api('/api/content/'+row.id+'?platform=android','GET',null,token(learner))).status,404);
  assert.equal((await api('/api/content?search='+encodeURIComponent(row.title),'GET',null,token(learner))).data.items.length,0);
  await local.User.findOneAndUpdate({_id:learner._id},{$set:{subscriptionTier:'premium',subscriptionStatus:'active',subscriptionExpiresAt:new Date(Date.now()+86400000).toISOString()}},{new:true});
  assert.equal((await api('/api/content/'+row.id,'GET',null,token(learner))).status,200);
  await local.User.findOneAndUpdate({_id:learner._id},{$set:{subscriptionExpiresAt:'2000-01-01'}},{new:true});assert.equal((await api('/api/content/'+row.id,'GET',null,token(learner))).status,404);
});
test('onboarding and suspended-account controls protect published materials',async()=>{
  const row=await published(), user=await local.User.create({name:'Synthetic unready user',email:'unready-publication@build-gate.test',password:'synthetic-hash',passwordPolicyVersion:1,accountStatus:'active',privacy:{}});
  assert.equal((await api('/api/content/'+row.id,'GET',null,token(user))).data.code,'PRIVACY_ONBOARDING_REQUIRED');
  await local.User.findOneAndUpdate({_id:user._id},{$set:{accountStatus:'suspended',privacy:acceptedPrivacy()}},{new:true});assert.equal((await api('/api/content','GET',null,token(user))).data.code,'ACCOUNT_SUSPENDED');
});
test('permission expiry is enforced on the publication snapshot at the exact server-time boundary',async()=>{
  const date=new Date(Date.now()+2*86400000).toISOString().slice(0,10), row=await published({validUntil:date});
  const doc=await store.get('content:'+row.id), version=await store.get('content-version:'+row.id+':'+row.publication.version);
  assert.ok(editorial.visiblePublication(doc,version,admin,Date.parse(date)+86400000-1));assert.equal(editorial.visiblePublication(doc,version,admin,Date.parse(date)+86400000),null);
});
test('tampered snapshots and pointers fail closed without returning historic or draft bodies',async()=>{
  const row=await published();local.atomicAdminMutation(state=>{state.governance.find(doc=>doc.key==='content-version:'+row.id+':'+row.publication.version).data.snapshot.body='SYNTHETIC TAMPERED BODY';});
  const r=await api('/api/content/'+row.id,'GET',null,token(learner));assert.equal(r.status,404);assert.ok(!JSON.stringify(r).includes('SYNTHETIC TAMPERED BODY'));
});
test('trashing published material withdraws it, restore stays unpublished and permanent purge removes all versions',async()=>{
  let row=await published();const id=row.id;
  assert.equal((await api('/api/admin/content/'+id,'DELETE',{...action(row),reason:'Synthetic publication recycle test'})).status,200);assert.equal((await api('/api/content/'+id,'GET',null,token(learner))).status,404);
  let bin=(await api('/api/admin/recycle-bin?search='+encodeURIComponent(row.title))).data.items[0];await api('/api/admin/recycle-bin/'+bin.entryId+'/restore','POST',{confirmation:row.title,revision:bin.revision});
  row=await current(id);assert.equal(row.status,'draft');assert.equal(row.publication.status,'withdrawn');assert.equal((await api('/api/content/'+id,'GET',null,token(learner))).status,404);
  await api('/api/admin/content/'+id,'DELETE',action(row));local.atomicAdminMutation(state=>{const doc=state.governance.find(doc=>doc.key==='content:'+id);doc.data.recycleBin.deletedAt=new Date(Date.now()-91*86400000).toISOString();doc.data.recycleBin.purgeEligibleAt=new Date(Date.now()-86400000).toISOString();});
  bin=(await api('/api/admin/recycle-bin?search='+encodeURIComponent(row.title))).data.items[0];assert.equal((await api('/api/admin/recycle-bin/'+bin.entryId,'DELETE',{confirmation:row.title,revision:bin.revision})).status,200);
  assert.equal((await store.list({kind:'content-version','data.contentId':id})).length,0);assert.ok(!fs.readFileSync(local.DATA_FILE,'utf8').includes(row.title));assert.equal((await api('/api/admin/content/'+id+'/history')).status,404);
});
test('material listing orders MongoDB Date timestamps as well as local JSON timestamps',async()=>{
  const list=store.list;
  const values=[{key:'content:'+store.id(),revision:1,updatedAt:new Date('2026-10-20T20:00:00.001Z'),data:draft({title:'Earlier Mongo date'})},{key:'content:'+store.id(),revision:1,updatedAt:new Date('2026-10-20T20:00:00.002Z'),data:draft({title:'Later Mongo date'})}];
  store.list=async()=>values;
  try {const result=await require('../backend/src/services/adminRecords.service').drafts({});assert.deepEqual(result.items.map(row=>row.title),['Later Mongo date','Earlier Mongo date']);}
  finally {store.list=list;}
});
test('a rejected publication leaves material, version history and audit bytes unchanged',async()=>{
  const row=await create(rights({platforms:['android']})), before=fs.readFileSync(local.DATA_FILE,'utf8');
  assert.equal((await publish(row)).status,409);assert.equal(fs.readFileSync(local.DATA_FILE,'utf8'),before);
});
