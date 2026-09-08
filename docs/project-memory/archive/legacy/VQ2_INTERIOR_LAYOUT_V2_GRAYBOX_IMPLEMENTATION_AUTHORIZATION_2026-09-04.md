# VQ2 Interior Layout V2 Graybox Implementation Authorization — 2026-09-04

> Status: USER-AUTHORIZED CANDIDATE GRAYBOX IMPLEMENTATION / DIMENSIONS REMAIN PROVISIONAL UNTIL HUMAN SPATIAL REVIEW
>
> Scope: `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity` only.
>
> This authorization allows the V2 residential + experiment + Retrieval layout to be rebuilt as simple graybox proxies for Human Spatial / Feel review. It does **not** lock exact coordinates, furniture models, final dimensions, materials, lighting, or production promotion.

## 1. Current spatial intent

- West wall toward the south: entrance door.
- West wall, north/right of the door: TV / media position.
- Sofa floats in front of the TV and must not be pushed against the wall.
- Northwest L-wall corner: experiment / workshop / analysis zone. This is the **experiment area**, not a dining area.
- North wall east/right side: large window + bar counter + stools.
- East/open side: Retrieval Station / fishing zone.
- Atlas remains near the center and should not block the TV–sofa sightline.
- The room should read first as a high-end contemporary residential interior, with the experiment and Retrieval functions integrated without turning the space into an office or industrial lab.

## 2. V2 provisional dimensions for graybox

Coordinate frame remains the accepted Open20m floor:
- floor center `(0,0)`;
- west wall / min-X at `X=-10`;
- north wall / max-Z at `Z=10`;
- east and south sides open.

Candidate starting values:

- Door: West wall, center around `Z=-6.6`, approx `1.4m × 2.8m`.
- TV: West wall, center around `Z=-1.8`, screen width approx `2.2–2.5m`.
- Media console: length approx `3.2–3.6m`, depth `0.40–0.48m`.
- Sofa: center around `X=-5.5, Z=-1.8`, footprint approx `3.2–3.6m × 1.0m`.
- Living rug: approx `4.4m × 3.6m`.
- Experiment zone: northwest corner, approximate footprint `X=-9.3..-3.5`, `Z=5.0..9.4`.
- Matter Bench proxy: along the north-wall side of the experiment zone, approx `2.6–3.2m × 0.8–0.9m`.
- Auxiliary experiment bench/storage: along west-wall side, approx `2.4–3.0m × 0.7m`.
- Semi-open experiment divider: approx `1.5–1.8m` tall; do not close to the 6m wall height.
- North-wall window: center around `X=5.5`, width approx `5.2–5.8m`, height `2.1–2.4m`.
- Bar counter: approx `3.8–4.4m` long, `0.55–0.70m` deep; start with three stools.
- Retrieval Station: keep current candidate placement around `(7.25, 1.5)` unless actual graybox review shows a hard conflict.
- Atlas: keep current placement around `(0,0)` unless actual review shows a hard conflict.
- South/open-side lounge / observe area: keep minimal and open; only small proxy seating if needed.

These values are **starting geometry for review**, not final design locks.

## 3. Experiment-zone design rule

The northwest experiment zone is intended to read as a refined atelier / analysis studio rather than a sealed conventional laboratory.

Use simple proxies for:
- L-shaped workbench relationship;
- hidden/storage massing;
- low cabinet + light screen / slat / translucent-divider concept;
- a clear opening about `1.4–1.8m` wide;
- no full-height wall.

Future true containment for hazardous / living / anomalous material remains a separate system and is not represented by this decorative zoning divider.

## 4. Circulation intent

Residential circulation should remain distinct from work logistics.

Residential flow:
`Door -> Living / Sofa -> Bar / Window -> Observe`

Work flow:
`Retrieval -> north side of Atlas -> Experiment / Matter Bench`

Do not route retrieved-object transport through the sofa/rug island or directly through bar stools.

Maintain approximately `1.2–1.5m` comfortable primary circulation where practical, with at least `1.5m` retained on the main work route if space allows.

## 5. Graybox-only boundary

This authorization permits simple blockout / proxy objects only.

Do not yet make or import:
- final TV;
- final sofa;
- final window frame;
- final bar/stools;
- final Matter Bench;
- final experiment furniture;
- decorative objects;
- new lighting;
- Outside sky/event treatment;
- R/P/S implementation;
- production-scene promotion.

Do not redesign accepted:
- 20x20 floor geometry;
- current brightened Oak candidate material;
- current near-white high L-walls;
- wall-outside-buildable-floor placement contract;
- Build Grid math / B toggle;
- current Player, Atlas, Retrieval Station assets unless explicitly required for the graybox review.

## 6. Review gate

After implementation, stop for Human Spatial / Feel Review.

The review should judge:
- entry reveal;
- TV/sofa scale and sightline;
- experiment-zone enclosure vs openness;
- Retrieval-to-experiment logistics;
- window/bar breathing room;
- Atlas relationship to the room;
- overall high-end residential feeling;
- whether the room still has enough negative space.

Only after Human PASS should exact coordinates, final furniture sourcing/modeling, or visual-detail production be locked.
