#!/usr/bin/env python3
"""Manual, non-deploying Playwright QA. 
From repo root: python3 -m http.server 8000
Then: BRANDEE_STUDIO_URL=http://127.0.0.1:8000/brandee/studio/v1 python3 brandee/studio/v1/visual_qa.py
Requires an already-installed free Playwright and Chromium.
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get("BRANDEE_STUDIO_URL","http://127.0.0.1:8000/brandee/studio/v1").rstrip("/")
OUT=Path("artifacts/brandee-studio-qa"); OUT.mkdir(parents=True,exist_ok=True)
THEMES=["cathedral-sunrise","marian-rose-garden","woodland-pilgrimage","rosary-atelier","catholic-journal","coffee-grace"]
ROUTES=["home","faith","running","rosaries","coffee","about"]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    cases=[("gallery",BASE+"/",w) for w in (320,390,768,1024,1440,1920)]
    cases += [(name+"-home",BASE+"/"+name+"/#home",w) for name in THEMES for w in (320,390,768,1440)]
    cases += [(name+"-"+route,BASE+"/"+name+"/#"+route,390) for name in THEMES for route in ROUTES if route!="home"]
    for label,url,width in cases:
        page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1)
        errors=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        try:
            response=page.goto(url,wait_until="load",timeout=30000)
            page.screenshot(path=str(OUT/(label+"-"+str(width)+".png")),full_page=True,animations="disabled")
            state=page.evaluate("""() => ({
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              brokenImages: [...document.images].filter(i=>!i.complete || i.naturalWidth===0).map(i=>i.getAttribute('src')),
              headings: document.querySelectorAll('main h1').length,
              activeLink: document.querySelectorAll('nav a[aria-current="page"]').length,
              candidateLinks: document.querySelectorAll('a.explore').length
            })""")
            ok=bool(response and response.status==200 and not state["overflow"] and not state["brokenImages"] and not errors)
            if label!="gallery":ok=ok and state["headings"]==1 and state["activeLink"]>=1
            else:ok=ok and state["candidateLinks"]==6
            results.append(dict(label=label,width=width,http=response.status if response else None,pass_check=ok,errors=errors,**state))
        except Exception as e:results.append(dict(label=label,width=width,pass_check=False,error=str(e)))
        page.close()
    browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2))
print(json.dumps({"cases":len(results),"passed":sum(r["pass_check"] for r in results),"failed":[r for r in results if not r["pass_check"]]},indent=2))
if not all(r["pass_check"] for r in results):raise SystemExit(1)
