# VQ2 Atlas Boundary Membrane Patch Prototype Authorization — 2026-09-05

Status: USER AUTHORIZATION / IMPLEMENTATION PROTOTYPE

The user authorized the next Atlas Boundary visual step after research into existing URP forcefield/refraction/water approaches.

## Current authoritative boundary state
- Atlas center authority: `AtlasAnchor`
- Atlas Boundary radius: **21m**
- Boundary gameplay logic, Player radial constraint, Orb crossing, Far Sky/Milky Way PASS settings, Interior V3, Retrieval, Camera, Lighting, Environment and Production are protected from redesign in this prototype.
- Current ring/arc-based Ripple has NOT received Human Visual PASS.

## Prototype objective
Build an isolated `BoundaryMembranePatch_Candidate` to validate a new visual primitive before replacing the current Ripple.

The intended read is:
> A normally invisible curved membrane briefly becomes perceptible because the background star field bends and shimmers locally at the contact point.

The intended visual hierarchy is approximately:
- 70% background/refraction-style distortion
- 20% subtle membrane value/normal variation
- 10% weak broken wavefront/highlight

The effect must NOT primarily read as rings, a portal, shield, reticle, hex grid, combat forcefield, or UI graphic.

## Implementation direction
- Research/import Unity Production Ready Shader Samples where practical, especially water/refraction/ripple examples.
- Reuse technical ideas from mature forcefield/water implementations, but do not copy their combat sci-fi visual identity.
- Prefer a self-contained prototype that does not modify the global URP pipeline.
- First-choice prototype may directly resample/distort the already-approved 8K Stars + Milky Way sky texture inside a small spherical-cap patch, avoiding a global scene-color dependency for this first validation.
- Patch size target: roughly 8–12 degrees on the 21m sphere, configurable.
- Lifecycle target: roughly 0.7–0.8 seconds, configurable.
- Normal state: completely invisible.
- Contact point: tiny and brief, no black dot or bright orb.
- Wavefront: at most one weak, incomplete front plus sparse residual arcs; no complete closed circles.

## Gate
Do NOT replace the formal 21m Atlas Boundary Ripple until this isolated membrane patch receives Human Visual PASS.

No commit/push/promotion of Unity candidate implementation unless separately authorized.
