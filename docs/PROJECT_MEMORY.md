# Four Workstations — Persistent Project Memory

> Status: LIVING / CONTINUOUSLY UPDATED  
> Established: 2026-08-24  
> Purpose: persistent project memory for future ChatGPT planning, review, handoff, and decision continuity. This document is intentionally detailed and is expected to grow over time.

## 0. How to use this document

This file is the long-term external memory of the project. It is not primarily an execution checklist for Codex.

Future planning conversations should read this document before making decisions that could conflict with prior work.

Maintenance rules:

1. Record stable decisions, important failures, root causes, visual baselines, source-of-truth rules, architecture constraints, and future directions that would be costly to rediscover.
2. Keep failed approaches when the failure teaches a reusable lesson. Mark them clearly instead of deleting history.
3. Temporary experiments do not become canonical merely because they technically pass.
4. Human visual judgement is authoritative for visual Gates. `Machine PASS != Human Visual PASS`.
5. Codex is an executor. Project strategy, Gate decisions, cross-system reasoning, and long-term memory are maintained here by the planning layer.
6. Important project Markdown is expected to expand over time so new conversations do not depend on chat context.
7. Do not silently let older Web/VQ-1C freeze rules override newer explicitly approved Unity migration decisions.

---

# 1. Product and migration direction

## 1.1 Project identity

Project: **Four Workstations**.

Core fantasy:

> Four people work, study, and live in real life while jointly building a shared miniature world that grows because of their real-life actions and social presence.

Long-term positioning:

> Shared Desktop World + Cozy Progression + Social Presence + Real-life-driven Gameplay.

Reality is gameplay input; visible world growth is feedback.

## 1.2 Current platform direction

The old Web implementation remains historical/reference material.

Current development direction is a **native Unity desktop game**.

Current planned high-level sequence:

1. Unity Visual Foundation
2. Player Locomotion & World Interaction
3. Presence / Supabase
4. Focus + XP + Coins
5. Atlas gameplay
6. Shop / Personal Desk
7. Garden
8. Memory
9. New areas
10. Desktop companion behavior later

Do not rush locomotion/gameplay while the visual foundation is still open.

## 1.3 Current local Unity environment

Current local worktree:

`E:\Projects\four-workstations-unity`

Unity project:

`E:\Projects\four-workstations-unity\unity\FourWorkstations`

Local branch observed during migration work:

`feat/unity-migration`

This branch has not been observed on remote GitHub and should be treated as local/unpushed until verified otherwise.

Unity baseline:

- Unity 6 LTS `6000.3.21f1`
- URP `17.3.0`
- Linear color
- Windows x86_64
- New Input System
- Cinemachine `3.1.3`
- glTFast `6.19.0`
- Desktop target: 60 FPS+

Important repository-state note:

- A local `docs/UNITY_MIGRATION.md` exists in the Unity worktree and has been updated by Codex during migration work.
- As of 2026-08-24, `docs/UNITY_MIGRATION.md` is **not present on remote main**.
- Do not invent or overwrite its local contents from GitHub. Reconcile it when the Unity migration branch is intentionally pushed/merged.

---

# 2. Visual direction

Target feeling:

> premium toy-house × architectural model × gentle life game

Keywords:

- warm
- restrained
- low-poly miniature architectural model
- clean/cozy
- readable directional/contact shadows
- Geometry First

Avoid:

- cheap cartoon look
- neon/cyberpunk
- heavy realistic PBR showroom rendering
- uncontrolled global subdivision
- visually noisy post-processing

The fixed/orthographic miniature view means silhouette readability often matters more than physically exact small-object scale.

---

# 3. Coordinate/orientation history — critical

A previous repair attempt incorrectly treated the camera-side wall problem as a dollhouse cutaway problem and recommended hiding/removing near-side architecture.

That diagnosis was wrong.

Root cause was **world orientation**.

Approved Unity repair:

- restore all walls/architecture
- rotate the **whole Office/world** around Y by `180°`
- preserve Environment / Characters / Waypoints / Atlas spatial relationships
- do not rotate only one model subtree
- keep the approved camera unchanged

