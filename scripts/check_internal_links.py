#!/usr/bin/env python3
"""Check local HTML links, image/script/style paths and fragment anchors; no network access."""
from __future__ import annotations
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and values.get("name"):
            self.ids.add(values["name"])
        for attr in ("href", "src"):
            if values.get(attr):
                self.links.append((tag, attr, values[attr], self.getpos()[0]))
        if values.get("srcset"):
            for part in values["srcset"].split(","):
                url = part.strip().split(" ")[0]
                if url:
                    self.links.append((tag, "srcset", url, self.getpos()[0]))

def target_file(root, current, raw):
    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc or raw.startswith("//"):
        return None
    if not parsed.path and not parsed.fragment:
        return None
    path = unquote(parsed.path)
    if path.startswith("/"):
        relative = path.lstrip("/")
    else:
        relative = str(current.parent.relative_to(root) / path)
    candidate = (root / relative).resolve()
    if not candidate.is_relative_to(root):
        return "outside", None, parsed.fragment
    if candidate.is_dir() or path.endswith("/") or not path:
        candidate = candidate / "index.html" if path else current
    return candidate, None, unquote(parsed.fragment)

def check(root):
    pages = sorted(root.rglob("*.html"))
    parsed = {}
    for page in pages:
        if ".git" in page.parts:
            continue
        p = PageParser()
        p.feed(page.read_text(encoding="utf-8", errors="replace"))
        parsed[page.resolve()] = p
    errors = []
    checked = 0
    for page, document in parsed.items():
        for tag, attr, raw, line in document.links:
            if raw.startswith(("#", "/", ".")) or not urlsplit(raw).scheme and not raw.startswith("//"):
                if "{{" in raw or "{%" in raw:
                    continue
                result = target_file(root, page, raw)
                if result is None:
                    continue
                target, _, fragment = result
                checked += 1
                if target == "outside":
                    errors.append(f"{page.relative_to(root)}:{line}: path escapes site: {raw}")
                elif not target.is_file():
                    errors.append(f"{page.relative_to(root)}:{line}: missing target: {raw}")
                elif fragment and target.suffix.lower() in (".html", ".htm"):
                    other = parsed.get(target)
                    if other is None:
                        other = PageParser()
                        other.feed(target.read_text(encoding="utf-8", errors="replace"))
                        parsed[target] = other
                    if fragment not in other.ids:
                        errors.append(f"{page.relative_to(root)}:{line}: missing anchor #{fragment}: {raw}")
    return len(pages), checked, errors

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = ap.parse_args()
    root = args.root.resolve()
    pages, links, errors = check(root)
    print(f"Checked {links} local references in {pages} HTML pages.")
    for error in errors:
        print("ERROR:", error)
    print(f"Found {len(errors)} issue(s).")
    raise SystemExit(1 if errors else 0)

if __name__ == "__main__":
    main()
