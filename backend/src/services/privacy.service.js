const crypto=require('node:crypto');
const {User,AdminLog}=require('../data/modelProvider');
const store=require('./governanceStore');
const legal=require('../../../shared/legal-version.json');
const fail=(message,statusCode=400,code='PRIVACY_INVALID')=>{throw Object.assign(new Error(message),{statusCode,code});};
const text=(value,max=200)=>typeof value==='string'?value.trim().slice(0,max):'';
const email=value=>text(value,254).toLowerCase();
const isEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const iso=()=>new Date().toISOString();
const guardianHeadKey=value=>'guardian-head:'+hash(email(value));
async function currentGuardian(user){
  if(!user.privacy?.guardianId)return null;
  const g=(await store.get('guardian:'+user.privacy.guardianId))?.data;
  const head=(await store.get(guardianHeadKey(user.email)))?.data;
  return g?.status==='used'&&g.userId===String(user._id)&&head?.currentId===user.privacy.guardianId?g:null;
}
const defaults={operator:'',address:'',privacyEmail:'',privacyContactName:'',hostingDetails:'',providerRetention:'',approved:false,minorAIApproved:false,minorAIReviewReference:'',backupRetentionDays:30};
function settingsReady(s) {return Boolean(s.approved&&s.operator&&s.address&&isEmail(s.privacyEmail)&&s.hostingDetails&&s.providerRetention);}
async function settings() {const doc=await store.get('privacy:settings');return {...defaults,...(doc?.data || {}),revision:doc?.revision || 0,version:legal.version};}
async function publishSettings(body,admin) {
  const current=await settings();
  if(body.revision!==current.revision)fail('Privacy settings changed. Refresh before saving.',409);
  const data={operator:text(body.operator),address:text(body.address,500),privacyEmail:email(body.privacyEmail),privacyContactName:text(body.privacyContactName),hostingDetails:text(body.hostingDetails,1500),providerRetention:text(body.providerRetention,1500),approved:body.approved===true,minorAIApproved:body.minorAIApproved===true,minorAIReviewReference:text(body.minorAIReviewReference),backupRetentionDays:body.backupRetentionDays};
  if(!Number.isInteger(data.backupRetentionDays)||data.backupRetentionDays<1||data.backupRetentionDays>365)fail('Enter the actual backup retention in days (1–365).');
  if(data.privacyEmail&&!isEmail(data.privacyEmail))fail('Enter a valid monitored privacy email.');
  if(data.approved&&!settingsReady(data))fail('Complete the operator, address, privacy email, hosting and provider retention details before publication.');
  if(data.minorAIApproved&&!data.minorAIReviewReference)fail('Record the child AI/provider and impact assessment approval reference first.');
  data.approvedBy=String(admin._id);data.approvedAt=iso();
  if(!await store.put('privacy:settings',current.revision,data,{kind:'settings'}))fail('Refresh privacy settings and retry.',409);
  await audit(admin,'PRIVACY_SETTINGS_UPDATED',null,{version:legal.version});return settings();
}
async function requirePublished() {const s=await settings();if(!settingsReady(s))fail('ChemWiz privacy setup is awaiting publication by the administrator. You can still sign in and contact support.',503,'PRIVACY_SETUP_REQUIRED');return s;}
function ready(user) {const p=user?.privacy;return user?.role==='admin'||Boolean(p?.termsVersion===legal.version&&p?.noticeVersion===legal.version&&p?.coreConsent===true&&['adult','teen'].includes(p.ageBand)&&(!p.guardianId||(!p.guardianWithdrawn&&Date.parse(p.adultReviewAt)>Date.now())));}
function summary(user) {const p=user?.privacy || {};return {version:legal.version,ready:ready(user),ageBand:p.ageBand || 'unknown',aiConsent:p.aiConsent===true,voiceConsent:p.voiceConsent===true,guardianId:p.guardianId || null,adultReviewAt:p.adultReviewAt || null,termsVersion:p.termsVersion || null,noticeVersion:p.noticeVersion || null,updatedAt:p.updatedAt || null};}
async function audit(admin,action,targetUser,details={}) {await AdminLog.create({admin:admin?._id || null,targetUser:targetUser || null,action,details});}
function agreements(body) {
  if(body.version!==legal.version||body.acceptTerms!==true||body.acknowledgePrivacy!==true)fail('Read and accept the current terms and acknowledge the privacy notice.',400,'LEGAL_ACCEPTANCE_REQUIRED');
  if(!['adult','teen'].includes(body.ageBand))fail('Select your age group. Learner accounts currently support ages 13 and above.',400,'AGE_CONFIRMATION_REQUIRED');
}
async function preparePrivacy(body,accountEmail,previous) {
  agreements(body);await requirePublished();
  let guardian=null;
  if(body.ageBand==='teen') {
    const credential=text(body.guardianInvitation,200);
    if(!/^[a-f0-9]{24}\.[a-f0-9]{64}$/.test(credential))fail('A verified parent or guardian authorisation is required before a child account can be activated.',403,'GUARDIAN_REQUIRED');
    const [id,token]=credential.split('.');const doc=await store.get('guardian:'+id),g=doc?.data;
    const head=(await store.get(guardianHeadKey(accountEmail)))?.data;
    if(head?.currentId!==id||!g||g.status!=='approved'||g.childEmail!==accountEmail||g.invitationHash!==hash(token)||Date.parse(g.invitationExpiresAt)<=Date.now()||Date.parse(g.adultReviewAt)<=Date.now()||g.userId&&g.userId!==String(previous?._id))fail('This guardian invitation is invalid, expired or already used.',403,'GUARDIAN_REQUIRED');
    guardian={doc,id,g};
  } else if(previous?.privacy?.guardianId&&Date.parse(previous.privacy.adultReviewAt)>Date.now())fail('This verified child account needs a guardian review before changing its age group.',403,'GUARDIAN_REQUIRED');
  return {value:{ageBand:body.ageBand,coreConsent:true,termsVersion:legal.version,noticeVersion:legal.version,acceptedAt:iso(),updatedAt:iso(),aiConsent:body.aiConsent===true&&(!guardian||guardian.g.aiConsent===true),voiceConsent:body.voiceConsent===true&&body.aiConsent===true&&(!guardian||guardian.g.voiceConsent===true&&guardian.g.aiConsent===true),guardianId:guardian?.id || null,guardianWithdrawn:false,adultReviewAt:guardian?.g.adultReviewAt || null},guardian};
}
async function recordConsent(userId,value,event) {const s=await settings();await store.put('consent:'+store.id(),0,{event,version:legal.version,settingsRevision:s.revision,recordedAt:iso(),choices:summary({role:'student',privacy:value})},{kind:'consent',ownerId:String(userId)});}
async function consumeGuardian(prepared,userId) {
  if(!prepared.guardian)return;
  const {doc,id,g}=prepared.guardian;
  await store.mutate(guardianHeadKey(g.childEmail),head=>{if(head?.currentId!==id)fail('This guardian authorisation has changed. Ask support for its current invitation.',403,'GUARDIAN_REQUIRED');return head;},{kind:'guardian-head',ownerId:String(userId)});
  const saved=await store.put('guardian:'+id,doc.revision,{...g,status:'used',userId:String(userId),usedAt:iso(),invitationHash:null},{kind:'guardian',ownerId:String(userId)});
  if(!saved)fail('The guardian invitation was used in another session. Ask support to review this account.',409,'GUARDIAN_CONFLICT');
}
async function onboard(user,body) {
  const prepared=await preparePrivacy(body,email(user.email),user);
  await consumeGuardian(prepared,user._id);
  await recordConsent(user._id,prepared.value,'onboarding');
  const updated=await User.findOneAndUpdate({_id:user._id},{$set:{privacy:prepared.value}},{new:true});
  await audit(null,'PRIVACY_ACCEPTED',user._id,{version:legal.version,ageBand:prepared.value.ageBand});return summary(updated);
}
async function preferences(user,body) {
  if(!ready(user))fail('Complete account onboarding first.',403,'PRIVACY_ONBOARDING_REQUIRED');
  const p={...user.privacy};
  if(!p.ageBand)fail('Use a learner account to change learner privacy choices.');
  const s=await settings();let guardian;
  if(p.guardianId){guardian=(await store.get('guardian:'+p.guardianId))?.data;if(!guardian||guardian.status!=='used'||guardian.withdrawnAt)fail('Guardian approval needs review.',403,'GUARDIAN_REQUIRED');}
  p.aiConsent=body.aiConsent===true&&(!guardian||guardian.aiConsent===true&&s.minorAIApproved);
  p.voiceConsent=body.voiceConsent===true&&p.aiConsent&&(!guardian||guardian.voiceConsent===true&&s.minorAIApproved);p.updatedAt=iso();
  await recordConsent(user._id,p,'optional-choices');
  return summary(await User.findOneAndUpdate({_id:user._id},{$set:{privacy:p}},{new:true}));
}
async function authoriseGuardian(admin,body) {
  await requirePublished();
  const parentEmail=email(body.parentEmail),childEmail=email(body.childEmail),parentName=text(body.parentName),verificationReference=text(body.verificationReference),signedAt=text(body.signedAt,40),adultReviewAt=text(body.adultReviewAt,40);
  const latestBirthday=new Date();latestBirthday.setUTCFullYear(latestBirthday.getUTCFullYear()+5);
  if(!parentName||!isEmail(parentEmail)||!isEmail(childEmail)||parentEmail===childEmail||!verificationReference||body.writtenConsentVerified!==true||!Number.isFinite(Date.parse(signedAt))||Date.parse(signedAt)>Date.now()||!Number.isFinite(Date.parse(adultReviewAt))||Date.parse(adultReviewAt)<=Date.now()||Date.parse(adultReviewAt)>latestBirthday.getTime())fail('Record verified written guardian consent, distinct parent/child emails, a verification reference, signed date and the learner’s 18th birthday (within five years).');
  const schoolId=text(body.schoolId,24);
  if(schoolId&&!await store.get('school:'+schoolId))fail('Choose a configured school.');
  const id=store.id(),token=crypto.randomBytes(32).toString('hex');
  await store.put('guardian:'+id,0,{parentName,parentEmail,childEmail,verificationReference,signedAt,adultReviewAt,schoolId,schoolSharing:body.schoolSharing===true&&Boolean(schoolId),version:legal.version,reviewerId:String(admin._id),reviewedAt:iso(),status:'approved',aiConsent:body.aiConsent===true,voiceConsent:body.voiceConsent===true&&body.aiConsent===true,invitationHash:hash(token),invitationExpiresAt:new Date(Date.now()+7*86400000).toISOString()},{kind:'guardian'});
  let previousId;
  await store.mutate(guardianHeadKey(childEmail),head=>{previousId=head?.currentId;return {currentId:id,updatedAt:iso()};},{kind:'guardian-head'});
  if(previousId&&previousId!==id)await store.mutate('guardian:'+previousId,g=>({...g,previousStatus:g.status,status:'superseded',supersededAt:iso(),invitationHash:null}),{kind:'guardian'});
  await audit(admin,'GUARDIAN_AUTHORISED',null,{guardianId:id});return {id,invitation:id+'.'+token,expiresIn:'7 days'};
}
async function revokeGuardian(admin,id) {
  if(!/^[a-f0-9]{24}$/.test(id))fail('Invalid authorisation identifier.');
  const doc=await store.get('guardian:'+id);if(!doc)fail('Authorisation not found.',404);
  await store.mutate(guardianHeadKey(doc.data.childEmail),head=>head?.currentId===id?{currentId:null,withdrawnAt:iso()}:head || {currentId:null},{kind:'guardian-head'});
  await store.mutate(doc.key,g=>({...g,status:'withdrawn',withdrawnAt:iso(),invitationHash:null}),{kind:'guardian'});
  if(doc.data.userId){const user=await User.findById(doc.data.userId);if(user&&user.privacy?.guardianId===id&&Date.parse(user.privacy.adultReviewAt)>Date.now())await User.findOneAndUpdate({_id:user._id},{$set:{privacy:{...user.privacy,coreConsent:false,aiConsent:false,voiceConsent:false,guardianWithdrawn:true,updatedAt:iso()}}},{new:true});}
  await audit(admin,'GUARDIAN_WITHDRAWN',doc.data.userId,{guardianId:id});return {success:true};
}
async function request(user,body) {
  const type=text(body.type,30),detail=text(body.detail,1000);
  if(!['access','correction','deletion','withdrawal','complaint'].includes(type)||!detail)fail('Select a request type and provide a short explanation. Do not include identity documents or passwords.');
  const open=(await store.list({kind:'privacy-request',ownerId:String(user._id)})).filter(d=>['submitted','in-review','approved'].includes(d.data.status));
  if(open.length>=5)fail('Please wait for your open requests to be reviewed.',429);
  if(type==='withdrawal'){await User.findOneAndUpdate({_id:user._id},{$set:{privacy:{...user.privacy,coreConsent:false,aiConsent:false,voiceConsent:false,updatedAt:iso()}}},{new:true});for(const membership of await store.list({kind:'membership',ownerId:String(user._id)}))await store.mutate(membership.key,data=>({...data,sharing:false,status:data.status==='revoked'?'revoked':'pending'}),{kind:'membership',ownerId:String(user._id),schoolId:membership.schoolId});}
  const id=store.id();await store.put('request:'+id,0,{type,detail,status:'submitted',submittedAt:iso(),version:legal.version},{kind:'privacy-request',ownerId:String(user._id)});
  return {id,status:'submitted',message:'Your request has been recorded. The privacy team will review your identity, authority and any retention requirements.'};
}
async function exportAccount(user) {
  const {getState}=require('./learningState.service');
  const memberships=await store.list({kind:'membership',ownerId:String(user._id)});
  const requests=await store.list({kind:'privacy-request',ownerId:String(user._id)});
  return {exportedAt:iso(),account:{id:String(user._id),name:user.name,email:user.email,role:user.role,level:user.level,subscriptionTier:user.subscriptionTier,subscriptionStatus:user.subscriptionStatus,subscriptionExpiresAt:user.subscriptionExpiresAt,accountStatus:user.accountStatus,createdAt:user.createdAt,tutorUsage:user.tutorUsage,privacy:summary(user)},learning:await getState(user._id),schoolMemberships:memberships.map(d=>({schoolId:d.schoolId,...d.data})),consentHistory:(await store.list({kind:'consent',ownerId:String(user._id)})).map(d=>d.data),requests:requests.map(d=>({id:d.key.slice(8),...d.data}))};
}
async function reviewRequest(admin,id,body) {
  const key='request:'+id,doc=await store.get(key);if(!doc)fail('Request not found.',404);
  if(!['in-review','completed','rejected','approve-deletion'].includes(body.action)||!text(body.note,1000))fail('Select a review action and record a non-sensitive outcome note.');
  if(doc.data.status==='approved'&&body.action!=='approve-deletion')fail('Scheduled deletion is completed by the retention procedure; it cannot be closed as an ordinary request.');
  let deletionUser=null;
  const data={...doc.data,reviewedAt:iso(),reviewerId:String(admin._id),outcome:text(body.note,1000)};
  if(body.action==='approve-deletion') {
    if(data.type!=='deletion'||body.confirmUserId!==doc.ownerId)fail('Confirm the exact account identifier before approving deletion.');
    const user=await User.findById(doc.ownerId);
    if(!user)fail('Account not found.',404);
    if(user.role==='admin')fail('Administrator deletion requires a separate controlled staff handover.');
    data.status='approved';data.deleteAfter=new Date(Date.now()+24*3600000).toISOString();
    deletionUser=user;
  }else data.status=body.action;
  if(!await store.put(key,doc.revision,data,{kind:'privacy-request',ownerId:doc.ownerId}))fail('This request changed. Refresh and review again.',409);
  if(deletionUser){const user=deletionUser;const updated=await User.findOneAndUpdate({_id:user._id,role:{$ne:'admin'}},{$set:{accountStatus:'disabled',authVersion:(user.authVersion || 0)+1,passwordReset:null,privacy:{...user.privacy,coreConsent:false,aiConsent:false,voiceConsent:false,deletionApprovedAt:iso()}}},{new:true});if(!updated)fail('Account changed during review. Refresh the request and review eligibility again.',409);}
  await audit(admin,'PRIVACY_REQUEST_REVIEWED',doc.ownerId,{requestId:id,status:data.status});return {id,...data};
}
module.exports={guardianHeadKey,currentGuardian,recordConsent,legal,fail,text,email,isEmail,settings,settingsReady,publishSettings,requirePublished,ready,summary,preparePrivacy,consumeGuardian,onboard,preferences,authoriseGuardian,revokeGuardian,request,exportAccount,reviewRequest,audit};
