#!/usr/bin/env python3
"""Isolated regression test: tombstone suppression and legitimate imports."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
script = (root / "scripts/import_directory_batch.py").read_text(encoding="utf-8")

def record(name, source_id, city="Walpole Island"):
    return {
        "name": name, "source_id": source_id, "source_url": "https://example.org/source",
        "ownership_source_url": "https://example.org/ownership",
        "on_reserve_location_source_url": "https://example.org/location",
        "ownership_evidence": "Primary source used for fixture",
        "on_reserve_location_evidence": "Primary source used for fixture",
        "verification_status": "unverified", "ownership_status": "unverified",
        "on_reserve_location_status": "unverified", "owner_confirmed": False,
        "phone": "519-555-0100", "city": city, "province": "Ontario", "website": "",
    }

with tempfile.TemporaryDirectory() as tmp:
    project = Path(tmp)
    for folder in ("scripts", "indigenous-businesses/imports", ".github"):
        (project / folder).mkdir(parents=True, exist_ok=True)
    (project / "scripts/import_directory_batch.py").write_text(script, encoding="utf-8")
    phone = project / "indigenous-businesses/businesses-with-phone.json"
    no_phone = project / "indigenous-businesses/businesses-without-phone.json"
    phone.write_text("[]\n", encoding="utf-8")
    no_phone.write_text("[]\n", encoding="utf-8")
    batch = project / "indigenous-businesses/imports/test.json"
    batch.write_text(json.dumps([
        record("Deleted Example", "old-id"),
        record("Deleted Example", "new-id"),
        record("Allowed Example", "allowed-id", "Chatham"),
    ]), encoding="utf-8")
    ledger = project / ".github/deletion-ledger.json"
    path = "indigenous-businesses/imports/test.json"
    def run():
        return subprocess.run([sys.executable, str(project / "scripts/import_directory_batch.py"), path],
            cwd=project, capture_output=True, text=True, check=False)
    missing = run()
    assert missing.returncode != 0 and "ledger missing" in missing.stderr
    assert json.loads(phone.read_text()) == []
    ledger.write_text(json.dumps([{
        "source": "businesses", "source_id": "old-id",
        "key": "deletedexample|walpoleisland|ontario",
        "deleted_at": "2026-11-03T00:00:00Z", "record": record("Deleted Example", "old-id")
    }]), encoding="utf-8")
    result = run()
    assert result.returncode == 0, result.stderr
    output = json.loads(result.stdout)
    assert output["inserted_count"] == 1, output
    assert output["inserted_names"] == ["Allowed Example"], output
    assert len(output["excluded_alias_or_id"]) == 2, output
    assert [v["name"] for v in json.loads(phone.read_text())] == ["Allowed Example"]
    again = run()
    assert again.returncode == 0, again.stderr
    assert json.loads(again.stdout)["inserted_count"] == 0
    assert len(json.loads(phone.read_text())) == 1
print("PASS tombstone suppression by both source ID and identity, missing-ledger fail-closed, allowed import, replay idempotence")
