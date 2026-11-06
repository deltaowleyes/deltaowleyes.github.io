#!/usr/bin/env python3
"""Read-only production acceptance for the Delta Owl Eyes Education Hub.

Check the public production HTML and the independently served catalogue, not
the repository version, so a successful Pages build is not mistaken for a
successful public deployment.
"""
from __future__ import annotations

import json
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = "https://deltaowleyes.ca"
ATTEMPTS = 12
PAUSE_SECONDS = 15


def fetch(path: str) -> str:
    request = Request(
        ROOT + path,
        headers={"User-Agent": "DeltaOwlEyes-Education-LiveAcceptance/1.0"},
    )
    with urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise AssertionError(f"Expected HTTP 200 for {path}, got {response.status}")
        return response.read().decode("utf-8")


def check() -> int:
    html = fetch("/education/")
    records = json.loads(fetch("/data/education-resources.json"))
    assert isinstance(records, list) and len(records) >= 28, (
        f"Expected at least 28 live Education records, found {len(records)}"
    )
    ids = {entry.get("id") for entry in records if isinstance(entry, dict)}
    assert len(ids) == len(records), "Production IDs missing or duplicated"
    assert "wifn-post-secondary-support" in ids, "Walpole Island support not live"
    assert "oneida-master-speakers" in ids, "Oneida knowledge keeper link not live"
    assert "nctr-northern-survivors" in ids, "Survivor source not live"
    for marker in (
        'href="https://deltaowleyes.ca/education/"',
        "/data/education-resources.json",
        'data-topic="knowledge-keepers"',
        'value="on-site"',
        "doe-header-v3",
        "privacy-consent.js",
    ):
        assert marker in html, f"Missing live page feature: {marker}"
    print(
        "PASS: public Education HTTP 200, "
        f"{len(records)} unique source records, local/Survivor/knowledge-keeper "
        "entries, canonical, filters, header and privacy script."
    )
    return 0


def main() -> int:
    for attempt in range(1, ATTEMPTS + 1):
        try:
            return check()
        except (AssertionError, OSError, ValueError, HTTPError, URLError) as exc:
            print(
                f"Education live acceptance attempt {attempt}/{ATTEMPTS}: {exc}",
                file=sys.stderr,
                flush=True,
            )
            if attempt < ATTEMPTS:
                time.sleep(PAUSE_SECONDS)
    print("FAIL: Education production acceptance not confirmed", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
