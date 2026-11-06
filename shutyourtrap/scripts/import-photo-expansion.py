#!/usr/bin/env python3
"""Safely import a second photo-only AI image pack without changing the 17 originals.

Expected archive: shutyourtrap/photo-inbox/SHUT-YOUR-TRAP-V3-PHOTOS.zip
Requires Pillow. Input contains 13-23 unique v3_*.jpg plus manifest.json.
Checks each source JPEG against its SHA256 and dimensions, converts to WebP,
and atomically writes the updated status.json only after all checks pass.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageOps
import hashlib
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ZIP = ROOT / "photo-inbox" / "SHUT-YOUR-TRAP-V3-PHOTOS.zip"
DEST = ROOT / "assets" / "photos"
STATUS = DEST / "status.json"
PATTERN = re.compile(r"v3_[a-z0-9_]+\.jpg\Z")

def fail(message):
    raise ValueError(message)

def main():
    if not ZIP.is_file():
        print("No photography 3.0 pack in inbox: no changes.")
        return
    if ZIP.stat().st_size > 30_000_000:
        fail("Archive exceeds 30 MB safeguard.")
    existing = json.loads(STATUS.read_text(encoding="utf-8"))
    if existing.get("enabled") is not True or existing.get("image_count") != 17:
        fail("Photo baseline not 17 images. Stop rather than alter unknown state.")
    original_names = existing["images"]
    if len(set(original_names)) != 17 or len(original_names) != 17:
        fail("Original photo inventory not unique.")
    if any(not (DEST / name).is_file() for name in original_names):
        fail("Original photo asset missing.")
    with zipfile.ZipFile(ZIP) as archive:
        archive_names = archive.namelist()
        if "manifest.json" not in archive_names:
            fail("Missing manifest.json.")
        manifest = json.loads(archive.read("manifest.json"))
        files = manifest.get("files", [])
        if manifest.get("schema") != 1 or not (13 <= len(files) <= 23):
            fail("Expected 13–23 verified new individual photos.")
        names = [x.get("name") for x in files]
        if (len(set(names)) != len(names) or
            not all(isinstance(n, str) and PATTERN.fullmatch(n) for n in names) or
            set(archive_names) != set(names) | {"manifest.json"} or
            len(archive_names) != len(names) + 1):
            fail("Unexpected ZIP entries, duplicate names, or invalid paths.")
        prepared = {}
        for entry in files:
            name = entry["name"]
            inf = archive.getinfo(name)
            if inf.file_size > 8_000_000:
                fail("Oversized image entry: " + name)
            data = archive.read(name)
            if len(data) != entry.get("bytes") or hashlib.sha256(data).hexdigest() != entry.get("sha256"):
                fail("JPEG checksum or size mismatch: " + name)
            with Image.open(BytesIO(data)) as im:
                if im.format != "JPEG" or im.width < 800 or im.height < 600 or im.width*im.height > 12_000_000:
                    fail("Invalid image type or dimensions: " + name)
                if im.width != entry.get("width") or im.height != entry.get("height"):
                    fail("Manifest dimensions mismatch: " + name)
                im.load()
                photo = ImageOps.exif_transpose(im).convert("RGB")
                buffer = BytesIO()
                photo.save(buffer, "WEBP", quality=82, method=6)
                output = buffer.getvalue()
            new_name = name[:-4] + ".webp"
            if (new_name in original_names or (DEST / new_name).exists() or
                output[:4] != b"RIFF" or output[8:12] != b"WEBP"):
                fail("Output collision or invalid WebP: " + new_name)
            prepared[new_name] = output
    # No content or status changed until every entry has passed.
    for name, data in prepared.items():
        (DEST / name).write_bytes(data)
    status = dict(existing)
    status["image_count"] = len(original_names) + len(prepared)
    status["images"] = sorted(original_names + list(prepared))
    status["source"] = "17 verified original WebP images plus checksum-verified photo collection 3.0"
    status["expanded_v3"] = True
    status["v3_image_count"] = len(prepared)
    status["sha256"] = {**existing.get("sha256", {}), **{
        name: hashlib.sha256(data).hexdigest() for name, data in prepared.items()
    }}
    STATUS.write_text(json.dumps(status, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"PHOTOGRAPHY V3 IMPORT PASS: {len(prepared)} distinct WebPs added to 17 preserved originals, total {status['image_count']} images.")

if __name__ == "__main__":
    main()
