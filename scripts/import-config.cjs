const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const root = path.resolve(__dirname, '..');
const keys = ['DATA_MODE', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'LOCAL_ADMIN_EMAIL', 'LOCAL_ADMIN_PASSWORD',
  'LOCAL_STUDENT_EMAIL', 'LOCAL_STUDENT_PASSWORD', 'AI_MODEL', 'AI_TRANSCRIPTION_MODEL',
  'AI_DAILY_MESSAGE_LIMIT', 'AI_DAILY_VOICE_LIMIT', 'AI_LIVE_IN_LOCAL_MODE', 'AI_LIVE_VOICE_ENABLED',
  'AI_REALTIME_MODEL', 'AI_DAILY_LIVE_SESSIONS_LIMIT', 'PAYMENT_PROVIDER'];
function importConfig(source, target) {
  if (path.resolve(source) === path.resolve(target)) throw new Error('Choose the previous backend configuration, not the destination file.');
  const previous = dotenv.parse(fs.readFileSync(source, 'utf8'));
  let text = fs.readFileSync(target, 'utf8');
  const selected = Object.fromEntries(keys.filter((key) => previous[key]).map((key) => [key, previous[key]]));
  for (const [key, aliases] of [['MONGODB_URI', ['MONGODB_URI', 'MONGO_URI', 'MONGO_URL']], ['OPENAI_API_KEY', ['OPENAI_API_KEY', 'AI_API_KEY']]]) {
    const values = [...new Set(aliases.map((alias) => String(previous[alias] || '').trim()).filter(Boolean))];
    if (values.length > 1) throw new Error(`The previous configuration has conflicting ${key} aliases. Choose one canonical value before importing.`);
    if (values[0]) selected[key] = values[0];
  }
  if (selected.DATA_MODE && !['local', 'mongodb'].includes(selected.DATA_MODE)) throw new Error('Invalid DATA_MODE in the previous configuration.');
  if (Object.values(selected).some((value) => /[\r\n]/.test(value))) throw new Error('Multiline configuration values cannot be imported.');
  for (const [key, value] of Object.entries(selected)) {
    const expression = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}=${JSON.stringify(value)}`;
    text = expression.test(text) ? text.replace(expression, () => line) : `${text}\n${line}\n`;
  }
  const backup = `${target}.backup-${Date.now()}`;
  fs.copyFileSync(target, backup, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(backup, 0o600);
  const temporary = `${target}.tmp`;
  fs.writeFileSync(temporary, text, { mode: 0o600 });
  fs.renameSync(temporary, target);
  return Object.keys(selected).length;
}
module.exports = { importConfig };
if (require.main === module) {
  try {
    if (!process.argv[2]) throw new Error('Usage: npm run import-config -- "full/path/to/old/backend/.env"');
    require('./setup.cjs').setup();
    const count = importConfig(path.resolve(process.argv[2]), path.join(root, '.env'));
    console.log(`Imported ${count} backend settings. Previous destination configuration was backed up. Web address and frontend routing remain unified.`);
  } catch (error) { console.error('Configuration import stopped:', error.message); process.exitCode = 1; }
}
