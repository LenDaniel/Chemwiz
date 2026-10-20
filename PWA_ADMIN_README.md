# ChemWiz v1.6.0 — deferred admin controls and PWA1a

Prepared 18 October 2026. Supported source baseline: unchanged v1.5.3. Keep the working release as rollback.

## Users and Subscriptions

The section starts collapsed. Its component and accounts are fetched only when it is first opened. Closing and reopening preserves the current filters, page and horizontal table position without another request. Refresh while closed marks the accounts for refresh on the next open. Loading and retry messages stay inside the section.

A horizontal drag bar sits above the table. Drag it, use the arrow keys, or press Home/End to reach the first/last columns. Native table scrolling and the bar stay synchronized. Existing subscription, account-status and role confirmation controls remain in place.

School membership selection has its own lazy account search. Open Privacy and school administration → School subscriptions and memberships, then search by name or email. Results are limited to 50 accounts; an exact email makes selection easier. This works while Users & Subscriptions stays closed.

## Test school memberships now

The current S1 school subscription and membership flow is available in this source. Use a labelled synthetic school and adult test accounts in local or staging. Availability on your hosted address depends on which version you have deployed.

1. Create ordinary ChemWiz accounts for a test school administrator, teacher and learner. These use normal signup; there is no separate school self-signup page yet.
2. In platform Admin, create an active test school with seats, a future expiry, and clearly synthetic agreement/DPA references. Test references are for isolated testing only.
3. Find each existing account in the school membership form and assign its school role. Give the teacher a class identifier and assign the learner to the same class.
4. Sign into each account and confirm the pending school-sharing membership in Profile. New or changed memberships require fresh confirmation.
5. Verify the teacher's scoped roster/progress view, then test revocation with synthetic records. School roles do not grant platform administrator privileges.

Full school onboarding, class management, assignments/gradebook and school billing remain later roadmap builds. The membership foundation does not complete those workflows. See PRIVACY_SCHOOLS_README.md for the existing consent, school contract and access requirements.

## PWA1a installation and recovery

The production learner workspace now supplies an install manifest, app icons and a learner-scoped service worker. Profile contains installation instructions, update checks and Clear offline recovery files. A browser's native installation prompt is shown only after an explicit Install app click when that prompt is available. Browser/OS support determines the available installation option.

Use the production build over HTTPS, or localhost/loopback during testing. `npm run dev` does not register the worker. Admin stays outside the worker's scope.

Only five public files enter this worker's cache: a generic reconnect page, the manifest, two PNG icons and the SVG icon. Launching the learner page offline shows the reconnect screen. Lessons, search, authenticated API responses, account records, Wiz and admin files are not stored or replayed by this worker. Existing account-scoped pending learning changes retain their normal reconnect behaviour. Downloadable lessons and offline entitlement/pack management remain PWA1/OFF0 follow-ups after the rights inventory.

An app update waits for the learner. Apply it from Home, Profile, Progress or the tools home screen after finishing an activity. The update first saves learning changes; an unsuccessful save pauses the update. Other learner tabs must be closed before activation. Only the initiating page reloads. A failed recovery-file download keeps the working worker and removes the incomplete cache. Activation retains at most the current and one previous owned cache, without deleting unrelated origin caches.

Clear offline recovery files unregisters this worker and removes its owned recovery caches. It preserves sign-in, learning records and unrelated caches. Reopen ChemWiz online to prepare recovery again.

## Apply and verify

Stop the app. Extract the delivered patch ZIP outside the existing application folder. From the extracted patch folder, substitute the real path:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

The installer checks the complete v1.5.3 source and patch payload before writing, supports CRLF, and creates a rollback backup. Keep the installer and manifest outside the application folder. Existing private environment settings, MongoDB configuration, JWT secret, accounts and working AI_MODEL remain intact.

Inside the updated app folder, use Node 24 LTS. Run each command separately and stop on failure:

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

On Linux, Playwright documents `npx playwright install --with-deps chromium firefox` for browser/OS dependencies. If Windows Firefox reports `msvcp140_1.dll` missing, install or repair Microsoft's official x64 Visual C++ runtime, then restart the terminal and rerun local acceptance: https://aka.ms/vc14/vc_redist.x64.exe .

After preflight, focused commands are `npm run check:performance`, `npm run check:pwa`, and `npm run test:w3`. The last command now exercises both W3 and the new admin/PWA scenarios in Chromium and Firefox. `npm run test:w3 -- --browsers=chrome,msedge` requires the actual installed branded browsers. Missing required browsers fail the gate.

Render retains Build `npm ci --include=dev && npm run build` and Start `npm start`. Commit the exact tested source and verification/release-evidence.json together. This patch does not deploy a live service.

## Verification scope

The delivered patch README and release evidence record the actual completed checks, fingerprints, browser versions and environment conditions. Local fixtures use isolated synthetic adult accounts, blank live provider/database credentials, captured email transport and a MongoDB connection refusal guard.

Offline navigation tests combine browser offline mode with a disconnected local origin so service-worker fetches cannot escape emulation in Firefox (Mozilla issue 2081131). Update/failure variants are served only by the isolated test proxy.

Native installation on physical devices, branded Chrome/Edge, assistive technology, real Atlas/provider/guardian operations and the G0 staging/rights gates need their separate evidence. Android APK/AAB and Windows EXE/MSI remain later required deliverables. A generic recovery screen does not complete offline lesson packs.

## Rollback

Before restoring v1.5.3 or an earlier release, open Profile online in each browser/profile where this PWA was tested and use Clear offline recovery files. Close other learner tabs, then close the app. If the current UI cannot be opened, use that browser's site/service-worker controls to unregister only `/student/sw.js` and remove only `chemwiz-student-recovery-` caches; preserve account storage.

Follow `patch-backups/pwa-admin-v1.6.0-<timestamp>/ROLLBACK.txt`: restore replaced files and remove only its listed new files. Keep records and private configuration intact. Reinstall dependencies and rerun the original release's checks. The previous release does not contain the new worker-removal control, so remove the worker before replacing its source.
