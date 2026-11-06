#!/usr/bin/env python3
"""Exact six-breakpoint Studio browser acceptance, local or public, without publishing anything."""
import hashlib,json,os,pathlib,time,urllib.request
from playwright.sync_api import sync_playwright
BASE=os.environ.get("STUDIO_BASE","https://deltaowleyes.ca").rstrip("/")
PUBLIC=(BASE=="https://deltaowleyes.ca")
URL=BASE+"/studio-sandbox/"
OUT=pathlib.Path("artifacts/studio-header-recovery");OUT.mkdir(parents=True,exist_ok=True)
ROOT=pathlib.Path(__file__).parent
MANIFEST=json.loads((ROOT/"header-restoration-manifest.json").read_text())
ASSETS={e["file"]:e for e in MANIFEST["assets"]}
ROUTES=["/newdesigns/river-voice/","/newdesigns/gathering-place/","/newdesigns/accountability-desk/",
"/newdesigns/northern-horizons/","/newdesigns/community-network/","/newdesigns/owls-lens/"]
mapping={320:"header-320.webp",390:"header-390.webp",500:"header-500.webp",
768:"header-768.webp",1024:"header-1024.webp"}
def get(path):
 req=urllib.request.Request(BASE+path,headers={"Cache-Control":"no-cache","User-Agent":"DeltaOwlEyes-StudioHeaderQA"})
 with urllib.request.urlopen(req,timeout=20) as r:return r.read()
for attempt in range(18 if PUBLIC else 1):
 try:
  text=get("/studio-sandbox/").decode("utf-8")
  if "reference-40.webp" in text and "header-320.webp" in text and "header-1024.webp" in text:break
 except Exception as e:print("Site fetch",attempt+1,str(e))
 if attempt+1<(18 if PUBLIC else 1):time.sleep(8)
else:raise RuntimeError("New six-breakpoint site HTML not yet served by "+BASE)
# Verify the exact original, the minimal-change reference and all six authored headers.
for name in [*mapping.values(),"header-1440.webp","reference-40.webp"]:
 data=get("/studio-sandbox/"+name)
 expected=ASSETS[name]["sha256"]
 assert hashlib.sha256(data).hexdigest()==expected, f"Image differs: {name}"
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in (320,390,500,768,1024,1440):
  ctx=browser.new_context(viewport={"width":width,"height":900},is_mobile=width<=390,has_touch=width<=768)
  page=ctx.new_page();errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  response=page.goto(URL,wait_until="networkidle",timeout=45000)
  desktop=width>=1280
  visible=page.locator(".hotspot" if desktop else ".family")
  hrefs=visible.evaluate_all("(els)=>els.map(el=>el.getAttribute('href'))")
  shown=visible.evaluate_all("(els)=>els.filter(e=>e.getClientRects().length>0).length")
  visible.first.focus()
  focused=visible.first.evaluate("(el)=>document.activeElement===el")
  overflow=page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
  if desktop:
   image=page.locator(".desktop-master>img")
   image_data=image.evaluate("(i)=>({width:i.naturalWidth,height:i.naturalHeight,loaded:i.complete,src:i.currentSrc})")
   header_ok=(image.count()==1 and "reference-40.webp" in image_data["src"] and
      image_data["width"]==1536 and image_data["height"]==1024 and image_data["loaded"])
  else:
   image=page.locator(".mobile-head picture img")
   image_data=image.evaluate("(i)=>({width:i.naturalWidth,height:i.naturalHeight,loaded:i.complete,src:i.currentSrc,rectWidth:i.getBoundingClientRect().width})")
   expected=mapping[width]
   header_ok=(expected in image_data["src"] and image_data["width"]==ASSETS[expected]["width"] and
    image_data["height"]==ASSETS[expected]["height"] and image_data["loaded"] and
    abs(image_data["rectWidth"] - (width-24 if width>600 else width-16))<4)
  no_extra_text=page.locator(".mobile-head h1, .mobile-head h2, .mobile-head .ribbon").count()==0
  privacy=page.locator("#doe-consent-banner").count()==1
  if privacy:page.locator("#doe-reject").click()
  consent=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
  page.reload(wait_until="networkidle")
  consent_kept=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'") and page.locator("#doe-consent-banner").count()==0
  page.screenshot(path=str(OUT/f"studio-{width}.png"),full_page=True,animations="disabled")
  statuses=[page.request.get(BASE+x,timeout=15000).status for x in ROUTES] if width==1440 else []
  row={"width":width,"url":URL,"http":response.status if response else None,"header":image_data,
   "header_ok":header_ok,"visible_options":shown,"links":hrefs,"keyboard_focus":focused,
   "overflow":overflow,"no_extra_mobile_heading":no_extra_text,"privacy":privacy,
   "rejected":consent,"persisted":consent_kept,"destination_statuses":statuses,"errors":errors}
  row["pass"]=bool(row["http"]==200 and header_ok and shown==6 and hrefs==ROUTES and
   focused and not overflow and no_extra_text and privacy and consent and consent_kept and not errors and
   all(x==200 for x in statuses))
  checks.append(row);ctx.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps({"target":BASE,"checks":checks},indent=2)+"\n")
print(json.dumps({"target":BASE,"passed":sum(x["pass"] for x in checks),"total":len(checks),
 "failures":[x for x in checks if not x["pass"]]},indent=2))
if not all(x["pass"] for x in checks):raise SystemExit(1)
