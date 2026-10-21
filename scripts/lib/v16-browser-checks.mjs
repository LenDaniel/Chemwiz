import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { adultOnboarding } = require('./privacy-fixture.cjs');

async function api(base, route, method = 'GET', body, token) {
  const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  assert.ok(response.ok, `${method} ${route} returned ${response.status}`); return response.json();
}
async function learner(base) {
  const email = `v16-${randomUUID()}@build-gate.test`;
  return { ...(await api(base, '/api/auth/register', 'POST', { name: 'V16 synthetic adult', email, password: 'V16-browser-fixture-password!2026', onboarding: adultOnboarding() })), email };
}
async function tab(page, name) {
  const desktop = page.locator('.cw-sidebar-link').filter({ hasText: name });
  await (await desktop.isVisible() ? desktop : page.locator('.cw-mobile-tab').filter({ hasText: name })).click();
}
async function saved(base, token, predicate) {
  const deadline = Date.now() + 12000;
  do { const value = await api(base, '/api/progress/me', 'GET', null, token); if (predicate(value.state)) return value;
    await new Promise(resolve => setTimeout(resolve, 100)); } while (Date.now() < deadline);
  throw new Error('The browser change did not reach the saved learner record.');
}
async function workerStatus(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const channel = new MessageChannel(); const timer = setTimeout(() => reject(new Error('No worker status response')), 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    navigator.serviceWorker.controller.postMessage({ type: 'RECOVERY_STATUS' }, [channel.port2]);
  }));
}

