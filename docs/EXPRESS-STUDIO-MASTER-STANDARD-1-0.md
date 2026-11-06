# BAKE EXPRESS — Master Studio Standard 1.0

Adopted: 2026-11-06  
Canonical source: approved live Delta Owl Eyes /studio-sandbox/ header and screenshot gallery (the BAKE EXPRESS Build).

## Invariant across EVERY client studio

The studio **must never acquire project-specific shell styling, project-specific header imagery, new navigation patterns, alternate gallery card designs or a different screenshot viewer**. The client project changes only the actual site templates being previewed and identifying content.

Shared source of truth:
- **Styles**: `/assets/express-studio/v1/studio.css`
- **DOM, responsive picture, six-card selection, screenshot galleries, modal navigation, email inquiry behavior**: `/assets/express-studio/v1/studio.js`
- **Immutable original visual assets**: `/studio-sandbox/header-{320,390,500,768,1024,1440}.webp`. All are directly referenced from the approved public studio. Use the six checksum-verified restored master headers, not the later thin screenshot-gallery strip. The restored mobile headers preserve the full original owl/hawk composition. Do not duplicate, resize, recompose, redraw, recolor or independently generate headers for individual studios.
- Gallery is a six-card 3×2 grid on desktop, two columns on tablet and one column on narrow phones, using the approved deep teal/gold, pale screenshot cards, Georgia headings and original gallery framing. Each card leads to a **separate screenshot-only family route**, not a live HTML preview or project-specific in-place modal.
- Family routes show all six **real browser screenshots**, at **320 / 390 / 500 / 768 / 1024 / 1440 CSS pixels**, using the approved screenshot gallery pattern. Click/tap opens an enlarged, scrollable dialog. Escape/Close closes it and returns focus; left/right arrows switch viewport.
- No interactive template source is embedded through an iframe, `srcdoc` or JavaScript in the studio gallery. A screenshot is not proof of source confidentiality elsewhere in a public repository.
- Existing Delta Owl Eyes privacy consent loads unchanged; no analytics before consent; no actual booking or payment is implemented. Inquiries use a voluntary mailto action with the exact project and design ID, not an automatic send.

## Allowed project-specific data

Only the following vary for a studio:
- Root path and screenshot image directory.
- Project title, approved subheading and disclosure.
- Six design IDs, slugs, titles, categories, descriptions.
- Actual distinct template screenshots in the same six widths, and the output image format (JPEG or WebP).
- Client-approved inquiry email and message context.

The six header files, shared CSS and JS, number of cards, responsive breakpoints, modal behavior, preview page structure, and selection flow are **not configurable by client data**.

To add a new project:
1. Create `/<project>/express/config.js` defining `window.BAKE_EXPRESS_STUDIO` using the Shut Your Trap config as schema, changing the project fields only.
2. Copy the **minimal HTML shells** from `/shutyourtrap/express/index.html` and the six `previews/{slug}/index.html` files, updating only the project config script path and each preview's `data-express-design`. Keep the shared CSS and JavaScript URLs exactly the same.
3. Produce six distinct original website design templates and 36 real browser screenshots across the six canonical widths.
4. Use the shared header assets and preview scripts. Run the canonical Chromium QA and visually inspect desktop/mobile screenshots before reviewing or deploying.
5. Obtain client approval before replacing a client's already approved main website; do not imply that earlier concept source in `/shutyourtrap/` or `/newdesigns/` is private.

## Shut Your Trap implementation

- Public studio root: `/shutyourtrap/express/`
- Single configuration: `/shutyourtrap/express/config.js`
- Six design screenshot families: sharp-edge, family-trapline, expedition, sharpening-flow, field-journal, bold-operator
- Six per-design gallery pages: `/shutyourtrap/express/previews/{slug}/`
- Existing illustrations, photos, ten working HTML source concepts and other website routes remain unchanged.
- `/shutyourtrap/express/shots/`: six canonical JPEG screenshot variants per design, SHA-256 manifest. An old 1280px screenshot may remain in storage temporarily but is never offered as a studio breakpoint.
- `/assets/express-studio/v1/qa.cjs`: checks 42 route/viewport combinations (seven routes × six widths), exactly six active header assets, 36 valid screenshot files, gallery navigation, keyboard/modal, no horizontal overflow, privacy rejection, image loading and inquiry context. Browser artifacts are saved for visual inspection.

## Status / remaining work

This standard is **implemented first for Shut Your Trap**. The older Momma Made studio currently uses its independent layout and must be migrated in a separate reviewed BAKE if complete visual uniformity is required across already-published studios. Nothing in this change automatically rewrites that approved Momma Made layout or replaces its V2 product website.

Use no paid APIs or billable services without approval. A GitHub Actions no-cost development workflow is not independent proof of account billing.
