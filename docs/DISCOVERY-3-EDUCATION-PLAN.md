# Delta Owl Eyes Education Hub / Discovery 3.0

Status (2026-11-06): Education Hub 1.1 was merged and independently verified live with 28 resources; Education Governance 1.2 adds two official-provider courses, privacy-conscious correction/takedown contact, an authenticated local editorial queue, source-health checks and business shard diagnostics on a review branch. Refer to docs/EDUCATION-GOVERNANCE-1-2.md. Existing business, Indigenous church and event rules remain in force.

## Purpose and eligibility

The **Education** page at `/education/` is a discovery hub for (A) educational opportunities expressly offered to Indigenous learners and (B) learning about Indigenous peoples, histories, present-day experiences and knowledge systems, including resources open to anyone. These two populations must never be conflated. An Indigenous-run school is **not automatically Indigenous-only**, and Indigenous subject matter is **not automatically open access**.

Supported opportunities include schools, university/college certificate programs, short courses and MOOCs, apprenticeships and trades, scholarships and bursaries, internships and mentorships, community language programs, land-based teaching, food sovereignty, medicines, cultural arts, residential school Survivor testimonies, TRC and treaty history, Indigenous governance, self-determination, activism, Indigenous-made media, teacher resources, webinars, knowledge keeper teachings, and public events with substantial learning programs.

## Discovery 3.0 pipeline

1. Preserve all existing Discovery 2.0 business / church / event discovery, validation, source rotation, directory-import rules, deduplication and deletion suppression. No migration of those data files is required.
2. Add a *separate education source-review stream*. Prioritize Bkejwanong/Walpole Island, Chatham-Kent, nearby Nations, southern Ontario, then rotate across Canada. Seek **official primary-source** resource pages from Nations, community cultural centres, Indigenous-controlled institutions, educators, libraries, universities, nonprofit organizations, archives, and video channels. Respect robots.txt, platform terms and Indigenous data sovereignty.
3. Add only uniquely documented records. Search the full existing `data/education-resources.json` catalogue by stable ID, normalized provider + title and canonicalized URL before append. Where a course appears on multiple platforms, prefer its original provider as canonical, and cross-link sources without duplicating.
4. For each resource capture the fields from the schema below; link only to a live, public **source page** whose subject and conditions match the listing. Never assert current intake, seat availability, exact fees, eligibility, certification or deadline without provider evidence. When those facts are unknown, use **Check provider requirements**, **Fees vary**, or **See provider**; do not fabricate.
5. Eligibility values: `indigenous-only` only when primary-source requirements expressly limit applicants or support to Indigenous learners; `open` when source expressly invites general learners; `check-provider` otherwise. This is a provider policy, not Delta Owl Eyes' determination of identity.
6. Revisit changing scholarships, intakes and time-sensitive programs first; refresh last review date only after a real source check. Do not leave expired deadlines as current. Record a source URL and meaningful review evidence; link corrections must update existing IDs.
7. Maintain ethical protocols: link out to recordings without copying, downloading or rehosting them; do not reproduce privately shared knowledge, ceremonies, recordings, songs, community-held intellectual property or restricted archives without explicit permission. Add trauma advisory for Survivor testimony and follow original content advisories. Avoid collecting minors' data.
8. Honor corrections, withdrawals, takedown and cultural access requests. Never silently reimport a resource after removal. The initial `data/education-suppressed.json` ledger records removed stable ID, canonical HTTPS URL, removal reason and review date; the education validator rejects a reimported ID or URL. Editorial review and a full request workflow are still planned.
9. Treat the new stream as **JSON-only** after code release. Do not let routine discovery tasks rewrite site HTML, JavaScript, Python, SEO tools or workflows. Run schema/deduplication checks before any JSON commit and report precise additions, changes, exclusions and verification evidence.
10. Measure success by coverage, source quality, active links, verified conditions and community ownership — **not** synthetic quotas.

## V1 catalogue contract

