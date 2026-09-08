# VQ2 Atlas Boundary Ripple Final Refinement Authorization — 2026-09-05

Status: USER AUTHORIZED NEXT STEP / CANDIDATE ONLY / NOT YET HUMAN VISUAL PASS

## Context

The Far Sky / Milky Way candidate is now Human Visual PASS with the selected Balanced preset and Y rotation 45 degrees. The Atlas Boundary gameplay architecture is technically sound at 30m radius, but the local visual response still reads too much like clean concentric circles in static views.

## Authoritative next-step direction

Refine only the Atlas Boundary local visual response. Do not change the Far Sky, Interior V3, 30m radius, player radial constraint, Orb crossing, Retrieval transforms, lighting, camera/FOV/Eye Pivot, or production content.

The local response must stop reading as a portal, UI reticle, or mathematically perfect pair of rings. It should read as a brief disturbance propagating across an otherwise invisible spherical surface.

## Target visual language

- Normal state: boundary fully invisible.
- Contact state: only a small spherical cap around the contact point becomes perceptible.
- Shape: broken / incomplete arcs rather than closed circles.
- Structure: 1–3 narrow bands may exist, but they must have non-uniform visibility and should not form complete rings.
- Intensity: very low opacity, near-colorless, very weak warm ivory allowed.
- Temporal behavior: quick onset, expanding surface disturbance, irregular decay, fast fade.
- Optional: very subtle local distortion / refraction if it can be done without changing global URP/rendering contracts.
- Avoid: emissive shield, hex-grid force field, blue bubble, full-sphere reveal, perfect concentric circles, portal/donut read.

## Suggested implementation ingredients

Keep spherical angular-distance logic as the basis. Add one or more of:

- azimuthal breakup mask around the cap,
- low-frequency procedural/noise modulation,
- phase-offset multi-band visibility,
- non-uniform arc length per band,
- asymmetric intensity falloff around the contact normal,
- optional secondary short-lived shimmer or distortion localized to the cap.

The breakup should be stable enough not to look like noisy particles or television static.

## Review requirement

Provide first-person evidence from:

- direct view of local contact response,
- oblique view of the same response on the sphere,
- response near a floor/open-edge sightline,
- normal state immediately after fade,
- Scene View gizmo/debug only for sphere scale verification.

Human gate question: does it read as "an invisible spherical field was briefly disturbed" rather than "a circular UI/portal appeared"?

## Protection rules

No commit/push/promotion of Unity implementation unless explicitly authorized later. Candidate only.
