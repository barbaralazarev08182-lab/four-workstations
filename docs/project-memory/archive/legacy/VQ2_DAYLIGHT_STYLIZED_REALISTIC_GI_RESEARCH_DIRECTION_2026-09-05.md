# VQ2 Daylight Stylized-Realistic GI Research Direction — 2026-09-05

Status: research direction / design guidance, not implementation authorization.

## User intent
- Daylight should feel more stylized and visually stronger than the current AtlasDaylight V1.
- Overall sunlight should lean warmer.
- Lighting should remain physically believable enough to show indirect bounce, material response, reflections, and changing illumination across the room.
- Do not change the locked SunVisual or orbit geometry just to fix lighting.
- Avoid over-auditing and unrelated static checks in future Codex tasks.

## Why the west/left wall stays nearly constant
Locked Sun orbit plane is the Atlas-centered vertical Y-Z plane, so SunVisual.x == AtlasAnchor.x for the full orbit.
Therefore the direct sunlight vector always has approximately zero X component.
The west wall interior normal is approximately +X, so direct Lambert illumination from the sun is approximately zero throughout the day.
This is geometrically correct for the locked orbit. The wall should still change due to indirect/bounced light and environment/specular response, not because the direct sun direction is cheated.

## Research findings
### Direct vs indirect light
Unity documentation distinguishes direct light from indirect light and notes that realistic lighting requires both. The current V1 is dominated by direct directional light plus a simple fill, which explains the stage-light look and weak wall-to-wall energy transfer.

### Dynamic GI reference patterns in games
- God of War used a unified volume-texture indirect-lighting solution for environments, characters, and volumetrics.
- The Division used radiance-transfer probes for dynamic bounce lighting from dynamic light sources.
- Stylized environment lighting commonly combines a strong readable key with controlled warm/cool contrast and a small number of broad fill/bounce sources rather than many spotty lights.

### Unity 2022.3 / URP options
1. Realtime GI via precomputed Enlighten is listed as supported in Unity 2022.3, but it is deprecated and support ends after Unity 2024 LTS. It is worth a candidate test because this room is small and mostly static, but should not be treated as a long-term production lock without evaluation.
2. Progressive baked GI supports multiple indirect bounces and is excellent for static-quality bounce, but one baked sun state cannot represent a moving 60-minute sun cycle without multiple lighting states or custom blending.
3. Reflection Probes provide environment-dependent specular reflections for smooth/glossy materials. They do not create diffuse wall bounce.
4. Light Probes are the normal path for dynamic objects to receive indirect environment lighting.
5. URP SSAO can add restrained contact/crevice depth, but it is not global illumination and must not be used as a substitute for bounce light.

## Preferred next technical study
Before further aesthetic tuning, run a focused GI feasibility study rather than another direct-light tweak.

Candidate A — preferred first test:
- Keep the current moving SunDirectionalLight direction.
- Enable/test Realtime GI on a non-destructive candidate setup.
- Mark static room shell/floor/major architecture as GI contributors as appropriate.
- Check whether moving sun produces convincing warm floor/wall bounce on the west wall and room interior.
- Measure only the relevant visual result and runtime cost; no repository-wide audit.

Specular/reflection layer:
- Add one or a small number of room Reflection Probes.
- Prefer realtime/on-demand or low-frequency time-sliced updates because the sun only moves 6 degrees per real minute.
- Use them for floor, stone, metal, glass, polished furniture, etc.

Dynamic receiver layer:
- Add/validate Light Probes for player, Orb, movable props and later furniture that needs indirect lighting.

Contact layer:
- Add subtle SSAO only if needed after GI; keep it restrained.

## Stylized-realistic target
- Warm, stronger direct sun as the hero key.
- Indirect light keeps shadowed areas readable without flattening them.
- Oak floor should cast a subtle warm color bleed into lower walls and nearby objects.
- Bright/white surfaces should provide softer neutral bounce.
- Smooth materials should pick up room/sky reflections via Reflection Probes.
- Dark areas should remain shaped and legible, not neutral gray and not crushed black.
- Keep the room readable with a small number of broad lighting influences.
- Avoid orange filter, fantasy glow, generic cyberpunk coloration, or a uniform fill that erases directionality.

## Fallbacks if Realtime GI is unsuitable
1. Prebaked multi-time-of-day indirect lighting states (e.g. dawn/noon/afternoon/night) with custom runtime blending.
2. Controlled sun-synchronized bounce-light rig as a stylized approximation, used only after the GI test proves unsuitable.

## Current recommendation
Do not tilt or rotate the locked sun orbit to make the west wall receive direct sunlight. Preserve the world geometry and solve the wall through dynamic indirect illumination, reflection response, and material-based bounce.
