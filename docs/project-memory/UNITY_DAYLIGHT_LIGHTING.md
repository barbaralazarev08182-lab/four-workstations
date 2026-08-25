# Four Workstations — Unity Daylight Lighting Memory

> Status: LIVING / TOPICAL PROJECT MEMORY  
> Established: 2026-08-25  
> Purpose: preserve the detailed Unity daylight-lighting migration history, root causes, accepted/rejected candidates, and visual source-of-truth rules for future ChatGPT planning and handoff.

## 1. Visual source of truth

The approved historical Blender render `01-full-office-lightmapped-r2.png` (referred to in discussion as Figure 3) is the visual source of truth for Day lighting.

Target characteristics:

- architectural miniature / model-photography feeling
- clear sunlight entering from the left / upper-left
- readable bright sunlit region and broad structured shaded region
- long, clean directional shadows
- strong but controlled furniture/ground contact
- restrained contrast
- floor/wall/furniture depth without dirty AO
- four permanent desk tops read as light warm wood / beige
- avoid orange wash, flat fill, or harsh PBR showroom rendering

Historical Web/Three.js lightmap intensity compensation such as `4.213 * PI` is renderer-specific and must not be copied into Unity.

## 2. Permanent surfaces vs deferred props

Permanent/high-priority surfaces that must be bug-free before the Day baseline can close:

- floor
- walls / architectural shell
- four main desks
- dining table
- meeting table

Deferred/replaceable content that should not block current lighting work unless it causes a broader technical defect:

- monitors/computers, mugs, desk lamps and other small workstation props
- current small-prop placement
- cat bed / feeding props and other incomplete pet props
- sofa, which is expected to be revised later
- other minor props already scheduled for remodeling

## 3. L1 — rejected visual direction

`Lighting L1 — MACHINE PASS / HUMAN VISUAL FAIL`

Technical direction proved Unity-native baked GI viable, but the look was rejected because it became too bright/warm/flat, did not match Figure 3, produced a wrong large rear-wall shadow, and left the desk appearance inconsistent with the approved light-wood target.

Important lesson: unchanged material references do not guarantee preserved perceived material appearance.

## 4. L1R — Figure 3 directional structure

L1R moved the candidate substantially closer to Figure 3.

Reported settings:

- Directional ray `(-0.65, -0.58, -0.49)`
- intensity `1.55`
- color `(1.00, 0.93, 0.82)`
- soft shadows
- shadow strength `0.86`
- shadow angle `2.2°`
- bias / normal bias `0.045 / 0.24`
- Mixed Lighting `IndirectOnly`
- Progressive CPU / Combined Directional
- max lightmap `4096`
- padding `8 px`
- `24 texels/m`
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

Visual result:

- sunlight direction: substantially correct
- long shadow structure: substantially correct
- contact depth: improved
- miniature architectural-model mood: closer
- desk color: still wrong/dark
- black rectangular rear-wall artifacts present

The overall Day Gate remained open.

## 5. L1R-A — rear-wall black rectangle root cause and fix

`Lighting L1R-A — ROOT CAUSE VERIFIED / MACHINE PASS`

Affected renderer/mesh:

`Runtime_Arch`

Bake assignment observed:

- lightmap index `0`
- lightmap scale/offset `(0.84, 0.83, 0, 0)`

UV1 diagnostics:

- out-of-range: `0`
- zero-area polygons: `0`
- overlapping loops: `38,088`
- affected polygons: `12,696 / 12,696`

Root cause:

> Overlapping wall/floor UV1 islands sampled unrelated near-black baked texels, producing fixed black rectangles on the rear wall.

Explicitly ruled out:

- sunlight direction
- Directional Light intensity/color
- Mixed Lighting mode
- material-slot changes
- hidden geometry

Candidate-only valid UV1 meshes were generated for:

- `Runtime_Arch`
- `Runtime_DiningTable`
- `Runtime_MeetingTable`

The already validated G1B `Runtime_Desks` UV1 was preserved.

Only UV seam vertex splits were introduced:

- Architecture `25,368 -> 26,284` vertices
- Dining table `3,000 -> 3,044`
- Meeting table `408 -> 410`

Triangle counts, world-space triangle positions, bounds, camera, transforms, materials, L1R sun/shadow composition, AA and gameplay remained unchanged.

Result:

- rear-wall black rectangles gone
- walls/floor continuous
- no new permanent-surface sampling artifacts
- desks/dining/meeting stable
- Figure 3 sun/shadow direction preserved
- Console blocking errors `0`

Permanent pipeline rule:

> UV1 existence and in-range values are not sufficient. Every long-lived lightmap receiver must pass UV1 overlap validation before baked-lighting promotion.

