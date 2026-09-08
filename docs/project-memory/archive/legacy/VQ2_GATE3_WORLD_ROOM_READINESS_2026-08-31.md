# VQ2 Gate 3 — World & Room Readiness

> Date: 2026-08-31
> Status: PRE-GAMEPLAY WORLD BUILD
> Implementation authorization: world/visual readiness only; no gameplay systems yet

## Why Gate 3 exists

The project is not ready to move directly from creature rigging into gameplay. The current room still carries historical office composition, Atlas has not yet been physically designed, the two open edges do not yet have strong visual identities, and the first recovered/world objects are not present. Building interaction/gameplay logic against temporary world content would create avoidable rework.

Gate 3 therefore proves the visible world before gameplay.

## Character status

PEBBLE V1 remains the accepted resident body at a current static target height of 1.15 m with the wide embedded LightBand. Gate 2C animation/manipulation presentation remains open and is intentionally paused. Current candidate Carry/Pull/Inspect/AtlasReach poses are not an accepted animation baseline.

No creature redesign is part of Gate 3.

## Gate 3 objective

From the frozen Office camera, the room should already read as Four Workstations even with no UI and no gameplay running:

> four unusual residents live in a warm but impossible small world; a strange central construction is becoming meaningful; two open edges clearly belong to different activities/relationships with the unknown; the space visibly carries room for history, recovery and future growth.

## Gate 3A — Room identity cleanup / readiness audit

Do not redesign the full room. Audit current visible content and classify:
- KEEP: protected workstations, approved architectural/material/lighting baseline, useful domestic props
- REMOVE/DEFER: historical human-character staging, sofa or legacy furniture that weakens the VQ2 identity, stale waypoints/content with no future role
- RESERVE: Atlas center, Rest Edge, Retrieval Edge, wall-history panel, future research/cultivation areas, circulation

Production Office changes require a deliberate later visual pass; first produce an isolated candidate proposal.

## Gate 3B — Atlas visual design and first physical stages

Atlas is the first major new world asset.

Preserve the established fiction/design role:
- not a normal upgrade building
- not a hidden multiplayer menu
- a long-term mythic communal construction
- pre-existing/not-fully-understood central foundation plus resident construction
- warm handmade miniature-world material language
- no generic hologram table, glowing portal ring, cyberpunk console, glossy sci-fi machine

Design only the first three states now:

### Stage 0 — Quiet Foundation
A low central object/foundation that looks oddly specific but does not explain itself.

### Stage 1 — First Fit
One recovered/constructed component fits with suspicious precision. The object becomes visibly more intentional and starts to reveal radial/module logic.

### Stage 2 — Response
One restrained moving/responding element and one restrained luminous/material response prove the object is not passive. No readable UI/text. No remote room imagery.

Later Pattern/Echo/Window/Ouroboros stages remain conceptually reserved but are not modeled now.

## Atlas production method

Formal 3D geometry follows the project asset rule:
1. user + ChatGPT define visual concept and engineering envelope
2. generate clean visual references / multi-view input
3. user generates the real asset with Hunyuan3D
4. Codex handles source preservation, normalization, materials, sockets, Unity integration and QA
5. Codex does not design final Atlas geometry itself

Greybox geometry is allowed only for size/clearance validation.

## Gate 3C — Open-edge visual identity

The two wall-less floor edges must stop reading as generic missing walls.

### Rest / watch / social edge
Should communicate that residents casually inhabit the boundary: sit, watch, rest, share silence. It should feel culturally normal to the residents, not like a safety hazard or balcony.

### Retrieval / salvage edge
Should communicate controlled reaching/recovery into an external unknown. It needs a different visual identity from the rest edge and should suggest tethering, retrieval, or repeated contact without turning into a conventional fishing dock.

Do not define the Outside as ocean, space, void, or horror environment.

## Gate 3D — First world-content set

Only a small first batch is required:
- 1–2 ordinary recovered objects
- Returning Piece
- one Atlas First Fit component
- minimal retrieval-edge physical apparatus/anchor
- minimal rest-edge environmental dressing
- wall-history visual reserve, not the full crack/repair gameplay chain

Avoid generic ore/material loot, shop clutter, quest props and decorative filler with no world role.

## Gate 3E — Frozen-camera room review

Before semantic interaction/gameplay begins, require Human Visual PASS on an isolated VQ2 room candidate.

The room must communicate, without UI:
- this is a lived miniature world, not just an office
- PEBBLE belongs here
- Atlas is a central mystery/construction, not decoration
- the two edges have clearly different meaning
- future history/retrieval/growth can physically accumulate without blocking circulation

Do not require final release polish. Target approximately 70% visual/world identity confidence, enough to stop rebuilding systems around temporary content.

## Out of scope for Gate 3

- NavMesh production architecture
- Semantic Interaction runtime
- Retrieval gameplay loop
- object persistence/save-load implementation
- Focus gameplay
- economy
- Atlas gameplay state machine
- stranger room
- networking
- Ouroboros
- costly influence
- final PEBBLE animation polish

## Recommended order

1. pause Gate 2C presentation work
2. room content/readiness classification
3. Atlas Stage 0/1/2 concept design
4. Hunyuan Atlas asset production + Unity intake
5. rest/retrieval edge visual identity
6. first recovered/world props
7. full-room frozen-camera Human Visual PASS
8. only then begin Semantic Interaction Foundation
