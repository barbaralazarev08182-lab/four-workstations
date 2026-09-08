# VQ2 Lighting — Current Direction

> Status: **ACTIVE / DIAGNOSTIC PAUSED**  
> Updated: 2026-09-08

## Target visual language

Preferred daylight remains close to the historical “Golden” architectural-model / model-photography look:

- strong readable directional key;
- clear broad light-vs-shade structure;
- long meaningful shadows where angle allows;
- convincing contact and form separation;
- warm-white rather than orange wash;
- restrained contrast;
- materials responding differently rather than flattening into one warm tone.

Avoid flat global fill, orange wood wash, harsh PBR-showroom light, dirty/heavy AO used as fake form lighting, or fog/atmosphere used to hide a weak light hierarchy.

The target is **strong light structure, not simply high brightness**.

## SunVisual and daylight are separate systems

Keep the visible refuge sun and the primary daylight conceptually separate:

- `SunVisual` = visible designed star;
- `SunDirectionalLight` = main room illumination/shadow authority.

Do not use a strong local Point Light on the small SunVisual as the primary 20m-room sun. Parallel directional light is the intended daylight model.

Visible sun position and shadow direction should agree unless a later explicitly documented artistic exception is introduced.

## Accepted historical Atlas Bounce baseline

`CANDIDATE_AtlasBounceLighting_V1` received Human Visual PASS as a **historical diffuse-bounce baseline**, not a permanent final art lock.

Accepted values worth preserving for rollback/reference:

- main Sun peak intensity: `1.18`;
- shadow strength: `0.84`;
- Soft Shadows: enabled;
- sunlight temperature: low sun `4100K` -> high sun `5000K`;
- Generic Daylight Fill: disabled;
- Floor Bounce: 3 broad non-shadowing spot emitters;
- Floor Bounce peak: `0.52`;
- North Wall Bounce: 2 broad non-shadowing spot emitters;
- North Wall Bounce peak: `0.34`;
- bounce driven continuously by SunVisual position;
- bounce fades to zero at night;
- day cycle remains `3600s / 60 real minutes`.

What this baseline proved:

- directional key + controlled indirect can shape the room without flattening it;
- oak floor can contribute restrained warm bounce;
- west-wall readability can be improved without fake direct sunlight;
- diffuse bounce and reflection/specular response are separate problems.

Do not assume these numbers are the final Golden solution for later architecture/materials.

## Realtime GI lesson

The Realtime GI / Enlighten-style experiment was technically functional but produced too little useful warm/wood bounce benefit relative to complexity. Do not reopen that route by default.

Use controlled bounce, Reflection Probes/specular work and practical lighting first unless new evidence justifies another GI experiment.

## Golden Lighting Diagnostic V1

Current verdict:

> **PARTIAL SUCCESS / STRUCTURAL LIMIT IDENTIFIED**

The diagnostic recovered useful directional shadow/contact structure and moved the scene toward the desired Golden direction, but it did not become a final Human Visual PASS or final lighting baseline.

### Main unresolved problem — west wall at noon

At/near noon the west wall becomes a large nearly uniform gray field with very little useful shaping.

Current solar/orbit geometry gives that wall little/no useful direct-light component at noon. This is a structural composition issue, not a reason to keep making tiny intensity edits.

## Decision on solar orbit

The older orbit geometry is not sacred if it prevents the desired interior composition.

When lighting is reopened:

1. judge the stable/new architecture first;
2. test architecture + controlled indirect/bounce + practical lights;
3. if the west wall remains dead, formally reopen the daylight orbit and allow a useful revised path/X component;
4. revalidate SunVisual/day-cycle presentation after any orbit change.

Do not silently change the orbit without recording the decision.

## Exposure / Key-Fill rule

The Refuge must simultaneously support a dark cosmic exterior, bright visible SunVisual, and normally exposed domestic materials.

Use fixed or tightly bounded exposure. Do not rely on unrestricted auto-exposure pumping to make day/night or sky art work.

Desired hierarchy:

`Sun Key > controlled ambient/sky/bounce > contact shaping`

Ambient/fill must remain subordinate enough that direct-sun structure is still obvious.

## Shadow character

Preferred shadows:

- clear directional silhouette;
- visually meaningful large-scale composition;
- restrained softness / penumbra rather than razor-hard default CG edges;
- convincing contact under furniture, character/objects and wall-floor junctions;
- readable shaded regions without crushed blacks;
- AO/SSAO only as restrained contact support, never as the main source of depth.

## Practical lighting direction

Practicals will become important because the Refuge has no conventional ceiling and future real walls can receive local pools/gradients.

Useful families:

- wall sconces / wall washers;
- floor lamps;
- table lamps;
- restrained built-in linear lights.

Approximate semantic color-temperature direction:

- Living/residential: `2700–3000K`;
- Entry/Bar: `2800–3200K`;
- Experiment/work: `3500–4200K`;
- Atlas/Retrieval/alien technology: limited special colors only.

With the 60-minute day cycle, practicals should generally be subtle/off by day, rise at dusk, and form warm local islands at night.

Avoid random multicolor cyberpunk lighting.

## Rendering / material order

Useful stack:

1. Sun / Golden key;
2. controlled indirect/bounce;
3. practical lights;
4. material/reflection/specular/contact/post;
5. atmosphere/dust only after the above works.

Reflection Probes matter for specular; Light Probes matter for dynamic objects; restrained SSAO may support contact. DLSS/STP/AA may improve performance/clarity/stability, but they do not create lighting hierarchy, GI or material response. Do not migrate URP -> HDRP just to chase DLSS.

After the light hierarchy is correct, materials still need differentiated roughness/specular/normal response for glass, metal, fabric, wood, stone, etc. Do not solve weak materials by merely increasing light intensity.

## Current protection boundary

Until lighting is explicitly reopened:

- preserve Golden Diagnostic V1 as diagnostic evidence, not final baseline;
- do not micro-tune it while architecture is unresolved;
- preserve Far Sky / Atlas Boundary / SunVisual unless the relevant Gate is explicitly reopened;
- do not alter interior exposure/tonemapping merely to make Outside visuals brighter.
