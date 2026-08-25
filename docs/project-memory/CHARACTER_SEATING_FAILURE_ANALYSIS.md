# Four Workstations — Seating Failure Analysis and Corrective Rules

> Status: LIVING / CORRECTIVE MEMORY  
> Established: 2026-08-25  
> Purpose: preserve the failure analysis after A3/A3.5 so future conversations do not repeat the mistake of treating low constraint error as proof of a visually correct seated interaction.

## 1. Correction to prior interpretation

A3 proved that the technical contact pipeline can drive pelvis/feet targets accurately, but later Human Visual Review showed that this was not sufficient to establish a correct seated pose.

Therefore the previous interpretation must be narrowed:

> A3 = MECHANICAL CONSTRAINT PASS, NOT FULL HUMAN VISUAL SEATING PASS.

The following remain technically validated:

- reusable `SeatAnchor` data structure
- deterministic approach/seated root handling
- pelvis constraint execution
- bilateral Two Bone IK execution
- low target error
- no measured foot sliding in the isolated test
- no scale/root drift

The following were **not** actually validated by those metrics:

- buttocks/seat-surface contact
- thigh/seat contact
- pelvis orientation relative to the chair
- spine/torso posture
- hand/finger deformation quality
- whether the source seated animation is visually suitable for office use

Future reports must not conflate target tracking with believable physical contact.

## 2. Human Visual findings from A3/A3.5 screenshots

Human review of the A3/A3.5 screenshots found repeated visible failures:

- hands/fingers appear unnaturally spread or deformed in several seated clips
- arms remain excessively open, crossed, or performative rather than resting naturally for an office seated idle
- the character appears to float forward/up relative to the chair instead of visibly placing the buttocks on the seat surface
- the body can satisfy pelvis/foot targets while still reading as physically disconnected from the chair

These failures persist across multiple UAL seated clips tested on the same D2 SeatAnchor, so the problem must be decomposed instead of repeatedly trying another clip and trusting the same metrics.

## 3. Why the previous validation logic was insufficient

### 3.1 Pelvis target error is not butt-contact error

A pelvis/hips bone is an internal skeletal reference point, not the visible lowest point of the buttocks mesh.

In A3:

- physical seat surface height: `0.445 m`
- pelvis target Y: `0.700 m`

A near-zero pelvis error only proves that the pelvis bone reached `0.700 m`; it does not prove that the rendered body surface touched the seat at `0.445 m`.

The visible contact offset depends on the avatar's bind pose, body proportions, skin weights, seated hip rotation, and the source clip pose.

Permanent rule:

> Seat validation must measure or visually verify mesh/contact geometry, not only skeleton-target error.

### 3.2 `SeatAnchor` is currently under-specified for visual seating

The A3 contract contains approach, seated root, facing, seat height, pelvis target, feet targets, knee hints, and ground height.

That is sufficient to control a root/pelvis/feet skeleton solution, but it does not explicitly encode:

- seat plane / usable seat depth
- front edge / rear edge of seat
- chair-back plane
- desired pelvis rotation
- desired spine lean
- thigh clearance/contact
- avatar-specific hips-to-butt-surface offset

Therefore a character can mathematically hit all current anchors while visually floating, leaning incorrectly, or sitting too far forward.

Future `SeatAnchor` / `CharacterSeatProfile` design should distinguish:

`seat geometry contract` + `avatar body/contact profile` + `animation pose`.

### 3.3 Two Bone IK validates feet, not whole-body seating

Unity Two Bone IK drives a root/mid/tip chain toward a target/hint. A very low foot target error proves the foot end-effector is controlled, but says nothing about:

- pelvis-seat contact
- thigh penetration
- torso balance
- arm/hand quality

This is expected behavior; the validation mistake was interpreting endpoint accuracy as overall physical correctness.

### 3.4 `Avatar.isValid && Avatar.isHuman` is necessary, not sufficient for high-quality retargeting

A valid Humanoid Avatar proves Unity accepts the mapping. It does not prove that the retarget result has ideal visual quality.

