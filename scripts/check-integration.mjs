import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { analyzeProject, sourceFingerprint, compiledFingerprint } from './lib/source-checks.mjs';
import { runNpm, readJson, writeJson } from './lib/gate-state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, '.build-checks');
fs.mkdirSync(folder, { recursive: true });
const version = readJson(path.join(root, 'package.json')).version;
const initial = sourceFingerprint(root).digest;
const result = { status: 'FAIL', version, fingerprint: initial, checkedAt: new Date().toISOString(),
  source: null, dependencies: { status: 'NOT_RUN' }, compile: { status: 'NOT_RUN' }, connections: { status: 'NOT_RUN' } };
// Erase the previous green result before doing any work, including failed runs.
writeJson(path.join(folder, 'integration.json'), result);
writeJson(path.join(root, 'verification/release-evidence.json'), { status: 'FAIL', version, fingerprint: initial,
  checkedAt: result.checkedAt, reason: 'Preflight is pending; local acceptance must be recorded again.' });
try {
  result.source = analyzeProject(root);
  writeJson(path.join(folder, 'source-analysis.json'), result.source);
  for (const issue of result.source.issues) console.error(`FAIL ${issue.code}: ${issue.file}: ${issue.message}`);
  for (const warning of result.source.warnings) console.log(`REVIEW ${warning.code}: ${warning.message}`);
  if (!result.source.passed) throw new Error('Source integrity, API mapping or middleware checks failed.');
  console.log(`Source integration: PASS (${result.source.files} parsed files; ${result.source.imports} imports; ${result.source.frontend.length} frontend calls mapped; ${result.source.backend.length} backend routes).`);

  const audit = runNpm(root, ['audit', '--json', '--audit-level=high'], { maxBuffer: 16 * 1024 * 1024 });
  let data;
  try { data = JSON.parse(audit.stdout || ''); } catch {}
  if (!data?.metadata?.vulnerabilities || data.error || audit.error) {
    result.dependencies = { status: 'UNAVAILABLE' };
    throw new Error('Dependency advisory check is unavailable. Restore registry access and rerun; this is not a pass.');
  }
  result.dependencies = { status: (data.metadata.vulnerabilities.high || data.metadata.vulnerabilities.critical) ? 'FAIL' : 'PASS',
    counts: data.metadata.vulnerabilities, affectedPackages: Object.keys(data.vulnerabilities || {}), checkedAt: new Date().toISOString() };
  if (result.dependencies.status !== 'PASS') throw new Error('High/critical dependency advisories must be resolved before the build passes.');
  console.log('Dependency advisories: PASS (no high/critical findings).');

  // Compilation is part of code integrity, before application acceptance tests.
  const compile = runNpm(root, ['run', 'build'], { stdio: 'inherit', env: { ...process.env, RENDER: '', NODE_ENV: 'production' } });
  result.compile = { status: compile.status === 0 ? 'PASS' : 'FAIL', fingerprint: compiledFingerprint(root) };
  if (compile.status !== 0) throw new Error('Frontend production compilation failed.');
  writeJson(path.join(folder, 'api-connections.json'), { status: 'NOT_RUN' });
  const probe = spawnSync(process.execPath, [path.join(root, 'scripts/probe-api-connections.mjs')], { cwd: root, stdio: 'inherit', timeout: 120000 });
  result.connections = readJson(path.join(folder, 'api-connections.json')) || { status: 'FAIL' };
  if (probe.status !== 0 || result.connections.status !== 'PASS') throw new Error('Actual frontend/API/middleware connection probes failed.');
  if (sourceFingerprint(root).digest !== initial) throw new Error('Source changed while checks were running; rerun against a stable patch.');
  result.status = 'PASS';
  console.log('INTEGRATION PREFLIGHT: PASS. Local acceptance testing may now run.');
} catch (error) {
  result.error = error.message;
  console.error('INTEGRATION PREFLIGHT: FAIL.', error.message);
  process.exitCode = 1;
} finally {
  writeJson(path.join(folder, 'integration.json'), result);
  const rows = (result.source?.frontend || []).map((call) => `| ${call.export} | ${call.method} | ${call.path} | ${call.backend?.file || 'MISSING'} | ${(call.backend?.middleware || []).join(', ')} |`).join('\n');
  fs.writeFileSync(path.join(folder, 'INTEGRATION_REPORT.md'), `# ChemWiz integration preflight\n\nStatus: ${result.status}\n\nVersion: ${version}\n\nSource fingerprint: ${initial}\n\n| Frontend function | Method | API path | Backend file | Declared middleware |\n| --- | --- | --- | --- | --- |\n${rows}\n\n${result.error || 'All required preflight stages passed.'}\n\nDefined security checks and dependency advisories are covered; live Atlas/provider/audio acceptance is separate.\n`);
}
