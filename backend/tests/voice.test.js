const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const express = require('express');

test('voice notes require Premium, forward audio server-side and return editable text', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chemwiz-voice-'));
  process.env.DATA_MODE = 'local';
  process.env.LOCAL_DATA_FILE = path.join(dir, 'local.json');
  process.env.JWT_SECRET = 'voice-test-secret';
  process.env.OPENAI_API_KEY = 'voice-test-key';
  process.env.AI_LIVE_IN_LOCAL_MODE = 'true';
  process.env.AI_DAILY_VOICE_LIMIT = '1';
  const { User } = require('../src/data/localModels');
  const app = express();
  app.use(express.json());
  app.use('/api/tutor', require('../src/routes/tutor.routes'));
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ text: 'What is the structure of ethyne?' });
  };
  try {
    const free = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Free', email: 'voicefree@test.local', subscriptionTier: 'free' });
    const premium = await User.create({ passwordPolicyVersion:1, authVersion:0, name: 'Premium', email: 'voicepremium@test.local', subscriptionTier: 'premium' });
    const endpoint = `http://127.0.0.1:${server.address().port}/api/tutor/transcribe`;
    const send = (user, type = 'audio/webm', audio = Buffer.alloc(300, 42)) => originalFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': type, ...(user ? { Authorization: `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET)}` } : {}) },
      body: audio,
    });
    assert.equal((await send(null)).status, 401);
    assert.equal((await send(free)).status, 403);
    assert.equal((await send(premium, 'text/plain')).status, 415);
    const result = await send(premium);
    assert.equal(result.status, 200);
    assert.equal((await result.json()).text, 'What is the structure of ethyne?');
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/audio\/transcriptions$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer voice-test-key');
    assert.equal(calls[0].options.body.get('model'), 'gpt-transcribe');
    assert.equal(calls[0].options.body.get('file').size, 300);
    const daily = await send(premium);
    assert.equal(daily.status, 429);
    assert.equal((await daily.json()).code, 'VOICE_DAILY_LIMIT');
    assert.equal(calls.length, 1);
    const data = JSON.parse(fs.readFileSync(process.env.LOCAL_DATA_FILE, 'utf8'));
    assert.equal(data.users.find((user) => user.email === premium.email).tutorUsage?.count || 0, 0);
  } finally {
    global.fetch = originalFetch;
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
