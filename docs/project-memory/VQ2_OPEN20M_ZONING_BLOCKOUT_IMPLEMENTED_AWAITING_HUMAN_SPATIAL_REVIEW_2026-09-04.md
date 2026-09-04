# VQ2 Open20m Zoning Blockout — Implemented / Awaiting Human Spatial Review — 2026-09-04

> Status: IMPLEMENTED IN LOCAL UNITY CANDIDATE / AWAITING HUMAN SPATIAL-FEEL REVIEW
>
> Authority boundary: this records user/Codex-reported local candidate implementation. It does **not** declare Human PASS and does not imply Unity changes are committed/pushed.

## Scope

Candidate scene:

`Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`

This round created entrance, functional-zoning, and primary-circulation blockout only.

Lighting and production were not modified.

## Door blockout

West wall provisional door marker:

- Center: `(-9.965, 1.4, -3.5)`
- Face size: `1.4m × 2.8m`
- Visual/blockout marker only
- Wall geometry has not yet been cut/opened

The door position remains provisional until Human Spatial review.

## Functional zones

Reported centers / approximate extents:

- Arrival: center `(-7.5, -3.5)`, size `3 × 4m`
- Atlas Core: center `(0, 0)`, size `7 × 7m`
- Retrieval: center `(7.25, 1.5)`, size `4.5 × 6m`
- Workshop: center `(5.7, -5.6)`, size `4.2 × 2.8m`
- Matter Bench proxy: `2.6 × 0.9m`
- Domestic: center `(-5.4, 4.8)`, size `6.2 × 5.2m`
- Observe: center `(-4.8, -8.25)`, size `5.6 × 2.5m`
- Plant / Cat / Flexible Living: center `(2.7, 6.6)`, size `5.2 × 3.8m`

These are blockout zones, not final furniture bounds.

## Primary circulation

Six planned routes are present:

- Door -> Atlas
- Door -> Domestic
- Atlas -> Retrieval
- Retrieval -> Matter Bench
- Matter Bench -> Buildable Area
- Domestic -> Observe / Open Edge

Reported main circulation clear width is at least `1.5m`.

Atlas retains a central `7 × 7m` negative-space zone.

## Legacy candidate content disabled non-destructively

Reported disabled in the candidate only:

- `Runtime_Desks`
- `Runtime_Rugs`
- `Runtime_Devices`
- `Runtime_Lamps`
- old four-workstation waypoint roots
- `RestSeatPresentationGroup`
- Dining / Meeting / Coffee / Sofa / Restroom groups

Source prefabs, FBX files, and production assets were not deleted.

## Validation reported

- Compile: PASS
- Console blocking errors: 0
- Lighting: unchanged
- Production: unchanged
- staged files: 0
- no commit / push / promotion

## Spatial reading before Human review

The current arrangement has a coherent macro-logic:

- entrance on the west side, offset south of the room center;
- Domestic tucked toward the walled northwest area for enclosure;
- Atlas remains central rather than pushed against a wall;
- Retrieval occupies the east side closer to the open Outside direction;
- Workshop / Matter processing sits southeast, creating a short logistics relationship with Retrieval;
- Observe sits near the south open edge;
- Plant / Cat / flexible living sits north-east of the Atlas, leaving a separate mutable domestic zone.

This does not substitute for first-person Human Spatial review.

## Specific review notes

1. Door is not yet a real opening, so entrance framing cannot be fully judged until either the visual marker is reviewed from the intended spawn direction or a later doorway cut is authorized.
2. Atlas Core (`7 × 7m`) and Domestic (`6.2 × 5.2m`) blockout rectangles slightly overlap at their nearest corners if treated as hard rectangles. This may be harmless because zones are conceptual, but Human review should confirm that Domestic furniture will not erode Atlas negative space.
3. The direct Door -> Atlas sightline should be judged in first person: Atlas should become a natural focal point after entry without feeling like the player spawns directly into a shrine/obstacle.
4. Retrieval -> Workshop logistics should feel short and practical without turning the east/southeast side into an industrial strip.
5. Observe should retain a clean, quiet view to the open Outside and not become merely leftover edge space.

## Gate state

Current status:

```text
Entrance / Zoning / Circulation Blockout    IMPLEMENTED
Technical validation                        PASS
Human Spatial / Feel review                 PENDING
Door final geometry                         NOT DONE
Final furniture layout                      NOT DONE
Lighting / sun pass                         NOT STARTED FOR THIS LAYOUT
Production promotion                        NOT DONE
```

Do not treat this layout as final until the user explicitly gives Human Spatial / Feel PASS.
