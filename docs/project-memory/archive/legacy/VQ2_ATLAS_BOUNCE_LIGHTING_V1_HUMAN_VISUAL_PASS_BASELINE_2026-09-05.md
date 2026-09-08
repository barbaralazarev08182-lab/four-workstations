# VQ2 Atlas Bounce Lighting V1 Human Visual PASS Baseline

Date: 2026-09-05

## Decision

CANDIDATE_AtlasBounceLighting_V1 receives Human Visual PASS as the current daylight / diffuse-bounce baseline.

This is an accepted baseline, not a final art-lock for production lighting.

## Accepted baseline

- Main Sun peak intensity: 1.18
- Shadow strength: 0.84
- Soft Shadows: enabled
- Main sunlight color temperature: low sun 4100K -> high sun 5000K
- Generic Daylight Fill: disabled
- Floor Bounce: 3 broad, non-shadowing spot emitters
- Floor Bounce peak: 0.52
- North Wall Bounce: 2 broad, non-shadowing spot emitters
- North Wall Bounce peak: 0.34
- Bounce lighting is continuously driven by SunVisual position
- Bounce lighting fades to zero at night
- Gameplay day cycle remains 3600 seconds / 60 real minutes

## Human visual judgment

PASS reasons:

- West Wall is no longer visually dead; it now shows readable time-of-day brightness and color changes without fake direct sunlight.
- Oak floor contributes a visible but restrained warm bounce into the room.
- Main sunlight direction and shadow logic remain coherent.
- The room reads as one illuminated space rather than only a directional key light plus generic fill.
- Morning / Noon / Late Afternoon states are visually distinct enough to continue production work.

## Not final art-lock

Lighting still has room for later art polish after real furniture and final materials are in place. Future V2 polish may include:

- stronger but controlled stylization
- refined warm/cool balance
- more deliberate oak color bleed
- improved wall gradient / indirect-light shaping
- reflection-probe and specular-response work for polished wood, stone, metal, glass, and final furniture materials

Do not keep iterating V1 now just to perfect graybox lighting. Revisit only after materially better furniture/material coverage makes the adjustment meaningful.

## Workflow note

Close this gate with only minimal verification. Do not add repository-wide audits or unrelated static checks.

No production promotion is authorized by this Human Visual PASS alone.
