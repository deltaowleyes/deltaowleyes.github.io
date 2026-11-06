"use strict";
/* Factory 2.1 full-site integration browser QA. Six routes x ten sites x six widths. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const reg=JSON.parse(fs.readFileSync("website-factory/candidates.json","utf8"));
const root="http://127.0.0.1:8765/";
const pages=["index.html","shop.html","product.html","care.html","about.html","contact.html"];
const widths=[320,390,768,1024,1440,1920];
const dir="website-factory/qa-artifacts/fullsites";
fs.mkdirSync(dir,{recursive:true});
const errors=[],report={suite:"factory2.1-fullsites",sites:[],routesChecked:0,widthChecks:0,screenshots:[],pass:false};
(async()=>{
 assert.equal(reg.candidates.length,10,"Exactly ten candidates required");
 assert.equal(new Set(reg.candidates.map(c=>c.anatomy)).size,10,"duplicate design fingerprints");
 const browser=await chromium.launch({headless:true});
 const navStructures=[],shopStructures=[],careStructures=[],aboutStructures=[],contactStructures=[];
 try{
  for(const c of reg.candidates){
   const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
   await context.addInitScript(()=>{try{localStorage.setItem("doe-analytics-consent-v1","rejected")}catch{}});
   const page=await context.newPage();
   const site={slug:c.slug,anatomy:c.anatomy,routes:[],screenshots:[]};
   const postRequests=[];
   page.on("request",r=>{if(r.method()!=="GET")postRequests.push({method:r.method(),url:r.url()})});
   page.on("pageerror",e=>errors.push(c.slug+": "+e.message));
   for(const route of pages){
    const local="website-factory/candidates/"+c.slug+"/"+route;
    assert.ok(fs.existsSync(local),c.slug+": missing "+route);
    const resp=await page.goto(root+local,{waitUntil:"load",timeout:20000});
    assert.equal(resp?.status(),200,c.slug+" "+route+" HTTP");
    assert.equal(await page.locator("main").count(),1,c.slug+" "+route+" landmarks");
    assert.equal(await page.locator("h1").count(),1,c.slug+" "+route+" one h1");
    assert.equal(await page.locator("main").getAttribute("data-anatomy"),c.anatomy,c.slug+" anatomy");
    assert.equal(await page.locator("nav[aria-label='Main navigation']").count(),1,c.slug+" navigation");
    assert.equal(await page.locator("form,iframe").count(),0,c.slug+" unexpected form or iframe");
    assert.ok((await page.locator(".f2-banner").innerText()).includes("Preview only"),c.slug+" missing preview notice");
    assert.equal(await page.locator("script[src*='privacy-consent.js']").count(),1,c.slug+" privacy integration");
    assert.ok((await page.locator("nav[aria-label='Main navigation'] a").count())>=5,c.slug+" navigation links");
    const links=await page.locator("nav[aria-label='Main navigation'] a").evaluateAll(els=>els.map(x=>x.getAttribute("href")));
    for(const link of links) assert.ok(fs.existsSync(path.join(path.dirname(local),link)),c.slug+": broken primary nav "+link);
    if(route==="index.html")navStructures.push(await page.locator("nav[aria-label='Main navigation']").evaluate(x=>x.innerHTML.replace(/Momma Made|Field Notes|Countertop Mosaic|The Daily Ledger|Still Life Studio|Ritual Route|White Space Works|Patchwork Press|Orbit Home|Pantry Atlas|A Letter Home/g,"")));
    if(route==="shop.html")shopStructures.push(await page.locator("[data-collection]").evaluate(x=>x.querySelector("[class^='f2-shop-'],[class*=' f2-shop-']")?.className));
    if(route==="care.html")careStructures.push(await page.locator(".f2-care-main").evaluate(x=>x.firstElementChild?.className));
    if(route==="about.html")aboutStructures.push(await page.locator(".f2-story-main").evaluate(x=>x.firstElementChild?.className));
    if(route==="contact.html")contactStructures.push(await page.locator(".f2-demo-contact").evaluate(x=>x.className));
    for(const width of widths){
      await page.setViewportSize({width,height:width===390?844:900});
      const dim=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
      assert.ok(dim.scroll<=dim.viewport+2,c.slug+" "+route+" "+width+"px overflows "+JSON.stringify(dim));
      report.widthChecks++;
      if((width===390||width===1440)&&["index.html","shop.html","contact.html"].includes(route)){
        const name=c.slug+"-"+route.replace(".html","")+"-"+width+".png";
        await page.screenshot({path:path.join(dir,name),animations:"disabled",fullPage:true});
        site.screenshots.push(name);report.screenshots.push(name);
      }
    }
    report.routesChecked++;site.routes.push(route);
   }
   // Native category filtering, search and accessible pressed state
   await page.setViewportSize({width:390,height:844});
   await page.goto(root+"website-factory/candidates/"+c.slug+"/shop.html",{waitUntil:"load"});
   assert.equal(await page.locator("[data-filter-item]:visible").count(),4,c.slug+" initial items");
   await page.locator("button[data-filter='Cleaning']").click();
   assert.equal(await page.locator("[data-filter-item]:visible").count(),2,c.slug+" Cleaning filter");
   assert.equal(await page.locator("button[data-filter='Cleaning']").getAttribute("aria-pressed"),"true",c.slug+" aria-pressed");
   await page.locator("button[data-filter='All']").click();
   await page.locator("[data-search]").fill("snack");
   assert.equal(await page.locator("[data-filter-item]:visible").count(),1,c.slug+" search");
   await page.goto(root+"website-factory/candidates/"+c.slug+"/product.html?item=cloths",{waitUntil:"load"});
   assert.equal(await page.locator("[data-product-view]:visible").count(),1,c.slug+" product selection");
   assert.equal(await page.locator("[data-product-view]:visible").getAttribute("data-product-view"),"cloths",c.slug+" product slug");
   await page.locator("[data-product-view]:visible button[data-mood='warm']").click();
   assert.equal(await page.locator("[data-product-view]:visible .f2-product-visual.mood-warm").count(),1,c.slug+" mood");
   await page.locator("[data-product-view]:visible details summary").click();
   assert.equal(await page.locator("[data-product-view]:visible details[open]").count(),1,c.slug+" disclosure");
   await page.goto(root+"website-factory/candidates/"+c.slug+"/contact.html",{waitUntil:"load"});
   await page.locator("[data-demo-send]").click();
   assert.match(await page.locator(".f2-demo-feedback").innerText(),/Please complete/i,c.slug+" invalid demo response");
   await page.locator("#demo-name").fill("Example Visitor");
   await page.locator("#demo-email").fill("test@example.test");
   await page.locator("#demo-message").fill("Demonstration only");
   await page.locator("[data-demo-send]").click();
   assert.match(await page.locator(".f2-demo-feedback").innerText(),/Nothing was sent, collected or stored/,c.slug+" demo safety");
   assert.equal(await page.locator("#demo-name").inputValue(),"",c.slug+" name must clear");
   assert.deepEqual(postRequests,[],c.slug+" unexpected network submission");
   report.sites.push(site);
   await context.close();
   console.log("PASS "+c.slug+" 6 pages, 36 viewport checks, 6 captures, filter/search/product/contact/demo-only");
  }
  assert.equal(new Set(navStructures).size,10,"Navigation markup repeats; all 10 must be structurally distinct");
  for(const [label,list] of [["shop",shopStructures],["care",careStructures],["about",aboutStructures],["contact",contactStructures]]){
    assert.equal(new Set(list).size,10,label+" design layout fingerprint repeats");
  }
  assert.deepEqual(errors,[],"Browser JavaScript errors");
  assert.equal(report.routesChecked,60);assert.equal(report.widthChecks,360);assert.equal(report.screenshots.length,60);
  report.pass=true;
  fs.writeFileSync(path.join(dir,"fullsite-results.json"),JSON.stringify(report,null,2));
  console.log("FACTORY 2.1 FULL SITES PASS: 60 views; 360 responsive viewport checks; 60 screenshots; 10 distinct nav and lower-page fingerprints");
 }finally{await browser.close()}
})().catch(err=>{fs.writeFileSync(path.join(dir,"fullsite-failure.txt"),String(err));console.error("FACTORY 2.1 FULL SITE FAILURE:",err);process.exitCode=1});
