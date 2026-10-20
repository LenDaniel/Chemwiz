const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { studentWorkerSource } = require('../scripts/lib/student-service-worker.cjs');
const origin = 'https://chemwiz.test';
const files = ['/student/offline.html', '/student/manifest.webmanifest', '/student/icons/chemwiz-192.png', '/student/icons/chemwiz-512.png', '/student/icons/chemwiz.svg'];
const prefix = 'chemwiz-student-recovery-';
function harness({ buildId = '1.6.0-test', failFile, initial = [], clients = [{ id: 'learner', url: origin + '/student/' }] } = {}) {
  const stores = new Map(initial.map(name => [name, new Map()])), listeners = {}, requested = [];
  let navigationStatus = 200, offline = false, skipped = 0, claimed = 0, currentClients = clients;
  const key = request => new URL(typeof request === 'string' ? request : request.url, origin).href;
  const caches = {
    keys: async () => [...stores.keys()], delete: async name => stores.delete(name),
    open: async name => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return { put: async (request, response) => store.set(key(request), response.clone()), match: async request => store.get(key(request))?.clone() };
    },
  };
  const self = { location: { origin }, addEventListener: (name, listener) => { listeners[name] = listener; },
    clients: { matchAll: async () => currentClients, claim: async () => { claimed++; } }, skipWaiting: async () => { skipped++; } };
  const fetcher = async request => {
    requested.push(request);
    const pathname = new URL(request.url).pathname;
    if (offline || pathname === failFile) throw new Error('Synthetic network outage');
    const response = new Response(pathname === '/student/offline.html' ? '<main>Public reconnect page</main>' : 'Public fixture', { status: files.includes(pathname) ? 200 : navigationStatus });
    Object.defineProperty(response, 'type', { value: 'basic' }); return response;
  };
  function BrowserRequest(input, options) { return new Request(typeof input === 'string' ? new URL(input, origin).href : input.url, options); }
  vm.runInNewContext(studentWorkerSource({ buildId, files }), { self, caches, fetch: fetcher, Request: BrowserRequest, Response, URL });
  const lifecycle = name => { let promise; listeners[name]({ waitUntil: value => { promise = value; } }); return promise; };
  const dispatch = (url, method = 'GET', mode = 'cors') => { let promise; listeners.fetch({ request: { url: new URL(url, origin).href, method, mode }, respondWith: value => { promise = value; } }); return promise; };
  async function message(type, source = currentClients[0]) {
    let promise, reply;
    listeners.message({ data: { type }, source, ports: [{ postMessage: value => { reply = value; } }], waitUntil: value => { promise = value; } });
    await promise; return reply;
  }
  return { stores, requested, lifecycle, dispatch, message, setOffline: value => { offline = value; }, setNavigationStatus: value => { navigationStatus = value; }, setClients: value => { currentClients = value; }, skipped: () => skipped, claimed: () => claimed };
}
test('the recovery worker rejects API, lesson, admin and query-string cache targets', () => {
  for (const file of ['/api/auth/me', '/assets/atomic.js', '/admin/', '/student/offline.html?token=fixture']) {
    assert.throws(() => studentWorkerSource({ buildId: 'test', files: [file] }), /Invalid/);
  }
  assert.throws(() => studentWorkerSource({ buildId: 'bad";code', files }), /Invalid/);
});
test('installation fetches and caches only public recovery files without credentials', async () => {
  const worker = harness(); await worker.lifecycle('install');
  assert.equal(worker.requested.length, files.length);
  assert.ok(worker.requested.every(request => request.credentials === 'omit'));
  const store = worker.stores.get(prefix + '1.6.0-test');
  assert.deepEqual([...store.keys()].map(url => new URL(url).pathname), files);
});
test('a failed installation removes its partial cache and retains the working release', async () => {
  const worker = harness({ failFile: files[3], initial: [prefix + 'working'] });
  await assert.rejects(worker.lifecycle('install'), /Synthetic network outage/);
  assert.equal(worker.stores.has(prefix + '1.6.0-test'), false); assert.equal(worker.stores.has(prefix + 'working'), true);
});
test('API, POST, external, query and admin requests never receive a service-worker cache response', async () => {
  const worker = harness(); await worker.lifecycle('install');
  for (const [url, method, mode] of [['/api/progress/me', 'GET'], ['/api/tutor/message', 'POST'], ['/student/offline.html', 'POST'], ['/student/offline.html?private=fixture', 'GET'], ['https://other.test/student/offline.html', 'GET'], ['/admin/', 'GET', 'navigate']]) {
    assert.equal(worker.dispatch(url, method, mode), undefined, url);
  }
});
test('offline or server failure uses a public recovery page while authentication errors remain server responses', async () => {
  const worker = harness(); await worker.lifecycle('install'); worker.setOffline(true);
  const offline = await worker.dispatch('/student/', 'GET', 'navigate');
  assert.equal(offline.headers.get('x-chemwiz-offline'), '1'); assert.match(await offline.text(), /Public reconnect/);
  worker.setOffline(false); worker.setNavigationStatus(503);
  assert.equal((await worker.dispatch('/student/', 'GET', 'navigate')).headers.get('x-chemwiz-offline'), '1');
  worker.setNavigationStatus(401);
  assert.equal((await worker.dispatch('/student/', 'GET', 'navigate')).status, 401);
});
test('activation retains one rollback cache and never deletes another application’s caches', async () => {
  const worker = harness({ initial: ['unrelated-application', prefix + 'oldest', prefix + 'previous'] });
  await worker.lifecycle('install'); await worker.lifecycle('activate');
  assert.deepEqual([...worker.stores.keys()], ['unrelated-application', prefix + 'previous', prefix + '1.6.0-test']);
  assert.equal(worker.claimed(), 1); assert.equal(worker.skipped(), 0);
});
test('update activation requires one matching learner tab and refuses outside-scope messages', async () => {
  const worker = harness({ clients: [{ id: 'learner', url: origin + '/student/' }, { id: 'other', url: origin + '/student/' }] });
  assert.equal((await worker.message('ACTIVATE_UPDATE')).status, 'OTHER_TABS_OPEN'); assert.equal(worker.skipped(), 0);
  worker.setClients([{ id: 'learner', url: origin + '/student/' }]);
  assert.equal(await worker.message('ACTIVATE_UPDATE', { id: 'admin', url: origin + '/admin/' }), undefined);
  assert.equal((await worker.message('ACTIVATE_UPDATE')).status, 'ACTIVATING'); assert.equal(worker.skipped(), 1);
});
test('web manifest changes participate in the release fingerprint and normalize Windows line endings', async () => {
  const { sourceFingerprint } = await import('../scripts/lib/source-checks.mjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-pwa-fingerprint-'));
  try {
    const file = path.join(directory, 'manifest.webmanifest'); fs.writeFileSync(file, '{"name":"fixture"}\n');
    const initial = sourceFingerprint(directory).digest;
    fs.writeFileSync(file, '{"name":"fixture"}\r\n'); assert.equal(sourceFingerprint(directory).digest, initial);
    fs.writeFileSync(file, '{"name":"changed"}\n'); assert.notEqual(sourceFingerprint(directory).digest, initial);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
test('Cloudflare serves only the explicit PWA files and keeps private paths blocked', async () => {
  const { routeStatic } = await import('../cloudflare/routing.mjs');
  const requested = [];
  const assets = { fetch: async request => { requested.push(new URL(request.url).pathname); return new Response('Public fixture'); } };
  for (const file of ['/student/sw.js', ...files]) {
    const response = await routeStatic(new Request(origin + file), assets);
    assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-cache');
  }
  for (const file of ['/student/private.json', '/student/icons/unlisted.png', '/.env', '/backend/app.js']) {
    assert.equal((await routeStatic(new Request(origin + file), assets)).status, 404);
  }
  assert.equal(requested.length, files.length + 1);
});