Location: `data/education-resources.json`. JSON array of objects in display order. Required fields:
- `id`: immutable kebab-case string; never reuse deleted IDs.
- `title`, `provider`, `description`: readable, source-faithful summary and attribution.
- `category`: one of `schools`, `courses`, `land`, `languages`, `survivor-stories`, `videos`, `advocacy`, `funding`, `teaching`, `knowledge-keepers`.
- `format`: `online`, `hybrid` or `on-site`.
- `eligibility`: `indigenous-only`, `open`, `check-provider`.
- `price`: cautious text; changing prices must not be guessed.
- `url`, `source_url`: HTTPS original source URLs.
- `region`: delivery geography; avoid private personal locations.
- `notice`: enrollment qualification, permission guidance, or content advisory.
- `last_source_review`: ISO local review date (YYYY-MM-DD).
- `verification`: `provider_source_reviewed` only when the resource was actually reviewed at a primary source; **does not assert enrollment/open seats**.

V1.1 displays text-only cards with direct external links, search, category/eligibility/format filters (including on-site), a Bkejwanong local-first shortcut, community knowledge-keeper discovery, visible provenance and advisory. It does **not** scrape arbitrary platforms, automatically embed videos, take user submissions, or guarantee program availability.

## Phase 2 and phase 3

- A review queue and moderation workflow for community-nominated entries, correction/removal ledger and durable suppression/tombstones.
- Expand taxonomy to apprenticeships/trades, careers, youth, elders, health, arts, research, rights, environmental stewardship, digital skills and local in-person programs.
- More precise faceted filters: free/paid, region/Nation, age or grade, language, credential, program dates, accessibility, online vs local and application status, grounded in provider evidence.
- Structured video catalogue: official channel, original video URL, description, content advisory, consent/publication status, duration and transcript language if supplied by provider. Only embed on explicit provider permission and platform rules.
- Editorially reviewed learning pathways: TRC foundations, treaty relationships, histories of residential schools, land-based learning, language revitalization, governance and Indigenous entrepreneurship. Community review before publishing cultural interpretations.
- Scheduled link validation and re-review with source-change queue; safely handle 404s without silent deletion. Source evidence and governance sign-off for restricted materials.
- Impact dashboard: active source count, Ontario/local coverage, provider representation, corrections and last-reviewed freshness. Avoid collecting sensitive learner data.

## Quality gates / rollback

Before release: validate source JSON, stable IDs, allowed categories and eligibility, direct HTTPS origins and render code; check page at 320 / 390 / 768 / 1440px, keyboard filters and headings, privacy-consent initialization, old homepage and menu links, mobile navigation, SEO canonical and sitemap, and external links. Use no paid APIs and preserve unrelated pages. A launch is not a complete Discovery 3.0 automation until the scheduled job itself has been updated and has produced an independently verified run.

Rollback: revert the Education page, homepage tile/navigation and sitemap commit; preserve the education catalogue and original source evidence as historical data unless a specific takedown requires removal.

## Deletion/suppression protocol (v1)

When an owner or legitimate rights holder requests removal, stop publication of that record, append a durable tombstone to `data/education-suppressed.json` with `id`, `url`, `reason`, `removed_on`, then remove the live catalogue entry in the same reviewed change. The validator will reject reusing either the ID or original URL. Do not expose complainant personal details or sensitive cultural context in the public repository. Verify the published site no longer shows the record and retain the restoration decision log offline or in an access-controlled system. Never delete or edit tombstones to make new imports pass.

## Education Hub 1.1 source-review batch — 2026-11-06

The following were checked against official provider-controlled public pages at the time of this batch. These are *directory links*, not confirmation of current seats, funding approvals, open drop-in availability or permission to reuse video/audio/cultural material. All new records are source-linked and have conservative access labels.

