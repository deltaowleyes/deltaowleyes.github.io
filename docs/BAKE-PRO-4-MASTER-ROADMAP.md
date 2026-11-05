# Delta Owl Eyes — BAKE PRO 4.0 Master Roadmap

**Canonical status source:** [data/bake-pro-4-roadmap.json](../data/bake-pro-4-roadmap.json) on `main`. **Created:** 2026-11-05.

This is a **best-guess, expandable operational roadmap**, not a reconstruction of the unavailable original 52-task PRO 3.0 list.

## Coverage and limitations

- **132 total records:** 93 faithfully retained BAKE PRO 2.0 action titles/descriptions (`B2-001`–`B2-093`), 3 BAKE PRO 3.0 status tasks (`S01`–`S03`), and 36 additional proposed scoped projects (`B4-001`–`B4-036`).
- **S01 and S02 complete** with evidence; **S03 pending**. S02 was closed after a genuine successful directory-logging run ([workflow 42027337417](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42027337417)); [daily status reconciliation](../.github/workflows/sync-bake-pro-4-roadmap.yml) checks for other narrowly verifiable changes.
- Every imported/proposed `pending` label means **not verified complete**. Many tasks may be partially implemented or already live. Audits should confirm this and update statuses rather than redoing work.
- The original 52-task PRO 3.0 list still has 49 unrecovered identities; retaining that as historical context **does not block** BAKE PRO 4.0 execution.
- Proposed categories, dependencies, priorities, efforts, acceptance criteria and standalone prompts are **planning estimates**, not original-source statements or promises of completion.

## Audit, add, retire, restore

1. For **every BAKE**, fetch the latest canonical JSON before choosing work, verify present source, and record evidence plus any newly discovered subtasks or blockers.
2. Accept `complete` only with testable acceptance proof and URLs/commit hashes. A failed test cannot be treated as complete.
3. Add projects with the next unique `B4-###` ID (never reuse or renumber IDs); include category, source, acceptance checks and copyable BAKE prompt.
4. To remove unwanted work, set `status: "retired"`, record `retirement.reason`, date, and optional replacement ID; retain the task for audit and possible restoration.
5. A new audit may change proposed priorities, dependencies, effort or scope with a written reason; don't rewrite historical PRO 2.0 titles or source summaries.
6. Use blob-SHA guarded writes and reread latest `main` on conflict; never overwrite concurrent project updates.
7. The daily GitHub task only performs narrow verification of a successful directory-logging run. Other task status changes require an explicit audited BAKE; fully autonomous status detection of all 132 projects is **not** guaranteed.

## Priority reading

P0 = critical integrity, governance or high-impact dependency. P1 = important next-stage effort. P2 = desirable after prerequisite work. All B2 and B4 priority ratings are **proposals** and are revisable.

## Full indexed backlog

