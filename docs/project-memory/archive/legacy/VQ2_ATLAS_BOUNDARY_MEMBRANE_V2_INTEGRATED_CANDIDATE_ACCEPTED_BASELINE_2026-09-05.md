# VQ2 Atlas Boundary Membrane V2 — Integrated Candidate Accepted Baseline

Date: 2026-09-05
Status: USER ACCEPTED-FOR-NOW CANDIDATE BASELINE / NOT PRODUCTION PROMOTION

## Decision

The user explicitly accepted the current Atlas Boundary Membrane V2 integration as good enough for now and authorized moving to the next stage.

## Current authoritative candidate baseline

- Atlas center authority: `AtlasAnchor`
- Atlas Boundary radius: `21m`
- Player radial constraint: PASS
- Orb crossing: PASS; Orb remains allowed to cross the boundary
- Active boundary visual: Membrane V2 calibrated B candidate
- Membrane cap: `6°`
- Duration: `0.65s`
- Peak distortion: `1.5 screen px`
- Distortion form: travelling signed compression/expansion wavefront
- No visible ring / outline / Fresnel border / emission / tint
- Backdrop capture at Human-PASS calibration: 1920×1080 ARGBHalf, Bilinear, no mipmaps/downsample/blur
- Player contact triggers once and does not replay every frame during sustained contact
- Orb exit / enter each trigger once and do not block Orb motion
- After fade, boundary renderer and backdrop capture camera return to inactive state
- Legacy concentric Ripple, Membrane V1, and unselected A/C variants remain non-destructively disabled and recoverable

## Validation reported

- Compile: PASS
- Shader errors: 0
- Blocking errors: 0
- PlayMode: PASS
- Atlas radius remains 21m
- Far Sky / Interior / Retrieval transforms / Lighting / Camera / Production were not modified by this integration gate
- No commit / push / production promotion of local Unity implementation was performed

## Meaning of this record

This closes the Atlas Boundary visual/integration work as the current candidate baseline for now. It does not authorize production promotion. Further boundary changes should only be made if later gameplay or visual review reveals a concrete problem.

## Next stage

Proceed to Atlas-centered SunVisual + SunDirectionalLight + Daylight System V1.
