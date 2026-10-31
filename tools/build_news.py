#!/usr/bin/env python3
"""Build an editorial news index from explicitly verified update records."""
import json, pathlib, html, datetime, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE=ROOT/"news"/"updates"
DEST=ROOT/"news"/"index.html"
QUEUE=ROOT/"news"/"scripts"/"index.html"
def esc(x): return html.escape(str(x),quote=True)
def main():
    items=[]
    for path in sorted(SOURCE.glob("*.json")):
        d=json.loads(path.read_text(encoding="utf-8"))
        required=("id","date","call_number","headline","summary","source_url","source_title","verification")
        missing=[k for k in required if not d.get(k)]
        if missing: raise ValueError(f"{path}: missing {missing}")
        if not isinstance(d["call_number"],int) or not 1<=d["call_number"]<=94: raise ValueError(f"{path}: invalid call number")
        datetime.date.fromisoformat(d["date"])
        u=urllib.parse.urlparse(d["source_url"])
        if u.scheme!="https" or not u.hostname: raise ValueError(f"{path}: invalid source URL")
        v=d["verification"]
        if not isinstance(v,dict) or not all(v.get(k) for k in ("verified_by","verified_at","source_supports_claim")) or v["source_supports_claim"] is not True:
            raise ValueError(f"{path}: incomplete verification record")
        datetime.date.fromisoformat(v["verified_at"])
        if d.get("status","approved")!="approved": continue
        if d.get("publication_status","unrecorded") not in ("unrecorded","published"):
            raise ValueError(f"{path}: invalid publication_status")
        if d.get("publication_status","unrecorded")=="published" and not d.get("video_url"):
            raise ValueError(f"{path}: published record must have video_url")
        items.append(d)
    items.sort(key=lambda x:(x["date"],x["id"]),reverse=True)
    cards=[]
    for d in items:
        video=d.get("video_url")
        video_link=""
        if video:
            parsed=urllib.parse.urlparse(video)
            if parsed.scheme!="https" or not parsed.hostname: raise ValueError(f"{d['id']}: invalid video URL")
            video_link=f'<p><a href="{esc(video)}">Watch published video</a></p>'
        cards.append(f'<article><p class="meta">{esc(d["date"])} · Call to Action #{d["call_number"]}</p><h2>{esc(d["headline"])}</h2><p>{esc(d["summary"])}</p><p><a href="{esc(d["source_url"])}">Source: {esc(d["source_title"])}</a></p>{video_link}</article>')
    queue_cards=[]
    for d in items:
        if d.get("publication_status","unrecorded")=="published" or not d.get("script"):
            continue
        script=d["script"]
        if not isinstance(script,str) or len(script.strip())<100:
            raise ValueError(f"{d['id']}: recording script too short")
        queue_cards.append(f'<article><p class="meta">{esc(d["date"])} · Call to Action #{d["call_number"]}</p><h2>{esc(d["headline"])}</h2><p style="white-space:pre-wrap">{esc(script)}</p></article>')
    queue_content='\n'.join(queue_cards) if queue_cards else '<p>No recording scripts currently awaiting publication.</p>'
    content='\n'.join(cards) if cards else '<p>No verified news updates published yet.</p>'
    shared_head="<style id=\"doe-shared-header\">.doe-header{background:#f1f6f3;color:#193a3a;padding:0 5%;font:600 15px/1.4 system-ui,sans-serif}.doe-nav{max-width:1280px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:13px 0}.doe-brand{display:inline-flex;align-items:center;gap:9px;color:#193a3a!important;text-decoration:none!important;white-space:nowrap;font-weight:800;letter-spacing:.04em}.doe-brand img{width:38px;height:38px;object-fit:contain}.doe-brand span{color:#986b27}.doe-links{display:flex;flex-wrap:wrap;gap:8px 18px}.doe-links a{color:#193a3a!important;text-decoration:none!important;font-weight:600}.doe-links a:hover,.doe-links a:focus-visible{text-decoration:underline!important}@media(max-width:700px){.doe-nav{justify-content:center}.doe-links{justify-content:center;font-size:13px;gap:10px 14px}}</style><style id=\"doe-header-uniform-20261028\">.doe-header{box-sizing:border-box!important;height:auto!important;min-height:82px!important;padding:0 5%!important}.doe-header .doe-nav{box-sizing:border-box!important;min-height:82px!important;padding:12px 0!important;gap:12px!important}.doe-header .doe-brand,.doe-header .doe-links a{line-height:1.35!important}.doe-header .doe-brand img{width:46px!important;height:46px!important}@media(max-width:700px){.doe-header{min-height:0!important}.doe-header .doe-nav{min-height:90px!important;padding:12px 0!important}}</style><link rel=\"stylesheet\" href=\"/assets/site-header.css?v=20261028d\">"
    shared_header="<header class=\"doe-header\"><nav class=\"doe-nav\" aria-label=\"Main navigation\"><a class=\"doe-brand\" href=\"/\"><img src=\"/assets/owl-logo.png\" alt=\"Delta Owl Eyes logo\">DELTA <span>OWL</span> EYES</a><div class=\"doe-links\"><a href=\"/#investigations\">Investigations</a><a href=\"/news/\">News Updates</a><a href=\"/calls-to-action/\">94 Calls to Action</a><a href=\"/indigenous-businesses/\">Indigenous Businesses</a><a href=\"/services/\">Services</a><a href=\"/#culture\">Culture</a><a href=\"/#about\">About</a></div></nav></header><div class=\"doe-tagline-bar\" aria-label=\"Delta Owl Eyes motto\">HARD TRUTHS. &nbsp; EDUCATION. &nbsp; ACCOUNTABILITY.</div>"
    page=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>News Updates | Delta Owl Eyes</title><style>body{{margin:0;background:#f5f0e6;color:#092729;font:17px/1.65 system-ui,sans-serif}}header,footer{{background:#071f22;color:white;padding:22px 5%}}header a,footer a{{color:white}}main{{max-width:920px;margin:auto;padding:40px 20px}}article{{background:white;border:1px solid #d4ded8;border-radius:12px;padding:24px;margin:24px 0}}.meta{{color:#476865;font-weight:700}}a{{color:#075c60}}</style>{shared_head}</head><body>{shared_header}<main><h1>Verified News Updates</h1><p>New developments are published as separate, dated stories. Previously recorded reports remain part of the historical record.</p>{content}</main><footer>© Delta Owl Eyes</footer></body></html>"""
    DEST.parent.mkdir(parents=True,exist_ok=True)
    # Never replace the manually curated newsroom with only the structured records.
    # The separately maintained public index includes all reviewed historical stories.
    if not DEST.exists():
        DEST.write_text(page,encoding="utf-8")
    else:
        print("Preserved existing curated news/index.html; did not overwrite public stories")
    queue_page=page.replace("<title>News Updates | Delta Owl Eyes</title>","<title>Recording Scripts | Delta Owl Eyes</title>").replace("<h1>Verified News Updates</h1>","<h1>Recording Scripts</h1>").replace("<p>New developments are published as separate, dated stories. Previously recorded reports remain part of the historical record.</p>","<p>Scripts awaiting recording. Once a video is published, its script leaves this queue; the published report remains in the news archive.</p>").replace(content,queue_content)
    QUEUE.parent.mkdir(parents=True,exist_ok=True)
    QUEUE.write_text(queue_page,encoding="utf-8")
    print(f"Built {len(items)} verified update(s) and {len(queue_cards)} recording script(s)")
if __name__=="__main__": main()
