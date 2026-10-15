const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const corsMiddleware = require('../backend/src/config/cors');

const names = ['APP_URL', 'RENDER', 'RENDER_EXTERNAL_URL', 'FRONTEND_URLS', 'FRONTEND_URL', 'STUDENT_URL', 'ADMIN_URL'];
const original = Object.fromEntries(names.map((name) => [name, process.env[name]]));
let server, base;
function configure(values = {}) {
  for (const name of names) delete process.env[name];
  Object.assign(process.env, values);
}
async function login(origin, additionalHeaders = {}) {
  return fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { Host: 'chemwiz-pilot.onrender.com', Origin: origin, ...additionalHeaders },
  });
}
test.before(async () => {
  const app = express();
  app.use(corsMiddleware);
  app.post('/api/auth/login', (req, res) => res.json({ reachedLogin: true, protocol: req.protocol }));
  app.use((error, req, res, next) => res.status(error.statusCode || 500).json({ code: error.code }));
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
  configure(Object.fromEntries(Object.entries(original).filter(([, value]) => value !== undefined)));
});

test('Render HTTPS login reaches the API behind an HTTP proxy without enabling trust proxy', async () => {
  configure({ APP_URL: 'http://localhost:5000', RENDER: 'true', RENDER_EXTERNAL_URL: 'https://chemwiz-pilot.onrender.com' });
  const response = await login('https://chemwiz-pilot.onrender.com');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://chemwiz-pilot.onrender.com');
  assert.deepEqual(await response.json(), { reachedLogin: true, protocol: 'http' });
});
test('configured workspace URLs resolve to their exact origin for custom-domain login', async () => {
  configure({ APP_URL: 'https://chemwiz.example/admin/?from=home', STUDENT_URL: 'https://learn.chemwiz.example/student/' });
  assert.equal((await login('https://chemwiz.example')).status, 200);
  assert.equal((await login('https://learn.chemwiz.example')).status, 200);
  assert.equal((await login('https://chemwiz.example.evil.test')).status, 403);
});
test('login preflight allows the configured HTTPS origin and required auth headers', async () => {
  configure({ RENDER: 'true', RENDER_EXTERNAL_URL: 'https://chemwiz-pilot.onrender.com/' });
  const response = await fetch(`${base}/api/auth/login`, {
    method: 'OPTIONS',
    headers: { Host: 'chemwiz-pilot.onrender.com', Origin: 'https://chemwiz-pilot.onrender.com',
      'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' },
  });
  assert.equal(response.status, 204);
  assert.match(response.headers.get('access-control-allow-headers'), /Authorization/);
});
test('unlisted origins and forged forwarded headers remain blocked', async () => {
  configure({ RENDER: 'true', RENDER_EXTERNAL_URL: 'https://chemwiz-pilot.onrender.com' });
  for (const origin of ['https://untrusted.test', 'https://other.onrender.com', 'null']) {
    const response = await login(origin, { 'X-Forwarded-Host': 'untrusted.test', 'X-Forwarded-Proto': 'https' });
    assert.equal(response.status, 403, origin);
    assert.equal((await response.json()).code, 'CORS_ORIGIN_BLOCKED');
  }
  configure({ RENDER_EXTERNAL_URL: 'https://chemwiz-pilot.onrender.com' });
  assert.equal((await login('https://chemwiz-pilot.onrender.com', { 'X-Forwarded-Proto': 'https' })).status, 403);
});
test('invalid configuration cannot turn the CORS allowlist into a wildcard', async () => {
  configure({ APP_URL: '*', ADMIN_URL: 'https://user:password@untrusted.test/admin/', FRONTEND_URLS: 'null, https://trusted.test/student/' });
  assert.equal((await login('https://trusted.test')).status, 200);
  assert.equal((await login('https://untrusted.test')).status, 403);
});
