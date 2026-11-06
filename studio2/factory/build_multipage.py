#!/usr/bin/env python3
"""Generate three independent five-route content suites from verified content specs.
No publish, merge, payment, API calls, invented reporting or automatic email transmission.
"""
from __future__ import annotations
import html,json,pathlib,re,subprocess,sys,time
from urllib.parse import quote
ROOT=pathlib.Path(__file__).resolve().parents[2]
CFG=ROOT/"studio2/factory/multipage-content.json"
TYPES={"river-voice":"river","accountability-ledger":"ledger","media-hub":"media"}
def esc(value):return html.escape(str(value),quote=True)
def attrs(a):return " ".join(f'{k}="{esc(v)}"' for k,v in a.items())
def styles(theme):
 common="""*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font:16px/1.65 system-ui,sans-serif}a{color:inherit}a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #dfb36f;outline-offset:4px}.skip{position:absolute;left:-100vw;top:0;background:white;color:black;padding:12px;z-index:99}.skip:focus{left:12px}.wrap{width:min(1160px,calc(100% - 40px));margin:auto}header nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap}header nav a{text-decoration:none;padding:8px 9px;min-height:44px;display:inline-flex;align-items:center}header nav a[aria-current=page]{text-decoration:underline;text-underline-offset:6px}.brand{font-size:1.2rem;font-weight:900;text-decoration:none}h1,h2{line-height:1.08}p{max-width:70ch}.kicker{text-transform:uppercase;font-size:.75rem;letter-spacing:.15em;font-weight:850}.lead{font-size:1.12rem}.article-grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(240px,.6fr);gap:52px}.source{font-weight:850;display:inline-block;padding:13px 18px;margin:16px 0;min-height:44px}.sections article{padding:22px 0;border-bottom:1px solid currentColor}.sections article p{margin:0}.sections h2{margin:0 0 10px}.side{padding:24px;align-self:start}.side a{display:block;margin:14px 0}.inquiry-form{display:grid;gap:14px;max-width:650px}.inquiry-form label{font-weight:750}.inquiry-form input,.inquiry-form textarea{display:block;width:100%;padding:13px;font:inherit;border:1px solid #8e9b9d;border-radius:0}.inquiry-form button{padding:13px 16px;font:inherit;font-weight:800;cursor:pointer;min-height:44px}.form-note{font-size:.87rem}footer{padding:40px 0;margin-top:60px}footer a{display:inline-block;margin-right:18px;min-height:44px}@media(max-width:750px){.article-grid{grid-template-columns:1fr;gap:20px}.wrap{width:min(100% - 30px,1160px)}header nav{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin}header nav a{white-space:nowrap}h1{overflow-wrap:break-word}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}"""
 if theme=="river":
  return common+"""body{background:#f7f0e4;color:#193336}header{background:#092b34;color:#f9e7be;border-bottom:5px solid #cca061}header .wrap{padding:24px 0}.top{background:#16454a;color:#f5dfaf;padding:7px 0;text-transform:uppercase;letter-spacing:.2em;font-size:.68rem}h1,h2,.brand{font-family:Georgia,serif}h1{font-size:clamp(2.5rem,6vw,5.6rem);max-width:850px;letter-spacing:-.05em}.hero{background:linear-gradient(95deg,#123b43,#28666b);color:#fff5de;padding:90px 0 65px}.hero .kicker{color:#e4bc79}.article-grid{padding-top:55px}.sections{border-top:5px solid #bf9461}.sections h2{font-size:1.75rem}.side{background:#e9dfca;border-top:4px solid #a97743}.source,.inquiry-form button{background:#8a2632;color:#fff}footer{background:#09262d;color:#fff0d8}"""
 if theme=="ledger":
  return common+"""body{background:#efede9;color:#1c1d20;font-family:Arial,sans-serif}header{background:#121719;color:#fff;border-bottom:7px solid #ab2636}header .wrap{padding:22px 0}h1,h2,.brand{font-family:Arial,sans-serif;letter-spacing:-.055em}h1{font-size:clamp(2.7rem,7vw,6.5rem);font-weight:950;text-transform:uppercase;max-width:980px}.hero{background:#151b20;color:white;padding:80px 0 60px;border-bottom:18px solid #af2937}.hero .kicker{color:#ff858c}.lead{max-width:630px}.article-grid{padding-top:50px}.sections{counter-reset:case}.sections article{display:grid;grid-template-columns:60px 1fr;gap:20px;border-top:3px solid #252b2d}.sections article:before{counter-increment:case;content:counter(case,decimal-leading-zero);font-size:2.2rem;font-weight:950;color:#a62531}.sections article>*{grid-column:2}.sections h2{font:900 1.85rem/1.08 Arial,sans-serif}.side{background:#b02c38;color:white}.source,.inquiry-form button{background:#a52632;color:white}footer{background:#14181b;color:white}"""
 return common+"""body{background:#101b29;color:#f0ede4}header{background:#070e19;color:#fff;border-bottom:3px solid #b7434d}header .wrap{padding:22px 0}h1,h2,.brand{font-family:Georgia,serif}h1{font-size:clamp(2.7rem,6.4vw,6rem);max-width:850px;letter-spacing:-.06em}.hero{background:radial-gradient(circle at 84% 10%,#96543f 0%,transparent 32%),linear-gradient(135deg,#192e3f,#070e1a);padding:90px 0 80px}.hero .kicker{color:#efb9a4}.hero h1{color:#ffe2be}.article-grid{padding-top:45px}.sections{display:grid;gap:16px}.sections article{padding:28px;background:#1a3242;border:1px solid #4b6979}.sections h2{font-size:1.9rem;color:#f9d4b9}.side{background:#e5d0aa;color:#0e1926}.source,.inquiry-form button{background:#b02d42;color:white}footer{background:#070c13;color:#dbe3e3}"""
