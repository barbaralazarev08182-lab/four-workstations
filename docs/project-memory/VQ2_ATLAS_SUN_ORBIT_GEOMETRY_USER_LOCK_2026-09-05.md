# VQ2 Atlas Sun Orbit Geometry — USER LOCK

Date: 2026-09-05
Status: USER LOCK / AUTHORITATIVE ORBIT GEOMETRY

This note records the user's explicit orbit geometry for the visible Atlas sun. It supersedes earlier generic / configurable orbit-plane proposals where they conflict.

## Locked geometry

- Orbit center authority: `AtlasAnchor`.
- Atlas Boundary gameplay radius remains `21m`.
- The sun orbit lies on the **house centerline** shown by the user's top-view sketch.
- Interpreted in the current Open20m scene coordinates, this is a vertical great-circle orbit in the house center plane: approximately the `Y-Z` plane with `X = AtlasAnchor.x`.
- The orbit is centered on Atlas, not on the room/floor center independently.
- The orbit should be almost as large as the 21m Atlas Boundary sphere, but the visible sun must remain inside the Boundary.
- Conceptual relation: the visible Sun sphere travels tangentially along the **inside surface** of the Atlas Boundary sphere.
- Therefore the Sun center path radius should be derived from the boundary and Sun visual radius rather than hard-coded independently:

  `sunOrbitRadius = atlasBoundaryRadius - sunVisualRadius`

- If technical clearance is ever required, it must be a tiny inward epsilon and must not visibly change the intended tangent relationship.

Example only (not a locked Sun size): if SunVisual diameter is 0.40m, Sun radius is 0.20m and the derived center-orbit radius is approximately 20.80m before any tiny technical epsilon.

## Locked direction

- Viewed from the side orientation shown in the user's second sketch, the Sun travels **counterclockwise** around Atlas.
- Implementation must preserve this visual direction; do not infer direction from Unity Euler sign alone without side-view verification.

## Important visual meaning

The orbit is intentionally a near-boundary internal orbit: the Sun is not a distant astronomical body and not a small orbit close to Atlas. It visually traces the inside of the stable refuge volume and reinforces the relationship between Atlas, the 21m sphere, and the room.

## Still open / not locked by this decision

- Exact SunVisual diameter.
- Any tiny implementation clearance epsilon.
- Which point on the circle corresponds to time 0 / midnight / sunrise / noon.
- Exact cycle duration.
- Exact daylight intensity/color curves.
- Exact SunVisual material/corona/bloom treatment.
- Whether future Sun/Boundary proximity should create a visible Boundary response.

Do not implement a smaller arbitrary orbit such as the earlier 17.5m candidate unless the user explicitly changes this decision.
