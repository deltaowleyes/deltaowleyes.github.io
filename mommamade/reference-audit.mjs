import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const domains=[
 ['Bee’s Wrap','https://www.beeswrap.com/'],
 ['Beewise Reusables','https://beewisereusables.com/'],
 ['Earthology','https://earthologywraps.com/'],
 ['Package Free','https://packagefreeshop.com/'],
 ['SuperBee','https://superbee.me/'],
 ['Bees Louise','https://www.beeslouise.ca/'],
 ['Mind Your Bees','https://www.mindyourbeeswraps.com/'],
 ['Hearterra','https://hearterra.ca/'],
 ['BeeBAGZ','https://beebagz.com/'],
 ['Ethikli','https://ethikli.com/']
];
mkdirSync('mommamade/reference-evidence',{recursive:true});
const browser=await chromium.launch({headless:true});
let results=[];
for(let i=0;i<domains.length;i++){
 const [name,url]=domains[i];
 let row={index:i+1,name,url,views:[]};
 for(const [label,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:label==='mobile',hasTouch:label==='mobile'});
  try{
    const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
    await page.waitForTimeout(1300);
    const metrics=await page.evaluate(()=>{
      const rect=e=>{const r=e.getBoundingClientRect();return {top:Math.round(r.top),left:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)}};
      const visible=e=>{let r=e.getBoundingClientRect();return r.width>80 && r.height>40 && r.bottom>0 && r.top<innerHeight*2};
      let mains=[...document.querySelectorAll('main img,main picture img,main video,[class*="hero"] img,[class*="banner"] img')].filter(visible).slice(0,12);
      let nav=[...document.querySelectorAll('header,nav')].filter(visible).slice(0,4);
      let headings=[...document.querySelectorAll('h1,h2')].filter(visible).slice(0,8);
      return {title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      nav:nav.map(rect),images:mains.map(e=>({...rect(e),src:e.currentSrc?.slice(0,100),alt:e.getAttribute('alt')?.slice(0,65)})),
      headlines:headings.map(e=>({text:e.textContent.trim().slice(0,100),rect:rect(e)})),
      aboveFoldText:document.body.innerText.slice(0,900)}
    });
    await page.screenshot({path:'mommamade/reference-evidence/ref-'+String(i+1).padStart(2,'0')+'-'+label+'.png',animations:'disabled',timeout:15000});
    row.views.push({label,status:resp?.status(),finalURL:page.url(),...metrics});
  }catch(e){row.views.push({label,error:String(e).slice(0,450)})}
  await page.close();
 }
 results.push(row);
 console.log(name,JSON.stringify(row.views.map(v=>({view:v.label,status:v.status,error:v.error,images:v.images?.length}))));
}
writeFileSync('mommamade/reference-evidence/metrics.json',JSON.stringify(results,null,2));
await browser.close();
