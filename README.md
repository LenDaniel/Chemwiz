# ChemWiz v1.4.0 — Account recovery and password security

Start with **[ACCOUNT_RECOVERY_README.md](ACCOUNT_RECOVERY_README.md)** for the complete/changed-files installation routes, exact commands, EmailJS setup and current Render administrator diagnosis. The changed-files installer targets a complete verified **v1.3.1** installation; use the complete ZIP in a fresh folder for an older or mixed deployment.

One Node application serves Home `/`, Student `/student/`, Admin `/admin/` and `/api/*`. Both workspaces call the backend on the same address. Existing chemistry content, Wiz text/voice, subscriptions, learner-state saving, desktop/mobile logout and W2 accessibility are retained.

## This release

- One-hour, one-use email reset links and eight-digit codes through a backend-only EmailJS utility and supplied HTML templates.
- Shared stronger-password policy, Show/Hide controls, and a mandatory upgrade after a correct sign-in with an older weak password.
- Atomic recovery consumption, expiry/code-attempt/resend controls and revocation of the account's old sessions after a password change.
- Home copyright and D’ineiru Microsystems attribution, with WhatsApp support at +263 718 645 362.
- Read-only public/environment/account diagnostics that can run with Render's host variables without a local environment file.

Account recovery metadata is additive. Accounts, roles, subscriptions and saved learning data are retained. Stored hashes cannot reveal password complexity: older accounts sign in once to check their password. A weak password leads to the upgrade screen before workspace access.

## Install and verify

Use Node 24. From the unified folder containing package.json and server.js:

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
npm start
```

Open http://localhost:5000. Use `npm run dev` for normal editing. Keep the current working release as rollback. Private environment settings and user data are excluded from the ZIPs. Setup creates local configuration only when absent and preserves existing settings.

Configure actual EmailJS service/template/public/private keys before relying on email recovery. Utility: `backend/src/utils/email.js`. Templates: `docs/emailjs/`. Enable non-browser API requests in EmailJS Account → Security. See ACCOUNT_RECOVERY_README.md for exact template fields and Render settings.

New local demo accounts use admin@chemwiz.local / ChemWiz-local-Admin!2026 and student@chemwiz.local / ChemWiz-local-Student!2026. Existing private settings/accounts retain their credentials. These demo settings do not create administrators in MongoDB.

## Render

Build `npm ci --include=dev && npm run build`; Start `npm start`; Health `/api/ready`. Retain existing MongoDB/JWT/AI settings, set NODE_ENV=production and DATA_MODE=mongodb, and configure APP_URL as the actual public HTTPS origin. Commit the complete tested source and verification/release-evidence.json together. Any source/dependency change requires repeating the checks.

```powershell
npm run diagnose:admin -- "https://chemwiz.co.zw"
```

For the actual production account, run the diagnostic in Render's shell with `--account "YOUR_ADMIN_EMAIL"`. Public checks confirm origin/database routing but do not verify a typed password or admin role. See [ADMIN_LOGIN_GUIDE.md](ADMIN_LOGIN_GUIDE.md).

## Further guidance

- [Standing build rules](BUILD_RULES.md) and [integration coverage](INTEGRATION_CHECKS.md).
- [Current verification](docs/VERIFICATION.md) and [master roadmap v4.5](CHEMWIZ_MASTER_ROADMAP_V4_5_2026-10-15.md).
- [Render production](RENDER_PRODUCTION.md), [optional Cloudflare production](CLOUDFLARE_PRODUCTION.md), [other Node hosts](HOSTING.md).
- [Configuration/data migration](MIGRATION.md). MongoDB records remain in the selected database; local JSON records need their explicit import when changing data modes.

W3 browser/performance/failure-state work remains next after account-security deployment acceptance, then the retained PWA/Android/Windows tracks. Real mailbox, Atlas update and microphone/provider/device acceptance are separate from the isolated release checks.
