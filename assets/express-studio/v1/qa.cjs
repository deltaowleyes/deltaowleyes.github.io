/* BAKE EXPRESS MASTER STANDARD 1.0: real Chromium acceptance
 * Six immutable studio headers, six project designs, 36 screenshots, gallery
 * navigation, preview modal, keyboard, image loads, privacy and responsiveness.
 */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const ROOT='http://127.0.0.1:8765';
const SITE='/shutyourtrap/express/';
const WIDTHS=[320,390,500,768,1024,1440];
const ASSETS=JSON.parse(fs.readFileSync('studio-sandbox/header-restoration-manifest.json','utf8')).assets;
const HEADERS=Object.fromEntries(ASSETS.filter(x=>/^header-\d+\.webp$/.test(x.file)).map(x=>[x.file,x]));
const OUTPUT='artifacts/express-master-standard';
fs.mkdirSync(OUTPUT,{recursive:true});
async function loadImages(page){
 await page.evaluate(async()=>{
  for(const i of document.images)i.loading='eager';
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));
 });
}
function validateHeader(page,width){
 return page.locator('.site-header picture img').evaluate((img,w)=>({
  src:img.currentSrc,
  naturalWidth:img.naturalWidth,
  naturalHeight:img.naturalHeight,
  clientWidth:img.getBoundingClientRect().width,
  responsiveOptions:img.parentNode.querySelectorAll('source').length
 }),width);
}
async function run(){
 for(const width of WIDTHS){
  const name='header-'+width+'.webp';
  const approved=HEADERS[name];
  assert.ok(approved,'Canonical restored header missing from source manifest: '+name);
  const bytes=fs.readFileSync('studio-sandbox/'+name);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),approved.sha256,'Canonical master header image changed: '+name);
 }
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[];
 try{
  for(const width of WIDTHS){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,permissions:[],serviceWorkers:'block'});
   const page=await context.newPage();
   const errors=[],analytics=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('request',request=>{if(/googletagmanager|google-analytics|doubleclick/i.test(request.url()))analytics.push(request.url());});
   const res=await page.goto(ROOT+SITE,{waitUntil:'networkidle',timeout:30000});
   await page.locator('.family').first().waitFor({timeout:12000});
   assert.equal(res.status(),200,'landing HTTP 200');
   assert.equal(await page.locator('.family').count(),6,'exactly six design cards');
   assert.equal(await page.locator('.family-art img.desktop').count(),6,'six desktop visual previews');
   assert.equal(await page.locator('.family-art img.mobile').count(),6,'six mobile visual previews');
   assert.equal(await page.locator('iframe').count(),0,'no live template iframe');
   await loadImages(page);
   const header=await validateHeader(page,width);
   assert.ok(header.src.endsWith('/studio-sandbox/header-'+width+'.webp'),width+' uses exactly canonical header '+header.src);
   assert.equal(header.naturalWidth,HEADERS['header-'+width+'.webp'].width,'canonical header original width');
   assert.equal(header.naturalHeight,HEADERS['header-'+width+'.webp'].height,'canonical header original height');
   assert.equal(header.responsiveOptions,5,'header picture exact responsive sources');
   const thumbs=await page.locator('.family-art img').evaluateAll(es=>es.map(i=>({src:i.currentSrc,ok:i.complete&&i.naturalWidth>0})));
   assert.ok(thumbs.every(i=>i.ok),width+' all 12 template screenshots visible');
   const hrefs=await page.locator('.family').evaluateAll(es=>es.map(a=>a.getAttribute('href')));
   assert.equal(new Set(hrefs).size,6,'six unique gallery destinations');
   assert.ok(hrefs.every(h=>h.startsWith(SITE+'previews/')),'all destinations project-scoped');
   let overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert.ok(overflow<=2,width+' landing no overflow: '+overflow);
   const reject=page.locator('#doe-reject');
   if(await reject.count() && await reject.first().isVisible()){
    await reject.first().click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('doe-analytics-consent-v1')),'rejected','consent rejection stored');
   }
   assert.deepEqual(analytics,[],'no analytics traffic before or after rejection');
   await page.screenshot({path:path.join(OUTPUT,'landing-'+width+'.png'),animations:'disabled',fullPage:false});
   for(const href of hrefs){
    const result=await page.goto(ROOT+href,{waitUntil:'networkidle',timeout:30000});
    assert.equal(result.status(),200,href+' HTTP 200');
    await page.locator('.shot').first().waitFor({timeout:12000});
    await loadImages(page); // Lazy full-page screenshots need intrinsic dimensions before interaction.
    assert.equal(await page.locator('.shot').count(),6,href+' six preview shots');
    assert.equal(await page.locator('iframe').count(),0,'no iframe in screenshot preview');
    const h=await validateHeader(page,width);
    assert.ok(h.src.endsWith('/studio-sandbox/header-'+width+'.webp'),href+' canonical responsive header');
    assert.equal(h.naturalWidth,HEADERS['header-'+width+'.webp'].width,href+' header original width');
    assert.equal(h.naturalHeight,HEADERS['header-'+width+'.webp'].height,href+' header original height');
    overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=2,href+' @ '+width+' no overflow: '+overflow);
    const inquiry=await page.locator('#inquire').getAttribute('href');
    assert.ok(inquiry.startsWith('mailto:'),'inquiry requires explicit email handoff');
    assert.ok(/SYT-EX-0[1-6]/.test(decodeURIComponent(inquiry)),href+' correct selection ID');
    assert.equal(await page.locator('form').count(),0,'no silently submitting form');
    const shots=await page.locator('.shot img').evaluateAll(es=>es.map(i=>i.getAttribute('src')));
    for(const sw of WIDTHS)assert.ok(shots.some(src=>src.endsWith('-'+sw+'.jpg')),href+' image at '+sw);
    // The shared modal opens a real screenshot, responds to arrow keys and
    // restores focus to the triggering button when Escape closes it.
    const trigger=page.locator('.shot button[data-width="500"]');
    await trigger.click();
    assert.equal(await page.locator('#enlarge').evaluate(e=>e.open),true,'modal opens');
    assert.ok((await page.locator('#bigshot').getAttribute('src')).endsWith('-500.jpg'),'500px image selected');
    await page.keyboard.press('ArrowRight');
    assert.ok((await page.locator('#bigshot').getAttribute('src')).endsWith('-768.jpg'),'arrow navigates to 768');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#enlarge').evaluate(e=>e.open),false,'Escape closes modal');
    assert.equal(await trigger.evaluate(e=>document.activeElement===e),true,'focus restored');
    if(width===390||width===1440){
     const slug=href.split('/').filter(Boolean).pop();
     await page.screenshot({path:path.join(OUTPUT,slug+'-'+width+'.png'),animations:'disabled',fullPage:false});
    }
    results.push({width,route:href,pass:true,header:h.src});
   }
   assert.deepEqual(errors,[],'no JavaScript page errors');
   assert.deepEqual(analytics,[],'no analytics during screenshots');
   await context.close();
  }
  // Check actual JPEG assets at every canonical width, including newly added 500.
  const ctx=await browser.newContext();
  const page=await ctx.newPage();
  const first=await page.goto(ROOT+SITE,{waitUntil:'networkidle'});
  assert.equal(first.status(),200);
  const hrefs=await page.locator('.family').evaluateAll(es=>es.map(a=>a.getAttribute('href')));
  const slugs=hrefs.map(s=>s.split('/').filter(Boolean).pop());
  for(const slug of slugs)for(const w of WIDTHS){
   const u=ROOT+SITE+'shots/'+slug+'-'+w+'.jpg';
   const response=await page.request.get(u);
   assert.equal(response.status(),200,u+' exists');
   const bytes=await response.body();
   assert.ok(bytes.length>2000&&bytes[0]===0xff&&bytes[1]===0xd8,u+' is JPEG');
  }
  await ctx.close();
  // Integration guard: Momma Made now shares this EXACT studio.js and studio.css.
  // Its published candidate screenshots must remain accessible when a new
  // studio adopts or adjusts the universal master header.
  const mommaProof=[];
  for(const width of WIDTHS){
   const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(String(error)));
   const response=await page.goto(ROOT+'/mommamade/studio/',{waitUntil:'networkidle',timeout:30000});
   await page.locator('.family').first().waitFor({timeout:12000});
   assert.equal(response.status(),200,'Momma Made landing HTTP 200');
   assert.equal(await page.locator('.family').count(),6,'Momma Made six identical-layout gallery cards');
   const h=await validateHeader(page,width);
   const asset=HEADERS['header-'+width+'.webp'];
   assert.ok(h.src.endsWith('/studio-sandbox/header-'+width+'.webp'),'Momma Made same restored header at '+width);
   assert.equal(h.naturalWidth,asset.width,'Momma Made canonical header width');
   assert.equal(h.naturalHeight,asset.height,'Momma Made canonical header height');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'Momma Made no landing overflow');
   const href=await page.locator('.family').first().getAttribute('href');
   assert.ok(href.startsWith('/mommamade/studio/previews/'),'Momma Made first design destination');
   await page.goto(ROOT+href,{waitUntil:'networkidle'});
   await page.locator('.shot').first().waitFor({timeout:12000});
   assert.equal(await page.locator('.shot').count(),6,'Momma Made six full-page screenshot options');
   assert.equal(await page.locator('iframe').count(),0,'Momma Made no template iframe');
   const trigger=page.locator('.shot button[data-width="500"]');
   await trigger.focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#enlarge').evaluate(e=>e.open),true,'Momma Made screenshot modal');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#enlarge').evaluate(e=>e.open),false,'Momma Made Escape close');
   assert.deepEqual(errors,[],'Momma Made no client-side errors');
   mommaProof.push({width,header:h.src,pass:true});
   await context.close();
  }
  fs.writeFileSync(path.join(OUTPUT,'results.json'),JSON.stringify({pass:true,project:'Shut Your Trap',headers:WIDTHS,checkedRoutes:results.length,mommaRoutes:mommaProof.length,screenshotFiles:36,mommaProof,results},null,2)+'\n');
  console.log('PASS: six unchanged responsive headers, 6 design routes, 36 real JPEGs, 42 Shut Your Trap route/viewport combinations plus six Momma Made regression checks, modal, keyboard, privacy and no overflow.');
 }finally{await browser.close();}
}
run().catch(err=>{console.error('EXPRESS MASTER STANDARD FAIL',err);process.exitCode=1;});
