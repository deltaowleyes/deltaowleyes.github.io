#!/usr/bin/env python3
"""Validate the extensible BAKE PRO 4.0 roadmap, including retained IDs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "data/bake-pro-4-roadmap.json").read_text(encoding="utf-8"))
assert data["schema_version"] == 1
tasks = data["tasks"]
by_id = {t["id"]: t for t in tasks}
assert len(tasks) == len(by_id) == data["scope"]["total_tasks"], "Duplicate IDs or stale count"
assert {f"B2-{i:03d}" for i in range(1, 94)}.issubset(by_id), "Historic B2 ID removed"
assert {f"B4-{i:03d}" for i in range(1, 37)}.issubset(by_id), "Historic B4 ID removed"
assert {"S01", "S02", "S03"}.issubset(by_id), "Historic S task removed"
assert by_id["S01"]["status"] == "complete" and by_id["S01"]["evidence"]
assert len([x for x in tasks if x["id"].startswith("B2-")]) == 93
assert all(re.fullmatch(r"B4-\d{3,}", x) for x in by_id if x.startswith("B4-"))
allowed = set(data["status_definitions"])
adj = {}
for task in tasks:
    ident = task["id"]
    assert task.get("title"), ident
    assert task["status"] in allowed, ident
    adj[ident] = task.get("dependencies", task.get("depends_on", []))
    if task["status"] == "complete":
        assert task.get("evidence"), f"Completed without evidence: {ident}"
    if task["status"] == "retired":
        assert task.get("retirement", {}).get("reason"), f"Retired without reason: {ident}"
    if ident.startswith(("B2-", "B4-")):
        assert "data/bake-pro-4-roadmap.json" in task["bake_prompt"], ident
        assert task.get("source", {}).get("roadmap"), ident
    for dep in adj[ident]:
        assert dep in by_id and dep != ident, f"Invalid dependency: {ident} -> {dep}"

visiting = set()
visited = set()
def visit(ident):
    if ident in visiting:
        raise AssertionError(f"Dependency cycle involving {ident}")
    if ident in visited:
        return
    visiting.add(ident)
    for dep in adj[ident]:
        visit(dep)
    visiting.remove(ident)
    visited.add(ident)
for ident in by_id:
    visit(ident)

assert data["scope"]["unrecovered_pro3_original_52"] == 49
assert data["policy"]["source_of_truth"]
print(f"PASS: {len(tasks)} unique tasks, immutable historic IDs, valid statuses, "
      "evidence, retirement rules and acyclic dependencies")
