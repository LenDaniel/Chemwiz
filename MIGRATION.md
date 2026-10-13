# Move from three projects to one ChemWiz application

Keep a backup of all three old folders. Extract the new ZIP into a fresh folder. Use a terminal inside its `chemwiz-unified` folder.

## 1. Install once

```powershell
npm install
```

Do not start the new application until the migration steps below are complete.

## 2. Bring across backend configuration

Find the `.env` from your working **old backend**. Copy its full path. Example:

```powershell
npm run import-config -- "C:\Users\dell\Desktop\Project chemwiz\chemwiz-backend\.env"
```

Replace the example with your actual path. This imports the backend data mode, stable JWT secret, local account seed settings, MongoDB connection, Wiz provider configuration and quota settings. It converts Mongo/API aliases to the canonical variables where necessary. It backs up the new destination configuration first and never prints secret values.

It retains the new application's `PORT`, `APP_URL`, data-file location and web routing. The old Student/Admin API URLs, Worker runtime and frontend environment files are not needed. In the root `.env`, check that local testing uses `APP_URL=http://localhost:5000`. Set production `NODE_ENV` and HTTPS `APP_URL` when hosting.

## 3. Move existing accounts and administration records

**If the old backend uses `DATA_MODE=local`:** locate its `data\local-db.json` and import it before the first new startup:

```powershell
npm run import-local -- "C:\Users\dell\Desktop\Project chemwiz\chemwiz-backend\data\local-db.json"
```

The script preserves IDs, password hashes, roles, subscriptions, tutor quota records and admin logs. It refuses to overwrite an existing destination database. If you already started this new folder, extract another fresh copy, install and import there before its first start.

**If the old backend uses MongoDB:** retain the same MongoDB URI/database from the configuration import. Existing accounts and subscription/admin records stay there. No `import-local` command is required. The new learning-state collection is created when needed.

## 4. Start one application

Stop the three old running apps, then use:

```powershell
npm run dev
```

Open http://localhost:5000. Sign in using your existing accounts. The fresh test credentials in README apply only to a new local database.

## 5. Bring across browser-only learner progress

The old Student app saved learning progress under browser storage keys such as `cw.progress`. Those records were not in the uploaded backend database. Browser storage belongs to its old address (for example localhost:5001 or the old Student website), so the new address cannot read it automatically.

For each learner who needs their old progress:

1. Open the old Student app in the same browser/profile used for learning. Confirm the displayed progress belongs to that learner. The old app used unscoped storage, so progress on a shared computer cannot be attributed automatically.
2. Open `scripts/export-old-progress.js` from this new project in a text editor. Copy its complete contents.
3. In the old Student tab, press `F12`, open **Console**, and paste/run the script. Enter the email belonging to the displayed progress when prompted. It downloads `ChemWiz-Old-Learning-Backup.json`; it does not export the login token or provider key.
4. Open the combined ChemWiz, sign in as that same learner, open **Profile → Import learning data**, and choose the downloaded file.
5. Confirm the replacement of that account's learning data and wait for the saved confirmation. Open a second browser to check restoration if needed.

If Chromium's Console blocks pasted code, type the reviewed script manually or follow its displayed paste instruction after reading the script. Only learning data is exported. Keep the downloaded backup private.

The new Profile also offers **Download learning backup** for later personal backups. Import checks the email and validates data on the server. It replaces that account's learning state after confirmation; export a current backup first if that account already has valuable new progress.

## Recovery

The old folders remain untouched. Configuration imports create a private `.env.backup-*` file alongside the new `.env`. Database import never modifies its source file and never merges into an existing destination. To return to the old apps, stop the new server and restart the old folders.
