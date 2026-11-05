#!/usr/bin/env node
/* B4-038: compare optimized directory assets against published source records.
   Read only: never mutates original data, deletion history or generated output. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'indigenous-businesses'),optimized=path.join(base,'optimized');
const source=['businesses-with-phone.json','businesses-without-phone.json'].flatMap(name=>JSON.parse(fs.readFileSync(path.join(base,name),'utf8')));
const index=JSON.parse(fs.readFileSync(path.join(optimized,'search-index.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(optimized,'manifest.json'),'utf8'));
assert.equal(index.schema,1);
assert.equal(index.records.length,source.length);
assert.equal(manifest.record_count,source.length);
assert.equal(index.fields.length,new Set(index.fields).size);
const indexKeys=new Set();
const fieldIndex=Object.fromEntries(index.fields.map((f,i)=>[f,i]));
for(const row of index.records){
 assert.equal(row.length,index.fields.length);
 const k=row[fieldIndex.source_id]?'id:'+row[fieldIndex.source_id]:row[fieldIndex.name]+'|'+row[fieldIndex.city];
 assert(!indexKeys.has(k),'duplicate search key '+k);
 indexKeys.add(k);
}
let seen=0;const shardFolder=path.join(optimized,'profiles');
for(const f of fs.readdirSync(shardFolder)){
 assert(/^[0-9a-f]{2}\.json$/.test(f),'unexpected shard '+f);
 const entries=JSON.parse(fs.readFileSync(path.join(shardFolder,f),'utf8'));
 for(const entry of entries){
  const expected=crypto.createHash('sha256').update(entry.key,'utf8').digest('hex').slice(0,2)+'.json';
  assert.equal(expected,f,'wrong hash shard for '+entry.key);
  assert(indexKeys.has(entry.key),'missing indexed record: '+entry.key);
  const b=entry.record;
  assert.equal(entry.key,b.source_id?'id:'+b.source_id:b.name+'|'+b.city);
  seen++;
 }
}
assert.equal(seen,source.length,'shard record count differs from source');
for(const p of ['index.html','profile.html']){
 const html=fs.readFileSync(path.join(base,p),'utf8');
 assert(!/fetch\(['"]\.\/businesses-with-(?:out-)?phone\.json/.test(html),'full dataset still loaded in '+p);
 const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 for(const js of inline) if(!/^\s*\{?\s*"@context"\s*:/.test(js))new vm.Script(js,{filename:p});
}
console.log(JSON.stringify({test:'B4-038 optimized directory',records:seen,indexed:index.records.length,shards:manifest.profile_shards,status:'PASS'}));
