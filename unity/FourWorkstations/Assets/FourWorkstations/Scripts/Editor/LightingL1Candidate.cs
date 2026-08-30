#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FourWorkstations.Office;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

namespace FourWorkstations.Editor
{
    public static class LightingL1Candidate
    {
        private const string SourceScene = "Assets/FourWorkstations/Scenes/Office/Office.unity";
        private const string CandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1_Daylight_Candidate.unity";
        private const string SettingsAsset = "Assets/FourWorkstations/Settings/L1_Daylight_Candidate_Lighting.asset";
        private const string ReferenceCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1R_Blender_Reference_Candidate.unity";
        private const string ReferenceSettingsAsset = "Assets/FourWorkstations/Settings/L1R_Blender_Reference_Candidate_Lighting.asset";
        private const string SurfaceFixCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1RA_Surface_Fix_Candidate.unity";
        private const string SurfaceFixMeshRoot = "Assets/FourWorkstations/Art/Environment/Candidates/L1RA_UV";
        private const string DeskFidelityCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1RB_Desk_Fidelity_Candidate.unity";
        private const string FineMatchCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1RC_Figure3_Fine_Match_Candidate.unity";
        private const string FineMatchSettingsAsset = "Assets/FourWorkstations/Settings/L1RC_Figure3_Fine_Match_Lighting.asset";
        private const string FinalCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_L1R_Final_High_Quality_Candidate.unity";
        private const string FinalSettingsAsset = "Assets/FourWorkstations/Settings/L1R_Final_High_Quality_Lighting.asset";
        private const string NightCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_N1_Night_Lighting_Candidate.unity";
        private const string NightSettingsAsset = "Assets/FourWorkstations/Settings/N1_Night_Lighting_Candidate.asset";
        private const string NightRefinedCandidateScene = "Assets/FourWorkstations/Scenes/Candidates/Office_N1R_Night_Refined_Candidate.unity";
        private const string NightRefinedSettingsAsset = "Assets/FourWorkstations/Settings/N1R_Night_Refined_Candidate.asset";

        [MenuItem("Four Workstations/Lighting L1/Build Candidate")]
        public static void BuildCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1");
            Directory.CreateDirectory(output);

            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            RestoreSourceBaseline(source);
            ForceDayAndCapture(Path.Combine(output, "01-before-day.png"));

            Directory.CreateDirectory(Path.GetDirectoryName(Path.Combine(Application.dataPath, "FourWorkstations/Scenes/Candidates/placeholder"))!);
            EditorSceneManager.SaveScene(source, CandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing");
            var staticRenderers = office.GetComponentsInChildren<MeshRenderer>(true);
            foreach (var renderer in staticRenderers)
            {
                var flags = GameObjectUtility.GetStaticEditorFlags(renderer.gameObject);
                flags |= StaticEditorFlags.ContributeGI | StaticEditorFlags.ReflectionProbeStatic;
                GameObjectUtility.SetStaticEditorFlags(renderer.gameObject, flags);
                renderer.receiveGI = ReceiveGI.Lightmaps;
                renderer.receiveShadows = true;
                renderer.scaleInLightmap = 1f;
            }

            var sunObject = GameObject.Find("DayDirectionalLight");
            if (sunObject == null) throw new InvalidOperationException("DayDirectionalLight missing");
            var sun = sunObject.GetComponent<Light>();
            sun.lightmapBakeType = LightmapBakeType.Mixed;
            sun.shadows = LightShadows.Soft;

            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(SettingsAsset);
            if (settings == null)
            {
                settings = new LightingSettings();
                AssetDatabase.CreateAsset(settings, SettingsAsset);
            }
            settings.bakedGI = true;
            settings.realtimeGI = false;
            settings.lightmapper = LightingSettings.Lightmapper.ProgressiveCPU;
            settings.mixedBakeMode = MixedLightingMode.Shadowmask;
            settings.directionalityMode = LightmapsMode.CombinedDirectional;
            settings.lightmapMaxSize = 4096;
            settings.lightmapPadding = 8;
            settings.lightmapResolution = 24f;
            settings.directSampleCount = 32;
            settings.indirectSampleCount = 64;
            settings.environmentSampleCount = 32;
            settings.maxBounces = 2;
            settings.ao = true;
            settings.aoMaxDistance = 1.25f;
            settings.aoExponentDirect = 0.65f;
            settings.aoExponentIndirect = 0.8f;
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log($"[LightingL1] BAKE_START renderers={staticRenderers.Length} maxSize=4096 padding=8 resolution=24 direct=32 indirect=64 environment=32 bounces=2");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1 bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();

            ForceDayAndCapture(Path.Combine(output, "02-after-day-candidate.png"));
            Debug.Log($"[LightingL1] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} output={output}");
        }

        public static void ValidateCandidate()
        {
            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            var sourceTransforms = ReadTransformSignature(source).Where(item => !item.StartsWith("DayDirectionalLight|", StringComparison.Ordinal)).ToList();
            var sourceCamera = ReadCameraSignature();
            var sourceMaterials = ReadOfficeMaterialSignature();

            var candidate = EditorSceneManager.OpenScene(CandidateScene, OpenSceneMode.Single);
            var candidateTransforms = ReadTransformSignature(candidate);
            var candidateCamera = ReadCameraSignature();
            var candidateMaterials = ReadOfficeMaterialSignature();

            if (!sourceTransforms.SequenceEqual(candidateTransforms)) throw new InvalidOperationException("Candidate transforms differ from source");
            if (sourceCamera != candidateCamera) throw new InvalidOperationException("Candidate camera differs from source");
            if (!sourceMaterials.SequenceEqual(candidateMaterials)) throw new InvalidOperationException("Candidate materials differ from source");
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException($"Expected one candidate lightmap, got {LightmapSettings.lightmaps.Length}");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("Expected 45 baked Light Probes");

            var characters = new[] { "Ming", "Hong", "Jie", "Qixi" };
            foreach (var characterName in characters)
            {
                var character = GameObject.Find(characterName);
                if (character == null) throw new InvalidOperationException($"Character missing: {characterName}");
                foreach (var renderer in character.GetComponentsInChildren<SkinnedMeshRenderer>(true))
                    if (renderer.lightProbeUsage != LightProbeUsage.BlendProbes)
                        throw new InvalidOperationException($"{characterName} is not using BlendProbes");
            }
            Debug.Log($"[LightingL1] VALIDATION_PASS transforms={sourceTransforms.Count} materials={sourceMaterials.Count} lightmaps=1 probes=45 characters=4 camera=unchanged");
        }

        public static void RestoreSourceOnly()
        {
            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            RestoreSourceBaseline(source);
            Debug.Log("[LightingL1] SOURCE_BASELINE_RESTORED lightingData=none staticGI=off sun=realtime");
        }

