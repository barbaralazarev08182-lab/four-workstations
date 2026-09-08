# VQ2 Atlas Daylight V1 — Human Visual Review Needs Refinement

Date: 2026-09-05

## Status

Functional architecture PASS, visual presentation NEEDS REFINEMENT.

## What is working

- SunDirectionalLight direction is correctly derived from SunVisual -> AtlasAnchor.
- Horizon cutoff is working.
- Morning / noon / late-afternoon states are clearly distinguishable.
- Shadow direction is coherent with the visible sun.
- SunVisual remains decoupled from room lighting.
- No blocking runtime / shader / compile errors were reported.

## Human visual issues

### 1. Shaded regions collapse too dark
Morning and late-afternoon shots leave large parts of the room in muddy dark grey / near-black. This reads more like a stage key light than expensive residential daylight.

Goal: retain directional contrast and long shadows while preserving readable wall, floor and furniture material values in shade.

### 2. Noon result is too globally warm / washed
The noon image is brighter but the overall floor and wall response becomes overly warm and a little washed. Noon should read cleaner and more neutral, while still retaining the warm oak material.

### 3. Current shadow contrast is too theatrical
Shadow structure is good, but the contrast is harsher than the intended high-end residential mood. Current Shadow Strength = 0.90 is a likely contributor, together with lack of indirect/fill light.

## Refinement direction

Keep the current main SunDirectionalLight architecture and direction logic.

Do NOT touch:
- SunVisual geometry / material / animation
- Sun orbit geometry
- Atlas Boundary
- Far Sky / Milky Way
- Interior layout
- Retrieval transforms
- production

Recommended candidate refinement:

1. Reduce main shadow strength from 0.90 toward ~0.78–0.82 candidate range.
2. Add a very restrained non-shadowing daylight fill component rather than changing global RenderSettings ambient/reflection.
   - The fill exists only to simulate missing indirect sky / bounce in realtime URP.
   - It must remain much weaker than the main sun key.
   - It must not create a second readable sun direction or second shadow.
3. Keep noon daylight visually closer to neutral warm-white. Judge by image result, not temperature number alone.
4. Preserve low-angle long shadows in morning / afternoon.
5. Update gameplay day-cycle default from the old 120s prototype to the user-locked 3600s (60 real minutes per full orbit). A temporary review-speed override may remain available but must not be the gameplay default.

## Review goal

The next review should feel like:
- Morning: long warm directional shadows, but shaded room remains readable.
- Noon: clean, open, neutral-warm daylight without orange wash.
- Late afternoon: long directional shadows from the opposite side, again with readable shaded surfaces.

This gate is not yet Human Visual PASS.