def build_page(site,route,cfg):
 theme=site["theme"];base=site["base"];sid=site["id"]
 nav=[("Home",base)]+[(r["nav"],base+r["slug"]+"/") for r in cfg["routes"]]
 active=base+route["slug"]+"/"
 links="".join(f'<a href="{esc(url)}"'+(' aria-current="page"' if url==active else '')+f'>{esc(label)}</a>' for label,url in nav)
 sections="".join('<article><h2>'+esc(s["title"])+'</h2><p>'+esc(s["body"])+'</p>'+ (f'<p><a href="{esc(s["href"])}">{esc(s["link"])} ↗</a></p>' if "href" in s else "")+'</article>' for s in route["sections"])
 inquiries=""
 if route["slug"]=="inquiry":
  inquiries=f'''<form class="inquiry-form" id="design-inquiry">
<label for="visitor">Contact name<input id="visitor" name="visitor" autocomplete="name" required maxlength="100"></label>
<label for="email">Email address<input id="email" type="email" name="email" autocomplete="email" required maxlength="160"></label>
<label for="project">Project requirements<textarea id="project" name="project" rows="5" maxlength="4000" required></textarea></label>
<button type="submit">Open email draft</button>
<p class="form-note">This opens your email application with the design ID. You must review and send the draft yourself; this demo does not store or submit data.</p></form>
<script>
document.getElementById('design-inquiry').addEventListener('submit', function(e){{
 e.preventDefault();
 if(!this.reportValidity())return;
 const v=id=>document.getElementById(id).value.trim();
 const title='Delta Owl Eyes Design Inquiry — {sid}';
 const body='Design ID: {sid}\\nName: '+v('visitor')+'\\nEmail: '+v('email')+'\\nProject: '+v('project');
 const mailto='mailto:info@deltaowleyes.ca?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);
 window.location.href=mailto;
}});
</script>'''
 doc=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="description" content="Unpublished Delta Owl Eyes design prototype">
