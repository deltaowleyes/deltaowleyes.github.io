# Factory 2.1 — final visual and release review
Status: **OWNER APPROVAL PENDING — DO NOT MERGE OR DEPLOY**

## Evidence provenance
- Original Factory 2.1 final-polish commit: `c4aa0be3d66596d6d47ee879cf91e0fb6b8411b1`.
- Its successful all-ten [GitHub Actions run #42140701891](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42140701891) verified 60 routes, 360 responsive width checks, 60 desktop/mobile screenshots, 120 axe WCAG scan pairs, mobile gallery bounds, hero CTA readability, internal anchors, contact demo no-submission, no JS errors, archive integrity and cost-policy preflight.
- This branch is **rebuilt from production main snapshot `9bb410394f81d6c1089fe01ab97e1841ec26e30d`** and exact original website-factory directory SHA `7555475d578dc216ca5e190830bafc4bda3fbe6c`. The initial commit `9bb410394f81d6c1089fe01ab97e1841ec26e30d` changed only website-factory and its dedicated workflow.
- The branch-specific Chromium acceptance run must be checked independently before approval.

## Comparison
Current registry: Momma Made V1 archived, V2 approved/latest and V3 unapproved candidate. All three kept intact.
- **V2** — 10 full demo stores and 24 project WebP photos, editorial/retail concepts. Original reference parity not formally verified.
- **V3** — 10 full demo stores using existing project photo assets and inspiration links. Third-party reference screenshot matching still subject to separate acceptance.
- **Factory 2.1** — 10 independent six-page sites (60 routes) with structurally distinct headers, collections, care, story and inquiry preview layouts and native filters. Visuals are almost entirely CSS geometric objects, not completed client product photography.
- Distinct layout directions can overlap V2/V3 concept names, without any evidence of direct code or media copying. In particular: Field Notes / The Maker Notebook / Maker Field Notes; Daily Ledger / Atelier Ledger; Countertop Mosaic / Pattern Studio; Pantry Atlas / Utility Index.
- Local `website-factory/tests/revision-comparison.cjs` captures paired desktop/mobile baseline screenshots for all ten V2 and ten V3 designs so the owner can visually compare all three generations; captures are evidence, not approval.

## Rights and cost
Factory pages and scripts contain no imported third-party images, fonts or retail source code; only original CSS geometry and the site's existing local privacy integration. This is **not** independent legal clearance for trade dress or business imagery. V2/V3 rights and third-party references require their own licensing review.
No paid API, paid media, premium CI runner, subscription or new billable cloud service was invoked. Standard public repository GitHub runners only. Billing statement and artifact-storage allowances were not available, so actual **cumulative** incremental development cash is **unknown, not zero**, despite the policy requiring strictly less than C$1.
The C$5 per 100 commercial generation/QA option limit remains unproven; no unattended inference engine or scale billing test was performed.

## Release blockers
Owner visual approval of all 30 concepts; real maker-approved photos and product/care facts; source-site reference screenshot assessment; complete keyboard/assistive tech/manual accessibility audit; billing statement; proper branch protection; precise latest-main revalidation immediately before any future release. No gallery promotion, main merge or live deployment has been authorized.
