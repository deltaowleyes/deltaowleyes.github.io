# Momma Made — BAKE EXPRESS canonical studio

The client studio at `/mommamade/studio/` uses the **identical** BAKE EXPRESS Master Standard 1.0 shell and the same six previously approved responsive header images from `/studio-sandbox/`: 320, 390, 500, 768, 1024, 1440.

The sole display system is `/assets/express-studio/v1/studio.css` and `studio.js`. No Momma Made-specific header, visual shell, card styling, navigation or preview modal may be added. Client-specific information belongs in `config.js`, and screenshots are at `previews/<slug>/full-<width>.webp`. The seven HTML loaders are identical to the canonical Shut Your Trap loaders except for project script path and design slug.

`build.py` captures 36 real browser screenshots using existing V3 candidate HTML and owned media, then updates only data files. `qa.py` checks the exact header art at all six widths and the interactive screenshot-only shell. `verify_live.py` independently checks deployed files.

Momma Made V2 remains the current default. No V3 promotion, live sale, checkout, or fabricated product claims. Earlier public V3 demos still expose their source independently and screenshots are not DRM. No paid APIs or purchases authorized; real provider billing remains unknown.
