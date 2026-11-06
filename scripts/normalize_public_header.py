#!/usr/bin/env python3
"""B4-037: normalize ONLY public HTML headers, logos and footer motto.
Deterministic and idempotent. Does not modify directories, admin or data."""
from __future__ import annotations
import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
LOGO = "/assets/doe-header-wordmark-250x55.png?v=b4037f"
SYMBOL = "/assets/doe-header-symbol-75x55.png?v=b4037f"
HEADER_CSS = '<link rel="stylesheet" href="/assets/header-v3.css?v=b4037f">'
HEADER_JS = '<script defer src="/assets/header-v3.js?v=b4037c"></script>'
FOOTER_MOTTO = '<div class="doe-footer-motto" aria-label="Delta Owl Eyes motto">HARD TRUTHS. &nbsp; EDUCATION. &nbsp; ACCOUNTABILITY.</div>'

HEADER_RE = re.compile(r"<header\b[^>]*>[\s\S]*?</header>", re.I)
FOOTER_RE = re.compile(r"(<footer\b[^>]*>)([\s\S]*?)(</footer>)", re.I)
TOP_MOTTO_RE = re.compile(
    r'<div class="doe-tagline-bar"[^>]*>\s*HARD TRUTHS\.\s*(?:&nbsp;|\s)*'
    r'EDUCATION\.\s*(?:&nbsp;|\s)*ACCOUNTABILITY\.\s*</div>', re.I
)


def menu(href: str, title: str, active: str) -> str:
    current = ' aria-current="page"' if active == href else ""
    return f'<a href="{href}"{current}>{title}</a>'


def header_for(page: pathlib.Path) -> str:
    rel = page.relative_to(ROOT).as_posix()
    if rel == "index.html":
        active = "/"
    else:
        active = "/" + rel.split("/")[0] + "/"
    if rel.startswith("news/"):
        active = "/news/"
    elif rel.startswith("calls-to-action/"):
        active = "/calls-to-action/"
    elif rel.startswith("events/"):
        active = "/events/"
    elif rel.startswith("indigenous-businesses/"):
        active = "/indigenous-businesses/"
    elif rel.startswith("indigenous-churches/"):
        active = "/indigenous-churches/"
    elif rel.startswith("videos/"):
        active = "/videos/"
    elif rel.startswith("services/"):
        active = "/services/"

    def links(entries: list[tuple[str, str]]) -> str:
        return "".join(menu(h, t, active) for h, t in entries)

    left = links([("/news/", "News"), ("/calls-to-action/", "94 Calls")])
    explore = links([
        ("/education/", "Education"),
        ("/videos/", "Videos"),
        ("/#investigations", "Investigations"),
        ("/news/", "Newsroom"),
        ("/calls-to-action/", "TRC research"),
    ])
    community = links([
        ("/indigenous-businesses/", "Businesses"),
        ("/indigenous-churches/", "Churches"),
        ("/events/", "Events"),
    ])
    more = links([
        ("/services/", "Services"),
        ("/#about", "About"),
        ("mailto:deltaowleyes@gmail.com", "Contact"),
    ])
    desktop = "".join(
        f'<details class="doe-menu"><summary>{name}</summary><div class="doe-menu-panel">{contents}</div></details>'
        for name, contents in [
            ("Explore", explore), ("Community", community), ("More", more)
        ]
    )
    mobile_groups = [
        ("Explore", [
            ("/", "Home"), ("/news/", "Latest news"),
            ("/calls-to-action/", "94 Calls to Action"),
            ("/education/", "Education"), ("/videos/", "Videos"),
            ("/#investigations", "Investigations"),
        ]),
        ("Community", [
            ("/indigenous-businesses/", "Indigenous Businesses"),
            ("/indigenous-churches/", "Church Directory"),
            ("/events/", "Community Events"),
        ]),
        ("More", [
            ("/services/", "Services"), ("/#about", "About"),
            ("mailto:deltaowleyes@gmail.com", "Contact"),
        ]),
    ]
    mobile = "".join(
        f'<div class="doe-mobile-section"><strong>{title}</strong>{links(items)}</div>'
        for title, items in mobile_groups
    )
    return (
        '<header class="doe-header doe-header-v3">'
        f'<nav class="doe-header-left" aria-label="Quick navigation">'
        f'<a class="doe-left-symbol" href="/" aria-label="Delta Owl Eyes home">'
        f'<img src="{SYMBOL}" alt="Medicine wheel, great grey owl and red-tailed hawk" width="75" height="55"></a>'
        f'{left}</nav>'
        f'<a class="doe-center-brand" href="/" aria-label="Delta Owl Eyes home">'
        f'<img src="{LOGO}" alt="Delta Owl Eyes" width="250" height="55" decoding="async"></a>'
        f'<nav class="doe-header-right" aria-label="Site sections">{desktop}</nav>'
        f'<details class="doe-mobile-navigation"><summary aria-label="Open site navigation">'
        f'<span aria-hidden="true">☰</span> Menu</summary>'
        f'<nav aria-label="Mobile navigation">{mobile}</nav></details>'
        '</header>'
    )


def update(page: pathlib.Path, original: str) -> str:
    found = HEADER_RE.search(original)
    if not found:
        raise ValueError(f"{page.relative_to(ROOT)} has no header")
    if original.count("</head>") != 1:
        raise ValueError(f"{page.relative_to(ROOT)} has unexpected head count")
    result = original[:found.start()] + header_for(page) + original[found.end():]
    result = TOP_MOTTO_RE.sub("", result)
    if "doe-footer-motto" not in result:
        if not FOOTER_RE.search(result):
            raise ValueError(f"{page.relative_to(ROOT)} has no footer")
        result = FOOTER_RE.sub(
            lambda m: m.group(1) + FOOTER_MOTTO + m.group(2) + m.group(3),
            result, count=1
        )
    result = re.sub(r'<link rel="stylesheet" href="/assets/header-v3.css\?v=[^"]+">', "", result)
    result = re.sub(r'<script defer src="/assets/header-v3.js\?v=[^"]+"></script>', "", result)
    result = result.replace("</head>", HEADER_CSS + HEADER_JS + "</head>", 1)
    if result.count('class="doe-header doe-header-v3"') != 1:
        raise ValueError(f"Header was not unique for {page}")
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if files are not normalized")
    args = parser.parse_args()
    pages = sorted(
        p for p in ROOT.rglob("*.html")
        if p.is_file() and not p.relative_to(ROOT).parts[0] == "admin"
        and "admin" not in p.relative_to(ROOT).parts
        and ".git" not in p.relative_to(ROOT).parts
    )
    changed = []
    skipped = []
    for page in pages:
        original = page.read_text(encoding="utf-8")
        # Standalone design galleries and project demos have their own layouts.
        # Normalize only pages already using the canonical public header.
        if not re.search(r'<header\\b[^>]*\\bdoe-header-v3\\b', original, re.I):
            skipped.append(page.relative_to(ROOT).as_posix())
            continue
        transformed = update(page, original)
        if transformed != original:
            changed.append(page.relative_to(ROOT).as_posix())
            if not args.check:
                page.write_text(transformed, encoding="utf-8")
    print(f"B4-037 public pages: {len(pages)}; need changes: {len(changed)}; check: {args.check}")
    if changed and args.check:
        print("Unnormalized pages:", changed[:8], file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
