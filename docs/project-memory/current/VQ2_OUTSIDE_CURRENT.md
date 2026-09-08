# VQ2 Outside / Universe — Current Direction

> Status: **ACTIVE**  
> Updated: 2026-09-08

## 1. Hard world rule

The Outside is a higher-dimensional non-human environment. What the player sees is a human-readable 3D projection/cross-section, not the true underlying geometry.

Do not naturally place human-made ruins, spacecraft, infrastructure, records, furniture, or other human relics in the Outside. Artificial visible structures must be non-human / higher-dimensional in origin.

Retrieval targets must remain Outside-native: matter, organisms, condensates, constructs/technology, samples, signals/data carriers, or other projected phenomena.

## 2. Presentation principle

Use **visible first, activity second**.

The Outside must already be compelling to inhabit and look at before authored events occur. It should feel deep, realistic, colorful-but-restrained, enormous and alive without becoming a continuous VFX reel.

The entire universe does **not** need to rotate with the 60-minute day cycle.

Subtle independent motion is desired:

- low-frequency asynchronous star twinkle;
- very slow nebula movement if useful;
- black-hole/accretion activity;
- rare distant moving phenomena;
- authored large-scale events later.

## 3. Current base sky

The existing authored Far Sky / Milky Way remains a **recoverable accepted reference baseline** while enrichment is reopened.

A downloaded `Deep Dark Space with Stars` EXR may be A/B tested as a visual background source, but it is not automatically approved to replace the current base sky. Visible sky and interior environment-lighting/reflection contribution should remain separable so sky experiments do not silently alter Refuge lighting.

## 4. Current V2 technical result

The latest black-hole/nebula celestial layers were moved into a camera-only/directional sky system.

Result:

> **TECHNICAL SKY-LOCK PASS**

Player translation now produces effectively zero relative parallax between these celestial layers and the surrounding star field. Preserve this solution.

Do not return to finite-distance world-space cards/quads that visibly drift against the sky as the player moves.

## 5. Current Human visual verdict

The same V2 presentation is:

> **HUMAN VISUAL FAIL**

Reasons:

- black hole is far too small and reads like a glowing symbol/icon;
- there is insufficient visible gravitational lensing / spacetime distortion;
- surrounding stars do not communicate strong bending, stretching, arcs or wrapped space;
- nebula is far too small;
- nebula color/luminance is crushed and visually weak;
- astronomical distance was incorrectly communicated through small angular size.

Critical Human correction:

> **Distance is not communicated by making enormous celestial structures tiny.**

Distance should come from zero translation parallax, enormous structural scale, low-frequency detail, layering with the star field, and off-frame continuation.

## 6. Black-hole direction

The black hole must be a memorable normal-view celestial landmark.

Current target:

- visually prominent but not necessarily the largest object in the sky;
- may occupy roughly 10–20% of screen width depending composition;
- not dead-center like a UI marker;
- truly dark central shadow;
- detailed, tilted/non-iconic accretion structure;
- asymmetrical brightness and thermal variation;
- restrained Bloom;
- **visible gravitational lensing of the actual surrounding sky**.

The sky shader should distort nearby star/nebula sampling so the player can immediately feel that space is bending:

- background stars bend around the black hole;
- close stars may stretch into arcs;
- wrap/duplication near photon-ring-like regions is acceptable;
- disk/lensing should create above/below wrapped structure where appropriate;
- distortion falls off smoothly with angular distance.

Do not fake this with a simple circular blur, fisheye bubble, portal glow, or uniform ring.

The Human-supplied BlenderKit `Procedural Black Hole` asset has been successfully downloaded locally and may provide the source accretion/black-hole appearance, but using the real source does not itself guarantee a visual PASS.

## 7. Nebula direction

The nebula should feel astronomically enormous.

Target:

- roughly 25–50% of a wide Outside composition is reasonable;
- it may continue beyond the frame;
- do not present the whole nebula as a small isolated blob;
- preserve strong-but-natural color structure from the source.

Desired restrained palette can include:

- blue / violet;
- magenta;
- cyan/teal where present;
- limited warm amber/orange highlights.

Dark space should still dominate the full universe, but restraint must not mean crushing the nebula to near-black.

The Human-supplied BlenderKit `Nebula EEVEE` source has been successfully downloaded locally. Preserve its richer color/HDR character when adapting it to Unity.

## 8. Nearby planet direction

One major nearby planet should sit primarily to the **north** of the Refuge.

Human intent:

- it may be extremely large;
- it should reward looking north rather than constantly dominating the player's primary forward view;
- it should feel like a real nearby astronomical body, not a decorative sphere;
- high detail / realism is important because of its large apparent scale;
- partial disk/curvature is preferred over always showing the whole planet.

Desired qualities include convincing atmosphere/limb behavior, surface or cloud macro-detail where appropriate, believable terminator, and no low-resolution stretched texture or toy-like noise.

## 9. Scale hierarchy

A useful visual hierarchy is:

`dark space -> star field -> huge colored nebula structure -> prominent lensed black hole -> north nearby planet`

These elements should not all occupy the same focal region or compete at identical scale.

## 10. Future Outside activity

Later authored spectacles may include enormous non-hostile organisms, migrations, stellar-scale explosions, collisions, meteor/comet events, distant wars, non-human inspection/stabilization vessels, and rare hazards.

These should be authored events with staging and gameplay/story consequences when appropriate—not constant background decoration.

Any higher-dimensional phenomenon should use projection-specific cues when useful: impossible self-occlusion, topology changes, merging/splitting, inconsistent projected scale, non-Euclidean apparent motion, etc.

## 11. Do not disturb interior systems

Outside visual enrichment must not silently modify:

- Golden Lighting parameters;
- interior exposure/tonemapping just to rescue sky art;
- Atlas / Boundary behavior;
- Retrieval core;
- Player;
- furniture/layout;
- production scenes.

Bright celestial visuals do not need to become powerful Unity Lights affecting the Refuge interior.
