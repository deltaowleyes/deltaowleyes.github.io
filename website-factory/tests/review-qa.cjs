"use strict";
/* Independent integrated-candidate accessibility and security checks.
 * Axe WCAG 2.x: automated scan only, not full accessibility certification.
 */
const {chromium}=require("playwright");
const AxeBuilder=require("@axe-core/playwright").default;
const fs=require("node:fs"), assert=require("node:assert/strict"),path=require("node:path");
const reg=JSON.parse(fs.readFileSync("website-factory/candidates.json","utf8"));
const output="website-factory/qa-artifacts";
fs.mkdirSync(output,{recursive:true});
(async()=>{
 assert.equal(reg.candidates.length,10,"Exactly ten registered candidates required");
 assert.equal(new Set(reg.candidates.map(x=>x.anatomy)).size,10,"Unique design direction identifiers required");
 const browser=await chromium.launch({headless:true});
 const report={base:reg.review_base_main_sha,mode:"all-ten-a11y-review",results:[],violations:[],pass:false};
 try {
   for(const c of reg.candidates) {
     const page=await browser.newPage({viewport:{width:1440,height:900}});
     await page.addInitScript(()=>{try{localStorage.setItem("doe-analytics-consent-v1","rejected")}catch{}});
     const url="http://127.0.0.1:8765/"+c.path;
     const response=await page.goto(url,{waitUntil:"load",timeout:25000});
     assert.equal(response?.status(),200,c.slug+" HTTP error");
     const landmarks=await page.evaluate(()=>({
       lang:document.documentElement.lang,
       title:document.title,
       main:document.querySelectorAll("main").length,
       h1:document.querySelectorAll("h1").length,
       skip:!!document.querySelector('a.skip[href="#main"]'),
       forms:document.querySelectorAll("form,input,iframe").length,
       links:[...document.querySelectorAll('a[href^="#"]')].map(a=>({text:a.textContent.trim(),href:a.getAttribute("href")})),
       images:[...document.querySelectorAll("img")].map(x=>({alt:x.alt,src:x.getAttribute("src")}))
     }));
     assert.equal(landmarks.lang,"en",c.slug+" document lang");
     assert.equal(landmarks.main,1,c.slug+" main landmarks");
     assert.equal(landmarks.h1,1,c.slug+" h1 count");
     assert.ok(landmarks.skip,c.slug+" skip navigation");
     assert.equal(landmarks.forms,0,c.slug+" unexpected input/form/iframe");
     assert.ok(landmarks.links.every(l=>l.text && l.href && l.href.length>1),c.slug+" unlabeled anchor");
     for(const l of landmarks.links) assert.ok(await page.locator(l.href).count(),c.slug+" missing linked anchor "+l.href);
     assert.ok(landmarks.images.every(x=>x.alt!==null),c.slug+" missing alt");
     await page.keyboard.press("Tab");
     const first=await page.evaluate(()=>({tag:document.activeElement?.tagName,cls:document.activeElement?.className}));
     assert.ok(first.tag==="A"&&String(first.cls).includes("skip"),c.slug+" first tab must reach skip link: "+JSON.stringify(first));
     const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
     const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.slice(0,6).map(n=>({target:n.target,summary:n.failureSummary?.slice(0,300)}))}));
     report.results.push({slug:c.slug,pass:violations.length===0,landmarks,axeViolations:violations});
     if(violations.length)report.violations.push({slug:c.slug,violations});
     console.log(c.slug,violations.length?"AXE VIOLATIONS "+JSON.stringify(violations.map(v=>v.id)):"AXE PASS");
     await page.close();
   }
   report.pass=report.violations.length===0;
   fs.writeFileSync(path.join(output,"accessibility-results.json"),JSON.stringify(report,null,2));
   assert.ok(report.pass,"Accessibility violations in "+report.violations.map(x=>x.slug).join(", "));
   console.log("PASS integrated automated WCAG rules, keyboard skip link and no live forms: ten candidates");
 } finally {await browser.close()}
})().catch(e=>{console.error("INTEGRATED REVIEW FAILED:",e);process.exitCode=1;});
