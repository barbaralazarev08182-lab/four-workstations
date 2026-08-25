# Four Workstations — Seating Failure Analysis and Corrective Rules

> Status: LIVING / A3R-F1 HUMAN VISUAL FAIL / HUMANOID SEATING WORK PAUSED  
> Established: 2026-08-25  
> Purpose: preserve the failure analysis after A3/A3.5/A3R/A3R-F1 so future conversations do not repeat the mistake of treating low constraint error as proof of a visually correct seated interaction, and do not automatically resume this workstream.

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

- nominal `seatHeight` was treated as `0.445 m`
- pelvis target Y was `0.700 m`

A near-zero pelvis error only proves that the pelvis bone reached its requested target; it does not prove that the rendered body surface touched the actual seat cushion.

The visible contact offset depends on the avatar's bind pose, body proportions, skin weights, seated hip rotation, and the source clip pose.

Permanent rule:

> Seat validation must measure or visually verify mesh/contact geometry, not only skeleton-target error.

### 3.2 `SeatAnchor` is currently under-specified for visual seating

The A3 contract contains approach, seated root, facing, seat height, pelvis target, feet targets, knee hints, and ground height.

That is sufficient to control a root/pelvis/feet skeleton solution, but it does not explicitly encode:

- actual seat top plane
- usable seat depth
- front/rear seat edges
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

Unity Humanoid retargeting depends on the reference pose, HumanDescription mapping, bone axes, finger mapping, and stretch/twist settings.

Future validation must inspect more than `isValid/isHuman`:

- reference/T-pose quality
- local bone axes after hierarchy repair
- arm/leg twist distribution
- stretch values
- hand/finger mapping and finger rest pose
- pelvis/hip orientation in the generated Humanoid avatar

### 3.5 Source clip suitability and retarget quality are separate questions

A seated clip can be a poor office idle even when retargeting is technically correct.

UAL findings so far:

- `Sitting_Enter`: transition only; unsuitable as a looping seated base
- `Sitting_Idle_Loop`: stable body but arms remain too open
- `Sitting_Talking_Loop`: more alive but arms occupy the workspace and conflict with future typing/drinking overlays
- `Sitting_Exit`: exit transition, not a base idle

The visible hand/finger failures must not automatically be blamed on UAL; A3R established that the current adapter did not map Humanoid fingers at all.

## 4. Revised validation hierarchy

Future seated-interaction validation, if this workstream is ever deliberately resumed, must use four separate layers.

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

- seat top plane height
- seat depth and usable center
- front/rear seat edges
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

---

# 5. A3R — Humanoid Pose + Seat Contact Root-Cause Audit

Status:

> **A3R — ROOT CAUSE VERIFIED / TWO INDEPENDENT FAILURES IDENTIFIED**

A3R used Ming and the same D2 chair without modifying production Office, lighting, A3 SeatAnchor assets, or production character assets.

## 5.1 Avatar / retarget quality verdict

Verdict:

> **Body Humanoid retargeting is basically valid, but the hand Avatar mapping is incomplete.**

Findings:

- Avatar valid/human: PASS
- current adapter maps only `20` body Humanoid bones
- Ming physically contains a complete finger skeleton
- all `30` Humanoid finger slots were initially unmapped
- Neutral Idle and all tested Sitting clips preserved the same original finger rest rotations before F1
- therefore the visible finger/hand problem was not a temporary seated-animation artifact; the adapter never gave Unity a Humanoid finger mapping to retarget
- major limb axes are broadly consistent; child-bone direction is mainly local `+Y`
- no obvious left/right arm axis inversion was found
- `upper/lower arm twist = 0.5`
- `upper/lower leg twist = 0.5`
- `arm/leg stretch = 0.05`
- those twist/stretch values are conventional and are not the main root cause

Permanent conclusion from A3R:

> The shared body adapter remains mechanically viable, but the Avatar is not production-quality for hands unless finger mapping and reference pose are both correct.

## 5.2 Seat geometry / visible contact verdict

Verdict:

> **Pelvis-target accuracy PASS; visible butt-to-seat contact FAIL.**

Measured D2 geometry/contact:

- current `SeatAnchor.seatHeight`: `0.445 m`
- actual cushion bottom: approximately `0.455 m`
- actual cushion top / usable seat surface: approximately `0.517 m`
- pelvis target Y: `0.700 m`
- `Sitting_Idle_Loop` lowest visible butt vertex: `0.652627 m`
- `Sitting_Talking_Loop` lowest visible butt vertex: `0.653160 m`
- vertical visible butt-to-seat-top gap: approximately `135.6–136.2 mm`

This establishes the main geometric bug:

> A3's `seatHeight` was derived from `chair.position.y` / chair-root height rather than the actual seat-surface top plane.

A fixed `+0.255 m` pelvis offset was then built on top of that incorrect reference.

Therefore a near-zero pelvis constraint error only proves that Hips hit a **wrongly defined target**.

Seat depth measurements:

- usable cushion extent along facing X: approximately `1.786–2.374 m`
- current visible butt rear edge X: approximately `1.878 m`

The butt remains within the seat-depth range, but there is also about `99 mm` gap to the main backrest front plane.

Thus:

