# ChemWiz — build rules and integration gate (v1.2.1)

This patch for **v1.2.0** records the standing build rules and adds required integration, security-control and local browser checks. Preserve working features, deliver a documented patch ZIP, and deploy only after the tested source passes. See **[BUILD_RULES.md](BUILD_RULES.md)** and **[INTEGRATION_CHECKS.md](INTEGRATION_CHECKS.md)**. Application features and saved-data behaviour are preserved. The patch also restores five unchanged required backend source files omitted from the earlier v1.2.0 archive.

The v1.2.0 baseline fixes **“This origin is not permitted to access ChemWiz”** on Render. The backend recognises Render's public HTTPS URL, and configured workspace URLs are compared by origin. Unlisted origins remain blocked. See **[RENDER_PRODUCTION.md](RENDER_PRODUCTION.md)** for the exact settings.

K-Cleanup removes the unused embedded-component diagram fallback after verifying that all 218 diagrams use specs. Targeted Polymerisation corrections cover Nylon-6,6 hydrolysis, caprolactam's seven-membered ring, condensation water counts and acid/base products. The other 23 topic records are unchanged.

The Student sidebar now includes a small **Log out** button below Home, Tools, Stats and Profile. It saves pending learning changes before signing out. Learners can already create Free accounts from **Student → No account yet? Create one**.

One ChemWiz application now serves the student workspace, admin workspace and backend at one web address. The v1.2.1 delivery contains **patched files for the unified v1.2.0 baseline**. Apply it using the ZIP’s README_PATCH.md and apply-patch.cjs; keep the working release as rollback. It does not apply to any of the three old projects.

## Start on Windows

Use Node.js **24** for the build/check tooling. Open a terminal in the extracted `chemwiz-unified` folder — the folder containing `package.json` and `server.js`.

```powershell
node --version
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run dev
```

Open **http://localhost:5000**. Keep this one terminal running. Choose Student or Admin on the home page. Stop with `Ctrl+C`.

| Workspace | Address |
| --- | --- |
| ChemWiz home | http://localhost:5000 |
| Students | http://localhost:5000/student/ |
| Admin | http://localhost:5000/admin/ |
| Backend health | http://localhost:5000/api/health |
| Database readiness | http://localhost:5000/api/ready |

Dependency installation creates a local `.env` with a random JWT secret once. It does not overwrite existing configuration or user data. MongoDB is optional for local testing.

## Existing ChemWiz accounts and Wiz settings

Before the first `npm run dev`, follow **[MIGRATION.md](MIGRATION.md)** to bring across the previous backend configuration and local database. Existing MongoDB users stay in the same MongoDB database. Old browser progress needs its separate learning-data export/import; it is not inside the backend ZIP.

Do not upload the old three projects alongside this project. Do not copy their frontend `.env` files or Worker bundles into the new application.

## Update an existing unified installation

Keep your working v1.2.0 folder/commit as backup. Extract the patch separately and run its apply-patch.cjs against that unified folder. The patch checks baseline file hashes and backs up replaced files. Keep the root `.env` and `data` folder private and in place. On Render, update the repository source and retain the existing environment variables, MongoDB database and JWT secret. This release requires no data migration. The ZIP excludes actual credentials and records.

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

For Render, set **Build Command** to `npm ci --include=dev && npm run build` and **Start Command** to `npm start`. Set `APP_URL` to the actual HTTPS site origin, with no workspace path. Render environment variables take precedence over the generated local `.env`. Commit the passing **verification/release-evidence.json** with the exact tested source. Render’s prebuild hook blocks stale/missing/failed evidence before compilation. The tests use disposable local records, not the live database.

## Fresh local test accounts

These are created only when initializing a new local database; imported users keep their existing passwords.

| Workspace | Email | Password |
| --- | --- | --- |
| Admin | admin@chemwiz.local | ChemWiz123! |
| Student | student@chemwiz.local | ChemWiz123! |

The test student starts on the Free plan. Use Admin to activate Premium for Wiz, structured questions and worked examples. Live provider calls need the backend AI configuration described below.

## Run the compiled application

The patch reuses the existing unified source. The integration preflight produces the production `dist/` build before local acceptance. Run the full check sequence after changing source:

