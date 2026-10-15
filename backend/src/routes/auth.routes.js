const { hasActiveSubscription } = require('../middleware/access.middleware');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');
const { User, dataMode } = require('../data/modelProvider');
const { protect } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter, recoveryLimiter } = require('../middleware/auth-limits');
const { passwordIssues, PASSWORD_POLICY_VERSION } = require('../../../shared/password-policy.mjs');
const { emailConfiguration, resetOrigin, sendPasswordReset, sendPasswordChanged } = require('../utils/email');
const router = express.Router();
const HOUR = 60 * 60 * 1000;
const GENERIC_RESET = 'If an active account uses that email, a reset link and code will be sent. They expire in one hour. Check your spam folder or contact the WhatsApp helpline if the email does not arrive.';
const emailValue = value => typeof value === 'string' && value.length <= 254 ? value.trim().toLowerCase() : '';
const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const active = user => !['suspended','disabled'].includes(user.accountStatus);
async function accountByEmail(email,includeReset=false) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const query = User.find({email:{$regex:`^${escaped}$`,$options:'i'}}).limit(2);
  if(includeReset) query.select('+passwordReset');
  const matches = await query;
  return matches.length === 1 ? matches[0] : null;
}
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const codeDigest = (userId,tokenHash,code) => crypto.createHmac('sha256',process.env.JWT_SECRET).update(`${userId}|${tokenHash}|${code}`).digest('hex');
function accessToken(user) { return jwt.sign({id:user._id,role:user.role,purpose:'access',authVersion:user.authVersion || 0},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN || '7d'}); }
function invalidReset(res) { return res.status(400).json({code:'RESET_INVALID_OR_EXPIRED',message:'This reset link or code is invalid, expired or already used. Request a new one.'}); }
function checkNewPassword(body,res) {
  const issues = passwordIssues(body.newPassword);
  if (issues.length) { res.status(400).json({code:'PASSWORD_POLICY',message:issues.join(' ')}); return false; }
  if (body.newPassword !== body.confirmPassword) { res.status(400).json({code:'PASSWORD_CONFIRMATION',message:'The new passwords do not match.'}); return false; }
  return true;
}
async function notifyChanged(user) {
  try { await sendPasswordChanged({email:user.email,name:user.name}); }
  catch(error) { console.error('Password notification failed:',{code:error.code || 'EMAIL_DELIVERY_FAILED'}); }
}
const formatUser = (user) => {
  const expiry = user.subscriptionExpiresAt || null;
  const isExpired =
    expiry && new Date(expiry).getTime() < Date.now();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    subscriptionTier: user.subscriptionTier || "free",
    subscriptionStatus: isExpired ? "expired" : user.subscriptionStatus || "active",
    subscriptionExpiresAt: expiry,
    trialStartedAt: user.trialStartedAt || null,
    accountStatus: user.accountStatus || "active",
    access: {
      isPremium: hasActiveSubscription(user),
      isExpired: Boolean(isExpired),
      canUseTutor: hasActiveSubscription(user),
      canUseStructured: hasActiveSubscription(user),
      canUseWorkedExamples: hasActiveSubscription(user),
    },
  };
};

router.post("/register", registerLimiter, async (req,res) => {
  try {
    const { name, password } = req.body;
    const email = emailValue(req.body.email);
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || !emailValid(email) || typeof password !== 'string') return res.status(400).json({message:'A name, valid email and password are required.'});
    const issues = passwordIssues(password);
    if (issues.length) return res.status(400).json({code:'PASSWORD_POLICY',message:issues.join(' ')});
    const escaped = email.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if (await User.findOne({email:{$regex:`^${escaped}$`,$options:'i'}})) return res.status(409).json({message:'An account with this email already exists.'});
    if (dataMode === 'mongodb') await User.init();
    const user = await User.create({name:name.trim(),email,password:await bcrypt.hash(password,12),passwordPolicyVersion:PASSWORD_POLICY_VERSION,authVersion:0});
    return res.status(201).json({message:'Account created successfully.',token:accessToken(user),user:formatUser(user)});
  } catch(error) {
    if (error.code === 11000) return res.status(409).json({message:'An account with this email already exists.'});
    console.error('Register error:',{name:error.name,code:error.code});
    return res.status(500).json({message:'Server error while creating account.'});
  }
});

