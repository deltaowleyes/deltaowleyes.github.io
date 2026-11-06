#!/usr/bin/env python3
"""Momma Made screenshot-only review studio, using existing unapproved V3 candidates.
Captures original site layouts in Chromium; does not ship those layouts as gallery source.
Run with a local static server at port 8765. No external API, purchases or uploads.
"""
from __future__ import annotations
import hashlib
import html
import io
import json
import pathlib
from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "mommamade" / "studio"
POLISH = OUT / "polish.css"
assert POLISH.exists(), "Capture-only polish.css missing"
BASE = "http://127.0.0.1:8765"
WIDTHS = [320, 390, 500, 768, 1024, 1440]
FAMILIES = [
    (1, "atelier-ledger", "Atelier Ledger", "Editorial craft", "A considered kitchen, one useful piece at a time."),
    (2, "picnic-club", "Picnic Club", "Playful & vibrant", "Pack a little more joy."),
    (3, "utility-index", "Utility Index", "Functional catalogue", "Everyday goods, well organized."),
    (4, "garden-folio", "Garden Folio", "Botanical & refined", "The gentle art of keeping things."),
    (5, "pattern-studio", "Pattern Studio", "Graphic & expressive", "Colour the everyday."),
    (9, "quiet-catalogue", "Quiet Catalogue", "Modern minimal", "Useful, thoughtfully chosen."),
]
STYLE = """
:root{--ink:#24382e;--paper:#faf6ed;--cream:#fffdf8;--sage:#748874;--rust:#9c5040;--line:#d5d2c5}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--paper);font:16px/1.55 system-ui,-apple-system,'Segoe UI',sans-serif}
a{color:inherit}button{font:inherit}a:focus-visible,button:focus-visible{outline:3px solid #a34b42;outline-offset:3px}
.skip{position:absolute;top:-100px;left:8px;padding:11px;background:#fff;z-index:10}.skip:focus{top:8px}
.top{background:#283f37;color:#fff6e7;min-height:46px;padding:10px max(18px,calc((100vw - 1340px)/2));display:flex;justify-content:space-between;gap:15px;align-items:center;font-size:.77rem;letter-spacing:.08em}
.top a{text-decoration:underline;text-underline-offset:4px}.top span{font-weight:700}
.eyebrow{font:800 .72rem/1.5 system-ui,sans-serif;letter-spacing:.19em;text-transform:uppercase;color:#85594a}
.brand{font:700 clamp(2rem,4vw,3.3rem)/1 Georgia,serif;letter-spacing:-.06em}.brand i{font-weight:400}
.hero{background:linear-gradient(115deg,#f9ecd9,#e6ebe1);border-bottom:1px solid #c1c7b9;overflow:hidden}
.hero-inner{max-width:1460px;margin:auto;display:grid;grid-template-columns:1.05fr .95fr;min-height:425px;align-items:stretch}
.hero-copy{padding:clamp(30px,5vw,83px);display:flex;flex-direction:column;justify-content:center}
.hero h1{font:400 clamp(2.6rem,5.7vw,5.55rem)/.99 Georgia,serif;letter-spacing:-.065em;margin:21px 0 17px}
.hero h1 em{color:#9a5e54}.hero p{max-width:610px;font-size:clamp(.96rem,1.45vw,1.15rem);line-height:1.7;margin:0 0 16px}
.hero-photo{min-height:330px;background:linear-gradient(90deg,#e0e7dd22,#3a452b0c),url('/mommamade/v2/images/hero-07.webp') center/cover}
.hero-photo span{display:block;margin:24px;background:#fdf9e8e8;max-width:max-content;padding:8px 14px;font-size:.7rem;letter-spacing:.15em;font-weight:800}
main{max-width:1460px;margin:auto;padding:clamp(18px,3.5vw,52px)}
.intro{display:flex;justify-content:space-between;gap:18px;align-items:end;margin:0 0 24px}
.intro h2{font:400 clamp(1.9rem,3.1vw,3rem)/1.07 Georgia,serif;letter-spacing:-.04em;margin:5px 0}
.intro p{max-width:410px;margin:0;color:#5d645c}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:21px}
.card{min-width:0;background:var(--cream);border:1px solid var(--line);border-radius:7px;overflow:hidden;box-shadow:0 12px 32px #283d2b13;transition:transform .18s,box-shadow .18s}
.card:hover,.card:focus-within{transform:translateY(-3px);box-shadow:0 18px 34px #283d2b24}
.card a{text-decoration:none;display:block;height:100%}
.card .image{height:clamp(175px,20vw,270px);background:#dfdcd3;overflow:hidden;position:relative;border-bottom:1px solid var(--line)}
.card .image img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.card .counter{position:absolute;top:14px;left:14px;background:#fff9e8eb;padding:5px 11px;font-weight:800;font-size:.72rem;letter-spacing:.13em}
.card-copy{padding:24px 23px 25px}.card-copy small{font-size:.72rem;font-weight:800;letter-spacing:.14em;color:#a45543;text-transform:uppercase}
.card-copy h3{font:400 clamp(1.52rem,2.1vw,2.15rem)/1.1 Georgia,serif;letter-spacing:-.04em;margin:8px 0 8px}
.card-copy p{color:#626a62;font-size:.91rem;margin:0 0 16px;min-height:42px}
.card-copy b{display:inline-block;color:#76503f;border-bottom:1px solid #76503f;padding-bottom:3px;font-size:.87rem}
.note{margin:25px 0 0;max-width:1000px;font-size:.81rem;color:#60675f}
.bottom{padding:28px 4%;background:#283f37;color:#f7f2e7;display:flex;justify-content:space-between;gap:17px;font-size:.8rem;flex-wrap:wrap}
.back{display:inline-flex;align-items:center;min-height:44px;padding:9px 14px;border:1px solid #647b6e;text-decoration:none;background:#fffdf5;border-radius:5px;font-weight:750}
.preview-head{margin:0 0 22px}.preview-head h1{font:400 clamp(2.5rem,5vw,4.8rem)/1 Georgia,serif;letter-spacing:-.06em;margin:17px 0 8px}
.preview-head p{color:#535f55;max-width:900px;margin:0}
.shots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.shot{min-width:0;border:1px solid #d0d1c6;background:#fffdf8;border-radius:7px;overflow:hidden;box-shadow:0 7px 19px #26352917}
.shot button{display:block;background:transparent;color:var(--ink);cursor:zoom-in;border:0;width:100%;padding:0;text-align:left}
.shot .crop{display:block;height:290px;overflow:hidden;background:#f0ebe3;border-bottom:1px solid #d7d1c4}
.shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.shot .shot-name{display:flex;justify-content:space-between;align-items:center;padding:13px 15px;font-weight:800;gap:10px}
.shot-name small{font-size:.75rem;color:#945f4a}
dialog{background:#fdfaf5;color:#24382e;border:2px solid #705f48;border-radius:6px;padding:9px;max-width:96vw;max-height:96vh;overflow:auto}
dialog::backdrop{background:#13211be0}
.dialog-toolbar{position:sticky;top:0;left:0;z-index:2;background:#fdfaf5;display:flex;align-items:center;justify-content:space-between;padding:4px 7px 11px;gap:14px}
.dialog-toolbar button{background:#283f37;color:#fff;padding:10px 17px;min-height:44px;border:0;border-radius:4px;cursor:pointer}
#full-image{display:block;width:auto;height:auto;max-width:none}
@media(max-width:980px){.cards,.shots{grid-template-columns:repeat(2,minmax(0,1fr))}.hero-inner{min-height:350px}.hero-photo{min-height:300px}}
@media(max-width:650px){.hero-inner{grid-template-columns:1fr}.hero-copy{padding:36px 22px 29px}.hero-photo{height:245px;min-height:245px}.intro{display:block}.cards,.shots{grid-template-columns:1fr}.card .image{height:265px}.top{padding:11px 14px;flex-wrap:wrap}.shot .crop{height:330px}main{padding:21px 14px}}
@media(prefers-reduced-motion:reduce){.card{transition:none}}
"""
STYLE += """
/* BAKE 1.1: screenshot-based desktop / phone comparisons and better gallery presentation. */
.hero-inner{min-height:455px}
.hero-photo{background-position:55% 50%;box-shadow:inset 30px 0 42px #334b2922}
.hero-photo span{background:#fff8eced;border:1px solid #eadac0;box-shadow:0 5px 15px #253b3020}
.hero-chips{display:flex;gap:8px;flex-wrap:wrap;margin:5px 0 14px}
.hero-chips span{font-size:.67rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;background:#fffaf4d9;border:1px solid #cfcbb9;padding:7px 10px}
.card .image{height:clamp(185px,21vw,285px);isolation:isolate}
.card .image img.desktop-shot{width:100%;height:100%;object-fit:cover;object-position:top}
.card .image img.mobile-shot{position:absolute;right:12px;bottom:-9px;width:25%;height:78%;object-fit:cover;object-position:top;border:5px solid #fffdf5;border-radius:12px 12px 0 0;box-shadow:0 0 0 1px #223b3166,-7px 7px 20px #172d2c7a;z-index:2}
.card .counter{z-index:3}
.card-copy h3{font-size:clamp(1.65rem,2.3vw,2.3rem)}
.comparison{background:#eeece5;border:1px solid #d0d2c7;border-radius:10px;overflow:hidden;padding:20px 18px 0;margin:23px 0 35px;display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,.24fr);gap:24px;align-items:end}
.comparison figure{margin:0;min-width:0;display:flex;flex-direction:column;gap:10px}
.comparison figcaption{font-size:.76rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#4d5b51}
.comparison .desktop-frame{height:310px;border:9px solid #334a3d;border-bottom-width:16px;border-radius:9px 9px 0 0;background:#fff;overflow:hidden;box-shadow:0 7px 20px #203b2d33}
.comparison .desktop-frame img,.comparison .phone-frame img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.comparison .phone-frame{max-width:216px;margin-inline:auto;height:331px;border:9px solid #334a3d;border-bottom:0;border-radius:24px 24px 0 0;background:#fff;overflow:hidden;box-shadow:0 7px 18px #203b2d3b}
.sizes-title{font:400 clamp(1.75rem,3vw,2.8rem)/1.1 Georgia,serif;letter-spacing:-.04em;margin:12px 0 19px}
@media(max-width:650px){.hero-inner{min-height:0}.card .image{height:260px}.comparison{padding:12px 9px 0;gap:11px;grid-template-columns:minmax(0,1fr) 94px}.comparison .desktop-frame{height:180px;border-width:5px;border-bottom-width:11px}.comparison .phone-frame{height:198px;border-width:5px;border-bottom:0;border-radius:14px 14px 0 0}.comparison figcaption{font-size:.61rem;letter-spacing:.02em}.hero-chips span{font-size:.62rem;padding:6px 8px}}
"""
JS = """(()=>{'use strict';const d=document.getElementById('zoom'),im=document.getElementById('full-image'),title=document.getElementById('zoom-title');let origin=null;document.querySelectorAll('[data-screenshot]').forEach(b=>b.addEventListener('click',()=>{origin=b;im.src=b.dataset.screenshot;im.alt=b.dataset.alt;im.style.width=b.dataset.width+'px';title.textContent=b.dataset.width+'px — entire page';d.showModal();}));document.getElementById('zoom-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('close',()=>{im.removeAttribute('src');origin?.focus()})})();"""
HEAD = '<a class="skip" href="#content">Skip to designs</a><header class="top"><span>DELTA OWL EYES · BAKE EXPRESS</span><span>V2 remains active · preview images only</span></header>'
def shell(title, body):
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#283f37">'
    '<link rel="stylesheet" href="/assets/privacy-consent.css"><script defer src="/assets/privacy-consent.js"></script>'
    '<title>'+html.escape(title)+'</title><style>'+STYLE+'</style></head><body>'+HEAD+body+
    '<footer class="bottom"><span>Momma Made · visual design study, not a functioning store</span><span>No live orders, invented prices, or unapproved product claims</span></footer></body></html>')