Unity Humanoid retargeting uses a `HumanDescription` / muscle-space representation that includes arm/leg stretch and twist distribution parameters. These parameters, along with the generated avatar's reference pose and bone axes, affect how source poses appear on the target body.

For the Four Workstations adapter, future validation must inspect more than `isValid/isHuman`:

- reference/T-pose quality
- local bone axes after hierarchy repair
- arm/leg twist distribution
- stretch values
- hand/finger mapping and finger rest pose
- pelvis/hip orientation in the generated Humanoid avatar

If hand/finger deformation persists across unrelated source clips, treat it as a retarget/avatar calibration problem rather than repeatedly rejecting animation clips.

### 3.5 Source clip suitability and retarget quality are separate questions

A seated clip can be a poor office idle even when retargeting is technically correct.

UAL findings so far:

- `Sitting_Enter`: transition only; unsuitable as a looping seated base
- `Sitting_Idle_Loop`: stable body but arms remain too open
- `Sitting_Talking_Loop`: more alive but arms occupy the workspace and conflict with future typing/drinking overlays
- `Sitting_Exit`: exit transition, not a base idle

However, the visible hand/finger problems must not automatically be blamed on UAL until the Humanoid avatar/reference-pose calibration is independently checked.

## 4. Revised validation hierarchy

Future seated-interaction validation must use four separate layers.

### Layer A — Retarget integrity

Validate with neutral diagnostic poses/actions, not only seated clips:

- T-pose / reference pose
- relaxed idle with hands visible
- simple arm raise
- simple leg bend

Check:

- fingers/hands
- wrists/forearms
- elbows/shoulders
- pelvis/hips
- knees/feet
- mesh skinning

If neutral diagnostics are already deformed, stop: the Avatar/adapter is the root problem.

### Layer B — Seat geometry/contact

Measure/author:

- seat plane height
- seat depth and usable center
- backrest plane
- desired pelvis position and rotation
- avatar butt-surface offset relative to Hips
- thigh clearance/contact envelope
- feet/ground targets

Acceptance must include visible butt-to-seat contact and no major thigh/chair penetration.

### Layer C — Source animation suitability

Only after A/B pass should candidate clips be judged for:

- relaxed shoulders
- neutral arms
- hands clear of keyboard/desk workspace
- stable torso
- loop quality
- compatibility with future upper-body overlays

### Layer D — Gameplay interaction overlay

Typing, drinking, desk-item use, etc. should add:

- hand IK / hand targets
- prop sockets
- upper-body layer/Avatar Mask as appropriate
- action timing

Do not use Layer D to compensate for broken Layer A or B.

## 5. Immediate revised next step

Do **not** proceed to A4 cross-avatar calibration yet.

Do **not** keep cycling seated clips as the only variable.

First run a focused diagnostic Gate:

> **A3R — Humanoid Pose + Seat Contact Root-Cause Audit**

A3R should use Ming only and the same D2 chair.

Required tests:

1. Neutral Humanoid diagnostic pose with hands/fingers fully visible.
2. Compare target avatar reference pose/bone axes against source expectations.
3. Inspect `HumanDescription` arm/leg stretch and twist parameters generated by `CharacterHumanoidAdapter`.
4. Determine whether hand/finger distortion occurs in neutral/simple non-seated clips.
5. Measure the rendered body's Hips-to-butt-bottom offset in a neutral seated pose.
6. Extend the seat contract temporarily with seat plane/depth/backrest visualization gizmos and verify visible butt contact.
7. Separate three verdicts:
   - Avatar/retarget quality
   - Seat geometry/contact quality
   - source clip suitability

Only after the first two are PASS should external seated animation selection resume (Mixamo or another licensed source).

## 6. Corrective project lesson

The repeated mistake was not primarily “choosing the wrong sitting animation.”

It was an evaluation-design mistake:

> Numerical constraint success was treated as visual/physical success.

For character interaction, project QA must always distinguish:

`bone target accuracy != mesh contact accuracy != animation suitability`.

Human Visual Review must remain authoritative for visible interaction quality, especially when skeletal reference points do not coincide with rendered surface contact points.
