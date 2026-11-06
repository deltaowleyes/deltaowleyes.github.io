#!/usr/bin/env python3
"""Read-only acceptance of public Studio screenshot previews; never opens template source."""
import json,pathlib,time,urllib.request
from playwright.sync_api import sync_playwright
BASE="https://deltaowleyes.ca"
S=BASE+"/studio-sandbox/"
OUT=pathlib.Path("artifacts/studio-public-screenshots");OUT.mkdir(parents=True,exist_ok=True)
FAMILIES=["river-voice","gathering-place","accountability-desk","northern-horizons","community-network","owls-lens"]
WIDTHS=[320,390,500,768,1024,1440]
# Wait for published screenshot HTML, not merely a successful GitHub build.
for attempt in range(28):
 try:
  with urllib.request.urlopen(S+"previews/river-voice/",timeout=12) as r:
   payload=r.read().decode("utf-8")
  with urllib.request.urlopen(S,timeout=12) as r:
   landing=r.read().decode("utf-8")
  if 'full-1440.webp' in payload and 'href="/studio-sandbox/previews/river-voice/"' in landing:break
 except Exception as e:
  print("Waiting for public Pages deployment:",str(e),flush=True)
 if attempt<27:time.sleep(10)
else:raise RuntimeError("Public screenshot-gallery update not yet available")
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in WIDTHS:
  page=browser.new_page(viewport={"width":width,"height":900},is_mobile=width<=500,has_touch=width<=500)
  errors=[];page.on("pageerror",lambda error:errors.append(str(error)))
  response=page.goto(S,wait_until="networkidle",timeout=45000)
  links=page.locator('a[href^="/studio-sandbox/previews/"]')
  srcs=links.evaluate_all("(es)=>es.map(e=>e.getAttribute('href'))")
  expected=[f"/studio-sandbox/previews/{slug}/" for slug in FAMILIES]
  unique=set(srcs)
  no_public_demo_links=page.locator('a[href^="/newdesigns/"]').count()==0
  visible=links.evaluate_all("(es)=>es.filter(e=>e.getClientRects().length>0).length")
  overflow=page.evaluate("document.documentElement.scrollWidth>innerWidth+1")
  if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():
   page.locator("#doe-reject").first.click()
  page.screenshot(path=str(OUT/f"landing-{width}.png"),full_page=False,animations="disabled")
  page2=browser.new_page(viewport={"width":width,"height":900},is_mobile=width<=500,has_touch=width<=500)
  r=page2.goto(S+"previews/river-voice/",wait_until="networkidle",timeout=45000)
  captures=page2.locator(".shot").count()
  first=page2.locator(".shot button").first
  first.click()
  dialog=page2.locator("#enlarge")
  dialog_open=dialog.evaluate("(e)=>e.open")
  page2.locator("#close-preview").click()
  dialog_closed=not dialog.evaluate("(e)=>e.open")
  overflow2=page2.evaluate("document.documentElement.scrollWidth>innerWidth+1")
  page2.screenshot(path=str(OUT/f"preview-{width}.png"),full_page=False,animations="disabled")
  status=[page2.request.get(S+f"previews/{slug}/",timeout=15000).status for slug in FAMILIES] if width==1440 else []
  images=[page2.request.get(S+f"previews/river-voice/full-{w}.webp",timeout=15000).status for w in WIDTHS] if width==1440 else []
  result={"width":width,"landing_http":response.status if response else None,"preview_http":r.status if r else None,"unique_destinations":len(unique),"visible_links":visible,"no_public_demo_links":no_public_demo_links,"no_horizontal_overflow":not overflow and not overflow2,"preview_image_count":captures,"dialog_open":dialog_open,"dialog_closed":dialog_closed,"family_http":status,"screenshot_http":images,"js_errors":errors}
  result["pass"]=bool(result["landing_http"]==200 and result["preview_http"]==200 and sorted(unique)==sorted(expected) and visible==6 and no_public_demo_links and not overflow and not overflow2 and captures==6 and dialog_open and dialog_closed and all(x==200 for x in status+images) and not errors)
  results.append(result)
  page.close();page2.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2)+"\n")
print(json.dumps({"passed":sum(x["pass"] for x in results),"total":len(results),"failures":[x for x in results if not x["pass"]]},indent=2))
if not all(x["pass"] for x in results):raise SystemExit(1)