        public static void CaptureSourceDayForReference()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1r");
            Directory.CreateDirectory(output);
            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            RestoreSourceBaseline(source);
            ForceDayAndCapture(Path.Combine(output, "00-source-baseline-day.png"));
            Debug.Log("[LightingL1R] SOURCE_CAPTURE_PASS");
        }

        [MenuItem("Four Workstations/Lighting L1R/Build Blender Reference Candidate")]
        public static void BuildReferenceCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1r");
            Directory.CreateDirectory(output);

            EditorSceneManager.OpenScene(CandidateScene, OpenSceneMode.Single);
            ForceDayAndCapture(Path.Combine(output, "01-before-failed-l1.png"));

            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            RestoreSourceBaseline(source);
            var sourceDeskAppearance = ReadDeskAppearanceSignature();
            Directory.CreateDirectory(Path.GetDirectoryName(Path.Combine(Application.dataPath, "FourWorkstations/Scenes/Candidates/placeholder"))!);
            EditorSceneManager.SaveScene(source, ReferenceCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing");
            var staticRenderers = office.GetComponentsInChildren<MeshRenderer>(true);
            foreach (var renderer in staticRenderers)
            {
                var flags = GameObjectUtility.GetStaticEditorFlags(renderer.gameObject);
                flags |= StaticEditorFlags.ContributeGI | StaticEditorFlags.ReflectionProbeStatic;
                GameObjectUtility.SetStaticEditorFlags(renderer.gameObject, flags);
                renderer.receiveGI = ReceiveGI.Lightmaps;
                renderer.receiveShadows = true;
                renderer.scaleInLightmap = 1f;
            }

            var sun = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (sun == null) throw new InvalidOperationException("DayDirectionalLight missing");
            sun.transform.rotation = Quaternion.LookRotation(new Vector3(-0.65f, -0.58f, -0.49f).normalized, Vector3.up);
            sun.color = new Color(1f, 0.93f, 0.82f);
            sun.intensity = 1.55f;
            sun.lightmapBakeType = LightmapBakeType.Mixed;
            sun.shadows = LightShadows.Soft;
            sun.shadowStrength = 0.86f;
            sun.shadowAngle = 2.2f;
            sun.shadowBias = 0.045f;
            sun.shadowNormalBias = 0.24f;

            var dayNight = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (dayNight == null) throw new InvalidOperationException("DayNightController missing");
            var dayNightSerialized = new SerializedObject(dayNight);
            dayNightSerialized.FindProperty("daySky").colorValue = new Color(0.46f, 0.48f, 0.48f);
            dayNightSerialized.FindProperty("dayEquator").colorValue = new Color(0.29f, 0.29f, 0.27f);
            dayNightSerialized.FindProperty("dayGround").colorValue = new Color(0.13f, 0.12f, 0.105f);
            dayNightSerialized.FindProperty("daySun").colorValue = sun.color;
            dayNightSerialized.FindProperty("dayIntensity").floatValue = sun.intensity;
            dayNightSerialized.ApplyModifiedPropertiesWithoutUndo();
            dayNight.SetNight(false);

            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(ReferenceSettingsAsset);
            if (settings == null)
            {
                settings = new LightingSettings();
                AssetDatabase.CreateAsset(settings, ReferenceSettingsAsset);
            }
            settings.bakedGI = true;
            settings.realtimeGI = false;
            settings.lightmapper = LightingSettings.Lightmapper.ProgressiveCPU;
            settings.mixedBakeMode = MixedLightingMode.IndirectOnly;
            settings.directionalityMode = LightmapsMode.CombinedDirectional;
            settings.lightmapMaxSize = 4096;
            settings.lightmapPadding = 8;
            settings.lightmapResolution = 24f;
            settings.directSampleCount = 48;
            settings.indirectSampleCount = 64;
            settings.environmentSampleCount = 24;
            settings.maxBounces = 2;
            settings.indirectScale = 0.58f;
            settings.albedoBoost = 0.9f;
            settings.ao = true;
            settings.aoMaxDistance = 0.65f;
            settings.aoExponentDirect = 0.22f;
            settings.aoExponentIndirect = 0.3f;
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            if (!sourceDeskAppearance.SequenceEqual(ReadDeskAppearanceSignature()))
                throw new InvalidOperationException("Desk material appearance changed before bake");
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[LightingL1R] BAKE_START mixed=IndirectOnly ray=(-0.65,-0.58,-0.49) intensity=1.55 color=(1.00,0.93,0.82) shadowAngle=2.2 indirectScale=0.58 ambient=(0.46/0.29/0.13) direct=48 indirect=64 environment=24");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1R bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            if (!sourceDeskAppearance.SequenceEqual(ReadDeskAppearanceSignature()))
                throw new InvalidOperationException("Desk material appearance changed after bake");
            ForceDayAndCapture(Path.Combine(output, "02-after-l1r-candidate.png"));
            Debug.Log($"[LightingL1R] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} deskMaterial=unchanged output={output}");
        }

