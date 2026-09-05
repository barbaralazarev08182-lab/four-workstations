# VQ2 Furniture Catalog — Unresolved Identity Resolution Policy

Date: 2026-09-05
Status: USER WORKFLOW / CATALOG RESOLUTION NOTE

## Current catalog success
- Accent Chair Leather Armchair: imported and cataloged.
- Jysk PETERSBORG: imported and cataloged.
- Night Stand A: imported and cataloged.

## Resolved from web research
- `Wood and rattan side table` has an exact BlenderKit page matching the shortlist title:
  - Asset ID: `a200643a-5f7a-4ec5-918d-8c3fb724603b`
  - Title: `Wood And Rattan Side Table`
  - Public page currently marks it Free.
  - This is the BOHEME / SWEEEK-inspired Scandinavian rattan side table by Joris LM.

## Still ambiguous
- `Armchair Modern`: multiple exact/near-exact Free assets exist.
- `Coffee Table`: multiple exact-title assets exist.
- `Nightstand`: multiple exact-title assets exist.

## Resolution rule
Before asking the user to identify ambiguous shortlist items manually, Codex should first use the currently authenticated BlenderKit account to inspect bookmarks / saved assets / account-level search results and match exact shortlist titles and thumbnails where possible.

Do not guess among multiple same-title assets. Do not substitute unrelated alternatives.

If an item cannot be uniquely resolved from authenticated account data, leave it unresolved and continue with uniquely resolved catalog items.
