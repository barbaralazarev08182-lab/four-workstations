# VQ2 Outside V2.1 — Milky Way Human Visual PASS

Date: 2026-09-05
Status: HUMAN VISUAL PASS — FAR SKY / MILKY WAY ONLY

## Decision

The authored 8K Solar System Scope `Stars + Milky Way` background is accepted as the current Far Sky visual baseline using **Preset B Balanced + Y Rotation 45°**.

This PASS applies specifically to the Far Sky / star field / Milky Way readability layer. It does **not** close the full Atlas Boundary / Outside gate; the local Atlas Boundary ripple remains a separate visual item requiring later review/refinement.

## Accepted candidate parameters

- Exposure: `0.62`
- Black Level: `0.008`
- Saturation: `0.54`
- MilkyWaySuppression: `0.18`
- MilkyWayBoost: `1.28`
- MilkyWayContrast: `1.16`
- MilkyWaySoftness: `0.5`
- Sky Y Rotation: `45°`

Important: this shader uses a newer Exposure scale than the previous Far Sky shader, so values are not numerically interchangeable with the older implementation.

## Human visual rationale

Comparison among the three candidate presets showed:

- Preset A / Subtle Readable: still too subdued for the intended outside vista; the Milky Way reads, but lacks enough presence.
- Preset B / Balanced: best balance. The Milky Way is clearly legible as a continuous galactic band from Living, Retrieval, and open-edge views; point stars are visibly brighter; large black negative-space regions remain intact.
- Preset C / Clear Heroic: visually stronger, but begins to push the Milky Way and blue/cool structure too far toward a stylized/heroic space backdrop. It risks competing with future hero celestial objects, the small sun, fleet events, and war visuals.

Therefore Preset B is the accepted current baseline.

## Locked visual intent for this layer

- Point stars should remain clearly visible rather than nearly disappearing into black.
- The Milky Way should be recognizable to the player without needing to search for it.
- The galaxy should remain a band/structure in deep space, not become a bright nebula wallpaper.
- Background black levels must remain genuinely dark enough to preserve scale and future event contrast.
- Future planets, galaxies, galaxy clusters, fleets, ruins, and other hero celestial objects should remain independent layers rather than being baked into this Far Sky texture.

## Technical preservation

Accepted implementation characteristics:

- official authored 8K Far Sky texture remains unchanged at source level
- camera-local sky binding remains preferred
- no global RenderSettings ambient/reflection changes
- interior lighting and Interior Architecture V3 remain unchanged
- production remains untouched

## Gate status

- 8K authored Far Sky technical integration: PASS
- Star readability: PASS
- Milky Way readability/composition: PASS
- Current Far Sky baseline: Preset B Balanced + 45°
- Atlas Boundary ripple visual: OPEN / separate review
- Full Outside visual gate: OPEN

No production promotion is authorized by this document.
