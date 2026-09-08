# VQ2 Open20m Oak Floor — Human Visual PASS — 2026-09-03

> Status: HUMAN VISUAL PASS / CANDIDATE BASELINE
>
> Authority: latest user-reported Human Visual result. This document supersedes the Oak Wood Planks “waiting for Human Visual Review” state in `VQ2_ACTIVE_PROJECT_HANDOFF_2026-09-03.md`.
>
> Source-of-truth warning: the implementation facts below describe the local Unity worktree as reported by the user/Codex. They do **not** imply that the Unity asset changes themselves have been committed or pushed to GitHub.

---

## 1. Result

The Oak Wood Planks material integration on:

`Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`

has passed user Human Visual review.

Formal result:

> **OPEN20M OAK FLOOR — HUMAN VISUAL PASS**

The wood-floor task is no longer the current review blocker.

---

## 2. Local implementation baseline

Reported texture set:

- Diffuse — 4096 × 4096
- AO — 4096 × 4096
- Normal GL — 4096 × 4096
- Roughness — 4096 × 4096

Candidate material:

`Assets/FourWorkstations/Art/Environment/Materials/Candidates/Open20mOakFloor/Open20m_OakWoodPlanks_URP.mat`

Material/runtime details:

- URP/Lit material.
- Tiling: `10 × 10`.
- Effective repeat scale: approximately one texture repeat per `2 × 2m` on the 20 × 20m floor.
- Metallic is fixed to `0`.
- Roughness is converted per pixel to `Smoothness = 1 - Roughness`.
- Smoothness is stored in the Alpha channel of the Metallic/Smoothness packed map.
- Normal GL is imported as Unity `Normal Map` while preserving the OpenGL Y direction used by the supplied source.
- AO is bound to the URP/Lit Occlusion Map.

Integrity:

- downloaded source files and Unity project copies were reported SHA-256 identical.

---

## 3. Build Grid compatibility

`PROTOTYPE_BuildGrid_Open20m` remains present.

- `B` toggles the Build Grid overlay.
- The accepted Build Grid mathematical baseline is unchanged.
- The wood-floor integration did not replace or invalidate the grid prototype.
- PlayMode can be used to inspect the oak floor and dashed build grid together.

Do not modify the accepted grid foundation merely because the floor material is now richer.

---

## 4. Validation reported

- Unity compile: PASS.
- Blocking errors: `0`.
- Unity reopened successfully after integration.
- Candidate scene remained usable for PlayMode visual inspection.

Human result is authoritative for the visual Gate.

---

## 5. Change boundary

This work remained candidate-only.

Reported unchanged / not performed:

- Production scene/assets were not modified by this floor-material round.
- No production promotion.
- No gameplay-system redesign.
- No Build Grid redesign.
- No commit or push of the Unity implementation was performed in the reported local round.

The GitHub commit containing **this Markdown memory record only** must not be confused with promotion or commit of the local Unity candidate implementation.

---

## 6. Handoff delta

The following older handoff state is superseded:

> “Oak Wood Planks 4K -> integrate -> Human Visual Review.”

Current state is now:

```text
Office_Open20m_Candidate geometry        PASS
Build Grid visual/feel                   PASS
Oak Wood Planks floor material           HUMAN VISUAL PASS
Production promotion                     NOT DONE
```

Known 20 × 20 items that were already unresolved before this floor PASS remain separate and must not be silently marked solved by the material change:

- verify whether the old baked-shadow artifact/legacy shadow state is fully cleared;
- verify whether player movement bounds actually cover the intended full 20 × 20m usable area;
- first-person Eye Pivot/head-shadow adjustment remains subject to its own acceptance state unless a newer user decision explicitly closes it.

Do not reopen the Oak floor Gate without new evidence or explicit user direction.
