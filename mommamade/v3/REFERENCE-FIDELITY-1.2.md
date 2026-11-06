# Momma Made V3 — Website Factory 1.2 Reference-Fidelity Repair
Audit date: 2026-11-05 (America/Toronto) | Release status: **HOLD** | Approved current: **V2**

## Evidence type and limitations
Official inspiration sites were inspected for current **navigation, collections and content structure** through retrieved public HTML. Remote source **browser screenshots at matched 1440×900 and 390×844 viewports were not retrievable** in this environment. Reference fidelity is **not signed off**. Do not characterize structural similarity as pixel-accuracy or use brand photography, logos, text or source CSS. All repairs use original Momma Made markup, CSS and the project's existing WebP images.

The linked screenshot workflow at `.github/workflows/mommamade-v3-candidate-qa.yml` exists but the connected GitHub integration returned no workflow-run identifier for its commit queries; this integration's commit lookup is PR-run-limited and cannot prove push-run outcome. Thus **no hosted run ID, logs, artifact or live deployment verification** is available for this release.

## Repaired source-informed information architecture

| # / design | Public reference (reviewed) | Grounded composition finding | Original V3 repair | Release parity |
| --- | --- | --- | --- | --- |
| 21 Atelier Ledger | https://www.heathceramics.com/ | Artisanal homewares organized by ceramics and tabletop/kitchen departments | Added item-specific collection bar and storage/textile groupings, preserving spare editorial hero | UNVERIFIED |
| 22 Picnic Club | https://www.baggu.com/ | Product campaign with reusable-bag/accessory category entrypoints | Added snack-bag, wraps and care-category navigation; retained immersive original photo | UNVERIFIED |
| 23 Utility Index | https://packagefreeshop.com/ | Functional Cleaning & Home, Kitchen & Laundry and Shop All discovery | Introduced three photographic departments and category rail before functional index | UNVERIFIED |
| 24 Garden Folio | https://www.blockshoptextiles.com/ | Merchandising-led Homewares, Tabletop & Kitchen, and textiles navigation | Added three distinct illustrated departments and a kitchen-goods nav; retained arch story composition | UNVERIFIED |
| 25 Pattern Studio | https://riflepaperco.com/pages/shop-by-pattern | Shop-by-pattern with illustrated pattern categories and rich product rails | Added four original-photo concept palettes with links to product views; labeled styles as **illustrative, not actual colourways or stock** | UNVERIFIED |
| 26 Tidy Counter | https://www.muji.us/ | Category-organized home shopping with broad search, storage and kitchen | Added minimalist functional departments and catalog-category rail ahead of bento composition | UNVERIFIED |
| 27 Maker Field Notes | https://schoolhouse.com/ | Merchandise-first Homewares/Decor catalog with prominent department navigation | Added three original kitchen/homeware departments while preserving unique ruled-note editorial identity | UNVERIFIED |
| 28 Weekend Market | https://www.papier.com/ | Curated thematic collections, photo books and stationery product rails | Reworked full-bleed hero to light split editorial format, four themed links, featured image/product copy; retains original market section as secondary | UNVERIFIED |
| 29 Quiet Catalogue | https://grovemade.com/ | Premium restrained materials collections and highly browsable product families | Added collection/type navigation, preserved text-first minimalist product index | UNVERIFIED |
| 30 Workshop Proof | https://oceanbottle.co/ | Technical product categories plus impact explanation and commerce entrypoints | Added practical category navigation while keeping original spec-focused demo and no fabricated impact claim | UNVERIFIED |

## Local QA evidence — separate from hosted acceptance
- 10 structurally distinct V3 candidates with original category, pattern or departmental navigation.
- Isolated Chromium used local **source-equivalent development mirror**, previously generated original WebP image bytes and page.set_content. URL navigation to a local HTTP server was blocked by the browser environment.
- Local test suite: **50 viewport geometry checks** (320, 390, 768, 1024, 1440 px), **90 SPA route checks**, **20 desktop/mobile screenshots**, no confirmed horizontal overflow or page-JavaScript exceptions; all product “View details” targets at least **44 px**.
- Demo search, category filter, product mood selector, mobile menu and disconnected inquiry confirmation passed in isolation.
- Source-image Git blob hashes for sampled V2 photographs matched GitHub. Images use existing project media, no purchased photographs.
- Real GitHub Actions runner test, source-page screenshot side-by-side parity, keyboard audit beyond basic controls, full WCAG compliance and live deployment **remain unverified**.

## Confirmed defects fixed this BAKE
1. Distinct inspiration-category pathways missing or weak in V3: introduced original collection navigation and themed departments.
2. Candidate 28 used a full-bleed market-style home hero markedly unlike Papier's curated editorial storefront. Reworked hero to a lighter split format, added browse-first theme rails and product feature.
3. Existing Chromium `verifyPhoto('.gallery-image')` false failure: gallery uses a **direct background-image**, while the check only examined `::before`. Added computed-style fallback.
4. New collection-nav touch targets initially measured 40 px desktop / 38 px mobile. Raised minimum to 44 px across breakpoints.

## Gates required before promotion
1. Obtain hosted Actions workflow run ID, job conclusions/logs and the uploaded screenshots.
2. Visually compare each actual source page with each candidate at matched desktop/mobile viewport sizes, with documented pass/fail decisions and defect repairs; current parity entries deliberately remain **UNVERIFIED**.
3. Execute full hosted integration tests on latest committed source, check keyboard/focus and image loading, and independently verify `https://www.deltaowleyes.ca/mommamade/v3/` publicly.
4. Reconcile charges against actual provider billing/usage statements if asserting cash expenditure. Unknown is not zero.
5. Archive *all* functioning V2 assets before any promotion; then update root, revision index and registry in one reviewed release with post-deployment verification. **Do not promote until every gate passes.**
