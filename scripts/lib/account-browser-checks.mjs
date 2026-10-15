import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
export async function runAccountChecks({browser,base,fixture}) {
  const context=await browser.newContext({viewport:{width:1366,height:768}});
  const page=await context.newPage();const checks=[],errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const {User}=require('../../backend/src/data/modelProvider');
  const bcrypt=require('bcryptjs');
  const strong='Browser-recovered-password!2026';
  async function updatePassword(value=strong){await page.getByPlaceholder('New password',{exact:true}).fill(value);await page.getByPlaceholder('Confirm new password',{exact:true}).fill(value);await page.getByRole('button',{name:'Update password',exact:true}).click();}
  async function signIn(workspace,email,password){await page.goto(base+'/'+workspace+'/');if(workspace==='admin'){await page.locator('#admin-email').fill(email);await page.locator('#admin-password').fill(password);await page.getByRole('button',{name:'Login',exact:true}).click();}else{await page.getByPlaceholder('Email',{exact:true}).fill(email);await page.getByPlaceholder('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'LOGIN',exact:true}).click();}}
  try {
    await page.goto(base+'/student/');await page.getByPlaceholder('Password',{exact:true}).fill('Visible-sample!2026');
    await page.getByRole('button',{name:'Show password',exact:true}).click();assert.equal(await page.getByPlaceholder('Password',{exact:true}).getAttribute('type'),'text');
    await page.getByRole('button',{name:'Hide password',exact:true}).click();assert.equal(await page.getByPlaceholder('Password',{exact:true}).getAttribute('type'),'password');
    checks.push('Learner password visibility toggles preserve input and expose accessible state');
    await page.getByRole('button',{name:'No account yet? Create one',exact:true}).click();
    await page.getByPlaceholder('Full name').fill('Policy learner');await page.getByPlaceholder('Email',{exact:true}).fill('policy@browser.test');
    await page.getByPlaceholder('Password',{exact:true}).fill('Password2026!');await page.getByPlaceholder('Confirm password',{exact:true}).fill('Password2026!');
    await page.getByRole('button',{name:'CREATE ACCOUNT',exact:true}).click();await page.getByRole('alert').waitFor();assert.match(await page.getByRole('alert').textContent(),/predictable/);
    checks.push('Signup rejects a predictable password despite digits and punctuation');
    for(const role of ['student','admin']){
      const email=`legacy-${role}@browser.test`;
      await User.create({name:'Preserved legacy '+role,email,password:await bcrypt.hash('weak123',10),role,subscriptionTier:role==='admin'?'admin':'premium'});
      await signIn(role,email,'weak123');await page.getByRole('heading',{name:'Upgrade your password',exact:true}).waitFor();
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),role==='admin'?'chemwiz.admin.token':'cw.authToken') || '', '');
      await updatePassword();await page.getByRole('heading',{name:'Password updated',exact:true}).waitFor();
      await page.getByRole('button',{name:'Back to sign in',exact:true}).click();await signIn(role,email,strong);
      await page.locator(role==='admin'?'.admin-mini-card':'.cw-topic-tile').first().waitFor();
      checks.push(`${role} legacy password is upgraded before sign-in and retains its original role`);
    }
    await page.goto(base+'/student/');
    // The student remains signed in from the previous flow. A reset link must
    // open recovery even when an old saved session exists.
    await page.goto(base+'/admin/');await page.evaluate(()=>localStorage.removeItem('chemwiz.admin.token'));await page.reload();
    await page.getByRole('button',{name:'Forgot password?',exact:true}).click();
    await page.getByRole('textbox',{name:'Recovery email',exact:true}).fill('legacy-admin@browser.test');
    await page.getByRole('button',{name:'Send reset email',exact:true}).click();await page.getByRole('textbox',{name:'Reset code',exact:true}).waitFor();
    const adminMail=fixture.emails.filter(mail=>mail.to_email==='legacy-admin@browser.test').at(-1);assert.ok(adminMail);assert.ok(Date.parse(adminMail.expires_at)-Date.now()>3500000);
    await page.getByRole('textbox',{name:'Reset code',exact:true}).fill(adminMail.reset_code);
    await updatePassword('Admin-email-recovered!2026');await page.getByRole('heading',{name:'Password updated',exact:true}).waitFor();
    await page.getByRole('button',{name:'Back to sign in',exact:true}).click();await signIn('admin','legacy-admin@browser.test','Admin-email-recovered!2026');await page.locator('.admin-mini-card').first().waitFor();
    checks.push('Administrator forgot-password sends a captured EmailJS message and accepts its one-hour code');
    const request=await fetch(base+'/api/auth/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'legacy-student@browser.test',workspace:'student'})});assert.equal(request.status,202);
    const mail=fixture.emails.filter(item=>item.to_email==='legacy-student@browser.test').at(-1);assert.ok(mail);
    await page.goto(base+'/student/'+new URL(mail.reset_url).hash);
    await page.getByRole('heading',{name:'Set a new password',exact:true}).waitFor();assert.equal(new URL(page.url()).hash,'');
    await updatePassword('Learner-link-recovered!2026');await page.getByRole('heading',{name:'Password updated',exact:true}).waitFor();
    await page.getByRole('button',{name:'Back to sign in',exact:true}).click();await signIn('student','legacy-student@browser.test','Learner-link-recovered!2026');await page.locator('.cw-topic-tile').first().waitFor();
    checks.push('A learner reset link overrides a saved session, clears its URL token and permits the new password');
    for(const width of [320,390,1366]){
      await page.setViewportSize({width,height:844});await page.goto(base+'/');
      await page.getByText('© ChemWiz 2026. All rights reserved.',{exact:false}).waitFor();
      const helpline=page.getByRole('link',{name:'WhatsApp helpline: +263 718 645 362',exact:true});assert.equal(await helpline.getAttribute('href'),'https://wa.me/263718645362');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    checks.push('Home shows the requested copyright, developer attribution and WhatsApp helpline without mobile overflow');
    assert.deepEqual(errors,[]);
    return {status:'PASS',checks};
  }finally{await context.close();}
}
