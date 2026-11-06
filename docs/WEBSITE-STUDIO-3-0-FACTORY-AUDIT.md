# BAKE PRO — Website Design Studio 3.0: Verified automation reset

Date: 2026-11-06
Branch: `feature/doe-studio-2-redesign-pilot`
Factory CI: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42219633438
Artifact ID: `13503255904` — `doe-studio3-river-factory-UNPUBLISHED`
**Technical build/QA acceptance: PASSED. Premium visual approval: WITHHELD. Release: NO MERGE / NO DEPLOY.**

## Work actually implemented
- `studio2/factory/config.json`: fixed source assets, safe preview destination, image quality metadata, no-release and no-paid-dependency policy.
- `studio2/factory/build.py`: Pillow validates and optimizes existing repository binaries to WebP, captures true native dimensions and SHA-256, outputs a separate runnable noindex candidate with existing links and privacy scripts preserved.
- `studio2/factory/qa.py`: Chromium test of generated preview at 320,390,768,1440, screenshot capture, WebP resource decoding/HTTP, privacy rejection persistence, responsive touch/keyboard navigation, internal route availability, page errors and overflow.
- `.github/workflows/studio2-factory.yml`: one branch-scoped GitHub Actions build/test/artifact pipeline with `permissions: contents: read`. **No workflow write/commit, Pages release, pull request or paid AI API**.
- Earlier owner approval registry `studio2/river-voice/PHOTO-APPROVALS.json` remains `owner_visual_approval:false` with five null SHA pins.

## Recorded runtime evidence
Hosted run 42219633438: **success**. Photo importer synthetic acceptance/rejection contract passed. Current River Voice regression checks: **4/4 passed**. Generated factory-preview Chromium checks: **4/4 passed**. Eight screenshot files included in artifact.
- Actual image provenance and optimization:
  - Hero `assets/wetlands.png`: original 1600×640, 1,272,196 B; optimized WebP 1600×640, 71,582 B. **Original includes embedded branding and is NOT a clean hero.**
  - TRC concept `shutyourtrap/assets/photos/golden_sunrise_in_a_misty_pine_forest.webp`: original 1600×900, 342,270 B; optimized 1440×810, 291,116 B. **Conceptual AI forest, not an actual location/event.**
  - Owned logo `assets/owl-logo.png`: original 500×500, 217,598 B; optimized 400×400, 13,788 B.
  - Total three image assets: 1,832,064 B originals → 376,486 B optimized, about **79.45% fewer image bytes**. This is asset subset only, not total site transfer size.
  - Offline optimization/generation stage measured **0.8 seconds** in the CI environment. This is **not** total runner duration or full website delivery time.
- Visual inspection: full-page 1440 and 390 screenshots were downloaded and inspected. The actual generated preview is functional and coherent. It remains below cinematic user reference due to faint text in old hero and low-fidelity SVG article imagery; photograph sourcing, conceptual accuracy, advanced WCAG checks and real-device Core Web Vitals remain open.
- Tests measured one configured candidate only. **Not 36 generated sites.**

## What can now be automated vs cannot be guaranteed
Automated: repo asset validation, factual native metadata, image resizing/compression, candidate generation, published-page isolation, browser screenshots, link/consent/smoke tests and reproducible evidence export.
Still requires deliberate approval: premium art direction, rights and documentary accuracy, sourcing standalone new photography, content editorship, final accessible editorial review, billing and production release.
Binary transfer: GitHub Actions can process actual binary files already in the repo, and return generated binaries as artifacts. Connector can commit text files but cannot directly read generated image bytes from the container. For new external image inputs, verified user upload to the **feature branch**, or a binary-capable connector with explicitly checked upload permissions, is still necessary. **No new image-upload capability was claimed.**

## Costs and release
No paid API, theme, new hosting or subscription was intentionally activated. External provider invoice/usage totals **not independently verified**; aggregate incremental CAD cash cannot be claimed C$0. Before repeating hosted runs at scale, verify runner usage remains in free entitlements.
The user's 1-hour and C$5/100 target are **unproven for all-inclusive premium client projects**. Automated local image-build time is not representative of art-generation and manual visual QA.

## Next engineering milestone
1. Choose/obtain authentic 1200+ pixel standalone art assets under provenance checks. Do **not** create flattened website mockups or promise guaranteed image generation.
2. Improve the WebP preview's image quality and editorial layout; extend screenshot comparison and content QA. Preserve safe source-labels; no fabricated evidence.
3. Add a reusable multi-design configuration system with distinct layouts and business-specific content, starting with 2–3 *real* independent redesigns before attempting 36.
4. Keep previous release immutable, request owner visual approval, and only then consider a separate release workflow and billing verification.
