// BAKE EXPRESS 1.0 — isolated Chromium acceptance check, no paid services.
const { chromium } = require('playwright');
const fs=require('node:fs'), assert=require('node:assert/strict');
const ROOT='http://127.0.0.1:8765/deltaexpress/';
const folders=['river-voice','modern-longhouse','accountability-ledger','northern-horizons','community-network','media-hub'];
const widths=[320,390,768,1440];
const artifacts='artifacts/deltaexpress';
fs.mkdirSync(artifacts,{recursive:true});
let browser,failures=[],tested=0;
function check(ok,msg){if(!ok){failures.push(msg);console.error('FAIL',msg)}else console.log('PASS',msg)}
async function run(){
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(let i=0;i<7;i++){
  const route=i===0?'':folders[i-1]+'/';
  for(const w of widths){
   const context=await browser.newContext({viewport:{width:w,height:w===1440?900:850},deviceScaleFactor:1,permissions:[]});
   const page=await context.newPage(),errors=[],analytics=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('request',r=>{if(/googletagmanager|google-analytics|doubleclick/.test(r.url()))analytics.push(r.url())});
   const response=await page.goto(ROOT+route,{waitUntil:'domcontentloaded',timeout:25000});
   await page.locator('.design-card').first().waitFor({timeout:15000});
   const cardCount=await page.locator('.design-card').count();
   check(response.status()===200,route+' @'+w+' status 200');
   check(cardCount===6,route+' @'+w+' six cards, got '+cardCount);
   const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
   check(dims.scroll<=dims.client+3,route+' @'+w+' no overflow ('+JSON.stringify(dims)+')');
   check(errors.length===0,route+' @'+w+' no errors '+errors.join('|'));
   await page.waitForTimeout(300);
   check(analytics.length===0,route+' @'+w+' no analytics before consent');
   if((w===390||w===1440)){
     await page.screenshot({path:artifacts+'/'+(route.replace('/','')||'home')+'-'+w+'.png',fullPage:true});
   }
   await context.close(); tested++;
  }
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(ROOT,{waitUntil:'domcontentloaded'});
 await page.locator('.family-card').first().getByRole('button',{name:/Open desktop and mobile preview/}).click();
 check(await page.locator('#preview-dialog').evaluate(e=>e.open),'main family preview opens');
 check(await page.locator('#modal-desktop iframe').count()===1 && await page.locator('#modal-mobile iframe').count()===1,'desktop/mobile previews both present');
 await page.locator('#preview-dialog').screenshot({path:artifacts+'/modal-desktop-mobile.png'});
 await page.keyboard.press('Escape');
 check(!(await page.locator('#preview-dialog').evaluate(e=>e.open)),'Escape closes preview');
 await page.locator('.family-card').first().getByRole('link',{name:/Explore 6 designs/}).click();
 await page.waitForURL('**/deltaexpress/river-voice/');
 check((await page.locator('.variation-card').count())===6,'family navigation reveals six variations');
 await page.locator('.variation-card').nth(3).getByRole('button',{name:/Choose this design/}).click();
 check(await page.locator('#inquiry-dialog').evaluate(e=>e.open),'inquiry dialog opens');
 const text=await page.locator('#chosen-design').innerText();
 check(text.includes('EX-104')&&text.includes('Minimal Journal'),'correct fourth design encoded in form: '+text);
 await page.locator('input[name="name"]').fill('QA Example');
 await page.locator('input[name="email"]').fill('qa@example.test');
 await page.locator('input[name="project"]').fill('Sample project');
 await page.locator('textarea[name="details"]').fill('Need a six page website for testing.');
 await page.locator('#copy-inquiry').click();
 await page.screenshot({path:artifacts+'/inquiry.png'});
 check((await page.locator('#inquiry-status').innerText()).length>0,'copy feedback visible');
 check(errors.length===0,'interaction tests no page errors '+errors.join('|'));
 await ctx.close();
 console.log('CHECKED',tested,'route/viewport combinations','FAILURES',failures.length);
 if(failures.length) process.exitCode=1;
}
run().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();});
