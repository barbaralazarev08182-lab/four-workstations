# VQ2 Gate 3 — User Asset Intake Human Visual Rejection / Spatial Correction

> Date: 2026-09-01
> Status: HUMAN VISUAL REJECT — spatial composition must be corrected before any material gate
> Scope: Rest Edge Seat group and Retrieval Station + Orb isolated candidate only

## 1. Rejection reason

The first isolated Unity intake candidate is rejected at Human Visual/Product level.

The primary issue is not material binding. The current new user-authored assets read far too small in the canonical full-room view and do not establish the intended edge identities.

The assets currently read as small props placed inside the room rather than spatially meaningful Rest / Retrieval Edge installations.

Do not treat the current screenshots as an acceptable scale/placement baseline.

## 2. Scale correction

Next candidate must start from a **minimum 3x increase in visible presentation scale relative to the current intake candidate** for the newly integrated Rest / Retrieval asset groups.

This correction must be implemented only through candidate wrapper / prefab transforms or an equivalent nondestructive integration layer.

Do not modify or rescale the protected original FBX source files.

The 3x value is the Human Visual correction starting point, not a final engineering size contract. The user will judge the new canonical frozen-camera result.

Orb scale should remain coherent with the Retrieval Station cradle/docking relationship; if the Station group is scaled, preserve its intended relative docking composition rather than independently shrinking the Orb back to the rejected tiny read.

## 3. Rest Edge placement correction

The four Rest Seat modules are currently too far inside the floor area.

Required next candidate:

- keep one shared reusable Seat prefab / mesh;
- retain four instances;
- move the whole Rest Seat row to the actual open floor boundary;
- seat modules must visually read as **attached to / sitting directly on the Rest Edge**, not as a row of chairs placed inland;
- the edge-facing side of each module must be flush with the usable floor boundary, with the model itself remaining physically supported by the floor;
- preserve the intended outward-facing orientation and outward table extension;
- do not invent rails, platform geometry, replacement furniture, or Codex-authored visible edge geometry;
- no seating gameplay or PEBBLE animation in this correction pass.

The Rest Edge should read as a real inhabited boundary in the canonical camera.

## 4. Retrieval Station placement/orientation correction

The Retrieval Station is currently oriented incorrectly and placed too far from the open boundary.

Required next candidate:

- rotate the entire Retrieval Station root **180 degrees around Y relative to the current rejected candidate orientation**;
- move the Station to the actual open floor boundary;
- the fixed base must remain supported by the floor and visually sit directly at the edge;
- the steerable Guide Arm / outward-working side must face the Outside after the 180-degree correction;
- the Station must read as a device that sends/retrieves beyond the edge, not as machinery aimed back into the room;
- keep Orb/Cradle relationship coherent after the transform;
- do not implement runtime tether, casting, aiming, attraction, or Retrieval gameplay yet.

## 5. Protected state / forbidden changes

This spatial correction pass must not modify:

- protected source FBX files or their SHA-256 values;
- authoritative Production Office scene;
- N1R;
- approved Atlas geometry, transform, Stage 0–4 state, materials, camera, or lighting;
- source model visual design;
- source mesh topology except in a separately approved reduction candidate;
- material textures as part of this spatial correction.

The current URP embedded-texture binding problem remains a separate blocker and should be handled only after the new scale/orientation/edge placement is visually acceptable enough to continue.

## 6. Required evidence for next review

Return only an isolated candidate with:

1. canonical full-room Day frozen-camera screenshot;
2. Rest Edge close crop showing all four seats and the actual floor boundary;
3. Retrieval Edge close crop showing Station + Orb, the 180-degree orientation, and the actual floor boundary;
4. exact wrapper/root scales used;
5. exact root transforms / relative yaw correction;
6. clearance report confirming the enlarged groups do not enter protected Atlas / workstation / circulation zones;
7. compile / PlayMode / Console state;
8. confirmation that all production and protected-source SHA values remain unchanged.

Do not promote or commit Unity production changes.
Do not announce Human Visual PASS.
Stop after Engineering/Machine Review and wait for user visual review.
