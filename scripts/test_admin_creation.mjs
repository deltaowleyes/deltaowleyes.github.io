import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";

const admin=readFileSync("admin/admin.js","utf8");
const listSort=readFileSync("admin/list-sort.js","utf8");
const html=readFileSync("admin/index.html","utf8");
const publicList=readFileSync("indigenous-businesses/index.html","utf8");
const publicProfile=readFileSync("indigenous-businesses/profile.html","utf8");
const businesses=JSON.parse(readFileSync("indigenous-businesses/businesses.json","utf8"));
assert.ok(businesses.length>=4475,"Unified directory must retain the migration baseline");
assert.ok(!existsSync("indigenous-businesses/ontario-businesses.json"));
assert.ok(!existsSync("indigenous-businesses/federal-businesses.json"));
assert.ok(!html.includes('value="ontario"')&&!html.includes('value="federal"'));
assert.ok(html.includes('id="createNew"'));
assert.ok(!publicList.includes("ontario-businesses.json")&&!publicProfile.includes("federal-businesses.json"));
new vm.Script(admin);
new vm.Script(listSort);
const elements=new Map();
class El {
 constructor(tag="div"){this.tagName=tag;this.textContent="";this.value="";this.children=[];this.listeners={};
  this.style={};this.className="";this.disabled=false;this.checked=false;this.hidden=false;this.classList={toggle(){}};
 }
 set id(s){this._id=s;elements.set(s,this)}get id(){return this._id}
 addEventListener(name,listener){(this.listeners[name]??=[]).push(listener)}
 async fire(name,payload={}){for(const fn of this.listeners[name]??[])await fn(payload)}
 replaceChildren(...items){this.children=items}
 append(...items){this.children.push(...items)}
 add(item){this.children.push(item)}
 setAttribute(k,v){this[k]=v}
 focus(){}
}
const ids="status queued download manifest clear publish entries count search filter contactFilter interestFilter sort sortHint dataset load edit pickHint fields verification sourceLink revert checkAll uncheckAll bulkAttempt bulkFollow publishLink authStatus initialAuth savedAuth disconnect rememberPasswordWrap ghToken remember rememberPassphrase unlockPassphrase connect unlock forget saveRecord createNew".split(" ");
for(const id of ids){const el=new El();el.id=id}
elements.get("dataset").value="businesses";
elements.get("sort").value="newest_near";
const document={getElementById:id=>elements.get(id),createElement:tag=>new El(tag),body:new El()};
const copy=o=>JSON.parse(JSON.stringify(o));
const original={
 businesses:[{name:"Existing Business",city:"Test City",province:"Ontario",owner_confirmed:false,phone:"111-111-1111"}],
 churches:[{name:"Existing Church",reserve:"Test Nation",province:"Ontario",reserveLocated:null,indigenousLed:null,source:"https://example.org"}]
};
const simulated=copy(original),calls={puts:0,reads:0,fallback:0};
const base="https://api.github.com/repos/deltaowleyes/deltaowleyes.github.io";
const response=value=>({ok:true,json:async()=>copy(value)});
async function fetchMock(url,options={}){
 if(url==="/indigenous-businesses/businesses.json")return response(original.businesses);
 if(url==="/indigenous-churches/churches.json")return response(original.churches);
  if(url==="/data/directory-updates.json")return response({version:1,runs:[{at:"2026-10-31T14:00:00Z",additions:{businesses:[{key:"existingbusiness|testcity|ontario"}],churches:[{key:"existingchurch|ontario|testnation"}]}}]});
 if(!url.startsWith(base))throw Error("Unexpected request "+url);
 if(url===base)return response({permissions:{push:true}});
 const source=url.includes("churches")?"churches":"businesses";
 if(options.method==="PUT"){
  assert.equal(JSON.parse(options.body).sha,"sha-"+source);
  const incoming=JSON.parse(Buffer.from(JSON.parse(options.body).content,"base64").toString("utf8"));
  simulated[source]=incoming;calls.puts++;
  return response({commit:{sha:"synthetic-commit",html_url:"https://example.test/mock-commit"}});
 }
 if(url.includes("/git/blobs/")){calls.fallback++;return response({encoding:"base64",content:Buffer.from(JSON.stringify(simulated[source])).toString("base64")})}
 if(url.includes("/contents/")){calls.reads++;return response({sha:"sha-"+source,encoding:"none",content:null})}
 throw Error("Unexpected API path");
}
const window={
 DOEAuthVault:{load:()=>null,seal:async()=>({}),save:()=>{},open:async()=>"",forget:()=>{}},
 DOEOutreach:{dirty:()=>false,show:()=>{},rekey:()=>{},save:async()=>false,open:async()=>{},lock:()=>{},forget:()=>{},interestFor:()=>"not_asked"},
 addEventListener(){}
};
const sandbox={document,window,fetch:fetchMock,Option:class{constructor(text,value){this.text=text;this.value=value}},
 TextEncoder,TextDecoder,atob,btoa,confirm:()=>true,Blob,URL,setTimeout};
