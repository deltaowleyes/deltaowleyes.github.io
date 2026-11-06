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
  # Privacy rejection must not depend on analytics being available.
  banner=page.locator("#doe-consent-banner")
  privacy_present=banner.count()==1
  if privacy_present:
   page.locator("#doe-reject").click()
  privacy_rejected=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
  privacy_hidden=page.locator("#doe-consent-banner").count()==0
  page.reload(wait_until="networkidle")
  privacy_persisted=page.locator("#doe-consent-banner").count()==0 and page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected'")
  analytics_not_loaded=page.evaluate("!window.__doeAnalyticsLoaded && ![...document.querySelectorAll('script[src]')].some(s=>s.src.includes('googletagmanager'))")
  # A loaded image may not yet be decoded/painted in long mobile screenshots.
  # Explicitly decode every image before the screenshot, then revisit the top.
  page.evaluate("""async () => {
    await Promise.all([...document.images].map(async img => {
      if (!img.complete) await new Promise(resolve => {
        img.addEventListener('load',resolve,{once:true});
        img.addEventListener('error',resolve,{once:true});
        setTimeout(resolve,12000);
      });
      if (img.naturalWidth && img.decode) await img.decode().catch(()=>{});
    }));
  }""")
  page.locator(".media-pic img").scroll_into_view_if_needed()
  page.wait_for_function("() => { const img=document.querySelector('.media-pic img'); return img && img.complete && img.naturalWidth>0; }",timeout=15000)
  page.evaluate("window.scrollTo(0,0)")
  page.wait_for_timeout(250)
  page.screenshot(path=str(out/f"river-voice-{w}.png"),full_page=True,animations="disabled")
  info=page.evaluate("""() => ({
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
    mainHeading:document.querySelectorAll('main h1').length,
    missingNames:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length,
    links:[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)===i),
    navigation:!!document.querySelector('nav[aria-label="Primary navigation"]'),
    mediaPosterVisible:(() => { const im=document.querySelector(".media-pic img");const box=im?.getBoundingClientRect();return !!(im&&im.complete&&im.naturalWidth>0&&box?.width>100&&box?.height>100&&getComputedStyle(im).visibility==="visible") })(),
    mediaPosterText:!!document.querySelector(".media-poster-copy strong"),
    backgroundImageLoaded:!!getComputedStyle(document.querySelector(".hero"),"::before").backgroundImage.match(/wetlands/),
    missingImageAlt:[...document.querySelectorAll("img")].filter(i=>!i.hasAttribute("alt")).length
  })""")
  if w<=820:
   menu=page.locator(".mobile-menu summary");menu.click()
   info["menuOpened"]=page.locator(".mobile-menu").get_attribute("open") is not None
  else:info["menuOpened"]=True
  info.update({"privacy_present":privacy_present,"privacy_rejected":privacy_rejected,"privacy_hidden":privacy_hidden,"privacy_persisted":privacy_persisted,"analytics_not_loaded":analytics_not_loaded})
  info["width"]=w;info["http"]=response.status if response else 0;info["errors"]=errors
  info["pass"]=response is not None and response.status==200 and not info["overflow"] and not info["brokenImages"] and info["mainHeading"]==1 and info["missingNames"]==0 and not errors and info["navigation"] and info["menuOpened"] and info["mediaPosterVisible"] and info["mediaPosterText"] and info["backgroundImageLoaded"] and info["missingImageAlt"]==0 and all((privacy_present,privacy_rejected,privacy_hidden,privacy_persisted,analytics_not_loaded))
  checks.append(info)
  page.close()
 browser.close()
(out/"results.json").write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
if not all(x["pass"] for x in checks):raise SystemExit(1)
