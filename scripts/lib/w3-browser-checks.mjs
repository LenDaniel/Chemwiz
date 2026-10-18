import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { adultOnboarding } = require('./privacy-fixture.cjs');

async function request(base, route, method = 'GET', body, token) {
  const response = await fetch(base + route, { method, headers: {
    'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }, ...(body ? { body: JSON.stringify(body) } : {}) });
  assert.ok(response.ok, `Fixture request failed: ${method} ${route} (${response.status})`);
  return response.json();
}
async function navigate(page, name) {
  const desktop = page.locator('.cw-sidebar-link').filter({ hasText: name });
  await (await desktop.isVisible() ? desktop : page.locator('.cw-mobile-tab').filter({ hasText: name })).click();
}
async function waitForSaved(base, token, predicate) {
  const deadline = Date.now() + 12000;
  do {
    const data = await request(base, '/api/progress/me', 'GET', null, token);
    if (predicate(data.state)) return data;
    await new Promise(resolve => setTimeout(resolve, 100));
  } while (Date.now() < deadline);
  throw new Error('The browser change did not recover into the server learning record.');
}

export async function runW3Checks({ root, browser, base, label = 'local' }) {
  const checks = [], errors = [];
  const screenshots = path.join(root, '.build-checks/screenshots');
  fs.mkdirSync(screenshots, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  context.setDefaultTimeout(12000);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  let mobileContext;
  try {
    const account = await request(base, '/api/auth/register', 'POST', {
      name: 'W3 synthetic learner', email: `w3-${randomUUID()}@build-gate.test`,
      password: 'W3-browser-fixture-password!2026', onboarding: adultOnboarding(),
    });
    const token = account.token;
    assert.ok(token);
    await page.goto(base + '/student/');
    await page.getByRole('button', { name: 'LOGIN', exact: true }).waitFor();
    assert.equal(await page.getByRole('main').count(), 1);
    await page.evaluate(token => localStorage.setItem('cw.authToken', token), token);

    await page.route('**/api/auth/me', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"Synthetic outage"}' }));
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.reload();
      await page.getByRole('button', { name: 'Retry saved session', exact: true }).waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), token);
      assert.equal(await page.locator('.cw-topic-tile').count(), 0, 'An unverified saved token must not open the workspace.');
    }
    await page.screenshot({ path: path.join(screenshots, `w3-${label}-session-recovery.png`) });
    await page.unroute('**/api/auth/me');
    await page.getByRole('button', { name: 'Retry saved session', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    assert.equal(await page.locator('.cw-topic-tile').count(), 24);
    checks.push('A temporary 503 preserves the learner token across reloads; explicit retry revalidates before opening the workspace');

    await page.route('**/api/auth/me', route => route.abort('failed'));
    await page.reload();
    await page.getByRole('button', { name: 'Retry saved session', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), token);
    await page.unroute('**/api/auth/me');
    await page.getByRole('button', { name: 'Retry saved session', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    checks.push('A connection failure preserves the learner session and can recover');

    await page.route('**/api/auth/me', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Temporary proxy page</html>' }));
    await page.reload();
    await page.getByRole('button', { name: 'Retry saved session', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), token);
    await page.unroute('**/api/auth/me');
    await page.getByRole('button', { name: 'Retry saved session', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    checks.push('An unreadable success response retains the token and fails closed with a retry');

    const skip = page.getByRole('link', { name: 'Skip to learning content', exact: true });
    await skip.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'cw-main-content');
    await navigate(page, 'TOOLS');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'cw-main-content');
    checks.push('The skip link and screen navigation move keyboard focus into the main landmark');

    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion:reduce)').matches), true);
    assert.equal(await page.locator('.cw-app-root').evaluate(root => {
      const probe = document.createElement('span');
      probe.style.transition = 'opacity 2s'; root.append(probe);
      const duration = getComputedStyle(probe).transitionDuration; probe.remove(); return duration;
    }), '0s');
    checks.push('The learner workspace honours reduced-motion preferences');

    await navigate(page, 'PROFILE');
    await waitForSaved(base, token, () => true);
    await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    await context.setOffline(true);
    await page.getByRole('status').filter({ hasText: 'You appear to be offline.' }).waitFor();
    await page.getByRole('button', { name: 'LIGHT', exact: true }).click();
    await page.getByText('Changes waiting to save', { exact: true }).waitFor();
    const before = await request(base, '/api/progress/me', 'GET', null, token);
    assert.notEqual(before.state.settings.theme, 'light');
    await context.setOffline(false);
    await waitForSaved(base, token, state => state.settings.theme === 'light');
    await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    await page.getByRole('status').filter({ hasText: 'You appear to be offline.' }).waitFor({ state: 'hidden' });
    checks.push('Offline feedback appears, a setting stays pending, and reconnect saves it to the same learner record');

    await navigate(page, 'HOME');
    await page.route('**/assets/atomic-*.js', route => route.fulfill({ status: 503, body: 'Synthetic missing topic' }));
    await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
    await page.getByRole('status').filter({ hasText: 'Could not load this topic.' }).waitFor();
    await page.getByRole('button', { name: 'Try again', exact: true }).click();
    await page.getByRole('button', { name: 'Reload app', exact: true }).waitFor();
    await navigate(page, 'PROFILE');
    await context.setOffline(true);
    await page.getByRole('button', { name: 'DARK', exact: true }).click();
    await page.getByText('Changes waiting to save', { exact: true }).waitFor();
    await navigate(page, 'HOME');
    await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
    await page.getByRole('button', { name: 'Reload app', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Reload paused' }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), token);
    await context.setOffline(false);
    await waitForSaved(base, token, state => state.settings.theme === 'dark');
    checks.push('Reload is blocked while learning changes cannot be saved, then reconnect preserves those changes');
    await page.unroute('**/assets/atomic-*.js');
    await page.getByRole('button', { name: 'Reload app', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), token);
    await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
    await page.locator('.cw-action-tile').filter({ hasText: 'CHAPTERS' }).click();
    await page.locator('.cw-chapter-tile').first().click();
    await page.locator('.cw-reader-body').waitFor();
    checks.push('A failed topic chunk exposes retry/reload; explicit reload restores current lessons and retains sign-in');

    await page.route('**/assets/searchEngine-*.js', route => route.fulfill({ status: 503, body: 'Synthetic missing search' }));
    await page.locator('.cw-topbar-search').click();
    await page.getByRole('status').filter({ hasText: 'Search could not load.' }).waitFor();
    await page.unroute('**/assets/searchEngine-*.js');
    await page.getByRole('button', { name: 'Reload app', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    const trigger = page.locator('.cw-topbar-search');
    await trigger.click();
    const search = page.getByRole('textbox', { name: 'Search all ChemWiz content' });
    await search.fill('W3zzzzNoSuchChemistryTerm');
    await page.getByRole('status').filter({ hasText: 'No matching lesson section' }).waitFor();
    await search.fill('Haber');
    await page.getByRole('status').filter({ hasText: 'matching results.' }).waitFor();
    await search.focus(); await page.keyboard.press('Shift+Tab');
    assert.ok(await page.getByRole('dialog', { name: 'Search ChemWiz' }).evaluate(dialog => dialog.contains(document.activeElement)));
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(element => document.activeElement === element), true);
    checks.push('Search load failure can recover; results/empty states are announced and Escape restores keyboard focus');

    await trigger.click(); await search.fill('Haber');
    await page.locator('.cw-search-result').first().waitFor();
    await search.press('Enter');
    await page.locator('.cw-reader-body,.cw-action-grid').first().waitFor();
    assert.equal(await page.getByRole('dialog', { name: 'Search ChemWiz' }).count(), 0);
    checks.push('Enter opens the best search result into the current chemistry content');

    mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const phone = await mobileContext.newPage();
    phone.on('pageerror', error => errors.push(error.message));
    await phone.goto(base + '/student/');
    await phone.evaluate(token => localStorage.setItem('cw.authToken', token), token);
    await phone.reload(); await phone.locator('.cw-topic-tile').first().waitFor();
    await phone.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).tap();
    await phone.locator('.cw-action-tile').filter({ hasText: 'CHAPTERS' }).tap();
    await phone.locator('.cw-chapter-tile').first().tap(); await phone.locator('.cw-reader-body').waitFor();
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await phone.screenshot({ path: path.join(screenshots, `w3-${label}-touch-reader.png`) });
    checks.push('A separate 390px touch context restores the account and opens a lesson without page-wide overflow (emulated, not a physical Android device)');
    await mobileContext.close(); mobileContext = null;

    await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    const cacheKey = `cw.learning.${account.user.id}`;
    const cache = await page.evaluate(key => localStorage.getItem(key), cacheKey);
    assert.ok(cache);
    await page.evaluate(() => localStorage.setItem('cw.authToken', 'invalid.synthetic.token'));
    await page.reload(); await page.getByRole('button', { name: 'LOGIN', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), '');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), cacheKey), cache);
    assert.equal(await page.locator('.cw-topic-tile').count(), 0);
    checks.push('A genuinely invalid token is removed while the account learning cache stays intact');
    assert.deepEqual(errors, []);
    return { status: 'PASS', checks, browser: browser.version(), scope: 'Isolated local API and controlled network failures; desktop and touch emulation. No live provider, real school, assistive-technology or physical-device acceptance.' };
  } finally {
    if (mobileContext) await mobileContext.close();
    await context.close();
  }
}
