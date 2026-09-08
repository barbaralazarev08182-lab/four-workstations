# VQ2 SunVisual Human Visual PASS — 2026-09-05

## Decision
SunVisual still appearance is accepted as the current candidate baseline.

## Accepted geometry / orbit
- Core diameter: 0.50m
- Corona outer diameter: 0.58m
- Atlas Boundary radius: 21.0m
- Orbit center radius: 20.70m
- Orbit center authority: AtlasAnchor
- Orbit plane: house-center vertical Y-Z great circle
- Motion: uniform, counter-clockwise in the approved side-view convention
- No Light components under SunVisual
- Daylight / SunDirectionalLight remains separate and not part of this visual object

## Human visual result
PASS for the current SunVisual still look.

The previous dark/black corona shell problem is resolved enough to proceed. The current result reads as a bright designed refuge star rather than a generic emissive sphere. Surface detail is visible, the corona is restrained, and the overall visual is suitable to freeze for the next stage.

Do not continue polishing the SunVisual in isolation now. Any later micro-adjustment should only happen if first-person in-room viewing reveals a concrete issue such as oversized activity regions, excessive halo, or insufficient surface readability.

## Animation evidence caveat
The uploaded chat copy of the GIF was available only as a single-frame file during review, so this PASS is specifically for the still visual appearance. The implementation report states the 10-second surface animation passed local review; do not reopen the animation unless the user later reports a visible motion problem.

## Next stage
Proceed to the separate daylight / shadow system using an independent SunDirectionalLight synchronized to SunVisual direction. Do not modify the accepted SunVisual material, size, orbit, Far Sky, Atlas Boundary, Interior, or Retrieval systems unless a concrete visual problem is observed.

## Workflow
Keep Codex execution economical: targeted implementation and targeted validation only. Avoid repository-wide audits, unrelated static checks, and redundant evidence packages unless the task introduces a specific migration, production, serialization, or regression risk.
