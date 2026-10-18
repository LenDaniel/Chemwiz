# ChemWiz v1.5.2 — Luna medium trial

Prepared: 18 October 2026. Supported source baselines: unchanged v1.5.0 or v1.5.1.

## Settings supplied by this patch

When `AI_MODEL=gpt-6-luna`, Wiz text generation uses the Responses API with
`reasoning: { effort: 'medium' }`, `max_output_tokens: 16384`, `store: false`
and a 60-second generation timeout. This reserves more space for reasoning and
the final answer than v1.5.1's 3,072-token budget. It remains a finite ceiling:
an unusually demanding question can still exhaust it or time out.

Other configured text models keep their existing settings. The working
GPT-4.1 mini profile remains at 3,072 tokens and a 30-second generation timeout.
Moderation, daily learner limits, refunds after provider failure, chemistry-only
instructions, guardian/privacy checks, account ownership, saved progress and
the separate live-call/voice-note settings are retained. Incomplete chemistry
answers are still rejected rather than displayed as finished answers.

The installer preserves the current private environment. Trialling Luna does
not require replacing your working `AI_MODEL` setting first.

## Install

1. Stop the app and keep your current source/private configuration as rollback.
   Extract the patch beside the app, outside `chemwiz-unified`.
2. In the extracted patch folder, use your actual application path:

   ```powershell
   node apply-patch.cjs "C:\path\to\chemwiz-unified" --check
   node apply-patch.cjs "C:\path\to\chemwiz-unified"
   ```

   The installer checks the complete supported source, accepts Windows line
   endings, backs up replaced files, and blocks unexpected edits before writing.
   It excludes private settings and records. Keep the installer and its manifest
   outside the app folder.

3. Inside `chemwiz-unified`, run each command separately and stop on failure:

   ```powershell
   npm ci --include=dev
   npx playwright install chromium
   npm run check:integration
   npm run test:local
   npm run ready:deploy
   ```

   Use Node 24 LTS. The existing browser checker also supports installed
   Chrome/Edge or `CHEMWIZ_TEST_BROWSER_PATH`. Keep the release gate enabled;
   unavailable audits or browsers are not a pass.

## Run the three-question Luna trial

First preview the trial without API calls:

```powershell
npm run test:wiz-live
```

Run the actual trial from the same application folder, using your existing
backend API key:

```powershell
npm run test:wiz-live -- --run
```

If the private settings are in a separate file:

```powershell
npm run test:wiz-live -- --run --env-file ".env.production"
```

On Render, the same `--run` command works from the service shell using its
environment settings. Never put an API key into command-line arguments or a
frontend `VITE_` variable. The command reads backend `OPENAI_API_KEY` (or the
existing `AI_API_KEY` alias), temporarily selects Luna inside its own process,
then restores that process's prior model setting. It does not write private
configuration, change the running app's model, access learner records or consume
an individual learner's daily quota.

The trial sends three original synthetic questions sequentially, checks input
and output moderation, stops after the first failure and never automatically
retries a paid generation. It prints the answers, timing and token counts and
saves a unique JSON report under `verification/luna-medium-trial-*.json`.
Raw provider error messages and credentials are excluded.

The questions cover:

| Case | Teacher review |
| --- | --- |
| Methylbenzene vs benzene | +I donation, ring electron density, hyperconjugation and intermediate stabilisation. |
| Weak-acid pH | Equilibrium expression, approximation check, pH approximately 2.87–2.88. |
| Zinc/copper cell | Anode/cathode, balanced equation, +1.10 V and Gibbs energy approximately -212 kJ mol^-1. |

`Transport: PASS` means all three answers were received and passed the automated
moderation checks. It does not certify chemistry accuracy: every report leaves
`chemistryReview: PENDING` for your review against the included rubrics.

This is a real API trial when `--run` is used. At the standard output price
checked on 18 October 2026 ($0.50 per million Luna output tokens), all three
generations reaching their token ceilings would total about $0.0246 in output
charges, plus input charges. Actual token use and billing depend on the real
responses and your API project. Automated release checks use synthetic provider
responses and do not run this live command.

## Use Luna in the learner interface after reviewing the trial

Set this single field in the private local `.env` or Render service environment:

```dotenv
AI_MODEL=gpt-6-luna
```

The backend selects medium reasoning explicitly for that model; no extra
reasoning environment variable is required. Restart the local app with
`npm start`, or use Render's Save and deploy action. For local JSON data mode,
real tutor answers also require the existing `AI_LIVE_IN_LOCAL_MODE=true`
setting. Leave the working voice settings in place.

A rollback to the confirmed working text model is:

```dotenv
AI_MODEL=gpt-4.1-mini
```

Restart after changing it. This restores the previous text profile without
changing accounts, progress or voice calls.

## Render deployment

Push the complete tested patch and `verification/release-evidence.json`
together; keep private environment files, user records and `node_modules` out
of Git. Do not copy patch installer files into the application directory.

```text
Build: npm ci --include=dev && npm run build
Start: npm start
Health: /api/ready
```

If a trial or UI question fails, retain its error code and the safe
`Wiz provider diagnostic:` block from the terminal/Render runtime logs. A
`max_output_tokens` reason means the current ceiling was reached; model access,
billing and connection failures require their own diagnostics. Do not share
Authorization headers or API keys.

## Verification limits

This build's automated checks verify request shape, middleware wiring,
moderation/failure handling, trial controls, saved-data/security regressions,
browser behaviour and packaging using isolated fixtures and simulated provider
responses. No live provider credential is available in the supplied release
files. Actual Luna availability, latency, answer accuracy and usage remain to
be established by your live trial. No live deployment is performed here.

Official documentation checked 18 October 2026:

- https://developers.openai.com/api/docs/models/gpt-6-luna
- https://developers.openai.com/api/docs/guides/reasoning

## Recorded local verification

- Integration preflight: PASS, including all 41 frontend API connections and 45 backend route access checks.
- Dependency advisory check: zero advisories reported.
- Automated regressions: 134 passed, zero skipped.
- Browser acceptance: 44 checks passed on Chromium 138.0.7204.0, including desktop/mobile, existing Wiz/voice controls, account recovery, privacy/school controls and all 218 diagrams.
- Trial CLI: dry-run and `--run` paths checked with captured synthetic transport; nine provider requests represented three generations plus six moderation checks. No external provider requests were made in that check.
- Exact-source deployment gate and a local build with Render's build guard enabled: PASS.

The live trial remains unrun here; the supplied command is the step that tests actual Luna access and responses in your configured environment.
