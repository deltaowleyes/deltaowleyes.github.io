# Factory 2.1 — six-view structural audit (Nov 5, 2026)

## Source and scope
- Base main snapshot: `2fa4a0e0810be8e18e3b7e891241426c2f7b9bb7`; prior reviewed Factory 2.0 commit: `07eb6b62d2e5d150414590d6ee867d9ab4598068`.
- Isolated branch: `factory2/fullsites-2-1-2026-11-05`.
- Ten completely separate concept locations. 60 HTML pages, ten CSS bundles, a single no-network demo-control script, tests and workflows.
- Approved Momma Made V2 stays current; V1 archived; Momma Made V3 retains candidate status. Shut Your Trap, Delta Owl Eyes privacy consent scripts, directories and data were not edited.

## Why Factory 2.0 failed design differentiation
All ten had byte-identical primary-navigation markup and byte-identical collection/care DOM markup below the hero. The new six-view branch contains independent header, card hierarchy, care composition, brand story and contact structure per concept, with only small safety and accessibility helpers shared.

## Interaction safety, privacy and rights
- Collection search and filters operate only on DOM in the visitor's browser.
- Product preview query parameters are allowlisted; mood buttons change only original CSS illustration styling, not any shopping choices.
- Inquiry **has no HTML form and no network sender**; local button produces fake confirmation then clears inputs. It is not a booking or sales form.
- All media are originally composed CSS shapes; no third-party image files were introduced. Brand story, price, material, certification, inventory and claims remain illustrative and explicitly unverified.
- Copyright and source-site structural fidelity beyond code/source audit remain **unverified**. Do not infer legal clearance for visual resemblance from lack of third-party assets.

## Tests and evidence
- `website-factory/tests/fullsites.qa.cjs`: 60 pages, 360 responsive width measurements, 60 real screenshots, per-site functional controls and JS/network safety, structural uniqueness fingerprint tests.
- `website-factory/tests/fullsites-a11y.qa.cjs`: 120 automated desktop/mobile WCAG scans and keyboard skip-link tests. A pass is **not** complete WCAG certification.
- `.github/workflows/website-factory-2-1-fullsites.yml`: standard Ubuntu 24.04 public runner, no paid services.
- `tests/web-design-revisions.qa.cjs` and `tests/website-factory-cost-guard.cjs`: preserve approved release versions, archive assets and existing hard cost policy.
- QA results and screenshot artifact IDs must be recorded from actual GitHub Actions logs, not inferred from writing these files.

## Costs
- No known new subscription, commercial theme, licensed photo or paid inference API used in this stage.
- Actual aggregate incremental spend remains **unknown** without provider billing; strictly less than C$1 is mandatory and cumulative.
- C$5 per 100 full sites is a commercial cap, not validated by this small development batch.

## Open blockers
Owner visual approval, commercial-quality media and verified maker content, reference screenshot/license review, real accounting/billing evidence, production-grade accessibility/manual audit, updated latest-main rebase prior to any release, and enforcement of branch review protection. **No merge to main or deployment is authorized.**