        public static void ValidateReferenceCandidate()
        {
            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            var sourceTransforms = ReadTransformSignature(source).Where(item => !item.StartsWith("DayDirectionalLight|", StringComparison.Ordinal)).ToList();
            var sourceCamera = ReadCameraSignature();
            var sourceMaterials = ReadOfficeMaterialSignature();
            var sourceDeskAppearance = ReadDeskAppearanceSignature();

            var candidate = EditorSceneManager.OpenScene(ReferenceCandidateScene, OpenSceneMode.Single);
            var candidateTransforms = ReadTransformSignature(candidate).Where(item => !item.StartsWith("DayDirectionalLight|", StringComparison.Ordinal)).ToList();
            if (!sourceTransforms.SequenceEqual(candidateTransforms))
            {
                var sourceOnly = sourceTransforms.Except(candidateTransforms).Take(8);
                var candidateOnly = candidateTransforms.Except(sourceTransforms).Take(8);
                throw new InvalidOperationException($"L1R non-light transforms differ from source; sourceOnly={string.Join(";", sourceOnly)} candidateOnly={string.Join(";", candidateOnly)}");
            }
            if (sourceCamera != ReadCameraSignature()) throw new InvalidOperationException("L1R camera differs from source");
            if (!sourceMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("L1R material assignments differ from source");
            if (!sourceDeskAppearance.SequenceEqual(ReadDeskAppearanceSignature())) throw new InvalidOperationException("L1R desk appearance properties differ from source");
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException($"Expected one L1R lightmap, got {LightmapSettings.lightmaps.Length}");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("Expected 45 L1R baked Light Probes");
            var office = GameObject.Find("Office_R5_Final");
            foreach (var renderer in office.GetComponentsInChildren<MeshRenderer>(true).Where(item => item.name.Contains("Runtime_Desks", StringComparison.Ordinal)))
            {
                var slots = string.Join(",", renderer.sharedMaterials.Select(material =>
                {
                    if (material == null) return "null";
                    var color = material.HasProperty("_BaseColor") ? material.GetColor("_BaseColor") : Color.white;
                    return $"{material.name}:{color}";
                }));
                Debug.Log($"[LightingL1R] DESK renderer={renderer.name} receiveGI={renderer.receiveGI} lightmapIndex={renderer.lightmapIndex} scaleOffset={renderer.lightmapScaleOffset} slots={slots}");
            }
            Debug.Log($"[LightingL1R] VALIDATION_PASS transforms={sourceTransforms.Count} materials={sourceMaterials.Count} deskAppearance={sourceDeskAppearance.Count} lightmaps=1 probes=45 camera=unchanged");
        }

        public static void DiagnosePermanentSurfaceArtifacts()
        {
            EditorSceneManager.OpenScene(ReferenceCandidateScene, OpenSceneMode.Single);
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing");
            foreach (var renderer in office.GetComponentsInChildren<MeshRenderer>(true).OrderBy(item => item.name, StringComparer.Ordinal))
            {
                var filter = renderer.GetComponent<MeshFilter>();
                var mesh = filter == null ? null : filter.sharedMesh;
                var uv = mesh == null ? Array.Empty<Vector2>() : mesh.uv2;
                var min = new Vector2(float.PositiveInfinity, float.PositiveInfinity);
                var max = new Vector2(float.NegativeInfinity, float.NegativeInfinity);
                var outOfRange = 0;
                foreach (var value in uv)
                {
                    min = Vector2.Min(min, value);
                    max = Vector2.Max(max, value);
                    if (value.x < 0f || value.x > 1f || value.y < 0f || value.y > 1f) outOfRange++;
                }
                var slots = string.Join(",", renderer.sharedMaterials.Select(material => material == null ? "null" : material.name));
                Debug.Log($"[LightingL1RA] SURFACE name={renderer.name} bounds={renderer.bounds.center}/{renderer.bounds.size} lightmap={renderer.lightmapIndex} scaleOffset={renderer.lightmapScaleOffset} receiveGI={renderer.receiveGI} verts={(mesh == null ? 0 : mesh.vertexCount)} uv1={uv.Length} uvMin={min} uvMax={max} uvOut={outOfRange} materials={slots}");
            }
            Debug.Log($"[LightingL1RA] DIAG_PASS lightmaps={LightmapSettings.lightmaps.Length}");
        }

        public static void DiagnoseDeskMaterialFidelity()
        {
            EditorSceneManager.OpenScene(SurfaceFixCandidateScene, OpenSceneMode.Single);
            var renderer = GameObject.Find("Office_R5_Final")?.GetComponentsInChildren<MeshRenderer>(true)
                .FirstOrDefault(item => item.name == "Runtime_Desks");
            if (renderer == null) throw new InvalidOperationException("Runtime_Desks missing");
            var mesh = renderer.GetComponent<MeshFilter>().sharedMesh;
            var vertices = mesh.vertices;
            for (var submesh = 0; submesh < mesh.subMeshCount; submesh++)
            {
                var indices = mesh.GetTriangles(submesh);
                var upwardArea = 0f;
                var upwardTriangles = 0;
                for (var index = 0; index < indices.Length; index += 3)
                {
                    var a = vertices[indices[index]];
                    var b = vertices[indices[index + 1]];
                    var c = vertices[indices[index + 2]];
                    var cross = Vector3.Cross(b - a, c - a);
                    var area = cross.magnitude * 0.5f;
                    var normal = cross.normalized;
                    var centerY = (a.y + b.y + c.y) / 3f;
                    if (normal.y > 0.85f && centerY > 0.55f)
                    {
                        upwardArea += area;
                        upwardTriangles++;
                    }
                }
                var material = renderer.sharedMaterials[submesh];
                var baseColor = material.HasProperty("baseColorFactor") ? material.GetColor("baseColorFactor") : Color.clear;
                var metallic = material.HasProperty("metallicFactor") ? material.GetFloat("metallicFactor") : -1f;
                var roughness = material.HasProperty("roughnessFactor") ? material.GetFloat("roughnessFactor") : -1f;
                Debug.Log($"[LightingL1RB] SUBMESH index={submesh} topTris={upwardTriangles} topArea={upwardArea:R} material={material.name} shader={material.shader.name} base={baseColor:R} metallic={metallic:R} roughness={roughness:R}");
            }
            Debug.Log("[LightingL1RB] DIAG_PASS");
        }

        [MenuItem("Four Workstations/Lighting L1R-B/Build Desk Fidelity Candidate")]
        public static void BuildDeskFidelityCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1rb");
            Directory.CreateDirectory(output);
            var source = EditorSceneManager.OpenScene(SurfaceFixCandidateScene, OpenSceneMode.Single);
            ForceDayAndCapture(Path.Combine(output, "01-before-dark-desks.png"));
            EditorSceneManager.SaveScene(source, DeskFidelityCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var renderer = GameObject.Find("Office_R5_Final")?.GetComponentsInChildren<MeshRenderer>(true)
                .FirstOrDefault(item => item.name == "Runtime_Desks");
            if (renderer == null) throw new InvalidOperationException("Runtime_Desks missing");
            var wood = AssetDatabase.LoadAssetAtPath<Material>("Assets/FourWorkstations/Art/Materials/VF1_mat_wood.mat");
            var metal = AssetDatabase.LoadAssetAtPath<Material>("Assets/FourWorkstations/Art/Materials/VF1_mat_metal.mat");
            var dark = AssetDatabase.LoadAssetAtPath<Material>("Assets/FourWorkstations/Art/Materials/VF1_mat_dark.mat");
            if (wood == null || metal == null || dark == null) throw new InvalidOperationException("Desk fidelity materials missing");
            renderer.sharedMaterials = new[] { wood, metal, dark };
            Debug.Log("[LightingL1RB] MATERIAL_FIX Runtime_Desks slots old=[metal,wood,counter] new=[wood,metal,dark]");

            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(ReferenceSettingsAsset);
            if (settings == null) throw new InvalidOperationException("L1R lighting settings missing");
            Lightmapping.SetLightingSettingsForScene(scene, settings);
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[LightingL1RB] BAKE_START lighting=unchanged deskMaterialSlots=corrected");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1R-B bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            ForceDayAndCapture(Path.Combine(output, "02-after-desk-fidelity.png"));
            Debug.Log($"[LightingL1RB] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} output={output}");
        }

        [MenuItem("Four Workstations/Lighting L1R-C/Build Figure 3 Fine Match Candidate")]
        public static void BuildFigure3FineMatchCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1rc");
            Directory.CreateDirectory(output);

            var source = EditorSceneManager.OpenScene(DeskFidelityCandidateScene, OpenSceneMode.Single);
            var frozenTransforms = ReadTransformSignature(source);
            var frozenCamera = ReadCameraSignature();
            var frozenMaterials = ReadOfficeMaterialSignature();
            var frozenGeometry = ReadTargetGeometry(new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            });
            ForceDayAndCapture(Path.Combine(output, "01-before-l1rb.png"));
            EditorSceneManager.SaveScene(source, FineMatchCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var sun = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (sun == null) throw new InvalidOperationException("DayDirectionalLight missing");
            sun.color = new Color(1f, 0.975f, 0.94f);
            sun.intensity = 1.38f;

            var dayNight = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (dayNight == null) throw new InvalidOperationException("DayNightController missing");
            var dayNightSerialized = new SerializedObject(dayNight);
            dayNightSerialized.FindProperty("daySky").colorValue = new Color(0.49f, 0.50f, 0.50f);
            dayNightSerialized.FindProperty("dayEquator").colorValue = new Color(0.33f, 0.33f, 0.32f);
            dayNightSerialized.FindProperty("dayGround").colorValue = new Color(0.16f, 0.16f, 0.155f);
            dayNightSerialized.FindProperty("daySun").colorValue = sun.color;
            dayNightSerialized.FindProperty("dayIntensity").floatValue = sun.intensity;
            dayNightSerialized.ApplyModifiedPropertiesWithoutUndo();
            dayNight.SetNight(false);

            var referenceSettings = AssetDatabase.LoadAssetAtPath<LightingSettings>(ReferenceSettingsAsset);
            if (referenceSettings == null) throw new InvalidOperationException("L1R lighting settings missing");
            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(FineMatchSettingsAsset);
            if (settings == null)
            {
                settings = UnityEngine.Object.Instantiate(referenceSettings);
                settings.name = "L1RC_Figure3_Fine_Match_Lighting";
                AssetDatabase.CreateAsset(settings, FineMatchSettingsAsset);
            }
            EditorUtility.CopySerialized(referenceSettings, settings);
            settings.name = "L1RC_Figure3_Fine_Match_Lighting";
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            if (!frozenTransforms.SequenceEqual(ReadTransformSignature(scene))) throw new InvalidOperationException("L1R-C changed a frozen transform");
            if (frozenCamera != ReadCameraSignature()) throw new InvalidOperationException("L1R-C changed the camera");
            if (!frozenMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("L1R-C changed a material assignment");
            var candidateGeometry = ReadTargetGeometry(new HashSet<string>(frozenGeometry.Keys, StringComparer.Ordinal));
            foreach (var name in frozenGeometry.Keys)
                if (!frozenGeometry[name].SequenceEqual(candidateGeometry[name])) throw new InvalidOperationException($"L1R-C changed geometry for {name}");

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[LightingL1RC] BAKE_START ray=unchanged intensity=1.55->1.38 color=(1,.93,.82)->(1,.975,.94) ambientSky=(.46,.48,.48)->(.49,.50,.50) ambientEquator=(.29,.29,.27)->(.33,.33,.32) ambientGround=(.13,.12,.105)->(.16,.16,.155) shadows=unchanged bakeQuality=unchanged");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1R-C bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            ForceDayAndCapture(Path.Combine(output, "02-after-l1rc-candidate.png"));
            Debug.Log($"[LightingL1RC] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} transforms=camera=materials=geometry=unchanged output={output}");
        }

        public static void CaptureFigure3FineMatchCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1rc");
            Directory.CreateDirectory(output);
            EditorSceneManager.OpenScene(FineMatchCandidateScene, OpenSceneMode.Single);
            ForceDayAndCapture(Path.Combine(output, "02-after-l1rc-candidate.png"));
            Debug.Log("[LightingL1RC] CAPTURE_PASS resolution=1920x1080 msaa=4x");
        }

