# ChemWiz v1.5.3 — W3a browser readiness

Prepared 18 October 2026. Supported source baseline: unchanged v1.5.2 with the working Luna medium support.

## What changes

- A temporary connection failure, 503 or unreadable response no longer erases a saved learner login. Retry saved session revalidates it with the server before opening the workspace. A real 401/403 still removes the unusable token; account learning caches remain intact.
- Browser offline feedback appears in login and the learner workspace. Existing account-scoped pending changes retry on reconnect. This is connection recovery; it does not create an installable offline app or bypass authentication/entitlements.
- Ordinary learner API requests time out after 20 seconds. Wiz text keeps 150 seconds for its existing moderation/generation stages; voice-note transcription and call setup allow 90 seconds. This transport never automatically replays a request.
- Failed lesson/search chunks offer explicit retry and Reload app. Reload first flushes learning changes and pauses with an explanation if they cannot be saved. A fresh page can then retrieve the current deployment's files.
- Login has a main landmark; search announces results/empty states and describes keyboard controls. Search stops repeatedly refocusing the input as results change. The learner UI honours reduced-motion preferences. Existing skip links, modal containment, diagram alternatives and reading sizes remain.
- Integration preflight enforces production payload ceilings and verifies that all 24 topic modules and the search index remain outside the initial learner JavaScript graph. It measures generated files using Vite's manifest.
- Local acceptance now runs the W3 recovery/keyboard/touch-emulation checks in Chromium and actual Firefox. Unavailable requested browsers fail. Existing content, account, privacy, school and API checks remain required.

No backend route changed. All existing frontend API probes remain applicable. The AI service/model selection, voice implementation, private configuration, MongoDB settings, JWT secret, accounts, progress, school/privacy controls and Premium activation are retained.

## Apply and verify

Stop the app and keep the working release as rollback. Extract the patch outside the existing app folder. In the extracted patch folder, substitute your real path:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

The same commands accept absolute Linux/macOS paths. The installer validates the complete baseline and payload before writing, accepts CRLF, backs up replacements and blocks conflicting source or symlink destinations. Keep it and its manifest outside the app folder. Private environment files and records are preserved.

Inside the updated application folder, use Node 24 LTS and run each command separately; stop on failure:

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
```

On Linux, Playwright documents `npx playwright install --with-deps chromium firefox` for browser/OS dependencies. Local acceptance requires a Chromium-family browser plus Firefox. Existing `CHEMWIZ_TEST_BROWSER_PATH` and `CHEMWIZ_TEST_BROWSER_ARGS` select an installed Chromium executable and launch arguments; they cannot waive Firefox or another required check.

`test:local` runs Firefox automatically. After passing integration preflight, optional focused commands are:

```powershell
npm run check:performance
npm run test:w3
npm run test:w3 -- --browsers=chrome,msedge
```

The default focused run requests Chromium and Firefox. The last command requires actual installed Chrome and Edge and uses their respective Playwright channels. It never substitutes Chromium for either product. The report identifies requested browsers and versions in `verification/w3-browser-matrix.json`; each focused run replaces that report. Release evidence retains its own captured Firefox results.

Keep your working `AI_MODEL` and private settings. Start with the existing `npm run dev` or production `npm start`. Render retains Build `npm ci --include=dev && npm run build` and Start `npm start`. Include the exact checked `verification/release-evidence.json` with source. Do not point fixture acceptance at production records.

## Evidence and remaining acceptance

`verification/release-evidence.json` records version/source, advisories, API probes, compiled fingerprint, payload measurements, regressions, the primary browser and Firefox. Source changes invalidate it. Machine-local screenshots use synthetic accounts. The patch README states the checks actually completed for this delivery.

Payload budgets are regression ceilings derived from v1.5.2, not real-device speed claims. Gzip sizes are comparable estimates; the host must negotiate compression to obtain those transfer sizes. Existing artwork and the deferred search index remain significant payloads. Real Core Web Vitals and constrained-network/low-end device timings remain to be measured.

| Roadmap item | Status |
| --- | --- |
| W3a recovery, semantics, reduced motion and payload gates | Implemented; exact results in delivered evidence |
| Chromium + Firefox local W3 checks | Required by release gate |
| Branded Chrome / Edge | Runner supplied; separate product acceptance required unless recorded |
| Physical Android and Windows devices | Pending; viewport/touch emulation is not device evidence |
| Real screen reader, zoom/high contrast and full accessibility review | Pending; semantic checks do not certify accessibility |
| G0 staging Atlas, school/guardian operations, backup/restore | Pending private staging/operational evidence |
| RIGHTS0 inventory / CMS1a source model | Retained next content track; no bulk import or rights approval in this patch |
| PWA1 / OFF0 | Next platform implementation after W3 acceptance; no service worker added here |
| Android APK/AAB and Windows EXE/MSI | Required later platform deliverables retained |

## Rollback

Stop the app and follow `patch-backups/w3-v1.5.3-<timestamp>/ROLLBACK.txt`. Restore backed-up files to matching paths and remove only the files it lists as newly added. Run `npm ci --include=dev` and the original release's check sequence. Restore that release's original checked evidence from your retained copy. Keep the database and private configuration intact.

## Verified delivery — 18 October 2026

Integration passed with 41 actual frontend API probes, 45 route checks and 8 security/data-control groups. All 143 automated tests, 56 Chromium 138.0.7204.0 browser checks and 12 Firefox 153.0 W3 checks passed, with no skipped tests. The primary browser included the six existing viewport checks and all 218 diagrams with zero measured text clipping. Dependency audit reported zero vulnerabilities. The deployment gate passed for the exact source.

Both engines exercised isolated synthetic records and controlled connection failures. Firefox's content-process sandbox was disabled only for this restricted Linux container; browser web security remained enabled. Physical devices, real assistive technology and live providers were not verified. See the included release evidence for fingerprints and measurements.
