#!/usr/bin/env node
// Education 1.1: data-derived, resilient Chromium navigation/filter/privacy smoke.
import {chromium} from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const origin='http://127.0.0.1:8765';
let completed=0;
try {
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:840},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  try{
   const response=await page.goto(origin+'/education/',{waitUntil:'domcontentloaded'});
   if(!response||response.status()!==200)throw Error('Education page not found');
   const records=await page.evaluate(async()=>{
    const response=await fetch('/data/education-resources.json');
    if(!response.ok)throw Error('Catalogue HTTP '+response.status);
    return await response.json();
   });
   if(!Array.isArray(records)||records.length<20)throw Error('Expected expanded source catalogue');
   await page.waitForFunction(expected=>document.querySelector('#count')?.textContent===expected+' of '+expected+' resources shown',records.length,{timeout:10000});
   if(await page.locator('#list .resource').count()!==records.length)throw Error('Initial listing count is incorrect');
   const layout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth+2,
    header:!!document.querySelector('header.doe-header-v3'),
    external:[...document.querySelectorAll('.resource a.visit')].every(a=>a.protocol==='https:'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.target==='_blank'),
    privacyScript:!!document.querySelector('script[src*="privacy-consent.js"]'),
    headTitle:document.title.includes('Education'),
    onlyOneH1:document.querySelectorAll('main h1').length===1,
    labels:[...document.querySelectorAll('.filters input,.filters select')].every(i=>!!document.querySelector('label[for="'+i.id+'"]')),
    sensitiveFrames:document.querySelectorAll('iframe').length===0,
    nav:!!document.querySelector('header a[href="/education/"][aria-current="page"]'),
   }));
   if(Object.entries(layout).some(([k,v])=>k==='overflow'?v:!v))throw Error('Layout/ARIA/privacy/external links: '+JSON.stringify(layout));
   for(const value of ['indigenous-only','open','check-provider']){
     await page.locator('#eligibility').selectOption(value);
     if(await page.locator('.resource').count()!==records.filter(r=>r.eligibility===value).length)throw Error('Eligibility filter '+value);
   }
   await page.locator('#reset').click();
   await page.locator('#search').fill('FirstVoices');
   if(await page.locator('.resource').count()!==records.filter(r=>[r.title,r.provider,r.description,r.region,r.category].join(' ').toLowerCase().includes('firstvoices')).length)throw Error('Search filter');
   await page.locator('#reset').click();
   for(const topic of ['survivor-stories','languages','knowledge-keepers']){
     await page.locator('#topic').selectOption(topic);
     if(await page.locator('.resource').count()!==records.filter(r=>r.category===topic).length)throw Error('Topic filter '+topic);
   }
   await page.locator('#reset').click();
   await page.locator('#format').selectOption('on-site');
   if(await page.locator('.resource').count()!==records.filter(r=>r.format==='on-site').length)throw Error('On-site filter');
   await page.locator('#reset').click();
   await page.locator('#quickpaths [data-query="Bkejwanong"]').focus();
   await page.keyboard.press('Enter');
   const localMatches=records.filter(r=>[r.title,r.provider,r.description,r.region,r.category].join(' ').toLowerCase().includes('bkejwanong')).length;
   if(await page.locator('.resource').count()!==localMatches)throw Error('Keyboard local-first quickpath');
   await page.locator('#reset').click();
   await page.locator('#quickpaths [data-topic="knowledge-keepers"]').click();
   if(await page.locator('.resource').count()!==records.filter(r=>r.category==='knowledge-keepers').length)throw Error('Knowledge keepers quickpath');
   const facets=await page.evaluate(async()=>{
      const response=await fetch('/data/education-verified-facets.json');
      if(!response.ok)throw Error('Verified facets HTTP '+response.status);
      return (await response.json()).records;
   });
   if(facets.length<4)throw Error('Expected source-verified facets');
   await page.locator('#learning-language').selectOption('Onyota’a:ka (Oneida)');
   if(await page.locator('.resource').count()!==1)throw Error('Oneida learning language filter');
   const oneidaText=await page.locator('.resource').first().textContent();
   if(!oneidaText.includes('2027-09'))throw Error('Provider-listed intake not displayed');
   await page.locator('#reset').click();
   await page.locator('#community').selectOption('Walpole Island First Nation (Bkejwanong)');
   if(await page.locator('.resource').count()!==1)throw Error('Bkejwanong community connection filter');
   await page.locator('#reset').click();
   await page.locator('#reset').click();
   if(await page.locator('.resource').count()!==records.length)throw Error('Reset incorrect');
   const feedbackLinks=await page.locator('#education-feedback a.feedback-action').evaluateAll(
     anchors=>anchors.map(a=>({href:a.getAttribute('href'),text:a.textContent.trim()})));
   if(feedbackLinks.length!==3||feedbackLinks.some(a=>!a.href.startsWith('mailto:deltaowleyes@gmail.com?')))
     throw Error('Public feedback actions must use private email, never an unprotected web form');
   if(await page.locator('#education-feedback form').count())throw Error('Unprotected submission form not permitted');
   if(errors.length)throw Error('Page errors: '+errors.join('; '));
   const privacyBanner=page.locator('#doe-consent-banner');
   if(await privacyBanner.count()!==1)throw Error('Privacy banner missing before consent');
   await page.locator('#doe-reject').click();
   await page.waitForFunction(()=>!document.querySelector('#doe-consent-banner'));
   const privacy=await page.evaluate(()=>({
     choice:localStorage.getItem('doe-analytics-consent-v1'),
     noAnalytics:!window.__doeAnalyticsLoaded&&!document.querySelector('script[src*="googletagmanager.com/gtag/"]'),
     preferences:!!document.querySelector('#doe-privacy-choices'),
   }));
   if(privacy.choice!=='rejected'||!privacy.noAnalytics||!privacy.preferences)throw Error('Privacy reject not honored: '+JSON.stringify(privacy));
   await page.evaluate(()=>{
     document.activeElement?.blur();
     document.documentElement.style.scrollBehavior='auto';
     document.body.style.scrollBehavior='auto';
     window.scrollTo({top:0,left:0,behavior:'instant'});
   });
   await page.waitForTimeout(160);
   if(await page.evaluate(()=>window.scrollY)>2)throw Error('Could not reset screenshot scroll position');
   fs.mkdirSync('test-results/education',{recursive:true});
   await page.screenshot({path:'test-results/education/education-1-1-'+width+'.png',fullPage:true});
   completed++;
  }catch(e){
   fs.mkdirSync('test-results/education',{recursive:true});
   await page.screenshot({path:'test-results/education/failure-1-1-'+width+'.png',fullPage:true}).catch(()=>{});
   throw Error('Education '+width+'px: '+e.message);
  }finally{await context.close()}
 }
 console.log('PASS: Education 1.1: '+completed+' viewports, dynamic cards, searches, categories, access, in-person, local keyboard, source links and privacy scripts');
}finally{await browser.close()}
