# Website Design Studio 3.4 — Distinct internal experiences

Status: **feature-branch candidate, not released or owner approved**. Three independent design families, six routes per family, 18 combined pages. Do not describe this as 18 unique websites.

## Implemented in the generator
- `studio2/factory/experiences.py`: genuine family-specific supplemental modules, not palette-only reuse:
  - **River Voice reporting:** three accessible jump links to the existing sourced article sections; **River Voice community:** real links to business, church, and event directories with unverified-listing reminder.
  - **Accountability Ledger reporting/TRC:** three independent keyboard-operable `details` panels concerning sources, established findings, and verification. No invented investigation, allegations, completion percentage or fabricated document.
  - **The Owl's Lens media:** three real published-content pathways (video library, TRC resources, newsroom); **media reporting:** contextual bridge to the actual video library, no fabricated video player or episodes.
  - **All three inquiry pages:** identity of selected design, exact design ID and explicit unsent-email-draft disclosure; preserves validated existing `mailto:` behavior. No network submission, data storage or server-side delivery is claimed.
- `build_multipage.py`: includes experiences as supplementary page content and adds stable section IDs for editorial jump navigation.
- `qa_experiences.py`: executes 18 interaction checks (nine routes at 390px and 1440px) for module presence, jump destinations, keyboard details, actual directory/media link responses and inquiry identification/validation.
- `.github/workflows/studio2-factory.yml`: expands existing branch-only single-run Chromium QA to include new test and full-page screenshot artifact.
- All generated pages preserve `noindex,nofollow`, official source links, original privacy rejection/persistence, accessible menu behavior and reviewed asset labels.
- No production deployment or merge permissions, paid integrations, custom backend or new third-party media introduced.

## Technical acceptance and verified evidence
- Previous Studio 3.3 benchmark: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42226843764, 98/98 checks passed before 3.4 changes.
- New Studio 3.4 workflow: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42228186821. **SUCCESS** on tested code SHA `d2a7bbad8f94e9db4284f4c241217e2d744ac7f3`. Downloaded artifact `13506394600` and independently inspected all six JSON test reports and key 1440px screenshots. Results: original candidate 4/4, River factory 4/4, three homepages 12/12, multipage routes 63/63, accessibility-oriented 15/15, and new experiences 18/18; **116/116 passed**.
- Failed or cancelled concurrent runs must not be cited as passing.
- The 3.4 acceptance consists of 98 prior checks plus 18 new interaction cases. The hosted run and artifact were inspected. This is scoped technical acceptance, not a claim of complete WCAG or premium visual approval.

## Remaining visual/functional limitations
1. Factual editorial content continues to originate from the curated 3.2 content specification; no new investigation or individual published episode is fabricated.
2. These are deeper working demos, but the quality remains below the cinematic owl/hawk reference. Separate rights-clear high-resolution photographs and owner art-direction approval are outstanding.
3. Source and methodology `details` panels are editorial guidance, **not an evidentiary database** or verification of any TRC completion milestone.
4. Inquiries open an unsent email draft; real delivery, receipt, CRM or backend are not implemented.
5. Browser smoke tests do not establish full WCAG 2.2 AA conformance, assistive-technology acceptance, real-world Core Web Vitals or end-to-end external email delivery.
6. Cost policy strictly below C$1 aggregate incremental development cash remains in force; no paid API/service knowingly initiated. Provider billing invoices **unverified**.
7. No main branch write, merge, publication or production deployment. Owner visual approval withheld.

## Actual visual inspection and remaining defects
- Examined real full-page Chromium screenshots for River Voice article guide, Accountability Ledger TRC methodology and The Owl's Lens channel discovery. The three components are spatially and stylistically different, with distinct page structures and no detected horizontal overflow in tested captures.
- The internal experiences improve usability but are still visually simpler than the cinematic six-panel inspiration. The scenic River Voice hero lacks the owl/hawk character composition. Article and media imagery remains clearly labelled conceptual art. Full assistive-technology reviews and external production performance audits remain unverified.
- The GitHub workflow is branch-only, with `contents: read` and no release action. The approval flag and production homepage were not changed.
- Billing: no paid API/service deliberately initiated during 3.4, but cumulative actual CAD charges remain unknown until provider records are reviewed.
