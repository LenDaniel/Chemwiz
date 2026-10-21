# ChemWiz v1.8.0 — CMS1b reviewed text publication

Baseline: exact v1.7.0 (`91184343229fe47d6e837b040e9470eef94dbd3ea58b322932260bf93805c040`, 282 source files). Keep that working release and a data backup as rollback. This patch preserves existing accounts, saved progress, subscriptions, school/privacy controls, private settings and Wiz text/voice configuration. No live database is changed by applying source files.

## Apply and run

Stop the application. Extract the patch ZIP outside the application folder. From the extracted patch directory, substitute the actual application path:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

The installer validates the complete baseline, checks payload hashes and backs up changed source. Conflicts stop installation. Do not force it over unrelated edits or use an older source folder. The root `server.js` is unchanged in this release.

Inside the updated application, use Node 24 LTS. Run each command separately; stop at the first failure:

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

Windows Firefox requires Microsoft's x64 Visual C++ runtime if `msvcp140_1.dll` is missing: https://aka.ms/vc14/vc_redist.x64.exe . On Linux install the documented Playwright OS/browser dependencies. A missing required browser blocks acceptance.

Render Build remains `npm ci --include=dev && npm run build`; Start remains `npm start`. Push the checked source, `verification/release-evidence.json` and `verification/w3-browser-matrix.json` together. Source or dependency changes require the gate sequence again. A different `server.js` invalidates evidence even when the application version is unchanged. Private configuration belongs in host environment settings. No gate bypass is added.

## Prepare, review and publish

1. Admin → Content & Sources → create/edit a material draft. Select a syllabus topic and either all signed-in learners or Premium/authorised school access. Text remains plain text, up to 20,000 characters; markup is displayed literally.
2. Record creator, ownership/license description, source/license links as applicable, attribution, permission evidence, expiry and platform/commercial/offline scope. Select Cleared and explicitly confirm your rights review. This records an operator decision; it does not supply permission or legal clearance.
3. Save. Open Preview & publish on the saved material. Preview phone/desktop and light/dark. The preview is loaded from the saved revision, not unsaved editor text.
4. Confirm chemistry accuracy, syllabus alignment and source attribution. Choose Publish reviewed material; enter an editorial note and the exact title. Current rights clearance covering commercial web use is mandatory. Concurrent/stale writes return a conflict.
5. Learner → Home → Published lessons, or a topic's Published lessons action. Search/filter lessons, read the published snapshot, view source credits and use the existing device read-aloud controls or contextual Wiz access subject to existing entitlements/AI consent.

Free access here means signed-in learners who satisfy the existing age/privacy/guardian rules. Premium material is filtered on the server using current independent or approved school entitlement; knowing a material ID never grants access. Public responses exclude permission evidence references, staff IDs, review hashes and draft/history text.

## Import authored material JSON

The file chooser accepts a JSON file up to 128 KiB. It sends parsed JSON to the authenticated, rate-limited import route. The server validates shape/size/fields and applies the same text, link, rights and syllabus validation used by the editor. Invalid files leave the current editor intact. Imports always become drafts and do not retain clearance or publication.

Example format (replace the example content and add appropriate rights fields in the editor):

```json
{
  "schemaVersion": 1,
  "material": {
    "title": "Atomic number: original lesson draft",
    "body": "The atomic number is the number of protons in a nucleus.",
    "creator": "Your author or rights holder",
    "licenseName": "Describe the actual ownership or permission",
    "topicId": "atomic",
    "audience": "free"
  }
}
```

Additional accepted material fields: `sourceURL`, `licenseURL`, `attribution`, `permissionReference`, `validUntil` (`YYYY-MM-DD`), `assetId`, `commercialUseAllowed`, `offlineRedistributionAllowed`, `platforms` (`web`, `android`, `windows`) and `status` (always reset to draft on import). Unknown fields are rejected. Images, PDFs, SVG/HTML uploads, external URL ingestion, OCR and 3D assets are not supported by this text-import slice.

## Versions, withdrawal and recycling

Each save creates an immutable version snapshot; publish, withdrawal and restoration add new versions/events. Existing v1.7.0 materials get a snapshot of their current state when next changed; earlier unsaved history cannot be reconstructed. Added topic/access review fields mean legacy cleared drafts need a fresh review before publication.

Editing a published material changes only its draft. Its prior reviewed snapshot remains live until another reviewed version is published, it expires or an administrator withdraws it. A rights withdrawal must use Withdraw publication rather than merely editing draft metadata. Permission expiry and changed linked inventory hashes automatically exclude the corresponding publication on future API reads.

Saved version history lets an administrator restore an earlier version **as a new draft** with a note and exact-title confirmation. Clearance is removed; review and publication are separate actions. Restoring a version preserves the current publication until it is explicitly replaced or withdrawn. History is private to platform administrators, with bounded page sizes and integrity checks.

Withdraw publication removes the material from subsequent learner lists, details and source credits. The learner library refreshes every minute and on focus/return, and provides Refresh lessons. Connection failures hide the managed material until a successful online check. It does not claim to erase text already viewed, copied or captured by another device.

Deleting a material immediately withdraws it and moves the draft/history into the existing minimum-90-day recycle-bin protection. Restore keeps it unpublished and resets clearance. Explicit permanent purge after eligibility removes the material and all version snapshots, with audit detail redaction. No automatic purge is added. External backups and exports follow their separate retention procedures.

Local material/version/audit mutations commit in one atomic JSON-store operation. MongoDB uses the existing session/transaction adapter with revision conditions, snapshot reads and majority writes; a deployment without transaction support fails closed. Real staging Atlas acceptance remains separate from local fixture tests.

## Scope and rollback

This is the reviewed text-publication part of CMS1b. It adds no lesson packs, binary media storage/CDN, native Android/Windows installer, classroom/assignment engine or live provider changes. The 24 built-in topics, 255 chapters and 218 diagrams remain code-managed; their inventory still starts unreviewed. Credits & Sources covers only currently accessible managed publications and does not assert that every built-in asset has been cleared.

New managed publications are served online with `Cache-Control: no-store`; the existing five-file public PWA recovery cache excludes all API content. Offline permission metadata does not enable a managed lesson download. APK/AAB and Windows EXE/MSI work remain on the roadmap.

Source rollback: stop the application, retain the current data backup, and restore the prior source from the installer backup/known v1.7.0 release. If v1.8.0 has created version snapshots, keep their data backup and do not use an older version to permanently purge those materials: older purge code does not know about version records. Reverting source cannot recreate permanently purged records. Account recycle/guardian/privacy erasure rules from v1.7.0 remain unchanged.

See the patch's FINAL_VERIFICATION.md for exact test results and environment limits. A green fixture suite does not establish real rights, chemistry reviewer qualifications, live database/provider behaviour, physical-device audio or legal launch acceptance.
