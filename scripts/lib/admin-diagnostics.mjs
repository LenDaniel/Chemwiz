import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

export function accountFindings(user, email) {
  if (!user) return [{ status:'FAIL', code:'ACCOUNT_NOT_FOUND', message:'This email is absent from the selected database. Local demo accounts are not production MongoDB accounts.' }];
  const findings = [];
  if (user.email !== email) findings.push({ status:'FAIL', code:'EMAIL_CASE_MISMATCH', message:'A legacy email is stored with different casing; normal sign-in searches the normalized lowercase email.' });
  if (user.role !== 'admin') findings.push({ status:'FAIL', code:'ADMIN_ROLE_MISSING', message:'The account exists but does not have the admin role. Public signup creates a student.' });
  if (user.accountStatus && user.accountStatus !== 'active') findings.push({ status:'FAIL', code:'ACCOUNT_INACTIVE', message:'The administrator account is suspended or disabled.' });
  if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password || '')) findings.push({ status:'FAIL', code:'PASSWORD_RECORD_INVALID', message:'The stored password is not a supported bcrypt hash. Preserve the record and use an authorized recovery procedure.' });
  if (!findings.length) findings.push({ status:'PASS', code:'ADMIN_RECORD_OK', message:'An active admin with a bcrypt password record exists. This read-only check does not verify the password you type.' });
  return findings;
}

export async function inspectAdminAccount(root, { email, envFile, env = process.env } = {}) {
  const filename = envFile ? path.resolve(envFile) : path.join(root,'.env');
  const values = { ...dotenv.parse(fs.readFileSync(filename)), ...env };
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) throw new Error('An administrator email is required for account inspection.');
  const mode = values.DATA_MODE || 'local';
  let user;
  if (mode === 'local') {
    const file = path.resolve(root, values.LOCAL_DATA_FILE || 'data/local-db.json');
    const database = JSON.parse(fs.readFileSync(file,'utf8'));
    user = database.users?.find(item => String(item.email).trim().toLowerCase() === normalized);
  } else if (mode === 'mongodb') {
    const uri = values.MONGODB_URI || values.MONGO_URI || values.MONGO_URL;
    if (!uri) throw new Error('No private MongoDB URI is configured for this account inspection.');
    const connection = mongoose.createConnection(uri, { serverSelectionTimeoutMS:10000, connectTimeoutMS:10000, maxPoolSize:1 });
    try {
      await connection.asPromise();
      // Native collection reads avoid model initialization, indexes, save hooks
      // and any possibility of creating/resetting an administrator account.
      user = await connection.db.collection('users').findOne({email:normalized}, {projection:{email:1,role:1,accountStatus:1,password:1}});
      if (!user) {
        const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        user = await connection.db.collection('users').findOne({email:{$regex:`^${escaped}$`,$options:'i'}}, {projection:{email:1,role:1,accountStatus:1,password:1}});
      }
    } finally { await connection.close(); }
  } else throw new Error('DATA_MODE must be local or mongodb.');
  return { mode, findings: accountFindings(user,normalized) };
}

export async function probeAdminSite(address, expectedVersion, fetcher = fetch) {
  const url = new URL(address);
  if (!['http:','https:'].includes(url.protocol) || url.username || url.password) throw new Error('Use the public HTTP(S) site address without credentials.');
  const origin = url.origin, findings = [];
  async function request(route, method = 'GET', body) {
    const response = await fetcher(origin+route,{method,redirect:'manual',signal:AbortSignal.timeout(10000),
      headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
    return { status:response.status, data:await response.json().catch(()=>null) };
  }
  const health=await request('/api/health');
  if (health.status===403) return { origin, findings:[{status:'FAIL',code:'CORS_ORIGIN_BLOCKED',message:'This exact public origin is rejected before authentication. Set APP_URL to this HTTPS origin on the host, retain the existing database/secret, and redeploy the current checked source.'}] };
  if (health.status!==200 || health.data?.service!=='chemwiz-unified') return {origin,findings:[{status:'FAIL',code:'WRONG_DEPLOYMENT',message:'This address does not return unified ChemWiz health data. Check the service URL and deployed source.'}]};
  findings.push({status:health.data.version===expectedVersion?'PASS':'REVIEW',code:'DEPLOYED_VERSION',message:`Server version: ${health.data.version || 'not advertised (older build)'}. Local patch version: ${expectedVersion}.`, serverVersion:health.data.version || null});
  const ready=await request('/api/ready');
  findings.push({status:ready.status===200&&ready.data?.success===true?'PASS':'FAIL',code:'DATABASE_READINESS',message:`Backend readiness HTTP ${ready.status}; data mode ${ready.data?.dataMode || health.data.dataMode || 'unknown'}.`});
  const login=await request('/api/auth/login','POST',{});
  findings.push({status:login.status===400?'PASS':'FAIL',code:login.status===403?'CORS_ORIGIN_BLOCKED':'LOGIN_ROUTE',message:login.status===400?'Login handler is reachable from the public origin; no credentials were submitted.':`Login probe HTTP ${login.status}. ${login.data?.message || 'Check the deployed API and origin settings.'}`});
  const admin=await request('/api/admin/test');
  findings.push({status:admin.status===401?'PASS':'FAIL',code:'ADMIN_ROUTE',message:`Admin access check HTTP ${admin.status}; anonymous requests must be rejected with 401.`});
  return {origin,findings};
}
