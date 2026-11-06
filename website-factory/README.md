# Website Factory 2.1 — ten truly differentiated six-view concept sites

**Candidate-only experiment. Not approved for production or public routing.**
- Review branch: `factory2/fullsites-2-1-2026-11-05` built from pinned main `2fa4a0e0810be8e18e3b7e891241426c2f7b9bb7` while preserving all existing live assets, metadata, directories, Momma Made V1/V2/V3 and Shut Your Trap.
- Source: Factory 2.0 reviewed original CSS hero directions, rebased into ten six-page concept sites. Unlike V2, **navigation, collection, care, story and contact structures are distinct** for each candidate.
- Routes per candidate: `index.html`, `shop.html`, `product.html?item=wraps|cloths|scrubbies|bags`, `care.html`, `about.html`, `contact.html`.
- Each candidate has a separate `site.css`, original CSS shape assets, unique page compositions and native accessible controls. All demo pages are noindex/nofollow. The client-side script `website-factory/assets/preview.js` handles local filters, local search, product illustration moods, and simulated confirmation. **No form submission, storage, checkout or external HTTP service** is implemented.
- No purchased images, external CSS libraries, API keys, credentials or licensed reference photography. Previously reviewed CSS motifs only. Copyright/visual fidelity against any named third-party site is **not verified** without actual reference screenshots; do not claim parity.
- Each named product, materials, stock, dimensions, care claims and business biography requires client confirmation before being promoted.

## Structural differences (not just theme swaps)
1. **Field Notes** — Editorial chaptered notebook and object index.
2. **Countertop Mosaic** — Tile-wall marketplace and colour-coded browse shelf.
3. **The Daily Ledger** — Ruled utility ledger and product facts table.
4. **Still Life Studio** — Still-life gallery diptych and art-sequenced collection.
5. **Ritual Route** — Routine journey, progressive stations and step guide.
6. **White Space Works** — Large typographic negative space and minimal object presentation.
7. **Patchwork Press** — Graphic zine collage, posters and energetic story spreads.
8. **Orbit Home** — Circular reuse diagram with orbital nodes and care wheel.
9. **Pantry Atlas** — A–Z taxonomy-led navigation, index and glossary.
10. **A Letter Home** — Letterpress correspondence, open letters and small collection notes.

## QA
Runs on free standard Ubuntu 24.04 GitHub-hosted runner, Playwright Chromium and open-source axe-core:
```sh
python3 -m http.server 8765 --bind 127.0.0.1
node website-factory/tests/fullsites.qa.cjs
node website-factory/tests/fullsites-a11y.qa.cjs
node tests/web-design-revisions.qa.cjs
node tests/website-factory-cost-guard.cjs
```
Fullsite QA checks 60 pages x 6 viewport widths = 360 responsive checks, verifies ten distinct nav/shop/care/about/contact structures, 60 desktop/mobile screenshots, local filter/search/product toggles, no outbound submit, and JS errors. Axe scans six pages across 2 widths for ten concepts = 120 automated WCAG runs, plus keyboard skip. Axe does **not** certify complete accessibility.

## Release and cost boundaries
- Current Momma Made approved V2 must remain current; original V1 archived and separate V3 remains an unapproved candidate. Factory 2.1 is separate and **not** V3.
- Aggregate incremental development must remain **strictly below C$1**, not reset per BAKE. Commercial creation+QA target is **no more than C$5 per 100 options**, still commercially unverified.
- Actual verified cash spend stays **unknown** without billing statements. No user-owned API or billable tools authorized. Keep CI public standard runners; stop on quota exhaustion.
- Before a production merge: owner approves visual and content; confirm full reference/license review; assess custom imagery needs; verify actual spend; rebase latest main and rerun QA; ensure branch review protection and archive-first rollback.
- No changes are made to the existing live site by a branch-only commit.
