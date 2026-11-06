#!/usr/bin/env python3
"""Six original responsive Studio banners, gallery links, and interaction QA."""
import hashlib
import json
import os
import pathlib
import time
import urllib.request
from playwright.sync_api import sync_playwright

BASE = os.environ.get("STUDIO_BASE", "https://deltaowleyes.ca").rstrip("/")
PUBLIC = BASE == "https://deltaowleyes.ca"
ROOT = pathlib.Path(__file__).parent
OUT = pathlib.Path("artifacts/studio-header-recovery")
OUT.mkdir(parents=True, exist_ok=True)
ASSETS = {item["file"]: item for item in json.loads(
    (ROOT / "header-restoration-manifest.json").read_text()
)["assets"]}
WIDTHS = (320, 390, 500, 768, 1024, 1440)
EXPECTED = {width: f"header-{width}.webp" for width in WIDTHS}
SLUGS = ("river-voice", "gathering-place", "accountability-desk",
         "northern-horizons", "community-network", "owls-lens")
ROUTES = [f"/studio-sandbox/previews/{slug}/" for slug in SLUGS]
URL = BASE + "/studio-sandbox/"

def get(path):
    request = urllib.request.Request(BASE + path, headers={
        "Cache-Control": "no-cache",
        "User-Agent": "DeltaOwlEyes-StudioHeaderQA",
    })
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()

for attempt in range(18 if PUBLIC else 1):
    try:
        text = get("/studio-sandbox/").decode("utf-8")
        if ('header-320.webp' in text and 'header-1440.webp' in text
                and 'studio-header' in text):
            break
    except Exception as error:
        print("Waiting for Studio HTML:", attempt + 1, error, flush=True)
    if PUBLIC and attempt < 17:
        time.sleep(8)
else:
    raise RuntimeError("Expected responsive Studio HTML not served: " + URL)

# Reject modified header artwork; use the six established art-directed assets.
for name in [*EXPECTED.values(), "reference-40.webp"]:
    expected_sha = ASSETS[name]["sha256"]
    assert hashlib.sha256(get("/studio-sandbox/" + name)).hexdigest() == expected_sha, (
        "Approved asset changed: " + name
    )

checks = []
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    for width in WIDTHS:
        context = browser.new_context(viewport={"width": width, "height": 900},
                                      is_mobile=width <= 390, has_touch=width <= 768)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(URL, wait_until="networkidle", timeout=45000)

        name = EXPECTED[width]
        header = page.locator(".studio-header .responsive-header img")
        banner = header.evaluate("""(img) => ({
          src: img.currentSrc, naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight, complete: img.complete,
          renderedWidth: img.getBoundingClientRect().width
        })""")
        expected_meta = ASSETS[name]
        header_ok = (name in banner["src"] and banner["complete"]
                     and banner["naturalWidth"] == expected_meta["width"]
                     and banner["naturalHeight"] == expected_meta["height"]
                     and abs(banner["renderedWidth"] - width) < 2)

        desktop = width >= 1280
        links = page.locator(".hotspot" if desktop else ".family")
        hrefs = links.evaluate_all("(els) => els.map(e => e.getAttribute('href'))")
        shown = links.evaluate_all(
            "(els) => els.filter(e => e.getClientRects().length > 0).length")
        links.first.focus()
        keyboard = links.first.evaluate("(element) => document.activeElement === element")
        overflow = page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")

        # Desktop master remains the approved picture, cropped beneath its embedded header.
        crop_ok = True
        if desktop:
            crop_ok = page.evaluate("""() => {
              const master = document.querySelector('.desktop-master');
              const img = master.querySelector(':scope > img');
              const frame = master.getBoundingClientRect();
              const image = img.getBoundingClientRect();
              const scale = image.width / 1536;
              const expected = 171 * scale;
              return img.currentSrc.includes('reference-40.webp')
                && img.naturalWidth === 1536 && img.naturalHeight === 1024
                && Math.abs((frame.top - image.top) - expected) < 2
                && Math.abs(frame.height - 853 * scale) < 2;
            }""")

        preview = context.new_page()
        preview_response = preview.goto(URL + "previews/river-voice/",
                                        wait_until="networkidle", timeout=45000)
        preview_banner = preview.locator("header.site-header .responsive-header img").evaluate(
            "(img) => ({ src: img.currentSrc, width: img.naturalWidth, "
            "height: img.naturalHeight, complete: img.complete })")
        preview_ok = (preview_response.status == 200 and name in preview_banner["src"]
                      and preview_banner["width"] == expected_meta["width"]
                      and preview_banner["height"] == expected_meta["height"]
                      and preview_banner["complete"])
        preview_overflow = preview.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        shots = preview.locator(".shot").count()
        preview.locator(".shot button").first.click()
        opened = preview.locator("#enlarge").evaluate("(dialog) => dialog.open")
        preview.keyboard.press("Escape")
        closed = not preview.locator("#enlarge").evaluate("(dialog) => dialog.open")
        other_statuses = ([context.request.get(BASE + route, timeout=18000).status
                           for route in ROUTES] if desktop else [])

        if page.locator("#doe-reject").count() and page.locator("#doe-reject").is_visible():
            page.locator("#doe-reject").click()
        page.screenshot(path=str(OUT / f"studio-{width}.png"),
                        full_page=True, animations="disabled")
        preview.screenshot(path=str(OUT / f"preview-{width}.png"),
                           full_page=False, animations="disabled")
        row = {
            "width": width, "header": banner, "expected_header": name,
            "header_ok": header_ok, "crop_ok": crop_ok,
            "visible_options": shown, "links": hrefs,
            "keyboard_focus": keyboard, "overflow": overflow,
            "preview_ok": preview_ok, "preview_overflow": preview_overflow,
            "screenshots": shots, "dialog_opened": opened, "escape_closed": closed,
            "gallery_statuses": other_statuses, "page_errors": errors,
        }
        row["pass"] = bool(
            response.status == 200 and header_ok and crop_ok and shown == 6
            and hrefs == ROUTES and keyboard and not overflow and preview_ok
            and not preview_overflow and shots == 6 and opened and closed
            and all(code == 200 for code in other_statuses) and not errors
        )
        checks.append(row)
        preview.close()
        context.close()
    browser.close()

(OUT / "results.json").write_text(json.dumps({
    "target": BASE, "checks": checks
}, indent=2) + "\n")
print(json.dumps({
    "target": BASE, "passed": sum(row["pass"] for row in checks),
    "total": len(checks), "failures": [row for row in checks if not row["pass"]]
}, indent=2))
if not all(row["pass"] for row in checks):
    raise SystemExit(1)
