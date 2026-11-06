# Discovery 4.0 — Indigenous Grants & Funding

Initial build: 2026-11-06. Public route: `/grants/`. Data: `data/indigenous-grants.json`.

## Scope and guardrails
Discovery 4.0 adds a **separate Indigenous grants and funding stream** without replacing Discovery 3.0's businesses, churches, events or education resource streams. The 20-record source-reviewed seed covers First Nations, Inuit and Métis–relevant opportunities in Canada and especially Ontario. It is **not an exhaustive inventory**. List both Indigenous-restricted funding and broader funds explicitly accepting Indigenous applicants, with an accurate applicant label. A grant, non-repayable contribution, repayable loan, bursary and scholarship are not interchangeable.

Never publish an award amount, eligibility, intake date, recipient qualification or available budget based on a news article, third-party aggregator, old PDFs, or an AI guess. Read the **original funder's current page** and link directly. Do not apply or transmit private documents on applicants' behalf. No identities, financial details, applications, community-held knowledge or PII in the public repository.

## Structured catalogue contract
The JSON array is display-order-independent. Each record has an immutable kebab-case `id`, `title`, `funder`, `category` (`arts`, `business`, `community`, `education`, `environment`, `infrastructure`, `languages`, `rights`), `applicant` (`artists`, `businesses`, `communities`, `organizations`, `students`), `region` (`Canada`, `Ontario`, `Southern Ontario` currently), `funding_type`, `amount`, ISO `deadline` or null, `deadline_label` with exact time zone when documented, `intake` (`open`, `rolling`, `contact`, `check`, `upcoming`, `closed`), `description`, `eligibility`, `how_to_apply`, HTTPS `source_url`, ISO `last_source_review`, and `verification: official_source_reviewed`.

Dates are **not guarantees**. Client rendering downgrades an expired deadline from `open` to `closed`, and a source older than 30 days from `open` / `rolling` to `check`. Deadline date comparisons are based on viewer calendar date; time zone and precise cutoff must be confirmed on the funder's page. Never automatically revive a closed call or declare an unknown intake open. Program-level `contact` entries are not claimed to be currently accepting applications. Programs with closed intakes remain discoverable for future-planning, prominently labelled.

Deduplicate by canonical program identity and original `funder+title`. A single provincial program listing page can support multiple distinct funding streams, so source URLs may repeat; each individual listing must be substantively distinct.

## Safe ongoing discovery
1. Each hourly Discovery 4.0 cycle **retains all former Discovery 3.0 rules** and may research up to **two** grants in the additional stream. Prioritize Bkejwanong, neighbouring First Nations and southwestern Ontario, then the rest of Ontario and Canada. Rotate official government, Indigenous-led foundations, colleges, arts councils and Nation sources. No arbitrary quota: zero safe additions is correct.
2. Before editing, read the latest `main`, the complete grant catalogue and `data/indigenous-grants-suppressed.json`. Never reintroduce suppressed ID or funder/title. Prefer updating a trusted existing record when source evidence changes rather than adding a near duplicate.
3. Confirm original source, eligibility, program type, intake status and deadline with time zone; when missing use `contact` / `check`, null deadline and cautious text. If closed, label it closed. Use exact `last_source_review` only after opening the source during the current run.
4. Routine discovery edits **only** `data/indigenous-grants.json` (and existing allowed directory/education JSON files under their separate rules). No hourly changes to HTML/JS/Python, workflow, existing tombstones, deleted entries or unrelated assets.
5. Make a clean branch from latest `main`. Run `python3 scripts/check_indigenous_grants.py`; review deduplication, privacy and all affected source facts before requesting merge. Leave the JSON unchanged if cannot validate or authorization is unclear. Never force-push, overwrite unrelated updates or silently merge unreviewed material.
6. Dedicated weekly GitHub Actions `grant-source-health.yml` audits provider HTTP reachability, 30-day review age and passed dates. It writes a temporary report artifact only. HTTP 403/429/timeouts are **not** evidence a grant is gone; a human must review the source before correcting or suppressing a listing.
7. The public page allows reports through an email link only, never a public application upload. A legitimate takedown/correction must be reviewed without displaying complainant information. To suppress, append a public, nonpersonal tombstone with `id`, `title`, `funder`, `removed_on`, generic `reason`, then remove the live row in the same authorized change. Validator blocks reintroduction. Confidential communications must stay outside the public repo.

## Source evidence / first batch
Initial primary-source pages and exact funding-stream summaries are in each JSON record. Key sources:
- Canadian Heritage First Nations Languages Funding Model: intake Oct 5–Nov 16, 2026, Ontario uses regional organization.
- Ontario funding page: Indigenous Transportation Initiatives Fund (Dec 9, 2026), Indigenous Participation Fund consultation supports (ongoing), First Nations public library streams (Nov 19, 2026), general Community Sport and Recreation Infrastructure Fund (Dec 22, 2026), for which Indigenous communities can apply.
- Canada Council for the Arts Creating, Knowing and Sharing: short-term projects (Nov 25, 2026), rolling travel and small-scale activities, organizational intake Fall 2027.
- Natural Resources Canada Indigenous Forestry Initiative — Grant Funding: up to C$45,000; original page shows open until Sep 1, 2028; actual available budget must be checked.
- Indspire Building Brighter Futures: bursaries/scholarships with recurring academic-year deadlines; next listed Feb 1, 2027, marked recheck rather than guaranteeing current application.
- Indigenous Services Canada PSSSP and Post-Secondary Partnerships Program: locally or regionally administered; deadlines vary.
- Ontario Indigenous Student Bursary: institution-administered.
- FedDev Ontario Indigenous business support: contact directly; some assistance may be repayable; not automatically a grant.
- Ontario Indigenous Economic Development Fund and Indigenous Community Capital Grants: last documented intakes closed in 2025; not presented as open.
- Federal Indigenous Leadership Fund First Nations and Designated streams: provider currently says closed.

## Acceptance
Before publishing: validate source data and tombstones, check page JS and shared navigation syntax, run the page on 320/390/768/1440px Chromium, test search/facets, expiring deadlines, keyboard navigation, no overflow, external rel values, privacy reject, homepage and sitemap links. Check live site after merge, not just GitHub branch. Preserve current Education Hub and all other directory rules. No paid APIs or unapproved upgrades. Actual provider charges/Actions billing are unknown until verified.
