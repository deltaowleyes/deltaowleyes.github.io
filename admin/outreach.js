"use strict";
/* Delta Owl Eyes: outreach notes remain private and encrypted in this browser. */
(()=>{
 const STORE="doe-outreach-private-v1",ITER=400000,$=id=>document.getElementById(id);
 const enc=new TextEncoder(),dec=new TextDecoder();
 let password="",data={},source="",record=null,recordKey="";
 function to64(a){let s="";for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(s)}
 function from64(s){const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
 async function cryptoKey(p,salt,usage){
  if(!window.isSecureContext||!crypto?.subtle)throw Error("Private outreach requires HTTPS.");
  const raw=await crypto.subtle.importKey("raw",enc.encode(p),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"PBKDF2",salt,hash:"SHA-256",iterations:ITER},raw,{name:"AES-GCM",length:256},false,[usage]);
 }
 async function encrypt(x,p){
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await cryptoKey(p,salt,"encrypt");
  const bytes=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,enc.encode(JSON.stringify(x))));
  return JSON.stringify({v:1,iter:ITER,salt:to64(salt),iv:to64(iv),body:to64(bytes)});
 }
 async function decrypt(raw,p){
  const x=JSON.parse(raw);
  if(x.v!==1||x.iter!==ITER)throw Error("Unsupported notes format");
  const salt=from64(x.salt),iv=from64(x.iv),body=from64(x.body);
  if(salt.length!==16||iv.length!==12||body.length<17)throw Error("Invalid notes data");
  const key=await cryptoKey(p,salt,"decrypt");
  const result=JSON.parse(dec.decode(await crypto.subtle.decrypt({name:"AES-GCM",iv},key,body)));
  if(!result||typeof result!=="object"||Array.isArray(result))throw Error("Invalid notes");
  return result;
 }
 const blank=()=>({website_interest:"not_asked",last_contact_date:"",followup_date:"",call_notes:""});
 const fields=["websiteInterest","lastContactDate","followupDate","callNotes"];
 const key=(src,b)=>src+"|"+(b.source_id?"id:"+b.source_id:[b.name||"",b.city||b.reserve||"",b.province||""].join("|").toLowerCase());
 const current=()=>({website_interest:$("websiteInterest").value,last_contact_date:$("lastContactDate").value,followup_date:$("followupDate").value,call_notes:$("callNotes").value.trim()});
 const dirty=()=>!!(password&&recordKey&&JSON.stringify(current())!==JSON.stringify({...blank(),...(data[recordKey]||{})}));
 const interestFor=(src,b)=>password?(data[key(src,b)]?.website_interest||"not_asked"):"not_asked";
 function message(s,bad=false){$("outreachStatus").textContent=s;$("outreachStatus").style.color=bad?"#a23726":"#526963"}
 function enable(){
  for(const f of fields)$(f).disabled=!password;
  $("saveOutreach").disabled=!password;
  $("privateNotice").textContent=password?
   "Encrypted on this device only. Private notes and website leads are never published or synchronized across devices.":
   "Unlock a saved encrypted publishing connection to use private notes and website leads. Do not write private information in public listing fields.";
 }
 function script(src,b){
  const church=src==="churches";
  const intro=church?"We're verifying information in our free Indigenous Church Directory.":"We're verifying information in our free Indigenous Business Directory.";
  const questions=church?
   ["Church name: "+b.name,"Address / community: "+(b.address||b.reserve||"not listed"),"Public phone: "+(b.phone||"not listed"),"Public email and website?","Pastor or public contact (only with permission)?","Worship service times?","Visitor access and accessibility?"]:
   ["Business name: "+b.name,"Address / service area: "+(b.address||b.city||"not listed"),"Public phone: "+(b.phone||"not listed"),"Public email and website?","Business hours and current services?"];
  return ["Hello! My name is Leah and I'm calling from Delta Owl Eyes. "+intro+" Do you have a couple of minutes?","","May I confirm:",...questions.map((q,i)=>(i+1)+". "+q),"",
   "Do you have a website you're happy with? We offer optional one-page websites for $199 and five-page websites for $499. Would you like more information? Your free directory listing never depends on buying anything.","",
   "Thank you! Find us at deltaowleyes.ca, deltaowleyes@gmail.com or on Facebook."].join("\n");
 }
 function show(src,b){
  source=src;record=b;recordKey=key(src,b);
  const x={...blank(),...(data[recordKey]||{})};
  $("websiteInterest").value=x.website_interest;$("lastContactDate").value=x.last_contact_date;
  $("followupDate").value=x.followup_date;$("callNotes").value=x.call_notes;
  $("outreachHeading").textContent=(src==="churches"?"Church":"Business")+" verification call and follow-up";
  $("callScript").textContent=script(src,b);enable();
  message(password?"Private follow-up unlocked. Save notes before switching listings.":"Private follow-up locked.");
 }
 async function open(passphrase){
  if(!passphrase||passphrase.length<16)throw Error("A saved connection passphrase of 16 or more characters is required.");
  const raw=localStorage.getItem(STORE);let next={};
  if(raw){try{next=await decrypt(raw,passphrase)}catch{throw Error("Private notes could not be decrypted. Existing notes were not overwritten.");}}
  password=passphrase;data=next;enable();if(record)show(source,record);
 }
 function lock(){password="";data={};enable();if(record)show(source,record)}
 function forget(){lock();localStorage.removeItem(STORE)}
 async function save(){
  if(!dirty())return false;
  const x=current();
  if(x.last_contact_date>new Date().toISOString().slice(0,10))throw Error("Last contact date cannot be in the future.");
  const next={...data};
  if(JSON.stringify(x)===JSON.stringify(blank()))delete next[recordKey];else next[recordKey]=x;
  const sealed=await encrypt(next,password);
  localStorage.setItem(STORE,sealed);
  if(localStorage.getItem(STORE)!==sealed)throw Error("Private notes could not be stored.");
  data=next;message("Private call notes saved encrypted on this browser.");
  window.dispatchEvent(new Event("doe-outreach-saved"));return true;
 }
 function init(){
  enable();
  $("saveOutreach").addEventListener("click",async()=>{try{if(!await save())message("No private changes to save.")}catch(e){message(e.message,true)}});
  $("copyCallScript").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("callScript").textContent);message("Call script copied.")}catch{message("Copy unavailable: select the script text and copy it.",true)}});
  for(const f of fields)$(f).addEventListener("input",()=>message("Private follow-up has unsaved changes."));
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
 window.DOEOutreach=Object.freeze({open,lock,forget,save,dirty,interestFor,show});
})();