Current migration camera reference:

- position `(10.8, 11.8, -14.5)`
- target `(0, 0.8, 0)`
- quaternion `(0.2562, -0.3030, 0.0849, 0.9140)`
- orthographic size `7`

Result:

`WORLD ORIENTATION REPAIR — HUMAN VISUAL PASS`

Permanent lesson:

> Never solve an orientation/root-coordinate problem by destructively deleting or hiding architecture.

Older Web open-wall/cutaway assumptions must not override the approved Unity whole-world Y=180° orientation.

---

# 4. Anti-aliasing / edge-quality baseline

Edge Quality Gate received Human Visual PASS.

Current approved baseline:

- PC URP asset
- Forward+
- Render Scale `1.0`
- MSAA `4x`
- Camera MSAA enabled
- screenshot RenderTexture also uses 4x samples with explicit resolve
- no FXAA/SMAA/TAA stack
- blocking Console errors: 0

Do not continue tuning AA without new evidence.

Diagnostic categories:

1. straight-line stair steps -> AA/render resolution
2. faceted curved silhouettes -> mesh topology/segment count
3. blocky shadow borders -> shadow/lighting settings

Remaining silhouette issues after this Gate were determined to be real geometry, not AA.

---

# 5. Blender toolchain

Blender CLI toolchain was explicitly unblocked.

Current machine installation:

`D:\Steam\steamapps\common\Blender\blender.exe`

Version:

- Blender `5.2.0 LTS`
- build hash `fbe6228777e7`
- `blender.exe --version`: PASS
- `blender.exe --background --version`: PASS

Portable project rule:

> Blender 5.2 LTS CLI is part of the Unity asset rebuild toolchain.

The absolute Steam path is machine-specific and must not be treated as a portable project contract.

---

# 6. Recovered Blender geometry knowledge

The repository contains authoritative/polished Blender generators and sources. Important sources include:

- `assets-source/blender/vq1c/full-office/vq1c-officeworld-full-pbr.blend`
- `assets-source/blender/vq1c/pbr/vq1c-hero-corner-pbr.blend`
- polished desk/chair/monitor/keyboard/lamp/sofa/workstation `.blend` sources
- `tools/blender/` generators and validators

The old premium look did **not** come from globally making everything high-poly.

It used category-specific geometry.

## 6.1 Hard-surface desk recipe

`tools/blender/build_vq1c_polished_desk.py` uses real bevel geometry, normally:

- 2 bevel segments
- angle-limited (`ANGLE`, about `0.6` rad threshold)
- modifiers applied before output
- smooth shading

Legacy widths:

- desk top `0.006 m`
- modesty panel `0.004 m`
- frame left/right `0.008 m`
- crossbar `0.004 m`
- feet `0.004 m`

Cable grommet torus: approximately `24 × 10` segments with smooth shading.

## 6.2 Chair recipe

`tools/blender/build_vq1c_polished_chair.py`:

- hard boxes/cylinders: 2-segment angle-limited bevel
- seat cushion: `0.028 m` bevel + Subsurf 1 + subtle manual shaping
- back cushion: `0.030 m` bevel + Subsurf 1 + slight tilt
- support frame `0.012 m`
- arm tops `0.010 m`
- arm posts `0.004 m`, around 16 radial verts
- column `0.006 m`, around 24 radial verts
- star arms `0.008 m`
- casters use modest subdivision

Soft parts are intentionally more rounded than hard structure.

## 6.3 Sofa recipe

`tools/blender/build_vq1c_polished_sofa.py`:

- hard boxes: real 2-segment bevel
- base `0.018 m`
- back frame `0.012 m`
- arms `0.022 m`
- legs `0.008 m`
- soft cushions: 4-segment bevel + Catmull-Clark Subsurf 1 + subtle deformation + smooth shading
- seat cushions roughly `0.030–0.032 m`
- back cushions roughly `0.045–0.047 m`

## 6.4 Monitor/keyboard/lamp recipe

`tools/blender/build_vq1c_polished_accessories.py` uses the same restrained hard-surface strategy.

Monitor:

