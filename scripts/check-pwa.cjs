const fs = require('node:fs');
const path = require('node:path');
const { checkPwaBuild } = require('./lib/pwa-checks.cjs');
const root = path.resolve(__dirname, '..');
let report;
try { report = checkPwaBuild(root); }
catch (error) { report = { status: 'FAIL', error: error.message }; }
fs.mkdirSync(path.join(root, '.build-checks'), { recursive: true });
fs.writeFileSync(path.join(root, '.build-checks/pwa.json'), JSON.stringify(report, null, 2) + '\n');
if (report.status === 'PASS') console.log(`PWA build: PASS (${report.buildId}; five public recovery files only).`);
else { console.error('PWA build: FAIL.', report.error); process.exitCode = 1; }
