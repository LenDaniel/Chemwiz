const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function configureFixture(label = 'integration') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), `chemwiz-${label}-`));
  Object.assign(process.env, {
    NODE_ENV: 'production', CHEMWIZ_RUNTIME: 'node', DATA_MODE: 'local',
    LOCAL_DATA_FILE: path.join(directory, 'database.json'),
    JWT_SECRET: 'isolated-build-gate-fixture-secret-over-32-characters', JWT_EXPIRES_IN: '1h',
    LOCAL_ADMIN_EMAIL: 'admin@build-gate.test', LOCAL_ADMIN_PASSWORD: 'Build-gate-admin-password!2026',
    LOCAL_STUDENT_EMAIL: 'student@build-gate.test', LOCAL_STUDENT_PASSWORD: 'Build-gate-student-password!2026',
    APP_URL: 'https://chemwiz-build-gate.onrender.com', FRONTEND_URLS: '', FRONTEND_URL: '', STUDENT_URL: '', ADMIN_URL: '',
    MONGODB_URI: '', MONGO_URI: '', MONGO_URL: '', OPENAI_API_KEY: '', AI_API_KEY: '',
    AI_LIVE_IN_LOCAL_MODE: 'false', AI_LIVE_VOICE_ENABLED: 'false', AI_DAILY_MESSAGE_LIMIT: '20',
    EMAILJS_SERVICE_ID:'fixture-service',EMAILJS_RESET_TEMPLATE_ID:'fixture-reset',EMAILJS_PUBLIC_KEY:'fixture-public',EMAILJS_PRIVATE_KEY:'fixture-private',EMAILJS_PASSWORD_CHANGED_TEMPLATE_ID:'',
    RENDER: 'true', RENDER_EXTERNAL_URL: 'https://chemwiz-build-gate.onrender.com', TRUST_PROXY: '0',
  });
  require('./privacy-fixture.cjs').seedPrivacyFixture(process.env.LOCAL_DATA_FILE);
  const fixture = {directory,emails:[],emailFailure:false};
  const nativeFetch = globalThis.fetch;
  globalThis.fetch = async (input,options={}) => {
    const url = typeof input === 'string' ? input : input.url;
    if(url === 'https://api.emailjs.com/api/v1.0/email/send') {
      const payload=JSON.parse(options.body);
      if(payload.service_id !== 'fixture-service' || payload.accessToken !== 'fixture-private') throw new Error('A fixture attempted to use live email credentials.');
      if(fixture.emailFailure) return new Response('Fixture delivery rejected',{status:503});
      fixture.emails.push(payload.template_params);
      return new Response('OK',{status:200});
    }
    return nativeFetch(input,options);
  };
  const mongoose = require('mongoose');
  const refuse = () => { throw new Error('Build-gate fixtures cannot open a real MongoDB connection.'); };
  mongoose.connect = refuse;
  mongoose.createConnection = refuse;
  fixture.cleanup = () => {globalThis.fetch=nativeFetch;fs.rmSync(directory,{recursive:true,force:true});};
  return fixture;
}
module.exports = { configureFixture };
