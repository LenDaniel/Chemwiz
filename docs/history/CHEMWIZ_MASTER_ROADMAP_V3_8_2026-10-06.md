# ChemWiz Master Build Roadmap v3.8

**Updated:** 6 October 2026  
**Rule:** Preserve what works. Do not skip an existing roadmap phase. New platform work is inserted as a blocking/sub-phase where required, then execution returns to the existing sequence.

## 1. Product direction

ChemWiz is a ZIMSEC Form 5–6 / A-Level Chemistry learning platform with one shared learner frontend and multiple delivery targets:

- **Student frontend:** React + Vite
- **Browser/Web:** responsive web application
- **Android:** Capacitor package from the shared React/Vite frontend
- **Windows:** responsive browser/PWA first; optional Tauri `.exe` packaging after the web/PWA build is mature
- **Backend:** Node.js + Express
- **Development data mode:** local JSON database for offline/local testing
- **Production data mode:** MongoDB Atlas / production database configuration
- **Authentication:** JWT + bcrypt
- **Admin:** separate React/Vite dashboard
- **AI tutor:** named **Wiz**, backend-proxied only; no provider secrets in learner/admin frontend code

## 2. Non-negotiable engineering rules

1. Preserve working functionality and patch only the files required by the current phase.
2. Keep Student, Admin and Backend runnable together during development.
3. Local development must not require MongoDB or internet access unless the feature being tested genuinely depends on an external provider.
4. Production secrets must never be committed into distributable frontend builds.
5. Student UI must remain usable on Android/mobile while becoming fully responsive for desktop browsers.
6. Chemistry content must remain aligned to the official ZIMSEC Forms 5–6 syllabus structure.
7. Every phase ends with regression checks before the next phase starts.
8. Completed roadmap items are not discarded when stability recovery work is introduced.

---

# 3. Original roadmap workstreams — retained

The original v2 phases remain in scope. Their current status is updated below rather than replaced.

## Phase 1 — Core Student App Foundation
**Status: ✅ substantially complete; ongoing responsive cleanup**

Delivered:
- React/Vite learner app
- Home/topic navigation
- Quiz screens
- Tutor screen
- Profile
- themes/font-size/sound settings
- local progress, streak and mistakes storage

Remaining under later compatibility phases:
- complete responsive desktop polish
- accessibility pass
- browser/PWA behaviour

## Phase 2 — Backend Foundation
**Status: ✅ working**

Delivered:
- Express backend
- JWT auth
- bcrypt password hashing
- user model / local-user equivalent
- `/api/auth/me`
- local JSON development mode
- MongoDB production path retained

## Phase 3 — Frontend/Backend Auth Connection
**Status: ✅ working baseline**

Delivered:
- Student login/register integration
- token storage
- profile hydration from backend
- Admin login confirmed working during September 2026 recovery testing

## Phase 4 — User Profile and Subscription Base
**Status: ✅ base implemented; later subscription polish remains**

Tracked fields include:
- role
- learning level
- subscription tier/status/expiry
- account status
- access flags
- learning progress/settings

## Phase 5 — Admin Backend Routes
**Status: ✅ core routes implemented**

Includes user/statistics/subscription/status/log administration. Future payment/tutor reporting can expand as those production services mature.

## Phase 6 — Admin Frontend Dashboard
**Status: ✅ working baseline**

Admin login and current user-management/dashboard flow run successfully. Continue later with payment reporting, tutor analytics, richer audit logs and production UX polish.

## Phase 7 — Learning Content Engine
**Status: ✅ all 24 syllabus topics built; Phase K refactor in progress**

Content areas:
- Physical Chemistry
- Inorganic Chemistry
- Organic Chemistry
- Applied Chemistry

Features include notes, worked examples, quizzes, structured questions, definitions, diagrams and chemistry utilities.

## Phase 8 — Progress Tracking
**Status: 🟨 local implementation working; backend persistence expansion later**

Current:
- topic progress
- quiz counts/scores
- streaks
- mistakes notebook

Later:
- backend synced progress
- cross-device history
- weak-area recommendations
- revision recommendations

