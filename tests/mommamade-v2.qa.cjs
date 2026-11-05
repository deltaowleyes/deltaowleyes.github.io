/* Momma Made 2.0 browser QA: run from repo root with Playwright and a local static server. */
const { chromium }=require("playwright");
const fs=require("node:fs");
const assert=require("node:assert/strict");
const base=process.env.MOMMA_BASE_URL||"http://127.0.0.1:8765/mommamade/v2/";
const photos="artifacts/mommamade-v2";
fs.mkdirSync(photos,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 let visited=0;
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 const go=async(n,route)=>{
  const response=await page.goto(base+"?template="+n+"#"+route,{waitUntil:"domcontentloaded"});
  assert.equal(response.status(),200,"HTTP failure for "+n+" "+route);
  await page.locator(".site-header").waitFor({timeout:10000});
  visited++;
 };
 const noOverflow=async(label)=>{
  const x=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  assert.ok(x.w<=x.viewport+2,label+" horizontal overflow "+JSON.stringify(x));
 };
 const asset=await page.request.get(base+"collection.svg");
 assert.equal(asset.status(),200,"product imagery missing");
 const css=await page.request.get(base+"designs.css");
 assert.equal(css.status(),200,"design CSS missing");
 const js=await page.request.get(base+"designs.js");
 assert.equal(js.status(),200,"design JS missing");
 await page.goto(base,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator(".preview-card").count(),10,"gallery must have exactly 10 previews");
 assert.equal(await page.locator(".preview-card iframe").count(),10,"gallery previews must be live routes");
 await page.screenshot({path:photos+"/gallery-desktop.png",fullPage:true});
 for(let n=1;n<=10;n++){
  await page.setViewportSize({width:1440,height:900});
  await go(n,"home");
  assert.equal(await page.locator(".hero h1").count(),1,"design "+n+" homepage");
  assert.equal(await page.locator(".product-card").count(),n===7?4:4,"design "+n+" products");
  const img=await page.locator(".hero .photo").first().evaluate(el=>getComputedStyle(el,"::before").backgroundImage);
  assert.ok(img.includes("collection.svg"),"design "+n+" missing illustration");
  await noOverflow("design "+n+" desktop");
  await page.screenshot({path:photos+"/design-"+String(n).padStart(2,"0")+"-desktop.png",fullPage:true});
  await go(n,"shop");
  assert.equal(await page.locator(".product-card").count(),4,"design "+n+" shop count");
  await page.locator("[data-filter='Cleaning']").click();
  assert.equal(await page.locator(".product-card").count(),2,"design "+n+" filter");
  await page.locator("[data-filter='All']").click();
  await page.locator("[data-search]").fill("Snack");
  assert.equal(await page.locator(".product-card").count(),1,"design "+n+" search");
  for(let p=1;p<=4;p++){
   await go(n,"product-"+p);
   assert.equal(await page.locator(".checkout:disabled").count(),1,"checkout must remain disabled");
   assert.equal(await page.locator(".detail details").count(),3,"product disclosure count");
  }
  await page.locator("[data-visual='Neutral linen']").click();
  assert.equal(await page.locator("#visual-note").innerText(),"Selected visual mood: Neutral linen","selector response");
  await go(n,"about");
  assert.equal(await page.locator(".story").count(),1,"maker story");
  await go(n,"care");
  assert.equal(await page.locator(".care-grid article").count(),4,"care guide");
  await go(n,"contact");
  await page.locator("#visitor-name").fill("Test Customer");
  await page.locator("#visitor-email").fill("qa@example.test");
  await page.locator("#visitor-message").fill("Preview inquiry only");
  await page.locator("#demo-form button[type=submit]").click();
  assert.match(await page.locator("#form-message").innerText(),/No message was sent or stored/,"simulated form");
  await page.setViewportSize({width:390,height:844});
  await go(n,"home");
  await noOverflow("design "+n+" mobile home");
  await page.locator(".menu-button").click();
  assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"),"true","mobile navigation toggle");
  assert.equal(await page.locator("#mobile-menu").isVisible(),true,"mobile menu visibility");
  await page.locator(".menu-button").click();
  await page.screenshot({path:photos+"/design-"+String(n).padStart(2,"0")+"-mobile.png",fullPage:true});
  await go(n,"shop");
  await noOverflow("design "+n+" mobile shop");
  await go(n,"product-"+(n%4+1));
  await noOverflow("design "+n+" mobile product");
  await go(n,"contact");
  await noOverflow("design "+n+" mobile contact");
  console.log("PASS design "+String(n).padStart(2,"0")+" desktop/mobile, routes, filters, forms, assets");
 }
 assert.deepEqual(errors,[],"browser JavaScript errors");
 await browser.close();
 console.log("MOMMA MADE V2 QA PASS | "+visited+" routes | 10 storefronts | 20 storefront screenshots plus gallery");
})().catch(e=>{console.error("MOMMA MADE V2 QA FAILED",e);process.exitCode=1});