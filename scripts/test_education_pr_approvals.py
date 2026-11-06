#!/usr/bin/env python3
"""Offline fixture tests for GitHub-authoritative Education review policy."""
from __future__ import annotations
from pathlib import Path
import sys
import unittest
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from scripts import check_education_pr_approvals as gate

HEAD="abc123"
def pr():return {"head":{"sha":HEAD},"user":{"login":"publisher"}}
def rev(user,state="APPROVED",commit_id=HEAD,at="2026-11-06T16:00:00Z"):
    return {"user":{"login":user},"state":state,"commit_id":commit_id,"submitted_at":at}

class GateTests(unittest.TestCase):
    def test_two_distinct_current_write_approvers(self):
        reviewers=[rev("alice"),rev("bob"),rev("publisher")]
        got=gate.eligible(pr(),reviewers,lambda u:"write")
        self.assertEqual(got,["alice","bob"])

    def test_author_and_duplicate_review_do_not_count(self):
        reviewers=[rev("publisher"),rev("alice"),rev("ALICE")]
        self.assertEqual(len(gate.eligible(pr(),reviewers,lambda u:"admin")),1)

    def test_old_head_approvals_do_not_count(self):
        reviewers=[rev("alice",commit_id="old"),rev("bob")]
        self.assertEqual(gate.eligible(pr(),reviewers,lambda u:"write"),["bob"])

    def test_dismissed_or_changes_requested_no_longer_count(self):
        reviewers=[rev("alice"),rev("alice","DISMISSED",at="2026-11-06T16:30:00Z"),
                   rev("bob"),rev("bob","CHANGES_REQUESTED",at="2026-11-06T16:31:00Z")]
        self.assertEqual(gate.eligible(pr(),reviewers,lambda u:"write"),[])

    def test_read_only_accounts_never_count(self):
        reviewers=[rev("alice"),rev("bob")]
        self.assertEqual(gate.eligible(pr(),reviewers,lambda u:"read"),[])

    def test_maintain_is_permitted_as_github_write_equivalent(self):
        reviewers=[rev("alice"),rev("bob")]
        self.assertEqual(len(gate.eligible(pr(),reviewers,lambda u:"maintain")),2)

    def test_comments_are_not_approvals(self):
        reviewers=[rev("alice","COMMENTED"),rev("bob")]
        self.assertEqual(gate.eligible(pr(),reviewers,lambda u:"write"),["bob"])

if __name__=="__main__":
    unittest.main(verbosity=2)
