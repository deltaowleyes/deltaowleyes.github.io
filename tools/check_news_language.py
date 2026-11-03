#!/usr/bin/env python3
"""Verify published News articles have reviewed Rez Slang 9.0 variants."""
import json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
html=(ROOT/"news/index.html").read_text(encoding="utf-8")
data=json.loads((ROOT/"news/rez-slang-9.json").read_text(encoding="utf-8"))
slugs=set(re.findall(r'href="/news/articles/([^/]+)/"',html))
variants=data.get("articles",{})
bad=[]
for slug in sorted(slugs):
    entry=variants.get(slug)
    if not entry or not entry.get("headline") or len(entry.get("sections",[]))<2:
        bad.append(slug)
    elif not all(isinstance(s.get("label"),str) and isinstance(s.get("text"),str) and len(s["text"])>40 for s in entry["sections"]):
        bad.append(slug+" (invalid content)")
if bad:
    print("Unreviewed/missing Rez Slang 9.0 stories:",", ".join(bad),file=sys.stderr)
    sys.exit(1)
if not slugs:
    sys.exit("No published articles found; refusing empty verification")
print("Verified",len(slugs),"published articles with complete Rez Slang 9.0 variants")
