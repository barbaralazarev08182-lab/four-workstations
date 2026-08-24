"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, PerspectiveCamera, Sphere, Vector3 } from "three";
import type { Group, Mesh, Object3D, Texture } from "three";
import type { MapControls } from "three-stdlib";
import { Vq1cHeroCornerRuntime, VQ1C_PBR_PATH, type Vq1cRuntimeDiagnostics } from "./Vq1cHeroCornerRuntime";
import {
  Vq1cFullOfficeRuntime, VQ1C_FULL_OFFICE_PBR_PATH,
  type Vq1cFullOfficeRuntimeDiagnostics,
} from "./Vq1cFullOfficeRuntime";
import { Vq1cCharacterQaScene, VQ1C_CHARACTER_QA_GLB_PATH } from "./Vq1cCharacterQaScene";
import { VQ1C_ENVIRONMENT_PRESETS, type Vq1cEnvironmentMode } from "@/lib/three/vq1cEnvironmentPresets";
import type { Vq1cRuntimeValidation } from "@/lib/three/validateVq1cRuntimeScene";
import type { Vq1cFullOfficeRuntimeValidation } from "@/lib/three/validateVq1cFullOfficeRuntime";

/* VP2-4A: official full-office orthographic camera contract (scene-config.ts OFFICE_CAMERA). */
const OFFICIAL_CAMERA = {
  position: [10.8, 11.8, 14.5] as const,
  target: [0, 0.8, 0] as const,
  zoom: 44,
  near: 0.1,
  far: 100,
};
/* Fixed detail camera framing the coffee corner (corner center + official offset, zoomed in). */
const COFFEE_DETAIL_CAMERA = {
  position: [10.0, 12.2, 9.05] as const,
  target: [-0.8, 1.2, -5.45] as const,
  zoom: 337,
  near: 0.1,
  far: 100,
};
/* Detail camera framing the desk1 / ming workstation (character QA). */
const CHARACTER_DETAIL_CAMERA = {
  position: [8.6, 11.8, 12.75] as const,
  target: [-2.2, 0.9, -1.75] as const,
  zoom: 130,
  near: 0.1,
  far: 100,
};

// Whitelist of GLB assets in public/models/vq1/
const GLB_WHITELIST = [
  { id: "vq1-pipeline-smoke", label: "VQ1 Pipeline Smoke Test", path: "/models/vq1/vq1-pipeline-smoke.glb" },
  { id: "vq1c-hero-corner", label: "VQ1C Hero Corner", path: "/models/vq1/vq1c-hero-corner.glb" },
  { id: "vq1c-hero-corner-pbr", label: "VQ-1C Hero Corner PBR", path: VQ1C_PBR_PATH },
  { id: "vq1c-officeworld-full-pbr", label: "VQ-1C Full OfficeWorld PBR", path: VQ1C_FULL_OFFICE_PBR_PATH },
  { id: "vq1c-character-qa", label: "VQ-1C Character QA (Final Office + 1)", path: VQ1C_CHARACTER_QA_GLB_PATH },
];

type LightingMode = "neutral" | "clear-day" | "overcast" | "rain-preview" | "night";
type BackgroundMode = "light-gray" | "dark-gray" | "warm-gray";

const LIGHTING_CONFIG: Record<LightingMode, { ambient: number; key: number; keyColor: string; envIntensity: number }> = {
  "neutral": { ambient: 0.35, key: 0.6, keyColor: "#ffffff", envIntensity: 0.3 },
  "clear-day": { ambient: 0.30, key: 0.9, keyColor: "#fff5e0", envIntensity: 0.5 },
  "overcast": { ambient: 0.45, key: 0.5, keyColor: "#e0e5ea", envIntensity: 0.4 },
  "rain-preview": { ambient: 0.25, key: 0.35, keyColor: "#c0c8d0", envIntensity: 0.25 },
  "night": { ambient: 0.12, key: 0.2, keyColor: "#8090a0", envIntensity: 0.15 },
};

const BACKGROUND_COLORS: Record<BackgroundMode, string> = {
  "light-gray": "#c8c8c8",
  "dark-gray": "#303030",
  "warm-gray": "#b8b0a8",
};

