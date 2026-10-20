# Required ChemWiz build checks

The standing rules are in AGENTS.md and BUILD_RULES.md. The v1.3.0 W2 patch extends the existing gates with six viewport/keyboard/layout checks, all 218 React diagram bounds/text/enlargement checks and admin session outage/recovery checks. Existing accounts, backend data models, origin allowlist and chemistry records are preserved.

The v1.3.1 recovery also requires source-file completeness during preflight, restores omitted CORS/content tests, and adds read-only release diagnostics with per-file comparisons. See RECOVERY_README.md for the corrected package/upload workflow.

## Run in this order

Use Node 24 and open a terminal in the unified folder containing package.json. Install the declared development dependencies because the checks compile the frontend and use a browser:

```bash
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
```

Browser installation is normally needed only once. The primary browser check also tries installed Chrome or Edge; W3a additionally requires Firefox. An unavailable browser is a failed required check. On Linux, Playwright's documented `npx playwright install --with-deps chromium firefox` installs the browsers and their operating-system dependencies. A custom Chromium executable may be selected with CHEMWIZ_TEST_BROWSER_PATH; this is a browser selection, not a skip option.

The integration check must pass before test:local accepts the source. New preflight/local attempts clear the old green release result immediately. Required checks cannot be skipped to obtain PASS. Changes to source, dependencies, configuration examples or build rules invalidate the recorded result. A changed or missing dist build also blocks local/VPS/Cloudflare deployment readiness.

## Coverage

| Check | What must pass |
| --- | --- |
| Source completeness | Required application, test, deployment and public configuration files exist; recorded as a mandatory preflight stage |
| Source integrity | JavaScript/JSX syntax, JSON/JSONC data syntax, relative imports/assets, frontend named imports and declared packages |
| Frontend wiring | Discover request call sites; resolve HTTP method and same-origin API path; connect the fetch wrappers; match each call to a mounted backend route and executable probe |
| Middleware | Follow ordered Express router mounts; require data readiness, authentication, admin role and Premium guards where applicable |
| Actual connections | Execute all 50 current Student/Admin API functions against the real unified Node server and middleware, using disposable fixture accounts |
| Data behaviour | Register separate learners, reject role/plan injection, persist progress/settings, retain learner separation, reject stale saves and invalid learning records; persist admin subscription/status/role changes |
| Defined security controls | Reject anonymous/invalid JWT and student admin access, check CORS/Render origin handling, prevent password/hash response leaks and private-file serving, check production CSP/header settings, flag embedded source credentials and frontend string execution |
| Dependencies | Audit production and development dependencies; high/critical advisories or an unavailable audit block PASS |
| Payload budgets | Check actual compiled files and Vite's manifest; enforce initial/lazy/total byte ceilings and keep all topic/search modules and the UsersPanel component deferred |
| Local acceptance | Existing installation/content/K4/Node regression checks, then a production browser exercising signup, chapter/quiz saves, logout/login, restoration in a second browser, all 24 topic chunks on desktop/mobile, search, local Wiz and admin/student separation |
| W3a browser acceptance | Controlled session/network/chunk failures, safe reload, offline queued-save recovery, keyboard/search announcements, reduced motion and touch emulation; repeat the W3 scenarios in actual Firefox |
| Gate regression | Deliberately broken routes/methods/imports/wrappers/guards, unknown requests, invalid configuration, credential fixtures and stale/failed/incomplete release evidence must be rejected |

The current backend has 54 mounted method/path routes. Four inherited public routes are implementation placeholders; the probe requires their fixed placeholder response and no data fields. Adding real functionality there requires changing the contract, access controls and probes.

## Results and deployment

Detailed preflight reports are written to .build-checks/integration.json, source-analysis.json, api-connections.json and INTEGRATION_REPORT.md. Browser results are in .build-checks/browser.json. These machine-local reports are ignored by git.

After local acceptance passes, verification/release-evidence.json records the sanitized outcomes and source/build fingerprints. Keep that file with the exact tested source in the release repository. It includes neither secrets nor learner records. Do not hand-edit evidence to manufacture a pass.

Render keeps its existing Build Command `npm ci --include=dev && npm run build` and Start Command `npm start`. The npm prebuild hook checks source-matching passing evidence when Render sets RENDER=true. Render then compiles its own dist, so its build hook checks source/evidence rather than requiring a local dist upload. A missing, failed or stale result stops the build. npm run cf:deploy also runs ready:deploy first. For a VPS/manual deployment, run ready:deploy before publishing the tested source and dist. Direct provider/CLI deployment commands outside this workflow are not controlled by the tool.

Keep private environment settings and the existing MongoDB database/JWT secret. Tests use temporary local JSON records, blank provider/database credentials and a Mongo connection refusal guard. They do not write to production.

## Limits and reported follow-ups

The earlier password-minimum and missing dedicated login/register throttling findings are addressed in v1.4.0. Shared limiter storage is still needed before multi-instance scaling. High/critical findings, broken API wiring and failed required controls block the gate.

