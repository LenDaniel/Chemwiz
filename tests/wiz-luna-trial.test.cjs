const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { runTrial, parseArgs, cases } = require('../scripts/test-wiz-live.cjs');

test('Luna trial is opt-in and keeps model settings, reports and safety boundaries explicit', async (t) => {
  const previousModel = process.env.AI_MODEL;
  t.after(() => { if (previousModel === undefined) delete process.env.AI_MODEL; else process.env.AI_MODEL = previousModel; });

  await t.test('default dry run makes no provider request and requires no private key', () => {
    const result = spawnSync(process.execPath, [path.resolve(__dirname, '../scripts/test-wiz-live.cjs')],
      { encoding: 'utf8', env: { ...process.env, OPENAI_API_KEY: '', AI_API_KEY: '' } });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.mode, 'dry-run');
    assert.equal(output.networkRequests, 0);
    assert.equal(output.model, 'gpt-6-luna');
    assert.equal(output.settings.reasoningEffort, 'medium');
    assert.equal(output.cases.length, 3);
  });

  await t.test('explicit run arguments are required and ambiguous modes are rejected', () => {
    assert.equal(parseArgs([]).mode, 'dry-run');
    assert.equal(parseArgs(['--run']).mode, 'run');
    assert.equal(parseArgs(['--help']).mode, 'help');
    assert.equal(parseArgs(['--run', '--env-file', 'private.env']).envFile, path.resolve('private.env'));
    assert.throws(() => parseArgs(['--run', '--dry-run']));
    assert.throws(() => parseArgs(['--env-file']));
    assert.throws(() => parseArgs(['--api-key', 'do-not-print-this-value']));
  });

  await t.test('three fixed questions use Luna, both moderation steps and manual chemistry review', async () => {
    process.env.AI_MODEL = 'gpt-4.1-mini';
    let moderationCalls = 0, generationCalls = 0;
    const provider = {
      moderate: async () => { moderationCalls++; return false; },
      askAI: async (request) => {
        assert.equal(process.env.AI_MODEL, 'gpt-6-luna');
        assert.equal(request.message, cases[generationCalls++].question);
        assert.deepEqual(request.history, []);
        return { reply: 'Synthetic chemistry answer.', usage: { input_tokens: 20, output_tokens: 50,
          output_tokens_details: { reasoning_tokens: 30 }, ignored: 'do-not-copy-this-value' } };
      },
    };
    const report = await runTrial({ provider });
    assert.equal(report.transportStatus, 'PASS');
    assert.equal(report.chemistryReview, 'PENDING');
    assert.equal(report.cases.length, 3);
    assert.equal(moderationCalls, 6);
    assert.equal(generationCalls, 3);
    assert.deepEqual(report.cases[0].tokens, { input: 20, output: 50, reasoning: 30 });
    assert.equal(process.env.AI_MODEL, 'gpt-4.1-mini');
    assert.ok(!JSON.stringify(report).includes('do-not-copy-this-value'));
  });

  await t.test('provider failure stops paid retries, restores settings and omits raw errors', async () => {
    process.env.AI_MODEL = 'gpt-4.1-mini';
    let attempts = 0;
    const report = await runTrial({ provider: { moderate: async () => false, askAI: async () => {
      attempts++; throw Object.assign(new Error('synthetic-private-secret'), { code: 'AI_EMPTY_REPLY' });
    } } });
    assert.equal(attempts, 1);
    assert.equal(report.transportStatus, 'FAIL');
    assert.equal(report.cases[0].errorCode, 'AI_EMPTY_REPLY');
    assert.equal(process.env.AI_MODEL, 'gpt-4.1-mini');
    assert.ok(!JSON.stringify(report).includes('synthetic-private-secret'));
  });

  await t.test('flagged input is not sent to generation', async () => {
    let generated = false;
    const report = await runTrial({ provider: { moderate: async () => true, askAI: async () => { generated = true; } } });
    assert.equal(generated, false);
    assert.equal(report.cases[0].errorCode, 'TUTOR_SAFETY');
  });

  await t.test('flagged output is excluded from the report', async () => {
    let moderationCalls = 0;
    const report = await runTrial({ provider: { moderate: async () => ++moderationCalls > 1,
      askAI: async () => ({ reply: 'synthetic-flagged-output' }) } });
    assert.equal(report.cases[0].errorCode, 'TUTOR_SAFETY');
    assert.equal(report.cases[0].reply, undefined);
    assert.ok(!JSON.stringify(report).includes('synthetic-flagged-output'));
  });

  await t.test('an originally absent model setting remains absent after a failure', async () => {
    delete process.env.AI_MODEL;
    const report = await runTrial({ provider: { moderate: async () => { throw null; } } });
    assert.equal(report.transportStatus, 'FAIL');
    assert.equal(report.cases[0].errorCode, 'TRIAL_ERROR');
    assert.equal(Object.hasOwn(process.env, 'AI_MODEL'), false);
  });
});
