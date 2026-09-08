# VQ2 Character Animation — Quaternius Retargeting

> Date: 2026-09-02
> Status: CURRENT WORKFLOW DIRECTION

The user has a self-generated humanoid character FBX with an existing skeleton/skin and has downloaded the free Quaternius Universal Animation Library.

## Workflow decision

Use Unity Humanoid retargeting so the Quaternius animation clips can drive the user's character skeleton.

Codex may:
- import/copy the user's character FBX and the extracted Quaternius animation library into the Unity project;
- configure the user's character as Humanoid and validate its Avatar mapping;
- configure compatible Quaternius animation FBX assets as Humanoid;
- build a minimal test Animator Controller using a small set such as Idle + Walk;
- use in-place / no-root-motion clips for the first validation unless a concrete test needs root motion;
- report any invalid or missing humanoid bone mapping instead of modifying the production skeleton blindly.

Do not alter the source character mesh, bone names, skin weights, or proportions merely to make retargeting work without explicit authorization.

## Authoring split

Quaternius library: generic/base locomotion and utility animation source.

User/Cascadeur: custom, distinctive, project-specific character animation authoring when needed.

Codex/Unity: import, Humanoid Avatar setup, retargeting, Animator integration, validation.

## First acceptance test

Prove that at least Idle and Walk retarget correctly on the user's character with no obvious bone collapse, severe limb twist, foot inversion, or scale break. If those pass, the library can be expanded incrementally.