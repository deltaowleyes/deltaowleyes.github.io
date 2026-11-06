#!/usr/bin/env python3
"""Deterministic River Voice factory: validate existing repo assets, optimize and stage a *non-deployed* runnable preview.
No paid APIs, external fetches, automatic commits, deployment, invented image provenance, or falsified resolutions.
"""
from __future__ import annotations
import argparse, hashlib, json, pathlib, re, shutil, sys, time, tempfile
from PIL import Image, ImageOps
ROOT = pathlib.Path(__file__).resolve().parents[2]
CONF = ROOT / "studio2/factory/config.json"
class FactoryError(Exception): pass
def sha(data: bytes)->str: return hashlib.sha256(data).hexdigest()
def compile_preview(out:pathlib.Path)->dict:
    started=time.monotonic()
    cfg=json.loads(CONF.read_text())
    if cfg.get("schema_version")!=1 or cfg.get("owner_visual_approval") is not False:
        raise FactoryError("Fail closed: only unapproved schema-v1 candidates can be built")
    if cfg.get("release",{}).get("allow_deploy") or cfg["release"].get("allow_merge"):
        raise FactoryError("Build cannot authorize publication")
    max_source=cfg["caps"]["max_source_bytes"]
    max_pixels=cfg["caps"]["max_image_pixels"]
    max_output=cfg["caps"]["max_output_bytes"]
    assets=cfg["assets"]
    if len(assets)!=3 or {i["id"] for i in assets}!={"hero","trc","logo"}:
        raise FactoryError("Unexpected asset role manifest")
    html=(ROOT / cfg["current_page"]).read_text()
    if "<meta name=\"robots\" content=\"noindex,nofollow\">" not in html:
        raise FactoryError("Candidate noindex guard missing")
    for privacy in cfg["immutable_core"]:
        if not (ROOT/privacy).is_file():raise FactoryError("Missing privacy dependency")
    records=[]
    with tempfile.TemporaryDirectory(prefix="river-factory-") as stage:
        temp=pathlib.Path(stage)
        (temp/"assets").mkdir()
        replacements={
          "hero":("/assets/wetlands.png","/studio2/river-voice/factory-preview/assets/hero.webp"),
          "trc":("/shutyourtrap/assets/photos/golden_sunrise_in_a_misty_pine_forest.webp","/studio2/river-voice/factory-preview/assets/trc-landscape.webp"),
          "logo":("/assets/owl-logo.png","/studio2/river-voice/factory-preview/assets/owl-logo.webp")
        }
        for item in assets:
            source=ROOT/item["source"]
            if not source.is_file() or source.is_symlink():raise FactoryError("Missing or unsafe source: "+str(source))
            raw=source.read_bytes()
            if not raw or len(raw)>max_source:raise FactoryError("Source size exceeds policy: "+str(source))
            try:
                with Image.open(source) as im:
                    im.verify()
                with Image.open(source) as im:
                    im=ImageOps.exif_transpose(im)
                    original_width,original_height=im.size
                    if original_width*original_height>max_pixels:raise FactoryError("Decompression bomb guard")
                    resized=im.copy()
                    if resized.width>item["max_width"]:
                        ratio=item["max_width"]/resized.width
                        resized=resized.resize((item["max_width"],max(1,int(resized.height*ratio))),Image.Resampling.LANCZOS)
                    if resized.mode not in ("RGB","RGBA"):resized=resized.convert("RGBA" if "A" in resized.getbands() else "RGB")
                    # Pillow encodes WebP without any upscaling. Preserve transparency if present.
                    target=temp/"assets"/item["output"]
                    resized.save(target,format="WEBP",quality=item["quality"],method=6)
                    with Image.open(target) as test:
                        test.load()
                        if test.format!="WEBP" or test.size!=resized.size:raise FactoryError("WebP verification failed")
            except (OSError,ValueError) as e:raise FactoryError("Decode/encode failed: "+str(source)+": "+str(e)) from e
            size=target.stat().st_size
            if size>max_output:raise FactoryError("Optimized image exceeds max_output_bytes")
            old,new=replacements[item["id"]]
            if old not in html:raise FactoryError("HTML reference missing: "+old)
            html=html.replace(old,new)
            records.append({"role":item["id"],"source":item["source"],"source_sha256":sha(raw),
                "original_native_dimensions":[original_width,original_height],
                "output":"assets/"+item["output"],"output_sha256":sha(target.read_bytes()),
                "output_dimensions":list(resized.size),
                "source_bytes":len(raw),"output_bytes":size,
                "image_quality_approved":item["accepted_for_final"],"provenance_note":item["role"]})
        if "/assets/privacy-consent.js" not in html or "/assets/privacy-consent.css" not in html:
            raise FactoryError("Privacy controls removed")
        (temp/"index.html").write_text(html)
        manifest={"schema_version":1,"status":"generated_preview_not_deployed",
          "owner_approved":False,"project":cfg["project"],"provenance":cfg["asset_provenance"],
          "visual_review_blockers":["Hero has baked-in branding","Article SVG art is not premium photographic art","User visual approval outstanding"],
          "assets":records}
        (temp/"asset-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
        out.parent.mkdir(parents=True,exist_ok=True)
        if out.exists():shutil.rmtree(out)
        shutil.copytree(temp,out)
    manifest["build_elapsed_seconds"]=round(time.monotonic()-started,2)
    (out/"asset-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
    return manifest
def main():
    p=argparse.ArgumentParser();p.add_argument("--out",default="studio2/river-voice/factory-preview")
    args=p.parse_args()
    target=(ROOT/args.out).resolve()
    allowed=(ROOT/"studio2/river-voice/factory-preview").resolve()
    if target!=allowed:raise SystemExit("Output path must be the isolated candidate preview path")
    try:
        data=compile_preview(target)
    except (FactoryError,OSError,KeyError,ValueError) as e:
        print("FACTORY BUILD REJECTED:",str(e),file=sys.stderr);raise SystemExit(1)
    print(json.dumps({"result":"STAGED_CANDIDATE_ONLY","assets":len(data["assets"]),"seconds":data["build_elapsed_seconds"],
      "input_bytes":sum(a["source_bytes"] for a in data["assets"]),
      "output_bytes":sum(a["output_bytes"] for a in data["assets"]),"output":str(target)},indent=2))
if __name__=="__main__":main()
