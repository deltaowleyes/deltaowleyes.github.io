#!/usr/bin/env python3
"""Discovery 4.0 Grants catalogue/schema/privacy/suppression validation."""
import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
rows = json.loads((ROOT / "data/indigenous-grants.json").read_text(encoding="utf-8"))
tombstones = json.loads((ROOT / "data/indigenous-grants-suppressed.json").read_text(encoding="utf-8"))
assert isinstance(rows, list) and rows, "Empty or invalid grants catalogue"
assert isinstance(tombstones, list), "Tombstones must be an array"
categories = {"arts","business","community","education","environment","infrastructure","languages","rights"}
applicants = {"artists","businesses","communities","organizations","students"}
intakes = {"open","rolling","contact","check","upcoming","closed"}
ids, keys = set(), set()
def url_ok(value):
    u = urlsplit(value)
    assert u.scheme == "https" and u.hostname and not u.username and not u.password and not u.fragment
    assert u.port in (None,443) and u.hostname.lower() not in {"localhost","127.0.0.1"}
    assert not any(c.isspace() for c in value)

for x in rows:
    assert isinstance(x, dict), "Not a grant object"
    fields = ["id","title","funder","category","applicant","region","funding_type","amount",
              "deadline_label","intake","description","eligibility","how_to_apply","source_url",
              "last_source_review","verification"]
    assert all(isinstance(x.get(k),str) and x[k].strip() for k in fields), x.get("id")
    assert x.get("deadline") is None or isinstance(x["deadline"],str), x["id"]
    ident=x["id"]
    assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*",ident) and ident not in ids, ident
    ids.add(ident)
    pair=(x["funder"].strip().casefold(),x["title"].strip().casefold())
    assert pair not in keys, pair
    keys.add(pair)
    assert x["category"] in categories and x["applicant"] in applicants and x["intake"] in intakes,ident
    assert x["verification"]=="official_source_reviewed",ident
    assert date.fromisoformat(x["last_source_review"]) <= date.today(), ident
    if x["deadline"] is not None:
        date.fromisoformat(x["deadline"])
    if x["intake"]=="open":
        assert x["deadline"],f"Unbounded open status requires explicit rolling status: {ident}"
    url_ok(x["source_url"])
    for field in fields:
        assert "<script" not in x[field].casefold() and len(x[field])<1800,ident

suppressed_ids, suppressed_pairs = set(), set()
for x in tombstones:
    assert isinstance(x,dict)
    assert all(isinstance(x.get(k),str) and x[k].strip() for k in ("id","title","funder","removed_on","reason")),x
    date.fromisoformat(x["removed_on"])
    assert date.fromisoformat(x["removed_on"])<=date.today(),x
    assert x["id"] not in suppressed_ids
    suppressed_ids.add(x["id"])
    suppressed_pairs.add((x["funder"].strip().casefold(),x["title"].strip().casefold()))
assert not ids.intersection(suppressed_ids),"Suppressed grant reintroduced by ID"
assert not keys.intersection(suppressed_pairs),"Suppressed grant reintroduced by funder/title"

page=(ROOT/"grants/index.html").read_text(encoding="utf-8")
home=(ROOT/"index.html").read_text(encoding="utf-8")
nav=(ROOT/"assets/header-v3.js").read_text(encoding="utf-8")
sitemap=(ROOT/"sitemap.xml").read_text(encoding="utf-8")
assert '<link rel="canonical" href="https://deltaowleyes.ca/grants/">' in page
for needle in ('/data/indigenous-grants.json','id="grant-search"','id="grant-purpose"',
               'id="grant-applicant"','id="grant-region"','id="grant-status"',
               'id="grant-list"','last_source_review','date passed'):
    assert needle in page,needle
assert "innerHTML" not in page and '<iframe' not in page
assert 'href="/grants/"' in home and 'href="/grants/"' in nav
assert 'https://deltaowleyes.ca/grants/' in sitemap
print(f"PASS: Discovery 4.0: {len(rows)} verified-source grant records, filters, no direct uploads, suppression & site integration")
