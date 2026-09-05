# VQ2 Atlas Sun + Daylight V1 — Candidate Implementation Authorization

Date: 2026-09-05
Status: USER AUTHORIZED NEXT STAGE / CANDIDATE ONLY / NOT FINAL VISUAL LOCK

## Goal

Build the first functional Atlas-centered sun/daylight system for the Open20m candidate after the Atlas Boundary baseline was accepted-for-now.

The system must separate the visible sun from the actual daylight/shadow light source.

## Core architecture

Create a candidate hierarchy with clear separation:

- `SunOrbitRig`
- `SunVisual`
- `SunDirectionalLight`
- `SunDaylightController`
- optional review/debug helpers

`AtlasAnchor` is the orbit origin authority.

### SunVisual

The visible sun is a small stylized physical-looking body, not the source of room illumination.

Direction:
- warm-white / ivory core
- restrained corona
- readable as a sun
- must not hurt the eyes or turn into a giant bloom disk
- no RGB / magic-orb appearance

Candidate visual diameter may start around `0.4m`, Inspector adjustable roughly `0.25–0.6m` for Human Review. This is not final-lock sizing.

### SunDirectionalLight

The actual room daylight and shadows come from a separate Directional Light.

Its direction must remain visually consistent with the current SunVisual direction relative to Atlas/the room. Verify the Unity light-forward convention with an actual shadow test rather than assuming it.

Strong, attractive room lighting should come from directionality, shadow composition and existing material response — not from making SunVisual painfully bright.

## Orbit

Atlas remains the orbit center.

Current Atlas Boundary radius is `21m`.

Candidate orbit radius may start around `17.5m`, Inspector configurable. The visible sun should remain safely within the Atlas refuge volume during the candidate test unless a later explicit design decision changes this.

The exact final orbit plane/axis is still OPEN and must not be declared locked.

For V1, use a neutral configurable test orbit only. Expose at least:
- orbit radius
- orbit-plane yaw
- orbit-plane tilt / normal control
- normalized time-of-day / phase
- optional cycle duration
- pause/manual scrub

A vertical great-circle style test orbit is acceptable for proving the system, including below-floor travel for the night half of the cycle, but this is not the final orbital design.

## Daylight behavior

Provide a sun-elevation driven daylight intensity curve.

Suggested candidate behavior:
- below horizon: directional daylight trends to 0
- low sun: warm/long-shadow morning or late-afternoon state
- high sun: stronger but visually flatter noon state

Do not introduce aggressive auto exposure. Keep exposure fixed or tightly constrained.

Do not modify global ambient/reflection merely to make the sun look stronger during this gate. Preserve the current Far Sky / Milky Way visual PASS baseline.

## Existing lighting safety

Do not accidentally run two competing main directional lights.

Preserve the previous candidate lighting as a reversible baseline. When Sun/Daylight V1 is enabled, only one main daylight Directional Light should drive the room. The old setup should remain recoverable/non-destructive for A/B review.

Do not alter wall/floor materials to compensate for lighting during this first gate.

## Review targets

Prepare Human Review from at least:
- morning / low-angle daylight
- noon / high-angle daylight
- late-afternoon / low-angle daylight
- view with SunVisual visible against Far Sky
- interior view with SunVisual outside frame but its shadows visible
- living area
- experiment area
- retrieval area
- top/scene view showing SunVisual orbit and Atlas relationship

Review questions:
1. Does SunVisual read as a small sun without eye strain?
2. Do room shadows clearly agree with where the visible sun is?
3. Does low-angle light create attractive long architectural shadows?
4. Does noon remain believable even though it is naturally flatter?
5. Does the room still read as a home rather than a lighting demo?
6. Is the Far Sky / Milky Way preserved?

## Deferred from V1

Do NOT include in this first implementation gate:
- final orbit-plane lock
- final day-cycle duration
- artificial night/interior lamp pass
- final exposure redesign
- sun-triggered Atlas Boundary response
- solar flares / lens flare spectacle
- production promotion

Future optional behavior: as SunVisual approaches/intersects the Atlas Boundary, it may trigger a localized boundary response, but that is explicitly deferred until both the sun and boundary are stable independently.

## Verification

Report:
- hierarchy / component paths
- orbit authority and candidate radius
- orbit controls
- SunVisual size/material/shader
- SunDirectionalLight settings and synchronization method
- previous daylight baseline reversible state
- morning/noon/late-afternoon review states
- whether RenderSettings/ambient/reflection/exposure changed
- Compile PASS
- shader errors = 0
- blocking errors = 0
- no production modification
- no commit/push/promotion of local Unity implementation

Keep Unity open after completion and wait for Human Sun/Daylight Visual Review.
