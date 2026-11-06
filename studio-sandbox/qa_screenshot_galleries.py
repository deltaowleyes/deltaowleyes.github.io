#!/usr/bin/env python3
"""Live, read-only Chromium acceptance of six Studio galleries at six widths.

Never visits or publishes private working template source. Never runs the old
studio screenshot generator or edits gallery imagery.
"""
import json
import pathlib
import urllib.request
from playwright.sync_api import sync_playwright

BASE = "https://deltaowleyes.ca"
STUDIO = BASE + "/studio-sandbox/"
FAMILIES = ("river-voice", "gathering-place", "accountability-desk",
            "northern-horizons", "community-network", "owls-lens")
WIDTHS = (320, 390, 500, 768, 1024, 1440)
OUT = pathlib.Path("artifacts/studio-public-screenshots")
OUT.mkdir(parents=True, exist_ok=True)
EXPECTED_PATHS = [f"/studio-sandbox/previews/{slug}/" for slug in FAMILIES]

def header_file(width):
    if width <= 354:
        return "header-320.webp"
    if width <= 439:
        return "header-390.webp"
    if width <= 629:
        return "header-500.webp"
    if width <= 895:
        return "header-768.webp"
    if width <= 1279:
        return "header-1024.webp"
    return "header-1440.webp"

def header_state(page, selector):
    return page.locator(selector).evaluate("""img => ({
        src: img.currentSrc,
        loaded: img.complete && img.naturalWidth > 0,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
    })""")

def overflow(page):
    return page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
    )

def modal_open(page):
    return page.locator("#enlarge").evaluate("(e) => e.open")

# Independent public HTTP check; do not mistake a successful Pages build for a served site.
request = urllib.request.Request(
    STUDIO, headers={"Cache-Control": "no-cache",
                     "User-Agent": "DeltaOwlEyes-Studio-36-Viewport-QA"})
with urllib.request.urlopen(request, timeout=25) as response:
    landing_html = response.read().decode("utf-8")
assert 'header-320.webp' in landing_html
assert 'header-1440.webp' in landing_html
assert all(path in landing_html for path in EXPECTED_PATHS)

results = []
image_http = []
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    for width in WIDTHS:
        context = browser.new_context(
            viewport={"width": width, "height": 900},
            is_mobile=width <= 500,
            has_touch=width <= 500,
            device_scale_factor=1)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        response = page.goto(STUDIO, wait_until="networkidle", timeout=60000)
        header = header_state(page, ".studio-header .responsive-header img")
        desired = header_file(width)
        links = page.locator('a[href^="/studio-sandbox/previews/"]')
        destinations = links.evaluate_all(
            "(elements) => [...new Set(elements.map(e => e.getAttribute('href')))]")
        visible_links = links.evaluate_all(
            "(elements) => elements.filter(e => e.getClientRects().length > 0).length")
        if page.locator("#doe-reject").count() and page.locator("#doe-reject").is_visible():
            page.locator("#doe-reject").click()
        landing_result = {
            "type": "landing", "width": width,
            "http": response.status if response else None,
            "header_file": desired,
            "current_src": header["src"],
            "header_loaded": header["loaded"],
            "destinations": destinations,
            "visible_links": visible_links,
            "no_overflow": not overflow(page),
            "no_demo_links": page.locator('a[href^="/newdesigns/"]').count() == 0,
            "page_errors": errors,
        }
        landing_result["pass"] = bool(
            landing_result["http"] == 200 and desired in header["src"]
            and header["loaded"] and sorted(destinations) == sorted(EXPECTED_PATHS)
            and visible_links == 6 and landing_result["no_overflow"]
            and landing_result["no_demo_links"] and not errors)
        page.screenshot(path=str(OUT / f"landing-{width}.png"),
                        full_page=False, animations="disabled")
        results.append(landing_result)
        page.close()

        for slug in FAMILIES:
            gallery = context.new_page()
            gallery_errors = []
            gallery.on("pageerror", lambda err: gallery_errors.append(str(err)))
            response = gallery.goto(
                STUDIO + f"previews/{slug}/",
                wait_until="networkidle", timeout=60000)
            gallery_header = header_state(
                gallery, "header.site-header .responsive-header img")
            shots = gallery.locator(".shot")
            filenames = shots.locator("img").evaluate_all(
                "(elements) => elements.map(e => e.getAttribute('src'))")
            image_widths = shots.locator("img").evaluate_all(
                "(elements) => elements.map(e => Number(e.getAttribute('width')))")
            screenshot_files = [f"full-{w}.webp" for w in WIDTHS]
            first = gallery.locator(".shot button").first
            first.click()
            opened = modal_open(gallery)
            gallery.keyboard.press("Escape")
            escaped = not modal_open(gallery)
            last = gallery.locator(".shot button").last
            last.click()
            second_open = modal_open(gallery)
            gallery.locator("#close-preview").click()
            button_closed = not modal_open(gallery)
            focus_restored = last.evaluate("(el) => document.activeElement === el")
            no_overflow = not overflow(gallery)
            row = {
                "type": "gallery", "slug": slug, "width": width,
                "http": response.status if response else None,
                "header_file": desired,
                "current_src": gallery_header["src"],
                "header_loaded": gallery_header["loaded"],
                "screenshot_count": shots.count(),
                "screenshot_files": filenames,
                "screenshot_widths": image_widths,
                "dialog_open": opened and second_open,
                "escape_close": escaped,
                "button_close": button_closed,
                "focus_return": focus_restored,
                "no_overflow": no_overflow,
                "no_demo_links": gallery.locator('a[href^="/newdesigns/"]').count() == 0,
                "back_to_studio": gallery.locator(
                    'a.back[href="/studio-sandbox/"]').count() == 1,
                "page_errors": gallery_errors,
            }
            row["pass"] = bool(
                row["http"] == 200 and desired in gallery_header["src"]
                and gallery_header["loaded"] and shots.count() == 6
                and filenames == screenshot_files and image_widths == list(WIDTHS)
                and opened and escaped and second_open and button_closed
                and focus_restored and no_overflow and row["no_demo_links"]
                and row["back_to_studio"] and not gallery_errors)
            results.append(row)
            if width in (390, 1440):
                gallery.screenshot(
                    path=str(OUT / f"{slug}-{width}.png"),
                    full_page=False, animations="disabled")
            # At desktop once, inspect actual HTTP status and WebP content for all 36 images.
            if width == 1440:
                for filename in screenshot_files:
                    image_response = context.request.get(
                        STUDIO + f"previews/{slug}/{filename}", timeout=30000)
                    ok = (image_response.status == 200
                          and image_response.headers.get("content-type", "").lower()
                              .startswith("image/"))
                    image_http.append({
                        "slug": slug, "file": filename,
                        "status": image_response.status,
                        "content_type": image_response.headers.get("content-type"),
                        "pass": ok,
                    })
            gallery.close()
        context.close()
    browser.close()

result = {
    "public_url": STUDIO,
    "passed": sum(r["pass"] for r in results),
    "total": len(results),
    "images_passed": sum(r["pass"] for r in image_http),
    "images_total": len(image_http),
    "results": results,
    "image_http": image_http,
}
(OUT / "results.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({
    "public_url": STUDIO, "passed": result["passed"], "total": result["total"],
    "images_passed": result["images_passed"],
    "images_total": result["images_total"],
    "failures": [row for row in results if not row["pass"]],
    "image_failures": [row for row in image_http if not row["pass"]],
}, indent=2))
if result["passed"] != result["total"] or result["images_passed"] != 36:
    raise SystemExit(1)