| ID | Original provider page | Review / caution |
| --- | --- | --- |
| wifn-post-secondary-support | https://www.walpoleislandfirstnation.ca/post-secondary | Funding support for WIFN members; Indigenous-only eligibility expressly supported |
| wifn-adult-learning | https://www.walpoleislandfirstnation.ca/education-department | Adult credit learning; contact for enrolment and fees |
| wifn-anishinaabemowin-immersion | https://www.walpoleislandfirstnation.ca/ak-immersion | Kindergarten–Grade 6 school, includes land learning; not public drop-in |
| wifn-employment-training | https://www.walpoleislandfirstnation.ca/employment-and-training | Skills/career support; no invented course schedule |
| wifn-bbk-elders-language | https://www.walpoleislandfirstnation.ca/bbk | Early years language circle and Visiting Elders; provider-managed participation |
| wifn-heritage-centre | https://www.walpoleislandfirstnation.ca/heritage-centre | Official archive/environmental research centre; no guaranteed open instruction |
| oneida-standing-stone | https://oneida.on.ca/education/standing-stone-school/ | JK–Grade 6; cultural component; admissions unverified |
| oneida-learning-language | https://oneidalanguage.ca/learn-our-language/ | Original language lessons and self-study materials |
| oneida-language-videos | https://oneidalanguage.ca/oneida-culture/enjoy-some-oneidalanguage-videos/ | Original-provider video catalogue; no third-party rehosting |
| oneida-master-speakers | https://oneidalanguage.ca/about-us/master-speakers/ | Community-controlled Master Speaker recordings; provider's deceased-speaker advisory |
| oneida-hunt-camp-learning | https://oneidalanguage.ca/learn-our-language/speak-oneidalanguage-now/oneida-hunt-camp/ | Language/hunt-camp vocabulary; not a live hunting workshop |
| nctr-indigenous-reclaim | https://trw-svr.nctr.ca/portal/virtual/indigenous-reclaim-living-traditional-teachings/ | NCTR provider video; registration/access conditions; hide-tanning and cultural teachings |
| nctr-northern-survivors | https://trw-svr.nctr.ca/portal/virtual/northern-survivors-of-ile-a-la-crosse-stories-of-strength-loss-and-resilience/ | NCTR Survivor video; trauma advisory and portal conditions |
| nctr-eugene-arcand | https://nctr.ca/exhibits/eugene-arcand-survivor-shares-his-truth-of-survival-sports-and-healing/ | Public NCTR Survivor exhibit with content advisory |

Initial catalogue spot-audit: official source pages and access statements for Indspire, Six Nations Polytechnic, FNUniv Reconciliation certificate, Alberta Indigenous Canada, Yellowhead School, NCTR virtual education and Survivor resources, NCTR Archives, NCCIE Teaching Resource Centre, FirstVoices, OISE and Woodland Cultural Centre were reviewed. The U of Alberta offers a free *first-module preview*, not a fully free certificate; the NCTR teacher portal requires registration; FirstVoices communities retain ownership and can restrict content. One existing NCTR archives listing received a trauma advisory correction. Remaining initial listings should continue to be rechecked periodically; current intake, prices and link accessibility are not guaranteed.

## Automated quality and production checks

- `scripts/check_education_resources.py` validates all required fields, unique IDs/provider-title and canonical URLs, approved categories/formats/eligibility, survivor-specific advisory and the persistent `data/education-suppressed.json` reimport block.
- `scripts/test_education_browser.mjs` uses actual catalogue count, not a brittle fixed number. Chromium tests 320/390/768/1440 widths, no horizontal overflow, title/header/labels, privacy script, outbound HTTPS no-opener links, Indigenous-only/open/check-provider and category/in-person filters, keyboard-triggered Bkejwanong discovery and reset.
- `.github/workflows/education-live-check.yml` checks public `/education/` and `/data/education-resources.json` from a runner with HTTP requests, retrying transient publication delays. It is a separate **live** check; GitHub Pages' successful status alone is not independent public acceptance.
- Public video files remain with the source owner. Do not automate downloads, transcripts, videos, Elder voice cloning, or cultural content redistribution. Contact the original provider for reuse permission.

## Discovery 3.0 scheduled task verification

The existing enabled automation was retitled `Delta Owl Eyes Discovery 3.0` with its exact hourly RRULE preserved, and a separate two-candidate-per-run Education stream was appended to the original business/church/event instructions (unchanged old-directory safeguards). The recorded last run immediately after the upgrade lookup was still the prior Discovery 2.0 run at 2026-11-06 13:22 UTC, so it cannot prove an Education run or publication. An **explicitly observed post-upgrade run**, its source research, safe JSON commits (or reasoned no-change), CI and live status are required before closing B4-040. Do not infer publication from the automation being enabled.

## Education Governance 1.2 implementation reference

Read [Education Governance 1.2](EDUCATION-GOVERNANCE-1-2.md) for the owner-consent policy, staff-local request queue, mandatory GitHub write/admin authorization and dedicated review branch requirements, permanent deletion suppression, weekly read-only external link monitoring, 30-record candidate expansion and a detailed filter evidence plan. The site publishes **mailto** reporting links only; it does not operate an unprotected public database form or expose personal submissions. B4-041 remains in progress until community governance and a confidential multi-reviewer case process are independently verified.
