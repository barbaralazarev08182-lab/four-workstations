# VQ2 Furniture Catalog Runtime Placement Validation Authorization

Date: 2026-09-05
Status: USER AUTHORIZATION / CURRENT NEXT STEP

## Purpose

Validate that the current Furniture Candidate Catalog works end-to-end with the existing in-game placement/build system before importing more furniture.

## Current candidate furniture set

At minimum, validation should cover representative items across size classes already registered:

- Flexform Sofa
- Accent Chair Leather Armchair
- Jysk PETERSBORG
- Armchair Modern
- Coffee Table
- Wood and rattan side table
- Night Stand A
- Nightstand

## Required runtime interactions

Reuse the existing placement/build system. Do not create a second furniture placement system unless a truly missing capability blocks validation.

The player must be able to:

1. Open/access the Furniture Candidate Catalog in-game.
2. Select a registered furniture prefab.
3. Spawn/place it into the room.
4. Move it while in placement mode.
5. Snap position to the existing 0.5m placement grid.
6. Rotate it in sensible fixed increments.
7. Confirm/place it.
8. Re-select an already placed furniture object.
9. Pick it up/reposition it.
10. Rotate it again and re-place it.
11. Prevent obvious invalid placement through floor/walls/major protected functional objects where the existing system already supports such blocking.

## Scope

This is a runtime usability/functional validation, not an art placement pass.

- Do not decide final furniture layout.
- Do not delete graybox furniture wholesale.
- Do not import more furniture during this task.
- Do not modify Sun/Atlas/Boundary/Far Sky/Retrieval/daylight systems.
- Keep current candidate scene only.

## Validation style

Use targeted validation only:

- Compile PASS
- Blocking runtime errors = 0
- One short PlayMode capture showing catalog select -> spawn -> move -> rotate -> place -> pick up -> reposition
- Report any actual placement-system blocker found and fix only what is necessary for this workflow

No repo-wide audit, broad static checks, evidence pack, commit, push, or production promotion.
