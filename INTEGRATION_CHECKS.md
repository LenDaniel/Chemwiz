# Required ChemWiz build checks

The standing rules are in AGENTS.md and BUILD_RULES.md. This v1.2.1 patch adds tooling and documentation; existing learner/admin features, backend data models and origin handling are preserved.

## Run in this order

Use Node 24 and open a terminal in the unified folder containing package.json. Install the declared development dependencies because the checks compile the frontend and use a browser:

```bash
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
```

Chromium installation is normally needed only once. The browser check also tries installed Chrome or Edge. An unavailable browser is a failed required check. On Linux, Playwright's documented `npx playwright install --with-deps chromium` installs the browser and its operating-system dependencies. A custom executable may be selected with CHEMWIZ_TEST_BROWSER_PATH; this is a browser selection, not a skip option.

The integration check must pass before test:local accepts the source. New preflight/local attempts clear the old green release result immediately. Required checks cannot be skipped to obtain PASS. Changes to source, dependencies, configuration examples or build rules invalidate the recorded result. A changed or missing dist build also blocks local/VPS/Cloudflare deployment readiness.

## Coverage

| Check | What must pass |
| --- | --- |
| Source integrity | JavaScript/JSX syntax, JSON/JSONC data syntax, relative imports/assets, frontend named imports and declared packages |
| Frontend wiring | Discover request call sites; resolve HTTP method and same-origin API path; connect the fetch wrappers; match each call to a mounted backend route and executable probe |
| Middleware | Follow ordered Express router mounts; require data readiness, authentication, admin role and Premium guards where applicable |
| Actual connections | Execute all 17 current Student/Admin API functions against the real unified Node server and middleware, using disposable fixture accounts |
| Data behaviour | Register separate learners, reject role/plan injection, persist progress/settings, retain learner separation, reject stale saves and invalid learning records; persist admin subscription/status/role changes |
| Defined security controls | Reject anonymous/invalid JWT and student admin access, check CORS/Render origin handling, prevent password/hash response leaks and private-file serving, check production CSP/header settings, flag embedded source credentials and frontend string execution |
| Dependencies | Audit production and development dependencies; high/critical advisories or an unavailable audit block PASS |
| Local acceptance | Existing installation/content/K4/Node regression checks, then a production browser exercising signup, chapter/quiz saves, logout/login, restoration in a second browser, all 24 topic chunks on desktop/mobile, search, local Wiz and admin/student separation |
| Gate regression | Deliberately broken routes/methods/imports/wrappers/guards, unknown requests, invalid configuration, credential fixtures and stale/failed/incomplete release evidence must be rejected |

The current backend has 24 mounted method/path routes. Four inherited public routes are implementation placeholders; the probe requires their fixed placeholder response and no data fields. Adding real functionality there requires changing the contract, access controls and probes.

## Results and deployment

Detailed preflight reports are written to .build-checks/integration.json, source-analysis.json, api-connections.json and INTEGRATION_REPORT.md. Browser results are in .build-checks/browser.json. These machine-local reports are ignored by git.

After local acceptance passes, verification/release-evidence.json records the sanitized outcomes and source/build fingerprints. Keep that file with the exact tested source in the release repository. It includes neither secrets nor learner records. Do not hand-edit evidence to manufacture a pass.

Render keeps its existing Build Command `npm ci --include=dev && npm run build` and Start Command `npm start`. The npm prebuild hook checks source-matching passing evidence when Render sets RENDER=true. Render then compiles its own dist, so its build hook checks source/evidence rather than requiring a local dist upload. A missing, failed or stale result stops the build. npm run cf:deploy also runs ready:deploy first. For a VPS/manual deployment, run ready:deploy before publishing the tested source and dist. Direct provider/CLI deployment commands outside this workflow are not controlled by the tool.

Keep private environment settings and the existing MongoDB database/JWT secret. Tests use temporary local JSON records, blank provider/database credentials and a Mongo connection refusal guard. They do not write to production.

## Limits and reported follow-ups

The two existing medium review findings are a six-character signup password minimum and missing dedicated login/register attempt throttling. They are recorded for production hardening. High/critical findings, broken API wiring and failed required controls block the gate. This patch preserves the existing authentication behaviour.

The security checks are explicit controls plus available dependency advisories; they do not certify the absence of every vulnerability. Static discovery supports the current fetch/Express patterns. Unsupported or ambiguous request declarations fail and need an explicit checked adapter rather than being silently omitted. New API exports need a contract in scripts/integration-contracts.json and a real scenario in scripts/probe-api-connections.mjs.

Local Wiz uses its existing controlled response. Transcription/live voice probes verify frontend transport, authentication, MIME/context headers and the controlled disabled-provider response (503); they do not call a real provider or verify microphone/WebRTC audio. Real Atlas connectivity, provider calls, HTTPS/proxy configuration and physical device behaviour need the relevant private environment/device acceptance. Existing read-only diagnostics remain npm run check:production and npm run check:mongo.

References: [Playwright browser setup](https://playwright.dev/docs/browsers), [Express middleware order](https://expressjs.com/en/guide/using-middleware.html).
