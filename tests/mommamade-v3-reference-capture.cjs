/* Capture reference and candidate screenshots; blocked sources are reported as UNVERIFIED, not matches. */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const sources=[
 ['Atelier Ledger','https://www.heathceramics.com/'],
 ['Picnic Club','https://www.baggu.com/'],
 ['Utility Index','https://packagefreeshop.com/'],
 ['Garden Folio','https://www.blockshoptextiles.com/'],
 ['Pattern Studio','https://riflepaperco.com/'],
 ['Tidy Counter','https://www.muji.us/'],
 ['Maker Field Notes','https://schoolhouse.com/'],
 ['Weekend Market','https://www.papier.com/'],
 ['Quiet Catalogue','https://grovemade.com/'],
 ['Workshop Proof','https://oceanbottle.co/']
];
const base=process.env.MOMMA_V3_BASE_URL||'http://127.0.0.1:8765/mommamade/v3/';
const folder='artifacts/mommamade-v3/reference-comparisons';
fs.mkdirSync(folder,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const report=[];let localFailures=0;
 for(let i=0;i<sources.length;i++){
  const [name,reference]=sources[i],id=String(i+1).padStart(2,'0');
  for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const item={candidate:i+1,name,device,reference,candidate_capture:'not attempted',reference_capture:'not attempted',fidelity:'NOT ASSESSED'};
   const local=await browser.newPage({viewport:{width,height}});
   try{
    const response=await local.goto(base+'?template='+(i+1)+'#home',{waitUntil:'domcontentloaded',timeout:14000});
    if(!response||response.status()!==200)throw Error('candidate response '+(response&&response.status()));
    await local.locator('.hero').waitFor({timeout:7000});
    await local.screenshot({path:path.join(folder,id+'-'+device+'-candidate.png'),fullPage:false,timeout:12000});
    item.candidate_capture='captured';
   }catch(e){item.candidate_capture='FAILED: '+String(e.message).slice(0,150);localFailures++}
   await local.close();
   const ref=await browser.newPage({viewport:{width,height}});
   try{
    const response=await ref.goto(reference,{waitUntil:'domcontentloaded',timeout:12000});
    if(!response||response.status()>=400)throw Error('reference response '+(response&&response.status()));
    await ref.screenshot({path:path.join(folder,id+'-'+device+'-reference.png'),fullPage:false,timeout:10000});
    item.reference_capture='captured';
   }catch(e){item.reference_capture='UNVERIFIED: '+String(e.message).slice(0,150)}
   await ref.close();
   report.push(item);console.log(id+' '+device+' candidate '+item.candidate_capture+' reference '+item.reference_capture);
  }
 }
 await browser.close();
 fs.writeFileSync(path.join(folder,'reference-capture-report.json'),JSON.stringify({notice:'Reference screenshots are provided for human judgment. Their presence does not prove visual similarity or authorize copying third-party content.',report},null,2));
 if(localFailures)process.exitCode=1;
})().catch(e=>{console.error('Reference capture failed',e);process.exitCode=1});
