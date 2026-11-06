# Delta Owl Eyes — Public Website Design Studio Sandbox

Public preview URL: https://deltaowleyes.ca/studio-sandbox/

The user explicitly requested that all further Website Design Studio development be visible through a live, public Delta Owl Eyes sandbox URL. This is **not** permission to replace the production homepage or to automatically publish unfinished/unreviewed user data.

## Publishing architecture

- `/studio-sandbox/` is the public visual-review surface served from the repository's existing GitHub Pages publishing branch.
- The first release is a six-panel gallery that embeds the SIX EXISTING PUBLIC DEMOS in `/newdesigns/`: River Voice, Gathering Place, Accountability Desk, Northern Horizons, Community Network, and The Owl's Lens.
- These **are NOT** the new Studio 3.4 multipage candidates. Those 18 routes remain on `feature/doe-studio-2-redesign-pilot` and have not been transferred to the public branch.
- Future BAKEs should develop and test from the isolated feature branch, then publish **only reviewed sandbox-scoped output files** to the public `/studio-sandbox/` path. Never merge the whole feature branch to production.
- Verify the precise URL after each publish using Pages build/deploy evidence and, if accessible, a live HTTP/browser check. Do not say externally verified if only Actions succeeded.
- Compare screenshots of the PUBLIC SANDBOX with the user's original cinematic six-panel Website Design Studio reference after every meaningful change. Obtain visual approval before expanding the number of site families.
- Public previews must not contain real customer private information, non-licensed media, fabricated documentary photographs, or undisclosed mock features.
- Keep accessible keyboard and touch controls, responsive layout, privacy rejection, noindex on unapproved pages, and full functionality of unrelated public site pages.
- The sandbox does not automatically commit/build itself; updates still require GitHub writes and GitHub Pages deployment. External provider billing and remaining quota must be verified before claiming zero-cost operation.

## Visual gates

1. Gallery itself faithful to original reference (cinematic owl left, hawk right, sunset, premium six-panel framing).
2. Actual screenshot evidence desktop 1440 and mobile 390, plus responsive QA at 320 and 768.
3. Accurate statuses: existing public demo versus new factory build versus future direction.
4. Design review by user before substantial additional template generation.
5. Public sandbox acceptance only; production replacement requires a separate explicit user instruction.

Initial sandbox publish: commit `d4a1b3093f13490cd81b688548b731a680de3ef1` on main. The subsequent Pages workflow run `42231353871` completed successfully after an automated asset versioning commit.
