# ChemWiz standing build rules

## Preserve what works

Keep existing functionality and saved accounts/progress. Retain the working source/commit as rollback. Patches must stay within the requested scope. MongoDB configuration and the stable JWT secret survive application updates.

## Patch delivery

Each build is delivered as a patch ZIP with README, changed-file list, baseline version and necessary tools/configuration. Include exact commands. Keep private environment files, credentials, records, node_modules and machine-specific state out of the ZIP. Include compiled web assets when the frontend change requires them, or provide the exact rebuild command.

## Required check order

```bash
npm ci --include=dev
npm run check:integration
npm run test:local
npm run ready:deploy
```

The integration check discovers frontend request call sites and backend routes, validates imports/syntax, verifies middleware protection and executes the real frontend API functions through an isolated local server. It also checks the defined security controls and dependency advisories. Missing/ambiguous wiring and failed or unavailable required checks cannot receive PASS.

Local checks use the preflight's compiled app, run the regression/content checks and test the production frontend in a browser. The deployment result is tied to a fingerprint of the exact source and dependency lockfile. Editing those files invalidates the result and requires the check sequence again.

Render's build lifecycle checks the recorded release evidence before compiling. Other live deployment paths must run `npm run ready:deploy`. Keep release evidence with the source when publishing a checked release.

Real Atlas/provider/audio/device behaviour requires the relevant private environment or device acceptance. Offline/local fixtures prove API wiring and the covered access/data controls; they do not prove a live external service works. The tool checks declared security controls and known dependency advisories, rather than certifying the absence of all vulnerabilities.
