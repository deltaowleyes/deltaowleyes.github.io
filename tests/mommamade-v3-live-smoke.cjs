/* Public live deployment read-only verification. No credentials or paid calls. */
'use strict';
const fs=require('node:fs');
const out='artifacts/mommamade-v3/live-deployment.json';
fs.mkdirSync('artifacts/mommamade-v3',{recursive:true});
const host='https://www.deltaowleyes.ca';
const targets=[
 {path:'/mommamade/v3/',mime:'text/html',marker:'Momma Made 3.0'},
 {path:'/mommamade/v3/site.js',mime:'javascript',marker:'Momma Made V3'},
 {path:'/mommamade/v3/site.css',mime:'text/css',marker:'Website Factory 1.0'},
 {path:'/mommamade/v3/reference-fidelity-1-3.css',mime:'text/css',marker:'.theme-quiet .hero{display:flex;flex-direction:column;padding:0;min-height:0}'},
 {path:'/mommamade/',mime:'text/html',marker:'./v2/'}
];
(async()=>{
 const results=[];
 for(const target of targets){
  const url=host+target.path;
  try{
   const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'user-agent':'DeltaOwlEyes-MommaMade-V3-ReadOnly-QA'}});
   const body=await response.text();
   const valid=response.status===200 && (response.headers.get('content-type')||'').includes(target.mime) && body.includes(target.marker);
   results.push({path:target.path,url:response.url,status:response.status,content_type:response.headers.get('content-type'),bytes:body.length,expected_marker:target.marker,marker_present:body.includes(target.marker),pass:valid});
  }catch(e){results.push({path:target.path,status:null,pass:false,error:String(e.message).slice(0,350)});}
 }
 const passed=results.every(x=>x.pass);
 fs.writeFileSync(out,JSON.stringify({checked_at:new Date().toISOString(),public_host:host,verified:passed,requires_browser_visual_review:true,results},null,2));
 for(const r of results)console.log((r.pass?'PASS ':'FAIL ')+r.path+' '+(r.status??r.error));
 console.log(passed?'PASS public live HTML/script/CSS and default V2 reference':'FAIL public deployment remains unverified');
 if(!passed)process.exitCode=1;
})().catch(e=>{console.error('LIVE VERIFY FAILED',e);process.exit(1)});
