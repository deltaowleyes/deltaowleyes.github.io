/* Screenshot evidence for side-by-side structural review; not a visual similarity score. */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const { chromium }=require("playwright");
const sources=[
 ["Sunroom Journal","https://togethernessdesign.com/"],
 ["Kitchen Parade","https://www.papier.com/"],
 ["The Linen Edit","https://grovemade.com/"],
 ["Sunday Picnic","https://loefflerrandall.com/"],
 ["Fresh Start Supply","https://packagefreeshop.com/"],
 ["The Maker Notebook","https://schoolhouse.com/"],
 ["Bloom & Fold","https://www.blockshoptextiles.com/"],
 ["No-Waste Studio","https://oceanbottle.co/"],
 ["Market Morning","https://abode-newyork.com/"],
 ["The Little Things","https://homesick.com/"]
];
const base=process.env.MOMMA_BASE_URL||"http://127.0.0.1:8765/mommamade/v2/";
const output="artifacts/mommamade-v2/reference-comparison";
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const report=[];
 for(let i=0;i<sources.length;i++){
   const [name,reference]=sources[i];
   const row={design:i+1,name,reference,local:"not checked",reference_status:"not checked",captured_at:new Date().toISOString()};
   const key=String(i+1).padStart(2,"0");
   for(const [device,width,height] of [["desktop",1440,900],["mobile",390,844]]){
     const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
     try{
       const res=await p.goto(base+"?template="+(i+1)+"#home",{waitUntil:"domcontentloaded",timeout:20000});
       if(!res||res.status()!==200)throw Error("local response "+(res&&res.status()));
       await p.locator(".hero").waitFor({timeout:8000});
       await p.screenshot({path:path.join(output,key+"-"+device+"-local.png"),fullPage:false});
       row.local="captured";
     }catch(e){row.local="FAILED "+String(e.message).slice(0,130);}
     await p.close();
     const refpage=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
     try{
       const res=await refpage.goto(reference,{waitUntil:"domcontentloaded",timeout:18000});
       if(!res||res.status()>=400)throw Error("reference response "+(res&&res.status()));
       await refpage.screenshot({path:path.join(output,key+"-"+device+"-reference.png"),fullPage:false,timeout:12000});
       if(row.reference_status==="not checked"||row.reference_status==="captured")row.reference_status="captured";
     }catch(e){row.reference_status="UNVERIFIED: "+String(e.message).slice(0,140);}
     await refpage.close();
   }
   report.push(row);
   console.log(key+" "+name+": local="+row.local+" reference="+row.reference_status);
 }
 await browser.close();
 fs.writeFileSync(path.join(output,"audit.json"),JSON.stringify({note:"Screenshots provide evidence for manual layout-fidelity review. They do not establish close similarity automatically.",results:report},null,2));
 if(report.some(x=>x.local!=="captured"))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
