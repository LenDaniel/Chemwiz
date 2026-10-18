const {adultOnboarding}=require('../scripts/lib/privacy-fixture.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {configureFixture}=require('../scripts/lib/fixture-config.cjs');
const fixture=configureFixture('password-recovery');
const {User,DATA_FILE}=require('../backend/src/data/localModels');
const {passwordIssues}=require('../shared/password-policy.mjs');
const {resetOrigin,sendPasswordReset}=require('../backend/src/utils/email');
let instance,base,sequence=0;
const original='Original-account-pass!2026',replacement='Replacement-account-pass!2026';
async function api(path,body,token,method='POST',headers={}){
 const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
 return {status:response.status,data:await response.json(),headers:response.headers};
}
async function account({role='student',password=original,legacy=false}={}){
 const email=`account-${++sequence}@recovery.test`;
 if(legacy||role==='admin') await User.create({name:'Preserved account',email,password:await bcrypt.hash(password,10),role,passwordPolicyVersion:legacy?0:1,subscriptionTier:role==='admin'?'admin':'premium'});
 else assert.equal((await api('/api/auth/register',{name:'Preserved account',email,password,onboarding:adultOnboarding()})).status,201);
 const login=await api('/api/auth/login',{email,password});
 return {email,password,login};
}
async function issue(user,workspace='student'){
 const result=await api('/api/auth/forgot-password',{email:user.email,workspace});assert.equal(result.status,202);
 const mail=fixture.emails.filter(item=>item.to_email===user.email).at(-1);assert.ok(mail);
 return {...mail,token:new URL(mail.reset_url).hash.slice(7)};
}
const resetBody=extra=>({newPassword:replacement,confirmPassword:replacement,...extra});
test.before(async()=>{instance=await require('../server').createApplication();await new Promise(resolve=>instance.server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+instance.server.address().port;});
test.after(async()=>{if(instance?.server.listening)await new Promise(resolve=>instance.server.close(resolve));fixture.cleanup();});

test('password policy rejects short, numberless, punctuation-free, common, repeated and oversized passwords',()=>{
 for(const password of ['Short1!','long-password-without-digits!','LongPassword2026','Password2026!','aaaaaaaaaaaa1!','é'.repeat(40)+'1!'])assert.ok(passwordIssues(password).length,password);
 assert.deepEqual(passwordIssues('River-stones-shine!2026'),[]);
 assert.deepEqual(passwordIssues(null).length>0,true);
});
test('public signup enforces policy, validates types and ignores injected security fields',async()=>{
 for(const password of ['simple123','LongPassword2026','Password2026!'])assert.equal((await api('/api/auth/register',{onboarding:adultOnboarding(),name:'Learner',email:'weak@recovery.test',password})).data.code,'PASSWORD_POLICY');
 assert.equal((await api('/api/auth/login',{email:{$ne:null},password:'anything'})).status,400);
 const result=await api('/api/auth/register',{onboarding:adultOnboarding(),name:'Learner',email:'new@recovery.test',password:original,role:'admin',authVersion:99,passwordReset:{tokenHash:'injected'}});
 assert.equal(result.status,201);assert.equal(result.data.user.role,'student');
 const stored=await User.findOne({email:'new@recovery.test'}).select('+passwordReset');assert.equal(stored.authVersion,0);assert.equal(stored.passwordReset,null);
});
test('known and unknown emails get the same generic reply; only hashes and one-hour expiry persist',async()=>{
 const user=await account();const known=await api('/api/auth/forgot-password',{email:user.email,workspace:'student'});
 const unknown=await api('/api/auth/forgot-password',{email:'missing@recovery.test'});assert.equal(known.status,202);assert.deepEqual(known.data,unknown.data);
 const mail=fixture.emails.find(item=>item.to_email===user.email);const token=new URL(mail.reset_url).hash.slice(7);
 const stored=await User.findOne({email:user.email}).select('+passwordReset');
 assert.equal(Date.parse(stored.passwordReset.expiresAt)-Date.parse(stored.passwordReset.requestedAt),3600000);
 assert.equal(mail.reset_code.length,8);assert.equal(token.length,64);assert.equal(new URL(mail.reset_url).search,'');
 const disk=fs.readFileSync(DATA_FILE,'utf8');assert.ok(!disk.includes(token));assert.notEqual(stored.passwordReset.codeHash,mail.reset_code);
 assert.equal((await User.findOne({email:user.email})).passwordReset,undefined);
 assert.equal((await api('/api/auth/me',null,user.login.data.token,'GET')).data.user.passwordReset,undefined);
});
test('a rapid resend keeps the current challenge without sending another email',async()=>{
 const user=await account();await issue(user);const before=fixture.emails.length;
 const first=(await User.findOne({email:user.email}).select('+passwordReset')).passwordReset.tokenHash;
 assert.equal((await api('/api/auth/forgot-password',{email:user.email})).status,202);
 assert.equal(fixture.emails.length,before);assert.equal((await User.findOne({email:user.email}).select('+passwordReset')).passwordReset.tokenHash,first);
});
test('link reset is single use under concurrent submissions and revokes existing sessions',async()=>{
 const user=await account({role:'admin'});const mail=await issue(user,'admin');
 const attempts=await Promise.all([api('/api/auth/reset-password',resetBody({token:mail.token})),api('/api/auth/reset-password',resetBody({token:mail.token}))]);
 assert.deepEqual(attempts.map(value=>value.status).sort(),[200,400]);assert.ok(attempts.every(value=>!value.data.token));
 assert.equal((await api('/api/auth/me',null,user.login.data.token,'GET')).data.code,'SESSION_REVOKED');
 assert.equal((await api('/api/auth/login',{email:user.email,password:original})).status,401);
 const signedIn=await api('/api/auth/login',{email:user.email,password:replacement});assert.equal(signedIn.status,200);assert.equal(signedIn.data.user.role,'admin');assert.equal(signedIn.data.user.subscriptionTier,'admin');
});
test('email and code reset accepts email casing and rejects replay',async()=>{
 const user=await account();const mail=await issue(user);
 assert.equal((await api('/api/auth/reset-password',resetBody({email:user.email.toUpperCase(),code:mail.reset_code}))).status,200);
 assert.equal((await api('/api/auth/reset-password',resetBody({email:user.email,code:mail.reset_code}))).status,400);
});
test('five wrong codes persistently exhaust the challenge without locking ordinary login',async()=>{
 const user=await account();const mail=await issue(user);const wrong=mail.reset_code==='11111111'?'22222222':'11111111';
 for(let i=0;i<5;i++)assert.equal((await api('/api/auth/reset-password',resetBody({email:user.email,code:wrong}))).status,400);
 assert.equal((await User.findOne({email:user.email}).select('+passwordReset')).passwordReset.attempts,5);
 assert.equal((await api('/api/auth/reset-password',resetBody({token:mail.token}))).status,400);
 assert.equal((await api('/api/auth/login',{email:user.email,password:original})).status,200);
});
test('expired reset credentials cannot change a password',async()=>{
 const user=await account();const mail=await issue(user);const stored=await User.findOne({email:user.email}).select('+passwordReset');
 await User.findOneAndUpdate({_id:stored._id},{$set:{passwordReset:{...stored.passwordReset,expiresAt:new Date(Date.now()-1).toISOString()}}},{new:true});
 assert.equal((await api('/api/auth/reset-password',resetBody({token:mail.token}))).status,400);
 assert.equal((await api('/api/auth/login',{email:user.email,password:original})).status,200);
});
test('resending after the cooldown invalidates the previous link',async()=>{
 const user=await account();const old=await issue(user);const stored=await User.findOne({email:user.email}).select('+passwordReset');
 await User.findOneAndUpdate({_id:stored._id},{$set:{passwordReset:{...stored.passwordReset,requestedAt:new Date(Date.now()-61000).toISOString()}}},{new:true});
 const newer=await issue(user);assert.notEqual(old.token,newer.token);
 assert.equal((await api('/api/auth/reset-password',resetBody({token:old.token}))).status,400);
 assert.equal((await api('/api/auth/reset-password',resetBody({token:newer.token}))).status,200);
});
test('expired upgrade capabilities are rejected and MongoDB recovery fields have safe defaults',async()=>{
 const user=await account({password:'weak123',legacy:true});
 const decoded=jwt.decode(user.login.data.upgradeToken);delete decoded.iat;delete decoded.exp;
 const expired=jwt.sign(decoded,process.env.JWT_SECRET,{expiresIn:-1});
 assert.equal((await api('/api/auth/upgrade-password',resetBody({upgradeToken:expired}))).status,401);
 const Model=require('../backend/src/models/User');
 assert.equal(Model.schema.path('passwordReset').options.select,false);
 assert.equal(Model.schema.path('authVersion').options.default,0);
 assert.equal(Model.schema.path('passwordPolicyVersion').options.default,0);
});
test('policy and confirmation failures leave a valid challenge usable',async()=>{
 const user=await account();const mail=await issue(user);
 assert.equal((await api('/api/auth/reset-password',{token:mail.token,newPassword:'simple123',confirmPassword:'simple123'})).data.code,'PASSWORD_POLICY');
 assert.equal((await api('/api/auth/reset-password',{token:mail.token,newPassword:replacement,confirmPassword:'Different-pass!2026'})).data.code,'PASSWORD_CONFIRMATION');
 assert.equal((await api('/api/auth/reset-password',resetBody({token:mail.token}))).status,200);
});
test('weak legacy admin passwords require a limited upgrade before workspace access',async()=>{
 const user=await account({role:'admin',password:'weak123',legacy:true});
 assert.equal(user.login.data.code,'PASSWORD_UPGRADE_REQUIRED');assert.ok(!user.login.data.token);
 const capability=user.login.data.upgradeToken;
 assert.equal((await api('/api/admin/test',null,capability,'GET')).status,401);
 assert.equal((await api('/api/auth/upgrade-password',{upgradeToken:capability,newPassword:'weak123',confirmPassword:'weak123'})).data.code,'PASSWORD_POLICY');
 assert.equal((await api('/api/auth/upgrade-password',resetBody({upgradeToken:capability}))).status,200);
 assert.equal((await api('/api/auth/upgrade-password',resetBody({upgradeToken:capability}))).status,401);
 const signedIn=await api('/api/auth/login',{email:user.email,password:replacement});assert.equal(signedIn.status,200);assert.equal(signedIn.data.user.role,'admin');
 assert.equal((await api('/api/admin/test',null,signedIn.data.token,'GET')).status,200);
});
test('unknown legacy sessions require reauthentication; access tokens cannot upgrade passwords',async()=>{
 const user=await account({password:'weak123',legacy:true});const stored=await User.findOne({email:user.email});
 const old=jwt.sign({id:stored._id,role:'student'},process.env.JWT_SECRET,{expiresIn:'1h'});
 assert.equal((await api('/api/auth/me',null,old,'GET')).data.code,'PASSWORD_REAUTH_REQUIRED');
 assert.equal((await api('/api/auth/upgrade-password',resetBody({upgradeToken:old}))).status,401);
 assert.equal((await api('/api/auth/login',{email:user.email,password:'wrong'})).status,401);
});
test('email casing is accepted and signup cannot duplicate an account',async()=>{
 const user=await account();
 assert.equal((await api('/api/auth/login',{email:user.email.toUpperCase(),password:original})).status,200);
 assert.equal((await api('/api/auth/register',{onboarding:adultOnboarding(),name:'Duplicate',email:user.email.toUpperCase(),password:original})).status,409);
});
test('inactive accounts cannot request or use recovery; normal account status is preserved',async()=>{
 const user=await account();const mail=await issue(user);const stored=await User.findOne({email:user.email});
 await User.findOneAndUpdate({_id:stored._id},{$set:{accountStatus:'suspended'}},{new:true});
 const before=fixture.emails.length;assert.equal((await api('/api/auth/forgot-password',{email:user.email})).status,202);assert.equal(fixture.emails.length,before);
 assert.equal((await api('/api/auth/reset-password',resetBody({token:mail.token}))).status,400);
});
test('delivery failure returns the generic response and clears its unusable challenge',async()=>{
 const user=await account();fixture.emailFailure=true;
 try{assert.equal((await api('/api/auth/forgot-password',{email:user.email})).status,202);}finally{fixture.emailFailure=false;}
 assert.equal((await User.findOne({email:user.email}).select('+passwordReset')).passwordReset,null);
 assert.equal((await api('/api/auth/login',{email:user.email,password:original})).status,200);
});
test('missing email configuration is a global error and leaves accounts unchanged',async()=>{
 const user=await account();const key=process.env.EMAILJS_PRIVATE_KEY;delete process.env.EMAILJS_PRIVATE_KEY;
 try{const known=await api('/api/auth/forgot-password',{email:user.email}),unknown=await api('/api/auth/forgot-password',{email:'not-registered@recovery.test'});assert.equal(known.status,503);assert.deepEqual(known.data,unknown.data);}finally{process.env.EMAILJS_PRIVATE_KEY=key;}
});
test('reset email uses trusted HTTPS configuration and ignores hostile return destinations',async()=>{
 const user=await account();await api('/api/auth/forgot-password',{email:user.email,workspace:'https://attacker.test'},null,'POST',{Host:'attacker.test'});
 const mail=fixture.emails.find(value=>value.to_email===user.email);assert.equal(new URL(mail.reset_url).origin,process.env.APP_URL);assert.equal(new URL(mail.reset_url).pathname,'/student/');
 assert.throws(()=>resetOrigin({APP_URL:'http://public.example',NODE_ENV:'production'}),/HTTPS/);
 assert.throws(()=>resetOrigin({APP_URL:'https://user:secret@example.test'}),/HTTPS/);
});
test('EmailJS transport sends the private key server-side and never includes passwords',async()=>{
 let payload;
 await sendPasswordReset({email:'recipient@recovery.test',name:'Recipient',token:'a'.repeat(64),code:'12345678',expiresAt:new Date(Date.now()+3600000).toISOString()},{fetcher:async(url,options)=>{assert.equal(url,'https://api.emailjs.com/api/v1.0/email/send');payload=JSON.parse(options.body);return new Response('OK',{status:200});}});
 assert.equal(payload.accessToken,'fixture-private');assert.ok(payload.template_params.reset_url.includes('#reset='));assert.equal(payload.template_params.password,undefined);
});
test('dedicated login throttling rejects repeated guessing with a retry response',async()=>{
 let result;for(let i=0;i<21;i++)result=await api('/api/auth/login',{email:'guessing@recovery.test',password:'wrong'});
 assert.equal(result.status,429);assert.equal(result.data.code,'AUTH_RATE_LIMITED');assert.ok(result.headers.get('ratelimit'));
});
test('a failed local password write leaves both persisted data and the active cache unchanged',async()=>{
 const user=await account();const stored=await User.findOne({email:user.email});const disk=fs.readFileSync(DATA_FILE,'utf8');
 const originalWrite=fs.writeFileSync;
 fs.writeFileSync=function(file,...args){if(String(file).startsWith(DATA_FILE+'.'))throw new Error('fixture disk-write failure');return originalWrite.call(this,file,...args);};
 try{await assert.rejects(User.findOneAndUpdate({_id:stored._id},{$set:{password:'uncommitted-fixture',authVersion:99}},{new:true}).exec(),/fixture disk-write failure/);}finally{fs.writeFileSync=originalWrite;}
 assert.equal(fs.readFileSync(DATA_FILE,'utf8'),disk);
 const after=await User.findById(stored._id);assert.equal(after.password,stored.password);assert.equal(after.authVersion,stored.authVersion);
 assert.equal((await api('/api/auth/login',{email:user.email,password:original})).status,200);
});
