# VQ2 Retrieval Runtime Foundation — Phase 1

> Date: 2026-09-01
> Status: ACTIVE IMPLEMENTATION DIRECTION / HUMAN VISUAL CORRECTION

Gate 3 is closed. This phase begins the first playable Retrieval device prototype without reopening room/world visuals.

## Phase 1 goal

Implement the physical chain:

`Station Guide Tip -> Powered Tether -> Orb`

The first prototype must support:

- Orb stored in the Station's front circular basket/cradle when unused;
- deploy outward from that basket;
- hold at a target distance;
- retrieve smoothly;
- return into the same front basket/cradle;
- continuous runtime tether between the **physical end of the Station guide arm** and `Orb_TetherAttach`;
- restrained slack/tension visual response;
- basic proof that upward, downward, horizontal, and diagonal directions are not structurally blocked.

## Human visual correction — tether endpoint

The current Phase 1 prototype visually connected the tether from the wrong Station area.

The authoritative relationship is:

> The tether exits from the **very end of the long guide arm / rod**, at the visible terminal guide head, and then connects directly to the Orb.

Do not connect the free tether from the Station body, yaw assembly, reel housing, or an approximate point near the arm base.

If the existing `Tether_GuideTip` transform is not actually located at the visible terminal guide head, create or reposition a runtime/socket transform so it is exactly aligned to that visible rod-end connection point. This may not alter visible Station geometry.

## Powered-tether meaning

The tether is not primarily a fishing line that passively hangs the Orb.

It functions more like a **powered umbilical / electrical cable**:

- it supplies the Orb with the energy required to remain active beyond the room boundary;
- the Orb is an active moving device, not a passive weight suspended by gravity;
- while powered, the Orb may move upward, downward, horizontally, or diagonally;
- the cable follows and limits reachable distance, but should not force the Orb into an ordinary pendulum/fishing-bobber behavior;
- the intended maximum cable length must eventually be long enough for the Orb to travel beyond the player's visible screen into the Outside space (temporarily referred to as the "universe").

For the current prototype, the cable may still use a procedural LineRenderer curve, but its behavior should visually read as a flexible powered cable rather than a gravity-dominated fishing line.

## Long-reach cable direction — LOCKED FOR FUTURE

The current `18 m` maximum cable length is only a prototype/debug value and is **not** the final design limit.

The production system must support a configurable cable length large enough for the Orb to travel fully outside the player's current screen view and continue operating beyond the visible room frame.

Implementation should therefore avoid architecture that assumes a short in-room tether. Cable sampling, deployment state, retrieval state, and maximum-reach logic must remain stable at much larger distances.

Do not force a final numeric maximum yet; keep the maximum reach configurable.

## Guide arm articulation — FUTURE DIRECTION

The long guide arm may later become an active mechanical part of the Retrieval Station.

Intended future motion:

- vertical aiming / pitch: arm can raise and lower;
- horizontal aiming / yaw: arm can sweep left and right;
- the terminal guide head remains the cable origin while the arm moves.

Do not force this motion in Phase 1 if the current imported mesh/pivots are not suitable. Do not destructively alter the Station model merely to animate it.

When this feature is implemented later, use safe runtime pivots or a non-destructive hierarchy solution and preserve the accepted visible Station geometry.

## Orb light direction — LOCKED VISUAL INTENT

The Orb is intended to visibly glow while powered.

Visual target:

- warm off-white / ivory / beige-yellow light;
- slightly yellow, not pure white;
- restrained slow breathing/pulsing intensity;
- soft, calm powered-device feeling;
- no saturated neon yellow;
- no aggressive strobe;
- no cyberpunk glow-strip treatment.

The light should support the fiction that the powered tether is energizing the Orb.

Exact emission intensity, bloom, pulse curve, and whether a small real Light component is needed remain tunable in a later visual pass.

## Stored state — LOCKED

When the Retrieval device is not being used:

- the Orb is physically stored in the **front circular basket/cradle on the Station base**;
- it must not hang from the guide arm;
- it must not remain floating beside the Station;
- retrieval ends by returning the Orb precisely into this front basket/cradle pose.

Preferred default for the current prototype: keep the powered cable connected while Stored, with only the short amount of visible cable required between the guide-tip endpoint and the docked Orb. Automatic plug/unplug behavior is not required in this phase.

`Orb_CradleSocket` should represent the accepted stored/docked pose in this front basket/cradle.

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
- Retrieval Orb accepted world size;
- Atlas;
- room cleanup;
- materials;
- source FBX files.

Runtime-only socket correction at the visible guide-arm tip is allowed if required to make the tether originate from the physically correct rod-end location.

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

Provide one short playable/testable prototype where:

- Stored Orb sits in the Station's front basket/cradle;
- tether clearly originates at the visible terminal end of the guide arm;
- Orb can deploy upward/downward/horizontal/diagonal while behaving as an actively powered object;
- cable remains continuous and stable;
- Orb retrieves back into the same front basket/cradle;
- repeated cycles produce no transform drift, duplication, orphaned renderers, or source-asset mutation.

Do not promote or commit until the corrected prototype is reviewed.