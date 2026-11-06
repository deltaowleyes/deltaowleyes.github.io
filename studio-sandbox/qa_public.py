#!/usr/bin/env python3
"""BAKE 6.0 public Studio: verify one exact desktop artwork, six responsive mobile panels, privacy and real links.
Read-only site QA. Artifacts contain actual Chromium screenshots from the public URL.
"""
import hashlib,json,pathlib,time,urllib.request
from playwright.sync_api import sync_playwright
BASE="https://deltaowleyes.ca"
URL=BASE+"/studio-sandbox/"
OUT=pathlib.Path("artifacts/public-studio");OUT.mkdir(parents=True,exist_ok=True)
EXPECTED_IMAGE_SHA256="f67af65d25c986507b8d867621cfc02d413ec3a1110879904f4dbdc36218ee8d"
ROUTES=["/newdesigns/river-voice/","/newdesigns/gathering-place/",
"/newdesigns/accountability-desk/","/newdesigns/northern-horizons/",
"/newdesigns/community-network/","/newdesigns/owls-lens/"]
source=None
for attempt in range(12):
 try:
  req=urllib.request.Request(URL,headers={"User-Agent":"DeltaOwlEyes-PublicStudio6-QA/1.0","Cache-Control":"no-cache"})
  with urllib.request.urlopen(req,timeout=18) as response:
   source=response.read().decode("utf-8")
  if "mobile-studio" in source and "desktop-master" in source and "reference.webp" in source:break
 except Exception as exc:
  print("Public fetch attempt",attempt+1,repr(exc))
 if attempt<11:time.sleep(8)
else:raise RuntimeError("Updated BAKE 6.0 public HTML not confirmed after deployment")
with urllib.request.urlopen(BASE+"/studio-sandbox/reference.webp",timeout=20) as response:
 image=response.read()
actual=hashlib.sha256(image).hexdigest()
assert actual==EXPECTED_IMAGE_SHA256, "Public reference art differs from approved image"
records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in [320,390,768,1440]:
  context=browser.new_context(viewport={"width":width,"height":900},
    is_mobile=width<=390,has_touch=width<=768)
  page=context.new_page()
  errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
  response=page.goto(URL,wait_until="networkidle",timeout=45000)
  master=page.locator(".desktop-master img")
  image_info=master.evaluate("(img)=>({width:img.naturalWidth,height:img.naturalHeight,loaded:img.complete})")
  desktop=width>=1000
  selector=".hotspot" if desktop else ".family"
  links=page.locator(selector)
  hrefs=links.evaluate_all("(els)=>els.map(el=>el.getAttribute('href'))")
  shown=links.evaluate_all("(els)=>els.filter(el=>el.getClientRects().length>0).length")
  links.first.focus()
  focus=links.first.evaluate("(el)=>document.activeElement===el")
  # Protect usable mobile layout: no sideways scroll on any viewport.
  overflow=page.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth+1")
  grid_cols=page.locator(".family-grid").evaluate("(el)=>getComputedStyle(el).gridTemplateColumns")
  privacy=page.locator("#doe-consent-banner").count()==1
  if privacy:page.locator("#doe-reject").click()
  consent=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
  page.reload(wait_until="networkidle")
  consent_persisted=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'") and page.locator("#doe-consent-banner").count()==0
  page.screenshot(path=str(OUT/f"live-studio-{width}.png"),full_page=True,animations="disabled")
  routes=[]
  if width==1440:
   routes=[page.request.get(BASE+x,timeout=15000).status for x in ROUTES]
  rec={"width":width,"http":response.status if response else None,
   "native_image":image_info,"desktop_mode":desktop,"visible_links":shown,
   "hrefs":hrefs,"focus":focus,"horizontal_overflow":overflow,
   "mobile_grid_columns":grid_cols,"privacy_present":privacy,
   "privacy_rejected":consent,"consent_persisted":consent_persisted,
   "routes_http":routes,"js_errors":errors}
  rec["pass"]=bool(rec["http"]==200 and image_info=={"width":1536,"height":1024,"loaded":True}
   and shown==6 and hrefs==ROUTES and focus and not overflow
   and privacy and consent and consent_persisted and not errors and
   (not routes or all(status==200 for status in routes)))
  records.append(rec);context.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps({"reference_sha256":actual,"checks":records},indent=2)+"\n")
failures=[rec for rec in records if not rec["pass"]]
print(json.dumps({"viewport_checks":len(records),"passed":len(records)-len(failures),"failures":failures},indent=2))
if failures or len(records)!=4:raise SystemExit(1)
