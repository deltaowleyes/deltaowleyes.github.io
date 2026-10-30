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
 business:[["name","Business name","locked"],["city","City","locked"],["province","Province","locked"],["description","Business description","textarea"],["address","Public street address","text"],["postal_code","Postal code","text"],["community","Community affiliation — evidence required","text"],["phone","Public business phone","text"],["website","Website (https://)","url"],["category","Original industry category","text"]],
 church:[["name","Church name","locked"],["province","Province","locked"],["reserve","Community / reserve","locked"],["denomination","Denomination","text"],["address","Public address","text"],["phone","Public phone","text"],["source","Published source (https://)","url"],["reserveLocated","Located on reserve — evidence required","tri"],["indigenousLed","Indigenous-led — evidence required","tri"]]
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
 $("manifest").disabled=n===0;$("clear").disabled=n===0;
}
function renderList(){
 const data=loaded.get(active)||[],query=$("search").value.trim().toLowerCase(),vf=$("filter").value,cf=$("contactFilter").value;
 const match=[];
 data.forEach((b,i)=>{const item=record(i);if(query&&!short(item).toLowerCase().includes(query))return;if(vf&&status(item)!==vf)return;if(cf&&contact(item)!==cf)return;match.push(i)});
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
 }else {control=document.createElement("input");control.type=type==="date"?"date":type==="url"?"url":"text"}
 control.id="field_"+name;control.name=name;control.value=String(fieldVal(b,name));
 if(type==="locked")control.disabled=true;
 const changed=()=>{formChanged=true;notify("Unsaved fields. Stage the record before selecting another listing.")};
 control.addEventListener("input",changed);control.addEventListener("change",changed);
 cell.append(control);place.append(cell);
}
function select(i){
 if(formChanged&&!confirm("Discard un-staged field changes? Other staged records will be kept."))return;
 current=i;formChanged=false;const b=record(i);$("edit").hidden=false;$("pickHint").textContent="Editing "+short(b);
 $("fields").replaceChildren();$("verification").replaceChildren();
 for(const def of FIELDS[SOURCES[active].kind])makeField(def,b,$("fields"));
 for(const def of VERIFY)makeField(def,b,$("verification"));
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
  b[name]=type==="tri"?(value===""?null:value==="true"):value;
 }
 if(b.verification_status==="verified"){
  if(!b.verified_date||!b.verification_method)throw Error("Verified requires a representative confirmation date and method.");
  if(b.verified_date>new Date().toISOString().slice(0,10))throw Error("Confirmation date cannot be in the future.");
 }
 const url=kind==="church"?"source":"website";
 if(b[url]&&!/^https:\/\//i.test(b[url]))throw Error("Public URL must begin with https://");
 if(kind==="church")b.representative_confirmed=b.verification_status==="verified";
 else b.owner_confirmed=b.verification_status==="verified";
 return b;
}
$("edit").addEventListener("submit",event=>{
 event.preventDefault();if(current<0)return;
 try{
  const updated=editedRecord(),id=key(current);
  if(JSON.stringify(updated)===JSON.stringify(loaded.get(active)[current]))staged.delete(id);
  else staged.set(id,updated);
  formChanged=false;renderList();notify("Reviewed record staged. Download the dataset before closing this tab.");
 }catch(err){notify(err.message,true)}
});
$("revert").addEventListener("click",()=>{
 if(current<0||!confirm("Revert this record to the originally loaded published version?"))return;
 staged.delete(key(current));formChanged=false;select(current);notify("This record's staged edits have been discarded.");
});
for(const id of ["search","filter","contactFilter"])
 $(id).addEventListener(id==="search"?"input":"change",renderList);
$("checkAll").addEventListener("click",()=>{shown.forEach(i=>checked.add(key(i)));renderList()});
$("uncheckAll").addEventListener("click",()=>{for(const id of [...checked])if(id.startsWith(active+":"))checked.delete(id);renderList()});
function bulk(contactStatus){
 const selected=[...checked].filter(id=>id.startsWith(active+":"));
 if(!selected.length){notify("Select listing checkboxes first.",true);return}
 if(formChanged){notify("Stage or revert the unsaved form fields first.",true);return}
 if(!confirm("Mark "+selected.length+" selected listings as "+contactStatus.replaceAll("_"," ")+"? Only use this for actual outreach work. This will not verify any listing."))return;
 for(const id of selected){
  const i=Number(id.slice(active.length+1)),orig=loaded.get(active)?.[i];if(!orig)continue;
  const changed={...record(i),contact_status:contactStatus};
  if(JSON.stringify(changed)===JSON.stringify(orig))staged.delete(id);else staged.set(id,changed);
 }
 checked.clear();if(current>=0)select(current);else renderList();
 notify("Outreach status staged for "+selected.length+" records.");
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
 if(formChanged&&!confirm("Discard unsaved form edits before switching datasets? Other staged changes will remain.")){$("dataset").value=active;return}
 active=source;current=-1;formChanged=false;checked.clear();$("edit").hidden=true;$("pickHint").textContent="Choose a listing on the left.";notify("");
 const info=SOURCES[source];
 $("publishLink").replaceChildren();
 const link=document.createElement("a");link.href="https://github.com/deltaowleyes/deltaowleyes.github.io/upload/main/"+info.dir;
 link.textContent="Open authorized GitHub upload folder: "+info.dir;link.rel="noopener noreferrer";link.target="_blank";
 $("publishLink").append(link);
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
loadSource(active);