- screen `0.002 m`
- bezel `0.004 m`
- back shell `0.005 m`
- neck `0.004 m`
- base `0.005 m`
- button `0.002 m`

Keyboard:

- base/top `0.004 m`
- keycaps around `0.003 m`
- spacebar `0.004 m`

Lamp:

- base `0.008 m`
- lower arm `0.004 m`
- upper arm `0.003 m`
- shade `0.004 m`
- switch `0.002 m`

## 6.5 Architecture / rugs / extra furniture

`tools/blender/build_vq1c_full_office.py` shows that architecture is intentionally much simpler:

- walls/floor/window frame/jamb/sill are structural boxes without broad decorative beveling
- visible quality comes primarily from thickness, proportions, lighting, and clean planar surfaces
- window frame thickness about `0.09 m`
- frame depth about `0.18 m`
- inner jamb depth about `0.10 m`

Rounded rugs use low-poly rounded-rectangle slabs with about `6` segments per quarter arc.

Some extra furniture selectively uses real bevels, e.g. meeting chair, dining table/bench, coffee cabinet/machine, pod share body, sofa coffee table.

Permanent modeling lesson:

> Architecture stays crisp; hard furniture gets small real bevels; soft furniture gets larger roundovers and limited subdivision; small round props get only enough radial segments to fix visible silhouette.

No global subdivision strategy.

---

# 7. Asset quality standard — long-term rule

Model quality is defined as:

> **Source Quality + Pipeline Fidelity**

A beautiful Blender source is not sufficient if export/merge/runtime processing destroys it.

Recommended asset workflow:

```text
Research / tutorial / reference model
        ↓
Reference Pack
        ↓
Asset Contract
        ↓
Authoritative Blender Source
        ↓
Automated Validation
        ↓
Fixed QA Render
        ↓
Human Visual Review
        ↓
Unity Candidate
        ↓
Approved Baseline
```

External model intake should be:

```text
Read-only Original
→ Standardized Source
→ Polished Source
→ Runtime Asset
```

Do not drag downloaded assets directly into the final Unity pipeline without normalization/validation.

Important Asset Contract fields:

- real-world dimensions
- bounds
- origin/pivot
- forward/up direction
- ground/contact plane
- material slots
- UV0/UV1 expectations
- normal/shading rules
- triangle budget
- bevel/silhouette requirements
- Anchor/Socket definitions for interactive assets

Placement principle:

> Final placement must not rely on eyeballing when a Root / Anchor / Socket contract can define it numerically.

Automated validation should check at minimum:

- transforms/scales
- bounds drift
- orientation
- empty/broken meshes
- invalid or reversed normals
- UV finite/range/overlap expectations
- material slots
- triangle-count anomalies
- anchor/socket error tolerances

Human Visual PASS is still required for proportions, style, perceived softness/hardness, and silhouette quality.

Online tutorials and existing models are knowledge/reference sources, not quality guarantees by themselves.

---

# 8. Geometry Gate history and current frozen Unity baseline

## 8.1 G1 initial blocker

The first Geometry G1 was correctly stopped instead of faking an After image.

Reason:

Unity was consuming merged runtime meshes such as:

- `Runtime_Desks`
- `Runtime_Chairs`
- `Runtime_Devices`

The authoritative bevel/subdivision logic lived in the Blender source/generators, so bulk Unity-side mesh beveling was unsafe.

Lesson:

> Do not repair authoritative Blender geometry by destructively modifying already merged Unity runtime meshes.

## 8.2 G1A — final mesh pipeline diagnosis

G1A found the actual root cause.

Polished workstation source -> current full-office source was consistent:

- each workstation: 73 meshes
- about 6,416 vertices
- 12,544 triangles
- four polished workstations: 50,176 triangles

But full office -> historical R5 runtime was **not** topology-equivalent.

Historical R5 workstation runtime total:

`22,688 triangles`

Breakdown comparison:

- Desks: `9,872 -> 4,944` when returning to polished source topology
- Chairs: `4,976 -> 24,000`
- Devices: `7,200 -> 16,848`
- Lamps: `640 -> 4,384`

