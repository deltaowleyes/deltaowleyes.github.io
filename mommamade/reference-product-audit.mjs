import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const domains=[
['Bee’s Wrap','https://www.beeswrap.com/'],['Beewise','https://beewisereusables.com/'],
['Earthology','https://earthologywraps.com/'],['Package Free','https://packagefreeshop.com/'],
['SuperBee','https://superbee.me/'],['Bees Louise','https://www.beeslouise.ca/'],
['Mind Your Bees','https://www.mindyourbeeswraps.com/'],['Hearterra','https://hearterra.ca/'],
['BeeBAGZ','https://beebagz.com/'],['Ethikli','https://ethikli.com/']];
const browser=await chromium.launch({headless:true});mkdirSync('mommamade/reference-evidence',{recursive:true});const out=[];
for(let i=0;i<domains.length;i++){
 const [name,site]=domains[i];let row={name,site};
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.goto(site,{waitUntil:'domcontentloaded',timeout:27000});
  const links=await page.locator('a[href]').evaluateAll(as=>as.map(a=>({url:a.href,text:a.textContent?.trim().slice(0,45)})));
  const origin=new URL(site).hostname.replace(/^www\./,'');
  const item=links.find(x=>x.url.includes(origin)&&/\/products\/[^?#/]+|\/product\/[^?#/]+|\/shop\/p\/[^?#/]+/.test(x.url) && !/gift.card|gift-card|subscription|sale/.test(x.url));
  const coll=links.find(x=>x.url.includes(origin)&&/\/collections\/(all|shop-all|beeswax|wraps)|\/shop\b|\/collections\/products/.test(x.url));
  row.productUrl=item?.url||null;row.collectionUrl=coll?.url||null;
  for(const [label,url] of [['product',row.productUrl],['collection',row.collectionUrl]]){
   if(!url)continue;
   for(const [size,w,h] of [['desktop',1440,900],['mobile',390,844]]){
    const p=await browser.newPage({viewport:{width:w,height:h},isMobile:size==='mobile',hasTouch:size==='mobile'});
    try{
     const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:27000});
     await p.waitForTimeout(900);
     const stats=await p.evaluate(()=>{
      const rect=e=>{const x=e.getBoundingClientRect();return {w:Math.round(x.width),h:Math.round(x.height),top:Math.round(x.top),left:Math.round(x.left)}};
      const imgs=[...document.querySelectorAll('main img,article img,figure img')].filter(x=>x.getBoundingClientRect().width>140).slice(0,8);
      const headings=[...document.querySelectorAll('h1,h2')].map(x=>({text:x.textContent?.trim().slice(0,65),...rect(x)})).slice(0,8);
      return {width:innerWidth,images:imgs.map(rect),headings,scrollWidth:document.documentElement.scrollWidth};
     });
     await p.screenshot({path:'mommamade/reference-evidence/ref-'+String(i+1).padStart(2,'0')+'-'+label+'-'+size+'.png',timeout:18000,animations:'disabled'});
     row[label+'-'+size]={status:r?.status(),finalURL:p.url(),...stats};
    }catch(e){row[label+'-'+size]={error:String(e).slice(0,250)}}
    await p.close();
   }
  }
 }catch(e){row.error=String(e).slice(0,250)}
 await page.close();out.push(row);console.log(name,JSON.stringify({product:row.productUrl,collection:row.collectionUrl,error:row.error}));
}
writeFileSync('mommamade/reference-evidence/product-audit.json',JSON.stringify(out,null,2));await browser.close();
