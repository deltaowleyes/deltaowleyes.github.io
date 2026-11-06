#!/usr/bin/env python3
"""Momma Made BAKE EXPRESS canonical studio browser acceptance."""
import json,os,pathlib,urllib.parse
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765/mommamade/studio/")
WIDTHS=[320,390,500,768,1024,1440]
FAMILIES=["atelier-ledger","picnic-club","utility-index","garden-folio","pattern-studio","quiet-catalogue"]
m=json.loads((ROOT/"mommamade/studio/screenshot-manifest.json").read_text())
assert m.get("shell_contract")=="BAKE-EXPRESS-MASTER-1.0"
assert m["widths"]==WIDTHS and [f["slug"] for f in m["families"]]==FAMILIES
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in WIDTHS:
  page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,is_mobile=width<=500,has_touch=width<=500)
  errors=[];analytics=[]
  page.on("pageerror",lambda e:errors.append(str(e)))
  page.on("request",lambda r:analytics.append(r.url) if any(x in r.url for x in ("googletagmanager","google-analytics","doubleclick","facebook.com/tr/")) else None)
  r=page.goto(BASE,wait_until="networkidle",timeout=60000)
  assert r and r.status==200
  page.locator(".family").first.wait_for(timeout=15000)
  assert page.locator(".family").count()==6
  assert page.locator(".family-art .desktop").count()==6 and page.locator(".family-art .mobile").count()==6
  assert page.locator("iframe").count()==0 and page.locator("a[href*='/mommamade/v3/']").count()==0
  assert page.locator("h1").count()==1 and page.locator("img:not([alt])").count()==0
  image=page.locator(".site-header picture img")
  src=image.evaluate("(e)=>e.currentSrc")
  assert src.endswith(f"/studio-sandbox/header-slim-{width}.webp"),src
  assert image.evaluate("(e)=>e.naturalWidth")==width,(width,"header pixel width")
  assert image.evaluate("(e)=>e.parentNode.querySelectorAll('source').length")==5
  assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),width
  links=page.locator("a.family").evaluate_all("(nodes)=>nodes.map(n=>n.getAttribute('href'))")
  assert set(links)==set("/mommamade/studio/previews/"+slug+"/" for slug in FAMILIES)
  if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():page.locator("#doe-reject").first.click()
  assert not errors and not analytics,(errors,analytics)
  checks.append({"width":width,"header":src,"pass":True})
  page.close()
 for slug in FAMILIES:
  page=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
  response=page.goto(BASE+"previews/"+slug+"/",wait_until="networkidle",timeout=60000)
  assert response and response.status==200,slug
  page.locator(".shot").first.wait_for(timeout=15000)
  assert page.locator(".shot").count()==6 and page.locator("iframe").count()==0
  assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2")
  mail=urllib.parse.unquote(page.locator("#inquire").get_attribute("href"))
  assert mail.startswith("mailto:") and "MM-EX-0" in mail,slug
  assert page.locator("form").count()==0
  button=page.locator('.shot button[data-width="500"]')
  button.focus();page.keyboard.press("Enter")
  assert page.locator("#enlarge").evaluate("(x)=>x.open")
  assert page.locator("#bigshot").get_attribute("src").endswith("full-500.webp")
  page.keyboard.press("ArrowRight")
  assert page.locator("#bigshot").get_attribute("src").endswith("full-768.webp")
  page.keyboard.press("Escape")
  assert not page.locator("#enlarge").evaluate("(x)=>x.open")
  assert button.evaluate("(x)=>document.activeElement===x")
  for width in WIDTHS:
   shot=page.request.get(BASE+"previews/"+slug+"/full-"+str(width)+".webp",timeout=20000)
   assert shot.status==200,(slug,width)
   data=shot.body()
   assert len(data)>2000 and data[:4]==b"RIFF" and data[8:12]==b"WEBP"
  page.close()
 browser.close()
out=ROOT/"artifacts/mommamade-shared-studio";out.mkdir(parents=True,exist_ok=True)
(out/"results.json").write_text(json.dumps({"passed":True,"headers":checks,"designs":6,"screenshots":36},indent=2)+"\n")
print("PASS: identical six BAKE EXPRESS headers, six gallery routes, 36 real screenshots, keyboard/modal/privacy")