## Phase 9 — AI Tutor Backend
**Status: 🟨 Wiz contextual route and OpenAI Responses API integration implemented; live pilot acceptance pending**

Required architecture remains:

`Student → ChemWiz backend → AI provider`

No API/provider key may live in frontend code.

## Phase 10 — Payments and Subscriptions
**Status: 🟨 base access controls implemented; production payments later**

Order:
1. manual admin activation
2. subscription expiry/access enforcement
3. payment records
4. EcoCash/Paynow/provider integration after stable deployment

## Phase 11 — Android Packaging
**Status: ⬜ planned after web/runtime/content refactor stability**

Tasks retained:
- Capacitor setup/finalization
- Android Studio sync
- splash/icon
- deployed API URL
- signed APK/AAB
- Android regression testing
- Play Store readiness

## Phase 12 — Deployment
**Status: ⬜ planned**

- deployed backend
- production database
- hosted responsive student web/PWA
- hosted admin dashboard
- HTTPS/domain/environment separation
- production monitoring/backups

## Phase 13 — Security and Reliability
**Status: 🟨 partially implemented; final production hardening remains**

Includes:
- input validation
- role/admin middleware
- CORS control
- secure JWT/session secrets
- rate limiting
- backend-only secrets
- error/audit logging
- backups
- account suspension
- password reset
- dependency/security audits

---

# 4. Current implementation track — A through K

## Phases A–I — UI/application foundation
**Status: ✅ shipped**

## Phases J1–J5 — 24-topic chemistry content build
**Status: ✅ shipped**

## K1 — JSON diagram renderer/spec format
**Status: ✅ shipped**

## K2 — Nano Chemistry proof migration
**Status: ✅ shipped**

## K3.1 — Inorganic diagram migration
**Status: ✅ shipped**

Migrated 5 inorganic topics.

## K3.2 — Organic diagram migration
**Status: ✅ shipped**

Migrated 4 organic topics.

## K3.3 — Physical Chemistry medium migration batch 1
**Status: ✅ shipped and re-integrated after runtime recovery**

- PC-01 Stoichiometry — 8 diagrams
- PC-02 Atomic Structure — 9 diagrams
- PC-04 States of Matter — 11 diagrams
- PC-08 Reaction Kinetics — 8 diagrams

**Accurate total after K3.3:** 14/24 topics migrated; 107 diagrams using specs.

---

# 5. Stability recovery inserted without replacing Phase K

## S0 — Three-project runtime recovery
**Status: ✅ complete baseline**

Completed September 2026:
- Student / Backend / Admin made runnable as separate projects
- fixed Student/Backend port collision
- Backend = `5000`
- Student = `5001`
- Admin = `5173`
- local JSON backend data mode added for local development
- MongoDB no longer required for local testing
- nodemon restart loop fixed by ignoring generated local database JSON
- Admin login confirmed working
- backend local auth confirmed working
- Vite/plugin compatibility corrected
- frontend AI provider secret exposure removed

This phase was a blocking recovery task. It does **not** cancel K3.4–K4.

---

# 6. K3.3R — Responsive Web/Desktop Foundation
**Status: 🟨 IMPLEMENTED — WINDOWS/MOBILE REGRESSION TEST PENDING**

Purpose: remove the hard-coded phone simulator from desktop while preserving the mobile interface and restoring K3.3 onto the stable S0 runtime baseline.

### K3.3R deliverables
- re-integrate the completed K3.3 diagram files into the stable three-project baseline
- remove hard-coded `390 × 844` application shell
- responsive application shell using CSS breakpoints
- mobile bottom navigation retained
- desktop sidebar navigation added
- responsive login page
- desktop-width dashboard/content canvas
- responsive topic grids
- responsive chapter grids
- responsive tools grid
- bounded reading width for chemistry notes
- bounded quiz/structured/worked-example widths
- periodic table horizontal safety on small displays and expanded desktop workspace
- maintain backend `5000`, Student `5001`, Admin `5173`
- preserve Android/mobile behaviour

### K3.3R regression targets
Test at approximately:
- 360×800 phone
- 390×844 phone
- 768×1024 tablet
- 1366×768 Windows laptop
- 1920×1080 desktop

