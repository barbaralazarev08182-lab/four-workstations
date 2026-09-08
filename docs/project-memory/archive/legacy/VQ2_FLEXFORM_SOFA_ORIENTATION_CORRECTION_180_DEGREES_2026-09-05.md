# VQ2 Flexform Sofa Orientation Correction — 180 Degrees

Date: 2026-09-05
Status: USER-DIRECTED CORRECTION

## Decision

The imported Flexform Sofa is the correct size and overall candidate, but its facing direction is reversed.

Rotate the sofa exactly 180 degrees around Unity world Y from its current upright orientation so the seating side faces the West wall / TV.

Do not change:
- position unless required only to preserve floor contact after rotation
- uniform scale (keep 1,1,1)
- asset dimensions
- Z-up to Unity Y-up correction
- grid occupancy
- other furniture or layout

## Validation

Before Human Review, confirm visually that:
- seat cushions face the TV
- sofa back faces away from the TV
- sofa remains upright and on the floor
- no collision or clearance regression is introduced

This is a basic orientation correction only; do not rework the asset or layout.