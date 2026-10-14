# v1.2.1 build-gate verification — 14 October 2026

The required sequence passed against this exact source: check:integration → test:local → ready:deploy. Node 24.19.0, Vite 8.3.4, Playwright 1.62.1 and Chromium 153 were used locally. The Render prebuild guard also accepted the matching passing evidence.

- Source integrity: 177 parsed JavaScript/JSX modules and 443 import references; all 17 frontend API request functions map to the 24 mounted backend method/path routes and declared middleware.
- Executable connection probes: all 17 real frontend API functions reach the real unified local server. Eight access/data-control groups pass, including learner isolation/persistence, stale-write rejection, public signup privilege rejection, invalid JWT/admin access, CORS/Render origins, private-file protection, CSP and state validation.
- Production and development dependency audit: zero advisories at every severity in this run. An unavailable audit or a high/critical advisory blocks the gate.
- Node regression: 49 tests passed, zero failures/skips. This includes 21 new gate regression tests for intentionally broken routes/methods/imports/wrappers/middleware, unknown API declarations, embedded credential fixtures, invalid configuration and stale/failed/incomplete evidence.
- Production browser: 11 checks passed at 1366×768 and 390×844, including public signup, chapter/quiz saves, sidebar logout, saved-theme restoration in another browser, all 24 topic chunks, search, local Wiz, admin login and student exclusion. No JavaScript runtime errors were observed.
- Content and K4 checks remain passing: 24 topics, 255 chapters, 218 spec diagrams, 745 MCQs, 134 structured questions, 181 worked examples and 2,796 search entries.
- Baseline SHA-256 comparison confirms existing web/backend/shared source is unchanged. Tooling, dependency declarations and documentation are patched, and five unchanged required backend source files omitted from the earlier archive are restored; private configuration and records are excluded.

The receipt in verification/release-evidence.json records sanitized results and exact source/build fingerprints. Changing tested source invalidates it. Local tests use disposable local records, empty real provider/database credentials and a real-Mongo refusal guard. Voice probes verify auth/transport/disabled-provider responses; they do not prove live provider/audio operation. Actual Render/Atlas/provider/device acceptance remains separate.

The tool reports the two inherited medium review findings: six-character signup password minimum and missing dedicated login/register throttling. They remain production-hardening work. Defined controls and dependency advisories do not certify the absence of all security vulnerabilities. See INTEGRATION_CHECKS.md for coverage.

The patch delivery includes README, standing rules, test tooling/contracts, dependency lockfile, matching release evidence, safe installer and baseline/changed-file manifest. It excludes dist (preflight rebuilds it), actual environment settings, records, node_modules and machine/browser state. The unchanged v1.2.0 baseline report is retained below for history.

---

# v1.2.0 verification — 13 October 2026

Results: 28 behavioural tests, 12 general browser checks, dedicated signup/sidebar-logout checks and five Render/K-Cleanup browser checks passed. Node 24.19.0 and Vite 8.3.4 were used locally.

## Production origin regression

- The U1.1 admin-login origin error was reproduced using a Render HTTPS origin forwarded to an HTTP Node listener.
- v1.2.0 signs into the admin dashboard through that simulated public HTTPS host, with the old localhost APP_URL and proxy trust disabled.
- Exact configured origins, workspace URL normalisation and preflight headers pass.
- Unlisted sites, wildcard configuration and forged forwarded headers remain blocked.

## Content and diagrams

- All 24 topics load. Counts remain 255 chapters, 218 spec diagrams, 745 quizzes, 134 structured questions and 181 worked examples.
- Every diagram renders an SVG with finite positive dimensions and a supported renderer; there are no active legacy component diagrams.
- All quiz answer indexes are valid and structured part marks match their totals.
- Other than Polymerisation, all 23 loaded topic records match the accepted U1.1 digest.
- 214 diagram renderings match U1.1 exactly; four corrected polymer diagrams were inspected visually.
- All 24 compiled topic chunks/chapter lists load at 1366px and 390px; the corrected polymer chapter renders.
- The SVG text-geometry scan flags text outside the viewBox in 50 inherited diagrams, equal to U1.1. The four changes introduce no additional clipping. W2 will review text fitting/wrapping and accessibility.
- Lazy/cache loading, all-tab Wiz contexts, the complete rebuilt 2,796-entry search manifest, offline voice selection and read-aloud helpers pass.

## Application regression

- One server serves home, Student, Admin and API; deep links and private-file protection pass.
- Registration creates a Free student; admin role cannot be selected through public signup.
- Student accounts cannot reach admin data. Premium activation still works.
- Account-scoped progress, settings, streak and mistakes persist; stale writes conflict and invalid records are rejected.
- Local corruption/import safety and offline sync/conflict cases pass.
- Real browser signup/sidebar logout saves pending progress and clears the session. Logout remains visible at desktop and shorter laptop heights.
- General browser checks cover quizzes, saved settings, a second browser/mobile restoration, universal search, stub Wiz and development startup at one address.
- Text, transcription and Realtime provider routes use mocked regression calls.
- Worker database-request ownership, cleanup and routing regressions remain passing.

## Deployment acceptance still required

The user reported that Render launched successfully. This build environment has not accessed or redeployed that live site, written to live Atlas or made real provider/audio calls. After installing v1.2.0, verify the real admin login, public signup, learner separation, second-device progress restoration and Wiz/voice operation.

Broader Edge/Firefox/device testing, email verification/password recovery, PWA/Android packaging and full chemistry/diagram accessibility review remain in scope. The on-demand search chunk remains about 624 kB minified; Vite reports its existing size warning.

The release includes source, compiled dist, the dependency lockfile, setup tools, hosting instructions, updated roadmap and verification scripts. Actual environment values, user records, node_modules, browser screenshots and build-machine state are excluded.
