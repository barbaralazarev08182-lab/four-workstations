# VQ2 Atlas Boundary Membrane V2 Candidate Integration Authorization — 2026-09-05

Status: USER AUTHORIZED / AUTHORITATIVE CANDIDATE INTEGRATION DELTA

## User decision

User accepted the calibrated Atlas Boundary Membrane V2 visual result and authorized proceeding.

## Current authoritative Atlas Boundary visual baseline

- Atlas center authority: `AtlasAnchor`
- Atlas gameplay radius: `21m`
- Boundary normally invisible
- Human Visual PASS visual response: calibrated Membrane V2
- Default/primary candidate parameters:
  - spherical cap: `6°`
  - duration: `0.65s`
  - peak distortion: approximately `1.5 screen px` (B candidate)
  - distortion form: travelling signed compression/expansion wavefront
  - wavefront interior recovers quickly after passage
  - no ring
  - no outline
  - no Fresnel border
  - no emission
  - no tint
- Backdrop capture for the passed review:
  - `1920x1080`
  - `ARGBHalf`
  - Bilinear
  - no mipmaps/downsample/blur during Human Review

## Integration authorization

Codex may now integrate the calibrated Membrane V2 as the active candidate visual response for Atlas Boundary contact/crossing events in `Office_Open20m_Candidate`.

The following older visual approaches are superseded for the active candidate path and should be non-destructively disabled, not deleted:

- old concentric-ring / portal-like Ripple visual
- direct Far Sky resample Membrane V1 prototype
- uncalibrated Membrane V2 prototype variants A/C

Keep them recoverable for rollback/reference if practical.

## Preserve

Do not change without new user authorization:

- `21m` Atlas radius
- Player radial constraint behavior
- Orb crossing exemption/events
- Far Sky / Milky Way Human Visual PASS settings and 45° sky rotation
- Interior Architecture V3 layout
- Retrieval Station / Orb transforms and behavior
- Camera transform / FOV / Eye Pivot
- Lighting / global ambient / reflection
- Production scene/assets

## Next stage after integration

After the candidate integration is validated, proceed to the previously accepted Atlas Sun / daylight architecture stage:

- separate `SunVisual` from `SunDirectionalLight`
- visible small sun should be readable but not eye-straining
- strong room light/shadows should come from directional lighting and architecture, not extreme emissive brightness
- exact orbit geometry remains open unless user supplies a reference image

## Gate

This authorization is for candidate integration only. It is not production promotion authorization.

Required validation before moving on:

- Compile PASS
- Shader errors = 0
- Blocking errors = 0
- current Human PASS B visual reproduced through the integrated event path
- old prototype paths disabled/non-destructive
- no unintended changes to protected systems
- no commit/push/promotion of local Unity implementation unless separately authorized
