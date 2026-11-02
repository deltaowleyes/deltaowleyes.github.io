"use strict";
/* Browser-only worksheet. GitHub authentication is required separately for publishing. */
const SOURCES={
 businesses:{path:"/indigenous-businesses/businesses.json",name:"All business listings",dir:"indigenous-businesses",kind:"business"},
 churches:{path:"/indigenous-churches/churches.json",name:"Church listings",dir:"indigenous-churches",kind:"church"},
 events:{path:"/data/community-events.json",name:"Community events",dir:"events",kind:"event"}
};
const $=id=>document.getElementById(id);
const loaded=new Map(),staged=new Map(),checked=new Set(),newKeys=new Set();
let active="businesses",current=-1,shown=[],formChanged=false;
const FIELDS={
 business:[["name","Business name","locked"],["city","City","locked"],["province","Province","locked"],["description","Business description","textarea"],["address","Public street address","text"],["postal_code","Postal code","text"],["community","Community affiliation — evidence required","text"],["email","Public business email","email"],["business_hours","Public business hours","text"],["website","Website (https://)","url"],["category","Original industry category","text"],["source_url","Published source (https://)","url"],["phone","Public business phone","text"]],
 church:[["name","Church name","locked"],["province","Province","locked"],["reserve","Community / reserve","locked"],["denomination","Denomination","text"],["address","Public address","text"],["phone","Public phone","text"],["email","Public email","email"],["website","Church website (https://)","url"],["service_times","Public worship times","textarea"],["accessibility","Public visitor / accessibility notes","textarea"],["source","Published source (https://)","url"],["reserveLocated","Located on reserve — evidence required","tri"],["indigenousLed","Indigenous-led — evidence required","tri"]],
 event:[["title","Event title","text"],["start_date","Start date","date"],["end_date","End date (optional)","date"],["city","City or community","text"],["province","Province or territory","text"],["category","Event category","text"],["organizer","Official organizer","text"],["description","Public event description","textarea"],["url","Official organizer URL (https://)","url"],["status","Publication status","event-status"]]
};
const VERIFY=[["verification_status","Verification status","status"],["contact_status","Contact status","contact"],["verified_date","Representative confirmation date","date"],["verification_method","Confirmation method","method"]];
const key=i=>active+":"+i;
function record(i){return staged.get(key(i))||loaded.get(active)?.[i]}
function statusFor(source,b){return source==="events"?(b.status||"unverified"):(b.verification_status||(b.owner_confirmed||b.representative_confirmed?"verified":"unverified"))}
function status(b){return statusFor(active,b)}
function contact(b){return b.contact_status||"not_contacted"}
function hasPhoneNoWebsite(b){return Boolean(String(b.phone??"").trim())&&!String(b.website??"").trim()}
function short(b){return [b.title||b.name||"(new draft)",b.start_date,b.city||b.reserve,b.province].filter(Boolean).join(" · ")}
function pendingDelete(i){return staged.has(key(i))&&staged.get(key(i))===null}
function fingerprint(source,b){
 const clean=v=>String(v||"").trim().toLocaleLowerCase().replace(/\s+/g," ");
 return source==="events"?[clean(b.title),clean(b.start_date),clean(b.city),clean(b.province)].join("|"):[clean(b.name),clean(source==="churches"?b.reserve:b.city),clean(b.province)].join("|");
}
function assertUnique(source,b,records,except=-1){
 if(records.some((r,i)=>i!==except&&r&&fingerprint(source,r)===fingerprint(source,b)))
  throw Error("A listing with this name and location already exists. Search before creating a duplicate.");
}
function validateNew(source,b){
 if(source==="events"){
  if(!b.title?.trim()||!b.start_date||!b.city?.trim()||!b.province?.trim()||!b.organizer?.trim()||!b.category?.trim()||!b.url?.trim())
   throw Error("Event title, start date, location, category, organizer and official URL are required.");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(b.start_date)||!Number.isFinite(Date.parse(b.start_date+"T12:00:00Z")))
   throw Error("Provide a valid event start date.");
  if(b.end_date&&( !/^\d{4}-\d{2}-\d{2}$/.test(b.end_date)||b.end_date<b.start_date))
   throw Error("End date must be on or after the start date.");
  if(!/^https:\/\//i.test(b.url))throw Error("Event source URL must begin with https://.");
  if(!["verified","unverified","cancelled"].includes(b.status))throw Error("Choose a valid event publication status.");
  return;
 }
 if(!b.name?.trim()||!b.province?.trim())throw Error("Name and province or territory are required.");
 if(source==="churches"&&!b.reserve?.trim())throw Error("A church community / reserve is required.");
 if(source==="businesses"&&!b.city?.trim())throw Error("A business city / service-area location is required.");
}
function notify(msg,error=false){$("status").textContent=msg;$("status").classList.toggle("error",error)}
function updateQueue(){
 const n=staged.size;
 $("queued").textContent=n+" staged change"+(n===1?"":"s");
 $("download").disabled=![...staged.keys()].some(k=>k.startsWith(active+":"));
 $("manifest").disabled=n===0;$("clear").disabled=n===0;$("publish").disabled=n===0||busy;
}
function renderList(){
 const data=loaded.get(active)||[],query=$("search").value.trim().toLowerCase(),vf=$("filter").value,cf=$("contactFilter").value,interest=$("interestFilter").value,phoneWebsite=$("businessPhoneWebsiteFilter").value;
 const match=[];
 data.forEach((b,i)=>{const item=record(i);if(!item)return;if(query&&!short(item).toLowerCase().includes(query))return;if(vf&&status(item)!==vf)return;if(cf&&contact(item)!==cf)return;if(active!=="events"&&interest&&window.DOEOutreach.interestFor(active,item)!==interest)return;if(active==="businesses"&&phoneWebsite==="phone_no_website"&&!hasPhoneNoWebsite(item))return;match.push(i)});
 const sorter=window.DOEDirectorySort,sortMode=$("sort")?.value||"newest_near";
 if(sortMode==="event_date"&&active==="events")match.sort((a,b)=>
  Number(newKeys.has(key(b)))-Number(newKeys.has(key(a)))||
  String(record(a).start_date||"9999").localeCompare(String(record(b).start_date||"9999"))||
  String(record(a).title||"").localeCompare(String(record(b).title||""))||a-b);
 else if(sorter&&sortMode!=="original")match.sort((a,b)=>
  Number(newKeys.has(key(b)))-Number(newKeys.has(key(a)))||
  sorter.compare(active,record(a),record(b),sortMode)||a-b);
 shown=match.slice(0,100);$("entries").replaceChildren();
 for(const i of shown){
  const b=record(i),deleting=pendingDelete(i),row=document.createElement("div");row.className="entry"+(deleting?" pending-delete":"");
  const label=b.title||b.name||"(New unpublished listing)";
  const cb=document.createElement("input");cb.type="checkbox";cb.checked=!deleting&&checked.has(key(i));cb.disabled=deleting;
  cb.setAttribute("aria-label","Select "+label);
  cb.addEventListener("change",()=>{if(cb.checked)checked.add(key(i));else checked.delete(key(i));writeControls()});
  const open=document.createElement("button");open.type="button";open.textContent=label;open.disabled=deleting;
  open.setAttribute("aria-current",String(current===i));
  const date=window.DOEDirectorySort?.date(active,b);
  const sub=document.createElement("small");sub.textContent=[b.start_date||"",b.city||b.reserve,b.province,status(b).replaceAll("_"," "),newKeys.has(key(i))?"New, unpublished":date?"Added "+date:"Date added unknown",deleting?"Pending deletion":staged.has(key(i))?"Staged":""].filter(Boolean).join(" · ");
  open.append(sub);open.addEventListener("click",()=>select(i));
  row.append(cb,open);
  if(deleting){const undo=document.createElement("button");undo.type="button";undo.className="restore";undo.textContent="Undo delete";undo.addEventListener("click",()=>{
   staged.delete(key(i));renderList();notify("Deletion restored to the published listing.");
  });row.append(undo)}
  $("entries").append(row);
 }
 $("count").textContent=match.length.toLocaleString()+" matching / "+data.filter(Boolean).length.toLocaleString()+" total (including drafts); showing "+shown.length;
 updateQueue();
 writeControls();
}
function fieldVal(b,name){
 if(name==="verification_status")return status(b);
 if(name==="contact_status")return contact(b);
 if(name==="reserveLocated"||name==="indigenousLed")return b[name]===true?"true":b[name]===false?"false":"";
 return b[name]??"";
}
function makeField(def,b,place){
 const [name,title,type]=def,cell=document.createElement("div"),label=document.createElement("label");label.textContent=title;label.htmlFor="field_"+name;
 cell.append(label);let control;
 if(type==="textarea")control=document.createElement("textarea");
 else if(["tri","status","contact","method","event-status"].includes(type)){
  control=document.createElement("select");
  const values=type==="event-status"?[["unverified","Unverified — not publicly shown"],["verified","Verified — publicly shown"],["cancelled","Cancelled — not publicly shown"]]:
   type==="tri"?[["","Not confirmed"],["true","Yes — documented"],["false","No — documented"]]:
   type==="status"?[["unverified","Unverified"],["partially_verified","Partially verified"],["verified","Verified by representative"]]:
   type==="contact"?[["not_contacted","Not contacted"],["attempted","Attempted"],["follow_up","Follow-up needed"],["contacted","Contacted"]]:
   [["","Not specified"],["phone","Phone"],["email","Email"],["business_submission","Business submission"],["church_submission","Church submission"],["in_person","In person"]];
  for(const [value,text] of values)control.add(new Option(text,value));
 }else {control=document.createElement("input");control.type=type==="date"?"date":type==="url"?"url":type==="email"?"email":"text"}
 control.id="field_"+name;control.name=name;control.value=String(fieldVal(b,name));
 if(type==="locked"&&!newKeys.has(key(current)))control.disabled=true;
 const changed=()=>{formChanged=true;notify("Unsaved fields. Stage the record before selecting another listing.")};
 control.addEventListener("input",changed);control.addEventListener("change",changed);
 cell.append(control);place.append(cell);
}
function select(i,skipGuard=false){
 if(!skipGuard&&(formChanged||window.DOEOutreach.dirty())&&!confirm("Discard unsaved public fields or private notes? Other staged records will be kept."))return;
 if(pendingDelete(i)){notify("Use Undo delete to restore this record before editing.",true);return}
 current=i;formChanged=false;const b=record(i);$("edit").hidden=false;$("pickHint").textContent=(newKeys.has(key(i))?"Creating ":"Editing ")+short(b);
 $("fields").replaceChildren();$("verification").replaceChildren();
 for(const def of FIELDS[SOURCES[active].kind])makeField(def,b,$("fields"));
 if(active!=="events")for(const def of VERIFY)makeField(def,b,$("verification"));
 $("verificationPanel").hidden=active==="events";$("outreachPanel").hidden=active==="events";
 if(active!=="events")window.DOEOutreach.show(active,b);
 $("deleteRecord").textContent=newKeys.has(key(i))?"Discard unpublished draft":active==="events"?"Delete event":"Delete listing";
 const src=active==="events"?b.url:SOURCES[active].kind==="church"?b.source:b.source_url;
 $("sourceLink").hidden=!/^https:\/\//i.test(src||"");
 if(!$("sourceLink").hidden)$("sourceLink").href=src;
 notify(staged.has(key(i))?"This record is already staged; stage again after making further changes.":"");
 renderList();
}
function editedRecord(){
 const original=loaded.get(active)[current],b={...original},kind=SOURCES[active].kind;
 for(const [name,,type] of FIELDS[kind].concat(kind==="event"?[]:VERIFY)){
  if(type==="locked"&&!newKeys.has(key(current)))continue;
  const value=$("field_"+name).value.trim();
  const normalized=type==="tri"?(value===""?null:value==="true"):value;
  // Do not publish blank/default fields merely because the user saved private outreach notes.
  const implicit=(name==="verification_status"&&value==="unverified")||(name==="contact_status"&&value==="not_contacted");
  if(!(name in original)&&(normalized===""||normalized===null||implicit))continue;
  b[name]=normalized;
 }
 if(newKeys.has(key(current))||kind==="event"){
  validateNew(active,b);
  assertUnique(active,b,loaded.get(active),current);
 }
 if(kind!=="event"&&b.verification_status==="verified"){
  if(!b.verified_date||!b.verification_method)throw Error("Verified requires a representative confirmation date and method.");
  if(b.verified_date>new Date().toISOString().slice(0,10))throw Error("Confirmation date cannot be in the future.");
 }
 for(const url of (kind==="church"?["source","website"]:kind==="event"?["url"]:["website"])){
  if(b[url]&&!/^https:\/\//i.test(b[url]))throw Error("Public URL must begin with https://");
 }
 if(kind==="church"){
  if(b.verification_status==="verified"||"representative_confirmed" in original)b.representative_confirmed=b.verification_status==="verified";
 }else if(kind==="business"&&(b.verification_status==="verified"||"owner_confirmed" in original)){
  b.owner_confirmed=b.verification_status==="verified";
 }
 return b;
}
$("edit").addEventListener("submit",async event=>{
 event.preventDefault();if(current<0||busy)return;
 try{
  const updated=editedRecord(),id=key(current);
  if(newKeys.has(id))window.DOEOutreach.rekey(active,updated);
  const privateSaved=await window.DOEOutreach.save();
  if(newKeys.has(id)||JSON.stringify(updated)!==JSON.stringify(loaded.get(active)[current]))staged.set(id,updated);
  else staged.delete(id);
  formChanged=false;renderList();
  if(!staged.has(id)){notify(privateSaved?"Private notes saved on this browser; no public listing changes to publish.":"There are no changes to publish.");return}
  await publishChanges([active]);
 }catch(err){notify(err.message,true)}
});
$("revert").addEventListener("click",()=>{
 if(current<0||!confirm(newKeys.has(key(current))?"Discard this unpublished new listing?":"Revert this record to the originally loaded published version?"))return;
 const id=key(current);
 staged.delete(id);checked.delete(id);formChanged=false;
 if(newKeys.delete(id)){
  loaded.get(active)[current]=null;
  current=-1;$("edit").hidden=true;$("pickHint").textContent="Choose a listing or create a new one.";
  renderList();notify("Unpublished listing discarded.");return;
 }
 select(current,true);notify("This record's staged edits have been discarded.");
});
$("createNew").addEventListener("click",()=>{
 if(busy||!loaded.has(active)){notify("Wait for the directory to finish loading.",true);return}
 if((formChanged||window.DOEOutreach.dirty())&&!confirm("Discard unsaved form fields or private notes before creating a listing?"))return;
 const draft=active==="events"?
  {title:"",start_date:"",end_date:"",city:"",province:"",category:"",organizer:"",description:"",url:"",status:"unverified"}:
  active==="churches"?
  {name:"",province:"",reserve:"",verification_status:"unverified",contact_status:"not_contacted",representative_confirmed:false,reserveLocated:null,indigenousLed:null}:
  {name:"",city:"",province:"",verification_status:"unverified",contact_status:"not_contacted",owner_confirmed:false};
 const i=loaded.get(active).push(draft)-1;
 newKeys.add(key(i));staged.set(key(i),{...draft});formChanged=false;
 $("search").value="";$("filter").value="";$("contactFilter").value="";$("interestFilter").value="";$("businessPhoneWebsiteFilter").value="";
 select(i,true);
 $("field_"+(active==="events"?"title":"name")).focus();notify("New unpublished "+(active==="events"?"event":"listing")+". Enter the required details, then click Update & publish.");
});
for(const id of ["search","filter","contactFilter","interestFilter","businessPhoneWebsiteFilter","sort"])
 $(id)?.addEventListener(id==="search"?"input":"change",renderList);
$("checkAll").addEventListener("click",()=>{shown.forEach(i=>checked.add(key(i)));renderList()});
$("uncheckAll").addEventListener("click",()=>{for(const id of [...checked])if(id.startsWith(active+":"))checked.delete(id);renderList()});
function bulk(contactStatus){
 if(active==="events"){notify("Use Delete selected records for events; outreach statuses apply only to businesses and churches.",true);return}
 const selected=[...checked].filter(id=>id.startsWith(active+":"));
 if(!selected.length){notify("Select listing checkboxes first.",true);return}
 if(formChanged||window.DOEOutreach.dirty()){notify("Save or discard unsaved public edits and private notes first.",true);return}
 if(!confirm("Mark "+selected.length+" selected listings as "+contactStatus.replaceAll("_"," ")+"? Only use this for actual outreach work. This will not verify any listing."))return;
 for(const id of selected){
  const i=Number(id.slice(active.length+1)),orig=loaded.get(active)?.[i];if(!orig)continue;
  const changed={...record(i),contact_status:contactStatus};
  if(newKeys.has(id)||JSON.stringify(changed)!==JSON.stringify(orig))staged.set(id,changed);else staged.delete(id);
 }
 checked.clear();if(current>=0)select(current);else renderList();
 notify("Outreach updates ready. Click Update all staged changes to publish.");
}
$("bulkAttempt").addEventListener("click",()=>bulk("attempted"));
$("bulkFollow").addEventListener("click",()=>bulk("follow_up"));
function discardOrDelete(i){
 const id=key(i);
 checked.delete(id);
 if(newKeys.has(id)){staged.delete(id);newKeys.delete(id);loaded.get(active)[i]=null}
 else staged.set(id,null);
 if(current===i){current=-1;formChanged=false;$("edit").hidden=true;$("pickHint").textContent="Choose another record or undo the staged deletion."}
}
$("deleteRecord").addEventListener("click",()=>{
 if(busy||current<0)return;
 if(formChanged||window.DOEOutreach.dirty()){notify("Save or discard unsaved public fields and private notes before deleting.",true);return}
 const item=record(current),label=item.title||item.name||"this record",draft=newKeys.has(key(current));
 if(!confirm((draft?"Discard unpublished draft ":"Stage deletion of ")+label+"? "+(draft?"It was never published.":"This removes the public record only after you publish the staged changes to GitHub.")))return;
 discardOrDelete(current);renderList();notify(draft?"Unpublished draft discarded.":"Deletion staged. Click Update all staged changes to publish, or Undo delete in the list.");
});
$("deleteSelected").addEventListener("click",()=>{
 if(busy)return;
 if(formChanged||window.DOEOutreach.dirty()){notify("Save or discard unsaved fields and private notes first.",true);return}
 const ids=[...checked].filter(id=>id.startsWith(active+":")&&!pendingDelete(Number(id.slice(active.length+1))));
 if(!ids.length){notify("Select one or more records first.",true);return}
 if(!confirm("Stage deletion of "+ids.length+" selected records from "+SOURCES[active].name+"? They will be removed publicly only after you publish. This action can be undone before publishing."))return;
 for(const id of ids)discardOrDelete(Number(id.slice(active.length+1)));
 renderList();notify(ids.length+" deletion(s) staged. Review and click Update all staged changes to publish.");
});
function download(filename,text,mime){
 const blob=new Blob([text],{type:mime||"application/json;charset=utf-8"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
$("download").addEventListener("click",()=>{
 if(formChanged){notify("Stage the current form first.",true);return}
 const original=loaded.get(active);if(!original)return;
 const changes=[...staged.entries()].filter(([id])=>id.startsWith(active+":"));
 if(!changes.length){notify("No changes to download from this source.",true);return}
 const output=original.map((r,i)=>staged.has(active+":"+i)?staged.get(active+":"+i):r).filter(Boolean);
 const filename=SOURCES[active].path.split("/").pop();
 download(filename,JSON.stringify(output,null,2)+"\n");
 notify("Downloaded "+filename+" with "+changes.length+" staged records. An authorized GitHub commit is still required.");
});
$("manifest").addEventListener("click",()=>{
 const rows=[["Dataset","Index","Name","Action","Status","Contact status"]];
 for(const [id,b] of staged){
  const pos=id.lastIndexOf(":"),source=id.slice(0,pos),i=Number(id.slice(pos+1)),item=b||loaded.get(source)?.[i]||{};
  rows.push([source,i,item.title||item.name||"",b===null?"Delete":newKeys.has(id)?"Add":"Update",statusFor(source,item),source==="events"?"":contact(item)])
 }
 const csv=rows.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(",")).join("\r\n")+"\r\n";
 download("directory-change-summary.csv",csv,"text/csv;charset=utf-8");
});
$("clear").addEventListener("click",()=>{
 if(!confirm("Discard every staged edit across all directories?"))return;
 for(const id of newKeys){
  const [source,index]=id.split(":");
  if(loaded.has(source))loaded.get(source)[Number(index)]=null;
 }
 newKeys.clear();staged.clear();checked.clear();formChanged=false;current=-1;
 $("edit").hidden=true;$("pickHint").textContent="Choose a listing or create a new one.";
 renderList();notify("All staged changes discarded.");
});
async function loadSource(source){
 if((formChanged||window.DOEOutreach.dirty())&&!confirm("Discard unsaved public edits or private notes before switching datasets? Other staged changes will remain.")){$("dataset").value=active;return}
 active=source;current=-1;formChanged=false;checked.clear();$("edit").hidden=true;$("pickHint").textContent="Choose a listing on the left.";notify("");
 const info=SOURCES[source];
 $("publishLink").textContent="Dataset: "+info.name+". Changes publish directly through GitHub after connection.";
 if(!loaded.has(source)){
  $("load").textContent="Loading "+info.name+"…";$("entries").replaceChildren();$("count").textContent="";
  try{
   const response=await fetch(info.path,{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);
   const data=await response.json();
   if(!Array.isArray(data)||data.some(r=>!r||typeof r!=="object"||!(source==="events"?r.title:r.name)))throw Error("Unexpected records format");
   loaded.set(source,data);
  }catch(err){
   if(active===source){$("load").textContent="Unable to load "+info.name+": "+err.message;notify("The dataset is unavailable; no publication file will be created.",true);updateQueue()}
   return;
  }
 }
 if(active!==source)return;
 $("load").textContent=loaded.get(active).filter(Boolean).length.toLocaleString()+" "+info.name.toLowerCase()+" loaded.";
 $("createNew").textContent=active==="events"?"+ New event":active==="churches"?"+ New church":"+ New business";
 $("contactFilterWrap").hidden=active==="events";$("interestFilterWrap").hidden=active==="events";
  $("businessPhoneWebsiteFilterWrap").hidden=active!=="businesses";$("businessPhoneWebsiteFilter").value="";
 $("outreachActions").hidden=active==="events";$("filterLabel").textContent=active==="events"?"Event status":"Verification status";
 const filterOptions=active==="events"?[["","All event statuses"],["verified","Verified"],["unverified","Unverified"],["cancelled","Cancelled"]]:
  [["","All statuses"],["unverified","Unverified"],["partially_verified","Partially verified"],["verified","Verified"]];
 $("filter").replaceChildren(...filterOptions.map(([v,t])=>new Option(t,v)));
 const sortOptions=active==="events"?[["event_date","Event date: earliest first"],["newest_near","Date added: newest first"],["name","Title A–Z"],["original","Original data order"]]:
  [["newest_near","Date added: newest first, then proximity to Walpole Island"],["near_newest","Approximate proximity to Walpole Island, then newest date"],["name","Name A–Z"],["original","Original directory order"]];
 $("sort").replaceChildren(...sortOptions.map(([v,t])=>new Option(t,v)));
 $("sortHint").textContent=active==="events"?"All events are shown, including past events. Publishing status determines whether an upcoming event appears on the public calendar.":"New additions are dated using publication history. Proximity to Walpole Island is approximate.";
 renderList();
}
$("dataset").addEventListener("change",event=>loadSource(event.target.value));

/* Connected publishing: no browser storage, no cross-site scripts, no secrets in Git. */
const API="https://api.github.com/repos/deltaowleyes/deltaowleyes.github.io";
let githubToken="",busy=false,pendingAfterConnect=false;
function authMessage(message,error=false){
 const box=$("authStatus");box.textContent=message;box.style.color=error?"#9a2c1d":"#224d41";
}
function vaultRecord(){
 try{return window.DOEAuthVault?.load()||null}
 catch(err){authMessage(err.message,true);return null}
}
function renderAuth(){
 const connected=Boolean(githubToken),saved=Boolean(vaultRecord());
 $("initialAuth").hidden=connected||saved;
 $("savedAuth").hidden=connected||!saved;
 $("disconnect").hidden=!connected;
 $("rememberPasswordWrap").hidden=!$("remember").checked;
 writeControls();
}
function writeControls(){
 $("connect").disabled=busy;
 $("unlock").disabled=busy;
 $("forget").disabled=busy;
 $("disconnect").disabled=busy||!githubToken;
 $("saveRecord").disabled=busy;
 $("deleteRecord").disabled=busy||current<0;
 $("deleteSelected").disabled=busy||![...checked].some(id=>id.startsWith(active+":"));
 $("createNew").disabled=busy||!loaded.has(active);
 $("publish").disabled=busy||staged.size===0;
}
async function githubRequest(path,options={},candidate){
 const token=candidate||githubToken;
 if(!token)throw Error("Unlock or connect to GitHub before publishing.");
 const result=await fetch(API+path,{...options,cache:"no-store",headers:{
  "Accept":"application/vnd.github+json",
  "X-GitHub-Api-Version":"2022-11-28",
  "Authorization":"Bearer "+token,
  ...(options.body?{"Content-Type":"application/json"}:{}),
  ...options.headers
 }});
 const obj=await result.json().catch(()=>({}));
 if(!result.ok){
  const reason=(obj.message||result.statusText||"GitHub request failed").slice(0,350);
  if(result.status===401||result.status===403)throw Error("GitHub rejected this connection ("+result.status+"): "+reason+". Reconnect if the token expired or was revoked.");
  if(result.status===409||result.status===422)throw Error("GitHub detected a conflicting update ("+result.status+"). No conflicting changes were overwritten; reload this source first.");
  throw Error("GitHub error "+result.status+": "+reason);
 }
 return obj;
}
async function verifyConnection(token){
 const repository=await githubRequest("",{},token);
 if(!repository.permissions?.push)throw Error("This GitHub account has no write permission for this repository.");
}
async function connected(token,privatePassphrase=""){
 githubToken=token;
 $("ghToken").value="";$("rememberPassphrase").value="";$("unlockPassphrase").value="";
 renderAuth();
 authMessage("Publishing connected. Click Update & publish to save changes directly.");
 if(privatePassphrase){try{await window.DOEOutreach.open(privatePassphrase);renderList()}catch(e){authMessage("Publishing connected, but "+e.message,true)}}
 if(pendingAfterConnect){
  pendingAfterConnect=false;
  await publishChanges();
 }
}
$("remember").addEventListener("change",renderAuth);
$("connect").addEventListener("click",async()=>{
 if(busy)return;
 const token=$("ghToken").value.trim(),remember=$("remember").checked;
 if(!token){authMessage("Enter a repository-limited GitHub token.",true);$("ghToken").focus();return}
 const phrase=$("rememberPassphrase").value;
 if(remember&&phrase.length<16){authMessage("Choose a connection passphrase of at least 16 characters.",true);$("rememberPassphrase").focus();return}
 busy=true;writeControls();authMessage("Checking repository access…");
 try{
  await verifyConnection(token);
  if(remember){
   const vault=await window.DOEAuthVault.seal(token,phrase);
   window.DOEAuthVault.save(vault);
  }
  busy=false;
  await connected(token,remember?phrase:"");
 }catch(err){authMessage(err.message,true)}
 finally{busy=false;writeControls()}
});
$("unlock").addEventListener("click",async()=>{
 if(busy)return;
 const passphrase=$("unlockPassphrase").value;
 $("unlockPassphrase").value="";
 if(!passphrase){authMessage("Enter the saved connection passphrase.",true);$("unlockPassphrase").focus();return}
 busy=true;writeControls();authMessage("Unlocking saved connection…");
 try{
  const record=window.DOEAuthVault.load();
  if(!record)throw Error("No saved connection found. Connect to GitHub again.");
  const token=await window.DOEAuthVault.open(record,passphrase);
  await verifyConnection(token);
  busy=false;
  await connected(token,passphrase);
 }catch(err){authMessage(err.message,true)}
 finally{busy=false;writeControls()}
});
$("disconnect").addEventListener("click",()=>{
 githubToken="";pendingAfterConnect=false;window.DOEOutreach.lock();
 renderAuth();authMessage("Locked. Saved encrypted connection was retained on this device.");
});
$("forget").addEventListener("click",()=>{
 if(!confirm("Forget this device's GitHub connection AND its encrypted private outreach notes? This cannot be undone."))return;
 window.DOEAuthVault.forget();window.DOEOutreach.forget();githubToken="";pendingAfterConnect=false;
 $("ghToken").value="";$("rememberPassphrase").value="";$("unlockPassphrase").value="";
 $("remember").checked=false;
 renderAuth();authMessage("Saved connection erased from this browser. Connect with a new token.");
});
function base64Decode(value){
 const raw=atob(value.replace(/\s/g,"")),buf=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)buf[i]=raw.charCodeAt(i);
 return new TextDecoder().decode(buf);
}
function base64Encode(text){
 const bytes=new TextEncoder().encode(text);
 let raw="";for(let i=0;i<bytes.length;i+=8192){raw+=String.fromCharCode(...bytes.subarray(i,i+8192))}
 return btoa(raw);
}
async function readLatest(source){
 const path=SOURCES[source].path;
 const info=await githubRequest("/contents"+path+"?ref=main",{headers:{"Accept":"application/vnd.github.object+json"}});
 let encoded=info.content;
 if(info.encoding!=="base64"||!encoded){
  const blob=await githubRequest("/git/blobs/"+encodeURIComponent(info.sha));
  encoded=blob.content;
  if(blob.encoding!=="base64"||!encoded)throw Error("GitHub did not return readable JSON for "+path);
 }
 const text=base64Decode(encoded);
 const records=JSON.parse(text);
 if(!Array.isArray(records))throw Error("Unexpected JSON from GitHub for "+path);
 return {records,text,sha:info.sha};
}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function identity(source,b){
 return source==="events"?[b.title,b.start_date,b.city,b.province].join("\u001f"):
 SOURCES[source].kind==="church"?[b.name,b.province,b.reserve].join("\u001f"):
 [b.source_id||"",b.name,b.city,b.province].join("\u001f");
}
function mergeDrafts(source,remote){
 const original=loaded.get(source);
 if(!original)throw Error("Source not loaded: "+source);
 const updates=[...staged.entries()].filter(([id])=>id.startsWith(source+":"));
 const records=remote.records,removals=[];
 for(const [key,draft] of updates){
  if(newKeys.has(key)){
   if(draft===null)continue;
   validateNew(source,draft);
   assertUnique(source,draft,records);
   records.push({...draft});
   continue;
  }
  const index=Number(key.slice(source.length+1)),base=original[index];
  if(!base)throw Error("Original record missing; refresh before updating.");
  let at=index;
  if(!records[at]||identity(source,records[at])!==identity(source,base)){
   const matches=records.map((r,i)=>identity(source,r)===identity(source,base)?i:-1).filter(i=>i>=0);
   if(matches.length!==1)throw Error("Listing was moved or duplicated on GitHub: "+base.name+". Reload before editing.");
   at=matches[0];
  }
  const currentRecord=records[at];
  if(draft===null){
   if(!same(base,currentRecord))throw Error("Record changed on GitHub since loading: "+(base.title||base.name)+". Reload before deleting.");
   removals.push(at);continue;
  }
  const merged={...currentRecord};
  for(const [field,value] of Object.entries(draft)){
   if(same(base[field],value))continue;
   if(!same(base[field],currentRecord[field])&&!same(value,currentRecord[field])){
    throw Error("Another editor changed '"+field+"' on "+base.name+". Nothing was overwritten. Reload before editing.");
   }
   merged[field]=value;
  }
  records[at]=merged;
 }
 for(const at of [...new Set(removals)].sort((a,b)=>b-a))records.splice(at,1);
 return {records,updates};
}
async function publishChanges(onlySources=null){
 if(busy)return false;
 const sources=[...new Set([...staged.keys()].map(x=>x.split(":")[0]))].filter(s=>!onlySources||onlySources.includes(s));
 if(!sources.length){notify("No changes to publish.");return true}
 if(!githubToken){
  pendingAfterConnect=true;notify("Your edits are ready. Connect GitHub above to finish publishing.",true);
  authMessage("Unlock the saved connection or connect GitHub to publish.");(vaultRecord()?$("unlockPassphrase"):$("ghToken")).focus();return false;
 }
 if(formChanged){notify("Click Update & publish to include the unsaved fields first.",true);return false}
 busy=true;writeControls();let saved=0;
 try{
  for(const source of sources){
   notify("Publishing "+SOURCES[source].name+" to GitHub…");
   const remote=await readLatest(source), merged=mergeDrafts(source,remote);
   const selectedKey=source===active&&current>=0?key(current):null;
   const selectedNew=selectedKey&&newKeys.has(selectedKey)?record(current):null;
   const hasDeletions=merged.updates.some(([,draft])=>draft===null);
   const indent=remote.text.includes("\n")?2:0;
   const serialized=JSON.stringify(merged.records,null,indent)+(remote.text.endsWith("\n")?"\n":"");
   if(serialized===remote.text){
    for(const [entryKey] of merged.updates){staged.delete(entryKey);newKeys.delete(entryKey)}
    loaded.set(source,merged.records);continue;
   }
   const path=SOURCES[source].path;
   const result=await githubRequest("/contents"+path,{method:"PUT",body:JSON.stringify({
    message:"Admin: publish "+merged.updates.length+" change(s) in "+SOURCES[source].name,
    content:base64Encode(serialized),sha:remote.sha,branch:"main"
   })});
   if(!result.commit?.sha)throw Error("GitHub did not confirm a commit for "+path);
   for(const [entryKey] of merged.updates){staged.delete(entryKey);newKeys.delete(entryKey)}
   loaded.set(source,merged.records);
   if(hasDeletions&&source===active){current=-1;$("edit").hidden=true;$("pickHint").textContent="Published changes. Choose a record to continue."}
   else if(selectedNew)current=merged.records.findIndex(r=>fingerprint(source,r)===fingerprint(source,selectedNew));
   saved+=merged.updates.length;
   $("publishLink").replaceChildren();
   const link=document.createElement("a");
   link.href=result.commit.html_url||"https://github.com/deltaowleyes/deltaowleyes.github.io/commit/"+result.commit.sha;
   link.target="_blank";link.rel="noopener noreferrer";link.textContent="View successful GitHub commit";
   $("publishLink").append(link);
  }
  if(current>=0&&onlySources?.includes(active)){formChanged=false;const now=record(current);$("pickHint").textContent="Published: "+short(now)}
  notify("Published "+saved+" record change(s), including any staged deletions, directly to GitHub. Public pages will refresh after deployment.");
  renderList();return true;
 }catch(err){
  notify((saved?("Published "+saved+" record(s), but remaining changes were not saved. "):"Nothing new was published. ")+err.message,true);
  return false;
 }finally{busy=false;writeControls();renderList()}
}
$("publish").addEventListener("click",()=>publishChanges());
window.addEventListener("beforeunload",event=>{
 if(staged.size||formChanged||window.DOEOutreach.dirty()){event.preventDefault();event.returnValue="";}
});

window.addEventListener("doe-outreach-saved",renderList);
renderAuth();
loadSource(active);
if(window.DOEDirectorySort){
 window.DOEDirectorySort.load().then(()=>{
  if(active!=="events")$("sortHint").textContent="Newest published addition dates first; on the same date, approximate proximity to Walpole Island decides the order. Older undated records follow; unknown locations sort last.";
  renderList();
 }).catch(e=>{if(active!=="events")$("sortHint").textContent="Addition history unavailable ("+e.message+"); only explicit creation dates can be used. Approximate proximity still works.";});
}