        [MenuItem("Four Workstations/Lighting L1R-FINAL/Build High Quality Candidate")]
        public static void BuildFinalHighQualityCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1r-final");
            Directory.CreateDirectory(output);

            var source = EditorSceneManager.OpenScene(FineMatchCandidateScene, OpenSceneMode.Single);
            var frozenTransforms = ReadTransformSignature(source);
            var frozenCamera = ReadCameraSignature();
            var frozenMaterials = ReadOfficeMaterialSignature();
            var frozenSun = ReadSunSignature();
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var frozenGeometry = ReadTargetGeometry(targets);
            var frozenDeskMesh = ReadDeskMeshSignature();
            ForceDayAndCapture(Path.Combine(output, "01-approved-l1rc.png"));
            EditorSceneManager.SaveScene(source, FinalCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var referenceSettings = AssetDatabase.LoadAssetAtPath<LightingSettings>(FineMatchSettingsAsset);
            if (referenceSettings == null) throw new InvalidOperationException("L1R-C lighting settings missing");
            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(FinalSettingsAsset);
            if (settings == null)
            {
                settings = UnityEngine.Object.Instantiate(referenceSettings);
                settings.name = "L1R_Final_High_Quality_Lighting";
                AssetDatabase.CreateAsset(settings, FinalSettingsAsset);
            }
            EditorUtility.CopySerialized(referenceSettings, settings);
            settings.name = "L1R_Final_High_Quality_Lighting";
            settings.directSampleCount = 256;
            settings.indirectSampleCount = 256;
            settings.environmentSampleCount = 256;
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            if (!frozenTransforms.SequenceEqual(ReadTransformSignature(scene))) throw new InvalidOperationException("L1R-FINAL changed a frozen transform");
            if (frozenCamera != ReadCameraSignature()) throw new InvalidOperationException("L1R-FINAL changed the camera");
            if (!frozenMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("L1R-FINAL changed a material assignment");
            if (frozenSun != ReadSunSignature()) throw new InvalidOperationException("L1R-FINAL changed an artistic sun setting");
            if (frozenDeskMesh != ReadDeskMeshSignature()) throw new InvalidOperationException("L1R-FINAL changed G1B desk geometry or UV1");
            var candidateGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
                if (!frozenGeometry[name].SequenceEqual(candidateGeometry[name])) throw new InvalidOperationException($"L1R-FINAL changed geometry for {name}");

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[LightingL1RFINAL] BAKE_START artisticSettings=frozen direct=256 indirect=256 environment=256 maxSize=4096 padding=8 resolution=24 bounces=2");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1R-FINAL bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException("L1R-FINAL expected one lightmap");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("L1R-FINAL expected 45 Light Probes");
            ForceDayAndCapture(Path.Combine(output, "02-final-high-quality.png"));
            Debug.Log($"[LightingL1RFINAL] CANDIDATE_PASS lightmaps=1 probes=45 transforms=camera=materials=geometry=uv1=sun unchanged output={output}");
        }

        [MenuItem("Four Workstations/Lighting L1R-FINAL/Promote Candidate To Office")]
        public static void PromoteFinalCandidateToOffice()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1r-final-promotion");
            Directory.CreateDirectory(output);

            var candidate = EditorSceneManager.OpenScene(FinalCandidateScene, OpenSceneMode.Single);
            var candidateTransforms = ReadTransformSignature(candidate);
            var candidateCamera = ReadCameraSignature();
            var candidateMaterials = ReadOfficeMaterialSignature();
            var candidateSun = ReadSunSignature();
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var candidateGeometry = ReadTargetGeometry(targets);
            var candidateDeskMesh = ReadDeskMeshSignature();
            ForceDayAndCapture(Path.Combine(output, "01-final-candidate.png"));

            var candidatePath = Path.GetFullPath(Path.Combine(Application.dataPath, "..", FinalCandidateScene));
            var officePath = Path.GetFullPath(Path.Combine(Application.dataPath, "..", SourceScene));
            File.Copy(candidatePath, officePath, true);
            AssetDatabase.ImportAsset(SourceScene, ImportAssetOptions.ForceUpdate);

            var office = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            if (!candidateTransforms.SequenceEqual(ReadTransformSignature(office))) throw new InvalidOperationException("Promoted Office transforms differ from Final Candidate");
            if (candidateCamera != ReadCameraSignature()) throw new InvalidOperationException("Promoted Office camera differs from Final Candidate");
            if (!candidateMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("Promoted Office materials differ from Final Candidate");
            if (candidateSun != ReadSunSignature()) throw new InvalidOperationException("Promoted Office sun differs from Final Candidate");
            if (candidateDeskMesh != ReadDeskMeshSignature()) throw new InvalidOperationException("Promoted Office desk geometry or UV1 differs from Final Candidate");
            var officeGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
                if (!candidateGeometry[name].SequenceEqual(officeGeometry[name])) throw new InvalidOperationException($"Promoted Office geometry differs for {name}");
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException("Promoted Office expected one lightmap");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("Promoted Office expected 45 Light Probes");
            ForceDayAndCapture(Path.Combine(output, "02-production-office.png"));
            Debug.Log("[LightingL1RFINAL] PROMOTION_PASS sceneContent=identical transforms=camera=materials=geometry=uv1=sun unchanged lightmaps=1 probes=45");
        }

        [MenuItem("Four Workstations/Night Lighting N1/Build Candidate")]
        public static void BuildNightCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-night-lighting-n1");
            Directory.CreateDirectory(output);

            var source = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            var frozenCamera = ReadCameraSignature();
            var frozenMaterials = ReadOfficeMaterialSignature();
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var frozenGeometry = ReadTargetGeometry(targets);
            var frozenDeskMesh = ReadDeskMeshSignature();
            EditorSceneManager.SaveScene(source, NightCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var dayNight = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (dayNight == null) throw new InvalidOperationException("DayNightController missing");
            var serialized = new SerializedObject(dayNight);
            serialized.FindProperty("nightSky").colorValue = new Color(0.18f, 0.22f, 0.29f);
            serialized.FindProperty("nightEquator").colorValue = new Color(0.11f, 0.13f, 0.17f);
            serialized.FindProperty("nightGround").colorValue = new Color(0.055f, 0.065f, 0.085f);
            serialized.FindProperty("nightSun").colorValue = new Color(0.48f, 0.58f, 0.76f);
            serialized.FindProperty("nightIntensity").floatValue = 0.16f;
            serialized.ApplyModifiedPropertiesWithoutUndo();

            var lights = GameObject.Find("NightWorkstationLights")?.GetComponentsInChildren<Light>(true)
                .OrderBy(light => light.name, StringComparer.Ordinal).ToArray();
            if (lights == null || lights.Length != 4) throw new InvalidOperationException("Expected four workstation lights");
            foreach (var light in lights)
            {
                light.type = LightType.Spot;
                light.color = new Color(1f, 0.78f, 0.58f);
                light.intensity = 4.5f;
                light.range = 3.2f;
                light.spotAngle = 64f;
                light.innerSpotAngle = 34f;
                light.shadows = LightShadows.Soft;
                light.shadowStrength = 0.38f;
                light.shadowBias = 0.05f;
                light.shadowNormalBias = 0.28f;
                light.lightmapBakeType = LightmapBakeType.Mixed;
            }
            var sun = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (sun == null) throw new InvalidOperationException("DayDirectionalLight missing");
            sun.lightmapBakeType = LightmapBakeType.Mixed;
            dayNight.SetNight(true);

            var referenceSettings = AssetDatabase.LoadAssetAtPath<LightingSettings>(FinalSettingsAsset);
            if (referenceSettings == null) throw new InvalidOperationException("Final Day lighting settings missing");
            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(NightSettingsAsset);
            if (settings == null)
            {
                settings = UnityEngine.Object.Instantiate(referenceSettings);
                settings.name = "N1_Night_Lighting_Candidate";
                AssetDatabase.CreateAsset(settings, NightSettingsAsset);
            }
            EditorUtility.CopySerialized(referenceSettings, settings);
            settings.name = "N1_Night_Lighting_Candidate";
            settings.directSampleCount = 64;
            settings.indirectSampleCount = 96;
            settings.environmentSampleCount = 64;
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            if (frozenCamera != ReadCameraSignature()) throw new InvalidOperationException("N1 changed the frozen camera");
            if (!frozenMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("N1 changed a material assignment");
            if (frozenDeskMesh != ReadDeskMeshSignature()) throw new InvalidOperationException("N1 changed G1B desk geometry or UV1");
            var candidateGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
                if (!frozenGeometry[name].SequenceEqual(candidateGeometry[name])) throw new InvalidOperationException($"N1 changed geometry for {name}");

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[NightN1] BAKE_START ambient=(.18,.22,.29)/(.11,.13,.17)/(.055,.065,.085) moonColor=(.48,.58,.76) moonIntensity=.16 workstationSpots=4 color=(1,.78,.58) intensity=4.5 range=3.2 angle=64 inner=34 shadows=soft/.38 samples=64/96/64");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Night N1 bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            dayNight.SetNight(true);
            ForceNightAndCapture(Path.Combine(output, "01-night-candidate.png"));
            Debug.Log($"[NightN1] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} camera=materials=geometry=uv1 unchanged lights=4 output={output}");
        }

        [MenuItem("Four Workstations/Night Lighting N1R/Build Refined Candidate")]
        public static void BuildNightRefinedCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-night-lighting-n1r");
            Directory.CreateDirectory(output);

            var source = EditorSceneManager.OpenScene(NightCandidateScene, OpenSceneMode.Single);
            var frozenTransforms = ReadTransformSignature(source);
            var frozenCamera = ReadCameraSignature();
            var frozenMaterials = ReadOfficeMaterialSignature();
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var frozenGeometry = ReadTargetGeometry(targets);
            var frozenDeskMesh = ReadDeskMeshSignature();
            ForceNightAndCapture(Path.Combine(output, "01-before-n1.png"));
            EditorSceneManager.SaveScene(source, NightRefinedCandidateScene, false);
            var scene = SceneManager.GetActiveScene();

            var dayNight = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (dayNight == null) throw new InvalidOperationException("DayNightController missing");
            var serialized = new SerializedObject(dayNight);
            serialized.FindProperty("nightSky").colorValue = new Color(0.20f, 0.23f, 0.28f);
            serialized.FindProperty("nightEquator").colorValue = new Color(0.13f, 0.145f, 0.17f);
            serialized.FindProperty("nightGround").colorValue = new Color(0.075f, 0.08f, 0.095f);
            serialized.FindProperty("nightSun").colorValue = new Color(0.58f, 0.66f, 0.80f);
            serialized.FindProperty("nightIntensity").floatValue = 0.20f;
            serialized.ApplyModifiedPropertiesWithoutUndo();
            dayNight.SetNight(true);
            var moon = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (moon == null) throw new InvalidOperationException("Night moon light missing");
            moon.shadows = LightShadows.None;

            var referenceSettings = AssetDatabase.LoadAssetAtPath<LightingSettings>(NightSettingsAsset);
            if (referenceSettings == null) throw new InvalidOperationException("N1 lighting settings missing");
            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(NightRefinedSettingsAsset);
            if (settings == null)
            {
                settings = UnityEngine.Object.Instantiate(referenceSettings);
                settings.name = "N1R_Night_Refined_Candidate";
                AssetDatabase.CreateAsset(settings, NightRefinedSettingsAsset);
            }
            EditorUtility.CopySerialized(referenceSettings, settings);
            settings.name = "N1R_Night_Refined_Candidate";
            settings.directSampleCount = 256;
            settings.indirectSampleCount = 256;
            settings.environmentSampleCount = 256;
            settings.directionalityMode = LightmapsMode.NonDirectional;
            var settingsSerialized = new SerializedObject(settings);
            settingsSerialized.FindProperty("m_LightmapCompression").intValue = 0;
            settingsSerialized.FindProperty("m_PVRDenoiserTypeDirect").intValue = 0;
            settingsSerialized.FindProperty("m_PVRDenoiserTypeIndirect").intValue = 0;
            settingsSerialized.FindProperty("m_PVRDenoiserTypeAO").intValue = 0;
            settingsSerialized.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(settings);
            Lightmapping.SetLightingSettingsForScene(scene, settings);

            if (!frozenTransforms.SequenceEqual(ReadTransformSignature(scene))) throw new InvalidOperationException("N1R changed a frozen transform");
            if (frozenCamera != ReadCameraSignature()) throw new InvalidOperationException("N1R changed the frozen camera");
            if (!frozenMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("N1R changed a material assignment");
            if (frozenDeskMesh != ReadDeskMeshSignature()) throw new InvalidOperationException("N1R changed G1B desk geometry or UV1");
            var candidateGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
                if (!frozenGeometry[name].SequenceEqual(candidateGeometry[name])) throw new InvalidOperationException($"N1R changed geometry for {name}");

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[NightN1R] BAKE_START ambient=(.20,.23,.28)/(.13,.145,.17)/(.075,.08,.095) moonColor=(.58,.66,.80) moonIntensity=.20 moonShadows=off workstationSpots=unchanged samples=256/256/256 directionality=nonDirectional compression=none denoiser=none");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Night N1R bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            dayNight.SetNight(true);
            ForceNightAndCapture(Path.Combine(output, "02-after-n1r.png"));
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException("N1R expected one lightmap");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("N1R expected 45 Light Probes");
            Debug.Log("[NightN1R] PASS lightmaps=1 probes=45 transforms=camera=materials=geometry=uv1 unchanged workstationSpots=unchanged");
        }

        [MenuItem("Four Workstations/Lighting L1R-A/Build Surface Fix Candidate")]
        public static void BuildSurfaceFixCandidate()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-lighting-l1ra");
            Directory.CreateDirectory(output);

            var reference = EditorSceneManager.OpenScene(ReferenceCandidateScene, OpenSceneMode.Single);
            ForceDayAndCapture(Path.Combine(output, "01-before-wall-artifacts.png"));
            EditorSceneManager.SaveScene(reference, SurfaceFixCandidateScene, false);
            var scene = SceneManager.GetActiveScene();
            EnsureAssetFolder(SurfaceFixMeshRoot);

            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing");
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            foreach (var renderer in office.GetComponentsInChildren<MeshRenderer>(true).Where(item => targets.Contains(item.name)))
            {
                var filter = renderer.GetComponent<MeshFilter>();
                if (filter == null || filter.sharedMesh == null) throw new InvalidOperationException($"Mesh missing for {renderer.name}");
                var source = filter.sharedMesh;
                var sourceVertices = source.vertices;
                var sourceIndices = source.triangles;
                var sourceTrianglePositions = ReadTrianglePositionSignature(source);
                var sourceBounds = source.bounds;
                var clone = UnityEngine.Object.Instantiate(source);
                clone.name = source.name + "_L1RA_UV";
                UnwrapParam.SetDefaults(out var unwrap);
                unwrap.packMargin = 0.02f;
                unwrap.areaError = 0.08f;
                unwrap.angleError = 0.08f;
                if (!Unwrapping.GenerateSecondaryUVSet(clone, unwrap))
                    throw new InvalidOperationException($"UV1 generation failed for {renderer.name}");
                if (!sourceTrianglePositions.SequenceEqual(ReadTrianglePositionSignature(clone)) || sourceBounds != clone.bounds)
                    throw new InvalidOperationException($"Visible geometry changed while regenerating UV1 for {renderer.name}");
                var assetPath = $"{SurfaceFixMeshRoot}/{renderer.name}_L1RA_UV.asset";
                AssetDatabase.DeleteAsset(assetPath);
                AssetDatabase.CreateAsset(clone, assetPath);
                filter.sharedMesh = clone;
                Debug.Log($"[LightingL1RA] UV_FIXED name={renderer.name} verts={source.vertexCount}->{clone.vertexCount} tris={source.triangles.Length / 3}->{clone.triangles.Length / 3} bounds={clone.bounds}");
            }

            var settings = AssetDatabase.LoadAssetAtPath<LightingSettings>(ReferenceSettingsAsset);
            if (settings == null) throw new InvalidOperationException("L1R lighting settings missing");
            Lightmapping.SetLightingSettingsForScene(scene, settings);
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            Debug.Log("[LightingL1RA] BAKE_START lighting=unchanged priorityUV1=regenerated");
            if (!Lightmapping.Bake()) throw new InvalidOperationException("Lighting L1R-A bake failed");
            EditorSceneManager.SaveScene(scene);
            AssetDatabase.SaveAssets();
            ForceDayAndCapture(Path.Combine(output, "02-after-surface-fix.png"));
            Debug.Log($"[LightingL1RA] PASS lightmaps={LightmapSettings.lightmaps.Length} probes={(LightmapSettings.lightProbes == null ? 0 : LightmapSettings.lightProbes.count)} output={output}");
        }

        private static void EnsureAssetFolder(string path)
        {
            var parts = path.Split('/');
            var current = parts[0];
            for (var index = 1; index < parts.Length; index++)
            {
                var next = current + "/" + parts[index];
                if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, parts[index]);
                current = next;
            }
        }

