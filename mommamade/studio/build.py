#!/usr/bin/env python3
"""Momma Made website screenshot capture ONLY.
Shared studio HTML, six headers, CSS and preview interactions are never authored
here. They are the canonical /assets/express-studio/v1/ shell.
"""
from __future__ import annotations
import hashlib,io,json,pathlib
from PIL import Image,ImageOps
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/"mommamade/studio"
POLISH=OUT/"polish.css"
WIDTHS=[320,390,500,768,1024,1440]
FAMILIES=[
(1,"atelier-ledger","Atelier Ledger","Editorial craft","A considered kitchen, one useful piece at a time."),
(2,"picnic-club","Picnic Club","Playful and vibrant","Pack a little more joy."),
(3,"utility-index","Utility Index","Functional catalogue","Everyday goods, well organized."),
(4,"garden-folio","Garden Folio","Botanical and refined","The gentle art of keeping things."),
(5,"pattern-studio","Pattern Studio","Graphic and expressive","Colour the everyday."),
(9,"quiet-catalogue","Quiet Catalogue","Modern minimal","Useful, thoughtfully chosen."),
]
manifest={"status":"candidate-review-only","source":"existing Momma Made V3 browser captures with capture-only CSS","shell_contract":"BAKE-EXPRESS-MASTER-1.0","widths":WIDTHS,"capture_polish_sha256":hashlib.sha256(POLISH.read_bytes()).hexdigest(),"note":"Original common BAKE EXPRESS header and layout are not altered by this screenshot generator. Existing V3 candidate sources remain independently public; V2 stays current.","families":[]}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for number,slug,title,mood,tagline in FAMILIES:
  dest=OUT/"previews"/slug
  dest.mkdir(parents=True,exist_ok=True)
  rows=[]
  for width in WIDTHS:
   page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,is_mobile=width<=500,has_touch=width<=500)
   errors=[]
   page.on("pageerror",lambda e:errors.append(str(e)))
   res=page.goto("http://127.0.0.1:8765/mommamade/v3/?template="+str(number)+"#home",wait_until="networkidle",timeout=60000)
   assert res and res.status==200,(slug,width,"capture route")
   if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():page.locator("#doe-reject").first.click()
   page.add_style_tag(path=str(POLISH))
   page.evaluate("""async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0)}""")
   page.wait_for_timeout(100)
   assert page.locator(".site").count()==1,(slug,width,"candidate missing")
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(slug,width,"overflow")
   assert not errors,(slug,width,errors)
   image=Image.open(io.BytesIO(page.screenshot(full_page=True,animations="disabled",timeout=60000))).convert("RGB")
   assert image.width==width
   file=dest/f"full-{width}.webp"
   image.save(file,"WEBP",quality=76,method=4)
   with Image.open(file) as check:check.load();assert check.size==image.size
   if width==1440:
    top=image.crop((0,0,1440,min(970,image.height)))
    ImageOps.fit(top,(740,500),method=Image.Resampling.LANCZOS,centering=(.5,0)).save(dest/"thumbnail.webp","WEBP",quality=80,method=5)
   rows.append({"width":width,"height":image.height,"file":file.name,"bytes":file.stat().st_size,"sha256":hashlib.sha256(file.read_bytes()).hexdigest(),"page_errors":errors})
   print("CAPTURE",slug,width,flush=True)
   page.close()
  manifest["families"].append({"template":number,"slug":slug,"title":title,"mood":mood,"tagline":tagline,"screenshots":rows})
 browser.close()
assert len(manifest["families"])==6 and all(len(x["screenshots"])==6 for x in manifest["families"])
(OUT/"screenshot-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")
print("PASS: 36 real screenshots; shared studio shell never changed by capture")
