#!/usr/bin/env python3
"""Exact reference gallery visual QA. Branch-only; no publishing operations."""
import json, os, pathlib
from playwright.sync_api import sync_playwright
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
ROUTE="/studio-sandbox/reference/"
OUT=pathlib.Path("artifacts/exact-gallery");OUT.mkdir(parents=True,exist_ok=True)
paths=[
"/newdesigns/river-voice/",
"/newdesigns/gathering-place/",
"/newdesigns/accountability-desk/",
"/newdesigns/northern-horizons/",
"/newdesigns/community-network/",
"/newdesigns/owls-lens/"
]
records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width in (320,390,768,1440):
  page=browser.new_page(viewport={"width":width,"height":900},is_mobile=width<=390,has_touch=width<=768)
  errors=[];page.on("pageerror",lambda x:errors.append(str(x)))
  response=page.goto(BASE+ROUTE,wait_until="networkidle",timeout=45000)
  img=page.locator("img")
  props=img.evaluate("(i)=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})")
  banners=page.locator("#doe-consent-banner").count()
  if banners:page.locator("#doe-reject").click()
  links=page.locator(".spot")
  hrefs=links.evaluate_all("(elements)=>elements.map(a=>a.getAttribute('href'))")
  layouts=links.evaluate_all("(elements)=>elements.map(a=>{let r=a.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})")
  links.first.focus()
  focus=links.first.evaluate("(e)=>document.activeElement===e")
  focusBorder=links.first.evaluate("(e)=>getComputedStyle(e).borderTopColor")
  if width<=390:
   container=page.locator(".scroller")
   scrollable=container.evaluate("(e)=>e.scrollWidth>e.clientWidth")
   container.evaluate("(e)=>e.scrollLeft=e.scrollWidth")
   rightReachable=links.last.evaluate("(e)=>{let r=e.getBoundingClientRect();return r.left<innerWidth && r.right>0}")
   container.evaluate("(e)=>e.scrollLeft=0")
  else:scrollable=False;rightReachable=True
  page.screenshot(path=str(OUT/f"exact-{width}.png"),full_page=True,animations="disabled")
  route_statuses=[page.request.get(BASE+x,timeout=15000).status for x in paths] if width==1440 else []
  row={
    "viewport":width,"http":response.status if response else None,
    "native_image":props,"privacy_banner":bool(banners),"hotspots":links.count(),
    "hrefs":hrefs,"layouts":layouts,"keyboard_focus":focus,"focus_border":focusBorder,
    "mobile_scrollable":scrollable,"last_panel_reachable":rightReachable,
    "linked_routes_http":route_statuses,"js_errors":errors
  }
  row["pass"]=bool(row["http"]==200 and props=={"complete":True,"width":1536,"height":1024}
    and row["hotspots"]==6 and hrefs==paths and focus and
    (width>390 or scrollable and rightReachable) and
    (not route_statuses or all(x==200 for x in route_statuses)) and not errors)
  records.append(row)
  page.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(records,indent=2)+"\n")
print(json.dumps({"checked":len(records),"passed":sum(x["pass"] for x in records),"failures":[x for x in records if not x["pass"]]},indent=2))
if not all(x["pass"] for x in records):raise SystemExit(1)