The historical R5 final manifest references a different source template:

`vq1c-officeworld-full-pbr.template.blend`

That exact template is not present on current remote main.

Therefore the historical R5 runtime geometry is **not** authoritative for Unity workstation topology.

G1A also found:

- polished/full-office bevel geometry is genuinely applied
- chair seat/back Subsurf exists in polished/full-office source
- polished source normals are valid
- historical R5 had a small number of custom-normal anomalies in desks/devices
- the dominant visual issue was topology reduction/source mismatch, not missing bevel parameters

## 8.3 G1B candidate rebuild

A candidate was rebuilt using the current polished full-office workstation geometry.

Candidate output used during validation:

`outputs/unity-geometry-g1b/office-r5-g1b-workstation-candidate.glb`

Furniture Atlas1 candidate:

`outputs/unity-geometry-g1b/office-r5-g1b-lightmap-atlas1.png`

Workstation runtime topology:

`22,688 -> 50,176 triangles`

No decimation.

Other 19 runtime meshes preserved topology/bounds.

Candidate normal/UV validation:

- invalid normals: 0
- reversed normals: 0
- UV0 + UV1 present
- UV1 finite/range PASS
- UV1 overlap: 0
- hard-face / smooth-bevel split: PASS

Candidate Atlas1 bake was provisional:

- 4096×4096
- Cycles OptiX
- 64 samples
- diffuse direct-only
- margin 8 px
- only workstation runtime groups rebaked
- Atlas0 / Architecture / Rugs unchanged

## 8.4 G1C promotion in local Unity worktree

Codex integrated the validated G1B geometry into the local Unity migration assets.

Local files reported as modified include:

- `Assets/FourWorkstations/Art/Environment/Office_R5_Final.glb`
- `Assets/FourWorkstations/Art/Environment/Office_G1B_Atlas1.png`
- `Assets/FourWorkstations/Art/Environment/Office_G1B_Baseline_Manifest.json`
- corresponding `.meta` files
- local `docs/UNITY_MIGRATION.md`

Validation reported:

- Unity GLB SHA-256 exactly matched the G1B candidate
- workstation topology `22,688 -> 50,176`
- four workstation positions/size relationships had no visible drift
- Architecture / Rugs / Atlas0 / Camera / Day Lighting / 4x MSAA / Transforms / Gameplay unchanged
- historical Web R5 SHA remained unchanged
- invalid/reversed normals: 0
- UV1 overlap/blocking errors: 0
- PlayMode 2/2 PASS
- blocking Console errors: 0

## 8.5 Human visual result

The uploaded Unity Day screenshot was visually reviewed.

Result:

> **Geometry G1B / G1C — HUMAN VISUAL PASS**

Observed benefits:

- chair seat/back silhouette substantially cleaner
- desk edges/frame more complete without looking over-rounded
- monitor silhouettes cleaner
- four workstations remain visually consistent
- no visible shading dents, cracks, flipped normals, z-fighting, or positional drift
- remaining caster/star-leg complexity is acceptable at the actual game camera distance

Current rule:

> **Unity Workstation Geometry Baseline — PASS / FROZEN**

Do not continue polishing workstation topology without a new explicit Gate.

The 50,176-triangle workstation budget is currently accepted because it produces visible silhouette quality at the frozen camera and is inexpensive for the desktop target.

Geometry baseline visual reference:

`outputs/unity-geometry-g1b/02-office-day-candidate-unity.png`

---

# 9. Historical R5 lighting knowledge

The historical Web R5 final office used baked lighting as an important part of the approved look.

Final R5 manifest knowledge:

- Cycles bake
- Diffuse **direct-only**
- indirect OFF
- color OFF
- samples `256`
- margin `8`
- two `4096×4096` lightmaps
- Atlas/lightmap 0: structure
- Atlas/lightmap 1: furniture
- glTF lightmap UV uses `TEXCOORD_1`
- `lightsInGlb: 0`
- `camerasInGlb: 0`
- units: meters
- identity root transform

The Web runtime used Three.js-specific lightmap normalization/intensity logic (`4.213 * PI` in runtime code).

