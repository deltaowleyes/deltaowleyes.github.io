#!/usr/bin/env python3
"""Offline importer contract tests using synthetic fixtures (not photo acceptance)."""
import hashlib, importlib.util, io, json, pathlib, tempfile, zipfile
from PIL import Image

modpath=pathlib.Path("studio2/scripts/import_photo_pack.py")
spec=importlib.util.spec_from_file_location("river_import",str(modpath))
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)

with tempfile.TemporaryDirectory() as root:
    root=pathlib.Path(root)
    pack=root/"RIVER-VOICE-ORIGINAL-PHOTOS.zip"
    blobs={}
    for name,specification in mod.EXPECTED.items():
        im=Image.new("RGB",(specification["min_width"],specification["min_height"]),(42,74,81))
        output=io.BytesIO();im.save(output,format="JPEG",quality=84)
        blobs[name]=output.getvalue()
    with zipfile.ZipFile(pack,"w",compression=zipfile.ZIP_DEFLATED) as z:
        for name,blob in blobs.items():z.writestr(name,blob)
    registry={"schema_version":1,"owner_visual_approval":True,"assets":{name:{"sha256":hashlib.sha256(data).hexdigest()} for name,data in blobs.items()}}
    approvals=root/"approvals.json"
    approvals.write_text(json.dumps(registry))
    out=root/"out"
    assert len(mod.validate(pack,approvals,out))==5
    assert len(list(out.glob("*.webp")))==5
    assert json.loads((out/"manifest.json").read_text())["state"]=="staged_not_published"
    cases=0
    def reject(modifier):
        global cases
        candidate=json.loads(json.dumps(registry))
        modifier(candidate)
        approvals.write_text(json.dumps(candidate))
        try:mod.validate(pack,approvals,out)
        except mod.ValidationError:cases+=1
        else:raise AssertionError("importer accepted invalid case")
    reject(lambda x:x.update(owner_visual_approval=False))
    reject(lambda x:x["assets"]["river-hero.jpg"].update(sha256="0"*64))
    reject(lambda x:x["assets"].pop("river-hero.jpg"))
    # Pack containing an extra text file must fail.
    approvals.write_text(json.dumps(registry))
    extra=root/"extra.zip"
    with zipfile.ZipFile(extra,"w") as z:
        for name,blob in blobs.items():z.writestr(name,blob)
        z.writestr("readme.txt","unexpected")
    try:mod.validate(extra,approvals,out)
    except mod.ValidationError:cases+=1
    else:raise AssertionError("extra file accepted")
    # Small image despite its own correct hash must fail dimensions.
    small=root/"small.zip"
    with zipfile.ZipFile(small,"w") as z:
        for name,blob in blobs.items():
            if name=="river-hero.jpg":
                b=io.BytesIO();Image.new("RGB",(1000,600)).save(b,format="JPEG");blob=b.getvalue()
                registry["assets"][name]["sha256"]=hashlib.sha256(blob).hexdigest()
            z.writestr(name,blob)
    approvals.write_text(json.dumps(registry))
    try:mod.validate(small,approvals,out)
    except mod.ValidationError:cases+=1
    else:raise AssertionError("undersized asset accepted")
    assert cases==5,cases
    print("PHOTO IMPORT CONTRACT PASS: 1 staged positive case, 5 negative cases; no website activation")
