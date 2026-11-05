#!/usr/bin/env python3
"""Validate canonical BAKE PRO 4.0 roadmap identities, references and evidence."""
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
roadmap=json.loads((ROOT/"data/bake-pro-4-roadmap.json").read_text(encoding="utf-8"))
assert roadmap["schema_version"]==1
tasks=roadmap["tasks"]
by_id={t["id"]:t for t in tasks}
assert len(tasks)==len(by_id)==roadmap["scope"]["total_tasks"]==132
assert {f"B2-{i:03d}" for i in range(1,94)}.issubset(by_id)
assert {f"B4-{i:03d}" for i in range(1,37)}.issubset(by_id)
for id in ("S01","S02","S03"):
    assert id in by_id
assert by_id["S01"]["status"]=="complete"
assert by_id["S01"].get("evidence")
assert len([t for t in tasks if t["id"].startswith("B2-")])==93
assert len([t for t in tasks if t["id"].startswith("B4-")])==36
allowed=set(roadmap["status_definitions"])
for t in tasks:
    assert t.get("title") and t.get("description",t.get("notes","")) or t["id"] in ("S01","S02","S03")
    assert t["status"] in allowed,(t["id"],t["status"])
    for dep in t.get("dependencies",t.get("depends_on",[])):
        assert dep in by_id and dep!=t["id"],(t["id"],dep)
    if t["status"]=="complete":
        assert t.get("evidence"),f"Completion missing evidence {t['id']}"
    if t["status"]=="retired":
        assert t.get("retirement",{}).get("reason"),f"Retirement missing reason {t['id']}"
    if t["id"].startswith(("B2-","B4-")):
        assert "data/bake-pro-4-roadmap.json" in t["bake_prompt"],t["id"]
        assert t.get("source",{}).get("roadmap"),t["id"]
assert roadmap["scope"]["unrecovered_pro3_original_52"]==49
assert roadmap["policy"]["source_of_truth"]
print("PASS: 132 stable tasks (93 B2, 36 B4, S01–S03), evidence, tasks, dependencies and retirement rules")
