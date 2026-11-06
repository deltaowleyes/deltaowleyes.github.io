#!/usr/bin/env python3
"""Offline tests for the Education editorial policy; no GitHub credentials required."""
from __future__ import annotations
from copy import deepcopy
import json
from pathlib import Path
from types import SimpleNamespace
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from scripts import education_editorial as ed

class EditorialTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sample=json.loads((ROOT/"data/education-resources.json").read_text(encoding="utf-8"))[0]

    def test_current_resource_schema_accepted(self):
        for item in json.loads((ROOT/"data/education-resources.json").read_text(encoding="utf-8")):
            self.assertEqual(ed.validate_resource(item),item)

    def test_no_extra_personal_fields_or_unsafe_markup(self):
        row=deepcopy(self.sample)
        row["requester_email"]="private@example.org"
        with self.assertRaises(ValueError):ed.validate_resource(row)
        row=deepcopy(self.sample)
        row["notice"]="<script>alert(1)</script>"
        with self.assertRaises(ValueError):ed.validate_resource(row)
        row=deepcopy(self.sample)
        row["description"]="contact private@example.org"
        with self.assertRaises(ValueError):ed.validate_resource(row)

    def test_https_public_provider_required(self):
        allowed="https://www.example.org/learning"
        self.assertTrue(ed.canonical(allowed))
        for value in ("http://example.org", "https://localhost/test",
                      "https://127.0.0.1/x", "https://192.168.0.1/x",
                      "https://example.org#secret", "https://user:password@example.org/x"):
            with self.subTest(value=value),self.assertRaises(ValueError):
                ed.canonical(value)

    def test_indigenous_only_not_auto_assigned(self):
        row=deepcopy(self.sample)
        row["eligibility"]="not-applicable"
        with self.assertRaises(ValueError):ed.validate_resource(row)
        row["eligibility"]="check-provider"
        self.assertEqual(ed.validate_resource(row),row)

    def test_survivor_content_advisory(self):
        row=deepcopy(self.sample)
        row["category"]="survivor-stories"
        row["notice"]="Check registration"
        with self.assertRaises(ValueError):ed.validate_resource(row)

    def test_suppressed_id_or_url_never_reimported(self):
        tomb=[{"id":self.sample["id"],"url":self.sample["url"],
               "reason":"cultural-access","removed_on":"2026-11-06"}]
        with self.assertRaises(ValueError):ed.assert_not_suppressed(self.sample,tomb)
        other=deepcopy(self.sample);other["id"]="another-unique-id"
        with self.assertRaises(ValueError):ed.assert_not_suppressed(other,tomb)
        other["url"]="https://example.org/new";other["source_url"]=other["url"]
        ed.assert_not_suppressed(other,tomb)

    def test_editorial_write_fails_closed_without_staff_review(self):
        args=SimpleNamespace(action="remove",write=False,confirm_source_reviewed=True,
            ticket=None,resource_id=self.sample["id"],reason="withdrawn")
        with patch.object(ed,"verify_reviewer") as authorize:
            with self.assertRaises(PermissionError):ed.public_edit(args)
            authorize.assert_not_called()

    def test_github_write_role_enforced(self):
        from subprocess import CompletedProcess
        def gh(args,**kwargs):
            if args[-1]==".login":return CompletedProcess(args,0,stdout="test-staff\n")
            return CompletedProcess(args,0,stdout="read\n")
        with patch.object(ed.subprocess,"run",side_effect=gh):
            with self.assertRaises(PermissionError):
                ed.verify_reviewer()
        with patch.object(ed.subprocess,"run",side_effect=FileNotFoundError):
            with self.assertRaises(PermissionError):
                ed.verify_reviewer()

    def test_writes_refused_on_main_or_dirty_catalogue(self):
        from subprocess import CompletedProcess
        def git_main(args,**kwargs):
            if "branch" in args:return CompletedProcess(args,0,stdout="main\\n")
            if "--show-toplevel" in args:return CompletedProcess(args,0,stdout=str(ROOT)+"\\n")
            return CompletedProcess(args,0,stdout="")
        with patch.object(ed.subprocess,"run",side_effect=git_main):
            with self.assertRaises(PermissionError):ed.verify_review_branch()

        def git_dirty(args,**kwargs):
            if "branch" in args:return CompletedProcess(args,0,stdout="feature/education-test\\n")
            if "--show-toplevel" in args:return CompletedProcess(args,0,stdout=str(ROOT)+"\\n")
            return CompletedProcess(args,0,stdout=" M data/education-resources.json\\n")
        with patch.object(ed.subprocess,"run",side_effect=git_dirty):
            with self.assertRaises(PermissionError):ed.verify_review_branch()

    def test_private_queue_dedupe_and_no_personal_data(self):
        with tempfile.TemporaryDirectory() as folder:
            queue=Path(folder)/"staff"/"queue.json"
            with patch.object(ed,"QUEUE",queue):
                args=SimpleNamespace(kind="suggest",resource_id=None,url="https://example.org/learning")
                ed.intake(args)
                contents=ed.read_queue()
                self.assertEqual(len(contents),1)
                self.assertEqual(contents[0]["status"],"pending")
                self.assertNotIn("email",json.dumps(contents).lower())
                with self.assertRaises(ValueError):ed.intake(args)
                self.assertTrue(queue.exists())
                if sys.platform!="win32":
                    self.assertEqual(queue.stat().st_mode & 0o777,0o600)

    def test_one_authorized_editor_needs_no_second_reviewer_or_ticket(self):
        with patch.object(ed,"verify_reviewer",return_value="owner"), \
             patch.object(ed,"verify_review_branch",return_value="fix/education-owner"), \
             patch.object(ed,"read_json",side_effect=[[deepcopy(self.sample)],[]]), \
             patch.object(ed,"save_public") as save, \
             patch.object(ed,"resolve_ticket") as resolve:
            args=SimpleNamespace(action="remove",resource_id=self.sample["id"],
                 reason="rights-holder-request",write=True,
                 confirm_source_reviewed=True,ticket=None)
            ed.public_edit(args)
            cat,ledger=save.call_args.args
            self.assertEqual(cat,[])
            self.assertEqual(len(ledger),1)
            self.assertEqual(ledger[0]["id"],self.sample["id"])
            resolve.assert_called_once_with(None)

    def test_optional_private_ticket_must_match_edit_type(self):
        with patch.object(ed,"verify_reviewer",return_value="owner"), \
             patch.object(ed,"verify_review_branch",return_value="fix/education-owner"), \
             patch.object(ed,"read_queue",return_value=[{"ticket":"abc012abc012","status":"pending","kind":"suggest"}]), \
             patch.object(ed,"save_public") as save:
            args=SimpleNamespace(action="remove",resource_id=self.sample["id"],
                 reason="withdrawn",write=True,confirm_source_reviewed=True,ticket="abc012abc012")
            with self.assertRaises(ValueError):
                ed.public_edit(args)
            save.assert_not_called()

    def test_authorized_remove_stages_generic_tombstone_only(self):
        with patch.object(ed,"verify_reviewer",return_value="approvedstaff"), \
             patch.object(ed,"verify_review_branch",return_value="feature/education-test"), \
             patch.object(ed,"read_json",side_effect=[[deepcopy(self.sample)],[]]), \
             patch.object(ed,"read_queue",return_value=[{"ticket":"abcdef123456","status":"pending"}]), \
             patch.object(ed,"save_public") as save, \
             patch.object(ed,"resolve_ticket"):
            args=SimpleNamespace(action="remove",resource_id=self.sample["id"],reason="rights-holder-request",
                 write=True,confirm_source_reviewed=True,ticket="abcdef123456")
            ed.public_edit(args)
            catalogue,tombstones=save.call_args.args
            self.assertEqual(catalogue,[])
            self.assertEqual(len(tombstones),1)
            self.assertEqual(set(tombstones[0]),{"id","url","reason","removed_on"})
            self.assertNotIn("requester",json.dumps(tombstones))

    def test_no_secret_public_web_submission(self):
        html=(ROOT/"education/index.html").read_text(encoding="utf-8")
        self.assertIn('id="education-feedback"',html)
        self.assertIn("mailt",html)
        self.assertNotIn('action="https://',html)
        self.assertNotIn('name="requester_email"',html)

if __name__=="__main__":
    unittest.main(verbosity=2)
