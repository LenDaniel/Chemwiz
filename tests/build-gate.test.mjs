import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { analyzeProject, sourceFingerprint, compiledFingerprint, projectFiles } from '../scripts/lib/source-checks.mjs';
import { verifyPreflight, verifyRelease } from '../scripts/lib/gate-state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contracts = JSON.parse(fs.readFileSync(path.join(root, 'scripts/integration-contracts.json'), 'utf8'));
const student = 'web/student/src/config/api.js';
const admin = 'backend/src/routes/admin.routes.js';
function changed(file, before, after) {
  const original = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(original.includes(before), 'The regression mutation must change its intended source.');
  return new Map([[file, original.replace(before, after)]]);
}
function rejects(overrides, code) {
  const result = analyzeProject(root, { overrides });
  assert.equal(result.passed, false);
  assert.ok(result.issues.some((issue) => issue.code === code), JSON.stringify(result.issues));
}
function evidence() {
  const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
  const fingerprint = sourceFingerprint(root).digest;
  const preflight = { status: 'PASS', version, fingerprint,
    source: { passed: true, issues: [] }, dependencies: { status: 'PASS', counts: { high: 0, critical: 0 } },
    compile: { status: 'PASS', fingerprint: compiledFingerprint(root) },
    connections: { status: 'PASS', calls: contracts.frontendProbes.map((probe) => ({ ...probe, result: 'PASS' })) } };
  return { status: 'PASS', version, fingerprint, preflight,
    local: { status: 'PASS', browser: { status: 'PASS', checks: ['Fixture browser acceptance'] },
      steps: ['check', 'verify:content', 'verify:k4', 'test'].map((command) => ({ command: 'npm run ' + command, status: 'PASS' })) } };
}

