const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const cases = require('./lib/wiz-luna-cases.cjs');

const MODEL = 'gpt-6-luna';
const SETTINGS = { reasoningEffort: 'medium', maxOutputTokens: 16384 };
const errorCodes = new Set(['AI_NOT_CONFIGURED', 'AI_UNAVAILABLE', 'AI_PROVIDER_LIMIT', 'AI_EMPTY_REPLY', 'TUTOR_SAFETY']);

function parseArgs(argv) {
  let mode = 'dry-run', explicitMode = false, envFile;
  for (let i = 0; i < argv.length; i++) {
    if (['--run', '--dry-run', '--help'].includes(argv[i])) {
      if (explicitMode) throw new Error('Choose one trial mode.');
      mode = argv[i].slice(2); explicitMode = true;
    } else if (argv[i] === '--env-file' && argv[i + 1] && !argv[i + 1].startsWith('--') && !envFile) {
      envFile = path.resolve(argv[++i]);
    } else throw new Error('Unrecognised trial arguments.');
  }
  return { mode, envFile };
}

function tokens(value) { return Number.isSafeInteger(value) && value >= 0 ? value : 0; }

async function runTrial({ provider = require('../backend/src/services/ai.service'), now = Date.now } = {}) {
  const previousModel = process.env.AI_MODEL;
  const report = { model: MODEL, settings: SETTINGS, startedAt: new Date(now()).toISOString(),
    transportStatus: 'FAIL', chemistryReview: 'PENDING', cases: [] };
  process.env.AI_MODEL = MODEL;
  try {
    for (const item of cases) {
      const start = now();
      const result = { id: item.id, question: item.question, rubric: item.rubric, status: 'FAIL' };
      try {
        if (await provider.moderate(item.question)) throw Object.assign(new Error('Trial safety check failed.'), { code: 'TUTOR_SAFETY' });
        const answer = await provider.askAI({ message: item.question, history: [], context: {
          topicId: item.topicId, topicTitle: item.topicTitle, featureKey: 'operator-luna-trial', featureLabel: 'Operator model trial',
        } });
        if (!answer || typeof answer.reply !== 'string' || !answer.reply.trim()) throw Object.assign(new Error('Empty trial reply.'), { code: 'AI_EMPTY_REPLY' });
        if (await provider.moderate(answer.reply)) throw Object.assign(new Error('Trial safety check failed.'), { code: 'TUTOR_SAFETY' });
        result.status = 'ANSWER_RECEIVED';
        result.reply = answer.reply;
        result.tokens = { input: tokens(answer.usage?.input_tokens), output: tokens(answer.usage?.output_tokens),
          reasoning: tokens(answer.usage?.output_tokens_details?.reasoning_tokens) };
      } catch (error) {
        result.errorCode = errorCodes.has(error?.code) ? error.code : 'TRIAL_ERROR';
      }
      result.elapsedMs = Math.max(0, now() - start);
      report.cases.push(result);
      if (result.status !== 'ANSWER_RECEIVED') break; // No automatic paid retries.
    }
    if (report.cases.length === cases.length && report.cases.every(item => item.status === 'ANSWER_RECEIVED')) report.transportStatus = 'PASS';
  } finally {
    if (previousModel === undefined) delete process.env.AI_MODEL; else process.env.AI_MODEL = previousModel;
    report.finishedAt = new Date(now()).toISOString();
  }
  return report;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.mode === 'help') {
    console.log('Usage: npm run test:wiz-live -- [--dry-run | --run] [--env-file "PATH"]');
    console.log('Default: dry run with no API calls. --run sends three fixed chemistry questions using backend-only credentials.');
    return 0;
  }
  if (options.mode === 'dry-run') {
    console.log(JSON.stringify({ mode: 'dry-run', networkRequests: 0, model: MODEL, settings: SETTINGS, cases }, null, 2));
    return 0;
  }
  const root = path.resolve(__dirname, '..');
  if (options.envFile && !fs.existsSync(options.envFile)) throw new Error('The selected environment file is unavailable.');
  require('dotenv').config({ path: options.envFile || path.join(root, '.env'), quiet: true });
  if (!String(process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '').trim()) {
    console.error('Live trial requires OPENAI_API_KEY (or AI_API_KEY) in the backend environment.');
    return 1;
  }
  // The override exists in this CLI process only. The running service, private
  // configuration, users, account quotas and working voice settings are untouched.
  const report = await runTrial();
  const folder = path.join(root, 'verification');
  fs.mkdirSync(folder, { recursive: true });
  const output = path.join(folder, 'luna-medium-trial-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + randomUUID().slice(0, 8) + '.json');
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  for (const item of report.cases) {
    console.log('\n' + item.id + ': ' + item.status + ' (' + item.elapsedMs + ' ms)');
    if (item.reply) { console.log(item.reply); console.log('Tokens: ' + JSON.stringify(item.tokens)); }
    else console.log('Error code: ' + item.errorCode);
  }
  console.log('\nTransport: ' + report.transportStatus + '. Chemistry accuracy: PENDING teacher review against the included rubrics.');
  console.log('Trial report: ' + output);
  return report.transportStatus === 'PASS' ? 0 : 1;
}

module.exports = { runTrial, parseArgs, cases, SETTINGS, MODEL };
if (require.main === module) main().then(code => { process.exitCode = code; }).catch(() => {
  console.error('The trial could not run or save its report. Check arguments, environment-file access and output-folder access.');
  process.exitCode = 1;
});
