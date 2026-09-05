# VQ2 Codex Furniture Identity Resolution Instruction Standard

Date: 2026-09-05
Status: USER WORKFLOW REQUIREMENT

When furniture shortlist items have ambiguous or duplicated titles, Codex instructions must be explicit enough to resolve identity rather than stopping early.

Required resolution order for ambiguous shortlist items:

1. Use the user's existing BlenderKit bookmarks / saved collection / authenticated history as the source set. Do not global-search replacement assets.
2. For each ambiguous shortlist title, enumerate every candidate in that saved set with asset ID, author, thumbnail, and title.
3. Compare candidate thumbnails against the original shortlist screenshot / saved visual reference, not title alone.
4. If one candidate visually matches, treat that asset ID as resolved and continue the normal download/import/catalog pipeline.
5. If more than one candidate still remains visually plausible, create one compact contact sheet showing those candidates with asset IDs and ask the user to choose only among those exact saved candidates.
6. Do not return `identity unresolved` merely because duplicate titles exist before performing visual thumbnail disambiguation.
7. Do not substitute unrelated furniture.

For every resolved floor-standing medium furniture asset:
- verify CAN_DOWNLOAD=True and HTTP 200,
- preserve source/license metadata,
- normalize up axis, standing orientation, floor contact, pivot and collider,
- preserve uniform scale,
- measure W x D x H,
- compute 0.5m-grid hard footprint,
- create/register prefab in the existing placement catalog,
- leave final in-room position and rotation to the user.

Validation remains minimal: Compile PASS and blocking runtime errors only. No repo-wide audit, unrelated static checks, commit, push, or production promotion.