        public static void ValidateSurfaceFixCandidate()
        {
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var reference = EditorSceneManager.OpenScene(ReferenceCandidateScene, OpenSceneMode.Single);
            var referenceTransforms = ReadTransformSignature(reference);
            var referenceCamera = ReadCameraSignature();
            var referenceMaterials = ReadOfficeMaterialSignature();
            var referenceSun = ReadSunSignature();
            var referenceGeometry = ReadTargetGeometry(targets);

            var candidate = EditorSceneManager.OpenScene(SurfaceFixCandidateScene, OpenSceneMode.Single);
            if (!referenceTransforms.SequenceEqual(ReadTransformSignature(candidate))) throw new InvalidOperationException("L1R-A transforms differ from L1R");
            if (referenceCamera != ReadCameraSignature()) throw new InvalidOperationException("L1R-A camera differs from L1R");
            if (!referenceMaterials.SequenceEqual(ReadOfficeMaterialSignature())) throw new InvalidOperationException("L1R-A materials differ from L1R");
            if (referenceSun != ReadSunSignature()) throw new InvalidOperationException("L1R-A sun differs from L1R");
            var candidateGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
            {
                if (!referenceGeometry[name].SequenceEqual(candidateGeometry[name]))
                    throw new InvalidOperationException($"L1R-A visible triangle geometry differs for {name}");
            }
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException("L1R-A expected one lightmap");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("L1R-A expected 45 probes");
            Debug.Log("[LightingL1RA] VALIDATION_PASS transforms=camera=materials=sun=unchanged triangles=arch+desks+dining+meeting unchanged lightmaps=1 probes=45");
        }

