"use strict";
/* Opt-in encrypted device vault. No plaintext tokens/passphrases are persisted. */
(() => {
 const KEY="doe-directory-admin-encrypted-token-v1",VERSION=1,ITERATIONS=400000;
 const encoder=new TextEncoder(),decoder=new TextDecoder();
 function bytesTo64(bytes){
  let s="";for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(s);
 }
 function b64ToBytes(s){const raw=atob(s);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
 function requireCrypto(){
  if(!globalThis.isSecureContext||!globalThis.crypto?.subtle||!globalThis.crypto?.getRandomValues){
   throw Error("Encrypted connection storage requires HTTPS and a browser with Web Crypto.");
  }
 }
 async function keyFor(passphrase,salt,usages){
  const material=await crypto.subtle.importKey("raw",encoder.encode(passphrase),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey(
   {name:"PBKDF2",salt,iterations:ITERATIONS,hash:"SHA-256"},
   material,{name:"AES-GCM",length:256},false,usages
  );
 }
 function load(){
  try{
   const raw=localStorage.getItem(KEY);
   if(!raw)return null;
   const record=JSON.parse(raw);
   if(record.v!==VERSION||record.kdf!=="PBKDF2-SHA256"||record.alg!=="AES-256-GCM"||record.iter!==ITERATIONS ||
    !["salt","iv","ciphertext"].every(k=>typeof record[k]==="string"))throw Error("Saved connection format is unsupported.");
   return record;
  }catch(err){if(err instanceof SyntaxError)throw Error("Saved connection data is corrupted. Forget it and reconnect.");throw err}
 }
 async function seal(token,passphrase){
  requireCrypto();
  if(typeof token!=="string"||!token||typeof passphrase!=="string"||passphrase.length<16){
   throw Error("Choose a unique connection passphrase of at least 16 characters.");
  }
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await keyFor(passphrase,salt,["encrypt"]);
  const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,encoder.encode(token));
  return {v:VERSION,alg:"AES-256-GCM",kdf:"PBKDF2-SHA256",iter:ITERATIONS,
   salt:bytesTo64(salt),iv:bytesTo64(iv),ciphertext:bytesTo64(new Uint8Array(ciphertext))};
 }
 async function open(record,passphrase){
  requireCrypto();
  if(!record||record.v!==VERSION||record.iter!==ITERATIONS)throw Error("Saved connection is incompatible.");
  if(!passphrase)throw Error("Enter the connection passphrase to unlock.");
  try{
   const salt=b64ToBytes(record.salt),iv=b64ToBytes(record.iv),ciphertext=b64ToBytes(record.ciphertext);
   if(salt.length!==16||iv.length!==12||ciphertext.length<17)throw Error("Bad ciphertext");
   const key=await keyFor(passphrase,salt,["decrypt"]);
   const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv},key,ciphertext);
   return decoder.decode(plain);
  }catch{throw Error("Could not unlock. Check the passphrase, or forget this connection and reconnect.");}
 }
 function save(record){localStorage.setItem(KEY,JSON.stringify(record));if(!localStorage.getItem(KEY))throw Error("Storage blocked. Connection was not saved.");}
 function forget(){localStorage.removeItem(KEY)}
 Object.defineProperty(window,"DOEAuthVault",{value:Object.freeze({load,seal,open,save,forget}),writable:false,configurable:false});
})();