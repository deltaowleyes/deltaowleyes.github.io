#!/usr/bin/env python3
"""Validate the public Education data and minimum page integration."""
import json, re
from pathlib import Path
from urllib.parse import urlsplit
from datetime import date
root=Path(__file__).resolve().parents[1]
items=json.loads((root/"data/education-resources.json").read_text(encoding="utf-8"))
assert isinstance(items,list) and items,"Empty or invalid Education catalogue"
categories=set("schools courses land languages survivor-stories videos advocacy funding teaching".split())
formats={"online","hybrid","on-site"}
eligibility={"indigenous-only","open","check-provider"}
ids=set(); pairs=set(); urls=set()
for item in items:
  assert isinstance(item,dict)
  fields=["id","title","provider","description","category","format","eligibility","price","url","source_url","region","notice","last_source_review","verification"]
  assert all(isinstance(item.get(k),str) and item[k].strip() for k in fields),item.get("id")
  ident=item["id"]
  assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*",ident) and ident not in ids,ident
  ids.add(ident)
  assert item["category"] in categories and item["format"] in formats and item["eligibility"] in eligibility,ident
  assert item["verification"] == "provider_source_reviewed",ident
  assert date.fromisoformat(item["last_source_review"]) <= date.today(),ident
  pair=(item["provider"].casefold(),item["title"].casefold())
  assert pair not in pairs,ident
  pairs.add(pair)
  for key in ("url","source_url"):
    u=urlsplit(item[key]);assert u.scheme=="https" and u.netloc and not u.username and not u.password and not u.fragment,ident
  url=item["url"].lower().rstrip("/")
  assert url not in urls,ident
  urls.add(url)
suppressed=json.loads((root/"data/education-suppressed.json").read_text(encoding="utf-8"))
assert isinstance(suppressed,list),"Bad suppression ledger"
removed_ids=set();removed_urls=set()
for record in suppressed:
  assert isinstance(record,dict)
  for k in ("id","url","reason","removed_on"):
    assert isinstance(record.get(k),str) and record[k].strip(),record
  assert date.fromisoformat(record["removed_on"]) <= date.today(),record
  assert record["id"] not in removed_ids
  assert record["url"].lower().rstrip("/") not in removed_urls
  removed_ids.add(record["id"]);removed_urls.add(record["url"].lower().rstrip("/"))
assert not (removed_ids & ids),"Suppressed resource id reintroduced"
assert not (removed_urls & urls),"Suppressed resource URL reintroduced"
page=(root/"education/index.html").read_text(encoding="utf-8")
home=(root/"index.html").read_text(encoding="utf-8")
sitemap=(root/"sitemap.xml").read_text(encoding="utf-8")
assert '<link rel="canonical" href="https://deltaowleyes.ca/education/">' in page
for element in ('id="search"','id="topic"','id="eligibility"','id="format"','id="list"','/data/education-resources.json'):
  assert element in page,element
assert "innerHTML" not in page and '<iframe' not in page
assert 'href="/education/"' in home
assert "https://deltaowleyes.ca/education/" in sitemap
print(f"PASS: {len(items)} source-linked learning listings, valid IDs and schema, homepage, filters and sitemap")
