#!/usr/bin/env python3
"""Create screenshot-only Studio previews from six existing working demo routes.
Generated public output contains screenshots, not template source files.
Existing /newdesigns/ public routes remain accessible independently.
"""
from __future__ import annotations
import io, json, pathlib, hashlib, re, html
from PIL import Image, ImageFilter, ImageDraw
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
STUDIO=ROOT/"studio-sandbox"
PORT="http://127.0.0.1:8765"
WIDTHS=[320,390,500,768,1024,1440]
FAMILIES=[
 ("river-voice","River Voice","Editorial","/newdesigns/river-voice/"),
 ("gathering-place","Modern Longhouse","Community Hub","/newdesigns/gathering-place/"),
 ("accountability-desk","Accountability Ledger","Investigative","/newdesigns/accountability-desk/"),
 ("northern-horizons","Northern Horizons","Culture & Land","/newdesigns/northern-horizons/"),
 ("community-network","Community Network","Directory & Services","/newdesigns/community-network/"),
 ("owls-lens","The Owl's Lens","Video & Podcast","/newdesigns/owls-lens/"),
]
HEADER_SOURCE=STUDIO/"reference-40.webp"
HEADER_WIDTHS=[("320",320),("390",390),("500",500),("768",768),("1024",1024),("1440",1440)]
SRC=Image.open(HEADER_SOURCE).convert("RGB")
assert SRC.size==(1536,1024)
# This is exactly the original, slim gallery-header strip. Preserve its ratio.
header=SRC.crop((0,0,1536,171))
for name,w in HEADER_WIDTHS:
 h=round(w*171/1536)
 scaled=header.resize((w,h),Image.Resampling.LANCZOS)
 # Do not distort, pad, or introduce redesigned artwork.
 scaled.save(STUDIO/f"header-slim-{name}.webp",format="WEBP",quality=87,method=6)
 assert Image.open(STUDIO/f"header-slim-{name}.webp").size==(w,h)