interface AssetStats {
  meshes: number;
  materials: number;
  triangles: number;
  textures: number;
}

function isUsableTex(value: unknown): value is Texture {
  return Boolean(value) && typeof value === "object" && "isTexture" in (value as object);
}

function computeAssetStats(root: Object3D): AssetStats {
  const meshSet = new Set<string>();
  const matSet = new Set<string>();
  const texSet = new Set<string>();
  let triangles = 0;

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    const geom = mesh.geometry;
    const index = geom.index;
    if (index) {
      triangles += index.count / 3;
    } else if (geom.attributes.position) {
      triangles += geom.attributes.position.count / 3;
    }

    if (mesh.name) meshSet.add(mesh.name);

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of materials) {
      if (!mat || !("name" in mat) || !mat.name) continue;
      matSet.add(mat.name);
      const m = mat as unknown as Record<string, unknown>;
      const slots = ["map", "roughnessMap", "metalnessMap", "normalMap", "emissiveMap", "aoMap", "alphaMap"] as const;
      for (const slot of slots) {
        const tex = m[slot];
        if (isUsableTex(tex) && tex.name) texSet.add(tex.name);
      }
    }
  });

  return {
    meshes: meshSet.size || 1,
    materials: matSet.size || 1,
    triangles: Math.max(triangles, 1),
    textures: texSet.size,
  };
}

interface AutoFitTarget {
  sphere: Sphere;
  center: Vector3;
  version: number;
}

/* VP2-4A: official orthographic camera composition (used for the full-office QA modes). */
function OfficialCamera({ target }: { target: readonly [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, target.join(",")]);
  return null;
}

/* VP2-4A: URL-driven self test — cycles the environment modes 10x and reports stability. */
interface Vp2QaSelfTestReport {
  cycles: number;
  sequence: string[];
  sceneUuidStable: boolean;
  cameraUuidStable: boolean;
  officeMeshCountStable: boolean;
  coffeeInstanceCount: number;
  lookdevMeshCount: number;
  materialsBefore: number;
  materialsAfter: number;
  geometriesBefore: number;
  geometriesAfter: number;
  texturesBefore: number;
  texturesAfter: number;
  glbRequests: number;
  lightmapRequests: number;
  manifestRequests: number;
  oldCoffeeRestoredAfterExit: boolean;
  lookdevHiddenAfterExit: boolean;
  allOk: boolean;
}

