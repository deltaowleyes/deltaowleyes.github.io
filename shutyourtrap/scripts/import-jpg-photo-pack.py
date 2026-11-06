#!/usr/bin/env python3
"""Verify the already-uploaded 17-JPEG pack and convert to production WebPs.

No archive entries are extracted into paths. No files are changed before all
source checksums and images are validated. Requires Pillow (installed in CI).
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import zipfile
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/"photo-inbox"/"ONLY-17-PHOTOGRAPHS-JPG.zip"
DEST=ROOT/"assets"/"photos"
EXPECTED={
"droplets_on_a_sharpened_blade.jpg":"15fa81f8ac092b8e788377e0cf38facacfda2592621b2a601a6f2374790da64a",
"golden_dawn_at_the_lakeside_cabin.jpg":"f551c9878815c8f79261e3dbef4b81ae33c5289e25c6379c8fe5d644feb5ba28",
"golden_dawn_lakeside_cabin.jpg":"77c640e672a884bb95a364c54e5565f40cc0992db8ba3714b8f2ef25ed154890",
"golden_sunrise_at_the_lakeside_cabin.jpg":"a331d4f50a34cfebb83decc306b620f92f3c91234f884db04203f9d94ac9dd10",
"golden_sunrise_in_a_misty_pine_forest.jpg":"497a53268155378f451b4dc360afd765d10a566c6d194cf457d7f18936ba3e59",
"lantern_lit_rustic_sharpening_workshop.jpg":"745846b992259ca9b68313841e9b3562de6a81a89b7b524007ab87f1be61c970",
"macro_razor_blade_on_wet_whetstone.jpg":"8287049e9c041d2c8249ec8e10d9c073f1f44002f02232b09bd71f0435658d1f",
"misty_morning_forest_camp_gear.jpg":"24891ba853c822aaba162edc212c3fdf6895398e0fbd12219a42bd81f31563ee",
"rugged_expedition_gear_flat_lay.jpg":"6b41d27dbbf3f19e744c90330b7886e08f374062a861a5a4f2e606e01187547c",
"rugged_outdoor_gear_flat_lay.jpg":"7eb652ee94727357e4a470ece8688db14d3a90f91a34f58787849ccfad489120",
"rustic_cabin_at_sunrise_lake.jpg":"52f7a3a5576923610d5bfb1ce8e70555344dd1a63e4bc030a0d1599e48fb8505",
"rustic_sunlit_sharpening_workshop.jpg":"0b11f10d74f7abe605ac29ba864a28d05b3258014acf4fb5612ef56925c24ccb",
"rustic_wire_rope_workshop_still_life.jpg":"a5e96dea010b4f3cdd2db495fcc8394c78e17b4c86c75b6b434ed37b6e05281c",
"sunrise_backpack_over_misty_mountains.jpg":"a6c40958a424981b348bde5313f51ed0d20120367b1b1c2de44150e99fd57918",
"vintage_workshop_grinding_wheel_still_life.jpg":"80ba6ca77a28e84a4edc683dd9dff09aedf59b3035b779ded3aff83d9c8d0534",
"water_kissed_blade_on_whetstone.jpg":"e26745ccf0c5030f93ff1a50f0fd3a9663d9db715abc6f133f0941e865717e2e",
"woodworking_sharpening_station_flat_lay.jpg":"08222488580f0955a6baaa738b061a69157eb7915a9cb5d8eb26a6803e0c544a"
}
EXPECTED_GIT_BLOB="7a4edcf6d70db2c0f3e14464db8594c599d0d9e8"
def main():
    raw=SOURCE.read_bytes()
    git_blob=hashlib.sha1(("blob "+str(len(raw))+"\0").encode()+raw).hexdigest()
    if git_blob!=EXPECTED_GIT_BLOB: raise ValueError("Uploaded JPEG archive differs from locally verified source")
    imgs={}
    with zipfile.ZipFile(BytesIO(raw)) as arc:
        if len(arc.namelist())!=17 or set(arc.namelist())!=set(EXPECTED):
            raise ValueError("Expected exactly 17 named JPG assets, without website files")
        if arc.testzip() is not None: raise ValueError("Corrupt JPEG ZIP")
        for name,sha in EXPECTED.items():
            body=arc.read(name)
            if hashlib.sha256(body).hexdigest()!=sha:raise ValueError("Photo SHA-256 mismatch: "+name)
            with Image.open(BytesIO(body)) as img:
                if img.format!="JPEG" or img.width < 800 or img.height < 600: raise ValueError("Invalid JPEG "+name)
                img.load()
                rgb=ImageOps.exif_transpose(img).convert("RGB")
                mem=BytesIO()
                rgb.save(mem,format="WEBP",quality=84,method=6)
                outname=name.removesuffix(".jpg")+".webp"
                result=mem.getvalue()
                with Image.open(BytesIO(result)) as probe:
                    probe.load()
                    if probe.format!="WEBP" or probe.size!=rgb.size:raise ValueError("Bad converted WebP "+name)
                imgs[outname]=result
    # Do not activate until all 17 validated and converted.
    DEST.mkdir(parents=True,exist_ok=True)
    for name,data in sorted(imgs.items()):
        (DEST/name).write_bytes(data)
    status={
      "schema":1,"enabled":True,"image_count":17,
      "images":sorted(imgs),
      "source":"17 verified JPG AI scenes, transcoded to WebP for the website",
      "artwork_note":"Original conceptual AI photography, not a record of actual owner, property or services",
      "sha256":{name:hashlib.sha256(body).hexdigest() for name,body in sorted(imgs.items())}
    }
    (DEST/"status.json").write_text(json.dumps(status,indent=2)+"\n")
    print("PHOTO IMPORT PASS: 17 matching JPGs, 17 decoded original images, 17 converted WebPs; photography enabled")
    print("Total WebP bytes:",sum(map(len,imgs.values())))
if __name__=="__main__":
    main()
