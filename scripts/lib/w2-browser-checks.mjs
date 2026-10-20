import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer, build } from 'vite';
import { probeAdminSite } from './admin-diagnostics.mjs';

async function navigateTab(page,text) {
  const desktop=page.locator('.cw-sidebar-link').filter({hasText:text});
  await (await desktop.isVisible()?desktop:page.locator('.cw-mobile-tab').filter({hasText:text})).click();
}
async function noPageOverflow(page,label) {
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' causes page-wide horizontal scrolling');
  assert.ok(await page.evaluate(()=>{const main=document.querySelector('.cw-screen');return !main||main.scrollWidth<=main.clientWidth+1;}),label+' overflows the learning pane');
}
async function signin(page,base,email,password,admin=false) {
  await page.goto(base+(admin?'/admin/':'/student/'));
  await page.locator(admin?'#admin-email':'input[type=email]').fill(email);
  await page.locator(admin?'#admin-password':'input[type=password]').fill(password);
  await page.getByRole('button',{name:admin?'Login':'LOGIN',exact:true}).click();
  await page.locator(admin?'.admin-mini-card':'.cw-topic-tile').first().waitFor();
}
async function openTopic(page,action) {
  await navigateTab(page,'HOME');
  await page.locator('.cw-topic-tile').filter({hasText:'Atomic Structure'}).click();
  await page.locator('.cw-action-tile').filter({hasText:action}).click();
}