Permanent Unity rule:

> Do **not** copy Three.js `lightMapIntensity * PI` compensation into Unity.

Recreate the look using native Unity lighting/lightmaps/probes instead of reproducing Web renderer workarounds.

---

# 10. Unity Day lighting — current state

## 10.1 Approved visual source of truth

The approved historical Blender daylight reference is the image referred to in discussion as **Figure 3**:

`01-full-office-lightmapped-r2.png`

This image, not the failed L1 candidate, defines the desired Day lighting look.

Target characteristics:

- architectural miniature / model-photography feeling
- clear directional sunlight from the left / upper-left
- readable bright sunlit region
- broad, structured shaded region
- long, clean, directional shadows
- strong but controlled furniture/ground contact
- clear depth between wall / floor / furniture
- restrained contrast
- desk tops remain light warm wood / beige
- no dirty AO look
- no broad orange/warm wash
- no flat bright fill
- no harsh PBR showroom look

Important visual statement:

> The target is not merely “a warmer office.” It is a clean architectural-model render with a readable sunlight cut, structured shadow composition, preserved light-wood desks, and controlled depth.

## 10.2 Lighting L1 candidate

L1 established that Unity-native baked GI is technically viable, but its visual direction was rejected.

Status:

> **Lighting L1 — MACHINE PASS / HUMAN VISUAL FAIL**

L1 settings:

- Directional Light kept original direction/color/intensity/soft shadows
- Mixed / Shadowmask
- Unity native baked GI
- Progressive CPU
- Combined Directional
- max lightmap size 4096
- padding 8 px
- resolution 24 texels/m
- Direct 32 samples
- Indirect 64 samples
- Environment 32 samples
- Bounces 2
- AO enabled
- AO max distance 1.25
- one lightmap + directional + shadowmask generated
- existing 45 Light Probes baked
- four dynamic characters used `BlendProbes`
- existing realtime Reflection Probe retained at 128px, Box Projection on, intensity 0.55
- no new post-processing
- no 256-sample final bake

L1 validation was technically clean:

- bake PASS
- 4/4 characters readable
- 437-item transform signature unchanged
- 74 material references unchanged
- camera unchanged
- PlayMode 2/2 PASS
- blocking Console errors: 0
- historical Web R5 untouched

But Human Visual FAIL reasons were substantial:

1. scene became too bright / too warm / insufficiently restrained
2. lighting composition did not match Figure 3
3. large back-wall shadow was visually wrong and too dominant
4. desk tops visually shifted from approved light warm wood toward dark gray/charcoal
5. improved contact depth did not compensate for incorrect material appearance and overall light structure

Important lesson:

> A material reference can remain technically unchanged while lighting still changes the perceived material color enough to fail visual fidelity.

Therefore “material references unchanged” is not sufficient evidence that desk color is preserved.

## 10.3 Current next lighting Gate

Next Gate:

> **Lighting L1R — Match Blender Reference**

Priorities:

- Figure 3 is the single daylight visual target
- match sunlight/shadow **structure**, not only brightness/warmth
- preserve light warm wood/beige desk appearance
- use candidate lighting assets/scenes only
- keep Camera / Geometry / Transforms / Materials / 4x MSAA / Gameplay unchanged
- Unity-native baked GI and probes remain the technical direction
- do not add post-processing yet
- do not run/promote a 256-sample final bake until the lighting direction receives Human Visual PASS
- do not overwrite historical Web assets

After L1R Human Visual PASS, then decide whether a higher-quality/final bake, Reflection Probe changes, probe-density changes, or restrained material-response adjustments are actually needed.

---

# 11. Character animation — deferred until lighting is complete

Current Unity gameplay/animation work is intentionally deferred until Day lighting is closed.

Historical Web action semantics included concepts such as:

- idle
- walking
- sitting
- typing
- eating
- drinking
- resting
- slacking
- waving
- hidden

However, those historical procedural action states must **not** be confused with currently verified Unity skeletal animation clips.

The historical frozen Web skeletal character runtime formally guaranteed standing Idle/Walk, while seated-character work was previously rejected/closed in that architecture.

