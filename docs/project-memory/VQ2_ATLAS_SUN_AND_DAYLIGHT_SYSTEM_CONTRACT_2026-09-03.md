# VQ2 Atlas Sun & Daylight System Contract — 2026-09-03

> Status: USER-APPROVED SYSTEM DIRECTION / ARTISTIC VALUES STILL OPEN
>
> Scope: `Office_Open20m_Candidate` and the future Atlas-refuge daylight system.
>
> This document records the user's explicit approval of the current Atlas-centered small-sun / daylight architecture. It defines the system separation and visual goals, but it does **not** freeze final lighting numbers, orbit radius, cycle duration, exact axis orientation, or final art tuning.

---

## 1. Current context

The current room is an enlarged approximately 20 × 20m open living platform.

Current relevant state:

- Oak Wood Planks floor material has Human Visual PASS.
- The historical four-character layout is obsolete; the current player character is the user's newer authored character.
- The two architectural walls are temporarily removed and have not yet been reinstalled.
- Furniture is currently incomplete, so the present mostly-open floor is **not** a reliable final judge of lighting quality.
- The intended long-term architecture remains an open refuge/home rather than a conventional four-wall sealed office.

The current visual concern is that sunlight is perceptible but the scene lacks sufficiently strong, beautiful, structured light-and-shadow composition.

Do **not** solve this simply by raising light intensity on the current empty-floor scene.

---

## 2. Core daylight goal — LOCKED DIRECTION

The room should have:

- clearly readable sunlight;
- strong directional structure;
- attractive large-scale light/shadow composition;
- long or otherwise visually meaningful cast shadows when sun angle allows;
- readable shaded regions rather than crushed black areas;
- good contact between characters/furniture/walls and the floor;
- a small sun that visually reads as a sun-like object without becoming an uncomfortable blown-out white disk.

The target is **strong light structure, not simply high brightness**.

The preferred image hierarchy is:

`Sun Key > Ambient / Sky Fill > Contact Shadow`

Ambient fill must not become so strong that it erases the directional sunlight.

---

## 3. Atlas-centered solar orbit — LOCKED STRUCTURE / EXACT GEOMETRY OPEN

Atlas is the orbital origin / center reference for the small refuge sun.

Accepted structural rule:

- the visible sun moves on a circular path centered on Atlas;
- the orbit lies on a vertical plane defined by one center axis of the floor / house;
- at the highest point of the orbit, the sun is directly above Atlas;
- the sun can continue toward the opposite side and may later support a complete day/night cycle.

Still open until the user supplies the planned diagram / later visual review:

- which exact floor axis defines the orbital plane;
- orbit radius;
- sun visual diameter;
- cycle duration;
- sunrise/sunset timing;
- whether the full circle is physically visible or partially hidden by later world presentation.

Do not guess these values and lock them prematurely.

---

## 4. Sun Visual and Sun Light must be separate — LOCKED ARCHITECTURE

The visible small sun and the light that illuminates the refuge are two separate systems.

### 4.1 `SunVisual`

Purpose:

- represent the object the player sees in the Atlas refuge;
- communicate the current solar position;
- provide a sun-like visual identity without excessive glare.

It should **not** be required to physically illuminate the entire 20 × 20m room through a powerful local Point Light.

Recommended visual construction:

1. readable bright core / sphere;
2. thin restrained corona;
3. subtle bloom only;
4. optional slow, low-amplitude surface energy variation later.

Avoid:

- huge white bloom blob;
- visually clipping the whole surrounding sky;
- using extreme emission solely to prove that it is a sun;
- turning the object into a giant room-scale light bulb.

The player should still be able to perceive that a bounded sun-like body exists.

### 4.2 `SunDirectionalLight`

Purpose:

- provide the actual primary daylight;
- produce consistent, approximately parallel sun rays across the refuge;
- generate the important room-scale cast shadows.

Its direction must be synchronized to the current `SunVisual` position relative to Atlas, so the player never sees a mismatch between where the sun appears and where the shadows point.

Its intensity is an artistic / gameplay lighting control and does not need to be numerically coupled to the visible sun's emissive brightness.

This separation is deliberate and is compatible with the fiction that the small refuge sun is an Atlas-domain artificial daylight node rather than a conventional distant astrophysical star.

---

## 5. Do not use a strong local Point Light as the main sun — LOCKED RULE

Do not make the visible sun's local Point Light the main source responsible for the entire room's daylight.

Reason:

- local distance falloff would make different parts of the 20 × 20m room vary too strongly;
- cast-shadow directions would fan outward and read like a nearby lamp rather than sunlight;
- tuning would become harder as orbit distance changes;
- the result would fight the intended clean architectural light/shadow composition.

A very subtle local effect may be used later if visually useful, but primary daylight remains directional.

---

## 6. Exposure strategy — LOCKED DIRECTION

The future scene must simultaneously contain:

- a very dark cosmic exterior;
- a bright visible small sun;
- normally exposed wood floor, walls, furniture, character, and domestic objects.

Therefore exposure must remain stable.

Rule:

> Do not let unrestricted auto exposure become the mechanism that makes the sun or day/night cycle work.

Preferred direction:

- fixed or tightly bounded exposure;
- at most subtle eye adaptation;
- looking toward black space must not suddenly blow out the room;
- looking toward the sun must not suddenly plunge the whole room into darkness.

Day/night change should primarily come from actual lighting-state changes, not camera exposure pumping.

