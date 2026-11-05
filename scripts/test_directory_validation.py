#!/usr/bin/env python3
"""Fixture-based regression checks for directory baseline and deletion tombstones."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

VALIDATOR = Path(__file__).with_name("check_directory_data.py")
PHONE = "indigenous-businesses/businesses-with-phone.json"
NO_PHONE = "indigenous-businesses/businesses-without-phone.json"
CHURCHES = "indigenous-churches/churches.json"
LEDGER = ".github/deletion-ledger.json"


def write_json(root, path, value):
    target = root / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(value), encoding="utf-8")


def run(root, expected_success, case):
    result = subprocess.run(
        [sys.executable, str(root / "scripts/check_directory_data.py")],
        cwd=root, text=True, capture_output=True, check=False,
    )
    actual_success = result.returncode == 0
    if actual_success != expected_success:
        raise AssertionError(
            f"{case}: expected {'PASS' if expected_success else 'FAIL'}, "
            f"got exit {result.returncode}\n{result.stdout}\n{result.stderr}"
        )
    print(f"PASS {case}: {'accepted' if actual_success else 'rejected'}")


def main():
    with tempfile.TemporaryDirectory(prefix="doe-directory-validation-") as folder:
        root = Path(folder)
        target = root / "scripts/check_directory_data.py"
        target.parent.mkdir(parents=True)
        shutil.copyfile(VALIDATOR, target)
        phone = [
            {"name": f"Fixture business {i}", "phone": "555-0100",
             "source_id": f"fixture-{i}", "verification_status": "unverified"}
            for i in range(4995)
        ]
        no_phone = [{"name": "Fixture without phone", "phone": "",
                     "source_id": "fixture-no-phone", "verification_status": "unverified"}]
        churches = [{"name": f"Fixture church {i}", "province": "Ontario",
                     "reserve": f"Fixture reserve {i}"} for i in range(140)]
        tombstones = [
            {"source": "businesses", "source_id": f"deleted-{i}",
             "key": f"deletedbusiness{i}|fixturetown|ontario",
             "deleted_at": "2026-11-04T20:50:24Z",
             "record": {"name": f"Deleted fixture business {i}"}}
            for i in range(3)
        ]
        write_json(root, PHONE, phone)
        write_json(root, NO_PHONE, no_phone)
        write_json(root, CHURCHES, churches)
        write_json(root, LEDGER, tombstones)
        for path in ("indigenous-businesses/index.html",
                     "indigenous-businesses/profile.html"):
            p = root / path
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("Fixture directory page", encoding="utf-8")
        church_page = root / "indigenous-churches/index.html"
        church_page.write_text("fetch('./churches.json')", encoding="utf-8")
        for path in ("admin/index.html", "admin/admin.js",
                     "indigenous-businesses/admin/index.html",
                     "indigenous-churches/admin/index.html"):
            p = root / path
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("Fixture admin", encoding="utf-8")

        run(root, True, "baseline with three recoverable deletions")
        write_json(root, PHONE, phone[:-1])
        run(root, False, "unexplained missing record")
        write_json(root, PHONE, phone)

        write_json(root, LEDGER, tombstones + [copy.deepcopy(tombstones[0])])
        run(root, False, "duplicate business tombstone")

        invalid = copy.deepcopy(tombstones)
        invalid[0].pop("key")
        write_json(root, LEDGER, invalid)
        run(root, False, "malformed business tombstone")

        write_json(root, LEDGER, [])
        run(root, False, "missing deletion history cannot satisfy baseline")
        (root / LEDGER).unlink()
        run(root, False, "missing deletion ledger fails closed")


if __name__ == "__main__":
    main()
