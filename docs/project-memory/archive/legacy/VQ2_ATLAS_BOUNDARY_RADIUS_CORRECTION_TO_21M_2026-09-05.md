# VQ2 Atlas Boundary Radius Correction to 21m — 2026-09-05

Status: USER CORRECTION / AUTHORITATIVE DELTA

## Decision

The Atlas invisible refuge boundary candidate radius is changed from **30m** to **21m**.

This supersedes the previous 30m candidate radius value for the current Open20m candidate.

## Preserved rules

- Boundary center authority remains `AtlasAnchor`.
- Boundary remains normally invisible.
- Player radial constraint remains in place and should use the updated radius.
- Orb remains allowed to cross the boundary and must not inherit the player constraint.
- Boundary visual/ripple logic remains decoupled from gameplay logic.
- Far Sky / Milky Way settings are unchanged by this decision.
- Interior Architecture V3, Retrieval Station, Lighting, Camera, production assets and global environment settings are not to be changed as part of this radius correction.

## Spatial sanity check

For the current 20m x 20m floor centered on Atlas:

- Atlas-to-floor-corner horizontal distance is about 14.14m.
- With approximately 6m wall height, Atlas-to-top-corner distance is about 15.36m.
- A 21m sphere therefore still fully contains the room shell and leaves roughly 5.6m radial clearance around a top corner.

The user judged the 30m sphere visually too large and wants the refuge boundary to feel closer to the house while still clearly larger than the house itself.

## Implementation scope

Update only the candidate boundary radius and all dependent/debug values that are derived from radius. Do not redesign unrelated systems.

After changing to 21m, re-check:

- Scene View debug sphere scale relative to the house.
- Player constraint behavior.
- Orb crossing behavior.
- Approximate Station/Orb travel distance to the boundary.
- Boundary ripple localization relative to the smaller sphere.

No production promotion, commit/push of local Unity changes, or unrelated redesign is authorized by this decision.
