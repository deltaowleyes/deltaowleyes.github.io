/* Website Factory 2.0 candidate visual QA (read-only, local or standard GitHub Actions).
 * Run: node website-factory/tests/qa.cjs --present|--all
 */
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const reg=JSON.parse(fs.readFileSync("website-factory/candidates.json","utf8"));
const root="http://127.0.0.1:8765/";
const all=process.argv.includes("--all");
const selected=reg.candidates.filter(c=>fs.existsSync(c.path));
if(all)assert.equal(selected.length,10,"integration must contain all 10 candidates");
assert.ok(selected.length,"no candidate HTML files found");
const artifacts="website-factory/qa-artifacts";
fs.mkdirSync(artifacts,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const results=[],fingerprints=new Set();
 try{
 for(const c of selected){
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const jsErrors=[];page.on("pageerror",e=>jsErrors.push(String(e)));
  await page.addInitScript(()=>{try{localStorage.setItem("doe-analytics-consent-v1","rejected")}catch{}});
  const target=root+c.path;
  const response=await page.goto(target,{waitUntil:"load",timeout:20000});
  assert.equal(response?.status(),200,c.slug+": HTTP");
  const main=page.locator("main[data-anatomy]");
  assert.equal(await main.count(),1,c.slug+": main anatomy");
  assert.equal(await main.getAttribute("data-anatomy"),c.anatomy,c.slug+": wrong anatomy");
  fingerprints.add(c.anatomy);
  assert.ok((await page.title()).includes(c.title),c.slug+": title");
  assert.ok((await page.locator("h1").first().innerText()).length>10,c.slug+": heading");
  assert.ok((await page.locator("nav a[href^='#']").count())>=3,c.slug+": internal nav");
  assert.ok((await page.locator("section[id]").count())>=3,c.slug+": content sections");
  assert.ok((await page.locator("details summary").count())>=1,c.slug+": disclosure");
  assert.ok((await page.locator("script[src*='privacy-consent.js']").count())===1,c.slug+": privacy script missing");
  assert.equal(await page.locator("form,iframe,[data-checkout],input[type='payment']").count(),0,c.slug+": no live forms or commerce allowed");
  assert.ok((await page.locator("body").innerText()).includes("Preview only"),c.slug+": preview notice");
  for(const w of [320,390,768,1024,1440,1920]){
    await page.setViewportSize({width:w,height:w===390?844:900});
    const m=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    assert.ok(m.scroll<=m.viewport+2,c.slug+": horizontal overflow at "+w+" "+JSON.stringify(m));
    if(w===390||w===1440)await page.screenshot({path:path.join(artifacts,c.slug+"-"+w+".png"),animations:"disabled"});
  }
  await page.locator("details summary").first().click();
  assert.ok(await page.locator("details").first().evaluate(el=>el.open),c.slug+": disclosure does not open");
  const href=await page.locator("nav a[href^='#']").first().getAttribute("href");
  assert.ok(await page.locator(href).count(),c.slug+": broken in-page navigation "+href);
  assert.deepEqual(jsErrors,[],c.slug+": runtime errors");
  results.push({slug:c.slug,anatomy:c.anatomy,breakpoints:[320,390,768,1024,1440,1920],screenshots:[c.slug+"-390.png",c.slug+"-1440.png"],nav:true,disclosure:true,privacyReference:true,noCheckout:true});
  await page.close();
  console.log("PASS",c.slug,"desktop/mobile/6 widths/anchor/disclosure/privacy/demo-only");
 }
 assert.equal(fingerprints.size,selected.length,"anatomy collision among candidates");
 fs.writeFileSync(path.join(artifacts,"results.json"),JSON.stringify({mode:all?"all":"present",pass:true,count:selected.length,results},null,2));
 console.log("WEBSITE FACTORY QA PASS",selected.length,"distinct candidate anatomy(s)");
 }finally{await browser.close()}
})().catch(e=>{fs.writeFileSync(path.join(artifacts,"failed.txt"),String(e));console.error("WEBSITE FACTORY QA FAIL",e);process.exitCode=1;});
