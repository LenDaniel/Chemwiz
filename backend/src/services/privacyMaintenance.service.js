const store=require('./governanceStore');
const {User}=require('../data/modelProvider');
const {guardianHeadKey}=require('./privacy.service');
const {getDataMode}=require('../config/runtime');
async function eraseMongo(userId,requestKey,now) {
  const mongoose=require('mongoose');
  const session=await mongoose.startSession();
  try{
    await session.withTransaction(async()=>{
      const Governance=require('../models/Governance'),LearningState=require('../models/LearningState'),AdminLog=require('../models/AdminLog');
      const request=await Governance.findOne({key:requestKey,ownerId:String(userId)}).session(session).lean();
      if(!request||request.data.status!=='approved'||!Number.isFinite(Date.parse(request.data.deleteAfter))||Date.parse(request.data.deleteAfter)>now)throw new Error('Deletion request changed or is not due.');
      const user=await User.findById(userId).session(session).lean();
      if(!user||user.role==='admin'||user.accountStatus!=='disabled'||!user.privacy?.deletionApprovedAt)throw new Error('Account is not eligible for erasure.');
      await LearningState.deleteMany({userId}).session(session);
      await Governance.deleteMany({$or:[{ownerId:String(userId)},{kind:'guardian','data.childEmail':user.email},{key:requestKey},{key:guardianHeadKey(user.email)}]}).session(session);
      await Governance.updateMany({kind:'school'},{$pull:{'data.reservedUserIds':String(userId)}}).session(session);
      await AdminLog.updateMany({targetUser:userId},{$set:{targetUser:null,details:{redactedAt:new Date().toISOString(),reason:'Approved account erasure'}}}).session(session);
      await User.deleteOne({_id:userId,accountStatus:'disabled'}).session(session);
      await Governance.create([{key:'erasure:'+store.id(),kind:'erasure-receipt',ownerId:'',schoolId:'',revision:1,data:{requestId:requestKey.slice(8),completedAt:new Date().toISOString()}}],{session});
    });
  }finally{await session.endSession();}
}
async function runMaintenance({apply=false,now=Date.now()}={}){
  const results=[];
  for(const doc of await store.list({kind:'privacy-request'})){
    if(doc.data.type!=='deletion'||doc.data.status!=='approved'||!Number.isFinite(Date.parse(doc.data.deleteAfter))||Date.parse(doc.data.deleteAfter)>now)continue;
    const user=await User.findById(doc.ownerId);
    if(!user||user.role==='admin'||user.accountStatus!=='disabled'||!user.privacy?.deletionApprovedAt){results.push({requestId:doc.key.slice(8),action:'held',reason:'Account eligibility needs review.'});continue;}
    const dependent=(await store.list({kind:'guardian'})).some(g=>g.data.parentEmail===user.email&&g.data.userId!==String(user._id));
    if(dependent){results.push({requestId:doc.key.slice(8),action:'held',reason:'Guardian authority for another learner needs a retention review.'});continue;}
    if(apply){if(getDataMode()==='local')require('../data/localModels').eraseLocalAccount(String(user._id),doc.key,now);else await eraseMongo(String(user._id),doc.key,now);}
    results.push({requestId:doc.key.slice(8),action:apply?'erased':'would-erase'});
  }
  for(const doc of await store.list({kind:'guardian'})){
    if(doc.data.status!=='approved'||!Number.isFinite(Date.parse(doc.data.invitationExpiresAt))||Date.parse(doc.data.invitationExpiresAt)>now-23*86400000)continue;
    if(apply){await store.put(doc.key,doc.revision,{status:'expired',reviewedAt:doc.data.reviewedAt,redactedAt:new Date(now).toISOString(),version:doc.data.version},{kind:'guardian'});const head=await store.get(guardianHeadKey(doc.data.childEmail));if(head?.data.currentId===doc.key.slice(9))await store.remove(head.key,head.revision);}
    results.push({guardianId:doc.key.slice(9),action:apply?'expired-invitation-redacted':'would-redact-expired-invitation'});
  }
  return {mode:apply?'apply':'dry-run',results,backups:'Backups, mailboxes, provider records and exported copies require the operator’s separate retention procedure. This tool does not erase external copies.'};
}
module.exports={runMaintenance};
