# Delta Owl Eyes — Web Design Revision and Reference Quality Standard
Effective: 2026-11-05. Applies to **every** Delta Owl Eyes web design project, including Momma Made, Shut Your Trap and future client concept galleries.

## Version / publication contract
1. The stable project URL (e.g. `/mommamade/`, `/shutyourtrap/`) must always lead to the **newest approved design collection**. It must not mix an old collection into the new gallery. A newly prepared collection must be checked before it is made current.
2. **Before any replacement**, preserve the complete prior gallery, routes, CSS, scripts and supporting images in a separately accessible snapshot (e.g. `/PROJECT/revisions/vN/`) or as a checked-in immutable build. Never rely on git history alone if the user expects an accessible link. Copy all required assets or use explicit stable asset references. Smoke-test the archive before changing the root.
3. Keep `/PROJECT/revisions/` as a human-readable index with links to the latest and all archived revisions. Never invent previous versions that do not exist. Show a revision label/date and a working link from the latest gallery.
4. The stable `/PROJECT/` landing URL should redirect or render the current revision, preserving query and fragment when practical. Old `?template=N` links may be redirected; provide the historical revision URL for old designs.
5. Keep a project registry at `data/web-design-projects.json`. When a new project appears, add it. When a new version is ready, update latest revision, archive references and source information atomically. Do not delete historical references or original files until archive integrity is verified.
6. Preserve unrelated website routes, privacy/consent scripts, data suppression, content and listings. Any form, booking or checkout described as simulated must remain disconnected until explicitly approved.

## Reference-fidelity acceptance criteria (required, per design)
- Record the **specific** inspiration URL, capture date, viewport, screenshot status, and whether the live source was accessible. If inaccessible, mark **unverified**, not passed.
- Compare side-by-side desktop **1440 × 900** and mobile **390 × 844** screenshots. Audit header architecture and category hierarchy, hero split and text alignment, image subject/crop/composition, major colour balance, type scale, grid/card geometry, vertical rhythm, major sections, and responsive rearrangement.
- Recreate the inspiration's **layout language and interaction patterns** using original client-specific content, owned/generated photographs, original CSS/components and licensed assets. Do **not** reproduce trademarks, proprietary website code, copyrighted photography, distinctive original graphics or copy.
- Large structural differences (e.g. illustrated editorial split vs. a photograph-led catalogue, vertical vs. horizontal header, or missing category navigation) must be resolved before calling a design visually close. A colour swap is **not** a new design.
- Don't assert fidelity from a reference URL alone. If reference site screenshots are blocked, ask for or use screenshots supplied by the project owner and mark unknowns.
- Test links/anchor navigation, search/filter controls, mobile menu, contrast/legibility, keyboard use, focus visibility, no horizontal overflow at **320, 390, 768, 1024, 1440 and 1920 px**, image availability and loading, and safe demo-only behaviour.
- Keep screenshots/artifacts and exact test outcomes associated with each revision. Release notes must distinguish **committed**, **tested**, **deployed** and **live verified**.
- Do not fabricate reviews, prices, staff, credentials, product inventory, addresses, business policies, booking availability or payments.

## Reference audit and progress status (Nov 5, 2026)
Momma Made revision 2, ten inspiration references, from `mommamade/v2/designs.js`:
1. Sunroom Journal — Togetherness Design; visual reference fetch not verified; editorial/product storytelling.
2. Kitchen Parade — Papier; source live content verified; horizontal catalogue navigation, clean merchandise-led hero and product rails.
3. The Linen Edit — Grovemade; source content verified; restrained typography, large material photographs and careful whitespace.
4. Sunday Picnic — Loeffler Randall; screenshot comparison outstanding; full-screen lifestyle editorial.
5. Fresh Start Supply — Package Free; source screenshot comparison outstanding; utilitarian category flow.
6. The Maker Notebook — Schoolhouse; screenshot comparison outstanding; warm homeware editorial.
7. Bloom & Fold — Block Shop; source content verified; categories, merchandising grids and homeware imagery rather than an isolated floral arch.
8. No-Waste Studio — Ocean Bottle; screenshot comparison outstanding; bold utility/product storytelling.
9. Market Morning — Abode New York; screenshot comparison outstanding; catalogue hierarchy more important than decorative stripes.
10. The Little Things — Homesick; source content verified; emotional product storytelling and browsable collections.

Momma Made V2 structural corrections added in `mommamade/v2/reference-fidelity.css`. **These are initial improvements, not proof of matched reference screenshots.**

Shut Your Trap latest ten references are in `shutyourtrap/site.js`. Treat them as **reference-guided designs requiring screenshot pairing**, not pixel-accurate matches; they use original concept illustrations pending further review.

## CMS decision
- Static hosted GitHub Pages with content editing needs: pilot Pages CMS or Decap CMS on non-critical demo content, retaining GitHub as source of truth.
- Visual-builder client sites: evaluate Webflow on a separate demo; be aware Webflow CMS content and ecommerce do not function in exported code.
- Real shopping / cart / orders: use Shopify if the client opts for commerce and the operating costs are acceptable.
- The CMS choice does **not** replace visual screenshot QA. Never migrate the primary Delta Owl Eyes site without an approved cutover/rollback plan.
