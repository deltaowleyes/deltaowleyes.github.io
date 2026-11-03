# Publishing approved Professional and Rez Slang 9.0 news

New articles must be submitted as a **complete, fact-checked pair**, with an accurate Professional version and a faithful Rez Slang 9.0 rewrite. The Rez style is not a translation into any Indigenous language.

1. Start with `ARTICLE-TEMPLATE.json.example`, and name the completed file `<headline-slug>.json` inside `news/approved/`.
2. Verify dates, source statements, legal and funding status, figures, attribution, relevant TRC Call numbers, and qualifiers. Link to official primary sources when possible.
3. Manually compare the conversational version against the Professional version and original sources. Sensitive matters involving health, children, residential schools and sacred subjects must stay precise and respectful.
4. Only after an actual review, set `editorial_review.status` to `approved`, `reviewed_by` to the editor/reviewer, and both `sources_checked` and `claim_parity_checked` to true. Automatic tests check the attestation and structure; they **do not** perform independent fact-checking.
5. Push the approved record. The news workflow ingests both editions together, generates article pages, RSS and sitemaps, validates all published editions, and pushes safely. Unapproved entries are rejected.
6. Never directly append a new story to `news/index.html`; this bypasses paired intake. Use PR/branch protection to block unreviewed direct pushes to public content before GitHub Pages serves them.

Run locally:
```sh
python3 tools/build_news.py
python3 tools/publish_approved_news.py
python3 tools/publish_news_feeds.py
python3 tools/check_news_language.py --check-pages
python3 -m unittest discover -s tools -p test_news_language.py
python3 tools/publish_approved_news.py --check
```

The 14 existing articles are recorded in `news/rez-slang-9-baseline.json` as launch inventory. New reports need explicit review records. Do not silently rewrite published stories; use a sourced, dated correction. Existing newsroom and directory automations remain separate.