manifest={"status":"candidate-review-only","source":"V3-candidate-HTML-with-capture-only-studio-CSS","widths":WIDTHS,
          "note":"Screenshot-only concept refinements: CSS is injected only during browser capture and does not modify public V3 or current V2. Public V3 source remains accessible independently.", "capture_polish_sha256":hashlib.sha256(POLISH.read_bytes()).hexdigest(),"families":[]}
OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    for no,slug,name,mood,tagline in FAMILIES:
        folder=OUT/"previews"/slug
        folder.mkdir(parents=True,exist_ok=True)
        shots=[]
        for width in WIDTHS:
            page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,is_mobile=(width<=500),has_touch=(width<=500))
            errors=[]
            page.on("pageerror",lambda error:errors.append(str(error)))
            url=BASE+"/mommamade/v3/?template="+str(no)+"#home"
            response=page.goto(url,wait_until="networkidle",timeout=60000)
            assert response and response.status==200,(slug,width,"HTTP failed")
            if page.locator("#doe-reject").count() and page.locator("#doe-reject").first.is_visible():
                page.locator("#doe-reject").first.click()
            page.add_style_tag(path=str(POLISH))
            page.evaluate("""async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0)}""")
            page.wait_for_timeout(110)
            assert page.locator(".site").count()==1,(slug,width,"candidate didn't render")
            assert not page.evaluate("document.documentElement.scrollWidth>window.innerWidth+2"),(slug,width,"horizontal overflow")
            assert not errors,(slug,width,errors)
            screenshot=page.screenshot(full_page=True,animations="disabled",timeout=60000)
            im=Image.open(io.BytesIO(screenshot)).convert("RGB")
            assert im.width==width,(slug,width,im.size)
            path=folder/f"full-{width}.webp"
            im.save(path,format="WEBP",quality=76,method=4)
            with Image.open(path) as check: check.load();assert check.size==im.size
            if width==1440:
                top=im.crop((0,0,1440,min(970,im.height)))
                thumb=ImageOps.fit(top,(740,500),method=Image.Resampling.LANCZOS,centering=(.5,0))
                thumb.save(folder/"thumbnail.webp",format="WEBP",quality=80,method=5)
            shots.append({"width":width,"height":im.height,"file":path.name,"bytes":path.stat().st_size,
                          "sha256":hashlib.sha256(path.read_bytes()).hexdigest(),"page_errors":errors})
            print("CAPTURE",slug,width,im.height,path.stat().st_size,flush=True)
            page.close()
        cards="".join('<article class="shot"><button type="button" data-screenshot="full-{w}.webp" data-width="{w}" data-alt="Full page Momma Made {n} screenshot at {w} pixels" aria-label="Enlarge {n} full-page screenshot at {w} pixels"><span class="crop"><img loading="lazy" src="full-{w}.webp" width="{w}" height="{h}" alt="{n} page as captured at {w} pixels"></span><span class="shot-name">{w}px viewport <small>View full page +</small></span></button></article>'.format(w=x["width"],n=html.escape(name),h=x["height"]) for x in shots)
        body='<main id="content"><a class="back" href="/mommamade/studio/">← All six designs</a><div class="preview-head"><span class="eyebrow">MOMMA MADE · '+html.escape(mood)+'</span><h1>'+html.escape(name)+'</h1><p>Six actual complete-page Chromium screenshots from one experimental Momma Made V3 concept. Select a viewport to open and scroll the entire image. These are static screenshots, not working source-code demos.</p></div><section class="shots" aria-label="Six screenshot sizes">'+cards+'</section><p class="note">Experimental design, not released. Mock products and photographs are illustrative; V2 remains the current version. Screenshots do not make publicly accessible source code impossible to copy.</p></main><dialog id="zoom" aria-label="Full-page screenshot viewer"><div class="dialog-toolbar"><b id="zoom-title">Full-page screenshot</b><button type="button" id="zoom-close">Close ×</button></div><img id="full-image" alt="Expanded screenshot"></dialog><script>'+JS+'</script>'
        comparison='<section class="comparison" aria-label="Desktop and mobile screenshot comparison"><figure><figcaption>Desktop · 1440px</figcaption><div class="desktop-frame"><img src="full-1440.webp" loading="lazy" width="1440" height="'+str(shots[-1]["height"])+'" alt="Desktop screenshot detail of '+html.escape(name)+'"></div></figure><figure><figcaption>Mobile · 390px</figcaption><div class="phone-frame"><img src="full-390.webp" loading="lazy" width="390" height="'+str(shots[1]["height"])+'" alt="Mobile screenshot detail of '+html.escape(name)+'"></div></figure></section><h2 class="sizes-title">Explore every viewport</h2>'
        body=body.replace('<section class="shots" aria-label="Six screenshot sizes">',comparison+'<section class="shots" aria-label="Six screenshot sizes">')
        (folder/"index.html").write_text(shell(name+" — Momma Made Studio",body),encoding="utf-8")
        manifest["families"].append({"template":no,"slug":slug,"title":name,"mood":mood,"tagline":tagline,"screenshots":shots})
    browser.close()
