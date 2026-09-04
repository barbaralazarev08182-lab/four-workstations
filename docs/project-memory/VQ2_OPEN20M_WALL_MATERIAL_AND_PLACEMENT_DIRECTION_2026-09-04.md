# VQ2 Open20m Wall Material & Placement Direction — 2026-09-04

> Status: USER DIRECTION / CURRENT CANDIDATE RULE
>
> Scope: Office_Open20m_Candidate wall material direction and wall-to-buildable-floor placement relationship.
>
> This records a current user-approved spatial rule. Exact wall height, wall thickness, final tiling, final lighting tuning, and final wall model remain tunable until Human Visual/Feel review.

## 1. Wall material direction

Current planned wall surface source:

- Poly Haven — `Beige Wall 001`

Desired character:

- warm off-white / beige-gray;
- restrained fine plaster/painted-wall texture;
- low visual noise;
- compatible with the accepted oak floor;
- suitable for strong sunlight/shadow composition without reading as glossy plastic, dirty concrete, or cyberpunk paneling.

Recommended source maps for the Unity URP candidate:

- Diffuse / Base Color;
- AO;
- Normal (GL);
- Roughness.

Do not require Blend, glTF, MaterialX, displacement, Normal DX, or the packed AO/Rough/Metal map for the initial wall-material integration.

## 2. Critical wall placement rule — USER DIRECTION

The two L-shaped walls must follow the relationship shown in the user's second reference diagram, not the third.

Core rule:

> The interior wall face aligns to the boundary of the existing 20 x 20m buildable floor, while wall thickness extends outward away from the floor center. The wall body must not sit on top of and consume the already-defined buildable floor area.

Reason:

- the full 20 x 20 floor is already the accepted buildable placement surface;
- the dashed Build Grid must remain readable up to the intended usable floor boundary;
- wall thickness must not hide/consume edge grid space;
- furniture and build-placement logic should be able to use the intended edge cells without a hidden wall-footprint conflict;
- ordinary architectural enclosure should not silently reduce the player's advertised buildable area.

Axis-independent implementation interpretation:

- determine the floor center and exact floor bounds;
- for each wall, place the wall's **interior-facing surface** exactly on the relevant floor boundary plane;
- shift the wall mesh center by half its thickness **away from the floor center** so all wall thickness lies on the exterior/non-buildable side;
- preserve the L-shaped perpendicular relationship;
- do not move or resize the accepted 20 x 20 floor merely to accommodate the wall.

## 3. Candidate dimensions — NOT LOCKED

Reasonable blockout starting values only:

- wall thickness: about `0.12–0.15 m`;
- wall height: about `3.0–3.2 m`.

These values are not user-locked. They must remain easy to tune after first-person Human Visual/Feel review.

## 4. Change boundary

This wall round should remain candidate-only unless separately approved.

Do not disturb the accepted baselines without explicit reason:

- 20 x 20 floor size/center;
- Open20m oak floor material;
- Build Grid mathematical baseline and `B` toggle;
- player placement/controller;
- Atlas placement;
- Retrieval Station accepted asset state;
- production scenes/assets.

Do not add final skirting/baseboards, decorative trims, complex wall sci-fi details, or final room furnishing before the basic architectural relationship passes review.
