"""Regression tests for new QPrompt 10.1 intake. No network access required."""
import copy
import datetime
import pathlib
import sys
import unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build_news import validate_qprompt

SCRIPT = """LEAH: Boozhoo. This is a fictional QPrompt test, not a real news report.
CHRIS: We are checking the validator, not reporting any actual event.

[GROK VIDEO: EDUCATION — 6 SECONDS]
LEAH: The source must support every factual statement before publication.
CHRIS: We keep the script clear, and the source details separate.

[GROK VIDEO: ACCOUNTABILITY — 6 SECONDS]
LEAH: What evidence is available, and what remains unverified?
CHRIS: That question is important to our reporting and our readers.
"""
def record(date="2026-11-09"):
    return {"id":"test-record","date":date,"qprompt_format":"10.1","script":SCRIPT}

class QPromptTests(unittest.TestCase):
    def check_bad(self, record, pattern):
        with self.assertRaisesRegex(ValueError, pattern):
            validate_qprompt(record, "fixture.json")

    def test_valid(self):
        validate_qprompt(record(), "fixture.json")

    def test_line_too_long(self):
        r=record()
        r["script"] += "LEAH: " + "a"*101
        self.check_bad(r,"100 characters")

    def test_missing_format_cannot_bypass(self):
        r=record()
        del r["qprompt_format"]
        self.check_bad(r,"requires qprompt_format")

    def test_bad_speaker(self):
        r=record()
        r["script"]=r["script"].replace("CHRIS: We are", "CHRIS — We are")
        self.check_bad(r,"legacy or empty speaker")

    def test_missing_cues(self):
        r=record()
        r["script"]="\n".join(x for x in SCRIPT.split("\n") if not x.startswith("[GROK VIDEO:"))
        self.check_bad(r,"Grok")

    def test_malformed_cue(self):
        r=record()
        r["script"]=SCRIPT.replace("— 6 SECONDS]", "— 8 SECONDS]")
        self.check_bad(r,"Grok")

    def test_prohibited_expression(self):
        r=record()
        r["script"]=SCRIPT.replace("Boozhoo", "Eya’")
        self.check_bad(r,"prohibited")

    def test_legacy_unchanged(self):
        r=record("2026-10-26")
        del r["qprompt_format"]
        r["script"]="CHRIS — historical recording, preserved"
        self.check_bad(r,"requires qprompt_format")

    def test_real_legacy_blob_exempt(self):
        import json
        path = pathlib.Path(__file__).resolve().parents[1] / "news/updates/2026-10-26-cree-nations-miyoyawin-centre.json"
        validate_qprompt(json.loads(path.read_text(encoding="utf-8")), path)

    def test_backdated_new_record_not_exempt(self):
        r=record("2026-10-26")
        del r["qprompt_format"]
        self.check_bad(r,"requires qprompt_format")

    def test_new_date_not_exempt(self):
        r=record("2026-11-10")
        del r["qprompt_format"]
        self.check_bad(r,"requires qprompt_format")

if __name__ == "__main__":
    unittest.main()
