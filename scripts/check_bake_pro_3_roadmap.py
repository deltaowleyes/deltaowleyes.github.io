#!/usr/bin/env python3
"""Validate unified BAKE PRO 3.0 task registry without changing project data."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
p = ROOT / "data/bake-pro-3-roadmap.json"
j = json.loads(p.read_text(encoding="utf-8"))
assert j["schema_version"] == 1
tasks = j["tasks"]
ids = [t["id"] for t in tasks]
assert len(ids) == len(set(ids)), "Duplicate task IDs"
by_id = {t["id"]: t for t in tasks}
for key, expected in (("S01", "complete"), ("S02", "pending"), ("S03", "pending")):
    assert key in by_id, f"Missing {key}"
    # S02/S03 may legitimately complete later; this test must not freeze status.
    if key == "S01":
        assert by_id[key]["status"] == expected, "S01 lost verified completion"
assert by_id["S01"].get("evidence"), "S01 needs completion evidence"
b2 = [t for t in tasks if t["id"].startswith("B2-")]
assert len(b2) == 93, "Expected 93 original BAKE PRO 2.0 actions"
assert {t["id"] for t in b2} == {f"B2-{n:03d}" for n in range(1, 94)}
assert {t["source"]["source_index"] for t in b2} == set(range(1, 94))
for t in tasks:
    assert t.get("title") and t.get("status"), f"Missing task details {t.get('id')}"
    for dep in t.get("dependencies", t.get("depends_on", [])):
        assert dep in by_id, f"Unknown dependency {t['id']} -> {dep}"
for t in b2:
    assert t.get("description") and t.get("source", {}).get("roadmap") == "BAKE PRO 2.0"
    assert t.get("bake_prompt") and t.get("bake_prompt_basis")
    assert t.get("priority_basis") and t.get("acceptance_criteria_basis")
    assert t.get("status_basis"), f"Unverified B2 status lacks explicit disclaimer: {t['id']}"
scope = j["scope"]
assert scope["original_roadmap_task_count"] == 52
assert scope["full_migration_complete"] is False, "Original PRO 3.0 migration cannot be silently declared complete"
assert scope["migration_audit"]["unmigrated_count"] == 49
assert scope["unified_registry"]["combined_tracked_count"] == len(tasks)
print("PASS: 96 unique tasks, all 93 sourced B2 actions, protected S01 evidence, dependencies, provenance, 49 original PRO 3.0 gaps")
