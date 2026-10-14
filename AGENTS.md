# Standing ChemWiz build rules

These rules were explicitly requested by the user on 14 October 2026.

1. Preserve what works: retain existing features, accounts, settings, saved records and the unified application. Keep the working release as rollback. Make only the changes required by the task.
2. Deliver a ZIP containing patched files, README with exact application/install/test commands, and any other files required to apply and verify the patch. Identify the baseline version and changed files. Exclude real environment settings, credentials, user data, node_modules and machine-specific state.
3. After completing the patch, run `npm run check:integration` before local acceptance testing. Every frontend API call must map to a backend method/path, pass through the expected transport/routing/middleware, and have an executable connection probe. Check syntax/import integrity and the defined security controls. Unresolved wiring, failed checks and high/critical security findings block a pass.
4. After preflight passes, run `npm run test:local`, perform any required feature/device acceptance, and run `npm run ready:deploy`. Deploy live only after the local checks pass for the exact source being deployed. Changed source invalidates the previous result. Never report skipped, unavailable, mocked or untested checks as live-service verification.
5. New or changed APIs require updates to the integration contracts/probes. Preserve one-command local launch, separate learner/admin access and existing MongoDB settings. Do not reset records or change secrets as part of a routine patch.

See BUILD_RULES.md and INTEGRATION_CHECKS.md for the workflow and coverage limits. These rules do not authorise sending messages, publishing unrequested changes, or modifying live records during automated tests.
