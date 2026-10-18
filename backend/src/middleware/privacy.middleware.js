const privacy=require('../services/privacy.service');
async function validGuardian(user){return !user.privacy?.guardianId||Boolean(await privacy.currentGuardian(user));}
const requireLearningConsent=async(req,res,next)=>{
  try{
    if(!privacy.ready(req.user))return res.status(403).json({code:'PRIVACY_ONBOARDING_REQUIRED',message:'Complete your account privacy and age confirmation before learning.'});
    if(!await validGuardian(req.user))return res.status(403).json({code:'GUARDIAN_REQUIRED',message:'Your guardian authorisation needs review.'});
    if(req.user.role!=='admin')await privacy.requirePublished();
    next();
  }catch(error){next(error);}
};
const requireAIConsent=async(req,res,next)=>{
  try{
    if(req.user.role==='admin')return next();
    if(!privacy.ready(req.user))return res.status(403).json({code:'PRIVACY_ONBOARDING_REQUIRED',message:'Complete account onboarding before using Wiz.'});
    if(!await validGuardian(req.user))return res.status(403).json({code:'GUARDIAN_REQUIRED',message:'Your guardian authorisation needs review.'});
    const p=req.user.privacy,s=await privacy.requirePublished();
    if(!p.aiConsent)return res.status(403).json({code:'AI_CONSENT_REQUIRED',message:'Enable AI processing in Privacy and account choices before using Wiz.'});
    if(p.ageBand==='teen'&&!s.minorAIApproved)return res.status(403).json({code:'CHILD_AI_REVIEW_REQUIRED',message:'Wiz for child accounts is awaiting the required provider and safety review. Chemistry notes and tools remain available.'});
    const voicePath=req.originalUrl.split('?')[0].toLowerCase();
    if((voicePath.includes('/tutor/transcribe')||voicePath.includes('/tutor/live/'))&&!p.voiceConsent)return res.status(403).json({code:'VOICE_CONSENT_REQUIRED',message:'Enable optional voice processing in Privacy and account choices first.'});
    next();
  }catch(error){next(error);}
};
module.exports={requireLearningConsent,requireAIConsent};
