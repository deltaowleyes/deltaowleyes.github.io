import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base='http://127.0.0.1:8765/mommamade/';
const concepts=['heritage','happy','quiet','supply','lab','maker','pattern','slow','utility','market'];
const headings=['The Heritage Wrap','Happy Hive','Quiet Earth','Everyday Supply','Wrap Lab','Maker’s Table','Pattern Parade','The Slow Sunday','Made to Work','The Good Goods Co.'];
const products=['Beeswax Food Wraps','Reusable Paper Towels','Kitchen Scrubbies','Reusable Snack Bags'];
const browser=await chromium.launch({headless:true});
mkdirSync('mommamade/qa-artifacts',{recursive:true});
const report={desktop:[],mobile:[],gallery:false,errors:[]};
const check=(condition,message)=>{if(!condition)throw new Error(message)};
async function visit(page,url){const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});check(resp?.ok(),url+' returned non-200');await page.locator('#content').waitFor({timeout:15000});await page.locator('#content .art').first().waitFor({timeout:15000});await page.waitForTimeout(90)}
async function images(page){return await page.locator('#content img.art').evaluateAll(imgs=>imgs.every(i=>i.complete && i.naturalWidth>0))}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const visitedSelectors=new Set();
 for(let i=0;i<10;i++){
   const u=base+'?template='+(i+1);
   await visit(page,u+'#home');
   check(await page.locator('body').getAttribute('class')==='store theme-'+concepts[i], 'Incorrect body style '+(i+1));
   check(await page.locator('.brand').innerText().then(x=>x.includes('Momma')), 'Brand missing '+(i+1));
   const hero=['.heritage-hero','.happy-poster','.quiet-intro','.supply-header','.lab-hero','.maker-open','.pattern-hero','.slow-mast','.utility-hero','.market-mast'][i];
   check(await page.locator(hero).count()===1,'Unique homepage anatomy missing '+hero);visitedSelectors.add(hero);
   check(await images(page),'Broken inline product art on home '+(i+1));
   await page.screenshot({path:'mommamade/qa-artifacts/design-'+(i+1)+'-desktop.png',fullPage:false});
   await visit(page,u+'#shop');
   for(let j=0;j<4;j++){check(await page.locator('a[href$="product-'+(j+1)+'"]').count()>0,'Missing product route in collection '+(i+1)+'/'+(j+1))}
   await visit(page,u+'#about');check(await page.locator('.story-page').count()===1,'Missing story '+(i+1));
   await visit(page,u+'#care');check(await page.locator('.care-grid article').count()===4,'Missing care guide '+(i+1));
   for(let j=1;j<=4;j++){
     await visit(page,u+'#product-'+j);
     check(await page.locator('.product-info h1').innerText()===products[j-1], 'Wrong product detail '+(i+1)+'/'+j);
     check(await page.locator('button.disabled').isDisabled(), 'Checkout not disabled '+(i+1)+'/'+j);
     check(await images(page),'Product artwork not loading '+(i+1)+'/'+j);
   }
   report.desktop.push({template:i+1,theme:concepts[i],homepage:true,shop:true,about:true,care:true,productPages:4,checkoutDisabled:true,artwork:true});
 }
 check(visitedSelectors.size===10,'Less than ten distinct DOM structures');
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 for(let i=0;i<10;i++){
    await visit(mobile,base+'?template='+(i+1)+'#home');
    const widths=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    check(widths.scroll<=widths.viewport+8,'Mobile horizontal overflow in design '+(i+1)+': '+JSON.stringify(widths));
    await mobile.screenshot({path:'mommamade/qa-artifacts/design-'+(i+1)+'-mobile.png',fullPage:false});
    report.mobile.push({template:i+1,viewport:390,overflow:false});
 }
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('.dir-card').first().waitFor();
 check(await page.locator('.dir-card').count()===10,'Gallery has not ten previews');
 check(await page.locator('.dir-card iframe').count()===10,'Gallery missing actual live previews');
 check(await page.locator('.dir-card .dir-action').count()===10,'Gallery missing design links');
 report.gallery=true;
 writeFileSync('mommamade/qa-artifacts/results.json',JSON.stringify(report,null,2));
 console.log('MOMMA MADE QA PASS: 10 unique layouts, 10 desktop homes, 10 mobile homes, 10 collections, 10 maker stories, 10 care guides, 40 product routes, disabled checkout, 10 gallery previews.');
}catch(e){report.errors.push(String(e));writeFileSync('mommamade/qa-artifacts/results.json',JSON.stringify(report,null,2));console.error('MOMMA MADE QA FAILED:',e);process.exitCode=1}
finally{await browser.close()}
