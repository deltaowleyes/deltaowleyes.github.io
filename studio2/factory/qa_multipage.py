#!/usr/bin/env python3
"""Test 3 distinct generated sites × 5 subroutes × 4 widths, plus homepage subnavigation.
Reject analytics persistence failure, broken links, and dead/mislabelled inquiry controls.
No external form send, writes, deployments or purchase operations.
"""
import json,os,pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
OUT=ROOT/"artifacts/studio3-multipage";OUT.mkdir(parents=True,exist_ok=True)
config=json.loads((ROOT/"studio2/factory/multipage-content.json").read_text())
routes=config["routes"];sites=config["designs"];widths=[320,390,768,1440]
records=[];paths=set()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for site in sites:
  base=site["base"]
  for route in routes:
   path=base+route["slug"]+"/"
   assert path not in paths;paths.add(path)
   for width in widths:
    context=browser.new_context(viewport={"width":width,"height":900},device_scale_factor=1,has_touch=width<=768,is_mobile=width<=390)
    page=context.new_page()
    errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
    record={"design":site["id"],"route":route["slug"],"viewport":width}
    try:
     resp=page.goto(BASE+path,wait_until="domcontentloaded",timeout=30000)
     record["http"]=resp.status if resp else 0
     page.wait_for_load_state("networkidle",timeout=12000)
     record["consentVisible"]=page.locator("#doe-consent-banner").count()==1
     if record["consentVisible"]:
      page.locator("#doe-reject").click()
      page.reload(wait_until="domcontentloaded")
     record["rejectPersists"]=page.evaluate("localStorage.getItem('doe-analytics-consent-v1') === 'rejected'") and page.locator("#doe-consent-banner").count()==0
     record["analyticsDisabled"]=page.evaluate("!window.__doeAnalyticsLoaded && ![...document.querySelectorAll('script[src]')].some(s=>s.src.includes('googletagmanager'))")
     properties=page.evaluate("""() => ({
       noindex:!!document.querySelector('meta[name="robots"][content="noindex,nofollow"]'),
       overflow:document.documentElement.scrollWidth>innerWidth+1,
       headings:document.querySelectorAll('main h1').length,
       sectionArticles:document.querySelectorAll('.sections article').length,
       navLinks:document.querySelectorAll('nav[aria-label="Candidate site navigation"] a').length,
       brokenImg:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
       missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,
       unnamedLinks:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length
     })""")
     record.update(properties)
     art=page.locator(".hero-art img")
     record["heroArt"]=art.count()==1
     if record["heroArt"]:
      art.scroll_into_view_if_needed()
      page.wait_for_function("() => {const i=document.querySelector('.hero-art img');return !!(i&&i.complete&&i.naturalWidth>0)}",timeout=12000)
      record["heroDecoded"]=art.evaluate("(i)=>i.complete && i.naturalWidth>0 && i.getBoundingClientRect().width>110")
     else:record["heroDecoded"]=False
     record["conceptCaption"]=page.locator(".hero-art figcaption").count()==1
     record["contentChecks"]=("Sheila Cote-Meek" in page.locator("main").inner_text() and "not allegations" in page.locator("main").inner_text().lower()) if route["slug"]=="report" else True
     record["navigationTimingMs"]=round(page.evaluate("performance.getEntriesByType('navigation')[0]?.duration || 0"))
     record["designNav"]=bool(page.locator("header nav a[aria-current=page]").count()==1)
     menu=page.locator(".menu-disclosure")
     record["navDisclosurePresent"]=menu.count()==1
     if width<=768:
      trigger=menu.locator("summary")
      if width<=390:trigger.tap()
      else:trigger.click()
      record["navOpens"]=menu.get_attribute("open") is not None and menu.locator("nav").is_visible()
      trigger.focus()
      page.keyboard.press("Escape")
      record["navEscape"]=menu.get_attribute("open") is None and trigger.evaluate("(e)=>document.activeElement===e")
     else:
      record["navOpens"]=menu.locator("nav").is_visible()
      record["navEscape"]=True
     record["heroHeadingPx"]=round(page.locator("main h1").evaluate("(e)=>parseFloat(getComputedStyle(e).fontSize)"),1)
     record["headlineInViewport"]=page.locator("main h1").evaluate("(e)=>{let r=e.getBoundingClientRect();return r.width>0 && r.left>=-1 && r.right<=innerWidth+1}")
     record["mobileHeadlineSized"]=width>600 or record["heroHeadingPx"]<=51

     if route["slug"]=="inquiry":
      record["formExists"]=bool(page.locator("form#design-inquiry").count()==1)
      page.locator("#visitor").fill("Test Visitor")
      page.locator("#email").fill("example@example.com")
      page.locator("#project").fill("Example project requirements")
      record["formValid"]=page.locator("#design-inquiry").evaluate("(f)=>f.checkValidity()")
      record["formHasDraftOnly"]=page.locator(".form-note").inner_text().find("does not store or submit")>=0
      record["noNetworkSubmit"]=page.locator("#design-inquiry").get_attribute("action") is None
     else:
      record["formExists"]=True;record["formValid"]=True
      record["formHasDraftOnly"]=True;record["noNetworkSubmit"]=True
     if width==1440:
      record["brokenCandidateLinks"]=[]
      links=page.locator('header nav a[href^="/studio2/"]').evaluate_all('(a)=>[...new Set(a.map(x=>x.getAttribute("href")))]')
      for link in links:
       res=page.request.get(BASE+link,timeout=10000)
       if res.status>=400:record["brokenCandidateLinks"].append(link)
     else:record["brokenCandidateLinks"]=[]
     page.evaluate('window.scrollTo(0,0)')
     page.screenshot(path=str(OUT/f"{site['id']}-{route['slug']}-{width}.png"),full_page=True,animations="disabled")
     record["jsErrors"]=errors
     record["pass"]=bool(record["http"]==200 and record["noindex"] and not record["overflow"] and
      record["headings"]==1 and record["sectionArticles"]>=2 and record["navLinks"]==6 and
      record["consentVisible"] and record["rejectPersists"] and record["analyticsDisabled"] and
      not record["brokenImg"] and record["missingAlt"]==0 and not record["unnamedLinks"] and
      record["designNav"] and record["navDisclosurePresent"] and record["navOpens"] and record["navEscape"] and record["headlineInViewport"] and record["mobileHeadlineSized"] and record["heroArt"] and record["heroDecoded"] and record["conceptCaption"] and record["contentChecks"] and record["formExists"] and record["formValid"] and
      record["formHasDraftOnly"] and record["noNetworkSubmit"] and not record["brokenCandidateLinks"] and not errors)
    except Exception as e:
     record["error"]=str(e);record["pass"]=False
    finally:
     records.append(record);context.close()
  home=browser.new_page()
  res=home.goto(BASE+base,wait_until="domcontentloaded")
  nav=home.locator("nav.studio-subnav a")
  record={"design":site["id"],"route":"home","viewport":1440,"http":res.status if res else 0,"navCount":nav.count()}
  record["pass"]=record["http"]==200 and record["navCount"]==5 and all(home.request.get(BASE+x.get_attribute("href")).status==200 for x in nav.all())
  records.append(record);home.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(records,indent=2)+"\n")
fail=[r for r in records if not r["pass"]]
print(json.dumps({"checks":len(records),"passed":len(records)-len(fail),"failed":fail[:12]},indent=2))
if fail or len(records)!=63:raise SystemExit(1)
