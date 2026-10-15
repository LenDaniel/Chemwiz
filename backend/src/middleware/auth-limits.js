const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { createHash } = require('node:crypto');
function accountKey(req) {
  const value = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase().slice(0,254) : '';
  return createHash('sha256').update(value || ipKeyGenerator(req.ip || '127.0.0.1')).digest('hex');
}
function limiter(limit, windowMs) {
  return rateLimit({limit,windowMs,standardHeaders:'draft-8',legacyHeaders:false,keyGenerator:accountKey,
    handler:(req,res)=>res.status(429).json({code:'AUTH_RATE_LIMITED',message:'Too many attempts. Please wait before trying again.'})});
}
const loginLimiter = limiter(20,15*60*1000);
const registerLimiter = limiter(10,15*60*1000);
const recoveryLimiter = limiter(req => typeof req.body?.email === 'string' ? 10 : 120,60*60*1000);
module.exports = { loginLimiter, registerLimiter, recoveryLimiter };
