#!/usr/bin/env python3
"""Weekly *read-only* grant source audit; no status edits or auto deletions."""
import json
import os
from pathlib import Path
import sys
from datetime import date

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from scripts.check_education_links import inspect  # reuses SSRF/redirect protection

rows=json.loads((ROOT/"data/indigenous-grants.json").read_text(encoding="utf-8"))
unique={}
for x in rows:
    unique.setdefault(x["source_url"],{"id":x["id"],"url":x["source_url"],"last_source_review":x["last_source_review"]})
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=4) as pool:
    inspected=list(pool.map(inspect,unique.values()))
by_url={x["url"]:x for x in inspected}
report=[]
for x in rows:
    check=by_url[x["source_url"]]
    age=(date.today()-date.fromisoformat(x["last_source_review"])).days
    report.append({"id":x["id"],"source_url":x["source_url"],"state":check["state"],
                   "http_status":check["http_status"],"detail":check["detail"],
                   "review_age_days":age,"stale_review":age>30,
                   "intake":x["intake"],"deadline":x["deadline"],
                   "deadline_passed":bool(x["deadline"] and x["deadline"]<date.today().isoformat())})
counts={state:sum(x["state"]==state for x in report) for state in ("reachable","possible-missing","needs-review")}
summary={"as_of":date.today().isoformat(),"total":len(report),"unique_urls":len(unique),
         "counts":counts,"stale_over_30_days":sum(x["stale_review"] for x in report),
         "passed_deadlines":sum(x["deadline_passed"] for x in report),
         "policy":"Read-only. 403/429 is NOT proof of removal. All status, deadline and takedown changes require manual source review.",
         "results":report}
dest=Path(sys.argv[1]) if len(sys.argv)>1 else Path("/tmp/indigenous-grant-source-health.json")
dest.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("Grants audit:",len(report),"entries,",len(unique),"unique URLs,",counts,", stale:",summary["stale_over_30_days"])
if os.environ.get("GITHUB_STEP_SUMMARY"):
    with open(os.environ["GITHUB_STEP_SUMMARY"],"a",encoding="utf-8") as f:
        f.write("### Discovery 4.0 grant source review\n\n")
        f.write(f"{len(report)} grants, {len(unique)} original source URLs, {counts}; {summary['stale_over_30_days']} records need re-review.\n")
        for x in report:
            if x["state"]!="reachable" or x["stale_review"]:
                f.write(f"- \`{x['id']}\`: {x['state']}, review age {x['review_age_days']} days; manual check only\n")
