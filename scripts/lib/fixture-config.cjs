const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function configureFixture(label = 'integration') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), `chemwiz-${label}-`));
  Object.assign(process.env, {
    NODE_ENV: 'production', CHEMWIZ_RUNTIME: 'node', DATA_MODE: 'local',
    LOCAL_DATA_FILE: path.join(directory, 'database.json'),
    JWT_SECRET: 'isolated-build-gate-fixture-secret-over-32-characters', JWT_EXPIRES_IN: '1h',
    LOCAL_ADMIN_EMAIL: 'admin@build-gate.test', LOCAL_ADMIN_PASSWORD: 'Build-gate-admin-password!',
    LOCAL_STUDENT_EMAIL: 'student@build-gate.test', LOCAL_STUDENT_PASSWORD: 'Build-gate-student-password!',
    APP_URL: 'http://localhost:5000', FRONTEND_URLS: '', FRONTEND_URL: '', STUDENT_URL: '', ADMIN_URL: '',
    MONGODB_URI: '', MONGO_URI: '', MONGO_URL: '', OPENAI_API_KEY: '', AI_API_KEY: '',
    AI_LIVE_IN_LOCAL_MODE: 'false', AI_LIVE_VOICE_ENABLED: 'false', AI_DAILY_MESSAGE_LIMIT: '20',
    RENDER: 'true', RENDER_EXTERNAL_URL: 'https://chemwiz-build-gate.onrender.com', TRUST_PROXY: '0',
  });
  const mongoose = require('mongoose');
  const refuse = () => { throw new Error('Build-gate fixtures cannot open a real MongoDB connection.'); };
  mongoose.connect = refuse;
  mongoose.createConnection = refuse;
  return { directory, cleanup: () => fs.rmSync(directory, { recursive: true, force: true }) };
}
module.exports = { configureFixture };
