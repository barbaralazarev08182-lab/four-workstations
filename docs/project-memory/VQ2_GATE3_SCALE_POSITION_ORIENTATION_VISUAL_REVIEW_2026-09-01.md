# VQ2 Gate 3 — Scale / Position / Orientation / Material Visual Review

> Date: 2026-09-01
> Status: ACTIVE VISUAL REVISION / LATEST USER DECISION
> Scope: Rest Edge seat scale refinement, locked Retrieval Station/Orb composition, authorized room cleanup, and restoration of the user assets' original materials/textures in Unity.

## Latest user decision — supersedes prior seat-scale recommendations

The latest Human Visual direction supersedes all earlier recommendations in this file where they conflict.

Current authoritative next-candidate values and composition rules:

- Rest Edge Seat presentation scale: **2.5 -> 2.0**.
- Rest seats must remain **flush with the Rest Edge** after shrinking.
- Keep the existing four-seat ordering and general locations/rhythm; only minimal position compensation is allowed to preserve edge contact after the scale change.
- Retrieval Station: **current scale, current position, current Y=180 orientation, and current edge placement are accepted for now and must remain unchanged**.
- Retrieval Orb: **current reduced size and current docking relationship are accepted for now and must remain unchanged**.
- Remove the user-circled **unused green floor rug at the left side of the room**.
- Remove the user-circled **right-side dining set in full: dining table plus all associated dining seating/bench/chairs and dependent tabletop place-setting props**.
- The current white appearance of the imported user assets is **not** a valid final visual state. Their existing source textures/material information must now be correctly restored/bound in Unity before the next meaningful Human Visual review.

The room-cleanup deletions and material-binding restoration are explicitly authorized for the next isolated candidate.

## Edge-contact invariant — LOCKED

The intended visual rule is not "keep exact old coordinates regardless of scale."

The intended rule is:

> Preserve the designed edge relationship after scale changes.

Therefore Codex may make the **minimum position compensation required by the Seat scale change** so that the visible seat boundary remains snapped to the same physical Rest floor edge.

This compensation is not a redesign and must not be used to re-space the composition arbitrarily.

Required relationship:

- Rest Edge: the outward edge of each seat module remains flush with the real open floor boundary; no dead strip of floor may reopen between the row and Outside.
- Retrieval Edge: already visually accepted in the current candidate; do not change Station/Orb scale, position, or orientation during this pass.

## Rest Edge contract

Keep the current four-seat ordering and overall rhythm.

Change the shared Rest seat presentation scale from **x2.5 to x2.0**.

After shrinking, apply only the minimal positional compensation needed to keep the four seat modules physically snapped to the same Rest Edge.

Do not:

- move the row inward and leave a new empty strip;
- redesign the spacing pattern;
- create independent seat meshes;
- add railings/platforms/extra geometry.

The four instances must continue to share one mesh/material asset.

Approximate expected per-seat world bounds, derived from the original x3 reported candidate under uniform scaling:

- x3 reference: about `2.143233 x 1.118077 x 1.348740 m`;
- expected x2.0: about `1.428822 x 0.745385 x 0.899160 m`.

These are engineering expectations only; actual Unity renderer/world bounds must be reported.

## Retrieval Station / Orb contract — HOLD CURRENT

The user explicitly states that the Retrieval Station and Orb are currently visually acceptable.

Therefore in this pass:

- do not change Retrieval Station presentation scale;
- do not change Retrieval Station position except if an existing candidate-build script would otherwise accidentally move it; preserve the current accepted world transform;
- keep Y rotation at **180 degrees**;
- keep the Station base flush with the Retrieval floor edge;
- keep Guide Arm direction toward Outside;
- do not change Retrieval Orb world size;
- preserve the current `Orb_CradleSocket` docking relationship;
- do not modify protected Station or Orb source FBX files.

The previously approved working candidate values (Station x3.5 and reduced Orb world size) remain the active reference unless later Human Visual direction changes them.

## Authorized room cleanup

The user marked two obsolete room elements for removal.

### A. Left-side unused green floor rug

Remove the isolated/unused green rug visible on the left side of the room, near the door/front-left workstation area.

Rules:

- remove or disable the actual scene object/renderers if it is an independent object;
- if the rug is part of a merged protected mesh/renderer group, inspect the source hierarchy/submeshes first;
- do not destructively cut or rewrite an unrelated protected merged mesh merely to remove this rug;
- if destructive editing would be required, stop and report the exact renderer/mesh/submesh ownership rather than guessing.

