# ChemWiz v1.3.1 — Render recovery

Baseline: the uploaded `Chemwiz-main.zip` received on 14 October 2026. It contains a partial v1.3.0 update on a v1.2.1 package. This release repairs that exact upload and retains the W2 features. Read the assessment in `docs/RENDER_RECOVERY_ASSESSMENT_2026-10-14.md`.

## Choose ONE installation route

### A. Complete system ZIP — recommended for a clean recovery

1. Keep the current working folder and live commit as rollback. Keep private environment settings and data separately.
2. Extract `ChemWiz-Updated-System-v1.3.1-2026-10-14.zip` into a NEW empty directory. Use the contained `chemwiz-unified` directory as the application folder. It contains `package.json`, `server.js`, all public source, tests, examples, the tested production `dist`, and the passing release report.
3. The archive excludes `.env`, provider keys, MongoDB credentials, learner records and `node_modules`. For an existing local installation, copy its private `.env` and local `data` directory into this new folder only if you want to keep that installation's configuration and records. Render continues to use its existing Environment settings and MongoDB database.
4. Run the commands below from the new application folder. Publish this complete source tree, including dot-prefixed configuration examples and the release report. The repository's application directory must match this clean source; retaining old patch helpers inside it changes the fingerprint.

### B. Changed-files ZIP — repairs the exact uploaded installation

1. Extract `ChemWiz-Changed-Files-v1.3.1-2026-10-14.zip` into a SEPARATE patch directory outside the app and repository. The payload alone is not a complete application.
2. Open PowerShell in that patch directory. Replace the example target with your existing unified folder containing `package.json`:

```powershell
node .\apply-patch.cjs "C:\PATH_TO_YOUR_EXISTING\Chemwiz-main"
```

For your previously used folder, the command would be:

```powershell
node .\apply-patch.cjs "C:\Users\dell\Desktop\Project chemwiz\chemwiz update\chemwiz recovery 2\chemwiz One\chemwiz-unified"
```

Use whichever folder actually contains your current app. On macOS/Linux: `node ./apply-patch.cjs "/path/to/current/app"`.

The installer verifies the uploaded baseline, accepts equivalent Windows line endings, backs up replaced/removed files under `patch-backups`, restores omitted files and removes the seven obsolete root patch/history files listed in `CHANGED_FILES.md`. It leaves actual environment settings, data, installed dependencies and generated dist in place. Preflight then rebuilds dist. It blocks conflicting user edits before changing application files; use the complete ZIP in a fresh folder if your copy differs from the uploaded baseline. Re-running it on the repaired source is safe.

## Install and test — both routes

Use Node 24. Open PowerShell in the actual app folder (not the patch directory). Run each command in order and proceed only after success:

```powershell
node --version
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
```

Expected final results: `INTEGRATION PREFLIGHT: PASS`, `LOCAL ACCEPTANCE: PASS`, `DEPLOYMENT GATE: PASS`, and `RELEASE SOURCE: PASS`. `diagnose:release` is read-only and checks the source/report even before dist is built. `ready:deploy` additionally checks your local compiled assets. Neither manufactures passing evidence.

The checks use disposable local accounts and blank live database/provider credentials. They cannot confirm your live Render credentials, Atlas network rules or microphone/provider operation. Browser installation is needed once; installed Chrome/Edge can also be used. A missing browser or failed/unavailable dependency audit blocks the checks.

For manual local acceptance after PASS:

```powershell
npm start
```

Open `http://localhost:5000`, `/student/`, and `/admin/`. Stop with Ctrl+C. For normal editing use `npm run dev`. Fresh local setup creates local demo accounts; existing MongoDB administrators retain their existing credentials. Any source or lockfile edit requires repeating the check sequence before deployment.

## Update the linked repository completely

Use Git/GitHub Desktop so dot-prefixed files are included. For route A, replace the application's public source with the full ZIP's contents and remove these obsolete root files if present: `apply-patch.cjs`, `patch-manifest.json`, `README_PATCH.md`, `CHANGED_FILES.md`, `INTEGRATION_REPORT.md`, `CHEMWIZ_MASTER_ROADMAP_V3_9_2026-10-12.md`, `CHEMWIZ_MASTER_ROADMAP_V4_0_2026-10-12.md`. The changed-files installer performs this cleanup with backups under route B. Historical roadmaps remain in `docs/history`.

The uploaded archive contains a real `.env` and `data/local-db.json`. The restored `.gitignore` prevents new tracking, but Git continues tracking files already committed. From the existing repository's application folder, the following removes those private files from Git's index while retaining them locally:

```powershell
git rm --cached --ignore-unmatch -- .env data/local-db.json
git status --short
git diff --stat
```

Check that private configuration and records are excluded. Commit the repaired source, `package.json`, `package-lock.json`, restored configuration examples, tests, and the current `verification/release-evidence.json` together. Then push to Render's linked branch. Keep `dist`, `node_modules`, `.build-checks`, and `patch-backups` out of Git. No code edits or dependency changes should occur between the passing checks and that commit. Git's normal CRLF/LF conversion is supported.

If the committed `.env` was accessible to others, rotate the exposed provider/database credentials and JWT secret through your providers and Render. A JWT-secret change signs users out. This recovery does not rotate credentials, delete records or recreate accounts automatically.

## Render settings

| Setting | Required value |
| --- | --- |
| Service | One Node Web Service |
| Repository / branch | The repository and branch containing this tested v1.3.1 source |
| Root Directory | Folder containing the repaired `package.json` and `server.js`; blank when they are at repository root |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/ready` |
| Node | Included `.node-version` selects 24.21.0; an existing `NODE_VERSION` setting takes precedence, so use 24.21.0 there too if set |
| `NODE_ENV` | `production` |
| `DATA_MODE` | `mongodb` |
| `APP_URL` | Your actual HTTPS origin, e.g. `https://your-app.onrender.com`, with no `/admin/` path or quotes |
| `MONGODB_URI` / `JWT_SECRET` / AI settings | Retain your existing private working settings and intended database |

Render supplies `PORT`. Set private production values in Render's Environment settings. After pushing the complete tested source, choose **Manual Deploy → Clear build cache & deploy** for this recovery. Render must print `chemwiz-unified@1.3.1` and `DEPLOYMENT GATE: PASS` before building. Cache clearing alone cannot repair missing source or a mismatched report. Keep the prebuild gate enabled.

## Confirm the live update and admin login

```powershell
npm run diagnose:admin -- "https://YOUR_ACTUAL_APP.onrender.com"
```

This sends no credentials and changes no records. `/api/health` and `/api/ready` should show version `1.3.1`; readiness should show `success: true` and `dataMode: mongodb`. Open Admin at the same address plus `/admin/`. Existing admin credentials stay valid. The restored origin fix accepts Render's trusted HTTPS origin and normalises configured workspace URLs, while rejecting unlisted sites. A temporary dashboard-panel failure retains a valid admin session.

If public diagnostics pass but credentials fail, follow `ADMIN_LOGIN_GUIDE.md` for read-only inspection of the intended administrator account. Complete a real admin login, two separate learner signups, learner separation, second-device progress restoration, logout and Wiz/provider/device checks after deployment. W3 remains the next planned phase; this release repairs deployment and restores the already approved features.

## Rollback

Restore the retained working source commit/folder with its matching test report and dependencies. Restore private settings only from your own backup. The patch backup lists replaced, removed and added files; restore replaced/removed files and remove only listed additions if rolling back manually. Existing MongoDB records are retained. Rebuild and test the restored source before publishing.

References: https://render.com/docs/deploys ; https://render.com/docs/node-version ; https://render.com/docs/environment-variables
