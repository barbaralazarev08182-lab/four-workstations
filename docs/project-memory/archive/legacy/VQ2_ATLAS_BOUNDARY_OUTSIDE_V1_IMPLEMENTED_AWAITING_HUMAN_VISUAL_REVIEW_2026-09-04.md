# VQ2 Atlas Boundary + Outside Universe V1 — Implemented / Awaiting Human Visual Review — 2026-09-04

> Status: TECHNICAL IMPLEMENTATION COMPLETE / HUMAN VISUAL REVIEW OPEN
>
> Scope: Open20m candidate Atlas refuge boundary and Outside Universe V1.
>
> This note does not grant Human Visual PASS. It records the reported candidate implementation and the review conditions for the next gate.

## 1. Atlas Boundary implementation

- Boundary center authority: `AtlasAnchor`.
- Reported center: `(0, 0.02, 0)`.
- Candidate radius: `30m`.
- Player clearance: `0.35m`.
- Player constraint uses radial projection while preserving tangential movement; it does not depend on a visible sphere collider.
- Boundary visual renderer is disabled in normal state and only enabled for Debug Reveal / Ripple visualization.
- Visual and gameplay logic remain separated.

The `30m` radius remains a Human-review candidate, not a final lock.

## 2. Orb / Retrieval crossing

- Orb is not constrained by the player refuge boundary (`constrainToBoundary = false`).
- Crossing probe is configured so the Orb can pass through the Atlas boundary and report enter/exit events.
- Existing Orb / Retrieval Station behavior and transforms were not intentionally changed in this round.

This preserves the world rule that the player/refuge is protected by the Atlas sphere while Retrieval must deliberately cross it.

## 3. Outside Universe V1

- Far Universe uses a camera-level custom sky implementation.
- Global `RenderSettings`, ambient lighting, and reflection settings were reported unchanged.
- Near3D contains 16 low-cost sparse matter fragments.
- Reported Near3D radial range: approximately `38m–71.6m` from Atlas, all outside the 30m boundary.
- Empty future roots were created for near retrieval, distant events, war events, and future events.

The Far Sky and Near3D art direction still require Human Visual review. Technical existence is not visual acceptance.

## 4. Retrieval / boundary spatial relationship

Reported distances:

- Retrieval Station to Atlas: `7.952m`.
- Orb Cradle to Atlas: `7.476m`.
- Current Orb to Atlas: `7.466m`.
- Approximate Orb travel from current position to boundary: `22.534m`.
- Current Guide Tip outward forward: approximately `(0, 0, -1)`.

The guide-tip working direction should be visually reviewed together with the open-edge composition. The numeric direction alone does not establish that the perceived Retrieval direction is correct.

## 5. Technical validation

Reported:

- Compile PASS.
- Shader errors: 0.
- Console blocking errors: 0.
- Interior Architecture V3 unchanged.
- Lighting unchanged.
- Production unchanged.
- Staged files: 0.
- No commit / push / promotion of the local Unity candidate.

## 6. Human Visual Gate — still open

Required review evidence should include:

1. Debug-revealed full sphere relative to the 20x20 room.
2. Normal gameplay Outside with boundary fully invisible.
3. Localized boundary ripple.
4. Living/open-edge view toward Outside.
5. Retrieval view toward Outside.
6. Interior-looking-back view confirming that the sky does not overpower the home.

Human review should answer:

- Does 30m feel like the right refuge scale relative to the house?
- Does normal state truly hide the boundary?
- Does the ripple read as a local field response rather than a sci-fi shield?
- Does the Far Universe feel deep, sparse, and restrained rather than decorative wallpaper?
- Is Near3D subtle enough to provide parallax without reading as a particle effect?
- Does Outside support the domestic interior rather than visually defeating it?
- Does Retrieval visibly point toward a convincing working direction relative to the boundary and open edge?

Until those questions receive Human Visual acceptance, this gate remains OPEN.
