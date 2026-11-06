#!/usr/bin/env node
// Discovery 4.0 real Chromium QA: responsive, filters, safe sources, deadlines and privacy.
import {chromium} from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const origin='http://127.0.0.1:8765',screens='test-results/grants';
fs.mkdirSync(screens,{recursive:true});
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:840},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   const response=await page.goto(origin+'/grants/',{waitUntil:'domcontentloaded'});
   if(!response||response.status()!==200)throw Error('Grants page HTTP not 200');
   const grants=await page.evaluate(async()=>{const response=await fetch('/data/indigenous-grants.json');if(!response.ok)throw Error('Grants JSON HTTP '+response.status);return response.json()});
   if(!Array.isArray(grants)||grants.length<20)throw Error('Grants data count');
   await page.waitForFunction(total=>document.querySelector('#grant-count')?.textContent===total+' of '+total+' funding programs shown',grants.length);
   if(await page.locator('.grant').count()!==grants.length)throw Error('Rendered card count');
   const layout=await page.evaluate(()=>({
     overflow:document.documentElement.scrollWidth>innerWidth+2,
     nav:!!document.querySelector('header a[href="/grants/"][aria-current="page"]'),
     external:[...document.querySelectorAll('.grant a.visit')].every(a=>a.protocol==='https:'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.target==='_blank'),
     privacy:!!document.querySelector('script[src*="privacy-consent.js"]'),
     h1:document.querySelectorAll('main h1').length===1,
     labels:[...document.querySelectorAll('.filters input,.filters select')].every(x=>!!document.querySelector('label[for="'+x.id+'"]')),
     noFrames:document.querySelectorAll('iframe').length===0
   }));
   if(Object.entries(layout).some(([k,v])=>k==='overflow'?v:!v))throw Error('Layout/ARIA/privacy: '+JSON.stringify(layout));
   await page.locator('#grant-purpose').selectOption('arts');
   if(await page.locator('.grant').count()!==grants.filter(x=>x.category==='arts').length)throw Error('Arts filter');
   await page.locator('#clear-grants').click();
   await page.locator('#grant-applicant').selectOption('students');
   if(await page.locator('.grant').count()!==grants.filter(x=>x.applicant==='students').length)throw Error('Applicants filter');
   await page.locator('#clear-grants').click();
   await page.locator('#grant-region').selectOption('Southern Ontario');
   if(await page.locator('.grant').count()!==grants.filter(x=>x.region==='Southern Ontario').length)throw Error('Region filter');
   await page.locator('#clear-grants').click();
   await page.locator('#grant-status').selectOption('closed');
   if(await page.locator('.grant').count()<3)throw Error('Expected clearly marked closed grant intakes');
   await page.locator('#clear-grants').click();
   await page.locator('#grant-search').fill('forestry');
   if(await page.locator('.grant').count()!==1)throw Error('Search filter');
   await page.locator('#clear-grants').click();
   await page.locator('.tags-quick button[data-category="business"]').focus();
   await page.keyboard.press('Enter');
   if(await page.locator('.grant').count()!==grants.filter(x=>x.category==='business').length)throw Error('Keyboard quick filters');
   await page.locator('#clear-grants').click();
   if(errors.length)throw Error('Browser errors: '+errors.join('; '));
   if(await page.locator('#doe-consent-banner').count()!==1)throw Error('Privacy banner missing');
   await page.locator('#doe-reject').click();
   await page.waitForFunction(()=>!document.querySelector('#doe-consent-banner'));
   const priv=await page.evaluate(()=>({choice:localStorage.getItem('doe-analytics-consent-v1'),blocked:!window.__doeAnalyticsLoaded&&!document.querySelector('script[src*="googletagmanager.com/gtag/"]')}));
   if(priv.choice!=='rejected'||!priv.blocked)throw Error('Privacy reject failed');
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';window.scrollTo(0,0)});
   await page.screenshot({path:screens+'/grants-'+width+'.png',fullPage:true});
   console.log('PASS Grants '+width+'px');
  }catch(error){
   await page.screenshot({path:screens+'/failure-'+width+'.png',fullPage:true}).catch(()=>{});
   throw Error(width+'px: '+error.message);
  }finally{await context.close()}
 }
 const context=await browser.newContext({viewport:{width:390,height:820}});
 await context.addInitScript(()=>{
   const NativeDate=Date;
   class FutureDate extends NativeDate{
     constructor(...args){super(...(args.length?args:['2029-01-02T12:00:00']))}
     static now(){return new NativeDate('2029-01-02T12:00:00').getTime()}
   }
   window.Date=FutureDate;
 });
 const page=await context.newPage();
 await page.goto(origin+'/grants/');
 await page.waitForFunction(()=>document.querySelector('#total-metric')?.textContent==='20');
 await page.locator('#grant-status').selectOption('open');
 if(await page.locator('.grant').count()!==0)throw Error('Past deadlines incorrectly presented as open in a future year');
 await context.close();
 console.log('PASS Discovery 4.0: 4 viewports, 20 source-linked listings, searchable filters, privacy rejection and deadline expiry');
}finally{await browser.close()}
