#!/usr/bin/env python3
"""Read-only business shard audit on full GitHub checkout (never prints contacts).

This avoids the GitHub connector's response-size limit on the ~3.7 MB
businesses-with-phone.json file. It does NOT authorize JSON imports.
"""
import json
from collections import Counter
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
PHONE=ROOT/"indigenous-businesses/businesses-with-phone.json"
NO_PHONE=ROOT/"indigenous-businesses/businesses-without-phone.json"
LEDGER=ROOT/".github/deletion-ledger.json"

def read(path):
    data=json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data,list):
        raise ValueError("Invalid JSON list "+str(path.relative_to(ROOT)))
    return data

def report():
    phone=read(PHONE); without=read(NO_PHONE); ledger=read(LEDGER)
    all_items=phone+without
    ids=[str(x["source_id"]) for x in all_items if isinstance(x,dict) and x.get("source_id")]
    duplicate_ids=[k for k,n in Counter(ids).items() if n>1]
    wrong_phone=sum(not str(r.get("phone") or "").strip() for r in phone)
    wrong_no_phone=sum(bool(str(r.get("phone") or "").strip()) for r in without)
    removed=[x for x in ledger if isinstance(x,dict) and x.get("source")=="businesses"]
    resurrected=[r for r in all_items if any(
        tomb.get("source_id") and r.get("source_id")==tomb["source_id"] for tomb in removed)]
    result={
      "businesses_with_phone":len(phone),
      "businesses_without_phone":len(without),
      "total_active_businesses":len(all_items),
      "recoverable_business_tombstones":len(removed),
      "baseline_4999_including_tombstones":len(all_items)+len(removed)>=4999,
      "missing_phone_in_phone_shard":wrong_phone,
      "unexpected_phone_in_no_phone_shard":wrong_no_phone,
      "duplicated_source_id_count":len(duplicate_ids),
      "resurrected_deleted_ids":len(resurrected),
      "source_file_bytes":{"phone":PHONE.stat().st_size,"no_phone":NO_PHONE.stat().st_size},
      "read_only":True,
      "warning":"Aggregate audit only. Still requires all legacy eligibility, alias, website and deletion checks before any import."
    }
    return result

def main():
    report_data=report()
    print(json.dumps(report_data,indent=2))
    if len(sys.argv)>1:
        Path(sys.argv[1]).write_text(json.dumps(report_data,indent=2)+"\n",encoding="utf-8")
    if any([not report_data["baseline_4999_including_tombstones"],
            report_data["missing_phone_in_phone_shard"],
            report_data["unexpected_phone_in_no_phone_shard"],
            report_data["duplicated_source_id_count"],
            report_data["resurrected_deleted_ids"]]):
        print("SHARD INTEGRITY CHECK REQUIRES REVIEW",file=sys.stderr)
        return 1
    return 0

if __name__=="__main__":
    sys.exit(main())
