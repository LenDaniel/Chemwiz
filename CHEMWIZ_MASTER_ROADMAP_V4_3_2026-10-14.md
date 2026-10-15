# ChemWiz Master Build Roadmap v4.3

**Updated:** 14 October 2026  
**Current release:** W2 responsive/accessibility + admin session reliability, v1.3.0 (patch for v1.2.1)  
**Hosting:** Render launch reported successful by the user on 13 October; this updated release awaits deployment/live acceptance.  
**Rule:** Preserve the uploaded working features. One project, one running web application, separate student/admin workspaces and one backend data layer.

This roadmap supersedes the older three-project launch instructions in v3.1 and v3.8. The latest uploaded October source is the implementation baseline. Historical roadmap v3.8 and K-AI4 notes are retained in `docs/history`; their old startup instructions do not apply to this release.

## Product and architecture

ChemWiz remains a ZIMSEC Forms 5–6/A-Level chemistry learning platform. React/Vite provides both workspaces; Express serves them and their API from one address. The approved branding, 24 topic modules, diagrams, search, tools, contextual Wiz, voice-note UI, live-voice UI and section-selectable read-aloud are retained.

| Application area | Path | Runtime |
| --- | --- | --- |
| Home/workspace selection | `/` | Unified Node application |
| Learners | `/student/` | Same application and address |
| Administration | `/admin/` | Same application and address |
| Backend | `/api/*` | Same application and address |
| Local persistent data | `data/local-db.json` | Backend only |
| Production database path | MongoDB | Backend only |

`npm run dev` starts development through the single Node listener, with Vite middleware on that listener. `npm start` serves the compiled multi-entry Vite build. There are no separate 5001/5173 frontend servers or frontend API URL settings. The workspaces remain separate source modules within the same project to preserve their existing behaviour.

## U1 — completed implementation and local verification

- One root package, dependency installation, build and startup command.
- One web address for home, student, admin and API.
- Production static serving, workspace refresh/deep-link handling and JSON API errors.
- Same-origin requests in both workspaces; backend roles still protect administration.
- Stable JWT configuration generated for fresh local setup; existing backend configuration can be imported privately.
- Existing local account, subscription, password-hash, log and tutor-usage records can be imported without overwriting a destination database.
- Authenticated learner-state APIs for settings, chapter/topic progress, quiz counts/latest scores, streak and mistakes.
- Account-specific browser caches, ordered saves, retry and explicit conflict resolution for concurrent devices.
- MongoDB learner-state model with revision checks and a unique owner index; the live MongoDB path needs deployment acceptance.
- Personal learning backup export/import and an old-app browser-data export script.
- Atomic local JSON writes; damaged data causes startup failure instead of a reset.
- Installation, migration, hosting and verification documentation.

U1 was accepted by the user after local testing on 12 October 2026. U1.1 adds a small sidebar logout button using the existing save-and-sign-out handler; a browser test confirms it saves pending progress. The Student self-registration UI and Free account creation already work; they do not require a later feature phase.

## Original workstreams retained

| Original phase | Current state | Remaining work |
| --- | --- | --- |
| 1 — Student foundation | Working, preserved | Responsive/accessibility polish under W2/W3 |
| 2 — Backend foundation | Working, preserved | Production deployment acceptance |
| 3 — Frontend/backend authentication | Working in one address; locally verified | Deployment/device acceptance |
| 4 — Profile/subscription base | Working, preserved | Subscription UX and production policy polish |
| 5 — Admin backend | Working, preserved; role isolation tested | Richer reporting/auditing |
| 6 — Admin dashboard | Working at `/admin/`; browser tested | Production UX/reporting expansion |
| 7 — Content engine | All 24 topic modules retained | Content-quality review and known historical issues |
| 8 — Learning progress | U1 backend saving implemented and locally verified | Broader sync/device acceptance; historical attempts/analytics if required |
| 9 — AI tutor | Existing contextual text/voice features retained | Real provider/device acceptance and production controls |
| 10 — Payments/subscriptions | Manual admin activation retained | Provider integration and payment records/reporting |
| 11 — Android | Planned; shared learner UI retained | Capacitor configuration, permissions, API access, APK/AAB signing |
| 12 — Deployment | One Node application packaged | HTTPS hosting, MongoDB, monitoring, backups and live acceptance |
| 13 — Reliability/security | Existing auth/access controls retained; U1 routing/storage checks added | Broader production validation, password recovery, dependency audits and operational controls |

## Content and platform tracks

- **A–I:** Existing UI foundation retained.
- **J1–J5:** Existing 24-topic content retained.
- **K1/K2/K3.1–K3.6:** Spec-diagram migration code retained. Integration does not mark outstanding chemistry/visual acceptance complete.
- **K3.3R/K3.3U:** Responsive shell, organic QA and universal search retained.
- **K-Cleanup:** Final unused component-diagram fallback removed after verifying 218 active specs. 214 renderings match U1.1; four Polymerisation specs were corrected. The earlier topic-level JSX removal was already in the uploaded source. Local acceptance checks pass; deployment acceptance remains. Geometry checks flag text outside the viewBox in 50 inherited diagrams; W2 will review those layouts.
- **K4:** Already present in the uploaded source. Lazy/cache loading, all 24 topics and the rebuilt 2,796-entry manifest pass verification. The snapshot now includes the reviewed Polymerisation corrections; the other 23 topic records match U1.1. Do not restart K4 from the older roadmap's planned status.
- **K-AI1:** Wiz floating entry points and context retained, including all-tab chemistry research from the latest source.
- **K-AI2:** Backend-only provider requests, Premium rules and persistent text quota retained. Stub browser path and mocked regression pass; live provider not retested here.
- **K-AI3:** Voice notes/transcription and browser read-aloud retained. Provider route regression mocked; device audio acceptance remains.
- **K-AI4:** Live voice pilot retained. Existing attempt quotas remain in process memory; the browser timer is not a server-enforced hard usage ceiling. Production session supervision remains planned.
- **W2:** Implemented in v1.3.0: wrapped diagram labels/table rows with measured SVG bounds, enlargement/text alternatives, actual saved reader font sizes, keyboard/current-navigation/form labels, native modal focus/Escape/return, mobile logout, and reflow across six viewport sizes. Automated local acceptance passed for the delivered source; live/device acceptance remains.
- **W3:** Broader Chrome/Edge/Firefox/device performance and failure-state acceptance remains planned.
- **PWA1:** Installable web application/offline caching remains planned.
- **A1:** Capacitor/Android production packaging remains planned; not included in U1.
- **WIN1/WIN2:** Windows PWA first, optional Tauri later; not separate learner frontends.
- **Later content:** Content QA (including the historical polymer worked-example issue), past papers, cross-references and practical exam supplements remain in scope.

