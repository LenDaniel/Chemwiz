import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium, firefox } from 'playwright';
import { runW3Checks } from './lib/w3-browser-checks.mjs';
import { runV16Checks } from './lib/v16-browser-checks.mjs';
import { runV17Checks } from './lib/v17-browser-checks.mjs';
import { readJson, writeJson, verifyPreflight } from './lib/gate-state.mjs';
import { sourceFingerprint } from './lib/source-checks.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const fingerprint = sourceFingerprint(root).digest;
const report = { status: 'FAIL', fingerprint, version: readJson(path.join(root, 'package.json')).version, checkedAt: new Date().toISOString(), browsers: [],
  environment: { chromiumExecutableOverride: Boolean(process.env.CHEMWIZ_TEST_BROWSER_PATH), firefoxContentSandboxDisabled: process.env.MOZ_DISABLE_CONTENT_SANDBOX === '1' },
  scope: 'Only the explicitly requested browsers. Touch emulation does not establish Android-device acceptance; screen-reader and physical-device review remain separate.' };
let fixture, instance;
try {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args[0] && !/^--browsers=[a-z,]+$/.test(args[0]))) throw new Error('Use npm run test:w3 -- --browsers=chromium,firefox,chrome,msedge');
  const names = [...new Set((args[0]?.slice('--browsers='.length) || 'chromium,firefox').split(','))];
  if (names.some(name => !['chromium', 'firefox', 'chrome', 'msedge'].includes(name))) throw new Error('Supported browsers: chromium, firefox, chrome, msedge.');
  const issues = verifyPreflight(root);
  if (issues.length) throw new Error(issues.join(' '));
  fixture = require('./lib/fixture-config.cjs').configureFixture('w3-browser-matrix');
  instance = await require('../server.js').createApplication();
  await new Promise(resolve => instance.server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${instance.server.address().port}`;
  for (const name of names) {
    let browser;
    let watchdog;
    try {
      const options = { headless: true, timeout: 20000 };
      if (name === 'chromium') {
        options.args = process.env.CHEMWIZ_TEST_BROWSER_ARGS ? JSON.parse(process.env.CHEMWIZ_TEST_BROWSER_ARGS) : ['--no-sandbox', '--disable-dev-shm-usage'];
        if (process.env.CHEMWIZ_TEST_BROWSER_PATH) options.executablePath = process.env.CHEMWIZ_TEST_BROWSER_PATH;
      } else if (name === 'chrome' || name === 'msedge') options.channel = name;
      browser = await (name === 'firefox' ? firefox : chromium).launch(options);
      watchdog = setTimeout(() => { browser.close().catch(() => {}); }, 180000);
      const result = await runW3Checks({ root, browser, base, label: name });
      const v16 = await runV16Checks({ root, browser, base, app: instance.app });
      const v17 = await runV17Checks({root,browser,base});
      report.browsers.push({ name, ...result, v16, v17 });
      console.log(`W3 + PWA/admin ${name} ${browser.version()}: PASS (${result.checks.length} W3 and ${v16.checks.length} PWA/admin and ${v17.checks.length} recycle/content checks).`);
    } catch (error) {
      report.browsers.push({ name, status: 'FAIL', error: error.message });
      console.error(`W3 ${name}: FAIL. ${error.message}`);
    } finally { clearTimeout(watchdog); if (browser) await browser.close(); }
  }
  if (sourceFingerprint(root).digest !== fingerprint) throw new Error('Source changed while browser checks were running. Repeat the checks.');
  if (report.browsers.length && report.browsers.every(result => result.status === 'PASS')) report.status = 'PASS';
} catch (error) { report.error = error.message; console.error('W3 browser matrix: FAIL.', error.message); }
finally {
  writeJson(path.join(root, 'verification/w3-browser-matrix.json'), report);
  if (instance?.server.listening) await new Promise(resolve => instance.server.close(resolve));
  fixture?.cleanup();
  if (report.status !== 'PASS') process.exitCode = 1;
}
