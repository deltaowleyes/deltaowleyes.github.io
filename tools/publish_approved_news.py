#!/usr/bin/env python3
"""Build complete news articles only from approved, source-checked paired submissions."""
import argparse
import datetime as dt
import html
import json
import pathlib
import re
import sys
from zoneinfo import ZoneInfo
from check_news_language import approved, slugify, valid_https, validate

ROOT = pathlib.Path(__file__).resolve().parents[1]
TODAY = dt.datetime.now(ZoneInfo("America/Toronto")).date()

def text(value, field, length=3):
    if not isinstance(value, str) or len(value.strip()) < length:
        raise ValueError(field + ": missing/short text")
    if "<" in value or ">" in value:
        raise ValueError(field + ": plain text only")
    return value.strip()

def sections(value, field):
    if not isinstance(value, list) or len(value) < 2 or any(not isinstance(s, dict) for s in value):
        raise ValueError(field + ": must have at least two section objects")
    return [{"label":text(s.get("label"), field+" label"),
             "text":text(s.get("text"),field+" text",40)} for s in value]

def parse_submission(payload, path):
    if not isinstance(payload, dict):
        raise ValueError(str(path) + ": expected JSON object")
    title = text(payload.get("headline"), "headline", 15)
    slug = slugify(title)
    if slug != path.stem:
        raise ValueError(str(path) + ": filename must match generated slug " + slug)
    try:
        date = dt.date.fromisoformat(payload["date"])
    except (KeyError, TypeError, ValueError) as ex:
        raise ValueError(slug + ": invalid news date") from ex
    if date > TODAY:
        raise ValueError(slug + ": future news date")
    context = text(payload.get("context"), "context", 5)
    professional = sections(payload.get("professional_sections"), "professional")
    conversational = sections(payload.get("rez_sections"), "rez")
    rez_title = text(payload.get("rez_headline"), "rez headline", 10)
    sources = payload.get("sources")
    if not isinstance(sources, list) or not sources:
        raise ValueError(slug + ": requires an original source link")
    for source in sources:
        if not isinstance(source, dict) or not valid_https(source.get("url")):
            raise ValueError(slug + ": every source must have an HTTPS URL")
        text(source.get("title"), "source title", 5)
    review = payload.get("editorial_review")
    if not approved(review, TODAY):
        raise ValueError(slug + ": editorial review, sources_checked and claim_parity_checked required")
    esc = lambda value: html.escape(value, quote=True)
    body = ''.join('<p><strong>'+esc(s["label"])+':</strong> '+esc(s["text"])+'</p>' for s in professional)
    links = ' · '.join('<a href="'+esc(s["url"])+'">Source: '+esc(s["title"])+'</a>' for s in sources)
    block = ('<article><p class="meta">'+esc(date.isoformat())+' · '+esc(context)+
             '</p><h2><a href="/news/articles/'+slug+'/">'+esc(title)+'</a></h2>'+
             body+'<p>'+links+'</p></article>')
    variant = {"headline":rez_title,"sections":conversational,"review":review}
    return slug, block, variant

def ingest(root=ROOT, check=False):
    news = root / "news"
    paths = sorted((news / "approved").glob("*.json"))
    index_path = news / "index.html"
    edition_path = news / "rez-slang-9.json"
    index = index_path.read_text(encoding="utf-8")
    registry = json.loads(edition_path.read_text(encoding="utf-8"))
    baseline = set(json.loads((news/"rez-slang-9-baseline.json").read_text(encoding="utf-8")))
    existing = set(re.findall(r'href="/news/articles/([^/]+)/"', index))
    additions = []
    for path in paths:
        slug, block, variant = parse_submission(json.loads(path.read_text(encoding="utf-8")), path)
        if slug in existing:
            if registry["articles"].get(slug) != variant:
                raise ValueError(slug + ": published data differs; issue a reviewed correction instead")
            continue
        if slug in [x[0] for x in additions]:
            raise ValueError(slug + ": duplicate approved news submission")
        additions.append((slug, block, variant))
    updated = index
    if additions:
        location = re.search(r"<article\b", index)
        if location:
            updated = index[:location.start()] + ''.join(x[1] for x in additions) + index[location.start():]
        elif "</main>" in index:
            updated = index.replace("</main>", ''.join(x[1] for x in additions) + "</main>", 1)
        else:
            raise ValueError("Missing News index <main>")
        for slug, _, edition in additions:
            registry["articles"][slug] = edition
    errors = validate(updated, registry, baseline, TODAY)
    if errors:
        raise ValueError("Refusing publication:\n - "+"\n - ".join(errors))
    if check and additions:
        raise ValueError("Unpublished approved news: "+", ".join(x[0] for x in additions))
    if not check and additions:
        index_path.write_text(updated, encoding="utf-8")
        edition_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2)+"\n",encoding="utf-8")
    print("PASS: %d new approved paired articles, %d submissions processed" % (len(additions),len(paths)))
    return len(additions)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    try:
        ingest(check=args.check)
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print("ERROR: "+str(exc), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