| ID | Task | Status | Priority | Origin |
|---|---|---|---|---|
| S01 | Repair Directory Validation | complete | P0 | PRO 3.0 verified |
| S02 | Repair Directory Update Logging | complete | P0 | PRO 3.0 verified |
| S03 | Repair Chromium Browser Tests | pending | P0 | PRO 3.0 verified |
| B2-001 | Repair admin deletions | pending | P1 | PRO 2.0 |
| B2-002 | Supabase migration | pending | P1 | PRO 2.0 |
| B2-003 | Security audit | pending | P1 | PRO 2.0 |
| B2-004 | GitHub deployment health | pending | P1 | PRO 2.0 |
| B2-005 | Data backups & recovery | pending | P1 | PRO 2.0 |
| B2-006 | Discovery 2.0 importer safety | pending | P1 | PRO 2.0 |
| B2-007 | Admin dashboard overhaul | pending | P2 | PRO 2.0 |
| B2-008 | Website regression testing | pending | P1 | PRO 2.0 |
| B2-009 | Analytics & consent audit | pending | P2 | PRO 2.0 |
| B2-010 | Publish first R2 video | pending | P1 | PRO 2.0 |
| B2-011 | Build complete video library | pending | P2 | PRO 2.0 |
| B2-012 | Video compression workflow | pending | P2 | PRO 2.0 |
| B2-013 | The Owl's Lens podcast hub | pending | P2 | PRO 2.0 |
| B2-014 | TRC episode production pipeline | pending | P2 | PRO 2.0 |
| B2-015 | Daily QPrompt script studio | pending | P2 | PRO 2.0 |
| B2-016 | AI video production system | pending | P2 | PRO 2.0 |
| B2-017 | Mascot animation package | pending | P2 | PRO 2.0 |
| B2-018 | Residential school history shorts | pending | P2 | PRO 2.0 |
| B2-019 | Captions and accessibility | pending | P2 | PRO 2.0 |
| B2-020 | Interview production plan | pending | P2 | PRO 2.0 |
| B2-021 | Media publishing calendar | pending | P2 | PRO 2.0 |
| B2-022 | SEO technical audit | pending | P1 | PRO 2.0 |
| B2-023 | Google & Bing submission | pending | P2 | PRO 2.0 |
| B2-024 | Newsroom improvements | pending | P1 | PRO 2.0 |
| B2-025 | Professional / Rez Slang 9.0 toggle | pending | P2 | PRO 2.0 |
| B2-026 | Community landing pages | pending | P2 | PRO 2.0 |
| B2-027 | Video SEO | pending | P2 | PRO 2.0 |
| B2-028 | Website speed optimization | pending | P2 | PRO 2.0 |
| B2-029 | Accessibility audit | pending | P2 | PRO 2.0 |
| B2-030 | Website contact & inquiry system | pending | P1 | PRO 2.0 |
| B2-031 | Newsletter development | pending | P2 | PRO 2.0 |
| B2-032 | Social sharing improvements | pending | P2 | PRO 2.0 |
| B2-033 | Business discovery expansion | pending | P1 | PRO 2.0 |
| B2-034 | Phone but no website leads | pending | P2 | PRO 2.0 |
| B2-035 | Business website enrichment | pending | P2 | PRO 2.0 |
| B2-036 | Business verification workflow | pending | P1 | PRO 2.0 |
| B2-037 | Church directory expansion | pending | P2 | PRO 2.0 |
| B2-038 | Events calendar expansion | pending | P1 | PRO 2.0 |
| B2-039 | Events cancellation monitoring | pending | P2 | PRO 2.0 |
| B2-040 | Directory quality review | pending | P1 | PRO 2.0 |
| B2-041 | Directory updates history | pending | P1 | PRO 2.0 |
| B2-042 | Community submission portal | pending | P1 | PRO 2.0 |
| B2-043 | Business outreach campaign | pending | P2 | PRO 2.0 |
| B2-044 | Website services sales funnel | pending | P2 | PRO 2.0 |
| B2-045 | Services page revision | pending | P2 | PRO 2.0 |
| B2-046 | Business card finalization | pending | P2 | PRO 2.0 |
| B2-047 | Full-page services advertisement | pending | P2 | PRO 2.0 |
| B2-048 | Client demo website templates | pending | P2 | PRO 2.0 |
| B2-049 | Client CRM and follow-ups | pending | P2 | PRO 2.0 |
| B2-050 | Contracts and service terms | pending | P1 | PRO 2.0 |
| B2-051 | Invoicing and payment workflow | pending | P2 | PRO 2.0 |
| B2-052 | Sponsorship opportunities | pending | P2 | PRO 2.0 |
| B2-053 | Revenue dashboard | pending | P2 | PRO 2.0 |
| B2-054 | Council presentation package | pending | P1 | PRO 2.0 |
| B2-055 | Alicia council correspondence | pending | P2 | PRO 2.0 |
| B2-056 | Camera and drone permissions | pending | P1 | PRO 2.0 |
| B2-057 | 2027 gathering master plan | pending | P1 | PRO 2.0 |
| B2-058 | High Banks venue planning | pending | P2 | PRO 2.0 |
| B2-059 | Cultural advisory circle | pending | P1 | PRO 2.0 |
| B2-060 | Knowledge Keeper participation | pending | P1 | PRO 2.0 |
| B2-061 | Gathering budget and grants | pending | P2 | PRO 2.0 |
| B2-062 | Sponsors and community partners | pending | P2 | PRO 2.0 |
| B2-063 | Event safety and accessibility | pending | P1 | PRO 2.0 |
| B2-064 | Gathering teaser and presentation video | pending | P2 | PRO 2.0 |
| B2-065 | Gathering registration and website | pending | P2 | PRO 2.0 |
| B2-066 | TRC 94 Calls audit | pending | P1 | PRO 2.0 |
| B2-067 | Finish outstanding TRC script revisions | pending | P2 | PRO 2.0 |
| B2-068 | Daily verified news pipeline | pending | P2 | PRO 2.0 |
| B2-069 | TRC progress tracker | pending | P1 | PRO 2.0 |
| B2-070 | Investigations standards | pending | P1 | PRO 2.0 |
| B2-071 | Two-Eyed Seeing educational series | pending | P2 | PRO 2.0 |
| B2-072 | Indigenous language and culture series | pending | P2 | PRO 2.0 |
| B2-073 | News corrections log | pending | P2 | PRO 2.0 |
| B2-074 | Historical reenactment policy | pending | P1 | PRO 2.0 |
| B2-075 | Facebook growth plan | pending | P2 | PRO 2.0 |
| B2-076 | YouTube channel launch audit | pending | P2 | PRO 2.0 |
| B2-077 | Instagram and TikTok rollout | pending | P2 | PRO 2.0 |
| B2-078 | LinkedIn growth plan | pending | P2 | PRO 2.0 |
| B2-079 | Rez Slang 9.0 feedback campaign | pending | P2 | PRO 2.0 |
| B2-080 | Cross-platform content repurposing | pending | P2 | PRO 2.0 |
| B2-081 | Partnership outreach | pending | P2 | PRO 2.0 |
| B2-082 | Audience insights dashboard | pending | P2 | PRO 2.0 |
| B2-083 | Media kit and press package | pending | P2 | PRO 2.0 |
| B2-084 | Daily operations dashboard | pending | P2 | PRO 2.0 |
| B2-085 | Scheduled automations audit | pending | P1 | PRO 2.0 |
| B2-086 | 90-day execution roadmap | pending | P1 | PRO 2.0 |
| B2-087 | Project documentation | pending | P1 | PRO 2.0 |
| B2-088 | Volunteer and contributor onboarding | pending | P2 | PRO 2.0 |
| B2-089 | Financial sustainability plan | pending | P2 | PRO 2.0 |
| B2-090 | Community education initiative | pending | P2 | PRO 2.0 |
| B2-091 | Legal and governance review | pending | P1 | PRO 2.0 |
| B2-092 | Disaster recovery drill | pending | P1 | PRO 2.0 |
| B2-093 | Weekly executive review | pending | P2 | PRO 2.0 |
| B4-001 | Business email DNS and reply-as verification | pending | P0 | PRO 4.0 proposed |
| B4-002 | Cloudflare R2 video custom domain health | pending | P1 | PRO 4.0 proposed |
| B4-003 | Business website screenshot pilot | pending | P1 | PRO 4.0 proposed |
| B4-004 | Admin deletion tombstone end-to-end drill | pending | P0 | PRO 4.0 proposed |
| B4-005 | Publish suppression transparency and recovery UX | pending | P1 | PRO 4.0 proposed |
| B4-006 | Supabase staging proof of concept | pending | P1 | PRO 4.0 proposed |
| B4-007 | Supabase least-privilege data access audit | pending | P0 | PRO 4.0 proposed |
| B4-008 | Cloudflare and Porkbun DNS change register | pending | P1 | PRO 4.0 proposed |
| B4-009 | Public service inquiry spam protection | pending | P1 | PRO 4.0 proposed |
| B4-010 | No-website outreach lead QA | pending | P0 | PRO 4.0 proposed |
| B4-011 | Admin outreach data column and sorting audit | pending | P1 | PRO 4.0 proposed |
| B4-012 | Client demo and discount eligibility controls | pending | P1 | PRO 4.0 proposed |
| B4-013 | Community-facing directory consent and correction policy | pending | P0 | PRO 4.0 proposed |
| B4-014 | Council approval decision register | pending | P0 | PRO 4.0 proposed |
| B4-015 | Council projector and video delivery rehearsal | pending | P1 | PRO 4.0 proposed |
| B4-016 | 2027 cultural gathering governance gate | pending | P0 | PRO 4.0 proposed |
| B4-017 | High Banks source-of-truth site geometry | pending | P1 | PRO 4.0 proposed |
| B4-018 | Video AI disclosure publishing checklist | pending | P0 | PRO 4.0 proposed |
| B4-019 | TRC official wording and attribution baseline | pending | P0 | PRO 4.0 proposed |
| B4-020 | News sourcing and corrections audit trail | pending | P0 | PRO 4.0 proposed |
| B4-021 | Rez Slang current-style migration | pending | P1 | PRO 4.0 proposed |
| B4-022 | Reader-facing professional/rez wording parity | pending | P1 | PRO 4.0 proposed |
| B4-023 | AI 9:16 video prompt QA | pending | P1 | PRO 4.0 proposed |
| B4-024 | Media library upload and compression acceptance | pending | P1 | PRO 4.0 proposed |
| B4-025 | Business directory website enrichment audit | pending | P1 | PRO 4.0 proposed |
| B4-026 | Events authority and cancellation recheck | pending | P1 | PRO 4.0 proposed |
| B4-027 | Search index coverage and sitemap verification | pending | P1 | PRO 4.0 proposed |
| B4-028 | Domain privacy analytics consent recheck | pending | P1 | PRO 4.0 proposed |
| B4-029 | GitHub workflow failure and alert routing | pending | P1 | PRO 4.0 proposed |
| B4-030 | Daily newsroom and discovery overlap audit | pending | P1 | PRO 4.0 proposed |
| B4-031 | Roadmap status evidence and retirement workflow | pending | P0 | PRO 4.0 proposed |
| B4-032 | Roadmap dashboard and action buttons | pending | P1 | PRO 4.0 proposed |
| B4-033 | Roadmap recurring status audit | pending | P0 | PRO 4.0 proposed |
| B4-034 | Editorial and cultural consent records | pending | P0 | PRO 4.0 proposed |
| B4-035 | 2027 gathering feasibility funding gates | pending | P1 | PRO 4.0 proposed |
| B4-036 | Website screenshots legal and robots review | pending | P1 | PRO 4.0 proposed |

