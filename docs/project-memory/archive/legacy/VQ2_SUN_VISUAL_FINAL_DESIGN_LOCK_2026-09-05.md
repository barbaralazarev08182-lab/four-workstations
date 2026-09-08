# VQ2 SunVisual Final Design Lock — 2026-09-05

## Scope
This document locks the current candidate design for the visible Atlas refuge sun (`SunVisual`). It is visual-only and remains decoupled from room lighting behavior.

## Locked geometry
- `SunVisual` core diameter: **0.50 m**.
- Atlas Boundary radius: **21.00 m**.
- Sun orbit center: **AtlasAnchor**.
- Sun orbit plane: **vertical plane on the house centerline**, interpreted in the current scene as the Y-Z plane through Atlas (`X = AtlasAnchor.x`).
- Orbit direction: **counterclockwise as viewed in the user's side-view reference**.
- Motion: **uniform angular velocity** around the full circle.
- Floor plane (`y = 0`) is the local horizon/sea-level reference.
  - right-side horizon crossing upward = sunrise
  - top of orbit = noon
  - left-side horizon crossing downward = sunset
  - bottom of orbit = midnight
- Core-center orbit radius: **20.70 m**.
  - With a 0.25 m core radius, the core surface remains 0.05 m inside the 21 m boundary.

## Visual identity
User selected **B: designed refuge star**.

The SunVisual should read immediately as a sun, but with a subtle sense that it has been designed/maintained rather than being a fully natural star.

Target feel:
- elegant
- stable
- precise
- quietly alive
- visually rich on inspection
- slightly too orderly to feel purely natural

Avoid:
- generic glowing sphere
- lava ball
- fantasy energy orb
- sci-fi plasma weapon
- cartoon fireball
- NASA-documentary literalism

## Appearance behavior
SunVisual appearance is **constant across the daily cycle**.

Do not drive SunVisual color, emission, corona, or surface animation from time-of-day.

SunVisual is independent from `SunDirectionalLight`.
- `SunVisual` = visible sun only
- `SunDirectionalLight` = room illumination and shadow authority

The visible sun should stay continuously luminous and visually consistent while it orbits.

## Surface construction
Preferred implementation is a self-contained custom URP shader/material rather than relying on a complete third-party sun asset.

### Core sphere
Use a clean sphere mesh with a custom emissive surface shader.

The shader should use object-space / sphere-space procedural sampling so the animation does not expose an obvious UV seam or pole distortion.

### Surface layers
Use four restrained visual layers:

1. **Base stellar body**
   - warm white / ivory / pale-gold visual family
   - fixed appearance, not time-of-day driven
   - enough tonal structure that the sphere still has readable detail when emissive

2. **Large-scale convection**
   - low-frequency 3D/object-space noise
   - slow domain-warped evolution rather than simple scrolling UVs
   - broad cells gently forming, deforming, and dissolving
   - the movement should feel internally generated, not like a texture sliding across a ball

3. **Fine granulation**
   - second, higher-frequency noise layer
   - lower amplitude than macro convection
   - enough change that a player watching for 3–5 seconds can tell the surface is alive
   - no rapid flicker

4. **Active regions**
   - sparse, broad, slightly brighter regions
   - roughly 2–5 simultaneous readable regions at most
   - slowly form, drift/evolve, and fade
   - no explosive flares, no popping sprites, no obvious looping pattern

## Motion character
- No obvious transform-level fast self-rotation.
- Any whole-body drift must be extremely slow and secondary.
- Primary movement comes from evolving procedural surface structure.

Desired perceptual timing:
- ~1 second glance: stable sun
- ~3–5 seconds: clearly living surface
- ~10–20 seconds: active regions visibly evolve

## Corona
Use a separate restrained corona layer around the core.

Locked candidate outer corona diameter: **0.58 m** (about 1.16x the 0.50 m core diameter).

At orbit radius 20.70 m, the 0.29 m corona radius remains just inside the 21 m Atlas boundary.

Corona behavior:
- thin
- soft
- stable
- slightly irregular via low-amplitude procedural alpha/noise
- visually attached to the star

Avoid:
- giant halo
- long lens flare
- RGB fringe
- thick Fresnel ring
- large billboard glow disc
- dramatic solar prominences in V1

## Emission / bloom philosophy
The sun must remain visually attractive even with bloom reduced or disabled.

Bloom is only a finishing layer, never the main construction of the sun.

The core should stay visibly spherical and retain surface structure rather than collapsing into a featureless white disk.

## External asset policy
A real Sun texture such as Solar System Scope may be used as optional low-level detail/reference if useful, but the final visual identity must come from the custom shader and procedural animation.

NASA SDO imagery is reference material for activity character and surface rhythm, not a video-texture implementation requirement.

No need to download a complete third-party sun package unless the custom candidate fails visually.

## Lighting decoupling
Do not make the 0.50 m SunVisual physically responsible for room lighting.

Do not attach a main Point Light to the sphere for daylight.

The separate `SunDirectionalLight` may track the SunVisual direction, but that is a later/parallel lighting system concern and must not alter SunVisual appearance.

## Candidate implementation policy
For Codex execution, prefer direct implementation plus focused verification.

Required checks only:
- compile passes
- shader errors = 0
- no blocking runtime errors
- visual review evidence sufficient to judge surface motion, corona, size, orbit direction, and boundary clearance

Avoid unrelated repository-wide audits, excessive static checks, oversized evidence packs, or repeated hierarchy/transform inventory unless a concrete risk requires them.

No commit, push, production promotion, or unrelated scene changes without explicit authorization.
