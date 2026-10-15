import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { sourceFingerprint, compiledFingerprint, canonicalRoute } from './source-checks.mjs';

const localCommands = ['npm run check', 'npm run verify:content', 'npm run verify:k4', 'npm run test'];
function auditPassed(audit) {
  return audit?.status === 'PASS' && audit.counts?.high === 0 && audit.counts?.critical === 0;
}
function connectionsPassed(root, report) {
  const contracts = readJson(path.join(root, 'scripts/integration-contracts.json'));
  const calls = report?.calls || [];
  return report?.status === 'PASS' && contracts && calls.length === contracts.frontendProbes.length &&
    contracts.frontendProbes.every((probe) => calls.some((call) => call.file === probe.file && call.export === probe.export &&
      call.method === probe.method && canonicalRoute(call.path) === canonicalRoute(probe.path) && call.result === 'PASS'));
}

export function npmInvocation({ platform = process.platform, env = process.env, execPath = process.execPath, exists = fs.existsSync } = {}) {
  const paths = platform === 'win32' ? path.win32 : path;
  const candidates = [env.npm_execpath, paths.join(paths.dirname(execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')];
  const cli = candidates.find(filename => filename && /npm-cli\.(?:c?js|mjs)$/.test(filename) && exists(filename));
  if (cli) return { command: execPath, prefix: [cli] };
  if (platform !== 'win32') return { command: 'npm', prefix: [] };
  throw new Error('Cannot locate the npm JavaScript CLI. Start this check with npm run check:integration or npm run test:local using a standard Node/npm installation.');
}
export function runNpm(root, args, options = {}) {
  const { command, prefix } = npmInvocation({ env: options.env || process.env });
  return spawnSync(command, [...prefix, ...args], { cwd: root, encoding: 'utf8', timeout: 180000,
    ...options, shell: false });
}
export function readJson(filename) {
  try { return JSON.parse(fs.readFileSync(filename, 'utf8')); } catch { return null; }
}
export function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = filename + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(temporary, filename);
}
export function verifyPreflight(root, report = readJson(path.join(root, '.build-checks/integration.json'))) {
  const fingerprint = sourceFingerprint(root).digest;
  const version = readJson(path.join(root, 'package.json'))?.version;
  const issues = [];
  if (!report || report.status !== 'PASS') issues.push('Run npm run check:integration; no passing preflight is recorded.');
  if (report?.fingerprint !== fingerprint || report?.version !== version) issues.push('The source changed after preflight. Run the integration check again.');
  if (report && (report.installation?.status !== 'PASS' || !report.source?.passed || report.source?.issues?.length || !auditPassed(report.dependencies) || !connectionsPassed(root, report.connections) || report.compile?.status !== 'PASS')) issues.push('A required preflight stage did not pass.');
  if (report?.compile?.fingerprint !== compiledFingerprint(root)) issues.push('The compiled web build changed or is missing. Repeat preflight.');
  return issues;
}
export function verifyRelease(root, evidence = readJson(path.join(root, 'verification/release-evidence.json')), { checkCompiled = true } = {}) {
  const fingerprint = sourceFingerprint(root).digest;
  const version = readJson(path.join(root, 'package.json'))?.version;
  const issues = [];
  if (!evidence || evidence.status !== 'PASS') issues.push('No passing release evidence. Run check:integration, then test:local.');
  if (evidence?.fingerprint !== fingerprint || evidence?.version !== version) issues.push('Release evidence is for different source/dependencies. Repeat the checks for this patch.');
  if (evidence && (evidence.preflight?.status !== 'PASS' || evidence.preflight?.fingerprint !== fingerprint || evidence.preflight?.version !== version || evidence.local?.status !== 'PASS' || evidence.local?.browser?.status !== 'PASS' || !evidence.local?.browser?.checks?.length || !auditPassed(evidence.preflight?.dependencies))) issues.push('Preflight, local tests, browser checks and dependency audit must all pass for this source.');
  const steps = evidence?.local?.steps || [];
  if (evidence && (steps.some((step) => step.status !== 'PASS') || localCommands.some((command) => !steps.some((step) => step.command === command && step.status === 'PASS')))) issues.push('A required local check failed or was skipped.');
  if (evidence && (evidence.preflight?.installation?.status !== 'PASS' || !evidence.preflight?.source?.passed || evidence.preflight?.compile?.status !== 'PASS' || evidence.preflight?.connections?.status !== 'PASS')) issues.push('Required source files, compilation and executable API connection coverage must pass.');
  if (evidence && !connectionsPassed(root, evidence.preflight?.connections)) issues.push('Every declared frontend API needs a passing connection result.');
  const w2 = evidence?.local?.browser?.w2;
  const recovery = evidence?.local?.browser?.accountRecovery;
  if(evidence && (recovery?.status !== 'PASS' || !Array.isArray(recovery.checks) || recovery.checks.length < 6)) issues.push('Account recovery, password upgrade, password visibility and footer browser checks must pass.');
  if (evidence && (w2?.status !== 'PASS' || w2.diagramTextClipping !== 0 || !(w2.diagrams > 0) || !Array.isArray(w2.viewports) || w2.viewports.length < 6)) issues.push('W2 viewport, diagram and admin-session browser checks must pass.');
  if (checkCompiled && evidence?.preflight?.compile?.fingerprint !== compiledFingerprint(root)) issues.push('Compiled assets changed or are missing. Repeat the checks before deployment.');
  return issues;
}
