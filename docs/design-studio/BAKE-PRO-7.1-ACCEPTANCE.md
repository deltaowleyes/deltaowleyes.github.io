# BAKE PRO 7.1 — Client Design Portal Implementation and Acceptance

## State at this checkpoint
- Six independent Delta Owl Eyes first-stage candidate pages exist under `/newdesigns/`.
- The gallery offers a six-option refinement **brief selector**, not generated refined pages.
- `docs/design-studio/7.1-proposed-supabase-schema.sql` is a proposed schema, not deployed.
- Client login, persistent selections, per-client assets and approvals are **not live**.
- AI-generated inspiration montage images are not integrated as individual site hero assets.
- No Chromium screenshot or live deployment evidence has been produced by this work.

## Architecture and security gates (must pass before enabling client login)
1. Confirm the intended Supabase project, origin URL and authorization model without placing secrets in GitHub.
2. Use Supabase Auth with verified email, strong session handling and project-specific membership.
3. Review SQL schema with special attention to `SECURITY DEFINER`, membership mutations, cross-project candidate references, project-specific approval authority, immutable approved decisions and audit logging.
4. Deny access by default. Test anonymous, owner, editor, viewer, wrong-client, revoked-member and expired-session cases.
5. Never put a service-role key in JavaScript or GitHub Pages. Public anon keys are not a substitute for RLS.
6. Use authenticated database calls for persistent selections, feedback and approval. Never treat URL parameters, localStorage or a static page as authoritative project state.
7. Ensure client-specific images and draft previews are not published to public GitHub Pages; use authenticated storage or separately authorized preview URLs.

## Design acceptance
- The second Website Design Studio inspiration image is the canonical **gallery visual target**, not proof of working functionality.
- Six distinct, independently navigable initial designs per project.
- After selection, six distinct **working refinements** for that chosen direction. Do not claim a refinement is complete when only a title or brief exists.
- Each design needs its own hero composition, original images, typography, information architecture, responsive layout and interactions.
- Respect culturally specific imagery; do not fabricate TRC metrics, testimonials, client credentials or prices.
- Review each project independently: Delta Owl Eyes, Momma Made, Shut Your Trap.

## Browser QA evidence required
- Chromium screenshots at 320, 390, 768 and 1440 CSS px for each gallery and selected candidate.
- Inspect horizontal overflow, mobile navigation, focus order, skip links, keyboard operability, reduced motion, contrast and semantic labels.
- Verify every internal destination returns expected content; verify every image decodes; test interactive selection and persistence across logout/login.
- Check no cross-client leaks in HTML, JavaScript, network responses, browser cache or storage.
- Retain test logs and screenshot artifacts linked to a specific commit.
- Verify live deployment independently before marking the release complete.

## Cost and release
Follow `docs/WEBSITE-FACTORY-COST-POLICY.md`. No paid service or overage without explicit approval. A missing invoice is not evidence of zero cost. Preserve all existing production pages. Do not publish a client portal until security and browser acceptance pass.
