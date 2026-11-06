#!/usr/bin/env python3
"""Browser acceptance for factory-built *unpublished* River Voice candidate."""
import json,os,pathlib,urllib.parse
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.environ.get("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
OUT=ROOT/"artifacts/studio3";OUT.mkdir(parents=True,exist_ok=True)
PATH="/studio2/river-voice/factory-preview/"
manifest=json.loads((ROOT/"studio2/river-voice/factory-preview/asset-manifest.json").read_text())
assert manifest["status"]=="generated_preview_not_deployed"
assert len(manifest["assets"])==3
assert all(i["source_sha256"] and i["output_sha256"] for i in manifest["assets"])
results=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  for width in (320,390,768,1440):
    page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,has_touch=width<=768,is_mobile=width<=390)
    errors=[];failed_requests=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.on("requestfailed",lambda r:failed_requests.append(str(r.url)))
    response=page.goto(BASE+PATH,wait_until="networkidle",timeout=45000)
    assert response and response.status==200, "candidate unavailable"
    banner=page.locator("#doe-consent-banner")
    assert banner.count()==1, "privacy banner missing"
    page.locator("#doe-reject").click()
    page.reload(wait_until="networkidle")
    assert page.locator("#doe-consent-banner").count()==0
    assert page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
    assert page.evaluate("!window.__doeAnalyticsLoaded && ![...document.querySelectorAll('script[src]')].some(s=>s.src.includes('googletagmanager'))")
    page.evaluate("""async()=>{await Promise.all([...document.images].map(async i=>{if(i.decode) await i.decode().catch(()=>{});}));}""")
    page.locator(".media-pic img").scroll_into_view_if_needed()
    page.locator(".trc-landscape img").scroll_into_view_if_needed()
    page.evaluate("window.scrollTo(0,0)")
    page.screenshot(path=str(OUT/f"river-factory-{width}.png"),full_page=True,animations="disabled")
    state=page.evaluate("""()=>({
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
      h1:document.querySelectorAll("main h1").length,
      imageAltMissing:[...document.images].filter(i=>!i.hasAttribute("alt")).length,
      bg:getComputedStyle(document.querySelector(".hero"),"::before").backgroundImage,
      missingLinkLabels:[...document.querySelectorAll("a")].filter(a=>!a.textContent.trim()&&!a.getAttribute("aria-label")).length,
      cssLogo:[...document.querySelectorAll(".identity img")].map(i=>i.currentSrc),
      docTitle:document.title
    })""")
    state["width"]=width;state["http"]=response.status
    state["menuOpened"]=True;state["menuEscape"]=True
    if width<=820:
      menu=page.locator(".mobile-menu summary")
      menu.tap() if width<=390 else menu.click()
      state["menuOpened"]=page.locator(".mobile-menu").get_attribute("open") is not None
      menu.focus();page.keyboard.press("Escape")
      state["menuEscape"]=page.locator(".mobile-menu").get_attribute("open") is None
    files={}
    for item in manifest["assets"]:
      url=BASE+PATH+"assets/"+item["output"].split("/")[-1]
      res=page.request.get(url)
      files[item["role"]]={"http":res.status,"content_type":res.headers.get("content-type",""),"bytes":len(res.body())}
    state["files"]=files;state["errors"]=errors;state["failedRequests"]=failed_requests
    state["sourceLinksValid"]=True
    if width==1440:
      links=page.locator("main a[href^='/']").evaluate_all("(els)=>Array.from(new Set(els.map(a=>a.getAttribute('href'))))")
      failures=[]
      for link in links:
        pathname=urllib.parse.urlsplit(link).path
        if pathname and page.request.get(BASE+pathname,timeout=10000).status>=400:failures.append(pathname)
      state["brokenLinks"]=failures
      state["sourceLinksValid"]=not failures
    state["pass"]=bool(not state["overflow"] and not state["brokenImages"] and
        not state["imageAltMissing"] and state["h1"]==1 and not state["missingLinkLabels"] and
        "factory-preview/assets/hero.webp" in state["bg"] and
        all(x["http"]==200 and "image/" in x["content_type"] and x["bytes"]>1000 for x in files.values()) and
        state["menuOpened"] and state["menuEscape"] and state["sourceLinksValid"] and not errors and not failed_requests)
    results.append(state);page.close()
  browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2))
print(json.dumps({"checks":len(results),"passed":sum(x["pass"] for x in results),
"failures":[x for x in results if not x["pass"]]},indent=2))
if not all(x["pass"] for x in results):raise SystemExit(1)
