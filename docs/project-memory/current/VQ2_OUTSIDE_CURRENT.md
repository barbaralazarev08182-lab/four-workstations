# VQ2 Outside / Universe — Current Direction

> Status: **ACTIVE**  
> Updated: 2026-09-08

## Hard world rule

The Outside is a higher-dimensional non-human environment. What the human player sees is a readable 3D projection/cross-section, not the true underlying geometry.

Do not naturally place human-made ruins, spacecraft, infrastructure, records, furniture or other human relics in the Outside. Artificial visible structures must be non-human / higher-dimensional in origin.

Retrieval targets must remain Outside-native: unfamiliar matter, organisms, condensates, constructs/technology, samples, signals/data carriers, or other projected phenomena.

## Presentation principle

Use **visible first, activity second**.

The Outside should already be worth looking at before authored events occur. It should feel deep, realistic, colorful-but-restrained, enormous and alive without becoming a continuous VFX reel.

The entire universe does not need to rotate with the 60-minute day cycle.

Desired subtle independent activity includes:

- low-frequency asynchronous star twinkle;
- very slow nebula drift if useful;
- black-hole/accretion motion;
- rare distant moving phenomena;
- authored large-scale events later.

## Base sky

The existing authored Far Sky / Milky Way remains the safe recoverable reference baseline while enrichment is reopened.

A Human-supplied `Deep Dark Space with Stars` EXR may be A/B tested as an alternative visible background, but it is not automatically approved to replace the current base sky. Visible sky should remain separable from interior environment-lighting/reflection contribution so a sky swap does not silently change Refuge lighting.

Source:

- `Deep Dark Space with Stars`
- `https://www.blendkit.com/asset-gallery-detail/a08a1b36-c4c4-4716-8e80-da6bd3aa6d18/`

## Celestial anchoring architecture

The latest black-hole and nebula layers were moved into the same camera-only / directional sky coordinate system as the star field.

Result:

> **TECHNICAL SKY-LOCK PASS**

Player translation now produces effectively zero relative parallax between these celestial layers and surrounding stars. Preserve this solution.

Do not return to finite-distance world-space cards/quads/billboards that visibly drift against the sky. A distant celestial phenomenon should have fixed angular direction in the sky; camera rotation changes what the player sees, while player translation should not create room-scale parallax.

## Current Human visual verdict

The same V2 presentation is:

> **HUMAN VISUAL FAIL**

Reasons:

- black hole far too small and icon/logo-like;
- insufficient visible gravitational lensing / spacetime distortion;
- surrounding stars do not strongly bend, stretch, arc or wrap;
- nebula far too small;
- nebula color/luminance is crushed and weak;
- astronomical distance was incorrectly communicated through tiny angular size.

Critical correction:

> **Distance is not communicated by making enormous celestial structures tiny.**

Distance should come from zero translation parallax, enormous structural scale, low-frequency detail, layering with the star field, realistic light behavior, and off-frame continuation.

## Black-hole direction

The black hole must become a memorable celestial landmark in normal first-person viewing.

Target:

- prominent, but not necessarily the largest object in the sky;
- roughly `10–20%` of screen width can be appropriate depending composition;
- not dead-center like a UI marker;
- truly dark central shadow;
- detailed tilted/non-iconic accretion structure;
- asymmetrical brightness / heat variation;
- restrained Bloom;
- **visible gravitational lensing of the actual surrounding sky**.

The sky shader should distort nearby star/nebula sampling so the player immediately feels that space is bending:

- background stars bend around the lens;
- close stars may stretch into arcs;
- wrap/duplication near photon-ring-like regions is acceptable;
- the accretion disk may appear wrapped above/below the dark center where physically/stylistically appropriate;
- distortion falls off smoothly with angular distance.

Do not fake this with a circular blur, fisheye bubble, magical portal glow or uniform ring.

Human-supplied source:

- BlendKit `Procedural Black Hole`
- `https://www.blendkit.com/asset-gallery-detail/28b5d3f1-ada6-44b8-9068-fedcdb3fcd6a/`

The real Blender asset can supply appearance/reference, but Blender procedural/Cycles material logic does not transfer 1:1 into Unity URP. Inspect source geometry/materials/animation and adapt deliberately. Technical provenance alone does not imply Human Visual PASS.

## Nebula direction

The nebula should feel astronomically enormous.

Target:

- roughly `25–50%` of a wide Outside composition is reasonable;
- it may continue beyond the frame;
- do not present the whole nebula as a small isolated blob;
- preserve strong-but-natural source color structure;
- dark space still dominates the full universe.

Desired restrained palette can include blue/violet, magenta, cyan/teal and limited warm amber/orange structure.

Restraint must not mean crushing the nebula to near-black.

Human-supplied source:

- BlendKit `Nebula EEVEE`
- `https://www.blendkit.com/asset-gallery-detail/3af22b69-5295-4bb3-a108-cb9d11a79bf1/`

The EEVEE scene may require baking to textures/cards/volume proxies or an equivalent Unity reconstruction. Preserve its richer HDR/color character when adapting it.

## Nearby north planet

One major nearby planet should sit primarily to the **north** of the Refuge.

Human intent:

- it may be extremely large;
- it should reward looking north rather than constantly dominating the player's primary forward view;
- it should feel like a real nearby astronomical body, not a decorative sphere;
- high detail / realism is mandatory because of the large apparent scale;
- partial disk/curvature is preferred over always showing the whole planet;
- convincing atmosphere/limb, terminator, macro surface/cloud detail and scale cues matter.

If implemented as an ultra-distant celestial body, it should use the same coherent far-space anchoring logic rather than inappropriate room-scale parallax.

## Visual hierarchy

Useful hierarchy:

`dark space -> star field -> huge colored nebula -> prominent lensed black hole -> north nearby planet`

These elements should not all occupy the same focal region or compete at identical scale.

## Future authored Outside activity

Later spectacles may include:

- gigantic non-hostile organisms whose projected scale is difficult to interpret;
- migrations of native higher-dimensional life;
- stellar-scale explosions/collisions;
- meteor/comet/asteroid disruption;
- distant wars;
- non-human inspection/stabilization vessels;
- entities that can perceive the hidden Refuge;
- rare hazards/disasters with actual gameplay/story consequences.

A Human-supplied explosion asset may be useful for a future authored event, not as permanent looping scenery:

- `Animated Super Explosion`
- `https://www.blendkit.com/asset-gallery-detail/a8b1fd83-3716-4a6b-bc55-583b9b505237/`

Higher-dimensional phenomena should use projection-specific cues where useful: impossible self-occlusion, topology changes, merging/splitting, inconsistent projected scale and non-Euclidean apparent motion.

## Interior protection boundary

Outside enrichment must not silently modify:

- Golden Lighting parameters;
- interior exposure/tonemapping merely to rescue sky art;
- Atlas / Boundary behavior;
- Retrieval core;
- Player;
- furniture/layout;
- production scenes.

Bright celestial visuals do not need to become strong Unity Lights washing the Refuge interior.
