# Momma Made V3 — Reference-fidelity repair 1.2
Date: 2026-11-05. Status: **REPAIRED STRUCTURE / CANDIDATE ONLY**.

## Evidence standard
Reference-site **textual/navigation evidence** was retrieved from public pages. Matched desktop/mobile screenshots of the **actual external live pages** were NOT obtained. Do not call any candidate a visual match or approve promotion until two-view screenshot pairs are reviewed. Current visual QA contact sheets from the previous isolated local run predate the 1.2 CSS correction and MUST NOT be represented as post-repair screenshots.

## Confirmed issue fixed
The repository already generated `browseNav`, `pictureDepartments`, `patternBrowser`, and `papierEdit` modules in `mommamade/v3/site.js`. The earlier `site.css` had **no selectors** for `.browse-nav`, `.reference-departments`, `.department-grid`, `.pattern-browser`, `.pattern-grid`, or `.papier-edit`. These modules would render as largely unstyled generic blocks, failing composition fidelity. `reference-fidelity-1-2.css` supplies their layout, spacing, image treatment, responsive behavior, focus states and reduced-motion handling. V3 index now loads it after base CSS.

## Current reference-to-candidate evaluation
| Candidate | Reference (source) | Evidence-supported design language | Implemented / remaining |
|---|---|---|---|
| 21 Atelier Ledger | https://www.heathceramics.com/pages/home | Editorial craft, carefully curated housewares, material/story hierarchy | Existing asymmetric editorial concept retained. Exact desktop/mobile geometry NOT VERIFIED. |
| 22 Picnic Club | https://baggu.com/collections/new-arrivals | High-colour photo merchandising and patterned collection variations | Full-bleed campaign layout retained; merchandise breadth differs. Exact parity NOT VERIFIED. |
| 23 Utility Index | https://packagefreeshop.com/collections/full-price-minus-gift-card | Department navigation and categories such as Food Storage, Home Cleaning and Kitchen Cleaning | `browseNav` + `pictureDepartments` given styled hierarchy; no invented products. Screenshot parity NOT VERIFIED. |
| 24 Garden Folio | https://www.blockshoptextiles.com/ | Deep Tabletop/Kitchen, rugs, fabric and home textile groupings alongside visual campaigns | `pictureDepartments` rendered as three photograph-led kitchen categories; editorial arches retained. Screenshot parity NOT VERIFIED. |
| 25 Pattern Studio | https://riflepaperco.com/pages/shop-by-pattern | Pattern-first discovery with many motif pathways and associated merchandise | Four **illustrative concept looks**, each linked to a real internal product-concept route, visually merchandised. No claim of real variants or fabricated catalog. Screenshot parity NOT VERIFIED. |
| 26 Tidy Counter | https://www.muji.us/collections/kitchen-dining | Functional categories for storage, tableware, utensils and daily routines | Three clean department tiles and bento merchandising now styled. Screenshot parity NOT VERIFIED. |
| 27 Maker Field Notes | https://schoolhouse.com/ | Product-led editorial site, favorites, Shop by Category and Shop by Collection | Category picture departments now styled in addition to original maker-notebook storytelling. Screenshot parity NOT VERIFIED. |
| 28 Weekend Market | https://www.papier.com/ca/stationery/all-stationery/ | Editorial consumer shopping and category/product navigation, filters, colour/style browsing | Added clean four-category editorial panel and photo feature; replaced market-stall-only hero layout with split merchandise editorial layout. Named concept retained. Screenshot parity NOT VERIFIED. |
| 29 Quiet Catalogue | https://grovemade.com/home/ | Materials-led image typography, premium whitespace, curated products | Existing sparse editorial/product index retained. Screenshot parity NOT VERIFIED. |
| 30 Workshop Proof | https://oceanbottle.co/ | High-contrast product messaging and prominent category navigation | Existing bold hero and category stripe retained; do not copy Ocean Bottle impact metrics or guarantees. Screenshot parity NOT VERIFIED. |

## Acceptance updates
- `tests/mommamade-v3.qa.cjs` verifies the new CSS file responds 200 in GitHub-hosted test server, top navigation links exist for every design, reference department modules are present and non-empty for applicable concepts, pattern browse has four concept links, and Papier editorial module has four navigable categories, at **five viewport widths**. Screenshot test still checks image decoding and 44-pixel product CTA targets.
- The old **isolated local tests** were passed before this CSS work; **the revised GitHub-hosted tests have not been observed running**.
- The GitHub Actions connector only exposes job/log/artifact data after a run ID. Run ID discovery and direct access to GitHub Actions/public deployment are unavailable in this session. This is a **verification blocker**, not a presumed success/failure.

## Release decision
**HOLD**. Keep V2 latest, V3 candidate, preserve V1, V2 and privacy scripts. No unrelated data changes. No new API charges or services intentionally initiated. Actual provider billing remains unverified.
