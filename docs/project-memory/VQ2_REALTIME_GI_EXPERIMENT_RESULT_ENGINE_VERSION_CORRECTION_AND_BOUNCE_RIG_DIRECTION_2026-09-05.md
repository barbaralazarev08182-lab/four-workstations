# VQ2 Realtime GI Experiment Result, Engine Version Correction, and Bounce Rig Direction

Date: 2026-09-05

## Engine / pipeline correction

The active Unity project is currently:

- Unity `6000.3.21f1`
- URP `17.3.0`

This supersedes older assumptions that the project was running Unity 2022.3 / older URP.

## Realtime GI / Enlighten experiment result

The isolated candidate experiment completed successfully at a technical level:

- Runtime capability report: `EnlightenSupported=True`
- Realtime GI precompute: PASS
- Realtime resolution: `0.5`
- Contribute GI static objects: 33
- Baked GI disabled during the experiment to avoid ambiguity
- Compile PASS
- Blocking errors: 0

Fixed-camera West wall average RGB:

- Morning: `53.43 / 54.32 / 54.99`
- Noon: `61.94 / 62.91 / 64.02`
- Late Afternoon: `53.44 / 54.33 / 54.99`

The West wall therefore showed a measurable noon brightness lift, but the result was mostly grayscale. The experiment did not produce a strong, stable, artistically useful oak-floor warm bounce / color bleeding effect.

## Decision

Do not continue investing in Realtime GI / Enlighten for the current VQ2 daylight candidate.

Reasons:

1. Visual gain is too small for the target stylized-realistic look.
2. Warm bounce from the oak floor is not sufficiently readable.
3. Compatibility / future-support confidence is weak enough that it should not become a core production dependency.
4. The experiment should remain isolated and should not overwrite the accepted Open20m candidate.

## Next direction

Proceed with a **controlled bounce-light rig** as the preferred candidate approach.

Intent:

- Keep the locked SunVisual and SunDirectionalLight direction physically coherent.
- Do not tilt or fake the sun direction merely to light the West wall.
- Add controlled secondary/bounce lighting that behaves continuously with the 60-real-minute day cycle.
- Model the artistic effect of sunlight bouncing from oak flooring, bright walls, and large surfaces into the room.
- Preserve stronger warm key light, readable shadows, non-dead dark areas, and subtle warm color bleeding.
- Keep the system restrained enough that it does not read as obvious extra stage lighting.

Reflection/specular response remains a separate layer and should later be handled with suitable Reflection Probes / material roughness rather than by using bounce lights to fake mirror reflections.

## Experiment isolation

The Realtime GI experiment remains isolated in:

- `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_RealtimeGI_Experiment.unity`
- `Assets/FourWorkstations/Settings/Candidates/Open20m_RealtimeGI_Experiment.asset`

The main `Office_Open20m_Candidate` and production scene were not overwritten by this experiment.

## Workflow note

For the bounce-rig task, use the project’s current Codex execution-economy rule: implement directly, run only task-relevant compile/runtime checks, and avoid repository-wide audits or unrelated static checks unless a concrete risk requires them.
