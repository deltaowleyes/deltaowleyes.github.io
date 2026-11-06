# Website Design Studio 3.5 — Visual approval gate, NOT site expansion

Date: 2026-11-06
Feature branch: `feature/doe-studio-2-redesign-pilot`
**Disposition: technical Chromium QA PASS; premium visual approval FAIL / owner decision pending. No merge or production deployment.**

## User correction
The user has repeatedly asked to see a public-facing six-panel Website Design Studio that matches the supplied cinematic great grey owl/red-tailed hawk reference. Previous 3.0–3.4 development overemphasized build/QA counts and created designs without regular visual feedback. **Stop generating further sites and BAKE iterations until the six-panel gallery composition itself is reviewed.**

## Actual implementation now available
- `studio2/factory/visual-review-template.html`: single branded HTML gallery with exactly six visible areas, first three working design routes with clear `View Demo` links, last three marked `In Development` and no fake demo link. Responsive 3/2/1 column layout.
- `studio2/factory/build_visual_thumbnails.py`: screenshots **actual** generated homepage demos at 1440 and 390 width using Chromium, optimizes six WebP preview images and includes capture provenance.
- `studio2/factory/qa_visual_review.py`: gallery HTTP/render test at 320, 390, 768, 1440, image decoding, no layout overflow, exactly three active links and three truthful future panels, route reachability and noindex.
- `.github/workflows/studio2-factory.yml`: executes gallery screenshot and QA after multipage design builds; artifacts only, GitHub `contents: read`, no Pages deployment.
- Successful run: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42229708183
- Artifact `13507766695`, `doe-studio3-multipage-UNPUBLISHED`, includes full-page `artifacts/studio3-gallery/gallery-{320,390,768,1440}.png`, real generated previews and JSON reports. **Gallery 4/4 checks passed**; earlier 116/116 content and interactions remain green in this run. Total 120/120 scoped checks.
- Generated gallery has actual screenshot evidence; **not** published to `deltaowleyes.ca`.

## Visual comparison and blocker
- The real browser gallery currently uses a dark teal/wine gradient with gold typography and screenshots of three working demo homepages.
- **Not an acceptable match** to the canonical uploaded reference: cinematic large photographic great grey owl on left and red-tailed hawk on right are absent; sunset/powwow-style cinematic background, fine textures, premium six distinct picture panels and full user-requested detail are absent.
- Real photos were not fabricated or taken from third-party reference sites. Three inactive panels are clearly unfinished, not fake live demos.
- Separate local review bundle includes a custom header composed from the **user-supplied original reference** plus genuine browser captures and can be reviewed before assets are uploaded to GitHub. This bundle is *not* claimed to be in GitHub or deployed.
- Do not treat QA results as visual acceptance.

## Required next visual-approval workflow (new operating rule)
1. Present the real 1440 and 390 gallery screenshots **in the conversation at the end of each substantial BAKE**, with a concise comparison to the canonical reference and clearly identified mismatch.
2. Show a specific visual composition/asset revision; get explicit owner approval of gallery styling **before** generating additional working design families.
3. Integrate user-owned canonical masthead imagery through a verified binary upload workflow, not a source image URL guessed from the conversation. Keep hover/tap desktop/mobile preview semantics accessible and grounded in actual browser screenshots.
4. For a publicly accessible test URL, seek a *separate approved preview deployment* or explicit authorization for an isolated main-branch preview directory. Do not call GitHub artifact URLs live public pages.
5. Stop at the approval gate if the gallery is below the reference. Do not quietly advance the backlog.
6. Preserve production homepage, privacy consent/rejection, published content and related projects.
7. Strictly below C$1 incremental CAD development cash as policy; no new paid service initiated, but real usage/billing figures remain **unknown** until verified.

**No deployment done.** A temporary feature-branch gallery artifact is not a live public website.
