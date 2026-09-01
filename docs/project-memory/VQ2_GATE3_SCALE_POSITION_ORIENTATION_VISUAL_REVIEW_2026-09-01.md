# VQ2 Gate 3 — Scale / Position / Orientation Visual Review

> Date: 2026-09-01
> Status: ACTIVE VISUAL REVISION / LATEST USER DECISION
> Scope: Rest Edge seat scale refinement, locked Retrieval Station/Orb composition, and authorized room cleanup.

## Latest user decision — supersedes prior 2.5-seat recommendation

The latest Human Visual direction supersedes all earlier recommendations in this file where they conflict.

Current authoritative next-candidate values and composition rules:

- Rest Edge Seat presentation scale: **2.5 -> 2.0**.
- Rest seats must remain **flush with the Rest Edge** after shrinking.
- Keep the existing four-seat ordering and general locations/rhythm; only minimal position compensation is allowed to preserve edge contact after the scale change.
- Retrieval Station: **current scale, current position, current Y=180 orientation, and current edge placement are accepted for now and must remain unchanged**.
- Retrieval Orb: **current reduced size and current docking relationship are accepted for now and must remain unchanged**.
- Remove the user-circled **unused green floor rug at the left side of the room**.
- Remove the user-circled **right-side dining set in full: dining table plus all associated dining seating/bench/chairs**.

The room-cleanup deletions are explicitly authorized for the next isolated candidate.

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
- do not change Retrieval Station position;
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
- table-top place settings/props only if they belong to the dining-set group and are no longer meaningful once the table is removed.

Do not replace the dining set with new furniture or decoration in this pass.

Goal: preserve deliberate negative space around the Retrieval Edge rather than filling the area with replacement props.

## What must remain unchanged in this pass

Do not change:

- Retrieval Station scale/position/Y=180 orientation;
- Retrieval Orb current world size/docking;
- current Retrieval edge-side working direction;
- protected source FBX files;
- Atlas baseline;
- Production Office/N1R authoritative files directly;
- materials/textures;
- mesh topology/triangle counts of the user assets;
- pivots/sockets;
- gameplay, runtime tether, animation, physics, or Atlas polish.

This remains an isolated candidate until Human Visual approval.

## Required next evidence

After applying Seat x2.0, edge re-snap, and the authorized cleanup, provide:

1. canonical full-room Day screenshot;
2. Rest Edge close screenshot showing all four x2.0 seats and the real floor edge;
3. Retrieval Edge close screenshot showing the unchanged Station + Orb and the real floor edge;
4. screenshot/clear evidence showing the left green rug removed;
5. screenshot/clear evidence showing the right dining table + associated seating removed;
6. exact final Seat presentation/root/local scale and world bounds;
7. Rest seat edge-to-floor-boundary distance after compensation, expected effectively `0 m`;
8. exact Seat position delta introduced only by edge-snap compensation;
9. confirmation that Station/Orb transforms and scales are unchanged from the current accepted candidate;
10. compile / PlayMode / Console blocking status;
11. protected Office / N1R / Atlas / source FBX hashes unchanged;
12. if either cleanup target belongs to a merged protected mesh, report ownership and the non-destructive handling choice explicitly.

Do not commit or promote this candidate until the user visually reviews the screenshots.

Do not proceed to material binding before this revised Seat-scale-and-cleanup candidate is reviewed.

## Interaction constraint for planning sessions

Do not generate or edit images unless the user's **current message explicitly contains the exact phrase `生成图片`**.

Reference images or image attachments alone are not authorization to invoke image generation.