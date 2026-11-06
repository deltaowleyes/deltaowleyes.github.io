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
