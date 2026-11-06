#!/usr/bin/env python3
"""Screenshot three actual browser-rendered candidates and make gallery thumbnails. No deployment."""
import pathlib, io, json, hashlib
from PIL import Image,ImageOps
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/"studio2/factory-previews/visual-review/assets";OUT.mkdir(parents=True,exist_ok=True)
routes={"river-voice":"/studio2/river-voice/factory-preview/","accountability-ledger":"/studio2/factory-previews/accountability-ledger/","media-hub":"/studio2/factory-previews/media-hub/"}
records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for slug,route in routes.items():
  for width in [1440,390]:
   page=browser.new_page(viewport={"width":width,"height":900},is_mobile=width==390,has_touch=width==390)
   response=page.goto("http://127.0.0.1:8765"+route,wait_until="networkidle",timeout=45000)
   if not response or response.status!=200:raise RuntimeError("Missing original demo "+route)
   if page.locator("#doe-reject").count():page.locator("#doe-reject").click()
   page.evaluate("""async()=>{await Promise.all([...document.images].map(async i=>{if(i.decode)await i.decode().catch(()=>{})}))}""")
   page.evaluate("window.scrollTo(0,0)")
   capture=page.screenshot(animations="disabled")
   im=Image.open(io.BytesIO(capture)).convert("RGB")
   size=(960,600) if width==1440 else (260,600)
   im=ImageOps.fit(im,size,method=Image.Resampling.LANCZOS,centering=(.5,0))
   filename=slug+("-desktop.webp" if width==1440 else "-mobile.webp")
   im.save(OUT/filename,format="WEBP",quality=84,method=6)
   records.append({"design":slug,"capture_width":width,"capture_height":900,"preview":filename,"pixel_dimensions":list(size),"capture_sha256":hashlib.sha256(capture).hexdigest()})
   page.close()
 browser.close()
(OUT.parent/"provenance.json").write_text(json.dumps({"status":"unpublished-browser-screenshots","records":records},indent=2)+"\n")
print("SIX REAL SCREENSHOT THUMBNAILS BUILT")
