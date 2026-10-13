const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const child = spawn(process.execPath, [path.join(root, 'node_modules/wrangler/bin/wrangler.js'),
  'dev', '--port', '8787', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  // Worker configuration is production/MongoDB; don't mix in the Node local file.
  env: { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false' },
});
child.on('exit', (code) => { process.exitCode = code || 0; });
child.on('error', (error) => { console.error('Worker emulator could not start:', error.message); process.exitCode = 1; });
