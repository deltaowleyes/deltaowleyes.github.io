# Momma Made V3 — Website Factory 1.2 Hosted Acceptance Evidence
Date: 2026-11-05 (Toronto local) / November 6 UTC
**Decision: HOLD. Version 2 remains the latest approved collection.** This audit does not authorize V3 promotion.

## Real GitHub-hosted CI outcomes
The draft, unmerged GitHub PR [#12](https://github.com/deltaowleyes/deltaowleyes.github.io/pull/12) provides a `pull_request` trigger for the existing V3 candidate workflow. It uses the standard public GitHub runner, does not purchase anything, and does not touch the current production gallery.

| Run ID | Hosted result | Evidence |
|---|---|---|
| [42137635270](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42137635270) | **FAIL** | Both Playwright tests failed on harness defects. Main QA expected a response from same-document hash navigation (which returns null). Reference capture selected two `.hero` elements (strict locator violation), resulting in 0/20 candidate captures, 18/20 raw reference captures. Artifact `13465858604`, 11,914,259 bytes. |
| [42138159399](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42138159399) | **PASS** | Exit successful. 10/10 candidate designs, 90 direct routes, 50 responsive width checks, demo interactions, image checks and 21 standard gallery/home screenshots passed. 20/20 candidate comparison screenshots; 17/20 reference screenshot captures. Artifact `13466529134`, 26,983,683 bytes. |
| [42138451232](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42138451232) | **PASS** | Later CSS update, 10/10 candidates passed, 90 routes, 50 responsive widths; 20/20 candidate comparison captures and 18/20 raw reference captures. Artifact `13467045713`, 28,269,388 bytes. |
| Subsequent PR verification | **See GitHub Actions** | Added off-site redirect detection and a privacy-rejection test after the above runs. Completion of those later checks is not established by the preceding run IDs. |

These results are actual job outcomes read from GitHub Actions logs and jobs; **they are not proofs of close inspiration matching**.

## Screenshot comparison — observed and repaired
Source shots were retrieved from the real GitHub screenshot artifact and inspected side by side with candidate shots at 1440×900 and 390×844. Important observations:
- **Atelier Ledger / Heath Ceramics:** Original candidate had a light craft split hero versus the dark cinematic homeware photograph on the reference. Revised to a dark craft-led split hero with existing original Momma Made photography. Latest post-repair candidate screenshot was inspected. Still not pixel-matched because its source products, art and branding differ.
- **Garden Folio / Block Shop:** Original candidate used an inset botanical arch against the reference's full-width photographed table linens and overlaid headline. Revised to a full-width textile photograph with centered editorial type using previously owned concept imagery. Later candidate screenshot inspected. Product category departments were also styled.
- **Pattern Studio / Rifle Paper Co.:** The captured `riflepaperco.com` screenshot actually displayed Google due an off-domain redirect and is **invalid source reference evidence** despite successful HTTP 200. A host-validation check now rejects this. Pattern-browsing cards and navigation exist, but visual parity remains unverified.
- **Weekend Market / Papier:** Candidate now has category navigation and an editorial shopping panel; source has broad stationery shopping. Meaningful visual and product-category differences remain.
- **Tidy Counter / MUJI:** Both feature practical daily-use goods, but source has dense catalogue navigation, changing sales hero and broader retail departments. We must not invent MUJI-style sales figures, product SKUs or guarantees.
- **Maker Field Notes / Schoolhouse:** Source has a cinematic bedroom hero and product-led categories. Candidate preserves notebook identity with supplemental image-led product departments; a creative adaptation, **not a strict replication**.
- **Utility Index / Package Free:** Source has a photograph-led laundry campaign, candidate a structured utility split and new photographic category departments. Fidelity incomplete.
- **Picnic Club / BAGGU:** Source design includes vivid multi-colour campaign bands and changing merchandise; screenshot content varied due hydration. Candidate shares energetic textile emphasis, not exact source composition.
- **Quiet Catalogue / Grovemade:** Hosted source returned **403**; desktop and mobile source proof unavailable. Candidate remains unverified.
- **Workshop Proof / Ocean Bottle:** Source screenshot had largely blank/black early loading. Treat as incomplete reference evidence rather than claiming match.

## Quality control improvements
- Added original custom V3 styling for `browse-nav`, `pictureDepartments`, `patternBrowser`, `papierEdit`, responsive card grids, focus and reduced motion.
- Tests assert these modules, route navigation, photos decode and minimum image dimensions, all 4 product card CTA tap targets are at least 44px, disabled checkout and simulated contact flows.
- Fixed Playwright bugs in same-document hash navigation, screenshot strict selectors and fail-fast process exit.
- Fixed photographic capture helper to recognize both direct CSS backgrounds and pseudo-element backgrounds.
- Privacy-consent behavior remains intact. New QA check rejects optional analytics, verifies localStorage persisted and no analytics loaded, and captures clean screenshots with privacy banner dismissed. **The privacy-specific test is not part of the successful runs above; requires newer run.**
- Source capture detects off-domain redirects to avoid counting Google or other unrelated pages as inspiration evidence. **The new source validation also requires its newer hosted run for confirmation.**

## Release blockers
1. Full reliable and inspected *current* inspiration screenshots at both viewports for all ten sources, including blocked Grovemade and invalid Rifle redirect. Comparison must be approved; screenshot capture alone is never an approval.
2. Hosted QA from the final source commit including current privacy and redirect checks, and manual review of the newest mobile and desktop output.
3. Independent live URL, 24 original media assets and deployment proof. Live `deltaowleyes.ca` access is blocked in this working environment; do not claim verified.
4. Billing/usage statements if **actual** incremental CAD spending needs proof. The cost ledger intentionally records actual spend as `null`, not zero.

## Budget
No paid API, new CMS, premium theme, subscription or other billable tool was intentionally enabled in this turn. Standard public GitHub Actions runner used. Development cap is **strictly below C$1 CAD aggregate** and the production-generation/QA target is **C$5 CAD per 100 options**. Actual provider invoice spending cannot be verified without billing records.

## Publication
**No V2 archive mutation, root redirect change, revision promotion or registry status change** has been made. V2 remains the live-approved target in repository metadata, V3 an unapproved public test candidate.


## Final hosted rerun — verified completed
- [GitHub Actions run 42138997739](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42138997739), job `127634251349`: **COMPLETED / SUCCESS**. This run includes reference-domain redirects and the privacy rejection tests. Its logs show 10/10 candidates passing the revised responsive, route, photo and interaction suite. All hosted steps completed successfully; no `##[error]` log entries.
- Artifact [13465984613](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42138997739/artifacts/13465984613), `mommamade-v3-candidate-visual-qa`, 31,336,885 bytes: **20/20 candidate** source-pair screenshots and **16/20 valid source** screenshots.
- Exact four source screenshot gaps: **Pattern Studio/Rifle Paper Co.** desktop and mobile redirected offsite to `google.com` and are correctly rejected; **Quiet Catalogue/Grovemade** desktop and mobile returned HTTP **403**.
- The gallery and candidate screenshots no longer display the initial analytics consent overlay because the test selected **Reject analytics**. The test verifies saved rejection and no analytics initialization; all preserved privacy controls remain operational. Standard mobile screenshots intentionally capture the expanded navigation after testing it; the reference-comparison mobile screenshots capture the default collapsed navigation for parity analysis.
- A successful GitHub Chromium result establishes **technical candidate QA**, **not** approved inspiration fidelity. The exact remaining source gaps above and unresolved design/layout differences mean `human_reference_comparison` remains `PENDING` and `promotion_authorized` remains `false`.
- Direct access to `https://deltaowleyes.ca/mommamade/v3/` and `https://deltaowleyes.ca/mommamade/` remained blocked from the available independent live-site verification tool, so production HTTP and deployed asset status cannot be certified.
