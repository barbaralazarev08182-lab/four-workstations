# VQ2 Atlas Bounce Lighting V1 — Implemented, Awaiting Human Visual Evidence

Date: 2026-09-05

Status: Machine Review complete. Human Visual PASS/FAIL not yet issued because the actual screenshots/GIF are local paths on the user's machine and were not attached in chat.

## Reported implementation
- Main Sun peak intensity: 1.18
- Shadow strength: 0.84
- Soft Shadows: enabled
- Sun light temperature: 4100K low elevation -> 5000K high elevation
- Generic Daylight Fill: disabled
- Floor Bounce: 3 broad non-shadowing Spot emitters
- Floor Bounce peak: 0.52
- North Wall Bounce: 2 broad non-shadowing Spot emitters
- North Wall Bounce peak: 0.34
- Bounce lights continuously driven by SunVisual position; night -> zero
- Gameplay cycle: 3600s

## Machine validation
- Compile PASS
- Blocking runtime errors: 0
- No commit/push/promotion from local Unity task
- Production not modified
- SunVisual, orbit, Atlas Boundary, Far Sky, Interior, Retrieval unchanged

## Human Visual gate
Do not declare Human Visual PASS from numeric parameters alone.
Need the actual Morning / Noon / Late Afternoon / West Wall comparison and preferably the accelerated bounce-cycle GIF uploaded into the conversation for visual judgement.

## Review focus when evidence is available
- Does West Wall brightness/color clearly change over the day without fake direct sunlight?
- Is oak warmth visible but restrained?
- Do bounce emitters read as indirect light rather than obvious spotlights?
- Are shadow-side volumes still dimensional, not flattened?
- Does the result feel warmer, stronger, more stylized, but still believable?
- Pay special attention because Floor Bounce 0.52 and North Wall Bounce 0.34 are relatively strong compared with the 1.18 main sun and may be visually excessive even if numerically valid.
