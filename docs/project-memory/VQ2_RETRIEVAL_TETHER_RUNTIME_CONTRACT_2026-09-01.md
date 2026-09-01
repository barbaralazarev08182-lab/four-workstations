# VQ2 Retrieval Tether — Runtime Contract

> Date: 2026-09-01  
> Status: CURRENT TECHNICAL DIRECTION / NOT YET GAMEPLAY AUTHORIZATION

## Purpose

Define the ownership boundary and preferred Unity implementation for the Retrieval tether/line so the user does not waste time modeling a flexible cable that should be runtime-driven.

## Locked responsibility split

User-authored 3D assets:

- Retrieval Station visible geometry;
- steerable guide arm / reel housing / guide eye geometry;
- Retrieval Orb visible geometry;
- visible hard attachment hardware that belongs to those meshes.

Codex/runtime responsibility:

- the flexible tether/line itself;
- runtime line length;
- reel-out / reel-in behavior;
- slack / tension appearance;
- line response while the Orb moves upward, downward, horizontally, or diagonally;
- contact-state vibration / disturbance;
- future line physics, collision, and failure/stability behavior as explicitly authorized.

Do not require the user to author a long flexible line mesh in Hunyuan3D.

## Asset socket contract

The final Station / Orb asset family should expose or permit Codex to add these transforms without changing visible geometry:

- `Tether_ReelExit` — where the flexible line leaves the reel/housing;
- `Tether_GuideTip` — final guide-eye / arm exit point before the line enters free space;
- `Orb_TetherAttach` — physical tether attachment point on the Orb.

Optional later transforms:

- `Orb_Dock` / `Orb_Cradle` — stored Orb pose;
- intermediate guide/socket points if the final apparatus routes the line through more than one visible eyelet.

## Preferred implementation strategy

Do not begin with a fully simulated industrial rope.

Preferred architecture is a hybrid procedural tether:

1. Unity `LineRenderer` or equivalent procedural tube/spline is the visible line;
2. endpoints follow `Tether_GuideTip` and `Orb_TetherAttach`;
3. a small sampled curve creates natural slack instead of a perfectly straight laser-like line;
4. slack/tension changes the curve shape dynamically;
5. when tension increases, the line straightens and may show restrained high-frequency vibration;
6. when slack increases, the line forms a smooth sag / loose curve;
7. reel-out/reel-in changes permitted tether length rather than scaling a modeled mesh.

A later physics layer may use a lightweight constrained-particle / Verlet-style rope representation if visual interaction requires it. Full per-segment rigidbody chains are not the default because they are more prone to jitter, collision instability, and unnecessary complexity.

## Directional Retrieval requirement

The tether must support:

- upward contact;
- downward contact;
- horizontal contact;
- diagonal contact.

Its behavior must not assume the Orb always hangs below the room under ordinary gravity.

Recommended world-rule presentation:

- the short segment still inside/near the room stable frame may retain mild ordinary slack/gravity behavior;
- after the tether crosses the open boundary, its shape may become more correspondence-driven and less conventionally gravitational;
- this allows an Orb cast upward to remain above/outside rather than being visually forced back into an ordinary fishing-line pendulum.

Exact fiction/physics blending remains tunable during a later gameplay/visual prototype.

## Visual state vocabulary

Potential tether states, to be proven later rather than implemented blindly:

- `Stored` — Orb docked, little/no exposed free tether;
- `Deploying` — line length increasing smoothly;
- `Free / Calm` — mild slack and restrained motion;
- `Contact` — localized directional disturbance / pulse;
- `Tension` — line becomes visibly straighter;
- `Heavy Tension` — stronger straightening plus subtle vibration;
- `Unstable` — irregular lateral wave/disturbance;
- `Retrieving` — permitted length decreases while the line remains continuous;
- `Docking` — Orb returns to cradle/socket.

Avoid exaggerated whipping, glowing laser-cable behavior, or arcade fishing-bobber motion unless later gameplay evidence supports it.

## Practical visual defaults for first prototype

These are prototype values, not locked final tuning:

- line width should remain very thin relative to the 1.15 m PEBBLE body, roughly cable/string scale rather than hose scale;
- use enough spline/line samples to avoid visible polygonal kinks in the frozen Office camera;
- avoid expensive collision along every segment in the first visual prototype;
- prioritize continuity, readable tension, and stable motion over physically exact rope simulation.

## Gate rule

At current Gate 3, Codex may prepare sockets, a static/procedural visual tether preview, and clearance/pose tests only when explicitly requested.

Do not use this document as authorization to start the full Retrieval gameplay loop.

## One-line ownership rule

> User models the Station and Orb; Codex generates and animates the actual flexible tether in Unity at runtime.