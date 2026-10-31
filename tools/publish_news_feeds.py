#!/usr/bin/env python3
"""Publish standalone, canonical news pages, RSS and crawl sitemaps from the existing newsroom.

The original news/index.html remains the editorial source of truth. Publication dates
are tracked separately from the dates of the events being reported.
"""
import datetime as dt
import email.utils
import html
import json
import pathlib
import re
import unicodedata
import urllib.parse
import xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo

ROOT = pathlib.Path(__file__).resolve().parents[1]
NEWS = ROOT / "news" / "index.html"
DATES = ROOT / "news" / "publication-dates.json"
BASE = "https://deltaowleyes.ca"
TZ = ZoneInfo("America/Toronto")
TODAY = dt.datetime.now(TZ).date()
SM = "http://www.sitemaps.org/schemas/sitemap/0.9"
GN = "http://www.google.com/schemas/sitemap-news/0.9"
ATOM = "http://www.w3.org/2005/Atom"
ET.register_namespace("news", GN)
ET.register_namespace("atom", ATOM)

def plain(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()

def slugify(value):
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value))[:90].rstrip("-")

def write_if_changed(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists() or path.read_text(encoding="utf-8") != content:
        path.write_text(content, encoding="utf-8")
        return True
    return False

def xml_string(root):
    return ET.tostring(root, encoding="utf-8", xml_declaration=True).decode("utf-8") + "\n"

def main():
    original = NEWS.read_text(encoding="utf-8")
    if not re.search(r"<main>[\s\S]*?</main>", original):
        raise ValueError("Newsroom <main> element not found")
    if not DATES.exists():
        raise ValueError("Publication date registry missing; avoid guessing historical dates")
    registry = json.loads(DATES.read_text(encoding="utf-8"))
    blocks = re.findall(r"<article\b[^>]*>[\s\S]*?</article>", original)
    if not blocks:
        raise ValueError("No existing news stories; refusing to overwrite")
    stories, slugs = [], set()
    for block in blocks:
        h = re.search(r"<h2>([\s\S]*?)</h2>", block)
        m = re.search(r'<p class="meta">([\s\S]*?)</p>', block)
        if not h or not m:
            raise ValueError("Article requires a headline and metadata")
        title = plain(h.group(1))
        news_date = plain(m.group(1))[:10]
        dt.date.fromisoformat(news_date)
        slug = slugify(title)
        if not slug or slug in slugs:
            raise ValueError("Duplicate or missing headline slug: " + slug)
        slugs.add(slug)
        if slug not in registry:
            # This is the first date an article appeared in this site's publication registry,
            # not the date of the government event reported inside its content.
            registry[slug] = TODAY.isoformat()
        published = dt.date.fromisoformat(registry[slug])
        if published > TODAY:
            raise ValueError("Future publication date: " + slug)
        p = re.search(r"</h2>\s*<p>([\s\S]*?)</p>", block)
        if not p:
            # A few articles begin with a bold label; take the first ordinary body paragraph.
            p = re.search(r"</h2>[\s\S]*?<p>([\s\S]*?)</p>", block)
        description = plain(p.group(1)) if p else title
        if not re.search(r'<a href="https://', block):
            raise ValueError("Missing source URL for " + slug)
        url = BASE + "/news/articles/" + slug + "/"
        stories.append(dict(block=block, title=title, news_date=news_date,
                            published=published, slug=slug, url=url, description=description))

    # Publish standalone articles without modifying their fact reporting.
    for story in stories:
        standalone = re.sub(r"<h2>[\s\S]*?</h2>", "<h1>" + html.escape(story["title"]) + "</h1>",
                            story["block"], count=1)
        date_label = story["published"].strftime("%B %d, %Y").replace(" 0", " ")
        byline = ('<p class="meta">First published ' + html.escape(date_label) +
                  ' · By <a href="/#about">Delta Owl Eyes</a> · '
                  '<a href="mailto:deltaowleyes@gmail.com">Contact the newsroom</a></p>')
        standalone = standalone.replace("<h1>", byline + "<h1>", 1)
        url = story["url"]
        meta = (
            '<link rel="canonical" href="' + url + '">'
            '<link rel="alternate" type="application/rss+xml" title="Delta Owl Eyes News" href="/feed.xml">'
            '<meta name="description" content="' + html.escape(story["description"][:250], quote=True) + '">'
            '<meta property="og:type" content="article">'
            '<meta property="og:title" content="' + html.escape(story["title"], quote=True) + '">'
            '<meta property="og:url" content="' + url + '">'
        )
        data = {"@context": "https://schema.org", "@type": "NewsArticle",
                "headline": story["title"], "datePublished": story["published"].isoformat(),
                "url": url, "mainEntityOfPage": url, "inLanguage": "en-CA",
                "description": story["description"][:500],
                "author": {"@type": "Organization", "name": "Delta Owl Eyes", "url": BASE + "/"},
                "publisher": {"@type": "Organization", "name": "Delta Owl Eyes", "url": BASE + "/",
                              "logo": {"@type": "ImageObject", "url": BASE + "/assets/owl-logo.png"}},
                "isAccessibleForFree": True}
        meta += '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False).replace("</", "<\\/") + '</script>'
        page = original.replace("<title>News Updates | Delta Owl Eyes</title>",
                                "<title>" + html.escape(story["title"]) + " | Delta Owl Eyes</title>", 1)
        page = page.replace("</head>", meta + "</head>", 1)
        page = re.sub(r"<main>[\s\S]*?</main>",
                      lambda m: '<main><p><a href="/news/">← All News Updates</a></p>' +
                                standalone + '<p><a href="/news/">Back to News Updates</a></p></main>',
                      page, count=1)
        write_if_changed(ROOT / "news" / "articles" / story["slug"] / "index.html", page)

    # Make headlines on the existing index link directly to the canonical article.
    mapping = {s["title"]: s for s in stories}
    def linked(block_match):
        block = block_match.group(0)
        headline = plain(re.search(r"<h2>([\s\S]*?)</h2>", block).group(1))
        s = mapping[headline]
        linked_h2 = '<h2><a href="/news/articles/' + s["slug"] + '/">' + html.escape(headline) + '</a></h2>'
        return re.sub(r"<h2>[\s\S]*?</h2>", linked_h2, block, count=1)
    updated_index = re.sub(r"<article\b[^>]*>[\s\S]*?</article>", linked, original)
    if 'rel="alternate" type="application/rss+xml"' not in updated_index:
        updated_index = updated_index.replace("</head>",
            '<link rel="alternate" type="application/rss+xml" title="Delta Owl Eyes News" href="/feed.xml">'
            '<link rel="canonical" href="https://deltaowleyes.ca/news/"></head>', 1)
    write_if_changed(NEWS, updated_index)

    # Persistent first-publication dates; never confuse source story dates with website publication dates.
    write_if_changed(DATES, json.dumps(dict(sorted(registry.items())), indent=2, ensure_ascii=False) + "\n")
    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    for tag, value in [("title", "Delta Owl Eyes — News Updates"),
                       ("link", BASE + "/news/"),
                       ("description", "Verified updates on Canada's Truth and Reconciliation Commission Calls to Action."),
                       ("language", "en-ca")]:
        ET.SubElement(channel, tag).text = value
    ET.SubElement(channel, "{" + ATOM + "}link",
                  {"href": BASE + "/feed.xml", "rel": "self", "type": "application/rss+xml"})
    for s in sorted(stories, key=lambda x: (x["published"], x["news_date"], x["slug"]), reverse=True):
        item = ET.SubElement(channel, "item")
        for tag, value in [("title", s["title"]), ("link", s["url"]),
                           ("description", s["description"]),
                           ("guid", s["url"])]:
            ET.SubElement(item, tag).text = value
        # RSS requires a time; use date-only midnight with correct local timezone, no invented event time.
        at_midnight = dt.datetime.combine(s["published"], dt.time(), TZ)
        ET.SubElement(item, "pubDate").text = email.utils.format_datetime(at_midnight)
    write_if_changed(ROOT / "feed.xml", xml_string(rss))

    main = ET.Element("{" + SM + "}urlset")
    static = ["/", "/news/", "/calls-to-action/",
              "/investigations/trc-calls-to-action-audit-2026.html",
              "/indigenous-businesses/", "/indigenous-churches/", "/events/",
              "/services/", "/privacy/"]
    for path in static + [urllib.parse.urlsplit(s["url"]).path for s in stories]:
        url = ET.SubElement(main, "{" + SM + "}url")
        ET.SubElement(url, "{" + SM + "}loc").text = BASE + path
    write_if_changed(ROOT / "sitemap.xml", xml_string(main))

    recent = ET.Element("{" + SM + "}urlset")
    recent_count = 0
    for s in stories:
        if 0 <= (TODAY - s["published"]).days <= 2:
            entry = ET.SubElement(recent, "{" + SM + "}url")
            ET.SubElement(entry, "{" + SM + "}loc").text = s["url"]
            news = ET.SubElement(entry, "{" + GN + "}news")
            publication = ET.SubElement(news, "{" + GN + "}publication")
            ET.SubElement(publication, "{" + GN + "}name").text = "Delta Owl Eyes"
            ET.SubElement(publication, "{" + GN + "}language").text = "en"
            ET.SubElement(news, "{" + GN + "}publication_date").text = s["published"].isoformat()
            ET.SubElement(news, "{" + GN + "}title").text = s["title"]
            recent_count += 1
    write_if_changed(ROOT / "news-sitemap.xml", xml_string(recent))
    for path in [ROOT / "feed.xml", ROOT / "sitemap.xml", ROOT / "news-sitemap.xml"]:
        ET.parse(path)
    print("Validated %d individual articles, %d news sitemap entries, RSS and site sitemap" %
          (len(stories), recent_count))

if __name__ == "__main__":
    main()
