#!/usr/bin/env python3
"""Public-source verification of approved Studio sandbox, including real browser evidence.
Never modifies live HTML, account data, privacy settings, or production pages.
"""
import hashlib,json,pathlib,time,urllib.request
from playwright.sync_api import sync_playwright
BASE="https://deltaowleyes.ca"
URL=BASE+"/studio-sandbox/"
OUT=pathlib.Path("artifacts/public-studio")
OUT.mkdir(parents=True,exist_ok=True)
EXPECTED_IMAGE_SHA256="f67af65d25c986507b8d867621cfc02d413ec3a1110879904f4dbdc36218ee8d"
ROUTES=["/newdesigns/river-voice/","/newdesigns/gathering-place/",
"/newdesigns/accountability-desk/","/newdesigns/northern-horizons/",
"/newdesigns/community-network/","/newdesigns/owls-lens/"]
# Verify the latest public page is actually served; publish edge caches may lag.
source=""
for attempt in range(18):
 try:
  req=urllib.request.Request(URL,headers={"User-Agent":"DeltaOwlEyes-Studio-PublicQA/1.0","Cache-Control":"no-cache"})
  with urllib.request.urlopen(req,timeout=15) as r:
   source=r.read().decode("utf-8")
  if "id=\"gallery-notes\"" in source and "reference.webp" in source:
   break
 except Exception as e:
  print("Public fetch attempt",attempt+1,str(e))
 time.sleep(10)
else:
 raise RuntimeError("Latest public sandbox HTML not confirmed after retries")
with urllib.request.urlopen(BASE+"/studio-sandbox/reference.webp",timeout=20) as r:
 raw=r.read()
actual=hashlib.sha256(raw).hexdigest()
assert actual==EXPECTED_IMAGE_SHA256, f"Public reference image SHA mismatch: {actual}"
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in [320,390,768,1440]:
  context=browser.new_context(viewport={"width":width,"height":900},
   has_touch=width<=768,is_mobile=width<=390)
  page=context.new_page()
  errors=[]
  page.on("pageerror",lambda e:errors.append(str(e)))
  response=page.goto(URL,wait_until="networkidle",timeout=45000)
  img=page.locator(".stage img")
  image_info=img.evaluate("(i)=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})")
  spots=page.locator(".spot")
  hrefs=spots.evaluate_all("(es)=>es.map(a=>a.getAttribute('href'))")
  rects=spots.evaluate_all("(es)=>es.map(a=>{let r=a.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})")
  first=spots.first
  first.focus()
  focus=first.evaluate("(e)=>document.activeElement===e")
  privacy_present=page.locator("#doe-consent-banner").count()==1
  if privacy_present:
   page.locator("#doe-reject").click()
  privacy_rejected=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
  scrollable=True;last_visible=True
  if width<=390:
   scroller=page.locator(".scroller")
   scrollable=scroller.evaluate("(e)=>e.scrollWidth>e.clientWidth")
   scroller.evaluate("(e)=>e.scrollLeft=e.scrollWidth")
   last_visible=spots.last.evaluate("(e)=>{let r=e.getBoundingClientRect();return r.left<innerWidth&&r.right>0}")
   scroller.evaluate("(e)=>e.scrollLeft=0")
  page.screenshot(path=str(OUT/f"live-studio-{width}.png"),full_page=True,animations="disabled")
  routes_status=[]
  if width==1440:
   for link in hrefs:
    resp=page.request.get(BASE+link,timeout=15000)
    routes_status.append(resp.status)
  check={"width":width,"http":response.status if response else None,
    "image":image_info,"hotspots":spots.count(),"hrefs":hrefs,"rects":rects,
    "focus":focus,"privacy_banner":privacy_present,"privacy_rejected":privacy_rejected,
    "mobile_scrollable":scrollable,"last_reachable":last_visible,
    "destinations_http":routes_status,"js_errors":errors}
  check["pass"]=bool(check["http"]==200 and image_info=={"complete":True,"width":1536,"height":1024}
   and check["hotspots"]==6 and hrefs==ROUTES and focus and privacy_present
   and privacy_rejected and scrollable and last_visible and not errors
   and all(x==200 for x in routes_status))
  checks.append(check)
  context.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps({"sha256":actual,"checks":checks},indent=2)+"\n")
print(json.dumps({"public_image_sha256":actual,"viewport_checks":len(checks),
 "passed":sum(x["pass"] for x in checks),"failed":[x for x in checks if not x["pass"]]},indent=2))
if not all(x["pass"] for x in checks):raise SystemExit(1)
