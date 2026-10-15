import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, verifyRelease } from './lib/gate-state.mjs';
import { releaseDiagnosticLines } from './lib/release-diagnostics.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Render rebuilds its assets after this prebuild check. Local/VPS/Cloudflare
// publication also verifies that the existing compiled assets match the tests.
const evidence = readJson(path.join(root, 'verification/release-evidence.json'));
const issues = verifyRelease(root, evidence, { checkCompiled: process.env.RENDER !== 'true' });
if (issues.length) {
  console.error('DEPLOYMENT GATE: BLOCKED.\n' + issues.map((issue) => '- ' + issue).join('\n'));
  console.error(releaseDiagnosticLines(root, evidence).join('\n'));
  process.exitCode = 1;
} else console.log('DEPLOYMENT GATE: PASS (integration and local/browser checks passed for this exact source).');
