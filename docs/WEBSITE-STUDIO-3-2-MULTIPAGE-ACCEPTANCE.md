# Website Design Studio 3.2 — Three multipage Delta Owl Eyes candidates

Date: 2026-11-06
Repository: `deltaowleyes/deltaowleyes.github.io`
Branch: `feature/doe-studio-2-redesign-pilot`
**Release status: UNPUBLISHED / owner visual acceptance withheld.**

## Real project scope

The feature branch contains one configurable generator (`studio2/factory/build_multipage.py`) and content specification (`studio2/factory/multipage-content.json`). It generates **3 visually different site families × five internal routes each**, in addition to their three separate homepages.

- **River Voice**: cinematic editorial homepage, serif feature reading, reporting/TRC/community/media/inquiry views.
- **Accountability Ledger**: black/red investigation-led masthead, numbered evidence sections, methodology rail and five internal views.
- **The Owl's Lens Media Hub**: screen-first programme homepage, visual media stage and card-based discovery plus five internal views.

Internal routes: `report/`, `trc/`, `community/`, `media/`, `inquiry/`.
The demo selector is `/studio2/factory-previews/`. River Voice homepage lives at `/studio2/river-voice/factory-preview/`; Ledger and Media Hub live at `/studio2/factory-previews/<slug>/`.

Important: **18 functioning demo routes is not 18 independently designed templates**. There are three design families, each with a homepage and five generated content views. They are not 36 finished sites.

## Accuracy and functionality

- Reporting page uses a sourced 2026 Brock University story previously approved for Delta Owl Eyes. It carefully attributes research observations and does not invent allegations.
- TRC detail correctly distinguishes the official **94 Calls to Action** from any count of calls completed.
- Community page links to existing businesses, churches and events directories; acknowledges unverified records.
- Media discovery links to actual public videos and news; **it does not claim to embed or play unpublished episodes**.
- Inquiry form validates name, email and project details, then opens a `mailto:` draft with the design ID; **it does not automatically send, store or submit information to a server**.
- All candidate pages use `noindex,nofollow`, existing site consent/reject scripts, original or pre-existing conceptual artwork with disclaimers, and real site links.

## Proven QA

Source revision `3d4ad3ddf07e0239a084ef5a9377c1c60b306c57` passed:
- Hosted run https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42225077904 — SUCCESS.
- Artifact `13505432146` includes full HTML/CSS/JS outputs, optimized images, manifests, 60 internal-page screenshots at 320/390/768/1440, plus homepage and regression screenshots.
- **63/63 multipage checks**, **12/12 three-homepage checks**, **4/4 existing River Voice checks**, and **4/4 factory River Voice checks**; **83/83** total viewport/navigation checks.
- Verified: HTTP 200, noindex, exactly one H1, no horizontal overflow, image decoding/alt text, link labels and tested internal navigation, mobile menu open/Escape, persistent analytics rejection and no analytics script, and form validation/draft-only disclosure.
- An earlier successful run `42224409888` had a mobile visual defect: River Voice reporting and sidebar were squeezed side-by-side at 390px. The current `qa_multipage.py` includes a **stackedReadingLayout** assertion. The latest screenshot from run 42225077904 was visually inspected: River Voice reporting now stacks correctly.

## Fine-polish follow-up

- At 390px, Accountability Ledger's uppercase reporting headline remained visually too large despite passing overflow/heading geometry. Source commit `65952c2cfaa19189d1f5abebb2b714b5516f6d74` reduces its mobile font size and letter compression for better reading. **Require its new hosted QA and screenshots before marking that refinement verified**.
- River Voice's original wetlands hero still has embedded branding. Existing editorial artwork is low-fidelity relative to the user's cinematic reference.
- The content routes are working but still rely on shared informational content and stylized conceptual illustrations; independent typography systems and deeper design-specific details need a separate visual acceptance pass.
- Inquiry sending relies on a local email client and a functioning business email address. It is not a server-backed submission.
- Real-device testing, advanced WCAG contrast/testing, speed metrics and long-term browser compatibility remain beyond the current smoke matrix.
- Original images used here are illustrative, never evidence of real people/locations/events; existing provenance and rights checks remain open for a final customer release.

## Costs, privacy and publication

GitHub Actions permissions are `contents: read`; workflow has **no merge, Pages deployment, Github write, paid model API, purchase or subscription step**. Changes remain on the isolated feature branch. No new billable service was intentionally initiated. **Actual provider billing and aggregate CAD spending are unknown until external invoice/usage verification.** The existing under-C$1 incremental factory cash policy remains binding; no claim of C$0 verified.

No owner visual approval means **do not merge or publish**.

## Next recommended BAKE

Studio 3.3: premium final visual acceptance: design-specific internal views, original photographic hero and article imagery where rights and cultural accuracy permit, contrast and screen-reader audit, real user device navigation, functional inquiry backend only with explicit cost/privacy approval, reproducible screenshots and user signoff. Continue automation incrementally; do not multiply to 36 templates before 3 full demonstration sites are visually approved.

## Final BAKE 3.2 responsive polish verification

- Investigative reporting headline typography was refined by source commit `65952c2cfaa19189d1f5abebb2b714b5516f6d74`: 390px heading size decreased from 34.4px to **28.9px**, improving uppercase line wrapping without modifying reporting content.
- [Final GitHub Actions run 42225737382](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42225737382) **SUCCESS** on source commit `65952c2cfaa19189d1f5abebb2b714b5516f6d74`; artifact `13505876342`, `doe-studio3-multipage-UNPUBLISHED`. Verified by opening the downloaded artifact's four JSON results.
- Results: **4/4** old candidate regression, **4/4** River Voice factory regression, **12/12** three-homepage, **63/63** internal multipage checks = **83/83** overall. Also visually inspected final 390px River Voice, Accountability Ledger and Owl's Lens reporting-page screenshots. River Voice article now stacks vertically; Ledger headline fits with improved visual rhythm; Media Hub remains visually distinct.
- This technical QA does not establish premium photographic art direction, server-backed inquiry delivery, full WCAG conformance or final owner acceptance. All 18 demo routes remain **unpublished**.
