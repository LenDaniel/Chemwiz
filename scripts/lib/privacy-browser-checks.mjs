import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {acceptedPrivacy}=require('./privacy-fixture.cjs');
export async function runPrivacyChecks({browser,base}) {
  const checks=[],errors=[];
  const {User}=require('../../backend/src/data/modelProvider');
  const jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs');
  const store=require('../../backend/src/services/governanceStore');
  const {defaultState,saveState,getState}=require('../../backend/src/services/learningState.service');
  const admin=await User.findOne({email:process.env.LOCAL_ADMIN_EMAIL});
  const adminToken=jwt.sign({id:admin._id,authVersion:admin.authVersion || 0,purpose:'access'},process.env.JWT_SECRET,{expiresIn:'1h'});
  async function api(route,method='GET',body,token=adminToken){const response=await fetch(base+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:response.status,data:await response.json()};}
  const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const password='Privacy-browser-account!2026';
  async function signIn(email){await page.goto(base+'/student/');await page.getByPlaceholder('Email',{exact:true}).fill(email);await page.getByPlaceholder('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'LOGIN',exact:true}).click();}
  async function openChoices(){await page.locator('.cw-sidebar-link').filter({hasText:'Profile'}).click();await page.getByText('Privacy, school and account choices',{exact:true}).click();await page.getByRole('heading',{name:'Privacy and account choices',exact:true}).waitFor();}
  try{
    for(const width of [1366,320]){
      await page.setViewportSize({width,height:900});
      for(const slug of ['privacy','learners','terms','child-safety','device-storage','ai','schools']){
        await page.goto(base+'/legal/'+slug);await page.getByRole('heading',{name:'Operator and privacy contact',exact:true}).waitFor();
        await page.getByText('ChemWiz synthetic test operator',{exact:true}).waitFor();
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,slug+' overflowed at '+width);
      }
    }
    checks.push('All seven public legal pages load without login and reflow at desktop and 320px');
    await page.setViewportSize({width:1366,height:900});
    const legacy=await User.create({name:'Legacy privacy browser learner',email:'legacy-privacy@browser.test',password:await bcrypt.hash(password,4),passwordPolicyVersion:1,privacy:null});
    const learning=defaultState();learning.progress.atomic={chaptersRead:['at1'],quizzesTaken:1,percent:25};await saveState(legacy._id,0,learning);
    await signIn(legacy.email);await page.getByRole('heading',{name:'Complete your account setup',exact:true}).waitFor();
    await page.getByLabel('Age group',{exact:true}).selectOption('adult');await page.getByLabel('I accept the current Terms of Use.',{exact:true}).check();await page.getByLabel('I have read the Privacy Notice.',{exact:true}).check();await page.getByRole('button',{name:'Save account setup',exact:true}).click();await page.locator('.cw-topic-tile').first().waitFor();
    assert.deepEqual((await getState(legacy._id)).state.progress,learning.progress);
    checks.push('A legacy learner completes explicit age/legal onboarding and retains saved progress');
    await openChoices();await page.getByLabel('Allow Wiz AI processing',{exact:true}).check();await page.getByRole('button',{name:'Save privacy choices',exact:true}).click();await page.getByRole('status').filter({hasText:'Your choices have been saved.'}).waitFor();
    assert.equal((await User.findById(legacy._id)).privacy.aiConsent,true);
    await page.getByLabel('Allow Wiz AI processing',{exact:true}).uncheck();await page.getByRole('button',{name:'Save privacy choices',exact:true}).click();
    await page.waitForFunction(()=>!document.querySelector('section[aria-label="Privacy and account choices"] button:disabled'));
    assert.equal((await User.findById(legacy._id)).privacy.aiConsent,false);
    checks.push('Optional AI choices persist through the real frontend and backend');
    const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export account data',exact:true}).click();const file=await downloaded;assert.equal(file.suggestedFilename(),'chemwiz-account-export.json');
    checks.push('The account privacy export is downloadable through the real browser');
    await page.getByText('Request help with your information',{exact:true}).click();await page.getByLabel('Request type',{exact:true}).selectOption('correction');await page.getByLabel('Short explanation',{exact:true}).fill('Please review the synthetic display name.');await page.getByRole('button',{name:'Submit privacy request',exact:true}).click();await page.getByRole('status').filter({hasText:'Your request has been recorded.'}).waitFor();
    assert.ok((await store.list({kind:'privacy-request',ownerId:legacy._id})).some(d=>d.data.type==='correction'));
    checks.push('A learner can submit and track an account privacy request');
    const schoolA=(await api('/api/schools','POST',{name:'Privacy Browser School A',contactEmail:'school-a@browser.test',contractReference:'TEST-A',dpaReference:'TEST-DPA-A',seats:5,status:'active',expiresAt:new Date(Date.now()+365*86400000).toISOString()})).data;
    const schoolB=(await api('/api/schools','POST',{name:'Privacy Browser School B',contactEmail:'school-b@browser.test',contractReference:'TEST-B',dpaReference:'TEST-DPA-B',seats:5,status:'active',expiresAt:new Date(Date.now()+365*86400000).toISOString()})).data;
    const staff=await User.create({name:'School A teacher',email:'school-teacher@browser.test',password:await bcrypt.hash(password,4),passwordPolicyVersion:1,privacy:acceptedPrivacy()});
    const hidden=await User.create({name:'School B private learner',email:'school-b-learner@browser.test',password:await bcrypt.hash(password,4),passwordPolicyVersion:1,privacy:acceptedPrivacy()});
    for(const [s,u,role] of [[schoolA,staff,'teacher'],[schoolA,legacy,'student'],[schoolB,hidden,'student']]){
      assert.equal((await api('/api/schools/'+s.id+'/membership','PUT',{userId:u._id,role,status:'pending',classIds:['L6-A']})).status,200);
      const token=jwt.sign({id:u._id,authVersion:0,purpose:'access'},process.env.JWT_SECRET);
      assert.equal((await api('/api/privacy/schools/'+s.id+'/sharing','PATCH',{share:true},token)).status,200);
    }
    await context.clearCookies();await page.evaluate(()=>localStorage.removeItem('cw.authToken'));await signIn(staff.email);await page.locator('.cw-topic-tile').first().waitFor();await openChoices();await page.getByText('Your school workspaces',{exact:true}).click();await page.getByRole('button',{name:'Open school roster',exact:true}).click();await page.getByRole('button',{name:'Download school report',exact:true}).waitFor();
    assert.equal(await page.getByText('School B private learner',{exact:true}).count(),0);assert.ok((await page.locator('section[aria-label="Privacy and account choices"]').textContent()).includes(legacy.name));
    checks.push('A teacher opens a school roster through their learner workspace with no other-school records');
    await page.setViewportSize({width:320,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    checks.push('Privacy choices, school membership and reporting controls reflow on a 320px screen');
    await page.setViewportSize({width:1366,height:900});
    await page.goto(base+'/admin/');await page.evaluate(token=>localStorage.setItem('chemwiz.admin.token',token),adminToken);await page.reload();await page.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();await page.getByText('Privacy and school administration',{exact:true}).click();await page.getByText('Publish operator and privacy details',{exact:true}).click();await page.getByLabel('Legal operator name',{exact:true}).fill('ChemWiz synthetic reviewed operator');await page.getByRole('button',{name:'Save publication settings',exact:true}).click();await page.getByRole('status').filter({hasText:'Privacy publication settings saved.'}).waitFor();
    checks.push('Admin can publish reviewed operator information through the real settings form');
    await page.getByText('Verified guardian authorisations',{exact:true}).click();
    for(const [label,value] of [['Guardian full name','Verified browser guardian'],['Guardian email','guardian@privacy-browser.test'],['Authorised child email','approved-child@privacy-browser.test'],['Authority and written-consent verification reference','SYNTHETIC-WRITTEN-CONSENT-AND-AUTHORITY'],['Written consent signed date',new Date(Date.now()-86400000).toISOString().slice(0,10)],['Learner’s verified 18th birthday',new Date(Date.now()+365*86400000).toISOString().slice(0,10)]])await page.getByLabel(label,{exact:true}).fill(value);
    await page.getByLabel('I verified parental/legal guardian authority and written consent covering the current notices and terms.',{exact:true}).check();await page.getByRole('button',{name:'Issue guardian enrolment invitation',exact:true}).click();const invitation=page.getByLabel('Private enrolment link — shown once',{exact:true});await invitation.waitFor();const enrolment=await invitation.inputValue();assert.match(enrolment,/#guardian=[a-f0-9]{24}\.[a-f0-9]{64}$/);
    checks.push('Admin records verified written guardian authority and receives a private limited enrolment link');
    const childContext=await browser.newContext({viewport:{width:390,height:844}}),childPage=await childContext.newPage();childPage.on('pageerror',e=>errors.push(e.message));
    try{
      await childPage.goto(base+'/');await childPage.evaluate(token=>localStorage.setItem('cw.authToken',token),jwt.sign({id:legacy._id,authVersion:0,purpose:'access'},process.env.JWT_SECRET));await childPage.goto(enrolment);assert.equal(await childPage.getByLabel('Age group',{exact:true}).inputValue(),'teen');await childPage.waitForURL(url=>!url.hash);assert.equal(new URL(childPage.url()).hash,'');await childPage.getByLabel('I accept the current Terms of Use.',{exact:true}).check();await childPage.getByLabel('I have read the Privacy Notice.',{exact:true}).check();await childPage.getByPlaceholder('Full name',{exact:true}).fill('Approved browser child');await childPage.getByPlaceholder('Email',{exact:true}).fill('approved-child@privacy-browser.test');await childPage.getByPlaceholder('Password',{exact:true}).fill(password);await childPage.getByPlaceholder('Confirm password',{exact:true}).fill(password);await childPage.getByRole('button',{name:'CREATE ACCOUNT',exact:true}).click();await childPage.locator('.cw-topic-tile').first().waitFor();const child=await User.findOne({email:'approved-child@privacy-browser.test'});assert.equal(child.privacy.ageBand,'teen');assert.equal(child.privacy.aiConsent,false);
      checks.push('The verified invitation opens over an old saved login and activates only the intended child with optional AI off');
      assert.equal((await api('/api/privacy/admin/guardians/'+child.privacy.guardianId,'DELETE')).status,200);await childPage.reload();await childPage.getByRole('heading',{name:'Complete your account setup',exact:true}).waitFor();
      checks.push('Guardian withdrawal returns an already signed-in child to restricted account setup');
    }finally{await childContext.close();}
    assert.deepEqual(errors,[]);return {status:'PASS',checks};
  }finally{await context.close();}
}
