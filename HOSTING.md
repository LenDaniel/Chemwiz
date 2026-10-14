# Host ChemWiz at one web address

The active user deployment is a **Render Node web service**; use [RENDER_PRODUCTION.md](RENDER_PRODUCTION.md). This guide also covers other Node-capable hosts, VPSs and Node application managers. Optional Cloudflare hosting remains in [CLOUDFLARE_PRODUCTION.md](CLOUDFLARE_PRODUCTION.md). Uploading only `dist/` to static hosting does not run authentication or the data APIs.

## Required application settings

| Setting | Value |
| --- | --- |
| Application root | The `chemwiz-unified` folder containing package.json |
| Startup file | `server.js` |
| Node version | 22.12+; tested with 24 |
| Environment | `NODE_ENV=production` |
| Public address | One HTTPS address, configured in `APP_URL` |
| Port | The host-provided `PORT`, or your configured internal Node port |

One reverse proxy maps your HTTPS domain to this Node application. Student, Admin and API share that address. No second or third frontend deployment is needed. If the host mounts applications below a URL prefix, configure the proxy to give this application its own domain/subdomain root; this build expects `/`, `/student/`, `/admin/` and `/api` at that root.

## Install and run

If building on the server:

```bash
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
node scripts/check-installation.cjs --production
npm start
```

A checked source/dist can be copied to a host after ready:deploy passes on the build machine. Retain verification/release-evidence.json with the source. The patch ZIP itself does not contain a new dist; preflight builds it. On a runtime-only host, after the release passes all required checks elsewhere:

```bash
npm ci --omit=dev
node scripts/check-installation.cjs --production
npm start
```

Use your hosting manager's normal restart command after deployment. Do not run `npm run dev` for public hosting. For later updates, run check:integration, test:local and ready:deploy with development dependencies installed, then publish the resulting checked source/dist. See BUILD_RULES.md and INTEGRATION_CHECKS.md.

## Environment

Set these privately in the host or root `.env`:

```dotenv
NODE_ENV=production
APP_URL=https://your-chemwiz-domain.example
DATA_MODE=mongodb
MONGODB_URI=your_existing_mongodb_connection
JWT_SECRET=your_private_stable_secret_at_least_32_characters
JWT_EXPIRES_IN=7d
```

Retain existing working backend Wiz settings if required. Configure only one MongoDB URI and one provider-key variable. Never put provider keys in web source or upload private backend files into a separate public/static folder.

If no admin exists in a new MongoDB database, run this interactive command once:

```bash
npm run create-admin
```

It asks for the new email and a hidden password of at least 12 characters. It refuses to change an existing account. Existing MongoDB admin accounts need no recreation.

If deliberately hosting with local JSON, set `DATA_MODE=local` and a persistent writable `LOCAL_DATA_FILE`. Use one process, private seed credentials and backups. Production does not create the demo student. Set a private `LOCAL_ADMIN_PASSWORD` before initializing a fresh local production database; default test credentials are rejected for that admin initialization. Local JSON data is not automatically migrated to MongoDB when changing modes.

Set `TRUST_PROXY=1` only if there is exactly one trusted reverse proxy directly in front of Node and the host prevents clients from bypassing it. Otherwise leave it `0`; use the provider's documented proxy configuration. `APP_URL` must still match the external HTTPS origin.

On Render, the backend also allows the origin from the platform-provided `RENDER_EXTERNAL_URL` when `RENDER=true`. This handles HTTPS termination without changing proxy trust. Configured workspace URLs contribute their scheme/hostname/port to the allowlist; paths do not change an origin. Unlisted origins are still rejected. Custom domains should use their public origin in `APP_URL`.

## Data and backups

Persist the MongoDB database, or the entire configured local data directory. Preserve the stable JWT secret. Application updates must not replace `.env` or the local database. The ZIP excludes user records, actual provider keys, the old Worker bundles and `node_modules`.

Check `https://your-domain/api/health` and `/api/ready` after startup, then test real admin/student login and learner saving. Microphone use requires HTTPS. Live database, provider and hosting verification remains a task for the actual deployment environment.
