# VQ2 Lighting — Current Direction

> Status: **ACTIVE / DIAGNOSTIC PAUSED**  
> Updated: 2026-09-08

## 1. Target visual language

The preferred daylight feeling remains close to the historical “Golden” architectural-model / model-photography look:

- strong readable directional key;
- clear broad light vs shade structure;
- long clean shadows where composition allows;
- strong contact and form separation;
- warm-white rather than orange wash;
- restrained contrast;
- materials should respond differently rather than being flattened into one warm tone.

Avoid:

- flat global fill;
- orange wood wash;
- harsh PBR showroom lighting;
- dirty/heavy AO used as a substitute for actual form lighting;
- atmosphere/fog used to hide weak light hierarchy.

## 2. Current diagnostic result

`Golden Lighting Diagnostic V1` =

> **PARTIAL SUCCESS / STRUCTURAL LIMIT IDENTIFIED**

The diagnostic recovered useful directional shadow/contact structure and proved the scene can move closer to the preferred Golden direction.

It did **not** become a final Human Visual PASS or final lighting baseline.

## 3. Main unresolved problem — west wall at noon

The major Human concern is structural:

> At/near noon, the west wall becomes a large, nearly uniform gray field with very little useful shaping.

Current Sun orbit geometry gives the west-wall interior surface little/no useful direct-light component at noon. This cannot be solved indefinitely by changing directional intensity in tiny increments.

Treat this as a Lighting Gate issue, not a minor polish defect.

## 4. Current decision on Sun orbit

The older Sun-orbit geometry lock is **not sacred** if it materially prevents the desired interior composition.

Preferred sequence when lighting is reopened:

1. first judge the stable/new architecture;
2. test whether architecture + controlled indirect/bounce + practical lights can give the west wall enough life;
3. if the wall remains a dead gray field, formally reopen the Sun orbit and allow a useful X component / revised path;
4. revalidate SunVisual and the day-cycle presentation after any orbit change.

Do not silently cheat the Sun direction without documenting the change.

## 5. Historical bounce/GI lessons

A previous Atlas Bounce rig reached Human Visual PASS as a **historical diffuse-bounce baseline**, not a permanent final art lock.

Useful principles:

- strong key + controlled indirect is preferable to broad flattening fill;
- `Generic Daylight Fill` should not erase directional structure;
- broad floor/wall bounce can keep darks readable without looking like obvious stage lights;
- reflection/specular response is a separate problem from diffuse bounce.

The Realtime GI / Enlighten-style experiment was technically functional but produced too little useful warm/wood bounce benefit. Do not reopen that route by default.

Current engine context:

- Unity `6000.3.21f1`
- URP `17.3.0`

## 6. Practical lighting direction

Practical fixtures are expected to become an important layer, especially because the Refuge has no conventional ceiling and future real walls can receive local pools/gradients.

Useful fixture families include:

- wall sconces / wall washers;
- floor lamps;
- table lamps;
- restrained built-in linear lights.

Lighting semantics should remain coherent rather than becoming a multicolor cyberpunk showroom. Approximate color-temperature direction:

- Living/residential: warm, around 2700–3000K;
- Entry/Bar: around 2800–3200K;
- Experiment/work: more neutral, around 3500–4200K;
- Atlas/Retrieval/alien technology may use limited special colors.

With the 60-minute day cycle, practicals should generally be subtle/off by day, rise at dusk, and form warm local islands at night.

## 7. Rendering/post order

A useful lighting stack is:

1. Sun / Golden key — large-scale directional shaping;
2. controlled indirect/bounce — readable darks without flattening;
3. practical lights — local pools and gradients;
4. material/reflection/post — Reflection Probes/specular, restrained contact/SSAO, exposure/tonemap, temporal/upscaling quality as appropriate;
5. atmosphere/dust only after the above works.

DLSS/STP/AA may improve clarity/performance/stability, but they do not create good lighting hierarchy, GI or material response. Do not migrate render pipelines just to chase an upscaler.

## 8. Current protected values/state

Until lighting is explicitly reopened:

- keep `Golden Lighting Diagnostic V1` as diagnostic evidence;
- do not promote it as final baseline;
- do not keep micro-tuning it while architecture is unresolved;
- preserve Far Sky / Atlas Boundary / SunVisual systems unless the relevant Gate is explicitly reopened;
- do not modify interior exposure/tonemapping merely to make Outside art brighter.

## 9. Material-quality boundary

Not every “lack of quality” is a lighting problem.

After light hierarchy is correct, material response still needs to differentiate glass, metal, fabric, wood, stone, etc. Reflection/specular, roughness variation, and convincing material-specific response must not be replaced by simply increasing light intensity.
