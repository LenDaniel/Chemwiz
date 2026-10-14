# ChemWiz W2 + Admin session patch v1.3.0

Baseline: **chemwiz-unified v1.2.1** (the build-rules/integration-gate patch). Keep the working folder/commit as rollback. This ZIP contains patched files and the files needed to apply and verify them. The 24 chemistry topic/assessment records, existing accounts, data schemas, provider settings and origin allowlist are preserved.

## Apply on Windows

1. Stop the local app. Extract this ZIP into a separate patch folder, outside your existing chemwiz-unified application.
2. Use Node 24. Open PowerShell in the extracted patch folder and replace the target path below with the existing unified folder containing package.json:

```powershell
node .\apply-patch.cjs "C:\YOUR_PATH\chemwiz-unified"
```

On macOS/Linux: `node ./apply-patch.cjs "/your/path/chemwiz-unified"`.

The installer verifies every payload and changed-file baseline before writing, accepts equivalent Windows line endings, preserves conflicting user edits by blocking the patch, and backs up replaced files under patch-backups. It can be run again safely. The generated release-evidence file is backed up/replaced even when its previous check timestamps differ. Private environment files, credentials, user records, node_modules and compiled dist are not patched.

## Required commands after applying

Open your terminal in the existing chemwiz-unified application folder:

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
```

Browser installation is needed only once (the check also tries installed Chrome/Edge). Required checks that fail or cannot run block PASS. Preflight creates the current compiled dist, then local acceptance verifies it. Run `npm run dev` for your normal single-address development session or `npm start` for the checked compiled app. Keep the patch folder separate from the application source.

## What W2 changes

- Explanatory diagram labels/cards/steps/table rows wrap with matching heights. SVG bounds include complete labels/equations/raw structures; diagram enlargement and text alternatives are available.
- Saved reading sizes affect paragraph/list text. Mobile/desktop layouts, quiz controls, structured/worked activities, tools, Progress/Profile and Wiz text/live-voice controls are checked at six viewport sizes.
- Search and admin user details support modal keyboard cycling, Escape and focus return. Form controls, toggles, periodic elements and navigation have meaningful names/states. Mobile learners can log out directly from the topbar through the existing save-and-sign-out handler.
- Admin authentication is separated from dashboard panel loading. A valid session survives a temporary statistics/users/log failure; Refresh retries. A temporary authority/network failure retains the saved token and offers Retry saved session. Invalid/expired/non-admin access is still rejected.
- Error status/codes survive the admin frontend wrapper. Backend health/readiness and the login entry page show the release version. The Windows check launcher invokes npm through Node with shell disabled, removing this helper's DEP0190 pattern.

## Diagnose the remaining live admin login failure

Running a local build does not update Render. The exact live cause requires the actual public URL/current error. Run this read-only command, substituting your real address:

```powershell
npm run diagnose:admin -- "https://YOUR_APP.onrender.com"
```

It sends no credentials and checks deployed version, the exact public origin, database readiness and API protection. If an origin is rejected, set Render APP_URL to the exact HTTPS origin from the browser address bar (no /admin/ path, quotes or wildcard), retain the current MongoDB/JWT values, and redeploy the checked source. Verify /api/health reports 1.3.0. The login screen displays its frontend version too.

Optional read-only account inspection uses the actual host environment or your matching private production file:

```powershell
npm run diagnose:admin -- --account "YOUR_ADMIN_EMAIL" --env ".env.production"
```

This reports missing/wrong-role/inactive/legacy-casing/password-record problems without printing password material or changing records. A local .env describes its local database; it does not inspect the remote production database automatically. See **chemwiz-unified/ADMIN_LOGIN_GUIDE.md** for all result categories and existing admin-bootstrap guidance. Keep private settings and credentials out of chat/version control.

## Publish only after local checks pass

Commit the patched source, dependency lockfile and passing verification/release-evidence.json to the linked repository. Preserve existing Render environment values and database. Source/dependency changes invalidate the evidence and require the check sequence again.

- Render Build: `npm ci --include=dev && npm run build`
- Render Start: `npm start`
- Health Check: `/api/ready`

Render's prebuild hook checks matching passing evidence before compiling. For other hosts, publish the checked source/dist after ready:deploy. The optional Cloudflare deployment command retains its gate. Direct deployment commands outside this workflow are not controlled by the tool. This patch has not been published to your live service.

## Verification and next phase

Passed: 17 actual frontend API probes, 24 backend route/access checks, eight security/data-control groups, 59 regression tests, 26 browser scenarios and all 218 React diagrams with zero measured text clipping. Tests cover 320×640, 390×844, 768×1024, 1366×768, 1366×460 and a 683×384 effective 200%-zoom layout. Dependency audit reported zero advisories; the existing medium password-minimum/throttling follow-ups remain documented. Optional Worker bundling also passes.

Testing uses disposable local records and controlled AI/voice responses. Real Atlas/provider/audio/device/Windows acceptance remains separate; these checks do not certify the absence of all security/accessibility issues. The previous working release remains your rollback.

See CHANGED_FILES.md, patch-manifest.json, INTEGRATION_REPORT.md, chemwiz-unified/docs/VERIFICATION.md and W2_BUILD_NOTES_2026-10-14.md. The current master plan is **CHEMWIZ_MASTER_ROADMAP_V4_3_2026-10-14.md**; **W3 browser/performance/failure-state acceptance is next**, then the retained PWA/Android/Windows tracks.

## Rollback

Restore your retained v1.2.1 folder/commit with the same environment/database. Alternatively restore replaced files from patch-backups and remove only the added files listed in PATCH_BACKUP.json. Reinstall the matching lockfile and rebuild. Keep private settings and records in place.