Unity has more expansion potential, especially through Humanoid retargeting, but it has not yet received a formal capability audit.

Later required Gate:

> Character Animation Capability Audit

It should verify:

- actual clips on all four current Unity characters
- Humanoid vs Generic rig status
- Avatar/bone mapping completeness
- root-motion support
- cross-character compatibility
- isolated Wave/Sit retarget tests
- later interaction requirements such as Anchor / Socket / IK

Permanent conceptual rule:

> Animation clips provide motion; believable world interaction also requires precise spatial contracts with furniture/props.

Examples:

- Drink requires cup socket + hand attachment + world placement
- Typing requires chair/desk/keyboard alignment and potentially hand targets
- Pet interaction requires target positioning/IK
- paired actions require synchronization of two characters and their anchors

Do not start this work before the current lighting Gate is resolved unless explicitly reprioritized.

---

# 12. Small-space gameplay direction

The Office is physically small. This is not automatically a design weakness.

The core design problem is not “small map”; it is:

> small map + few interactions + little temporal/world change

Current design principle:

> **Treat the Office as a dense interactive board/world, not primarily as a traversal map.**

Depth should first come from systems layered onto the same space:

- object/state combinations
- time-of-day/day-to-day changes
- character behavior
- personal desk identity/progression
- Atlas/world transformation
- asynchronous social traces
- events/memories/collectibles
- environmental reactivity

Examples of existing spatial “play slots”:

- four personal Desks
- central Atlas
- Coffee Corner
- Dining area
- Meeting area
- Sofa/rest area
- Window/wall surfaces
- possible future cat/pet interaction area

The design goal is to turn locations from scenery into systems before expanding the map.

## 12.1 1–4 player rule

Core gameplay must remain fully viable for **one active player**.

Additional players should increase:

- concurrency
- social expression
- surprise
- asynchronous traces
- optional cooperative/Harmony rewards

But they must not gate core progression.

Formal rule:

> Player count changes parallelism, social richness, and optional rewards — not basic playability.

A solo player may complete a multi-step activity sequentially; multiple players may divide the same workflow in parallel.

Project Atlas already follows the correct pattern:

- any player can advance Build Progress
- individual Personal Modules can record participation
- 4/4 may trigger optional Harmony Activation
- core world progression must not require 4/4 simultaneous participation

Asynchronous multiplayer is especially important for a real-world friend group:

- another member can leave a coffee/gift
- their desk can visibly retain changes
- an Atlas module can show prior contribution
- memories can record events that happened while someone was offline

Users should still feel that they are playing “with” the other members even when they are not simultaneously online.

## 12.2 Time can substitute for map size

The same Office can produce many states through:

`Office × Time × People × Progress × Objects × Events`

Examples:

- morning vs night
- today vs yesterday
- Atlas Phase 0 vs later phases
- one member online vs four
- normal day vs special event
- first week vs months of accumulated desk/memory/world changes

The effective state-space can therefore be much larger than the physical floorplan.

## 12.3 Current layered play hypothesis

A useful future structure to research further:

1. Ambient Play — characters/world continue subtle activity while the user works
2. Micro Interaction — ~10 sec to 2 min actions such as Wave, Coffee, Sticky Note, Pet, collect/inspect
3. Session Action — real 5–60 min Focus/Study/Break behavior feeds game resources
4. Daily Event — one small changing event/state rather than a new map
5. Long-term Transformation — Atlas, desks, plants, collections, memory wall, seasons
6. New Areas — only after the existing Office proves it can sustain meaningful play

Detailed 1/2/3/4-player loops and a concrete event library remain **OPEN / RESEARCH REQUIRED**.

## 12.4 New-area rule

Do not use new maps as the first fix for shallow gameplay.

If the current Office cannot sustain a meaningful loop, adding Rooftop/Café/etc. risks copying the same shallow interaction model into more space.

First prove that the existing Office can carry meaningful repeat play; then expand areas for genuinely new gameplay needs.

---

# 13. Current gameplay direction references

Existing canonical planning documents remain important:

