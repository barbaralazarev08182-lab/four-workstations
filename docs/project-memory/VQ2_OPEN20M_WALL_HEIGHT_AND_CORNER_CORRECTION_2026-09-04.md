# VQ2 Open20m Wall Height + Corner Correction — 2026-09-04

> Status: USER DIRECTION / IMPLEMENTATION CORRECTION
>
> Scope: current Open20m candidate L-wall architecture blockout.
>
> This document records the user's latest correction after visual review. It does not promote the candidate to production and does not by itself constitute a final Human Visual / Feel PASS.

## 1. Wall placement rule remains unchanged

The existing wall/floor relationship is correct and must be preserved:

- West wall interior face remains exactly on `X = -10`.
- North wall interior face remains exactly on `Z = 10`.
- Wall thickness must remain outside the 20 × 20m buildable floor.
- Do not consume or cover the accepted Build Grid area.
- Buildable floor remains the full `(-10,-10) -> (10,10)` footprint.

## 2. Wall height correction — USER DIRECTION

The current `3.1m` wall height is visually too low.

Interpret the user's latest direction as:

> Increase wall height by approximately `2.0m` relative to the current 3.1m blockout.

Current target for the next candidate iteration:

`Wall Height = 5.1m`

This is a candidate target for immediate implementation and Human Visual / Feel review.

Wall thickness remains:

`0.15m`

Do not change the wall material or floor relationship while testing this height.

## 3. L-corner closure correction

The current two outward-thickened walls create a visible vertical dark seam / incomplete exterior corner when viewed from outside/oblique angles.

Fix the L-shaped exterior corner so the two wall solids visually close cleanly.

Preferred minimal correction:

- extend one wall by approximately one wall thickness (`0.15m`) in the exterior-corner direction;
- shift that wall's center accordingly;
- preserve the room interior faces exactly at `X=-10` and `Z=10`;
- keep all added wall volume outside the buildable floor.

Alternative: a small exterior-only corner filler is acceptable if required, but avoid unnecessary extra scene objects when a clean wall extension solves the issue.

## 4. Keep unchanged

Do not modify in this correction round:

- Oak floor geometry/material;
- accepted Build Grid math or placement area;
- Beige Wall 001 material direction;
- Atlas;
- Retrieval Station;
- player;
- camera;
- lighting;
- furniture layout;
- production scenes/assets.

## 5. Review state

After the height and corner correction:

- compile/test;
- inspect in first-person / player-scale views;
- inspect exterior oblique corner view;
- confirm the taller 5.1m walls feel appropriate for the 20 × 20 room;
- confirm the L-corner has no full-height dark seam or light leak;
- then wait for Human Visual / Feel review.

No production promotion, commit/push of local Unity candidate, or final wall PASS is implied by this document.
