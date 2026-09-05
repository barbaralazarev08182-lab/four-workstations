# VQ2 Atlas Boundary Membrane V2 Human Review — Route Pass / Calibration Fail

Date: 2026-09-05
Status: HUMAN VISUAL REVIEW DELTA

## Decision

The V2 architecture direction is accepted: capture the actual Outside backdrop to a RenderTexture and distort it locally on a spherical-cap membrane patch. This is substantially closer to the intended invisible Atlas boundary than the earlier ring-based and direct-sky-resample approaches.

However, the current V2 visual result is NOT a Human Visual PASS yet.

## Why it fails visually

Current screenshots read as a magnifying / blurry lens or dark transparent bubble rather than a subtle invisible membrane disturbance.

Observed problems:

- The patch footprint is too large for a local impact response.
- The 960x540 half-resolution backdrop capture visibly softens / enlarges star points when the patch samples and upscales it.
- Distortion is too strong across too much of the patch interior, causing a magnified / smeared blob rather than a thin propagating surface disturbance.
- Any darkening or color mismatch inside the patch makes the patch read as an object rather than transparent space.
- Mid/Far test silhouettes / dark test objects should be disabled in Human Review captures because they can be mistaken for Boundary artifacts.

## Locked direction for next pass

Do NOT abandon the V2 backdrop-capture architecture. Refine it.

### Capture quality

For Human Review, use a full-resolution backdrop RenderTexture matching the active Game View (e.g. 1920x1080 for 1920x1080 evidence). Keep bilinear sampling for subpixel distortion but disable mipmaps and any blur/downsample path. Performance optimization can happen after visual acceptance.

Baseline requirement: with the membrane patch enabled but distortion = 0 and no tint, the captured backdrop through the patch must be visually indistinguishable from patch OFF.

### Patch scale

Reduce spherical-cap angular radius from 10 degrees to an initial 6 degrees, with an Inspector range around 5-8 degrees.

### Distortion strength

At full-resolution capture, test approximately:

- A: 0.7-1.0 screen px peak
- B: 1.2-1.8 screen px peak
- C: 2.2-2.8 screen px upper bound

Do not repeat the previous half-resolution 1 / 2.5 / 5 px scale because it effectively becomes much stronger after upsampling.

### Distortion shape

The entire cap interior must NOT distort uniformly.

Use a travelling refractive wavefront / gradient band:

- strongest distortion near the moving wavefront
- near-zero distortion behind the wavefront after it passes
- very weak contact-center deformation only
- signed compression / expansion so the effect bends stars and returns them rather than behaving like a magnifying lens
- low-frequency, coherent spherical modulation only

The user should mainly perceive stars and Milky Way features briefly bending across a curved surface, then returning to normal.

### Surface visibility

First refinement pass should remain distortion-only:

- no ring
- no visible outline
- no Fresnel border
- no emission
- no membrane tint
- no dark alpha patch

Only after distortion-only reads correctly may a tiny warm-neutral highlight be considered.

### Timing

Keep the effect brief, approximately 0.55-0.70s total. The wavefront should travel outward across the 5-8 degree cap and dissolve; it should not leave a persistent lens-shaped region.

### Review cleanup

Disable Mid/Far test silhouettes and any black / tan test shapes in review captures so they cannot be confused with the membrane.

## Gate state

- Atlas Boundary radius 21m: PASS
- Boundary gameplay / Player constraint / Orb crossing: PASS
- Far Sky / Milky Way: PASS
- Membrane V2 architecture: DIRECTION PASS
- Membrane V2 current visual calibration: FAIL / NEEDS REFINEMENT
- Formal Boundary Visual Gate: OPEN

No production promotion is authorized by this review.
