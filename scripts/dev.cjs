const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
// One-time search generation finishes before the only web listener starts.
const generated = spawnSync(process.execPath, ['web/student/scripts/generate-search.mjs'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' },
});
if (generated.status !== 0) process.exit(generated.status || 1);
process.argv.push('--dev');
require('../server').start().catch((error) => {
  console.error('ChemWiz startup failed:', error.message);
  process.exitCode = 1;
});