For combined runtime meshes, validate at least UV1 range, zero-area islands, overlap, lightmap index, lightmap scale/offset and post-bake visual continuity.

## 6. L1R-B — desk material-slot fidelity

`Lighting L1R-B — MACHINE PASS / HUMAN VISUAL PASS FOR DESK FIDELITY`

Exact root cause:

After the G1B topology upgrade, the Unity Scene still used the historical R5 material-slot order for `Runtime_Desks`.

Wrong historical slot order still present in Unity:

`[metal, wood, counter]`

Correct G1B/polished topology slot order:

`[wood, metal, dark]`

Therefore the desk top polygons were receiving the wrong material despite the underlying material assets themselves being valid.

Explicitly ruled out:

- albedo/BaseColor values
- color-space import
- metallic/smoothness tuning
- GLB material conversion
- lighting

Minimal fix:

> Remap only the three `Runtime_Desks` material slots. Do not modify the material assets themselves.

Validation:

- four desk tops restored to Figure 3-style light warm wood / beige: PASS
- L1R sunlight and shadow structure unchanged: PASS
- G1B desk geometry unchanged: PASS
- G1B desk UV1 unchanged: PASS
- camera/transforms/4x MSAA unchanged: PASS
- walls/floor/dining/meeting materials unchanged: PASS
- lightmaps `1`
- Light Probes `45`
- Console blocking errors `0`
- no 256-sample final bake
- no Unity candidate commit/push

Candidate scene:

`Assets/FourWorkstations/Scenes/Candidates/Office_L1RB_Desk_Fidelity_Candidate.unity`

Human visual review of the provided L1R-B screenshot confirms that the four desk tops now read as the intended light warm wood and no longer appear charcoal/dark gray.

Permanent pipeline lesson:

> Topology replacement can change material-slot ordering even when object names and material assets survive. Runtime material-slot order must therefore be validated whenever authoritative mesh topology is replaced or merged.

Recommended future validation manifest for long-lived merged assets should include ordered material-slot names, not merely an unordered list of material references.

## 7. Current Day-lighting status after L1R-B

The major structural defects discovered so far have been isolated and corrected:

- wrong world orientation: fixed earlier
- workstation topology reduction: fixed earlier
- invalid architecture/dining/meeting UV1 overlap: fixed in L1R-A
- wrong desk material-slot order: fixed in L1R-B

The Day visual direction is now substantially closer to Figure 3, but **the overall Day Lighting baseline is not yet frozen**.

Remaining work should be artistic fine matching only, while keeping the newly verified data contracts fixed:

- do not change world orientation/camera
- do not change G1B workstation topology/UV1
- do not change corrected permanent-surface UV1
- do not change corrected desk material-slot mapping
- do not spend time polishing deferred temporary props

Next recommended Gate:

`Lighting L1R-C — Figure 3 Fine Match`

Goal: make only small, controlled lighting adjustments needed to close the remaining visual gap with Figure 3, then request Human Visual approval before running/promoting a final high-sample bake.

Potential review axes:

- left-wall highlight intensity / clipping
- rear/right shaded-region brightness and color neutrality
- floor warmth versus Figure 3
- shadow softness/strength without losing the long structured silhouette
- contact depth on permanent surfaces

Do not change several parameters at once without before/after evidence.

A 256-sample final bake remains deferred until L1R-C receives Human Visual PASS.

## 8. L1R-C — Figure 3 fine match

`Lighting L1R-C — HUMAN VISUAL PASS FOR DAYLIGHT DIRECTION`

Only the following lighting values changed from the previous accepted L1R-B candidate:

- Sun intensity `1.55 -> 1.38`
- Sun color `(1.00, 0.93, 0.82) -> (1.00, 0.975, 0.94)`
- Ambient Sky `(0.46, 0.48, 0.48) -> (0.49, 0.50, 0.50)`
- Ambient Equator `(0.29, 0.29, 0.27) -> (0.33, 0.33, 0.32)`
- Ambient Ground `(0.13, 0.12, 0.105) -> (0.16, 0.16, 0.155)`

Everything else remained contractually fixed:

- camera/world orientation
- G1B workstation geometry and UV1
- L1R-A corrected permanent-surface UV1
- L1R-B desk material-slot mapping
- materials
- transforms
- 4x MSAA
- gameplay

Reported technical validation:

- low-cost bake only
- no 256-sample final bake
- Console blocking errors `0`
- no commit/push of the Unity candidate

Human visual review of the supplied 1920x1080 candidate:

