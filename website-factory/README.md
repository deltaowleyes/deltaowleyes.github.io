# Website Factory 2.0 — ten-lane design development
Status: **branch-only experimental prototypes**. Never promote to public/latest without approval.

## Audited starting point (2026-11-05)
- Base main commit: `5ad318cc7e7f9af17ea5644ac8b36c39ab717763` (re-check latest main before any integration).
- Momma Made: `/mommamade/` redirects to approved `/mommamade/v2/`; original ten preserved at `/mommamade/revisions/v1/`.
- Registry: `data/web-design-projects.json`; acceptance and archive policy: `docs/WEB-DESIGN-VERSIONING-AND-REFERENCE-QA.md`.
- Existing Playwright/Chromium QA: `tests/mommamade-v2.qa.cjs`, `mommamade/qa.mjs`, revision guard, reference captures. These scripts are NOT evidence that current CI passes or that reference screenshot parity is confirmed.
- `main` was not branch-protected. This workflow is a safety convention and CI gate, **not enforced branch protection**.

## Branch and merge contract
1. The dedicated integration branch is `factory2/integration-2026-11-05`. Each `factory2/design-NN-slug` branch starts from its exact integration commit and owns only `website-factory/candidates/<slug>/`. No worker writes `main`, `mommamade/`, `shutyourtrap/`, `assets/privacy-*`, or any other candidate folder.
2. Use a separate ChatGPT chat or developer worktree for each branch. A chat is **not** a guaranteed background worker; actual simultaneous ChatGPT task limits vary. Start 3–5 lanes, expand toward ten only when supported. Nothing here starts autonomous chats.
3. Propose one PR per candidate **into the integration branch**. Require peer review; do not automatically merge or auto-approve. Update integration sequentially with reviewed candidates. Concurrent PR work is safe because candidate folders are disjoint; conflicts in shared files are resolved by the integrator.
4. Candidate views are proof-of-concept *home-page compositions*, not completed client websites. Each is visually distinct by DOM structure/section order/layout anatomy, not palette alone. Content and illustrations are original CSS/HTML; no third-party source code, graphics or client-specific fabrications.
5. Review `candidates.json` design fingerprints, copyright/source notes, desktop 1440×900 and mobile 390×844 screenshots. Perform all 320/390/768/1024/1440/1920 breakpoints, link/keyboard/consent and no-payments checks. Record actual browser results, not just presence of test scripts.
6. A reviewed integration PR may target `main` **only after all ten candidates pass QA** and the client accepts the designs. Promotion of a new Momma Made revision is **a separate explicit approval**, with archive-first copying, update of `data/web-design-projects.json`, current-only routing, and verified rollback. These candidate paths must not be linked as current galleries before that.
7. If any QA fails, retain the old approved `mommamade/v2/` as current. No client deployments, payments or form submissions are enabled here.

## Safe test commands
```sh
# from repository root, run a static server in another terminal
python3 -m http.server 8765 --bind 127.0.0.1
# Playwright must already be installed locally (no paid API required)
node website-factory/tests/qa.cjs --present
node website-factory/tests/qa.cjs --all
```
The `--present` mode tests only candidates present on an isolated branch; `--all` requires exactly 10. The PR gate uses free standard GitHub-hosted Ubuntu runners, no paid/large runners and no secrets. It skips draft PRs and writes only short-lived screenshot artifacts.

## Cost gate
See `website-factory/cost-ledger.json`. Development incremental cash must remain **strictly below C$1**, and commercial production must not exceed **C$5 per 100 templates**. Existing subscriptions excluded; paid APIs, new plans, upgrades and usage overages prohibited absent explicit approval. The absence of a billing statement is **not proof of C$0 actual spend**. Do not run jobs that require billable tokens/services.

## Integration reviewer checklist
- [ ] Ten distinct structural anatomies, not colour swaps
- [ ] Every branch based on pinned integration commit; no scope violations
- [ ] Baseline latest and archive links unchanged
- [ ] Evidence captures, overflow, link/nav, disabled commerce, privacy/consent
- [ ] Reference comparisons honestly marked verified/unverified
- [ ] Cost audit and GitHub billing visibility recorded
- [ ] Approved release archived first; latest-only promotion only with owner approval

## Integrated review snapshot (2026-11-05)
A separate protected-by-convention snapshot of **all ten** candidates is at branch `factory2/integration-review-10-2026-11-05`; exact starting main `9dfcd888515fcea6281972acdcf8b78c59af04b4`. Individual PRs #2–#11 remain open and unmerged. The [combined Chromium + axe WCAG technical suite](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42136144133) passes on 10 desktop and 10 mobile layouts, with short-retention screenshot evidence. See [integration findings](INTEGRATION-AUDIT-2026-11-05.md): repeated lower-page structures, external reference parity, owner acceptance and actual billing are **not approved**. The approved Momma Made V2 remains current; the separate V3 candidate is untouched. No production deployment is authorized.