- primary failure: vertical contact
- secondary weakness: insufficient backrest contact / too-forward body placement

## 5.3 Source animation suitability verdict

Verdict:

> **Current UAL seated clips are poor neutral-office candidates, but they are not the root cause of hand deformation or floating.**

`Sitting_Idle_Loop`:

- torso broadly usable
- arms/hands remain too externally spread for neutral office idle

`Sitting_Talking_Loop`:

- clearly communicates talking
- arms occupy the torso/workspace and conflict with future typing/drinking overlay

Important evidence:

- lowest visible butt position differs by only about `0.53 mm` between the two seated clips
- both float by about `136 mm`
- therefore the large floating error is seat-contract geometry, not a single bad source clip
- before F1, both seated clips and Neutral Idle preserved identical finger rest rotations
- therefore the recurring hand issue was Avatar finger mapping/reference quality, not UAL-specific seated animation deformation

## 5.4 A3R changes to earlier conclusions

A3R narrows previous claims:

- A1/A2 body retarget strategy is mechanically viable
- A3 constraint/IK mechanics are mechanically viable
- A3 visible seating does **not** pass
- A3.5 correctly rejected the available UAL seated clips as office-idle bases
- A4 cross-avatar calibration is blocked and should not be resumed automatically

---

# 6. A3R-F1 — Finger Mapping Experiment

Status:

> **A3R-F1 — MACHINE MAPPING PASS / HUMAN VISUAL FAIL**

F1 expanded the Humanoid mapping from `20 -> 50` bones by filling all `30/30` Unity Humanoid finger slots.

Mapping details:

- both thumbs: source `1/2/3 -> Proximal/Intermediate/Distal`
- both Index, Middle, Ring: source `1/2/3`
- both Pinky chains mapped to Unity Little `1/2/3`
- missing Unity Humanoid finger slots: `0`
- source `Index4/Middle4/Ring4/Pinky4` remain as terminal child bones because Unity Humanoid has no corresponding fourth finger slot

Technical result:

- finger curves are no longer frozen
- in `Interact`, the left index finger follows source motion (`17.88° / 13.35° / 10.53°` across Proximal/Intermediate/Distal)
- original `20` body mappings remain intact
- body regression max position difference: `3.33e-8 m`
- `applyRootMotion=false`
- Avatar remains valid/human
- Console blocking errors: `0`

However Human Visual Review is a clear FAIL.

The mapped fingers visibly collapse/fold because the Avatar was built from a non-standard idle-like reference skeleton rather than a correct Humanoid reference/T-pose.

Reference diagnostics:

- left/right arm vertical component: `0.964 / 0.980`
- left/right elbow reference bend: `25.50° / 45.14°`
- therefore the reference pose is far from a valid symmetric T-pose

Permanent conclusion:

> Completing Humanoid finger slots on top of a bad reference pose converts frozen hands into actively deformed hands. Mapping completeness alone is not a quality fix.

The visible F1 result is unacceptable and must not be promoted to production.

---

# 7. Workstream stop decision — 2026-08-25

User decision after reviewing A3R-F1:

> **Stop further changes. The current visual result is too poor, and there is no reason to continue this line of work now.**

This decision supersedes the previously recommended automatic sequence of:

- A3R-F2 seat-surface correction
- more seated-animation library testing
- Mixamo seated-idle testing
- A4 cross-avatar calibration
- production Humanoid/finger promotion

Do **not** resume those tasks by default in a future conversation.

Current production safety state:

- production Office was not modified by these seating experiments
- Day/Night lighting was not modified
- production character Prefabs were not replaced by the experimental Humanoid versions
- A3/A3R/F1 work remained candidate/audit work
- no Unity code/assets from this sequence were committed/pushed according to the Gate reports

Therefore the correct project action is to **stop**, preserve the findings as research, and move to another project priority rather than investing more time in the current Humanoid seating approach.

If character animation is revisited later, treat it as a fresh architectural decision. Possible future choices may include a properly authored T-pose/Avatar pipeline, a different character source/rig, or a simpler animation scope, but none of these are currently authorized next steps.

## Current approved character-animation scope

Until explicitly revisited:

- keep the current production character system unchanged
- do not promote the experimental Humanoid/finger setup
- do not continue seat-contact calibration
- do not continue seated clip hunting
- do not build typing/drinking/hand-IK on top of this experimental branch
- previously stable production Idle/Walk behavior remains the practical baseline

---

# 8. Corrective project lesson

The repeated mistake was not primarily “choosing the wrong sitting animation.”

It was an evaluation-design mistake:

> Numerical constraint success was treated as visual/physical success.

A3R/A3R-F1 establish the exact failure layers:

- original frozen-finger failure = incomplete Humanoid finger mapping
- F1 folded-finger failure = finger mapping applied to a bad/non-standard reference pose
- floating failure = incorrect seat-height reference + under-specified seat/contact geometry
- awkward arm poses = source animation suitability problem, separate from the above bugs

For character interaction, project QA must always distinguish:

`Avatar/retarget integrity != bone target accuracy != mesh contact accuracy != animation suitability`.

Human Visual Review remains authoritative for visible interaction quality, especially when skeletal reference points do not coincide with rendered surface contact points.
