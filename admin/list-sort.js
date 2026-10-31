"use strict";
/* View-only ordering for both directory worksheets. Does not modify records. */
window.DOEDirectorySort=(()=>{
 const dated={businesses:new Map(),churches:new Map()};
 const points=[
 [/walpole island|bkejwanong/,42.61,-82.49],[/wallaceburg/,42.59,-82.39],
 [/sombra|port lambton/,42.66,-82.49],[/chatham|thamesville/,42.40,-82.19],
 [/sarnia|aamjiwnaang/,42.97,-82.40],[/kettle point|stony point|ipperwash/,43.17,-81.93],
 [/moraviantown|delaware nation/,42.59,-81.79],[/oneida nation of the thames|southwold|muncey/,42.83,-81.40],
 [/london|chippewas of the thames/,42.98,-81.24],[/windsor/,42.31,-83.04],
 [/leamington/,42.05,-82.60],[/brantford|six nations/,43.14,-80.26],
 [/hamilton/,43.25,-79.87],[/kitchener|waterloo/,43.45,-80.48],
 [/toronto|mississauga|scarborough/,43.65,-79.38],[/ottawa/,45.42,-75.69],
 [/kingston/,44.23,-76.48],[/north bay/,46.31,-79.46],
 [/sudbury/,46.49,-80.99],[/sault ste marie/,46.52,-84.35],
 [/temagami/,46.96,-80.01],[/timmins/,48.48,-81.33],
 [/thunder bay/,48.38,-89.25],[/sioux lookout/,50.10,-91.92],
 [/kenora/,49.77,-94.49],[/moosonee|moose factory/,51.28,-80.63],
 [/attawapiskat/,52.93,-82.43],[/kashechewan/,52.29,-81.64],
 [/north caribou lake|weagamow/,52.95,-91.34],[/kingfisher lake/,53.08,-89.83],
 [/sandy lake|poplar hill/,53.05,-93.34],[/bearskin lake/,53.92,-90.95],
 [/nibinamik|summer beaver/,52.69,-88.55],[/eabametoong|fort hope/,51.56,-87.89],
 [/sachigo lake/,53.87,-92.17],[/wapekeka/,53.81,-89.25],
 [/wunnumin lake/,52.93,-89.29],[/webequie/,52.96,-87.36],
 [/fort severn/,56.00,-87.63],[/winnipeg/,49.90,-97.14],
 [/regina/,50.45,-104.62],[/saskatoon/,52.13,-106.67],
 [/calgary/,51.05,-114.07],[/edmonton/,53.55,-113.49],
 [/vancouver/,49.28,-123.12],[/victoria/,48.43,-123.37],
 [/montreal|montréal/,45.50,-73.57],[/quebec city|québec city/,46.81,-71.21],
 [/halifax/,44.65,-63.57],[/yellowknife/,62.45,-114.37],
 [/whitehorse/,60.72,-135.06],[/iqaluit/,63.75,-68.52]
 ];
 function normalized(value){return String(value??"").normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"")}
 function logKey(source,record){
  if(source==="businesses"&&record.source_id)return "id:"+normalized(record.source_id);
  return source==="churches"?
   [record.name,record.province,record.reserve].map(normalized).join("|"):
   [record.name,record.city,record.province].map(normalized).join("|");
 }
 function date(source,record){
  const logged=dated[source]?.get(logKey(source,record));
  if(logged)return logged;
  // Discovery, source-update, outreach and verification dates are NOT addition dates.
  const explicit=[record.added_at,record.date_added,record.created_at,record.published_at]
   .find(v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(v));
  return explicit?explicit.slice(0,10):"";
 }
 function proximity(record){
  const lat=Number(record.latitude??record.lat),lon=Number(record.longitude??record.lng??record.lon);
  let coords=null;
  if((record.latitude!=null||record.lat!=null)&&(record.longitude!=null||record.lng!=null||record.lon!=null)&&
      Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=40&&lat<=84&&lon>=-142&&lon<=-50)coords=[lat,lon];
  if(!coords){
   for(const term of [record.city,record.reserve,record.community].filter(Boolean)){
    const located=points.find(([pattern])=>pattern.test(String(term).toLowerCase()));
    if(located){coords=located.slice(1);break}
   }
  }
  if(!coords)return Infinity;
  const rad=Math.PI/180,dLat=(coords[0]-42.61)*rad,dLon=(coords[1]+82.49)*rad;
  const a=Math.sin(dLat/2)**2+Math.cos(42.61*rad)*Math.cos(coords[0]*rad)*Math.sin(dLon/2)**2;
  return 2*6371*Math.asin(Math.min(1,Math.sqrt(a)));
 }
 function compare(source,a,b,mode="newest_near"){
  if(mode==="original")return 0;
  const byName=String(a.name??"").localeCompare(String(b.name??""),"en",{sensitivity:"base"});
  if(mode==="name")return byName;
  const aDate=date(source,a),bDate=date(source,b);
  const byDate=aDate===bDate?0:aDate>bDate?-1:1;
  const da=proximity(a),db=proximity(b),byNear=da===db?0:da<db?-1:1;
  return mode==="near_newest"?(byNear||byDate||byName):(byDate||byNear||byName);
 }
 async function load(){
  const response=await fetch("/data/directory-updates.json",{cache:"no-store"});
  if(!response.ok)throw Error("Update history: HTTP "+response.status);
  const result=await response.json();
  if(!Array.isArray(result.runs))throw Error("Invalid update history");
  for(const run of [...result.runs].reverse()){
   const day=String(run.at??"").slice(0,10);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(day))continue;
   for(const source of ["businesses","churches"])
    for(const entry of run.additions?.[source]??[])
     if(typeof entry.key==="string")dated[source].set(entry.key,day);
  }
  return true;
 }
 return {date,proximity,compare,load};
})();
