# VQ2 Outside V3 — Epic Vista / Visual Hierarchy Proposal

Status: RESEARCHED DESIGN PROPOSAL / NOT YET USER-LOCKED
Date: 2026-09-05

## Current Review

Outside V2 architecture is healthy, but the authored 8K star field remains visually understated when viewed from the room. The issue is not star count. The current sky lacks a dominant macro-scale focal landmark and large-scale visual hierarchy, so it reads as realistic deep space rather than an epic vista.

## Core Direction

Do not increase star density aggressively. Keep the authored Far Sky as the base layer and add deliberate macro-scale celestial composition above it.

Baseline visual hierarchy:

1. Far Sky — existing 8K stars + faint Milky Way, mostly black, zero parallax.
2. Hero Celestial Landmark — one dominant planet / gas giant / moon / anomalous celestial body or similarly large landmark, independent from Far Sky.
3. Secondary Macro Structure — at most one subdued galaxy / galaxy-cluster / galactic dust or distant structure element.
4. Distant Structure Layer — optional story objects such as fleet, ruin or anomaly with stronger but still tiny parallax.
5. Near Retrieval Space — 35–100m real 3D objects only where gameplay/parallax matters.
6. Atlas Boundary — remains separate, normally invisible.

## Visual Rule

Epicness should come from scale contrast, focal hierarchy, occlusion and negative space — not from filling the sky with more stars.

A strong baseline should contain one dominant macro object rather than several equal competing celestial objects.

Candidate hero-landmark target:
- off-center, generally on a rule-of-thirds region from the main open-edge / Living / Retrieval viewpoints;
- approximately 12–22 degrees angular diameter for the first test;
- preferably a crescent / partially lit body so it remains dramatic without becoming a huge bright disc;
- may be partially occluded by the floor edge or architecture from selected viewpoints to reinforce scale;
- near-zero or extremely small parallax.

Secondary macro structure:
- one subdued galaxy / cluster / distant cloud structure;
- approximately 3–8 degrees angular size, or a low-contrast broad arc;
- should not compete with the hero landmark.

Maintain substantial black negative space (roughly the majority of the sky).

## Parallax Stratification

The current single Mid/Far translationScale=0.0002 is valid for astronomically distant objects but too uniform for all future distant content.

Recommended future strata:
- CelestialBackdrop: 0 to ~0.0002 translation response (planets/galaxies that should feel astronomically far)
- DistantStructures: roughly ~0.001–0.003 candidate range for ruins/fleets/large event objects where tiny readable parallax is useful
- Near Outside: real 35–100m world-space positions

Exact values remain open and require Human Visual Review.

## Far Sky

Keep current authored 8K Far Sky as a supporting layer. Do not attempt to create epic scale by raising star density or exposure substantially.

Current stars are useful as texture/detail. The missing visual component is macro-scale structure.

## Ripple

Boundary Ripple is separate from epic vista. Continue to keep it subtle and local; do not use boundary effects as permanent sky spectacle.

## Implementation Recommendation

Next visual pass should be "Outside V3 Epic Vista" and should not alter Interior V3 or gameplay systems.

Build only candidate content:
- one hero celestial landmark;
- one optional secondary macro structure;
- optional separate parallax root/component for distant structures;
- preserve Far Sky, Near3D and Atlas Boundary layers.

Do not lock final planet/galaxy identity in this pass. The pass exists to validate composition, scale, angular size, brightness and layering.

## Sources / Research Notes

Unity URP 3D Skybox examples support multiple camera layers / miniature sub-scenes for unreachable large-scale background objects. Environment-composition guidance supports using scale contrast and a strong focal point rather than equal visual weight everywhere. Astronomical imagery demonstrates that real star fields gain large-scale structure from star-density gradients, galactic planes, dust lanes and clusters rather than uniform point distribution alone.
