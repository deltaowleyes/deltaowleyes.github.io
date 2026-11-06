# Momma Made — Website Factory 1.4 visual acceptance and conditional-release audit
Date: November 5, 2026 (Toronto local) / November 6 UTC

**Decision: HOLD.** Revision 2 remains the current gallery; Revision 3 is still an unapproved candidate. No user acceptance of outstanding source-fidelity exceptions was supplied.

## Repo and release method
- Developed on isolated, **unmerged** [draft PR #14](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/14), branch `qa/mommamade-v3-1-4-fidelity-93be90b`, because unrelated changes advanced `main` during this BAKE. Do not substitute branch screenshots for public deployment.
- Preserved `/mommamade/` → `/mommamade/v2/`, original V1 archive, V2 imagery, privacy consent, no live checkout, simulated forms, and all unrelated files.
- Added `reference-fidelity-1-4.css` to **V3 candidate only** for source-inspired composition corrections using existing original Momma Made WebP assets. No external brand assets, downloaded photography, proprietary styles or copied promotional claims.
- Added Chromium regression checks for the original hero photo composition at five widths. Fixed stale `grid-column:2` assignment for Weekend Market. First hosted test run failed this actual layout issue; the repaired run passed.

## Independent GitHub-hosted technical QA and artefacts
- **PASS**: [run 42153765120](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42153765120), hosted job complete with no failed steps; 10/10 candidates, 90 direct route checks, 50 responsive-width checks, 24 existing photo files checked/decoded; 21 normal design/gallery screenshots.
- Artifacts: `mommamade-v3-candidate-visual-qa`, ID **13472953303**, **6,043,648 bytes**, 3-day retention. It includes 20/20 V3 candidate desktop/mobile comparison screenshots and 16/20 valid official-source desktop/mobile screenshots. Paired reference capture is **evidence, not source parity approval**.
- Historical failed run: **42153547957**, `design 8 cinematic image too narrow`, repaired in `reference-fidelity-1-4.css`.
- Confirmed local screenshot review of the full updated 1440x900 and 390x844 candidate set and available source screenshots. No observed mobile photo-order regression in the inspected current screenshots.
- The GitHub-hosted **public live smoke test passed** for currently deployed `/mommamade/v3/`, JS, base CSS, **1.3 CSS**, and the root `/mommamade/` still pointing to V2. **1.4 CSS is on unmerged branch and is NOT confirmed deployed**; passing public URLs are not 1.4 publication proof.

## Legitimate current reference-source attempts
- Rifle Paper Co.: tried official `https://riflepaperco.com/pages/shop-by-pattern` in the automated capture. Both official screenshot requests redirected to `google.com`, so **0/2 valid current source screenshots**; the legitimate source HTML/navigation is publicly readable and confirms a large pattern-led shopping catalog. Do NOT count redirects as visual evidence.
- Grovemade: tried official `https://grovemade.com/home/`. Both requests returned **HTTP 403** in Chromium, so **0/2 valid current source screenshots**; actual current HTML/navigation is publicly readable. Historical Shopify screenshots are design research only, not proof of current desktop/mobile composition.
- Remaining eight references: 16/16 valid browser screenshot captures at requested viewports. Their comparisons require visual approval; passing screenshots alone is not approval.

## Ten candidate visual reviews

| # | Design and source | 1.4 result | Remaining difference / approval |
|---|---|---|---|
| 21 | Atelier Ledger / Heath Ceramics | Moved from split panel to dark, photograph-dominant hero with restrained centered type; mobile image first | Source is a dark table scene with text on image; candidate uses original bright wrap photograph and text separate on mobile. **Not approved** |
| 22 | Picnic Club / BAGGU | Added original multicolour promotional-style ribbon to full-bleed photographic campaign | BAGGU uses models and multicolour repeated product/retail image groupings, not just a picnic still life. **Not approved** |
| 23 | Utility Index / Package Free | Enlarged practical photographic panel; preserved discoverable product departments | Source has product-led, lavender campaign background and text floating on same image, rather than the candidate's split grid. **Not approved** |
| 24 | Garden Folio / Block Shop | Existing image-led textile campaign remains closest structurally | Original source is kitchen tabletop scene with merchandising directly below; product types and crop differ. **Plausible composition, not approved** |
| 25 | Pattern Studio / Rifle Paper Co. | Pattern browsing raised on the page in 1.3; four original concept looks retained | Source has many legitimate patterns; current source screenshot unavailable, so **not verifiable or approved** |
| 26 | Tidy Counter / MUJI | Kept quiet utility/bento design and practical categories | Actual source has much denser retail navigation and its own campaign, unlike minimalist split. Copying live discount claims prohibited. **Not approved** |
| 27 | Maker Field Notes / Schoolhouse | Changed to dark photographic hero with simple overlay; kept ruled-paper notebook later | Source uses wide bedroom/lifestyle photo and an overlay headline; candidate shows existing original scrubby photo. **Not approved** |
| 28 | Weekend Market / Papier | Changed to dark editorial image campaign, preserved four category links and below-hero product gallery | Source features actual stationery editorial and seasonal imagery, candidate is towels; **not approved** |
| 29 | Quiet Catalogue / Grovemade | Existing image-first, clean product still-life and centered editorial copy passed mobile ordering regression | Source's real workspace materials, category hierarchy and current screenshot unavailable. **Not verifiable or approved** |
| 30 | Workshop Proof / Ocean Bottle | Changed to original dark, photo-dominant utility hero with bold overlay and demo-only CTA | Source uses a differently cropped dark video/campaign. No environmental metrics or product claims copied. **Not approved** |

This is a structured human review of composition and behavior, **not a quantified visual-similarity score**, and no user-design approval has been recorded. For several named references the concept is still an interpretation, not a faithful page-level recreation.

## Explicit outstanding release gates
1. Obtain current usable official desktop/mobile screenshots for Rifle and Grovemade (or **explicit owner approval to accept both as exceptions**).
2. Obtain explicit quality approval for all ten final design directions or repair them to the owner's premium standard. Source screenshots were actually reviewed for only eight references.
3. If approved, merge reviewed candidate changes, run fresh GitHub-hosted Chromium on the new main commit, independently verify **1.4 CSS and screenshots live**, then archive the still-working V2, atomically update revision history/root/registry, and verify root now points to V3. None of these promotion actions are authorized yet.
4. Actual provider-billing records were not accessed. Cash spending remains **unknown**, not verified C$0.

## Cash policy
Development spending ceiling remains **strictly less than C$1 aggregate incremental CAD**, production target **C$5 incremental per 100 template options**. This BAKE intentionally initiated no paid API calls, CMS subscriptions, premium asset purchases, paid media, or billable upgrades. The GitHub Actions run used the existing public standard runner; billing statements and charges across providers **not independently checked**, so the aggregate monetary cap is not invoice-verified.
