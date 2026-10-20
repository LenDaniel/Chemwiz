# ChemWiz v1.7.0 — account/material recycle bin and content-source foundation

Prepared 19 October 2026. Supported source baseline: unchanged v1.6.0, source fingerprint `89373dc71df3475c6b144407ec01ddea02a50f05d0caff7ad4d3790ed7a48c24`.

## Delete an account

Open Admin → Users & Subscriptions. An active account must first be suspended or set to inactive (the existing `disabled` status). Delete account is available for suspended/inactive non-admin accounts. Platform administrators, including the current administrator, are protected; staff handover is a separate operation.

Click Delete account, give a reason and type the exact account email. The account leaves the normal users list and statistics, its sessions and password-reset capability are revoked, and school memberships are revoked with their reserved seats released. The account, password hash and linked application records stay recoverable in the recycle bin. School membership lookup excludes recycled accounts.

In Admin → Recycle bin, search/filter entries, inspect the deletion and permanent-deletion eligibility dates, restore an item or refresh the list. The panel starts collapsed and loads on demand.

- Ordinary admin deletion has a server-enforced minimum retention of **90 full days**. The browser cannot shorten it or supply its own clock. A damaged/missing retention date fails closed.
- Nothing is automatically purged at day 90. The entry remains until an administrator explicitly restores or permanently deletes it.
- Restore returns an account to its previous suspended/inactive status. Reactivation is a separate account-status action. Old sessions stay revoked; school roles require reassignment and fresh member confirmation.
- Delete forever becomes available after the retention period. It requires the exact email or material title again. It removes the account and linked learning/privacy records, or the saved draft and its provenance. Associated account/material audit details are redacted; a minimal operational deletion event remains. The application offers no recovery after purge.
- A guardian dependency for another learner can hold account purge for a retention review. Existing privacy-erasure approvals cannot be reversed through the bin.

The existing verified privacy-request/erasure procedure remains separate. Its reviewed erasure may remove a recycled account before the ordinary 90-day bin window; this build does not turn the admin bin into a blanket delay on that existing procedure. Review notices and actual retention operations before live use.

Permanent deletion covers the active application data. External backups, downloaded exports, mailboxes and provider records follow the operator's existing retention/erasure procedure; this feature cannot remotely erase those copies. Do not restore an old data backup without applying the recorded erasure procedure again.

## New content/source foundation — RIGHTS0 and CMS1a

Admin → Content & Sources starts collapsed and loads on demand. It offers a searchable inventory of **497** current entries: 24 topic source modules, 255 chapters and 218 diagrams. Stable identifiers, source paths and SHA-256 hashes identify the version reviewed. Inventory generation gives no permission or originality approval; existing entries start **unreviewed**.

Create an original material draft or record a sourced draft with creator/rights holder, license or ownership description, source/license links, attribution, evidence reference, optional permission expiry and commercial/offline/platform scope. An inventory item can be linked to a draft. Draft text is plain text, with a 20,000-character limit; over-limit saves are rejected rather than silently shortened.

Draft, awaiting-review and operator-cleared states are available. Clearance requires a fresh explicit confirmation plus evidence reference, attribution and commercial/platform scope. It records the operator's review, not a grant of legal rights. A review hash binds the text and provenance. Changed content, an expired permission, a mismatched inventory hash or unsupported offline/platform scope fails the eligibility check. A non-expiring ownership/license basis must be supported by the evidence reference when expiry is left blank.

Optimistic revision checks reject stale edits and preserve unsaved text in the editor. Use Refresh list and Edit draft to open the newer server copy. This build supplies the inventory/draft/source model; full publishing, uploads, public credits and version-history/rollback remain CMS1b/RIGHTS1 work. Existing course notes remain code-managed. No unreviewed material is added to learner downloads, and the existing PWA worker still caches only its five public recovery files.

Delete draft moves its text and provenance to the same 90-day bin. Restore always returns it as a draft for fresh review. Permanent purge removes the saved material; an old editor cannot recreate it through the update endpoint. This bin currently covers accounts and these saved material drafts. Further content/media types can use the same retention policy when their management features are built.

## Install and test

Keep the working v1.6.0 source as rollback. Stop the app. Extract this ZIP outside the existing app folder, then run from the extracted patch folder, substituting the real path:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

The installer verifies the full baseline and payload before writing, accepts CRLF, refuses conflicts/symlink paths, and backs up replaced source. It does not modify a database, environment settings or account records.

Inside the updated app folder, use Node 24 LTS and run separately; stop on failure:

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

On Linux, Playwright documents `npx playwright install --with-deps chromium firefox` for operating-system dependencies. For Windows Firefox's `msvcp140_1.dll` error, install or repair Microsoft's official x64 Visual C++ runtime: https://aka.ms/vc14/vc_redist.x64.exe . Restart the terminal and repeat acceptance.

`npm run inventory:check` checks the inventory against current source. If chemistry source deliberately changes, run `npm run inventory:generate`, review the metadata/hash changes, then repeat all gates. Stale inventory blocks compilation. The PWA/public cache policy and existing payload ceilings remain enforced.

Render Build remains `npm ci --include=dev && npm run build`; Start remains `npm start`. Keep exact passing source and verification/release-evidence.json together. MongoDB admin mutations require transactions (for example, an Atlas replica set). They fail closed when transactions are unavailable. Local JSON mutations use one atomic file replacement. No database migration/reset, new dependency, model setting or private configuration change is required.

Automated tests use isolated local records, synthetic adult accounts and drafts, captured email transport and a refusal guard for live database connections. Retention dates are advanced only within those disposable fixtures. There is no HTTP clock/aging override in the application. Exact results and environment conditions are in the delivered verification report. Live MongoDB transaction acceptance, native/device/assistive-technology checks, actual rights clearance and production operations remain separate.

## School testing and retained roadmap

S1 memberships can be tested in local/staging using normal adult accounts and a labelled synthetic school. Assign school roles in Admin and confirm membership in each account's Profile. Separate school signup, complete classes, assignments, gradebook and school billing remain later builds. PWA lesson packs, Android APK/AAB and the Windows EXE/MSI remain required roadmap work; this release advances the rights/content foundation needed before expanding distribution.

## Rollback

Before rolling back a populated deployment, resolve its recycled accounts and draft records using v1.7.0 and keep an appropriate private data backup. Earlier code does not understand the new recycle-bin policy. Do not reactivate a still-recycled account using an older admin UI. Source rollback is not a data migration and never recovers records already permanently purged.

For source rollback, clear offline recovery files from Profile in each test browser, close the app, and follow `patch-backups/recycle-content-v1.7.0-<timestamp>/ROLLBACK.txt`. Restore replaced files and remove only its listed new source files. Preserve private configuration and records. Reinstall dependencies and repeat the original release's checks before using it.
