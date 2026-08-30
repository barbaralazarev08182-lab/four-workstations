#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using FourWorkstations.Characters;
using FourWorkstations.Core;
using FourWorkstations.Data;
using FourWorkstations.Debugging;
using FourWorkstations.Office;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace FourWorkstations.EditorTools
{
    public static class FoundationSetup
    {
        private const string Root = "Assets/FourWorkstations";
        private const string OfficeAsset = Root + "/Art/Environment/Office_R5_Final.glb";
        private const string BootstrapScene = Root + "/Scenes/Bootstrap/Bootstrap.unity";
        private const string OfficeScene = Root + "/Scenes/Office/Office.unity";
        private const string QaScene = Root + "/Scenes/QA/Office_QA.unity";

        private static readonly CharacterDefinition[] Characters =
        {
            new("Ming", Root + "/Art/Characters/Ming/Casual_Hoodie.gltf", new Vector3(-1.65f, 0f, 1.75f)),
            new("Hong", Root + "/Art/Characters/Hong/Formal.gltf", new Vector3(1.65f, 0f, -1.75f)),
            new("Jie", Root + "/Art/Characters/Jie/Suit.gltf", new Vector3(-1.65f, 0f, -1.75f)),
            new("Qixi", Root + "/Art/Characters/Qixi/Casual.gltf", new Vector3(1.65f, 0f, 1.75f)),
        };

        [MenuItem("Four Workstations/Migration/Build Foundation")]
        public static void BuildFoundation()
        {
            ConfigureProject();
            CreateGameConfig();
            foreach (var character in Characters)
            {
                CreateCharacterPrefab(character);
            }
            CreateBootstrapScene();
            CreateOfficeScene(OfficeScene, false);
            CreateOfficeScene(QaScene, true);
            ConfigureBuildScenes();
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("[UnityMigration] FOUNDATION_SETUP_PASS");
        }

        public static void BuildFoundationFromCommandLine()
        {
            BuildFoundation();
        }

        public static void BuildWindows64()
        {
            BuildFoundation();
            Directory.CreateDirectory("Builds/Windows");
            var options = new BuildPlayerOptions
            {
                scenes = new[] { BootstrapScene, OfficeScene },
                locationPathName = "Builds/Windows/FourWorkstations.exe",
                target = BuildTarget.StandaloneWindows64,
                options = BuildOptions.Development,
            };
            var report = BuildPipeline.BuildPlayer(options);
            if (report.summary.result != UnityEditor.Build.Reporting.BuildResult.Succeeded)
            {
                throw new InvalidOperationException($"Windows build failed: {report.summary.result}");
            }
            Debug.Log($"[UnityMigration] WINDOWS_BUILD_PASS bytes={report.summary.totalSize}");
        }

        public static void CaptureScreenshots()
        {
            BuildFoundation();
            const string output = "../../outputs/unity-visual-foundation-v1";
            Directory.CreateDirectory(output);
            EditorSceneManager.OpenScene(OfficeScene);
            var camera = GameObject.Find("OfficeCamera").GetComponent<Camera>();
            var dayNight = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            dayNight.SetNight(false);
            Capture(camera, output + "/.render-warmup.png");
            Capture(camera, output + "/01-office-day.png");
            Capture(camera, output + "/03-four-characters-day.png");
            Capture(camera, output + "/05-atlas-center-day.png");
            dayNight.SetNight(true);
            Capture(camera, output + "/02-office-night.png");
            Capture(camera, output + "/04-four-characters-night.png");
            File.Delete(output + "/.render-warmup.png");
            Debug.Log("[UnityMigration] SCREENSHOT_CAPTURE_PASS");
        }

        private static void ConfigureProject()
        {
            PlayerSettings.companyName = "Four Workstations";
            PlayerSettings.productName = "Four Workstations";
            PlayerSettings.colorSpace = ColorSpace.Linear;
            PlayerSettings.defaultScreenWidth = 1920;
            PlayerSettings.defaultScreenHeight = 1080;
            QualitySettings.vSyncCount = 0;
            Application.targetFrameRate = -1;
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Standalone, BuildTarget.StandaloneWindows64);
            ConfigureQualityLevels();
            ConfigureUrpAdditionalLights();
            ConfigureEdgeQuality();
        }

        private static void ConfigureEdgeQuality()
        {
            var pipeline = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>("Assets/Settings/PC_RPAsset.asset");
            if (pipeline == null) throw new InvalidOperationException("Active PC URP Asset missing.");
            var serialized = new SerializedObject(pipeline);
            var msaa = serialized.FindProperty("m_MSAA");
            if (msaa != null) msaa.intValue = 4;
            var renderScale = serialized.FindProperty("m_RenderScale");
            if (renderScale != null) renderScale.floatValue = 1f;
            serialized.ApplyModifiedPropertiesWithoutUndo();
        }

        private static void ConfigureUrpAdditionalLights()
        {
            foreach (var path in new[] { "Assets/Settings/PC_RPAsset.asset", "Assets/Settings/Mobile_RPAsset.asset" })
            {
                var pipeline = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(path);
                if (pipeline == null) continue;
                var serialized = new SerializedObject(pipeline);
                var mode = serialized.FindProperty("m_AdditionalLightsRenderingMode");
                if (mode != null) mode.intValue = 2;
                var limit = serialized.FindProperty("m_AdditionalLightsPerObjectLimit");
                if (limit != null) limit.intValue = 4;
                serialized.ApplyModifiedPropertiesWithoutUndo();
            }
        }

        private static void ConfigureQualityLevels()
        {
            var settings = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/QualitySettings.asset").FirstOrDefault();
            if (settings == null) return;
            var serialized = new SerializedObject(settings);
            var levels = serialized.FindProperty("m_QualitySettings");
            if (levels == null || levels.arraySize == 0) return;
            while (levels.arraySize < 3) levels.InsertArrayElementAtIndex(levels.arraySize - 1);
            levels.GetArrayElementAtIndex(0).FindPropertyRelative("name").stringValue = "Low";
            levels.GetArrayElementAtIndex(1).FindPropertyRelative("name").stringValue = "Medium";
            levels.GetArrayElementAtIndex(2).FindPropertyRelative("name").stringValue = "High";
            serialized.FindProperty("m_CurrentQuality").intValue = 2;
            serialized.ApplyModifiedPropertiesWithoutUndo();
        }

        private static void CreateGameConfig()
        {
            const string path = Root + "/Settings/GameConfig.asset";
            if (AssetDatabase.LoadAssetAtPath<GameConfig>(path) != null) return;
            var config = ScriptableObject.CreateInstance<GameConfig>();
            config.atlasPrototypePhase = 0;
            AssetDatabase.CreateAsset(config, path);
        }

        private static void CreateCharacterPrefab(CharacterDefinition definition)
        {
            var model = AssetDatabase.LoadAssetAtPath<GameObject>(definition.AssetPath);
            if (model == null)
            {
                throw new InvalidOperationException($"glTF import missing for {definition.AssetPath}");
            }

            var instance = PrefabUtility.InstantiatePrefab(model) as GameObject;
            if (instance == null) throw new InvalidOperationException($"Cannot instantiate {definition.Name}");
            instance.name = definition.Name;
            instance.tag = "Player";
            var animator = instance.GetComponent<Animator>() ?? instance.AddComponent<Animator>();
            animator.runtimeAnimatorController = CreateAnimator(definition);
            instance.AddComponent<CharacterAnimationDriver>();
            PrefabUtility.SaveAsPrefabAsset(instance, $"{Root}/Prefabs/Characters/{definition.Name}.prefab");
            UnityEngine.Object.DestroyImmediate(instance);
        }

        private static AnimatorController CreateAnimator(CharacterDefinition definition)
        {
            var path = $"{Root}/Prefabs/Characters/{definition.Name}.controller";
            var existing = AssetDatabase.LoadAssetAtPath<AnimatorController>(path);
            if (existing != null) return existing;
            var clips = AssetDatabase.LoadAllAssetsAtPath(definition.AssetPath).OfType<AnimationClip>()
                .Where(clip => !clip.name.StartsWith("__preview__", StringComparison.OrdinalIgnoreCase)).ToArray();
            var idle = clips.FirstOrDefault(clip => clip.name.Contains("Idle", StringComparison.OrdinalIgnoreCase));
            var walk = clips.FirstOrDefault(clip => clip.name.Contains("Walk", StringComparison.OrdinalIgnoreCase));
            if (idle == null || walk == null)
            {
                throw new InvalidOperationException($"{definition.Name} requires Idle and Walk clips. Found: {string.Join(", ", clips.Select(c => c.name))}");
            }

            var controller = AnimatorController.CreateAnimatorControllerAtPath(path);
            controller.AddParameter("Speed", AnimatorControllerParameterType.Float);
            var machine = controller.layers[0].stateMachine;
            var idleState = machine.AddState("Idle");
            idleState.motion = idle;
            machine.defaultState = idleState;
            var walkState = machine.AddState("Walk");
            walkState.motion = walk;
            AddTransition(idleState, walkState, AnimatorConditionMode.Greater, 0.1f);
            AddTransition(walkState, idleState, AnimatorConditionMode.Less, 0.1f);
            return controller;
        }

        private static void AddTransition(AnimatorState from, AnimatorState to, AnimatorConditionMode mode, float threshold)
        {
            var transition = from.AddTransition(to);
            transition.hasExitTime = false;
            transition.duration = 0.18f;
            transition.AddCondition(mode, threshold, "Speed");
        }

        private static void CreateBootstrapScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            new GameObject("Bootstrap").AddComponent<BootstrapLoader>();
            EditorSceneManager.SaveScene(scene, BootstrapScene);
        }

        private static void CreateOfficeScene(string path, bool qa)
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var worldRoot = new GameObject("OfficeWorldRoot").transform;
            worldRoot.SetPositionAndRotation(Vector3.zero, Quaternion.Euler(0f, 180f, 0f));
            var officeAsset = AssetDatabase.LoadAssetAtPath<GameObject>(OfficeAsset);
            if (officeAsset == null) throw new InvalidOperationException("Office R5 glTF import missing");
            var office = PrefabUtility.InstantiatePrefab(officeAsset) as GameObject;
            office.name = "Office_R5_Final";
            office.transform.SetParent(worldRoot, false);
            office.transform.SetLocalPositionAndRotation(Vector3.zero, Quaternion.identity);
            office.transform.localScale = Vector3.one;
            ConfigureOfficeMaterials(office);
            CreateLightProbeGroup(worldRoot);
            CreateReflectionProbe(worldRoot);

            var anchors = new GameObject("CharacterSpawns").transform;
            anchors.SetParent(worldRoot, false);
            foreach (var definition in Characters)
            {
                var spawn = new GameObject($"CharacterSpawn_{definition.Name}").transform;
                spawn.SetParent(anchors, false);
                spawn.localPosition = definition.Position;
                var prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{Root}/Prefabs/Characters/{definition.Name}.prefab");
                var character = PrefabUtility.InstantiatePrefab(prefab) as GameObject;
                character.name = definition.Name;
                character.transform.SetParent(worldRoot, false);
                character.transform.SetLocalPositionAndRotation(definition.Position, Quaternion.identity);
                foreach (var skin in character.GetComponentsInChildren<SkinnedMeshRenderer>(true))
                {
                    skin.lightProbeUsage = LightProbeUsage.BlendProbes;
                    skin.reflectionProbeUsage = ReflectionProbeUsage.BlendProbes;
                    skin.receiveShadows = true;
                }
            }

            CreateWaypoints(worldRoot);
            CreateAtlasPlaceholder(worldRoot);
            var sun = CreateLighting(worldRoot, out var workstationLights);
            var volume = CreateGlobalVolume();
            var dayNightObject = new GameObject("DayNight");
            var dayNight = dayNightObject.AddComponent<DayNightController>();
            new SerializedObject(dayNight).FindProperty("sun").objectReferenceValue = sun;
            var dayNightSerialized = new SerializedObject(dayNight);
            dayNightSerialized.FindProperty("sun").objectReferenceValue = sun;
            dayNightSerialized.FindProperty("workstationLights").arraySize = workstationLights.Length;
            for (var i = 0; i < workstationLights.Length; i++)
                dayNightSerialized.FindProperty("workstationLights").GetArrayElementAtIndex(i).objectReferenceValue = workstationLights[i];
            dayNightSerialized.FindProperty("globalVolume").objectReferenceValue = volume;
            dayNightSerialized.ApplyModifiedPropertiesWithoutUndo();
            CreateCamera();
            new GameObject("PerformanceBaseline").AddComponent<PerformanceProbe>();

            if (qa)
            {
                var qaObject = new GameObject("OfficeQA");
                var controller = qaObject.AddComponent<OfficeQaController>();
                var serialized = new SerializedObject(controller);
                serialized.FindProperty("dayNight").objectReferenceValue = dayNight;
                serialized.ApplyModifiedPropertiesWithoutUndo();
            }

            EditorSceneManager.SaveScene(scene, path);
        }

        private static void CreateWaypoints(Transform worldRoot)
        {
            var root = new GameObject("OfficeWaypoints").transform;
            root.SetParent(worldRoot, false);
            CreateAnchor(root, "MingDesk", new Vector3(-3.2f, 0f, 1.75f));
            CreateAnchor(root, "HongDesk", new Vector3(3.2f, 0f, -1.75f));
            CreateAnchor(root, "JieDesk", new Vector3(-3.2f, 0f, -1.75f));
            CreateAnchor(root, "QixiDesk", new Vector3(3.2f, 0f, 1.75f));
            CreateAnchor(root, "Meeting", new Vector3(0f, 0f, -3.1f));
            CreateAnchor(root, "Coffee", new Vector3(3.8f, 0f, -3.9f));
            CreateAnchor(root, "Dining", new Vector3(3.4f, 0f, 3.8f));
            CreateAnchor(root, "Sofa", new Vector3(-4.4f, 0f, 2.9f));
            CreateAnchor(root, "Entrance", new Vector3(-5.7f, 0f, 0f));
            CreateAnchor(root, "Restroom", new Vector3(5.4f, 0f, 0f));
        }

        private static void CreateAnchor(Transform parent, string name, Vector3 position)
        {
            var anchor = new GameObject(name).transform;
            anchor.SetParent(parent, false);
            anchor.localPosition = position;
        }

        private static void CreateAtlasPlaceholder(Transform worldRoot)
        {
            var root = new GameObject("AtlasAnchor").transform;
            root.SetParent(worldRoot, false);
            var phase0 = GameObject.CreatePrimitive(PrimitiveType.Cube);
            phase0.name = "Atlas_Phase0_Parts";
            phase0.transform.SetParent(root);
            phase0.transform.localPosition = new Vector3(0f, 0.08f, 0f);
            phase0.transform.localScale = new Vector3(0.78f, 0.16f, 0.7f);
            var phase1 = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            phase1.name = "Atlas_Phase1_Foundation";
            phase1.transform.SetParent(root);
            phase1.transform.localPosition = new Vector3(0f, 0.16f, 0f);
            phase1.transform.localScale = new Vector3(0.48f, 0.16f, 0.48f);
            phase1.SetActive(false);
            var phase2 = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            phase2.name = "Atlas_Phase2_Core";
            phase2.transform.SetParent(root);
            phase2.transform.localPosition = new Vector3(0f, 0.58f, 0f);
            phase2.transform.localScale = new Vector3(0.2f, 0.58f, 0.2f);
            phase2.SetActive(false);
            root.localPosition = new Vector3(0f, 0.02f, 0f);
            PrefabUtility.SaveAsPrefabAsset(root.gameObject, Root + "/Prefabs/Gameplay/AtlasPlaceholder.prefab");
        }

        private static void ConfigureOfficeMaterials(GameObject office)
        {
            foreach (var renderer in office.GetComponentsInChildren<Renderer>(true))
            {
                renderer.receiveShadows = true;
                renderer.shadowCastingMode = ShadowCastingMode.On;
                renderer.forceRenderingOff = false;
                renderer.enabled = true;
                var materials = renderer.sharedMaterials;
                for (var i = 0; i < materials.Length; i++)
                {
                    if (materials[i] != null) materials[i] = CreateVisualMaterial(materials[i]);
                }
                renderer.sharedMaterials = materials;
            }
        }

        private static Material CreateVisualMaterial(Material source)
        {
            var sourceName = source.name.Replace(" (Instance)", string.Empty);
            var path = $"{Root}/Art/Materials/VF1_{sourceName}.mat";
            var material = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (material == null)
            {
                material = new Material(source);
                AssetDatabase.CreateAsset(material, path);
            }
            else
            {
                material.CopyPropertiesFromMaterial(source);
                material.shader = source.shader;
            }

            var color = sourceName switch
            {
                "mat_wall" => new Color(0.76f, 0.73f, 0.67f, 1f),
                "mat_floor_wood" => new Color(0.76f, 0.59f, 0.40f, 1f),
                "mat_floor_wood_light" => new Color(0.82f, 0.67f, 0.48f, 1f),
                "mat_wood_light" => new Color(0.79f, 0.58f, 0.36f, 1f),
                "mat_wood" => new Color(0.55f, 0.37f, 0.23f, 1f),
                "mat_graygreen" => new Color(0.48f, 0.54f, 0.46f, 1f),
                "mat_cream_fabric" => new Color(0.72f, 0.69f, 0.60f, 1f),
                "mat_terra" => new Color(0.63f, 0.31f, 0.22f, 1f),
                "mat_counter" => new Color(0.53f, 0.49f, 0.42f, 1f),
                "mat_metal" => new Color(0.48f, 0.47f, 0.43f, 1f),
                "mat_plate" => new Color(0.72f, 0.72f, 0.68f, 1f),
                "mat_ceramic" => new Color(0.76f, 0.73f, 0.66f, 1f),
                "mat_yellow" => new Color(0.72f, 0.50f, 0.19f, 1f),
                "mat_machine" => new Color(0.31f, 0.35f, 0.34f, 1f),
                "mat_dark" => new Color(0.12f, 0.14f, 0.15f, 1f),
                "mat_grayblue" => new Color(0.38f, 0.46f, 0.52f, 1f),
                _ => source.HasProperty("_BaseColor") ? source.GetColor("_BaseColor") : Color.white,
            };
            if (material.HasProperty("_BaseColor")) material.SetColor("_BaseColor", color);
            if (material.HasProperty("_Metallic"))
                material.SetFloat("_Metallic", sourceName == "mat_metal" ? 0.28f : 0f);
            if (material.HasProperty("_Smoothness"))
                material.SetFloat("_Smoothness", sourceName is "mat_metal" or "mat_ceramic" ? 0.32f : 0.16f);
            EditorUtility.SetDirty(material);
            return material;
        }

        private static void CreateLightProbeGroup(Transform worldRoot)
        {
            var root = new GameObject("OfficeLightProbes");
            root.transform.SetParent(worldRoot, false);
            var group = root.AddComponent<LightProbeGroup>();
            var probes = new System.Collections.Generic.List<Vector3>();
            foreach (var y in new[] { 0.35f, 1.15f, 2.1f })
            foreach (var x in new[] { -5f, -2.5f, 0f, 2.5f, 5f })
            foreach (var z in new[] { -4f, 0f, 4f })
                probes.Add(new Vector3(x, y, z));
            group.probePositions = probes.ToArray();
        }

        private static void CreateReflectionProbe(Transform worldRoot)
        {
            var probeObject = new GameObject("OfficeReflectionProbe");
            probeObject.transform.SetParent(worldRoot, false);
            probeObject.transform.localPosition = new Vector3(0f, 2.2f, 0f);
            var probe = probeObject.AddComponent<ReflectionProbe>();
            probe.mode = UnityEngine.Rendering.ReflectionProbeMode.Realtime;
            probe.refreshMode = UnityEngine.Rendering.ReflectionProbeRefreshMode.OnAwake;
            probe.timeSlicingMode = UnityEngine.Rendering.ReflectionProbeTimeSlicingMode.IndividualFaces;
            probe.size = new Vector3(15f, 5f, 12f);
            probe.resolution = 128;
            probe.boxProjection = true;
            probe.intensity = 0.55f;
            RenderSettings.reflectionIntensity = 0.55f;
        }

        private static Volume CreateGlobalVolume()
        {
            const string profilePath = Root + "/Settings/VisualFoundationVolume.asset";
            var profile = AssetDatabase.LoadAssetAtPath<VolumeProfile>(profilePath);
            if (profile == null)
            {
                profile = ScriptableObject.CreateInstance<VolumeProfile>();
                AssetDatabase.CreateAsset(profile, profilePath);
            }
            profile.components.RemoveAll(component => component == null);
            if (!profile.TryGet(out Tonemapping tonemapping))
            {
                tonemapping = profile.Add<Tonemapping>();
                if (!AssetDatabase.Contains(tonemapping)) AssetDatabase.AddObjectToAsset(tonemapping, profile);
            }
            tonemapping.mode.Override(TonemappingMode.Neutral);
            if (!profile.TryGet(out ColorAdjustments color))
            {
                color = profile.Add<ColorAdjustments>();
                if (!AssetDatabase.Contains(color)) AssetDatabase.AddObjectToAsset(color, profile);
            }
            color.postExposure.Override(-0.35f);
            color.contrast.Override(8f);
            color.saturation.Override(-6f);
            color.colorFilter.Override(new Color(1f, 0.985f, 0.96f));
            EditorUtility.SetDirty(profile);
            AssetDatabase.SaveAssets();
            var volumeObject = new GameObject("VisualFoundationGlobalVolume");
            var volume = volumeObject.AddComponent<Volume>();
            volume.isGlobal = true;
            volume.priority = 10f;
            volume.sharedProfile = profile;
            return volume;
        }

        private static Light CreateLighting(Transform worldRoot, out Light[] workstationLights)
        {
            var lightObject = new GameObject("DayDirectionalLight");
            lightObject.transform.rotation = Quaternion.Euler(52f, -38f, 0f);
            var sun = lightObject.AddComponent<Light>();
            sun.type = LightType.Directional;
            sun.color = new Color(1f, 0.96f, 0.89f);
            sun.intensity = 0.78f;
            sun.shadows = LightShadows.Soft;
            sun.shadowStrength = 0.78f;
            sun.shadowBias = 0.045f;
            sun.shadowNormalBias = 0.28f;
            RenderSettings.sun = sun;
            var positions = new[]
            {
                new Vector3(-3.2f, 2.25f, 1.75f), new Vector3(3.2f, 2.25f, -1.75f),
                new Vector3(-3.2f, 2.25f, -1.75f), new Vector3(3.2f, 2.25f, 1.75f),
            };
            workstationLights = new Light[positions.Length];
            var root = new GameObject("NightWorkstationLights").transform;
            root.SetParent(worldRoot, false);
            for (var i = 0; i < positions.Length; i++)
            {
                var lightGameObject = new GameObject($"WorkstationWarmLight_{i + 1}");
                lightGameObject.transform.SetParent(root, false);
                lightGameObject.transform.localPosition = positions[i];
                var lightTarget = new Vector3(positions[i].x, 0.68f, positions[i].z);
                lightGameObject.transform.localRotation = Quaternion.LookRotation(lightTarget - positions[i]);
                var localLight = lightGameObject.AddComponent<Light>();
                localLight.type = LightType.Spot;
                localLight.colorTemperature = 2850f;
                localLight.useColorTemperature = true;
                localLight.color = new Color(1f, 0.67f, 0.38f);
                localLight.intensity = 12f;
                localLight.range = 4f;
                localLight.spotAngle = 72f;
                localLight.innerSpotAngle = 42f;
                localLight.shadows = LightShadows.Soft;
                localLight.shadowStrength = 0.55f;
                localLight.enabled = false;
                workstationLights[i] = localLight;
            }
            return sun;
        }

        private static void CreateCamera()
        {
            var cameraObject = new GameObject("OfficeCamera");
            cameraObject.tag = "MainCamera";
            cameraObject.transform.position = new Vector3(10.8f, 11.8f, -14.5f);
            cameraObject.transform.LookAt(new Vector3(0f, 0.8f, 0f));
            var camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 7f;
            camera.nearClipPlane = 0.1f;
            camera.farClipPlane = 100f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.055f, 0.08f, 0.13f);
            camera.allowMSAA = true;
            cameraObject.AddComponent<AudioListener>();
        }

        private static void ConfigureBuildScenes()
        {
            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene(BootstrapScene, true),
                new EditorBuildSettingsScene(OfficeScene, true),
                new EditorBuildSettingsScene(QaScene, false),
            };
        }

        private static void Capture(Camera camera, string path)
        {
            const int width = 1920;
            const int height = 1080;
            var descriptor = new RenderTextureDescriptor(width, height, RenderTextureFormat.ARGB32, 24)
            {
                msaaSamples = 4,
                useMipMap = false,
                autoGenerateMips = false,
            };
            var renderTexture = new RenderTexture(descriptor);
            var resolvedTexture = new RenderTexture(width, height, 0, RenderTextureFormat.ARGB32);
            var texture = new Texture2D(width, height, TextureFormat.RGB24, false);
            camera.targetTexture = renderTexture;
            camera.Render();
            Graphics.Blit(renderTexture, resolvedTexture);
            RenderTexture.active = resolvedTexture;
            texture.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            texture.Apply();
            File.WriteAllBytes(path, texture.EncodeToPNG());
            camera.targetTexture = null;
            RenderTexture.active = null;
            UnityEngine.Object.DestroyImmediate(renderTexture);
            UnityEngine.Object.DestroyImmediate(resolvedTexture);
            UnityEngine.Object.DestroyImmediate(texture);
        }

        private readonly struct CharacterDefinition
        {
            public CharacterDefinition(string name, string assetPath, Vector3 position)
            {
                Name = name;
                AssetPath = assetPath;
                Position = position;
            }

            public string Name { get; }
            public string AssetPath { get; }
            public Vector3 Position { get; }
        }
    }
}
#endif
