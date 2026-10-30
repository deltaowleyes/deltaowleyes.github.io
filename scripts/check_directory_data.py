#!/usr/bin/env python3
"""Read-only directory integrity audit. Never infer verification from a source."""
from pathlib import Path
from collections import Counter
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
FILES = (
 ("indigenous-businesses/businesses.json", "business"),
 ("indigenous-businesses/ontario-businesses.json", "business"),
 ("indigenous-businesses/federal-businesses.json", "business"),
 ("indigenous-churches/churches.json", "church"),
)
errors = []
for path, kind in FILES:
 try:
  records=json.loads((ROOT/path).read_text(encoding="utf-8"))
  if not isinstance(records,list) or not records:
   raise ValueError("Expected nonempty JSON array")
  if kind=="church":
   if len(records)<140: errors.append("Church migration dropped baseline records")
   ids=[(r.get("name"),r.get("province"),r.get("reserve")) for r in records if isinstance(r,dict)]
   duplicates=[k for k,v in Counter(ids).items() if v>1]
   if duplicates:errors.append(f"{path}: duplicate church identifiers: {duplicates[:3]}")
  for i,r in enumerate(records):
   if not isinstance(r,dict) or not isinstance(r.get("name"),str) or not r["name"].strip():
    errors.append(f"{path}[{i}]: missing name");continue
   status=r.get("verification_status","unverified")
   if status not in ("unverified","partially_verified","verified"):errors.append(f"{path}[{i}]: invalid status")
   if r.get("contact_status","not_contacted") not in ("not_contacted","attempted","follow_up","contacted"):
    errors.append(f"{path}[{i}]: invalid contact status")
   if status=="verified" and not(r.get("verified_date") and r.get("verification_method")):
    errors.append(f"{path}[{i}]: verified without date and method")
   flag="representative_confirmed" if kind=="church" else "owner_confirmed"
   if r.get(flag) is True and status!="verified":errors.append(f"{path}[{i}]: confirmation flag inconsistent with status")
   if kind=="church":
    for field in ("reserveLocated","indigenousLed"):
     if r.get(field) not in (None,True,False):errors.append(f"{path}[{i}]: invalid {field}")
  print(f"OK {path}: {len(records)} records")
 except (OSError,ValueError,TypeError,AttributeError) as exc:
  errors.append(f"{path}: {exc}")
page=(ROOT/"indigenous-churches/index.html").read_text(encoding="utf-8")
if "fetch('./churches.json'" not in page or "const churches=[" in page:
 errors.append("Church page has no migrated JSON loader")
for path in ("admin/index.html","admin/admin.js","indigenous-businesses/admin/index.html","indigenous-churches/admin/index.html"):
 if not (ROOT/path).is_file():errors.append("Missing admin file "+path)
for err in errors:print("ERROR:",err,file=sys.stderr)
print("Directory audit:","PASS" if not errors else f"FAIL ({len(errors)} errors)")
sys.exit(bool(errors))
