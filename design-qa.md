# Four Workstations — Character Motion QA

## Evidence

- Desktop screenshot: `outputs/office-motion-final.png`
- Motion recording: `outputs/four-workstations-character-motion.gif`
- Viewport: 1280 × 720 CSS pixels; device scale factor 1.
- Recording sequence: desk → dining → meeting → desk/typing → entrance/hidden.

## Motion verification

- The procedural character is split into body, head, shoulder-based arm pivots and hip-based leg pivots.
- Walking uses delta-time movement, smoothed heading changes and an alternating limb cycle with body and head secondary motion.
- Fixed aisle waypoints route characters around the workstation cluster and room furniture.
- Character labels remain attached to their 3D roots while moving.
- Working, studying, busy, meeting, eating, coffee, resting, napping, slacking, restroom, outside, off-work and overtime states were submitted through the real check-in UI.
- Four characters were started simultaneously and continued with independent paths and animation phases.
- Rapid destination changes rebuild the path from the live 3D position.
- Restroom and entrance journeys fade and hide the character only after arrival.
- Reloading in an overtime state restored the correct workstation position, typing action and night theme from localStorage.

## Visual and interaction checks

- Existing top navigation, compact activity feed, quick-action dock and 3D office composition remain unchanged.
- The current user returns to the desk in a seated typing pose after the recorded sequence.
- The URL-only development panel exposes destination, action, reset, play-all and speed controls at `?animationDebug=1`.
- Idle, typing, eating, resting and waving debug actions were exercised in the browser.
- Browser console contains no application errors; the remaining Three.js Clock deprecation notice originates from the development renderer dependency.

## Engineering checks

- ESLint: passed.
- TypeScript (`tsc --noEmit`): passed.
- Next.js production build: passed.

final result: passed
