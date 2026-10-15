import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { inspectAdminAccount, probeAdminSite, environmentFindings } from './lib/admin-diagnostics.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
let address, email, envFile;
try {
  for(let i=0;i<args.length;i++) {
    if(args[i]==='--account') { email=args[++i]; if(!email)throw new Error('--account needs the administrator email.'); }
    else if(args[i]==='--env') { envFile=args[++i]; if(!envFile)throw new Error('--env needs a private environment filename.'); }
    else if(!address && /^https?:\/\//.test(args[i])) address=args[i];
    else throw new Error('Usage: npm run diagnose:admin -- "https://YOUR_SITE" [--account "admin email" --env ".env.production"]');
  }
  const settingsFile=envFile ? path.resolve(envFile) : path.join(root,'.env');
  const settings={...(fs.existsSync(settingsFile)?dotenv.parse(fs.readFileSync(settingsFile)):{}),...process.env};
  if(!address && settings.RENDER==='true' && settings.RENDER_EXTERNAL_URL) address=settings.RENDER_EXTERNAL_URL;
  const environment=environmentFindings(settings,address);
  console.log('Configuration source: selected file plus current process/host environment (host values win).');
  const version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version;
  const findings=[...environment];
  if(address) {
    const report=await probeAdminSite(address,version);
    console.log('Public site:',report.origin);
    findings.push(...report.findings);
  }
  if(email) {
    try {
      const report=await inspectAdminAccount(root,{email,envFile});
      console.log('Account inspection data mode:',report.mode,'(selected private settings; no writes).');
      findings.push(...report.findings);
    } catch(error) {
      findings.push({status:'FAIL',code:'ACCOUNT_INSPECTION_UNAVAILABLE',message:`Private account inspection could not complete (${error.code===18?'database authentication rejected':error.name || 'Error'}, code ${error.code || 'unavailable'}). Check file access, database credentials and Atlas network access. No account was changed.`});
    }
  }
  for(const finding of findings)console.log(`${finding.status} ${finding.code}: ${finding.message}`);
  console.log('Read-only diagnostics only. No passwords, hashes, connection strings or tokens are printed; no accounts or settings are changed.');
  if(findings.some(finding=>finding.status==='FAIL'))process.exitCode=1;
} catch(error) { console.error('Admin diagnostics could not run:',error.message);process.exitCode=1; }
