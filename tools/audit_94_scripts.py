#!/usr/bin/env python3
"""Audit the 94 Call to Action teleprompter drafts without publishing them."""
import json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
FOLDER=ROOT/"calls-to-action"/"scripts"
LABEL=re.compile(r"^\*\*(LEAH|CHRIS):\*\*$",re.M)
def audit(n):
    p=FOLDER/f"{n:02d}.md"
    if not p.exists(): return {"call":n,"status":"missing"}
    s=p.read_text(encoding="utf-8")
    speakers=list(LABEL.finditer(s))
    issues=[]
    if not speakers: issues.append("missing bold speaker labels")
    counts={"LEAH":0,"CHRIS":0}
    for i,m in enumerate(speakers):
        end=speakers[i+1].start() if i+1<len(speakers) else len(s)
        block=s[m.end():end]
        if not block.startswith("\n") or block.startswith("\n\n"): issues.append("speaker dialogue must start on next line")
        counts[m.group(1)]+=len(re.findall(r"\b[\w'-]+\b",block))
    total=sum(counts.values())
    share=counts["LEAH"]/total if total else 0
    if not .65<=share<=.75: issues.append(f"Leah share {share:.1%}, target 65–75%")
    # Approximate duration at 120–150 spoken words/minute, not a measured recording.
    if total<300 or total>600: issues.append(f"{total} spoken words; target ~300–600 for 2.5–4 min")
    for heading in ("Hard Truths","Education","Accountability"):
        if heading.lower() not in s.lower(): issues.append(f"missing {heading}")
    return {"call":n,"status":"ready_for_review" if not issues else "needs_revision","words":counts,"leah_share":round(share,3),"issues":issues}
def main():
    rows=[audit(n) for n in range(1,95)]
    print(json.dumps({"total":94,"ready_for_review":sum(r["status"]=="ready_for_review" for r in rows),"missing":sum(r["status"]=="missing" for r in rows),"results":rows},indent=2))
    return 0 if all(r["status"]=="ready_for_review" for r in rows) else 1
if __name__=="__main__": sys.exit(main())
