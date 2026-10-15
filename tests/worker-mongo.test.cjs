const test = require('node:test');
const assert = require('node:assert/strict');
const { connectWorkerDatabase, scopedModel, withWorkerMongoRequest } = require('../backend/src/data/workerMongoContext');

const baseModel = { modelName: 'User', schema: { marker: 'same-schema' } };
const user = scopedModel(baseModel);
const connection = (id) => ({
  id, closed: false,
  model(name, schema) {
    assert.equal(name, 'User');
    assert.equal(schema, baseModel.schema);
    return { init: async () => {}, find: () => id };
  },
  async close() { this.closed = true; },
});
test('two concurrent Worker requests keep their connections and models separate', async () => {
  const first = connection('first');
  const second = connection('second');
  const values = await Promise.all([
    withWorkerMongoRequest(async () => {
      await connectWorkerDatabase();
      await new Promise((resolve) => setTimeout(resolve, 20));
      return user.find();
    }, { connect: async () => first }),
    withWorkerMongoRequest(async () => {
      await connectWorkerDatabase();
      return user.find();
    }, { connect: async () => second }),
  ]);
  assert.deepEqual(values, ['first', 'second']);
  assert.equal(first.closed, true);
  assert.equal(second.closed, true);
});
test('one Worker request reuses its own connection and closes it on failure', async () => {
  const own = connection('owned');
  let opened = 0;
  await assert.rejects(withWorkerMongoRequest(async () => {
    const [a, b] = await Promise.all([connectWorkerDatabase(), connectWorkerDatabase()]);
    assert.equal(a, b);
    assert.equal(user.find(), 'owned');
    throw new Error('Test request failed');
  }, { connect: async () => { opened += 1; return own; } }), /Test request failed/);
  assert.equal(opened, 1);
  assert.equal(own.closed, true);
});
test('database access outside a Worker request is refused; a failed open can retry inside the request', async () => {
  await assert.rejects(connectWorkerDatabase(), /request context/);
  assert.throws(() => user.find(), /not ready/);
  const own = connection('retry');
  let attempts = 0;
  await withWorkerMongoRequest(async () => {
    await assert.rejects(connectWorkerDatabase(), /Temporary failure/);
    assert.equal(await connectWorkerDatabase(), own);
  }, { connect: async () => { if (++attempts === 1) throw new Error('Temporary failure'); return own; } });
  assert.equal(attempts, 2);
  assert.equal(own.closed, true);
});
test('finished Worker requests do not accumulate connections in the Mongoose registry', async () => {
  const mongoose = require('mongoose');
  const before = mongoose.connections.length;
  await withWorkerMongoRequest(async () => { await connectWorkerDatabase(); }, { connect: async () => mongoose.createConnection() });
  assert.equal(mongoose.connections.length, before);
});
test('Cloudflare workspace routing, private file protection and JSON missing assets', async () => {
  const { routeStatic } = await import('../cloudflare/routing.mjs');
  const paths = [];
  const assets = { fetch: async (request) => { paths.push(new URL(request.url).pathname); return new Response('<html>ChemWiz</html>', { headers: { 'Content-Type': 'text/html' } }); } };
  for (const [pathname, expected] of [['/', '/index.html'], ['/student/', '/student/index.html'], ['/admin/users', '/admin/index.html']]) {
    const response = await routeStatic(new Request('https://chemwiz.example' + pathname), assets);
    assert.equal(response.status, 200);
    assert.equal(paths.at(-1), expected);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  const redirected = await routeStatic(new Request('https://chemwiz.example/student?course=chem'), assets);
  assert.equal(redirected.status, 308);
  assert.equal(redirected.headers.get('Location'), '/student/?course=chem');
  for (const pathname of ['/backend/app.js', '/data/local-db.json', '/.env', '/student/missing.js']) {
    assert.equal((await routeStatic(new Request('https://chemwiz.example' + pathname), assets)).status, 404);
  }
  const missing = await routeStatic(new Request('https://chemwiz.example/assets/missing.js'), { fetch: async () => new Response('Missing', { status: 404 }) });
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get('Content-Type'), /application\/json/);
});
