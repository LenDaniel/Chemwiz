# ChemWiz v1.4.0 — Admin sign-in diagnosis

## Diagnose your Render administrator

A credential-free check on 15 October confirmed that **https://chemwiz.co.zw** returns MongoDB readiness, accepts its own public origin, reaches the login handler and correctly rejects anonymous admin access. Its backend did not advertise the current version, indicating an older deployment. These observations do not verify a typed password or the administrator's role/record. A credentialed live check was blocked by automatic approval review because that access was not clearly authorised; only credential-free findings are reported. Direct account inspection from the earlier saved database settings was unavailable from this environment. The old file is not authoritative for current Render Environment values.

After applying this source, run locally:

```powershell
npm run diagnose:admin -- "https://chemwiz.co.zw"
```

Then, in the **Render service shell** with its actual environment, run:

```bash
npm run diagnose:admin -- "https://chemwiz.co.zw" --account "YOUR_ACTUAL_ADMIN_EMAIL"
```

No private .env.production file is required on Render: the command can use host variables directly. On your own computer with matching private production settings, add `--env ".env.production"`. Only native collection reads are used; the tool does not initialize indexes, save records, reset passwords or print credential material.

| Finding | Meaning/action |
| --- | --- |
| DEPLOYED_VERSION review | Push the complete tested v1.4.0 source and matching report to the linked branch. Verify /api/health reports 1.4.0. |
| CORS_ORIGIN_BLOCKED / ORIGIN_MATCH review | APP_URL must be the actual public HTTPS origin; preserve database/secret values. |
| DATA_MODE / MONGODB_URI review | Confirm MongoDB mode and the intended Atlas database. A localhost Mongo URI refers to the Render instance itself. |
| ACCOUNT_NOT_FOUND | That email is not in the selected production database. LOCAL_ADMIN_EMAIL/PASSWORD only seed local JSON data, not MongoDB accounts. |
| ADMIN_ROLE_MISSING | The account is a learner/teacher, not an admin. Public signup does not grant administration. Use an existing authorised admin to assign roles; preserve the learner account. |
| ACCOUNT_INACTIVE | The account is suspended/disabled; preserve its record and review its status through authorised administration. |
| EMAIL_CASE_MISMATCH | v1.4.0 accepts one unambiguous case-insensitive email match. Older builds may reject a legacy mixed-case email. |
| AMBIGUOUS_EMAIL | Duplicate records use the same email ignoring case. Resolve that data issue with backups before signing in. |
| ADMIN_RECORD_OK but login fails | The record/role/hash format is valid, but the diagnostic has not checked your typed password. Use email recovery after configuring EmailJS. |
| ACCOUNT_INSPECTION_UNAVAILABLE | Run in Render's shell or use matching private production settings with Atlas network access; review the sanitized error category. |

If and ONLY if this is an intended new database with no administrator, use the existing bootstrap command in Render's shell:

```bash
npm run create-admin
```

It asks for a valid email and a strong hidden password and refuses to overwrite an existing email. A public learner signup cannot replace the admin bootstrap. Do not reset the database or JWT secret as a troubleshooting shortcut.


EmailJS setup and installation are in ACCOUNT_RECOVERY_README.md. Password-reset and legacy-upgrade changes require the complete v1.4.0 source/report to be deployed together.
