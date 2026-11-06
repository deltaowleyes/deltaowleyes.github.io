#!/usr/bin/env python3
"""Staff-only, local-first Education editorial queue and safe catalogue mutations.

Public site does NOT accept submissions. Mail is read privately by staff; only
public resource facts are entered here. No GitHub tokens are stored in this
script. GitHub authorization is rechecked before any public JSON write.
"""
from __future__ import annotations

import argparse
from datetime import date, datetime, timezone
import ipaddress
import json
import os
from pathlib import Path
import re
import socket
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "data/education-resources.json"
SUPPRESSED = ROOT / "data/education-suppressed.json"
QUEUE = Path.home() / ".delta-owl-eyes" / "education-editorial-queue.json"
REPO = "deltaowleyes/deltaowleyes.github.io"
CATEGORIES = set("schools courses land languages survivor-stories videos advocacy funding teaching knowledge-keepers".split())
FORMATS = {"online", "hybrid", "on-site"}
ELIGIBILITY = {"indigenous-only", "open", "check-provider"}
FIELDS = {"id","title","provider","category","format","eligibility","price",
          "description","url","source_url","region","notice","last_source_review","verification"}
REQUEST_KINDS = {"suggest","correct","remove"}
REASONS = {"rights-holder-request","cultural-access","accuracy","duplicate","withdrawn","no-longer-available","other"}
ID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

def read_json(path: Path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)

def canonical(url: str) -> str:
    if not isinstance(url,str) or len(url)>2048 or re.search(r"[\s<>]",url):
        raise ValueError("Invalid public URL")
    parts=urlsplit(url)
    if parts.scheme!="https" or not parts.hostname or parts.username or parts.password or parts.fragment or parts.port not in (None,443):
        raise ValueError("Only HTTPS public source URLs are allowed")
    hostname=parts.hostname.lower().rstrip(".")
    if hostname in {"localhost","localhost.localdomain"} or hostname.endswith((".localhost",".local",".internal")):
        raise ValueError("Internal URL forbidden")
    try:
        host=ipaddress.ip_address(hostname.strip("[]"))
    except ValueError:
        pass
    else:
        if not host.is_global:
            raise ValueError("Nonpublic IP forbidden")
    return (parts.scheme+"://"+parts.netloc.lower()+parts.path.rstrip("/")).lower() + (("?"+parts.query) if parts.query else "")

def safe_text(value, key: str, max_length=600) -> str:
    if not isinstance(value,str) or not value.strip() or len(value)>max_length:
        raise ValueError("Invalid or missing public field "+key)
    if any(ord(c)<32 for c in value):
        raise ValueError("Control character in "+key)
    if "<script" in value.lower() or "<iframe" in value.lower():
        raise ValueError("Unsafe markup in "+key)
    return value.strip()

def validate_resource(row):
    if not isinstance(row,dict) or set(row)!=FIELDS:
        raise ValueError("Public resource must use exact established schema (no contact/person fields)")
    for key in FIELDS-{"id","url","source_url","last_source_review"}:
        safe_text(row.get(key),key,1000 if key in {"description","notice"} else 300)
    if not isinstance(row["id"],str) or not ID.fullmatch(row["id"]):
        raise ValueError("Invalid resource ID")
    if row["category"] not in CATEGORIES or row["format"] not in FORMATS or row["eligibility"] not in ELIGIBILITY:
        raise ValueError("Unapproved category, format or eligibility")
    if row["verification"]!="provider_source_reviewed":
        raise ValueError("Source verification required")
    if canonical(row["url"])!=canonical(row["source_url"]):
        raise ValueError("Original resource and source URL must match")
    if date.fromisoformat(row["last_source_review"])>date.today():
        raise ValueError("Future source review date")
    if row["category"]=="survivor-stories" and not any(w in row["notice"].lower() for w in ("advisory","trauma","residential-school")):
        raise ValueError("Survivor source content advisory required")
    for key in ("title","provider","description","notice"):
        if re.search(r"(?:\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)",row[key]):
            raise ValueError("Do not publish emails or personal contact information")
    return row

def assert_not_suppressed(row,ledger):
    for x in ledger:
        if x["id"]==row["id"] or canonical(x["url"])==canonical(row["url"]):
            raise ValueError("Resource was suppressed: refuse reimport")

