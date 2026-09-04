# VQ2 Authored 8K Far Sky — Technical PASS

Date: 2026-09-05
Status: TECHNICAL PASS / HUMAN VISUAL REVIEW STILL OPEN

## Scope

The Open20m candidate now uses an authored 8K equirectangular far-sky texture as the primary Far Sky visual source. The previous procedural star field is no longer the primary visual basis.

## Source

- Asset: Solar System Scope — 8K Stars + Milky Way
- Official source URL: https://www.solarsystemscope.com/textures/download/8k_stars_milky_way.jpg
- Source page: https://www.solarsystemscope.com/textures/
- License: CC BY 4.0
- File size: 1,905,513 bytes
- Resolution: 8192 × 4096
- SHA-256: `1fd005ddd6d53364cc5106e0121b83fd3bca236b1503f6b51f5501d9d51eafaf`
- JPEG validation: PASS; not an HTML/error payload.

## Unity Candidate Assets

- Texture: `Assets/FourWorkstations/Art/Outside/Candidates/FarSky/8k_stars_milky_way.jpg`
- Attribution: `Assets/FourWorkstations/Art/Outside/Candidates/FarSky/SOURCE_ATTRIBUTION.md`
- Material: `Assets/FourWorkstations/Art/Outside/Candidates/FarSky/Open20m_AuthoredFarSky_CameraOnly.mat`
- Shader: `Assets/FourWorkstations/Shaders/Open20mAuthoredFarSky.shader`

## Import / Rendering Contract

- Max Size: 8192
- sRGB: enabled
- Mipmaps: enabled
- Filtering: Trilinear
- Compression: High Quality, Quality 100
- Crunch: disabled
- Wrap: Repeat
- Bound only to `OfficeCamera` as a local/camera-only sky solution
- Global `RenderSettings`, ambient lighting, and reflection settings are unchanged
- Procedural stars are not layered over the authored texture

## Current Candidate Parameters

- Rotation: 14°
- Exposure: 0.34
- Saturation: 0.34
- Black Level: 0.018
- Milky Way Suppression: 0.82

These are candidate tuning values, not final visual lock values.

## Validation

- Unity import: PASS
- Shader compile: PASS
- Blocking errors: 0
- No production promotion
- No Unity commit/push reported for implementation

## Decision

This authored 8K source and camera-only integration receive **Technical PASS**.

This does **not** yet close the Outside visual gate. The remaining V2 work is:

1. Build the dedicated Mid/Far 3D sky layer for extremely distant authored objects/events and slight controlled parallax.
2. Reduce Near3D fragments to a minimal set used only for true local parallax and Retrieval-space presence.
3. Rewrite Atlas Boundary ripple as a localized spherical-surface disturbance rather than a portal/donut ring.
4. Perform Human Visual Review of Far Sky, Mid/Far parallax, Near3D, and ripple together before locking the Outside stack.

## Preserved Future Extensibility

The 8K star panorama is a base canvas only. Unique future planets, galaxies, galaxy clusters, fleets, ruins, war events, and anomalous phenomena should remain independent layered objects rather than being baked into the base sky texture.
