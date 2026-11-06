# Brandee's Rosary Road — Studio 1.0 verification

Date: 2026-11-05
Branch: `design/brandee-rosary-road-studio-v1`
Status: **STAGED — NOT RELEASED**

## Verified in current BAKE
- Created source on isolated Git branch derived from `main` commit `34a949967ae4339e3857fc759d2de41fe28a42bd`.
- Six candidate HTML route entrypoints and 6 accessible design-gallery iframe preview links.
- 6 standard page views, using URL fragments and distinct layout systems, per design.
- 6 original SVG illustrations are tracked as placeholders only, **not generated AI photography**.
- JavaScript passed source syntax parsing.
- All 36 design × page combinations rendered without exception in a **simulated document model**, with navigation and footer output present.
- All 17 core source files checked as available on branch; six candidate theme classes and six SVG asset paths verified.
- No real payment, sponsor, visitor form, fabricated product inventory, made-up contact identity, or customer data processing.
- `main`, production homepage, privacy scripts and prior Momma Made/Shut Your Trap projects unchanged by this branch commit.

## Not yet checked
- **Real Chromium** navigation, screenshots or accessibility at 320, 390, 768, 1024, 1440 and 1920 CSS px.
- Exact visual reference matching, final-quality photorealistic AI assets, image optimization, and artist approval.
- Screen reader auditing, full colour-contrast report, SEO rules in production, mobile browser validation.
- Brand/trademark/domain clearance, Brandee's own photos, articles, products, pricing and contact permissions.
- Public deployment (deliberately not performed) and actual invoiced account charges (unknown).

## How to test without deployment
Run from repository root on checked-out branch:

```sh
node brandee/studio/v1/qa.mjs
python3 -m http.server 8000
# in a second terminal, with Playwright/Chromium already installed
BRANDEE_STUDIO_URL=http://127.0.0.1:8000/brandee/studio/v1 python3 brandee/studio/v1/visual_qa.py
```

Do not publish screenshots or merge this branch without consent; development branch code remains publicly readable on GitHub.

## Stage-two signoff requirements
Brandee selects one concept; author six structurally varied **refinements** of that direction, replace vector placeholders with reviewed original photorealistic assets, validate all views at target sizes, secure writing/product permissions, and approve commercial and cultural content. Approval for hosting and spending is a separate action.
