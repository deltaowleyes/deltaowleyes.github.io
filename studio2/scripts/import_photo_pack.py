#!/usr/bin/env python3
"""Fail-closed River Voice photo pack validator/stager.

No network, AI API, CDN, repository commit, or deployment in this script.
Expected SHA-256 pins come from a committed approval registry, never the ZIP itself.
"""
import argparse
import hashlib
import json
import pathlib
import shutil
import sys
import tempfile
import zipfile

EXPECTED = {
    "river-hero.jpg": {"min_width": 1800, "min_height": 1000},
    "education-research.jpg": {"min_width": 1200, "min_height": 800},
    "archaeology-policy.jpg": {"min_width": 1200, "min_height": 800},
    "historical-learning.jpg": {"min_width": 1200, "min_height": 800},
    "owl-lens-studio.jpg": {"min_width": 1200, "min_height": 800},
}
MAX_BYTES = 9_000_000
MAX_TOTAL = 35_000_000

class ValidationError(Exception):
    pass

def validate(archive, approvals, destination=None):
    from PIL import Image, ImageOps
    Image.MAX_IMAGE_PIXELS = 30_000_000
    reg = json.loads(pathlib.Path(approvals).read_text())
    if reg.get("schema_version") != 1 or set(reg.get("assets", {})) != set(EXPECTED):
        raise ValidationError("Approval registry must name exactly five fixed assets")
    if not reg.get("owner_visual_approval", False):
        raise ValidationError("Owner visual approval flag required; no auto-activation")
    with zipfile.ZipFile(archive) as z:
        files = [x for x in z.infolist() if not x.is_dir()]
        if len(files) != 5 or {x.filename for x in files} != set(EXPECTED):
            raise ValidationError("Archive must contain exactly five approved root-level JPEG names")
        if sum(x.file_size for x in files) > MAX_TOTAL:
            raise ValidationError("Archive uncompressed total too large")
        if any(x.file_size > MAX_BYTES or x.file_size <= 0 for x in files):
            raise ValidationError("Unexpected asset size")
        report = []
        with tempfile.TemporaryDirectory() as tmp:
            tmp = pathlib.Path(tmp)
            for info in files:
                name = info.filename
                if name.startswith(".") or "/" in name or "\\" in name:
                    raise ValidationError("Unsafe filename")
                raw = z.read(info)
                sha = hashlib.sha256(raw).hexdigest()
                pinned = reg["assets"][name].get("sha256")
                if not isinstance(pinned, str) or len(pinned) != 64 or sha != pinned:
                    raise ValidationError(f"{name}: checksum mismatch or missing independent SHA pin")
                source = tmp / name
                source.write_bytes(raw)
                try:
                    with Image.open(source) as im:
                        im.verify()
                    with Image.open(source) as im:
                        if im.format != "JPEG":
                            raise ValidationError(f"{name}: only real JPEG supported")
                        im = ImageOps.exif_transpose(im)
                        w, h = im.size
                        if w < EXPECTED[name]["min_width"] or h < EXPECTED[name]["min_height"]:
                            raise ValidationError(f"{name}: dimensions {w}x{h} below minimum")
                        if im.width * im.height > Image.MAX_IMAGE_PIXELS:
                            raise ValidationError(f"{name}: excessive pixel count")
                        im.convert("RGB").save(tmp / (name[:-4] + ".webp"), format="WEBP", quality=86, method=6)
                except (OSError, ValueError) as e:
                    raise ValidationError(f"{name}: image decode failure: {e}")
                report.append({"name": name, "sha256": sha, "width": w, "height": h,
                               "webp": name[:-4]+".webp", "conceptual_not_documentary": True})
            if destination:
                dest = pathlib.Path(destination)
                dest.mkdir(parents=True, exist_ok=True)
                # Do not install partially validated packs: validation finished for all five above.
                for x in report:
                    shutil.copy2(tmp / x["webp"], dest / x["webp"])
                (dest / "manifest.json").write_text(json.dumps({
                    "schema_version": 1, "source": "approved-original-AI-visual-concepts",
                    "state": "staged_not_published", "assets": report
                }, indent=2)+"\n")
    return report

def main():
    p=argparse.ArgumentParser()
    p.add_argument("archive")
    p.add_argument("--approvals", default="studio2/river-voice/PHOTO-APPROVALS.json")
    p.add_argument("--destination")
    args=p.parse_args()
    try:
        result=validate(args.archive,args.approvals,args.destination)
        print(json.dumps({"status":"PASS_STAGED_ONLY" if args.destination else "PASS_VALIDATION_ONLY","assets":result},indent=2))
    except (ValidationError,zipfile.BadZipFile,KeyError,TypeError,ValueError,OSError) as e:
        print(f"PHOTO IMPORT REJECTED: {e}",file=sys.stderr)
        sys.exit(1)
if __name__=="__main__":
    main()
