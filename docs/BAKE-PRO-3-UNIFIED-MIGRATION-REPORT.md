# BAKE PRO 3.0 — Unified Master Roadmap Migration Report

**Migration date:** 2026-11-05
**Canonical registry:** [data/bake-pro-3-roadmap.json](../data/bake-pro-3-roadmap.json)
**Original archived source:** [BAKE PRO 2.0 — 93 actions](BAKE-PRO-2-ORIGINAL-93-ACTIONS.md)

## Reconciliation

- **93/93 PRO 2.0 source actions imported** in original order, with exact original headings and short descriptions.
- Stable, collision-free historical-provenance IDs: `B2-001` through `B2-093`.
- **S01 (complete), S02 (pending), S03 (pending)** retained with prior evidence and task identities.
- Combined registry contains **96 entries**, not 96 unique original PRO 3.0 tasks.
- **Original PRO 3.0 52-task source remains incomplete:** only S01–S03 were previously recovered. The **other 49** remain unresolved, including partial IDs S04, X01, W02 and C01. This archival migration does not replace or close them.
- 9 grouping labels, dependencies, priorities, acceptance criteria and complete standalone BAKE prompts are **new planning proposals**, not original PRO 2.0 source metadata. The source export contained short task summaries but not those fields.
- No speculative deduplication was performed. Overlap is represented only as `related_task_ids` when clear; entries from different generations remain distinguishable.

## Proposed categories

| Proposed workstream | Source action indices |
| --- | --- |
| Platform, Security & Operations | 1–9 |
| Video & Podcast Production | 10–21 |
| Website, Newsroom & SEO | 22–32 |
| Directory & Discovery | 33–42 |
| Services & Revenue | 43–53 |
| Council & 2027 Gathering | 54–65 |
| TRC & Editorial | 66–74 |
| Marketing & Partnerships | 75–83 |
| Management & Governance | 84–93 |

## Status and synchronization rules

1. On starting any BAKE, read `main` and the canonical JSON; do not use chat summaries as status truth.
2. Revalidate the specific task against live source and current evidence before acting; `pending` for B2 actions means **not independently audited**, not evidence they were never implemented.
3. On completion, commit evidence URLs and status changes to the same canonical JSON without overwriting other task updates, and report the new SHA.
4. Never automatically close political, cultural, editorial, council, partnership or external-approval tasks based on unrelated technical CI.
5. The scheduled automatic reconciliation currently has a narrow S02 success check; it does **not** provide general automatic status updates for all 96 tasks or between-chat writes without a running BAKE.
6. Preserve the 49-task original PRO 3.0 migration gap until the real full 52-task source is supplied.

## QA

The migration checked a 93/93 title-to-description match, consecutive source indices, 96 distinct task IDs, no dangling proposed dependencies, and 93 standalone BAKE prompts. GitHub Actions [roadmap validation](../.github/workflows/validate-bake-pro-3-roadmap.yml) should also report a passing run after installation.

## Safety

No public directories, deletion tombstones, admin credentials, site pages or editorial data were changed as part of this migration.
