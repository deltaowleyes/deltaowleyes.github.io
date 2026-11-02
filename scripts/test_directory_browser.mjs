import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdir} from "node:fs/promises";
import {readFileSync} from "node:fs";
import {chromium} from "playwright";

// Chromium runs against a read-only local server and the public live pages.
// All write-path tests intercept the GitHub API and use synthetic records.
const LOCAL="http://127.0.0.1:8765";
const LIVE="https://deltaowleyes.ca";
const BUSINESS_COUNT=JSON.parse(readFileSync("indigenous-businesses/businesses.json","utf8")).length;
assert.ok(BUSINESS_COUNT>=4475,"The consolidated directory has lost its migration baseline");
const DISPLAY_COUNT=BUSINESS_COUNT.toLocaleString("en-US");
const CHURCH_COUNT=JSON.parse(readFileSync("indigenous-churches/churches.json","utf8")).length;
assert.ok(CHURCH_COUNT>=140,"Church directory has lost its historical baseline");
const API="https://api.github.com/repos/deltaowleyes/deltaowleyes.github.io";
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser,server,activePage,stepName="setup";
const report=async(name,action)=>{
 stepName=name;
 try{await action();console.log("PASS "+name)}
 catch(err){
  console.error("FAIL "+name+": "+(err.stack||err.message||err));
  if(activePage){
   try{await mkdir("test-results",{recursive:true});await activePage.screenshot({path:"test-results/directory-browser-failure.png",fullPage:true})}
   catch(screenshotError){console.error("Screenshot unavailable: "+screenshotError.message)}
  }
  throw err;
 }
};
const waitFor=async(page,selector,value)=>{
 await page.waitForFunction(({selector,value})=>(document.querySelector(selector)?.textContent||"").includes(value),
  {selector,value},{timeout:45000});
};
const go=async(page,path,base=LOCAL)=>{
 const res=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:45000});
 assert.equal(res?.status(),200,"HTTP 200 expected at "+base+path);
};
try {
 server=spawn("python3",["-m","http.server","8765","--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
 let ready=false;
 for(let i=0;i<60;i++){
  if(server.exitCode!==null)throw Error("Local static server exited early.");
  try{const res=await fetch(LOCAL+"/admin/");if(res.ok){ready=true;break}}catch{}
  await sleep(250);
 }
 assert.ok(ready,"Local static server never became available");
 browser=await chromium.launch({headless:true});
 activePage=await browser.newPage({viewport:{width:1280,height:900}});

 await report("Local public business directory renders current records from one JSON source",async()=>{
  await go(activePage,"/indigenous-businesses/");
  await waitFor(activePage,"#count",DISPLAY_COUNT+" published records");
  assert.equal(await activePage.locator("#cards > article.card").count(),48,"The first page should show 48 business cards.");
  await activePage.locator("#q").fill("Ellipsis Energy Inc");
  await waitFor(activePage,"#count","1 matching");
  assert.match(await activePage.locator("#cards").innerText(),/Ellipsis Energy Inc/);
  const loaded=await activePage.evaluate(async()=>{
   const response=await fetch("/indigenous-businesses/businesses.json");
   return {status:response.status,count:(await response.json()).length};
  });
  assert.deepEqual(loaded,{status:200,count:BUSINESS_COUNT});
 });
 await report("Local public church directory renders preliminary listings",async()=>{
  await go(activePage,"/indigenous-churches/");
  await waitFor(activePage,"#count",CHURCH_COUNT+" total research records");
  assert.equal(await activePage.locator("#results > article.card").count(),CHURCH_COUNT);
 });

 const liveCounts={businesses:0,churches:0};
 await report("Published business directory renders current records in real Chromium",async()=>{
  await go(activePage,"/indigenous-businesses/",LIVE);
  liveCounts.businesses=await activePage.evaluate(async()=>{
   const response=await fetch("/indigenous-businesses/businesses.json",{cache:"no-store"});
   if(!response.ok)throw Error("Live business JSON HTTP "+response.status);
   return (await response.json()).length;
  });
  assert.ok(liveCounts.businesses>=4475,"Published business directory must retain its baseline");
  await waitFor(activePage,"#count",liveCounts.businesses.toLocaleString("en-US")+" published records");
  assert.ok(await activePage.locator("#cards > article.card").count()>0);
 });
 await report("Published admin exposes New business and New church controls",async()=>{
  await go(activePage,"/admin/",LIVE);
  await waitFor(activePage,"#load",liveCounts.businesses.toLocaleString("en-US"));
  assert.equal((await activePage.locator("#createNew").innerText()).trim(),"+ New business");
  assert.ok(await activePage.locator("#businessPhoneWebsiteFilterWrap").isVisible(),"Business lead filter must appear on businesses");
  await activePage.locator("#dataset").selectOption("churches");
  liveCounts.churches=await activePage.evaluate(async()=>{
   const response=await fetch("/indigenous-churches/churches.json",{cache:"no-store"});
   if(!response.ok)throw Error("Live church JSON HTTP "+response.status);
   return (await response.json()).length;
  });
  await waitFor(activePage,"#load",liveCounts.churches.toLocaleString("en-US"));
  assert.equal((await activePage.locator("#createNew").innerText()).trim(),"+ New church");
  assert.ok(await activePage.locator("#businessPhoneWebsiteFilterWrap").isHidden(),"Business lead filter must be hidden on churches");
  // Do not enter details or attempt publishing on the live site.
 });

 // The local admin uses only two synthetic records. Every GitHub API request
 // is intercepted before any network request or real credential could be sent.
 const syntheticBusiness=[
  {name:"Synthetic Existing Business",city:"Test City",province:"Ontario",owner_confirmed:false,phone:"519-555-0101",website:""},
  {name:"Synthetic Has Website",city:"Test City",province:"Ontario",owner_confirmed:false,phone:"519-555-0102",website:"https://example.org"},
  {name:"Synthetic No Phone",city:"Test City",province:"Ontario",owner_confirmed:false,phone:"",website:""}
 ];
 const syntheticChurch=[{name:"Synthetic Existing Church",reserve:"Test Nation",province:"Ontario",
  representative_confirmed:false,reserveLocated:null,indigenousLed:null,source:"https://example.org"}];
 const remote={businesses:structuredClone(syntheticBusiness),churches:structuredClone(syntheticChurch)};
 const writes=[];
 activePage=await browser.newPage({viewport:{width:1024,height:900}});
 await activePage.route("**/indigenous-businesses/businesses.json",route=>route.fulfill({
  status:200,contentType:"application/json",body:JSON.stringify(syntheticBusiness)}));
 await activePage.route("**/indigenous-churches/churches.json",route=>route.fulfill({
  status:200,contentType:"application/json",body:JSON.stringify(syntheticChurch)}));
 await activePage.route("https://api.github.com/**",async route=>{
  const request=route.request(),url=request.url();
  if(!url.startsWith(API)){
   return route.fulfill({status:403,contentType:"application/json",body:'{"message":"Synthetic API only"}'});
  }
  if(request.method()==="GET"&&url===API){
   return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({permissions:{push:true}})});
  }
  const kind=url.includes("indigenous-churches")?"churches":"businesses";
  if(request.method()==="GET"&&url.includes("/contents/")){
   return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
    sha:"synthetic-"+kind,encoding:"base64",content:Buffer.from(JSON.stringify(remote[kind]),"utf8").toString("base64")
   })});
  }
  if(request.method()==="PUT"&&url.includes("/contents/")){
   const payload=JSON.parse(request.postData()||"{}");
   assert.equal(payload.sha,"synthetic-"+kind);
   assert.equal(request.headers().authorization,"Bearer SYNTHETIC_DOES_NOT_AUTHENTICATE");
   const records=JSON.parse(Buffer.from(payload.content,"base64").toString("utf8"));
   writes.push({kind,records});
   remote[kind]=records;
   return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
    commit:{sha:"synthetic-test-commit",html_url:"https://example.org/synthetic-commit"}
   })});
  }
  return route.fulfill({status:403,contentType:"application/json",body:'{"message":"Unexpected synthetic request"}'});
 });
 await report("Business phone/no-website filter excludes other leads and phone field is last",async()=>{
  await go(activePage,"/admin/");
  await waitFor(activePage,"#load","3 all business listings");
  assert.equal(await activePage.locator("#entries .entry").count(),3);
  await activePage.locator("#businessPhoneWebsiteFilter").selectOption("phone_no_website");
  await waitFor(activePage,"#count","1 matching");
  assert.equal(await activePage.locator("#entries .entry").count(),1);
  assert.match(await activePage.locator("#entries").innerText(),/Synthetic Existing Business/);
  await activePage.locator("#entries .entry button").first().click();
  assert.equal(await activePage.locator("#fields > div:last-child > #field_phone").count(),1,"Public business phone must be last among public business fields");
  await activePage.locator("#businessPhoneWebsiteFilter").selectOption("");
  await waitFor(activePage,"#count","3 matching");
  assert.equal(await activePage.locator("#entries .entry").count(),3);
 });
 await report("New business form becomes editable and cannot publish without authorization",async()=>{
  await waitFor(activePage,"#load","3 all business listings");
  assert.equal((await activePage.locator("#createNew").innerText()).trim(),"+ New business");
  await activePage.locator("#createNew").click();
  for(const id of ["field_name","field_city","field_province"]){
   assert.ok(await activePage.locator("#"+id).isEnabled(),id+" must be editable.");
  }
  await activePage.locator("#field_name").fill("Synthetic New Business");
  await activePage.locator("#field_city").fill("Test City");
  await activePage.locator("#field_province").fill("Ontario");
  assert.ok(await activePage.locator("#edit").isVisible());
  await activePage.locator("#saveRecord").click();
  await waitFor(activePage,"#status","Connect GitHub");
  assert.equal(writes.length,0,"Unauthenticated changes must not write.");
 });
 await report("Synthetic authorized Update & publish creates a business without real writes",async()=>{
  await activePage.locator("#ghToken").fill("SYNTHETIC_DOES_NOT_AUTHENTICATE");
  await activePage.locator("#connect").click();
  await waitFor(activePage,"#status","Published 1 record");
  assert.equal(writes.length,1);
  assert.equal(writes[0].kind,"businesses");
  assert.equal(remote.businesses.length,4);
  assert.equal(remote.businesses[0].name,"Synthetic Existing Business");
  assert.equal(remote.businesses[3].name,"Synthetic New Business");
  assert.equal(remote.businesses[3].verification_status,"unverified");
  assert.ok(!JSON.stringify(remote.businesses[3]).includes("call_notes"));
 });
 await report("New church form and synthetic publish preserve existing church",async()=>{
  await activePage.locator("#dataset").selectOption("churches");
  await waitFor(activePage,"#load","1 church listings");
  assert.ok(await activePage.locator("#businessPhoneWebsiteFilterWrap").isHidden());
  assert.equal((await activePage.locator("#createNew").innerText()).trim(),"+ New church");
  await activePage.locator("#createNew").click();
  for(const id of ["field_name","field_reserve","field_province"]){
   assert.ok(await activePage.locator("#"+id).isEnabled(),id+" must be editable.");
  }
  await activePage.locator("#field_name").fill("Synthetic New Church");
  await activePage.locator("#field_province").fill("Ontario");
  await activePage.locator("#field_reserve").fill("Test Nation");
  await activePage.locator("#field_service_times").fill("Sunday at 10 AM");
  assert.ok(await activePage.locator("#edit").isVisible());
  await activePage.locator("#saveRecord").click();
  await waitFor(activePage,"#status","Published 1 record");
  assert.equal(writes.length,2);
  assert.equal(writes[1].kind,"churches");
  assert.equal(remote.churches[0].name,"Synthetic Existing Church");
  assert.equal(remote.churches[1].name,"Synthetic New Church");
  assert.equal(remote.churches[1].service_times,"Sunday at 10 AM");
  assert.equal(remote.churches[1].verification_status,"unverified");
 });
 console.log("PASS real Chromium directory smoke tests, including phone/no-website lead filter. No real GitHub API writes or production data changes.");
}finally{
 if(browser)await browser.close();
 if(server&&!server.killed)server.kill("SIGTERM");
}