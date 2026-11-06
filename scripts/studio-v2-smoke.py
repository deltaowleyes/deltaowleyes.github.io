#!/usr/bin/env python3
"""Studio 2.0 candidate Chromium audit. No write to production; candidate images are existing owned site assets."""
import json, os, pathlib, urllib.request
from playwright.sync_api import sync_playwright
BASE=os.environ.get("STUDIO_BASE_URL","http://127.0.0.1:8765").rstrip("/")
OUT=pathlib.Path("artifacts/studio-v2")
OUT.mkdir(parents=True,exist_ok=True)
SLUGS=["","river-voice/","accountability-ledger/","media-hub/"]
results=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  for slug in SLUGS:
    for width in (320,390,768,1440):
      page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1)
      errors=[]
      page.on("pageerror",lambda e:errors.append(str(e)))
      path=f"/newdesigns/v2/{slug}"
      try:
        res=page.goto(BASE+path,wait_until="networkidle",timeout=30000)
        page.screenshot(path=str(OUT/f"{slug.replace('/','-') or 'gallery'}-{width}.png"),full_page=True,animations="disabled")
        state=page.evaluate("""() => ({
          overflow:document.documentElement.scrollWidth>innerWidth+2,
          heading:!!document.querySelector('main h1'),
          broken:[...document.images].filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.src),
          mainLinks:[...document.querySelectorAll('main a[href]')].length,
          candidateLinks:[...document.querySelectorAll('a[href^="/newdesigns/v2/"]')].length,
          hasSkip:!!document.querySelector('a.skip[href="#content"]')
        })""")
        if slug=="":
          state["availableDemoLinks"]=page.locator('.collection-card:not(.planned) .details a').count()
          state["plannedDemoLinks"]=page.locator('.collection-card.planned .details a').count()
        if width<=768:
          toggle=page.locator(".nav-toggle")
          toggle.click()
          state["menuOpens"]=toggle.get_attribute("aria-expanded")=="true" and page.locator(".nav-links").is_visible()
          page.keyboard.press("Escape")
          state["menuCloses"]=toggle.get_attribute("aria-expanded")=="false"
        else:
          state["menuOpens"]=True
          state["menuCloses"]=True
        state.update(route=path,width=width,status=res.status if res else None,errors=errors)
        state["pass"]=(state["status"]==200 and not state["overflow"] and state["heading"] and
          not state["broken"] and state["mainLinks"]>=1 and state["hasSkip"] and
          state["menuOpens"] and state["menuCloses"] and not errors and
          (slug!="" or (state["availableDemoLinks"]==3 and state["plannedDemoLinks"]==0)))
        results.append(state)
      except Exception as exc:
        results.append(dict(route=path,width=width,pass_=False,error=str(exc)))
      finally:
        page.close()
  browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2))
print(json.dumps({"checks":len(results),"passed":sum(r.get("pass",False) for r in results),"failures":[r for r in results if not r.get("pass",False)]},indent=2))
if not all(r.get("pass",False) for r in results):
  raise SystemExit(1)
