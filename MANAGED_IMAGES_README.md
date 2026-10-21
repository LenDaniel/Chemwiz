# ChemWiz v1.9.0 — reviewed lesson illustrations

Baseline: exact v1.8.0, 289 source files, fingerprint `258de9da7c924219aaafd33c7dd430c9b113d314093b1ccf4d8c27549995c8c1`. Keep the working release and a data backup. Accounts, progress, subscriptions, school/privacy controls, browser installation, JWT settings and the working Wiz model/voice configuration are preserved. `server.js` is unchanged.

## Apply and verify

Stop ChemWiz. Extract this patch outside the application folder. In the extracted patch folder, replace the example path with your actual unified application folder:

```powershell
node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
node apply-patch.cjs "C:\path\to\chemwiz-unified"
```

The installer checks the complete baseline and payload hashes, backs up changed source and stops on conflicts. Inside the updated application, with Node 24, run each command separately and stop on failure:

```powershell
npm ci --include=dev
npx playwright install chromium firefox
npm run check:integration
npm run test:local
npm run ready:deploy
npm start
```

Windows Firefox still needs the x64 Visual C++ runtime if `msvcp140_1.dll` is missing: https://aka.ms/vc14/vc_redist.x64.exe . Browser or operating-system dependencies must be available for acceptance to pass.

Render Build remains `npm ci --include=dev && npm run build`; Start remains `npm start`. Commit the exact checked source and both `verification` reports together. Any source or dependency change requires repeating preflight and local acceptance. Retain your host environment variables and existing database; no secret changes or live data migration are part of this patch.

## Upload, review and attach

1. Admin → Media library. The panel starts collapsed and loads its controls and metadata only when opened. Upload a PNG or JPEG; it starts as a private draft. Use Review image → View illustration to inspect the stored result.
2. Record a title, descriptive alternative text, caption, creator, license/ownership description, source links where applicable, attribution and permission evidence reference. Set commercial/platform scope and any expiry. Select Cleared and confirm both rights and image/chemistry/accessibility review. Rights fields record your review; they do not grant permission.
3. Admin → Content & Sources → create/edit a lesson. Choose or refresh lesson images, select the reviewed images, complete the lesson rights review and save. Up to six images, totalling at most 4 MiB, may be attached. Attachments appear after the lesson text, in the order selected.
4. Preview & publish shows the saved lesson and its current images. View the illustrations, confirm the chemistry review and publish with the existing note and title confirmation. An image that changed after saving blocks publication until the draft is saved and reviewed again.
5. Learner → Published lessons. Alternative text, captions, sizes and credits appear immediately; View illustration loads the binary only when requested. Image failures have Retry illustration and preserve sign-in. Listen to lesson includes image alternatives/captions. Credits & sources includes each image's credit.

An illustration requires the same current authentication, privacy/guardian and Premium/school entitlement as its parent lesson. A media ID or copied endpoint does not grant access. Draft previews are admin-only. Learner responses omit private permission evidence, staff IDs, review hashes, file hashes and encoded file bytes.

## Formats and storage

Accepted uploads: PNG and JPEG only, at most 2 MiB input and normalized output, two million pixels total and 4,096 pixels per side. PNG must be non-interlaced and non-animated. The server checks signatures, framing, dimensions, PNG CRCs and decompression size, then decodes and re-encodes pixels with pinned pure JavaScript decoders (`pngjs` 7.0.0 and `jpeg-js` 0.4.4). JPEG EXIF orientation is applied. Embedded metadata/comments are removed. Re-encoding may change compression, colour appearance or transparency representation; inspect the stored result before clearance. This is bounded image normalization, not a malware scanning service.

Platform media storage is bounded to 32 MiB of normalized bytes and 200 images, including recycled files. Base64 database storage uses approximately one third more space plus metadata; database backups add their own storage. The quota is deliberately small for this first binary-media slice. There is no automatic purge. A shared transaction head serializes quota allocation and new lesson references; files are immutable under each media ID. Upload a new image to replace its pixels.

Normalized bytes are held in private local JSON or MongoDB governance records, separately from metadata. Lists do not query binary records. No publicly served upload folder, external image fetch, signed public URL or CDN is added. Authenticated binary reads verify the stored SHA-256 and length, and send image MIME, `nosniff` and `Cache-Control: no-store`. Blob URLs are revoked when their view changes or closes. The PWA public recovery cache continues to exclude API responses and managed lessons/images; recording offline rights does not enable offline download.

## Review changes, recycling and deletion

Every image metadata save starts a new review generation, even when the title/caption is unchanged. Previously published lessons bind the exact saved generation. Updating rights, caption, alternative text, expiry or status, or recycling an image makes those publications unavailable on subsequent server checks. Re-save and review the affected lessons, then explicitly publish again. Text-only v1.8.0 publication reviews remain valid.

Open learner readers check every minute, on return/focus, on Refresh lessons and when requesting an image. A permission expiry timer also includes image expiry. This cannot retract an illustration already viewed, copied or captured on another device.

Delete image requires a reason and exact title. It retains bytes/metadata in the recycle bin for at least 90 days, counts against quota and hides linked publications. Restore returns an uncleared draft with a new generation. It never revives old published links automatically.

Delete forever is available only after 90 days AND after every referring material and its saved versions have been permanently deleted. Removing an attachment from the latest draft still leaves older immutable versions holding a reference. The bin explains this hold and the backend independently enforces it. An eligible, unreferenced purge removes the stored bytes and metadata together, redacts detailed image audit records and keeps a minimal deletion event. External backups/exports follow their separate retention procedure.

Local mutations use one atomic JSON-store commit. MongoDB mutations use the existing snapshot/majority transaction adapter and revision conditions; unsupported transactions fail closed. Local fixture tests do not establish staging Atlas transaction or load behaviour. Multi-instance rate limiting still requires the previously documented shared limiter store.

## Scope and rollback

This extends the shared CMS used by the working browser-installed app. It does not build native Android APK/AAB or Windows EXE/MSI packages. PDF, SVG/HTML, audio/video and 3D uploads, external URL ingestion, bulk imports, image replacement and offline lesson packs remain later work. The existing built-in topics/diagrams and their source inventory are unchanged.

For source rollback, stop ChemWiz, back up current data, and restore the exact v1.8.0 source using the installer backup. If images/attachments were created in v1.9.0, keep their data backup and avoid editing or permanently purging those materials with older code: v1.8.0 does not understand image generations or reference holds. Prefer restoring a consistent pre-update data snapshot in a maintenance window, accounting for any later account/progress changes. Never overwrite the live database with a test fixture. Source rollback cannot recreate purged bytes.

See FINAL_VERIFICATION.md in the patch for measured results. Real provider/audio, staging Atlas, native packages and physical-device acceptance remain separate from the local synthetic checks.
