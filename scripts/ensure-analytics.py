#!/usr/bin/env python3
"""Idempotently add existing consent-gated analytics assets to site HTML."""
from pathlib import Path
import argparse
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CSS = '<link rel="stylesheet" href="/assets/privacy-consent.css?v=c6e42b4c7790">'
JS = '<script defer src="/assets/privacy-consent.js?v=5e33d237f841"></script>'
ASSETS = ("privacy-consent.css", "privacy-consent.js")


def transform(content):
    if not re.search(r"<head(?:\s[^>]*)?>", content, flags=re.I):
        return content
    missing = []
    for filename, tag in zip(ASSETS, (CSS, JS)):
        if not re.search(r"""(?:src|href)\s*=\s*['"][^'"]*""" + re.escape(filename), content, re.I):
            missing.append(tag)
    if not missing:
        return content
    return re.sub(r"<head(?:\s[^>]*)?>", lambda m: m.group(0) + "".join(missing),
                  content, count=1, flags=re.I)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Report gaps without writing")
    args = parser.parse_args()
    if not all((ROOT / "assets" / x).is_file() for x in ASSETS):
        sys.exit("Consent assets missing; refusing to modify HTML")
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts or "admin" in path.relative_to(ROOT).parts:
            continue
        old = path.read_text(encoding="utf-8")
        new = transform(old)
        if old != new:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new, encoding="utf-8")
    print(f"{len(changed)} HTML pages {'need consent assets' if args.check else 'updated'}")
    for name in changed:
        print(name)
    if args.check and changed:
        sys.exit(1)


if __name__ == "__main__":
    main()
