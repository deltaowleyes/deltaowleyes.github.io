#!/usr/bin/env python3
"""Version local CSS/JS references using their actual file content."""
from pathlib import Path
import hashlib
import re
from urllib.parse import urlsplit, parse_qsl, urlencode, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
ATTR = re.compile(r'(?P<prefix>\b(?:href|src)\s*=\s*)(?P<quote>["\x27])(?P<url>[^"\x27]+)(?P=quote)', re.I)
CHANGED = []

def rewrite(match):
    url = match.group("url")
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path.lower().endswith((".css", ".js")):
        return match.group(0)
    target = (ROOT / parts.path.lstrip("/")) if parts.path.startswith("/") else (CURRENT.parent / parts.path)
    try:
        target = target.resolve()
        target.relative_to(ROOT.resolve())
        if not target.is_file():
            return match.group(0)
    except (ValueError, OSError):
        return match.group(0)
    digest = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
    query = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True) if k != "v"]
    query.append(("v", digest))
    updated = urlunsplit(("", "", parts.path, urlencode(query), parts.fragment))
    return match.group("prefix") + match.group("quote") + updated + match.group("quote")

for CURRENT in sorted(ROOT.rglob("*.html")):
    if ".git" in CURRENT.parts:
        continue
    original = CURRENT.read_text(encoding="utf-8")
    updated = ATTR.sub(rewrite, original)
    if updated != original:
        CURRENT.write_text(updated, encoding="utf-8")
        CHANGED.append(str(CURRENT.relative_to(ROOT)))
print("Updated asset versions:", ", ".join(CHANGED) if CHANGED else "none")