STYLE="""
:root{color-scheme:dark;--gold:#f7d5a5;--paper:#fff6ea;--wine:#751a27}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#101f29;color:var(--paper);font:16px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}
a{color:inherit}a:focus-visible,button:focus-visible{outline:3px solid #ffe1a1;outline-offset:4px}
header.site-header{max-width:1536px;margin:auto;background:#0b1c26}header.site-header img{width:100%;height:auto;display:block}
main{max-width:1450px;margin:0 auto;padding:clamp(12px,2vw,28px)}
.back{display:inline-flex;min-height:44px;align-items:center;text-decoration:none;font-weight:750;border:1px solid #b6a28a;border-radius:5px;padding:8px 14px;background:#2a333a}
h1{font:700 clamp(1.8rem,3.2vw,3.25rem)/1.13 Georgia,serif;color:#f5cc85;margin:22px 0 6px}
.description{color:#ecdfd0;max-width:900px;margin:0 0 18px}
.screens{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px;align-items:start}
.shot{min-width:0;background:#faf2e7;color:#1a2026;border:2px solid #b6aa9b;border-radius:12px;overflow:hidden;box-shadow:0 7px 20px #0009}
.shot button{display:block;width:100%;border:0;background:#f7f0e7;padding:0;cursor:zoom-in;text-align:inherit;color:inherit}
.shot img{display:block;width:100%;height:auto}
.shot-title{padding:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:800}
.shot-title span{font-size:.78rem;color:#6d2430}
.note{font-size:.78rem;color:#dfd3be;margin-top:20px}
dialog{max-width:min(96vw,1600px);max-height:96vh;border:2px solid #e6bc7a;border-radius:10px;background:#111922;color:white;padding:12px;overflow:auto}
dialog::backdrop{background:#000b}
dialog img{display:block;max-width:none;height:auto}
.dialogbar{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:8px;position:sticky;top:0;background:#111922;z-index:2}
.dialogbar button{min-height:44px;border-radius:5px;border:1px solid #f0d5a3;background:#721b2b;color:white;padding:8px 17px;font-weight:800;cursor:pointer}
@media(max-width:980px){.screens{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:580px){.screens{grid-template-columns:1fr}main{padding:12px}.shot-title{padding:10px}dialog{padding:6px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
"""
def header_markup():
 return """<header class="site-header"><picture>
<source media="(max-width:354px)" srcset="../../header-slim-320.webp">
<source media="(max-width:439px)" srcset="../../header-slim-390.webp">
<source media="(max-width:629px)" srcset="../../header-slim-500.webp">
<source media="(max-width:895px)" srcset="../../header-slim-768.webp">
<source media="(max-width:1279px)" srcset="../../header-slim-1024.webp">
<img src="../../header-slim-1440.webp" width="1440" height="160" alt="Delta Owl Eyes Website Design Studio, 40 Exceptional Website Designs">
</picture></header>"""
manifest=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for slug,title,category,route in FAMILIES:
  target=STUDIO/"previews"/slug
  target.mkdir(parents=True,exist_ok=True)
  records=[]
  for width in WIDTHS:
   page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,is_mobile=width<=500,has_touch=width<=500)
   errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
   response=page.goto(PORT+route,wait_until="networkidle",timeout=60000)
   if not response or response.status!=200:raise RuntimeError(f"Missing demo {route} at {width}: {response.status if response else 'no response'}")
   # Dismiss optional consent banner before customer-facing screenshot.
   if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():
    page.locator("#doe-reject").first.click()
   page.evaluate("""async()=>{await Promise.all(Array.from(document.images).map(i=>i.decode?.().catch(()=>{})))}""")
   page.evaluate("window.scrollTo(0,0)")
   page.wait_for_timeout(120)
   shot=page.screenshot(full_page=True,animations="disabled",timeout=60000)
   im=Image.open(io.BytesIO(shot)).convert("RGB")
   if im.width!=width:raise RuntimeError(f"Capture width mismatch {slug}: {im.width}!={width}")
   filename=f"full-{width}.webp"
   im.save(target/filename,format="WEBP",quality=74,method=5)
   reloaded=Image.open(target/filename)
   reloaded.load()
   if reloaded.size!=im.size:raise RuntimeError("Screenshot dimensions changed on encode")
   records.append({"width":width,"height":im.height,"file":filename,"bytes":(target/filename).stat().st_size,"sha256":hashlib.sha256((target/filename).read_bytes()).hexdigest(),"page_errors":errors})
   print("CAPTURED",slug,width,im.height,(target/filename).stat().st_size,flush=True)
   page.close()
  cards="".join(f'''<article class="shot"><button type="button" data-src="full-{v['width']}.webp" data-title="{v['width']}px screenshot" aria-label="Enlarge complete {html.escape(title)} screenshot at {v['width']} pixels"><img src="full-{v['width']}.webp" width="{v['width']}" height="{v['height']}" alt="Full-page {html.escape(title)} browser screenshot captured at {v['width']} pixel viewport" loading="lazy"></button><div class="shot-title">{v['width']}px viewport <span>Enlarge screenshot</span></div></article>''' for v in records)
  content=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#101f29"><title>{html.escape(title)} — Screenshots | Delta Owl Eyes Studio</title><link rel="stylesheet" href="/assets/privacy-consent.css"><script defer src="/assets/privacy-consent.js"></script><style>{STYLE}</style></head><body>{header_markup()}<main><a class="back" href="/studio-sandbox/">← Back to six design directions</a><h1>{html.escape(title)}</h1><p class="description"><strong>{html.escape(category)}</strong> · Six full-page browser screenshots of an existing responsive concept, captured at the actual viewport sizes. Select any screenshot to examine the full design. These are images, not interactive website demos.</p><section class="screens" aria-label="Six viewport screenshots">{cards}</section><p class="note">Screenshot-only preview. Visual concept; appearance and availability of proposed features must be confirmed before commissioning. Original demo code is not included in this gallery.</p></main><dialog id="enlarge" aria-label="Enlarged screenshot preview"><div class="dialogbar"><strong id="dialog-title">Screenshot</strong><button id="close-preview" type="button">Close ✕</button></div><img id="bigshot" alt="Enlarged full-page design screenshot"></dialog><script>(()=>{{const dialog=document.getElementById('enlarge'),img=document.getElementById('bigshot'),title=document.getElementById('dialog-title');let last=null;document.querySelectorAll('[data-src]').forEach(btn=>btn.addEventListener('click',()=>{{last=btn;img.src=btn.dataset.src;title.textContent=btn.dataset.title;img.style.width=btn.dataset.src.includes('1440')?'1440px':btn.dataset.src.includes('1024')?'1024px':btn.dataset.src.includes('768')?'768px':btn.dataset.src.includes('500')?'500px':btn.dataset.src.includes('390')?'390px':'320px';dialog.showModal();}}));document.getElementById('close-preview').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{{img.removeAttribute('src');last?.focus();}});dialog.addEventListener('click',e=>{{if(e.target===dialog)dialog.close();}});}})();</script></body></html>'''
  (target/"index.html").write_text(content)
  manifest.append({"slug":slug,"title":title,"category":category,"screenshots":records})
 browser.close()
(STUDIO/"screenshot-manifest.json").write_text(json.dumps({"status":"screenshots-of-existing-public-demo-pages","note":"Existing public /newdesigns/ routes still expose HTML and CSS independently; screenshots do not provide DRM.", "families":manifest},indent=2)+"\n")
# Safely redirect ONLY the gallery's 12 href targets to the six screenshot-only views.
main=STUDIO/"index.html"
body=main.read_text()
for slug,_,__,route in FAMILIES:
 count=body.count('href="'+route+'"')
 if count!=2:raise RuntimeError(f"Expected two primary gallery hotspots for {route}; found {count}")
 body=body.replace('href="'+route+'"','href="/studio-sandbox/previews/'+slug+'/"')
body=body.replace("View demo ▶","View screenshots ▶")
body=body.replace("These links open the closest existing working public demos; the final second-stage galleries are still in development.","Choose a design to view six full-page screenshots at different viewport sizes; source code is not provided through the gallery.")
# Replace old oversized responsive headers with exact original strip scaled proportionately.
for old,new in [('header-320.webp','header-slim-320.webp'),('header-390.webp','header-slim-390.webp'),('header-500.webp','header-slim-500.webp'),('header-768.webp','header-slim-768.webp'),('header-1024.webp','header-slim-1024.webp')]:
 body=body.replace('srcset="'+old+'"','srcset="'+new+'"').replace('src="'+old+'"','src="'+new+'"')
# Desktop still uses exact 1536x1024 master, including its faithful slim header.
body=body.replace('width="1024" height="200" decoding="async"','width="1024" height="114" decoding="async"')
body=body.replace("six distinct design directions.","six design directions with full-page screenshot previews.")
main.write_text(body)
print("SUCCESS",len(manifest),"designs",sum(len(x["screenshots"]) for x in manifest),"screenshots")