async function adminChecks({ browser, base }) {
  const checks = [], context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  context.setDefaultTimeout(12000);
  const page = await context.newPage(), errors = [], requests = [], chunks = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const url = new URL(request.url());
    if (request.method() === 'GET' && url.pathname === '/api/admin/users') requests.push(url.searchParams.get('limit'));
    if (/\/assets\/UsersPanel-[^/]+\.js$/.test(url.pathname)) chunks.push(url.pathname);
  });
  try {
    const account = await learner(base);
    await page.goto(base + '/admin/');
    await page.locator('#admin-email').fill(process.env.LOCAL_ADMIN_EMAIL);
    await page.locator('#admin-password').fill(process.env.LOCAL_ADMIN_PASSWORD);
    const privacyLoaded = page.waitForResponse(response => new URL(response.url()).pathname === '/api/privacy/admin/settings' && response.status() === 200);
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.locator('.admin-mini-card').waitFor(); await privacyLoaded;
    const toggle = page.getByRole('button', { name: 'Users & Subscriptions', exact: true });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#admin-users-content').isVisible(), false);
    assert.deepEqual(requests, []); assert.deepEqual(chunks, []);
    checks.push('Dashboard starts with users collapsed and requests neither the users API nor its deferred component');

    await page.getByText('Privacy and school administration', { exact: true }).click();
    await page.getByText('School subscriptions and memberships', { exact: true }).click();
    await page.getByLabel('Existing account', { exact: true }).locator('option').nth(1).waitFor({ state: 'attached' });
    assert.ok(requests.includes('50')); assert.ok(!requests.includes('20')); assert.equal(chunks.length, 0);
    await page.getByLabel('School name', { exact: true }).fill('V16 synthetic test school');
    await page.getByLabel('School privacy contact email', { exact: true }).fill('school@v16.test');
    await page.getByLabel('Signed subscription agreement reference', { exact: true }).fill('SYNTHETIC-V16-CONTRACT');
    await page.getByLabel('Signed data processing agreement reference', { exact: true }).fill('SYNTHETIC-V16-DPA');
    await page.getByLabel('Subscription expiry', { exact: true }).fill(new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10));
    await page.getByRole('button', { name: 'Save school subscription', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'School subscription saved.' }).waitFor();
    const schoolId = await page.getByLabel('School to edit', { exact: true }).inputValue(); assert.ok(schoolId);
    await page.getByLabel('Find existing account by name or email', { exact: true }).fill(account.email);
    const found = page.waitForResponse(response => new URL(response.url()).pathname === '/api/admin/users' && response.status() === 200);
    await page.getByRole('button', { name: 'Find accounts', exact: true }).click(); await found;
    await page.getByLabel('Existing account', { exact: true }).selectOption(account.user.id);
    await page.getByLabel('School', { exact: true }).selectOption(schoolId);
    await page.getByLabel('School role', { exact: true }).selectOption('teacher');
    await page.getByLabel('Class identifiers, separated by commas', { exact: true }).fill('L6-V16');
    const assigned = page.waitForResponse(response => new URL(response.url()).pathname === `/api/schools/${schoolId}/membership` && response.request().method() === 'PUT');
    await page.getByRole('button', { name: 'Save school membership', exact: true }).click(); assert.equal((await assigned).status(), 200);
    await page.getByRole('status').filter({ hasText: 'School membership saved.' }).waitFor();
    assert.equal((await api(base, '/api/auth/me', 'GET', null, account.token)).user.role, 'student');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false'); assert.equal(chunks.length, 0);
    checks.push('School creation and searched membership assignment work while the users table stays closed; school teacher membership does not grant a platform role');
    await page.getByText('Privacy and school administration', { exact: true }).click();

    await toggle.click(); await page.locator('#admin-users-table tbody tr td strong').first().waitFor();
    assert.equal(requests.filter(limit => limit === '20').length, 1); assert.equal(chunks.length, 1);
    const slider = page.getByRole('slider', { name: 'Scroll users table horizontally', exact: true });
    await slider.focus(); await slider.press('End');
    await page.waitForFunction(() => document.getElementById('admin-users-table').scrollLeft > 0);
    const right = await page.locator('#admin-users-table').evaluate(element => element.scrollLeft);
    assert.ok(right > 0);
    await page.locator('#admin-users-table').evaluate(element => { element.scrollLeft = 0; });
    await page.waitForFunction(() => Number(document.getElementById('admin-users-scroll').value) === 0);
    const box = await slider.boundingBox(); assert.ok(box);
    await page.mouse.click(box.x + box.width * .75, box.y + box.height / 2);
    await page.waitForFunction(() => document.getElementById('admin-users-table').scrollLeft > 0);
    checks.push('The top drag bar scrolls the real table with mouse/keyboard and follows native table scrolling');

    const search = page.getByRole('textbox', { name: 'Search users by name or email', exact: true });
    await search.fill('pending filter');
    const beforeCollapse = requests.length, position = await page.locator('#admin-users-table').evaluate(element => element.scrollLeft);
    await toggle.click(); await toggle.click();
    assert.equal(await search.inputValue(), 'pending filter');
    assert.equal(requests.length, beforeCollapse);
    assert.ok(await page.locator('#admin-users-table').evaluate(element => element.scrollLeft) >= position - 2);
    checks.push('Collapse/reopen preserves filter input and horizontal position without refetching accounts');

    await search.fill('V16-no-such-user-zzzz'); await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.getByText('No users found.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await page.locator('#admin-users-table tbody tr td strong').first().waitFor();
    checks.push('Deferred user search, empty results and clearing filters still reach the backend');

    await page.route('**/api/admin/users?*', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"Synthetic users outage"}' }));
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.getByRole('button', { name: 'Retry users', exact: true }).waitFor();
    assert.ok(await page.locator('.admin-mini-card').isVisible());
    assert.ok(await page.evaluate(() => localStorage.getItem('chemwiz.admin.token')));
    await page.unroute('**/api/admin/users?*');
    const restored = page.waitForResponse(response => new URL(response.url()).pathname === '/api/admin/users' && response.status() === 200);
    await page.getByRole('button', { name: 'Retry users', exact: true }).click(); await restored;
    await page.waitForFunction(() => document.getElementById('admin-users-table').getAttribute('aria-busy') === 'false');
    checks.push('A users-panel outage retains admin authority and offers a working retry');

    await toggle.click(); const closedRequests = requests.length;
    const refreshed = page.waitForResponse(response => new URL(response.url()).pathname === '/api/admin/stats');
    await page.getByRole('button', { name: 'Refresh', exact: true }).click(); await refreshed;
    await page.getByRole('button', { name: 'Refresh', exact: true }).waitFor({ state: 'visible' });
    assert.equal(requests.length, closedRequests);
    const reopened = page.waitForResponse(response => new URL(response.url()).pathname === '/api/admin/users' && response.status() === 200);
    await toggle.click(); await reopened;
    assert.equal(requests.length, closedRequests + 1);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    checks.push('Refresh keeps a closed users panel deferred; reopening refreshes it and the controls fit mobile width');
    assert.deepEqual(errors, []);
    return checks;
  } finally { await context.close(); }
}

