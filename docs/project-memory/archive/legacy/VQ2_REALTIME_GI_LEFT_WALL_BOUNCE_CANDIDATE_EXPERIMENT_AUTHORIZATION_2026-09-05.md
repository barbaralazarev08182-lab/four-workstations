# VQ2 Realtime GI + Left Wall Bounce Candidate Experiment Authorization — 2026-09-05

## Status
Authorized as a small candidate experiment only.

## Goal
Prove whether dynamic indirect light can solve the current daylight limitation where the West/left wall receives almost no direct SunDirectionalLight because the locked sun orbit lies in the Atlas Y-Z plane, while still allowing the wall and nearby objects to respond to bounced light from the floor, opposite wall, and room surfaces.

## Locked context
- SunVisual remains frozen and unchanged.
- Sun orbit geometry remains frozen: AtlasAnchor center, Y-Z vertical great circle, radius 20.70m, counter-clockwise.
- Gameplay day cycle = 3600s.
- Current daylight direction logic is already functionally correct.
- Current problem is insufficient indirect lighting / bounce, not wrong sun direction.
- Visual direction: more realistic light transport with restrained stylization and a somewhat warmer daylight character.

## Experiment scope
Create the smallest possible Realtime GI / indirect-light test in the current candidate scene.

Primary proof target:
- The West/left wall must remain mostly free of direct sunlight due to geometry, but visibly change in brightness/color through the day because of bounced light.
- Sunlight hitting the oak floor should create a subtle warm bounce on nearby walls/objects.
- Bright walls/furnishings should contribute softer secondary illumination.
- Do not fake the result by rotating the sun or adding obvious second directional lights.

Secondary proof target:
- Confirm whether the current Unity 2022.3 / URP project can use Precomputed Realtime GI / Enlighten acceptably for this small static architectural shell.
- If unsupported, unstable, or clearly unsuitable, stop and report rather than redesign the whole lighting system.

## Safety / scope constraints
Do not modify SunVisual, orbit, Atlas Boundary, Far Sky, Milky Way, Interior layout, Retrieval transforms, furniture layout, production scenes, or global environment settings unless strictly required for the GI experiment and explicitly reported.

Do not do repository-wide audits or unrelated static checks.

## Review evidence
Keep evidence minimal:
- One Morning comparison showing West wall / floor bounce.
- One Noon comparison.
- One Late Afternoon comparison.
- Optional short GIF only if it clearly demonstrates the indirect light changing over time.

## Gate
This is not a production lock. Human review decides whether the GI route is visually worthwhile before any broader integration.