Browsers:
- current Chrome
- current Microsoft Edge
- Firefox
- Android Chrome / Capacitor WebView during Android packaging

---

# 6A. K3.3U — Learner Discovery + QA Tool Expansion
**Status: 🟨 IMPLEMENTED WITH K3.3R — REGRESSION TEST PENDING**

This is a user-requested sub-phase inserted before K3.4. It does **not** replace or skip any existing K3.4–K4 work.

### K3.3U-1 — Organic functional-group tests in QA Table
Under `Tools → QA Table`, retain cation, anion and gas tests and add an **Organic / Functional Groups** tab containing:
- functional group / class
- reagent or test
- **positive/confirmation observation**
- **negative/absence observation**
- short interpretation note where a test is classificatory rather than unique

Initial coverage:
- C=C unsaturation
- primary/secondary alcohol oxidation screen
- phenol
- aldehyde/ketone carbonyl
- aldehyde
- ketone
- carboxylic acid
- iodoform-positive methyl carbonyl / methyl secondary alcohol systems
- halogenoalkane
- amine/basic organic nitrogen

Safety/content rule: present these as revision/qualitative-analysis cues. Do not replace teacher/exam-paper instructions for reagent quantities, concentrations or practical safety.

### K3.3U-2 — Universal ChemWiz search
Add a search feature available from every learner screen.

Search scope:
- topic titles/codes/taglines/keywords
- learning objectives
- chapter titles
- section headings
- lesson paragraphs
- list/takeaway text
- callouts/definitions
- diagram captions
- QA cations/anions/gases
- organic functional-group tests
- core tool entries

Navigation behaviour:
- topic hit → topic overview
- chapter hit → chapter reader
- section/paragraph/diagram hit → open the exact chapter and scroll/highlight the matching content block
- QA/tool hit → open the relevant tool/tab/card
- desktop shortcut: `Ctrl+K` / `Cmd+K`

K4 compatibility requirement: when topic content moves to dynamic imports, preserve universal search through a lightweight generated/search manifest so full topic modules do not have to be eagerly loaded at startup.

---

# 7. Resume original K sequence immediately after K3.3R

## K3.4 — Physical Chemistry medium migration batch 2
**Status: ✅ implemented and applied to the user baseline**

Migrated in the 11 September 2026 build:
- PC-03 Chemical Bonding — 10 diagrams
- PC-05 Chemical Energetics — 10 diagrams
- PC-07 Equilibria — 10 diagrams

K3.4 result:
- 30 active diagram references moved from legacy `component:` JSX to JSON `spec:` rendering
- legacy D* JSX functions retained temporarily for rollback/visual comparison
- active `component:` references in these three topics: **0**
- active `spec:` references in these three topics: **30**
- cumulative Phase K status: **17/24 topics migrated**
- cumulative spec-rendered diagrams: **137**
- remaining legacy diagrams: **81 across 7 topics**

The user applied the K3.4 patch and authorized continuation. Its three topics remain part of the cumulative smoke test for the current stable line.

## K3.5 — Remaining medium/large diagram batch
**Status: ✅ ACCEPTED — USER TESTS PASSED**

Migrated in the 11 September 2026 build:
- PC-06 Electrochemistry — 10 diagrams
- OC-18 Carboxylic Acids & Derivatives — 8 diagrams
- AC-22 Phase Equilibria — 10 diagrams
- AC-23 Environmental Chemistry — 9 diagrams

K3.5 result:
- **37** active diagram references moved from legacy `component:` JSX to JSON `spec:` rendering
- original D* JSX functions retained for rollback/visual comparison
- active legacy `component:` references in the four K3.5 topics: **0**
- active K3.5 `spec:` references: **37**
- cumulative Phase K status: **21/24 topics migrated**
- cumulative spec-rendered diagrams: **174 / 218**
- remaining active legacy diagrams: **44 across 3 topics**

K3.5 acceptance gate completed by the user on 11 September 2026. The patched three-project system remained runnable and the migrated topics passed the requested checks.

## K3.6 — Final active legacy diagram batch
**Status: 🟨 IMPLEMENTED — USER VISUAL/SMOKE QA PENDING**

