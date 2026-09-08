# VQ2 SunVisual — Designed Refuge Star Style Lock

Date: 2026-09-05

## User decision

For the visible 0.50m SunVisual, choose direction **B**:

> A designed refuge sun: still unmistakably a sun/star, but cleaner, more elegant, and more intentionally authored than a purely realistic solar simulation.

## Locked visual direction

- SunVisual diameter: 0.50m.
- SunVisual appearance remains constant through the day; lighting/day-night color/intensity is handled separately by SunDirectionalLight.
- The sun should read as a deliberately preserved/engineered refuge star rather than a raw NASA-style scientific simulation.
- Keep a real-solar detail foundation, but simplify and art-direct it for beauty and readability.
- Surface motion should feel alive and continuous, not like a rotating texture skin.
- Preferred motion language: slow large-scale convection + finer granulation + a few restrained evolving active regions.
- Corona should be thin, soft, and controlled.
- Avoid: lava-ball look, spell/energy-orb look, exaggerated flares, giant bloom, RGB halo, aggressive pulsation, obvious UV scrolling, noisy VFX spectacle.

## Design intent

The player should be able to look at the sun and think both:

1. "That is a sun."
2. "There is something subtly too perfect / too designed about it."

The result should feel premium, calm, slightly uncanny, and compatible with the Atlas refuge worldbuilding.

## Implementation note

Reference sources such as Solar System Scope/NASA may be used for texture/detail inspiration, but the final SunVisual should be an authored Unity shader/material system rather than a direct unmodified asset drop-in.
