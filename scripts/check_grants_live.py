#!/usr/bin/env python3
"""Independently verify production GitHub Pages serves the current Grants release.

The runner fetches the public custom domain (not the checked-out files only)
and compares actual JSON bytes as data against the committed catalogue.
"""
from __future__ import annotations
import json
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

SITE="https://deltaowleyes.ca"
ROOT=Path(__file__).resolve().parents[1]
ATTEMPTS=12

def get(path: str) -> str:
    with urlopen(Request(SITE+path,headers={"User-Agent":"DeltaOwlEyes-Grants-PublicAcceptance/1.0"}),timeout=20) as resp:
        if resp.status!=200:
            raise AssertionError(f"{path} returned HTTP {resp.status}")
        return resp.read().decode("utf-8")

def check():
    live_html=get("/grants/")
    live_data=json.loads(get("/data/indigenous-grants.json"))
    expected_data=json.loads((ROOT/"data/indigenous-grants.json").read_text(encoding="utf-8"))
    home=get("/")
    assert isinstance(live_data,list) and live_data, "Public catalogue missing or empty"
    assert live_data==expected_data, "Live grants JSON differs from checked-out main release"
    ids=[r["id"] for r in live_data]
    assert len(set(ids))==len(ids), "Duplicate public grant IDs"
    for marker in ('href="https://deltaowleyes.ca/grants/"','id="grant-search"','id="grant-purpose"','id="grant-applicant"','id="grant-region"','id="grant-status"','id="grant-list"','/data/indigenous-grants.json',"privacy-consent.js","doe-header-v3"):
        assert marker in live_html,f"Live Grants page missing {marker}"
    assert 'href="/grants/"' in home, "Homepage missing Grants link"
    assert "<iframe" not in live_html and "innerHTML" not in live_html, "Unsafe Grants public markup"
    print(f"PASS public {SITE}/grants/ HTTP 200, {len(ids)} release-matching grant entries, homepage navigation, filters, provenance and privacy")
    return 0

def main():
    for attempt in range(1,ATTEMPTS+1):
        try:
            return check()
        except (AssertionError,OSError,ValueError,HTTPError,URLError) as ex:
            print(f"Grants deployment attempt {attempt}/{ATTEMPTS}: {ex}",file=sys.stderr,flush=True)
            if attempt<ATTEMPTS:time.sleep(10)
    print("FAIL: current grants release not independently live yet",file=sys.stderr)
    return 1
if __name__=="__main__":
    raise SystemExit(main())
