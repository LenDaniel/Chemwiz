import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wrapDiagramText, fitDiagramBounds, diagramText } from '../web/student/src/utils/diagramLayout.mjs';
import { isAdminAuthError } from '../web/admin/src/config/session.mjs';
import { accountFindings, inspectAdminAccount, probeAdminSite, environmentFindings } from '../scripts/lib/admin-diagnostics.mjs';
import { npmInvocation, runNpm } from '../scripts/lib/gate-state.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('admin diagnostics support host environment without an env file and identify duplicate emails',async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'chemwiz-host-settings-'));
  try {
    fs.mkdirSync(path.join(folder,'data'));
    const user={email:'admin@example.test',role:'admin',accountStatus:'active',password:'$2b$10$'+'A'.repeat(53)};
    const file=path.join(folder,'data/local-db.json');fs.writeFileSync(file,JSON.stringify({users:[user]}));
    const first=await inspectAdminAccount(folder,{email:user.email,env:{DATA_MODE:'local'}});assert.equal(first.findings[0].code,'ADMIN_RECORD_OK');
    fs.writeFileSync(file,JSON.stringify({users:[user,{...user,email:'Admin@example.test'}]}));
    const duplicated=await inspectAdminAccount(folder,{email:user.email,env:{DATA_MODE:'local'}});assert.equal(duplicated.findings[0].code,'AMBIGUOUS_EMAIL');
    const findings=environmentFindings({NODE_ENV:'production',DATA_MODE:'mongodb',APP_URL:'https://chemwiz.example.test',MONGODB_URI:'mongodb://localhost/db',JWT_SECRET:'private-fixture-value-with-over-32-characters',RENDER:'true',RENDER_EXTERNAL_URL:'not-a-url'},'https://chemwiz.example.test');
    assert.ok(findings.some(item=>item.code==='LOCAL_MONGO_ADDRESS'));assert.ok(!JSON.stringify(findings).includes('private-fixture-value'));
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
});
test('diagram wrapping retains chemical tokens, Unicode and every explanatory word',()=>{
  const text='Nucleophilic attack: CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻';
  const wrapped=wrapDiagramText(text,120,9);
  assert.ok(wrapped.length>1);assert.equal(wrapped.join(' '),text);
  const formula='[Cu(H₂O)₄(NH₃)₂]²⁺';assert.deepEqual(wrapDiagramText(formula,30,9),[formula]);
});
test('diagram viewport grows to cover negative and outlying text without moving structures',()=>{
  const box={x:-30,y:-4,width:480,height:200};
  const view=fitDiagramBounds(box,320,150);
  assert.ok(view.x<box.x&&view.y<box.y);
  assert.ok(view.x+view.width>box.x+box.width&&view.y+view.height>box.y+box.height);
});
test('diagram text alternatives include labels/table cells but exclude drawing instructions',()=>{
  const text=diagramText({title:'Hydrolysis',blocks:[{type:'raw',primitives:[{p:'text',text:'H₂O'},{p:'path',d:'M0 0L1 1',color:'#00ffff'}]},{type:'table',headers:['Reactant'],rows:[['CH₃Br']]}]});
  assert.deepEqual(text,['Hydrolysis','H₂O','Reactant','CH₃Br']);
});
test('only authentication/role failures expire an admin session; CORS/network/panel errors retain it',()=>{
  assert.equal(isAdminAuthError({status:401}),true);assert.equal(isAdminAuthError({status:403,code:'ACCOUNT_SUSPENDED'}),true);
  for(const error of [{status:403,code:'CORS_ORIGIN_BLOCKED'},{status:503},{status:0,code:'NETWORK_ERROR'}])assert.equal(isAdminAuthError(error),false);
});
test('read-only administrator checks distinguish missing account, wrong role, suspension and legacy casing',()=>{
  const user={email:'admin@example.test',role:'admin',accountStatus:'active',password:'$2b$10$'+'A'.repeat(53)};
  assert.equal(accountFindings(user,user.email)[0].code,'ADMIN_RECORD_OK');
  for(const [mutation,code] of [[{role:'student'},'ADMIN_ROLE_MISSING'],[{accountStatus:'suspended'},'ACCOUNT_INACTIVE'],[{email:'Admin@example.test'},'EMAIL_CASE_MISMATCH'],[{password:'invalid'},'PASSWORD_RECORD_INVALID']])assert.ok(accountFindings({...user,...mutation},user.email).some(item=>item.code===code));
  assert.equal(accountFindings(null,user.email)[0].code,'ACCOUNT_NOT_FOUND');
});
test('local account inspection leaves database/private settings bytes unchanged and returns no password material',async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'chemwiz-admin-readonly-'));
  try {
    fs.mkdirSync(path.join(folder,'data'));const database=JSON.stringify({users:[{email:'admin@example.test',role:'admin',password:'$2b$10$'+'A'.repeat(53)}]});
    const settings='DATA_MODE=local\n';fs.writeFileSync(path.join(folder,'.env'),settings);fs.writeFileSync(path.join(folder,'data/local-db.json'),database);
    const report=await inspectAdminAccount(folder,{email:'ADMIN@example.test',env:{}});
    assert.equal(report.findings[0].status,'PASS');assert.equal(fs.readFileSync(path.join(folder,'data/local-db.json'),'utf8'),database);assert.equal(fs.readFileSync(path.join(folder,'.env'),'utf8'),settings);
    assert.ok(!JSON.stringify(report).includes('$2b$'));
  } finally {fs.rmSync(folder,{recursive:true,force:true});}
});
test('public admin diagnostics submit no credentials and identify a different deployed version',async()=>{
  const requests=[];
  const fake=async(url,options)=>{
    requests.push({url,options});
    const route=new URL(url).pathname;
    return new Response(JSON.stringify(route==='/api/health'?{service:'chemwiz-unified',version:'older',dataMode:'mongodb'}:route==='/api/ready'?{success:true,dataMode:'mongodb'}:{}),{status:route==='/api/auth/login'?400:route==='/api/admin/test'?401:200,headers:{'Content-Type':'application/json'}});
  };
  const report=await probeAdminSite('https://chemwiz.example.test/admin/','current',fake);
  assert.equal(report.findings[0].status,'REVIEW');assert.ok(report.findings.slice(1).every(item=>item.status==='PASS'));
  assert.equal(requests.find(item=>item.options.method==='POST').options.body,'{}');
  assert.ok(requests.every(item=>!item.options.headers.Authorization&&item.options.headers.Origin==='https://chemwiz.example.test'));
});
test('origin rejection and wrong services are diagnosed before attempting login',async()=>{
  const blocked=await probeAdminSite('https://chemwiz.example.test','v',async()=>new Response('{}',{status:403}));
  assert.equal(blocked.findings[0].code,'CORS_ORIGIN_BLOCKED');
  const wrong=await probeAdminSite('https://chemwiz.example.test','v',async()=>new Response('{}',{status:200}));
  assert.equal(wrong.findings[0].code,'WRONG_DEPLOYMENT');
});
test('Windows npm launcher uses Node plus the literal CLI path rather than cmd shell quoting',()=>{
  const cli='C:\\Program Files\\Node & Tools\\npm-cli.js';
  assert.deepEqual(npmInvocation({platform:'win32',env:{npm_execpath:cli},execPath:'C:\\Program Files\\nodejs\\node.exe',exists:filename=>filename===cli}),{command:'C:\\Program Files\\nodejs\\node.exe',prefix:[cli]});
  assert.throws(()=>npmInvocation({platform:'win32',env:{},execPath:'C:\\missing\\node.exe',exists:()=>false}),/Cannot locate/);
});
test('npm child arguments with spaces and shell characters remain literal',()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'chemwiz npm & arguments '));
  try {
    const cli=path.join(folder,'npm-cli.js');fs.writeFileSync(cli,'process.stdout.write(JSON.stringify(process.argv.slice(2)));');
    const args=['two words','a & b','$(do-not-run)','quotes "remain"'];
    const checked=runNpm(root,args,{env:{...process.env,npm_execpath:cli},shell:true});
    assert.equal(checked.status,0,checked.stderr);assert.deepEqual(JSON.parse(checked.stdout),args);
  } finally {fs.rmSync(folder,{recursive:true,force:true});}
});
