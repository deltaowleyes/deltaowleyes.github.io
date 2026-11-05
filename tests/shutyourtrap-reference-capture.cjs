/* Capture source/current pairs for manual originality-safe fidelity review. */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const sources=[
 ["Service-First Sharp Edge","https://www.stoneandstrop.ca/"],
 ["Trapline Family Business","https://www.dambeaver.ca/"],
 ["Utility Supply Board","https://www.vwcsupplies.com/"],
 ["Expedition Heritage","https://shackleton.com/en-ca"],
 ["Sharpening Intake Flow","https://ca.leatherman.com/pages/sharpening"],
 ["Knowledge + Workshop","https://tormek.com/en"],
 ["Trapline Journal","https://www.wolftrapping.com/"],
 ["Modern Rustic Tradesman","https://us.helle.com/"],
 ["Bold Utility Operator","https://www.worksharptools.com/"],
 ["Heritage Outfitter Lite","https://www.benchmade.com/pages/lifesharp"]
];
const base=process.env.SHUT_BASE_URL||"http://127.0.0.1:8765/shutyourtrap/";
const out="artifacts/shutyourtrap/reference-comparison";
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const records=[];
 for(let i=0;i<sources.length;i++){
  const [name,reference]=sources[i];
  const id=String(i+1).padStart(2,"0");
  const record={index:i+1,name,reference,local:"unverified",source:"unverified"};
  for(const [device,width,height] of [["desktop",1440,900],["mobile",390,844]]){
    const local=await browser.newPage({viewport:{width,height}});
    try{
      const response=await local.goto(base+"?template="+(i+1)+"#home",{waitUntil:"domcontentloaded",timeout:20000});
      if(!response||response.status()!==200)throw Error("HTTP "+(response&&response.status()));
      await local.locator(".site-header").waitFor({timeout:8000});
      await local.screenshot({path:path.join(out,id+"-"+device+"-local.png"),fullPage:false});
      record.local="captured";
    }catch(e){record.local="FAILED: "+String(e.message).slice(0,130)}
    await local.close();
    const remote=await browser.newPage({viewport:{width,height}});
    try{
      const response=await remote.goto(reference,{waitUntil:"domcontentloaded",timeout:18000});
      if(!response||response.status()>=400)throw Error("HTTP "+(response&&response.status()));
      await remote.screenshot({path:path.join(out,id+"-"+device+"-reference.png"),fullPage:false,timeout:13000});
      if(record.source==="unverified"||record.source==="captured")record.source="captured";
    }catch(e){record.source="UNVERIFIED: "+String(e.message).slice(0,130)}
    await remote.close();
  }
  records.push(record);
  console.log(id+" "+name+": "+record.local+"; inspiration "+record.source);
 }
 fs.writeFileSync(path.join(out,"audit.json"),JSON.stringify({note:"Captures for human design review; not a numerical or automatic similarity claim.",records},null,2));
 await browser.close();
 if(records.some(r=>r.local!=="captured"))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
