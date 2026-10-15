const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const express = require('express');

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-wiz-'));
process.env.DATA_MODE = 'local';
process.env.LOCAL_DATA_FILE = path.join(dataDir, 'local.json');
process.env.JWT_SECRET = 'test-only-secret';
process.env.OPENAI_API_KEY = 'test-only-provider-key';
process.env.AI_DAILY_MESSAGE_LIMIT = '1';
process.env.AI_LIVE_IN_LOCAL_MODE = 'true';

const { User } = require('../src/data/localModels');
const tutorRoutes = require('../src/routes/tutor.routes');

test('Wiz enforces auth and access, sends scoped messages to OpenAI, and persists the daily cap', async () => {
  const freeUser = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Free learner', email: 'free@test.local', subscriptionTier: 'free' });
  const premiumUser = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Pilot learner', email: 'pilot@test.local', subscriptionTier: 'premium' });
  const token = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  const app = express();
  app.use(express.json());
  app.use('/api/tutor', tutorRoutes);
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  const calls = [];
  let failNextGeneration = true;
  let flagNextInput = true;
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body), authorization: options.headers.Authorization });
    if (url.endsWith('/moderations')) {
      if (flagNextInput) { flagNextInput = false; return Response.json({ results: [{ flagged: true }] }); }
      return Response.json({ results: [{ flagged: false }] });
    }
    if (failNextGeneration) { failNextGeneration = false; return Response.json({ error: 'test' }, { status: 503 }); }
    return Response.json({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'A covalent bond shares electrons.' }] }], usage: { input_tokens: 43, output_tokens: 12 } });
  };

  function post(body, bearer) {
    return new Promise((resolve, reject) => {
      const raw = JSON.stringify(body);
      const request = http.request({ hostname: '127.0.0.1', port: server.address().port, path: '/api/tutor/message', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(raw), ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) } }, (response) => {
        let text = '';
        response.on('data', (chunk) => { text += chunk; });
        response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(text) }));
      });
      request.on('error', reject);
      request.end(raw);
    });
  }

  try {
    const payload = { topicId: 'pc-01', topicTitle: 'Stoichiometry', message: 'How do moles relate to mass?', context: { featureKey: 'worked', featureLabel: 'Worked examples' }, history: [{ role: 'user', content: 'What is a mole?' }, { role: 'assistant', content: 'A unit of amount of substance.' }] };
    assert.equal((await post(payload)).status, 401);
    assert.equal((await post(payload, token(freeUser))).body.code, 'PREMIUM_REQUIRED');
    assert.equal((await post({ message: 'Hello' }, token(premiumUser))).body.code, 'TUTOR_CONTEXT_REQUIRED');
    assert.equal((await post(payload, token(premiumUser))).body.code, 'TUTOR_SAFETY');
    assert.equal((await post(payload, token(premiumUser))).body.code, 'AI_UNAVAILABLE');
    const afterFailure = JSON.parse(fs.readFileSync(process.env.LOCAL_DATA_FILE, 'utf8'));
    assert.equal(afterFailure.users.find((user) => user.email === premiumUser.email).tutorUsage.count, 0);

    const answer = await post(payload, token(premiumUser));
    assert.equal(answer.status, 200);
    assert.match(answer.body.reply, /covalent bond/);
    assert.equal(answer.body.quota.remaining, 0);
    assert.equal(answer.body.context.featureLabel, 'Worked examples');
    const generation = calls.find(({ url }) => url.endsWith('/responses'));
    assert.equal(generation.authorization, 'Bearer test-only-provider-key');
    assert.equal(generation.body.store, false);
    assert.equal(generation.body.input.at(-1).content, payload.message);
    assert.match(generation.body.instructions, /Stoichiometry/);

    const second = await post(payload, token(premiumUser));
    assert.equal(second.status, 429);
    assert.equal(second.body.code, 'TUTOR_DAILY_LIMIT');
    assert.equal(calls.filter(({ url }) => url.endsWith('/responses')).length, 2);
    const persisted = JSON.parse(fs.readFileSync(process.env.LOCAL_DATA_FILE, 'utf8'));
    assert.equal(persisted.users.find((user) => user.email === premiumUser.email).tutorUsage.count, 1);
  } finally {
    global.fetch = originalFetch;
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
