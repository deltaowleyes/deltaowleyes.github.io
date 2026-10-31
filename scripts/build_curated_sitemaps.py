#!/usr/bin/env python3
"""Build small, source-rendered SEO sitemaps without touching other site data.

Only committed HTML pages under guides/*/index.html and
events/highlights/*/index.html are eligible. A page must provide its own
canonical, meta description, H1 and main content. The result is deterministic,
and lastmod follows the page's last Git commit rather than today's build date.

Usage:
    python3 scripts/build_curated_sitemaps.py
    python3 scripts/build_curated_sitemaps.py --check
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://deltaowleyes.ca"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
TARGETS = {
    "guides/sitemap.xml": "guides/*/index.html",
    "events/highlights/sitemap.xml": "events/highlights/*/index.html",
}

ET.register_namespace("", NS)


def eligible(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    head_match = re.search(r"<head\b[^>]*>(.*?)</head>", html, re.I | re.S)
    head = head_match.group(1) if head_match else ""
    url = SITE + "/" + path.relative_to(ROOT).as_posix().removesuffix("index.html")
    canonical = re.findall(
        r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']',
        head, re.I
    )
    description = re.search(r'<meta\s+name=["\']description["\']', head, re.I)
    noindex = re.search(
        r'<meta\s+name=["\']robots["\'][^>]*noindex', head, re.I
    )
    return (
        canonical == [url] and description is not None and not noindex
        and bool(re.search(r"<main\b", html, re.I))
        and bool(re.search(r"<h1\b", html, re.I))
        and len(html) >= 1000
    )


def last_updated(path: Path) -> str | None:
    relative = path.relative_to(ROOT).as_posix()
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", relative],
        cwd=ROOT, capture_output=True, text=True, check=False,
    )
    value = result.stdout.strip()
    return value if result.returncode == 0 and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value) else None


def build(pattern: str) -> bytes:
    pages = sorted(ROOT.glob(pattern), key=lambda p: p.as_posix())
    if len(pages) > 1000:
        raise ValueError("Refusing to generate a mass-directory sitemap")
    sitemap = ET.Element(f"{{{NS}}}urlset")
    for path in pages:
        if not eligible(path):
            raise ValueError(f"Missing canonical, description or substantive page: {path}")
        url = SITE + "/" + path.relative_to(ROOT).as_posix().removesuffix("index.html")
        node = ET.SubElement(sitemap, f"{{{NS}}}url")
        ET.SubElement(node, f"{{{NS}}}loc").text = url
        modified = last_updated(path)
        if modified:
            ET.SubElement(node, f"{{{NS}}}lastmod").text = modified
    if not pages:
        raise ValueError(f"No curated HTML pages found for {pattern}")
    return ET.tostring(sitemap, encoding="utf-8", xml_declaration=True) + b"\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="Report out-of-date sitemap without writing it")
    args = parser.parse_args()
    changes = []
    for destination, pattern in TARGETS.items():
        expected = build(pattern)
        output = ROOT / destination
        current = output.read_bytes() if output.exists() else b""
        if current == expected:
            print(f"OK {destination}")
            continue
        changes.append(destination)
        if not args.check:
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(expected)
            print(f"UPDATED {destination}")
    if args.check and changes:
        print("Out-of-date curated sitemaps: " + ", ".join(changes), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