Migrated in the 11 September 2026 build:
- OC-14 Hydrocarbons — 15 diagrams
- OC-19 Nitrogen Compounds — 14 diagrams
- AC-21 Transition Elements — 15 diagrams

K3.6 result:
- **44** active diagram references moved from legacy `component:` JSX to JSON `spec:` rendering
- legacy D* JSX functions remain temporarily for rollback/visual comparison
- active `component:` references across all 24 topic modules: **0**
- active `spec:` diagram references across all 24 topic modules: **218 / 218**
- cumulative Phase K topic migration: **24 / 24 topics**

K3.6 acceptance gate:
- run Student + Backend + Admin together
- inspect Hydrocarbons, Nitrogen Compounds and Transition Elements on Windows desktop width
- repeat a quick mobile-width check
- verify universal search still jumps into these topics
- verify no Student console/runtime error appears during navigation
- if accepted, proceed to K-Cleanup without skipping K4 or later roadmap work.

## K-AI1 — Wiz contextual AI tutor entry point
**Status: 🟨 IMPLEMENTED — THREE-PROJECT INTEGRATION REGRESSION PENDING**

This user-requested sub-phase adds a floating **Wiz** button without creating a context-free chatbot. The button appears only after a learner opens a specific topic or feature, and the selected context is carried into the tutor session.

Implemented in the latest K3.6 baseline:

- floating, keyboard-accessible `WIZ` button in the responsive Student shell;
- topic context: topic overview, chapter list, chapter reader, Paper 1 MCQ, Paper 2 structured questions and worked examples;
- feature context: Periodic Table, element details, Equation Balancer, QA Table and Mole Calculator;
- no Wiz button on Home, Tools home, Progress, Profile, locked screens or inside the tutor itself;
- TutorChat header, greeting, suggestions and request payload identify the selected topic/feature;
- backend `/api/tutor/message` now requires a topic or feature context, bounds user/context strings, rejects overlong messages, and reports the scoped context in local-test mode;
- existing premium access rules remain unchanged;
- provider calls remain backend-only; `AI_API_KEY` is not added to the Student or Admin build.

Acceptance gate:

1. run Student, Backend and Admin together;
2. confirm Wiz is hidden on Home and appears after opening a topic/tool;
3. confirm the button opens the tutor with the correct topic/feature label;
4. send a local-test question and verify the backend response names the scope;
5. verify mobile and desktop placement, keyboard focus and no console/runtime regression.

K-AI1 did not yet include live provider answers. K-AI2 below adds the provider route and usage controls.

## K-AI2 — Wiz OpenAI API pilot integration
**Status: 🟨 IMPLEMENTED — LIVE PROVIDER AND THREE-PROJECT PILOT ACCEPTANCE PENDING**

Built on K-AI1 without changing the Student → Backend → Provider boundary:

- Backend calls OpenAI Responses API and checks learner input and generated output with `omni-moderation-latest`.
- Chemistry-only tutoring instructions, topic/feature scope and up to eight bounded prior chat messages are sent in each request. Responses use `store: false`; secrets stay in backend environment variables.
- Backend enforces Premium/Teacher/Admin entitlement; suspended/disabled users remain blocked by authentication.
- Six requests per learner per minute and a configurable daily limit (default 20) prevent unbounded usage. Counts persist in local JSON or MongoDB; the MongoDB reservation is atomic across backend processes. Daily reset is at 00:00 UTC.
- Provider errors and missing configuration are reported without exposing secrets. Failed provider requests release their reserved daily count; a completed generation blocked by output moderation still counts toward the limit.
- Local JSON mode remains an offline stub unless `AI_LIVE_IN_LOCAL_MODE=true` is set explicitly, allowing a live pilot without requiring MongoDB.
- The learner sees an AI disclosure and remaining daily questions after a successful live reply. Output length, input length and conversation history are bounded.
- Backend integration test covers authentication, access, contextual provider request, safety rejection, provider failure/refund, daily quota and persistence. Student production build passes.

Pilot acceptance before enabling real learners:

