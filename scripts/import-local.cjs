const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env'), quiet: true });

function importLocal(source, target) {
  const raw = fs.readFileSync(source, 'utf8');
  const store = JSON.parse(raw);
  if (!Array.isArray(store.users) || !Array.isArray(store.adminLogs)) throw new Error('Choose the old backend data/local-db.json file.');
  const emails = new Set();
  for (const user of store.users) {
    if (!/^[a-f0-9]{24}$/i.test(user._id || '') || !user.email || !/^\$2[aby]\$/.test(user.password || '')) throw new Error('The source has an invalid account record. It has not been imported.');
    const email = user.email.toLowerCase();
    if (emails.has(email)) throw new Error('The source has duplicate accounts.');
    emails.add(email);
  }
  if (fs.existsSync(target)) throw new Error('The destination already has a database. Import into a fresh ChemWiz folder before its first start. Existing data has not been changed.');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, raw, { flag: 'wx', mode: 0o600 });
  return { users: store.users.length, logs: store.adminLogs.length };
}
module.exports = { importLocal };
if (require.main === module) {
  try {
    if (!process.argv[2]) throw new Error('Usage: npm run import-local -- "full/path/to/old/backend/data/local-db.json"');
    if (String(process.env.DATA_MODE || 'local').toLowerCase() !== 'local') throw new Error('This import is for local JSON data. MongoDB accounts remain in their existing MongoDB database.');
    const result = importLocal(path.resolve(process.argv[2]), path.resolve(root, process.env.LOCAL_DATA_FILE || 'data/local-db.json'));
    console.log(`Imported ${result.users} accounts and ${result.logs} admin logs. Existing IDs, password hashes, subscriptions and usage were preserved.`);
  } catch (error) { console.error('Import stopped:', error.message); process.exitCode = 1; }
}
