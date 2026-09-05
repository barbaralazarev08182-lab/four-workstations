# VQ2 SunVisual Constant Appearance and Lighting Decoupling Lock — 2026-09-05

Status: USER LOCK / AUTHORITATIVE DELTA

This decision refines the Atlas Sun system and supersedes any earlier proposal that SunVisual itself should change color or apparent brightness across morning / noon / afternoon.

## Locked decisions

- `SunVisual` exists only as the visible sun body.
- `SunVisual` should remain continuously bright and visually attractive throughout its visible orbit.
- The visible sun does **not** change authored color by time of day.
- The visible sun does **not** use morning / noon / afternoon brightness changes as the daylight system.
- Surface animation, corona, emissive appearance, and other visual detail may remain continuously active and visually stable.
- Time-of-day lighting, room illumination, shadow direction, shadow strength, daylight warmth, and related environmental light behavior belong to the separate `SunDirectionalLight` / daylight system.
- Do not couple SunVisual appearance changes to daylight lighting curves unless the user explicitly revises this later.

## Current design implication

The Sun system remains split into two authorities:

1. `SunVisual`: visible moving star, constant attractive luminous appearance.
2. `SunDirectionalLight`: independent lighting/shadow authority synchronized to SunVisual direction.

SunVisual orbital position may change continuously, but its authored visual identity should remain stable.
