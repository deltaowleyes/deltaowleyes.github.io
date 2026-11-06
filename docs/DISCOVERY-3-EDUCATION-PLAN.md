# Delta Owl Eyes Education Hub / Discovery 3.0

Status: initial source-linked Education hub implemented on a review branch, pending live acceptance. The existing business, Indigenous church and event discovery rules remain in force.

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
- `category`: one of `schools`, `courses`, `land`, `languages`, `survivor-stories`, `videos`, `advocacy`, `funding`, `teaching`.
- `format`: `online`, `hybrid` or `on-site`.
- `eligibility`: `indigenous-only`, `open`, `check-provider`.
- `price`: cautious text; changing prices must not be guessed.
- `url`, `source_url`: HTTPS original source URLs.
- `region`: delivery geography; avoid private personal locations.
- `notice`: enrollment qualification, permission guidance, or content advisory.
- `last_source_review`: ISO local review date (YYYY-MM-DD).
- `verification`: `provider_source_reviewed` only when the resource was actually reviewed at a primary source; **does not assert enrollment/open seats**.

V1 displays text-only cards with direct external links, search, category/eligibility/format filters, visible provenance and advisory. It does **not** scrape arbitrary platforms, automatically embed videos, take user submissions, or guarantee program availability.

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