## Workstreams and scoped BAKE prompts

Each task's complete standalone BAKE prompt, acceptance criteria, dependencies, source provenance and evidence history is stored in the [canonical JSON](../data/bake-pro-4-roadmap.json). The following descriptions are a readable index.

### Platform, Security & Operations

- **S01 — Repair Directory Validation:** Historical verified work
- **S02 — Repair Directory Update Logging:** Original log failure explained by obsolete count check; missed Winter Market history restored. Still requires a successful new Record new directory and event listings workflow run on actual dataset change. Do not manufacture data.
- **S03 — Repair Chromium Browser Tests:** HTML and JSON live checks passed. Still requires real browser JavaScript-rendered business and church listings; inspect and repair Chromium workflow only if actual failure remains.
- **B2-001 — Repair admin deletions:** Audit backups, deletion persistence, recoverable history and importer suppression across all three directories.
- **B2-002 — Supabase migration:** Guide database setup, schema, secure access, staged import and rollback without interrupting the live website.
- **B2-003 — Security audit:** Inspect authentication, secrets, permissions, input validation, rate limits and admin access.
- **B2-004 — GitHub deployment health:** Investigate failed workflows, deployment status, branch protection and build integrity.
- **B2-005 — Data backups & recovery:** Establish scheduled snapshots, restore procedures and test recovery.
- **B2-006 — Discovery 2.0 importer safety:** Verify deduplication, deletion suppression, source quality, failure handling and data integrity.
- **B2-007 — Admin dashboard overhaul:** Improve business, church and event editing, filters, verification and usability.
- **B2-008 — Website regression testing:** Check navigation, mobile layouts, links, forms, media and accessibility.
- **B2-009 — Analytics & consent audit:** Verify consent-dependent analytics, tracking coverage and privacy controls.
- **B4-029 — GitHub workflow failure and alert routing:** Inventory failed validation, discovery, browser and publishing workflows; assign owners and error alerts, excluding expected cancelled runs.

