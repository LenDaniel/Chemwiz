const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const root = path.resolve(__dirname, '..');

function validateProduction(values) {
  const issues = [];
  if (values.NODE_ENV !== 'production') issues.push('Set NODE_ENV=production.');
  if (values.DATA_MODE !== 'mongodb') issues.push('Set DATA_MODE=mongodb.');
  if (!/^mongodb(?:\+srv)?:\/\//.test(values.MONGODB_URI || '')) issues.push('Set the canonical MONGODB_URI using your Atlas connection string.');
  if ((values.JWT_SECRET || '').length < 32 || /replace|test-only/i.test(values.JWT_SECRET || '')) issues.push('Set a stable private JWT_SECRET of at least 32 characters.');
  if (!/^https:\/\/[^/]+\/?$/.test(values.APP_URL || '')) issues.push('Set APP_URL to the single HTTPS application origin.');
  if (values.MONGO_URI || values.MONGO_URL || values.AI_API_KEY) issues.push('Use only canonical MONGODB_URI and OPENAI_API_KEY; remove old aliases.');
  if (values.CHEMWIZ_RUNTIME === 'cloudflare-worker' && values.LOCAL_DATA_FILE) issues.push('Remove LOCAL_DATA_FILE from Worker configuration.');
  return issues;
}
module.exports = { validateProduction };
if (require.main === module) {
  try {
    const filename = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.env');
    const values = { ...dotenv.parse(fs.readFileSync(filename)), ...process.env };
    const issues = validateProduction(values);
    for (const asset of ['dist/index.html', 'dist/student/index.html', 'dist/admin/index.html']) {
      if (!fs.existsSync(path.join(root, asset))) issues.push('Run npm run build to create the complete web application.');
    }
    if (issues.length) { console.error('Production configuration needs attention:\n' + issues.map((issue) => '- ' + issue).join('\n')); process.exitCode = 1; }
    else console.log('Production configuration: PASS. Connection and deployed-account acceptance are separate checks.');
  } catch (error) { console.error('Configuration could not be read. Choose your private production .env path.'); process.exitCode = 1; }
}
