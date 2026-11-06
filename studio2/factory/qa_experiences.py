#!/usr/bin/env python3
"""Studio 3.4 per-family interaction acceptance on generated, unpublished sites."""
import json,os,pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
DATA=json.loads((ROOT/"studio2/factory/multipage-content.json").read_text())
OUT=ROOT/"artifacts/studio3-experiences";OUT.mkdir(parents=True,exist_ok=True)
CASES={
 ("river-voice","report"):"editorial-guide",
 ("river-voice","community"):"editorial-guide",
 ("accountability-ledger","report"):"docket",
 ("accountability-ledger","trc"):"docket",
 ("media-hub","media"):"media-browse",
 ("media-hub","report"):"media-browse",
}
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for site in DATA["designs"]:
  slug=site["id"]
  for route in DATA["routes"]:
   if (slug,route["slug"]) not in CASES and route["slug"]!="inquiry":continue
   for width in [390,1440]:
    context=browser.new_context(viewport={"width":width,"height":900},is_mobile=width==390,has_touch=width==390)
    page=context.new_page();errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    path=site["base"]+route["slug"]+"/"
    rec={"site":slug,"route":route["slug"],"width":width}
    try:
     response=page.goto(BASE+path,wait_until="networkidle",timeout=35000)
     rec["http"]=response.status if response else 0
     if page.locator("#doe-consent-banner").count():page.locator("#doe-reject").click()
     if route["slug"]=="inquiry":
      identity=page.locator(".design-identity")
      rec["identity"]=identity.count()==1 and slug in identity.inner_text()
      rec["draftOnly"]=("unsent email draft" in identity.inner_text().lower() and "mailto:info@deltaowleyes.ca" in page.content())
      page.locator("#visitor").fill("Test Person")
      page.locator("#email").fill("test@example.com")
      page.locator("#project").fill("A custom design inquiry")
      rec["formValid"]=page.locator("#design-inquiry").evaluate("(f)=>f.checkValidity()")
     else:
      mod=page.locator(".studio-experience")
      rec["singleModule"]=mod.count()==1 and CASES[(slug,route["slug"])] in (mod.get_attribute("class") or "")
      if slug=="river-voice" and route["slug"]=="report":
       links=mod.locator('a[href^="#section-"]')
       rec["functional"]=links.count()==3 and all(page.locator(l.get_attribute("href")).count()==1 for l in links.all())
      elif slug=="river-voice":
       links=mod.locator(".exp-tabs a")
       rec["functional"]=links.count()==3 and all(page.request.get(BASE+l.get_attribute("href")).status==200 for l in links.all())
      elif slug=="accountability-ledger":
       details=mod.locator("details")
       rec["functional"]=details.count()==3
       if rec["functional"]:
        trigger=details.first.locator("summary")
        trigger.focus();page.keyboard.press("Enter")
        rec["functional"]=details.first.get_attribute("open") is not None
        page.keyboard.press("Enter")
        rec["functional"]=rec["functional"] and details.first.get_attribute("open") is None
      else:
       links=mod.locator("a[href]")
       rec["functional"]=links.count()>=1 and all(page.request.get(BASE+l.get_attribute("href")).status==200 for l in links.all())
     rec["overflow"]=page.evaluate("document.documentElement.scrollWidth>innerWidth+1")
     page.screenshot(path=str(OUT/f"{slug}-{route['slug']}-{width}.png"),full_page=True,animations="disabled")
     rec["jsErrors"]=errors
     rec["pass"]=(rec["http"]==200 and not rec["overflow"] and not errors and
       (rec["identity"] and rec["draftOnly"] and rec["formValid"] if route["slug"]=="inquiry"
        else rec["singleModule"] and rec["functional"]))
    except Exception as exc:
     rec["error"]=str(exc);rec["pass"]=False
    results.append(rec);context.close()
 browser.close()
(OUT/"results.json").write_text(json.dumps(results,indent=2)+"\n")
failed=[r for r in results if not r["pass"]]
print(json.dumps({"checks":len(results),"passed":len(results)-len(failed),"failures":failed},indent=2))
if len(results)!=18 or failed:raise SystemExit(1)
