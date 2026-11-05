#!/usr/bin/env node
/* B4-038: deterministic static business search index and keyed profile shards.
   Source JSON and the deletion ledger are never modified. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'indigenous-businesses');
const out=path.join(base,'optimized');
const files=['businesses-with-phone.json','businesses-without-phone.json'];
const source=files.map(f=>fs.readFileSync(path.join(base,f)));
const all=source.flatMap(bytes=>JSON.parse(bytes.toString('utf8')));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'category-mapping.js'),'utf8'),sandbox,{filename:'category-mapping.js'});
const enrich=sandbox.window.DOE_ENRICH;
const ledger=JSON.parse(fs.readFileSync(path.join(root,'.github/deletion-ledger.json'),'utf8'));
if(!Array.isArray(ledger)||!Array.isArray(all))throw Error('Invalid original data or deletion ledger');
const norm=v=>String(v||'').normalize('NFKD').toLowerCase().replace(/&/g,'and').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const deletedIds=new Set(ledger.filter(x=>x&&x.source==='businesses'&&x.source_id).map(x=>String(x.source_id)));
const deletedKeys=new Set(ledger.filter(x=>x&&x.source==='businesses'&&x.key).map(x=>String(x.key)));
const fields=['name','city','province','community','category','original_category','directory_category','description','phone','website','source_url','source_id','verification_status','owner_confirmed','address'];
const rows=[],shards=new Map(),keys=new Set(),identifiers=new Set();
for(const b of all){
 if(!b||typeof b.name!=='string'||!b.name.trim())throw Error('Malformed business record');
 const stableId=b.source_id?'id:'+String(b.source_id):b.name+'|'+(b.city||'');
 const ledgerKey=[norm(b.name),norm(b.city),norm(b.province)].join('|');
 if((b.source_id&&deletedIds.has(String(b.source_id)))||deletedKeys.has(ledgerKey))
  throw Error('Suppressed record remains in public source: '+stableId);
 const identifier=b.source_id?'id:'+String(b.source_id):'location:'+String(b.name).trim().toLowerCase()+'|'+String(b.city||'').trim().toLowerCase()+'|'+String(b.province||'').trim().toLowerCase();
 if(identifiers.has(identifier))throw Error('Duplicate record identity: '+identifier);
 identifiers.add(identifier);
 if(keys.has(stableId))throw Error('Ambiguous legacy profile URL: '+stableId);
 keys.add(stableId);
 const e=enrich(b);
 rows.push(fields.map(f=>e[f]??''));
 const shard=crypto.createHash('sha256').update(stableId,'utf8').digest('hex').slice(0,2);
 if(!shards.has(shard))shards.set(shard,[]);
 shards.get(shard).push({key:stableId,record:b});
}
const manifest={schema:1,record_count:all.length,profile_shards:shards.size,source_sha256:source.map(b=>crypto.createHash('sha256').update(b).digest('hex')),fields};
const expected=new Map();
expected.set('search-index.json',JSON.stringify({schema:1,fields,records:rows})+'\n');

/* Featured first screen mirrors the directory's established Walpole-first ordering. */
function priority(b){
 const t=[b.city,b.community,b.address,b.description].filter(Boolean).join(' ').toLowerCase();
 const groups=[/walpole island|bkejwanong/,/aamjiwnaang|chippewas of sarnia/,/moraviantown|delaware nation|eel.u.naap.eewi|thamesville/,/caldwell first nation/,/kettle.*stony point|kettle point|stony point|ipperwash/,/chippewas of the thames|deshkan ziibiing|munsee.delaware|oneida nation of the thames/];
 for(let i=0;i<groups.length;i++)if(groups[i].test(t))return i;
 const city=String(b.city||'').toLowerCase();
 if(/wallaceburg|sombra|port lambton|courtright|sarnia|thamesville|chatham|blenheim|forest|leamington|muncey|southwold|london/.test(city))return 6;
 return /^(on|ontario)$/i.test(String(b.province||''))?7:8;
}
const order=all.map((b,i)=>i).sort((i,j)=>priority(all[i])-priority(all[j])||String(all[i].name||'').localeCompare(String(all[j].name||'')));
const featured=order.slice(0,48).map(i=>rows[i]);
const cityMap={};const provinces=new Set(),allCities=new Set();
for(const b of all){
 const p=String(b.province||''),city=String(b.city||'').trim();
 if(p){provinces.add(p);if(!cityMap[p])cityMap[p]=new Set();if(city)cityMap[p].add(city)}
 if(city)allCities.add(city);
}
const facets={schema:1,provinces:[...provinces].sort(),all_cities:[...allCities].sort((a,b)=>a.localeCompare(b)),cities_by_province:Object.fromEntries(Object.entries(cityMap).map(([p,items])=>[p,[...items].sort((a,b)=>a.localeCompare(b))]))};
expected.set('featured.json',JSON.stringify({schema:1,fields,records:featured})+'\n');
expected.set('facets.json',JSON.stringify(facets)+'\n');

expected.set('manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const [id,list] of shards)expected.set('profiles/'+id+'.json',JSON.stringify(list)+'\n');
manifest.asset_sha256=crypto.createHash('sha256').update([...expected.entries()].filter(([p])=>p!=='manifest.json').map(([p,c])=>p+'\0'+c).join('\0')).digest('hex');
expected.set('manifest.json',JSON.stringify(manifest,null,2)+'\n');
const check=process.argv.includes('--check');
const existing=new Map();
if(fs.existsSync(out)){
 for(const name of fs.readdirSync(out,{recursive:true})){
  const full=path.join(out,name);
  if(fs.statSync(full).isFile())existing.set(name.replaceAll(path.sep,'/'),fs.readFileSync(full,'utf8'));
 }
}
const missing=[...expected].filter(([p,c])=>existing.get(p)!==c).map(([p])=>p);
const stale=[...existing.keys()].filter(k=>!expected.has(k));
if(check){
 if(missing.length||stale.length){console.error('Optimized business files stale:',JSON.stringify({missing:missing.slice(0,8),stale:stale.slice(0,8)}));process.exit(1)}
}else{
 for(const [name,body] of expected){
  const dest=path.join(out,name);fs.mkdirSync(path.dirname(dest),{recursive:true});
  if(existing.get(name)!==body)fs.writeFileSync(dest,body);
 }
 for(const name of stale)fs.unlinkSync(path.join(out,name));
}
const indexBytes=Buffer.byteLength(expected.get('search-index.json'));
const sourceBytes=source.reduce((n,b)=>n+b.length,0);
console.log(JSON.stringify({source_records:all.length,source_bytes:sourceBytes,index_bytes:indexBytes,profile_shards:shards.size,changed:missing.length,removed:stale.length,check},null,2));