- left-wall/floor direct-light region is less yellow and less clipped than L1R-B
- rear/right shaded region is more neutral and more readable without becoming flat
- long directional cast shadows remain intact
- furniture/ground contact depth remains intact
- four desk tops retain the accepted light warm wood/beige appearance
- rear-wall black rectangles do not return
- floor/walls/desks/dining table/meeting table show no new visible bake artifact
- overall image still reads as the intended architectural-miniature/model-photography daylight

Compared with the historical Figure 3 reference, L1R-C is slightly softer/more filled in the dark region, but this is accepted because it improves in-game readability without losing the reference's defining sunlight direction, long-shadow structure, contrast hierarchy, or material identity.

Therefore the low-cost Day lighting direction is visually approved.

The **final Day Lighting baseline is not yet frozen** until the same direction survives the final high-quality bake without visual drift or artifact regression.

Next Gate:

`Lighting L1R-FINAL — High-Quality Bake and Promotion`

Rules for final bake:

- preserve the exact L1R-C artistic settings; do not continue creative retuning during the final bake Gate
- raise bake quality/samples only
- preserve all verified UV/material/geometry/camera contracts
- validate permanent surfaces for artifact regression
- compare final 1920x1080 screenshot directly against the approved L1R-C candidate
- if the high-quality bake materially changes brightness, shadow composition, desk color, or surface continuity, do not auto-promote; diagnose the bake difference
- only after final Human Visual PASS may Day Lighting be marked FINAL/FROZEN

## 9. L1R-FINAL — high-quality bake Human Visual PASS

`Lighting L1R-FINAL — MACHINE PASS / HUMAN VISUAL PASS`

The high-quality candidate retained the approved L1R-C visual direction without material drift or artifact regression.

Final candidate bake quality:

- Direct `256` samples
- Indirect `256` samples
- Environment `256` samples
- max lightmap `4096`
- padding `8 px`
- resolution `24 texels/m`
- bounces `2`
- lightmaps `1`
- Light Probes `45`, valid

The approved L1R-C artistic settings remained unchanged:

- Sun intensity `1.38`
- Sun color `(1.00, 0.975, 0.94)`
- Ambient Sky `(0.49, 0.50, 0.50)`
- Ambient Equator `(0.33, 0.33, 0.32)`
- Ambient Ground `(0.16, 0.16, 0.155)`
- Figure 3-aligned sun direction and long-shadow composition preserved

Reported comparison against the approved L1R-C screenshot:

- mean absolute pixel difference `0.635 / 255`
- pixels with difference greater than `8`: `1.85%`
- no material change in brightness hierarchy, shadow structure, desk color, or permanent-surface continuity

Human visual review of the supplied 1920x1080 FINAL candidate confirms:

- the image is visually consistent with the approved L1R-C candidate
- left-side sunlight remains clean and restrained
- rear/right shaded region remains readable and neutral enough for gameplay
- long directional shadows remain intact
- furniture/ground contact depth remains intact
- all four permanent desk tops remain light warm wood/beige
- rear-wall black rectangles do not return
- floor, walls, desks, dining table and meeting table show no new visible bake artifact
- the intended architectural-miniature/model-photography character remains intact

Therefore the Day lighting **visual and bake-quality Gate is complete**.

### Promotion state

The validated high-quality candidate scene is:

`Assets/FourWorkstations/Scenes/Candidates/Office_L1R_Final_High_Quality_Candidate.unity`

At the time of this review, production `Office.unity` has **not yet been overwritten/promoted** and the Unity candidate has not been committed/pushed.

So use the following precise status:

> **Unity Day Lighting — FINAL VISUAL BASELINE APPROVED / PRODUCTION PROMOTION PENDING**

Do not call production Day lighting `FROZEN` until the exact validated candidate is promoted into the intended production scene/assets and verified one final time with no drift.

### Promotion Gate rules

Next Gate should be a narrow promotion-only step:

`Lighting L1R-PROMOTE — Production Integration`

Must preserve exactly:

- all L1R-C artistic values
- 256/256/256 final bake quality
- L1R-A corrected permanent-surface UV1
- L1R-B ordered desk material-slot mapping `[wood, metal, dark]`
- G1B workstation geometry/UV1
- camera/world orientation
- transforms
- materials
- 4x MSAA
- gameplay

Promotion must not include new artistic tuning.

After production integration, verify a production 1920x1080 screenshot against this approved FINAL candidate. If visually equivalent and Console blocking errors remain zero, then mark:

> **Unity Day Lighting — FINAL / FROZEN**

`FINAL / FROZEN` remains a baseline-management term, not a permanent prohibition on future changes. Future lighting variants or improvements may reopen a new explicit Lighting Gate while preserving this baseline as the rollback/reference point.
