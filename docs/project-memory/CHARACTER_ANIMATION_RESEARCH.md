# Four Workstations — Character Animation Research Memory

> Status: LIVING / A1 AUDIT PASS / PRODUCTION ADAPTER OPEN  
> Established: 2026-08-25  
> Purpose: preserve character-animation capability findings, external reusable sources, retargeting constraints, and future implementation decisions for new ChatGPT conversations.

## 1. Standing research/reuse rule

User directive:

> Do not assume every step must be built from scratch. Before implementing a system, model, animation, visual treatment, or technical solution, actively look for suitable official documentation, high-quality tutorials, existing assets, open-source solutions, and reusable libraries. Reuse is encouraged when licensing, style, compatibility, and quality are acceptable.

Default workflow:

`Research / existing solution -> shortlist -> compatibility/license check -> isolated candidate -> project-specific validation -> Human review -> integration`

External resources are inputs, not automatic baselines. Project validation remains mandatory.

## 2. Character-animation question

The first goal was a **Character Animation Capability Audit**: determine what the four current Unity characters can actually do, rather than assuming historical Web procedural actions are available as skeletal clips.

Historical action semantics included concepts such as idle, walking, sitting, typing, eating, drinking, resting, slacking and waving, but those semantics are not proof that the current Unity characters contain those clips.

## 3. Retargeting prerequisite — Unity

Unity humanoid retargeting requires a model configured as **Humanoid** with a valid **Avatar** mapping. A shared Animator Controller/animation set can then be reused across different humanoid models when the Avatar mappings are valid.

Official reference:

- Unity Manual — Retargeting of Humanoid animations: https://docs.unity3d.com/Manual/Retargeting.html

Implication for Four Workstations:

> Do not design or integrate a large animation library unless all four current characters pass Humanoid/Avatar compatibility checks, or until a deliberate alternative rig pipeline is chosen.

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

The first library is currently the preferred initial source because Four Workstations needs everyday locomotion/emotes/sitting before specialized combat or parkour actions.

Important: external claims of compatibility do not replace an actual retarget test on the four project characters.

## 5. Secondary reusable source — Adobe Mixamo

Official Adobe references checked 2026-08-25:

- https://helpx.adobe.com/creative-cloud/help/mixamo-rigging-animation.html
- https://helpx.adobe.com/creative-cloud/help/animate-characters-mixamo.html

Mixamo can upload/map a rigged humanoid character and apply animations from its animation library. For already-rigged custom characters, Adobe documents automatic skeleton mapping into the Mixamo system.

Use Mixamo as a useful secondary/fallback source, especially for specific everyday clips not available in the preferred reusable library.

Do not make Mixamo a hard runtime dependency. Downloaded clips should become normal project assets after licensing/provenance and retarget validation.

## 6. Animation clip vs world interaction

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

## 7. Root motion direction

Do not choose Root Motion globally before locomotion architecture is defined.

Quaternius currently provides both Root Motion and non-Root-Motion variants, so the project can test both without reauthoring animations.

Current default after A1:

- production characters remain `applyRootMotion=false`
- stationary emotes/sitting should prefer non-Root-Motion clips
- click-to-move/pathfinding should likely let gameplay/navigation own translation, with in-place locomotion animation
- Root Motion can be evaluated later for isolated authored interactions if it provides a clear benefit

This is still an implementation policy, not a blanket prohibition on Root Motion.

---

# 8. A1 — Character Animation Capability & Retarget Audit

Status:

> **Character Animation A1 — MACHINE PASS / RETARGET STRATEGY VALIDATED**

The key strategic result is positive:

> All four current characters can share one Humanoid animation library after the same hierarchy-adapter strategy is applied.

This means basic action variety is not fundamentally blocked by the character models themselves.

## 8.1 Four-character capability matrix

