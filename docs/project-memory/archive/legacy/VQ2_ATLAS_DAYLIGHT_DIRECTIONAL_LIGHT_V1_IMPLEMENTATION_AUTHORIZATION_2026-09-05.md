# VQ2 Atlas Daylight Directional Light V1 Implementation Authorization — 2026-09-05

Status: USER AUTHORIZED NEXT STAGE

## Locked upstream baseline
- SunVisual Human Visual PASS.
- SunVisual core diameter: 0.50m.
- Corona outer diameter: 0.58m.
- Orbit radius: 20.70m.
- Orbit center authority: AtlasAnchor.
- Orbit plane: vertical Y-Z great circle through Atlas / room centerline.
- Motion: uniform, counter-clockwise from the locked side-view reference.
- Floor y=0 acts as horizon.
- SunVisual appearance/emission remains constant and is decoupled from daylight.

## This gate
Implement only the candidate daylight / shadow authority driven by SunVisual direction.

### Architecture
- Add a dedicated SunDirectionalLight and a small controller under a candidate hierarchy.
- The controller derives light direction directly from current SunVisual -> AtlasAnchor geometry so there is no second clock and no drift.
- Verify actual Unity directional-light forward convention with one shadow sanity check; do not assume sign.

### Daylight behavior
- Above horizon only: directional-light intensity follows sun elevation.
- At or below horizon: candidate SunDirectionalLight intensity is zero.
- Use a smooth elevation curve with no abrupt pop at horizon. Preferred baseline factor: pow(clamp01(sin(elevation)), ~0.6) or an equivalent smooth curve.
- Low sun should produce long shadows; noon short shadows naturally from geometry.
- Lighting color may shift subtly from pale warm ivory at low elevation toward neutral warm daylight at high elevation, but must never become orange/red stylization.
- SunVisual itself must not change color, emission, corona, or animation with time of day.

### Visual target
High-end residential natural daylight:
- clear directional structure,
- readable architectural/furniture/contact shadows,
- hard structure with soft edge,
- no double-sun lighting,
- no overexposed white walls,
- no giant floor specular wash.

### Safety / non-goals
Do not redesign or touch:
- SunVisual accepted material/animation,
- Sun orbit geometry,
- Atlas radius / Boundary Membrane V2,
- Far Sky / Milky Way,
- Interior layout,
- Retrieval,
- furniture,
- global exposure,
- global ambient,
- global reflection,
- production scenes/assets.

Do not implement final night lighting in this gate.
Do not add a Point Light to SunVisual.
Do not use repository-wide audits or unrelated static checks.

### Minimal verification
- Compile PASS.
- Shader errors = 0.
- Blocking runtime errors = 0.
- One shadow-direction sanity check.
- Human review evidence: Morning, Noon, Late Afternoon screenshots plus one short time-lapse showing shadow travel.
- No commit / push / production promotion.
