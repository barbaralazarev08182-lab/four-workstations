# VQ2 Refuge — Current Direction

> Status: **ACTIVE / ARCHITECTURE PAUSED**  
> Updated: 2026-09-08

## Refuge identity

The Refuge is a domestic, inhabitable architectural space inside the Atlas-stabilized domain. It should feel like a real home/work refuge suspended inside an impossible Outside, not a conventional sealed apartment and not a generic sci-fi base.

Major openness toward the Outside is important. A conventional ceiling is not required. Atlas remains a central open spatial anchor.

## Envelope / floor baseline

The Open20m candidate established an accepted light, warm architectural envelope before later zoning experiments:

- buildable floor approximately `20 x 20m`;
- Oak Wood Planks floor family remains Human Visual PASS;
- accepted oak presentation is lighter/open rather than dark-heavy;
- candidate oak material used URP/Lit, `10 x 10` tiling over the 20m floor, metallic `0`, roughness packed as smoothness, normal + AO maps;
- the Build Grid foundation remains independent from the floor material;
- earlier basic outer wall/floor appearance passed Human review, but that PASS does **not** lock later internal zoning or final room architecture.

If the live local candidate differs, live serialized state + latest Human direction wins.

## Current architectural stance

Latest Human direction allows and likely requires **selected real internal walls** for stronger zoning. This supersedes the older idea that screens/dividers alone should carry most spatial organization.

At the same time:

- do not turn the Refuge into a corridor maze;
- preserve a breathable central spatial field;
- rooms/zones should form around the Refuge rather than consuming it;
- sightlines to Atlas and the Outside should remain deliberate;
- architectural elements should feel designed, not like oversized gray blockout slabs.

## Architectural Zoning Rework V1 verdict

`Architectural Zoning Rework V1` = **HUMAN VISUAL / SPATIAL FAIL — ROLLED BACK**.

Rejected characteristics included:

- oversized gray slab walls;
- maze-like partitioning;
- weak proportion/language;
- Garden that did not read as the intended viewing courtyard;
- loss of the previous central-space character.

Important distinction:

> Reject the V1 implementation, not the broader idea of stronger architectural zoning.

Do not repair V1 incrementally. When architecture is reopened, redesign from the Human spatial intent.

## Still-open Human spatial intent

The following broader direction remains valid for redesign:

- **Northwest Experiment** — should eventually read as a more real architectural room/zone;
- **East / northeast** — Bar + Social/Dining or similarly coherent social room;
- social table + four chairs belong inside the social room rather than floating in an undefined open field;
- **Southeast** — Retrieval/Fishing belongs in an open technical area, separate from Bar/Social;
- **South** — semi-circular Garden / Viewing Court;
- **Southwest** — readable entrance plus an unresolved filter/foyer/divider element.

Exact transforms and dimensions are not locked by the failed V1.

## Garden / Viewing Court direction

The Garden is a human/domestic Refuge feature and is allowed even though the Outside itself must not contain human artifacts.

Desired character:

- low unusual/sculptural curved enclosure rather than tall ordinary drywall;
- textured/translucent large glass direction rather than fully transparent invisible glass;
- 1–2 taller trees may rise above the low wall;
- sparse seating supports sitting and looking at the Outside;
- the Garden should feel like a viewing court and domestic refuge zone, not a fenced patch of turf.

Human-supplied grass source/reference:

- BlendKit `Proximity Grass Scatter (Geometry Nodes)`
- `https://www.blendkit.com/asset-gallery-detail/bbf4398f-2eb1-4d1d-8c28-0eddba1e7d2a/`

Unity cannot run Blender Geometry Nodes directly. If used, bake/constrain/optimize the geometry for the actual Garden footprint; do not blindly import a huge procedural scene.

## Northwest Experiment current status

Before the failed full zoning pass, the Northwest Experiment architectural rework reached **PASS WITH MINOR FIXES**, followed by a narrow cleanup.

Reported cleanup included:

- shallower Solid Anchor return;
- visible wood inset + shadow reveal;
- very thin non-collision floor field overlay;
- more continuous low plinth/joint integration.

The post-cleanup state has not received a final explicit Human Visual PASS. Do not label it final/locked.

## Furniture / domestic stance

Do not restart a whole-Refuge furniture shuffle by default.

Future interior work should preferably establish one strong Human-approved view/zone first, then reuse that visual language elsewhere.

The runtime player-driven furniture placement + persistence system remains a protected baseline. Graybox/reference furniture may remain until the user replaces it through actual placement.

## Current priority

Refuge architecture is paused while the Human is working on the Outside / Universe visual layer.

Do not automatically resume interior layout or lighting because another task completes.