| Character | Current Production Rig | Production Avatar | Audit Avatar | Bones | Current Clips | Root Motion | Shared Animation Capability |
|---|---|---|---|---:|---|---|---|
| Ming | Generic / glTFast | `null` | Humanoid Valid | 62 | Idle 1.67s, Walk 1.33s | current clips: none | yes, through Adapter |
| Hong | Generic / glTFast | `null` | Humanoid Valid | 62 | Idle 2.08s, Walk 1.67s | current clips: none | yes, through Adapter |
| Jie | Generic / glTFast | `null` | Humanoid Valid | 62 | Idle 1.67s, Walk 1.33s | current clips: none | yes, through Adapter |
| Qixi | Generic / glTFast | `null` | Humanoid Valid | 62 | Idle 2.08s, Walk 1.67s | current clips: none | yes, through Adapter |

Shared production facts:

- Scale `(1,1,1)` for all four
- orientation consistent across all four
- Animator valid and set to `AlwaysAnimate`
- each character currently has an independent Animator Controller, but the controller structures are equivalent
- production controllers currently contain only Idle/Walk with `Speed`
- `applyRootMotion=false`
- all four characters use identical bone names/topology

Therefore one shared adapter implementation can serve all four characters.

## 8.2 Why production is not already Humanoid-valid

The existing production character hierarchy is not a valid Unity Humanoid tree.

Observed hierarchy defects:

- `UpperLeg.L/R` are not descendants of `Hips`
- `Foot.L/R` are not under their corresponding lower-leg chains
- `Head` is attached to the model node rather than beneath `Neck`
- production Animator Avatar is `null` for all four characters

Consequences:

- existing Generic animation can only be reused when bone paths match exactly
- Quaternius UAL `DEF-*` paths do not match the current production bone paths, so Generic direct reuse is not viable
- simply dropping Quaternius clips onto the production Generic rigs is not a valid architecture

Audit solution:

> Add a minimal hierarchy adapter in an isolated audit copy, then generate a Unity Humanoid Avatar from the adapted hierarchy.

With the adapter applied, all four characters successfully produced:

- `Avatar.isValid = true`
- `Avatar.isHuman = true`

The adapter was audit-only and did not modify production models or Prefabs.

Permanent conclusion:

> The production limitation is hierarchy compatibility, not body topology incompatibility. A controlled shared Humanoid adapter is the preferred bridge.

## 8.3 A1 reusable test clips

The public standard package used for audit did not contain a clip literally named `Wave`, so `Rig|Interact` was used as the simple greeting/emote proxy.

Test clips:

- `Rig|Interact` — 2.0s, includes root curves
- `Rig|Sitting_Enter` — 1.292s, includes root curves

For the isolated test:

- `applyRootMotion=false`
- all four characters reported root delta `(0,0,0)`
- no scale drift

The full downloaded mirror was removed after the audit; only the two isolated test FBX clips remain locally for audit evidence.

Formal integration should prefer the current official Unity-ready Quaternius package rather than the temporary public glTF mirror conversion used for the audit.

## 8.4 Interact / greeting retarget result

All four characters PASS.

Observed across Ming / Hong / Jie / Qixi:

- shoulders, elbows and wrists move normally
- hands/fingers do not explode or invert
- hips/knees/feet remain stable
- no root offset
- no scale drift
- body proportion retarget is stable
- no visible mesh tearing or severe abnormal stretching

Hong/Qixi have slightly higher hip proportions than Ming/Jie, but the retarget remains stable.

Conclusion:

> Standing emotes and many other non-contact Humanoid actions are low-risk reusable-animation candidates.

## 8.5 Sit retarget result

The Sit animation itself successfully retargeted on all four characters.

PASS at animation level:

- hip/knee bend direction correct
- arm pose normal
- no scale drift
- no horizontal root drift
- no visible flipped-normal/mesh-tearing issue

But Sit is **not production-ready as a workstation interaction**.

Measured interaction constraints from the audit:

- without a Chair Anchor, characters appear suspended / misaligned with the seat
- end-of-sit foot-bottom height is approximately `0.25–0.31 m`
- seated hip height across body types is approximately `0.73–0.82 m`
- different chairs require seat height, fore/aft offset and facing/orientation data
- Foot IK or chair-specific foot correction will likely be required
- continuous-play foot sliding still needs PlayMode verification with real chair/ground contact

Conclusion:

> Sit clip availability is solved; seat alignment is an interaction-system problem.

## 8.6 Recommended reusable animation source

Primary source:

> **Quaternius Universal Animation Library — current official Unity-ready CC0 release**

