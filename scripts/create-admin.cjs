const path = require('node:path');
const { Writable } = require('node:stream');
const { createInterface } = require('node:readline/promises');
const bcrypt = require('bcryptjs');
const { passwordIssues, PASSWORD_POLICY_VERSION } = require('../shared/password-policy.mjs');
const root = path.resolve(__dirname, '..');
require('./setup.cjs').setup();
const configFile = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.env');
require('dotenv').config({ path: configFile, quiet: true });
if (process.env.LOCAL_DATA_FILE) process.env.LOCAL_DATA_FILE = path.resolve(root, process.env.LOCAL_DATA_FILE);

async function main() {
  let email = process.env.CHEMWIZ_ADMIN_EMAIL;
  let password = process.env.CHEMWIZ_ADMIN_PASSWORD;
  if (!email || !password) {
    let muted = false;
    const output = new Writable({ write(chunk, encoding, done) { if (!muted) process.stdout.write(chunk, encoding); done(); } });
    const input = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
    try {
      email = email || await input.question('Admin email: ');
      if (!password) {
        process.stdout.write('Admin password (hidden): ');
        muted = true;
        password = await input.question('');
        muted = false;
        process.stdout.write('\n');
      }
    } finally { input.close(); }
  }
  email = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if(passwordIssues(password).length) throw new Error(passwordIssues(password).join(' '));
  require('../backend/src/config/runtime').validateRuntimeConfig();
  await require('../backend/src/config/db')();
  const { User } = require('../backend/src/data/modelProvider');
  if (await User.findOne({ email })) throw new Error('That email already has an account. Existing accounts have not been modified.');
  await User.create({ name: 'ChemWiz Admin', email, password: await bcrypt.hash(password, 12), passwordPolicyVersion:PASSWORD_POLICY_VERSION, role: 'admin', subscriptionTier: 'admin', accountStatus: 'active', subscriptionStatus: 'active' });
  console.log('Admin created. Sign in at /admin/ using the credentials you entered.');
}
main().catch((error) => { console.error('Admin creation failed:', error.message); process.exitCode = 1; })
  .finally(async () => { await require('mongoose').disconnect(); });