1. Set a project API key in backend `.env`, set an approved `AI_MODEL`, choose the daily cap and enable live local mode only when needed.
2. Start Backend, Student and Admin together. With a premium test learner, open a topic and ask Wiz a chemistry question; confirm an actual answer, context label and quota count.
3. Try an unrelated question, an unsafe chemistry request, the limit/reset path, an expired or free account, desktop/mobile placement and provider downtime.
4. Review age and privacy safeguards, teacher reporting/escalation, actual platform usage/spend, and content quality with a small supervised learner pilot.

No real API key was supplied for this build, so no live provider call or cost result is claimed. Admin tutor analytics, budget alarms and age assurance remain production work.

## K-AI3 — Wiz voice notes and reply read-aloud
**Status: 🟨 IMPLEMENTED — LIVE DEVICE/PILOT ACCEPTANCE PENDING (6 October 2026)**

- The learner records a voice note inside contextual Wiz using the browser microphone (45-second timer), receives a transcript, edits it, then sends it through the existing `/api/tutor/message` route. Topic context, moderation and the persistent daily question cap remain in force at send time.
- The new Premium-only `/api/tutor/transcribe` endpoint accepts supported audio up to 5 MB. Audio goes from Student to Backend to OpenAI File Transcription (`gpt-transcribe` by default); the API key stays on Backend. No raw recording is persisted by ChemWiz.
- Voice transcription has per-user limits of three per minute and 20 per rolling 24 hours (configurable). The latter uses in-process memory, so a shared store is required before multi-instance deployment.
- Learners can play an individual Wiz reply with the browser/device speech engine; the voice is disclosed as AI-generated. Playback does not incur an additional OpenAI TTS request.
- Student production build and mocked backend route tests pass. The K-AI2 full ZIP omitted `chemwiz-backend/src/data`; K-AI3 restores those four modules in its full build and patch.

Acceptance on the user's live setup: verify microphone permission over HTTPS/localhost, voice capture and accurate chemistry transcription on Windows and Android, transcript edits, send/moderation/quota, read-aloud voice availability, 5 MB rejection, cost, and three-project smoke test. Browser/device voices vary. This is recorded voice-note turn taking; continuous hands-free, interruptible conversation is a separate K-AI4 Realtime/WebRTC phase with server-side usage and session controls.

## K-AI4 — Wiz live voice conversation
**Status: 🟨 PILOT IMPLEMENTED — LIVE DEVICE AND COST ACCEPTANCE PENDING (6 October 2026)**

- Student offers **Live voice** inside contextual Wiz, connects microphone and speaker with WebRTC, shows connection/turn status, and provides Start, Mute, End and Enable audio controls. The app closes a call after five minutes or on navigation/unmount.
- Backend `POST /api/tutor/live/session` requires authentication, Premium access, an explicit selected topic/feature and `AI_LIVE_VOICE_ENABLED=true`. In local JSON mode, live API use still requires `AI_LIVE_IN_LOCAL_MODE=true`.
- Backend creates the OpenAI Realtime call through the unified WebRTC interface with `gpt-realtime-2.1-mini` by default, chemistry-only tutor instructions, server-selected voice and a pseudonymous safety identifier. The main API key stays on Backend; the browser receives only the SDP answer.
- Call creation is capped at two per minute and three per rolling 24 hours per learner by default. These limits are in process memory and count attempts. The browser five-minute timer **does not provide a server-enforced hard cost ceiling**. This is a supervised pilot, not a production cost guarantee.
- Mocked backend tests and Student production build pass. No real WebRTC/Realtime connection was made in this build environment.

Pilot acceptance: with a funded project and Realtime model access, test Windows and Android over HTTPS; topic context, microphone/speaker routing, barge-in, mute, End, five-minute timeout, unsupported browser, Premium denial, disabled flag, usage/cost and a three-project smoke test. Before general rollout, add a server-side session-control channel for hard time/usage termination, a shared persistent quota store, content review and transcript/privacy decisions.

## K-Cleanup — legacy JSX diagram cleanup
**Status: ⬜ planned after visual QA**

- compare spec renderings with legacy D* diagrams
- rollback individual diagrams if quality is worse
- delete dead D* diagram JSX only after acceptance

## K4 — Topic code splitting / bundle reduction
**Status: ⬜ planned**

