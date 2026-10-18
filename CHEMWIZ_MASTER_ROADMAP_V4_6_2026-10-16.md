# ChemWiz Master Build Roadmap v4.6

Updated: 16 October 2026 · Release: v1.5.0 — S1 privacy and school onboarding

This is the current execution plan. v4.5 records the verified v1.4.0 account recovery baseline; v3.1 and the older three-project instructions are historical. Completed work is retained. New privacy/minor/school work is inserted before the remaining browser/PWA/platform sequence.

## Current application

One Node/Express listener serves the Vite home, learner and administrator workspaces and the backend. Paths remain `/`, `/student/`, `/admin/` and `/api/*`; public policies are added at `/legal/*`. Local testing uses guarded JSON data; production uses the existing selected MongoDB database. Preserve accounts, IDs, password hashes, subscriptions, progress, private settings and the production JWT secret.

The 24 topic modules, 255 chapters, 218 spec diagrams, chemistry assessments/tools, universal search, contextual Wiz text/voice features, section-selectable device read-aloud, account-scoped saves/conflict handling and ribbon logout remain. Manual individual Premium activation remains; school membership adds a separately scoped access path.

The owner confirmed successful production admin login on 16 October after deliberately creating the missing MongoDB administrator. The reported 401 is resolved. Local demo credentials were not MongoDB accounts. Do not recreate/reset the administrator during S1 installation.

## Retained workstreams

| Track | Status and next work |
| --- | --- |
| Student foundation/content | Working; retained. Continue chemistry/accessibility review where outstanding. |
| Backend/auth/profile/admin | Unified and working; retained. S1 adds privacy/school controls without changing account ownership. |
| Learning progress | Backend saves and account isolation retained; broader device/live acceptance remains. |
| K cleanup/K4/search | Reviewed diagram/content fixes and lazy loading retained. Do not restart completed refactors. |
| K-AI1–K-AI4 | Contextual text, voice notes, read-aloud and live voice retained. Actual provider/device acceptance and server-side persistent session supervision remain. |
| U1/U1.1 | One application, one address, separate workspaces, backend persistence and logout retained. |
| W2 | Responsive diagram/text, keyboard/dialog and admin-session work retained; live/device acceptance remains as documented. |
| Render recovery v1.3.1 | Completed source/deployment recovery retained. |
| Account security v1.4.0 | Password reset/changed emails, one-hour reset credentials, strong-password upgrades, visibility controls, footer/support and admin diagnostics retained. |
| S1 v1.5.0 | Privacy and school onboarding implementation described below; exact local verification evidence accompanies the release. |
| W3 | Next after S1 staging/operational acceptance: broader Chrome/Edge/Firefox coverage, performance, loading/error/empty states and network-failure behaviour. |
| PWA1 | Follows W3. |
| Android/Windows | Follow the retained shared-frontend Capacitor/PWA/desktop sequence. |
| Payments | Manual activation retained; provider integration, school billing and financial reporting remain separate future work. |

## S1 implementation

- Seven public, themed legal pages and pre-login policy links; operator details require deliberate publication by a platform administrator.
- Explicit current-version age/terms/privacy onboarding for new and existing learners. Old learning records and identities are retained.
- Ages 13–17 require verified written guardian authority before a child-email-bound, limited single-use enrolment invitation is issued. Guardian withdrawal and adulthood review are enforced. Under-13 accounts are unsupported. Adult age is declared; independent age assurance is not supplied by a checkbox.
- AI and audio have separate choices and backend checks. Child AI also requires the operator’s provider/safety review and guardian permissions. Ordinary signup choices start off.
- School contract/DPA references, seats, status/expiry, separate member roles, member confirmation, named-school guardian permission, class-scoped teacher reports and limited progress exports. Revocation/expiry removes school access and school-derived plan entitlement.
- Scoped account/learning exports, consent event history, privacy requests, immediate core/optional withdrawal handling, reviewed learner deletion and deliberate retention maintenance.
- Navy/cyan EmailJS security templates are included. Automated password emails remain supported; guardian invitations in S1 are privately shared after manual authority verification.
- Draft guardian authorisation, school subscription and DPA schedules support the operator’s legal review and signed procedures.

S1 does not itself obtain legal review, regulatory licences/authorisations, provider retention eligibility, signed contracts, real guardian proof or a school’s notices. Those are operating requirements. School billing, bulk/class/assessment administration, historical school analytics, self-service guardian verification/email flows and full provider-backed age assurance remain future expansions.

## Required release workflow

Preserve the working release as rollback. Apply the patch only to its documented baseline or use the full source in a fresh folder. Keep private settings and records out of Git/ZIPs.

```powershell
npm ci --include=dev
npx playwright install chromium
npm run check:integration
npm run test:local
npm run ready:deploy
npm run diagnose:release
npm start
```

Every frontend API function needs a matching backend method/path, middleware mapping and real executable connection probe. The tool covers defined integrity/security controls and known dependency advisories. An unavailable/failed mandatory check blocks PASS. The exact source/lockfile fingerprint ties the passing evidence to the deployed release.

Local acceptance retains content, W2 and account recovery checks and adds S1 backend/browser checks for legal pages, preserved legacy data, choices, requests/exports, school access and guardian enrolment/withdrawal. The release gate requires all three browser evidence groups. Commit the exact checked source and `verification/release-evidence.json` together for Render. Never manufacture or reuse stale evidence.

## Next execution order

1. Apply and locally verify v1.5.0 against v1.4.0; use a separate staging service/database before live changes.
2. In Admin publish the actual reviewed operator, privacy contact, overseas/provider retention and backup details. Existing learners then complete their own onboarding. Do not bulk-invent consent on their behalf.
3. Complete guardian authority/written-consent procedures, proportionate age assurance and child DPIA; confirm POTRAZ position, provider/transfer requirements, school agreements and school notices before a school/minor pilot.
4. Exercise actual staging MongoDB paths/transactions, cross-account/school behaviour, real mailbox delivery, phone/browser audio and operational backup/retention/incident procedures. Local fixtures do not establish live-service or legal verification.
5. Return to W3, then PWA1, Android/Capacitor and Windows. Retain payments, chemistry QA, persistent AI supervision and school/guardian expansion in their original workstreams.

See `PRIVACY_SCHOOLS_README.md` for exact install, setup, test, maintenance and deployment instructions. No live publication, account modification or live database write is performed by the build workflow.
