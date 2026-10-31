#!/usr/bin/env python3
"""Non-browser synthetic tests for the directory JSON additions logger."""
from importlib.util import spec_from_file_location, module_from_spec
import json
from pathlib import Path
import sys
from tempfile import TemporaryDirectory

repo = Path(__file__).resolve().parents[1]
spec = spec_from_file_location("directory_activity", repo / "scripts/record_directory_additions.py")
app = module_from_spec(spec)
spec.loader.exec_module(app)
with TemporaryDirectory() as tmp:
    root = Path(tmp)
    for relative in app.FILES.values():
        (root/relative).parent.mkdir(parents=True,exist_ok=True)
    (root/"data").mkdir(exist_ok=True)
    (root/"indigenous-businesses/businesses.json").write_text(json.dumps([{
        "name":"Example Shop","source_id":"TEST-1","city":"Example","province":"Ontario",
        "community":"Example First Nation","source_url":"https://example.org/shop"
    }]),encoding="utf8")
    (root/"indigenous-churches/churches.json").write_text(json.dumps([{
        "name":"Example Church","province":"Ontario","reserve":"Example First Nation",
        "source":"https://example.org/church"
    }]),encoding="utf8")
    (root/"data/community-events.json").write_text(json.dumps([{
        "title":"Example Event","start_date":"2026-11-01","city":"Example",
        "province":"Ontario","category":"Community gathering","status":"verified",
        "url":"https://example.org/event"
    }]),encoding="utf8")
    log=root/"data/directory-updates.json"
    log.write_text('{"version":1,"runs":[]}',encoding="utf8")
    app.ROOT=root
    app.LOG=log
    app.old_rows=lambda _base,_path: []
    sys.argv=["record_directory_additions.py","--base","a"*40,"--run","b"*40]
    app.main()
    first=json.loads(log.read_text(encoding="utf8"))
    assert len(first["runs"])==1
    assert {key:len(rows) for key,rows in first["runs"][0]["additions"].items()} == {
        "businesses":1,"churches":1,"events":1}
    assert first["runs"][0]["additions"]["events"][0]["date"]=="2026-11-01"
    assert first["runs"][0]["additions"]["businesses"][0]["status"]=="Unverified"
    assert first["runs"][0]["additions"]["churches"][0]["place"]=="Example First Nation, Ontario"
    app.main()
    second=json.loads(log.read_text(encoding="utf8"))
    assert second==first, "Repeated runs must not re-announce old records"
    changed=json.loads((root/"data/community-events.json").read_text(encoding="utf8"))
    changed.append({"title":"Second Event","start_date":"2026-11-02",
        "city":"Example","province":"Ontario","status":"verified",
        "url":"https://example.org/second"})
    (root/"data/community-events.json").write_text(json.dumps(changed),encoding="utf8")
    app.main()
    third=json.loads(log.read_text(encoding="utf8"))
    assert len(third["runs"])==2
    assert list(third["runs"][0]["additions"])==["events"]
    assert len(third["runs"][0]["additions"]["events"])==1
print("PASS: all three feeds, deduplication, incremental runs and published event dates")
