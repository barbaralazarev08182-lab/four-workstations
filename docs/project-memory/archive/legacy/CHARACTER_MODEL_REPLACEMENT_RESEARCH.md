# Four Workstations — Character Model Replacement Research

> Status: LIVING / REPLACEMENT RESEARCH COMPLETE / BAKE-OFF RECOMMENDED  
> Established: 2026-08-25  
> Purpose: preserve the decision context after the current custom characters hit a Humanoid reference-pose/finger-retarget ceiling. This document is for future ChatGPT planning and should prevent repeated investment in the failed adapter-first path unless there is a strong reason.

## 1. Why replacement is now a legitimate option

The current four production characters are visually acceptable for Idle/Walk but structurally awkward for Unity Humanoid reuse:

- production hierarchy is not a valid Humanoid hierarchy
- production Avatar is `null`
- a runtime/build-time hierarchy adapter can make the body `valid/human`, but the generated reference skeleton is idle-like rather than a clean T-pose
- after full 30-slot finger mapping, hand retargeting exposes severe folding/deformation because the reference pose is not a robust Humanoid rest frame
- seating work also exposed a separate seat-contact contract error, so continued patching would require both rig-pipeline repair and interaction-contact repair

Current user decision:

> Replacing the character models is acceptable if the replacements are materially better suited to Unity animation and interaction.

Therefore the next decision should compare replacement ecosystems instead of continuing to patch the current rig.

## 2. Unity requirement that matters most

Unity's own Humanoid documentation states that a successful Avatar match only proves required bones were matched; for better results optional bones should also be mapped and the model should be in a proper T-pose. Unity explicitly recommends preparing the model correctly before import and verifying/forcing a proper T-pose when needed.

Permanent selection rule:

> A replacement character is not accepted merely because `Avatar.isValid && Avatar.isHuman`. It must arrive with a clean Humanoid-compatible hierarchy/reference pose, usable hands/fingers, and visually stable retargeting in Unity.

## 3. Candidate A — Quaternius Universal Base Characters

Official source:

https://quaternius.com/packs/universalbasecharacters.html

Why it is the strongest first candidate:

- released August 2025
- 6 game-ready base models in male/female Regular, Teen and Superhero proportions
- optimized animation-friendly topology
- explicit Humanoid rig intended for retargeting
- average ~13k triangles
- 20 hairstyles
- customizable eye/skin color in Source version
- FBX + glTF; Source version includes rigged `.blend`
- CC0; free for personal/educational/commercial use
- explicitly compatible with Quaternius Universal Animation Library
- Unity URP implementation exists (official page cites Unity URP 2022.3.4 or above)

Strategic advantage:

> The model and the animation library come from the same character/animation ecosystem. This should reduce skeleton/reference-pose mismatch risk compared with adapting unrelated custom characters to UAL.

Important uncertainty that still requires an isolated test:

- exact Unity Humanoid finger-slot completeness
- reference T-pose quality after Unity import
- whether UAL can be used directly on the matching rig or still requires Humanoid retargeting in the distributed Unity-ready version
- how well the visual style matches Four Workstations at the frozen game camera

Do not assume those points without testing.

Visual-fit assessment from published material:

- stylized rather than realistic
- moderate low-poly/game-ready density
- likely closer to Four Workstations' miniature/stylized direction than realistic digital-human systems
- may require material/color simplification to avoid looking more detailed than the environment

## 4. Candidate B — Synty Sidekick Modular Characters FREE Starter Pack

Official source:

https://syntystore.com/products/sidekick-modular-characters-starter-pack

Current official facts:

- free Starter Pack
- 90+ modular rigged human base-species parts plus 50+ starter outfit/attachment parts
- explicitly **fully rigged to the Unity Humanoid skeleton (Mecanim compatible)**
- facial blend shapes for expressions/lipsync
- body blend shapes for proportions
- Sidekick editor tool can build/bake optimized character prefabs
- designed to work with Synty Animation packs
- Unity 2021.3+ support
- URP + Built-in support

Why it is a strong technical candidate:

> Unlike the current custom rigs, Sidekick is explicitly built around Unity Humanoid/Mecanim as a product contract rather than retrofitted later.

Additional advantage:

- character creator/modularity is useful for maintaining four distinct identities without maintaining four unrelated skeletons
- facial blend shapes create a future path for expression/lipsync if the product ever needs them

Trade-offs:

- visual style is strongly Synty/POLYGON and may read more chunky/cartoon than the current Four Workstations characters
- commercial Synty assets use Synty's licence rather than CC0; the current one-time-purchase licence permits incorporation/adaptation in games under its seat/team terms, but source assets cannot be redistributed for reuse
- use of Synty assets in generative-AI-related products/content has additional restrictions under the current 2026 EULA; keep provenance/licensing documented

Best role:

> Technical/visual bake-off candidate, especially if Quaternius fails hand/T-pose testing or if better modular customization is required.

## 5. Candidate C — Reallusion Character Creator / ActorCore ecosystem

Official sources:

- https://www.reallusion.com/character-creator/unity-auto-setup.html
- https://www.reallusion.com/character-creator/game.html
- https://manual.reallusion.com/CC_and_IC_Auto_Setup_Plugin/

Current official facts relevant to Unity:

- dedicated Unity/Mecanim export workflow
- automated Humanoid skeleton assignment/characterization
- Auto Setup currently supports Unity versions through Unity 6.3 (6000.3)
- automatic prefab/material/shader pipeline
- stylized as well as realistic character creation is possible
- ActorCore provides optimized/game-oriented character and motion assets
- LOD/poly reduction and material merging are part of the ecosystem

Why it is technically attractive:

> It is a mature character-production pipeline designed specifically to deliver engine-ready Humanoid characters rather than relying on ad-hoc hierarchy repair.

Trade-offs for Four Workstations:

- heavier tooling and workflow
- licensing/purchase cost is much higher than CC0/free options
- realistic/high-detail defaults can visually overshoot the miniature low-poly office unless intentionally stylized and simplified
- probably unnecessary if Quaternius or Sidekick already solve the rig problem cleanly

Best role:

> Premium fallback if production-grade character customization, facial performance, or animation tooling becomes strategically important and the simpler stylized ecosystems are insufficient.

## 6. Mixamo — animation source, not preferred replacement foundation

Official Adobe facts:

- free with Adobe ID
- characters and animations can be used royalty-free in personal/commercial/non-profit projects, including videogames
- auto-rigger is for bipedal humanoids
- custom characters should be clean, centered, and in a neutral pose for best rigging results
- Mixamo can map already-rigged characters to its animation system

Why it is not the recommended primary character-model foundation:

- useful animation library and fallback auto-rigger, but not a controlled Unity-first modular character ecosystem
- online/account workflow makes it less deterministic as the project's source-of-truth character pipeline
- current problem is not lack of individual animation clips; it is character rig/reference quality

Use Mixamo later as a clip source once a reliable replacement rig is chosen.

## 7. Recommendation

### First choice to test: Quaternius Universal Base Characters

Reasoning:

1. closest likely stylistic fit among current candidates
2. CC0 and editable
3. low/moderate triangle count (~13k)
4. proper source `.blend` available
5. explicit Humanoid rig
6. designed for the same Universal Animation Library already under evaluation
7. substantially lower integration risk/cost than rebuilding the current custom Humanoid reference pipeline

### Second choice to test: Synty Sidekick Starter

Reasoning:

1. explicitly Unity Humanoid/Mecanim native
2. free starter makes a technical test inexpensive
3. strong modular character-generation path
4. useful facial/body customization
5. likely more technically turnkey than the current models

The main question is art-direction fit, not technical capability.

### Premium fallback: Reallusion Character Creator / ActorCore

Use only if the project later needs deeper character creation/facial/mocap tooling or if the two stylized candidates fail.

## 8. Do not replace all four characters immediately

The correct next step is a **two-candidate bake-off**, not a production migration.

Use one representative character slot (Ming) and compare:

- Quaternius Universal Base Regular Male
- Synty Sidekick male character built from the free Starter Pack

Run both through the same isolated tests:

### Rig/reference quality

- Unity import as Humanoid without custom hierarchy adapter
- `Avatar.isValid && Avatar.isHuman`
- full visible bone mapping including fingers where available
- proper T-pose/reference pose
- no arm/elbow asymmetry in reference pose

### Animation quality

- Idle
- Walk
- Interact/Wave-like emote
- neutral seated clip
- simple finger/hand motion

### Visible quality

- hands/fingers
- shoulders/elbows/wrists
- knees/feet
- mesh skinning
- proportions at the frozen office camera
- style match to `premium toy-house × architectural model × gentle life game`

### Interaction quality

After a replacement candidate passes the rig test, reuse the corrected seat-geometry approach:

- real seat-top plane
- seat depth/backrest
- visible butt contact
- foot contact

Do **not** use the old chair-root-based A3 seat height.

### Performance

Record:

- triangles
- skinned mesh count
- material count
- bones
- animator cost at four-character scale

## 9. Acceptance bar for a replacement character ecosystem

A replacement is worth adopting only if it simultaneously passes:

1. Unity Humanoid reference/T-pose quality
2. hand/finger visual retarget quality
3. neutral sit/stand/locomotion quality
4. visible chair-contact feasibility
5. art-direction fit in the actual Office camera
6. four-character customization/identity feasibility
7. acceptable performance
8. licensing/provenance documentation

If Quaternius passes, the preferred future architecture becomes:

`Unity-ready Quaternius base character -> shared UAL-compatible animation set -> project interaction anchors/IK only where contact is needed`

This would eliminate the current custom hierarchy-adapter layer entirely for replacement characters.

## 10. Current decision status

- current custom characters remain production baseline for now
- failed Humanoid seating/finger patching remains paused
- no production character replacement has been approved yet
- next recommended Gate is an isolated **Character Replacement R1 — Quaternius vs Synty Bake-off**
- do not resume A4 cross-avatar seat calibration on the current custom rigs unless this replacement research is explicitly rejected