## P1 — Production Render + MongoDB pilot

The user reported a successful unified Render launch on 13 October 2026, after changing the production Build/Start commands and resolving database authentication. Render is the active hosting route. Home, Student, Admin and API remain in one Node service at one address.

The subsequent admin origin error was reproduced on U1.1. v1.2.0 accepts Render's platform-provided public HTTPS URL and normalises configured workspace URLs to origins, while retaining rejection of unlisted sites. A simulated HTTPS Render browser test signs into the admin dashboard through an internal HTTP Node listener. The real service was not accessed or redeployed from this build environment.

This release also:
- finishes the unused legacy component rendering fallback after checking all 218 spec diagrams;
- corrects the contradictory polymer hydrolysis example, caprolactam ring count, condensation water-count convention and acid/base hydrolysis products;
- verifies 24 topic chunks on desktop/mobile, assessment integrity and unchanged records for the other 23 topics;
- includes RENDER_PRODUCTION.md with exact installation, deployment and origin-error instructions;
- preserves the existing learner/account data model, MongoDB settings and provider configuration.

Optional Cloudflare hosting remains available in CLOUDFLARE_PRODUCTION.md and the existing Worker source/configuration. Its request-owned MongoDB connections, Node/Mongoose bridge, validators and bootstrap commands remain. No Cloudflare publication or billing change is claimed.

Self-registration is existing Phase 3 work: Student login → “No account yet? Create one” → Free student account. Each unique email has its own account and learner state. Premium activation remains an Admin action. Email verification/password recovery remain future hardening work.

P1 live acceptance still includes real admin/student login, public signup, learner separation, cross-device restoration and provider/device checks against the updated deployment. A successful process launch alone is the hosting checkpoint, not completion of those application checks.

## Required build gate — implemented in v1.2.1

The user's standing rules preserve working features, require a patch ZIP/README and require integration checks before local acceptance and deployment. AGENTS.md, BUILD_RULES.md and INTEGRATION_CHECKS.md record the rules.

The tool maps the 17 current frontend API functions to 24 mounted backend routes, checks syntax/imports/middleware and dependency advisories, then executes actual request functions against the real local server with disposable accounts. Local checks include regression/content checks and desktop/mobile production browser acceptance. Source/dependency fingerprints invalidate stale evidence. Render checks the recorded result before building; cf:deploy checks before publishing.

Existing signup password length and dedicated login/register throttling are reported medium hardening follow-ups. Live Atlas/provider/audio/device acceptance remains separate. Product features, MongoDB settings and saved data are preserved. No live deployment is performed by this patch.

## W2 and admin reliability — v1.3.0

The W2 component pass preserves all topic/content records and assessments. Diagram structures/equations retain their geometry and tokens; explanatory text wraps and each SVG grows to its measured content bounds. The learner can enlarge and read diagram text. Full local acceptance measures all 218 diagrams on mobile/desktop, tests the learner screens/tools and a 200% effective layout, reading sizes and accessible search/user-detail dialogs.

Admin login now validates server authority independently of dashboard panels. Partial dashboard/network failures retain a valid session and allow retry; genuine authentication/role failure still removes it. Error codes remain available to classify origin and authentication failures. The origin allowlist and credentials are not weakened or reset. Public version/readiness probes and optional native read-only account inspection are documented in ADMIN_LOGIN_GUIDE.md. A specific live failure still requires the public URL/current diagnostic evidence.

The Windows check launcher runs the npm JavaScript CLI with shell disabled. P1 live acceptance, the two existing authentication hardening findings and broader security work remain outstanding. This build does not deploy or write to the live database.

## Next execution order

1. Apply the v1.3.0 patch to v1.2.1, preserve the live commit/database/JWT secret, and run check:integration → test:local → ready:deploy. Keep the passing release evidence with the exact checked source before live publication.
2. Set APP_URL to the actual HTTPS application origin and use the Render Build/Start commands in RENDER_PRODUCTION.md. Verify live admin login and /api/ready.
3. Finish P1 acceptance using separate learner accounts and a second browser/device; retest Wiz text/transcription and the existing live-voice pilot with the working model settings.
4. Complete W2 deployment/device acceptance after the required local gates pass, using the preserved live database/settings. Retain the working previous release as rollback.
5. Next build: **W3 — broader Chrome/Edge/Firefox, performance, loading/error/empty states and network-failure acceptance**. Then continue PWA1, Android/Capacitor and Windows packaging in their original order.
6. Retain broader chemistry/content QA, payments, password recovery/security, monitoring/backups and persistent AI session supervision in their original workstreams.

Future build testing should use a separate staging service and Atlas test database before updating the live application. No original roadmap work is cancelled. Future releases must preserve one-command local launch, account separation, existing data and exact installation commands in README.
