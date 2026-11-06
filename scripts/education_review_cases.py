#!/usr/bin/env python3
"""Staff-only metadata casebook for Education corrections and takedowns.

Never put this file's actual case records in a public repository. The local
casebook records only ticket IDs, existing *public* resource references,
GitHub reviewer account names, and generic decisions. It is NOT a replacement
for server-enforced PR approvals or for community-appointed consent.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
if str(Path(__file__).resolve().parents[1]) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts import education_editorial as ed

LOGIN = re.compile(r"^[A-Za-z0-9-]{1,39}$")
FINGERPRINT = re.compile(r"^[0-9A-F]{40}$")
REQUIRED = 2
VALID_DECISIONS = {"approve", "reject"}
ALLOWED_KEYS = {"ticket", "kind", "resource_id", "public_source_url", "status",
                "received_at", "resolved_at", "reviews"}

def stamp():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

def validate_queue(data):
    if not isinstance(data, list) or len(data) > 10000:
        raise ValueError("Casebook must be a small private JSON array")
    ids = set()
    for item in data:
        if not isinstance(item, dict) or set(item) - ALLOWED_KEYS:
            raise ValueError("Unexpected private case field (no contact information allowed)")
        ticket = item.get("ticket")
        if not isinstance(ticket, str) or not re.fullmatch(r"[0-9a-f]{12}", ticket):
            raise ValueError("Invalid case ticket")
        if ticket in ids: raise ValueError("Duplicate case ticket")
        ids.add(ticket)
        if item.get("kind") not in ed.REQUEST_KINDS:
            raise ValueError("Invalid request kind")
        if item.get("status") not in {"pending", "resolved"}:
            raise ValueError("Invalid ticket state")
        source = item.get("public_source_url")
        if source is not None: ed.canonical(source)
        resource = item.get("resource_id")
        if resource is not None and (not isinstance(resource, str) or not ed.ID.fullmatch(resource)):
            raise ValueError("Invalid public record ID")
        reviews = item.get("reviews", [])
        if not isinstance(reviews, list) or len(reviews) > 10:
            raise ValueError("Invalid review list")
        seen = set()
        for review in reviews:
            if not isinstance(review, dict) or set(review) != {"github_login", "decision", "reviewed_at"}:
                raise ValueError("Review records may contain only public GitHub username, decision and UTC time")
            login = review["github_login"]
            if not isinstance(login, str) or not LOGIN.fullmatch(login) or login.casefold() in seen:
                raise ValueError("Duplicate/invalid review login")
            seen.add(login.casefold())
            if review["decision"] not in VALID_DECISIONS:
                raise ValueError("Unknown review decision")
            datetime.fromisoformat(review["reviewed_at"])
        for key in ("received_at","resolved_at"):
            if item.get(key) is not None:
                datetime.fromisoformat(item[key])
    return data

def load():
    return validate_queue(ed.read_queue())

def find_ticket(rows, ticket):
    case = next((x for x in rows if x["ticket"] == ticket), None)
    if case is None: raise ValueError("No such private ticket")
    return case

def permission_for(login: str) -> str:
    if not LOGIN.fullmatch(login): raise PermissionError("Invalid reviewer account")
    response = subprocess.run(
        ("gh", "api", f"repos/{ed.REPO}/collaborators/{login}/permission",
         "--jq", ".permission"), capture_output=True, text=True,
        timeout=25, check=True
    )
    return response.stdout.strip()

def review(ticket: str, decision: str, checked: bool):
    if not checked: raise PermissionError("Explicit provider/cultural-protocol review confirmation required")
    if decision not in VALID_DECISIONS: raise ValueError("Invalid decision")
    login = ed.verify_reviewer()  # Real GitHub-connected role check, fails closed.
    rows = load()
    case = find_ticket(rows, ticket)
    if case["status"] != "pending": raise ValueError("Resolved case cannot receive new reviews")
    reviews = case.setdefault("reviews", [])
    if any(r["github_login"].casefold() == login.casefold() for r in reviews):
        raise ValueError("One GitHub account may attest only once per ticket")
    reviews.append({"github_login":login,"decision":decision,"reviewed_at":stamp()})
    ed.private_write(ed.queue_path(), validate_queue(rows))
    print("Private case",ticket,"review decision recorded for authenticated GitHub reviewer",login)
    print("A casebook decision is not a server-enforced GitHub PR approval.")

def require_two_reviewers(ticket: str | None, action: str):
    """Fail closed: two different current write/admin users + no rejection.

    Local metadata cannot cryptographically prove who edited it. A separately
    enforced PR reviewer check is needed for trustworthy publication.
    """
    if not ticket: raise PermissionError("--ticket is mandatory for all Education publishing actions")
    rows = load()
    case = find_ticket(rows, ticket)
    if case["status"] != "pending": raise PermissionError("Ticket already resolved")
    kinds = {"approve":"suggest","correct":"correct","remove":"remove"}
    if case["kind"] != kinds[action]:
        raise PermissionError("Ticket kind does not match requested public edit")
    reviews = case.get("reviews", [])
    if any(r["decision"] == "reject" for r in reviews):
        raise PermissionError("A reviewer rejected this case; require a fresh request")
    approved = {r["github_login"].casefold():r["github_login"] for r in reviews if r["decision"]=="approve"}
    if len(approved) < REQUIRED:
        raise PermissionError("Two distinct GitHub-authorized staff approvals are required before editing")
    for login in approved.values():
        try: level = permission_for(login)
        except (OSError, subprocess.SubprocessError) as exc:
            raise PermissionError("Cannot recheck current reviewer permissions; refusing write") from exc
        if level not in {"write","admin"}:
            raise PermissionError("Reviewer no longer has repository write access")
    return sorted(approved.values(), key=str.casefold)

def private_path(path: Path):
    resolved = path.expanduser().resolve()
    if resolved.is_relative_to(ed.ROOT.resolve()):
        raise ValueError("Private casebook bundle must remain outside public repository")
    return resolved

def seal(destination: Path, recipients: list[str]):
    """Encrypt an export to two recipient public keys via local GPG.

    Never stage a plaintext casebook for upload or use --trust-model always.
    Staff must independently verify recipients' key fingerprints.
    """
    names = sorted(set(r.upper() for r in recipients))
    if len(names) < 2 or any(not FINGERPRINT.fullmatch(r) for r in names):
        raise ValueError("At least two distinct 40-hex verified GPG fingerprints required")
    target = private_path(destination)
    if target.exists(): raise ValueError("Refusing to overwrite encrypted bundle")
    rows = load()
    target.parent.mkdir(parents=True,exist_ok=True)
    payload = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    cmd = ["gpg", "--batch", "--no-tty", "--encrypt", "--output", str(target)]
    for recipient in names: cmd += ["--recipient", recipient]
    result = subprocess.run(cmd,input=payload,text=True,capture_output=True,timeout=90,check=False)
    if result.returncode:
        target.unlink(missing_ok=True)
        raise PermissionError("Encryption failed; verify trusted recipient keys locally")
    if not target.is_file() or target.stat().st_size==0:
        raise ValueError("Encrypted bundle was not created")
    if __import__("os").name=="posix":target.chmod(0o600)
    print("Encrypted metadata-only casebook exported locally; never commit it to Git.")

def unseal(source: Path):
    """Decrypt an external casebook and merge only nonconflicting tickets.

    Imported approvals are untrusted local metadata: current permission is
    rechecked at edit time and GitHub PR approvals remain authoritative.
    """
    src=private_path(source)
    if not src.is_file(): raise ValueError("Encrypted source bundle not found")
    with tempfile.TemporaryDirectory(prefix="doe-edu-import-") as tmp:
        out=Path(tmp)/"casebook.json"
        cmd=("gpg","--batch","--no-tty","--decrypt","--output",str(out),str(src))
        result=subprocess.run(cmd,capture_output=True,text=True,timeout=90,check=False)
        if result.returncode:raise PermissionError("GPG decryption failed; no queue changes made")
        incoming=validate_queue(json.loads(out.read_text(encoding="utf-8")))
    current=load()
    by_id={item["ticket"]:item for item in current}
    imported=0
    for item in incoming:
        if item["ticket"] in by_id:
            if item != by_id[item["ticket"]]:
                raise ValueError("Case conflict: refusing implicit merge of reviewed decisions")
        else:
            imported+=1
    merged=current+[x for x in incoming if x["ticket"] not in by_id]
    ed.private_write(ed.queue_path(),validate_queue(merged))
    print("Imported",imported,"new metadata-only cases; GPG verification does not prove GitHub review authority")

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    subs=parser.add_subparsers(dest="action",required=True)
    att=subs.add_parser("review",help="Record authenticated private staff decision")
    att.add_argument("--ticket",required=True)
    att.add_argument("--decision",choices=sorted(VALID_DECISIONS),required=True)
    att.add_argument("--checked-provider-and-protocol",action="store_true")
    status=subs.add_parser("status",help="Show case IDs and decision counts, not private comments")
    status.add_argument("--ticket")
    save=subs.add_parser("seal",help="Optional GPG-encrypted local casebook bundle")
    save.add_argument("--output",type=Path,required=True)
    save.add_argument("--recipient",action="append",default=[])
    load_cmd=subs.add_parser("unseal",help="Import and validate encrypted metadata bundle")
    load_cmd.add_argument("--input",type=Path,required=True)
    args=parser.parse_args()
    try:
        if args.action=="review":
            review(args.ticket,args.decision,args.checked_provider_and_protocol)
        elif args.action=="status":
            for item in load():
                if not args.ticket or args.ticket==item["ticket"]:
                    print(json.dumps({"ticket":item["ticket"],"kind":item["kind"],
                      "status":item["status"],"approved":sum(r["decision"]=="approve" for r in item.get("reviews",[])),
                      "rejected":any(r["decision"]=="reject" for r in item.get("reviews",[]))}))
        elif args.action=="seal":seal(args.output,args.recipient)
        elif args.action=="unseal":unseal(args.input)
    except (OSError, ValueError, PermissionError, KeyError, TypeError,
            subprocess.SubprocessError, json.JSONDecodeError) as exc:
        parser.exit(1, "Refused: "+str(exc)+"\n")

if __name__=="__main__":
    main()
