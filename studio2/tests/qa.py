#!/usr/bin/env python3
import json, os, pathlib
from playwright.sync_api import sync_playwright
base=os.getenv("STUDIO_BASE","http://127.0.0.1:8765")
out=pathlib.Path("artifacts/studio2");out.mkdir(parents=True,exist_ok=True)
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for w in (320,390,768,1440):
  page=browser.new_page(viewport={"width":w,"height":900},device_scale_factor=1)
  errors=[]
  page.on("pageerror",lambda e:errors.append(str(e)))
  response=page.goto(base+"/studio2/river-voice/",wait_until="networkidle",timeout=45000)
  page.screenshot(path=str(out/f"river-voice-{w}.png"),full_page=True,animations="disabled")
  info=page.evaluate("""() => ({
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
    mainHeading:document.querySelectorAll('main h1').length,
    missingNames:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length,
    links:[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)===i),
    navigation:!!document.querySelector('nav[aria-label="Primary navigation"]')
  })""")
  if w<=820:
   menu=page.locator(".mobile-menu summary");menu.click()
   info["menuOpened"]=page.locator(".mobile-menu").get_attribute("open") is not None
  else:info["menuOpened"]=True
  info["width"]=w;info["http"]=response.status if response else 0;info["errors"]=errors
  info["pass"]=response is not None and response.status==200 and not info["overflow"] and not info["brokenImages"] and info["mainHeading"]==1 and info["missingNames"]==0 and not errors and info["navigation"] and info["menuOpened"]
  checks.append(info)
  page.close()
 browser.close()
(out/"results.json").write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
if not all(x["pass"] for x in checks):raise SystemExit(1)
