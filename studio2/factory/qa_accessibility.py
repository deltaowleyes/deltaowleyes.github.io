#!/usr/bin/env python3
"""Non-publishing WCAG-oriented smoke checks for 3 x 5 candidate content routes.
These are measurable browser checks, not a claim of full WCAG compliance.
"""
import json,os,pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE=os.getenv("STUDIO_BASE","http://127.0.0.1:8765").rstrip("/")
SPEC=json.loads((ROOT/"studio2/factory/multipage-content.json").read_text())
OUT=ROOT/"artifacts/studio3-a11y";OUT.mkdir(parents=True,exist_ok=True)
records=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    for site in SPEC["designs"]:
        for route in SPEC["routes"]:
            path=site["base"]+route["slug"]+"/"
            context=browser.new_context(viewport={"width":390,"height":844},reduced_motion="reduce",has_touch=True,is_mobile=True)
            page=context.new_page()
            record={"site":site["id"],"route":route["slug"],"path":path}
            try:
                r=page.goto(BASE+path,wait_until="networkidle",timeout=30000)
                record["http"]=r.status if r else 0
                # When consent is rejected, analytics must stay off and be persisted.
                if page.locator("#doe-consent-banner").count():page.locator("#doe-reject").click()
                page.reload(wait_until="networkidle")
                record["consentPersisted"]=page.evaluate("localStorage.getItem('doe-analytics-consent-v1')==='rejected' && !window.__doeAnalyticsLoaded")
                record.update(page.evaluate("""() => {
                  const rgb = c => {
                    let m=(c||'').match(/^rgba?[(]([0-9]+),[ ]*([0-9]+),[ ]*([0-9]+)/);
                    return m ? [Number(m[1]),Number(m[2]),Number(m[3])] : null;
                  };
                  const lum = c => {
                    const cc=rgb(c); if(!cc)return null;
                    const t=cc.map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
                    return .2126*t[0]+.7152*t[1]+.0722*t[2];
                  };
                  const contrast=(a,b) => {
                    const x=lum(a),y=lum(b);
                    return x===null||y===null?null:(Math.max(x,y)+.05)/(Math.min(x,y)+.05);
                  };
                  const body=getComputedStyle(document.body);
                  const header=getComputedStyle(document.querySelector('header'));
                  const src=document.querySelector('a.source');
                  const srcStyle=src?getComputedStyle(src):null;
                  const form=document.querySelector('form');
                  const brokenLabels=form ? [...form.querySelectorAll('input,textarea')].filter(el=>!el.labels||!el.labels.length).map(el=>el.id):[];
                  const nav=document.querySelector('header nav');
                  const current=[...nav.querySelectorAll('a[aria-current="page"]')];
                  const errors=[];
                  if(!document.querySelector('main#main'))errors.push('missing-main-landmark');
                  if(!document.querySelector('a.skip[href="#main"]'))errors.push('missing-skip-link');
                  if(document.querySelectorAll('main h1').length!==1)errors.push('main-heading-count');
                  if(current.length!==1)errors.push('current-navigation-item');
                  if([...document.querySelectorAll('img')].some(i=>!i.hasAttribute('alt')))errors.push('image-without-alt');
                  if(brokenLabels.length)errors.push('form-input-label');
                  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches &&
                     getComputedStyle(document.documentElement).scrollBehavior==='smooth')errors.push('reduced-motion-scroll');
                  return {
                    documentLandmarkErrors:errors,
                    bodyContrast:contrast(body.color,body.backgroundColor),
                    headerContrast:contrast(header.color,header.backgroundColor),
                    sourceContrast:srcStyle?contrast(srcStyle.color,srcStyle.backgroundColor):null,
                    keyboardMenuPresent:!!document.querySelector('.menu-disclosure summary'),
                    formLabelsValid:brokenLabels.length===0,
                    reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                    targetSize: (() => {
                      const s=document.querySelector('.menu-disclosure summary').getBoundingClientRect();
                      return {width:Math.round(s.width),height:Math.round(s.height)};
                    })()
                  };
                }"""))
                # Check keyboard opening/closing, not just pointer interaction.
                summary=page.locator(".menu-disclosure summary")
                summary.focus()
                page.keyboard.press("Enter")
                record["keyboardOpen"]=page.locator(".menu-disclosure").get_attribute("open") is not None
                page.keyboard.press("Escape")
                record["keyboardClosed"]=page.locator(".menu-disclosure").get_attribute("open") is None
                record["keyboardFocusRestored"]=summary.evaluate("(e)=>document.activeElement===e")
                # Native contrast estimates exclude background images and translucent overlays;
                # independently review composites with an actual contrast tool.
                record["pass"]=bool(
                    record["http"]==200 and record["consentPersisted"] and
                    not record["documentLandmarkErrors"] and record["keyboardMenuPresent"] and
                    record["formLabelsValid"] and record["reducedMotion"] and
                    record["targetSize"]["height"]>=44 and
                    record["bodyContrast"] is not None and record["bodyContrast"]>=4.5 and
                    record["sourceContrast"] is not None and record["sourceContrast"]>=4.5 and
                    record["keyboardOpen"] and record["keyboardClosed"] and record["keyboardFocusRestored"]
                )
            except Exception as e:
                record["error"]=str(e);record["pass"]=False
            records.append(record)
            context.close()
    browser.close()
(OUT/"results.json").write_text(json.dumps(records,indent=2)+"\n")
fails=[x for x in records if not x["pass"]]
print(json.dumps({"checks":len(records),"passed":len(records)-len(fails),"failures":fails[:10]},indent=2))
if fails or len(records)!=15:raise SystemExit(1)
