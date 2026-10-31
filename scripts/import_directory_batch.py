#!/usr/bin/env python3
"""Append sourced unverified business records without replacing unrelated records."""
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "indigenous-businesses/businesses.json"
if len(sys.argv) != 2:
    sys.exit("Usage: import_directory_batch.py <batch.json>")
batch_path = ROOT / sys.argv[1]
if not batch_path.is_relative_to(ROOT / "indigenous-businesses/imports"):
    sys.exit("Refusing import outside business imports directory")
old = json.loads(TARGET.read_text(encoding="utf-8"))
batch = json.loads(batch_path.read_text(encoding="utf-8"))
if not isinstance(old, list) or not isinstance(batch, list):
    sys.exit("Both business files must contain arrays")

def key(value):
    value = unicodedata.normalize("NFKD", str(value or "")).lower()
    value = "".join(c for c in value if not unicodedata.combining(c))
    value = value.replace("&", "and")
    value = re.sub(r"\\b(incorporated|inc|limited|ltd|corporation|corp|company|co|the|services|service|lp)\\b", "", value)
    return re.sub("[^a-z0-9]", "", value)

def strong_alias(a, b):
    if a == b:
        return True
    if min(len(a), len(b)) < 8:
        return False
    if (a in b or b in a) and min(len(a), len(b))/max(len(a), len(b)) >= 0.62:
        return True
    # Small edit distance allows punctuation and minor spelling variants.
    if min(len(a), len(b)) >= 9:
        rows = list(range(len(b)+1))
        for i, ca in enumerate(a, 1):
            prev = rows[0]
            rows[0] = i
            for j, cb in enumerate(b, 1):
                previous = rows[j]
                rows[j] = min(rows[j]+1, rows[j-1]+1, prev+(ca != cb))
                prev = previous
        return 1 - rows[-1]/max(len(a), len(b)) >= 0.91
    return False

known = [(key(r.get("name")), re.sub(r"\\D","",str(r.get("phone") or "")), r.get("source_id")) for r in old]
inserted = []
excluded = []
for record in batch:
    if not isinstance(record, dict) or not record.get("name"):
        sys.exit("Invalid business record")
    mandatory = ("source_id","source_url","ownership_source_url","on_reserve_location_source_url","ownership_evidence","on_reserve_location_evidence")
    if any(not record.get(f) for f in mandatory):
        sys.exit("Missing attribution or evidence for " + record["name"])
    if record.get("verification_status") != "unverified" or record.get("ownership_status") != "unverified" or record.get("on_reserve_location_status") != "unverified" or record.get("owner_confirmed") is not False:
        sys.exit("Unverified status violated for "+record["name"])
    if record.get("address") or record.get("postal_code"):
        sys.exit("Private location fields present for "+record["name"])
    n = key(record["name"])
    p = re.sub(r"\\D","",str(record.get("phone") or ""))
    match = next((k for k, kp, sid in known if strong_alias(n,k) or (p and len(p)>=10 and p==kp and n==k) or sid==record["source_id"]),None)
    if match:
        excluded.append(record["name"])
        continue
    old.append(record)
    inserted.append(record["name"])
    known.append((n,p,record["source_id"]))

assert len({r.get("source_id") for r in old if r.get("source_id")}) == sum(bool(r.get("source_id")) for r in old), "Duplicate source ID"
TARGET.write_text(json.dumps(old, ensure_ascii=False, separators=(",", ":"))+"\\n", encoding="utf-8")
print(json.dumps({"base_plus_import_total":len(old),"inserted_count":len(inserted),"inserted_names":inserted,"excluded_alias_or_id":excluded}))
