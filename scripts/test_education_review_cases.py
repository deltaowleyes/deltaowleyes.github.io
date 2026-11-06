#!/usr/bin/env python3
"""Offline deterministic review-case security regression tests."""
from __future__ import annotations
from copy import deepcopy
from datetime import datetime, timezone
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from scripts import education_editorial as ed
from scripts import education_review_cases as cases

TICKET="abc012abc012"
def sample(kind="remove"):
    return {"ticket":TICKET,"kind":kind,"resource_id":"nctr-archives",
            "public_source_url":None,"status":"pending","received_at":"2026-11-06T15:00:00+00:00"}

def approval(login,decision="approve"):
    return {"github_login":login,"decision":decision,"reviewed_at":"2026-11-06T15:05:00+00:00"}

class CaseReviewTests(unittest.TestCase):
    def test_existing_queue_without_reviews_is_accepted(self):
        self.assertEqual(cases.validate_queue([sample()])[0]["ticket"],TICKET)

    def test_contact_details_and_secret_fields_refused(self):
        for field in ("email","reporter_name","story","attachments","raw_testimony","private_notes"):
            item=sample();item[field]="not allowed"
            with self.subTest(field=field),self.assertRaises(ValueError):
                cases.validate_queue([item])

    def test_same_reviewer_twice_is_rejected(self):
        row=sample();row["reviews"]=[approval("person-A"),approval("PERSON-a")]
        with self.assertRaises(ValueError):cases.validate_queue([row])

    def test_outside_commit_queue_not_enough_for_publishing(self):
        with patch.object(cases,"load",return_value=[sample()]):
            with self.assertRaises(PermissionError):
                cases.require_two_reviewers(TICKET,"remove")
            with self.assertRaises(PermissionError):
                cases.require_two_reviewers(None,"remove")
            with self.assertRaises(PermissionError):
                cases.require_two_reviewers(TICKET,"approve")

    def test_two_independent_approved_reviewers_require_live_permissions(self):
        item=sample();item["reviews"]=[approval("writer1"),approval("writer2")]
        with patch.object(cases,"load",return_value=[item]),patch.object(cases,"permission_for",return_value="write") as check:
            self.assertEqual(cases.require_two_reviewers(TICKET,"remove"),["writer1","writer2"])
            self.assertEqual(check.call_count,2)

    def test_rejected_case_never_mutates(self):
        item=sample();item["reviews"]=[approval("writer1"),approval("writer2","reject"),approval("writer3")]
        with patch.object(cases,"load",return_value=[item]):
            with self.assertRaises(PermissionError):
                cases.require_two_reviewers(TICKET,"remove")

    def test_permission_revocation_fails_closed(self):
        item=sample();item["reviews"]=[approval("writer1"),approval("writer2")]
        with patch.object(cases,"load",return_value=[item]),patch.object(cases,"permission_for",side_effect=["write","read"]):
            with self.assertRaises(PermissionError):
                cases.require_two_reviewers(TICKET,"remove")

    def test_one_attestation_per_account(self):
        item=sample()
        with patch.object(ed,"verify_reviewer",return_value="writer1"), \
             patch.object(cases,"load",return_value=[item]), \
             patch.object(ed,"private_write") as write:
            cases.review(TICKET,"approve",True)
            self.assertEqual(len(item["reviews"]),1)
            self.assertEqual(set(item["reviews"][0]),{"github_login","decision","reviewed_at"})
            self.assertTrue(write.called)
            with self.assertRaises(ValueError):
                cases.review(TICKET,"approve",True)

    def test_attestation_requires_source_check(self):
        with patch.object(ed,"verify_reviewer") as reviewer:
            with self.assertRaises(PermissionError):
                cases.review(TICKET,"approve",False)
            reviewer.assert_not_called()

    def test_untrusted_public_repo_bundle_path_is_refused(self):
        with self.assertRaises(ValueError):
            cases.private_path(ROOT/"data"/"public-case.json")

    def test_seal_requires_two_distinct_full_fingerprints(self):
        with self.assertRaises(ValueError):
            cases.seal(Path("/tmp/testcase.gpg"),["A"*40])
        with self.assertRaises(ValueError):
            cases.seal(Path("/tmp/testcase.gpg"),["A"*40,"a"*40])
        with self.assertRaises(ValueError):
            cases.seal(Path("/tmp/testcase.gpg"),["A"*32,"B"*40])

    def test_validate_queue_incoming_merge_not_contact_pii(self):
        row=sample()
        row["reviews"]=[approval("writer1")]
        self.assertEqual(cases.validate_queue([row])[0]["reviews"][0]["github_login"],"writer1")
        wrong=deepcopy(row);wrong["reviews"][0]["decision"]="unknown"
        with self.assertRaises(ValueError):cases.validate_queue([wrong])

if __name__=="__main__":
    unittest.main(verbosity=2)