async function pwaChecks({ root, browser, app }) {
  const checks = [], context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  context.setDefaultTimeout(15000);
  const original = fs.readFileSync(path.join(root, 'dist/student/sw.js'), 'utf8');
  const originalId = JSON.parse(original.match(/const BUILD = ("[^"]+");/)[1]);
  let variant = null, failIcon = false, disconnected = false, second;
  const proxy = http.createServer((request, response) => {
    // Disconnect the origin too: Firefox offline emulation can leave worker
    // fetches online (https://bugzilla.mozilla.org/show_bug.cgi?id=2081131).
    if (disconnected) { request.socket.destroy(); return; }
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    if (failIcon && pathname === '/student/icons/chemwiz-512.png') { response.writeHead(503); response.end('Synthetic recovery file outage'); return; }
    if (variant && pathname === '/student/sw.js') {
      response.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store', 'Service-Worker-Allowed': '/student/' });
      response.end(original.replace(`const BUILD = ${JSON.stringify(originalId)};`, `const BUILD = ${JSON.stringify(variant)};`)); return;
    }
    app(request, response);
  });
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${proxy.address().port}`;
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  async function waiting() {
    await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration('/student/'); await registration.update(); });
    await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration('/student/'))?.waiting));
    await page.getByRole('region', { name: 'App update', exact: true }).waitFor();
  }
  try {
    const account = await learner(base);
    await page.goto(base + '/student/');
    // Let the first document become controlled before the fixture reloads it to inject login.
    // Reloading during activation can leave that navigation uncontrolled despite a healthy active worker.
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.evaluate(token => localStorage.setItem('cw.authToken', token), account.token);
    await page.reload(); await page.locator('.cw-topic-tile').first().waitFor();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const status = await workerStatus(page);
    assert.equal(status.buildId, originalId); assert.equal(status.files.length, 5);
    const manifestResponse = await context.request.get(base + '/student/manifest.webmanifest');
    assert.ok(manifestResponse.ok()); const manifest = await manifestResponse.json();
    assert.equal(manifest.start_url, '/student/'); assert.equal(manifest.scope, '/student/');
    for (const size of [192, 512]) {
      const bytes = await (await context.request.get(base + `/student/icons/chemwiz-${size}.png`)).body();
      assert.equal(bytes.readUInt32BE(16), size); assert.equal(bytes.readUInt32BE(20), size);
    }
    checks.push('The real learner page serves the standalone manifest, correct PNG icon sizes and an active learner-scoped worker');
    const outside = await context.newPage(); await outside.goto(base + '/admin/');
    assert.equal(await outside.evaluate(() => navigator.serviceWorker.controller), null); await outside.close();
    checks.push('The learner worker does not control the admin workspace');

    const prime = await page.evaluate(async token => {
      const response = await fetch('/api/progress/me', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      await response.json(); return { status: response.status, cache: response.headers.get('cache-control') };
    }, account.token);
    assert.equal(prime.status, 200); assert.equal(prime.cache, 'no-store');
    const cached = await page.evaluate(async () => {
      const results = [];
      for (const name of await caches.keys()) if (name.startsWith('chemwiz-student-recovery-')) {
        const cache = await caches.open(name); for (const request of await cache.keys()) results.push(new URL(request.url).pathname);
      }
      return results;
    });
    assert.deepEqual([...cached].sort(), [...status.files].sort());
    checks.push('Cache Storage contains only the five declared public recovery files; authenticated API responses use no-store');

    await tab(page, 'PROFILE'); await page.getByRole('heading', { name: 'Install ChemWiz', exact: true }).waitFor();
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { cancelable: true });
      Object.defineProperties(event, { prompt: { value: async () => { window.__v16PromptCalled = true; } }, userChoice: { value: Promise.resolve({ outcome: 'dismissed' }) } });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: 'Install app', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__v16PromptCalled), true);
    await page.getByRole('status').filter({ hasText: 'You can install ChemWiz later' }).waitFor();
    checks.push('Install-button handling respects a controlled browser-prompt dismissal (no operating-system installation is claimed)');

    await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    disconnected = true; await context.setOffline(true);
    const offlineApi = await page.evaluate(async token => {
      try { await fetch('/api/progress/me', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }); return 'unexpected cached response'; }
      catch { return 'unavailable'; }
    }, account.token);
    assert.equal(offlineApi, 'unavailable');
    await page.getByRole('button', { name: 'LIGHT', exact: true }).click();
    await page.getByText('Changes waiting to save', { exact: true }).waitFor();
    const fallback = await page.reload();
    assert.equal(fallback.headers()['x-chemwiz-offline'], '1');
    await page.getByRole('heading', { name: 'Reconnect to continue learning', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), account.token);
    assert.equal(await page.getByRole('main').count(), 1);
    disconnected = false; await context.setOffline(false); await page.getByRole('link', { name: 'Try ChemWiz again', exact: true }).click();
    await page.locator('.cw-topic-tile').first().waitFor();
    await saved(base, account.token, state => state.settings.theme === 'light');
    checks.push('Offline launch shows the public recovery screen, never replays cached API data, and reconnect preserves sign-in plus pending learning changes');

    await tab(page, 'PROFILE'); await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    variant = originalId + '.next'; await waiting();
    const notice = page.getByRole('region', { name: 'App update', exact: true });
    await tab(page, 'HOME');
    await page.locator('.cw-topic-tile').filter({ hasText: 'Atomic Structure' }).click();
    await page.locator('.cw-action-tile').filter({ hasText: 'PAPER 1' }).click();
    await page.getByRole('button').filter({ hasText: /^\[A\]/ }).click();
    assert.equal(await notice.getByRole('button', { name: 'Save and update app', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button').filter({ hasText: /^\[A\]/ }).getAttribute('aria-pressed'), 'true');
    await tab(page, 'PROFILE');
    checks.push('An update cannot interrupt an active quiz or other study screen; the learner returns to Home/Profile to apply it');
    disconnected = true; await context.setOffline(true); await page.getByRole('button', { name: 'DARK', exact: true }).click();
    await page.getByText('Changes waiting to save', { exact: true }).waitFor();
    await notice.getByRole('button', { name: 'Save and update app', exact: true }).click();
    await notice.getByRole('alert').filter({ hasText: 'Update paused' }).waitFor();
    assert.equal((await workerStatus(page)).buildId, originalId);
    disconnected = false; await context.setOffline(false); await saved(base, account.token, state => state.settings.theme === 'dark');
    checks.push('A waiting update cannot activate while this learner’s changes remain unsaved');

    second = await context.newPage(); await second.goto(base + '/student/'); await second.locator('.cw-topic-tile').first().waitFor();
    await notice.getByRole('button', { name: 'Save and update app', exact: true }).click();
    await notice.getByRole('alert').filter({ hasText: 'Close other ChemWiz learner tabs' }).waitFor();
    await second.close(); second = null;
    await Promise.all([page.waitForNavigation(), notice.getByRole('button', { name: 'Save and update app', exact: true }).click()]);
    await page.locator('.cw-topic-tile').first().waitFor();
    assert.equal((await workerStatus(page)).buildId, variant);
    checks.push('Update asks for other learner tabs to close, then safely activates and reloads after saving');

    const stableId = variant; variant = originalId + '.broken'; failIcon = true;
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration('/student/');
      try { await registration.update(); } catch { return; }
      const installing = registration.installing;
      if (installing && !['installed', 'redundant'].includes(installing.state)) await new Promise(resolve => installing.addEventListener('statechange', () => { if (['installed', 'redundant'].includes(installing.state)) resolve(); }));
    });
    await page.waitForFunction(async () => !(await navigator.serviceWorker.getRegistration('/student/'))?.installing);
    assert.equal((await workerStatus(page)).buildId, stableId);
    assert.equal(await page.evaluate(async name => (await caches.keys()).some(key => key.endsWith(name)), variant), false);
    checks.push('A failed recovery-file download removes its partial cache and leaves the working worker active');

    failIcon = false; variant = originalId; await waiting();
    await page.evaluate(async () => { await caches.open('unrelated-v16-fixture'); });
    await Promise.all([page.waitForNavigation(), page.getByRole('region', { name: 'App update', exact: true }).getByRole('button', { name: 'Save and update app', exact: true }).click()]);
    await page.locator('.cw-topic-tile').first().waitFor();
    assert.equal((await workerStatus(page)).buildId, originalId);
    const names = await page.evaluate(() => caches.keys());
    assert.ok(names.includes('unrelated-v16-fixture')); assert.ok(names.filter(name => name.startsWith('chemwiz-student-recovery-')).length <= 2);
    checks.push('A served-version rollback works; activation bounds owned caches and preserves unrelated origin caches');

    await tab(page, 'PROFILE'); const cacheKey = `cw.learning.${account.user.id}`;
    await page.getByRole('status').filter({ hasText: 'Learning data saved' }).waitFor();
    const beforeClear = await page.evaluate(key => localStorage.getItem(key), cacheKey);
    await page.getByRole('button', { name: 'Clear offline recovery files', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Offline recovery files cleared.' }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('cw.authToken')), account.token);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), cacheKey), beforeClear);
    assert.equal(await page.evaluate(async () => (await caches.keys()).some(name => name.startsWith('chemwiz-student-recovery-'))), false);
    assert.ok((await page.evaluate(() => caches.keys())).includes('unrelated-v16-fixture'));
    checks.push('Clearing offline recovery removes only its files and registration, retaining sign-in, learning records and unrelated caches');
    assert.deepEqual(errors, []);
    return checks;
  } finally {
    disconnected = false; await context.setOffline(false).catch(() => {});
    if (second) await second.close();
    await context.close(); await new Promise(resolve => proxy.close(resolve));
  }
}

export async function runV16Checks({ root, browser, base, app }) {
  const checks = [...await adminChecks({ browser, base }), ...await pwaChecks({ root, browser, app })];
  return { status: 'PASS', checks, scope: 'Real local browser/API/service-worker behaviour with synthetic adult accounts and controlled update/failure variants. Native installation, physical-device testing and offline lesson packs are not established.' };
}