router.post("/login", loginLimiter, async (req,res) => {
  try {
    const email = emailValue(req.body.email), password = req.body.password;
    if (!emailValid(email) || typeof password !== 'string' || !password || password.length > 1024) return res.status(400).json({message:'Email and password are required.'});
    let user = await accountByEmail(email);
    // A dummy bcrypt comparison avoids the fast account-not-found path.
    const valid = await bcrypt.compare(password,user?.password || "$2b$12$usaWQAUh/UR5nlUyUroSYuJ0k9u9ga8PeGcqNZUiShs7cF8E.Wwsi");
    if (!user || !valid) return res.status(401).json({code:'INVALID_CREDENTIALS',message:'Invalid email or password.'});
    if (!active(user)) return res.status(403).json({code:user.accountStatus === 'suspended' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_DISABLED',message:'This account is not active. Contact ChemWiz support.'});
    if (passwordIssues(password).length) {
      const upgradeToken = jwt.sign({id:user._id,purpose:'password-upgrade',authVersion:user.authVersion || 0,passwordDigest:digest(user.password)},process.env.JWT_SECRET,{expiresIn:'15m'});
      return res.status(403).json({code:'PASSWORD_UPGRADE_REQUIRED',upgradeToken,message:'Your current password needs an upgrade. Set a stronger password before opening your workspace.'});
    }
    if (user.passwordPolicyVersion !== PASSWORD_POLICY_VERSION) {
      user = await User.findOneAndUpdate({_id:user._id,password:user.password},{$set:{passwordPolicyVersion:PASSWORD_POLICY_VERSION}},{new:true});
      if (!user) return res.status(401).json({message:'Your credentials changed. Sign in again.'});
    }
    return res.json({message:'Login successful.',token:accessToken(user),user:formatUser(user)});
  } catch(error) {
    console.error('Login error:',{name:error.name,code:error.code});
    return res.status(500).json({message:'Server error while logging in.'});
  }
});

router.post('/forgot-password', recoveryLimiter, async (req,res) => {
  const started = Date.now();
  const email = emailValue(req.body.email);
  if (!emailValid(email)) return res.status(400).json({message:'Enter a valid email address.'});
  try {
    if (!emailConfiguration().configured) return res.status(503).json({code:'EMAIL_CONFIGURATION_MISSING',message:'Account recovery email is not configured yet. Contact ChemWiz on WhatsApp: +263 718 645 362.'});
    resetOrigin(); // Validate trusted configuration before looking up any account.
    const user = await accountByEmail(email,true);
    const now = Date.now();
    if (user && active(user) && !(user.passwordReset?.requestedAt && now-new Date(user.passwordReset.requestedAt).getTime() < 60000)) {
      const token = crypto.randomBytes(32).toString('hex');
      const code = String(crypto.randomInt(10000000,100000000));
      const tokenHash = digest(token);
      const reset = {tokenHash,codeHash:codeDigest(user._id,tokenHash,code),requestedAt:new Date(now).toISOString(),expiresAt:new Date(now+HOUR).toISOString(),attempts:0};
      const updated = await User.findOneAndUpdate({_id:user._id,password:user.password,'passwordReset.tokenHash':user.passwordReset?.tokenHash || null},{$set:{passwordReset:reset}},{new:true});
      if (updated) {
        try { await sendPasswordReset({email:user.email,name:user.name,token,code,workspace:req.body.workspace,expiresAt:reset.expiresAt},{deadline:started+2500}); }
        catch(error) {
          // Keep account existence and provider outcomes out of public replies.
          console.error('Password recovery email failed:',{code:error.code || 'EMAIL_DELIVERY_FAILED'});
          await User.findOneAndUpdate({_id:user._id,'passwordReset.tokenHash':tokenHash},{$set:{passwordReset:null}},{new:true});
        }
      }
    }
    await delay(Math.max(0,3000-(Date.now()-started)));
    return res.status(202).json({message:GENERIC_RESET});
  } catch(error) {
    console.error('Recovery request failed:',{code:error.code || 'RECOVERY_FAILED'});
    if (error.code === 'EMAIL_CONFIGURATION_MISSING') return res.status(503).json({code:error.code,message:error.message});
    await delay(Math.max(0,3000-(Date.now()-started)));
    return res.status(202).json({message:GENERIC_RESET});
  }
});

router.post('/reset-password', recoveryLimiter, async (req,res) => {
  try {
    const { token, code } = req.body;
    const email = emailValue(req.body.email);
    const hasToken = typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
    const hasCode = typeof code === 'string' && /^[0-9]{8}$/.test(code) && emailValid(email);
    if (!hasToken && !hasCode) return invalidReset(res);
    const filter = hasToken ? {'passwordReset.tokenHash':digest(token)} : {email};
    const user = hasToken ? await User.findOne(filter).select('+passwordReset') : await accountByEmail(email,true);
    const reset = user?.passwordReset;
    if (!user || !active(user) || !reset || Date.parse(reset.expiresAt) <= Date.now() || reset.attempts >= 5) return invalidReset(res);
    if (!hasToken && !crypto.timingSafeEqual(Buffer.from(reset.codeHash,'hex'),Buffer.from(codeDigest(user._id,reset.tokenHash,code),'hex'))) {
      await User.findOneAndUpdate({_id:user._id,'passwordReset.tokenHash':reset.tokenHash,'passwordReset.attempts':{$lt:5}},{$inc:{'passwordReset.attempts':1}},{new:true});
      return invalidReset(res);
    }
    if (!checkNewPassword(req.body,res)) return;
    const password = await bcrypt.hash(req.body.newPassword,12);
    const changed = await User.findOneAndUpdate({_id:user._id,password:user.password,'passwordReset.tokenHash':reset.tokenHash,'passwordReset.expiresAt':{$gt:new Date().toISOString()},'passwordReset.attempts':{$lt:5}},
      {$set:{password,passwordPolicyVersion:PASSWORD_POLICY_VERSION,authVersion:(user.authVersion || 0)+1,passwordReset:null}},{new:true});
    if (!changed) return invalidReset(res);
    await notifyChanged(changed);
    return res.json({message:'Password reset successfully. Sign in with your new password. Existing sessions have been signed out.'});
  } catch(error) {
    console.error('Password reset failed:',{name:error.name,code:error.code});
    return res.status(400).json({code:'RESET_INVALID_OR_EXPIRED',message:'This reset link or code could not be used. Request a new one.'});
  }
});

router.post('/upgrade-password', recoveryLimiter, async (req,res) => {
  try {
    if (typeof req.body.upgradeToken !== 'string') return res.status(401).json({message:'Sign in again to update your password.'});
    const decoded = jwt.verify(req.body.upgradeToken,process.env.JWT_SECRET);
    if (decoded.purpose !== 'password-upgrade') return res.status(401).json({message:'Sign in again to update your password.'});
    const user = await User.findById(decoded.id);
    if (!user || !active(user) || decoded.authVersion !== (user.authVersion || 0) || decoded.passwordDigest !== digest(user.password)) return res.status(401).json({message:'This password upgrade has expired. Sign in again.'});
    if (!checkNewPassword(req.body,res)) return;
    const password = await bcrypt.hash(req.body.newPassword,12);
    const changed = await User.findOneAndUpdate({_id:user._id,password:user.password},{$set:{password,passwordPolicyVersion:PASSWORD_POLICY_VERSION,authVersion:(user.authVersion || 0)+1,passwordReset:null}},{new:true});
    if (!changed) return res.status(401).json({message:'Sign in again to update your password.'});
    await notifyChanged(changed);
    return res.json({message:'Password updated. Sign in with your new password.'});
  } catch { return res.status(401).json({message:'This password upgrade has expired. Sign in again.'}); }
});
router.get('/me',protect,async(req,res)=>res.json({user:formatUser(req.user)}));
module.exports = router;
