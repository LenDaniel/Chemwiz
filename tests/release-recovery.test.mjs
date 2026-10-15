import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sourceFingerprint } from '../scripts/lib/source-checks.mjs';
import { compareSourceFiles, releaseDiagnosticLines } from '../scripts/lib/release-diagnostics.mjs';

function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-release-recovery-'));
  try {
    fs.writeFileSync(path.join(root, 'package.json'), '{"version":"1.3.1"}\n');
    fs.writeFileSync(path.join(root, 'server.js'), 'const original = true;\n');
    return run(root);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
test('release diagnostics identify missing, extra and changed source files', () => fixture(root => {
  const before = sourceFingerprint(root);
  fs.unlinkSync(path.join(root, 'server.js'));
  fs.writeFileSync(path.join(root, 'extra.js'), 'const extra = true;\n');
  fs.writeFileSync(path.join(root, 'package.json'), '{"version":"1.2.1"}\n');
  const after = sourceFingerprint(root);
  assert.deepEqual(compareSourceFiles(after.fileHashes, before.fileHashes), {
    missing: ['server.js'], extra: ['extra.js'], changed: ['package.json'],
  });
  const text = releaseDiagnosticLines(root, { version:'1.3.1', status:'PASS', fingerprint:before.digest, fileHashes:before.fileHashes }).join('\n');
  for (const expected of ['VERSION MISMATCH', 'MISSING FILES', 'EXTRA FILES', 'CHANGED FILES']) assert.ok(text.includes(expected));
}));
test('file comparisons normalize Windows line endings and omit private records', () => fixture(root => {
  const before = sourceFingerprint(root);
  fs.writeFileSync(path.join(root, 'server.js'), 'const original = true;\r\n');
  fs.writeFileSync(path.join(root, '.env'), 'SECRET=private-fixture\n');
  fs.mkdirSync(path.join(root, 'data'));
  fs.writeFileSync(path.join(root, 'data/database.json'), '{"private":"fixture"}');
  const after = sourceFingerprint(root);
  assert.equal(after.digest, before.digest);
  assert.deepEqual(after.fileHashes, before.fileHashes);
  assert.deepEqual(compareSourceFiles(after.fileHashes, before.fileHashes), {missing:[],extra:[],changed:[]});
  assert.ok(!JSON.stringify(after).includes('private-fixture'));
}));
test('older or missing reports produce actionable read-only diagnostics', () => fixture(root => {
  const snapshot = sourceFingerprint(root);
  assert.match(releaseDiagnosticLines(root, null).join('\n'), /missing or unreadable/);
  assert.match(releaseDiagnosticLines(root, {version:'1.2.1',status:'PASS',fingerprint:'stale'}).join('\n'), /older report has no per-file/);
  assert.equal(sourceFingerprint(root).digest, snapshot.digest);
  assert.equal(compareSourceFiles(snapshot.fileHashes, []), null);
  assert.equal(compareSourceFiles(snapshot.fileHashes, {'server.js':null}), null);
}));
test('misplaced patch helpers are identified instead of ignored by the fingerprint', () => fixture(root => {
  const before = sourceFingerprint(root);
  fs.writeFileSync(path.join(root, 'apply-patch.cjs'), 'console.log("fixture");');
  fs.writeFileSync(path.join(root, 'patch-manifest.json'), '{}');
  const after = sourceFingerprint(root);
  assert.notEqual(after.digest, before.digest);
  assert.match(releaseDiagnosticLines(root, {version:'1.3.1',status:'PASS',fingerprint:before.digest,fileHashes:before.fileHashes}).join('\n'), /PATCH FILES IN APPLICATION/);
}));
