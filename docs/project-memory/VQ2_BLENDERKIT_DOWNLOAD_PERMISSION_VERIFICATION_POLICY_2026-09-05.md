# VQ2 BlenderKit Download Permission Verification Policy — 2026-09-05

## Context
The selected `Lapis Sofa by Amura` asset page publicly displayed `Free`, but the authenticated BlenderKit API returned `CAN_DOWNLOAD=False` and HTTP 402 with `Must have full plan to download this asset`.

## Decision
Do not rely on public BlenderKit page badges alone when selecting furniture for implementation.

Before any BlenderKit asset is treated as an actionable furniture candidate, Codex must first verify the authenticated account/API download permission for the exact asset ID.

If authenticated permission says Full Plan / cannot download:
- do not bypass or scrape around the restriction;
- do not modify Unity;
- do not spend time installing/importing the asset;
- move to another item from the user's already-selected shortlist unless the user explicitly chooses to purchase/provide the blocked asset.

## Current sofa sequence
`Lapis Sofa by Amura` remains part of the user's shortlist/reference direction, but it is blocked for implementation under the current BlenderKit account.

Next implementation candidate should be another sofa already present in the user's shortlist. `Bloke Sofa` is the next candidate to test. Public BlenderKit pages currently mark it Free, but Codex must verify authenticated `CAN_DOWNLOAD` before proceeding.

Known Bloke Sofa asset ID to test first:
`3819ae9a-26e3-40aa-9ba5-593faed9d707`

## Furniture workflow
For each BlenderKit furniture item:
1. Verify exact asset ID and authenticated download permission.
2. Only if `CAN_DOWNLOAD=True`, acquire source asset.
3. Measure true dimensions and preserve uniform scale.
4. Compute 0.5 m grid occupancy and use clearance.
5. Place only that one item in the candidate scene.
6. Human Visual Review before moving to the next item.

No batch downloads. No public-page-only assumption of availability.