---

## 7. Key / Fill relationship — LOCKED VISUAL PRINCIPLE

The visual problem to solve is contrast hierarchy, not raw illumination.

If ambient / sky fill approaches the primary sun too closely, the room becomes flat even when a directional light is present.

Target:

- direct-sun region is clearly brighter and more structurally dominant;
- shaded areas remain readable;
- contact regions receive additional local depth without dirtying surfaces;
- avoid both flat fill and crushed-black shadows.

Exact intensity ratios are not locked and must be tuned by visual review.

---

## 8. Shadow character — LOCKED DIRECTION

Preferred daylight shadows:

- clear overall silhouette;
- strong directional composition;
- not razor-hard default-CG edges;
- restrained softness / penumbra;
- convincing contact under character feet, furniture legs, wall/floor junctions, and major equipment;
- do not use excessive AO to fake all depth.

The historical Unity Day-lighting work remains useful as a methodology/reference for structured sunlight and contact depth, but its exact old numeric values are **not** automatically authoritative for the new 20 × 20 Atlas refuge.

---

## 9. Time-of-day character — APPROVED DIRECTION

The sun orbit may drive subtle daylight variation.

Preferred progression:

- sunrise: restrained warm light;
- morning: warm-neutral directional light, often visually rich;
- noon / zenith: cleaner, more neutral light; naturally shorter shadows and potentially flatter composition;
- afternoon: renewed directional depth, slightly warmer;
- sunset: stronger but still controlled warmth;
- night: the directional sun contribution falls away and domestic / Atlas / Power Hub / equipment / exterior-event lighting becomes more important.

Do not force noon to be the most visually dramatic moment. Low-to-mid solar angles are expected to produce stronger architectural light/shadow composition.

Avoid turning sunrise/sunset into a full-screen orange filter.

---

## 10. Relationship to the two-wall architecture — IMPORTANT

Final daylight tuning must wait until enough vertical geometry exists to judge it.

Before treating the new daylight look as a Human Visual candidate, restore at minimum:

- the two intended major walls or faithful temporary proxies;
- several simple high/low furniture proxies or actual furniture;
- the current player character;
- the accepted Oak floor.

Reason:

The visual quality of sunlight is largely produced by **what blocks and receives the light**. A mostly empty floor cannot provide the final large shadow shapes, wall cuts, contact depth, or architectural composition.

Do not compensate for missing geometry by over-driving sun intensity.

---

## 11. Atlas-boundary sun interaction — APPROVED VISUAL OPPORTUNITY / NOT REQUIRED FOR FIRST PROTOTYPE

A future reveal may use the sun to help communicate the normally invisible Atlas Refuge Sphere.

Candidate behavior:

- when the sun approaches or crosses the Atlas boundary, the otherwise invisible boundary may produce very subtle refraction, ripple, halo, light splitting, or spatial distortion;
- a similar subtle event can occur at the opposite side near sunset / departure;
- the effect should make the player gradually suspect that an invisible boundary exists rather than permanently drawing the whole sphere.

This is compatible with the existing rule that Atlas Sphere is normally invisible and becomes legible through interaction/disturbance.

It is accepted as a design direction, but it is **not required to block the first daylight prototype**.

---

## 12. First lighting prototype / review Gate

Do not start with a final production bake.

The next meaningful daylight prototype should be candidate-only and should test only the major artistic controls:

1. solar angle / direction;
2. Key vs Fill balance;
3. shadow softness / contact quality;
4. exposure stability.

Required evaluation scene content:

- accepted Oak floor;
- restored two-wall architecture or faithful proxies;
- player character;
- enough furniture / proxy geometry to cast useful shadows.

Review goals:

- sunlight is immediately readable;
- room has attractive large light/dark shapes;
- shaded side remains playable;
- wood floor gains useful grazing-light response;
- visible sun is comfortable to look toward briefly and does not dominate the image with bloom;
- visible sun position and shadow direction agree.

Human Visual review is required before freezing artistic settings.

---

## 13. What is explicitly NOT locked yet

Do not treat the following as final values until later Human Visual review:

- sun orbit radius;
- sun mesh diameter;
- exact orbital plane axis orientation;
- day/night cycle length;
- Directional Light intensity;
- sun color / temperature values;
- ambient intensity and color;
- shadow angle / softness values;
- exposure value and adaptation limits;
- bloom strength;
- contact shadow / SSAO settings;
- baked vs mixed vs realtime final lighting architecture;
- final Atlas-boundary refraction/VFX implementation.

---

## 14. Change boundary

This decision is a design/system contract only.

It does not authorize:

- production-scene promotion;
- replacing the accepted Oak floor;
- redesigning the Build Grid;
- changing player control/camera behavior;
- destructive lighting changes to old production baselines;
- committing local Unity scene implementation that has not received the required review.

Future implementation should remain candidate-first and follow Human Visual review before promotion.

---

## 15. Short authoritative summary

```text
Atlas = sun orbit origin.
Visible Sun = visual object, comfortable brightness.
Directional Sun = actual primary daylight and shadows.
Sun position and light direction stay synchronized.
Ambient fill remains subordinate to the sun.
Exposure stays stable and tightly controlled.
Strong light structure matters more than raw brightness.
Restore walls + useful geometry before final lighting judgment.
Tune: solar angle -> Key/Fill -> shadow softness -> exposure.
No final numbers are locked yet.
```
