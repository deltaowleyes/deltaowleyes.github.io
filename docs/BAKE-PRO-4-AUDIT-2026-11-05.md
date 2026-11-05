# BAKE PRO 4.0 — Master Roadmap Audit (2026-11-05)

## Evidence and scope

Canonical: [data/bake-pro-4-roadmap.json](../data/bake-pro-4-roadmap.json). Read the latest repository tree, CI workflow runs and logs, and targeted website, directory, news, R2 video, policy and task-registry source files. Public fetch availability varied; no new live Chrome session was run. The existing 132-task registry was not replaced or shortened.

## Verified results

| Finding | Evidence | Decision |
| --- | --- | --- |
| S01 directory JSON validation | [CI pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42021706092), earlier owner-confirmed live counts | Retain complete |
| S02 real directory-additions logging | [Successful genuine event-data run](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42027337417) validated data and committed history | Retain complete |
| S03 Chromium testing | [Run 41909909026](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/41909909026) passed local business/church and live business rendering, then failed admin public-phone-field-last assertion at script line 163 | Retain pending, narrow acceptance fix |
| GitHub Pages | [Deployment run 42028974697](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42028974697) succeeded for prior roadmap version | Partial evidence for B2-004, not full CI health |
| R2 video library | [data/videos.json](../data/videos.json) references blooper-001 and [videos/index.html](../videos/index.html) exists | Partial; public CDN playback unverified |
| News reader style | [assets/news-language.js](../assets/news-language.js) has a persistent selection | Partial; reviewed editorial parity unverified |
| Directory updates | [Logging CI](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42027337417) succeeded and [event update page](../events/updates/index.html) exists | Partial; privacy review outstanding |
| Deletion safeguards | [Deletion recovery policy](../DIRECTORY_DELETION_RECOVERY.md), ledger and importer code exist | Partial; recoverability drill not verified |
| BAKE statuses | [Scheduled narrow reconciliation](../.github/workflows/sync-bake-pro-4-roadmap.yml) and status validation exist | Partial; no full-service automatic BAKE completion capture |

## Registry changes

- 132 stable task IDs preserved; statuses unchanged: **2 complete, 130 pending**.
- Added 11 task-specific evidence snapshots, each explicitly distinguished from complete acceptance.
- Fixed mistaken dependency **B4-003 screenshot pilot → B2-037 church expansion**. Replaced with screenshot legal/safety review B4-036; retained admin B2-007 prerequisite.
- Removed the mistaken **B4-036 legal screenshot review → B2-037 church expansion** dependency.
- Verified no dangling references or directed dependency cycles.
- Fixed [roadmap validator](../scripts/check_bake_pro_4_roadmap.py) so adding new B4 tasks does not break a hard-coded 132-task or 36-B4 count. Historic task IDs remain required and cycles are rejected.
- No tasks retired or merged without explicit approval; no new projects added because existing 132-task scope already captures the audited areas.

## Potential overlaps needing future review (not duplicates proven)

- B2-001 deletion system repair vs B4-004 independent recovery drill (implementation vs acceptance test)
- B2-010 first R2 video vs B4-002 custom-domain health vs B4-024 upload/quality acceptance
- B2-025 reading-style toggle vs B4-022 editorial parity audit
- B2-041 directory update history vs S02 successful history-logging workflow
- B2-085 existing automations audit vs B4-030 overlapping newsroom/discovery notifications
- B4-003 screenshot pilot vs B4-036 pre-capture legal/privacy review (different stages, not duplicates)

## Recommended next decision sequence

1. **S03:** Confirm admin public phone field position vs test assumption; rerun Chromium suite before closing.
2. **B4-031 / B4-033:** Make lifecycle evidence, retirement and scheduled reconciliation safer and more general. The scheduled workflow remains narrowly focused on S02, currently complete.
3. **B2-001 → B4-004:** Verify recovery, deletion suppression and admin-public consistency using fixtures and authorization; no live test deletions.
4. **B4-001:** Business email DNS, forwarding, Gmail sending and deliverability (needs provider/account-side verification).
5. **B4-010:** Validate outreach lead eligibility from *actual* Indigenous directory entries and contact history before cold calls.
6. **B4-014:** Preserve council decision/permission boundaries before public-facing 2027 plans.
7. **B4-019 / B4-020:** Verify official TRC attribution and news corrections standards.
8. **B4-032:** Design interactive task dashboard with reliably task-specific copy actions.

This is an **evidence-based snapshot**, not a statement that all 132 task acceptance criteria have been tested. Re-audit fresh main before changes.
