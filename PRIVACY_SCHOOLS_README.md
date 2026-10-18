# ChemWiz v1.5.0 — S1 privacy and school onboarding

Baseline: verified v1.4.0 account recovery release. Prepared 16 October 2026.

## What this release adds

- Seven public policy pages: Privacy, Learner Summary, Terms, Child Safety, Device Storage, AI/Voice and Schools. Home, sign-in and account choices link to them; all use ChemWiz’s navy/cyan theme.
- Admin publication form for the actual legal operator, address, privacy contact, hosting/overseas arrangements, provider retention and backup schedule. New learner activation waits for publication. The app does not invent a registered operator or privacy mailbox.
- Explicit age/terms/privacy onboarding, including existing accounts. Existing account IDs, password hashes, subscriptions and learning records are retained. Optional AI/audio choices start off in the ordinary signup form.
- Verified guardian authorisations for ages 13–17. An authorised platform admin records the signed-consent and authority verification reference, then privately shares a limited, single-use, seven-day invitation for the approved child email. Public users cannot grant themselves guardian approval. Issuing a new authorisation supersedes earlier invitations for that child; withdrawing the current authorisation cannot be bypassed with an older invitation. Under-13 accounts are not supported.
- Named-school permissions for children, guardian withdrawal and adulthood review. A school payment, teacher confirmation or possession of an email is not treated as proof of parental authority.
- School contracts/DPA references, expiry, status and seat reservations; separate school membership roles; explicit member confirmation before sharing; teacher class scoping; limited school progress exports; school access revocation and subscription expiry. School membership can supply paid-feature access while valid.
- Account data exports, versioned consent event history, optional processing withdrawal, privacy requests, reviewed deletion approval and an explicit retention maintenance command.
- The updated navy/cyan EmailJS HTML templates from the separately delivered template pack are included in `docs/emailjs`.

This release records an administrator’s manual verification of written guardian authority. It does not add a self-service guardian identity service or automatically send guardian invitations. Share enrolment links privately with the verified guardian through your approved procedure. The existing automated password reset/changed emails remain supported.

## Before deployment

Keep the working release/commit as rollback and retain a protected backup of MongoDB. Do not replace your private `.env`, live database, JWT secret or existing provider settings. No administrator account is recreated automatically by this update. A rollback restores the older control set; pause any child/school pilot until its required safeguards are available again. Production admin login was confirmed by the owner after creating the missing production admin on 16 October; the account remains in MongoDB.

Choose one installation route.

### Full system ZIP

Extract the updated system into a separate folder for testing. Copy your private local configuration into that folder only if needed; keep real production credentials out of ordinary local tests. For a clean development installation, the setup script generates `.env` with local JSON data and local demo accounts.

For an existing repository, replace the public source with the full ZIP’s application contents using Git/GitHub Desktop so configuration examples and release evidence are included. Preserve private environment settings and data. There are no removed public source files in this S1 patch.

### Changed-files ZIP

Use its installer against an **unchanged v1.4.0 source baseline**. From the extracted changed-files folder, outside the application folder, run:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

Replace the example path with your existing v1.4.0 application folder. The installer validates the baseline, backs up replaced files, preserves private settings/data and refuses unknown source changes. Do not extract a changed-files ZIP blindly over a different version.

