#!/usr/bin/env python3
"""Offline regression tests for the website's read-only internal link checker."""
from pathlib import Path
from tempfile import TemporaryDirectory
from check_internal_links import check

def write(root, path, contents):
    target = root / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(contents, encoding="utf-8")

def run():
    with TemporaryDirectory() as directory:
        root = Path(directory).resolve()
        write(root, "index.html", '<html><body><section id="about"></section><a href="/#about">About</a><a href="/news/">News</a><img src="/assets/logo.png"></body></html>')
        write(root, "news/index.html", '<html><body><h1 id="latest">Latest</h1><a href="/#about">Home</a></body></html>')
        write(root, "assets/logo.png", "fixture")
        pages, links, errors = check(root)
        assert pages == 2 and links == 4 and not errors, (pages, links, errors)
        write(root, "news/index.html", '<a href="/missing/">Broken file</a><a href="/#absent">Broken anchor</a>')
        pages, links, errors = check(root)
        assert len(errors) == 2, errors
        assert any("missing target" in error for error in errors), errors
        assert any("missing anchor" in error for error in errors), errors
        print("Link checker regression tests passed.")

if __name__ == "__main__":
    run()
