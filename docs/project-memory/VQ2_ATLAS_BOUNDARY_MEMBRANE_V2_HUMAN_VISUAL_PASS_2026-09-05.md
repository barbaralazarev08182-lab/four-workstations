# VQ2 Atlas Boundary Membrane V2 — Human Visual PASS

Date: 2026-09-05
Status: USER HUMAN VISUAL PASS / AUTHORITATIVE VISUAL DIRECTION

## Decision

The calibrated Atlas Boundary Membrane Prototype V2 is accepted as the current visual direction for Atlas boundary contact feedback.

User feedback after reviewing the GIF: the effect feels good.

This supersedes the earlier visible-ring / concentric-ripple / direct-sky-resample visual directions.

## Accepted current candidate settings

- Atlas Boundary radius: 21 m
- Center authority: AtlasAnchor
- Backdrop capture: 1920x1080 ARGBHalf
- Mipmaps/downsample/blur: off
- Patch cap: 6 degrees
- Inspector cap range: 5–8 degrees
- Duration: 0.65 s
- Main candidate: B
- Peak distortion: 1.5 screen pixels
- Distortion behavior: travelling signed compression/expansion wavefront
- Wavefront interior recovery: immediate / near-immediate after passage
- Visible ring / outline / Fresnel / emission / tint: off
- Far Sky / Milky Way settings: unchanged from existing Human Visual PASS
- Far Sky Y rotation: 45 degrees

## Visual contract

The boundary should normally be invisible.

On contact, the player primarily perceives a small localized patch of the actual outside background bending/compressing/expanding over a curved spherical surface, then recovering quickly.

The effect must not read as:
- portal
- UI reticle
- concentric rings
- combat shield
- magnifying lens
- blurry glass sphere

## Technical status carried forward

- Atlas gameplay boundary: 21 m
- Player radial constraint: PASS
- Orb crossing: PASS
- Compile: PASS
- Shader errors: 0
- PlayMode: PASS
- Blocking errors: 0

## Next implementation step

Promote the V2 calibrated membrane effect inside the candidate scene as the active Atlas boundary visual response, while keeping older prototypes non-destructively disabled for rollback. Do not promote to production without explicit authorization.
