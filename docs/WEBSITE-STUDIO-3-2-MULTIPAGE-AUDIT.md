# Website Design Studio 3.2 — Three independent multipage prototypes

## Implementation state (2026-11-06)
Feature branch only: `feature/doe-studio-2-redesign-pilot`. **Do not merge, deploy or describe as visually approved.** This build changes generated preview output only; production homepage, live news, privacy and existing directory data are not altered.

### New source
- `studio2/factory/multipage-content.json`: 3 design identities × 5 internal content route specifications. The reporting view now uses the actual user-approved Delta Owl Eyes Brock University article stored in `news/approved/brock-researcher-describes-progress-and-persistent-barriers-for-indigenous-students-and-fa.json`, not an invented article.
- `studio2/factory/build_multipage.py`: deterministic generation of five independently navigable internal views for each design, with separate visual languages (serif editorial, investigation ledger, dark media).
- `studio2/factory/qa_multipage.py`: 60 Chromium route-viewport checks plus three homepage navigation journeys, checking semantic headings, no horizontal overflow, accurate site-specific internal links, image requests, keyboard/tab-readable navigation, privacy rejection persistence and transparent mailto-based inquiry UI.
- `.github/workflows/studio2-factory.yml`: generates 3 retained homepage candidates plus 15 internal routes, runs 3.0/3.1 regression checks, then exports full-page screenshots at 320/390/768/1440 for all 15 subroutes. Content remains unpublished.

### Route inventory (18 pages)
Each family has `/`, `/report/`, `/trc/`, `/community/`, `/media/`, and `/inquiry/`.
- River Voice: `/studio2/river-voice/factory-preview/` — photo-first editorial.
- Accountability Ledger: `/studio2/factory-previews/accountability-ledger/` — investigative, evidence led.
- The Owl's Lens Media Hub: `/studio2/factory-previews/media-hub/` — dark screen-first editorial.

The internal reporting view is a **republished design study** of one verified user-approved article, not a new investigation. The TRC view avoids false completion counts. Community links lead to actual public directories; they are not an invented searchable backend. Media links lead to the public video collection; the media page does not fabricate a playable episode. The inquiry opens an email *draft* with design ID and user-entered contact details; it does not claim backend form submission.

### Initial hosted technical evidence
- Initial Chromium build and tests: [GitHub Actions 42221703015](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42221703015) succeeded; artifact 13504351216. **63/63 multipage checks passed**, 60 route × width plus 3 homepage journeys. Earlier 3.0 and 3.1 regression suites also executed in the same run.
- Desktop screenshots were visually reviewed side by side at 1440px, showing truly different typography, colors, grid hierarchy and section treatments. All three use a five-page information architecture, but layout components are not simple palette swaps.
- Final content-adjusted run [42221806209](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42221806209) was initiated after replacing the generic reporting copy with the approved Brock article. Verify its result separately before reporting final accepted QA.

### Remaining acceptance and quality gaps
1. **Premium photographic fidelity is still inadequate:** older River Voice hero embeds text, and several original graphics remain conceptual stand-ins. The three generated inner pages have strong hierarchy but no cinematic photographic compositions equal to the user-provided source image.
2. Internal content screens are **fully navigable prototype information views**, not three launched production websites or completed server-side directory/video systems. Video episode details, richer search/filtering, genuine client contact delivery and a full content-authoring CMS require separate implementation and explicit scoping.
3. QA covers initial touch/keyboard flows but is not a full WCAG 2.2, automated visual regression pixel diff or real-device accessibility certification. The contact form only verifies browser validity and transparent email-draft intent; it does not test actual delivery.
4. Studio selector visual review and separate individual homepage screenshot acceptance remain open. Owner visual approval and release authorization still required.
5. No paid API, subscription, theme, service or hosting upgrade deliberately activated. **Actual provider billing and GitHub runner entitlements have not been independently verified**; cannot certify aggregate incremental cost below C$1.
6. The one-hour production and C$5/100 commercial generation target remain unproven for client-ready multipage websites.

### Next direction
Run a premium layout acceptance and content parity phase: improve each site's bespoke article/reporting and video programme experiences, perform contrast, motion, form semantics and link validation beyond smoke tests, and create high-resolution individually licensed photographic assets. Test real mobile and desktop browser screenshots against the studio image. Consider merging only after the user's design approval.
