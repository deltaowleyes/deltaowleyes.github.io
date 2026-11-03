"""Tests for the publish-as-a-pair news pipeline. Never fetch live sources during tests."""
import datetime as dt
import json
import pathlib
import tempfile
import unittest
from check_news_language import validate, approved, validate_repository
from publish_approved_news import ingest, TODAY

class PairedNewsTests(unittest.TestCase):
    def test_all_real_articles_have_both_versions_and_switch(self):
        self.assertGreaterEqual(validate_repository(require_pages=True),14)


    def test_recording_queue_keeps_privacy_consent(self):
        queue=(pathlib.Path(__file__).resolve().parents[1]/"news/scripts/index.html").read_text(encoding="utf-8")
        self.assertIn("privacy-consent.css",queue)
        self.assertIn("privacy-consent.js",queue)

    def test_missing_version_fails(self):
        page='<article><p class="meta">2026-11-03</p><h2>Example published news headline</h2><p><a href="https://example.org">Source</a></p></article>'
        errors=validate(page,{"version":"9.0","articles":{}},set())
        self.assertTrue(any("missing Rez" in e for e in errors))

    def test_review_must_be_complete_and_not_future(self):
        r={"status":"approved","reviewed_by":"News editor","reviewed_at":TODAY.isoformat(),
           "sources_checked":True,"claim_parity_checked":False}
        self.assertFalse(approved(r,TODAY))
        r["claim_parity_checked"]=True
        self.assertTrue(approved(r,TODAY))
        r["reviewed_at"]=(TODAY+dt.timedelta(days=1)).isoformat()
        self.assertFalse(approved(r,TODAY))

    def fixture(self,folder):
        root=pathlib.Path(folder)
        news=root/"news"
        (news/"approved").mkdir(parents=True)
        (news/"index.html").write_text("<html><main><h1>News</h1></main></html>",encoding="utf-8")
        (news/"rez-slang-9.json").write_text('{"version":"9.0","articles":{}}',encoding="utf-8")
        (news/"rez-slang-9-baseline.json").write_text("[]",encoding="utf-8")
        item={
            "date":TODAY.isoformat(),"context":"TRC education context: Call #62",
            "headline":"Example Indigenous education funding announcement",
            "professional_sections":[
                {"label":"News","text":"This is a fictional example used only for testing the news system."},
                {"label":"Accountability","text":"What outcomes will be reported after this announced work? No outcomes are yet established."}],
            "sources":[{"title":"Example official source","url":"https://example.org/announcement"}],
            "rez_headline":"Education funding: here's what we know so far",
            "rez_sections":[
                {"label":"News","text":"Boozhoo. This is a fictional training example, not an actual news event."},
                {"label":"Accountability","text":"Eya’, what are the real results? We will need facts before drawing conclusions."}],
            "editorial_review":{"status":"approved","reviewed_by":"Delta Owl Eyes editor",
                                "reviewed_at":TODAY.isoformat(),"sources_checked":True,"claim_parity_checked":True}
        }
        path=news/"approved"/"example-indigenous-education-funding-announcement.json"
        path.write_text(json.dumps(item),encoding="utf-8")
        return root,path,item

    def test_pair_creation_and_idempotence(self):
        with tempfile.TemporaryDirectory() as tmp:
            root,path,item=self.fixture(tmp)
            self.assertEqual(ingest(root),1)
            self.assertEqual(ingest(root,check=True),0)
            self.assertEqual(ingest(root),0)
            index=(root/"news/index.html").read_text(encoding="utf-8")
            data=json.loads((root/"news/rez-slang-9.json").read_text(encoding="utf-8"))
            self.assertEqual(validate(index,data,set(),TODAY),[])

    def test_unapproved_does_not_modify_public_page(self):
        with tempfile.TemporaryDirectory() as tmp:
            root,path,item=self.fixture(tmp)
            item["editorial_review"]["claim_parity_checked"]=False
            path.write_text(json.dumps(item),encoding="utf-8")
            before=(root/"news/index.html").read_text(encoding="utf-8")
            with self.assertRaisesRegex(ValueError,"editorial review"):
                ingest(root)
            self.assertEqual((root/"news/index.html").read_text(encoding="utf-8"),before)

    def test_non_https_source_blocked(self):
        with tempfile.TemporaryDirectory() as tmp:
            root,path,item=self.fixture(tmp)
            item["sources"][0]["url"]="javascript:alert(1)"
            path.write_text(json.dumps(item),encoding="utf-8")
            with self.assertRaisesRegex(ValueError,"HTTPS"):
                ingest(root)
