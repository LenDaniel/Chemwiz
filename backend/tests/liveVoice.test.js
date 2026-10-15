const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const express = require('express');

test('live voice requires Premium and a selected context; backend creates scoped SDP call without disclosing its API key', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-live-'));
  process.env.DATA_MODE = 'local';
  process.env.LOCAL_DATA_FILE = path.join(dir, 'local.json');
  process.env.JWT_SECRET = 'live-test-secret';
  process.env.OPENAI_API_KEY = 'live-test-api-key';
  process.env.AI_LIVE_IN_LOCAL_MODE = 'true';
  process.env.AI_LIVE_VOICE_ENABLED = 'true';
  const { User } = require('../src/data/localModels');
  const app = express();
  app.use(express.json());
  app.use('/api/tutor', require('../src/routes/tutor.routes'));
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  const nativeFetch = global.fetch;
  const providerCalls = [];
  global.fetch = async (url, options) => {
    providerCalls.push({ url, options });
    return new Response('v=0\no=- 2 2 IN IP4 127.0.0.1\n', { status: 201, headers: { 'Content-Type': 'application/sdp' } });
  };
  try {
    const free = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Free', email: 'livefree@test.local', subscriptionTier: 'free' });
    const premium = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Premium', email: 'livepremium@test.local', subscriptionTier: 'premium' });
    const endpoint = `http://127.0.0.1:${server.address().port}/api/tutor/live/session`;
    const sdp = 'v=0\no=- 1 1 IN IP4 127.0.0.1\ns=ChemWiz\nt=0 0\na=group:BUNDLE 0\nm=audio 9 UDP/TLS/RTP/SAVPF 111\na=mid:0\n';
    const send = (user, context) => nativeFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sdp',
        'X-Wiz-Context': JSON.stringify(context || {}),
        ...(user ? { Authorization: `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET)}` } : {}),
      }, body: sdp,
    });
    assert.equal((await send(null, { topicId: 'pc-01' })).status, 401);
    assert.equal((await send(free, { topicId: 'pc-01' })).status, 403);
    process.env.AI_LIVE_VOICE_ENABLED = 'false';
    assert.equal((await send(premium, { topicId: 'pc-01' })).status, 503);
    process.env.AI_LIVE_VOICE_ENABLED = 'true';
    assert.equal((await send(premium, {})).status, 400);
    const result = await send(premium, { topicId: 'pc-01', topicTitle: 'Stoichiometry', featureKey: 'moles', featureLabel: 'Mole calculations' });
    assert.equal(result.status, 200);
    const answer = await result.text();
    assert.match(answer, /^v=0/);
    assert.equal(providerCalls.length, 1);
    assert.equal(providerCalls[0].url, 'https://api.openai.com/v1/realtime/calls');
    assert.equal(providerCalls[0].options.headers.Authorization, 'Bearer live-test-api-key');
    assert.match(providerCalls[0].options.headers['OpenAI-Safety-Identifier'], /^[a-f0-9]{64}$/);
    const session = JSON.parse(providerCalls[0].options.body.get('session'));
    assert.equal(session.model, 'gpt-realtime-2.1-mini');
    assert.match(session.instructions, /Stoichiometry/);
    assert.equal(providerCalls[0].options.body.get('sdp'), sdp);
    assert.doesNotMatch(result.headers.get('content-type') + answer, /live-test-api-key/);
  } finally {
    global.fetch = nativeFetch;
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
