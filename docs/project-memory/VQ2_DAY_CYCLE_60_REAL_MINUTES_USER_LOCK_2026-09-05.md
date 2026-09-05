# VQ2 Day Cycle — 60 Real Minutes User Lock

Date: 2026-09-05

## User decision

The intended gameplay day length is locked to:

- Full Sun orbit / full day: **60 real minutes**
- Runtime cycle duration: **3600 seconds**
- Uniform angular velocity: **6 degrees per real minute**
- Sunrise to sunset (Sun above floor/horizon plane): **30 real minutes**
- Sunset to next sunrise (Sun below floor/horizon plane): **30 real minutes**

This uses the already locked Sun orbit model:

- AtlasAnchor is orbit center
- Orbit is the vertical Y-Z great-circle through the room centerline
- Counter-clockwise motion in the user's locked side-view reference
- Floor plane y=0 is the horizon
- Right-side upward horizon crossing = sunrise
- Top = noon
- Left-side downward horizon crossing = sunset
- Bottom = midnight

## Implementation note

The 60-minute cycle is the intended gameplay/default value. Development and Human Review may temporarily use an accelerated cycle in the Inspector for visual verification, but such preview speeds are not gameplay defaults.

No change is implied to SunVisual appearance: SunVisual remains visually constant and independent from daylight lighting logic.
