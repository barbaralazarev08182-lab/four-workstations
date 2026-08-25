# Four Workstations — Character Animation Research Memory

> Status: LIVING / RESEARCH + AUDIT OPEN  
> Established: 2026-08-25  
> Purpose: preserve character-animation capability findings, external reusable sources, retargeting constraints, and future implementation decisions for new ChatGPT conversations.

## 1. Standing research/reuse rule

User directive:

> Do not assume every step must be built from scratch. Before implementing a system, model, animation, visual treatment, or technical solution, actively look for suitable official documentation, high-quality tutorials, existing assets, open-source solutions, and reusable libraries. Reuse is encouraged when licensing, style, compatibility, and quality are acceptable.

Default workflow:

`Research / existing solution -> shortlist -> compatibility/license check -> isolated candidate -> project-specific validation -> Human review -> integration`

External resources are inputs, not automatic baselines. Project validation remains mandatory.

## 2. Current character-animation question

The next priority after the visual-lighting foundation is a **Character Animation Capability Audit**.

The audit must answer what the four current Unity characters can actually do now, rather than assuming historical Web procedural actions are available as skeletal clips.

Historical action semantics included concepts such as idle, walking, sitting, typing, eating, drinking, resting, slacking and waving, but those semantics are not proof that the current Unity characters contain those clips.

Required local audit targets:

- all four current character model imports
- Rig type: Humanoid vs Generic
- Avatar validity and bone mapping completeness
- current clips embedded/imported per character
- current Animator / Animator Controller setup
- root-motion capability
- cross-character rig compatibility
- scale/orientation consistency
- problematic/missing bones

## 3. Retargeting prerequisite — Unity

Unity humanoid retargeting requires a model configured as **Humanoid** with a valid **Avatar** mapping. A shared Animator Controller/animation set can then be reused across different humanoid models when the Avatar mappings are valid.

Official reference:

- Unity Manual — Retargeting of Humanoid animations: https://docs.unity3d.com/Manual/Retargeting.html

Implication for Four Workstations:

> Do not design a large animation library until all four current characters pass Humanoid/Avatar compatibility checks, or until a deliberate alternative rig pipeline is chosen.

## 4. Strong reusable animation candidate — Quaternius Universal Animation Library

Current official Quaternius source checked 2026-08-25:

https://quaternius.itch.io/universal-animation-library

Key facts:

- 120+ animations
- universal humanoid rig
- Unity-ready exported version
- intended for retargeting
- locomotion in multiple directions, jog, sprint, push, crawl, swim, sitting, emotes and more
- CC0 license; usable in personal, educational and commercial projects
- 2026 update provides both Root Motion and non-Root-Motion exports
- June 2026 update fixed Unity scale warnings and synchronized 8-direction step starts

Universal Animation Library 2:

https://quaternius.itch.io/universal-animation-library-2

Key facts:

- 130+ additional animations
- compatible humanoid rig / Unity retargeting
- additional parkour, farming, fishing, combat and other actions
- CC0
- Root Motion and non-Root-Motion variants

The first library is currently the stronger initial audit candidate because Four Workstations needs everyday locomotion/emotes/sitting before specialized combat or parkour actions.

Important: external claims of compatibility do not replace an actual retarget test on the four project characters.

## 5. Secondary reusable source — Adobe Mixamo

Official Adobe references checked 2026-08-25:

- https://helpx.adobe.com/creative-cloud/help/mixamo-rigging-animation.html
- https://helpx.adobe.com/creative-cloud/help/animate-characters-mixamo.html

Mixamo can upload/map a rigged humanoid character and apply animations from its animation library. For already-rigged custom characters, Adobe documents automatic skeleton mapping into the Mixamo system.

Use Mixamo as a useful secondary/fallback source, especially for specific everyday clips not available in the preferred reusable library.

Do not make Mixamo a hard runtime dependency. Downloaded clips should become normal project assets after licensing/provenance and retarget validation.

## 6. First isolated retarget tests

The first two tests should remain deliberately small:

1. **Wave** — tests upper-body retarget quality, shoulders/elbows/hands, and general proportions without furniture contact.
2. **Sit** — tests pelvis/leg retarget quality and exposes the future need for precise chair anchors/interaction alignment.

If these both work on all four characters, the project has strong evidence that a reusable humanoid animation-library strategy is viable.

If Wave works but Sit fails visually, do not conclude the whole retarget system failed; sitting additionally depends on character proportions and chair/seat alignment.

## 7. Animation clip vs world interaction

Permanent conceptual rule:

> Animation clips provide motion; believable interaction requires separate spatial contracts.

Examples:

- Sit -> Seat Anchor + facing/orientation + pelvis/feet clearance
- Type -> Seat Anchor + keyboard location + hand targets/IK if needed
- Drink -> cup world anchor + hand socket + animation timing + return placement
- Atlas interaction -> interaction anchor + facing + hand/reach target
- Pet -> pet target anchor + hand IK / range handling
- high-five/hug -> two-character synchronized anchors and timing

Therefore the future architecture should separate:

`Animation Library` from `Interaction Contract / Anchor / Socket / IK`.

## 8. Root motion direction

Do not choose Root Motion globally before locomotion architecture is defined.

Quaternius currently provides both Root Motion and non-Root-Motion variants, so the project can test both without reauthoring animations.

Likely use cases to evaluate later:

- click-to-move/pathfinding often benefits from gameplay/navigation owning translation, with in-place locomotion animation
- authored interaction animations may benefit from controlled root motion in isolated contexts

This remains an implementation decision, not a frozen rule yet.

## 9. Audit acceptance output

The Character Animation Capability Audit should return:

- capability matrix for all four characters
- exact Rig/Avatar status
- existing clip inventory
- Wave retarget result per character
- Sit retarget result per character
- root-motion findings
- any scale/orientation/bone problems
- recommended reusable animation source(s)
- minimum Unity animation architecture before gameplay implementation
- a clear list of actions that are easy, medium-cost, and interaction-heavy

Do not permanently integrate a large animation pack during the audit.

Do not alter Office geometry, Day/Night lighting baselines, camera, world orientation, gameplay, or character placement merely to force a retarget PASS.

No commit/push until the audit result is reviewed.
