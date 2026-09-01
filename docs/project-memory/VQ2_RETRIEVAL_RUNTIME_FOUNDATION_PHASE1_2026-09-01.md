# VQ2 Retrieval Runtime Foundation — Phase 1

> Date: 2026-09-01
> Status: ACTIVE IMPLEMENTATION DIRECTION

Gate 3 is closed. This phase begins the first playable Retrieval device prototype without reopening room/world visuals.

## Phase 1 goal

Implement only the physical chain:

`Station -> Reel -> Runtime Tether -> Orb`

The first prototype must support:

- Orb stored/docked;
- deploy outward;
- hold at a target distance;
- retrieve smoothly;
- return to dock;
- continuous runtime tether between `Tether_GuideTip` and `Orb_TetherAttach`;
- restrained slack/tension visual response;
- basic proof that upward, downward, horizontal, and diagonal directions are not structurally blocked.

## Implementation direction

Use the existing accepted Station/Orb assets and sockets. Do not author a modeled rope.

Preferred tether implementation remains `LineRenderer` or equivalent procedural spline/curve. Do not begin with a chain of rigidbodies.

A minimal state machine is sufficient for Phase 1:

- Stored
- Deploying
- Holding
- Retrieving
- Docking

Debug/test controls are acceptable in this phase. They are not final player UX.

## Locked production baseline

Do not modify the Gate 3 accepted visual state:

- Rest Edge seats;
- Retrieval Station scale/position/Y=180/edge placement;
- Retrieval Orb accepted world size and docking relationship;
- Atlas;
- room cleanup;
- materials;
- source FBX files.

## Out of scope

Do not implement yet:

- attraction logic;
- loot/content tables;
- Returning Piece behavior;
- recovered creatures/objects;
- economy;
- UI-heavy fishing systems;
- QTEs;
- failure/stability systems;
- full rope collision physics;
- mesh reduction or visual redesign.

## Validation target

Provide one short playable/testable prototype where the Orb can deploy, remain connected by a stable tether, and retrieve/dock repeatedly without transform drift, duplication, orphaned renderers, or source-asset mutation.

Do not promote or commit until the prototype is reviewed.