### Video & Podcast Production

- **B2-010 — Publish first R2 video:** Verify the uploaded blooper plays on the website and that the video library is live.
- **B2-011 — Build complete video library:** Add categories, episode pages, thumbnails, captions and video metadata.
- **B2-012 — Video compression workflow:** Standardize efficient 480p vertical MP4 exports with acceptable audio and visual quality.
- **B2-013 — The Owl's Lens podcast hub:** Create episode organization, host profiles, show descriptions and archives.
- **B2-014 — TRC episode production pipeline:** Organize 94 Calls to Action scripts, recording status, revisions and publishing.
- **B2-015 — Daily QPrompt script studio:** Create source-verified scripts with speaker labels, Rez Slang 9.0 and established formatting.
- **B2-016 — AI video production system:** Standardize Grok Imagine and Firefly prompts, reference frames and continuity.
- **B2-017 — Mascot animation package:** Develop consistent grey owl, red-tailed hawk and love-child intro/outro assets.
- **B2-018 — Residential school history shorts:** Develop carefully sourced, respectful reenactments with the required disclosure.
- **B2-019 — Captions and accessibility:** Create transcript, subtitle and accessible video publishing workflows.
- **B2-020 — Interview production plan:** Prepare the Jordan Ermatinger interview and Knowledge Worth Preserving series.
- **B2-021 — Media publishing calendar:** Coordinate recording, editing, website publishing and social promotion.

