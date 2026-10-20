import {runPrivacyChecks} from './lib/privacy-browser-checks.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { runW2Checks } from './lib/w2-browser-checks.mjs';
import { runAccountChecks } from './lib/account-browser-checks.mjs';
import { runW3Checks } from './lib/w3-browser-checks.mjs';
import { runV16Checks } from './lib/v16-browser-checks.mjs';
import { runV17Checks } from './lib/v17-browser-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { configureFixture } = require('./lib/fixture-config.cjs');
const fixture = configureFixture('browser-check');
let browser, instance;
const checks = [], errors = [];
async function launchBrowser() {
  const options = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.CHEMWIZ_TEST_BROWSER_ARGS) options.args = JSON.parse(process.env.CHEMWIZ_TEST_BROWSER_ARGS);
  if (process.env.CHEMWIZ_TEST_BROWSER_PATH) {
    options.executablePath = process.env.CHEMWIZ_TEST_BROWSER_PATH;
    return chromium.launch(options);
  }
  for (const channel of [undefined, 'chrome', 'msedge']) {
    try { return await chromium.launch({ ...options, ...(channel ? { channel } : {}) }); } catch {}
  }
  throw new Error('Browser unavailable. Run npx playwright install chromium, or set CHEMWIZ_TEST_BROWSER_PATH to an installed Chromium/Chrome/Edge executable.');
}
async function api(base, route, method = 'GET', body, token) {
  const response = await fetch(base + route, { method, headers: {
    ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, data: await response.json() };
}
async function login(page, base, email, password) {
  await page.goto(base + '/student/');
  await page.getByPlaceholder('Email', { exact: true }).fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
  await page.locator('.cw-topic-tile').first().waitFor();
}
async function tab(page, text) {
  const desktop = page.locator('.cw-sidebar-link').filter({ hasText: text });
  if (await desktop.isVisible()) await desktop.click();
  else await page.locator('.cw-mobile-tab').filter({ hasText: text }).click();
}
async function waitSaved(base, token, predicate) {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    const { data } = await api(base, '/api/progress/me', 'GET', null, token);
    if (predicate(data)) return data;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('The browser change did not reach the backend learner record.');
}
try {
  instance = await require('../server.js').createApplication();
  await new Promise((resolve) => instance.server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${instance.server.address().port}`;
  browser = await launchBrowser();
  const desktop = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base + '/');
  assert.equal(await page.locator('.workspace-card').count(), 2);
  checks.push('Unified home has both workspace links');
  await page.goto(base + '/student/');
  await page.getByRole('button', { name: 'No account yet? Create one', exact: true }).click();
  await page.getByLabel('Age group',{exact:true}).selectOption('adult');
  await page.getByLabel('I accept the current Terms of Use.',{exact:true}).check();
  await page.getByLabel('I have read the Privacy Notice.',{exact:true}).check();
  await page.getByLabel('Allow optional Wiz AI processing of my questions.',{exact:true}).check();
  await page.getByPlaceholder('Full name').fill('Browser fixture learner');
  await page.getByPlaceholder('Email', { exact: true }).fill('browser@build-gate.test');
  await page.getByPlaceholder('Password', { exact: true }).fill('Browser-fixture-password!2026');
  await page.getByPlaceholder('Confirm password',{exact:true}).fill('Browser-fixture-password!2026');
  await page.getByRole('button', { name: 'CREATE ACCOUNT', exact: true }).click();
  await page.locator('.cw-topic-tile').first().waitFor();
  const token = await page.evaluate(() => localStorage.getItem('cw.authToken'));
  const me = await api(base, '/api/auth/me', 'GET', null, token);
  assert.equal(me.data.user.role, 'student'); assert.equal(me.data.user.subscriptionTier, 'free');
  checks.push('Public signup reaches the backend and creates a Free student');
  const admin = (await api(base, '/api/auth/login', 'POST', { email: process.env.LOCAL_ADMIN_EMAIL, password: process.env.LOCAL_ADMIN_PASSWORD })).data;
  assert.equal((await api(base, '/api/admin/users/' + me.data.user.id + '/subscription', 'PATCH', { subscriptionTier: 'premium' }, admin.token)).status, 200);
  await page.reload(); await page.locator('.cw-topic-tile').first().waitFor();
  await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
  await page.locator('.cw-action-tile').filter({ hasText: 'CHAPTERS' }).click();
  await page.locator('.cw-chapter-tile').first().click();
  await page.locator('.cw-reader-body').waitFor();
  await waitSaved(base, token, (value) => value.state.progress.atomic?.chaptersRead.length > 0);
  checks.push('A chapter reader saves progress through the API to the backend');
  await tab(page, 'HOME');
  await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
  await page.locator('.cw-action-tile').filter({ hasText: 'PAPER 1' }).click();
  for (let i = 0; i < 100; i++) {
    if (await page.getByText('QUIZ COMPLETE', { exact: true }).isVisible()) break;
    await page.getByRole('button').filter({ hasText: /^\[A\]/ }).click();
    const finish = page.getByRole('button', { name: 'FINISH', exact: true });
    if (await finish.isVisible()) { await finish.click(); break; }
    await page.getByRole('button', { name: 'NEXT →', exact: true }).click();
  }
  await page.getByText('QUIZ COMPLETE', { exact: true }).waitFor();
  await waitSaved(base, token, (value) => value.state.progress.atomic?.quizzesTaken === 1);
  checks.push('Completing a quiz saves its result through the backend');
  await tab(page, 'PROFILE');
  await page.getByRole('button', { name: 'LIGHT', exact: true }).click();
  await waitSaved(base, token, (value) => value.state.settings.theme === 'light');
  await page.locator('.cw-sidebar-logout').click();
  await page.getByPlaceholder('Email', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), '');
  await login(page, base, 'browser@build-gate.test', 'Browser-fixture-password!2026');
  assert.equal(await page.locator('.cw-app-root').evaluate((element) => element.style.getPropertyValue('--cw-color-scheme')), 'light');
  checks.push('Sidebar logout clears the session and login restores saved settings');
  const phoneContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const phone = await phoneContext.newPage(); phone.on('pageerror', (error) => errors.push(error.message));
  await login(phone, base, 'browser@build-gate.test', 'Browser-fixture-password!2026');
  await tab(phone, 'STATS');
  await phone.getByText(/1 chapters read/).first().waitFor();
  assert.equal(await phone.locator('.cw-app-root').evaluate((element) => element.style.getPropertyValue('--cw-color-scheme')), 'light');
  checks.push('A second browser/device restores the saved account progress');
  for (const target of [page, phone]) {
    await tab(target, 'HOME');
    assert.equal(await target.locator('.cw-topic-tile').count(), 24);
    for (let i = 0; i < 24; i++) {
      await target.locator('.cw-topic-tile').nth(i).click();
      await target.locator('.cw-action-tile').filter({ hasText: 'CHAPTERS' }).click();
      await target.locator('.cw-chapter-tile').first().waitFor();
      assert.ok(await target.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await tab(target, 'HOME');
    }
  }
  checks.push('All 24 production topic chunks load on desktop and mobile');
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox', { name: 'Search all ChemWiz content' }).fill('Haber');
  await page.locator('.cw-search-result').first().waitFor();
  await page.locator('.cw-search-result').first().click();
  await page.locator('.cw-reader-body,.cw-action-grid').first().waitFor();
  checks.push('Universal search loads and navigates into the chemistry content');
  await page.locator('.cw-wiz-fab').click();
  await page.locator('#cw-wiz-input').fill('Explain covalent bonding');
  await page.getByRole('button', { name: 'SEND', exact: true }).click();
  await page.getByText(/local.*mode|local.*test/i).first().waitFor();
  checks.push('Wiz UI reaches the backend using the controlled local response');
  await page.goto(base + '/admin/');
  await page.locator('#admin-email').fill(process.env.LOCAL_ADMIN_EMAIL);
  await page.locator('#admin-password').fill(process.env.LOCAL_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.locator('.admin-mini-card').waitFor();
  checks.push('Admin frontend signs in and receives its backend dashboard');
  await phone.goto(base + '/admin/');
  await phone.locator('#admin-email').fill('browser@build-gate.test');
  await phone.locator('#admin-password').fill('Browser-fixture-password!2026');
  await phone.getByRole('button', { name: 'Login', exact: true }).click();
  await phone.locator('.error-box').waitFor();
  assert.equal(await phone.locator('.admin-mini-card').count(), 0);
  checks.push('Student credentials cannot open the admin dashboard');
  const w2=await runW2Checks({root,browser,base,
    learner:{email:'browser@build-gate.test',password:'Browser-fixture-password!2026'},
    admin:{email:process.env.LOCAL_ADMIN_EMAIL,password:process.env.LOCAL_ADMIN_PASSWORD}});
  checks.push(...w2.checks);
  const accountRecovery=await runAccountChecks({browser,base,fixture});
  checks.push(...accountRecovery.checks);
  const privacySchools=await runPrivacyChecks({browser,base,fixture});
  checks.push(...privacySchools.checks);
  const w3 = await runW3Checks({ root, browser, base });
  checks.push(...w3.checks);
  const v16 = await runV16Checks({ root, browser, base, app: instance.app });
  checks.push(...v16.checks);
  const v17 = await runV17Checks({root,browser,base});
  checks.push(...v17.checks);
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(root, '.build-checks/browser.json'), JSON.stringify({ status: 'PASS', browser: browser.version(), checks, w2, accountRecovery, privacySchools, w3, v16, v17 }, null, 2));
  console.log(`Local browser: PASS (${checks.length} checks; desktop/mobile; no JavaScript runtime errors).`);
} catch (error) {
  fs.writeFileSync(path.join(root, '.build-checks/browser.json'), JSON.stringify({ status: 'FAIL', error: error.message, checks }, null, 2));
  console.error('Local browser: FAIL:', error.message); process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (instance?.server.listening) await new Promise((resolve) => instance.server.close(resolve));
  fixture.cleanup();
}
