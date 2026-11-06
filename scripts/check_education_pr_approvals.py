#!/usr/bin/env python3
"""Read-only audit of GitHub PR review evidence for Education changes.

Advisory until an authorized repository admin makes this job a *required*
status check in branch protection/rulesets. Never infer approval from a
private local casebook or from an account's association with a Nation.
"""
from __future__ import annotations

import argparse
from datetime import datetime
import json
import re
import subprocess
from typing import Any

REPO="deltaowleyes/deltaowleyes.github.io"
NEEDED=2
USER=re.compile(r"^[A-Za-z0-9-]{1,39}$")

def gh(path: str):
    return json.loads(subprocess.run(
        ("gh","api","--paginate",path),capture_output=True,text=True,
        timeout=30,check=True).stdout)

def eligible(pr: dict, reviews: list[dict], permission_lookup) -> list[str]:
    head=pr["head"]["sha"]
    author=pr["user"]["login"].casefold()
    latest={}
    for review in reviews:
        actor=review.get("user") or {}
        login=actor.get("login","")
        if not isinstance(login,str) or not USER.fullmatch(login): continue
        if login.casefold()==author:continue
        if review.get("state") not in {"APPROVED","CHANGES_REQUESTED","COMMENTED","DISMISSED"}:continue
        when=review.get("submitted_at") or ""
        ident=login.casefold()
        if ident not in latest or when>=latest[ident].get("submitted_at",""):
            latest[ident]=review
    valid=[]
    for identity,review in latest.items():
        if review["state"]!="APPROVED":continue
        # Every counted approval must apply to the exact current head.
        if review.get("commit_id")!=head:continue
        login=review["user"]["login"]
        if permission_lookup(login) in {"write","maintain","admin"}:
            valid.append(login)
    return sorted(valid,key=str.casefold)

def current_permission(login: str):
    if not USER.fullmatch(login):raise ValueError("Bad reviewer name")
    result=gh(f"repos/{REPO}/collaborators/{login}/permission")
    if not isinstance(result,dict):raise ValueError("No trustworthy permission response")
    return result.get("permission")

def check(pr_number: int):
    if pr_number<1:raise ValueError("Invalid PR number")
    pr=gh(f"repos/{REPO}/pulls/{pr_number}")
    reviews=gh(f"repos/{REPO}/pulls/{pr_number}/reviews?per_page=100")
    if not isinstance(pr,dict) or not isinstance(reviews,list):
        raise ValueError("Missing authoritative GitHub review data")
    names=eligible(pr,reviews,current_permission)
    if len(names)<NEEDED:
        raise PermissionError(f"Only {len(names)} qualifying distinct non-author approvals on current PR head; need {NEEDED}")
    print(f"PASS: PR #{pr_number} has {len(names)} distinct current-head GitHub write/maintain/admin approvals")
    return names

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pr",type=int,required=True)
    args=parser.parse_args()
    try:check(args.pr)
    except (OSError, ValueError, PermissionError, KeyError, TypeError,
            subprocess.SubprocessError, json.JSONDecodeError) as exc:
        parser.exit(1,"Review gate not satisfied: "+str(exc)+"\n")

if __name__=="__main__":
    main()
