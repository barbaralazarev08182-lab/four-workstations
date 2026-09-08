# VQ2 Systems — Current Baselines

> Status: **ACTIVE**  
> Updated: 2026-09-08

## 1. Engine / candidate context

- Unity `6000.3.21f1`
- URP `17.3.0`
- current primary local candidate: `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- production scenes must not be overwritten/promoted without explicit Human authorization.
- remote GitHub may lag the local worktree; verify local serialized state when a decision depends on current implementation.

## 2. Time system

Human lock:

> **60 real minutes = 1 in-game day.**

Do not casually change the day-cycle duration while working on lighting, Outside visuals, or other unrelated systems.

The visible universe does not need to rotate with this day cycle.

## 3. Atlas / Boundary

Atlas is the stabilizing anchor of the Refuge's 3D domain.

Current protected visual/system state:

- Atlas remains central and important;
- Atlas Boundary V2 retains prior Human Visual PASS unless explicitly reopened;
- Boundary effects should remain normally unobtrusive and reveal the stabilized domain through controlled interaction/phenomena rather than behaving like a constant ordinary force-field bubble.

The Atlas sphere/domain is larger than the room architecture. Do not infer that room walls are the true system boundary.

## 4. SunVisual

SunVisual retains prior Human Visual PASS unless explicitly reopened.

Important separation:

- SunVisual appearance and lighting contribution are conceptually decouplable;
- a future Sun-orbit lighting change must be revalidated against SunVisual rather than silently assuming the old geometry is immutable.

## 5. Retrieval

Retrieval Station + Orb remains a core protected gameplay system.

Current conceptual rules:

- Retrieval opens a controlled interface through the Atlas boundary;
- the tether/cable maintains connection/power;
- interaction with Outside has real Refuge cost/consequence;
- retrieved content must be Outside-native, never ordinary human relics naturally found outside;
- the southeast technical-area relocation remains a broader design direction, but exact transforms are not locked by the failed Architectural Zoning V1.

Do not break Retrieval hierarchy/scripts/functionality while doing visual dressing.

## 6. Furniture placement / persistence

The runtime furniture placement + persistence baseline remains valid/protected unless explicitly reopened.

Relevant principles:

- placement uses clear grid/occupancy rules;
- persistence across save/reload is part of the accepted baseline;
- new art/layout experiments should not casually rewrite placement/persistence code;
- furniture catalog historical counts are not proof of the exact current local catalog contents.

## 7. Player / camera

The game is first-person. Player movement/camera systems are protected during unrelated art passes.

Do not alter player transforms, locomotion, camera feel, or input merely to make a screenshot composition work.

## 8. Drone

The drone is a persistent interactive utility/narrative companion.

Long-term direction includes voice control / intent recognition and practical commands such as observation, following/positioning, lighting/scanning/recording assistance.

When an Outside civilization takes direct control, communicate the change through behavior, movement, timing, gaze/orientation, voice cadence and text/dialogue—not only exposition.

This is a design/system direction, not a requirement to implement the full voice stack during unrelated visual tasks.

## 9. Asset acquisition / authoring boundary

External assets should be treated through a controlled source -> standardized/adapted -> Unity candidate pipeline rather than blindly dropped into production.

BlenderKit asset acquisition is valid through the local Blender + BlenderKit workflow. A past `403` on free assets was traced to an invalid non-UUID `scene_uuid`, not to the assets being paid/unavailable. Correct UUID usage returned HTTP 200 and the requested black-hole, nebula and space HDR assets were downloaded successfully.

Do not create a low-quality procedural substitute merely because an acquisition attempt fails. Diagnose the acquisition path or stop and report the blocker when the Human supplied a specific visual asset.

## 10. Validation / authority

Technical checks expected after implementation work include, as relevant:

- compile PASS;
- shader errors = 0;
- PlayMode smoke PASS;
- blocking runtime errors = 0;
- protected systems/transforms unchanged when outside task scope.

These are technical Gates only.

> **Machine PASS != Human Visual / Feel PASS.**

Human subjective review controls visual, spatial and feel acceptance.

## 11. Commit / promotion discipline

Unless explicitly authorized:

- do not commit/push Unity candidate assets/scenes as if accepted;
- documentation-only checkpoints may be appropriate for important Human decisions;
- do not promote candidate -> production;
- do not declare Human PASS yourself.