Goal: the visible green rug circled by the user must no longer appear in the candidate.

### B. Right-side dining set

Remove the entire user-circled dining set:

- dining table;
- all dining chairs;
- bench/seating associated with that table;
- tabletop plates/cups/place-setting props that only belong to that dining set.

Do not replace the dining set with new furniture or decoration in this pass.

Goal: preserve deliberate negative space around the Retrieval Edge rather than filling the area with replacement props.

## Material / texture binding — NOW AUTHORIZED

The previous intake report established that the user FBX assets contain embedded/source texture data including 4096x4096 BaseColor, Normal, Metallic, and Roughness maps, but Unity did not correctly connect those maps to the URP materials. The white candidate appearance is therefore a material-import/binding blocker, not the intended visual design.

For the next isolated candidate, after applying the seat-scale and room-cleanup changes above, restore the actual user-authored material appearance without redesigning it.

Required material rules:

1. Preserve every protected source FBX byte-for-byte.
2. Extract/copy embedded texture assets into a controlled Unity asset location if Unity requires explicit external texture files.
3. Preserve source texture identity and report hashes/paths for extracted textures where practical.
4. Create or repair Unity URP materials that bind the existing source channels correctly.
5. BaseColor/albedo -> URP Base Map.
6. Normal -> URP Normal Map with correct texture import type.
7. Metallic -> URP Metallic input.
8. Roughness must be converted/bound correctly for URP smoothness semantics (`smoothness = 1 - roughness`) rather than used unmodified as smoothness.
9. Do not repaint, recolor, regenerate, or AI-replace any user texture.
10. Do not invent a new material style because a channel is inconvenient to import.
11. Seat, Station, Orb, and Returning Piece should retain their original authored texture appearance to the maximum extent supported by the source files.
12. If a source FBX uses a single material for visually different Station/Orb regions, do not destructively split geometry merely to enable future emission. Report that limitation separately. Material restoration comes first.
13. Retrieval Orb emission/glow behavior is **not** authorized yet unless the source itself already contains a clearly identifiable emissive channel that can be restored non-destructively. Otherwise restore its normal PBR appearance first and defer authored emission control to a later gate.
14. Do not modify Atlas materials during this pass.

The next screenshots should no longer use the white placeholder material state for these user assets.

## What must remain unchanged in this pass

Do not change:

- Retrieval Station accepted scale/position/Y=180 orientation;
- Retrieval Orb current world size/docking;
- current Retrieval edge-side working direction;
- protected source FBX files;
- Atlas baseline;
- Production Office/N1R authoritative files directly;
- mesh topology/triangle counts of the user assets;
- pivots/sockets;
- gameplay, runtime tether, animation, physics, or Atlas polish.

Material/texture binding is explicitly allowed only to restore the existing user-authored PBR appearance; it is not authorization for a material redesign.

This remains an isolated candidate until Human Visual approval.

## Required next evidence

After applying Seat x2.0, edge re-snap, authorized cleanup, and material restoration, provide:

1. canonical full-room Day screenshot with restored user-asset materials;
2. Rest Edge close screenshot showing all four x2.0 seats, their real material, and the real floor edge;
3. Retrieval Edge close screenshot showing the unchanged Station + Orb transforms, restored materials, and the real floor edge;
4. screenshot/clear evidence showing the left green rug removed;
5. screenshot/clear evidence showing the right dining table + associated seating/props removed;
6. exact final Seat presentation/root/local scale and world bounds;
7. Rest seat edge-to-floor-boundary distance after compensation, expected effectively `0 m`;
8. exact Seat position delta introduced only by edge-snap compensation;
9. confirmation that Station/Orb transforms and scales are unchanged from the current accepted candidate;
10. material inventory per user asset: material name, shader, BaseColor path, Normal path, Metallic path, Roughness/source path, and any generated smoothness/packed map path;
11. before/after explanation of why the prior import appeared white and how the URP binding was repaired;
12. compile / PlayMode / Console blocking status;
13. protected Office / N1R / Atlas / source FBX hashes unchanged;
14. if either cleanup target belongs to a merged protected mesh, report ownership and the non-destructive handling choice explicitly.

Do not commit or promote this candidate until the user visually reviews the screenshots.

Do not proceed to mesh reduction before this material-restored candidate is visually reviewed.

## Interaction constraint for planning sessions

Do not generate or edit images unless the user's **current message explicitly contains the exact phrase `生成图片`**.

Reference images or image attachments alone are not authorization to invoke image generation.