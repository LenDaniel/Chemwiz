const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { randomBytes } = require('node:crypto');
const api = import('vite').then(async ({ createServer }) => {
  const loader = await createServer({ configFile: false, root: path.join(__dirname, '../web'),
    server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
  try { return await loader.ssrLoadModule('/student/src/config/api.js'); }
  finally { await loader.close(); }
});
test.before(async () => { await api; });

function mockTransport(t, transport) {
  const originalFetch = globalThis.fetch, originalTimer = globalThis.setTimeout;
  const delays = [];
  globalThis.fetch = transport;
  globalThis.setTimeout = (callback, delay, ...args) => { delays.push(delay); return originalTimer(callback, Math.min(delay, 25), ...args); };
  t.after(() => { globalThis.fetch = originalFetch; globalThis.setTimeout = originalTimer; });
  return delays;
}
test('a stalled account request aborts and reports a retryable timeout without replaying the request', async t => {
  let calls = 0;
  const delays = mockTransport(t, (_url, options) => new Promise((_resolve, reject) => {
    calls++;
    assert.equal('timeoutMs' in options, false);
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }));
  await assert.rejects((await api).getCurrentUser('synthetic-token'), /too long to respond/);
  assert.deepEqual(delays, [20000]); assert.equal(calls, 1);
});
test('Wiz keeps its longer moderation/generation timeout and sends once', async t => {
  let calls = 0;
  const delays = mockTransport(t, async (url, options) => {
    calls++; assert.equal(url, '/api/tutor/message'); assert.equal(options.method, 'POST');
    return Response.json({ success: true, reply: 'Synthetic chemistry reply' });
  });
  assert.equal((await (await api).askTutor('synthetic-token', { message: 'synthetic chemistry' })).success, true);
  assert.deepEqual(delays, [150000]); assert.equal(calls, 1);
});
test('a response that stalls after its headers still reaches the abort deadline', async t => {
  const delays = mockTransport(t, async (_url, options) => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"user":'));
      options.signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), { once: true });
    },
  }), { headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects((await api).getCurrentUser('synthetic-token'), /too long to respond/);
  assert.deepEqual(delays, [20000]);
});
test('voice transcription and call setup retain separate generous timeouts', async t => {
  const delays = mockTransport(t, async url => url.endsWith('/transcribe') ? Response.json({ text: 'synthetic' }) : new Response('synthetic-sdp'));
  const client = await api;
  assert.equal(await client.transcribeTutorNote('synthetic-token', new Blob(['sample'], { type: 'audio/webm' })), 'synthetic');
  assert.equal(await client.createLiveVoiceSession('synthetic-token', 'synthetic-sdp', {}), 'synthetic-sdp');
  assert.deepEqual(delays, [90000, 90000]);
});
test('an unreadable success is rejected and real HTTP authentication failures preserve their status', async t => {
  let status = 200;
  mockTransport(t, async () => new Response('<html>Proxy error</html>', { status }));
  const client = await api;
  await assert.rejects(client.getCurrentUser('synthetic-token'), /unreadable response/);
  for (status of [401, 403, 503]) await assert.rejects(client.getCurrentUser('synthetic-token'), error => error.status === status);
});

function compiledFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-w3-budget-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, '.vite')); fs.mkdirSync(path.join(directory, 'assets'));
  fs.mkdirSync(path.join(directory, 'student')); fs.writeFileSync(path.join(directory, 'student/index.html'), '<!doctype html><title>Fixture</title>');
  for (const file of ['entry.js', 'topic.js', 'search.js']) fs.writeFileSync(path.join(directory, 'assets', file), 'export const fixture = 1;');
  const manifest = {
    'student/index.html': { file: 'assets/entry.js', isEntry: true, dynamicImports: ['student/src/content/atomic.jsx', 'student/src/search/searchEngine.js'] },
    'student/src/content/atomic.jsx': { file: 'assets/topic.js' },
    'student/src/search/searchEngine.js': { file: 'assets/search.js' },
  };
  const budgets = { requiredEntries: ['student/index.html'], minimumDeferredTopics: 1, searchModule: 'student/src/search/searchEngine.js',
    limits: { entryJsGzipBytes: 1000, totalJsGzipBytes: 10000, totalCssGzipBytes: 1000, largestLazyJsGzipBytes: 1000, totalRawBytes: 20000, largestFileRawBytes: 10000 } };
  const save = () => fs.writeFileSync(path.join(directory, '.vite/manifest.json'), JSON.stringify(manifest));
  save(); return { directory, manifest, budgets, save };
}
test('payload gates reject eager chemistry/search imports even when byte limits would pass', async t => {
  const fixture = compiledFixture(t), { assessBuild } = await import('../scripts/lib/performance-checks.mjs');
  assert.equal(assessBuild(fixture.directory, fixture.budgets).status, 'PASS');
  fixture.manifest['student/index.html'].imports = fixture.manifest['student/index.html'].dynamicImports;
  fixture.save();
  const result = assessBuild(fixture.directory, fixture.budgets);
  assert.equal(result.status, 'FAIL'); assert.equal(result.metrics.searchDeferred, false); assert.equal(result.metrics.deferredTopics, 0);
});
test('a CSS-only unified home remains a valid entry with zero JavaScript bytes', async t => {
  const fixture = compiledFixture(t), { assessBuild } = await import('../scripts/lib/performance-checks.mjs');
  fs.writeFileSync(path.join(fixture.directory, 'index.html'), '<!doctype html><title>Fixture home</title>');
  fs.writeFileSync(path.join(fixture.directory, 'assets/home.css'), 'body { color: black; }');
  fixture.manifest['index.html'] = { file: 'assets/home.css', src: 'index.html' };
  fixture.budgets.requiredEntries.push('index.html'); fixture.save();
  const result = assessBuild(fixture.directory, fixture.budgets);
  assert.equal(result.status, 'PASS'); assert.equal(result.metrics.entryJsGzipBytes['index.html'], 0);
});
test('payload gates reject oversized initial JavaScript and missing compiled assets', async t => {
  const fixture = compiledFixture(t), { assessBuild } = await import('../scripts/lib/performance-checks.mjs');
  fs.writeFileSync(path.join(fixture.directory, 'assets/entry.js'), randomBytes(5000));
  assert.equal(assessBuild(fixture.directory, fixture.budgets).status, 'FAIL');
  fs.rmSync(path.join(fixture.directory, 'assets/topic.js'));
  assert.throws(() => assessBuild(fixture.directory, fixture.budgets));
});
test('manifest paths and unresolved dependencies cannot bypass payload checks', async t => {
  const fixture = compiledFixture(t), { assessBuild } = await import('../scripts/lib/performance-checks.mjs');
  fixture.manifest['student/src/content/atomic.jsx'].file = '../outside.js'; fixture.save();
  assert.throws(() => assessBuild(fixture.directory, fixture.budgets), /Invalid build manifest path/);
  fixture.manifest['student/src/content/atomic.jsx'].file = 'assets/topic.js';
  fixture.manifest['student/index.html'].imports = ['missing-module']; fixture.save();
  assert.throws(() => assessBuild(fixture.directory, fixture.budgets), /Missing manifest dependency/);
});
