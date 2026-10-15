import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { routeMatches } from './lib/source-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { configureFixture } = require('./lib/fixture-config.cjs');
const fixture = configureFixture('api-check');
const contracts = JSON.parse(fs.readFileSync(path.join(root, 'scripts/integration-contracts.json'), 'utf8'));
const nativeFetch = globalThis.fetch;
let instance, loader, base, activeProbe, records = [], first, second, admin, recoveryLearner, studentMail, adminMail;
const results = [], controls = [];
const state = JSON.parse(fs.readFileSync(path.join(root, 'shared/learning-defaults.json'), 'utf8'));
state.settings.theme = 'light';
state.progress.atomic = { chaptersRead: ['at1'], quizzesTaken: 1, percent: 25, lastScore: 75 };
const context = { topicId: 'atomic', topicTitle: 'Atomic Structure', featureKey: 'chapter', featureLabel: 'Chapter', featureTitle: 'Atomic Structure' };
async function direct(route, method = 'GET', body, token, additional = {}) {
  const response = await nativeFetch(base + route, { method, headers: {
    ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}), ...additional },
    body: body ? JSON.stringify(body) : undefined });
  const data = await response.json().catch(() => null);
  return { response, data };
}
function noSecrets(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!['password', 'passwordHash', 'hashedPassword', 'passwordReset', 'tokenHash', 'codeHash', 'passwordDigest'].includes(key), 'A password/hash was returned by an API');
    noSecrets(child);
  }
}
try {
  instance = await require('../server.js').createApplication();
  await new Promise((resolve) => instance.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${instance.server.address().port}`;
  // Evaluate the actual frontend modules. The only adapter converts their
  // browser-relative URLs to this isolated loopback origin and records traffic.
  globalThis.fetch = async (input, options = {}) => {
    const raw = typeof input === 'string' ? input : input.url;
    const url = new URL(raw, base);
    if(url.origin === 'https://api.emailjs.com') return nativeFetch(raw,options);
    assert.equal(url.origin, base, 'A frontend request attempted to leave the isolated fixture');
    const response = await nativeFetch(url, options);
    if (activeProbe) {
      const headers = new Headers(options.headers);
      let json = null;
      try { json = await response.clone().json(); } catch {}
      records.push({ method: (options.method || 'GET').toUpperCase(), path: url.pathname, status: response.status,
        authorizationPresent: Boolean(headers.get('authorization')), contentType: headers.get('content-type'),
        contextPresent: Boolean(headers.get('x-wiz-context')), json });
    }
    return response;
  };
  loader = await createServer({ root: path.join(root, 'web'), configFile: path.join(root, 'vite.config.mjs'),
    server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
  const modules = {
    'web/student/src/config/api.js': await loader.ssrLoadModule('/student/src/config/api.js'),
    'web/admin/src/config/api.js': await loader.ssrLoadModule('/admin/src/config/api.js'),
  };
  async function upgradeLegacy(fn,role) {
    const {User}=require('../backend/src/data/modelProvider');
    const bcrypt=require('bcryptjs');
    const email='legacy-'+role+'@build-gate.test';
    const user=await User.create({name:'Legacy account',email,password:await bcrypt.hash('weak123',10),role});
    const challenged=await direct('/api/auth/login','POST',{email,password:'weak123'});
    assert.equal(challenged.data.code,'PASSWORD_UPGRADE_REQUIRED');assert.ok(!challenged.data.token);
    await fn({upgradeToken:challenged.data.upgradeToken,newPassword:'Upgraded-account-pass!2026',confirmPassword:'Upgraded-account-pass!2026'});
    const signedIn=await direct('/api/auth/login','POST',{email,password:'Upgraded-account-pass!2026'});
    assert.equal(signedIn.data.user.id,user._id);assert.equal(signedIn.data.user.role,role);
  }
  const scenarios = {
    'student-forgot': async(fn) => {
      recoveryLearner=(await direct('/api/auth/register','POST',{name:'Recovery learner',email:'recovery@build-gate.test',password:'Recovery-learner-original!2026'})).data;
      await fn({email:'recovery@build-gate.test',workspace:'student'});
      studentMail=fixture.emails.find(mail=>mail.to_email==='recovery@build-gate.test');assert.ok(studentMail?.reset_code);
    },
    'student-reset': async(fn) => {
      await fn({token:new URL(studentMail.reset_url).hash.slice(7),newPassword:'Recovery-learner-new!2026',confirmPassword:'Recovery-learner-new!2026'});
      assert.equal((await direct('/api/auth/me','GET',null,recoveryLearner.token)).response.status,401);
      assert.equal((await direct('/api/auth/login','POST',{email:'recovery@build-gate.test',password:'Recovery-learner-new!2026'})).response.status,200);
    },
    'admin-forgot': async(fn) => {
      await fn({email:process.env.LOCAL_ADMIN_EMAIL,workspace:'admin'});
      adminMail=fixture.emails.find(mail=>mail.to_email===process.env.LOCAL_ADMIN_EMAIL);assert.ok(new URL(adminMail.reset_url).pathname==='/admin/');
    },
    'admin-reset': async(fn) => {
      await fn({email:process.env.LOCAL_ADMIN_EMAIL,code:adminMail.reset_code,newPassword:'Admin-recovery-new!2026',confirmPassword:'Admin-recovery-new!2026'});
      assert.equal((await direct('/api/auth/me','GET',null,admin.token)).response.status,401);
    },
    'student-upgrade': async(fn) => upgradeLegacy(fn,'student'),
    'admin-upgrade': async(fn) => upgradeLegacy(fn,'admin'),
    'student-register': async (fn) => {
      first = await fn({ name: 'First fixture learner', email: 'first@build-gate.test', password: 'Fixture-learner-password!2026', role: 'admin', subscriptionTier: 'admin' });
      assert.equal(first.user.role, 'student'); assert.equal(first.user.subscriptionTier, 'free');
      second = (await direct('/api/auth/register', 'POST', { name: 'Second fixture learner', email: 'second@build-gate.test', password: 'Fixture-learner-password!2026' })).data;
      assert.ok(first.token && second.token);
    },
    'student-login': async (fn) => { const value = await fn({ email: 'first@build-gate.test', password: 'Fixture-learner-password!2026' }); assert.equal(value.user.id, first.user.id); first.token = value.token; },
    'student-current': async (fn) => { const value = await fn(first.token); assert.equal(value.user.id, first.user.id); noSecrets(value); },
    'student-progress': async (fn) => { const value = await fn(first.token); assert.equal(value.revision, 0); assert.deepEqual(value.state.settings.theme, 'dark'); },
    'student-validate': async (fn) => { const value = await fn(first.token, state); assert.equal(value.state.settings.theme, 'light'); },
    'student-save': async (fn) => { const value = await fn(first.token, 0, state); assert.equal(value.revision, 1); assert.deepEqual(value.state.progress.atomic, state.progress.atomic); },
    'admin-login': async (fn) => { admin = await fn({ email: process.env.LOCAL_ADMIN_EMAIL, password: process.env.LOCAL_ADMIN_PASSWORD }); assert.equal(admin.user.role, 'admin'); },
    'admin-check': async (fn) => { const value = await fn(admin.token); assert.equal(value.success, true); },
    'admin-stats': async (fn) => { const value = await fn(admin.token); assert.ok(value.stats); },
    'admin-users': async (fn) => { const value = await fn(admin.token, { search: 'fixture', page: 1 }); assert.ok(Array.isArray(value.users)); noSecrets(value); },
    'admin-subscription': async (fn) => {
      await fn(admin.token, first.user.id, { subscriptionTier: 'premium', subscriptionStatus: 'active' });
      assert.equal((await direct('/api/auth/me', 'GET', null, first.token)).data.user.access.isPremium, true);
    },
    'admin-status': async (fn) => {
      const value = await fn(admin.token, second.user.id, { accountStatus: 'suspended' }); assert.equal(value.user.accountStatus, 'suspended');
      assert.equal((await direct('/api/auth/me', 'GET', null, second.token)).response.status, 403);
      await direct('/api/admin/users/' + second.user.id + '/status', 'PATCH', { accountStatus: 'active' }, admin.token);
    },
    'admin-logs': async (fn) => { const value = await fn(admin.token); assert.ok(Array.isArray(value.logs)); noSecrets(value); },
    'admin-role': async (fn) => {
      const value = await fn(admin.token, second.user.id, { role: 'teacher' }); assert.equal(value.user.role, 'teacher');
      assert.equal((await direct('/api/auth/me', 'GET', null, second.token)).data.user.role, 'teacher');
    },
    'student-tutor': async (fn) => { const value = await fn(first.token, { ...context, context, message: 'Explain covalent bonding.' }); assert.equal(value.mode, 'local-test'); assert.ok(value.reply); },
    'student-transcribe': async (fn) => {
      await assert.rejects(fn(first.token, new Blob([new Uint8Array(128)], { type: 'audio/wav' })), /live Wiz API|live local mode|typing/);
    },
    'student-live': async (fn) => { await assert.rejects(fn(first.token, 'v=0\r\n', context), /not enabled/); },
  };
  // Establish the learner first, then use the real admin frontend to activate
  // Premium before invoking the protected Wiz request functions.
  const ordering = [...contracts.frontendProbes.filter((probe) => !['student-tutor', 'student-transcribe', 'student-live'].includes(probe.scenario)),
    ...contracts.frontendProbes.filter((probe) => ['student-tutor', 'student-transcribe', 'student-live'].includes(probe.scenario))];
  for (const probe of ordering) {
    assert.equal(typeof modules[probe.file][probe.export], 'function', `Missing frontend export: ${probe.export}`);
    assert.equal(typeof scenarios[probe.scenario], 'function', `Missing executable scenario: ${probe.scenario}`);
    activeProbe = probe; records = [];
    await scenarios[probe.scenario](modules[probe.file][probe.export]);
    activeProbe = null;
    assert.equal(records.length, 1, `${probe.export} must perform exactly one recorded request`);
    const request = records[0];
    assert.equal(request.method, probe.method, `${probe.export}: wrong HTTP method`);
    assert.ok(routeMatches(probe.path, request.path), `${probe.export}: wrong API URL`);
    const offlineVoice = ['student-transcribe', 'student-live'].includes(probe.scenario);
    assert.ok(offlineVoice ? request.status === 503 : request.status >= 200 && request.status < 300, `${probe.export}: unexpected response status ${request.status}`);
    if (!['student-register', 'student-login', 'admin-login','student-forgot','student-reset','student-upgrade','admin-forgot','admin-reset','admin-upgrade'].includes(probe.scenario)) assert.equal(request.authorizationPresent, true, `${probe.export}: missing Bearer header`);
    if (probe.scenario === 'student-transcribe') { assert.equal(request.contentType, 'audio/wav'); assert.equal(request.json?.code, 'VOICE_OFFLINE'); }
    if (probe.scenario === 'student-live') { assert.equal(request.contentType, 'application/sdp'); assert.equal(request.contextPresent, true); assert.equal(request.json?.code, 'LIVE_VOICE_DISABLED'); }
    noSecrets(request.json);
    results.push({ file: probe.file, export: probe.export, method: request.method, path: probe.path, status: request.status,
      result: 'PASS', mode: offlineVoice ? 'auth/transport/disabled-provider response; live provider not called' : 'local fixture' });
  }
  const analysis = JSON.parse(fs.readFileSync(path.join(root, '.build-checks/source-analysis.json'), 'utf8'));
  for (const route of analysis.backend) {
    const publicRule = contracts.publicRoutes.find((rule) => rule.method === route.method && routeMatches(rule.path, route.path));
    const routePath = route.path.replace(/:[A-Za-z_$][\w$]*/g, second.user.id);
    if (!publicRule) {
      const { response } = await direct(routePath, route.method, ['POST', 'PUT', 'PATCH'].includes(route.method) ? {} : null);
      assert.equal(response.status, 401, `${route.method} ${route.path} did not reject anonymous access`);
      if (route.path.startsWith('/api/admin')) {
        const denied = await direct(routePath, route.method, ['POST', 'PUT', 'PATCH'].includes(route.method) ? {} : null, first.token);
        assert.equal(denied.response.status, 403, `${route.method} ${route.path} did not reject the student role`);
      }
    } else if (route.method === 'GET') {
      const { response, data } = await direct(routePath);
      assert.equal(response.status, 200); noSecrets(data);
      if (publicRule.kind === 'placeholder') {
        assert.deepEqual(Object.keys(data).sort(), ['message', 'success'], 'A public placeholder exposed additional fields');
        assert.match(data.message, /^ChemWiz (?:user|subscription|payment|quiz) controller is ready for implementation$/);
      }
      if (publicRule.kind === 'health' || publicRule.kind === 'ready') assert.ok(Object.values(data.configuration).every((value) => typeof value === 'boolean'), 'Readiness exposed a configuration value');
    }
  }
  controls.push('All protected routes reject anonymous requests; all admin routes reject student tokens');
  assert.equal((await direct('/api/auth/me', 'GET', null, 'invalid-token')).response.status, 401);
  controls.push('Invalid JWT rejected; public registration ignores role/subscription escalation');
  assert.deepEqual((await direct('/api/progress/me', 'GET', null, first.token)).data.state.progress.atomic, state.progress.atomic);
  assert.equal((await direct('/api/progress/me', 'GET', null, second.token)).data.revision, 0);
  controls.push('Frontend save persists to the authenticated learner and leaves the second learner separate');
  assert.equal((await direct('/api/progress/me', 'PUT', { revision: 0, state }, first.token)).response.status, 409);
  controls.push('Stale progress save conflicts instead of replacing newer data');
  assert.equal((await direct('/api/health', 'GET', null, null, { Origin: 'https://untrusted.test' })).response.status, 403);
  assert.equal((await direct('/api/health', 'GET', null, null, { Origin: process.env.RENDER_EXTERNAL_URL, Host: 'chemwiz-build-gate.onrender.com' })).response.status, 200);
  controls.push('Unlisted origin rejected; Render HTTPS origin works through internal HTTP');
  for (const route of ['/.env', '/data/local-db.json', '/backend/src/models/User.js', '/scripts/integration-contracts.json']) {
    assert.equal((await nativeFetch(base + route)).status, 404, 'Private source/configuration is being served');
  }
  controls.push('Private configuration, data and backend/tool source are not publicly served');
  const html = await nativeFetch(base + '/student/');
  assert.match(html.headers.get('content-security-policy'), /script-src 'self'/);
  assert.equal(html.headers.get('x-powered-by'), null);
  controls.push('Production scripts restricted by CSP and framework identification header removed');
  const invalid = JSON.parse(JSON.stringify(state)); invalid.progress.atomic.percent = 101;
  assert.equal((await direct('/api/progress/validate', 'POST', { state: invalid }, first.token)).response.status, 400);
  controls.push('Invalid learner records rejected by backend validation');
  fs.writeFileSync(path.join(root, '.build-checks/api-connections.json'), JSON.stringify({ status: 'PASS', calls: results, controls, backendRoutesCovered: analysis.backend.length,
    externalServices: 'Not called: fixture data only; live voice/transcription connection requires separate provider/device acceptance.' }, null, 2));
  console.log(`API connections: PASS (${results.length}/${contracts.frontendProbes.length} real frontend API functions; ${analysis.backend.length} backend route access checks; ${controls.length} security/data controls).`);
} catch (error) {
  fs.writeFileSync(path.join(root, '.build-checks/api-connections.json'), JSON.stringify({ status: 'FAIL', error: error.message, calls: results, controls }, null, 2));
  console.error('API connections: FAIL:', error.message);
  process.exitCode = 1;
} finally {
  globalThis.fetch = nativeFetch;
  if (loader) await loader.close();
  if (instance?.server.listening) await new Promise((resolve) => instance.server.close(resolve));
  fixture.cleanup();
}
