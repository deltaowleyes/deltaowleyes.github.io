#!/usr/bin/env python3
"""Visual approval gallery: six panels, three real working demos, no fabricated screenshots."""
import json, pathlib, os
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
OUT=ROOT/"artifacts/studio3-gallery";OUT.mkdir(parents=True,exist_ok=True)
url="/studio2/factory-previews/visual-review/"
records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in [320,390,768,1440]:
  page=browser.new_page(viewport={"width":width,"height":900},has_touch=width<=768,is_mobile=width<=390)
  errors=[]
  page.on("pageerror",lambda e:errors.append(str(e)))
  res=page.goto(BASE+url,wait_until="networkidle",timeout=35000)
  if page.locator("#doe-consent-banner").count():page.locator("#doe-reject").click()
  page.evaluate("""async()=>{await Promise.all([...document.images].map(async i=>{if(i.decode)await i.decode().catch(()=>{})}))}""")
  page.screenshot(path=str(OUT/f"gallery-{width}.png"),full_page=True,animations="disabled")
  state=page.evaluate("""()=>({
    width:innerWidth,
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    noindex:!!document.querySelector('meta[name="robots"][content="noindex,nofollow"]'),
    h1:document.querySelectorAll('h1').length,
    cards:document.querySelectorAll('.concept').length,
    active:document.querySelectorAll('.concept:not(.planned)').length,
    planned:document.querySelectorAll('.concept.planned').length,
    liveLinks:document.querySelectorAll('.concept:not(.planned) .action[href]').length,
    falseLinks:document.querySelectorAll('.concept.planned a[href]').length,
    broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
    fileTypes:[...document.querySelectorAll('.concept.active img')].map(i=>i.currentSrc.split('.').pop()),
    visibleLabels:[...document.querySelectorAll('.concept.active .stamp')].map(e=>e.textContent.trim())
  })""")
  state["viewport"]=width
  state["http"]=res.status if res else 0
  state["errors"]=errors
  destinations=page.locator(".concept.active .action").evaluate_all("(es)=>es.map(e=>e.getAttribute('href'))")
  state["routeResponses"]=[page.request.get(BASE+x).status for x in destinations]
  state["pass"]=(state["http"]==200 and not state["overflow"] and state["noindex"] and state["h1"]==1 and
      state["cards"]==6 and state["active"]==3 and state["planned"]==3 and
      state["liveLinks"]==3 and state["falseLinks"]==0 and not state["broken"] and
      all(x=="webp" for x in state["fileTypes"]) and all(x==200 for x in state["routeResponses"]) and not errors)
  records.append(state)
  page.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(records,indent=2)+"\n")
print(json.dumps({"galleryChecks":len(records),"passed":sum(x["pass"] for x in records),"failures":[x for x in records if not x["pass"]]},indent=2))
if not all(x["pass"] for x in records):raise SystemExit(1)
