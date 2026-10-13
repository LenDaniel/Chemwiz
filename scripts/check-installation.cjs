const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const required = ['package.json', 'package-lock.json', 'server.js', '.env.example', 'vite.config.mjs',
  'scripts/setup.cjs', 'backend/app.js', 'backend/src/data/localModels.js', 'backend/src/data/modelProvider.js',
  'backend/src/services/learningState.service.js', 'shared/learning-defaults.json',
  'web/index.html', 'web/student/index.html', 'web/admin/index.html',
  'web/student/src/main.jsx', 'web/admin/src/main.jsx', 'web/student/src/hooks/useLearningState.js',
  'web/student/src/search/lessonManifest.json',
  'cloudflare/worker.mjs', 'cloudflare/routing.mjs', 'wrangler.jsonc',
  'backend/src/data/workerMongoContext.js', 'scripts/check-production.cjs',
  'scripts/check-mongo.cjs', 'scripts/cloudflare-dev.cjs'];
const failures = required.filter((file) => !fs.existsSync(path.join(root, file)));
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => item.isDirectory()
    ? files(path.join(directory, item.name)) : [path.join(directory, item.name)]);
}
let imports = 0;
for (const file of files(path.join(root, 'backend')).filter((file) => file.endsWith('.js'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
    const base = path.resolve(path.dirname(file), match[1]);
    imports += 1;
    if (![base, `${base}.js`, `${base}.cjs`, `${base}.json`, path.join(base, 'index.js')].some((candidate) => fs.existsSync(candidate))) {
      failures.push(`${path.relative(root, file)} → ${match[1]}`);
    }
  }
}
if (process.argv.includes('--production')) {
  for (const file of ['dist/index.html', 'dist/student/index.html', 'dist/admin/index.html']) {
    if (!fs.existsSync(path.join(root, file))) failures.push(file);
  }
}
if (failures.length) { console.error('Missing required source:', failures.join('\n')); process.exitCode = 1; }
else console.log(`Source check: PASS (${required.length} required files; ${imports} local backend imports). This checks source completeness, not live database or provider access.`);
