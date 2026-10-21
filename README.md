## Reviewed lesson images — v1.9.0

Adds a lazy, collapsible Media library for bounded PNG/JPEG uploads, captions/alternative text, independent rights/image review, exact-version lesson attachments and authenticated learner illustrations. Images join the 90-day recycle bin with saved-version reference holds.

Start with [MANAGED_IMAGES_README.md](MANAGED_IMAGES_README.md) for patch application, verification, storage limits and rollback. Native Android and Windows packages remain later roadmap work.

## CMS1b publishing update — v1.8.0

Reviewed text publication, JSON draft import, saved versions/restoration, withdrawal and learner source credits are available. See [CMS_PUBLISHING_README.md](CMS_PUBLISHING_README.md) for installation, exact deployment commands and scope. All existing features and private configuration remain in place.

# ChemWiz unified v1.7.0

One Node/Vite application at one address, with learner/admin workspaces and one backend.

This release adds an admin account/material recycle bin with a minimum 90-day retention period, explicit permanent purge and restoration, plus a searchable content inventory and material/provenance draft management. Read **RECYCLE_CONTENT_README.md** for the exact scope and installation/test commands. The lazy users table, school membership lookup, PWA1a and existing chemistry/Wiz/voice/privacy controls remain. **PWA_ADMIN_README.md**, **W3_README.md**, **LUNA_MEDIUM_README.md** and **PRIVACY_SCHOOLS_README.md** describe the earlier foundations.

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
npm start
```

Use Node 24 LTS. Local URL: http://localhost:5000 ; learners: /student/ ; admin: /admin/ ; policies: /legal/privacy. Normal development: npm run dev.

Preserve private configuration, existing MongoDB records and the production JWT secret. Publish reviewed operator details in Admin before learner activation. Existing learners complete a one-time account setup; child accounts require verified guardian authorisation. Real legal, school, provider/transfer, staging and operational acceptance remains separate from synthetic local verification.

Render Build: npm ci --include=dev && npm run build ; Start: npm start ; readiness: /api/ready. Commit the exact passing source and verification/release-evidence.json together. No live deployment or live database write is performed by the build/test workflow.
