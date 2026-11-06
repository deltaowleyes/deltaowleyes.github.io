import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base='https://www.deltaowleyes.ca/shutyourtrap/';
const PHOTO_COUNT=17;
const TOTAL_TEMPLATES=10;
const results={target:base,timestamp:new Date().toISOString(),photos:[],checks:[],screenshots:[],issues:[],success:false};
mkdirSync('shutyourtrap/live-qa-artifacts',{recursive:true});
const assert=(pass,msg)=>{if(!pass)throw new Error(msg)};
const hold=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function requestWithTimeout(url){
  const controller=new AbortController();
  const t=setTimeout(()=>controller.abort(),20000);
  try{return await fetch(url,{cache:'no-store',signal:controller.signal,headers:{'User-Agent':'DeltaOwlEyes-ShutYourTrap-PhotoQA/1.0'}});}
  finally{clearTimeout(t)}
}
async function waitForLivePhotos(){
  for(let attempt=0;attempt<18;attempt++){
    try{
      const [page,status]=await Promise.all([requestWithTimeout(base+'?photo-qa='+attempt),requestWithTimeout(base+'assets/photos/status.json?photo-qa='+attempt)]);
      if(page.ok&&status.ok){
        const manifest=await status.json();
        const html=await page.text();
        if(manifest.enabled===true&&manifest.image_count===PHOTO_COUNT&&Array.isArray(manifest.images)&&manifest.images.length===PHOTO_COUNT&&html.includes('site.js')){
          return {manifest,html};
        }
      }
      console.log('Waiting for the active Pages deployment, attempt '+(attempt+1));
    }catch(e){console.log('Live Pages not yet reachable: '+String(e))}
    if(attempt<17)await hold(15000);
  }
  throw new Error('Public www.deltaowleyes.ca did not return the activated 17-photo manifest and expected homepage within the deployment grace window.');
}
let browser;
try{
  const {manifest,html}=await waitForLivePhotos();
  assert(html.includes('privacy-consent.js')&&html.includes('privacy-consent.css'),'Existing privacy assets not linked on public page');
  assert(new Set(manifest.images).size===17,'Manifest has duplicate filenames');
  results.liveManifest={enabled:manifest.enabled,image_count:manifest.image_count};
  for(const filename of manifest.images){
    assert(/^[a-z0-9_]+\.webp$/.test(filename),'Unexpected photo filename '+filename);
    const response=await requestWithTimeout(base+'assets/photos/'+filename+'?photo-qa=1');
    assert(response.ok,'Public photo HTTP '+response.status+': '+filename);
    const data=Buffer.from(await response.arrayBuffer());
    assert(data.length>10000&&data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP','Public photo is not a valid WebP: '+filename);
    results.photos.push({filename,bytes:data.length,httpStatus:response.status});
  }
  browser=await chromium.launch({headless:true});
  for(const width of [320,390,768,1440]){
    const ctx=await browser.newContext({viewport:{width,height:width===320?740:900},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce'});
    const page=await ctx.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    for(let i=1;i<=TOTAL_TEMPLATES;i++){
      const target=base+'?template='+i+'#home';
      const response=await page.goto(target,{waitUntil:'domcontentloaded',timeout:30000});
      assert(response?.ok(),'Public concept '+i+' returned HTTP '+response?.status());
      await page.locator('#content h1').first().waitFor({timeout:15000});
      const first=page.locator('#content img[data-syt-photo]').first();
      assert(await first.count()>0,'Missing image node in concept '+i);
      await page.waitForFunction(()=>{const im=document.querySelector('#content img[data-syt-photo]');return !!im&&im.currentSrc.includes('/assets/photos/')},null,{timeout:15000});
      await first.scrollIntoViewIfNeeded();
      await first.evaluate(async im=>{if(!im.complete)await im.decode();});
      const state=await first.evaluate(im=>({src:im.currentSrc,w:im.naturalWidth,h:im.naturalHeight}));
      assert(state.w>0&&state.h>0&&state.src.endsWith('.webp'),'Photo decode failure template '+i+' width '+width);
      const dimensions=await page.evaluate(()=>({body:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
      assert(dimensions.body<=dimensions.width+8,'Public horizontal overflow: template '+i+' width '+width+' '+JSON.stringify(dimensions));
      if(i===9&&width<=390){
        const lineBoxes=await page.locator('.operator-hero h1 em').evaluate(el=>el.getClientRects().length);
        assert(lineBoxes===1,'SHARPENING headline splits at viewport '+width);
      }
      assert(errors.length===0,'Browser JavaScript errors '+i+' '+width+': '+errors.join(';'));
      await page.evaluate(()=>window.scrollTo(0,0));
      if(width===390||width===1440){
        const file='shutyourtrap/live-qa-artifacts/concept-'+String(i).padStart(2,'0')+'-'+width+'.png';
        await page.screenshot({path:file,fullPage:false});
        results.screenshots.push(file.split('/').pop());
      }
      results.checks.push({concept:i,viewport:width,photo:state.src.split('/').pop(),naturalWidth:state.w,overflow:false});
    }
    await ctx.close();
  }
  results.success=true;
  console.log('LIVE PHOTOGRAPHY QA PASS: 17/17 public WebP photos; 40 live desktop/mobile/tablet concept views; no horizontal overflow; headline intact; privacy links preserved');
}catch(e){
  results.issues.push(String(e));
  console.error('LIVE PHOTOGRAPHY QA FAILED: '+String(e));
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
  writeFileSync('shutyourtrap/live-qa-artifacts/report.json',JSON.stringify(results,null,2));
}
