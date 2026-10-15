# ChemWiz Master Build Roadmap v3.9

**Updated:** 12 October 2026  
**Current release:** U1 — One Application Integration, v1.0.0  
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

U1 local acceptance is supported by integration tests and a Chromium browser smoke test. Windows installation, the real hosting environment, live MongoDB and actual microphone/provider operation still need the user's environment acceptance.

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

## Next execution order

1. Apply U1 to a fresh folder and migrate configuration/accounts/old browser progress as required.
2. Confirm one-command launch and both roles on the user's Windows machine.
3. Confirm real MongoDB and HTTPS hosting for the unified Node application.
4. Retest Wiz text, transcription, live voice and read-aloud on real Windows/Android devices using the preserved working models/configuration.
5. Resume outstanding chemistry visual/content QA and K-Cleanup after acceptance.
6. Continue W2/W3, PWA1, Android/Capacitor, Windows packaging and production payments/security/AI supervision work.

No remaining roadmap work is cancelled by unification. Do not treat this release as a hosted deployment or a signed Android build. Future releases must keep one-command launch and account separation working, and must document exact installation/update commands.
