#!/usr/bin/env python3
"""Website Design Studio responsive smoke tests. Run after pip install playwright && playwright install chromium."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.getenv("STUDIO_BASE_URL","https://deltaowleyes.ca").rstrip("/")
OUT=Path(os.getenv("STUDIO_QA_DIR","artifacts/studio-qa"));OUT.mkdir(parents=True,exist_ok=True)
SLUGS=["river-voice","gathering-place","accountability-desk","northern-horizons","community-network","owls-lens"]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width in (320,390,768,1440):
        page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1)
        errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        try:
            response=page.goto(BASE+"/newdesigns/",wait_until="domcontentloaded",timeout=30000)
            page.wait_for_timeout(2000)
            page.screenshot(path=str(OUT/f"studio-{width}.png"),full_page=True,animations="disabled")
            state=page.evaluate("""() => ({
              title: document.title,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              demos: document.querySelectorAll('a.view-demo').length,
              previews: document.querySelectorAll('.preview-window iframe').length,
              brokenImages: [...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)
            })""")
            state["navigation"] = page.locator("a.view-demo").evaluate_all("(links) => links.map(a => ({href:a.getAttribute('href'), text:a.textContent.trim()}))")
            state["navigation_ok"] = len(state["navigation"]) == 6 and all(x["href"].startswith("/newdesigns/") for x in state["navigation"])
            state["keyboard_focus"] = page.evaluate("() => {const a=document.querySelector('.skip');a.focus();return document.activeElement===a}")
            state["preview_sources"] = page.locator(".preview-window iframe").evaluate_all("(els)=>els.map(e=>e.getAttribute('src'))")
            state["preview_sources_ok"] = len(set(state["preview_sources"])) == 6
            state.update(width=width,http_status=response.status if response else None,js_errors=errors)
            state["pass"]=state["http_status"]==200 and not state["overflow"] and state["demos"]==6 and state["previews"]==6 and not errors and not state["brokenImages"] and state["navigation_ok"] and state["keyboard_focus"] and state["preview_sources_ok"]
            results.append(state)
        except Exception as e:results.append({"width":width,"pass":False,"error":str(e)})
        page.close()
    for slug in SLUGS:
        page=browser.new_page(viewport={"width":390,"height":844})
        try:
            response=page.goto(BASE+"/newdesigns/"+slug+"/",wait_until="domcontentloaded",timeout=30000)
            page.wait_for_timeout(1200)
            page.screenshot(path=str(OUT/f"{slug}-390.png"),full_page=True,animations="disabled")
            overflow=page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
            results.append({"candidate":slug,"http_status":response.status if response else None,"overflow":overflow,"pass":bool(response and response.status==200 and not overflow)})
        except Exception as e:results.append({"candidate":slug,"pass":False,"error":str(e)})
        page.close()
    browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
if not all(r.get("pass") for r in results):raise SystemExit(1)
