# Delta Owl Eyes directory publication rules

These are standing rules for automated and assisted updates to the public business directory at `indigenous-businesses/businesses.json`.

## Publish sourced discoveries

- Publish each newly discovered, legitimate business record to the unified public JSON directory. Do not leave otherwise eligible businesses in a private staging file solely because the business has not yet verified its details.
- New records **must** use `verification_status: "unverified"`, `owner_confirmed: false`, and `contact_status: "not_contacted"`. Do not supply a verification date or method without real verification.
- Preserve publicly supplied business names, source URLs, contact details, and address or community. Preserve evidence separately for Indigenous ownership and physical on-reserve location. Neither implies the other.
- Do not assert current operating status, Indigenous ownership, or a precise on-reserve location merely because an old third-party directory lists the business. Clearly identify those claims as unverified.
- The public listing and profile pages already display the **Unverified** label and business correction/claim contact information.

## Duplicate handling

- Compare new discoveries to the *latest* published directory, not an older local copy.
- If the incoming record matches an existing business name or a **strong, evidence-backed alias**, **discard the incoming duplicate record**. Keep the existing canonical public record instead of adding another copy.
- Check normalized names, known aliases/abbreviations, public telephone numbers, addresses, websites, and First Nation/community together. A shared telephone number **alone** is not proof of duplication: separate businesses can share contact details.
- If two *already published* records are conclusively duplicates, preserve the better-supported/canonical listing and delete only the redundant published record. Do not erase a legitimate distinct business.
- Keep an audit of matches and exclusions so a business can request a correction or reinstatement.

## Verification and safety

- Unverified is a visible status, not a claim that the listing is active or owned by a particular person. Allow business representatives to correct or request removal of public listings.
- Publish only publicly sourced business-facing information; do not reveal private notes, private phone numbers, personal residential information not advertised as a business address, or credentials.
- Do not add age-restricted/regulated content listings or direct users toward dangerous products or services.

## Acceptance checks

1. Deduplicate against live JSON before writing; append only truly new records.
2. Preserve existing fields and records; do not overwrite verified statuses.
3. Confirm valid JSON, source URLs, required fields, and `unverified` flags.
4. Confirm GitHub Actions directory validation and deployment status and report what has actually succeeded.
