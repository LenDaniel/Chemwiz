const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const required = ['package.json', 'package-lock.json', 'server.js', '.env.example', 'vite.config.mjs',
  'scripts/setup.cjs', 'backend/app.js', 'backend/src/data/localModels.js', 'backend/src/data/modelProvider.js',
  'backend/src/services/learningState.service.js', 'shared/learning-defaults.json',
  'web/index.html', 'web/student/index.html', 'web/admin/index.html',
  'web/student/src/main.jsx', 'web/admin/src/main.jsx', 'web/student/src/hooks/useLearningState.js',
  'web/student/src/search/lessonManifest.json',
  'cloudflare/worker.mjs', 'cloudflare/routing.mjs', 'wrangler.jsonc',
  'backend/src/data/workerMongoContext.js', 'scripts/check-production.cjs',
  'scripts/check-mongo.cjs', 'scripts/cloudflare-dev.cjs', '.node-version',
  'web/student/src/content/index.js', 'web/student/src/components/Diagram.jsx',
  'web/student/src/components/Primitives.jsx', 'web/student/scripts/verify-content.mjs',
  'web/student/scripts/verify-k4.mjs', 'RENDER_PRODUCTION.md',
  'CHEMWIZ_MASTER_ROADMAP_V4_5_2026-10-15.md', 'AGENTS.md', 'BUILD_RULES.md', 'INTEGRATION_CHECKS.md',
  'scripts/check-integration.mjs', 'scripts/run-local-checks.mjs', 'scripts/release-gate.mjs',
  'scripts/check-local-browser.mjs', 'scripts/probe-api-connections.mjs',
  'scripts/lib/source-checks.mjs', 'scripts/lib/gate-state.mjs', 'scripts/lib/fixture-config.cjs',
  'scripts/integration-contracts.json', 'scripts/build-guard.mjs', 'tests/build-gate.test.mjs',
  'shared/useDialog.js', 'web/student/src/utils/diagramLayout.mjs', 'web/admin/src/config/session.mjs',
  'scripts/diagnose-admin.mjs', 'scripts/lib/admin-diagnostics.mjs', 'scripts/lib/w2-browser-checks.mjs', 'tests/w2-admin.test.mjs', 'ADMIN_LOGIN_GUIDE.md',
  '.gitignore', '.env.production.example', '.dev.vars.example', 'tests/cors.test.cjs',
  'scripts/diagnose-release.mjs', 'scripts/lib/release-diagnostics.mjs', 'tests/release-recovery.test.mjs',
  'RECOVERY_README.md', 'docs/RENDER_RECOVERY_ASSESSMENT_2026-10-14.md',
  'ACCOUNT_RECOVERY_README.md','shared/password-policy.mjs','shared/PasswordField.jsx','shared/AccountRecovery.jsx','shared/account.css',
  'backend/src/utils/email.js','backend/src/middleware/auth-limits.js','tests/password-recovery.test.cjs',
  'scripts/lib/account-browser-checks.mjs','docs/emailjs/password-reset.html','docs/emailjs/password-changed.html',
  'shared/legal-version.json','shared/legal-documents.json','shared/PrivacyPanel.jsx','shared/PrivacyLinks.jsx','shared/privacy.css',
  'web/legal/index.html','web/legal/main.jsx','backend/src/models/Governance.js','backend/src/services/governanceStore.js',
  'backend/src/services/privacy.service.js','backend/src/services/schools.service.js','backend/src/services/privacyMaintenance.service.js',
  'backend/src/middleware/privacy.middleware.js','backend/src/routes/privacy.routes.js','backend/src/routes/schools.routes.js',
  'web/admin/src/components/PrivacyAdmin.jsx','scripts/privacy-maintenance.cjs','scripts/lib/privacy-fixture.cjs','tests/privacy-schools.test.cjs','scripts/lib/privacy-browser-checks.mjs',
  'web/student/src/components/ConnectionStatus.jsx','scripts/check-performance.mjs','scripts/lib/performance-checks.mjs',
  'scripts/performance-budgets.json','scripts/check-w3-browsers.mjs','scripts/lib/w3-browser-checks.mjs','tests/w3-regression.test.cjs',
  'web/admin/src/components/LazyUsersPanel.jsx','web/student/src/utils/studentPwa.mjs','web/student/src/components/PwaControls.jsx',
  'web/public/student/manifest.webmanifest','web/public/student/offline.html','web/public/student/icons/chemwiz.svg',
  'web/public/student/icons/chemwiz-192.png','web/public/student/icons/chemwiz-512.png',
  'scripts/build-pwa.cjs','scripts/check-pwa.cjs','scripts/lib/student-service-worker.cjs','scripts/lib/pwa-checks.cjs',
  'scripts/lib/v16-browser-checks.mjs','tests/pwa-policy.test.cjs',
  'backend/src/services/adminRecords.service.js','shared/content-inventory.json','scripts/generate-content-inventory.mjs',
  'web/admin/src/components/RecordPanels.jsx','web/admin/src/components/LazyRecordPanel.jsx','web/admin/src/components/RecordConfirmDialog.jsx',
  'tests/admin-recycle.test.cjs','scripts/lib/v17-browser-checks.mjs'];
const failures = required.filter((file) => !fs.existsSync(path.join(root, file)));
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => item.isDirectory()
    ? files(path.join(directory, item.name)) : [path.join(directory, item.name)]);
}
let imports = 0;
for (const file of files(path.join(root, 'backend')).filter((file) => file.endsWith('.js'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
    const base = path.resolve(path.dirname(file), match[1]);
    imports += 1;
    if (![base, `${base}.js`, `${base}.cjs`, `${base}.json`, path.join(base, 'index.js')].some((candidate) => fs.existsSync(candidate))) {
      failures.push(`${path.relative(root, file)} → ${match[1]}`);
    }
  }
}
if (process.argv.includes('--production')) {
  for (const file of ['dist/index.html', 'dist/student/index.html', 'dist/admin/index.html']) {
    if (!fs.existsSync(path.join(root, file))) failures.push(file);
  }
}
if (failures.length) { console.error('Missing required source:', failures.join('\n')); process.exitCode = 1; }
else console.log(`Source check: PASS (${required.length} required files; ${imports} local backend imports). This checks source completeness, not live database or provider access.`);
