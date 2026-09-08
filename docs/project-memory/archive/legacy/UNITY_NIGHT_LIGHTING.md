# Four Workstations — Unity Night Lighting Memory

> Status: LIVING / TOPICAL PROJECT MEMORY  
> Established: 2026-08-25  
> Purpose: preserve Night-lighting decisions, failure causes, accepted candidate settings, and Day/Night isolation rules for future ChatGPT planning and handoff.

## 1. Day/Night architecture

The production Day scene/bake is a protected baseline. Night work must not mutate or rebake Day.

Night uses its own scene, Lighting Settings, and baked data. `DayNightController` only enables the four workstation lights for Night.

Do not reproduce historical Web/Three.js lightmap multiplier hacks in Unity.

## 2. Night N1 — first coherent candidate

N1 established the correct overall concept:

- room clearly darker than Day
- four warm workstation light pools
- cool ambient/night fill
- dynamic characters remain low-light readable
- Day scene remains isolated

N1 settings:

- Ambient Sky `(0.18, 0.22, 0.29)`
- Ambient Equator `(0.11, 0.13, 0.17)`
- Ambient Ground `(0.055, 0.065, 0.085)`
- Moon/Sun color `(0.48, 0.58, 0.76)`
- Moon intensity `0.16`
- four Unity Spot Lights:
  - color `(1.0, 0.78, 0.58)`
  - intensity `4.5`
  - range `3.2`
  - outer/inner angle `64° / 34°`
  - soft shadow strength `0.38`
- candidate bake `64 / 96 / 64`
- 1 lightmap
- 45 Light Probes

Human review: concept passed, but N1 itself did not receive final visual approval because walls/floor showed green/purple blotchy directional artifacts and some non-desk areas were too dead/dark.

## 3. Night N1R — artifact cleanup and readability refinement

`Night N1R — HUMAN VISUAL PASS`

Root cause of N1 blotches:

> In very dark conditions, Directional lightmap data combined with low-intensity realtime moon shadows created large green/purple directional color bands on walls and floor.

N1R technical corrections:

- Night bake switched to **Non-Directional lightmap**
- realtime moon shadows disabled in the Night candidate
- four workstation Spot Lights retain soft shadows
- lightmap compression disabled
- denoiser disabled
- bake quality raised to `256 / 256 / 256 samples`

N1R readability settings:

- Ambient Sky `(0.20, 0.23, 0.28)`
- Ambient Equator `(0.13, 0.145, 0.17)`
- Ambient Ground `(0.075, 0.08, 0.095)`
- Moon color `(0.58, 0.66, 0.80)`
- Moon intensity `0.20`
- four warm workstation Spot Lights unchanged from N1

Validation:

- obvious green/purple wall/floor blotches removed
- room shell and permanent surfaces more readable
- all four characters remain readable at night
- four warm workstation light pools remain clear
- overall scene remains substantially darker than Day
- 1 lightmap
- 45 Light Probes
- production Day `Office.unity` unchanged
- Console blocking errors `0`
- no Unity candidate commit/push

Candidate scene:

`Assets/FourWorkstations/Scenes/Candidates/Office_N1R_Night_Refined_Candidate.unity`

Human visual conclusion:

> N1R is a valid Night visual baseline candidate. The concept is now coherent, clean, readable, and sufficiently distinct from Day.

The Night baseline is **not yet production-frozen** until the approved N1R candidate is intentionally promoted into the runtime Night path and verified without drift.

## 4. Permanent Night rules

- protect the Day baseline from Night-specific changes
- preserve the warm-local / cool-ambient contrast
- do not overbrighten the whole room to solve character readability
- do not reintroduce Directional-lightmap + very weak realtime moon-shadow banding without evidence that the artifact is solved
- workstation lamps may remain the dominant Night focal lights
- future Night variants may reopen a dedicated Gate; `FINAL/FROZEN` means protected baseline, not permanent prohibition on change
