import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { adultOnboarding } = require('./privacy-fixture.cjs');
async function request(base, route, method = 'GET', body, token) {
  const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
function age(type, id) {
  const local = require('../../backend/src/data/localModels');
  assert.match(path.basename(path.dirname(local.DATA_FILE)), /^chemwiz-/);
  assert.equal(process.env.DATA_MODE, 'local');
  local.atomicAdminMutation(state => {
    const bin = type === 'account' ? state.users.find(user => user._id === id).recycleBin : state.governance.find(doc => doc.key === 'content:' + id).data.recycleBin;
    bin.deletedAt = new Date(Date.now() - 91 * 86400000).toISOString(); bin.purgeEligibleAt = new Date(Date.now() - 86400000).toISOString();
  });
}
export async function runV17Checks({ root, browser, base }) {
  const checks = [], context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  context.setDefaultTimeout(15000);
  const page = await context.newPage(), errors = [], newRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/\/api\/admin\/(recycle-bin|content)/.test(new URL(request.url()).pathname)) newRequests.push(request.url()); });
  const password = 'Recycle-browser-adult-fixture!2026', email = 'v17-' + randomUUID() + '@build-gate.test';
  try {
    const created = await request(base, '/api/auth/register', 'POST', { name: 'V17 synthetic retained adult', email, password, onboarding: adultOnboarding() }); assert.equal(created.status, 201);
    const account = created.data;
    const state = JSON.parse(fs.readFileSync(path.join(root, 'shared/learning-defaults.json'))); state.settings.theme = 'light';
    assert.equal((await request(base, '/api/progress/me', 'PUT', { revision: 0, state }, account.token)).status, 200);
    await page.goto(base + '/admin/'); await page.locator('#admin-email').fill(process.env.LOCAL_ADMIN_EMAIL); await page.locator('#admin-password').fill(process.env.LOCAL_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Login', exact: true }).click(); await page.locator('.admin-mini-card').waitFor();
    const adminToken = await page.evaluate(() => localStorage.getItem('chemwiz.admin.token'));
    const binToggle = page.getByRole('button', { name: 'Recycle bin', exact: true }), contentToggle = page.getByRole('button', { name: 'Content & Sources', exact: true });
    assert.equal(await binToggle.getAttribute('aria-expanded'), 'false'); assert.equal(await contentToggle.getAttribute('aria-expanded'), 'false'); assert.equal(newRequests.length, 0);
    checks.push('Recycle bin and content controls start collapsed and make no data requests before opening');

    await page.getByRole('button', { name: 'Users & Subscriptions', exact: true }).click();
    const row = page.locator('#admin-users-table tbody tr').filter({ hasText: email }); await row.waitFor();
    assert.equal(await row.getByRole('button', { name: 'Delete account', exact: true }).isDisabled(), true);
    page.once('dialog', dialog => dialog.accept()); await row.getByLabel('Account status for ' + email, { exact: true }).selectOption('suspended');
    await page.waitForFunction(email => { const row = [...document.querySelectorAll('#admin-users-table tbody tr')].find(row => row.textContent.includes(email)); return row && ![...row.querySelectorAll('button')].find(button => button.textContent === 'Delete account')?.disabled; }, email);
    await row.getByRole('button', { name: 'Delete account', exact: true }).click();
    let dialog = page.getByRole('dialog', { name: 'Delete account', exact: true }); await dialog.waitFor();
    await dialog.getByLabel('Deletion reason', { exact: true }).fill('Synthetic browser account deletion');
    await dialog.getByLabel('Deletion confirmation', { exact: true }).fill('wrong'); assert.equal(await dialog.getByRole('button', { name: 'Move to recycle bin', exact: true }).isDisabled(), true);
    await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(email); await dialog.getByRole('button', { name: 'Move to recycle bin', exact: true }).click(); await dialog.waitFor({ state: 'hidden' }); await row.waitFor({ state: 'hidden' });
    assert.equal(newRequests.length, 0);
    assert.equal((await request(base, '/api/auth/me', 'GET', null, account.token)).status, 401);
    checks.push('Active accounts cannot be deleted; a suspended account needs a typed email and reason, then disappears from users and loses its session');

    await binToggle.click(); const binPanel = page.getByLabel('Recycle bin controls', { exact: true });
    let card = binPanel.locator('article').filter({ hasText: email }); await card.waitFor();
    assert.equal(await card.getByRole('button', { name: 'Delete forever', exact: true }).isDisabled(), true);
    assert.ok(await card.getByText('Protected by the 90-day retention period.', { exact: true }).isVisible());
    assert.equal((await request(base, '/api/admin/recycle-bin/account:' + account.user.id, 'DELETE', { confirmation: email }, adminToken)).status, 409);
    checks.push('The bin shows its retention date and blocks permanent deletion in both the UI and server before 90 days');
    await card.getByRole('button', { name: 'Restore', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Restore from recycle bin', exact: true });
    await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(email); await dialog.getByRole('button', { name: 'Restore', exact: true }).click(); await dialog.waitFor({ state: 'hidden' });
    await row.waitFor(); assert.equal(await row.getByLabel('Account status for ' + email, { exact: true }).inputValue(), 'suspended');
    page.once('dialog', d => d.accept()); await row.getByLabel('Account status for ' + email, { exact: true }).selectOption('active');
    await page.waitForFunction(email => [...document.querySelectorAll('#admin-users-table select[aria-label]')].some(e => e.getAttribute('aria-label') === 'Account status for ' + email && e.value === 'active'), email);
    const signedIn = await request(base, '/api/auth/login', 'POST', { email, password }); assert.equal(signedIn.status, 200);
    assert.equal((await request(base, '/api/progress/me', 'GET', null, signedIn.data.token)).data.state.settings.theme, 'light');
    assert.equal((await request(base, '/api/auth/me', 'GET', null, account.token)).status, 401);
    checks.push('Restore keeps the account suspended until explicit reactivation, preserves learning and leaves old tokens revoked');

    page.once('dialog', d => d.accept()); await row.getByLabel('Account status for ' + email, { exact: true }).selectOption('disabled');
    await row.getByRole('button', { name: 'Delete account', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Delete account', exact: true });
    await dialog.getByLabel('Deletion reason', { exact: true }).fill('Synthetic mature account purge'); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(email); await dialog.getByRole('button', { name: 'Move to recycle bin', exact: true }).click(); await dialog.waitFor({ state: 'hidden' });
    age('account', account.user.id); await binPanel.getByRole('button', { name: 'Refresh list', exact: true }).click();
    card = binPanel.locator('article').filter({ hasText: email }); await card.getByRole('button', { name: 'Delete forever', exact: true }).click();
    dialog = page.getByRole('dialog', { name: 'Permanently delete', exact: true }); await dialog.getByRole('button', { name: 'Cancel', exact: true }).click(); assert.ok(await card.isVisible());
    await card.getByRole('button', { name: 'Delete forever', exact: true }).click(); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(email); await dialog.getByRole('button', { name: 'Delete forever', exact: true }).click(); await dialog.waitFor({ state: 'hidden' }); await card.waitFor({ state: 'hidden' });
    assert.equal((await request(base, '/api/admin/recycle-bin/account:' + account.user.id + '/restore', 'POST', { confirmation: email }, adminToken)).status, 404);
    checks.push('An aged fixture can be permanently deleted only after explicit confirmation; cancel preserves it and purge cannot be restored');

    await page.route('**/api/admin/recycle-bin?*', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"Synthetic recycle outage"}' }));
    await binPanel.getByRole('button', { name: 'Refresh list', exact: true }).click(); await binPanel.getByRole('alert').filter({ hasText: 'Synthetic recycle outage' }).waitFor();
    assert.ok(await page.locator('.admin-mini-card').isVisible()); await page.unroute('**/api/admin/recycle-bin?*'); await binPanel.getByRole('button', { name: 'Refresh list', exact: true }).click(); await binPanel.getByRole('alert').waitFor({ state: 'hidden' });
    checks.push('A bin outage keeps admin signed in and recovers through Refresh list');

    await contentToggle.click(); const materialPanel = page.getByLabel('Content and source controls', { exact: true }); await materialPanel.getByText('Existing content inventory', { exact: true }).waitFor();
    await materialPanel.getByRole('button', { name: 'Link to draft', exact: true }).first().waitFor();
    const title = 'V17 original chemistry draft ' + randomUUID();
    await materialPanel.getByLabel('Material title', { exact: true }).fill(title); await materialPanel.getByLabel('Draft text', { exact: true }).fill('Original synthetic chemistry explanation for browser review.');
    await materialPanel.getByLabel('Creator or rights holder', { exact: true }).fill('Synthetic teacher'); await materialPanel.getByLabel('License or ownership description', { exact: true }).fill('Original test draft');
    await materialPanel.getByLabel('Original source URL', { exact: true }).fill('javascript:alert(1)'); await materialPanel.getByRole('button', { name: 'Save material draft', exact: true }).click(); await materialPanel.getByRole('alert').filter({ hasText: 'http or https' }).waitFor();
    await materialPanel.getByLabel('Original source URL', { exact: true }).fill(''); await materialPanel.getByRole('button', { name: 'Save material draft', exact: true }).click(); await materialPanel.getByRole('status').filter({ hasText: 'Draft saved.' }).waitFor();
    let material = materialPanel.locator('article').filter({ has: page.getByRole('heading', { name: title, exact: true }) }); await material.waitFor();
    assert.ok(await material.getByText('Offline scope: Not cleared', { exact: true }).isVisible());
    checks.push('Content/source controls load on demand; a real draft persists, unsafe source URLs fail and unreviewed material is not cleared for offline use');

    const savedDraft = (await request(base, '/api/admin/content?search=' + encodeURIComponent(title), 'GET', null, adminToken)).data.items[0];
    assert.equal((await request(base, '/api/admin/content/' + savedDraft.id, 'PUT', { ...savedDraft, body: 'A newer synthetic revision.' }, adminToken)).status, 200);
    await materialPanel.getByLabel('Draft text', { exact: true }).fill('My preserved local edit'); await materialPanel.getByRole('button', { name: 'Save material draft', exact: true }).click();
    await materialPanel.getByRole('alert').filter({ hasText: 'draft changed' }).waitFor(); assert.equal(await materialPanel.getByLabel('Draft text', { exact: true }).inputValue(), 'My preserved local edit');
    await materialPanel.getByRole('button', { name: 'Refresh list', exact: true }).click(); await material.getByRole('button', { name: 'Edit draft', exact: true }).click();
    assert.equal(await materialPanel.getByLabel('Draft text', { exact: true }).inputValue(), 'A newer synthetic revision.');
    checks.push('Stale draft saves fail without discarding local text, and the newer server revision can be reopened');

    await material.getByRole('button', { name: 'Delete draft', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Delete draft material', exact: true });
    await dialog.getByLabel('Deletion reason', { exact: true }).fill('Synthetic recoverable material cleanup'); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(title); await dialog.getByRole('button', { name: 'Move to recycle bin', exact: true }).click(); await dialog.waitFor({ state: 'hidden' }); await material.waitFor({ state: 'hidden' });
    card = binPanel.locator('article').filter({ hasText: title }); await card.waitFor(); assert.equal(await card.getByRole('button', { name: 'Delete forever', exact: true }).isDisabled(), true);
    await card.getByRole('button', { name: 'Restore', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Restore from recycle bin', exact: true }); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(title); await dialog.getByRole('button', { name: 'Restore', exact: true }).click(); await dialog.waitFor({ state: 'hidden' }); await material.waitFor();
    assert.ok(await material.getByText(/draft · revision/).isVisible());
    checks.push('Draft materials use the same protected bin and restore as drafts requiring fresh review');

    await material.getByRole('button', { name: 'Delete draft', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Delete draft material', exact: true }); await dialog.getByLabel('Deletion reason', { exact: true }).fill('Synthetic final material cleanup'); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(title); await dialog.getByRole('button', { name: 'Move to recycle bin', exact: true }).click(); await dialog.waitFor({ state: 'hidden' });
    age('material', savedDraft.id); await binPanel.getByRole('button', { name: 'Refresh list', exact: true }).click(); await card.getByRole('button', { name: 'Delete forever', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Permanently delete', exact: true }); await dialog.getByLabel('Deletion confirmation', { exact: true }).fill(title); await dialog.getByRole('button', { name: 'Delete forever', exact: true }).click(); await dialog.waitFor({ state: 'hidden' }); await card.waitFor({ state: 'hidden' });
    assert.equal((await request(base, '/api/admin/content?search=' + encodeURIComponent(title), 'GET', null, adminToken)).data.items.length, 0);
    checks.push('Confirmed permanent deletion removes an aged material from the bin and draft store');

    await page.setViewportSize({ width: 390, height: 844 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await contentToggle.focus(); await contentToggle.press('Enter'); assert.equal(await contentToggle.getAttribute('aria-expanded'), 'false'); await contentToggle.press('Enter'); assert.equal(await contentToggle.getAttribute('aria-expanded'), 'true');
    checks.push('The new controls fit mobile width and their disclosure buttons work with the keyboard');
    assert.deepEqual(errors, []);
    return { status: 'PASS', checks, scope: 'Real local UI/API with synthetic accounts/drafts. Retention ages are advanced only inside the isolated fixture database. No live database, external backup erasure or rights verification is claimed.' };
  } finally { await context.close(); }
}
