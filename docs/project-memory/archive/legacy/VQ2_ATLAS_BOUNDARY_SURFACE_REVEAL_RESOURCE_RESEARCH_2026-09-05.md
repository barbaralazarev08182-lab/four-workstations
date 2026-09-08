# VQ2 Atlas Boundary Surface Reveal Resource Research — 2026-09-05

Status: RESEARCH SYNTHESIS / IMPLEMENTATION RECOMMENDATION / NOT YET HUMAN-LOCKED

## Context

Current Atlas Boundary gameplay architecture is sound and the active candidate radius is 21m. The remaining problem is visual communication: prior ripple versions still read as circles/UI/portals rather than as a normally invisible curved membrane briefly revealed by contact.

## Research findings

### 1. Cyanilux Forcefield Shader Breakdown
- URP + Shader Graph forcefield reference using Fresnel, scene depth, scene colour, distortion and collision-driven ripples.
- The tutorial explicitly demonstrates distortion ripples at collision points on spherical/hemispherical forcefields.
- Cyanilux states that shader code, Shader Graphs and C# code in tutorials are CC0 unless otherwise specified.
- Important limitation: Scene Color distortion in URP requires Camera Opaque Texture; transparent objects are not represented through that Scene Color path, and front/back-face handling can be awkward on full spherical shells.

### 2. Unity Shader Graph Production Ready Shaders
- Unity provides 25+ production-ready Shader Graph assets/subgraphs for URP/HDRP.
- The official water shaders include reflection, refraction, surface ripples, scrolling normal maps and depth fog.
- Recommended as the source of clean refraction/noise/water-surface building blocks rather than creating all surface response from scratch.

### 3. Daniel Ilett Stylised Shield
- MIT-licensed URP Shader Graph project.
- Includes raycast-point ripple, object intersection effects, modular shader features and impact VFX.
- Useful as a scripting/impact sequencing reference.
- Its default holographic/emissive/scanline style is too overtly sci-fi for VQ2 and should not be copied visually.

### 4. Commercial Unity assets
- Scifi Energy Shields (Interactive): URP-compatible on Unity 6000.1 and 2022.3, 30+ configurable properties, sphere-mask impacts and hit effects. Strong feature fit but default visual language is combat-shield/hexagon sci-fi; currently little rating history. Recommended only as optional reference/backup, not as VQ2 final visual.
- Ripple Effect (Visu Assets): low-cost general ripple shader compatible with Built-in/URP/HDRP, but public technical detail is limited and it does not specifically solve VQ2's invisible spherical membrane requirement.

## Recommended VQ2 solution

Do not continue refining concentric lines on the full 21m sphere.
Do not make a permanently transparent shield shell.
Do not adopt a hex-grid or combat-shield package as final art.

Instead implement a **Localized Spherical-Cap Membrane Reveal**:

1. Keep `AtlasBoundaryVolume` and the 21m gameplay sphere fully independent and normally invisible.
2. When a contact/ripple event occurs, render only a small curved spherical-cap patch around the contact point, rather than enabling the whole sphere.
3. The primary cue must be **background refraction / starfield warping**, not drawn rings.
4. Secondary cue: extremely subtle near-colorless/warm-ivory surface sheen driven by low-frequency normal/noise response.
5. Wavefront: at most one principal refractive wave plus sparse residual broken arcs; no complete circular loops.
6. Contact point: a small local indentation/shimmer, not a bright or dark dot.
7. Lifetime target: about 0.55–0.85s, with surface reveal peaking early and dissolving irregularly.

## Rendering recommendation

### Preferred first implementation
Use a localized transparent spherical-cap mesh and a custom URP material based on:
- Unity Production Ready water/refraction/normal-map concepts,
- Cyanilux collision ripple / distortion concepts,
- existing VQ2 spherical contact coordinates and event system.

Enable/refine scene-colour distortion only if it can be isolated to the OfficeCamera without destabilizing the existing rendering contract. Unity documents that URP Opaque Texture creates `_CameraOpaqueTexture` before transparent meshes and can be overridden per Base Camera. It has a measurable copy cost, so profile it.

### VQ2-specific fallback / enhancement
Because the most important background is the authored 8K Stars + Milky Way sky, the boundary shader may directly sample the same authored sky texture using the world view direction and perturb that direction locally. This guarantees readable starfield warping without requiring the entire global pipeline to change. Later, if large Mid/Far objects also need physically consistent distortion, a dedicated outside-background render texture or renderer-feature path can be evaluated.

## Visual hierarchy target

Approximate perceptual contribution at peak:
- 65–75%: refractive/background warp
- 15–25%: subtle translucent membrane value/normal variation
- 5–10%: faint broken highlight wavefront

The effect should read as:
`invisible air -> local curved membrane becomes perceptible -> background bends -> one weak pressure wave spreads -> everything disappears`

It must NOT read as:
- UI reticle
- portal
- bubble shield
- hex shield
- neon dome
- concentric rings in space

## Implementation gate

Before final integration, build one isolated candidate patch and review it against the current Milky Way PASS background from:
- frontal view,
- 45-degree oblique view,
- near open floor edge,
- with a dark and a bright starfield area behind it.

Only after the patch itself passes Human Visual Review should it replace the current ripple renderer.

## Sources reviewed
- Cyanilux — Forcefield Shader Breakdown / license usage
- Unity — Shader Graph Production Ready Shaders
- Unity URP documentation — Opaque Texture / distortion behavior
- Daniel Ilett — Stylised Shield (MIT)
- Unity Asset Store — Scifi Energy Shields (Interactive)
- Unity Asset Store — Ripple Effect
