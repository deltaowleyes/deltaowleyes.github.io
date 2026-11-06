# Website Design Studio 3.1 — Three Delta Owl Eyes redesign candidates

**Status:** all three are candidate front pages with functioning navigation into existing Delta Owl Eyes routes. They are **not** three independently complete multipage client websites. No production merge or deployment. Owner premium visual acceptance remains withheld.

## Provenance and reuse
- River Voice uses the verified 3.0 factory and previously committed editorial content.
- Accountability Ledger and Owl's Lens Media Hub are preserved original design structures from the earlier experimental feature branch `feature/doe-studio-2-editorial-restart`. Their independent HTML/CSS/JS templates now live in `studio2/factory/templates/` and are processed in one factory workflow. No third-party website source was copied.
- Existing source imagery is reused with truthful native dimensions and SHA-256. Ledger now uses a conceptual AI forest from the Shut Your Trap original-asset archive; Owl's Lens uses the project's original SVG microphone/brand illustration and an existing conceptual landscape for the supporting section. Neither is represented as documentary photography of news subjects or actual recording facilities.
- The River Voice hero still uses `assets/wetlands.png`, which has embedded lettering. Article illustrations are still graphic placeholders. **Do not claim the three concepts match the premium six-panel inspiration image.**

## Three distinct structures
1. River Voice / cinematic editorial: photographic narrative hero, gold topic rail, lead-news story grid, TRC education, directories and media programming.
2. Accountability Ledger / investigative: sharp documentary type hierarchy, dark split-screen hero, red TRC count panel, evidence-navigation blocks and editorial methodology explanation.
3. Owl's Lens Media Hub / video-first: dark programme hero with separate decorative microphone image region, show/category browsing modules and media content discovery.

The studio selector at `/studio2/factory-previews/` links to the first River Voice factory preview and the two other isolated candidates.

## Automation
- `studio2/factory/build_three.py` runs the audited River Voice generator and assembles the two other source layouts.
- WebP assets are generated from existing verified repository files; output/source SHA-256, native pixel dimensions and compressed sizes are recorded. No upscaling or invented file provenance.
- `studio2/factory/qa_three.py` checks 3 × 4 viewports, image decode/serving, consent rejection, disabled analytics, keyboard/touch nav, no horizontal overflow, main H1, alt text, link labels and selected internal routes.
- One workflow `.github/workflows/studio2-factory.yml` validates the prior photo importer contract, the old candidate, the River Voice factory pilot and all three generated candidates. Artifacts include optimized binaries, HTML/CSS/JS, manifests and 20 viewport screenshots (4 original + 4 factory regression + 12 three-site comparisons).
- GitHub Actions permission is `contents: read`, with no release, Git push, Pages or paid AI calls. Running this workflow repeatedly may consume free runner entitlement; provider billing has not been independently verified.

## Visual release blockers
- No original high-resolution photo series matching the reference's cinematic owl/hawk quality.
- Original hero imagery sometimes contains baked-in brand text (River Voice) and visual placeholders remain.
- No demonstrated separate article, investigation detail, podcast episode or directory page built inside each candidate. Shared links currently go to existing live production pages; working navigation is not equivalent to a full independent functional site.
- No independent full WCAG 2.2 audit, deep screen-reader and color-contrast audit, Core Web Vitals or real-device QA. The browser smoke checks are preliminary.
- No user-approved final website or visual acceptance; no merge or deployment.
- One-hour fully automated production and C$5 per 100 options remain unverified targets.

## Next engineering stage
Run design-level acceptance per candidate, improve true photographic assets and create genuinely separate internal content views; then make a reusable multi-route generator that serves feature-rich standalone demos rather than linking to the live site for substantive content. Extend automated tests to those subroutes, screenshots and user journey selection/inquiry. Verify runner usage and actual cash costs before scaling to 36 sites.