test('current request inventory maps every contract through middleware without source errors', () => {
  const result = analyzeProject(root);
  assert.deepEqual(result.issues, []);
  assert.equal(result.frontend.length, contracts.frontendProbes.length);
  assert.ok(result.backend.length >= result.frontend.length);
  assert.ok(result.frontend.every((call) => call.backend?.middleware.includes('corsMiddleware')));
  assert.ok(projectFiles(root).includes('backend/src/data/modelProvider.js'));
});
test('missing backend route blocks the frontend API connection', () => {
  rejects(changed('backend/src/routes/auth.routes.js', 'router.post("/login"', 'router.post("/login-removed"'), 'MISSING_API_ROUTE');
});
test('a frontend HTTP method mismatch blocks the build', () => {
  rejects(changed(student, 'method: "POST"', 'method: "DELETE"'), 'MISSING_API_ROUTE');
});
test('missing administrator middleware blocks the build', () => {
  rejects(changed(admin, 'router.use(adminOnly);', ''), 'ADMIN_MIDDLEWARE_MISSING');
});
test('authentication declared after a route does not protect that route', () => {
  const original = fs.readFileSync(path.join(root, admin), 'utf8');
  rejects(new Map([[admin, original.replace('router.use(protect);', '') + '\nrouter.use(protect);\n']]), 'AUTH_MIDDLEWARE_MISSING');
});
test('admin guards in the wrong order block the build', () => {
  rejects(changed(admin, 'router.use(protect);\nrouter.use(adminOnly);', 'router.use(adminOnly);\nrouter.use(protect);'), 'ADMIN_MIDDLEWARE_MISSING');
});
test('a broken fetch wrapper blocks the middle layer', () => {
  rejects(changed(student, 'return await fetch(url, options);', 'return { ok: true };'), 'BROKEN_TRANSPORT');
});
test('a new frontend API without an executable contract blocks the build', () => {
  const original = fs.readFileSync(path.join(root, student), 'utf8');
  rejects(new Map([[student, original + '\nexport function uncheckedApi() { return apiRequest("/api/auth/me"); }\n']]), 'MISSING_CONNECTION_PROBE');
});
test('unresolvable request paths cannot silently disappear from the inventory', () => {
  rejects(changed(student, 'apiRequest("/api/auth/register",', 'apiRequest(lookupEndpoint(),'), 'UNRESOLVED_FRONTEND_API');
});
test('an unknown API transport requires a checked adapter', () => {
  rejects(changed(student, 'apiRequest("/api/auth/register",', 'customSend("/api/auth/register",'), 'UNKNOWN_API_TRANSPORT');
});
test('external frontend API origin blocks unified routing', () => {
  rejects(changed(student, "const API_BASE_URL = '';", "const API_BASE_URL = 'https://unreviewed.test';"), 'API_BASE_NOT_SAME_ORIGIN');
});
test('missing imports in the backend data layer are checked', () => {
  const file = 'backend/src/data/modelProvider.js';
  rejects(new Map([[file, fs.readFileSync(path.join(root, file), 'utf8') + '\nrequire("./missing-model-fixture");\n']]), 'MISSING_IMPORT');
});
test('a named frontend import must exist in its target module', () => {
  const file = 'web/student/src/main.jsx';
  rejects(new Map([[file, fs.readFileSync(path.join(root, file), 'utf8') + '\nimport { missingGateExport } from "./config/api.js";\n']]), 'MISSING_EXPORT');
});
test('invalid syntax and executable JSON configuration block integrity checks', () => {
  rejects(changed(student, "const API_BASE_URL = '';", 'const = ;'), 'INVALID_SYNTAX');
  rejects(new Map([['wrangler.jsonc', '{"name": process.env.WORKER_NAME}']]), 'INVALID_JSONC');
});
test('embedded credentials and string evaluation block the frontend', () => {
  const original = fs.readFileSync(path.join(root, student), 'utf8');
  rejects(new Map([[student, original + '\nconst fixtureKey = "sk-proj-FAKE_ONLY_FOR_GATE_TEST_1234567890";\n']]), 'SOURCE_CREDENTIAL');
  rejects(new Map([[student, original + '\neval("unreviewed code");\n']]), 'DYNAMIC_EXECUTION');
});
test('hardcoded signing secrets and missing Premium middleware block security checks', () => {
  const file = 'backend/src/routes/auth.routes.js';
  rejects(new Map([[file, fs.readFileSync(path.join(root, file), 'utf8') + '\njwt.sign({}, "fake-fixture-secret");\n']]), 'HARDCODED_JWT_SECRET');
  rejects(changed('backend/src/routes/tutor.routes.js', ', protect, requirePremium,', ', protect,'), 'PREMIUM_MIDDLEWARE_MISSING');
});
test('unsupported chained route declarations cannot silently bypass the inventory', () => {
  rejects(new Map([[admin, fs.readFileSync(path.join(root, admin), 'utf8') + '\nrouter.route("/unreviewed").get((req,res)=>res.json({}));\n']]), 'UNRESOLVED_BACKEND_ROUTE');
});
test('complete evidence is accepted but changed source is rejected', () => {
  const valid = evidence();
  assert.deepEqual(verifyRelease(root, valid, { checkCompiled: false }), []);
  valid.fingerprint = 'different-source';
  assert.ok(verifyRelease(root, valid, { checkCompiled: false }).length);
});
test('failed, unavailable or skipped preflight/local checks block deployment', () => {
  for (const mutate of [
    (record) => { record.status = 'FAIL'; },
    (record) => { record.preflight.dependencies.status = 'UNAVAILABLE'; },
    (record) => { record.preflight.dependencies.counts.high = 1; },
    (record) => { record.preflight.compile.status = 'FAIL'; },
    (record) => { record.local.browser.status = 'NOT_RUN'; },
    (record) => { record.local.steps.pop(); },
    (record) => { record.local.steps[0].status = 'FAIL'; },
    (record) => { record.preflight.fingerprint = 'old-preflight'; },
    (record) => { record.preflight.connections.calls.pop(); },
    (record) => { record.preflight.connections.calls[0].method = 'DELETE'; },
  ]) {
    const record = evidence(); mutate(record);
    assert.ok(verifyRelease(root, record, { checkCompiled: false }).length, 'A required stage was incorrectly accepted.');
  }
  assert.ok(verifyRelease(root, null, { checkCompiled: false }).length);
});
test('local testing rejects stale preflight and altered compiled assets', () => {
  const record = evidence();
  assert.deepEqual(verifyPreflight(root, record.preflight), []);
  record.preflight.compile.fingerprint = 'changed-assets';
  assert.ok(verifyPreflight(root, record.preflight).length);
  assert.ok(verifyRelease(root, record).length);
});
test('fingerprints exclude private records but include backend data code and normalize line endings', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-fingerprint-'));
  try {
    fs.mkdirSync(path.join(folder, 'backend/src/data'), { recursive: true });
    fs.mkdirSync(path.join(folder, 'data')); fs.mkdirSync(path.join(folder, 'verification'));
    const source = path.join(folder, 'backend/src/data/model.js');
    fs.writeFileSync(source, 'const model = 1;\n');
    const initial = sourceFingerprint(folder).digest;
    fs.writeFileSync(path.join(folder, '.env'), 'PRIVATE_FIXTURE=1\n');
    fs.writeFileSync(path.join(folder, 'data/database.json'), '{"fixture":true}');
    fs.writeFileSync(path.join(folder, 'verification/release-evidence.json'), '{}');
    fs.writeFileSync(source, 'const model = 1;\r\n');
    assert.equal(sourceFingerprint(folder).digest, initial);
    fs.writeFileSync(source, 'const model = 2;\n');
    assert.notEqual(sourceFingerprint(folder).digest, initial);
    fs.mkdirSync(path.join(folder, 'dist')); fs.writeFileSync(path.join(folder, 'dist/index.html'), '<main>one</main>');
    const compiled = compiledFingerprint(folder);
    fs.writeFileSync(path.join(folder, 'dist/index.html'), '<main>two</main>');
    assert.notEqual(compiledFingerprint(folder), compiled);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});
