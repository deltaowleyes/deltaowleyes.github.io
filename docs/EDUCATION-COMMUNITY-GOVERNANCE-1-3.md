# Delta Owl Eyes — Indigenous Education Community Governance 1.3

**Prepared:** 2026-11-06. **Canonical task:** B4-041. **Scope:** source-linked public learning directory; private editorial workflows. **Status:** *technical safeguards proposed and tested; community-appointed governance NOT yet established.*

## Community authority and consent

The Education Hub connects readers to original public resources from Indigenous-led organizations, educational institutions and Indigenous community providers. **The platform does not speak for Nations, Elders, Survivors, communities or rights holders.** Listing a course is not an endorsement, permission to reuse teachings, or a determination of Indigenous identity.

Before any formal community advisory representation or policy takes effect:
1. Invite relevant affected Nations/community organizations/knowledge holders to define their own representatives and terms. A contributor, school, Council or individual does **not** automatically speak for all Indigenous peoples.
2. Discuss consent and rights before publication of non-public or culturally restricted resources. Public-source links may be nominated without copying provider media. Do not republish ceremony recordings, Elder voices, Survivor statements, images of children or private cultural material.
3. Respect source-provider and original rights-holder corrections. An urgent cultural-access or privacy concern must be escalated immediately for human assessment. No automatic publication while a consent objection is unresolved.
4. Maintain a clear appeal/reconsideration path. The public website supplies only the editorial email address, never a public comment form with sensitive case information.
5. **Current governance status:** only a proposed process. No community advisory members, approvers, authorization letters or consultation results are documented or implied.

Suggested roles for **future appointment**, not appointments actually made: provider/rights-holder liaison; two independent staff editors; cultural/protocol adviser selected by the relevant Nation or rights holder; privacy and security contact.

## Confidential, multi-reviewer case workflow

The static site routes a suggestion/correction/removal request to the established **deltaowleyes@gmail.com** address. The human staff member first isolates sensitive correspondence in the private mailbox; the public Git history MUST NOT receive names, private letters, restricted knowledge, emails, photographs, permissions or complaints.

Existing intake command (run locally in a cloned repository, not on the site):

