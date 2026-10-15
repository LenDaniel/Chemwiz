// EmailJS REST transport. Keep every credential on the backend/host.
const { setTimeout: delay } = require('node:timers/promises');
const ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
let nextSend = 0;
function emailConfiguration(env = process.env) {
  const names = ['EMAILJS_SERVICE_ID','EMAILJS_RESET_TEMPLATE_ID','EMAILJS_PUBLIC_KEY','EMAILJS_PRIVATE_KEY'];
  const missing = names.filter(name => !String(env[name] || '').trim());
  return { configured: !missing.length, missing };
}
function resetOrigin(env = process.env) {
  const raw = env.APP_URL || (env.RENDER === 'true' ? env.RENDER_EXTERNAL_URL : '');
  let url;
  try { url = new URL(raw); } catch { throw Object.assign(new Error('Set APP_URL to the public ChemWiz HTTPS origin.'),{code:'EMAIL_CONFIGURATION_MISSING'}); }
  const local = ['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if (url.username || url.password || !url.host || (url.protocol !== 'https:' && !(local && url.protocol === 'http:' && env.NODE_ENV !== 'production'))) throw Object.assign(new Error('Password reset links require a trusted HTTPS APP_URL.'),{code:'EMAIL_CONFIGURATION_MISSING'});
  return url.origin;
}
async function sendTemplate(templateId, parameters, { env = process.env, fetcher = globalThis.fetch, deadline = Date.now()+2500 } = {}) {
  if (!emailConfiguration(env).configured || !templateId) throw Object.assign(new Error('Configure the EmailJS service, template and keys on the backend.'), {code:'EMAIL_CONFIGURATION_MISSING'});
  const slot = Math.max(Date.now(), nextSend);
  if (slot >= deadline-50) throw Object.assign(new Error('Email delivery is busy; retry later.'),{code:'EMAIL_DELIVERY_BUSY'});
  nextSend = slot + 1050;
  await delay(Math.max(0,slot-Date.now()));
  const response = await fetcher(ENDPOINT, {
    method:'POST', headers:{'Content-Type':'application/json'}, signal:AbortSignal.timeout(Math.max(1,Math.min(2500,deadline-Date.now()))),
    body:JSON.stringify({service_id:env.EMAILJS_SERVICE_ID,template_id:templateId,user_id:env.EMAILJS_PUBLIC_KEY,accessToken:env.EMAILJS_PRIVATE_KEY,template_params:parameters}),
  });
  if (response.status !== 200) throw Object.assign(new Error('EmailJS did not accept the message.'),{code:'EMAIL_DELIVERY_FAILED',status:response.status});
}
async function sendPasswordReset({email,name,token,code,workspace='student',expiresAt}, options = {}) {
  const env = options.env || process.env;
  const url = `${resetOrigin(env)}/${workspace === 'admin' ? 'admin' : 'student'}/#reset=${token}`;
  await sendTemplate(env.EMAILJS_RESET_TEMPLATE_ID, {
    to_email:email,to_name:name || 'ChemWiz account holder',reset_url:url,reset_code:code,
    expires_in:'1 hour',expires_at:expiresAt,support_whatsapp:'+263 718 645 362',support_url:'https://wa.me/263718645362',app_name:'ChemWiz',
  }, options);
}
async function sendPasswordChanged({email,name}, options = {}) {
  const env = options.env || process.env;
  if (!env.EMAILJS_PASSWORD_CHANGED_TEMPLATE_ID || !emailConfiguration(env).configured) return;
  await sendTemplate(env.EMAILJS_PASSWORD_CHANGED_TEMPLATE_ID,{to_email:email,to_name:name || 'ChemWiz account holder',app_name:'ChemWiz',support_url:'https://wa.me/263718645362'},options);
}
module.exports = { emailConfiguration, resetOrigin, sendTemplate, sendPasswordReset, sendPasswordChanged };