After either route, run these commands from the folder containing `package.json` and `server.js`, one at a time:

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
npm start
```

Use Node 24 LTS. If Chrome/Edge is already installed, the browser checker can use it; alternatively set `CHEMWIZ_TEST_BROWSER_PATH` to a compatible installed Chromium executable. A missing advisory service, browser, required file or API connection blocks the gate. Do not use `npm audit fix --force` to bypass dependency review.

Open http://localhost:5000, `/student/`, `/admin/` and `/legal/privacy`. For normal editing use `npm run dev`. Stop with Ctrl+C.

## Local acceptance

1. Sign in as the local administrator. Open **Privacy and school administration → Publish operator and privacy details**. For a synthetic local test use clearly labelled test data, a `.test` privacy mailbox and synthetic hosting/retention descriptions. Confirm publication after reviewing the values.
2. Open all policy pages on desktop and phone. Check the operator details, contact links, theme, readability and absence of horizontal overflow.
3. Sign in as an existing test learner. Complete the new setup, then confirm their previous learning records remain. Register an adult test account with explicit age/terms/privacy choices. Check AI/audio start off; enable only the choices being tested.
4. For a synthetic guardian test, record a synthetic authority/written-consent reference, the approved child email, signed date and verified 18th birthday. Issue the invitation; open it in a new browser profile. Register only the approved child email. Check expired/reused/wrong-email invitations fail. Withdraw the authorisation and confirm the child session loses learning access.
5. Create two synthetic schools with signed-contract/DPA test references, future expiry and seats. Assign existing test accounts as school administrators, teachers and learners. Keep their platform role as `student` unless a separate global role is genuinely intended. Have each member confirm their school sharing in Profile. Under-18 sharing must match the school in the guardian’s authorisation.
6. In a school staff account open **Profile → Privacy, school and account choices → Your school workspaces**. Verify teacher class boundaries, other-school denial and the limited report export. Revoke the membership or expire the school and confirm report/plan access stops while personal learning data remains.
7. Change optional AI/voice choices and confirm the backend refuses the affected feature even if an old browser tab is open. Child AI stays blocked until the operator’s eligibility/safety assessment is explicitly approved, and the guardian’s permissions still apply.
8. Export a test account and submit a correction/privacy request. Review it in Admin. For a deletion test, use only a disposable account and confirm the exact account ID. Access stops immediately after approval; the maintenance tool keeps the 24-hour review window. Automated tests advance an isolated fixture’s clock; do not alter production clocks or records to accelerate testing.

## Production publication and onboarding

Render remains one Node web service with the tested source and `verification/release-evidence.json` committed together:

```text
Build: npm ci --include=dev && npm run build
Start: npm start
Health check: /api/ready
NODE_ENV=production
DATA_MODE=mongodb
APP_URL=https://YOUR_REAL_PUBLIC_ORIGIN
```

Retain the existing MONGODB_URI, JWT_SECRET, OpenAI and EmailJS settings. No new mandatory environment key is introduced; privacy/school settings are saved in the existing selected backend database. The new MongoDB collection is `governances`; `User.privacy` is additive and defaults to null. Local JSON gains a `governance` collection without resetting existing arrays or accounts.

After deployment, the existing platform administrator can still sign in. **Publish the actual reviewed operator details before allowing learner activation.** Existing learners will need to complete their own onboarding; do not fill consent fields in bulk on their behalf. The legal operator, physical/service address, monitored privacy email, hosting/overseas and retention statements must reflect reality. The product cannot obtain legal review, POTRAZ licensing/authorisations, signed school contracts, provider agreements or staff training for you.

The guardian workflow requires an approved private authority-verification procedure and written consent covering the current notices/terms and any optional processing. Review the provided form with your Zimbabwe adviser/DPO. Store documentary evidence in its approved restricted system and record only a reference in ChemWiz. Do not use WhatsApp, tutor chat or the request explanation field as an identity-document upload channel.

The adult signup age group is a declaration, not independent identity verification. Complete the child DPIA and proportionate age-assurance review before a minor/school pilot. A checked “child AI review complete” flag records your decision; it does not configure provider zero retention or obtain provider/regulatory approval. School reporting is limited to current progress summaries, not a full school MIS, class assessment system or historical analytics suite.

## Retention maintenance — deliberate writes

The tool defaults to a dry run. It lists case IDs/actions without printing names, passwords, hashes or database credentials.

```powershell
npm run privacy:maintenance
```

For a private production configuration from an authorised local terminal:

```powershell
npm run privacy:maintenance -- --env ".env.production" --dry-run
```

After verifying the due cases, approval/authority and retention requirements, the deliberate apply command is:

```powershell
npm run privacy:maintenance -- --env ".env.production" --apply
```

On an authorised Render Shell the existing runtime environment is used, so omit `--env`.

- Only an approved learner deletion whose 24-hour window is due can be erased. Platform administrator deletion is excluded. Guardian evidence for another learner, including historical or withdrawn evidence, places the case on hold for a documented retention review.
- Eligible erasure removes the user, learning state, own governance/consent/membership/request records, bound guardian records and school seat reservations; it redacts the target details in admin logs and retains a minimal case receipt without the account identity. MongoDB uses a transaction; unsupported/unavailable transaction execution fails rather than partially erasing data. Local mode commits one atomic file replacement.
- Unredeemed guardian invitations expire in seven days. Maintenance redacts their personal fields after 30 days, retaining a minimal expiry record.
- Run and monitor the procedure regularly through your authorised operations process; it is **not scheduled automatically**. It does not erase provider logs, mailbox copies, external evidence, exported files or backups. Apply their separate approved schedules and holds.

Never run `--apply` against live records just to test the build. Staging uses a separate service and database; its configuration must not point at the live data.

## Evidence and limits

The integration tool covers every discovered frontend API function, mounted route, authentication/middleware mapping, source integrity and known dependency advisories. S1 adds executable probes for all new privacy/school API functions and adds backend tests for guardian/age controls, school/class boundaries, membership expiry/revocation, seat contention, exports, withdrawal and erasure. Its browser evidence covers legal pages, preserved legacy progress, choices, requests, exports, school staff access, admin publication, guardian enrolment and withdrawal.

The release gate now requires S1 browser evidence as well as W2 and account recovery evidence. Exact passing counts and fingerprints are in the delivered verification report. Synthetic local checks and captured email requests do not prove live Atlas transaction behaviour, actual provider delivery/settings, legal compliance or real guardian identity verification. Perform the documented staging/device/provider acceptance before the school pilot.

## Next sequence

Complete S1 staging/legal/operational acceptance, then return to W3 browser/performance/failure-state work. PWA, Android/Capacitor and Windows follow in their retained order. Self-service guardian verification/email workflows, richer school classes/assessments, bulk enrolment, scheduled reminders, school billing and complete provider-backed age assurance remain future work rather than hidden assumptions in this release.
