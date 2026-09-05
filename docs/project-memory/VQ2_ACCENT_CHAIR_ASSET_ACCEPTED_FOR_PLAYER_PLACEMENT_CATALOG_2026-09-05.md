# VQ2 Accent Chair Asset Accepted for Player Placement Catalog

Date: 2026-09-05
Status: USER-DRIVEN FURNITURE PLACEMENT WORKFLOW / ASSET ACCEPTED

## Asset
- Accent Chair Leather Armchair
- BlenderKit Asset ID: `0ee183c4-3a75-4732-91e3-5fe5eb82c629`
- Download permission: `CAN_DOWNLOAD=True`, HTTP 200
- Size: W 0.951436m x D 0.775414m x H 0.946017m
- Uniform Scale: 1,1,1
- Upright / floor contact: valid
- Grid footprint: 2 x 2 cells at 0.5m per cell

## Decision
The asset itself is accepted as a usable furniture candidate for the player-facing placement catalog.

Its temporary scene placement is NOT treated as a final Human Visual placement decision, because the active workflow has changed: medium floor-standing furniture should be imported/standardized/registered first, and the user will place and rotate furniture in-game using the existing placement system.

## Workflow
- Do not stop for per-item placement review unless an asset has a visual/import defect.
- Do not choose final room positions or rotations for the user.
- Keep graybox layout references until the user replaces them through gameplay placement.
- Continue preparing remaining eligible medium floor-standing shortlist furniture as placeable prefabs.
- Failed authorization or unresolved shortlist identity: skip and report; do not substitute unrelated assets.
- No production promotion without explicit authorization.
