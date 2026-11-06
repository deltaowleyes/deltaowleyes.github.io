"use strict";
/* Read-only local baseline capture. No public site deployment or external source-site scraping. */
const fs=require("node:fs"),path=require("node:path"),{chromium}=require("playwright");
const dir="website-factory/qa-artifacts/revision-comparison";fs.mkdirSync(dir,{recursive:true});
const refs={
v2:{status:"latest approved",selector:".site-header",names:["Sunroom Journal","Kitchen Parade","The Linen Edit","Sunday Picnic","Fresh Start Supply","The Maker Notebook","Bloom & Fold","No-Waste Studio","Market Morning","The Little Things"]},
v3:{status:"unapproved candidate",selector:".mast",names:["Atelier Ledger","Picnic Club","Utility Index","Garden Folio","Pattern Studio","Tidy Counter","Maker Field Notes","Weekend Market","Quiet Catalogue","Workshop Proof"]}
};
(async()=>{
const browser=await chromium.launch({headless:true});
const report={note:"Version comparison screenshots only: no reference-site parity or owner visual approval claimed.",snapshots:[],failures:[],captured:0,expected:40};
try{
for(const [rev,info] of Object.entries(refs)){
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
await ctx.addInitScript(()=>{try{localStorage.setItem("doe-analytics-consent-v1","rejected")}catch{}});
const page=await ctx.newPage();
for(let i=1;i<=10;i++){
for(const width of [1440,390]){
const name=rev+"-"+String(i).padStart(2,"0")+"-"+width+".jpg";
try{
await page.setViewportSize({width,height:width===390?844:900});
const response=await page.goto("http://127.0.0.1:8765/mommamade/"+rev+"/?template="+i+"#home",{waitUntil:"domcontentloaded",timeout:25000});
if(response&&response.status()!==200)throw Error("HTTP "+response.status());
if(!response&&new URL(page.url()).searchParams.get("template")!==String(i))throw Error("Unexpected same-document navigation "+page.url());
await page.locator(info.selector).first().waitFor({timeout:10000});
await page.locator("section.hero").first().waitFor({timeout:10000});
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:path.join(dir,name),type:"jpeg",quality:76,fullPage:true,animations:"disabled",timeout:20000});
report.snapshots.push({rev,design:i,title:info.names[i-1],width,status:"captured",file:name});report.captured++;
}catch(e){const failure={rev,design:i,width,message:String(e.message).slice(0,240)};report.failures.push(failure);report.snapshots.push({...failure,status:"not captured"});}
}}
await ctx.close();
}
}finally{await browser.close();}
fs.writeFileSync(path.join(dir,"comparison-results.json"),JSON.stringify(report,null,2));
console.log("V2/V3 VISUAL BASELINES",report.captured+"/"+report.expected,"captured, failures",report.failures.length);
for(const f of report.failures)console.log("BASELINE CAPTURE INCOMPLETE",JSON.stringify(f));
if(report.captured!==report.expected)process.exitCode=1;
})().catch(e=>{console.error("COMPARISON FAILED",e);process.exitCode=1});