- `docs/VQ2_GAME_DESIGN_ROADMAP.md`
- `docs/VQ2_VERTICAL_SLICE_PLAN.md`

Important current gameplay concepts already established there include:

- Player Level
- XP
- Coins
- Build Charge
- Personal Desk progression
- Project Atlas as central shared project
- Garden / Memory / Collection as later systems
- Atlas core progress cannot be blocked by missing members
- Harmony can reward full participation without gating core progression

Older economy/work-ticket concepts should not override the newer XP/Coins/Build Charge direction unless explicitly revived.

---

# 14. Source priority / conflict resolution

When documents disagree, use this priority:

1. latest explicit user decision + latest Human Visual Gate
2. this persistent project memory for current cross-system state
3. current Unity migration documentation when its local branch is available
4. `docs/VQ2_GAME_DESIGN_ROADMAP.md` and `docs/VQ2_VERTICAL_SLICE_PLAN.md` for gameplay direction
5. VQ1C FINAL/FROZEN documents for historical Web look/reference and frozen Web contracts
6. older world/economy/material documents as historical/reference

Do not let an older freeze statement silently invalidate a newer explicitly authorized Unity migration Gate.

---

# 15. Git / safety / execution rules

The old Web project has intentionally preserved dirty/untracked items in some workflows.

Never blindly run destructive cleanup such as:

- `git clean`
- `git reset` on broad scope
- `git restore .`
- `git checkout -- .`

without explicit understanding of what will be lost.

For visual work:

- do not commit/push candidate visual changes before Human Visual Review unless explicitly authorized
- preserve historical Web final/frozen assets unless the user explicitly asks to modify them
- prefer narrow Gates and reversible candidate assets
- diagnose root cause before changing many variables

For Codex prompts:

- keep prompts concise by default
- include Goal / Must / Do Not / Acceptance / commit-push policy
- add detailed history only when necessary to prevent a known destructive mistake

---

# 16. Immediate project state

Current completed visual foundations:

- world orientation repair: Human Visual PASS
- 4x MSAA edge-quality baseline: PASS
- polished Unity workstation geometry: Machine + Human Visual PASS / FROZEN

Current open visual Gate:

> **Lighting L1R — Match Blender Reference (Figure 3)**

Do not move to character animation work yet.

Immediate visual target:

- match Figure 3 daylight structure
- preserve light warm wood desks
- stronger but controlled contact/depth
- avoid L1's broad warm/bright drift and wrong back-wall shadow
- keep geometry/camera/material assignments/AA/gameplay unchanged

A final/high-sample bake should wait until this direction receives Human Visual PASS.

---

# 17. Future memory maintenance

This file should be updated whenever any of the following occur:

- a Gate receives Human Visual PASS/FAIL and the reason matters later
- a root cause is discovered that could otherwise be rediscovered repeatedly
- source-of-truth asset/architecture changes
- a technical baseline becomes frozen
- a previous assumption is overturned
- a significant gameplay direction is accepted/rejected
- a major future system receives stable design rules
- a toolchain dependency becomes part of the build/rebuild process
- a project sequence/priority changes

The purpose is continuity: future conversations should be able to resume the project without relying on hidden or truncated chat history.

---

# 18. 2026-08-25 — L1R result and permanent-asset priority

## 18.1 L1R result

`Lighting L1R — Match Blender Reference` completed technical validation but did **not** receive full Human Visual PASS.

Reported candidate settings:

- Directional ray `(-0.65, -0.58, -0.49)`
- intensity `1.55`
- color `(1.00, 0.93, 0.82)`
- soft shadows
- shadow strength `0.86`
- shadow angle `2.2°`
- bias / normal bias `0.045 / 0.24`
- Mixed Lighting `IndirectOnly`
- Progressive CPU, Combined Directional
- max lightmap `4096`
- padding `8 px`
- resolution `24 texels/m`
- Direct `48`, Indirect `64`, Environment `24`
- bounces `2`
- indirect scale `0.58`
- albedo boost `0.9`
- AO distance `0.65`
- AO direct / indirect `0.22 / 0.30`
- 1 lightmap
- 45 Light Probes
- no post-processing
- no 256-sample final bake

