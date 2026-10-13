# ChemWiz — One Application (U1.1 + P1)

The Student sidebar now includes a small **Log out** button below Home, Tools, Stats and Profile. It saves pending learning changes before signing out. Learners can already create Free accounts from **Student → No account yet? Create one**.

One ChemWiz application now serves the student workspace, admin workspace and backend at one web address. This is a full replacement project to extract into a **fresh folder**, not a patch to paste into any of the three old projects.

## Start on Windows

Use Node.js **22.12 or newer**; Node.js 24 is the tested version. Open a terminal in the extracted `chemwiz-unified` folder — the folder containing `package.json` and `server.js`.

```powershell
node --version
npm install
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

`npm install` creates a local `.env` with a random JWT secret once. It does not overwrite existing configuration or user data. MongoDB is optional for local testing.

## Existing ChemWiz accounts and Wiz settings

Before the first `npm run dev`, follow **[MIGRATION.md](MIGRATION.md)** to bring across the previous backend configuration and local database. Existing MongoDB users stay in the same MongoDB database. Old browser progress needs its separate learning-data export/import; it is not inside the backend ZIP.

Do not upload the old three projects alongside this project. Do not copy their frontend `.env` files or Worker bundles into the new application.

## Update an existing U1 installation

Keep your U1 folder as backup. Extract this release separately. Copy your current root `.env` and `data` folder to the new `chemwiz-unified` folder if using local data; keep them private. Use `npm install`, then `npm run dev`. The uploaded ZIP excludes actual credentials and records. Your current Node local settings do not become Cloudflare secrets automatically.

## Fresh local test accounts

These are created only when initializing a new local database; imported users keep their existing passwords.

| Workspace | Email | Password |
| --- | --- | --- |
| Admin | admin@chemwiz.local | ChemWiz123! |
| Student | student@chemwiz.local | ChemWiz123! |

The test student starts on the Free plan. Use Admin to activate Premium for Wiz, structured questions and worked examples. Live provider calls need the backend AI configuration described below.

## Run the compiled application

The ZIP includes a verified `dist/` build. Rebuild after changing frontend code:

```powershell
npm run build
npm start
```

This still uses one address, http://localhost:5000. `npm start` uses compiled assets and needs no Vite development server. Restart after changing backend code or `.env`. For the next production phase, use **[CLOUDFLARE_PRODUCTION.md](CLOUDFLARE_PRODUCTION.md)** to deploy this single application on Cloudflare Workers with Atlas. The original Node hosting path remains in **[HOSTING.md](HOSTING.md)**.

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

Text, transcription and Realtime routes passed mocked regression checks. Real provider access, MongoDB connectivity, microphone/speaker operation and hosting were not exercised in this environment.

## Verify the installation

Run from `chemwiz-unified`:

```powershell
npm run check
npm test
npm run verify:k4
npm run build
```

`npm test` uses temporary isolated records, not your actual data. The source check verifies required files and relative backend imports. See **[docs/VERIFICATION.md](docs/VERIFICATION.md)** for the performed checks and **[CHEMWIZ_MASTER_ROADMAP_V4_0_2026-10-12.md](CHEMWIZ_MASTER_ROADMAP_V4_0_2026-10-12.md)** for the current roadmap.

## Common startup problems

- **Port already in use:** stop the previous backend and both old frontend terminals. This build owns port 5000. If needed, change `PORT` and `APP_URL` together in the root `.env`; no frontend API URL edits are needed.
- **Web build missing:** run `npm run build`, then `npm start`.
- **Cannot log in after migration:** use the old account's password. Changing seed password settings does not change an existing password hash.
- **Changes waiting to save:** restore the connection and press Retry. Do not clear browser storage while there are pending changes.
- **Database unreadable:** restore a valid backup. The application stops instead of resetting damaged data.
- **Local npm install with scripts disabled:** run `npm run setup` before starting.
