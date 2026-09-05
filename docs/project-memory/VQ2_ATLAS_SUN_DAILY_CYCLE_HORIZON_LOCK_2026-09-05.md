# VQ2 Atlas Sun Daily Cycle / Horizon User Lock — 2026-09-05

Status: USER LOCK / AUTHORITATIVE DELTA

This file refines the previously locked Atlas sun orbit geometry.

## Locked daily-cycle behavior

- The sun moves at constant angular speed along the previously locked vertical great-circle orbit centered on `AtlasAnchor`.
- The room floor plane is the local horizon / sea-level reference for the day-night cycle.
- In the current Open20m scene this means the horizon reference is the floor plane around `Y = 0` (use the actual authoritative floor/Atlas reference if implementation requires a tiny offset; do not redefine the concept).
- Sunrise occurs when the sun crosses the floor/horizon plane from below to above.
- Sunset occurs when the sun crosses the floor/horizon plane from above to below.
- Noon is the topmost point of the orbit above Atlas.
- Midnight is the bottommost point of the orbit below the floor/Atlas.
- No non-uniform orbital speed, seasonal equation-of-time behavior, or special sunrise/sunset easing is desired for this system at this stage.

## Direction

- Preserve the user's previously locked counterclockwise direction as viewed from the side-view orientation shown in the user's reference image.
- In that side-view orientation, the right-side horizon crossing is the upward crossing (sunrise), then the sun reaches the topmost point (noon), then crosses the left-side horizon downward (sunset), then reaches the bottommost point (midnight), and returns to sunrise.

## Supersedes / clarifies

- This removes any need to separately design arbitrary sunrise/sunset positions or non-uniform timing.
- The sun's visible day/night timing is a direct consequence of the locked orbit geometry, constant angular velocity, and floor-plane horizon reference.

## Still open

- Exact real-time duration of one complete orbit/day.
- Exact final SunVisual diameter and tiny inward clearance from the 21m Atlas Boundary.
- Final daylight intensity/color curves as a function of sun elevation.
- Future optional Atlas Boundary visual interaction with the sun.
