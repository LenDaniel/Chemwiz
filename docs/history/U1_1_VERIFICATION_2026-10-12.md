# U1.1 / P1 release verification — 12 October 2026

**Results: 23 behavioural tests and 12 cumulative browser checks passed; dedicated sidebar-logout/self-registration checks also passed.**

## Implementation checks

- Single Vite production build creates home, Student and Admin assets.
- Source completeness and 63 backend relative imports pass.
- Compiled frontend scan contains none of the provided backend credentials.
- Existing text, transcription and live-voice tests use mocked provider calls.
- Learning/account integration tests cover persistence in a new process, ownership, role restrictions, stale-save conflicts, invalid payloads, corruption handling and import safety.
- Learner sync tests cover immediate account caching, offline retry, edits during a save, and both conflict choices.
- K4 verifies lazy loading, all 24 topic modules, unchanged content digest, complete 2,795-entry search manifest, all-tab Wiz context and offline read-aloud helpers.

## U1.1 and Cloudflare checks

- Public UI registration creates a Free learner; the sidebar logout saves pending chapter progress and clears the Student session.
- Sidebar logout remains visible at 1366×768 and 1366×600.
- Two concurrent Worker requests use separate database connections/models; connections are released on success/failure and removed from the Mongoose registry.
- Worker routing preserves home/Student/Admin deep links, JSON API errors and private-file protection.
- Cloudflare dry build uses the Mongoose Node entry and a forced production NODE_ENV definition.
- Native Worker runtime serves all workspaces, enforces MongoDB mode and reports missing secrets.
- Controlled database failure exercises the native Node HTTP bridge/request context and returns a safe 503 without a URI.
- CLI Cloudflare whoami confirmed the build environment is not authenticated.
- Actual Atlas read-only ping was attempted and refused; live Atlas acceptance is pending.
- Password hashing took about 97 ms CPU in the local benchmark; the Worker deployment targets the Paid runtime.

## Browser checks

Chromium 153, local test database and stub Wiz. No real accounts or provider secrets were used.

- Branded home and workspace links render.
- Student login and all 24 topics render without eager topic downloads.
- Opening a real chapter saves chapter progress and streak through the backend.
- Completing a real quiz saves scores and mistake records.
- Reload restores learner settings from the backend.
- A second browser restores progress on mobile without horizontal overflow.
- Universal search loads and navigates to chemistry content.
- Contextual Wiz uses the same-origin API in offline test mode.
- Admin sign-in and user dashboard render at the same address.
- Student credentials cannot open the admin dashboard.
- Home layout fits five screen widths; no browser runtime errors.
- Development middleware serves both workspaces and API on the same listener and blocks backend/data file access.

## Remaining acceptance

- Actual Windows installation and the hosting manager/reverse proxy.
- Live MongoDB access and unique-index creation in the real database.
- Funded provider model access, real voice transcription, microphone/speaker/WebRTC and actual usage costs.
- Android/Capacitor package and broader Edge/Firefox/device testing.

The existing search chunk remains about 623 kB minified and is loaded on demand when search opens. Vite reports its size warning; this is a remaining performance task. Topic chunks remain separate. All chemistry content files are byte-for-byte identical to the supplied latest Student archive.

The release includes compiled `dist/`, source, one dependency lockfile and setup/migration tools. It excludes actual `.env` values, user data and node_modules. Historical empty auth/subscription placeholder test files are not counted as passing behavioural tests.
