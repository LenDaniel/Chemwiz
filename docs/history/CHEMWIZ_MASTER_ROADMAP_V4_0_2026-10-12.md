# ChemWiz Master Build Roadmap v4.0

**Updated:** 12 October 2026  
**Current release:** U1.1 sidebar logout + P1 Cloudflare/MongoDB deployment preparation, v1.1.0  
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
- **K-Cleanup:** Still pending visual acceptance of legacy diagram removal. Dead legacy helpers are not removed during integration.
- **K4:** Already present in the uploaded source. Lazy/cache loading, complete search manifest and unchanged 24-topic digest pass verification. Do not restart K4 from the older roadmap's planned status.
- **K-AI1:** Wiz floating entry points and context retained, including all-tab chemistry research from the latest source.
- **K-AI2:** Backend-only provider requests, Premium rules and persistent text quota retained. Stub browser path and mocked regression pass; live provider not retested here.
- **K-AI3:** Voice notes/transcription and browser read-aloud retained. Provider route regression mocked; device audio acceptance remains.
- **K-AI4:** Live voice pilot retained. Existing attempt quotas remain in process memory; the browser timer is not a server-enforced hard usage ceiling. Production session supervision remains planned.
- **W2:** Full component/responsive/accessibility pass remains planned.
- **W3:** Broader Chrome/Edge/Firefox/device performance and failure-state acceptance remains planned.
- **PWA1:** Installable web application/offline caching remains planned.
- **A1:** Capacitor/Android production packaging remains planned; not included in U1.
- **WIN1/WIN2:** Windows PWA first, optional Tauri later; not separate learner frontends.
- **Later content:** Content QA (including the historical polymer worked-example issue), past papers, cross-references and practical exam supplements remain in scope.

## P1 — Production Cloudflare + MongoDB pilot (current phase)

User-authorized next phase: launch/test the unified app in a production environment using MongoDB Atlas through Cloudflare.

Prepared in this release:
- one Worker deployment with home, Student, Admin and API under one HTTPS address;
- production configuration, MongoDB-only Worker data mode and private Worker secrets;
- the Express/Node HTTP bridge and Mongoose Node build alias;
- per-request MongoDB connections/models for Workers, with normal pooled Node behaviour retained;
- production settings validation, a private-file read-only MongoDB ping command and an admin bootstrap command;
- safe production database error responses;
- exact commands in CLOUDFLARE_PRODUCTION.md, including Paid Worker runtime requirements.

Build, request ownership, workspace routing and native Worker runtime checks pass. Live acceptance remains pending: this environment is not signed in to the user's Cloudflare account, and the supplied Atlas connection attempt was refused. No deployed website, database writes, custom domain changes or billing changes are claimed.

Self-registration is existing Phase 3 work: Student login → “No account yet? Create one” → Free student account. Activation of Premium remains an Admin action. Email verification/password recovery remain future hardening work.

## Next execution order

1. Apply U1.1 and verify the sidebar logout; keep U1 as rollback.
2. Complete P1: privately verify Atlas, sign in to Cloudflare, set Worker secrets and deploy the one application.
3. Confirm `/api/ready` against the real database, public learner signup, sign-in/out, admin isolation and progress restoration on a second browser/device.
4. Retest Wiz text/transcription and later enable/test live voice with the preserved working model settings.
5. Resume outstanding chemistry visual/content QA and K-Cleanup after acceptance.
6. Continue W2/W3, PWA1, Android/Capacitor, Windows packaging and payments/security/AI supervision work.

No original roadmap work is cancelled. P1 implements the deployment workstream now, as requested, and retains the unified application. A successful local or native-emulator check does not mean the application has been deployed or connected to live Atlas. Future releases must keep the one-command local launch and account separation working and include exact installation/update commands.
