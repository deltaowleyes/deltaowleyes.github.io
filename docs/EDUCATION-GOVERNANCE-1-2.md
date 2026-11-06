# Delta Owl Eyes — Indigenous Education Governance 1.2

**Date:** 2026-11-06  
**Canonical work:** B4-041 in `data/bake-pro-4-roadmap.json`  
**Public page:** https://deltaowleyes.ca/education/  
**Source of truth:** `data/education-resources.json`; durable takedown ledger: `data/education-suppressed.json`.

## Governing principles

- Education opportunities may be expressly for Indigenous learners, or may be learning **about** Indigenous peoples. Indigenous-led is **not** synonymous with Indigenous-only. `indigenous-only` requires a provider's explicit restriction; otherwise `check-provider` or grounded `open`.
- Community-controlled language, Elder teachings, Survivor stories, photographs and archival media belong to their source owners. **A public webpage is not a reuse licence.** We link directly rather than mirroring media. Do not scrape, download, embed or generate interpretations of restricted teachings without explicit appropriate authorization.
- Correct inaccurate or improperly shared resources rapidly. When an owner/rights holder requests withdrawal, do not demand detailed proof in a public forum, and do not reproduce the underlying sensitive content in public logs.
- We neither ask for nor store names, contact data, tribal status, medical history, minors' information or user identities in the public catalogue or review queue. Reports may be coordinated privately through the established inbox.
- The site remains static GitHub Pages. This phase deliberately **does not pretend to offer a secure on-site intake form**. Education's three request links invoke the sender's own email app, rather than collecting or storing data on the website.

## Current intake and private review queue

Public resource suggestions, correction requests and sensitive takedown requests open a draft addressed to **deltaowleyes@gmail.com**. Public instructions say to send only an original-provider URL or existing listing link, and to arrange a private discussion for sensitive cultural concerns. `info@deltaowleyes.ca` must not replace this inbox until mail sending and receiving are independently verified.

A trusted staff member reads that inbox privately and enters **only public link references** (not requester names, email addresses, phone numbers, private cultural material or the contents of a survivor statement) into a **local** queue:

```sh
python3 scripts/education_editorial.py intake --kind suggest --url "https://provider.example/official-resource"
python3 scripts/education_editorial.py intake --kind correct --resource-id existing-record-id
python3 scripts/education_editorial.py intake --kind remove --resource-id existing-record-id
python3 scripts/education_editorial.py queue
```

Queue path: `~/.delta-owl-eyes/education-editorial-queue.json`, outside the public repository. It is created with owner-only permissions on POSIX systems. A queue item stores ticket ID, request kind, public URL or stable resource ID, timestamp, status. It has **no field** for personal contact details, confidential cultural knowledge or attachments. It is not a substitute for a secure case-management system; staff must control device access and inbox permissions.

## Authentication and editorial authorization

All write operations require:

1. A logged-in **GitHub CLI** `gh` session with `write` or `admin` permission on `deltaowleyes/deltaowleyes.github.io`. The script checks that permission through GitHub's API. **Browser-side admin controls alone do not grant access to this workflow.**
2. A manual check of the **current official provider** page, permitted access and any cultural protocol; explicitly include the `--confirm-source-reviewed` flag.
3. Explicit `--write`; without both the flag and the GitHub authorization, the script fails closed. Source candidate JSON must live **outside** the public repository. Approval is never automatically sent to GitHub.
4. A reviewable Git diff and pull request, ideally reviewed by another authorized staff member before merge. **GitHub branch protection/code-owner approval enforcement has not been independently verified**, so do not claim this is server-enforced two-person approval.

```sh
# Candidate must have the exact public Education schema; keep draft outside repo.
python3 scripts/education_editorial.py approve --file "$HOME/edu-review/new-resource.json" --ticket TICKET_ID --confirm-source-reviewed --write

# Corrections preserve the original stable ID and canonical URL; changing a URL requires separate documented human review.
python3 scripts/education_editorial.py correct --file "$HOME/edu-review/correction.json" --ticket TICKET_ID --confirm-source-reviewed --write

# Generic reason only: never put a complainant name, story or cultural details in public Git.
python3 scripts/education_editorial.py remove --resource-id existing-record-id --reason cultural-access --ticket TICKET_ID --confirm-source-reviewed --write
```

Supported generic removal reasons: `rights-holder-request`, `cultural-access`, `accuracy`, `duplicate`, `withdrawn`, `no-longer-available`, `other`.

Removal simultaneously updates the local catalogue and appends a **permanent** public tombstone containing only stable ID, old canonical URL, generic reason and removal date. It validates against all other records and the ledger; on validation errors it restores the original files. The reimport validator rejects both old IDs and URLs. The script doesn't automatically commit/push, so publication requires authorized GitHub PR review and Pages verification.

