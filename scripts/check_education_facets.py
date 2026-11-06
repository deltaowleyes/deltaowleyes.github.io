#!/usr/bin/env python3
"""Validate sparse provider-verified Education facets (never infer missing facts)."""
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]
catalogue=json.loads((ROOT/"data/education-resources.json").read_text(encoding="utf-8"))
facets=json.loads((ROOT/"data/education-verified-facets.json").read_text(encoding="utf-8"))
assert facets["version"]==1
assert isinstance(facets["records"],list) and facets["records"]
sources={x["id"]:x["source_url"] for x in catalogue}
allowed={"id","source_url","reviewed_on","community","learning_language","credential",
         "delivery_area","start_month","tuition_cad","tuition_note"}
seen=set()
for f in facets["records"]:
    assert isinstance(f,dict) and set(f).issubset(allowed) and {"id","source_url","reviewed_on"}.issubset(f),f
    assert f["id"] in sources and f["id"] not in seen, f["id"]
    seen.add(f["id"])
    assert f["source_url"]==sources[f["id"]],f["id"]
    u=urlsplit(f["source_url"])
    assert u.scheme=="https" and u.hostname and not u.username and not u.password
    reviewed=date.fromisoformat(f["reviewed_on"])
    assert reviewed<=date.today(),f["id"]
    assert any(k in f for k in ("community","learning_language","credential",
                                "delivery_area","start_month","tuition_cad")),f["id"]
    for key in ("community","learning_language","credential","delivery_area","tuition_note"):
        if key in f:
            assert isinstance(f[key],str) and 1<=len(f[key].strip())<=160 and not any(ord(x)<32 for x in f[key]),f["id"]
    if "start_month" in f:
        assert isinstance(f["start_month"],str) and len(f["start_month"])==7 and f["start_month"][4]=="-"
        assert 1<=int(f["start_month"][5:])<=12
        assert 2020<=int(f["start_month"][:4])<=2100
    if "tuition_cad" in f:
        assert isinstance(f["tuition_cad"],(int,float)) and not isinstance(f["tuition_cad"],bool) and 0<=f["tuition_cad"]<=200000
        assert "tuition_note" in f
assert "wifn-anishinaabemowin-immersion" in seen
assert "fanshawe-oneida-advanced-diploma" in seen
assert "aei-pre-health-sciences" in seen
assert "uofa-indigenous-canada" in seen
manual=json.loads((ROOT/"data/education-link-corroboration.json").read_text(encoding="utf-8"))
assert manual["version"]==1
review_ids=set()
for item in manual["records"]:
    assert set(item)=={"id","source_url","reviewed_on","finding","review_method","expires_on"}
    assert item["id"] in sources and item["id"] not in review_ids
    assert item["source_url"]==sources[item["id"]]
    assert item["review_method"]=="independent_original_provider_page_review"
    assert date.fromisoformat(item["reviewed_on"])<=date.today()<=date.fromisoformat(item["expires_on"])
    assert 20<=len(item["finding"])<=300
    review_ids.add(item["id"])
page=(ROOT/"education/index.html").read_text(encoding="utf-8")
for expected in ('education-verified-facets.json','id="learning-language"','id="community"'):
    assert expected in page,expected
assert "innerHTML" not in page
print(f"PASS: {len(seen)} provider-verified facets, {len(review_ids)} manual source corroborations, {len(catalogue)} catalogue records")
