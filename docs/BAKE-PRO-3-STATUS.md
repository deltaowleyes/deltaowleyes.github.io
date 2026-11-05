# Delta Owl Eyes — BAKE PRO 3.0 status source of truth

**Canonical status file:** [data/bake-pro-3-roadmap.json](../data/bake-pro-3-roadmap.json) on `main`.

This repository-backed status file persists across ChatGPT conversations and retains Git history. **Initial migration is incomplete:** the original BAKE PRO 3.0 roadmap had 52 tasks across 13 workstreams; only S01–S03 have sufficiently recovered descriptions to be imported faithfully. The omitted tasks are **not** cancelled, finished, or lost by design; full migration must be reconciled with the original roadmap rather than invented.

## Current verified status

| ID | Task | Status | Evidence / next verification |
| --- | --- | --- | --- |
| S01 | Repair Directory Validation | COMPLETE | [CI passing](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42021706092), [history test](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42023360706), [Pages](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42023361586); user verified HTTP 200 and 4,632 / 364 / 200 JSON rows |
| S02 | Repair Directory Update Logging | PENDING | Need a successful genuine dataset-triggered directory-additions run, despite history backfill |
| S03 | Repair Chromium Browser Tests | PENDING | Need real-browser rendering and workflow check; HTML/JSON checks alone do not prove rendering |

## Synchronization protocol for every BAKE

1. Read latest `main` and the canonical JSON before choosing work. Use the task ID from the original roadmap.
2. Verify current GitHub and live evidence. Do not overwrite new status with stale chat summaries.
3. On each completed BAKE, write the affected task's status, evidence URL(s), and distinct follow-up IDs to the JSON, with a reviewable GitHub commit.
4. Preserve all other tasks; resolve concurrent edits by re-reading `main` before writing.
5. Treat an unverified task as pending or blocked, never automatically complete.
6. Reconcile/import the **remaining original 49 tasks** before calling the complete roadmap migrated. Known IDs needing import include S04, X01, W02 and C01.
7. GitHub Actions can verify narrow technical conditions, but does **not** know whether editorial, council, outreach, or other external commitments were completed. These need explicit verified updates.

A background audit can periodically detect stale statuses and suggest corrections. **GitHub does not automatically learn about work completed in a chat**: completed BAKE sessions must write to the canonical file, or a separately authorized reconciliation automation must do so. No claim of instantaneous synchronization is made.
