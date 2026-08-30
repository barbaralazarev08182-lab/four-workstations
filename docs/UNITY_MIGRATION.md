# Four Workstations Unity Migration

## Client direction

- Web Client: **LEGACY / REFERENCE / FUTURE PORTAL**
- Unity Client: **PRIMARY GAME CLIENT**

The existing Next.js, Three.js, VQ-1C runtime and Vercel project remain intact
until the Unity client reaches functional parity.

## Foundation baseline

- Project path: `unity/FourWorkstations`
- Unity Editor: `6000.3.21f1`
- Template: Unity 6 official 3D Cross-Platform URP template `17.0.14`
- URP package: `17.3.0`
- Target: Windows Desktop x86_64
- Color space: Linear
- Input: New Input System
- Quality intent: Low / Medium / High

The installed Editor includes `windowsstandalonesupport`. Unity Hub restored an
active Personal license, and command-line import, PlayMode tests, screenshots,
and the Windows x86_64 Development build all complete successfully.

## Package policy

Foundation packages are deliberately small:

- Universal RP
- Input System
- Cinemachine
- Unity glTFast
- Test Framework
- Unity UI / TextMeshPro support

ProBuilder and Addressables are deferred until a concrete authoring or
asset-loading requirement exists. Unity
glTFast is the single glTF importer. If source models fail production import,
use a controlled Blender-to-FBX/GLB conversion rather than installing competing
importers.

## Folder architecture

All game-owned content lives under `Assets/FourWorkstations/`:

```text
Art/{Environment,Characters,Atlas,Props,Materials,Textures,VFX}
Audio/{Music,Ambience,SFX}
Prefabs/{Environment,Characters,Gameplay,UI}
Scenes/{Bootstrap,Office,QA}
Scripts/{Core,Characters,Office,Gameplay,Networking,Data,UI,Debug,Editor}
Settings
Tests/PlayMode
```

## Asset pipeline

Production sources copied into Unity:

- Office: Unity Geometry G1B baseline, imported at `Office_R5_Final.glb` to
  preserve the existing Unity asset GUID and scene references
- Ming: `Casual_Hoodie.gltf`
- Hong: `Formal.gltf`
- Jie: `Suit.gltf`
- Qixi: `Casual.gltf`

Unity uses meters (`1 unit = 1 meter`). Keep Office root scale at `1`. Resolve
axis, scale, pivot, rig and material issues in importer/source settings rather
than scaling the entire world.

### Unity workstation geometry authority

- Historical Web R5 workstation runtime topology is not authoritative for
  Unity.
- Unity workstation geometry uses
  `assets-source/blender/vq1c/full-office/vq1c-officeworld-full-pbr.blend` as
  its source of truth.
- Geometry G1B restored the four workstation runtime groups from 22,688 to
  50,176 triangles. Unity rebuilds must not inherit workstation decimation from
  historical R5.
- The current G1B Atlas1 bake is provisional and is not a pixel-identical
  recreation of historical FINAL R5 lighting. Architecture, rugs and Atlas0
  remain protected.
- Blender 5.2 LTS CLI is part of the Unity asset rebuild toolchain. The current
  executable is `D:\Steam\steamapps\common\Blender\blender.exe`.

## Character pipeline

Each imported character receives:

- an independent Prefab
- an independent Animator
- an `Idle <-> Walk` controller driven by float parameter `Speed`
- a scene-authored `CharacterSpawn_*` Transform

Humanoid mapping is optional. Preserve Generic when Humanoid conversion would
damage the source rig or clips.

## Camera reference

Web reference:

- position `(10.8, 11.8, 14.5)`
- target `(0, 0.8, 0)`

Unity migration reference starts at:

- position `(10.8, 11.8, -14.5)` after handedness conversion
- target `(0, 0.8, 0)`
- orthographic projection
- orthographic size `7`

The final camera must be judged visually against the frozen Web screenshots;
the numeric conversion is only a starting point.

## Lighting direction

The Web Two-Scene workaround, per-character compatibility SpotLights and Web
lightmap implementation are visual references, not Unity architecture. The
foundation uses one basic URP day directional light, flat environment lighting
and a QA-only day/night toggle. Future gates may add baked GI, Light Probes,
Reflection Probes, URP shadows and restrained post-processing.

