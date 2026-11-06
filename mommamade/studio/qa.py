#!/usr/bin/env python3
"""Momma Made Studio screenshot-only accessibility, keyboard and privacy QA."""
import json,pathlib
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2]
m=json.loads((root/"mommamade/studio/screenshot-manifest.json").read_text())
widths=[320,390,500,768,1024,1440]
assert m["widths"]==widths and len(m["families"])==6
base="http://127.0.0.1:8765/mommamade/studio/"
report=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in widths:
  page=browser.new_page(viewport={"width":width,"height":900},is_mobile=width<=500,has_touch=width<=500)
  failures=[];trackers=[]
  page.on("pageerror",lambda e:failures.append(str(e)))
  page.on("request",lambda req:trackers.append(req.url) if any(s in req.url for s in ("google-analytics.com","googletagmanager.com","facebook.com/tr/","doubleclick.net")) else None)
  r=page.goto(base,wait_until="networkidle",timeout=60000)
  if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():page.locator("#doe-reject").first.click()
  assert r and r.status==200
  assert page.locator(".cards .card").count()==6
  assert page.locator(".card .mobile-shot").count()==6
  assert page.locator("a[href*='/mommamade/v3/']").count()==0
  assert page.locator("h1").count()==1 and page.locator("img:not([alt])").count()==0
  assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2")
  assert not failures and not trackers,(failures,trackers)
  report.append({"width":width,"gallery_ok":True,"privacy_trackers":len(trackers),"js_errors":failures})
  page.close()
 for f in m["families"]:
  page=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
  r=page.goto(base+"previews/"+f["slug"]+"/",wait_until="networkidle",timeout=60000)
  assert r and r.status==200
  assert page.locator(".comparison").count()==1
  assert page.locator(".shot button").count()==6
  assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2")
  assert page.locator("h1").count()==1 and page.locator("img:not([alt])").count()==0
  b=page.locator(".shot button").first;b.focus()
  page.keyboard.press("Enter")
  assert page.locator("dialog").evaluate("(d)=>d.open")
  page.keyboard.press("Escape")
  assert not page.locator("dialog").evaluate("(d)=>d.open")
  assert b.evaluate("(e)=>document.activeElement===e"),"Focus not restored"
  page.close()
 browser.close()
out=root/"artifacts/mommamade-studio-1-1";out.mkdir(parents=True,exist_ok=True)
(out/"qa.json").write_text(json.dumps({"checks":report,"six_gallery_routes":True,"keyboard_and_focus":True},indent=2)+"\n")
print("PASS Momma Made 1.1: six viewport widths, six preview pages, keyboard Enter/Escape, focus return, no horizontal overflow or analytics-before-consent")