**Important limitation:** Git history remains public even after a deletion. For legally sensitive or emergency requests, staff must escalate the public repository history/privacy assessment rather than promising instant historical erasure. Avoid committing private materials in the first place.

## Provider link health and review cadence

`.github/workflows/education-source-health.yml` runs a bounded, no-paid-API **weekly** read-only check (plus manual dispatch). It uses official provider URLs from the curated catalogue, limited concurrent HEAD/GET requests, HTTPS host checks, and records an aggregate report/artifact. The script never automatically deletes or changes listings. A 404/410 is a **manual review lead**, not an automatic takedown; 403/429, anti-bot restrictions, login requirements and network failures are **not proof of an invalid source**. Records last reviewed more than 120 days ago are flagged as needing renewed source verification; time-sensitive enrollment deadlines require faster human review. It never downloads or archives teaching media.

Recorded link audit status must be interpreted cautiously: availability, grants, fees, delivery dates and cultural permission cannot be proven by HTTP status. Human provider review remains required.

## Enhanced filters (design plan, not invented metadata)

Introduce fields only after the provider explicitly supports them and a migration plan has been reviewed:

| Planned filter | Required verified evidence |
| --- | --- |
| Nation/community | Provider's own stated community / Nation relation; never infer identity from location or ownership alone |
| Delivery location | Official virtual/on-site geographic details; exclude residential/private places |
| Language | Provider-stated teaching language or language of media, not guesses from title |
| Learning type | Degree, certificate, course, school, bursary, testimony, video, mentorship or workshop with provider classification |
| Start/deadline | Original program page plus reviewed date and timezone; expired entries must not remain presented as current |
| Cost/financial support | Official, dated fee or free-access statement; support/funding is not guaranteed |
| Age/grade/accessibility | Explicit provider audience/accessibility facts; do not infer eligibility for children or disability accommodations |
| Identity-based eligibility | Only explicit provider rules, handled respectfully; never collect identity proof on Delta Owl Eyes |

Missing values must be **Unknown / confirm with provider**, not hard-coded false or `indigenous-only`. Until verified, retain the existing topic/access/format/search controls.

## First Discovery 3.0 education candidates reviewed

- **Fanshawe College / Oneida community:** https://www.fanshawec.ca/programs/oni1-oneida-language-immersion-culture-and-teaching/next — accelerated advanced diploma, online, September 2027 intake listed, prior language preparation and pre-admission assessment; **not claimed Indigenous-only**. Use cautious provider check for regions and tuition.
- **Anishinabek Educational Institute:** https://aeipostsecondary.ca/programs/pre-health-sciences-certificate-program/ — online one-year Pre-Health Sciences certificate. Provider lists **C$3,967.62 first-year tuition with annual changes**, possible funding and limited seats; **not claimed Indigenous-only**. Do not promise seats or funding.

Both have official primary-source evidence and may be published with `check-provider` eligibility, clear limitations and last-review provenance. Their entries must pass normal catalogue/tombstone validation and CI, then independent production verification.

## Separately audited business phone-shard blocker

GitHub lists `indigenous-businesses/businesses-with-phone.json` at **3,732,500 bytes** and its blob SHA, but the GitHub connector's `fetch_file` content response is empty for that large file. This is a **tool retrieval limit**, not evidence the file is empty. The no-phone shard is about 460 KB and is readable. Existing GitHub Actions `check_directory_data.py` runs from a full checkout and has passed before.

`scripts/audit_business_shards_readonly.py` runs **inside a full GitHub Actions checkout** via `.github/workflows/audit-business-shards-readonly.yml` and reports aggregate counts, missing/misplaced phone fields, duplicate source IDs and recoverable deletion IDs **without outputting individual businesses, phone numbers or private addresses**. It does not solve the separate connector-content limitation and does not modify either shard or bypass full dedupe, alias, provenance and deletion safeguards.

No legacy Discovery 3.0 business, church or event schema, import script, source ledger, suppression file or cadence is modified by this Education change.

## Acceptance and remaining work

**Implemented in 1.2:** original-provider link nominations/corrections/takedown contact, staff-local queue, GitHub role-gated editorial CLI, durable existing tombstones, explicit review protocol, weekly read-only link audit, safe education metadata planning, guarded business-shard diagnostics and tests.

**Not yet complete:** verified community-appointed editorial governance, encrypted/shared multi-reviewer case-management, server-enforced two-person publication approval, confidential takedown case tracking, scheduled source-change detection for deadlines and truly structured metadata filters. Treat B4-041 as **in_progress** until those gaps are evidenced. No paid API or subscription is approved; actual GitHub Actions billing remains unknown until checked.
