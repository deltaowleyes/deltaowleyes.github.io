# Shut Your Trap — one-file photography upload

This inbox exists because the ChatGPT container has the 17-photo ZIP, but it cannot transfer local binary bytes to the GitHub connector. **Do not use base64 placeholders or fake uploads.**

## Upload the verified ZIP
1. Download the original `shutyourtrap-photography-pack.zip` attachment from the ChatGPT conversation (sandbox download links do not resolve from GitHub).
2. Open the GitHub upload page: https://github.com/deltaowleyes/deltaowleyes.github.io/upload/main/shutyourtrap/photo-inbox
3. Upload the file exactly as named: `shutyourtrap-photography-pack.zip` (about 5 MiB). Commit to `main`.

The workflow `.github/workflows/shutyourtrap-photo-import.yml` validates all **17 exact SHA-256 values** and their WebP headers, extracts them to `shutyourtrap/assets/photos/`, writes `assets/photos/status.json` to enable the photography mode, and removes the temporary ZIP from git. The existing SVG files remain as fallbacks.

The existing `shutyourtrap-qa.yml` workflow runs on the resulting commit and GitHub Pages deploys via its existing process. Until the ZIP is verified and imported, the live site keeps the safe SVGs.

**No paid external API or subscription is required.** Do not upload ZIPs containing any personal data or unapproved photographs. This bundle contains original AI-generated concept scenes only, not photographs of the owner.
