#!/usr/bin/env python3
"""Independent read-only GitHub-hosted public release acceptance for BAKE EXPRESS."""
import hashlib
import json
import pathlib
import time
import urllib.request
from urllib.error import URLError, HTTPError

ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE="https://www.deltaowleyes.ca"
SITE="/shutyourtrap/express/"
WIDTHS=[320,390,500,768,1024,1440]
SLUGS=["sharp-edge","family-trapline","expedition","sharpening-flow","field-journal","bold-operator"]
OUT=ROOT/"artifacts/shutyourtrap-express-live"
OUT.mkdir(parents=True,exist_ok=True)
expected=json.loads((ROOT/"shutyourtrap/express/shots/manifest.json").read_text())
headers=json.loads((ROOT/"studio-sandbox/header-restoration-manifest.json").read_text())["assets"]
header_hash={x["file"]:x["sha256"] for x in headers}
assert expected["viewportWidths"]==WIDTHS and len(expected["files"])==36
assert len({e["filename"] for e in expected["files"]})==36

def get(path,method="GET"):
    request=urllib.request.Request(BASE+path,headers={"Cache-Control":"no-cache","User-Agent":"DeltaOwlEyes-ExpressMaster-LiveAcceptance/1.0"},method=method)
    with urllib.request.urlopen(request,timeout=25) as reply:
        if reply.status!=200:raise RuntimeError(f"HTTP {reply.status} {path}")
        if method=="HEAD":return b""
        return reply.read()

def sha(data):
    return hashlib.sha256(data).hexdigest()

def verify_live():
    html=get(SITE).decode("utf-8")
    assert 'data-express-shell="1.0"' in html, "Canonical studio shell not yet deployed"
    assert '/assets/express-studio/v1/studio.css' in html and '/assets/express-studio/v1/studio.js' in html
    assert '/shutyourtrap/express/config.js' in html

    for path in ("assets/express-studio/v1/studio.css","assets/express-studio/v1/studio.js","shutyourtrap/express/config.js"):
        local=(ROOT/path).read_bytes()
        assert sha(get("/"+path))==sha(local),f"Live shared asset differs: {path}"

    for width in WIDTHS:
        name=f"header-{width}.webp"
        assert sha(get("/studio-sandbox/"+name))==header_hash[name],f"Wrong original header artwork: {name}"

    remote=json.loads(get(SITE+"shots/manifest.json"))
    assert remote==expected,"Deployed screenshot manifest differs from checked-out release"
    for slug in SLUGS:
        page=get(SITE+"previews/"+slug+"/").decode("utf-8")
        assert 'data-express-design="'+slug+'"' in page,slug
        assert '/assets/express-studio/v1/studio.js' in page,slug
        for width in WIDTHS:
            # HEAD verifies that each exact screenshot exists without downloading 10+ MB repeatedly.
            get(SITE+f"shots/{slug}-{width}.jpg",method="HEAD")

    result={"live_verified":True,"url":BASE+SITE,"checked_headers":WIDTHS,"designs":SLUGS,
            "image_files":36,"gallery_routes":6,"shared_css_js_match":True,"config_match":True,
            "screenshot_manifest_match":True}
    (OUT/"results.json").write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps(result,indent=2),flush=True)
    return result

for attempt in range(32):
    try:
        verify_live()
        break
    except (AssertionError,URLError,HTTPError,TimeoutError,OSError,ValueError,RuntimeError) as err:
        print(f"Live deployment not verified at attempt {attempt+1}: {err}",flush=True)
        if attempt==31:raise
        time.sleep(8)