def verify_reviewer():
    """The local CLI never acts as a substitute for GitHub repo authorization."""
    def gh(*args):
        result=subprocess.run(("gh",*args),capture_output=True,text=True,timeout=25,check=True)
        return result.stdout.strip()
    try:
        login=gh("api","user","--jq",".login")
        if not login or not re.fullmatch("[A-Za-z0-9-]{1,39}",login):
            raise ValueError("Invalid GitHub login")
        permission=gh("api",f"repos/{REPO}/collaborators/{login}/permission","--jq",".permission")
    except (OSError, subprocess.SubprocessError, ValueError) as exc:
        raise PermissionError("GitHub CLI login and permission check required: "+str(exc)) from exc
    if permission not in {"write","admin"}:
        raise PermissionError("A GitHub repository write/admin role is required")
    return login

def verify_review_branch():
    """Never modify catalogue on main or atop existing unreviewed JSON edits."""
    try:
        branch=subprocess.run(("git","branch","--show-current"),cwd=ROOT,
                              capture_output=True,text=True,timeout=10,check=True).stdout.strip()
        top=subprocess.run(("git","rev-parse","--show-toplevel"),cwd=ROOT,
                           capture_output=True,text=True,timeout=10,check=True).stdout.strip()
        dirty=subprocess.run(("git","status","--porcelain","--",
                              "data/education-resources.json","data/education-suppressed.json"),
                             cwd=ROOT,capture_output=True,text=True,timeout=10,check=True).stdout.strip()
    except (OSError, subprocess.SubprocessError) as exc:
        raise PermissionError("Reviewed Git working tree required") from exc
    if Path(top).resolve()!=ROOT.resolve():
        raise PermissionError("Not operating in the canonical checked-out repository")
    if not branch.startswith(("feature/education-","fix/education-")):
        raise PermissionError("Education changes require a dedicated review branch, never main")
    if dirty:
        raise PermissionError("Education JSON already has local edits; reconcile and review before modifying")
    return branch

def queue_path() -> Path:
    p=QUEUE.resolve()
    if p.is_relative_to(ROOT.resolve()):
        raise ValueError("Private review queue cannot live inside public repository")
    return p

def private_write(path: Path, rows):
    path.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
    if os.name=="posix":
        os.chmod(path.parent,0o700)
    descriptor,tmp=tempfile.mkstemp(prefix=".education-queue-",dir=path.parent)
    try:
        with os.fdopen(descriptor,"w",encoding="utf-8") as out:
            json.dump(rows,out,ensure_ascii=False,indent=2)
            out.write("\n")
        if os.name=="posix":
            os.chmod(tmp,0o600)
        os.replace(tmp,path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)

def read_queue():
    path=queue_path()
    if not path.exists():
        return []
    data=read_json(path)
    if not isinstance(data,list):
        raise ValueError("Invalid local review queue")
    return data

def intake(args):
    if args.kind not in REQUEST_KINDS:
        raise ValueError("Unknown request kind")
    if args.kind in {"correct","remove"} and not args.resource_id:
        raise ValueError("Corrections/removals require the existing resource ID")
    if args.resource_id and not ID.fullmatch(args.resource_id):
        raise ValueError("Invalid resource ID")
    if args.url:
        canonical(args.url)
    if args.kind=="suggest" and not args.url:
        raise ValueError("Suggestions need original public provider URL")
    row={"ticket":uuid4().hex[:12],"kind":args.kind,
         "resource_id":args.resource_id or None,"public_source_url":args.url or None,
         "status":"pending","received_at":datetime.now(timezone.utc).isoformat(timespec="seconds")}
    queue=read_queue()
    if any(x["status"]=="pending" and x["kind"]==row["kind"] and
           x.get("resource_id")==row["resource_id"] and
           x.get("public_source_url")==row["public_source_url"] for x in queue):
        raise ValueError("Matching pending ticket exists")
    queue.append(row)
    private_write(queue_path(),queue)
    print("Queued PRIVATE staff review ticket",row["ticket"],"without requester personal data")

def show_queue():
    print(json.dumps(read_queue(),indent=2))