        public static void ValidateDeskFidelityCandidate()
        {
            var targets = new HashSet<string>(StringComparer.Ordinal)
            {
                "Runtime_Arch", "Runtime_Desks", "Runtime_DiningTable", "Runtime_MeetingTable",
            };
            var reference = EditorSceneManager.OpenScene(SurfaceFixCandidateScene, OpenSceneMode.Single);
            var referenceTransforms = ReadTransformSignature(reference);
            var referenceCamera = ReadCameraSignature();
            var referenceSun = ReadSunSignature();
            var referenceGeometry = ReadTargetGeometry(targets);
            var referenceNonDeskMaterials = ReadNonDeskMaterialSignature();
            var referenceDeskMesh = ReadDeskMeshSignature();

            var candidate = EditorSceneManager.OpenScene(DeskFidelityCandidateScene, OpenSceneMode.Single);
            if (!referenceTransforms.SequenceEqual(ReadTransformSignature(candidate))) throw new InvalidOperationException("L1R-B transforms differ from L1R-A");
            if (referenceCamera != ReadCameraSignature()) throw new InvalidOperationException("L1R-B camera differs from L1R-A");
            if (referenceSun != ReadSunSignature()) throw new InvalidOperationException("L1R-B sun differs from L1R-A");
            if (!referenceNonDeskMaterials.SequenceEqual(ReadNonDeskMaterialSignature())) throw new InvalidOperationException("L1R-B changed a non-desk material assignment");
            if (referenceDeskMesh != ReadDeskMeshSignature()) throw new InvalidOperationException("L1R-B changed G1B desk geometry or UV1");
            var candidateGeometry = ReadTargetGeometry(targets);
            foreach (var name in targets)
            {
                if (!referenceGeometry[name].SequenceEqual(candidateGeometry[name]))
                    throw new InvalidOperationException($"L1R-B visible triangle geometry differs for {name}");
            }
            var desk = GameObject.Find("Office_R5_Final")?.GetComponentsInChildren<MeshRenderer>(true)
                .FirstOrDefault(item => item.name == "Runtime_Desks");
            if (desk == null) throw new InvalidOperationException("Runtime_Desks missing during L1R-B validation");
            var expected = new[] { "VF1_mat_wood", "VF1_mat_metal", "VF1_mat_dark" };
            if (!desk.sharedMaterials.Select(material => material == null ? "null" : material.name).SequenceEqual(expected))
                throw new InvalidOperationException("L1R-B desk material slots are not [wood,metal,dark]");
            if (LightmapSettings.lightmaps.Length != 1) throw new InvalidOperationException("L1R-B expected one lightmap");
            if (LightmapSettings.lightProbes == null || LightmapSettings.lightProbes.count != 45) throw new InvalidOperationException("L1R-B expected 45 probes");
            Debug.Log("[LightingL1RB] VALIDATION_PASS onlyDeskMaterialSlotsChanged=true slots=[wood,metal,dark] transforms=camera=sun=unchanged geometry=unchanged deskUV1=unchanged nonDeskMaterials=unchanged lightmaps=1 probes=45");
        }

