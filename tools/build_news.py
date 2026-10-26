#!/usr/bin/env python3
"""Build an editorial news index from explicitly verified update records."""
import json, pathlib, html, datetime, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE=ROOT/"news"/"updates"
DEST=ROOT/"news"/"index.html"
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
    content='\n'.join(cards) if cards else '<p>No verified news updates published yet.</p>'
    page=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>News Updates | Delta Owl Eyes</title><style>body{{margin:0;background:#f5f0e6;color:#092729;font:17px/1.65 system-ui,sans-serif}}header,footer{{background:#071f22;color:white;padding:22px 5%}}header a,footer a{{color:white}}main{{max-width:920px;margin:auto;padding:40px 20px}}article{{background:white;border:1px solid #d4ded8;border-radius:12px;padding:24px;margin:24px 0}}.meta{{color:#476865;font-weight:700}}a{{color:#075c60}}</style></head><body><header><a href="/">Delta Owl Eyes</a> · <a href="/calls-to-action/">94 Calls to Action</a></header><main><h1>Verified News Updates</h1><p>New developments are published as separate, dated stories. Previously recorded reports remain part of the historical record.</p>{content}</main><footer>Hard Truths. Education. Accountability.</footer></body></html>"""
    DEST.parent.mkdir(parents=True,exist_ok=True)
    DEST.write_text(page,encoding="utf-8")
    print(f"Built {len(items)} verified update(s)")
if __name__=="__main__": main()