The security checks are explicit controls plus available dependency advisories; they do not certify the absence of every vulnerability. Static discovery supports the current fetch/Express patterns. Unsupported or ambiguous request declarations fail and need an explicit checked adapter rather than being silently omitted. New API exports need a contract in scripts/integration-contracts.json and a real scenario in scripts/probe-api-connections.mjs.

Local Wiz uses its existing controlled response. Transcription/live voice probes verify frontend transport, authentication, MIME/context headers and the controlled disabled-provider response (503); they do not call a real provider or verify microphone/WebRTC audio. Real Atlas connectivity, provider calls, HTTPS/proxy configuration and physical device behaviour need the relevant private environment/device acceptance. Existing read-only diagnostics remain npm run check:production and npm run check:mongo.

References: [Playwright browser setup](https://playwright.dev/docs/browsers), [Express middleware order](https://expressjs.com/en/guide/using-middleware.html).

The Windows npm launcher invokes the JavaScript npm CLI through Node with shell disabled, preserving literal paths/arguments and removing DEP0190 from this helper. W2 includes a 683×384 effective layout check for a 1366×768 desktop at 200% browser zoom; physical high-DPI/device/browser acceptance remains in W3. The gate requires a passing W2 subreport and zero measured diagram text clipping.

## v1.4.0 account security

The six learner/admin recovery functions extend actual frontend coverage to 23 functions and 27 backend routes. The gate additionally requires the account-recovery browser report. Password policy, atomic replay/expiry/attempt/session controls, captured EmailJS transport, mandatory legacy upgrades, visibility and footer are covered. SMTP/EmailJS credentials are never used by fixtures. Actual EmailJS delivery and production Atlas acceptance remain separate. The earlier medium password-minimum and missing dedicated login throttling findings are addressed by this build; per-process limiter storage still needs a shared store before multi-instance scaling.


## S1 privacy/schools — v1.5.0

The source/API catalogue now includes privacy publication, onboarding, choices, requests/exports, guardian administration and school membership/reporting functions. Every new frontend function has an executable scenario. Anonymous routes are refused and both platform admin route groups are checked against learner tokens. Backend tests cover child invitation integrity/expiry, guardian/adulthood changes, school/class separation, subscription/role revocation, seat contention, consent withdrawal, scoped exports and reviewed erasure with atomic local failure handling.

The browser report adds privacySchools. Its legal pages, preserved legacy data, choices/exports/requests, staff workspace, admin publication and guardian enrolment/withdrawal checks are required by the release gate. Fixtures seed clearly synthetic operator details and explicit synthetic adult consent; no live settings/records or actual emails are used. Staging Atlas transactions, actual guardian verification, legal/provider/transfer approvals and live email/audio acceptance remain separate.


## v1.6.0 deferred admin and PWA1a

Preflight now requires deterministic PWA build verification: the learner-only manifest/scope, actual 192/512 PNG dimensions, the exact generated worker and its five public recovery targets. The worker build identifier includes the compiled bundle manifest so code updates are detected even without a version change. API responses are marked no-store. The complete compiled fingerprint must also remain unchanged through preflight.

Both primary-browser and Firefox acceptance require the v16 subreport. It covers initially absent user API/chunk requests, independent school account lookup and membership assignment, lazy loading, collapse/filter/scroll preservation, the top mouse/keyboard drag bar, panel retry and closed-panel refresh. PWA checks exercise real registration/scope/cache behaviour, offline recovery, pending changes, active-study/save/multiple-tab update guards, failed recovery downloads, served-version rollback and clearing only owned caches. The install-prompt dismissal is a controlled browser event; native OS installation is not claimed. Native browser/device and live-service acceptance remain separate. See PWA_ADMIN_README.md.


## v1.7.0 recycle bin and content/source foundation

Nine new frontend API functions have real executable probes, extending coverage to 50 functions and 54 backend routes. Each new admin route rejects anonymous and non-platform-admin authority. Local API/domain regressions cover minimum retention including exact boundary/client-date tampering, suspended/inactive eligibility, protected admins, auth revocation, school seat release, restore, linked erasure/redaction, guardian holds, reviewed privacy-erasure precedence, concurrent attempts and failed atomic writes. Content tests cover source inventory, provenance/URL/scope/expiry validation, review hashes, optimistic revisions, trash/restore/purge and stale-editor recreation refusal.

Primary-browser and Firefox results now require the v17 subreport: 11 account/material/source flows including confirmations, retention locks, restoration/reactivation, stale drafts, outage recovery, deletion permanence, lazy loading and mobile/keyboard controls. Retention ages are advanced only through the disposable fixture's private local store; no time override is exposed by an API. Compilation requires an inventory check against the actual chemistry source. MongoDB operations use a transaction with fail-closed error handling; local tests do not establish live Atlas transaction acceptance. See RECYCLE_CONTENT_README.md for scope and rollback/data considerations.
