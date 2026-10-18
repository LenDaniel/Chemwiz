const test = require('node:test');
const assert = require('node:assert/strict');
const { askAI, moderate } = require('../backend/src/services/ai.service');

test('Wiz text generation has reasoning space and private failure diagnostics', async (t) => {
  const previousFetch = global.fetch;
  const previousError = console.error;
  const previousKey = process.env.OPENAI_API_KEY;
  const previousModel = process.env.AI_MODEL;
  const previousTimeout = AbortSignal.timeout;
  const timeouts = [];
  AbortSignal.timeout = (ms) => { timeouts.push(ms); return previousTimeout(ms); };
  process.env.OPENAI_API_KEY = 'synthetic-provider-secret';
  process.env.AI_MODEL = 'gpt-5-mini';
  const calls = [];
  const logs = [];
  let provider;
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, body });
    return provider(url, body);
  };
  console.error = (...args) => logs.push(args);
  t.after(() => {
    global.fetch = previousFetch;
    console.error = previousError;
    AbortSignal.timeout = previousTimeout;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.AI_MODEL; else process.env.AI_MODEL = previousModel;
  });
  const prompt = {
    message: 'Why is methylbenzene more reactive than benzene?',
    context: { topicId: 'hydrocarbons', topicTitle: 'Hydrocarbons' },
    history: [{ role: 'user', content: 'Explain electrophilic substitution.' }],
  };
  const completed = () => Response.json({ status: 'completed',
    output: [{ type: 'reasoning', summary: [] }, { type: 'message', role: 'assistant', content: [{ type: 'output_text',
      text: 'The methyl group donates electron density to the ring, increasing its reactivity towards electrophiles.' }] }],
    usage: { input_tokens: 100, output_tokens: 600, output_tokens_details: { reasoning_tokens: 500 } } });
  const incomplete = (reason = 'max_output_tokens') => Response.json({ status: 'incomplete', incomplete_details: { reason }, output: [] });

  await t.test('GPT-5 mini receives a bounded larger budget and low reasoning', async () => {
    provider = (_url, body) => body.max_output_tokens <= 550 ? incomplete() : completed();
    const result = await askAI(prompt);
    const { url, body } = calls.at(-1);
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(body.model, 'gpt-5-mini');
    assert.equal(body.max_output_tokens, 3072);
    assert.deepEqual(body.reasoning, { effort: 'low' });
    assert.equal(body.store, false);
    assert.equal(body.input.at(-1).content, prompt.message);
    assert.deepEqual(body.input[0], prompt.history[0]);
    assert.match(result.reply, /electron density/);
    assert.equal(result.usage.output_tokens_details.reasoning_tokens, 500);
  });

  await t.test('the unset model matches the existing environment examples', async () => {
    delete process.env.AI_MODEL;
    provider = completed;
    await askAI(prompt);
    assert.equal(calls.at(-1).body.model, 'gpt-5-mini');
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('dated GPT-5 mini models receive the supported reasoning setting', async () => {
    process.env.AI_MODEL = 'gpt-5-mini-2025-08-07';
    await askAI(prompt);
    assert.deepEqual(calls.at(-1).body.reasoning, { effort: 'low' });
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('other configured models retain compatibility without forced reasoning', async () => {
    process.env.AI_MODEL = 'custom-text-model';
    await askAI(prompt);
    assert.equal(calls.at(-1).body.model, 'custom-text-model');
    assert.equal(Object.hasOwn(calls.at(-1).body, 'reasoning'), false);
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('Luna explicitly uses medium reasoning, a bounded 16384-token budget and 60-second generation timeout', async () => {
    process.env.AI_MODEL = 'gpt-6-luna';
    provider = completed;
    const result = await askAI(prompt);
    const body = calls.at(-1).body;
    assert.equal(body.model, 'gpt-6-luna');
    assert.deepEqual(body.reasoning, { effort: 'medium' });
    assert.equal(body.max_output_tokens, 16384);
    assert.equal(timeouts.at(-1), 60000);
    assert.equal(body.store, false);
    assert.match(result.reply, /electron density/);
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('the working GPT-4.1 mini profile retains its own budget and timeout', async () => {
    process.env.AI_MODEL = 'gpt-4.1-mini';
    await askAI(prompt);
    assert.equal(calls.at(-1).body.reasoning, undefined);
    assert.equal(calls.at(-1).body.max_output_tokens, 3072);
    assert.equal(timeouts.at(-1), 30000);
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('Luna moderation keeps its existing independent request settings', async () => {
    process.env.AI_MODEL = 'gpt-6-luna';
    provider = () => Response.json({ results: [{ flagged: false }] });
    assert.equal(await moderate(prompt.message), false);
    assert.equal(calls.at(-1).body.model, 'omni-moderation-latest');
    assert.equal(calls.at(-1).body.reasoning, undefined);
    assert.equal(timeouts.at(-1), 30000);
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('a Luna budget failure retains the incomplete-answer guard and model diagnostic', async () => {
    process.env.AI_MODEL = 'gpt-6-luna';
    provider = () => incomplete();
    await assert.rejects(askAI(prompt), { code: 'AI_EMPTY_REPLY' });
    assert.equal(logs.at(-1)[1].model, 'gpt-6-luna');
    assert.equal(logs.at(-1)[1].reason, 'max_output_tokens');
    process.env.AI_MODEL = 'gpt-5-mini';
  });

  await t.test('an exhausted budget remains an error with a useful safe diagnostic', async () => {
    provider = () => incomplete();
    await assert.rejects(askAI(prompt), { code: 'AI_EMPTY_REPLY', status: 503 });
    assert.equal(logs.at(-1)[1].reason, 'max_output_tokens');
  });

  await t.test('a partial chemistry answer is never presented as completed', async () => {
    provider = () => Response.json({ status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' },
      output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'An unfinished explanation' }] }] });
    await assert.rejects(askAI(prompt), { code: 'AI_EMPTY_REPLY' });
  });

  await t.test('a complete bounded answer is not cut off at the old character limit', async () => {
    const fullReply = 'Explanation. '.repeat(550) + 'Final equation: H₂ + Cl₂ → 2HCl.';
    provider = () => Response.json({ status: 'completed', output: [{ type: 'message', role: 'assistant',
      content: [{ type: 'output_text', text: fullReply }] }] });
    assert.equal((await askAI(prompt)).reply, fullReply);
  });

  await t.test('a rejected model logs metadata without exposing provider messages', async () => {
    provider = () => Response.json({ error: { code: 'model_not_found', param: 'model',
      message: `DO-NOT-LOG ${process.env.OPENAI_API_KEY} ${prompt.message}` } },
    { status: 404, headers: { 'x-request-id': 'req_synthetic123' } });
    await assert.rejects(askAI(prompt), { code: 'AI_UNAVAILABLE', status: 503 });
    assert.deepEqual(logs.at(-1)[1], { endpoint: '/responses', model: 'gpt-5-mini', httpStatus: 404,
      providerCode: 'model_not_found', parameter: 'model', requestId: 'req_synthetic123' });
    const output = JSON.stringify(logs);
    assert.ok(!output.includes(process.env.OPENAI_API_KEY));
    assert.ok(!output.includes(prompt.message));
    assert.ok(!output.includes('DO-NOT-LOG'));
  });

  await t.test('provider authentication and rate failures keep their public error codes', async () => {
    for (const [status, code] of [[401, 'AI_NOT_CONFIGURED'], [403, 'AI_NOT_CONFIGURED'], [429, 'AI_PROVIDER_LIMIT']]) {
      provider = () => Response.json({ error: { code: 'invalid_api_key' } }, { status });
      await assert.rejects(askAI(prompt), { code, status: 503 });
    }
  });

  await t.test('moderation errors can be distinguished from answer-generation errors', async () => {
    provider = () => Response.json({ error: { code: 'insufficient_quota' } }, { status: 429 });
    await assert.rejects(moderate(prompt.message), { code: 'AI_PROVIDER_LIMIT' });
    assert.equal(logs.at(-1)[1].endpoint, '/moderations');
    assert.equal(logs.at(-1)[1].providerCode, 'insufficient_quota');
    assert.equal(calls.at(-1).body.reasoning, undefined);
  });

  await t.test('connection failures do not log raw exception contents', async () => {
    provider = () => { throw new Error(`DO-NOT-LOG ${process.env.OPENAI_API_KEY}`); };
    await assert.rejects(askAI(prompt), { code: 'AI_UNAVAILABLE' });
    assert.equal(logs.at(-1)[1].reason, 'connection_failed');
    assert.ok(!JSON.stringify(logs).includes('DO-NOT-LOG'));
  });
});