cards=[]
for i,f in enumerate(manifest["families"],1):
    slug,name=f["slug"],f["title"]
    cards.append('<article class="card"><a href="/mommamade/studio/previews/{slug}/" aria-label="View six complete-page screenshots of {name}"><div class="image"><img class="desktop-shot" loading="lazy" src="previews/{slug}/thumbnail.webp" width="740" height="500" alt="Actual desktop browser screenshot preview of {name}"><img class="mobile-shot" loading="lazy" src="previews/{slug}/full-390.webp" width="390" height="844" alt="" aria-hidden="true"><span class="counter">{no:02d} / 06</span></div><div class="card-copy"><small>{mood}</small><h3>{name}</h3><p>{tagline}</p><b>Explore six viewport previews ↗</b></div></a></article>'.format(slug=slug,name=html.escape(name),no=i,mood=html.escape(f["mood"]),tagline=html.escape(f["tagline"])))
landing='<section class="hero"><div class="hero-inner"><div class="hero-copy"><span class="eyebrow">MOMMA MADE · WEBSITE DESIGN STUDIO</span><h1>Handmade spirit.<br><em>Six fresh looks.</em></h1><p>Six carefully different directions for Momma Made’s reusable kitchen-goods website. Explore real browser captures, from pocket-sized mobile to wide desktop, before deciding what deserves to become the finished design.</p><div class="hero-chips" aria-label="Preview details"><span>Six design families</span><span>36 real screenshots</span><span>V2 unchanged</span></div><div class="brand">Momma <i>Made.</i></div></div><div class="hero-photo" role="img" aria-label="Original illustrated Momma Made kitchen textiles artwork"><span>THE EVERYDAY, MADE BEAUTIFUL</span></div></div></section><main id="content"><div class="intro"><div><span class="eyebrow">CURATED FIRST COLLECTION</span><h2>Find your direction.</h2></div><p>Choose a design to open six genuine, full-page screenshots at 320, 390, 500, 768, 1024 and 1440 pixels.</p></div><div class="cards">'+''.join(cards)+'</div><p class="note">Visual-only review of six existing V3 candidates, not six finalized stores. The remaining four V3 experiments are untouched. No online checkout or real customer data. Site code is deliberately not embedded in these preview galleries, but existing public candidate code is accessible elsewhere.</p></main>'
(OUT/"index.html").write_text(shell("Momma Made — BAKE EXPRESS Design Studio",landing),encoding="utf-8")
(OUT/"screenshot-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")
assert len(manifest["families"])==6 and all(len(x["screenshots"])==6 for x in manifest["families"])
print("MOMMA MADE STUDIO READY: six designs, 36 full-page viewport screenshots, screenshot-only pages",flush=True)
