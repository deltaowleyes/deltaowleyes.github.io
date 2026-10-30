"use strict";
/* Browser-only worksheet. GitHub authentication is required separately for publishing. */
const SOURCES={
 businesses:{path:"/indigenous-businesses/businesses.json",name:"Main business listings",dir:"indigenous-businesses",kind:"business"},
 ontario:{path:"/indigenous-businesses/ontario-businesses.json",name:"Ontario business listings",dir:"indigenous-businesses",kind:"business"},
 federal:{path:"/indigenous-businesses/federal-businesses.json",name:"Federal business listings",dir:"indigenous-businesses",kind:"business"},
 churches:{path:"/indigenous-churches/churches.json",name:"Church listings",dir:"indigenous-churches",kind:"church"}
};
const $=id=>document.getElementById(id);
const loaded=new Map(),staged=new Map(),checked=new Set();
let active="businesses",current=-1,shown=[],formChanged=false;
const FIELDS={
 business:[["name","Business name","locked"],["city","City","locked"],["province","Province","locked"],["description","Business description","textarea"],["address","Public street address","text"],["postal_code","Postal code","text"],["community","Community affiliation — evidence required","text"],["phone","Public business phone","text"],["email","Public business email","email"],["business_hours","Public business hours","text"],["website","Website (https://)","url"],["category","Original industry category","text"]],
 church:[["name","Church name","locked"],["province","Province","locked"],["reserve","Community / reserve","locked"],["denomination","Denomination","text"],["address","Public address","text"],["phone","Public phone","text"],["email","Public email","email"],["website","Church website (https://)","url"],["service_times","Public worship times","textarea"],["accessibility","Public visitor / accessibility notes","textarea"],["source","Published source (https://)","url"],["reserveLocated","Located on reserve — evidence required","tri"],["indigenousLed","Indigenous-led — evidence required","tri"]]
};
const VERIFY=[["verification_status","Verification status","status"],["contact_status","Contact status","contact"],["verified_date","Representative confirmation date","date"],["verification_method","Confirmation method","method"]];
const key=i=>active+":"+i;
function record(i){return staged.get(key(i))||loaded.get(active)?.[i]}
function status(b){return b.verification_status||(b.owner_confirmed||b.representative_confirmed?"verified":"unverified")}
function contact(b){return b.contact_status||"not_contacted"}
function short(b){return [b.name,b.city||b.reserve,b.province].filter(Boolean).join(" · ")}
function notify(msg,error=false){$("status").textContent=msg;$("status").classList.toggle("error",error)}
function updateQueue(){
 const n=staged.size;
 $("queued").textContent=n+" staged change"+(n===1?"":"s");
 $("download").disabled=![...staged.keys()].some(k=>k.startsWith(active+":"));
 $("manifest").disabled=n===0;$("clear").disabled=n===0;$("publish").disabled=n===0||busy;
}
function renderList(){
 const data=loaded.get(active)||[],query=$("search").value.trim().toLowerCase(),vf=$("filter").value,cf=$("contactFilter").value,interest=$("interestFilter").value;
 const match=[];
 data.forEach((b,i)=>{const item=record(i);if(query&&!short(item).toLowerCase().includes(query))return;if(vf&&status(item)!==vf)return;if(cf&&contact(item)!==cf)return;if(interest&&window.DOEOutreach.interestFor(active,item)!==interest)return;match.push(i)});
 shown=match.slice(0,100);$("entries").replaceChildren();
 for(const i of shown){
  const b=record(i),row=document.createElement("div");row.className="entry";
  const cb=document.createElement("input");cb.type="checkbox";cb.checked=checked.has(key(i));
  cb.setAttribute("aria-label","Select "+b.name+" for outreach updates");
  cb.addEventListener("change",()=>{if(cb.checked)checked.add(key(i));else checked.delete(key(i))});
  const open=document.createElement("button");open.type="button";open.textContent=b.name;
  open.setAttribute("aria-current",String(current===i));
  const sub=document.createElement("small");sub.textContent=[b.city||b.reserve,b.province,status(b).replaceAll("_"," ")].filter(Boolean).join(" · ")+(staged.has(key(i))?" · Staged":"");
  open.append(sub);open.addEventListener("click",()=>select(i));
  row.append(cb,open);$("entries").append(row);
 }
 $("count").textContent=match.length.toLocaleString()+" matching / "+data.length.toLocaleString()+" total; showing "+shown.length;
 updateQueue();
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
 else if(["tri","status","contact","method"].includes(type)){
  control=document.createElement("select");
  const values=type==="tri"?[["","Not confirmed"],["true","Yes — documented"],["false","No — documented"]]:
   type==="status"?[["unverified","Unverified"],["partially_verified","Partially verified"],["verified","Verified by representative"]]:
   type==="contact"?[["not_contacted","Not contacted"],["attempted","Attempted"],["follow_up","Follow-up needed"],["contacted","Contacted"]]:
   [["","Not specified"],["phone","Phone"],["email","Email"],["business_submission","Business submission"],["church_submission","Church submission"],["in_person","In person"]];
  for(const [value,text] of values)control.add(new Option(text,value));
 }else {control=document.createElement("input");control.type=type==="date"?"date":type==="url"?"url":type==="email"?"email":"text"}
 control.id="field_"+name;control.name=name;control.value=String(fieldVal(b,name));
 if(type==="locked")control.disabled=true;
 const changed=()=>{formChanged=true;notify("Unsaved fields. Stage the record before selecting another listing.")};
 control.addEventListener("input",changed);control.addEventListener("change",changed);
 cell.append(control);place.append(cell);
}
function select(i){
 if((formChanged||window.DOEOutreach.dirty())&&!confirm("Discard unsaved public fields or private notes? Other staged records will be kept."))return;
 current=i;formChanged=false;const b=record(i);$("edit").hidden=false;$("pickHint").textContent="Editing "+short(b);
 $("fields").replaceChildren();$("verification").replaceChildren();
 for(const def of FIELDS[SOURCES[active].kind])makeField(def,b,$("fields"));
 for(const def of VERIFY)makeField(def,b,$("verification"));
 window.DOEOutreach.show(active,b);
 const src=SOURCES[active].kind==="church"?b.source:b.source_url;
 $("sourceLink").hidden=!/^https:\/\//i.test(src||"");
 if(!$("sourceLink").hidden)$("sourceLink").href=src;
 notify(staged.has(key(i))?"This record is already staged; stage again after making further changes.":"");
 renderList();
}
function editedRecord(){
 const original=loaded.get(active)[current],b={...original},kind=SOURCES[active].kind;
 for(const [name,,type] of FIELDS[kind].concat(VERIFY)){
  if(type==="locked")continue;
  const value=$("field_"+name).value.trim();
  const normalized=type==="tri"?(value===""?null:value==="true"):value;
  // Do not publish blank/default fields merely because the user saved private outreach notes.
  const implicit=(name==="verification_status"&&value==="unverified")||(name==="contact_status"&&value==="not_contacted");
  if(!(name in original)&&(normalized===""||normalized===null||implicit))continue;
  b[name]=normalized;
 }
 if(b.verification_status==="verified"){
  if(!b.verified_date||!b.verification_method)throw Error("Verified requires a representative confirmation date and method.");
  if(b.verified_date>new Date().toISOString().slice(0,10))throw Error("Confirmation date cannot be in the future.");
 }
 for(const url of (kind==="church"?["source","website"]:["website"])){
  if(b[url]&&!/^https:\/\//i.test(b[url]))throw Error("Public URL must begin with https://");
 }
 if(kind==="church"){
  if(b.verification_status==="verified"||"representative_confirmed" in original)b.representative_confirmed=b.verification_status==="verified";
 }else if(b.verification_status==="verified"||"owner_confirmed" in original){
  b.owner_confirmed=b.verification_status==="verified";
 }
 return b;
}
$("edit").addEventListener("submit",async event=>{
 event.preventDefault();if(current<0||busy)return;
 try{
  const updated=editedRecord(),id=key(current);
  const privateSaved=await window.DOEOutreach.save();
  if(JSON.stringify(updated)===JSON.stringify(loaded.get(active)[current]))staged.delete(id);
  else staged.set(id,updated);
  formChanged=false;renderList();
  if(!staged.has(id)){notify(privateSaved?"Private notes saved on this browser; no public listing changes to publish.":"There are no changes to publish.");return}
  await publishChanges([active]);
 }catch(err){notify(err.message,true)}
});
$("revert").addEventListener("click",()=>{
 if(current<0||!confirm("Revert this record to the originally loaded published version?"))return;
 staged.delete(key(current));formChanged=false;select(current);notify("This record's staged edits have been discarded.");
});
for(const id of ["search","filter","contactFilter","interestFilter"])
 $(id).addEventListener(id==="search"?"input":"change",renderList);
$("checkAll").addEventListener("click",()=>{shown.forEach(i=>checked.add(key(i)));renderList()});
$("uncheckAll").addEventListener("click",()=>{for(const id of [...checked])if(id.startsWith(active+":"))checked.delete(id);renderList()});
function bulk(contactStatus){
 const selected=[...checked].filter(id=>id.startsWith(active+":"));
 if(!selected.length){notify("Select listing checkboxes first.",true);return}
 if(formChanged||window.DOEOutreach.dirty()){notify("Save or discard unsaved public edits and private notes first.",true);return}
 if(!confirm("Mark "+selected.length+" selected listings as "+contactStatus.replaceAll("_"," ")+"? Only use this for actual outreach work. This will not verify any listing."))return;
 for(const id of selected){
  const i=Number(id.slice(active.length+1)),orig=loaded.get(active)?.[i];if(!orig)continue;
  const changed={...record(i),contact_status:contactStatus};
  if(JSON.stringify(changed)===JSON.stringify(orig))staged.delete(id);else staged.set(id,changed);
 }
 checked.clear();if(current>=0)select(current);else renderList();
 notify("Outreach updates ready. Click Update all staged changes to publish.");
}
$("bulkAttempt").addEventListener("click",()=>bulk("attempted"));
$("bulkFollow").addEventListener("click",()=>bulk("follow_up"));
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
 const output=original.slice();
 for(const [id,b] of changes)output[Number(id.slice(active.length+1))]=b;
 const filename=SOURCES[active].path.split("/").pop();
 download(filename,JSON.stringify(output,null,2)+"\n");
 notify("Downloaded "+filename+" with "+changes.length+" staged records. An authorized GitHub commit is still required.");
});
$("manifest").addEventListener("click",()=>{
 const rows=[["Dataset","Index","Name","Verification status","Contact status"]];
 for(const [id,b] of staged){const pos=id.lastIndexOf(":");rows.push([id.slice(0,pos),id.slice(pos+1),b.name,status(b),contact(b)])}
 const csv=rows.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(",")).join("\r\n")+"\r\n";
 download("directory-change-summary.csv",csv,"text/csv;charset=utf-8");
});
$("clear").addEventListener("click",()=>{
 if(!confirm("Discard every staged edit across all directories?"))return;
 staged.clear();checked.clear();formChanged=false;
 if(current>=0)select(current);else renderList();notify("All staged changes discarded.");
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
   if(!Array.isArray(data)||data.some(r=>!r||typeof r!=="object"||!r.name))throw Error("Unexpected records format");
   loaded.set(source,data);
  }catch(err){
   if(active===source){$("load").textContent="Unable to load "+info.name+": "+err.message;notify("The dataset is unavailable; no publication file will be created.",true);updateQueue()}
   return;
  }
 }
 if(active!==source)return;
 $("load").textContent=loaded.get(active).length.toLocaleString()+" "+info.name.toLowerCase()+" loaded.";
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
 return SOURCES[source].kind==="church"?[b.name,b.province,b.reserve].join("\u001f"):
 [b.source_id||"",b.name,b.city,b.province].join("\u001f");
}
function mergeDrafts(source,remote){
 const original=loaded.get(source);
 if(!original)throw Error("Source not loaded: "+source);
 const updates=[...staged.entries()].filter(([id])=>id.startsWith(source+":"));
 const records=remote.records;
 for(const [key,draft] of updates){
  const index=Number(key.slice(source.length+1)),base=original[index];
  if(!base)throw Error("Original record missing; refresh before updating.");
  let at=index;
  if(!records[at]||identity(source,records[at])!==identity(source,base)){
   const matches=records.map((r,i)=>identity(source,r)===identity(source,base)?i:-1).filter(i=>i>=0);
   if(matches.length!==1)throw Error("Listing was moved or duplicated on GitHub: "+base.name+". Reload before editing.");
   at=matches[0];
  }
  const currentRecord=records[at],merged={...currentRecord};
  for(const [field,value] of Object.entries(draft)){
   if(same(base[field],value))continue;
   if(!same(base[field],currentRecord[field])&&!same(value,currentRecord[field])){
    throw Error("Another editor changed '"+field+"' on "+base.name+". Nothing was overwritten. Reload before editing.");
   }
   merged[field]=value;
  }
  records[at]=merged;
 }
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
   const indent=remote.text.includes("\n")?2:0;
   const serialized=JSON.stringify(merged.records,null,indent)+(remote.text.endsWith("\n")?"\n":"");
   if(serialized===remote.text){
    for(const [key] of merged.updates)staged.delete(key);
    loaded.set(source,merged.records);continue;
   }
   const path=SOURCES[source].path;
   const result=await githubRequest("/contents"+path,{method:"PUT",body:JSON.stringify({
    message:"Directory admin: update "+merged.updates.length+" "+SOURCES[source].name+" record(s)",
    content:base64Encode(serialized),sha:remote.sha,branch:"main"
   })});
   if(!result.commit?.sha)throw Error("GitHub did not confirm a commit for "+path);
   for(const [key] of merged.updates)staged.delete(key);
   loaded.set(source,merged.records);saved+=merged.updates.length;
   $("publishLink").replaceChildren();
   const link=document.createElement("a");
   link.href=result.commit.html_url||"https://github.com/deltaowleyes/deltaowleyes.github.io/commit/"+result.commit.sha;
   link.target="_blank";link.rel="noopener noreferrer";link.textContent="View successful GitHub commit";
   $("publishLink").append(link);
  }
  if(current>=0&&onlySources?.includes(active)){formChanged=false;const now=record(current);$("pickHint").textContent="Published: "+short(now)}
  notify("Published "+saved+" record update(s) directly to GitHub. The public directories will refresh after deployment.");
  renderList();return true;
 }catch(err){
  notify((saved?("Published "+saved+" record(s), but remaining changes were not saved. "):"Nothing new was published. ")+err.message,true);
  return false;
 }finally{busy=false;writeControls();renderList()}
}
$("publish").addEventListener("click",()=>publishChanges());
window.addEventListener("beforeunload",event=>{
 if(staged.size||formChanged){event.preventDefault();event.returnValue="";}
});

window.addEventListener("doe-outreach-saved",renderList);
renderAuth();
loadSource(active);