- dynamic import per topic
- avoid loading all chemistry content at initial application startup
- reduce initial JS payload
- isolate a broken topic from crashing first-load where practical
- measure production bundle before/after

---

# 8. Web/Desktop completion track

## W1 — Responsive foundation
**Status: part of K3.3R**

## W2 — Full responsive component pass
**Status: ⬜ after K4**

Audit every learner screen and chemistry primitive for:
- responsive spacing/type
- tables
- diagrams
- mechanisms
- long equations
- quiz controls
- structured questions
- AI Tutor
- Progress
- Profile/settings
- accessibility/keyboard focus
- browser zoom and high-DPI scaling

## W3 — Browser regression + performance
**Status: ⬜ planned**

- Chrome/Edge/Firefox
- responsive/mobile emulation
- Lighthouse/performance review
- error boundaries
- loading/error/empty states
- network failure behaviour

---

# 9. PWA / offline web track

## PWA1 — Installable ChemWiz web app
**Status: ⬜ planned after W2/W3**

- web manifest
- icons
- install prompt/readiness
- service worker
- cache static application shell
- offline-safe chemistry content strategy
- version/cache invalidation

This becomes the first Windows-installable ChemWiz experience without maintaining a separate frontend.

---

# 10. Android track

## A1 — Capacitor production integration
**Status: ⬜ planned; original Phase 11 retained**

The responsive React/Vite learner frontend remains the source application.

- Capacitor sync
- Android permissions
- API/environment configuration
- device navigation/safe-area testing
- offline/cache behaviour
- APK/AAB
- signing/release notes

---

# 11. Windows native packaging track

## WIN1 — Windows browser/PWA
**Status: ⬜ follows PWA1**

Preferred first Windows distribution because it reuses the web codebase.

## WIN2 — Optional Tauri desktop package
**Status: ⬜ later**

Only after responsive web/PWA is stable:

`React/Vite → Tauri → ChemWiz.exe`

Goals:
- lightweight Windows package
- shared learner frontend
- controlled local cache/storage
- automatic update strategy later

Do not fork a second learner UI unless platform requirements force it.

---

# 12. Production deployment/security completion

After K/W/PWA/Android readiness:
- production backend hosting
- MongoDB/production database
- HTTPS + domain
- environment separation
- secret management
- logging/monitoring
- backups
- rate limiting
- password recovery
- payment provider hardening
- AI usage controls/limits
- privacy/data retention controls
- release/versioning pipeline

---

# 13. Current execution order

1. ✅ S0 runtime recovery
2. ✅ Re-integrate K3.3 completed work into stable baseline
3. ✅ K3.3R Responsive Web/Desktop Foundation
4. ✅ K3.3U Functional-group QA + Universal Search
5. ✅ K3.4 Bonding + Energetics + Equilibria — accepted
6. ✅ K3.5 Electrochemistry + Carboxylic Acids + Phase Equilibria + Environmental Chemistry — accepted
7. 🟨 **K3.6 Hydrocarbons + Nitrogen Compounds + Transition Elements — implemented, QA pending**
8. ⬜ K3.6 desktop/mobile visual + three-project smoke test
9. 🟨 **K-AI1 Wiz contextual AI tutor entry point — implemented, integration regression pending**
10. 🟨 **K-AI2 Wiz OpenAI API pilot integration — implemented, live pilot QA pending**
11. 🟨 **K-AI3 Wiz voice notes and read-aloud — implemented, live device pilot QA pending**
12. 🟨 **K-AI4 Wiz continuous live voice — pilot implemented, live device/cost QA pending**
13. ⬜ K-Cleanup
14. ⬜ K4 code splitting
15. ⬜ W2 full responsive component pass
16. ⬜ W3 browser/performance regression
17. ⬜ PWA1
18. ⬜ Android/Capacitor production packaging
19. ⬜ Windows PWA distribution
20. ⬜ Optional Tauri Windows `.exe`
21. ⬜ Production deployment/security/payment/AI hardening

## Next-phase rule

No feature phase is considered complete until the three-project development system still starts successfully and the Student application passes both desktop and mobile smoke tests.
