# P1 — One ChemWiz application on Cloudflare + MongoDB Atlas

This release adds a Cloudflare Worker entry point for the whole ChemWiz application. The Node local application still starts normally. The deployment target is one Worker at one HTTPS address, with Student `/student/`, Admin `/admin/` and API `/api/*`. Worker runtime configuration uses **NODE_ENV=production** and **DATA_MODE=mongodb**; it never seeds local demo users or writes a local JSON database.

**Current status:** build, routing, request-lifetime tests and native Worker startup checks pass. The Cloudflare account is not authenticated in the build environment, and the supplied Atlas connection could not be reached there. This package has not been deployed to your account or verified against your live Atlas database.

## 1. Prepare the release folder

Keep your working release as backup. Apply the v1.2.1 patch to the unified v1.2.0 baseline using README_PATCH.md. Open PowerShell in its chemwiz-unified folder and use Node 24.

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run cf:dry
```

`cf:dry` bundles the Worker and checks that it contains the Mongoose **Node** build and the unified routing/database adapter. It does not publish a website. There is no need to upload three separate apps.

## 2. Choose the Cloudflare runtime plan

Use **Workers Paid** for this application's authentication. Cloudflare's Free plan has a 10 ms CPU budget; cost-10 bcrypt hashing took about 97 ms of CPU in the local benchmark. That benchmark is not a Cloudflare performance measurement, but it shows why Free-tier authentication should not be assumed to fit. The deployment configuration sets a 30,000 ms CPU ceiling for the Paid runtime.

If you want to stay with Free Cloudflare DNS/proxy rather than use Workers Paid, retain the Node hosting path in HOSTING.md: run this one Node application on your own host, use Atlas there, and put the one domain behind Cloudflare. Do not reduce password hashing strength to work around the Worker CPU budget. No plan purchase or billing change was performed in this build.

## 3. Confirm MongoDB Atlas configuration

If your Atlas cluster already exists, keep it and select the intended ChemWiz database. You do not need a new cluster just because the three apps were combined.

In Atlas:

1. Open **Database Access** and confirm a database user with a strong password and `readWrite` access to the intended ChemWiz database. The database user is separate from your Atlas website login.
2. Open the cluster's **Connect → Drivers → Node.js** flow and copy its connection string privately. Include the intended database name in the URI. URL-encode special characters in the database password.
3. Check **Network Access**. Your Windows computer's public IP needs access for the local connection/admin bootstrap commands below. Direct Worker connections also require an access-list setup compatible with Worker egress.

Cloudflare states that TCP Worker egress is not taken from its published proxy/CDN IP ranges. Allowing only those published Cloudflare IPs does not solve Atlas access. Keep a dedicated database/user for the production-environment pilot; use your chosen network policy deliberately. An unrestricted access rule should not be silently added to an existing Atlas project. Atlas supports temporary access entries for bounded tests. For a tightly restricted production network, use an origin with fixed egress/private connectivity and Cloudflare in front.

## 4. Create a private production settings file

Copy the supplied example, then edit the new file locally:

```powershell
Copy-Item .env.production.example .env.production
notepad .env.production
```

Fill in the canonical values:

```dotenv
NODE_ENV=production
CHEMWIZ_RUNTIME=node
DATA_MODE=mongodb
APP_URL=https://your-real-single-chemwiz-address
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_ENCODED_PASSWORD@YOUR_ATLAS_HOST/chemwiz?retryWrites=true&w=majority
JWT_SECRET=YOUR_STABLE_PRIVATE_SECRET_AT_LEAST_32_CHARACTERS
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=YOUR_EXISTING_BACKEND_KEY_IF_USING_WIZ
```

Reuse your existing valid MongoDB connection and stable JWT secret where applicable. `CHEMWIZ_RUNTIME=node` is for the Windows diagnostic/admin commands; the deployed Worker sets its own `cloudflare-worker` runtime.

To generate a new secret for a fresh application, run this on your own PC and keep its output private:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Use the same chosen secret across future deployments. This file is private; do not post the URI, password, JWT secret or provider key in chat.

Then verify:

```powershell
npm run check:production -- ".env.production"
npm run check:mongo -- ".env.production"
```

The Mongo command performs an authenticated read-only ping and prints no URI or credentials. If it fails, resolve Atlas user/password, cluster status, local IP access and internet/DNS before continuing.

## 5. Confirm the Cloudflare account and set Worker secrets

```powershell
npm run cf:login
npm run cf:whoami
```

The login command opens the browser for your own Cloudflare sign-in/authorization. Confirm the account that should own ChemWiz. No temporary/shared deployment account is used by these instructions.

The Worker name in `wrangler.jsonc` is **chemwiz-unified**. It creates/updates that one Worker. It does not replace the previous `chemwiz-api`, `chemwiz-student` or `chemwiz-admin` deployments unless you explicitly change its name.

Set the secrets privately in the terminal prompts:

```powershell
npx wrangler secret put MONGODB_URI
npx wrangler secret put JWT_SECRET
npx wrangler secret put OPENAI_API_KEY
```

Paste the matching values from your private production file into those prompts. `OPENAI_API_KEY` is optional when testing account/database flows only. If Wrangler asks to create the new Worker while setting the first secret, it is creating the configured `chemwiz-unified` target.

Cloudflare keeps deployed secrets separately from local `.env` files. Your root `.env` is not uploaded by the deployment command. Set model names and quota settings in `wrangler.jsonc` to match the working backend; keep keys out of that file. Live voice remains disabled initially and can be enabled after the production device test.

## 6. Bootstrap an admin only when needed

If the Atlas database already has your Admin account, retain it and sign in with that existing password.

For a genuinely new database, create a private admin from your Windows PC:

```powershell
npm run create-admin -- ".env.production"
```

It prompts for email and a hidden password of at least 12 characters. It refuses to overwrite an existing account. This step needs your PC's IP permitted in Atlas. New learners can create their own Free accounts through the Student workspace; Admin activates Premium.

## 7. Deploy the whole application

After any source, dependency or wrangler.jsonc changes, repeat check:integration, test:local and ready:deploy. Keep the passing verification/release-evidence.json with the exact source. cf:deploy runs the gate first; failed/missing/stale evidence blocks publishing. Local checks do not replace the private Atlas/provider checks above.

```powershell
npm run cf:deploy
```

Wrangler uploads the backend Worker plus the compiled Student, Admin and home assets in one deployment. Open the single HTTPS URL printed by Wrangler. All frontend API calls use that same address.

For a custom domain later, open Cloudflare **Workers & Pages → chemwiz-unified → Settings → Domains & Routes**, add the intended domain and test both workspaces there. The Worker derives its same-origin address from the request unless you deliberately configure `APP_URL` in its vars.

## 8. Confirm the live database-backed application

Open the deployed URL with:

- `/api/health`: `runtime` should be `cloudflare-worker`, `dataMode` should be `mongodb`, and both JWT/database configuration flags should be true. Health checks configuration only.
- `/api/ready`: should succeed after a real MongoDB connection. Do not treat a healthy home page or health response as proof that MongoDB connected.

Then create a **new test learner from the Student UI**, log out using the new left-sidebar button, log back in, read a chapter and complete a quiz. Wait for the saved confirmation. Open a different browser/device with the same learner and verify restoration. Confirm the student cannot enter Admin, and confirm Admin can activate the test student's subscription.

If an API fails:

```powershell
npm run cf:tail
```

Refresh `/api/ready` while watching logs. The deployed API returns a safe database-unavailable message rather than a private URI. Common causes are a missing/incorrect canonical secret, Atlas access-list restrictions, an inactive cluster or database user permissions. Keep TLS certificate verification enabled.

This release opens/closes a separate MongoDB connection within each Worker request. The standard Node server still retains its original pooled connection. A production performance test must measure latency and Atlas connection count under the intended learner load.

## Existing data and rollback

MongoDB users, password hashes, subscriptions and logs stay in the same database when using the same URI/database. If your U1 testing used local JSON, those records are not automatically copied to Atlas. Keep the local file and learning backups; a learner can import their personal backup after signing in with the same email in production. Plan a deliberate account/data migration if the local database has real users.

Keep U1 unchanged until P1 live acceptance. If the deployment fails, the local Node application remains runnable with `npm run dev`. Cloudflare rollout/rollback and account configuration remain separate from the code package.

## Primary documentation

- [Cloudflare Node HTTP/Express bridge](https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/)
- [Cloudflare TCP socket request ownership and egress](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)
- [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Worker CPU limits](https://developers.cloudflare.com/workers/platform/limits/)
- [MongoDB Atlas IP access configuration](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
