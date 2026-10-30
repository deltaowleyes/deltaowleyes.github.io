import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import vm from "node:vm";

const source=readFileSync("admin/outreach.js","utf8");
const admin=readFileSync("admin/admin.js","utf8");
const html=readFileSync("admin/index.html","utf8");
const values=new Map();
const storage={
 getItem:k=>values.has(k)?values.get(k):null,
 setItem:(k,v)=>values.set(k,String(v)),
 removeItem:k=>values.delete(k)
};
const ids=["websiteInterest","lastContactDate","followupDate","callNotes","outreachStatus","privateNotice","saveOutreach","copyCallScript","callScript","outreachHeading"];
const elements=new Map(ids.map(id=>[id,{value:id==="websiteInterest"?"not_asked":"",textContent:"",disabled:false,style:{},addEventListener(){}}]));
const document={readyState:"complete",getElementById:id=>elements.get(id)};
const window={isSecureContext:true,dispatchEvent(){}};
const sandbox={window,document,localStorage:storage,crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,atob,btoa,Date,JSON,Event:class {}};
new vm.Script(source,{filename:"outreach.js"}).runInNewContext(sandbox);
new vm.Script(admin,{filename:"admin.js"});
const app=window.DOEOutreach;
assert.ok(app);
assert.ok(html.includes('src="./outreach.js'));
for(const id of ids)assert.ok(html.includes('id="'+id+'"'),"Missing admin control: "+id);
assert.ok(admin.includes("window.DOEOutreach.save()"),"Update & publish should save notes first");
assert.ok(admin.includes("await publishChanges([active])"),"Direct GitHub publishing must remain");
const business={name:"Test Co",city:"Test City",province:"Ontario",phone:"555-1234"};
app.show("businesses",business);
assert.match(elements.get("callScript").textContent,/Business Directory/);
assert.equal(elements.get("saveOutreach").disabled,true);
const phrase="a local encryption passphrase 2026";
await app.open(phrase);
assert.equal(elements.get("saveOutreach").disabled,false);
elements.get("websiteInterest").value="interested";
elements.get("callNotes").value="Private follow-up details not for publication";
assert.equal(app.dirty(),true);
assert.equal(await app.save(),true);
const saved=JSON.stringify([...values.values()]);
assert.ok(saved.includes("cipher")===false);
assert.ok(!saved.includes("Private follow-up details"));
assert.ok(!saved.includes(phrase));
assert.equal(app.dirty(),false);
app.lock();
assert.equal(elements.get("saveOutreach").disabled,true);
assert.equal(elements.get("callNotes").value,"");
await assert.rejects(app.open("the wrong passphrase 2026"),/could not be decrypted/i);
await app.open(phrase);
assert.equal(elements.get("websiteInterest").value,"interested");
assert.equal(elements.get("callNotes").value,"Private follow-up details not for publication");
assert.equal(app.interestFor("businesses",business),"interested");
app.forget();
assert.equal(storage.getItem("doe-outreach-private-v1"),null);
assert.equal(app.interestFor("businesses",business),"not_asked");
console.log("PASS shared outreach: script, local encryption, private lead, save, lock, wrong passphrase, unlock and forget.");
