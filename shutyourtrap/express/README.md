# Shut Your Trap — BAKE EXPRESS 1.0

**Owner:** Delta Owl Eyes / Ermatinger's Shut Your Trap (trapping, snaring & sharpening)

A standalone, screenshot-only, six-design website selection studio at **/shutyourtrap/express/**. It does not replace the earlier ten original multi-page concepts at **/shutyourtrap/**.

## Six visual directions

| EXPRESS ID | Direction | Source template |
| --- | --- | --- |
| SYT-EX-01 | Service-First Sharp Edge | 1 |
| SYT-EX-02 | Trapline Family Business | 2 |
| SYT-EX-03 | Expedition Heritage | 4 |
| SYT-EX-04 | Sharpening Intake Flow | 5 |
| SYT-EX-05 | Trapline Journal | 7 |
| SYT-EX-06 | Bold Utility Operator | 9 |

For each design, real Playwright/Chromium full-page JPEGs are generated at **320, 390, 768, 1024, 1280, 1440 CSS pixels**. The static EXPRESS gallery shows only screenshots, not a live template iframe or client-side template HTML. The modal supports viewport selection, keyboard navigation, scrollable full-page inspection, and an opt-in mailto inquiry addressed to the known project Gmail account. No form submission, payment, booking, unsolicited email, or database write is added.

## Capture workflow

- Source: existing original HTML/CSS concepts; no copied third-party source.
- Capture script: shutyourtrap/express/render-shots.cjs.
- GitHub Action: .github/workflows/shutyourtrap-express.yml, isolated to a dedicated feature branch and triggered by source changes.
- Output: shutyourtrap/express/shots/{slug}-{width}.jpg, plus manifest.json with SHA-256 checksums and dimensions.
- Action verifies 36 screenshots, broken images, JS errors and responsive overflow; exercises gallery preview selection and Escape.
- Screenshots are committed only to the feature branch after successful QA. Do not claim screenshots exist before checking this action.
- Do not merge/deploy without visual review of the screenshots, successful QA and deployment validation.

## Limits and design integrity

1. This iteration previews the **home page** of six existing concepts, not every internal page. The full existing templates also support services, trapping, snaring, sharpening, about and contact, which may be included in future captures.
2. Screenshot-only selection makes direct DOM/CSS copying from this gallery harder, **not impossible**. Screenshot images can be saved, and the original ten demonstrations are publicly available in this repo. Actual source confidentiality would require moving the source out of the public repo and retiring publicly served demos; that has not been done.
3. The 17 existing photographs are AI-created illustrative concept images, not records of the actual business.
4. No unverified credentials, licences, price, address, guarantee, booking, availability or testimonials are asserted.
5. No paid generation service or charge-bearing API is intentionally invoked. Actual account billing has not been independently audited.
6. Existing privacy scripts are loaded unchanged.

## Acceptance

Inspect six designs across six real screenshots each, check typography and cropping, verify images and responsive overflow, confirm keyboard and selection behavior, and then independently verify deployment.
