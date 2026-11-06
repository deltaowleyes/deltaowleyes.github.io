# BAKE EXPRESS 1.0

A seven-page, no-purchase website-design selection flow owned by Delta Owl Eyes.

- Landing page: `/deltaexpress/` with **six family previews**.
- Family pages: six routes, each with **six enhancements**; 36 final inquiry-eligible selections.
- **42 preview tiles** total (6 introductory + 36 enhancement). These are not 42 built client websites.
- Hover (desktop) or press Preview (all devices) to open a full-width desktop composition plus an adjacent mobile composition.
- Preview markup is original HTML/CSS rendered inside sandboxed iframes with the site's own published visual assets; no paid API or third-party image requests.
- Each second-step choice carries an immutable design ID into an inquiry dialog. The form uses a prefilled `mailto:` to `deltaowleyes@gmail.com`, plus a copy fallback; **email sending requires the visitor to press Send**. There is no server-side handler, no automatic submission, no database, no payment, and no automated website creation.
- Existing `/assets/privacy-consent.css` and `/assets/privacy-consent.js` are included on all seven pages. Analytics remains opt-in.
- All changes are isolated to `deltaexpress/`, protecting existing pages.
- Build/generation time: a one-hour turnaround is a commercial **target only**; not benchmarked or guaranteed.

## Verification / acceptance checklist
1. All 7 routes load (200) and navigation works.
2. Six cards load on landing; six per family page.
3. Each preview loads at desktop and mobile widths, responds to hover/click, closes via Escape and Close.
4. Each second-step selection passes the correct family, variation, and ID to inquiry form.
5. Email handoff never claims mail was sent automatically; no visitor data leaves before action.
6. Validate at 320, 390, 768, and 1440px in a real browser; check overflows, image loads, console and keyboard access.
7. Test analytics rejection and confirm no analytics network request before consent.
8. Confirm live deployment after merge and GitHub Pages build.

## Next automation phases
- Generate screenshot files (WebP desktop/mobile) from each preview in isolated Chromium CI, then compare against visual baselines.
- Add an authenticated, consent-based, spam-protected contact endpoint after provider and mailbox verification.
- Add pricing rules, lead tracking, repeatable design generation jobs, and approved client customization without automatic charges.