        private static List<string> ReadNonDeskMaterialSignature()
        {
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing during non-desk material validation");
            return office.GetComponentsInChildren<MeshRenderer>(true)
                .Where(renderer => renderer.name != "Runtime_Desks")
                .SelectMany(renderer => renderer.sharedMaterials.Select((material, slot) => $"{renderer.name}|{slot}|{(material == null ? "null" : AssetDatabase.GetAssetPath(material))}"))
                .OrderBy(value => value, StringComparer.Ordinal)
                .ToList();
        }

        private static string ReadDeskMeshSignature()
        {
            var renderer = GameObject.Find("Office_R5_Final")?.GetComponentsInChildren<MeshRenderer>(true)
                .FirstOrDefault(item => item.name == "Runtime_Desks");
            if (renderer == null) throw new InvalidOperationException("Runtime_Desks missing during mesh validation");
            var mesh = renderer.GetComponent<MeshFilter>()?.sharedMesh;
            if (mesh == null) throw new InvalidOperationException("Runtime_Desks mesh missing during validation");
            var uv = mesh.uv2;
            var uvSignature = string.Join(";", uv.Select(value => value.ToString("R")));
            return $"{AssetDatabase.GetAssetPath(mesh)}|{mesh.vertexCount}|{mesh.triangles.Length}|{uv.Length}|{uvSignature}";
        }

