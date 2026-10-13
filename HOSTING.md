# Host ChemWiz at one web address

This release supports a normal **Node.js application** and a new **Cloudflare Worker** entry point. For Cloudflare + Atlas, follow [CLOUDFLARE_PRODUCTION.md](CLOUDFLARE_PRODUCTION.md). The rest of this guide covers a normal Node host. Serve it on a Node-capable host/VPS or Node application manager. Uploading only `dist/` to static hosting does not run its authentication or data APIs. The new Worker entry point deploys all workspaces together; the previous separate API/Student/Admin Worker deployments remain separate until a deliberate cutover.

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
npm ci
npm run build
node scripts/check-installation.cjs --production
npm start
```

If using the prebuilt `dist/` from this ZIP:

```bash
npm ci --omit=dev
node scripts/check-installation.cjs --production
npm start
```

Use your hosting manager's normal restart command after deployment. Do not run `npm run dev` for public hosting. For later frontend updates, rebuild with development dependencies installed, then deploy the resulting `dist/` with the backend source.

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

## Data and backups

Persist the MongoDB database, or the entire configured local data directory. Preserve the stable JWT secret. Application updates must not replace `.env` or the local database. The ZIP excludes user records, actual provider keys, the old Worker bundles and `node_modules`.

Check `https://your-domain/api/health` and `/api/ready` after startup, then test real admin/student login and learner saving. Microphone use requires HTTPS. Live database, provider and hosting verification remains a task for the actual deployment environment.