<title>{esc(route["title"])} | {esc(site["name"])} candidate</title>
<link rel="stylesheet" href="/assets/privacy-consent.css"><script defer src="/assets/privacy-consent.js"></script>
<style>{styles(theme)}</style></head>
<body class="{theme}"><a class="skip" href="#main">Skip to main content</a>
<div class="top"><div class="wrap">Delta Owl Eyes / {esc(site["name"])} · Unpublished candidate</div></div>
<header><div class="wrap"><a class="brand" href="{esc(base)}">Delta Owl Eyes</a><nav aria-label="Candidate site navigation">{links}</nav></div></header>
<main id="main"><section class="hero"><div class="wrap"><span class="kicker">{esc(route["eyebrow"])}</span>
<h1>{esc(route["title"])}</h1><p class="lead">{esc(route["summary"])}</p></div></section>
<div class="wrap article-grid"><div class="sections">{sections}<a class="source" href="{esc(route["source"])}">{esc(route["source_label"])} ↗</a>{inquiries}</div>
<aside class="side"><strong>Within this design</strong><p>Explore the other working views of this candidate.</p>
{''.join(f'<a href="{esc(url)}">{esc(label)} ↗</a>' for label,url in nav if url!=active)}
<p><small>Design demonstration. Conceptual artwork and reporting links are not evidence of unpublished stories.</small></p></aside></div></main>
<footer><div class="wrap">Hard Truths. Education. Accountability. <p><a href="{esc(base)}">Back to homepage</a><a href="/privacy/">Privacy</a><a href="/services/">Services</a></p></div></footer>
</body></html>'''
 return doc
def main():
 started=time.monotonic()
 cfg=json.loads(CFG.read_text())
 if cfg["schema_version"]!=1 or cfg["release"]!="unpublished-candidate-only":raise RuntimeError("Release guard")
 if len(cfg["designs"])!=3 or len(cfg["routes"])!=5:raise RuntimeError("Expected 3×5")
 summary=[]
 for site in cfg["designs"]:
  if site["id"] not in TYPES or TYPES[site["id"]]!=site["theme"]:raise RuntimeError("Unknown theme")
  path=ROOT/site["base"].lstrip("/")
  if not (path/"index.html").is_file():raise RuntimeError(f"Missing homepage: {path}")
  home=(path/"index.html").read_text()
  if '<meta name="robots" content="noindex,nofollow">' not in home:raise RuntimeError("Home noindex absent")
  # Make site-specific internal navigation visible on each homepage, replacing only generated files.
  menu='<nav class="studio-subnav" aria-label="Explore this design" style="background:#122e35;color:white;padding:15px;display:flex;gap:15px;flex-wrap:wrap;font:700 14px system-ui">'
  for route in cfg["routes"]:menu+=f'<a style="color:#f6deb0;padding:10px;min-height:44px" href="{esc(site["base"]+route["slug"]+"/")}">{esc(route["nav"])} ↗</a>'
  menu+='</nav>'
  if "</body>" not in home:raise RuntimeError("Missing body")
  if 'class="studio-subnav"' not in home:
   home=home.replace("</header>","</header>"+menu,1)
  (path/"index.html").write_text(home)
  for route in cfg["routes"]:
   folder=path/route["slug"];folder.mkdir(parents=True,exist_ok=True)
   (folder/"index.html").write_text(build_page(site,route,cfg))
  summary.append({"design":site["id"],"homepage":site["base"],"subpages":[site["base"]+r["slug"]+"/" for r in cfg["routes"]],"design_approval":False,"architecture":site["structure"]})
 result={"status":"15_generated_subpages_plus_3_existing_homepages","release":"unpublished","count":18,"elapsed_seconds":round(time.monotonic()-started,2),"designs":summary}
 (ROOT/"studio2/factory-previews/multipage-build-summary.json").write_text(json.dumps(result,indent=2)+"\n")
 print(json.dumps(result,indent=2))
if __name__=="__main__":
 main()