### Website, Newsroom & SEO

- **B2-022 — SEO technical audit:** Inspect indexing, metadata, structured data, canonicals and crawl errors.
- **B2-023 — Google & Bing submission:** Prepare sitemap submission and search verification instructions.
- **B2-024 — Newsroom improvements:** Improve article templates, sourcing, archives, search and categorization.
- **B2-025 — Professional / Rez Slang 9.0 toggle:** Implement reviewed alternate article versions and persistent reader selection.
- **B2-026 — Community landing pages:** Create useful crawlable regional and community directory pages.
- **B2-027 — Video SEO:** Add video schema, descriptive pages and discovery metadata.
- **B2-028 — Website speed optimization:** Reduce asset weight, optimize caching and improve mobile performance.
- **B2-029 — Accessibility audit:** Review keyboard use, contrast, labels, screen readers and captions.
- **B2-030 — Website contact & inquiry system:** Build secure inquiry forms and follow-up workflows.
- **B2-031 — Newsletter development:** Plan consent-based email subscriptions and a weekly news digest.
- **B2-032 — Social sharing improvements:** Improve previews, thumbnails, share links and campaign tracking.
- **B4-027 — Search index coverage and sitemap verification:** Verify sitemap reachability, canonical links, feeds, indexing hints and curated region pages without generating thin or invented SEO pages.

### Directory & Discovery

- **B2-033 — Business discovery expansion:** Research and add legitimate sourced businesses while preventing duplicates.
- **B2-034 — Phone but no website leads:** Verify and prioritize outreach-ready businesses with public phone numbers.
- **B2-035 — Business website enrichment:** Find missing official websites and update existing records without duplicating listings.
- **B2-036 — Business verification workflow:** Improve owner claims, public contact verification and listing statuses.
- **B2-037 — Church directory expansion:** Find eligible Indigenous-run and on-reserve churches across Canada.
- **B2-038 — Events calendar expansion:** Add organizer-verified cultural events with accurate dates and source links.
- **B2-039 — Events cancellation monitoring:** Check changes and cancellations before promoting upcoming events.
- **B2-040 — Directory quality review:** Flag unsupported, duplicate or closed listings for evidence-based review.
- **B2-041 — Directory updates history:** Publish additions and changes by run without exposing private admin information.
- **B2-042 — Community submission portal:** Plan secure owner-submitted listings, corrections and event submissions.
- **B4-003 — Business website screenshot pilot:** Capture safe WebP previews for 20 eligible public business websites with Playwright, metadata, privacy safeguards, lazy load and admin refresh controls.
- **B4-025 — Business directory website enrichment audit:** Verify independent official websites before adding to existing records and enforce deduplication, append-only import and deletion suppression.
- **B4-026 — Events authority and cancellation recheck:** Track official organizer evidence, cancellations and reschedules for upcoming cultural events, and publish correction timestamps.
- **B4-036 — Website screenshots legal and robots review:** Assess website screenshot permission, robots and image license policies; avoid private pages, security bypass and unapproved brand implications.

