import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sourceFingerprint } from './lib/source-checks.mjs';
import { runNpm, readJson, writeJson, verifyPreflight } from './lib/gate-state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'verification/release-evidence.json');
const preflight = readJson(path.join(root, '.build-checks/integration.json'));
const result = { status: 'FAIL', version: readJson(path.join(root, 'package.json')).version,
  fingerprint: sourceFingerprint(root).digest, checkedAt: new Date().toISOString(), preflight,
  local: { status: 'FAIL', steps: [], browser: { status: 'NOT_RUN' } } };
writeJson(output, result);
try {
  const issues = verifyPreflight(root, preflight);
  if (issues.length) throw new Error(issues.join(' '));
  // The preflight already compiled this source. Reuse that build for local
  // acceptance, with completeness/content checks before the production browser.
  for (const command of ['check', 'verify:content', 'verify:k4', 'test']) {
    const checked = runNpm(root, ['run', command], { stdio: 'inherit' });
    result.local.steps.push({ command: `npm run ${command}`, status: checked.status === 0 ? 'PASS' : 'FAIL' });
    if (checked.status !== 0) throw new Error(`${command} failed.`);
  }
  writeJson(path.join(root, '.build-checks/browser.json'), { status: 'NOT_RUN' });
  const browser = spawnSync(process.execPath, [path.join(root, 'scripts/check-local-browser.mjs')], { cwd: root, stdio: 'inherit', timeout: 180000 });
  result.local.browser = readJson(path.join(root, '.build-checks/browser.json')) || { status: 'FAIL' };
  if (browser.status !== 0 || result.local.browser.status !== 'PASS') throw new Error('Local browser acceptance failed or was unavailable.');
  if (sourceFingerprint(root).digest !== result.fingerprint) throw new Error('Source changed during local checks. Repeat the gate sequence.');
  result.local.status = 'PASS'; result.status = 'PASS';
  console.log('LOCAL ACCEPTANCE: PASS. Recorded release evidence for this source.');
} catch (error) {
  result.error = error.message;
  console.error('LOCAL ACCEPTANCE: FAIL.', error.message); process.exitCode = 1;
} finally {
  writeJson(output, result);
}