def save_public(catalogue,ledger):
    # Prevalidate all data before touching either public file.
    if len({x["id"] for x in catalogue})!=len(catalogue):
        raise ValueError("Duplicate resource ID")
    if len({canonical(x["url"]) for x in catalogue})!=len(catalogue):
        raise ValueError("Duplicate source URL")
    if len({(x["provider"].casefold(),x["title"].casefold()) for x in catalogue})!=len(catalogue):
        raise ValueError("Duplicate provider and title")
    if not isinstance(ledger,list):
        raise ValueError("Invalid suppression ledger")
    for item in catalogue:
        validate_resource(item)
        assert_not_suppressed(item,ledger)
    previous=(CATALOGUE.read_bytes(),SUPPRESSED.read_bytes())
    try:
        CATALOGUE.write_text(json.dumps(catalogue,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        SUPPRESSED.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        checked=subprocess.run((sys.executable,str(ROOT/"scripts/check_education_resources.py")),
                               cwd=ROOT,capture_output=True,text=True,check=False)
        if checked.returncode:
            raise ValueError("Public validation rejected change: "+checked.stderr+checked.stdout)
    except Exception:
        CATALOGUE.write_bytes(previous[0])
        SUPPRESSED.write_bytes(previous[1])
        raise

def resolve_ticket(ticket: str|None):
    if not ticket:
        return
    queue=read_queue()
    entry=next((x for x in queue if x["ticket"]==ticket and x["status"]=="pending"),None)
    if entry is None:
        raise ValueError("Ticket not found or already resolved")
    entry["status"]="resolved"
    entry["resolved_at"]=datetime.now(timezone.utc).isoformat(timespec="seconds")
    private_write(queue_path(),queue)

def public_edit(args):
    if not args.confirm_source_reviewed or not args.write:
        raise PermissionError("Preview first; --confirm-source-reviewed and --write are mandatory")
    # Always check GitHub role and exact ticket state before modifying public JSON.
    reviewer=verify_reviewer()
    branch=verify_review_branch()
    if args.ticket and not any(x["ticket"]==args.ticket and x["status"]=="pending" for x in read_queue()):
        raise ValueError("Ticket missing or already resolved")
    catalogue=read_json(CATALOGUE)
    ledger=read_json(SUPPRESSED)
    if args.action in {"approve","correct"}:
        candidate=Path(args.file).expanduser().resolve()
        if candidate.is_relative_to(ROOT.resolve()):
            raise ValueError("Candidate draft must remain OUTSIDE the public repo")
        row=validate_resource(read_json(candidate))
        matched=next((r for r in catalogue if r["id"]==row["id"]),None)
        assert_not_suppressed(row,ledger)
        if args.action=="approve":
            if matched is not None:
                raise ValueError("ID exists: use correct instead")
            catalogue.insert(0,row)
        else:
            if matched is None:
                raise ValueError("Cannot correct absent ID")
            if canonical(matched["url"])!=canonical(row["url"]):
                raise ValueError("Canonical URL change requires separate case review; old URL cannot be silently reused")
            catalogue[catalogue.index(matched)]=row
        print("Reviewer",reviewer,"accepted",args.action,row["id"])
    else:
        if not args.resource_id or not ID.fullmatch(args.resource_id):
            raise ValueError("Valid --resource-id required for takedown")
        if args.reason not in REASONS:
            raise ValueError("Choose a generic removal reason; no complainant details")
        matched=next((r for r in catalogue if r["id"]==args.resource_id),None)
        if matched is None:
            raise ValueError("ID absent; no tombstone created")
        if any(x["id"]==args.resource_id or canonical(x["url"])==canonical(matched["url"]) for x in ledger):
            raise ValueError("Already suppressed")
        catalogue.remove(matched)
        ledger.append({"id":matched["id"],"url":matched["url"],
                       "reason":args.reason,"removed_on":date.today().isoformat()})
        print("Reviewer",reviewer,"authorized removal",matched["id"])
    save_public(catalogue,ledger)
    resolve_ticket(args.ticket)
    print("Validated on",branch,"for reviewer",reviewer,". Git diff, authenticated PR review and deployment are STILL required.")

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    sub=parser.add_subparsers(dest="action",required=True)
    add=sub.add_parser("intake",help="Private local ticket: NO contact names, photos or narrative")
    add.add_argument("--kind",required=True,choices=sorted(REQUEST_KINDS))
    add.add_argument("--resource-id")
    add.add_argument("--url",help="Public, provider-owned HTTPS URL only")
    sub.add_parser("queue",help="Show local-only pending/resolved ticket metadata")
    for action in ("approve","correct","remove"):
        cmd=sub.add_parser(action,help="GitHub-authenticated staff editorial action")
        if action in ("approve","correct"):
            cmd.add_argument("--file",required=True,help="Local, source-reviewed public resource JSON OUTSIDE repository")
        else:
            cmd.add_argument("--resource-id",required=True)
            cmd.add_argument("--reason",required=True,choices=sorted(REASONS))
        cmd.add_argument("--ticket",help="Local request ticket to resolve")
        cmd.add_argument("--write",action="store_true",help="Explicitly modify PUBLIC tracked catalogue/ledger")
        cmd.add_argument("--confirm-source-reviewed",action="store_true",help="Staff confirms original source and rights/access conditions")
    args=parser.parse_args()
    try:
        if args.action=="intake":intake(args)
        elif args.action=="queue":show_queue()
        else:public_edit(args)
    except (ValueError,PermissionError,OSError,KeyError,json.JSONDecodeError) as exc:
        parser.exit(1,"Refused: "+str(exc)+"\n")

if __name__=="__main__":
    main()
