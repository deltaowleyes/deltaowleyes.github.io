// Zero-dependency route/source smoke test. Run: node brandee/studio/v1/qa.mjs
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const read=(p)=>fs.readFileSync(path.join(ROOT,p),"utf8");
const themes=["cathedral-sunrise","marian-rose-garden","woodland-pilgrimage","rosary-atelier","catholic-journal","coffee-grace"];
const routes=["home","faith","running","rosaries","coffee","about"];
const appCode=read("site.js");
const css=read("site.css");
const gallery=read("index.html");
let tests=0;
function assert(condition,label){tests++; if(!condition)throw new Error("FAIL: "+label);}
new Function(appCode);
assert((gallery.match(/<iframe/g)||[]).length===6,"six gallery previews");
for(const theme of themes){
  const html=read(path.join(theme,"index.html"));
  assert(html.includes('data-theme="'+theme+'"'),"theme entry "+theme);
  assert(html.includes('noindex,nofollow'),"noindex "+theme);
  assert(css.includes(".theme-"+theme),"distinct styles for "+theme);
  assert(gallery.includes("./"+theme+"/"),"linked gallery "+theme);
  for(const route of routes){
    let markup="";
    const document={
      body:{dataset:{theme}},title:"",
      getElementById:()=>({set innerHTML(value){markup=value}}),
      querySelectorAll:()=>[]
    };
    const window={addEventListener(){},scrollTo(){}};
    const location={hash:"#"+route};
    new Function("document","window","location",appCode)(document,window,location);
    assert(markup.includes('class="workspace"')&&markup.includes('class="site-footer"'),"view render "+theme+"/"+route);
    assert(routes.every(r=>markup.includes('href="#'+r+'"')),"all six nav links "+theme+"/"+route);
    assert(!markup.includes("undefined")&&!markup.includes("NaN"),"no broken template data "+theme+"/"+route);
  }
}
for(const art of ["cathedral","rose","woodland","rosary","journal","coffee"]){
  const src=read(path.join("assets",art+".svg"));
  assert(src.includes("<svg")&&src.includes("</svg>"),"SVG asset "+art);
}
assert((css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length,"CSS balanced blocks");
assert(!appCode.includes("fetch(")&&!appCode.includes("<form"),"no network requests or forms in prototype");
console.log("PASS: "+tests+" source-level checks across six themes and 36 navigable view renderings. Chromium visual QA still required.");
