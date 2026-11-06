# Delta Owl Eyes Education Hub — Simple Editorial Process

**Current policy: November 6, 2026.** This plain-language process replaces the overcomplicated 1.3 committee/two-reviewer/GPG proposals. It is managed by the Delta Owl Eyes owners, not an appointed external committee.

## How the Education Hub works

1. **Find or suggest:** People can recommend a publicly available educational resource, or report a mistake or removal concern, by emailing `deltaowleyes@gmail.com` through the links on `/education/`.
2. **Check the original source:** An authorized Delta Owl Eyes editor checks the provider's own website for its title, access requirements, dates, fees, cultural access rules and actual content. If unsure, leave the claim out or say "check provider." Never present an Indigenous-led program as Indigenous-only unless its provider says so.
3. **Publish or correct:** A single authorized editor can make the change through a separate GitHub branch and reviewed change process. The editor authenticates to GitHub, confirms the source, and the automated catalogue/schema/privacy tests must pass. A second editor, committee, encryption setup or special branch-protection rule is **not required**.
4. **Respect removal requests:** An authorized editor can remove an entry on a legitimate provider/rights-holder request or evidence that it should not be publicly listed. Record only a generic removal reason and keep the entry's original ID and URL in `data/education-suppressed.json`, so automatic discovery cannot silently republish it. Do not copy confidential complaints, names or private cultural knowledge into GitHub.
5. **Keep links working:** The weekly read-only original-provider link checker flags sites for review. A website blocking automated requests is not proof it is gone. Source-verified optional filters should display only documented facts; leave all other fields unknown.

## You do not need to learn GitHub commands

For normal additions and corrections, ask ChatGPT to prepare a BAKE that researches the official provider and makes a reviewed pull request. You or Leah can decide what is appropriate to publish. If you prefer doing it yourself, `scripts/education_editorial.py` supports `approve`, `correct`, and `remove`, all requiring a real repository write/admin login, a clean Education feature branch, `--confirm-source-reviewed` and `--write`.

A private local tracking ticket is **optional**. It can help match an email request to a correction, but no ticket or second reviewer is necessary for an authorized owner-initiated edit. The software still checks a supplied ticket's existence and type, and keeps personal details out of public JSON.

## Why the guardrails remain

Delta Owl Eyes links to original providers and does not claim to represent any Nation, Elder, Survivor, institution or rights-holder. Public accessibility alone does not give permission to copy or rehost restricted ceremony, teachings, Indigenous language audio, Survivor testimony, children’s photographs or private materials. Sensitive rights-holder concerns receive careful human review; editorial simplicity does not reduce these protections.

## Historical background

Earlier versions proposed a two-reviewer local casebook, optional GPG encryption and GitHub two-approver review auditing. Those features were **optional ideas, not prerequisites**, and were removed from the active code at the owners' request to keep operations manageable. The history remains in Git commits and PR #22. Neither a community committee nor branch-rule verification is a remaining acceptance condition for the Education directory.

The public Education catalogue has 30 curated resource entries, with a separate sparse source-supported fact layer for supported learning filters. Preserve those records and the deletion-suppression rules. The hourly Discovery pipeline still follows its established business, church, event and Education safety rules. No paid integrations are required.

**Roadmap:** B4-041 uses this simple owner-editorial scope. Any future formal community partnerships, case-management software or additional reviewer arrangements are optional separate projects, only if the owners request them.
