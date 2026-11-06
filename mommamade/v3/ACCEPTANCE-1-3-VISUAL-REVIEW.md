# Momma Made Website Factory 1.3 — visual review and conditional acceptance
Date: 2026-11-05 (America/Toronto). Status: **HOLD — V3 candidate; V2 remains latest.**

## Evidence inspected
- Actual GitHub Actions run **42138997739**, artifact **13465984613**: ten 1440×900 candidate captures, ten 390×844 candidate captures, 16 valid live-source browser captures (8 sources × 2). Public browser screenshots were paired by candidate name and viewport and manually inspected. The photos/branding of source businesses are **comparison references only**, not redistributable design assets.
- The missing **Rifle Paper Co.** source capture redirected off its official domain to Google; **Grovemade** returned HTTP 403. Their current matched browser screenshot pairs **remain unavailable**. The official source HTML/text is accessible through research, and historical *third-party* screenshots exist (e.g. Shopify Grovemade examples, Pact Studio and Catalog for Rifle), but historical/other-page captures are **not** a substitute for present-day matched screenshot evidence.
- Original Momma Made V3 site content, reference styling modules and five-width hosted QA were reviewed. Final 1.3 CSS changes postdate artifact 13465984613, so those earlier images are baseline—not the final post-repair screenshot proof.
- The previous hosted **candidate technical run passed**. Hosted regression and live URL checks for the 1.3 commit must be evaluated separately.

## Pairwise desktop/mobile visual review and design issues

| # | Concept / original source | Desktop reference-to-V3 review | Mobile reference-to-V3 review | 1.3 disposition |
|---|---|---|---|---|
| 21 | Atelier Ledger / Heath Ceramics | Reference dark, nearly full-bleed table scene with small overlay; V3 uses a dark-green split and floral wrap product photo. Brand-safe product photo differs, but editorial craft style is plausible | Reference image-first with small on-photo type; V3 has copy-first block | Creative adaptation; **not matched** |
| 22 | Picnic Club / BAGGU | Reference high-colour model mosaic and moving/stacked promo bands; V3 full-bleed picnic image + centered slogan | Both foreground large campaign photo, but V3 category flow differs from reference's multi-tile storefront | Structurally distinct; **not matched** |
| 23 | Utility Index / Package Free | Source uses one large, bright detergent package photo with floating text; V3 split merchandising and utility category section | Reference large product campaign; V3 text-block-then-photo | Added photo-led departments earlier; **not matched** |
| 24 | Garden Folio / Block Shop | Reference textile tabletop with overlaid serif headline; V3 uses full-width textile still life with headline, visibly closer | Both image-first lifestyle text overlays; V3 has different crop and mobile navigation | Composition reasonably aligned but **not approved** |
| 25 | Pattern Studio / Rifle Paper Co. Shop By Pattern | **No valid official screenshot**. Official page is a large, pattern-first grid; original V3 hero consumed most first viewport | **No valid official screenshot**. V3 pattern grid sat well below split hero | 1.3 shortens hero and moves visual-pattern merchandising earlier. Screenshot verification pending |
| 26 | Tidy Counter / MUJI | Reference store hierarchy, category search and time-limited promotional slate; V3 calm task-oriented bento and original scrubby photography. No sales claims copied | Reference dense sticky header and promo; V3 compact practical department navigation | Originality and usefulness preserved; **not matched** |
| 27 | Maker Field Notes / Schoolhouse | Reference large bedroom photograph and product-led shopping; V3 ruled-notebook copy and styled craft image | Reference image-first seasonal campaign, V3 note-first paper effect | Supplemental photo departments exist; creative departure, **not matched** |
| 28 | Weekend Market / Papier | Source cinematic stationery hero and editorial tile navigation; V3 pale split hero of homeware products | Reference dark image-first campaign; V3 headline then photograph; source product categories differ | 1.2 introduced browsable editorial collections and split layout; **not matched** |
| 29 | Quiet Catalogue / Grovemade | **No valid official screenshot**. Historical Shopify screenshots show large full-width workspace image with centered headline below; V3 previously had a narrow right-side photo | **No valid official screenshot**. V3 previously had text first, tiny photo following | 1.3 switches to dominant full-width original textile photo, centered text beneath, including mobile. Screenshot verification pending |
| 30 | Workshop Proof / Ocean Bottle | Source dark full-bleed image partially hidden by email signup overlay; V3 dark, bold original goods split hero | Source dark image-first campaign; V3 technical text-first split | Do not copy modal offer, discounts or impact claims. **Not matched** |

The comparison is **composition-oriented**, not a pixel-similarity score. Real client products and original owned images take precedence over pretending to sell the source brands' products. Visual approvals cannot be inferred from green QA.

## 1.3 code and test changes
- Added `reference-fidelity-1-3.css`: compressed Pattern Studio cover and elevated the four pattern-like concept collection links. Quiet Catalogue is now image-led with near-full-width photo and centered copy underneath, with specific mobile rules. All original brand assets remain owned/generated.
- Added hosted Playwright assertions to check 1.3 CSS is served, Pattern Studio grid is visible near the first viewport, Quiet Catalogue photo leads text, and prior 90 routes, 50 widths, 24 photos, privacy rejection, no live checkout, contact demo and 44px tap targets still work.
- Added `tests/mommamade-v3-live-smoke.cjs` and an `if: always()` GitHub Actions step to independently request public V3 HTML, JS, CSS, 1.3 CSS and the main V2 entrypoint. Script emits a JSON report; inability to fetch is a **failed external verification**, not success.
- Draft QA PR **#13** triggers pull-request testing of latest main without merging or publishing V3.

## Final release gate
**V2 remains latest; V3 candidate.** Release requires final GitHub hosted QA success with current 1.3 source, screenshots and logs inspected; missing source reference evidence explicitly resolved or accepted as exceptions by owner; reference-fidelity inspection and approval; V3 live content and assets verified; privacy and demo-only behavior intact; and actual billing evidence if the aggregate spend must be verified. Never replace the root until all gates clear.

## Cost policy
C$1 aggregate incremental development spending (strictly less), C$5 incremental generation/QA per 100 commercial options. No paid API/subscription/CI runner/third-party asset purchase intentionally initiated in 1.3. **Actual provider charges: unknown (not C$0 verified).**