### Services & Revenue

- **B2-043 — Business outreach campaign:** Produce 10 verified leads, short calling scripts and follow-up actions.
- **B2-044 — Website services sales funnel:** Improve free consultations, demo pages, quoting and conversion.
- **B2-045 — Services page revision:** Audit current pricing, 33% discount rules, revisions and lifetime guarantee wording.
- **B2-046 — Business card finalization:** Finalize front and back with current contact information and services.
- **B2-047 — Full-page services advertisement:** Prepare a print-ready advertisement featuring the owl and hawk.
- **B2-048 — Client demo website templates:** Create reusable one-page and five-page website demos.
- **B2-049 — Client CRM and follow-ups:** Track prospects, contact attempts, quotes, approvals and next actions.
- **B2-050 — Contracts and service terms:** Draft website service scope, revisions, maintenance and guarantee terms.
- **B2-051 — Invoicing and payment workflow:** Plan professional invoicing, receipts, taxes and payment tracking.
- **B2-052 — Sponsorship opportunities:** Design ethical, clearly labeled podcast, website and event sponsorship packages.
- **B2-053 — Revenue dashboard:** Track qualified leads, conversions, revenue, costs and recurring obligations.
- **B4-009 — Public service inquiry spam protection:** Validate contact form spam controls, rate limits, anti-abuse logging, privacy notice, inbox routing and response workflow.
- **B4-012 — Client demo and discount eligibility controls:** Encode free custom demo and 33% no-demo discount eligibility transparently across outreach scripts, quotes and service terms.

### Council & 2027 Gathering

- **B2-054 — Council presentation package:** Prepare proposal documents, projector slides and a clear approvals request.
- **B2-055 — Alicia council correspondence:** Review outstanding submission requirements and draft a professional response.
- **B2-056 — Camera and drone permissions:** Develop location-specific permission requests, safety and privacy procedures.
- **B2-057 — 2027 gathering master plan:** Develop governance, programming, milestones and provisional budgets.
- **B2-058 — High Banks venue planning:** Prepare a site plan based on verified references, access and facilities.
- **B2-059 — Cultural advisory circle:** Draft respectful invitations and a proposed community-led decision process.
- **B2-060 — Knowledge Keeper participation:** Plan invitations, honoraria, consent and cultural protocols.
- **B2-061 — Gathering budget and grants:** Develop funding scenarios, eligible grant research and application preparation.
- **B2-062 — Sponsors and community partners:** Create sponsor packages and an outreach approval workflow.
- **B2-063 — Event safety and accessibility:** Plan emergency procedures, sanitation, mobility access, volunteers and insurance.
- **B2-064 — Gathering teaser and presentation video:** Produce a historically and geographically faithful promotional plan.
- **B2-065 — Gathering registration and website:** Plan event information, attendance estimates and consent-aware registration.
- **B4-014 — Council approval decision register:** Track each council request separately: cameras, drone filming, venue access and permission to plan 2027 gathering; never imply approval from outreach alone.
- **B4-015 — Council projector and video delivery rehearsal:** Prepare offline USB/video fallbacks, projection tests, permission-safe visuals and supporting documents for council presentation.
- **B4-016 — 2027 cultural gathering governance gate:** Define decision rights, community approvals, Knowledge Keeper protocols and stage gates before public announcements or spending.
- **B4-017 — High Banks source-of-truth site geometry:** Catalog user-provided site photographs and verified stage/shelter/arena geometry; reject invented structures in event visuals.
- **B4-035 — 2027 gathering feasibility funding gates:** Establish approvals, accessibility, insurance, funding and staffing thresholds before commitments or public registration.

