# River Voice BAKE PRO 2.6 — source photography acceptance checkpoint

Date: 2026-11-06
Branch: `feature/doe-studio-2-redesign-pilot`
Baseline branch head before this report: `d06001455d9b881020deaac77660bd046b39aa40`.

## Result: five standalone photo sources NOT DELIVERED

The image generator returned a single 1536 × 1024 labelled composite depicting five scenes and an asset-verification bar. The labels inside this raster falsely purport to identify five individual JPEG files, including dimensions that cannot be validated from the embedded panels. **This is NOT five distinct JPEG files.** It was rejected.

Other source image outputs earlier in the project were similarly flattened webpage mockups or multi-scene collages. Do not crop this latest image, upscale panels and call them original native-resolution independent photos, or use the embedded assertions as a manifest. No owner approval has been given.

### Inventory

| Exact required source | Minimum dimensions | 2.6 accepted | GitHub uploaded | Integrated |
| --- | --- | --- | --- | --- |
| `river-hero.jpg` | 1800 × 1000 | no | no | no |
| `education-research.jpg` | 1200 × 800 | no | no | no |
| `archaeology-policy.jpg` | 1200 × 800 | no | no | no |
| `historical-learning.jpg` | 1200 × 800 | no | no | no |
| `owl-lens-studio.jpg` | 1200 × 800 | no | no | no |

`PHOTO-APPROVALS.json` must remain `owner_visual_approval:false`, SHA fields null. Do not trigger `studio2-photo-staging.yml` until independent individual files have passed both visual inspection and hash/dimension validation.

## Already verified and preserved

- Branch-only safe importer and independent checksum contract, positive synthetic fixture plus five invalid-case rejections.
- Baseline Chromium responsive/browser test at four widths and importer contract: [GitHub run 42217233765](https://github.com/deltaowleyes/deltaowleyes.github.io/actions/runs/42217233765), **successful**.
- This 2.6 report contains **no changes to site HTML, the current imagery, live data, privacy controls or QA code**. Therefore the prior screenshots remain the latest browser evidence; they do not prove photographic integration.
- No merge or deployment. Owner's premium cinematic visual acceptance remains withheld.
- No paid API, theme, licence or subscription knowingly activated. External aggregate billing is **unknown**, not zero.

## Safe next action

Produce only **one** independent, fullscreen, undecorated scene at a time with no website UI, captions, labels or multi-panel layout. Confirm its actual decoded native file width and height (not printed dimensions in the image). Reject anything below the minimum or resembling a collage. Repeat for five scenes. Provide original individual image files for user visual approval.

After explicit user approval, package the five source JPEGs, pin each independently verified SHA-256 in `PHOTO-APPROVALS.json`, then use the branch-only photo staging workflow. The connector cannot transfer binary bytes from the image generator through its JavaScript runner on its own; if needed upload the ZIP to:
https://github.com/deltaowleyes/deltaowleyes.github.io/upload/feature/doe-studio-2-redesign-pilot/studio2/river-voice/photo-inbox

Correct filename: `RIVER-VOICE-ORIGINAL-PHOTOS.zip`. Note: Upload is a later owner-approved step, not something done in this checkpoint.

Acceptance after verified staging still requires controlled integration, 320/390/768/1440 Chromium screenshots, content review and explicit approval **before** any production release.
