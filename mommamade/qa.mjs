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
async function visit(page,url){const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});check(!resp || resp.ok(),url+' returned non-200');await page.locator('#content').waitFor({timeout:15000});await page.locator('#content .art').first().waitFor({timeout:15000});await page.waitForTimeout(90)}
async function images(page){return await page.locator('#content img.art').evaluateAll(imgs=>imgs.every(i=>i.complete && i.naturalWidth>0))}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await page.addInitScript(()=>{try{localStorage.setItem('doe-analytics-consent-v1','rejected')}catch{}});
 const visitedSelectors=new Set();
 for(let i=0;i<10;i++){
   const u=base+'?template='+(i+1);
   await visit(page,u+'#home');
   check(await page.locator('body').getAttribute('class')==='store theme-'+concepts[i], 'Incorrect body style '+(i+1));
   check(await page.locator('.brand').innerText().then(x=>x.includes('Momma')), 'Brand missing '+(i+1));
   const hero=['.fit-heritage-hero','.fit-beewise-hero','.fit-earthology-hero','.fit-package-hero','.fit-superbee-hero','.fit-louise-hero','.fit-mind-hero','.fit-hearterra-hero','.fit-beebagz-banner','.fit-ethikli-hero'][i];
   check(await page.locator(hero).count()===1,'Unique homepage anatomy missing '+hero);visitedSelectors.add(hero);
   check(await images(page),'Broken inline product art on home '+(i+1));
   if(i===4){await page.locator('[data-find="1"]').click();check(await page.locator('#lab-result h3').innerText()==='Reusable Paper Towels','Wrap Lab product finder did not update');await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));}
   if(i===7||i===9){const before=await page.locator('[data-slider] h1').innerText();await page.locator('[data-slide-next]').click();check(await page.locator('[data-slider] h1').innerText()!==before,'Hero slider did not change on design '+(i+1));}
   await page.screenshot({path:'mommamade/qa-artifacts/design-'+(i+1)+'-desktop.png',fullPage:false});
   await visit(page,u+'#shop');
   for(let j=0;j<4;j++){check(await page.locator('a[href$="product-'+(j+1)+'"]').count()>0,'Missing product route in collection '+(i+1)+'/'+(j+1))}
   check(await page.locator('.fit-catalog-toolbar').count()===1,'Catalogue filter toolbar missing '+(i+1));
   await page.locator('.fit-catalog-toolbar [data-filter="cleaning"]').click();
   check(await page.locator('.fit-collection-cards .item:visible').count()===2,'Category filter did not show two cleaning items '+(i+1));
   await page.locator('.fit-catalog-toolbar [data-filter="all"]').click();
   check(await page.locator('.fit-collection-cards .item:visible').count()===4,'All filter did not restore items '+(i+1));
   await page.locator('[data-sort-products]').selectOption('alphabetic');
   const sorted=await page.locator('.fit-collection-cards .item h3').allInnerTexts();
   check(sorted.join('|')===[...sorted].sort().join('|'),'Alphabetical sorting failed '+(i+1));
   await page.locator('[data-sort-products]').selectOption('featured');
   if([3,7,9].includes(i)){await page.locator('[data-search-form] input').fill('Snack');await page.locator('[data-search-form] button').click();check(await page.locator('.items .item:visible').count()>=1,'Header product search found no matching item '+(i+1));}
   await visit(page,u+'#about');check(await page.locator('.story-page').count()===1,'Missing story '+(i+1));
   await visit(page,u+'#care');check(await page.locator('.care-grid article').count()===4,'Missing care guide '+(i+1));
   for(let j=1;j<=4;j++){
     await visit(page,u+'#product-'+j);
     check(await page.locator('.product-info h1').innerText()===products[j-1], 'Wrong product detail '+(i+1)+'/'+j);
     check(await page.locator('button.disabled').isDisabled(), 'Checkout not disabled '+(i+1)+'/'+j);
     check(await page.locator('[data-gallery-thumb]').count()===3,'Missing product thumbnail selector '+(i+1)+'/'+j);
     const artBefore=await page.locator('.fit-primary-img').getAttribute('src');
     await page.locator('[data-gallery-thumb="1"]').click();
     check(await page.locator('.fit-primary-img').getAttribute('src')!==artBefore,'Product thumbnail did not change primary art '+(i+1)+'/'+j);
     check(await page.locator('[data-pattern-choice="1"]').getAttribute('aria-pressed')==='true','Pattern state not synchronized '+(i+1)+'/'+j);
     check(await images(page),'Product artwork not loading '+(i+1)+'/'+j);
   }
   report.desktop.push({template:i+1,theme:concepts[i],homepage:true,shop:true,about:true,care:true,productPages:4,checkoutDisabled:true,artwork:true});
 }
 check(visitedSelectors.size===10,'Less than ten distinct DOM structures');
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await mobile.addInitScript(()=>{try{localStorage.setItem('doe-analytics-consent-v1','rejected')}catch{}});
 for(let i=0;i<10;i++){
    await visit(mobile,base+'?template='+(i+1)+'#home');
    const widths=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    check(widths.scroll<=widths.viewport+8,'Mobile horizontal overflow in design '+(i+1)+': '+JSON.stringify(widths));
    const menu=mobile.locator('.mobile-toggle');check(await menu.isVisible(),'Mobile navigation toggle absent on '+(i+1));await menu.click();check(await mobile.locator('#momma-mobile-menu').isVisible(),'Mobile drawer failed to open '+(i+1));await menu.click();check(await mobile.locator('#momma-mobile-menu').isHidden(),'Mobile drawer failed to close '+(i+1));
    await mobile.screenshot({path:'mommamade/qa-artifacts/design-'+(i+1)+'-mobile.png',fullPage:false});
    report.mobile.push({template:i+1,viewport:390,overflow:false});
 }
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('.dir-card').first().waitFor();
 check(await page.locator('.dir-card').count()===10,'Gallery has not ten previews');
 check(await page.locator('.dir-card iframe').count()===10,'Gallery missing actual live previews');
 check(await page.locator('.dir-card .dir-action').count()===10,'Gallery missing design links');
 const anonymous=await browser.newPage({viewport:{width:1100,height:800}});
 await anonymous.goto(base,{waitUntil:'domcontentloaded'});
 check(await anonymous.locator('#doe-consent-banner').isVisible(),'Gallery must retain public privacy consent prompt');
 const embedded=anonymous.frameLocator('.dir-card iframe').first();
 await embedded.locator('html.embedded-preview').waitFor({timeout:15000});
 check(await embedded.locator('#doe-consent-banner').isHidden(),'Embedded thumbnail should not repeat consent prompt');
 report.gallery=true;
 report.privacy={parentConsentVisible:true,embeddedConsentHidden:true};
 writeFileSync('mommamade/qa-artifacts/results.json',JSON.stringify(report,null,2));
 console.log('MOMMA MADE QA PASS: 10 unique layouts, 10 desktop homes, 10 mobile homes, 10 collections, 10 maker stories, 10 care guides, 40 product routes, disabled checkout, 10 gallery previews.');
}catch(e){report.errors.push(String(e));writeFileSync('mommamade/qa-artifacts/results.json',JSON.stringify(report,null,2));console.error('MOMMA MADE QA FAILED:',e);process.exitCode=1}
finally{await browser.close()}
