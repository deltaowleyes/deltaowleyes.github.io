# Website Factory 2.2 — media provenance and premium CSS

- Source branch: `factory2/acceptance-review-2026-11-05` at passed commit `37a0d83a9229a99f618c0da0f0e918280ca21a5d` (Actions `42142889781`).
- Working branch: `factory2/premium-review-2-2-2026-11-05`, based on main snapshot `34a949967ae4339e3857fc759d2de41fe28a42bd`.
- 24 pre-existing project WebP sources: `mommamade/v2/images/hero-01..10.webp`, `story-01..10.webp`, `product-01..04.webp`.
- V2 `designs.js` identifies them as AI-generated concept imagery, not verified finished products. V3 `site.css` explicitly states its photos reuse the existing V2 assets; V3 provenance audit says previously owned concept imagery.
- **Reuse authorization basis:** first-party assets already held and used within the same Momma Made repo/project, not image downloads from external retail sites. No external image/fonts purchased or copied. Original generation licence and owner approval have **not** been independently evidenced, so external/commercial rights clearance remains pending.
- 10 design-specific hero photos and story photos, all from the 24-image pool. Shop cards, 4 product detail variants, editorial care, story and inquiry imagery reuse those originals. Distinct original markup and screen-reader text are preserved across all 60 pages.
- External reference websites are visual inspiration only and are not fetched or incorporated into the candidate assets.
- Display disclaimers: client-side copy identifies existing AI concept imagery, unverified products and demo-only behaviour.
- Costs: no new paid services, media purchase, AI API, plugin, subscription, domain, checkout, analytics or premium runner initiated. Actual cumulative development spend is **unknown** until invoices and usage are checked. Under C$1 cumulative remains a hard requirement. C$5 / 100 production options is an unvalidated ceiling, not an observed expense.
- Manual screenshot, client photography and product specification approval remain required. Test the exact post-change SHA and verify desktop/mobile composition before release. Keep V1 archive, V2 approved, V3 candidate.
