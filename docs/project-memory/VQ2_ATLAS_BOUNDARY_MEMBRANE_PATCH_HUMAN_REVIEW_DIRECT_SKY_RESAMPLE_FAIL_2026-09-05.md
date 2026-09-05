# VQ2 Atlas Boundary Membrane Patch Human Review — Direct Sky Resample FAIL

Date: 2026-09-05
Status: HUMAN VISUAL REVIEW / AUTHORITATIVE DELTA

## Decision

The isolated `BoundaryMembranePatch` prototype based on directly re-sampling the authored 8K Far Sky does **not** pass Human Visual Review.

The three A/B/C intensity candidates do not yet communicate a curved, transparent, normally invisible Atlas boundary. In the supplied review images the effect reads either as almost imperceptible or as a thin horizontal/golden strip/artifact rather than a local curved membrane. The player would still need an explanation to understand what is being shown.

Therefore:

- Do **not** promote A, B, or C.
- Do **not** replace the current formal 21m Atlas Boundary visual with this prototype.
- Do **not** continue solving the problem by merely increasing distortion strength, alpha, or adding more visible rings.
- Preserve the 21m gameplay sphere, Player constraint, Orb crossing, Far Sky PASS settings, Interior V3, Lighting, camera, and Retrieval transforms.

## What was learned

The visual primitive is now directionally correct (localized membrane / distortion rather than concentric rings), but direct authored-sky resampling is not providing a sufficiently legible or robust visual result in the current camera composition.

The next prototype should distort the **actual composed Outside background seen by the player**, not an independently re-sampled approximation of the sky texture.

## Recommended next prototype

Use a dedicated Outside-only background capture RenderTexture aligned to the OfficeCamera:

- Render Far Sky + Celestial/MidFar Outside layers into a background capture RT.
- Do not include the room, player, UI, Atlas patch itself, or foreground interior.
- Match OfficeCamera rotation/FOV/aspect; only render the outside background layers.
- The Boundary patch samples this RT in screen space and applies a tiny local distortion inside the spherical cap.
- Prefer updating/enabling this capture only while a boundary response is active, if practical.
- First visual test should be distortion-only: no visible ring and no strong surface tint.
- Once distortion alone clearly communicates a curved transparent surface, add only a minimal neutral/warm surface response if needed.

This architecture also has the advantage that future planets, galaxy features, fleets, and distant events can be distorted consistently without special-casing each source texture.

## Gate

Current state:

- 21m Atlas Boundary gameplay / technical architecture: PASS
- Far Sky / Milky Way: PASS
- Direct-sky-resample membrane prototype: HUMAN VISUAL FAIL
- Final Atlas Boundary visual: OPEN