function Vp2QaSelfTest({
  enabled,
  setMode,
}: {
  enabled: boolean;
  setMode: (m: Vq1cEnvironmentMode) => void;
}) {
  const { gl } = useThree();
  const [report, setReport] = useState<Vp2QaSelfTestReport | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return;
    startedRef.current = true;
    const sequence: Vq1cEnvironmentMode[] = ["vp2-clear-day", "coffee-lightmap-qa", "rain-mood"];
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      const geomsBefore = gl.info.memory.geometries;
      const texBefore = gl.info.memory.textures;
      const uuids: string[] = [];
      const cameraUuids: string[] = [];
      const meshCounts: number[] = [];
      for (let i = 0; i < 10; i += 1) {
        const nextMode = sequence[i % sequence.length];
        setMode(nextMode);
        await new Promise((resolve) => setTimeout(resolve, 200));
        const diagnostic = window.__VQ1C_FULL_OFFICE_QA__;
        if (diagnostic) {
          uuids.push(diagnostic.sceneUuid);
          cameraUuids.push(diagnostic.cameraUuid);
          meshCounts.push(diagnostic.validation.meshes);
        }
      }
      // Exit QA mode: old coffee must be restored, lookdev hidden.
      setMode("vp2-clear-day");
      await new Promise((resolve) => setTimeout(resolve, 250));
      const finalDiag = window.__VQ1C_FULL_OFFICE_QA__;
      const coffeeQa = finalDiag?.coffeeQa ?? null;
      const geomsAfter = gl.info.memory.geometries;
      const texAfter = gl.info.memory.textures;
      const resources = performance.getEntriesByType("resource").map((e) => e.name);
      const glbRequests = resources.filter((n) => n.includes("lightmapped-r1.glb")).length;
      const lightmapRequests = resources.filter((n) => n.includes("coffee-corner-lightmap.png")).length;
      const manifestRequests = resources.filter((n) => n.includes("runtime-manifest-r1.json")).length;
      const result: Vp2QaSelfTestReport = {
        cycles: 10,
        sequence: ["VP2 Clear Day", "Coffee Lightmap QA", "Rain Mood"],
        sceneUuidStable: uuids.every((u) => u === uuids[0]),
        cameraUuidStable: cameraUuids.every((u) => u === cameraUuids[0]),
        officeMeshCountStable: meshCounts.every((m) => m === meshCounts[0]),
        coffeeInstanceCount: coffeeQa && coffeeQa.lookdevVisible ? 1 : 0,
        lookdevMeshCount: coffeeQa?.lookdevMeshes ?? 0,
        materialsBefore: 0,
        materialsAfter: 0,
        geometriesBefore: geomsBefore,
        geometriesAfter: geomsAfter,
        texturesBefore: texBefore,
        texturesAfter: texAfter,
        glbRequests,
        lightmapRequests,
        manifestRequests,
        oldCoffeeRestoredAfterExit: coffeeQa ? coffeeQa.oldCoffeeHidden === false : false,
        lookdevHiddenAfterExit: coffeeQa ? coffeeQa.lookdevVisible === false : false,
        allOk: false,
      };
      result.allOk = result.sceneUuidStable && result.cameraUuidStable && result.officeMeshCountStable
        && geomsBefore === geomsAfter && texBefore === texAfter
        && glbRequests === 1 && lightmapRequests === 1 && manifestRequests === 1
        && result.oldCoffeeRestoredAfterExit && result.lookdevHiddenAfterExit;
      setReport(result);
      document.title = result.allOk ? "VP2_4A_SELFTEST:OK" : "VP2_4A_SELFTEST:FAIL";
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gl]);

  if (!report) return null;
  return (
    <div id="vp2-4a-selftest" style={{ position: "fixed", left: 12, bottom: 12, zIndex: 200, maxWidth: 420,
      background: "rgba(8,12,18,0.95)", color: "#9fe8a0", padding: 10, borderRadius: 8, fontSize: 11,
      fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {JSON.stringify(report, null, 2)}
    </div>
  );
}

function AutoFit({ target, radiusMultiplier = 2.2 }: { target: AutoFitTarget | null; radiusMultiplier?: number }) {
  const controlsRef = useRef<MapControls>(null);
  const { camera } = useThree();
  const lastVersion = useRef(-1);

  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    if (!target || target.version === lastVersion.current) return;
    lastVersion.current = target.version;
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = camera as PerspectiveCamera;
    const { sphere, center } = target;

    const radius = sphere.radius * radiusMultiplier;
    const distH = radius / Math.tan(cam.fov * Math.PI / 360) * 0.5;
    const camDist = Math.max(distH, radius * 1.5);

    const dir = new Vector3().subVectors(cam.position, controls.target).normalize();
    cam.position.copy(center.clone().add(dir.multiplyScalar(camDist)));
    controls.target.copy(center);
    // eslint-disable-next-line react-hooks/immutability
    cam.near = camDist * 0.001;
    cam.far = camDist * 10;
    cam.updateProjectionMatrix();
    controls.update();
  });

  return <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.1} />;
}

function AssetModel({
  path,
  wireframe,
  showBounds,
  onBoundsReady,
}: {
  path: string;
  wireframe: boolean;
  showBounds: boolean;
  onBoundsReady: (sphere: Sphere, center: Vector3) => void;
}) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const mat of materials) {
            (mat as { wireframe?: boolean }).wireframe = wireframe;
          }
        }
      });
    }
  }, [scene, wireframe]);

  const bounds = useMemo(() => {
    if (!scene) return null;
    const box = new Box3().setFromObject(scene);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);
    const center = new Vector3();
    box.getCenter(center);
    setTimeout(() => onBoundsReady(sphere, center), 0);
    return { box, sphere, center };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <>
      <primitive object={scene} />
      {showBounds && bounds && (
        <mesh position={[bounds.center.x, bounds.center.y, bounds.center.z]}>
          <boxGeometry args={[
            bounds.box.max.x - bounds.box.min.x,
            bounds.box.max.y - bounds.box.min.y,
            bounds.box.max.z - bounds.box.min.z,
          ]} />
          <meshBasicMaterial color="#ff0000" wireframe />
        </mesh>
      )}
    </>
  );
}

