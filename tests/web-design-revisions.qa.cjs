/* Read-only release guard: newest gallery current, prior releases still linked. */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const registry=JSON.parse(read("data/web-design-projects.json"));
assert.ok(registry.projects&&registry.projects.length>=2,"Missing identified web-design projects");
for(const id of ["momma-made","shut-your-trap"])assert.ok(registry.projects.some(p=>p.id===id),"Missing project "+id);
for(const p of registry.projects){
 assert.ok(p.latest_revision&&p.latest_url&&p.revision_index,p.id+": no current revision");
 assert.ok(p.revisions.some(r=>r.id===p.latest_revision&&r.status==="latest"),p.id+": latest registry conflict");
 assert.equal(p.revisions.filter(r=>r.status==="latest").length,1,p.id+": only one latest revision allowed");
 assert.ok(exists(p.revision_index.slice(1)+"index.html"),p.id+": revision index missing");
 assert.ok(exists(p.root.slice(1)+"index.html"),p.id+": stable entrypoint missing");
 for(const r of p.revisions){
   assert.ok(exists(r.url.slice(1)+"index.html"),p.id+": unavailable archive "+r.url);
   assert.ok(exists(r.source),p.id+": missing source "+r.source);
 }
 const listing=read(p.revision_index.slice(1)+"index.html");
 for(const r of p.revisions)if(r.status==="archived")assert.ok(listing.includes(r.id),p.id+": archived "+r.id+" not linked");
 console.log("PASS "+p.name+": current "+p.latest_revision+", "+p.revisions.length+" revision(s)");
}
const current=read("mommamade/index.html");
assert.ok(current.includes("./v2/"),"Momma Made root no longer points to latest");
assert.ok(current.includes("location.search+location.hash"),"Momma Made query/hash not retained");
const v1=read("mommamade/revisions/v1/index.html");
assert.ok(v1.includes("../../designs.js"),"V1 archive JS path invalid");
assert.ok(v1.includes("../../designs.css"),"V1 archive CSS path invalid");
assert.ok(v1.includes("Revision 2"),"V1 archive missing latest link");
const v2=read("mommamade/v2/designs.js");
assert.ok(v2.includes("revisions/v1/"),"V2 missing archived revision link");
assert.ok(v2.includes("Revision history"),"V2 missing revision navigation");
assert.ok(exists("mommamade/v2/reference-fidelity.css"),"Reference-fidelity corrections missing");
for(const type of ["hero","story"]){
 for(let i=1;i<=10;i++){
   const name="mommamade/v2/images/"+type+"-"+String(i).padStart(2,"0")+".webp";
   assert.ok(exists(name),"Missing AI photo "+name);
 }
}
for(let i=1;i<=4;i++)assert.ok(exists("mommamade/v2/images/product-"+String(i).padStart(2,"0")+".webp"),"Missing product image "+i);
const shut=read("shutyourtrap/site.js");
assert.ok(shut.includes("revisions/"),"Shut Your Trap missing revision link");
assert.ok(shut.includes("LATEST COLLECTION"),"Shut Your Trap latest-only not indicated");
console.log("PASS gallery separation, archive assets, latest routes, 24 AI photos and revision links");
