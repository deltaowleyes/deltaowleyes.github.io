"""Distinct and factual interactive modules for Delta Owl Eyes Studio 3.4 candidate pages.
The module contains no private data, backend or network submission.
"""
from html import escape as E
def experience(theme,route,site):
    slug=route["slug"]
    base=site["base"]
    if theme=="river" and slug=="report":
        return """<section class="studio-experience editorial-guide" aria-labelledby="guide-title">
<div class="exp-intro"><span class="exp-kicker">Reading companion</span><h2 id="guide-title">Follow the reporting</h2><p>Jump between the sourced reporting, context and accountability questions. The reporting is unchanged.</p></div>
<nav aria-label="Article sections"><a href="#section-1">01 · News</a><a href="#section-2">02 · Education</a><a href="#section-3">03 · Accountability</a></nav>
<p class="exp-note">Contextual illustration is not a photograph of the reported events.</p></section>"""
    if theme=="river" and slug=="community":
        return """<section class="studio-experience editorial-guide" aria-labelledby="discovery-title">
<div class="exp-intro"><span class="exp-kicker">Directory pathways</span><h2 id="discovery-title">What would you like to discover?</h2><p>These links lead to actual Delta Owl Eyes directories. Listing information may be unverified.</p></div>
<div class="exp-tabs" role="group" aria-label="Community directory categories">
<a href="/indigenous-businesses/">Indigenous businesses ↗</a><a href="/indigenous-churches/">Churches ↗</a><a href="/events/">Events ↗</a>
</div></section>"""
    if theme=="ledger" and slug in ("report","trc"):
        title="Trace the source" if slug=="report" else "Track the responsibility"
        return f"""<section class="studio-experience docket" aria-labelledby="docket-title">
<div class="exp-intro"><span class="exp-kicker">Verification protocol / {E(slug)}</span><h2 id="docket-title">{E(title)}</h2><p>No fabricated document collection or numeric progress ratings. Follow the linked official and published material.</p></div>
<details><summary>01 · What is the underlying source?</summary><p>The reporting and historical context are linked from this page. Review the original wording and publication context before citing a claim.</p><a href="{E(route['source'],quote=True)}">Examine the published source ↗</a></details>
<details><summary>02 · What has actually been established?</summary><p>Distinguish reported observations and commitments from measured outcomes. This demonstration does not assert any TRC Call has been completed.</p></details>
<details><summary>03 · What still needs verification?</summary><p>Ask which institution has responsibility, what evidence would demonstrate a change, and whether independent reporting has confirmed that change.</p></details>
</section>"""
    if theme=="media" and slug=="media":
        return """<section class="studio-experience media-browse" aria-labelledby="browse-title">
<div class="exp-intro"><span class="exp-kicker">The Owl's Lens / Browse channels</span><h2 id="browse-title">Choose a story pathway</h2><p>These are topic links, not fictional episodes. Playback remains on the existing published video site.</p></div>
<div class="exp-channel-grid"><article><span>WATCH</span><h3>Video library</h3><p>Published video and podcast material</p><a href="/videos/">Browse available videos ↗</a></article>
<article><span>LEARN</span><h3>TRC education</h3><p>Understand the 94 Calls to Action</p><a href="/calls-to-action/">Explore the Calls ↗</a></article>
<article><span>READ</span><h3>Newsroom</h3><p>Verified Delta Owl Eyes reporting</p><a href="/news/">Read the stories ↗</a></article></div></section>"""
    if theme=="media" and slug=="report":
        return """<section class="studio-experience media-browse" aria-labelledby="media-context">
<div class="exp-intro"><span class="exp-kicker">Story format</span><h2 id="media-context">From reporting to conversation</h2><p>Read the sourced article first. No audio or video playback is fabricated here.</p></div>
<a class="exp-feature-link" href="/videos/">Explore actually published conversations ↗</a></section>"""
    if slug=="inquiry":
        return f"""<section class="studio-experience design-identity" aria-labelledby="identity-title">
<span class="exp-kicker">Selected prototype / {E(site['id'])}</span><h2 id="identity-title">{E(site['name'])}</h2>
<p>Design ID: <code>{E(site['id'])}</code>. The form below opens an <strong>unsent email draft</strong>, not a server submission.</p>
<p><a href="{E(base,quote=True)}">Review this design's homepage ↗</a></p></section>"""
    return ""

EXPERIENCE_STYLE = """
.studio-experience{max-width:1160px;margin:65px auto 30px;padding:clamp(20px,4vw,44px);border-radius:2px}
.studio-experience .exp-kicker{text-transform:uppercase;font-size:.72rem;letter-spacing:.16em;font-weight:850}
.studio-experience .exp-intro h2,.studio-experience>h2{font-size:clamp(1.8rem,3.4vw,3.2rem);margin:12px 0 20px}
.studio-experience .exp-intro p{max-width:62ch}
.studio-experience a{min-height:44px;display:inline-flex;align-items:center;text-underline-offset:5px;font-weight:800}
.studio-experience a:focus-visible,.studio-experience summary:focus-visible{outline:3px solid #e2b876;outline-offset:4px}
.editorial-guide{background:#e7dac5;color:#163c40;border-top:7px solid #a77845}
.editorial-guide nav,.exp-tabs{display:flex;flex-wrap:wrap;gap:12px}
.editorial-guide nav a,.exp-tabs a{padding:12px 16px;background:#123e42;color:#fff;text-decoration:none}
.editorial-guide .exp-note{font-size:.82rem;margin-top:23px}
.docket{background:#171c20;color:#f8f3ea;border-top:10px solid #b22c38}
.docket details{border-top:1px solid #b8c2c454;padding:0}
.docket summary{cursor:pointer;list-style:none;padding:20px 12px;min-height:60px;font-weight:850;font-size:1.05rem}
.docket summary::-webkit-details-marker{display:none}
.docket summary:after{content:'+';float:right;font-size:1.4rem}
.docket details[open] summary:after{content:'−'}
.docket details p,.docket details a{margin:0 18px 18px;color:#f3e6db}
.media-browse{background:#182f40;color:#fff4e7;border-top:6px solid #c77e6c}
.exp-channel-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.exp-channel-grid article{border:1px solid #718c9b;padding:24px;background:#0a1a29}
.exp-channel-grid article span{font-size:.7rem;color:#f5c4a3;letter-spacing:.2em}
.exp-channel-grid article h3{font:700 1.5rem Georgia,serif;margin:12px 0}
.exp-channel-grid article p{font-size:.9rem;min-height:55px}
.exp-channel-grid article a,.exp-feature-link{color:#ffe2af}
.design-identity{border-left:6px solid #b18a55;background:#e7dfd0;color:#182e33}
body.ledger .design-identity{background:#21272a;color:#fff}
body.media .design-identity{background:#1b3544;color:#fff}
.design-identity code{padding:4px 8px;background:#202c30;color:#fff0c6}
@media(max-width:750px){.studio-experience{margin:30px 15px;padding:22px 18px}.exp-channel-grid{grid-template-columns:1fr}.exp-channel-grid article p{min-height:0}}
@media(prefers-reduced-motion:reduce){.studio-experience *{scroll-behavior:auto;transition:none}}
"""