```powershell
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

This still uses one address, http://localhost:5000. `npm start` uses compiled assets and needs no Vite development server. Restart after changing backend code or `.env`. The user reported a successful Render launch on 13 October 2026. Follow **[RENDER_PRODUCTION.md](RENDER_PRODUCTION.md)** for that deployment. Optional Cloudflare hosting remains in **[CLOUDFLARE_PRODUCTION.md](CLOUDFLARE_PRODUCTION.md)**; other Node hosts use **[HOSTING.md](HOSTING.md)**.

## What is saved

The backend retains accounts, passwords as hashes, roles, subscription/access settings, admin logs and existing tutor quota data. It now also saves each learner's topic progress, chapter completion, quiz counts/latest scores, settings, streak and mistakes notebook.

Student records are loaded after sign-in and saved automatically. A browser cache belongs to that specific account and retains pending edits during a connection failure. The workspace displays saving status and Retry when a save fails. Conflicting changes from another device require an explicit choice before replacing either copy. Quiz scores are learner revision records, not secure examination grades. The notebook retains the latest 1,000 mistakes.

Local data is stored in `data/local-db.json` using atomic file replacement. Use one server process with persistent disk in this mode. Keep backups of this file. Switching `DATA_MODE=mongodb` stores new records in MongoDB; it does not automatically move the local database there.

Raw microphone audio and live voice media remain transient. This integration does not add permanent storage of tutor conversations or historical quiz attempts beyond the existing quiz counts/latest scores and mistake records.

## Wiz text and voice

Provider keys belong only in the root `.env` or hosting environment. Both workspaces call the backend on their current address.

To preserve your working Wiz setup, use `npm run import-config` as explained in MIGRATION.md. For a new setup, configure:

```dotenv
OPENAI_API_KEY=your_existing_backend_key
AI_MODEL=your_working_text_model
AI_TRANSCRIPTION_MODEL=your_working_transcription_model
AI_LIVE_IN_LOCAL_MODE=true
AI_LIVE_VOICE_ENABLED=true
AI_REALTIME_MODEL=your_working_realtime_model
```

Leave `AI_LIVE_IN_LOCAL_MODE=false` for offline stub testing. Live voice defaults to disabled in the fresh configuration; imported settings preserve its previous value. Microphone features need HTTPS or localhost. Existing Premium rules and usage limits remain in place.

Text, transcription and Realtime routes passed mocked regression checks. The origin error was reproduced on U1.1 and verified fixed through a simulated HTTPS Render host in the browser. Live MongoDB writes and provider/microphone operation were not exercised by these release tests.

## Verify the installation

Run from `chemwiz-unified`:

```powershell
npm run check:integration
npm run test:local
npm run ready:deploy
```

`test:local` includes the Node regression tests using temporary isolated records and production desktop/mobile browser acceptance. The preflight verifies syntax/imports, API wiring/middleware, actual frontend request functions, defined security controls and dependency advisories. Content verification loads all 24 topics, renders all 218 spec diagrams and checks assessment integrity. See **[docs/VERIFICATION.md](docs/VERIFICATION.md)** for results and **[CHEMWIZ_MASTER_ROADMAP_V4_2_2026-10-14.md](CHEMWIZ_MASTER_ROADMAP_V4_2_2026-10-14.md)** for the current roadmap.

## Common startup problems

- **Port already in use:** stop the previous backend and both old frontend terminals. This build owns port 5000. If needed, change `PORT` and `APP_URL` together in the root `.env`; no frontend API URL edits are needed.
- **Web build missing:** run `npm run build`, then `npm start`.
- **Cannot log in after migration:** use the old account's password. Changing seed password settings does not change an existing password hash.
- **This origin is not permitted:** set the host's `APP_URL` to the exact HTTPS application origin, such as `https://your-app.onrender.com`, and restart. Open Admin at that address plus `/admin/`. This release also allows Render's automatically supplied public service URL. Custom domains need their correct `APP_URL`.
- **Changes waiting to save:** restore the connection and press Retry. Do not clear browser storage while there are pending changes.
- **Database unreadable:** restore a valid backup. The application stops instead of resetting damaged data.
- **Local npm install with scripts disabled:** run `npm run setup` before starting.
