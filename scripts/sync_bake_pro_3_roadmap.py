#!/usr/bin/env python3
"""Evidence-only reconciliation for the canonical BAKE PRO 3.0 roadmap.

Automatic rules are deliberately narrow. A GitHub Actions success cannot prove
community, editorial, permission, or browser-rendering acceptance criteria.
"""
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ROADMAP = ROOT / "data/bake-pro-3-roadmap.json"
API = "https://api.github.com/repos/deltaowleyes/deltaowleyes.github.io"
LOGGING_WORKFLOW = "log-directory-additions.yml"
FIX_SHA = "11d5ef472dc2af16ab74249a096ff735d811fff8"


def find_genuine_success(runs, commit_dates):
    for run in runs:
        if (run.get("name") != "Record new directory and event listings"
            or run.get("conclusion") != "success"
            or run.get("event") != "push"
            or run.get("head_branch") != "main"
            or run.get("actor", {}).get("login") == "github-actions[bot]"):
            continue
        if run.get("created_at", "") <= "2026-11-05T11:46:43Z":
            continue
        if run.get("head_sha") not in commit_dates:
            continue
        return run
    return None


def fetch_runs():
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        raise RuntimeError("Missing GITHUB_TOKEN; not updating roadmap")
    request = Request(
        API + "/actions/workflows/" + LOGGING_WORKFLOW + "/runs?branch=main&per_page=100",
        headers={"Accept": "application/vnd.github+json",
                 "Authorization": "Bearer " + token,
                 "X-GitHub-Api-Version": "2022-11-28"},
    )
    with urlopen(request, timeout=30) as response:
        return json.load(response)["workflow_runs"]


def main():
    roadmap = json.loads(ROADMAP.read_text(encoding="utf-8"))
    if roadmap.get("schema_version") != 1:
        raise ValueError("Unexpected roadmap schema")
    tasks = roadmap["tasks"]
    ids = [task["id"] for task in tasks]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate roadmap IDs")
    if not any(t["id"] == "S02" for t in tasks):
        raise ValueError("S02 not present: refuse partial overwrite")
    runs = fetch_runs()
    # The workflow is path-triggered by genuine dataset edits. Never create
    # records or dispatch an artificial run just to satisfy a status check.
    valid_sha = {r.get("head_sha") for r in runs if r.get("head_sha")}
    passed = find_genuine_success(runs, valid_sha)
    if not passed:
        print("No verified new successful dataset-triggered directory logging run; unchanged")
        return
    task = next(t for t in tasks if t["id"] == "S02")
    if task["status"] == "complete":
        print("S02 already complete; unchanged")
        return
    evidence_url = passed.get("html_url")
    if not evidence_url or not evidence_url.startswith(
        "https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/"
    ):
        raise ValueError("Missing trustworthy workflow evidence URL")
    task["status"] = "complete"
    task["notes"] = "Genuine dataset-triggered logging workflow succeeded after validator repair."
    task.setdefault("evidence", []).append({
        "type": "github_actions", "url": evidence_url, "result": "success"
    })
    roadmap["updated_at"] = passed["created_at"][:10]
    ROADMAP.write_text(json.dumps(roadmap, ensure_ascii=False, indent=2) + "\n",
                       encoding="utf-8")
    print("S02 complete with evidence: " + evidence_url)


if __name__ == "__main__":
    main()