Recommended use:

- stationary emotes / sit: non-Root-Motion variants
- locomotion: evaluate separately, likely in-place first for click-to-move navigation

Mixamo remains a secondary/fallback source for specific everyday actions not covered well by the preferred library.

Do not import the entire animation ecosystem before gameplay needs justify it. Pull in clips by category/need.

## 8.7 Recommended Unity animation architecture

Current preferred architecture:

1. **Shared `CharacterHumanoidAdapter`**
   - fixes the common hierarchy problem at import/build/runtime preparation stage without hand-editing each character independently
   - all four characters use the same adapter rules because their bone naming/topology matches

2. **One Avatar per character**
   - each body generates its own valid Humanoid Avatar
   - all share the same Humanoid AnimationClip library

3. **Shared base Animator Controller**
   - Base Locomotion: Idle / Walk
   - Full-body Action layer: Sit / Stand and other whole-body actions
   - Upper-body Override: Wave / Interact / Talk / emotes, with an Avatar Mask where appropriate

4. **Default `applyRootMotion=false`**
   - gameplay/nav controls movement unless a later isolated interaction explicitly benefits from Root Motion

5. **Interaction contracts separated from clips**
   - `SeatAnchor`: hips/seat alignment, facing, seat height, foot targets
   - object actions: hand sockets / reach targets / pickup-return timing
   - contact correction: Unity Animation Rigging / IK as needed rather than editing every source clip

## 8.8 Action-cost classification after A1

### Easy retarget

- Wave / Interact
- Yes / No
- Talking
- simple standing emotes
- Idle variants

### Needs Anchor / Socket / IK

- Sit / Stand
- different chair heights
- desk-side Pick Up / Place
- keyboard / monitor / desk-lamp interaction
- precise foot-to-ground correction
- Drink / Eat once props are involved
- Pet interaction

### Complex synchronized interaction

- handshake
- hug
- high-five
- two-person object carrying
- two-hand Atlas operations
- multiplayer synchronized assembly
- any shared-prop interaction with strict paired timing

## 8.9 A1 safety / non-regression

Audit did not modify:

- production Office
- Day/Night lighting
- production character positions
- production character Prefabs
- production scale/orientation
- gameplay

Console blocking errors: `0`.

No Unity code/assets were committed/pushed during the audit.

---

# 9. Strategic conclusion after A1

The original question — “are there many actions we can do, and are there actions we currently cannot do?” — now has a clearer answer.

### What is no longer a major risk

Basic humanoid action variety.

Because all four characters successfully retarget through the same adapter approach, the project can reuse a large external Humanoid animation library rather than authoring basic movement/emotes from scratch.

### What is now the real constraint

World interaction fidelity.

The hard part is no longer obtaining a Sit/Drink/Type animation clip. The hard part is aligning the character to the world correctly and maintaining contact:

`Character Humanoid Adapter -> Shared Animation Clip -> Interaction Anchor/Socket -> IK/Rig correction -> Gameplay timing`

This distinction should guide planning and estimation.

Do not estimate a workstation interaction only by the animation clip cost.

---

# 10. Recommended next animation Gate

Next recommended Gate:

> **Character Animation A2 — Production Humanoid Adapter Foundation**

Goal:

Turn the proven audit-only adapter strategy into a small reusable production foundation without yet building a large animation feature set.

A2 should:

- implement one deterministic shared adapter rule set for all four existing characters
- generate/assign valid Humanoid Avatars for all four in an isolated production candidate path
- preserve current appearance, scale, orientation and Idle/Walk behavior
- prepare one shared base Animator Controller architecture
- integrate only a tiny verified animation set for validation (for example Interact + Sit)
- keep `applyRootMotion=false`
- avoid SeatAnchor/IK gameplay implementation until the adapter foundation itself is proven stable

A2 should not:

- import the entire Quaternius library
- rewrite locomotion gameplay
- alter Office geometry/lighting
- permanently replace production character assets before visual/behavior validation
- commit/push before review

After A2 passes, the next interaction-focused step should be a real `SeatAnchor` test on one workstation/chair, because Sit already proved that spatial alignment — not clip retargeting — is the next meaningful problem.