### Current production Day and protected Night state

Gate 0A audited the authoritative local project at `unity/FourWorkstations`
with Unity `6000.3.21f1`.

- Production Day is `Assets/FourWorkstations/Scenes/Office/Office.unity`.
- At the Gate 0A audit it exactly matched
  `Assets/FourWorkstations/Scenes/Candidates/Office_L1R_Final_High_Quality_Candidate.unity`.
- The audited Day scene SHA-256 is
  `24C7844BF927FE00CF196970022388DE20DC12FC0AB56E972A8DA43B0B1FDD50`.
- Production Day uses intensity `1.38`, with ambient Sky `.49/.50/.50`,
  Equator `.33/.33/.32`, and Ground `.16/.16/.155`.
- `Assets/FourWorkstations/Scenes/Candidates/Office_N1R_Night_Refined_Candidate.unity`
  remains candidate-only and is not a production promotion.
- The audited N1R candidate scene SHA-256 is
  `C269EE62161D6EB32AF7DB30B3D0E9ED4CBB67DA0BB910C7B89A937A32161B39`.

The approved G1B/G1C workstation geometry authority, protected architecture and
rug assignments, and whole-world Unity Y=180 degree orientation correction
remain unchanged. No lighting rebake or geometry regeneration is part of the
Gate 0B repository snapshot.

The authoritative Unity migration snapshot commit is pending Gate 0B creation
and will be recorded here after the local snapshot commit is verified.

## Scenes and boot

- `Bootstrap.unity`: minimal scene loader
- `Office.unity`: production scene foundation
- `Office_QA.unity`: day/night, animation and performance checks

`FoundationSetup.BuildFoundationFromCommandLine` creates the Prefabs, scenes,
anchors, Animator controllers and build list.

## Atlas

Atlas remains a primitive placeholder Prefab at `(0, 0.02, 0)`. Its current
Phase 0/1/2 safe envelope is preserved. React/Three.js greybox code is not
ported.

## Networking and data

Supabase migration is planned. This gate does not modify the hosted schema and
does not create a partial C# client. Static future configuration should use
ScriptableObjects; online/runtime state remains a later Supabase migration.

## Validation commands

Validated commands:

```powershell
& 'E:\Unity\Hub\Editor\6000.3.21f1\Editor\Unity.exe' `
  -batchmode -quit -projectPath 'E:\Projects\four-workstations-unity\unity\FourWorkstations' `
  -executeMethod FourWorkstations.EditorTools.FoundationSetup.BuildFoundationFromCommandLine `
  -buildTarget StandaloneWindows64 -logFile 'E:\Projects\four-workstations-unity\unity-foundation.log'

& 'E:\Unity\Hub\Editor\6000.3.21f1\Editor\Unity.exe' `
  -batchmode -quit -projectPath 'E:\Projects\four-workstations-unity\unity\FourWorkstations' `
  -runTests -testPlatform PlayMode -testResults 'E:\Projects\four-workstations-unity\outputs\unity-migration\playmode-results.xml' `
  -logFile 'E:\Projects\four-workstations-unity\unity-playmode.log'

& 'E:\Unity\Hub\Editor\6000.3.21f1\Editor\Unity.exe' `
  -batchmode -quit -projectPath 'E:\Projects\four-workstations-unity\unity\FourWorkstations' `
  -executeMethod FourWorkstations.EditorTools.FoundationSetup.BuildWindows64 `
  -buildTarget StandaloneWindows64 -logFile 'E:\Projects\four-workstations-unity\unity-build.log'
```

## Known differences from Web

- Unity uses native URP rendering rather than the Web Two-Scene workaround.
- Web baked lightmaps are not treated as Unity lighting architecture.
- Character positions and camera Z require handedness-aware conversion.
- Unity 导入后的 Office 需要整体 Y=180° orientation correction；不通过隐藏建筑墙体实现 dollhouse view。
- Waypoints are authored as Unity Transform anchors instead of C# magic
  numbers or a full migrated Web path system.
