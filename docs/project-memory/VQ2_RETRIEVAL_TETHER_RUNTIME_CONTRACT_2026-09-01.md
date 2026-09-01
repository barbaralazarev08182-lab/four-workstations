# VQ2 Retrieval Tether — Runtime Contract

> Date: 2026-09-01
> Status: CURRENT TECHNICAL DIRECTION

## Purpose

Define the ownership boundary and preferred Unity implementation for the Retrieval tether/cable.

## Locked responsibility split

User-authored 3D assets:

- Retrieval Station visible geometry;
- steerable guide arm / reel housing / visible terminal guide head;
- Retrieval Orb visible geometry;
- visible hard attachment hardware.

Codex/runtime responsibility:

- the flexible powered tether/cable itself;
- runtime cable length;
- reel-out / reel-in behavior;
- slack / tension appearance;
- cable response while the Orb moves upward, downward, horizontally, or diagonally;
- future disturbance/interaction behavior as explicitly authorized.

Do not require the user to author a long flexible cable mesh.

## Physical endpoint contract — LOCKED

The free cable must originate from the **very end of the Station's long guide arm / rod**, at the visible terminal guide head.

It must not visually originate from:

- the Station body;
- yaw assembly;
- reel housing;
- arm base;
- an approximate point near the center of the Station.

Required transforms:

- `Tether_GuideTip` — exactly aligned to the visible terminal head at the far end of the long guide arm;
- `Orb_TetherAttach` — physical cable attachment point on the Orb;
- `Orb_CradleSocket` — stored Orb pose in the Station's front circular basket/cradle.

If the existing `Tether_GuideTip` socket is misplaced, a runtime/socket correction is authorized without changing visible Station geometry.

## Powered-tether meaning — LOCKED

The tether is not primarily a passive fishing line.

It is a **powered umbilical / electrical cable** supplying the Orb with the energy required to remain active outside the stable room space.

Therefore:

- the Orb is active and self-directed while connected;
- the cable does not suspend the Orb as a passive weight;
- the Orb can travel upward, downward, horizontally, and diagonally;
- the cable follows and constrains maximum reach but should not force pendulum/bobber behavior;
- the eventual maximum cable length should allow the Orb to travel beyond the player's visible screen into the Outside space, temporarily referred to as the "universe".

## Stored state — LOCKED

When unused, the Orb is stored in the **front circular basket/cradle on the Station base**.

It must not:

- hang from the rod tip;
- remain floating beside the Station;
- be stored on the rod itself.

Retrieval ends with the Orb returning precisely to `Orb_CradleSocket` in that front basket/cradle.

For the current prototype, the cable may remain connected while Stored, showing only the short flexible run from the rod-end guide tip to the docked Orb. Automatic plug/unplug behavior is deferred.

## Preferred implementation strategy

Do not begin with a fully simulated industrial rope.

Preferred architecture:

1. Unity `LineRenderer` or equivalent procedural spline/curve is the visible cable;
2. endpoints follow `Tether_GuideTip` and `Orb_TetherAttach`;
3. a small sampled curve creates flexible cable shape;
4. slack/tension changes the curve dynamically;
5. tension straightens the cable;
6. slack allows a restrained curve, but gravity should not dominate the Orb's motion;
7. reel-out/reel-in changes permitted cable length rather than scaling a modeled mesh.

A later physics layer may use lightweight constrained particles / Verlet-style rope if interaction requires it. Full per-segment rigidbody chains are not the default.

## Directional Retrieval requirement

The powered Orb must structurally support:

- upward travel;
- downward travel;
- horizontal travel;
- diagonal travel.

The system must not assume the Orb always hangs below the room under ordinary gravity.

## Runtime state vocabulary

- `Stored` — Orb in the front basket/cradle;
- `Deploying` — Orb leaves the cradle and cable length increases;
- `Holding` — Orb actively maintains a target position;
- `Contact` — future outside interaction state;
- `Tension` — cable approaches permitted length and straightens;
- `Heavy Tension` — later stronger tension feedback;
- `Retrieving` — permitted cable length decreases and Orb returns;
- `Docking` — Orb returns into the front basket/cradle;
- `Stored` — exact cradle pose restored.

## Current prototype rule

Prioritize:

- correct rod-tip origin;
- correct front-cradle storage;
- readable powered-cable behavior;
- stable long-distance deploy/retrieve;
- no drift.

Do not add attraction content, loot, economy, QTEs, or full rope collision physics yet.

## One-line ownership rule

> User models the Station and Orb; Codex generates the powered flexible cable and its runtime behavior in Unity.