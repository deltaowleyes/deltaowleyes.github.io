# Website Design Studio Standard — Version 7.0
Adopted: 2026-11-05
Status: Product design standard; staged implementation, not completed client authentication or generation automation.

## Canonical visual reference
The user's **second Delta Owl Eyes Website Design Studio inspiration image** is the visual target for the gallery experience: cinematic nature-based imagery, strong headline, six premium concept previews in a 3×2 desktop grid, clear identity and hierarchy, visible concept differences, rich artwork, premium framing and distinct calls to action. Do not present an image mockup as a deployed working website. Do not use generic theme recolors as distinct concepts. Preserve cultural accuracy and require approval for culturally specific imagery or symbols.

## Standard client journey
1. Authenticated client opens their own project dashboard, scoped to that client's assets and permissions.
2. Show six genuinely different, working, responsive initial design directions, each with real site navigation and functional representative content.
3. Client selects one direction; preserve the selection in authorized server-side project state.
4. Present six materially distinct refinements of that direction, not mere palette swaps. Vary hero geometry, page structure, typography, imagery, content hierarchy, navigation and interaction.
5. Client previews desktop/tablet/mobile versions and records feedback, selects a candidate, and requests revisions or approves.
6. Publish only after functional, privacy, content and design acceptance gates pass.

The 6 × 6 process represents **up to 36 potential second-stage options**, not 36 prebuilt pages. Current /newdesigns/ stage-two selector shows refinement **briefs** and links to the base demo, not six automatically generated websites.

## Requirements for Momma Made, Shut Your Trap and future website projects
- Use this same premium studio experience and two-stage six-by-six design decision flow.
- Keep each client's branding, content, imagery, credentials, billing and approvals isolated.
- Do not enable public access to private client project data. Authentication, authorization and persistent project storage require explicit implementation and testing before claiming client login.
- Use original or appropriately licensed imagery; don't invent testimonials, pricing, permissions, TRC progress counts or business claims.
- Six concept directions must be architecturally different; each variation must be visually and structurally meaningful.
- Responsive screenshot acceptance at 320, 390, 768 and 1440 CSS px; keyboard navigation, screen-reader semantics, color contrast, no horizontal overflow, link checks, asset decoding and interactions.
- Compare against the existing production website for aesthetics and function; do not replace production pages without approval.
- Honor docs/WEBSITE-FACTORY-COST-POLICY.md. No paid APIs, upgrades or new billable services without explicit authorization.

## Current implementation state
- /newdesigns/ has six candidate links and an accessible six-direction refinement **planning selector**.
- Six independent candidate HTML pages exist under /newdesigns/.
- **Not implemented:** authenticated client dashboards, persistent selections, AI image asset integration, generated six refined working sites per selection, and complete Chromium acceptance.
- Never label the current mockups or refinement briefs as finished working client sites.
