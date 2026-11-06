# Website Design Studio 3.0 — River Voice automation reset

**Engineering target:** one repeatable build and QA workflow, not one BAKE per image. This feature branch remains unapproved and **must not** be merged, deployed or published as final.

## Why the reset
The five-photo gate was tied to an image generator that repeatedly produced labelled collages rather than independent usable source photographs. The importer itself already works; source generation and binary upload were the blockers. The previous five-image approval registry remains locked. This new pipeline does **not** claim new assets or silently activate the locked registry.

## One-run candidate workflow
1. Read checked-in `studio2/factory/config.json` with fixed approved-for-reuse *source paths*; reject missing, corrupt, giant or ambiguous files. Record real native source dimensions and exact SHA-256.
2. Pillow converts **three existing repository images** (current hero background, conceptual TRC forest and owned logo) to optimized WebP. Downsize only when oversized. Never upscale or label resampled pixels as native resolution.
3. Create a separate, noindex, functional HTML preview at `studio2/river-voice/factory-preview/` retaining all live HTML navigation and privacy controls. Existing `studio2/river-voice/index.html` is not overwritten.
4. Run branch-local Chromium at 320/390/768/1440, link/asset checks, touch/keyboard nav, privacy rejection and persisted consent, and full-page screenshot capture. Upload generated WebPs, manifest, screenshots, reports as a workflow artifact.
5. **NO Git push, Pages deployment, production release or merge**. Final visual owner acceptance remains a separate release gate.

## Asset status and intellectual honesty
- The source `assets/wetlands.png` is repository-owned but has faint embedded lettering and unclear previous provenance. Acceptable for *temporary* visual candidate only, not final approval.
- `shutyourtrap/assets/photos/golden_sunrise_in_a_misty_pine_forest.webp` is original AI conceptual art, **not** documentary photography; see `shutyourtrap/assets/photos/status.json`.
- `assets/owl-logo.png` is the existing brand logo.
- Editorial SVGs and Owl's Lens poster are still functioning conceptual placeholders. The factory deliberately preserves them until real separate, reviewed photos are available.
- Replacing visuals later means changing the *source asset inventory*, not rebuilding the site factory.
- GitHub Actions can convert and stage binary media already in the repository or downloaded from a properly verified owner-controlled source. The connector cannot directly fetch local ChatGPT image bytes and push them as Git blobs. This reset **does not solve that cross-environment binary transfer by itself**. Use a verified feature-branch upload followed by staged validation, never invent a transfer.

## Cost and automation limits
- The setup uses the repository's existing Actions workflow model, Pillow, Playwright and Chromium. No paid image API, theme, subscription or new hosting purchase.
- The pipeline must be run under remaining *free* runner quotas, or stopped. Billing statements have not been inspected, so cash spend remains **unknown** rather than C$0.
- Build elapsed seconds will be measured by the workflow; this is **not** an end-to-end one-hour benchmark including artwork production, approvals or bug fixing.
- Premium editorial photo art direction and final release approval require human judgement.

## Tests
`python studio2/factory/build.py` produces a working local candidate at `/studio2/river-voice/factory-preview/`.
`python studio2/factory/qa.py` tests all four sizes using localhost:8765.
`python studio2/tests/qa.py` still tests the preserved original pilot.
Workflow `.github/workflows/studio2-factory.yml` orchestrates the build, original pilot QA, new preview QA and exports evidence.

## Remaining work
1. Inspect all four real generated screenshot pairs against the user's cinematic reference.
2. Tune layout and typography based on screenshot defects; replace redundant article SVG assets with genuinely appropriate, individually reviewed photographic originals when available.
3. Add external owner-approved asset import and verified binary transfers *only* after independent image and rights review.
4. Design the other five distinctive site families; do not count palette variants as working new sites.
5. Measure real end-to-end generation/QA time and external provider billing before asserting one-hour or C$5/100 commercial targets.
