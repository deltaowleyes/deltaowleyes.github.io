# Delta Owl Eyes Website Factory — Cash Budget and Release Policy
Version 1.0 · Adopted 2026-11-05 · Currency: **Canadian dollars (CAD)**

## Hard limits — user authorization required for spending
- **Experiment / system development**: aggregate incremental cash spending from this factory, since authorization, must remain **strictly below C$1.00**, not C$1 per run or per project.
- **Paid client production**: at most **C$5.00 additional generation-and-QA cash cost per 100 generated options** (C$0.05 per option at full batches). Smaller batches should remain proportional to 5 cents per option unless the user authorizes otherwise. This is a target/constraint, **not a claim that full automation can already achieve it**.
- **Preferred additional cash spend**: C$0.00. No service may be made billable to test the limit.
- Existing subscriptions are excluded from incremental cash *only while they remain within the user's existing entitlements and usage limits*. **Any overage, paid model/API call, new tier, CMS subscription, commercial theme, plugin licence, hosting charge or billable CI runner is included.**
- Client production domains, hosting, ecommerce subscriptions, payment processing and business taxes are NOT silently covered by the factory-generation cap; quote these separately and get client approval before buying/activating anything.

## Fail-closed operational controls
1. Do not store or use credentials for paid AI APIs in GitHub Actions. Do not auto-upgrade any service. Never buy themes or media, install a paid plugin, or switch CI to paid runners.
2. Use original code and owned/previously generated media, or verify a free asset's licence before inclusion. No third-party code, photograph or source-site branded assets may be copied without authorization.
3. Standard public-repository GitHub Actions, free local build/test tools, and existing authorized hosting are the first options. External free tiers must be checked against current provider terms and resource limits before production.
4. The factory budget cannot be reliably enforced by a repository JSON file alone. An external billing statement and usage review are required to determine *actual* spend; CI preflight only disallows declared billable dependencies.
5. Track separately **known paid operations initiated by the factory**, **invoices/usage verified**, and **estimated future variable expense**. Never convert unknown actual cost into C$0.
6. When a free quota would be exceeded, **stop and report a blocker**. Do not silently use a paid fallback.

## Release policy
- Each candidate batch lives at "/PROJECT/vN/" as a non-current, noindex candidate. Latest approved gallery remains untouched.
- Candidates must pass JavaScript/static tests, 320/390/768/1440px Chromium geometry, navigation/interaction tests, asset integrity, desktop/mobile screenshot review and real reference-site screenshot comparison where feasible. Blocked references must be reported as unverified.
- Originality check: distinct grid/hero/navigation/section hierarchy; not simply a colour or typeface variant.
- On approval, create fully working immutable snapshots for the previous release, update the revision index and project registry atomically, change the project root to the new latest, and verify live deployment.
- Do not promote on failed/incomplete QA. No invented testimonials, prices, inventories, credentials, checkout, appointments, or live forms.

## Automation architecture and limits
- Local/Actions CI is excellent for deterministic code generation, linting, thumbnails, screenshot generation, design assemblies and regression checking.
- Creative prompting through the user's existing ChatGPT interface is interactive and subject to plan usage limits. ChatGPT subscriptions do **not** expose unlimited, free unattended API access to GitHub Actions.
- A truly unattended AI production loop needs a separately authorized source of AI inference (e.g. capable user-owned local hardware, a proven no-cost service within its published terms, or a user-approved budget). Do not claim an unattended design engine exists until it is verified.
- BAKE triggers are user-driven; scheduled CI can test existing deterministic candidates without requiring paid AI inference. Report any limits honestly.

## Project history and QA registry
See `data/web-design-projects.json` for latest approved revisions and `data/website-factory-cost-ledger.json` for expenditure evidence. Version 3 Momma Made design directions are documented in `mommamade/v3/REFERENCE-AUDIT.md`.