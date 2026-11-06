# Website Factory 2.0 — Ten-Candidate Integrated Review (2026-11-05 local / UTC 2026-11-06)
**Status: not approved; not published; new candidate-only review branch.**

## Source-of-truth and exact construction
- Original integration source `factory2/integration-2026-11-05`, commit `a712c86723e460233c19524e7dd040ad331a6903`.
- Ten independently reviewed candidate PRs #2–#11, exactly two files per candidate. The PRs remain **open**, not merged; this branch copies their tested Git blobs into a single coherent review snapshot.
- The new branch `factory2/integration-review-10-2026-11-05` was created from main commit `9dfcd888515fcea6281972acdcf8b78c59af04b4`. If main advances later, compare and rebase deliberately; do not assert perpetual head parity.
- No changes to `mommamade/`, `shutyourtrap/`, `data/web-design-projects.json`, `assets/privacy-*`, user directory/news data, or the live site root.
- Current Momma Made stable root stays at **V2**; V1 archived and V3 a separate unapproved candidate under `mommamade/v3/`.
- Only `website-factory/` and the two new QA workflow files are introduced in this review branch.
- Latest main branch was unprotected on inspection, so procedural review requirements cannot prevent an owner with write permission from merging prematurely.

## QA evidence by PR (previous isolated runs)
| Candidate | PR | Individual test | Desktop/mobile evidence | Third-party screenshot parity | Owner approval |
| --- | --- | --- | --- | --- | --- |
| 01 Field Notes | [PR #2](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/2) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133152924) | Desktop + mobile captured | Reference not paired | Owner pending |
| 02 Countertop Mosaic | [PR #3](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/3) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133585001) | Desktop + mobile captured | Reference not paired | Owner pending |
| 03 The Daily Ledger | [PR #4](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/4) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42134197687) | Desktop + mobile captured | Reference not paired | Owner pending |
| 04 Still Life Studio | [PR #5](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/5) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133210160) | Desktop + mobile captured | Reference not paired | Owner pending |
| 05 Ritual Route | [PR #6](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/6) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133215234) | Desktop + mobile captured | Reference not paired | Owner pending |
| 06 White Space Works | [PR #7](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/7) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133220885) | Desktop + mobile captured | Reference not paired | Owner pending |
| 07 Patchwork Press | [PR #8](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/8) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42134193729) | Desktop + mobile captured | Reference not paired | Owner pending |
| 08 Orbit Home | [PR #9](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/9) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133229456) | Desktop + mobile captured | Reference not paired | Owner pending |
| 09 Pantry Atlas | [PR #10](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/10) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133231627) | Desktop + mobile captured | Reference not paired | Owner pending |
| 10 A Letter Home | [PR #11](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/11) | [Isolated Chromium pass](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42133237301) | Desktop + mobile captured | Reference not paired | Owner pending |
Individual suites covered static routes, 320,390,768,1024,1440,1920px overflow, internal anchors, details interaction, privacy script inclusion, and absence of active forms/checkout. These are limited **technical** passes, not proof of full design accessibility.

## Visual, structural and copyright assessment
- Ten original hero/home compositions are visibly different: editorial margin notebook, tile mosaic, utility ledger, still-life diptych, procedural stations, negative-space poster, rotated zine collage, radial diagram, alphabetized taxonomy, and letterpress letter.
- Important limitation: navigation, information cards, care notes, story, and footer mostly reuse the same structure across all ten. This **does not satisfy production-ready full-site differentiation** and should block marketing these as ten premium complete websites.
- Screenshot review confirmed broad desktop and mobile stacking; after a cramped headline in Countertop Mosaic was corrected in commit `f78650b899fcccaa88ee36050f6239382174c1fa`, its re-run passed.
- All product claims are illustrative; no stock, product specs, prices, testimonials, staff credentials or purchase workflow is invented.
- Art is generated in CSS/HTML. No third-party photos, branded graphics or original source-site scripts were imported into the candidate files. Independent legal/licensing review was not performed.
- The `candidates.json` metadata gives no reference-site URLs or reference screenshots, so **reference fidelity is unverified / not assessable**, not a pass. Since these are original directions, do not fabricate inspirations.
- Mobile focus, colour contrast and automated accessibility still require combined evaluation through the new integrated CI. Do not equate axe rules with a complete WCAG audit.

## Separate work already on main
The latest `data/web-design-projects.json` already lists Momma Made V3 as a candidate and V2 as the latest approved version. Do **not** conflate the separate V3 candidate with Factory 2.0 parallel exploratory layouts, and do not silently promote either.

## Cost & concurrency
Canonical hard policy: `docs/WEBSITE-FACTORY-COST-POLICY.md`. Aggregate incremental development cash must remain **strictly below C$1**, not C$1 per bake; commercial generation and QA must remain **at or below C$5 per 100 options**. Existing entitlements are excluded only without overages.
- This integration uses only standard public-repository GitHub Actions, open-source Playwright/axe-core, original HTML/CSS, and existing GitHub artifacts. No purchased media, new subscriptions, inference API, or paid runner was deliberately invoked.
- **Actual spend: UNVERIFIED**. GitHub billing, artifact storage allowance, other provider usage and invoices were not read; unknown is not C$0.
- The C$5/100 target remains **unproven at commercial scale**, especially for independent premium content and images. No autonomous ten-chat generation is implemented.
- Ten source branches and ten PRs do not guarantee ten concurrent ChatGPT processing slots. Do not auto-merge or schedule paid workers.

## Release blockers and next checks
1. Run `website-factory/tests/qa.cjs --all` **in one branch**, record actual GitHub job, logs and combined 20 screenshots.
2. Run `review-qa.cjs` for automated axe WCAG tags, skip-link keyboard and live-form safety, repair verified defects only.
3. Owner visual approval and full-page structural differentiation; these are currently only homepage concepts with a common template below the fold.
4. Ground any requested third-party reference comparisons in dated screenshots and layout evidence; never claim parity without evidence.
5. Verify billing statements and actual commercial-scale cost before committing to the per-100 unit economics.
6. Apply proper branch protections / approval rules before ever considering production. Archive-first published releases need separate explicit user approval and full rollback evidence.

**No deployment or merge authorization is implied by passing technical tests.**

## Final integrated technical QA — recorded after source audit
- [**PASS**](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42136144133): commit `ee49bb9b2fdd2f16d483471fe48753b80c4dedaf` passed all ten candidate Chromium route/interaction checks at 320, 390, 768, 1024, 1440 and 1920 px.
- [**PASS**](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42136144133): all ten desktop **and** all ten 390×844 mobile pages passed automated axe-core `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` rules. Keyboard skip link and disabled real form/checkout were checked.
- The [GitHub artifact](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42136144133) contains **20 PNG screenshots**, `results.json`, and `accessibility-results.json`; both JSON reports read `pass:true`, ten candidates, zero recorded axe violations. Artifact retention is short (3 days); preserve a copy for any longer-term decision record.
- Earlier CI [run 42135781242](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42135781242) found three serious large-heading `color-contrast` defects: Ritual Route 1.81:1, Orbit Home 1.39:1, Pantry Atlas 2.85:1 (required >=3:1). Corrected only those headings on the integrated branch with darker accents `#8a5b39`, `#426d61`, `#9e6847` respectively; rerun passed.
- The first run [42135611673](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42135611673) passed all ten page tests, but the axe harness initially required `browser.newContext()`; that testing harness was fixed before valid axe review.
- [**PASS**](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42136144133): `tests/web-design-revisions.qa.cjs` confirms Momma Made current **V2**, V3 a candidate, and Shut Your Trap intact; `tests/website-factory-cost-guard.cjs` confirms **policy preflight, not invoices**.
- [**PASS**](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42135611698): separate internal website links workflow for the initial combined snapshot.

### Unresolved visual-approval findings (not technical regressions)
1. All ten **share exactly the same main navigation markup**, and all ten **share byte-identical collection-and-care section markup**, as measured by direct source comparison. Distinct heroes are demonstrated, but calling them ten distinct full-production websites would be misleading.
2. The ten are **homepage studies**, without separate fleshed-out product/detail/contact applications, and they must not displace Momma Made V2 or the existing separate V3 candidate.
3. Some visual directions overlap existing Momma Made V3: **Field Notes / Maker Field Notes**, **Daily Ledger / Atelier Ledger or Utility Index**, **Countertop Mosaic / Pattern Studio**, and **Pantry Atlas / Utility Index**. This is an overlap risk, not a finding of copied code. No historical revisions were deleted.
4. No source-site inspiration screenshots or client-approved reference URLs were supplied for these ten, so external visual-fidelity status is **unverified**. The concept markup contains no externally loaded media/scripts beyond the preserved local privacy integration; this does not replace independent rights review.
5. Automated axe passes are **not a complete accessibility certification**: test keyboard order beyond the skip link, user zoom/assistive technologies, and real client content before publication.
6. Client/owner visual acceptance, production-quality content, release archive preparation and enforced branch restrictions remain outstanding. **No production merge, approval or deployment was performed.**

### Cost accounting
- Known new paid API calls, purchased media, new subscriptions, premium CI runners and billable deployment operations initiated during this review: **none**.
- Actual aggregate incremental cash spend: **unknown, not C$0**. Billing statements, artifact-storage quota and external account invoices were not accessible to the reviewer; owner must verify before declaring the strict **<C$1** cap proven.
- Commercial C$5 per 100 generated-and-QA options is a policy ceiling, not proven commercial-scale throughput or billing. Ten prototype layouts do not constitute an unattended production factory.
- Production candidate release remains **blocked on visual/reference/owner approval and cost verification**, despite the green technical suite.

**Naming correction:** Factory 2.0 candidates have their own IDs F2-01 through F2-10 and are not the Momma Made V3 generation or an approved designs 21–30 release. No stable production numbering has been assigned.