### TRC & Editorial

- **B2-066 — TRC 94 Calls audit:** Audit the 94 scripts against official wording, sources, duration and speaker balance.
- **B2-067 — Finish outstanding TRC script revisions:** Review unresolved batches and reconcile QPrompt and published versions.
- **B2-068 — Daily verified news pipeline:** Improve source checking, publication dates, affected Calls and accountability questions.
- **B2-069 — TRC progress tracker:** Build a sourced tracker of developments, responsible bodies and unresolved actions.
- **B2-070 — Investigations standards:** Develop corrections, right-of-reply, source verification and editorial review policies.
- **B2-071 — Two-Eyed Seeing educational series:** Outline community-informed episodes with appropriate cultural review.
- **B2-072 — Indigenous language and culture series:** Plan respectful language and cultural content with qualified community contributors.
- **B2-073 — News corrections log:** Create a transparent, recoverable corrections and updates process.
- **B2-074 — Historical reenactment policy:** Formalize AI disclosure, rights checks, sourcing and consent requirements.
- **B4-019 — TRC official wording and attribution baseline:** Cross-check every released TRC script against official Call wording and citations, preserve distinction between fact and commentary, and audit speaker balance.

### Marketing & Partnerships

- **B2-075 — Facebook growth plan:** Create a sustainable posting, group engagement and community feedback schedule.
- **B2-076 — YouTube channel launch audit:** Check channel readiness, branding, uploads and feature access.
- **B2-077 — Instagram and TikTok rollout:** Plan vertical-video profiles, publishing templates and platform workflows.
- **B2-078 — LinkedIn growth plan:** Improve the company page, portfolio, partnerships and professional outreach.
- **B2-079 — Rez Slang 9.0 feedback campaign:** Gather community feedback on wording and appropriate use.
- **B2-080 — Cross-platform content repurposing:** Turn approved episodes into shorts, articles, clips and social posts.
- **B2-081 — Partnership outreach:** Prepare proposals for Indigenous organizations, educators and media collaborators.
- **B2-082 — Audience insights dashboard:** Measure content reach, engagement, retention and conversions.
- **B2-083 — Media kit and press package:** Create an organization profile, mission, services, logos and contact information.

### Management & Governance

- **B2-084 — Daily operations dashboard:** Consolidate tasks, scripts, discovery runs, deadlines and production progress.
- **B2-085 — Scheduled automations audit:** Review existing tasks, overlapping briefings, failures and notification timing.
- **B2-086 — 90-day execution roadmap:** Prioritize work by dependencies, capacity, cost and measurable outcomes.
- **B2-087 — Project documentation:** Create a technical and editorial handbook for continuity and onboarding.
- **B2-088 — Volunteer and contributor onboarding:** Prepare role descriptions, training and contributor guidelines.
- **B2-089 — Financial sustainability plan:** Develop operating budgets, revenue scenarios and cost controls.
- **B2-090 — Community education initiative:** Explore future training, workshops and learning resources.
- **B2-091 — Legal and governance review:** Identify organization structure, privacy, intellectual property and compliance questions.
- **B2-092 — Disaster recovery drill:** Test documented recovery procedures for website, media and directories.
- **B2-093 — Weekly executive review:** Summarize completed work, blockers, costs, risks and next decisions.

### Communications & Identity

- **B4-001 — Business email DNS and reply-as verification:** Verify actual DNS provider, MX/SPF/DKIM/DMARC, incoming forwarding and Gmail send-as; independently check deliverability.
- **B4-008 — Cloudflare and Porkbun DNS change register:** Inventory current DNS, delegated nameservers, Cloudflare proxy settings and reversible change process; never publish credentials.

### Media Infrastructure

- **B4-002 — Cloudflare R2 video custom domain health:** Audit videos.deltaowleyes.ca DNS, R2 custom-domain configuration, access controls, caching, playback and CORS without exposing storage credentials.
- **B4-024 — Media library upload and compression acceptance:** Verify 480p 9:16 MP4 size, quality, subtitles, source rights and R2 website playback; publish only reviewed videos.

