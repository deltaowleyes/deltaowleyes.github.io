/* Momma Made V3 candidate-only browser audit. */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.MOMMA_V3_BASE_URL||'http://127.0.0.1:8765/mommamade/v3/';
const dir='artifacts/mommamade-v3/';fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 async function go(n,route){const r=await page.goto(base+'?template='+n+'#'+route,{waitUntil:'domcontentloaded',timeout:20000});assert.equal(r.status(),200,'HTTP '+n+' '+route);await page.locator('.mast').waitFor({timeout:9000})}
 async function geometry(where){const v=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));assert.ok(v.content<=v.viewport+2,where+' horizontal overflow '+JSON.stringify(v))}

 async function verifyPhoto(selector,label){
   const photos=await page.locator(selector).evaluateAll(async els=>Promise.all(els.map(async el=>{
     const css=getComputedStyle(el,'::before').backgroundImage!=='none'?getComputedStyle(el,'::before').backgroundImage:getComputedStyle(el).backgroundImage;
     if(!css||!css.startsWith('url('))return {ok:false,css};
     const src=css.slice(4,-1).replace(/^["']|["']$/g,'');
     const img=new Image();img.src=src;
     try{await img.decode();return {ok:img.naturalWidth>=500&&img.naturalHeight>=500,width:img.naturalWidth,height:img.naturalHeight};}
     catch(e){return {ok:false,error:String(e),src}}
   })));
   assert.ok(photos.length>0&&photos.every(x=>x.ok),label+' photo decode failure '+JSON.stringify(photos));
 }
 async function verifyTapTargets(label){
   const heights=await page.locator('.item-copy .action.subtle').evaluateAll(els=>els.map(el=>Math.round(el.getBoundingClientRect().height)));
   assert.equal(heights.length,4,label+' product links missing');
   assert.ok(heights.every(h=>h>=44),label+' product detail link below 44px '+JSON.stringify(heights));
 }
 const style=await page.request.get(base+'reference-fidelity-1-2.css');assert.equal(style.status(),200,'missing V3 source-fidelity stylesheet');
 const g=await page.goto(base,{waitUntil:'domcontentloaded'});assert.equal(g.status(),200);
 assert.equal(await page.locator('.gallery-card').count(),10,'gallery count');
 await verifyPhoto('.gallery-image','gallery');
 const altCount=await page.locator('a:not([href]),button:not([aria-label]):empty').count();
 assert.equal(altCount,0,'potential unlabeled/invalid interactive elements');
 await page.screenshot({path:dir+'gallery-desktop.png',fullPage:true});
 for(let n=1;n<=10;n++){
  for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844],['narrow',320,700],['tablet',768,1024],['laptop',1024,768]]){
   await page.setViewportSize({width,height});await go(n,'home');await geometry('design '+n+' '+device);
   assert.equal(await page.locator('.hero h1').count(),1);
   assert.equal(await page.locator('.products .item').count(),4);
   await verifyPhoto('.hero .visual','design '+n+' '+device);
   await verifyTapTargets('design '+n+' '+device);

   assert.equal(await page.locator('.browse-nav').count(),1,'design '+n+' missing reference-inspired category navigation');
   assert.ok(await page.locator('.browse-nav a[href]').count()>=3,'design '+n+' empty category navigation');
   const fidelityModules={3:'.reference-departments',4:'.reference-departments',5:'.pattern-browser',6:'.reference-departments',7:'.reference-departments',8:'.papier-edit'};
   if(fidelityModules[n]){
     const selector=fidelityModules[n];
     assert.equal(await page.locator(selector).count(),1,'design '+n+' missing reference section '+selector);
     const moduleStyle=await page.locator(selector).evaluate(el=>({visible:el.getBoundingClientRect().height>50,layout:getComputedStyle(el).display}));
     assert.ok(moduleStyle.visible,'design '+n+' hidden reference module');
     if(n===5)assert.equal(await page.locator('.pattern-grid .pattern-tile').count(),4,'pattern browsing needs four distinct concept pathways');
     if(n===8)assert.equal(await page.locator('.papier-edit nav a').count(),4,'editorial collections require four links');
     if([3,4,6,7].includes(n))assert.equal(await page.locator('.department-grid .department-card').count(),3,'source-aligned departments missing');
   }

   assert.equal(await page.locator('.browse-nav a').count()>=3,true,'missing category discovery nav '+n);
   const expected={3:['.utility-departments .department-card',3],4:['.garden-departments .department-card',3],5:['.pattern-browser .pattern-tile',4],6:['.muji-departments .department-card',3],7:['.schoolhouse-departments .department-card',3],8:['.papier-edit nav a',4]};
   if(expected[n]){const [selector,count]=expected[n];assert.equal(await page.locator(selector).count(),count,'reference merchandising '+n+' '+device);}
   const activeShop=await page.locator('.browse-nav a').first().getAttribute('href');
   assert.ok(activeShop.includes('?template='+n+'#shop'),'collection navigation wrong template '+n);
   if(device==='mobile'){
     await page.locator('[data-menu]').click();
     assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'true');
     assert.equal(await page.locator('#mobile-menu').isVisible(),true);
   }
   if(device==='mobile'||device==='desktop')await page.screenshot({path:dir+'design-'+String(n).padStart(2,'0')+'-'+device+'.png',fullPage:false});
  }
  await page.setViewportSize({width:1440,height:900});
  const routes=[['shop','.catalogue .item',4],['about','section.story',1],['care','.care-grid article',4],['contact','#demo-form',1],['product-1','.checkout:disabled',1],['product-2','.checkout:disabled',1],['product-3','.checkout:disabled',1],['product-4','.checkout:disabled',1]];
  for(const [route,selector,count] of routes){
   await go(n,route);assert.equal(await page.locator(selector).count(),count,'route '+n+' '+route);await geometry('route '+n+' '+route);
  }
  await go(n,'shop');await page.locator('[data-filter="Cleaning"]').click();
  assert.equal(await page.locator('.catalogue .item').count(),2);
  await page.locator('[data-filter="All"]').click();await page.locator('[data-search]').fill('Snack');
  assert.equal(await page.locator('.catalogue .item').count(),1);
  await go(n,'product-2');await page.locator('[data-mood="Neutral"]').click();
  assert.equal(await page.locator('#mood-text').innerText(),'Selected mood: Neutral');
  await go(n,'contact');await page.locator('#who').fill('Preview Only');
  await page.locator('#email').fill('qa@example.test');await page.locator('#message').fill('Demonstration');
  await page.locator('#demo-form button[type=submit]').click();
  assert.match(await page.locator('#form-status').innerText(),/no inquiry was sent or stored/i);
  console.log('PASS V3 design '+n+' 5 widths, 9 views and demo interactions');
 }
 for(let n=1;n<=10;n++)for(const prefix of ['hero','story']){
  const path=base+'../v2/images/'+prefix+'-'+String(n).padStart(2,'0')+'.webp';
  const res=await page.request.get(path);assert.equal(res.status(),200,path);
  assert.equal((await res.body()).toString('ascii',0,4),'RIFF');
 }
 for(let n=1;n<=4;n++){
  const res=await page.request.get(base+'../v2/images/product-'+String(n).padStart(2,'0')+'.webp');
  assert.equal(res.status(),200,'product image '+n);
 }
 assert.deepEqual(errors,[],'JavaScript console page errors');
 await browser.close();
 console.log('PASS all 10 candidate designs, 90 direct routes, 50 responsive checks, 21 screenshots, 24 existing images');
})().catch(e=>{console.error('MOMMA MADE V3 QA FAILED',e);process.exit(1)});
