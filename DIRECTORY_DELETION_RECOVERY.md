# Directory deletion safety (businesses, churches and events)

The authoritative suppression and recovery file is `.github/deletion-ledger.json`.
A deletion publishes an atomic Git commit removing the public JSON row and
appending a ledger entry containing the source category, source ID (where any),
normalized key, UTC deletion time and complete former public record snapshot.
Records in this ledger are deliberately absent from public directory datasets.

The admin refuses publication if the ledger is missing, unreadable or changed
concurrently. The automated business batch importer refuses to run if the ledger
is unavailable and suppresses records by source ID or normalized business name,
city and province. Suppressed records are NEVER restored by importer replay.

Restore a record only after an explicit administrator decision: inspect its
snapshot in the ledger, remove that precise ledger entry and restore the original
record to the corresponding dataset **in a single atomic commit**, after checking
for an existing replacement and confirming the provenance and current status.
Do not delete the ledger wholesale. Older deletions made before this control
cannot be reconstructed automatically; Git history is the historical backup.

Pre-repair snapshot: `backup/pre-deletion-safety-2026-11-03`.
