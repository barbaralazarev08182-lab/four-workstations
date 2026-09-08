# VQ2 Furniture Grid Occupancy and Placement Rule — 2026-09-05

Status: USER-DIRECTED PLACEMENT RULE

## Existing grid authority

- Visible build grid: 1.0 m cells.
- Placement snap: 0.5 m.
- Therefore furniture planning uses 0.5 m as the occupancy accounting unit (half-cell), while screenshots/reviews may also report the equivalent 1 m grid footprint.

## Core rule

Every furniture item must be evaluated before final placement in three envelopes:

1. **Hard Footprint** — the actual XZ footprint of the furniture mesh/collider, rounded up to the nearest 0.5 m occupancy unit for planning.
2. **Use / Interaction Envelope** — space needed to sit, stand, open drawers/doors, approach, or otherwise use the object.
3. **Circulation Reserve** — required walking path around or past the object; this is not counted as physical occupancy but must remain clear where applicable.

Do not stretch or squash a real furniture model merely to force it into an arbitrary integer number of 1 m cells. Human-scale proportions remain authoritative. The grid is a planning/placement framework, not a redesign tool.

## Placement workflow for each downloaded item

For each furniture asset, before it is accepted in the candidate scene:

- verify real/imported dimensions in meters;
- normalize scale only when the source asset scale is wrong;
- calculate Hard Footprint in 0.5 m units;
- define Use / Interaction Envelope;
- verify required circulation width remains clear;
- snap final position to 0.5 m increments unless a deliberate visual exception is approved;
- report placement as: `size (m) / hard occupancy / use envelope / facing / clearance`;
- obtain Human Visual approval before moving to the next furniture item.

## Planning reference ranges (not exact locks for a specific downloaded model)

- Main sofa: roughly 3.0–3.5 m x 0.9–1.1 m => about 6–7 x 2 half-cells hard footprint.
- Accent / lounge chair: roughly 0.9–1.1 m x 0.9–1.1 m => about 2 x 2 half-cells.
- Coffee table: roughly 1.2–1.6 m x 0.6–0.9 m => about 3 x 2 half-cells.
- Side table: roughly 0.4–0.6 m square => typically 1–2 half-cells per axis depending on actual model size.
- Bed: roughly 1.8 m x 2.0 m => about 4 x 4 half-cells hard footprint, plus bedside/use clearance.
- Nightstand: roughly 0.4–0.6 m wide/deep => typically 1–2 half-cells per axis.
- Small round dining table: roughly 1.2–1.5 m diameter => about 3 x 3 half-cells hard footprint, with a much larger chair/use envelope.
- Large living rug: decorative footprint only; e.g. about 5.0 m x 4.5 m => 10 x 9 half-cells, but it does not reserve circulation by itself.

These ranges are planning references only. Exact occupancy is determined from the specific asset actually downloaded and imported.

## Important interpretation

A furniture piece is not considered well placed merely because its mesh fits inside a set of cells. It must also leave believable use space and preserve the accepted 1.2–1.7 m main circulation logic where applicable.

Furniture placement remains one-item-at-a-time. Do not bulk-download or bulk-place the shortlist.