async function createGallery(root) {
  const directory=path.join(root,'.build-checks/w2-gallery');fs.mkdirSync(directory,{recursive:true});
  const loader=await createServer({root:path.join(root,'web'),configFile:path.join(root,'vite.config.mjs'),server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'});
  const diagrams=[];
  try {
    const content=await loader.ssrLoadModule('/student/src/content/index.js');
    const {TOPIC_META}=await loader.ssrLoadModule('/student/src/config/topics.js');
    for(const id of content.TOPIC_CONTENT_IDS) {
      const topic=await content.loadContent(id);
      for(const chapter of topic.chapters)for(const [i,block] of chapter.blocks.entries())if(block.type==='d')diagrams.push({id:`${id}/${chapter.id}/${i}`,block,color:TOPIC_META.find(topic=>topic.id===id).color});
    }
  } finally {await loader.close();}
  fs.writeFileSync(path.join(directory,'diagrams.json'),JSON.stringify(diagrams));
  fs.writeFileSync(path.join(directory,'index.html'),'<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>W2 isolated diagram checks</title><div id="root"></div><script type="module" src="./entry.jsx"></script></html>');
  fs.writeFileSync(path.join(directory,'entry.jsx'),`import React from 'react';
import {createRoot} from 'react-dom/client';
import {Block} from '../../web/student/src/components/Primitives.jsx';
import {THEMES} from '../../web/student/src/config/theme.js';
import '../../web/student/src/styles/responsive.css';
import diagrams from './diagrams.json';
const t=THEMES.dark;
createRoot(document.getElementById('root')).render(<main className="cw-app-root" style={{height:'100dvh',overflowY:'auto',background:t.bg,color:t.text,'--cw-bg':t.bg,'--cw-panel':t.panel,'--cw-text':t.text,'--cw-muted':t.textMuted,'--cw-border':t.border,'--cw-accent':t.accent}}>
{diagrams.map(item=><article key={item.id} data-diagram-id={item.id} style={{width:'100%',maxWidth:900,margin:'0 auto',padding:12}}><Block block={item.block} color={item.color} t={t}/></article>)}</main>);`);
  await build({configFile:false,root:directory,base:'/__w2-gallery/',logLevel:'error',build:{outDir:path.join(directory,'dist'),emptyOutDir:true,rolldownOptions:{input:path.join(directory,'index.html')}}});
  return {directory:path.join(directory,'dist'),count:diagrams.length};
}

export async function runW2Checks({root,browser,base,learner,admin}) {
  const checks=[],errors=[],screenshots=path.join(root,'.build-checks/screenshots');fs.mkdirSync(screenshots,{recursive:true});
  const context=await browser.newContext({viewport:{width:1366,height:768}});
  context.setDefaultTimeout(12000);
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  try {
    await signin(page,base,learner.email,learner.password);
    // Modal focus must remain in the search, including Shift+Tab and Escape.
    const trigger=page.locator('.cw-topbar-search');await trigger.click();
    const search=page.getByRole('dialog',{name:'Search ChemWiz'});await search.waitFor();
    await page.getByRole('textbox',{name:'Search all ChemWiz content'}).fill('Haber');
    await page.locator('.cw-search-result').first().waitFor();
    await page.getByRole('textbox',{name:'Search all ChemWiz content'}).focus();await page.keyboard.press('Shift+Tab');
    assert.ok(await search.evaluate(dialog=>dialog.contains(document.activeElement)));
    await page.keyboard.press('Escape');await search.waitFor({state:'hidden'});
    assert.equal(await trigger.evaluate(element=>document.activeElement===element),true);
    checks.push('Search dialog contains keyboard focus and Escape returns to its trigger');

    for(const [width,height] of [[320,640],[390,844],[768,1024],[1366,768],[1366,460],[683,384]]) {
      await page.setViewportSize({width,height});
      await navigateTab(page,'HOME');await noPageOverflow(page,`Home ${width}×${height}`);
      assert.equal(await page.locator('.cw-topic-tile').count(),24);
      if(width>=980) {
        const available=await page.locator('.cw-sidebar').evaluate(sidebar=>[...sidebar.querySelectorAll('button,a')].filter(element=>element.getClientRects().length).every(element=>{const box=element.getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight;}));
        assert.ok(available,`Sidebar controls are unreachable at ${height}px`);
      }
      await openTopic(page,'CHAPTERS');await page.locator('.cw-chapter-tile').first().click();await page.locator('.cw-reader-body').waitFor();
      await noPageOverflow(page,'Chapter reader');
      await openTopic(page,'PAPER 1');await page.getByRole('button').filter({hasText:/^\[A\]/}).click();
      assert.equal(await page.getByRole('button').filter({hasText:/^\[A\]/}).getAttribute('aria-pressed'),'true','Selected quiz answer must announce its state');
      await page.getByRole('button',{name:'NEXT →',exact:true}).click();
      assert.equal(await page.locator('.cw-question-stem').evaluate(element=>element===document.activeElement),true);
      await noPageOverflow(page,'Quiz');
      await openTopic(page,'PAPER 2');const reveal=page.getByRole('button',{name:'REVEAL MODEL',exact:true}).first();const answer=await reveal.getAttribute('aria-controls');await reveal.click();assert.equal(await page.locator(`[aria-controls="${answer}"]`).getAttribute('aria-expanded'),'true','The revealed model answer must announce its expanded state');await noPageOverflow(page,'Structured question');
      await openTopic(page,'WORKED');await page.getByRole('button',{name:'+ NEXT STEP',exact:true}).click();await noPageOverflow(page,'Worked example');
      await openTopic(page,'WIZ');await page.locator('#cw-wiz-input').fill('Explain the structure and bonding of ammonium ions.');
      await noPageOverflow(page,'Wiz text composer');
      await page.getByRole('button',{name:/Live voice/}).click();
      await page.getByRole('button',{name:/Start live voice/}).waitFor();await noPageOverflow(page,'Live voice controls');
      await page.getByRole('button',{name:/Text chat/}).click();
      for(const tool of ['PERIODIC TABLE','EQUATION BALANCER','QA TABLE','MOLE CALCULATOR']) {
        await navigateTab(page,'TOOLS');await page.locator('.cw-tool-tile').filter({hasText:tool}).click();
        await noPageOverflow(page,tool);
        if(tool==='PERIODIC TABLE') {await page.getByRole('button',{name:/Hydrogen \(H\), atomic number 1/}).click();await noPageOverflow(page,'Element detail');}
        if(tool==='QA TABLE') {const toggle=page.locator('.cw-qa-card button').first();await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');}
        if(tool==='MOLE CALCULATOR')assert.ok(await page.getByRole('spinbutton',{name:/m.*g/}).count());
      }
      await navigateTab(page,'STATS');await noPageOverflow(page,'Progress');
      await navigateTab(page,'PROFILE');await noPageOverflow(page,'Profile');
      checks.push(`Learner screens/tools, keyboard controls and navigation reflow at ${width}×${height}`);
    }
    await page.setViewportSize({width:390,height:844});
    await navigateTab(page,'PROFILE');await page.getByRole('button',{name:'Large reading text',exact:true}).click();
    await openTopic(page,'CHAPTERS');await page.locator('.cw-chapter-tile').first().click();
    const large=await page.locator('.cw-reader-body p').first().evaluate(element=>parseFloat(getComputedStyle(element).fontSize));assert.ok(large>=19);
    await page.screenshot({path:path.join(screenshots,'w2-reader-mobile.png')});
    await navigateTab(page,'PROFILE');await page.getByRole('button',{name:'Small reading text',exact:true}).click();
    await openTopic(page,'CHAPTERS');await page.locator('.cw-chapter-tile').first().click();
    const small=await page.locator('.cw-reader-body p').first().evaluate(element=>parseFloat(getComputedStyle(element).fontSize));assert.ok(small<large);
    await navigateTab(page,'PROFILE');await page.getByRole('button',{name:'Medium reading text',exact:true}).click();
    checks.push('Saved small/medium/large reading setting changes actual lesson text size');
    await page.locator('.cw-topbar-logout').click();await page.getByRole('button',{name:'LOGIN',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('cw.authToken')),'');
    checks.push('Mobile topbar logout clears the learner session without opening Profile');

    // A valid login must survive a partial dashboard failure, including reload.
    let broken=true;
    await page.route('**/api/admin/logs',async route=>broken?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Isolated panel outage'})}):route.continue());
    await signin(page,base,admin.email,admin.password,true);
    await page.getByRole('alert').filter({hasText:'You are signed in'}).waitFor();
    const token=await page.evaluate(()=>localStorage.getItem('chemwiz.admin.token'));assert.ok(token);
    await page.reload();await page.locator('.admin-mini-card').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('chemwiz.admin.token')),token);
    broken=false;await page.getByRole('button',{name:'Refresh',exact:true}).click();await page.locator('.error-box').waitFor({state:'hidden'});
    checks.push('Admin login/session survives a temporary dashboard panel outage and refresh recovers');
    await page.route('**/api/admin/test',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Isolated authority check outage'})}));
    await page.reload();await page.getByRole('button',{name:'Retry saved session',exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('chemwiz.admin.token')),token);
    await page.unroute('**/api/admin/test');await page.getByRole('button',{name:'Retry saved session',exact:true}).click();await page.locator('.admin-mini-card').waitFor();
    checks.push('Temporary admin authority/network failure retains the token and offers a safe retry');
    await page.getByRole('button',{name:'Users & Subscriptions',exact:true}).click();
    await page.locator('button').filter({hasText:/^View$/}).first().click();
    const modal=page.getByRole('dialog');await modal.waitFor();await page.keyboard.press('Tab');assert.ok(await modal.evaluate(element=>element.contains(document.activeElement)));
    await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'View');
    assert.equal(await page.locator('button').filter({hasText:/^View$/}).first().evaluate(element=>getComputedStyle(element).whiteSpace),'nowrap');
    await noPageOverflow(page,'Mobile admin dashboard');await page.screenshot({path:path.join(screenshots,'w2-admin-mobile.png')});
    checks.push('Admin filters/table reflow and user-details dialog supports keyboard/Escape/focus return');
    await page.route('**/api/admin/test',route=>route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({message:'Expired isolated token'})}));
    await page.reload();await page.locator('#admin-email').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('chemwiz.admin.token')),null);await page.unroute('**/api/admin/test');
    checks.push('A genuinely invalid/expired administrator token is removed');
    const diagnostics=await probeAdminSite(base,JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version);assert.ok(diagnostics.findings.every(item=>item.status==='PASS'));
    checks.push('Read-only live-site diagnostic probes classify version, origin, readiness and protected routes correctly');

    const gallery=await createGallery(root);
    await page.route('**/__w2-gallery/**',async route=>{
      const relative=new URL(route.request().url()).pathname.slice('/__w2-gallery/'.length)||'index.html';
      const filename=path.resolve(gallery.directory,relative);
      assert.ok(filename.startsWith(gallery.directory+path.sep));
      await route.fulfill({body:fs.readFileSync(filename),contentType:filename.endsWith('.js')?'application/javascript':filename.endsWith('.css')?'text/css':'text/html'});
    });
    for(const width of [320,1366]) {
      await page.setViewportSize({width,height:900});await page.goto(base+'/__w2-gallery/');
      await page.waitForFunction(count=>document.querySelectorAll('svg.cw-diagram[data-fitted=true]').length===count,gallery.count);
      const clipped=await page.locator('svg.cw-diagram').evaluateAll(svgs=>svgs.flatMap(svg=>{
        const view=svg.viewBox.baseVal,inverse=svg.getScreenCTM().inverse();
        const failures=[...svg.querySelectorAll('text')].filter(text=>{
          const box=text.getBBox(),matrix=inverse.multiply(text.getScreenCTM());
          return [[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]].some(([x,y])=>{const point=new DOMPoint(x,y).matrixTransform(matrix);return point.x<view.x-1||point.y<view.y-1||point.x>view.x+view.width+1||point.y>view.y+view.height+1;});
        });
        return failures.length?[svg.closest('article').dataset.diagramId]:[];
      }));
      assert.deepEqual(clipped,[],`Diagram labels outside their viewport at ${width}px`);await noPageOverflow(page,'Diagram gallery');
    }
    assert.equal(await page.locator('.cw-diagram-description').count(),gallery.count);
    const before=await page.locator('svg.cw-diagram').first().evaluate(element=>element.getBoundingClientRect().width);
    await page.getByRole('button',{name:'Enlarge diagram',exact:true}).first().click();
    const after=await page.locator('svg.cw-diagram').first().evaluate(element=>element.getBoundingClientRect().width);assert.ok(after>before);
    await page.screenshot({path:path.join(screenshots,'w2-diagrams-desktop.png')});
    checks.push(`All ${gallery.count} actual React diagrams fit every text label at mobile/desktop, expose text alternatives and can be enlarged`);
    assert.deepEqual(errors,[]);
    return {status:'PASS',checks,diagrams:gallery.count,diagramTextClipping:0,viewports:['320×640','390×844','768×1024','1366×768','1366×460','683×384 (200% layout equivalent)']};
  } finally {await context.close();}
}
