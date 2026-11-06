# Delta Owl Eyes — Website Design Studio 2.0 restart

**Candidate-only, not production.** This replaces the previous generic-factory pilot as the creative baseline. It does **not** replace `/newdesigns/`, `/deltaexpress/` or `/`.

## Inspiration and exact references (view the current source sites)
- [IndigiNews](https://indiginews.com/): Indigenous-centred storytelling and clear editorial hierarchy. We do not reproduce its designs, wording or images.
- [The Narwhal](https://thenarwhal.ca/): investigative focus, photography and readable issue navigation.
- [APTN News](https://www.aptnnews.ca/): news and video programme discovery.

Visual acceptance also uses the user's original cinematic great-grey-owl/red-tailed-hawk six-panel Delta Owl Eyes Studio reference. The reference is a **quality benchmark**, not a third-party asset to copy or a substitute for actual browser rendering.

## Verified code inventory
- Candidate selector: `/newdesigns/v2/`.
- Working candidate 1: `/newdesigns/v2/river-voice/` — image-first cinematic editorial, split hero, warm serif narrative, story modules.
- Working candidate 2: `/newdesigns/v2/accountability-ledger/` — independent dark/white/red investigative layout, information-dense calls-to-action, evidence-forward hierarchy.
- Working candidate 3: `/newdesigns/v2/media-hub/` — immersive media-first hero, episodic programme cards and separate discovery architecture.
- Modern Longhouse, Northern Horizons, and Community Network are explicitly **in development**, not empty or falsely linked demos.

The candidate sites link to actual existing public Delta Owl Eyes routes, including /news/, /calls-to-action/, /videos/, /events/, /indigenous-businesses/, /indigenous-churches/, and /services/. No fictional investigative results, progress counts, staff quotes or testimonials. The number 94 denotes official Calls, not completion. The images are pre-existing site-owned assets and must be assessed for fidelity/appropriate context.

## Candidate QA
`python scripts/studio-v2-smoke.py` with Python Playwright and Chromium and a local `python -m http.server 8765`. Tests: 4 routes × 4 widths (320, 390, 768, 1440), HTTP status, broken img elements, no horizontal overflow, navigation toggle and Escape, accessible skip, browser errors, available-vs-planned demo links. Screenshots: `artifacts/studio-v2/*.png`. Hosted workflow `.github/workflows/studio-v2-qa.yml`.

These checks are necessary but **not sufficient** for finished premium QA. Need inspect captured screenshots (against live reference), test real content accuracy, test images and background loads, keyboard traversal, color contrast, target sizes, semantic accessibility, and performance, and obtain design approval before deployment.

## Extended 18-BAKE design and production plan
1. Research and audit existing studio, references, live routes, brand fidelity.
2. Create and review River Voice cinematic editorial first candidate.
3. Create and review Accountability Ledger investigative first candidate.
4. Create and review Owl's Lens media-first candidate.
5. Create and review Modern Longhouse community candidate.
6. Create and review Northern Horizons culture-first candidate.
7. Create and review Community Network utility candidate.
8. Studio selector premium framing and mobile navigation.
9. Original art, photography provenance and cultural review.
10. Six River Voice refinements: uniquely composed, multi-view responsive demos.
11. Six Modern Longhouse refinements.
12. Six Accountability Ledger refinements.
13. Six Northern Horizons refinements.
14. Six Community Network refinements.
15. Six Owl's Lens refinements.
16. Automated originality, visual screenshot, performance, accessibility and content verification across 36 options.
17. Design selection, inquiry flow with accurate IDs, consent and privacy; actual sending only with configured backend or transparent mailto.
18. Final visual acceptance, spending audit, reviewed release, and measured automation benchmarking.

Expect additional repair iterations if screenshots diverge from the source-inspired quality target. Thirty-six is a *target*, not a completion claim.

## Costs / permissions
Honor `docs/WEBSITE-FACTORY-COST-POLICY.md`: <C$1 aggregate incremental system development cash, C$5 per 100 commercial options target, **not verified actual cost**. No paid model APIs, purchases, themes, subscriptions, upgrades or charged runner without explicit approval. GitHub hosted QA may incur provider usage accounting; check provider invoices independently. No merge or production release before the user approves the visual direction.