Human visual judgement:

- Figure 3 sunlight direction: substantially improved / directionally correct
- long shadow structure: substantially improved
- contact shadows: substantially improved
- overall miniature architectural-model mood: closer to target
- desk color fidelity: still FAIL; the four desk tops remain too dark/gray relative to the approved Figure 3 light warm wood
- the scene is promising but still visibly not the final desired look

A key diagnostic from Codex:

- `Runtime_Desks` material assignment and BaseColor properties were unchanged
- the current frozen Unity source Office also shows the desk tops as dark gray without the L1R bake
- therefore the desk-color mismatch is not reliably solvable by global lighting alone without damaging walls/floor exposure

Implication:

> The desk-color mismatch is now suspected to be a baseline material/albedo fidelity problem, not merely a lighting problem. Because the desks are permanent long-term assets, a narrowly scoped material-fidelity Gate is allowed later; do not fake the target by globally overexposing the scene.

## 18.2 Wall black-rectangle artifact — blocking bug

The L1R screenshot contains clearly visible near-black rectangular blocks on the rear wall.

These blocks are not acceptable as intentional shadow language and should be treated as a **blocking visual bug** until diagnosed.

Important observations:

- their edges are unusually rectangular/hard compared with the intended organic cast-shadow structure
- they appear on permanent architecture
- Figure 3 does not establish these pure black rectangles as part of the approved look

Do not blindly tune light intensity/AO to hide them.

Next diagnosis should isolate whether they originate from:

- baked lightmap texels / UV1 island or scale-offset problems
- renderer lightmap index / lightmapScaleOffset assignment
- shadowmask / mixed-light interaction
- occlusion from unintended geometry
- material/lightmap sampling on specific wall renderer primitives
- another candidate-only baked-data issue

The fix must be root-cause based and must not alter camera/world orientation or destructively change wall geometry.

## 18.3 Permanent vs replaceable visual assets

User explicitly clarified which current scene assets should be treated as long-term foundations versus temporary/revisable content.

### Permanent / high-priority foundation assets

These are expected to remain and therefore must not carry visible bugs into later development:

- floor
- walls / architectural shell
- four main desks
- dining table
- meeting table

For these assets, later lighting/material/geometry work must preserve correctness and visual stability. Visible artifacts on them are blocking until understood.

The four desks in particular are long-term assets and will continue to be used. Their current light-warm-wood target should therefore be solved correctly rather than ignored as a temporary prop issue.

### Deferred / expected to be remodeled or repositioned later

Current versions of the following are **not** worth blocking the lighting foundation on unless they cause a larger technical issue:

- small workstation props such as monitors/computers, mugs, desk lamps and similar accessories
- current placement of those small desk props
- cat bed / cat feeding area and related pet props, which are incomplete/not yet properly built
- sofa, which is expected to be revised later
- other minor props whose modeling/placement is already expected to change

Their current visual oddities can be tolerated temporarily during lighting work.

Permanent rule for visual triage:

> Do not spend current lighting-Gate time polishing temporary props that are already scheduled for remodeling. Prioritize bug-free lighting/material behavior on the architectural shell and long-lived tables/desks first.

## 18.4 Revised next-step order

The next visual work should be narrower than another broad lighting retune:

1. diagnose/fix the rear-wall black-rectangle artifact while preserving the current L1R lighting direction
2. revalidate floor/walls/desks/dining table/meeting table for lightmap/material correctness
3. address desk material/albedo fidelity separately if the dark-gray desk baseline is confirmed to be source-material mismatch
4. only after the permanent foundation surfaces are visually clean, continue fine matching to Figure 3
5. do not run the final/high-sample bake until those issues are resolved and Human Visual PASS is reached
6. defer small props, pet props, sofa remodel, and character-animation work

Current recommended Gate name:

> **Lighting L1R-A — Permanent Surface Artifact Diagnosis**

Scope should be diagnosis-first: eliminate the wall black-block bug and prove permanent surfaces are clean before further artistic tuning.
