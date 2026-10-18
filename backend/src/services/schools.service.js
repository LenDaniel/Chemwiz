const store=require('./governanceStore');
const privacy=require('./privacy.service');
const {User}=require('../data/modelProvider');
const {getState}=require('./learningState.service');
const id=value=>{if(!/^[a-f0-9]{24}$/.test(String(value)))privacy.fail('Invalid school or user identifier.');return String(value);};
const active=s=>s?.status==='active'&&s.dpaReference&&Date.parse(s.expiresAt)>Date.now();
const classes=value=>Array.isArray(value)?[...new Set(value.map(v=>privacy.text(v,50)).filter(Boolean))].slice(0,20):[];
async function school(key){const d=await store.get('school:'+id(key));if(!d)privacy.fail('School not found.',404);return d;}
async function list(user){
  const schools=await store.list({kind:'school'});
  const memberships=user.role==='admin'?[]:await store.list({kind:'membership',ownerId:String(user._id)});
  return schools.filter(d=>user.role==='admin'||memberships.some(m=>m.schoolId===d.key.slice(7)&&m.data.status!=='revoked')).map(d=>({id:d.key.slice(7),...(user.role==='admin'?{...d.data,reservedUserIds:undefined}:{name:d.data.name,contactEmail:d.data.contactEmail,status:d.data.status,expiresAt:d.data.expiresAt}),revision:d.revision,membership:user.role==='admin'?{role:'platform_admin',status:'active'}:memberships.find(m=>m.schoolId===d.key.slice(7)).data}));
}
async function save(user,body,schoolId){
  await privacy.requirePublished();
  const schoolKey=schoolId?id(schoolId):store.id();const current=schoolId?await school(schoolKey):null;
  if(current&&body.revision!==current.revision)privacy.fail('School settings changed. Refresh before saving.',409);
  const data={name:privacy.text(body.name),contactEmail:privacy.email(body.contactEmail),contractReference:privacy.text(body.contractReference),dpaReference:privacy.text(body.dpaReference),expiresAt:privacy.text(body.expiresAt,40),seats:body.seats,status:body.status};
  if(!data.name||!privacy.isEmail(data.contactEmail)||!data.contractReference||!data.dpaReference||!Number.isFinite(Date.parse(data.expiresAt))||!Number.isInteger(data.seats)||data.seats<1||data.seats>100000||!['active','suspended','ended'].includes(data.status))privacy.fail('Complete the school, contract/DPA references, contact, expiry, seat count and status.');
  if(current?.data.reservedUserIds?.length>data.seats)privacy.fail('Revoke memberships before reducing the seat count.',409);
  const doc=await store.put('school:'+schoolKey,current?.revision || 0,{...data,reservedUserIds:current?.data.reservedUserIds || []},{kind:'school',schoolId:schoolKey});
  if(!doc)privacy.fail('School settings changed. Refresh and retry.',409);
  await privacy.audit(user,'SCHOOL_SAVED',null,{schoolId:schoolKey,status:data.status});return {id:schoolKey,...data,revision:doc.revision};
}
async function membership(user,schoolId,body){
  const s=await school(schoolId);if(!active(s.data))privacy.fail('This school subscription is not active.',403,'SCHOOL_INACTIVE');
  const userId=id(body.userId),target=await User.findById(userId);
  if(!target||target.role==='admin'||target.accountStatus!=='active')privacy.fail('Choose an existing non-platform-admin account.');
  if(!['student','teacher','school_admin'].includes(body.role)||!['pending','revoked'].includes(body.status))privacy.fail('New or changed memberships require learner/staff confirmation; choose pending or revoked.');
  const classIds=classes(body.classIds);if(body.role==='teacher'&&!classIds.length)privacy.fail('Assign at least one class to a teacher.');
  const key='membership:'+schoolId+':'+userId,previous=await store.get(key);
  const data={role:body.role,status:body.status,classIds,sharing:false,assignedBy:String(user._id),assignedAt:new Date().toISOString()};
  // The school document is a seat ledger with optimistic concurrency. Seats
  // remain reserved until explicit revocation, including pending approvals.
  if(body.status!=='revoked')await store.mutate(s.key,schoolData=>{
    const reserved=new Set(schoolData.reservedUserIds || []);
    if(body.status==='revoked')reserved.delete(userId);else reserved.add(userId);
    if(reserved.size>schoolData.seats)privacy.fail('This school has no available seats.',409,'SCHOOL_SEATS_FULL');
    return {...schoolData,reservedUserIds:[...reserved]};
  },{kind:'school',schoolId});
  const saved=await store.put(key,previous?.revision || 0,data,{kind:'membership',ownerId:userId,schoolId});
  if(!saved)privacy.fail('Membership changed. Refresh and retry.',409);
  if(body.status==='revoked')await store.mutate(s.key,schoolData=>({...schoolData,reservedUserIds:(schoolData.reservedUserIds || []).filter(value=>value!==userId)}),{kind:'school',schoolId});
  await privacy.audit(user,'SCHOOL_MEMBERSHIP_CHANGED',userId,{schoolId,role:body.role,status:body.status});return {schoolId,userId,...data};
}
async function share(user,schoolId,body){
  const s=await school(schoolId),key='membership:'+schoolId+':'+user._id,doc=await store.get(key);
  if(!doc||doc.data.status==='revoked')privacy.fail('Membership not found.',404);
  if(body.share!==true&&body.share!==false)privacy.fail('Choose whether to accept this school membership.');
  if(body.share){
    if(!privacy.ready(user)||!active(s.data))privacy.fail('Complete onboarding and use an active school subscription first.',403);
    if(user.privacy?.guardianId){const g=(await store.get('guardian:'+user.privacy.guardianId))?.data;if(!g||g.status!=='used'||g.schoolId!==schoolId||g.schoolSharing!==true)privacy.fail('Your guardian must authorise sharing with this school.',403,'GUARDIAN_SCHOOL_REQUIRED');}
  }
  const data={...doc.data,sharing:body.share,status:body.share?'active':'pending',confirmedAt:new Date().toISOString()};
  if(!await store.put(key,doc.revision,data,{kind:'membership',ownerId:String(user._id),schoolId}))privacy.fail('Membership changed. Refresh and retry.',409);
  return {schoolId,...data};
}
async function roster(user,schoolId){
  const s=await school(schoolId);
  if(!active(s.data))privacy.fail('School subscription is not active.',403,'SCHOOL_INACTIVE');
  const staff=user.role==='admin'?{role:'platform_admin',classIds:[]}: (await store.get('membership:'+schoolId+':'+user._id))?.data;
  if(user.role!=='admin'&&(!privacy.ready(user)||staff?.status!=='active'||!staff.sharing||!['school_admin','teacher'].includes(staff.role)))privacy.fail('This school workspace is not available to your account.',403,'SCHOOL_ACCESS_DENIED');
  const members=await store.list({kind:'membership',schoolId});
  const allowed=members.filter(d=>d.data.status==='active'&&d.data.sharing&&d.data.role==='student'&&(staff.role!=='teacher'||d.data.classIds.some(c=>staff.classIds.includes(c))));
  const rows=[];
  for(const doc of allowed){
    const learner=await User.findById(doc.ownerId).select('-password');
    if(!learner||learner.accountStatus!=='active'||!privacy.ready(learner))continue;
    if(learner.privacy?.guardianId){const g=(await store.get('guardian:'+learner.privacy.guardianId))?.data;if(!g||g.status!=='used'||g.schoolId!==schoolId||g.schoolSharing!==true)continue;}
    const state=await getState(learner._id);
    rows.push({userId:String(learner._id),name:learner.name,classIds:doc.data.classIds,progress:state.state.progress,updatedAt:state.updatedAt});
  }
  return {school:{id:schoolId,name:s.data.name},role:staff.role,students:rows};
}
async function hasEntitlement(user){
  if(!privacy.ready(user))return false;
  const guardian=user.privacy?.guardianId?await privacy.currentGuardian(user):null;
  if(user.privacy?.guardianId&&(!guardian||guardian.status!=='used'||guardian.userId!==String(user._id)))return false;
  for(const m of await store.list({kind:'membership',ownerId:String(user._id)})){
    if(m.data.status!=='active'||!m.data.sharing)continue;
    if(guardian&&(guardian.schoolId!==m.schoolId||guardian.schoolSharing!==true))continue;
    const s=await store.get('school:'+m.schoolId);if(s&&active(s.data))return true;
  }
  return false;
}
module.exports={list,save,membership,share,roster,hasEntitlement};
