#!/usr/bin/env python3
"""Read-only weekly provider-link health audit; never deletes or republishes records.

Outputs link statuses and source-review age without collecting learner data.
A 403/429, network timeout, or bot protection is NOT proof a resource is gone.
"""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from datetime import date
from http.client import HTTPException
from ipaddress import ip_address
import json
from pathlib import Path
import socket
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler

ROOT=Path(__file__).resolve().parents[1]
CATALOGUE=ROOT/"data/education-resources.json"
USER_AGENT="DeltaOwlEyesEducationLinkAudit/1.0 (human-review only; no rehosting)"
TIMEOUT=10

def allowed_url(url):
    from scripts.education_editorial import canonical
    canonical(url)
    host=urlsplit(url).hostname
    answers=socket.getaddrinfo(host,443,type=socket.SOCK_STREAM)
    if not answers or any(not ip_address(info[4][0]).is_global for info in answers):
        raise ValueError("URL resolves to a nonpublic network")
    return True

class SafeRedirect(HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        allowed_url(newurl)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def inspect(row):
    url=row["url"]
    result={"id":row["id"],"url":url,"state":"needs-review","http_status":None,"detail":"unverified"}
    try:
        age=(date.today()-date.fromisoformat(row["last_source_review"])).days
        result["review_age_days"]=age
        if age>120:
            result["stale_review"]=True
        allowed_url(url)
        opener=build_opener(SafeRedirect())
        for method in ("HEAD","GET"):
            request=Request(url,headers={"User-Agent":USER_AGENT},method=method)
            if method=="GET":request.add_header("Range","bytes=0-0")
            try:
                with opener.open(request,timeout=TIMEOUT) as reply:
                    result["http_status"]=reply.status
                    result["state"]="reachable" if 200<=reply.status<400 else "needs-review"
                    result["detail"]="Original provider endpoint responded"
                    return result
            except HTTPError as err:
                result["http_status"]=err.code
                if err.code in (405,501) and method=="HEAD":
                    continue
                if err.code in (404,410):
                    result["state"]="possible-missing"
                    result["detail"]="Provider returned 404/410; manually verify before changing the directory"
                elif err.code in (401,403,429):
                    result["detail"]="Login, permission or rate limit; NOT a verified broken link"
                else:
                    result["detail"]="Provider HTTP error; manual check required"
                return result
    except (ValueError,KeyError,HTTPException,URLError,OSError,TimeoutError,UnicodeError,socket.gaierror) as exc:
        result["detail"]=type(exc).__name__+"; check manually, no automated removal"
    return result

def main():
    rows=json.loads(CATALOGUE.read_text(encoding="utf-8"))
    if not isinstance(rows,list) or not rows:
        raise ValueError("Missing source catalogue")
    with ThreadPoolExecutor(max_workers=4) as pool:
        report=list(pool.map(inspect,rows))
    counts={state:sum(x["state"]==state for x in report) for state in ("reachable","possible-missing","needs-review")}
    stale=sum(x.get("stale_review",False) for x in report)
    output={"as_of":date.today().isoformat(),"record_count":len(rows),"status_counts":counts,
            "stale_over_120_days":stale,"results":report,
            "policy":"Read-only: failures require editorial verification; no automatic takedown or content scraping"}
    dest=Path(sys.argv[1]) if len(sys.argv)>1 else Path("/tmp/education-link-health.json")
    dest.write_text(json.dumps(output,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    summary=f"Education link audit: {len(rows)} records, {counts['reachable']} reachable, {counts['possible-missing']} possible missing, {counts['needs-review']} needs review, {stale} stale source reviews"
    print(summary)
    print("Full report:",dest)
    reportfile=__import__("os").environ.get("GITHUB_STEP_SUMMARY")
    if reportfile:
        with open(reportfile,"a",encoding="utf-8") as f:
            f.write("### Education link health\n\n"+summary+"\n\n")
            for item in report:
                if item["state"]!="reachable" or item.get("stale_review"):
                    f.write(f"- `{item['id']}`: {item['state']}, HTTP {item['http_status'] or 'unknown'}, age {item.get('review_age_days','?')} days\n")
    return 0

if __name__=="__main__":
    sys.exit(main())
