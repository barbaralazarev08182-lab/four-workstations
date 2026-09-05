# VQ2 SunVisual + Orbit Human Review — Needs Refinement

Date: 2026-09-05

## Gate verdict

- Orbit geometry / placement: PASS
- 0.50m Sun core scale: PASS for this candidate
- SunVisual surface / corona visual quality: NEEDS REFINEMENT
- Overall SunVisual gate: NOT YET PASS

## Evidence reviewed

User-provided Human Review captures for the completed `SunVisual + Orbit Candidate`, including:

- whole-scene orbit view
- side-view orbit view
- close-up SunVisual view
- surface-animation evidence

Reported technical status:

- Compile PASS
- PlayMode PASS
- Shader errors 0
- Blocking runtime errors 0
- Orbit movement PASS
- no lighting / ambient / reflection changes
- no production changes
- no commit / push / promotion

## What is working

1. The Sun is correctly placed on the large Atlas-centered orbit.
2. The orbit scale reads close to the 21m Atlas Boundary and matches the intended refuge geometry.
3. The side-view orbit presentation is consistent with the locked vertical great-circle concept.
4. The 0.50m Sun core is large enough to read as a deliberate visual object at this scale.
5. SunVisual remains separate from the daylight system.

## What needs refinement

### 1. Corona currently reads as a dark ring

The close-up capture shows a clearly visible dark / gray outer band around the bright core.

This does not read as luminous corona. It reads as a shell, outline, bezel, or dark halo.

Required correction:

- remove the dark ring appearance entirely
- corona must be emissive / additive-feeling, soft, thin, and subtle
- no visible hard edge or dark alpha fringe
- avoid thick Fresnel-shell reading

### 2. Core surface is too flat / washed out

The current bright core is readable, but the surface detail is too soft and low-contrast to sell the intended `Designed Refuge Star` identity.

It currently reads closer to a pale glowing sphere / cloudy marble than a deliberately authored artificial sun.

Required correction:

- preserve visible fine granulation under emission
- introduce clearer but still restrained macro convection structure
- maintain a stable bright core without clipping away all surface detail
- keep the overall result elegant and controlled, not realistic-NASA noisy and not lava-like

### 3. Activity regions need stronger authored structure

The locked direction calls for a few slow, designed activity regions.

Current close-up does not yet show sufficiently clear, intentional local activity structure.

Required correction:

- keep roughly 2–5 active regions
- make them legible at close review distance
- they should slowly form / shift / dissolve
- avoid pulse, flicker, sparks, fire tongues, or random noisy flashing

### 4. Surface motion should read as internal evolution, not texture drift

The Human Review target remains:

- 1 second: stable
- 3–5 seconds: clear living surface motion
- 10–20 seconds: visible regional evolution

Do not solve this with obvious whole-texture rotation or obvious UV scrolling.

## Next correction pass scope

Keep unchanged:

- Sun core diameter = 0.50m
- orbit radius = 20.70m
- AtlasAnchor authority
- vertical orbit plane
- counter-clockwise motion
- current orbit movement implementation
- no SunDirectionalLight / daylight work yet

Only refine:

- Sun core shader/material appearance
- corona shader/material appearance
- surface animation readability

## Execution economy

Use minimal targeted validation only:

- Compile PASS
- Shader errors = 0
- Blocking runtime errors = 0
- one updated close-up still
- one 8–12 second surface-animation GIF

Do not repeat repository-wide audits, static sweeps, orbit evidence, hierarchy dumps, or unrelated checks for this visual correction pass.
