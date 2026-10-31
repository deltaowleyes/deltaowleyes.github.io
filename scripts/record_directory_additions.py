#!/usr/bin/env python3
"""Append newly published JSON records to the public directory update history."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import subprocess
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "data/directory-updates.json"
FILES = {
    "businesses": "indigenous-businesses/businesses.json",
    "churches": "indigenous-churches/churches.json",
    "events": "data/community-events.json",
}

def norm(x):
    s = unicodedata.normalize("NFKD", str(x or "")).casefold()
    return "".join(c for c in s if c.isalnum() and not unicodedata.combining(c))

def key(group, row):
    if group == "businesses" and row.get("source_id"):
        return "id:" + norm(row["source_id"])
    fields = {
        "businesses": ("name", "city", "province"),
        "churches": ("name", "province", "reserve"),
        "events": ("title", "start_date", "city", "province"),
    }[group]
    return "|".join(norm(row.get(x)) for x in fields)

def old_rows(base, path):
    out = subprocess.run(["git","show",base+":"+path],cwd=ROOT,capture_output=True,text=True)
    if out.returncode == 0:
        result = json.loads(out.stdout)
        if not isinstance(result,list): raise ValueError("Invalid previous JSON: "+path)
        return result
    valid = subprocess.run(["git","cat-file","-e",base+"^{commit}"],cwd=ROOT,capture_output=True)
    if valid.returncode: raise RuntimeError("Unknown base commit: "+base)
    listed = subprocess.run(["git","ls-tree","-r","--name-only",base,"--",path],
                            cwd=ROOT,capture_output=True,text=True,check=True)
    if path in listed.stdout.splitlines(): raise RuntimeError("Unable to read "+path)
    return []

def summarize(group,row):
    if group == "events":
        name = row.get("title","")
        place = ", ".join(str(row.get(f)) for f in ("city","province") if row.get(f))
        category = row.get("category","")
        date = row.get("start_date","")
        source = row.get("url","")
        status = "Verified event" if row.get("status")=="verified" else "Unverified event"
    else:
        name = row.get("name","")
        fields = ("community","city","province") if group=="businesses" else ("reserve","province")
        place = ", ".join(str(row.get(f)) for f in fields if row.get(f))
        category = (row.get("directory_category") or row.get("category") or "") if group=="businesses" else row.get("denomination","")
        date = ""
        source = row.get("source_url","") if group=="businesses" else row.get("source","")
        status = "Verified" if row.get("verification_status")=="verified" else "Unverified"
    return dict(key=key(group,row),name=str(name).strip(),place=place,
                category=str(category),date=str(date),source=source if isinstance(source,str) and source.startswith("https://") else "",
                status=status)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base",required=True)
    ap.add_argument("--run",required=True)
    ap.add_argument("--mode",choices=("import","data"),default="data")
    args = ap.parse_args()
    for sha in (args.base,args.run):
        if not re.fullmatch("[a-f0-9]{40}",sha): raise ValueError("Invalid commit SHA")
    history = json.loads(LOG.read_text(encoding="utf8"))
    if history.get("version")!=1 or not isinstance(history.get("runs"),list):
        raise ValueError("Invalid directory update log")
    seen = {(g,row["key"]) for run in history["runs"] for g,rows in run.get("additions",{}).items() for row in rows}
    added = {}
    for group,path in FILES.items():
        current = json.loads((ROOT/path).read_text(encoding="utf8"))
        if not isinstance(current,list): raise ValueError("Not an array: "+path)
        prior = {key(group,row) for row in old_rows(args.base,path)}
        new = []
        for row in current:
            if not isinstance(row,dict): raise ValueError("Bad directory record: "+path)
            token = key(group,row)
            if not token or token in prior or (group,token) in seen: continue
            detail = summarize(group,row)
            if not detail["name"]: raise ValueError("New record missing name: "+path)
            new.append(detail)
            prior.add(token)
            seen.add((group,token))
        if new: added[group]=new
    if not added:
        print("Directory updates: no new listings; unchanged")
        return
    history["runs"].insert(0,{
        "at":datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00","Z"),
        "commit":args.run,"mode":args.mode,"additions":added
    })
    LOG.write_text(json.dumps(history,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print("Directory updates added: "+json.dumps({k:len(v) for k,v in added.items()}))

if __name__=="__main__": main()