        private static string ReadSunSignature()
        {
            var sun = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (sun == null) throw new InvalidOperationException("DayDirectionalLight missing during validation");
            return $"{sun.transform.rotation:R}|{sun.color:R}|{sun.intensity:R}|{sun.shadowStrength:R}|{sun.shadowAngle:R}|{sun.shadowBias:R}|{sun.shadowNormalBias:R}";
        }

        private static Dictionary<string, List<string>> ReadTargetGeometry(HashSet<string> targets)
        {
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing during geometry validation");
            return office.GetComponentsInChildren<MeshRenderer>(true)
                .Where(renderer => targets.Contains(renderer.name))
                .ToDictionary(renderer => renderer.name, renderer => ReadTrianglePositionSignature(renderer.GetComponent<MeshFilter>().sharedMesh), StringComparer.Ordinal);
        }

        private static List<string> ReadTrianglePositionSignature(Mesh mesh)
        {
            var vertices = mesh.vertices;
            var indices = mesh.triangles;
            var result = new List<string>(indices.Length / 3);
            for (var index = 0; index < indices.Length; index += 3)
                result.Add($"{vertices[indices[index]]:R}|{vertices[indices[index + 1]]:R}|{vertices[indices[index + 2]]:R}");
            return result;
        }

        private static List<string> ReadTransformSignature(Scene scene)
        {
            var result = new List<string>();
            foreach (var root in scene.GetRootGameObjects().OrderBy(item => item.name, StringComparer.Ordinal))
                AddTransformSignature(root.transform, root.name, result);
            return result;
        }

        private static void AddTransformSignature(Transform transform, string path, List<string> result)
        {
            result.Add($"{path}|{transform.localPosition:R}|{transform.localRotation:R}|{transform.localScale:R}|{transform.gameObject.activeSelf}");
            var children = new List<Transform>();
            for (var i = 0; i < transform.childCount; i++) children.Add(transform.GetChild(i));
            foreach (var child in children.OrderBy(item => item.name, StringComparer.Ordinal))
                AddTransformSignature(child, path + "/" + child.name, result);
        }

        private static string ReadCameraSignature()
        {
            var camera = GameObject.Find("OfficeCamera")?.GetComponent<Camera>();
            if (camera == null) throw new InvalidOperationException("OfficeCamera missing during validation");
            return $"{camera.transform.position:R}|{camera.transform.rotation:R}|{camera.orthographic}|{camera.orthographicSize:R}|{camera.nearClipPlane:R}|{camera.farClipPlane:R}|{camera.allowMSAA}";
        }

        private static List<string> ReadOfficeMaterialSignature()
        {
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing during validation");
            return office.GetComponentsInChildren<MeshRenderer>(true)
                .SelectMany(renderer => renderer.sharedMaterials.Select(material => material == null ? "null" : AssetDatabase.GetAssetPath(material)))
                .OrderBy(path => path, StringComparer.Ordinal)
                .ToList();
        }

        private static List<string> ReadDeskAppearanceSignature()
        {
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing during desk validation");
            var result = new List<string>();
            foreach (var renderer in office.GetComponentsInChildren<MeshRenderer>(true).Where(item => item.name.Contains("Runtime_Desks", StringComparison.Ordinal)))
            foreach (var material in renderer.sharedMaterials)
            {
                if (material == null) continue;
                var color = material.HasProperty("_BaseColor") ? material.GetColor("_BaseColor") : Color.white;
                result.Add($"{AssetDatabase.GetAssetPath(material)}|{color:R}");
            }
            result.Sort(StringComparer.Ordinal);
            if (result.Count == 0) throw new InvalidOperationException("Runtime_Desks materials missing");
            return result;
        }

        private static void RestoreSourceBaseline(Scene scene)
        {
            Lightmapping.ClearLightingDataAsset();
            var office = GameObject.Find("Office_R5_Final");
            if (office == null) throw new InvalidOperationException("Office_R5_Final missing while restoring source baseline");
            foreach (var renderer in office.GetComponentsInChildren<MeshRenderer>(true))
            {
                var flags = GameObjectUtility.GetStaticEditorFlags(renderer.gameObject);
                flags &= ~(StaticEditorFlags.ContributeGI | StaticEditorFlags.ReflectionProbeStatic);
                GameObjectUtility.SetStaticEditorFlags(renderer.gameObject, flags);
            }
            var sun = GameObject.Find("DayDirectionalLight")?.GetComponent<Light>();
            if (sun == null) throw new InvalidOperationException("DayDirectionalLight missing while restoring source baseline");
            sun.lightmapBakeType = LightmapBakeType.Realtime;
            Lightmapping.SetLightingSettingsForScene(scene, null);
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene);
        }

        private static void ForceDayAndCapture(string path)
        {
            var controller = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (controller == null) throw new InvalidOperationException("DayNightController missing");
            controller.SetNight(false);
            var cameraObject = GameObject.Find("OfficeCamera");
            if (cameraObject == null) throw new InvalidOperationException("OfficeCamera missing");
            var camera = cameraObject.GetComponent<Camera>();
            Capture(camera, path);
        }

        private static void ForceNightAndCapture(string path)
        {
            var controller = UnityEngine.Object.FindFirstObjectByType<DayNightController>();
            if (controller == null) throw new InvalidOperationException("DayNightController missing");
            controller.SetNight(true);
            var cameraObject = GameObject.Find("OfficeCamera");
            if (cameraObject == null) throw new InvalidOperationException("OfficeCamera missing");
            Capture(cameraObject.GetComponent<Camera>(), path);
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
            var multisampled = new RenderTexture(descriptor);
            var resolved = new RenderTexture(width, height, 0, RenderTextureFormat.ARGB32);
            var image = new Texture2D(width, height, TextureFormat.RGB24, false);
            camera.targetTexture = multisampled;
            camera.Render();
            camera.Render();
            Graphics.Blit(multisampled, resolved);
            RenderTexture.active = resolved;
            image.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            image.Apply();
            File.WriteAllBytes(path, image.EncodeToPNG());
            camera.targetTexture = null;
            RenderTexture.active = null;
            UnityEngine.Object.DestroyImmediate(multisampled);
            UnityEngine.Object.DestroyImmediate(resolved);
            UnityEngine.Object.DestroyImmediate(image);
        }
    }
}
#endif