### Data Safety

- **B4-004 — Admin deletion tombstone end-to-end drill:** Verify soft-delete, public removal, durable importer suppression, restore, audit history, and privacy on business, church and event records using nonproduction test fixtures.
- **B4-005 — Publish suppression transparency and recovery UX:** Document reversible archive and suppression states in admin without exposing internal deletion identities or private contact notes.

### Platform & Backend

- **B4-006 — Supabase staging proof of concept:** Build a separate staging environment, schema, migration dry-run and rollback plan for business, church and event records before any live cutover.

### Security & Privacy

- **B4-007 — Supabase least-privilege data access audit:** Verify row-level policies, service keys, moderation permissions, audit logs and safe separation of private/public data before enabling writes.
- **B4-028 — Domain privacy analytics consent recheck:** Verify opt-in-only Google Analytics, consent revocation, privacy text and no third-party tracking prior to consent.

### Business Outreach

- **B4-010 — No-website outreach lead QA:** Derive leads exclusively from directory records with verified public phone, missing official website and no prior contact attempt; distinguish Indigenous eligibility.
- **B4-011 — Admin outreach data column and sorting audit:** Ensure city, website and phone columns display correctly and last-field placement, date-added and proximity sorts are reliable without leaking notes.

### Governance & Privacy

- **B4-013 — Community-facing directory consent and correction policy:** Clarify unverified listings, correction requests, Indigenous ownership claims, reserve location verification, residential privacy and removal rights.
- **B4-034 — Editorial and cultural consent records:** Separate consent for interviews, footage, cultural practices, Knowledge Keepers and minors; define retention, revocation and review workflow.

### Editorial & Production

- **B4-018 — Video AI disclosure publishing checklist:** Ensure AI historical reenactments carry approved educational-disclosure language, age-appropriate casting, trauma safeguards and source provenance.
- **B4-021 — Rez Slang current-style migration:** Replace stale scripts' Rez Slang 9.0 references with the current approved vocabulary and distribution rules, without altering factual quotations or sacred topics.
- **B4-023 — AI 9:16 video prompt QA:** Create reusable 6-second/10-second prompts with exact on-screen text protection, consistent owl/hawk design, and copy actions bound to their own prompts.

### Newsroom & Accountability

- **B4-020 — News sourcing and corrections audit trail:** Attach original publication dates, authoritative URLs, edits and corrections to newsroom stories without backdating or fictional attribution.
- **B4-022 — Reader-facing professional/rez wording parity:** Check both news presentation styles for factual equivalence, reviewed versions, selected-style persistence and accessibility.

### Operations & Automation

- **B4-030 — Daily newsroom and discovery overlap audit:** Reconcile overlapping daily news briefings and hourly discovery tasks, reduce redundant alerts and define actionable schedules.

### Roadmap Governance

- **B4-031 — Roadmap status evidence and retirement workflow:** Provide auditable status transitions, append-only evidence, task retirement with reason, restoration and approvals; do not erase old IDs.
- **B4-032 — Roadmap dashboard and action buttons:** Generate public-safe interactive roadmap view showing priority, owner, blocked dependencies, verification state and copy-ready BAKE prompts with correctly bound buttons.
- **B4-033 — Roadmap recurring status audit:** Schedule read-only GitHub-backed reconciliation with evidence-based proposed status changes, clear limits and no speculative completion.

## Source and migration records

- [Original 93-action PRO 2.0 export](BAKE-PRO-2-ORIGINAL-93-ACTIONS.md)
- [Prior PRO 3.0 unified registry](../data/bake-pro-3-roadmap.json)
- [PRO 3.0 migration report](BAKE-PRO-3-UNIFIED-MIGRATION-REPORT.md)
- [Automated BAKE PRO 4.0 roadmap validator](../scripts/check_bake_pro_4_roadmap.py)
- [Narrow daily evidence reconciliation](../scripts/sync_bake_pro_4_roadmap.py)
