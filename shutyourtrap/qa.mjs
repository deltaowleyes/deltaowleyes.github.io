import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base='http://127.0.0.1:8765/shutyourtrap/';
const names=['edge','family','utility','expedition','intake','knowledge','journal','rustic','operator','outfitter'];
const pages=['home','services','trapping','snaring','sharpening','about','contact'];
const kinds=['hero','trapping','snaring','sharpening'];
const report={project:'Shut Your Trap',desktop:[],mobile:[],routes:0,assets:0,forms:0,privacy:false,directory:false,errors:[],timestamp:new Date().toISOString()};
mkdirSync('shutyourtrap/qa-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
let photoModeEnabled=false;
async function verifyPhotography(page,route){
 if(!photoModeEnabled||route==='contact')return;
 await page.waitForFunction(()=>{const im=document.querySelector('#content img[data-syt-photo]');return !im||(im.currentSrc.includes('/assets/photos/')&&im.complete&&im.naturalWidth>0)},null,{timeout:15000});
}

function assert(x,s){if(!x)throw new Error(s)}
async function visit(page,url){const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});assert(!response||response.ok(),'HTTP error '+url);await page.locator('#content').waitFor({timeout:15000});await page.waitForTimeout(150)}
async function imgLoaded(page){return page.locator('#content img').first().evaluate(async img=>{if(!img.complete)await new Promise((r,j)=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',j,{once:true})});return img.naturalWidth>0})}
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.addInitScript(()=>{try{localStorage.setItem('doe-analytics-consent-v1','rejected')}catch{}});
 const photoStatusResponse=await page.request.get(base+'assets/photos/status.json');
 assert(photoStatusResponse.ok(),'Photography activation status file is missing');
 const photoStatus=await photoStatusResponse.json();
 photoModeEnabled=photoStatus.enabled===true;
 report.photoModeEnabled=photoModeEnabled;
 if(photoModeEnabled){
   assert(Number.isInteger(photoStatus.image_count)&&photoStatus.image_count>=17&&photoStatus.image_count<=40&&Array.isArray(photoStatus.images)&&photoStatus.images.length===photoStatus.image_count,'Activated photo manifest has an invalid image count');
   for(const name of photoStatus.images){
     assert(/^[a-z0-9_]+\.webp$/.test(name),'Unsafe image filename '+name);
     const response=await page.request.get(base+'assets/photos/'+name);
     assert(response.ok(),'Imported image not found '+name);
     const mime=response.headers()['content-type']||'';
     assert(/webp|octet-stream/.test(mime),'Incorrect image MIME for '+name+': '+mime);
   }
   report.importedPhotos=photoStatus.image_count;
 }else{report.importedPhotos=0;}

 for(let i=0;i<10;i++){
  let u=base+'?template='+(i+1);
  for(const route of pages){
   await visit(page,u+'#'+route);
   await verifyPhotography(page,route);
   assert(await page.locator('body').getAttribute('class')==='site theme-'+names[i], 'Theme mismatch '+i+'/'+route);
   if(route!=='contact')assert(await imgLoaded(page),'Broken main image '+i+'/'+route);
   assert(await page.locator('.site-header').count()===1,'Missing navigation '+i+'/'+route);
   assert(await page.locator('a[href$="#contact"]').count()>0,'No contact link '+i+'/'+route);
   if(route==='home'){
    let structure=await page.locator('#content > section, #content > div').first().getAttribute('class');
    assert(structure&&structure.includes(names[i]),'Independent homepage structure missing '+i);
    await page.screenshot({path:'shutyourtrap/qa-artifacts/concept-'+String(i+1).padStart(2,'0')+'-desktop.png',fullPage:false});
   }
   if(route==='services')assert(await page.locator('.service-page-grid .service-card').count()===3,'Three service categories missing');
   if(['trapping','snaring','sharpening'].includes(route))assert(await page.locator('.detail-info h1').count()===1,'Missing service details '+route);
   if(route==='about')assert(await page.locator('.about-timeline>div').count()===3,'Missing owner verification placeholders');
   if(route==='contact'){
      assert(await page.locator('#demo-inquiry').count()===1,'Missing inquiry form');
      await page.locator('select[name="service"]').selectOption({label:'Sharpening Services'});
      await page.locator('input[name="name"]').fill('Sample');
      const method=[];
      page.on('request',req=>{if(req.method()!=='GET')method.push(req.method())});
      await page.locator('#demo-inquiry button[type="submit"]').click();
      assert((await page.locator('.form-status').innerText()).includes('no inquiry has been sent'),'Form must show no-send notice');
      assert(method.length===0,'Demo inquiry made unexpected non-GET request');
      report.forms++;
   }
   report.routes++;
  }
  report.desktop.push({template:i+1,style:names[i],routes:7,images:true,formSimulated:true});
 }
 for(let i=0;i<10;i++){
  for(const kind of kinds){
    const response=await page.request.get(base+'assets/'+String(i+1).padStart(2,'0')+'-'+kind+'.svg');
    assert(response.ok(),'Image asset missing '+i+'/'+kind);
    const body=await response.text();
    assert(body.includes('<svg')&&!body.includes('<script'),'Invalid or unsafe SVG '+i+'/'+kind);
    report.assets++;
  }
 }
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await mobile.addInitScript(()=>{try{localStorage.setItem('doe-analytics-consent-v1','rejected')}catch{}});
 for(let i=0;i<10;i++){
   await visit(mobile,base+'?template='+(i+1)+'#home');
   await verifyPhotography(mobile,'home');
   const metrics=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
   const offenders=await mobile.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+5).slice(0,25).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,70),text:(e.textContent||'').trim().slice(0,55),scroll:e.scrollWidth,client:e.clientWidth,overflow:getComputedStyle(e).overflowX})));assert(metrics.scroll<=metrics.width+8,'Mobile overflow template '+(i+1)+': '+JSON.stringify(metrics)+' offenders: '+JSON.stringify(offenders));
   let toggle=mobile.locator('#menu-toggle');
   assert(await toggle.isVisible(),'Mobile menu toggle hidden template '+i);
   await toggle.click();
   assert(await mobile.locator('#mobile-menu').isVisible(),'Mobile menu did not open '+i);
   await toggle.click();
   assert(await mobile.locator('#mobile-menu').isHidden(),'Mobile menu did not close '+i);
   await mobile.screenshot({path:'shutyourtrap/qa-artifacts/concept-'+String(i+1).padStart(2,'0')+'-mobile.png',fullPage:false});
   report.mobile.push({template:i+1,viewport:390,overflow:false,menu:true});
 }
 // Additional narrow / tablet breakpoints with real photographs and headline geometry checks.
 report.extraResponsive=[];
 for(const width of [320,768]){
   const responsive=await browser.newPage({viewport:{width,height:900},isMobile:width===320,hasTouch:width===320});
   await responsive.addInitScript(()=>{try{localStorage.setItem('doe-analytics-consent-v1','rejected')}catch{}});
   for(let i=0;i<10;i++){
     await visit(responsive,base+'?template='+(i+1)+'#home');
     await verifyPhotography(responsive,'home');
     const extent=await responsive.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
     assert(extent.scroll<=extent.width+8,'Responsive horizontal overflow '+width+' template '+(i+1)+': '+JSON.stringify(extent));
     if(i===8){
       const wraps=await responsive.locator('.operator-hero h1 em').evaluate(el=>el.getClientRects().length);
       assert(wraps===1,'SHARPENING headline wraps mid-word at width '+width);
     }
     if(width===320)await responsive.screenshot({path:'shutyourtrap/qa-artifacts/concept-'+String(i+1).padStart(2,'0')+'-mobile-320.png',fullPage:false});
     report.extraResponsive.push({template:i+1,width,photoMode:photoModeEnabled,overflow:false});
   }
   await responsive.close();
 }
 const gallery=await browser.newPage({viewport:{width:1440,height:900}});
 await gallery.goto(base,{waitUntil:'domcontentloaded'});
 await gallery.locator('.dir-card').first().waitFor();
 assert(await gallery.locator('.dir-card').count()===10,'Expected ten gallery previews');
 assert(await gallery.locator('.preview-frame iframe').count()===10,'Ten live iframe previews missing');
 assert(await gallery.locator('.dir-card .dir-open').count()===10,'Ten open links missing');
 report.directory=true;
 const entry=await page.request.get(base);
 const text=await entry.text();
 assert(text.includes('/assets/privacy-consent.js')&&text.includes('/assets/privacy-consent.css'),'Privacy scripts removed');
 report.privacy=true;
 writeFileSync('shutyourtrap/qa-artifacts/results.json',JSON.stringify(report,null,2));
 console.log('SHUT YOUR TRAP QA PASS: '+report.routes+' routes, '+report.assets+' original assets, '+report.mobile.length+' mobile designs, '+report.forms+' demo forms, 10 gallery previews, privacy scripts intact.');
}catch(error){
 report.errors.push(String(error));writeFileSync('shutyourtrap/qa-artifacts/results.json',JSON.stringify(report,null,2));
 console.error('SHUT YOUR TRAP QA FAILURE:',error);process.exitCode=1;
}finally{await browser.close()}
