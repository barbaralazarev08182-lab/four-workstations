# VQ2 Furniture Runtime Placement + Persistence Baseline PASS

Date: 2026-09-05
Status: ACCEPTED CANDIDATE BASELINE

## Result
The Furniture Candidate Catalog + existing runtime placement system now supports the intended player-driven furnishing workflow.

PASS:
- Catalog open/access
- Select registered furniture
- Spawn / ghost preview
- Move
- 0.5m grid snap
- 90-degree rotate
- Confirm placement
- Re-select placed furniture
- Pick up
- Reposition / rotate / place again
- Save
- Reload restore
- Duplicate prevention
- Reposition after reload
- Compile
- Blocking runtime errors = 0

## Runtime blocker fixed
Two prefab runtime components previously appeared as Missing Script due to script filename / class-name mismatch. The implementation was split into matching files:
- FurnitureCandidateBuildable.cs
- PlacedFurnitureRecord.cs

All 8 catalog prefabs were rebuilt. Follow-up PlayMode validation passed 1/1 with zero Missing Script instances.

## Persistence scope
The current persistence layer preserves furniture catalog/prefab identity and placement transform state sufficiently to restore player-authored layouts across reloads without duplication. This is intentionally a furniture-layout persistence layer, not authorization to expand into a full-game save system.

## Workflow decision
The medium floor-standing furniture workflow is now player-driven:
- Codex prepares/imports/registers furniture as valid catalog prefabs.
- The user decides final position and rotation in-game using the existing placement system.
- Graybox furniture may remain as reference until the user replaces it through actual placement.

Do not reopen or redesign this placement/persistence baseline unless new runtime evidence shows a blocker.