vm.runInNewContext(listSort,sandbox,{filename:"list-sort.js"});
vm.runInNewContext(admin,sandbox,{filename:"admin.js"});
const settle=()=>new Promise(resolve=>setImmediate(resolve));
await settle();
assert.ok(html.includes('id="sort"')&&html.includes('list-sort.js'));
assert.equal(window.DOEDirectorySort.date("businesses",original.businesses[0]),"2026-10-31");
assert.equal(window.DOEDirectorySort.date("churches",original.churches[0]),"2026-10-31");
assert.ok(window.DOEDirectorySort.proximity({city:"Walpole Island"}) < window.DOEDirectorySort.proximity({city:"Toronto"}));
assert.ok(window.DOEDirectorySort.compare("businesses",{name:"Newest",city:"Toronto",date_added:"2026-10-31"},{name:"Older",city:"Walpole Island",date_added:"2026-10-30"},"newest_near")<0,"Date added takes precedence over proximity");
assert.ok(window.DOEDirectorySort.compare("businesses",{name:"Near",city:"Walpole Island",date_added:"2026-10-31"},{name:"Far",city:"Toronto",date_added:"2026-10-31"},"newest_near")<0,"Proximity breaks same-date ties");
assert.ok(window.DOEDirectorySort.compare("businesses",{name:"Undated",city:"Walpole Island"},{name:"Dated",city:"Toronto",date_added:"2026-10-30"},"newest_near")>0,"Undated records follow dated entries");
assert.ok(window.DOEDirectorySort.compare("businesses",{name:"Undated",city:"Walpole Island"},{name:"Dated",city:"Toronto",date_added:"2026-10-30"},"near_newest")<0,"Proximity-first mode works");
assert.equal(window.DOEDirectorySort.proximity({city:"Unknown"}),Infinity,"Unknown location is never assigned an invented distance");
const click=id=>elements.get(id).fire("click");
const set=(id,value)=>{const el=elements.get(id);assert.ok(el,"Missing "+id);el.value=value;return el.fire("input")};
const submit=()=>elements.get("edit").fire("submit",{preventDefault(){}});
assert.equal(elements.get("entries").children.length,1);
assert.equal(elements.get("createNew").disabled,false,"Create listing button must enable when the source finishes loading.");
await click("createNew");
assert.equal(elements.get("field_name").disabled,false,"New name must be editable");
assert.equal(elements.get("field_city").disabled,false,"New city must be editable");
assert.equal(elements.get("field_province").disabled,false,"New province must be editable");
await set("field_name","New Test Business");
await set("field_city","Test City");
await set("field_province","Ontario");
await submit();assert.equal(calls.puts,0,"No token should prevent publishing");
assert.match(elements.get("status").textContent,/Connect GitHub/);
elements.get("ghToken").value="synthetic-token";
await click("connect");
assert.equal(calls.puts,1,"Connect should complete pending one-click publish");
assert.equal(simulated.businesses.length,2);
assert.equal(simulated.businesses[0].name,original.businesses[0].name);
assert.equal(simulated.businesses[1].name,"New Test Business");
assert.equal(simulated.businesses[1].verification_status,"unverified");
assert.ok(!JSON.stringify(simulated.businesses[1]).includes("call_notes"));
assert.equal(calls.fallback,1,"Large-file GitHub blob fallback is required");
await click("createNew");
await set("field_name","New Test Business");
await set("field_city","Test City");
await set("field_province","Ontario");
await submit();
assert.match(elements.get("status").textContent,/already exists/);
assert.equal(calls.puts,1,"Duplicate must not publish");
await click("revert");
assert.equal(calls.puts,1,"Discard must not publish");
elements.get("dataset").value="churches";
await elements.get("dataset").fire("change",{target:{value:"churches"}});
await settle();
assert.equal(elements.get("entries").children.length,1);
await click("createNew");
assert.equal(elements.get("field_reserve").disabled,false,"Church community must be editable");
await set("field_name","New Test Church");
await set("field_province","Ontario");
await set("field_reserve","Test Nation");
await set("field_service_times","Sunday at 10");
await submit();
assert.equal(calls.puts,2,"Church should publish through shared auth");
assert.equal(simulated.churches.length,2);
assert.equal(simulated.churches[1].service_times,"Sunday at 10");
assert.equal(simulated.churches[1].verification_status,"unverified");
assert.equal(simulated.churches[0].name,original.churches[0].name);
console.log("PASS unified 4,475+ business source, new business/church drafts, required fields, duplicate rejection, no-token block, GitHub blob fallback, authorized synthetic publish, unchanged records.");