function SceneStats({
  onStats,
}: {
  onStats: (stats: { triangles: number; drawCalls: number; geometries: number; textures: number }) => void;
}) {
  const { gl } = useThree();
  const elapsedRef = useRef(0);
  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (elapsedRef.current < 0.5) return;
    elapsedRef.current = 0;
    const info = gl.info;
    onStats({
      triangles: info.render.triangles,
      drawCalls: info.render.calls,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
    });
  });
  return null;
}

function Turntable({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (enabled && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

export function AssetLab() {
  const [selectedAsset, setSelectedAsset] = useState(GLB_WHITELIST[0]);
  const [lightingMode, setLightingMode] = useState<LightingMode>("neutral");
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("light-gray");
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const [showBounds, setShowBounds] = useState(false);
  const [turntable, setTurntable] = useState(false);
  const [sceneStats, setSceneStats] = useState({ triangles: 0, drawCalls: 0, geometries: 0, textures: 0 });
  const [assetStats, setAssetStats] = useState<AssetStats>({ meshes: 0, materials: 0, triangles: 0, textures: 0 });
  const [fitTarget, setFitTarget] = useState<AutoFitTarget | null>(null);
  const [vq1cMode, setVq1cMode] = useState<Vq1cEnvironmentMode>("clear-day");
  const [runtimeValidation, setRuntimeValidation] = useState<Vq1cRuntimeValidation | Vq1cFullOfficeRuntimeValidation | null>(null);
  const [runtimeDiagnostics, setRuntimeDiagnostics] = useState<Vq1cRuntimeDiagnostics | Vq1cFullOfficeRuntimeDiagnostics | null>(null);
  const fitVersionRef = useRef(0);

  // VP2-4A: URL-driven QA mode (deterministic headless captures / self test).
  // Applied after hydration (SSR state does not run client-side lazy initializers).
  const [qaUrl, setQaUrl] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const search = window.location.search;
      setQaUrl(search);
      const params = new URLSearchParams(search);
      const assetId = params.get("vq1cAsset");
      if (assetId) {
        const asset = GLB_WHITELIST.find((a) => a.id === assetId);
        if (asset) setSelectedAsset(asset);
      }
      const modeParam = params.get("vq1cMode");
      if (modeParam && modeParam in VQ1C_ENVIRONMENT_PRESETS) {
        setVq1cMode(modeParam as Vq1cEnvironmentMode);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const qaParams = new URLSearchParams(qaUrl);
  const qaClean = qaParams.get("qaClean") === "1";
  const coffeeDetail = qaParams.get("vq1cCoffeeDetail") === "1";
  const qaSelfTest = qaParams.get("vq1cQaSelfTest") === "1";
  const qaStatic = qaParams.get("vq1cStatic") === "1";

  // VP2-4A: gate the Canvas behind hydration so the orthographic camera decision
  // (URL-driven, client-only) never causes an SSR/CSR hydration mismatch.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const lighting = LIGHTING_CONFIG[lightingMode];
  const bgColor = BACKGROUND_COLORS[backgroundMode];
  const isVq1cHeroPbr = selectedAsset.id === "vq1c-hero-corner-pbr";
  const isVq1cFullOfficePbr = selectedAsset.id === "vq1c-officeworld-full-pbr";
  const isCharacterQa = selectedAsset.id === "vq1c-character-qa";
  const isVq1cPbr = isVq1cHeroPbr || isVq1cFullOfficePbr || isCharacterQa;
  // VP2-4A: the full office QA context uses the official orthographic camera.
  const useOfficialCamera = isVq1cFullOfficePbr || isCharacterQa;
  const activeCamera = useOfficialCamera
    ? (coffeeDetail
      ? COFFEE_DETAIL_CAMERA
      : (isCharacterQa && qaParams.get("vq1cCharacterDetail") === "1")
        ? CHARACTER_DETAIL_CAMERA
        : OFFICIAL_CAMERA)
    : null;
  const heroDiagnostics = runtimeDiagnostics && "anchorPosition" in runtimeDiagnostics ? runtimeDiagnostics : null;
  const fullOfficeDiagnostics = runtimeDiagnostics && "enabledDeskLights" in runtimeDiagnostics ? runtimeDiagnostics : null;
  const coffeeQaDiagnostics = fullOfficeDiagnostics?.coffeeQa ?? null;

  const handleBoundsReady = useCallback((sphere: Sphere, center: Vector3) => {
    fitVersionRef.current += 1;
    setFitTarget({ sphere, center, version: fitVersionRef.current });
  }, []);

  const handleAssetChange = useCallback((asset: typeof GLB_WHITELIST[0]) => {
    setSelectedAsset(asset);
    setFitTarget(null);
    setRuntimeValidation(null);
    setRuntimeDiagnostics(null);
    if (asset.id === "vq1c-hero-corner-pbr") setVq1cMode("clear-day");
    if (asset.id === "vq1c-officeworld-full-pbr") setVq1cMode("vp2-clear-day");
  }, []);

  const handleResetView = useCallback(() => {
    fitVersionRef.current += 1;
    if (fitTarget) {
      setFitTarget({ sphere: fitTarget.sphere, center: fitTarget.center, version: fitVersionRef.current });
    }
  }, [fitTarget]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {!qaClean && (
      <div style={{ padding: "10px 14px", background: "#2a2a2a", color: "#fff", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", fontSize: 12 }}>
        <strong>Asset Lab</strong>
        <select
          value={selectedAsset.id}
          onChange={(e) => handleAssetChange(GLB_WHITELIST.find((a) => a.id === e.target.value) || GLB_WHITELIST[0])}
          style={{ padding: "3px 6px", borderRadius: 4, fontSize: 12 }}
        >
          {GLB_WHITELIST.map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.label}</option>
          ))}
        </select>
        {isVq1cPbr && (
          <span data-testid="vq1c-runtime-validation"
            data-mode={runtimeDiagnostics?.mode}
            data-scene-uuid={runtimeDiagnostics?.sceneUuid}
            data-anchor-position={heroDiagnostics?.anchorPosition.join(",")}
            data-anchor-encoded-direction={heroDiagnostics?.anchorEncodedDirection.join(",")}
            data-anchor-direction={heroDiagnostics?.anchorDirection.join(",")}
            data-camera-position={runtimeDiagnostics?.cameraPosition.join(",")}
            data-desk-lights={runtimeDiagnostics?.deskLights}
            data-enabled-desk-lights={fullOfficeDiagnostics?.enabledDeskLights}
            data-mode-changes={fullOfficeDiagnostics?.modeChanges}
            data-observed-fps={fullOfficeDiagnostics?.observedFps}
            data-office-anchors={fullOfficeDiagnostics?.validation.officeAnchors}
            data-internal-anchors={fullOfficeDiagnostics?.validation.internalAnchors}
            data-workstations={fullOfficeDiagnostics ? JSON.stringify(fullOfficeDiagnostics.validation.workstations) : undefined}
            data-desk-light-positions={fullOfficeDiagnostics ? JSON.stringify(fullOfficeDiagnostics.deskLightPositions) : undefined}
            data-desk-light-directions={fullOfficeDiagnostics ? JSON.stringify(fullOfficeDiagnostics.deskLightDirections) : undefined}
            data-runtime-renderer={fullOfficeDiagnostics ? JSON.stringify(fullOfficeDiagnostics.renderer) : undefined}
            data-window-backdrops={runtimeDiagnostics?.windowBackdrops}
            data-render-calls={sceneStats.drawCalls}
            data-render-triangles={sceneStats.triangles}
            data-memory-geometries={sceneStats.geometries}
            data-memory-textures={sceneStats.textures}
            style={{ color: runtimeValidation?.ok ? "#83d89a" : "#f0b36a" }}>
            Runtime validation: {runtimeValidation ? (runtimeValidation.ok ? "PASS" : "FAIL") : "checking"}
          </span>
        )}
        <span style={{ color: "#8ab4f8" }}>
          Asset: {assetStats.meshes} meshes · {assetStats.materials} mats · {assetStats.triangles.toLocaleString()} tris · {assetStats.textures} tex
        </span>
        <span style={{ color: "#aaa" }}>
          Scene: {sceneStats.triangles.toLocaleString()} tris · {sceneStats.drawCalls} draws · {sceneStats.textures} tex
        </span>
        {coffeeQaDiagnostics && (
          <span data-testid="vq1c-coffee-qa"
            data-old-coffee-meshes={coffeeQaDiagnostics.oldCoffeeMeshes}
            data-old-coffee-hidden={String(coffeeQaDiagnostics.oldCoffeeHidden)}
            data-lookdev-visible={String(coffeeQaDiagnostics.lookdevVisible)}
            data-lookdev-meshes={coffeeQaDiagnostics.lookdevMeshes}
            data-lookdev-materials={coffeeQaDiagnostics.lookdevMaterials}
            data-lookdev-triangles={coffeeQaDiagnostics.lookdevTriangles}
            data-lightmap-intensity={coffeeQaDiagnostics.lightmapIntensity}
            data-manifest-ok={String(coffeeQaDiagnostics.manifestOk)}
            data-manifest-error={coffeeQaDiagnostics.manifestError ?? ""}
            style={{ color: coffeeQaDiagnostics.manifestOk ? "#83d89a" : "#f0b36a" }}>
            Coffee Lightmap QA: {coffeeQaDiagnostics.lookdevMeshes} meshes · {coffeeQaDiagnostics.lookdevMaterials} mats
            · {coffeeQaDiagnostics.lookdevTriangles.toLocaleString()} tris · intensity {coffeeQaDiagnostics.lightmapIntensity}
          </span>
        )}
      </div>
      )}

      <div style={{ flex: 1, position: "relative" }}>
        <pre id="vp2-4a-debug" style={{ position: "fixed", left: 8, top: 8, zIndex: 300, margin: 0, padding: 6,
          background: "rgba(10,12,16,0.85)", color: "#9fd0ff", fontSize: 10, fontFamily: "monospace" }}>
          {`url=${qaUrl || "(ssr)"} | asset=${selectedAsset.id} | mode=${vq1cMode} | hydrated=${hydrated}`}
        </pre>
        {!hydrated && <div style={{ width: "100%", height: "100%", background: "#111" }} />}
        {hydrated && (
        <Canvas
          frameloop={qaStatic ? "demand" : "always"}
          orthographic={Boolean(activeCamera)}
          camera={activeCamera
            ? { position: activeCamera.position, zoom: activeCamera.zoom, near: activeCamera.near, far: activeCamera.far }
            : { position: [0.8, 0.8, 0.8], fov: 50 }}
        >
          {activeCamera && <OfficialCamera target={activeCamera.target} />}
          {!isVq1cPbr && <color attach="background" args={[bgColor]} />}
          {!isVq1cPbr && <ambientLight intensity={lighting.ambient} />}
          {!isVq1cPbr && <directionalLight position={[5, 5, 5]} intensity={lighting.key} color={lighting.keyColor} castShadow />}

          {!isVq1cPbr && (
            <Environment
              preset="studio"
              environmentIntensity={lighting.envIntensity}
              background={false}
              backgroundIntensity={0}
            />
          )}

          <Turntable enabled={turntable && !isVq1cPbr}>
            <Suspense fallback={null}>
              {isVq1cHeroPbr ? (
                <Vq1cHeroCornerRuntime
                  mode={vq1cMode}
                  showBounds={showBounds}
                  onBoundsReady={handleBoundsReady}
                  onValidation={setRuntimeValidation}
                  onDiagnostics={setRuntimeDiagnostics}
                />
              ) : isVq1cFullOfficePbr ? (
                <Vq1cFullOfficeRuntime
                  mode={vq1cMode}
                  showBounds={showBounds}
                  onBoundsReady={handleBoundsReady}
                  onValidation={setRuntimeValidation}
                  onDiagnostics={setRuntimeDiagnostics}
                />
              ) : isCharacterQa ? (
                <Vq1cCharacterQaScene />
              ) : (
                <AssetModel
                  key={selectedAsset.id}
                  path={selectedAsset.path}
                  wireframe={wireframe}
                  showBounds={showBounds}
                  onBoundsReady={handleBoundsReady}
                />
              )}
            </Suspense>
          </Turntable>

          {showGrid && <Grid infiniteGrid fadeDistance={10} />}
          {showAxis && <axesHelper args={[5]} />}

          {!useOfficialCamera && <AutoFit target={fitTarget} radiusMultiplier={isVq1cFullOfficePbr ? 1.6 : 2.2} />}
          <SceneStats onStats={setSceneStats} />
          <AssetStatsReader key={selectedAsset.id} path={selectedAsset.path} onStats={setAssetStats} />
          {qaSelfTest && isVq1cFullOfficePbr && (
            <Vp2QaSelfTest enabled={qaSelfTest} setMode={setVq1cMode} />
          )}
        </Canvas>
        )}
      </div>

      {!qaClean && (
      <div style={{ padding: "10px 14px", background: "#2a2a2a", color: "#fff", display: "flex", gap: "14px", flexWrap: "wrap", fontSize: 12 }}>
        {!isVq1cPbr && <div>
          <strong>Lighting:</strong>{" "}
          {(["neutral", "clear-day", "overcast", "rain-preview", "night"] as LightingMode[]).map((mode) => (
            <button key={mode} onClick={() => setLightingMode(mode)}
              style={{ padding: "2px 6px", margin: "0 2px", borderRadius: 3, background: lightingMode === mode ? "#4a90e2" : "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}
            >{mode}</button>
          ))}
        </div>}
        {!isVq1cPbr && <div>
          <strong>Background:</strong>{" "}
          {(["light-gray", "dark-gray", "warm-gray"] as BackgroundMode[]).map((mode) => (
            <button key={mode} onClick={() => setBackgroundMode(mode)}
              style={{ padding: "2px 6px", margin: "0 2px", borderRadius: 3, background: backgroundMode === mode ? "#4a90e2" : "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}
            >{mode}</button>
          ))}
        </div>}
        {isVq1cPbr && (
          <div data-testid="vq1c-environment-controls">
            <strong>Environment:</strong>{" "}
            {(Object.keys(VQ1C_ENVIRONMENT_PRESETS) as Vq1cEnvironmentMode[]).map((mode) => (
              <button key={mode} data-testid={`vq1c-mode-${mode}`} aria-pressed={vq1cMode === mode}
                onClick={() => setVq1cMode(mode)}
                style={{ padding: "3px 8px", margin: "0 2px", borderRadius: 3, background: vq1cMode === mode ? "#4a90e2" : "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>
                {VQ1C_ENVIRONMENT_PRESETS[mode].label}
              </button>
            ))}
          </div>
        )}
        <button onClick={handleResetView} style={{ padding: "2px 8px", borderRadius: 3, background: "#555", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Reset View</button>
        <div>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={wireframe} disabled={isVq1cPbr} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Grid</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showAxis} onChange={(e) => setShowAxis(e.target.checked)} /> Axis</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showBounds} onChange={(e) => setShowBounds(e.target.checked)} /> Bounds</label>
          <label><input type="checkbox" checked={turntable} disabled={isVq1cPbr} onChange={(e) => setTurntable(e.target.checked)} /> Turntable</label>
        </div>
      </div>
      )}
    </div>
  );
}

function AssetStatsReader({ path, onStats }: { path: string; onStats: (s: AssetStats) => void }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    if (!scene) return;
    const stats = computeAssetStats(scene);
    onStats(stats);
  }, [scene, onStats]);

  return null;
}
