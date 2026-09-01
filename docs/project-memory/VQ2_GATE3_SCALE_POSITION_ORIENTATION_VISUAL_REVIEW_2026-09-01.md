# VQ2 Gate 3 — Scale / Position / Orientation Visual Review

> Date: 2026-09-01
> Status: ACTIVE VISUAL REVISION / LATEST USER DECISION
> Scope: Rest Edge seats and Retrieval Station/Orb scale refinement after the x3 edge-placement candidate.

## Latest user decision — supersedes the earlier x3 recommendation

The previous recommendation to keep all three presentation scales at x3 is superseded by the user's latest explicit Human Visual direction.

The current edge roles and working orientations are correct, but after changing scale the assets must still remain physically snapped to their respective open floor edges.

Current authoritative next-candidate values:

- Rest Edge Seat presentation scale: **3.0 -> 2.5**.
- Retrieval Station presentation scale: **3.0 -> 3.5**.
- Retrieval Orb: **reduce its current world size by 50%**.
- Rest seats must remain **flush with the Rest Edge** after scaling.
- Retrieval Station must remain **flush with the Retrieval Edge** after scaling.
- Retrieval Station keeps **Y = 180 degrees** and the guide/working direction toward Outside.

This edge-contact relationship is higher priority than preserving the previous root coordinates byte-for-byte.

## Edge-contact invariant — LOCKED

The intended visual rule is not "keep the exact old coordinates regardless of scale."

The intended rule is:

> Preserve the same designed edge relationship after scale changes.

Therefore Codex may make the **minimum position compensation required by the scale change** so that the visible model boundary remains snapped to the same physical floor edge.

This compensation is not a redesign and must not be used to re-space the composition arbitrarily.

Required geometric relationship:

- Rest Edge: the outward edge of each seat module remains flush with the real open floor boundary; no dead strip of floor may reopen between the row and Outside.
- Retrieval Edge: the Station base remains floor-supported and its outward/base edge remains flush with the real Retrieval floor boundary; the guide arm continues to reach toward Outside.
- Edge distance after correction should be effectively zero within normal floating-point / renderer-bounds tolerance.

## Rest Edge contract

Keep the current four-seat ordering and overall rhythm from the accepted x3 edge-placement candidate.

Change the shared Rest seat presentation scale from x3 to **x2.5**.

After shrinking, apply only the minimal positional compensation needed to keep the four seat modules physically snapped to the same Rest Edge.

Do **not**:

- move the row inward and leave a new empty strip;
- redesign the spacing pattern;
- create independent seat meshes;
- add railings/platforms/extra geometry.

The four instances must continue to share one mesh/material asset.

Approximate expected per-seat world bounds from the current reported x3 candidate, assuming uniform scale:

- current x3: about `2.143233 x 1.118077 x 1.348740 m`;
- expected x2.5: about `1.786028 x 0.931731 x 1.123950 m`.

These bounds are an engineering expectation only; actual Unity bounds should be reported after the change.

## Retrieval Station contract

Keep the current Retrieval Station **Y rotation at 180 degrees**.

Keep the current working direction toward Outside.

Change Station presentation scale from x3 to **x3.5**.

Because the Station becomes larger, apply only the minimal position compensation needed to preserve:

- base bottom on the floor;
- Station/base outward edge snapped to the real Retrieval Edge;
- guide arm still facing/reaching Outside.

Do not preserve the old root position if that would cause the enlarged Station to drift off the edge relationship.

Approximate expected Station world bounds from the current reported x3 candidate:

- current x3: about `2.353425 x 1.916376 x 2.812902 m`;
- expected x3.5: about `2.745663 x 2.235772 x 3.281719 m`.

## Retrieval Orb contract

The Orb must become **half of its current x3-candidate world size**.

The current reported Orb x3 world bounds are approximately:

`0.810094 x 0.894525 x 0.798053 m`.

The target world bounds are therefore approximately:

`0.405047 x 0.447263 x 0.399027 m`.

Implementation requirement:

- treat this as a final **world-space visual-size target**, not simply 'half the local scale' if the Orb inherits the Station's new x3.5 presentation root;
- preferred simple implementation is to keep Orb presentation scaling independent from Station and change Orb presentation factor from x3 to **x1.5**;
- if hierarchy constraints require Orb to inherit Station x3.5, compensate its nested local scale so its final world size is still exactly 50% of the current x3 candidate;
- preserve `Orb_CradleSocket` docking position/orientation relationship;
- do not modify the protected Orb source FBX.

Do not enlarge the Orb together with the Station.

## What must remain unchanged in this pass

Do not change:

- the four-seat ordering / composition intent except minimum edge-snap compensation caused by scaling;
- Retrieval Station Y=180 orientation;
- current edge-side working direction;
- protected source FBX files;
- Atlas baseline;
- Production Office/N1R;
- materials/textures;
- mesh topology/triangle counts;
- pivots/sockets unless required only to preserve the same docking transform;
- gameplay, runtime tether, animation, or physics.

Position changes are allowed **only** to preserve the locked edge-contact invariant after changing scale.

## Required next evidence

After applying the revised scales and re-snapping to the same physical edges, provide:

1. canonical full-room Day screenshot;
2. Rest Edge close screenshot showing all four seats **and the real floor edge**;
3. Retrieval Edge close screenshot showing Station + Orb **and the real floor edge**;
4. exact final presentation/root/local scales for Seat, Station, and Orb;
5. exact final world bounds for each;
6. Rest seat edge-to-floor-boundary distance after compensation, expected effectively `0 m`;
7. Retrieval Station base edge-to-floor-boundary distance after compensation, expected effectively `0 m`;
8. exact position delta introduced only by edge-snap compensation;
9. confirmation that Station remains Y=180 degrees;
10. Orb world-size ratio versus prior candidate, expected about `0.5` on all axes;
11. Compile / PlayMode / Console blocking status;
12. protected Office / N1R / Atlas / source FBX hashes unchanged.

Do not commit or promote this spatial candidate until the user visually reviews the new screenshots.

Do not proceed to material binding before this revised scale-and-edge-snap candidate is reviewed.