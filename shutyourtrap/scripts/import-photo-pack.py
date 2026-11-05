#!/usr/bin/env python3
"""Import the owner-provided, previously verified 17-photo ZIP into GitHub Pages.

Standard-library only. No paid APIs. Never downloads external content, changes
unrelated files or turns on photography until every binary is verified.
"""
from pathlib import Path
import hashlib
import json
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "photo-inbox" / "shutyourtrap-photography-pack.zip"
DEST = ROOT / "assets" / "photos"
STATUS = DEST / "status.json"

EXPECTED = {
    "droplets_on_a_sharpened_blade.webp": "d927ce67ebb9b9d09f17dc1be8a762052c1f8dfa675248e0977ec137d8cb3044",
    "golden_dawn_at_the_lakeside_cabin.webp": "4293cb49ebbf67258c654a245bea1e7909f7e1e317a8f0da08fa23f38441dfb4",
    "golden_dawn_lakeside_cabin.webp": "3627a8672145b11c0a327a6a92a393398d56fd87a3eb9f91095aaaa99b3427b4",
    "golden_sunrise_at_the_lakeside_cabin.webp": "ef59ca2afdc6001fca634039295ae62470a9dd6c572104032e1ef3c48f963095",
    "golden_sunrise_in_a_misty_pine_forest.webp": "70a96f1c88032c64aeb84cb2059c5dec4f925e63502a440f857c958e85361275",
    "lantern_lit_rustic_sharpening_workshop.webp": "bfae9338ec74af717b38e2ff22709e3da64dba9f046039564c7c997f97324380",
    "macro_razor_blade_on_wet_whetstone.webp": "8c36caad1d9fc5cf24a29293bde2074425a19d154f7d74f114f9c8286b87a4c1",
    "misty_morning_forest_camp_gear.webp": "3775cde969d32c2c2d2ca683a5bb9736192f3476e164b9a1fa87ef53beac21d8",
    "rugged_expedition_gear_flat_lay.webp": "10b89b65dd94e0066242b85cb7539aaa4ba9f7f90c5e40c2483febaa215d9619",
    "rugged_outdoor_gear_flat_lay.webp": "a73e57d6972aa6b303784d0e80ff2b257215489868c165eafdf511fe653dc659",
    "rustic_cabin_at_sunrise_lake.webp": "b2e25983264e2eef840294808c303bea02d5db7e934f71226020199523113829",
    "rustic_sunlit_sharpening_workshop.webp": "f9c5905d2cb05696fce2c9e33de964bafb40c25a0c6d980e79d41f6b7ca4aea5",
    "rustic_wire_rope_workshop_still_life.webp": "7c1767eac3ce6e74ccef136bcc8bbba841bf5d4b3292d519bdccee88d4871f2c",
    "sunrise_backpack_over_misty_mountains.webp": "0b63ee05fa910ba6e28e136718146a9c657c442a99b57cd82fbe11de96853765",
    "vintage_workshop_grinding_wheel_still_life.webp": "3190def7de03ba2280ab8ca1a1475639a57c4ecb64cdcce2e282059439b00084",
    "water_kissed_blade_on_whetstone.webp": "884c5d423e8bf3f2701a3cfab5f99a63c921cd1fb55df777d04cccfd13c66bf5",
    "woodworking_sharpening_station_flat_lay.webp": "6a1739f362e3630c7d158ebca9ced2fccaffca1d7c4f2c975ea0cf5988453819",
}

def main():
    if not ARCHIVE.is_file():
        print("No ZIP in photo-inbox; nothing to import.")
        return 0
    if ARCHIVE.stat().st_size > 20_000_000:
        raise ValueError("Archive exceeds verified upload size")
    prepared = {}
    with zipfile.ZipFile(ARCHIVE) as archive:
        if set(archive.namelist()) != set(EXPECTED) | {"manifest.json"}:
            raise ValueError("Unexpected archive entries or missing assets")
        manifest = json.loads(archive.read("manifest.json"))
        entries = manifest.get("files", [])
        if len(entries) != 17 or manifest.get("image_count") != 17:
            raise ValueError("Manifest must contain exactly 17 verified photos")
        claimed = {e.get("name") for e in entries}
        if claimed != set(EXPECTED):
            raise ValueError("Image filenames do not match verified checkpoint")
        for entry in entries:
            name = entry["name"]
            if not re.fullmatch(r"[a-z0-9_]+\.webp", name):
                raise ValueError("Unsafe filename")
            data = archive.read(name)
            sha = hashlib.sha256(data).hexdigest()
            if sha != EXPECTED[name] or sha != entry["sha256"]:
                raise ValueError(f"SHA-256 mismatch for {name}")
            if len(data) != entry["bytes"] or not data.startswith(b"RIFF") or data[8:12] != b"WEBP":
                raise ValueError(f"Not a valid WebP asset: {name}")
            prepared[name] = data

    # All 17 validated before changing any checked-in image or activation flag.
    DEST.mkdir(parents=True, exist_ok=True)
    for name, data in prepared.items():
        (DEST / name).write_bytes(data)
    status = {
        "schema": 1,
        "enabled": True,
        "image_count": len(prepared),
        "images": sorted(prepared),
        "source": "Validated AI-generated photo-pack; illustrations remain as fallbacks",
        "artwork_note": "Concept photography, not evidence of the actual workshop or owner",
    }
    STATUS.write_text(json.dumps(status, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"PHOTO IMPORT READY: {len(prepared)} verified assets; {sum(map(len, prepared.values()))} bytes")
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"PHOTO IMPORT FAILED, NO ACTIVATION: {exc}", file=sys.stderr)
        sys.exit(1)
