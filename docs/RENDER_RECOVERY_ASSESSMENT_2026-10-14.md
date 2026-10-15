# Assessment of the uploaded Chemwiz-main.zip — 14 October 2026

All 269 archive files were inventoried and compared against the previously verified releases. Public source was checked for syntax, imports, API wiring and sensitive-value leakage; private settings were inspected without copying their values into reports or deliverables. The archive was treated as the user's actual baseline. No live database or provider was contacted.

## Confirmed findings

| Finding | Evidence | Repair |
| --- | --- | --- |
| Mixed release | Root package and lockfile are v1.2.1, but release-evidence.json records v1.3.0. Many W2 frontend/backend files are already present. | Complete the approved W2 release and publish a consistent v1.3.1 package/lockfile/source/report. |
| Required files omitted | The uploaded installation check fails for .node-version, web/student/scripts/verify-content.mjs, the v4.3 roadmap and ADMIN_LOGIN_GUIDE.md. The archive also omits configuration examples, ignore rules and tests/cors.test.cjs. | Restore missing files and require source completeness during integration preflight. |
| Obsolete patch package copied into app | Root apply-patch.cjs and patch-manifest.json are extra fingerprinted code/data. Root patch readmes/reports refer to the wrong package layout. | Safely back up/remove obsolete root package files; ship new installer outside the application. |
| Original origin fix absent | backend/src/config/runtime.js still lacks Render's trusted public URL and configured URL-origin normalisation. | Restore the reviewed origin fix and all five CORS regression cases. |
| Stale compiled assets | Uploaded dist does not match the compiled fingerprint in its v1.3.0 report. | Rebuild from the repaired source; include only the newly tested dist in the complete ZIP. |
| Incomplete content cleanup | Uploaded polymers.jsx and its K4 snapshot predate the reviewed polymer chemistry corrections. The other 23 topic files match the approved release. | Restore accepted corrections and regenerate search. No new chemistry content track is introduced. |
| Private environment file included | The uploaded root .env contains configured database/provider/authentication values and data/local-db.json contains local records. Values are not reproduced. Exact credential-value matching found no copies in other public source or compiled files. | Exclude private settings from outputs, restore ignore rules and explain removal from Git tracking; preserve settings locally and in Render. |

The uploaded static scanner reports 183 parsed modules / 468 imports and no API-map errors, but the separate installation check fails. This is why v1.3.1 now runs and records that completeness check as a required preflight stage. Both the original source mismatch and the compiled-asset mismatch were reproduced without using production credentials.

## Repairs and scope

The full result retains one app, learner/admin workspaces, public learner signup, subscriptions, account-scoped progress, all chemistry topics, Wiz text/voice features, desktop/mobile logout and the W2 accessibility/session fixes already delivered. Account/storage schemas and existing credentials are not changed. The uploaded UsersPanel difference is only a missing final newline; there are no additional custom feature edits to merge.

New release diagnostics record per-file hashes alongside the aggregate fingerprint. `npm run diagnose:release` reports package/report versions and missing/extra/changed files, and Render prints the same details on rejection. Per-file metadata explains a failure; the actual integration/local/browser/dependency evidence and aggregate fingerprint still decide whether deployment is allowed. The gate remains enabled.

Only named obsolete root patch/history files are removed by the patch installer, after exact baseline verification and backup. Public history remains under docs/history. The complete ZIP contains a clean app tree; the changed-files ZIP targets this uploaded mixed baseline and refuses conflicting edits. Neither ZIP contains actual .env files, user data or installed dependencies.

## Verification

See docs/VERIFICATION.md and verification/release-evidence.json for the completed checks for this exact source. Real Render/Atlas/provider/audio acceptance remains a separate post-deployment step. The inherited six-character signup minimum and dedicated login/register throttling review remain documented medium hardening work.
