# ChemWiz on Render — production and updates

Use one Node **Web Service** for home, Student, Admin and `/api/*`. MongoDB Atlas retains the accounts and learner records. Both workspaces use relative API requests on the same address.

## Exact settings

| Render setting | Value |
| --- | --- |
| Root Directory | Folder containing the unified `package.json` and `server.js`; blank when they are at the repository root |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/ready` |
| Node version | Node 24; the included version file selects 24.21.0 unless `NODE_VERSION` overrides it |

`--include=dev` installs Vite for the frontend build. The running production application uses `node server.js`.

Set the following in Render's Environment page. Values below are descriptions, not credentials to copy.

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATA_MODE` | `mongodb` |
| `APP_URL` | Actual HTTPS site origin, e.g. `https://your-app.onrender.com` |
| `MONGODB_URI` | Existing private Atlas connection string, including the same database name |
| `JWT_SECRET` | Existing stable private secret, at least 32 characters |
| `JWT_EXPIRES_IN` | Keep the existing value, normally `7d` |
| Wiz settings | Retain existing backend provider keys and model/access settings |

Render provides `PORT`; the server binds to it on `0.0.0.0`. This release does not need proxy trust enabled to recognise the Render HTTPS origin. A custom domain needs its actual HTTPS origin in `APP_URL`.

## Fix “This origin is not permitted to access ChemWiz”

This response comes from the origin allowlist before the login credentials are checked.

1. Open Render → service → Environment.
2. Set `APP_URL` to the exact public HTTPS origin from your browser's address bar. Use the scheme and hostname, without `/admin/`, `/student/`, quotes, or a trailing query string.
3. Save and redeploy. Open Admin at `APP_URL` followed by `/admin/`.

For example, the setting is `APP_URL=https://your-app.onrender.com`, while the admin page is `https://your-app.onrender.com/admin/`.

In v1.2.0, the backend also accepts Render's automatically supplied `RENDER_EXTERNAL_URL` when the platform sets `RENDER=true`. This covers the native `onrender.com` address even when Node sees the internal HTTP connection. Configured workspace URLs are reduced to their origins. Arbitrary sites, wildcard values and forged forwarded headers do not become trusted origins.

Keep the existing MongoDB connection and JWT secret while applying this fix. The frontend API URLs need no edits.

## Apply the v1.2.1 check-tool patch

1. Retain the current working release/commit as rollback.
2. Extract the patch separately, then run its apply-patch.cjs against your unified v1.2.0 folder. Follow README_PATCH.md. The patch leaves environment settings and user data in place.
3. Retain the existing Render environment variables. No database migration or account reset is required.
4. Run the required local check sequence below. Commit verification/release-evidence.json with the exact passing source before triggering Render. The prebuild hook checks evidence and blocks an unchecked or changed release. Use the Build/Start commands above. After changing those commands, choose Manual Deploy → Clear build cache & deploy; otherwise deploy the new source commit normally.
5. Confirm `/api/ready` reports `success: true` and `dataMode: mongodb`.

For a new, empty MongoDB database only, create the first admin from an authorised server terminal:

```bash
npm run create-admin
```

The command asks for an email and hidden password. Existing MongoDB admin accounts retain their credentials and need no recreation. Local demo credentials do not automatically create a MongoDB admin.

## Local checks before publishing an update

From the folder containing the unified `package.json`:

```bash
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

The local sequence uses fixture records and covers the production frontend with the real local server. Follow INTEGRATION_CHECKS.md for coverage and the two reported authentication hardening items. Keep the sanitized release evidence tracked in git; .build-checks is local-only. Changed source or dependencies require the sequence again.

Optional private production diagnostics, with the host's environment or your own private production settings file:

```bash
npm run check:production
npm run check:mongo
```

The MongoDB check is an authenticated, read-only ping. Tests use temporary isolated local records. Preserve production credentials and records outside the release source.

## Live acceptance

Create two learner accounts with different email addresses. Complete a chapter/quiz as the first learner; verify the second learner has separate progress. Sign in as the first learner on a second browser/device and confirm restoration. Test sidebar logout, admin access, Premium activation and the existing Wiz features. Confirm a learner cannot access admin-only data.

For future builds, use a separate staging service and an Atlas test database, with their own application URL and credentials. Validate there before deploying the live release. A staging service must use its test database rather than the production URI.

References: [Render Node services](https://render.com/docs/deploy-node-express-app), [default environment variables](https://render.com/docs/environment-variables), [Node versions](https://render.com/docs/node-version), [deploys](https://render.com/docs/deploys), [projects/environments](https://render.com/docs/projects).
