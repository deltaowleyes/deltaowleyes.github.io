#!/usr/bin/env python3
"""Four responsive Chromium checks per 3 distinct working candidate front pages."""
import json,os,pathlib,urllib.parse
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.environ.get("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
OUT=ROOT/"artifacts/studio3-three";OUT.mkdir(parents=True,exist_ok=True)
SITES={
 "river-voice":"/studio2/river-voice/factory-preview/",
 "accountability-ledger":"/studio2/factory-previews/accountability-ledger/",
 "media-hub":"/studio2/factory-previews/media-hub/"
}
WIDTHS=(320,390,768,1440)
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for slug,path in SITES.items():
  for width in WIDTHS:
   page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,
      has_touch=width<=768,is_mobile=width<=390)
   errors=[];bad_requests=[]
   page.on("pageerror",lambda e:errors.append(str(e)))
   page.on("requestfailed",lambda r:bad_requests.append(str(r.url)))
   record={"site":slug,"width":width,"route":path}
   try:
    resp=page.goto(BASE+path,wait_until="networkidle",timeout=45000)
    record["status"]=resp.status if resp else None
    consent=page.locator("#doe-consent-banner")
    record["privacyBanner"]=consent.count()==1
    if record["privacyBanner"]:
     page.locator("#doe-reject").click()
     page.reload(wait_until="networkidle")
    record["privacyRejectPersists"]=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'") and page.locator("#doe-consent-banner").count()==0
    record["analyticsDisabled"]=page.evaluate("!window.__doeAnalyticsLoaded && ![...document.querySelectorAll('script[src]')].some(s=>s.src.includes('googletagmanager'))")
    page.evaluate("""async()=>{await Promise.all([...document.images].map(async i=>{if(i.decode) await i.decode().catch(()=>{})}));}""")
    # Ensure lower-page media has painted before capturing long mobile scroll screenshots.
    if page.locator(".media-pic img").count():page.locator(".media-pic img").scroll_into_view_if_needed()
    if page.locator(".video-strip img").count():page.locator(".video-strip img").scroll_into_view_if_needed()
    page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(180)
    page.screenshot(path=str(OUT/f"{slug}-{width}.png"),full_page=True,animations="disabled")
    record.update(page.evaluate("""()=>({
      noindex:!!document.querySelector('meta[name="robots"][content="noindex,nofollow"]'),
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      h1:document.querySelectorAll('main h1').length,
      brokenImgs:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
      missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,
      unlabeledLinks:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length,
      mainLinks:[...document.querySelectorAll('main a[href]')].length,
      cssMode:document.body.className
    })"""))
    record["navOpens"]=True;record["navEscapes"]=True
    if width<=820:
     if slug=="river-voice":
      trigger=page.locator(".mobile-menu summary")
      if width<=390:trigger.tap()
      else:trigger.click()
      record["navOpens"]=page.locator(".mobile-menu").get_attribute("open") is not None
      trigger.focus();page.keyboard.press("Escape")
      record["navEscapes"]=page.locator(".mobile-menu").get_attribute("open") is None
     else:
      trigger=page.locator(".nav-toggle")
      if width<=390:trigger.tap()
      else:trigger.click()
      record["navOpens"]=trigger.get_attribute("aria-expanded")=="true" and page.locator(".nav-links").is_visible()
      page.keyboard.press("Escape")
      record["navEscapes"]=trigger.get_attribute("aria-expanded")=="false"
    record["brokenInternalRoutes"]=[]
    if width==1440:
     links=page.locator('main a[href^="/"]').evaluate_all('(es)=>[...new Set(es.map(a=>a.getAttribute("href")))]')
     for link in links:
      route=urllib.parse.urlsplit(link).path
      if page.request.get(BASE+route,timeout=10000).status>=400:record["brokenInternalRoutes"].append(route)
    manifest=None
    if slug!="river-voice":
     manifest=json.loads((ROOT/"studio2/factory-previews"/slug/"asset-manifest.json").read_text())
     record["optimizedAssets"]=[]
     for a in manifest["assets"]:
      res=page.request.get(BASE+path+a["output"])
      record["optimizedAssets"].append({"role":a["role"],"status":res.status,"bytes":len(res.body()),"contentType":res.headers.get("content-type","")})
    else:
     record["optimizedAssets"]=[]
     for name in ("hero.webp","trc-landscape.webp","owl-logo.webp"):
      res=page.request.get(BASE+path+"assets/"+name)
      record["optimizedAssets"].append({"role":name,"status":res.status,"bytes":len(res.body()),"contentType":res.headers.get("content-type","")})
    record["errors"]=errors;record["badRequests"]=bad_requests
    record["pass"]=bool(record["status"]==200 and record["noindex"] and not record["overflow"] and
        record["h1"]==1 and not record["brokenImgs"] and record["missingAlt"]==0 and
        record["unlabeledLinks"]==0 and record["mainLinks"]>=2 and record["privacyBanner"] and
        record["privacyRejectPersists"] and record["analyticsDisabled"] and
        record["navOpens"] and record["navEscapes"] and not record["brokenInternalRoutes"] and
        not errors and not bad_requests and
        all(a["status"]==200 and "image/" in a["contentType"] and a["bytes"]>1000 for a in record["optimizedAssets"]))
   except Exception as e:
    record["error"]=str(e);record["pass"]=False
   finally:
    checks.append(record);page.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(checks,indent=2)+"\n")
print(json.dumps({"checks":len(checks),"passed":sum(c["pass"] for c in checks),
"failed":[c for c in checks if not c["pass"]]},indent=2))
if len(checks)!=12 or not all(c["pass"] for c in checks):raise SystemExit(1)
