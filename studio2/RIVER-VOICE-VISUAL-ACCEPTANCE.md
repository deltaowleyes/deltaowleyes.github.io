# River Voice — first Chromium visual acceptance review
Date: 2026-11-06
Candidate: `/studio2/river-voice/`
Status: **responsive pilot passes smoke checks; PREMIUM VISUAL ACCEPTANCE FAILED / approval withheld.**
GitHub hosted QA run: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42162709860
Screenshots artifact: 13477144082 (desktop and mobile full-page views at 320, 390, 768, 1440 px).

## Verified automated results
- HTTP 200 locally served candidate, 4/4 tested viewport sizes.
- No horizontal overflow, no broken images, exactly one main H1.
- Zero JS page errors and no anonymous links.
- Navigation visible at desktop and interactive disclosure works at mobile.
- No deployment to public site; screenshots are from branch-local GitHub Actions server, not the public domain.

## Direct screenshot observations
- The large sunset/wetlands hero has a strong editorial foundation and typography appears legible.
- Logo, nav, gold topic rail, TRC/Community/Media content pathways, and cream/deep-teal color system form a coherent base.
- **Blocker:** Reused Delta Owl Eyes promotional graphics and banner images in the news cards and accountability strip make the work feel repetitive and substantially below the user's cinematic reference image.
- **Blocker:** Real independent reporting/editorial-specific photography with rights/provenance needs to replace placeholder-like banner artwork. Do not infer a photo illustrates an article unless it truly does; use clearly decorative illustration otherwise.
- **Blocker:** Mobile full-page screenshot is more linear than cinematic; visual feature differentiation and richer visual storytelling sections need improvement.
- The standard privacy-consent panel is displayed over portions of the hero in the screenshot. Preserve its consent/reject features and assess first-screen composition, rather than disabling privacy.
- Two-stage design selection and 36 working demo sites are **not** implemented here.
- The current candidate links to real, existing site pages, but it is a homepage/front-page design candidate, not a complete independently rebuilt newsroom.

## Next visual repair acceptance
1. Curate story-specific original/rights-cleared photo assets and record provenance.
2. Improve image fit and visual variety; do not reuse brand banners as illustrative news photos.
3. Refine mobile 390 and 320 first-screen image/text balance and support editorial hierarchy.
4. Ensure the TRC and investigation sections remain respectful, factual and explicit about sources.
5. Repeat all four Chromium screenshots, visually inspect and run interactive keyboard, privacy rejection, and link/asset checks.
6. Only then ask the user for visual approval. Do not merge/deploy before acceptance.

## Costs
No paid services or purchases deliberately initiated. Actual provider billing remains unknown; standard public repo GitHub-hosted CI cannot itself prove a C$0 invoice.


## 2.2 follow-up — browser-verified media repair and privacy rejection (2026-11-06)

- The previous mobile blank media frame was reproduced from the 390 px full-page screenshot, even when HTML image completeness checks passed.
- Replaced `/assets/podcast-archive.png` in the media presentation with new original `/studio2/river-voice/assets/owl-lens-studio.svg` and accessible live text overlay. Updated asset provenance registry. Kept the videos link navigable.
- Updated `studio2/tests/qa.py` to explicitly decode images, scroll the media poster into view before screenshot, verify the media artwork is complete and visible, then reject Google Analytics, reload and verify persistence and lack of loaded Analytics code.
- **Hosted Chromium success for code and provenance state:** https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42164010251 on SHA `9050621858c67103ae1fc8fee2adf5411753636a`; prior full matrix run https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42163998299 on SHA `849cb8557067de41fe0138b445a290f27b1a7372` succeeded at 320, 390, 768 and 1440 px.
- The screenshot set from the prior run was downloaded and directly inspected: 390 px mobile media artwork is now visible. The page has no horizontal overflow, broken image elements or browser JavaScript exceptions, and analytics rejection persisted after reload with analytics disabled.
- GitHub internal-link QA: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42163936336 succeeded on the media repair code.
- **Not final visual acceptance:** Imagery is original and topic-appropriate but predominantly illustrative SVG rather than the premium photorealistic composition in the owner's six-panel reference. Some first-screen art depends on an older `/assets/wetlands.png` whose provenance/rights still need review. No source-image matching, full WCAG audit, service/API form submission, production deployment or independent live verification claimed.
- **Release gate remains CLOSED:** no merge or deploy before customer visual approval; separate asset rights verification and substantial premium visual polish remain.
- **Cost:** no paid APIs/assets/upgrades deliberately initiated in this BAKE. Provider billing invoices and aggregate CAD charges unverified; do not claim confirmed C$0.
