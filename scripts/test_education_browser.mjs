#!/usr/bin/env node
import {chromium} from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const origin='http://127.0.0.1:8765';
let completed=0;
try {
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:840},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   const response=await page.goto(origin+'/education/',{waitUntil:'domcontentloaded'});
   if(!response||response.status()!==200)throw Error('Education page not found');
   await page.waitForFunction(()=>/14 of 14 resources shown/.test(document.querySelector('#count')?.textContent||''),{timeout:10000});
   if(await page.locator('#list .resource').count()!==14)throw Error('Initial listing count not 14');
   const layout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth+2,
    header:!!document.querySelector('header.doe-header-v3'),
    external:[...document.querySelectorAll('.resource a.visit')].every(a=>a.protocol==='https:'&&a.rel.includes('noopener')&&a.target==='_blank'),
    hasPrivacy:!!document.querySelector('script[src*="privacy-consent.js"]'),
    skipH1:document.querySelectorAll('main h1').length===1
   }));
   if(layout.overflow||!layout.header||!layout.external||!layout.hasPrivacy||!layout.skipH1)throw Error('Layout/privacy/links: '+JSON.stringify(layout));
   await page.locator('#eligibility').selectOption('indigenous-only');
   if(await page.locator('.resource').count()!==1||!await page.locator('.resource').first().textContent().then(v=>v.includes('Indspire')))throw Error('Indigenous-only filter incorrect');
   await page.locator('#reset').click();
   await page.locator('#search').fill('FirstVoices');
   if(await page.locator('.resource').count()!==1)throw Error('Search incorrect');
   await page.locator('#reset').click();
   await page.locator('#topic').selectOption('survivor-stories');
   if(await page.locator('.resource').count()!==2)throw Error('Survivor story filter incorrect');
   await page.locator('#reset').click();
   await page.locator('#quickpaths [data-topic="languages"]').click();
   if(await page.locator('.resource').count()!==1)throw Error('Quickpaths incorrect');
   await page.locator('#reset').click();
   if(await page.locator('.resource').count()!==14)throw Error('Reset incorrect');
   if(errors.length)throw Error('Uncaught page exceptions: '+errors.join('; '));
   fs.mkdirSync('test-results/education',{recursive:true});
   await page.screenshot({path:'test-results/education/education-'+width+'.png',fullPage:true});
   completed++;
  }catch(e){
   fs.mkdirSync('test-results/education',{recursive:true});
   await page.screenshot({path:'test-results/education/failure-'+width+'.png',fullPage:true}).catch(()=>{});
   throw Error('Education '+width+'px: '+e.message);
  }finally {await context.close()}
 }
 console.log('PASS: Education Chromium renders/filters/links/privacy at '+completed+' phone-tablet-desktop widths');
}finally {await browser.close()}
