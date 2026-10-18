# ChemWiz unified v1.5.3

One Node/Vite application at one address, with learner/admin workspaces and one backend.

This release adds W3a browser recovery, keyboard feedback and payload gates on v1.5.2. Read **W3_README.md** for the current scope, Chromium/Firefox checks and remaining device/operational acceptance. The working Luna medium support is retained; see **LUNA_MEDIUM_README.md** for the optional provider trial. S1 school/privacy guidance remains in **PRIVACY_SCHOOLS_README.md**. The supplied master build roadmap v4.7 extends the included v4.6 roadmap; W3a does not close its staging, rights or device gates.

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
