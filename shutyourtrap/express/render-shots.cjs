/* Shut Your Trap EXPRESS: capture genuine full-page browser screenshots.
   Six distinct existing source themes × six CSS viewport widths = 36 JPEGs.
   Only screenshot files (not the runnable template source) are used by the EXPRESS gallery.
   Existing separately published demo pages are outside this gallery and remain public. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root='http://127.0.0.1:8765';
const output=path.join(__dirname,'shots');
const models=[
 ['sharp-edge',1],['family-trapline',2],['expedition',4],
 ['sharpening-flow',5],['field-journal',7],['bold-operator',9]
];
const widths=[320,390,768,1024,1280,1440];
fs.mkdirSync(output,{recursive:true});
const manifest={schema:1,project:'Shut Your Trap EXPRESS',captureType:'actual Chromium full-page JPEG',source:'Existing original Shut Your Trap website concepts',viewportWidths:widths,files:[]};
let count=0;
(async function run(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [slug,template] of models){
  for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:width<=390?850:900},deviceScaleFactor:1,serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   const url=root+'/shutyourtrap/?template='+template+'#home';
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response.status(),200,url+' must return 200');
   await page.locator('main#content').waitFor({timeout:12000});
   await page.waitForTimeout(1100); // allow verified photo-status upgrade and consent UI
   // Never bake the privacy-choice bar into a marketing screenshot. Exercise the
   // real Reject analytics control; this must not permit any analytics requests.
   const analyticsRequests=[];
   page.on('request',request=>{if(/googletagmanager|google-analytics|doubleclick/i.test(request.url()))analyticsRequests.push(request.url());});
   const reject=page.getByRole('button',{name:/Reject analytics/i});
   if(await reject.count() && await reject.first().isVisible()){
     await reject.first().click();
     await page.waitForTimeout(220);
   }
   assert.deepEqual(analyticsRequests,[],slug+' @ '+width+' no analytics after rejection');
   await page.evaluate(async()=>{
     document.querySelectorAll('img').forEach(x=>{x.loading='eager'; x.decoding='sync';});
     for(const y of [0,document.body.scrollHeight/2,document.body.scrollHeight]){
       window.scrollTo(0,y);
       await new Promise(done=>setTimeout(done,180));
     }
     window.scrollTo(0,0);
     await Promise.all([...document.images].map(img=>{
       if(img.complete)return Promise.resolve();
       return new Promise(done=>{img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});setTimeout(done,6500);});
     }));
   });
   await page.waitForTimeout(200);
   const state=await page.evaluate(()=>({
     horizontal:document.documentElement.scrollWidth-document.documentElement.clientWidth,
     images:[...document.images].map(i=>({src:i.currentSrc||i.src,ok:i.complete&&i.naturalWidth>0})),
     title:document.title
   }));
   assert.ok(state.horizontal<=4,slug+' @ '+width+' horizontal overflow '+state.horizontal);
   assert.ok(state.images.every(i=>i.ok),slug+' @ '+width+' broken images '+JSON.stringify(state.images.filter(i=>!i.ok)));
   assert.deepEqual(errors,[],slug+' @ '+width+' JS errors');
   const filename=slug+'-'+width+'.jpg',destination=path.join(output,filename);
   await page.screenshot({path:destination,type:'jpeg',quality:80,fullPage:true,animations:'disabled',timeout:30000});
   const data=fs.readFileSync(destination);
   assert.ok(data.length>2000,'screenshot is nonempty: '+filename);
   assert.equal(data[0],0xff,'JPEG signature: '+filename);
   manifest.files.push({filename,slug,template,width,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
   count++;
   console.log('CAPTURED',filename,data.length+' bytes',state.title);
   await context.close();
  }
 }
 const page=await browser.newPage({viewport:{width:390,height:820}});
 await page.goto(root+'/shutyourtrap/express/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.card').count(),6,'six cards');
 await page.locator('.card-btn').first().click();
 assert.equal(await page.locator('dialog[open]').count(),1,'preview dialog opens');
 assert.equal(await page.locator('.screen-btn').count(),6,'six viewport options');
 await page.locator('.screen-btn[data-width="1440"]').click();
 await page.locator('#capture:not([hidden])').waitFor({timeout:8000});
 const displayed=await page.locator('#capture').getAttribute('src');
 assert.equal(displayed,'/shutyourtrap/express/shots/sharp-edge-1440.jpg','selecting viewport chooses exact screenshot');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog[open]').count(),0,'Escape closes dialog');
 const ov=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert.ok(ov<=4,'gallery has no horizontal overflow at 390');
 await page.close();
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('PASS',count,'real screenshots + gallery interactions; 0 page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error('FAIL',e);process.exitCode=1;});
