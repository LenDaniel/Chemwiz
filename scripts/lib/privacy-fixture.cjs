// Synthetic, isolated test records only. This module is never loaded by the app.
const fs=require('node:fs');
const legal=require('../../shared/legal-version.json');
const adultOnboarding=()=>({version:legal.version,ageBand:'adult',acceptTerms:true,acknowledgePrivacy:true,aiConsent:true,voiceConsent:true});
const acceptedPrivacy=()=>({ageBand:'adult',coreConsent:true,termsVersion:legal.version,noticeVersion:legal.version,aiConsent:true,voiceConsent:true,acceptedAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
function seedPrivacyFixture(filename){
  const data=fs.existsSync(filename)?JSON.parse(fs.readFileSync(filename,'utf8')):{users:[],adminLogs:[],learningStates:[],governance:[]};
  data.governance=[...(data.governance || []).filter(d=>d.key!=='privacy:settings'),{key:'privacy:settings',kind:'settings',ownerId:'',schoolId:'',revision:1,data:{operator:'ChemWiz synthetic test operator',address:'Synthetic test address, Zimbabwe',privacyEmail:'privacy@build-gate.test',privacyContactName:'Fixture privacy team',hostingDetails:'Synthetic local fixture only. No live provider or database connections.',providerRetention:'No external provider delivery in this fixture.',approved:true,minorAIApproved:false,minorAIReviewReference:'',backupRetentionDays:30}}];
  fs.writeFileSync(filename,JSON.stringify(data),{mode:0o600});
}
module.exports={adultOnboarding,acceptedPrivacy,seedPrivacyFixture};
