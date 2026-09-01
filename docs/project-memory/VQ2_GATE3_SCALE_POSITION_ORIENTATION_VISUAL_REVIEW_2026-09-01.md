# VQ2 Gate 3 — Scale / Position / Orientation Visual Review

> Date: 2026-09-01
> Status: ACTIVE VISUAL REVISION / LATEST USER DECISION
> Scope: Rest Edge seats and Retrieval Station/Orb scale refinement after the x3 edge-placement candidate.

## Latest user decision — supersedes the earlier x3 recommendation

The previous recommendation to keep all three presentation scales at x3 is superseded by the user's latest explicit Human Visual direction.

The current candidate positions and orientations are visually useful and should remain unchanged. Only scale is to change as follows:

- Rest Edge Seat presentation scale: **3.0 -> 2.5**.
- Retrieval Station presentation scale: **3.0 -> 3.5**.
- Retrieval Orb: **reduce its current world size by 50%**.

This is the current authoritative visual direction for the next candidate.

## Rest Edge contract

Keep all four seat instance coordinates exactly as they are in the current x3 candidate.

Do not re-space or move the four seats during this correction pass.

Only change the shared Rest seat presentation scale from x3 to x2.5.

The four instances must continue to share one mesh/material asset; do not create independent seat copies.

Because root coordinates are explicitly locked for this pass, do not automatically re-snap the seats to the floor boundary after scaling unless the user later requests it.

Approximate expected per-seat world bounds from the current reported x3 candidate, assuming uniform scaling about the current pivot:

- current x3: about `2.143233 x 1.118077 x 1.348740 m`;
- expected x2.5: about `1.786028 x 0.931731 x 1.123950 m`.

These bounds are an engineering expectation only; actual Unity bounds should be reported after the change.

## Retrieval Station contract

Keep the current Retrieval Station position unchanged.

Keep its current Y rotation at **180 degrees**.

Keep its current floor-edge placement/direction unchanged.

Only change Station presentation scale from x3 to **x3.5**.

Approximate expected Station world bounds from the current reported x3 candidate:

- current x3: about `2.353425 x 1.916376 x 2.812902 m`;
- expected x3.5: about `2.745663 x 2.235772 x 3.281719 m`.

The guide arm must continue pointing toward Outside. Do not rotate or reposition the Station during this pass.

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

- all current seat coordinates;
- Retrieval Station position;
- Retrieval Station Y=180 orientation;
- current edge-side working direction;
- protected source FBX files;
- Atlas baseline;
- Production Office/N1R;
- materials/textures;
- mesh topology/triangle counts;
- pivots/sockets unless required only to preserve the same docking transform;
- gameplay, runtime tether, animation, or physics.

## Required next evidence

After applying only the scale changes, provide:

1. canonical full-room Day screenshot;
2. Rest Edge close screenshot showing all four seats;
3. Retrieval Edge close screenshot showing Station + Orb;
4. exact final presentation/root/local scales for Seat, Station, and Orb;
5. exact final world bounds for each;
6. confirmation that seat coordinates are byte/value-identical to the prior candidate;
7. confirmation that Station position and Y=180 rotation are unchanged;
8. Orb world-size ratio versus prior candidate, expected about `0.5` on all axes;
9. Compile / PlayMode / Console blocking status;
10. protected Office / N1R / Atlas / source FBX hashes unchanged.

Do not commit or promote this spatial candidate until the user visually reviews the new screenshots.

Do not proceed to material binding before this revised scale candidate is reviewed.