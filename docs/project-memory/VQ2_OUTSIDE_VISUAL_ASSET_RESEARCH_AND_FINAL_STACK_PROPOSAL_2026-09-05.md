# VQ2 Outside Visual Asset Research and Final Stack Proposal — 2026-09-05

Status: RESEARCH SYNTHESIS + IMPLEMENTATION PROPOSAL / NOT YET USER-LOCKED

## Why the current approach is not converging

The current custom procedural Far Universe shader is technically valid but visually under-authored. In practice it is producing a nearly uniform dark-blue field with too little astronomical structure, so parameter tuning alone tends to oscillate between an empty background and a synthetic "space wallpaper" look.

The recommended correction is architectural rather than incremental: stop asking one procedural sky shader to carry the full Outside illusion.

## Recommended final rendering stack

1. Atlas Boundary — gameplay/logic volume and localized contact response. Keep fully separate from background rendering.
2. Far Sky — authored high-resolution equirectangular/cubemap star texture rendered as camera-only background, no translational parallax, no contribution to global ambient/reflection.
3. Mid/Far 3D Sky Layer — miniature 3D subscene rendered through a dedicated camera/layer with extremely reduced positional parallax, following Unity's official URP 3D Skybox technique. This layer is reserved for a few large-scale distant silhouettes and later fleet/war events.
4. Near Outside — actual 35–100 m GameObjects used by Retrieval. Very sparse. Real parallax.

This stack should remain the long-term Outside architecture so later SunVisual, fleet, strike, delayed disturbance, Retrieval targets, and distant events do not require replacing the background system again.

## Preferred ready-made Far Sky source

Primary recommendation: Solar System Scope `8k_stars_milky_way.jpg` (or `8k_stars.jpg` as a cleaner alternate), distributed under CC BY 4.0.

Reasons:
- ready-made 8K equirectangular space texture;
- strong black levels rather than the current blue field;
- natural non-uniform star distribution and scale hierarchy;
- pipeline independent — avoids importing a large rendering framework merely for the background;
- commercial adaptation is allowed with attribution;
- can be rendered with the existing camera-only sky setup so it does not affect RenderSettings ambient/reflection.

Art direction recommendation: start from `8k_stars_milky_way.jpg`, rotate to avoid an obvious horizon-band composition, darken/desaturate the Milky-Way structure until it is only a low-contrast depth cue, and retain the authored star distribution. If the galaxy band remains too recognizable, fall back to `8k_stars.jpg` plus one extremely subtle low-frequency dust layer.

## Other researched options

### Space Graphics Toolkit
Mature Unity space toolkit with a large user base and strong reviews. Appropriate if VQ2 later needs a broad reusable system for planets, stellar objects, and layered space visuals. Not recommended as the immediate Far Sky dependency because it is much larger than the current requirement and there are mixed recent URP reports for some advanced effects. It can be reconsidered when major celestial objects become production scope.

### Real Stars Skybox Plus
Small inexpensive ready-made real-star option. Simple and potentially useful for comparison, but it is an older 2019 package and is not preferred over the free 8K authored texture route.

### AAA_8k_SpaceHDRI_U01 / recent 8K nebula packs
Technically compatible and visually rich, but currently weakly reviewed or very new, and several are nebula-heavy. They introduce unnecessary visual-direction risk for VQ2, where Outside should remain mostly dark and restrained.

### Procedural Space Skybox
Modern URP procedural option, but its feature direction leans toward stylized stars/nebula/sun composition. It is not the preferred baseline because the current problem is specifically that a fully procedural far sky is proving difficult to art-direct into restrained, realistic depth.

### NASA / ESA all-sky maps
Excellent scientific reference and useful for future research. WISE/Gaia all-sky maps are not the recommended final game texture as-is: they use scientific projections/color mappings and can produce a very recognizable Milky Way band. They are better used as reference or as input to a custom reprojected/graded derivative.

## Mid/Far 3D Sky recommendation

Use Unity's documented URP 3D Skybox camera-stacking concept for distant large-scale elements. The far star background receives zero translation. The Mid/Far 3D camera follows player rotation but only a tiny fraction of player translation, creating controlled parallax and enormous apparent scale without placing objects thousands of meters away.

Use this layer for only a few elements at any one time:
- distant unidentified silhouette;
- later fleet formation;
- remote energetic strike visual anchor;
- rare large debris or structure.

Do not use this layer for ordinary stars.

## Near Outside recommendation

Reduce the current visual role of small fragments. Near Outside should read as mostly empty. Prefer roughly 4–8 meaningful low-contrast objects/targets over a uniform particle field. Objects can remain sparse until Retrieval content is authored.

## Boundary ripple redesign

The current donut/portal appearance must be replaced with a localized spherical-cap response.

Recommended implementation:
- retain the existing invisible 30 m gameplay sphere;
- use the sphere mesh only while a response is active;
- compute angular distance on the sphere from the contact normal to each fragment position;
- draw 1–3 extremely thin bands confined to a small spherical cap;
- cap spread should be local rather than revealing a full great-circle ring;
- low opacity, almost no emissive, warm-neutral/near-colorless value shift;
- optional subtle scene-color distortion only if it can be added without changing the global rendering contract;
- fast fade;
- full sphere visibility remains Scene-view/debug-gizmo only.

The intended read is: "an invisible surface was briefly disturbed here," never "a portal opened."

## Radius

Keep candidate Atlas radius at 30 m for the next comparison. The current visual problems do not provide enough evidence to change radius. Reassess 30/35/40 m only after Far Sky and ripple are corrected.

## Recommended next implementation

Do one decisive Outside V2 candidate instead of another procedural parameter pass:

- replace current procedural Far Universe appearance with Solar System Scope 8K authored texture;
- keep camera-only background and preserve current ambient/reflection isolation;
- add a dedicated Mid/Far 3D sky layer based on Unity URP 3D Skybox methodology, but populate it with zero or only one/two dark test silhouettes initially;
- reduce/reposition Near Outside fragments so they do not read as a particle field;
- rewrite boundary visual as localized spherical-cap ripple;
- preserve AtlasBoundaryVolume, Player radial constraint, Orb crossing, Retrieval transforms, interior V3, lighting, and 30 m radius.

Human review should compare: normal Living-to-Outside view, Retrieval-to-Outside, full room looking back, local boundary contact, and a slow lateral camera movement to verify far/mid/near parallax hierarchy.
