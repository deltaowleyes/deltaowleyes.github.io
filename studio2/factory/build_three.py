#!/usr/bin/env python3
"""One-shot, fail-closed build of 3 distinct Delta Owl Eyes candidate front pages.
Uses existing HTML templates and source assets, with no publish, merge, network or payment APIs.
"""
from __future__ import annotations
import hashlib,json,pathlib,subprocess,sys,tempfile,shutil,time
from PIL import Image,ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=ROOT/"studio2/factory-previews"
TEMPLATES=ROOT/"studio2/factory/templates"
SITES={
 "accountability-ledger":{
   "file":"accountability-ledger.html",
   "assets":{"logo":("assets/owl-logo.png",400,88),"hero":("shutyourtrap/assets/photos/golden_sunrise_in_a_misty_pine_forest.webp",1920,83)},
   "css_replacements":{"/assets/hero.png":"assets/hero.webp"},
   "html_replacements":{"/assets/owl-logo.png":"assets/logo.webp"},
   "structure":"dark documentary split hero, facts rail, evidence links and public-interest methodology"
 },
 "media-hub":{
   "file":"media-hub.html",
   "assets":{"logo":("assets/owl-logo.png",400,88),"river":("shutyourtrap/assets/photos/rustic_cabin_at_sunrise_lake.webp",1440,81)},
   "css_replacements":{"/assets/podcast-archive.png":"/studio2/river-voice/assets/owl-lens-studio.svg"},
   "html_replacements":{"/assets/owl-logo.png":"assets/logo.webp","/assets/wetlands.png":"assets/river.webp"},
   "structure":"screen-first podcast masthead, episode browsing rails and documentary/media discovery; original conceptual vector studio masthead"
 }
}
def digest(b):return hashlib.sha256(b).hexdigest()
def main():
 started=time.monotonic()
 # Preserve original, audited River Voice factory unmodified.
 subprocess.run([sys.executable,str(ROOT/"studio2/factory/build.py")],cwd=ROOT,check=True)
 output={}
 with tempfile.TemporaryDirectory(prefix="studio3-factory-") as d:
  tmp=pathlib.Path(d)
  for slug,cfg in SITES.items():
   folder=tmp/slug;(folder/"assets").mkdir(parents=True)
   html=(TEMPLATES/cfg["file"]).read_text()
   css=(TEMPLATES/"studio.css").read_text()
   js=(TEMPLATES/"studio.js").read_text()
   if '<meta name="robots" content="noindex,nofollow">' not in html:raise ValueError("Missing noindex release guard")
   if "/assets/privacy-consent.js" not in html or "/assets/privacy-consent.css" not in html:raise ValueError("Missing privacy controls")
   local_base="/studio2/factory-previews/"+slug+"/"
   html=html.replace("/newdesigns/v2/assets/studio.css",local_base+"studio.css")
   html=html.replace("/newdesigns/v2/assets/studio.js",local_base+"studio.js")
   html=html.replace("/newdesigns/v2/", "/studio2/factory-previews/")
   asset_records=[]
   for role,(source,max_width,quality) in cfg["assets"].items():
    src=ROOT/source
    if not src.is_file() or src.is_symlink() or src.stat().st_size>9_000_000:raise ValueError("Missing/oversize source "+source)
    raw=src.read_bytes()
    with Image.open(src) as im:im.verify()
    with Image.open(src) as im:
     im=ImageOps.exif_transpose(im)
     native=im.size
     if native[0]*native[1]>24_000_000:raise ValueError("Excessive dimensions")
     if im.width>max_width:im=im.resize((max_width,max(1,round(im.height*max_width/im.width))),Image.Resampling.LANCZOS)
     if im.mode not in ("RGB","RGBA"):im=im.convert("RGBA" if "A" in im.getbands() else "RGB")
     target=folder/"assets"/(role+".webp")
     im.save(target,format="WEBP",quality=quality,method=6)
    if target.stat().st_size>1_200_000:raise ValueError("Output image too big")
    with Image.open(target) as check:
     check.load()
     if check.format!="WEBP":raise ValueError("Bad WebP decode")
     final_dimensions=check.size
    asset_records.append(dict(role=role,source=source,source_sha256=digest(raw),native_dimensions=list(native),
        optimized_dimensions=list(final_dimensions),output="assets/"+target.name,
        output_sha256=digest(target.read_bytes()),source_bytes=len(raw),output_bytes=target.stat().st_size,
        conceptual_image_not_documentary=True,final_visual_approval=False))
   for old,new in cfg["css_replacements"].items():
    if old not in css:raise ValueError(f"CSS image source missing {old}")
    css=css.replace(old,new)
   if slug=="media-hub":
    # Reserve a readable dark editorial column; keep the illustrated poster on the right.
    css += """\n.media .hero{background-color:#080f18;background-size:cover,auto 90%;background-position:center,right center;background-repeat:no-repeat;background-image:linear-gradient(90deg,#08121b 0%,#08121bf7 38%,#08121bcb 59%,#08121b47 100%),url('/studio2/river-voice/assets/owl-lens-studio.svg')}.media .hero-content{max-width:1200px}.media .hero h1{max-width:650px;font-size:clamp(3.1rem,5.7vw,6.6rem)}.media .hero p{max-width:540px}@media(max-width:800px){.media .hero{background-size:cover,auto 76%;background-position:center,right top 25px;background-image:linear-gradient(90deg,#08121bf8,#08121bdd 78%,#08121b99),url('/studio2/river-voice/assets/owl-lens-studio.svg')}.media .hero h1{max-width:630px}}@media(max-width:600px){.media .hero{min-height:500px;background-size:cover,auto 59%;background-position:center,right top 28px;background-image:linear-gradient(90deg,#08121bf4,#08121be8),url('/studio2/river-voice/assets/owl-lens-studio.svg')}.media .hero h1{font-size:clamp(2.7rem,10.3vw,4rem)}.media .hero-content{padding:60px 0}}\n"""
   for old,new in cfg["html_replacements"].items():
    if old not in html:raise ValueError(f"HTML image source missing {old}")
    html=html.replace(old,local_base+new)
   # The background paths in stylesheets are relative to the stylesheet and now resolve in this candidate folder.
   (folder/"index.html").write_text(html)
   (folder/"studio.css").write_text(css)
   (folder/"studio.js").write_text(js)
   manifest=dict(schema_version=1,slug=slug,status="unpublished_unapproved_candidate",
       visual_approval=False,architecture=cfg["structure"],assets=asset_records,
       release_guards=dict(noindex=True,merge=False,deployment=False))
   (folder/"asset-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
   output[slug]=manifest
  # Selector for three independently navigable candidate front pages.
  title=lambda s:s.replace("-"," ").title()
  links=[("river-voice","River Voice","Photographic editorial storytelling"),
         ("accountability-ledger","Accountability Ledger","Investigation and TRC accountability"),
         ("media-hub","The Owl's Lens Media Hub","Screen-first interviews and video")]
  cards="".join(f'<article><h2>{name}</h2><p>{desc}</p><a href="/studio2/'+('river-voice/factory-preview/' if slug=='river-voice' else 'factory-previews/'+slug+'/')+f'">Explore working candidate ↗</a></article>' for slug,name,desc in links)
  index='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Delta Owl Eyes — Three original studio candidates</title><link rel="stylesheet" href="/assets/privacy-consent.css"><script defer src="/assets/privacy-consent.js"></script><style>body{margin:0;background:#0b2128;color:#f9f3e6;font:16px/1.5 system-ui,sans-serif}main{max-width:1150px;margin:auto;padding:clamp(25px,6vw,75px)}h1,h2{font-family:Georgia,serif}h1{font-size:clamp(2.3rem,6vw,5rem);line-height:1}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:20px}article{border:1px solid #d3aa74;background:#143b40;padding:32px;min-height:220px}article a{color:#ffdfa5;font-weight:800;display:inline-block;min-height:44px}article p{color:#d3dfdb}.notice{border-left:4px solid #edbf77;padding-left:18px;margin-bottom:30px}a:focus-visible{outline:3px solid #fff;outline-offset:4px}</style></head><body><main><p>DELTA OWL EYES • DESIGN STUDIO 3.1</p><h1>Three different ways to tell the story.</h1><p class="notice">Working responsive candidate front pages for review only. Not production websites; final cinematic visual acceptance is pending.</p><div class="grid">'''+cards+'''</div><p>Hard Truths. Education. Accountability.</p></main></body></html>'''
  (tmp/"index.html").write_text(index)
  if BASE.exists():shutil.rmtree(BASE)
  shutil.copytree(tmp,BASE)
 # Save summary separate from generated preview binary output.
 report=dict(result="CANDIDATES_BUILT_NOT_PUBLISHED",elapsed_seconds=round(time.monotonic()-started,2),
   sites=[{"slug":"river-voice","source":"studio2/river-voice/factory-preview/","state":"preserved"},
          *[{"slug":name,"source":"studio2/factory-previews/"+name+"/","state":"generated"} for name in SITES]],
   assets=sum(len(m["assets"]) for m in output.values()),publish=False)
 (BASE/"build-summary.json").write_text(json.dumps(report,indent=2)+"\n")
 print(json.dumps(report,indent=2))
if __name__=="__main__":main()
