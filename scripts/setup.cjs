const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');

function setup() {
  const target = path.join(root, '.env');
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  if (fs.existsSync(target)) return false;
  const contents = fs.readFileSync(path.join(root, '.env.example'), 'utf8')
    .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${crypto.randomBytes(48).toString('hex')}`);
  fs.writeFileSync(target, contents, { flag: 'wx', mode: 0o600 });
  console.log('ChemWiz local configuration created. Existing configuration and data are never overwritten.');
  return true;
}
module.exports = { setup };
if (require.main === module) setup();