\`\`\`sh
python3 scripts/education_editorial.py intake --kind remove --resource-id existing-listing-id
python3 scripts/education_editorial.py queue
\`\`\`

Reviewers independently log in to their own GitHub accounts using the \`gh\` CLI and record their *own* case decision. Each attestation requires access to the original provider page and applicable rights/cultural protocols:

\`\`\`sh
python3 scripts/education_review_cases.py review --ticket CASE_ID --decision approve --checked-provider-and-protocol
python3 scripts/education_review_cases.py status --ticket CASE_ID
\`\`\`

Two **distinct current GitHub collaborators** with write/admin permissions must approve the same pending ticket (and no reviewer may reject) before the existing editorial CLI accepts \`approve\`, \`correct\` or \`remove\`. Each editorial change must still use \`--ticket CASE_ID --confirm-source-reviewed --write\`, a dedicated clean Education branch, the validated catalogue and a reviewed PR. A reviewer losing write/admin access causes the next attempted publication to fail closed.

**Local casebook limitation:** the queue is a private metadata-only JSON file in the authorized staff device's home directory with POSIX 0600 file permission; it is not a hosted team database. Local metadata is not cryptographically tamper-proof. These attestations alone must never be described as server-enforced, independently signed reviews.

**Optional confidential staff handoff:** \`education_review_cases.py seal --output /private/cases.gpg --recipient FINGERPRINT1 --recipient FINGERPRINT2\` uses locally installed GnuPG and requires two independently verified, trusted 40-character public-key fingerprints. \`unseal --input /private/cases.gpg\` validates decrypted metadata, refuses conflicting cases and never commits a bundle to the public repo. Do not exchange secrets or private case files through public PRs or ChatGPT. No GPG keys/second reviewer have been configured or tested here. Cases with different review decisions require manual reconciliation; encryption is not a proof of a reviewer’s GitHub identity.

## GitHub-authoritative two-person PR reviews

\`scripts/check_education_pr_approvals.py --pr 123\` checks GitHub's submitted review API and current reviewer repository roles. It excludes the PR author, repeated reviewer accounts, dismissed or changed reviews, comments, old-head commits and read-only accounts. Two **independent, current-head, write/maintain/admin** approvals are required.

\`.github/workflows/education-review-gate-audit.yml\` offers **manual workflow dispatch** to audit a proposed Education PR. A GitHub Actions token or GitHub App may be denied collaborator-permission API access; the audit then fails **closed**. A staff member with the authorized \`gh\` CLI can run the same read-only script if Actions API permissions are insufficient.

**Critical enforcement gap as of November 6, 2026:** the connected account \`deltaowleyes\` was independently identified through connected GitHub, and its collaborator permission was \`admin\`. However, the GitHub App returned 403 for main's branch-protection endpoint and the rulesets endpoint returned \`[]\`. Neither server-enforced two-person approvals nor an eligible second collaborator have been verified. A successful local test or PR merge is not proof of protection.

**An authorized repository administrator** should, after identifying two legitimate eligible reviewers and confirming plan entitlements, visit:
https://github.com/deltaowleyes/deltaowleyes.github.io/settings/rules
Create a \`main\` branch ruleset requiring PRs, at least **two approving reviews**, dismiss stale approvals/new review after changes, and require relevant status checks (Education governance safety, Education directory validator, browser QA, internal links, directory regression). Inspect bypass actors and permissions. **Do not enable a rule that blocks urgent rights-holder takedowns without an approved emergency escalation route.** Avoid paid branch-protection upgrades without approval.

**Until independently verified**, the review gate is an advisory tool and B4-041 remains **in_progress**. No made-up second reviewer, fake approval, or unreviewed emergency override is allowed.

## Evidence-only learning facets

\`data/education-verified-facets.json\` is a sparse sidecar keyed by existing published resource ID and **the same canonical provider URL**. The current four source-review entries cover:
- Anishinaabeg Kinomaagewgamig immersion (Walpole Island First Nation, Anishinaabemowin, Grades K–6, Bkejwanong) — https://www.walpoleislandfirstnation.ca/ak-immersion
- Fanshawe's Oneida language advanced diploma (Oneida Nation of the Thames program partnership, Onyota’a:ka language, fully online, provider-listed September 2027) — https://www.fanshawec.ca/programs/oni1-oneida-language-immersion-culture-and-teaching/next
- Anishinabek Educational Institute one-year Pre-Health Sciences certificate (online; published Year 1 tuition **C$3,967.62**, subject to change) — https://aeipostsecondary.ca/programs/pre-health-sciences-certificate-program/
- University of Alberta Indigenous Canada (online; optional paid completion certificate) — https://www.ualberta.ca/en/admissions-programs/online-courses/indigenous-canada/index.html

The Education page exposes optional language and Nation/community-*connection* filters only when provider-supported fields exist. A community **connection** is not an assertion of the applicant's identity or a restriction on entry; explicit provider eligibility remains authoritative. All 30 catalogue entries remain visible with no optional filter. Missing values are unknown, not false or free/paid by guess.

No time-sensitive fee or intake is guaranteed: recheck directly before applying. The sidecar is validated by \`scripts/check_education_facets.py\` against existing IDs, provider URLs and review dates.

## University of Alberta HTTP 403 review

A previous automated HEAD request to the official Indigenous Canada URL returned 403, while independent original-source browser retrieval on **2026-11-06** succeeded: https://www.ualberta.ca/en/admissions-programs/online-courses/indigenous-canada/index.html. The university confirms 12 lessons, an introductory free first-module preview, and optional certificate and university-credit paths.

\`data/education-link-corroboration.json\` records that independent review (expiry 2027-02-06). Source health checks now retry blocked HEAD with a bounded GET; if both return 403, the report still says **needs review**, annotated with dated manual corroboration. **Do not silently treat the provider as reachable, delete it or change fees** based on bot behavior.

## Remaining obligations and cost boundary

Pending: two independent authorized reviewers identified and onboarded; real multi-device encrypted handoff; an authorized staff test exercising current CLI GH auth; verified server-enforced review rules; community-selected governance/consultation and consent; private correspondence handling/retention and backup policy; expanding facets to further provider-reviewed records; periodic cultural rights review.

No paid APIs, subscriptions, licences, private cloud databases, GitHub branch-protection upgrades or provider fees are authorized. The CI/Actions scripts use the repository's existing infrastructure; **actual GitHub/third-party billing remains unverified**.


## Initial release audits — 2026-11-06

- Governance 1.3 implementation merged through PR #22, commit \`bec4a12c7981c67d9198b80c42c943a08953dfb7\`. All nine final PR checks passed, including the governance authorization fixtures, metadata schema, original directories, responsive Chromium and three-browser public header. The 4-width screenshot artifact was inspected before merging.
- The first main-branch source-health run after 1.3 was successful as a **read-only diagnostic**: **30 records; 25 automated reachable; 0 confirmed missing; 5 needing review**. The flagged records were four original Oneida language-provider URLs (\`oneida-learning-language\`, \`oneida-language-videos\`, \`oneida-master-speakers\`, \`oneida-hunt-camp-learning\`) which returned network URLError in CI, plus \`uofa-indigenous-canada\` with HTTP 403. Source audit: https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42245394390 .
- All **five** flagged original provider pages were independently accessed in a browser on November 6, 2026. This evidence is stored in \`data/education-link-corroboration.json\` with a finite review expiry. It must not override the network audit status or falsely imply automatic reachability; preserve those entries for follow-up.
- Connected GitHub session \`deltaowleyes\` has real **admin** collaborator permission, confirmed through the GitHub connector. No second reviewer identity is established. Live GPG casebook exchange, a dual-human signed case and a branch-ruleset enforcement probe remain untested.
- No original 30 catalogue records, suppressions, business/church/event directories, or culturally restricted content were changed by 1.3; only optional evidence-backed learning facets and governance infrastructure were added. Billing remains unverified.
