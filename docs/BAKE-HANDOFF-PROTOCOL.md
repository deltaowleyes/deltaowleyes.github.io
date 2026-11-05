# BAKE handoff standard — Delta Owl Eyes web design services

## Non-negotiable user interaction rule
For **every unfinished BAKE**, the final response must include a **real one-click BAKE button**, not merely a quoted prompt or Copy button.
In ChatGPT interfaces with interactive controls, use a button whose handler directly submits a complete continuation request (GenUI.issueNewTurn).
Do not present a decorative, nonfunctional button. If the interactive host cannot provide such a button, state that limitation plainly and provide a complete fallback prompt.

## End-of-turn acceptance checklist
1. Distinguish **generated locally**, **uploaded to repository**, **committed**, **tested**, and **deployed**.
2. Record verified repository and test evidence, not unsupported completion claims.
3. Identify exactly what is still unfinished and the single most helpful next action.
4. Include **BAKE — CONTINUE** (one click) whenever any work remains, including image creation, uploads, tests, or deployment.
5. The continuation must be self-contained: repo, branch, files/paths, target URL, constraints, progress, last verified SHA, and pending stages. It must not require manual copying.
6. Use separate continuation BAKEs when useful, but put the primary next action first.
7. Avoid stopping on image generation alone: end with a user-readable status report **and a button**.
8. Do not promise background/asynchronous work or imply an image generated inside chat automatically reached GitHub.

## Web Design Services 2.0
Deliver ten independently structured, reference-inspired website choices. After owner branding / content review, fine-tune and offer another ten choices per revision where requested. Use original/licensed assets only, maintain demo-only booking until authorized, preserve privacy scripts and unrelated files. Verify deployment and run browser QA before calling a change complete.

This document describes the project's handoff expectation. It cannot technically control ChatGPT client controls or force all future conversations to honor it, so responses must still implement it.
