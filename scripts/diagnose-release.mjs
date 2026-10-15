import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, verifyRelease } from './lib/gate-state.mjs';
import { releaseDiagnosticLines } from './lib/release-diagnostics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = readJson(path.join(root, 'verification/release-evidence.json'));
console.log(releaseDiagnosticLines(root, evidence).join('\n'));
const issues = verifyRelease(root, evidence, { checkCompiled: false });
if (issues.length) {
  console.error('RELEASE SOURCE: BLOCKED.\n' + issues.map(issue => '- ' + issue).join('\n'));
  process.exitCode = 1;
} else console.log('RELEASE SOURCE: PASS. Source and recorded tests match. Use ready:deploy locally to also check compiled assets.');
