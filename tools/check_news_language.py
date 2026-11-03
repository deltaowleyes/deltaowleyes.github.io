#!/usr/bin/env python3
"""Validate published Professional and Rez Slang 9.0 pairs; attestations require editorial review."""
import argparse
import datetime as dt
import html
import json
import pathlib
import re
import sys
import unicodedata
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
ARTICLE = re.compile(r"<article\b[^>]*>[\s\S]*?</article>", re.I)
HEADLINE = re.compile(r"<h2>([\s\S]*?)</h2>", re.I)

def slugify(value):
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value))[:90].rstrip("-")

def plain(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()

def valid_https(value):
    if not isinstance(value, str):
        return False
    p = urlparse(value)
    return p.scheme == "https" and bool(p.hostname) and not p.username and not p.password

def approved(review, today=None):
    today = today or dt.date.today()
    if not isinstance(review, dict) or review.get("status") != "approved":
        return False
    if not isinstance(review.get("reviewed_by"), str) or len(review["reviewed_by"].strip()) < 3:
        return False
    if review.get("sources_checked") is not True or review.get("claim_parity_checked") is not True:
        return False
    try:
        return dt.date.fromisoformat(review["reviewed_at"]) <= today
    except (ValueError, TypeError, KeyError):
        return False

def validate(index_html, editions, legacy, today=None):
    today = today or dt.date.today()
    errors = []
    if editions.get("version") != "9.0" or not isinstance(editions.get("articles"), dict):
        return ["Invalid Rez Slang edition registry"]
    published = {}
    for block in ARTICLE.findall(index_html):
        m = HEADLINE.search(block)
        if not m:
            errors.append("Published article missing headline")
            continue
        slug = slugify(plain(m.group(1)))
        if not slug or slug in published:
            errors.append("Missing or duplicate article slug: " + slug)
        published[slug] = block
        date = re.search(r'<p class="meta">\s*(\d{4}-\d{2}-\d{2})', block)
        try:
            dt.date.fromisoformat(date.group(1))
        except (AttributeError, ValueError):
            errors.append(slug + ": missing or invalid news date")
        sources = re.findall(r'href="(https://[^"]+)"', block, flags=re.I)
        if not sources or any(not valid_https(u) for u in sources):
            errors.append(slug + ": missing HTTPS source links in Professional article")
        link = re.search(r'href="/news/articles/([^/]+)/"', m.group(1))
        if link and link.group(1) != slug:
            errors.append(slug + ": canonical article slug mismatch")
        edition = editions["articles"].get(slug)
        if not isinstance(edition, dict):
            errors.append(slug + ": missing Rez Slang edition")
            continue
        if not isinstance(edition.get("headline"), str) or len(edition["headline"].strip()) < 10:
            errors.append(slug + ": invalid conversational headline")
        sections = edition.get("sections")
        if not isinstance(sections, list) or len(sections) < 2 or any(
            not isinstance(s, dict) or not isinstance(s.get("label"), str) or not s["label"].strip()
            or not isinstance(s.get("text"), str) or len(s["text"].strip()) < 40
            for s in sections
        ):
            errors.append(slug + ": missing or incomplete conversational sections")
        if slug not in legacy and not approved(edition.get("review"), today):
            errors.append(slug + ": requires approval and source/claim-parity review")
    for slug in sorted(set(editions["articles"]) - set(published)):
        errors.append(slug + ": orphaned Rez Slang edition")
    for slug in sorted(set(legacy) - set(published)):
        errors.append(slug + ": original published article missing")
    if not published:
        errors.append("No published articles found")
    return errors

def validate_repository(root=ROOT, require_pages=False):
    news = root / "news"
    index = (news / "index.html").read_text(encoding="utf-8")
    editions = json.loads((news / "rez-slang-9.json").read_text(encoding="utf-8"))
    baseline = json.loads((news / "rez-slang-9-baseline.json").read_text(encoding="utf-8"))
    if not isinstance(baseline, list) or len(set(baseline)) != 14 or len(baseline) != 14:
        raise ValueError("The launch baseline must contain the 14 original published story slugs")
    errors = validate(index, editions, set(baseline))
    if require_pages:
        for block in ARTICLE.findall(index):
            h = HEADLINE.search(block)
            if h is None:
                continue
            slug = slugify(plain(h.group(1)))
            path = news / "articles" / slug / "index.html"
            if not path.is_file():
                errors.append(slug + ": standalone article page missing")
                continue
            page = path.read_text(encoding="utf-8")
            if "news-language.js" not in page or "news-language.css" not in page:
                errors.append(slug + ": missing public switch assets")
            if 'rel="canonical"' not in page or "<h1>" not in page:
                errors.append(slug + ": missing canonical metadata or headline")
    if errors:
        raise ValueError("News validation failed:\n - " + "\n - ".join(errors))
    count = len(ARTICLE.findall(index))
    print("PASS: %d paired published articles; %d approved new records" % (count, count - 14))
    return count

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-pages", action="store_true")
    args = parser.parse_args()
    try:
        validate_repository(require_pages=args.check_pages)
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
