# VQ2 Bloke Sofa Human Visual FAIL — Orientation + Size Gate

Date: 2026-09-05
Status: HUMAN VISUAL FAIL / CORRECTION REQUIRED

## Evidence

Human review screenshots show the imported Bloke Sofa placed incorrectly: the sofa is visibly lying on its side / wrong local-up orientation instead of standing naturally on its feet with the seat horizontal and back vertical.

Reported imported dimensions are approximately 1.565 x 0.775 x 0.848 m. This also violates the previously locked main-sofa requirement: the Living main sofa must be a long 3–4 seat sofa, minimum about 2.4 m wide, preferably about 2.6–3.2 m. A 1.565 m-wide result must not pass as the main sofa.

## Required correction logic

Do not simply apply another arbitrary yaw rotation.

1. Inspect the source asset local axes and mesh orientation.
2. Correct the asset so that in Unity:
   - seat surface is horizontal,
   - backrest is vertical,
   - legs/base contact the floor,
   - world up is Unity +Y,
   - sofa faces West / TV only after the upright orientation is correct.
3. Re-measure world-space bounds after orientation correction.
4. Verify source units/import scaling.
5. If authoritative source geometry/metadata shows the sofa should be >= 2.4 m wide and the Unity result is short because of unit/import-scale error, correct with uniform scaling/import-unit correction only.
6. If the actual source asset is genuinely < 2.4 m wide, reject Bloke Sofa for the Living main-sofa slot. Do not stretch it non-uniformly and do not accept it as the main sofa.
7. Restore/retain the graybox proxy until a valid long sofa candidate passes.

## Gate

A furniture placement is not ready for Human Review unless basic physical orientation and role-size requirements pass automatically first.

For sofas specifically, machine-side precheck must verify:
- upright orientation,
- floor contact,
- seat plane approximately horizontal,
- back approximately vertical,
- no obvious side-lying/upside-down state,
- real dimensions satisfy the functional slot requirement.

No commit/push/production promotion for this failed candidate.
