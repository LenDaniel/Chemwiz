# ChemWiz v1.4.0 — Account recovery and password security

Date: 15 October 2026. Baseline: complete, verified v1.3.1 recovery release. This update prioritises the requested account security work before W3. Keep the current folder/commit as rollback. Existing accounts, roles, subscriptions, chemistry content and saved learning data remain in place; the new password metadata is additive.

## Installation

Choose ONE route:

- Complete ZIP: extract ChemWiz-Updated-System-v1.4.0-2026-10-15.zip into a fresh folder. The contained chemwiz-unified directory is the application root. Keep your existing private .env and local data separately; copy them into the new folder if retaining that local installation. On Render, retain the existing private Environment values and the intended MongoDB database.
- Changed-files ZIP: extract ChemWiz-Changed-Files-v1.4.0-2026-10-15.zip OUTSIDE the app/repository. In the extracted patch folder, run the installer below against an existing complete v1.3.1 folder. It checks all baselines before writing and backs up replaced files. It refuses conflicting edits and supports Windows line endings. It does not apply to the older mixed v1.2.1 upload; use the complete ZIP for that installation.

```powershell
node .\apply-patch.cjs "C:\PATH_TO_YOUR_EXISTING\chemwiz-unified"
```

Open a terminal in the actual application folder and run in order:

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
npm start
```

Use Node 24. Local app: http://localhost:5000 ; Student: /student/ ; Admin: /admin/. For normal development use npm run dev. Checks use isolated accounts, a guarded local data file and a captured EmailJS response. They never send real reset messages or use live Atlas/provider credentials. A browser or advisory check that cannot run blocks the gate.

## EmailJS setup

The backend utility is **backend/src/utils/email.js**. EmailJS keys stay on the backend. The frontend calls only the unified ChemWiz API. No EmailJS SDK, service key or private reset credential is embedded in the frontend bundle.

1. In your EmailJS account, connect your email service and verify the sender as required by that service.
2. Create a reset template. Set **To Email** to `{{to_email}}`, **To Name** to `{{to_name}}`, **From Name** to ChemWiz, and Subject to `Reset your ChemWiz password`.
3. Copy **docs/emailjs/password-reset.html** into the template's HTML/code editor. Use the double-brace variables unchanged. The email contains both a button/link and an eight-digit code.
4. Optionally create a separate notification template using **docs/emailjs/password-changed.html**, To Email `{{to_email}}`, To Name `{{to_name}}`, Subject `Your ChemWiz password changed`.
Before using the backend sender, open **EmailJS → Account → Security**, enable API requests for non-browser applications, and enable private-key authorization for server requests. EmailJS documents non-browser requests as disabled by default.

5. In Render → Environment, set your own values:

```dotenv
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_RESET_TEMPLATE_ID=your_reset_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
EMAILJS_PASSWORD_CHANGED_TEMPLATE_ID=your_optional_notification_template_id
APP_URL=https://chemwiz.co.zw
NODE_ENV=production
DATA_MODE=mongodb
```

Preserve the existing MONGODB_URI, JWT_SECRET and AI settings. APP_URL must match the real public application origin. Reset URLs are built from trusted server configuration and use HTTPS in production. Do not prefix EmailJS settings with VITE_. The service sends via EmailJS's REST API using its private key; configure server/private-key access in your EmailJS account as appropriate. EmailJS documents a one-request-per-second limit; the utility spaces sends within the running process. Multiple replicas need a shared mail queue/rate-limit store before scaling.

Template parameters: to_email, to_name, reset_url, reset_code, expires_in, expires_at, support_whatsapp, support_url, app_name. The notification template uses only to_email, to_name, app_name, support_url. Neither template receives a password.

Configure actual delivery BEFORE relying on email recovery. Missing settings return a clear global configuration error with the helpline. Provider delivery rejection is logged without addresses, tokens, codes or provider credentials; the public request keeps its generic response and clears the unusable challenge. A missing optional notification template does not prevent a valid password change. Template/service/key setup and real mailbox delivery still need your acceptance; the release tests capture provider requests instead of sending emails.

## Password and recovery behaviour

- New passwords require at least 12 characters, a letter, an ASCII number and a non-space special character. Common/repeated choices are rejected. The bcrypt limit is 72 UTF-8 bytes; Unicode characters may use more than one byte. Confirm the new password twice.
- Existing account hashes cannot reveal whether a password is strong. Older sessions therefore require one sign-in to check the entered password. A correct strong password is accepted and marked current. A correct weak password produces a restricted 15-minute upgrade challenge and opens an upgrade screen before workspace access. Wrong passwords produce no challenge.
- The password upgrade needs the existing correct password; it works even before EmailJS is configured. It does not grant admin privileges or create a new account. Admin/learner roles and saved data are retained. Old accounts are not deleted, and their passwords are not changed until they complete the flow.
- Forgot password is available to learners and administrators. A valid request gets the same generic reply for existing, unknown, inactive and cooling-down emails. Links and codes expire after exactly one hour from issuance. A resend has a 60-second cooldown and invalidates the previous challenge when a new one is issued.
- Link tokens are 32 random bytes; codes contain eight random digits. Only a token digest and a keyed code digest are stored. Raw tokens/codes are not returned by the API or written to application logs/database. URL tokens are in fragments, are cleared from the browser address after loading, and cannot be consumed by an email scanner merely opening the link.
- Five failed code attempts exhaust that challenge. Normal sign-in is not locked by reset-code guessing. Correct reset/upgrade is committed atomically against the old password and challenge, so concurrent/replayed submissions cannot both succeed.
- Reset/upgrade revokes the account's previous access tokens and outstanding reset credentials. Users sign in normally with their new password afterward. The frontend clears only the current workspace's auth cache; learning caches/records remain intact.
- Login/register/recovery have dedicated attempt limits. Short-code attempts and resend state persist in the selected database; general rate-limit counters are process memory and reset on restart. Multi-instance deployment requires a shared limiter store. On Render, set TRUST_PROXY=1 if using its single trusted proxy hop so IP-based limits can distinguish clients; origin allowlisting still uses explicit trusted public configuration.
- Show/Hide controls are available on learner/admin login, signup and password-change fields. Home includes the requested copyright/developer attribution and WhatsApp helpline +263 718 645 362.

Fresh local demo credentials (development/local mode only) are admin@chemwiz.local / ChemWiz-local-Admin!2026 and student@chemwiz.local / ChemWiz-local-Student!2026. Existing private .env files and existing account passwords are retained; an older weak demo account uses the upgrade screen. These settings do not create MongoDB administrators.

## Diagnose your Render administrator

A credential-free check on 15 October confirmed that **https://chemwiz.co.zw** returns MongoDB readiness, accepts its own public origin, reaches the login handler and correctly rejects anonymous admin access. Its backend did not advertise the current version, indicating an older deployment. These observations do not verify a typed password or the administrator's role/record. An attempted credentialed live sign-in diagnostic was blocked by automatic approval review because that credential use/privileged access was not clearly authorised; no privileged findings from that attempt were used. Direct account inspection from the earlier saved database settings was unavailable from this environment. The old file is not authoritative for current Render Environment values.

After applying this source, run locally:

```powershell
npm run diagnose:admin -- "https://chemwiz.co.zw"
```

Then, in the **Render service shell** with its actual environment, run:

```bash
npm run diagnose:admin -- "https://chemwiz.co.zw" --account "YOUR_ACTUAL_ADMIN_EMAIL"
```

No private .env.production file is required on Render: the command can use host variables directly. On your own computer with matching private production settings, add `--env ".env.production"`. Only native collection reads are used; the tool does not initialize indexes, save records, reset passwords or print credential material.

| Finding | Meaning/action |
| --- | --- |
| DEPLOYED_VERSION review | Push the complete tested v1.4.0 source and matching report to the linked branch. Verify /api/health reports 1.4.0. |
| CORS_ORIGIN_BLOCKED / ORIGIN_MATCH review | APP_URL must be the actual public HTTPS origin; preserve database/secret values. |
| DATA_MODE / MONGODB_URI review | Confirm MongoDB mode and the intended Atlas database. A localhost Mongo URI refers to the Render instance itself. |
| ACCOUNT_NOT_FOUND | That email is not in the selected production database. LOCAL_ADMIN_EMAIL/PASSWORD only seed local JSON data, not MongoDB accounts. |
| ADMIN_ROLE_MISSING | The account is a learner/teacher, not an admin. Public signup does not grant administration. Use an existing authorised admin to assign roles; preserve the learner account. |
| ACCOUNT_INACTIVE | The account is suspended/disabled; preserve its record and review its status through authorised administration. |
| EMAIL_CASE_MISMATCH | v1.4.0 accepts one unambiguous case-insensitive email match. Older builds may reject a legacy mixed-case email. |
| AMBIGUOUS_EMAIL | Duplicate records use the same email ignoring case. Resolve that data issue with backups before signing in. |
| ADMIN_RECORD_OK but login fails | The record/role/hash format is valid, but the diagnostic has not checked your typed password. Use email recovery after configuring EmailJS. |
| ACCOUNT_INSPECTION_UNAVAILABLE | Run in Render's shell or use matching private production settings with Atlas network access; review the sanitized error category. |

If and ONLY if this is an intended new database with no administrator, use the existing bootstrap command in Render's shell:

```bash
npm run create-admin
```

It asks for a valid email and a strong hidden password and refuses to overwrite an existing email. A public learner signup cannot replace the admin bootstrap. Do not reset the database or JWT secret as a troubleshooting shortcut.

## Publish after local acceptance

Before committing an existing repository, remove already tracked private files from Git's index while keeping them on disk:

```powershell
git rm --cached --ignore-unmatch -- .env .env.production .dev.vars data/local-db.json
git status --short
```

Commit the full tested source, restored configuration examples, package/lockfile and verification/release-evidence.json together. The patch installer/readme/manifest stay outside the app. Actual .env, user records, node_modules, .build-checks and patch-backups stay out of Git. Any source/dependency edit invalidates the previous evidence and needs a rerun.

Render Build: `npm ci --include=dev && npm run build`. Start: `npm start`. Health: `/api/ready`. Root Directory: the folder containing package.json/server.js, blank when at repository root. Use Node 24 via the included .node-version. Keep the gate enabled. Deploy the complete checked commit, then verify the version, actual admin/learner sign-in, real EmailJS mailbox delivery, expiry/replay handling, account separation and saved progress. No live deployment or production password change was performed by this build.

## Rollback and next phase

Retain the complete v1.3.1 release. Restore its source/package/lockfile/report as a set and rebuild/test. Additional password metadata does not delete existing accounts or learning records. Passwords deliberately changed by users remain their current credentials; restoring old source does not restore an old password. Older source does not enforce the new recovery/session-revocation protections, so prefer fixing forward after users begin using v1.4.0.

W3 (broader browsers/performance/failure states) remains next after this security build's deployment acceptance, followed by PWA/Android/Windows tracks. See CHEMWIZ_MASTER_ROADMAP_V4_5_2026-10-15.md.

References: https://www.emailjs.com/docs/rest-api/send/ ; https://github.com/emailjs-com/emailjs-nodejs ; https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html ; https://render.com/docs/environment-variables
