(()=>{
"use strict";
const list=document.getElementById("update-list"),count=document.getElementById("update-count"),more=document.getElementById("update-more");
if(!list||!count||!more)return;
const kind=document.body.dataset.updateKind;
const singular={businesses:"business",churches:"church",events:"event"}[kind];
if(!singular)return;
const label=(tag,text,parent,klass)=>{const e=document.createElement(tag);if(text!==null)e.textContent=text;if(klass)e.className=klass;parent.append(e);return e};
let groups=[],shown=0;
function render(){
 const next=Math.min(groups.length,shown+10);
 for(let i=shown;i<next;i++){
   const group=groups[i],s=label("section",null,list,"update-group"),d=new Date(group.at);
   const date=isNaN(d.getTime())?group.at:d.toLocaleString("en-CA",{dateStyle:"long",timeStyle:"short",timeZone:"America/Toronto"});
   label("h2",date,s);
   label("p",group.rows.length+" new "+singular+(group.rows.length===1?"":"s")+" added",s,"update-meta");
   const cards=label("div",null,s,"update-cards");
   for(const row of group.rows){
     const card=label("article",null,cards,"update-card");
     label("h3",row.name,card);
     if(row.place)label("p",row.place,card);
     const meta=[row.date,row.category,row.status].filter(Boolean).join(" · ");
     if(meta)label("p",meta,card,"update-meta");
     if(/^https:\/\//i.test(row.source||"")){
       const link=label("a","Published source",card);link.href=row.source;link.rel="noopener noreferrer";link.target="_blank";
     }
   }
 }
 shown=next;more.hidden=shown>=groups.length;
}
count.textContent="Loading published updates…";
fetch("/data/directory-updates.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()})
.then(data=>{
 if(data.version!==1||!Array.isArray(data.runs))throw Error("Invalid update history");
 groups=data.runs.map(r=>({at:r.at,rows:r.additions?.[kind]||[]})).filter(g=>Array.isArray(g.rows)&&g.rows.length);
 const n=groups.reduce((a,g)=>a+g.rows.length,0);
 count.textContent=n.toLocaleString()+" new "+singular+(n===1?"":"s")+" across "+groups.length+" publication runs.";
 if(!groups.length){label("p","No new additions recorded since tracking began.",list);more.hidden=true;return;}
 render();
}).catch(e=>{count.textContent="Update history is unavailable.";label("p","Please try again later. "+e.message,list);more.hidden=true;});
more.addEventListener("click",render);
})();