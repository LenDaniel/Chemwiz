import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessBuild } from './lib/performance-checks.mjs';
import { readJson, writeJson } from './lib/gate-state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let report;
try {
  report = assessBuild(path.join(root, 'dist'), readJson(path.join(root, 'scripts/performance-budgets.json')));
} catch (error) { report = { status: 'FAIL', error: error.message }; }
writeJson(path.join(root, '.build-checks/performance.json'), report);
if (report.status !== 'PASS') {
  console.error('W3 payload budgets: FAIL.', report.error || report.checks.filter(check => check.status !== 'PASS'));
  process.exitCode = 1;
} else console.log(`W3 payload budgets: PASS (${report.metrics.deferredTopics} deferred topics; search deferred; ${report.metrics.totalJsGzipBytes} gzip JavaScript bytes).`);
