import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import vm from "node:vm";
const source=readFileSync("admin/auth-vault.js","utf8");
const admin=readFileSync("admin/admin.js","utf8");
const html=readFileSync("admin/index.html","utf8");
const stored=new Map();
const storage={
 getItem(key){return stored.has(key)?stored.get(key):null},
 setItem(key,value){stored.set(key,String(value))},
 removeItem(key){stored.delete(key)}
};
const sandbox={
 window:{},localStorage:storage,crypto:webcrypto,isSecureContext:true,
 TextEncoder,TextDecoder,Uint8Array,atob,btoa,Error,Object,String,JSON
};
vm.runInNewContext(source,sandbox,{filename:"auth-vault.js"});
const vault=sandbox.window.DOEAuthVault;
assert.ok(vault,"Encrypted device vault should be present.");
assert.equal(vault.load(),null);
const token="github_pat_TEST_ONLY_ExampleTokenThatCannotAuthenticate";
const passphrase="a sufficiently long unique phrase 2026";
await assert.rejects(vault.seal(token,"too short"),/at least 16/);
const sealed=await vault.seal(token,passphrase);
assert.equal(sealed.alg,"AES-256-GCM");
assert.equal(sealed.kdf,"PBKDF2-SHA256");
assert.equal(sealed.iter,400000);
assert.ok(!JSON.stringify(sealed).includes(token));
vault.save(sealed);
const saved=JSON.stringify([...stored.values()]);
assert.ok(!saved.includes(token),"No plaintext GitHub token may be persisted.");
assert.ok(!saved.includes(passphrase),"No unlock passphrase may be persisted.");
assert.equal(await vault.open(vault.load(),passphrase),token);
await assert.rejects(vault.open(vault.load(),"wrong passphrase"),/Could not unlock/);
const second=await vault.seal(token,passphrase);
assert.notEqual(second.ciphertext,sealed.ciphertext,"Random salt and IV should randomize ciphertext.");
const altered={...vault.load(),ciphertext:"AA"+vault.load().ciphertext.slice(2)};
await assert.rejects(vault.open(altered,passphrase),/Could not unlock/);
vault.forget();
assert.equal(vault.load(),null,"Forget should remove encrypted credential.");
assert.ok(html.includes('id="remember"')&&html.includes('id="unlock"')&&html.includes('id="forget"'));
assert.ok(html.includes('src="./auth-vault.js'));
assert.ok(html.includes('Content-Security-Policy'));
assert.ok(!html.includes("privacy-consent.js"),"Credentialed admin must not include analytics scripts.");
assert.ok(admin.includes('await window.DOEAuthVault.open(record,passphrase)'));
assert.ok(admin.includes('await publishChanges([active])'),"Direct Update & publish must remain.");
assert.ok(admin.includes('method:"PUT"'),"GitHub writes must remain.");
new vm.Script(admin,{filename:"admin.js"});
console.log("PASS encrypted credential vault: encrypt, save, unlock, wrong passphrase, tampering, forget, admin integration.");
