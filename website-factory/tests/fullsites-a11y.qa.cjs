"use strict";
/* Automated WCAG 2A/AA, 2.1 A/AA and skip-keyboard checks; not a complete accessibility certification. */
const {chromium}=require("playwright");
const AxeBuilder=require("@axe-core/playwright").default;
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const reg=JSON.parse(fs.readFileSync("website-factory/candidates.json","utf8"));
const routes=["index.html","shop.html","product.html","care.html","about.html","contact.html"];
const out="website-factory/qa-artifacts/fullsites";fs.mkdirSync(out,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true});
const report={pass:false,scans:[],violations:[],totalScans:0};
try{
 for(const c of reg.candidates){
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  await context.addInitScript(()=>{try{localStorage.setItem("doe-analytics-consent-v1","rejected")}catch{}});
  const page=await context.newPage();
  for(const route of routes){
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:width===390?844:900});
      const pathpart="website-factory/candidates/"+c.slug+"/"+route+(route==="product.html"?"?item=wraps":"");
      await page.goto("http://127.0.0.1:8765/"+pathpart,{waitUntil:"load",timeout:25000});
      await page.keyboard.press("Tab");
      const first=await page.evaluate(()=>({tag:document.activeElement?.tagName,className:document.activeElement?.className}));
      assert.ok(first.tag==="A"&&String(first.className).includes("f2-skip"),c.slug+" "+route+" "+width+" first tab is not skip link");
      const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
      const violations=axe.violations.map(x=>({id:x.id,impact:x.impact,help:x.help,nodes:x.nodes.slice(0,8).map(n=>({targets:n.target,summary:n.failureSummary?.slice(0,240)}))}));
      const record={slug:c.slug,route,width,violations};
      report.scans.push(record);report.totalScans++;
      if(violations.length)report.violations.push(record);
    }
  }
  await context.close();
  console.log("AXE CHECKED "+c.slug+" 12 route/viewport pairs");
 }
 report.pass=report.violations.length===0;
 fs.writeFileSync(path.join(out,"a11y-results.json"),JSON.stringify(report,null,2));
 if(!report.pass)throw new Error("WCAG automated violations in "+report.violations.map(x=>x.slug+" "+x.route+" "+x.width+"px: "+x.violations.map(z=>z.id).join(",")).join("; "));
 console.log("PASS FACTORY 2.1 AXE: 120 desktop/mobile WCAG rule scans, zero automated violations, keyboard skip for every route");
}finally{await browser.close()}
})().catch(err=>{console.error("FACTORY 2.1 AXE FAILURE",err);process.exitCode=1});
