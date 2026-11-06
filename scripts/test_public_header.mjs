#!/usr/bin/env node
import {chromium,firefox,webkit} from 'playwright';
import fs from 'node:fs';
const engine=process.env.DOE_BROWSER||'chromium';
const browser=await ({chromium,firefox,webkit})[engine].launch({headless:true});
const paths=['/','/education/','/news/','/calls-to-action/','/indigenous-businesses/','/indigenous-businesses/profile.html?business=missing','/indigenous-churches/','/events/','/videos/','/services/','/privacy/','/calls-to-action/scripts/revised-01.html','/news/articles/canada-announces-additional-130-million-for-inuit-led-housing/'];
let done=0;
try{
 for(const width of [1280,900,390,320]){
  const context=await browser.newContext({viewport:{width,height:800}});
  for(const path of paths){
   const page=await context.newPage();
   try{
    const response=await page.goto('http://127.0.0.1:8765'+path,{waitUntil:'domcontentloaded'});
    if(!response||response.status()>=400)throw Error('HTTP error');
    const header=page.locator('header.doe-header-v3');
    if(await header.count()!==1)throw Error('Missing header');
    await Promise.all([header.locator('.doe-center-brand img').evaluate(img=>img.decode()),header.locator('.doe-left-symbol img').evaluate(img=>img.decode())]);
    const data=await page.evaluate(()=>{
      const h=document.querySelector('header.doe-header-v3'),i=h.querySelector('.doe-center-brand img'),symbol=h.querySelector('.doe-left-symbol img');
      const b=i.getBoundingClientRect();
      return {position:getComputedStyle(h).position,centerError:Math.abs((b.left+b.right)/2-innerWidth/2),height:b.height,loaded:i.complete&&i.naturalWidth===250,symbolLoaded:symbol&&symbol.complete&&symbol.naturalWidth===75,symbolHeight:symbol?.getBoundingClientRect().height,symbolIsLeft:symbol?.getBoundingClientRect().right<=b.left+2,overflow:h.scrollWidth>innerWidth+2};
    });
    if(data.position!=='sticky'||data.centerError>2||data.height>55.1||!data.loaded||!data.symbolLoaded||!data.symbolIsLeft||data.symbolHeight>55.1||data.overflow)throw Error('Layout: '+JSON.stringify(data));
    await page.evaluate(()=>{document.body.style.minHeight='180vh';window.scrollTo(0,1000)});
    await page.waitForTimeout(80);
    const top=await header.evaluate(h=>h.getBoundingClientRect().top);
    if(Math.abs(top)>2)throw Error('Header not sticky after scroll: '+top);
    await page.evaluate(()=>window.scrollTo(0,0));
    const menu=header.locator(width<=860?'.doe-mobile-navigation':'.doe-menu').first();
    await menu.locator('summary').click();
    if(!await menu.evaluate(m=>m.open))throw Error('Menu did not open');
    await page.keyboard.press('Escape');
    if(await menu.evaluate(m=>m.open))throw Error('Escape did not close menu');
    done++;
   }catch(error){
    fs.mkdirSync('test-results',{recursive:true});
    await page.screenshot({path:'test-results/'+engine+'-'+width+'-'+path.replace(/[^a-z0-9]/gi,'_').slice(0,55)+'.png'}).catch(()=>{});
    throw Error(engine+' '+width+' '+path+': '+error.message);
   }finally{await page.close()}
  }
  await context.close();
 }
 console.log('PASS B4-037: '+engine+' '+done+' page/viewport combinations');
}finally{await browser.close()}
