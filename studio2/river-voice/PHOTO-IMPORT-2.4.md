# River Voice 2.4 — standalone photo import, fail closed

**Status:** No new five-photo pack has been produced or activated. Original image generation attempts yielded full-page website compositions, which are **rejected** as standalone photographic inputs. Existing River Voice assets and production paths are left intact.

## Creative requirements
Make exactly five **individual** original photographs as separate JPEGs, with NO text, buttons, panels, logos, split screens, screenshots, collages, humans portrayed as actual witnesses, institution signage, treaty records or artifacts implying documentary provenance.

1. `river-hero.jpg` (at least 1800×1000): Canadian marsh and river at sunset, distant pine forest, a great grey owl and a red-tailed hawk naturally positioned along the left bank; clean darker center-left negative space for live HTML text, authentic anatomy and photoreal light. Avoid cultural symbols.
2. `education-research.jpg` (at least 1200×800): warm editorial still life of closed books, simple notebooks, pencil and library desk; **no readable writing or fictional school records**. Not a photograph of Brock University.
3. `archaeology-policy.jpg` (at least 1200×800): macro photograph of earth, labeled-as-conceptual strata and a generic brush; **no excavated Indigenous remains, sacred objects or archaeological-site claims**.
4. `historical-learning.jpg` (at least 1200×800): atmospheric still life of blank archival folders, plain paper and neutral quill; **no fabricated archival records, treaty signatures, historic photographs or specific tribal regalia**.
5. `owl-lens-studio.jpg` (at least 1200×800): professional podcast microphone in a warm, softly lit recording studio, no readable text or show logos; not a photograph of the actual Delta Owl Eyes recording setup.

All images are **conceptual visual illustrations**, never evidence of the specific linked news stories. Use original rights-clear generated art; maintain human review and photo provenance, captions and proper alt text.

## Strict import procedure
1. Obtain all five **standalone** source images, verify actual dimensions and image contents independently.
2. Package exactly the five root-level JPEG files into `RIVER-VOICE-ORIGINAL-PHOTOS.zip`.
3. Review each image. In `studio2/river-voice/PHOTO-APPROVALS.json`, set `owner_visual_approval` to `true` and pin the **SHA-256** of each inspected source JPEG independently. Do not use ZIP-supplied self-asserted hashes.
4. `python -m pip install Pillow` then `python studio2/scripts/import_photo_pack.py RIVER-VOICE-ORIGINAL-PHOTOS.zip --destination studio2/river-voice/assets/photos/`. The script verifies EXACT five names, formats, dimensions, independent source checksums, archive safety, image decoding, and optimized WebP output. Any failure rejects the whole pack.
5. Capture actual Chromium 320/390/768/1440 screenshots after updating the candidate's references in a **separate reviewed commit**. The importer writes a staged manifest, not a live/published activation flag.
6. Compare with original six-panel Studio visual quality reference and get owner approval before merge/production deployment.

**GitHub binary transfer:** The connector can write text, but cannot read local image bytes from the isolated container. A manual ZIP upload to this feature branch through GitHub may be necessary. Do not confuse a generated ChatGPT image pointer or source ZIP with an actual GitHub blob. A future binary-capable connector may remove this barrier.

**Known spending initiated:** no paid APIs, services or media licenses. **Actual provider charges:** unknown until billing review. The stricter-than-C$1 aggregate cash policy remains active; GitHub Actions free-minute assumptions must be confirmed before running added workflows.
