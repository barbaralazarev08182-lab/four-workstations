"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, PerspectiveCamera, Sphere, Vector3 } from "three";
import type { Group, Mesh, Object3D, Texture } from "three";
import type { MapControls } from "three-stdlib";

// Whitelist of GLB assets in public/models/vq1/
const GLB_WHITELIST = [
  { id: "vq1-pipeline-smoke", label: "VQ1 Pipeline Smoke Test", path: "/models/vq1/vq1-pipeline-smoke.glb" },
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

function AutoFit({ target }: { target: AutoFitTarget | null }) {
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

    const radius = sphere.radius * 2.2;
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
  onStats: (stats: { triangles: number; drawCalls: number; textures: number }) => void;
}) {
  const { gl } = useThree();
  useFrame(() => {
    const info = gl.info;
    onStats({
      triangles: info.render.triangles,
      drawCalls: info.render.calls,
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
  const [sceneStats, setSceneStats] = useState({ triangles: 0, drawCalls: 0, textures: 0 });
  const [assetStats, setAssetStats] = useState<AssetStats>({ meshes: 0, materials: 0, triangles: 0, textures: 0 });
  const [fitTarget, setFitTarget] = useState<AutoFitTarget | null>(null);
  const fitVersionRef = useRef(0);

  const lighting = LIGHTING_CONFIG[lightingMode];
  const bgColor = BACKGROUND_COLORS[backgroundMode];

  const handleBoundsReady = useCallback((sphere: Sphere, center: Vector3) => {
    fitVersionRef.current += 1;
    setFitTarget({ sphere, center, version: fitVersionRef.current });
  }, []);

  const handleAssetChange = useCallback((asset: typeof GLB_WHITELIST[0]) => {
    setSelectedAsset(asset);
    setFitTarget(null);
  }, []);

  const handleResetView = useCallback(() => {
    fitVersionRef.current += 1;
    if (fitTarget) {
      setFitTarget({ sphere: fitTarget.sphere, center: fitTarget.center, version: fitVersionRef.current });
    }
  }, [fitTarget]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
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
        <span style={{ color: "#8ab4f8" }}>
          Asset: {assetStats.meshes} meshes · {assetStats.materials} mats · {assetStats.triangles.toLocaleString()} tris · {assetStats.textures} tex
        </span>
        <span style={{ color: "#aaa" }}>
          Scene: {sceneStats.triangles.toLocaleString()} tris · {sceneStats.drawCalls} draws · {sceneStats.textures} tex
        </span>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <Canvas
          camera={{ position: [0.8, 0.8, 0.8], fov: 50 }}
          gl={{ toneMapping: 3, toneMappingExposure: 1.0 }}
        >
          <color attach="background" args={[bgColor]} />
          <ambientLight intensity={lighting.ambient} />
          <directionalLight position={[5, 5, 5]} intensity={lighting.key} color={lighting.keyColor} castShadow />

          <Environment
            preset="studio"
            environmentIntensity={lighting.envIntensity}
            background={false}
            backgroundIntensity={0}
          />

          <Turntable enabled={turntable}>
            <Suspense fallback={null}>
              <AssetModel
                key={selectedAsset.id}
                path={selectedAsset.path}
                wireframe={wireframe}
                showBounds={showBounds}
                onBoundsReady={handleBoundsReady}
              />
            </Suspense>
          </Turntable>

          {showGrid && <Grid infiniteGrid fadeDistance={10} />}
          {showAxis && <axesHelper args={[5]} />}

          <AutoFit target={fitTarget} />
          <SceneStats onStats={setSceneStats} />
          <AssetStatsReader path={selectedAsset.path} onStats={setAssetStats} />
        </Canvas>
      </div>

      <div style={{ padding: "10px 14px", background: "#2a2a2a", color: "#fff", display: "flex", gap: "14px", flexWrap: "wrap", fontSize: 12 }}>
        <div>
          <strong>Lighting:</strong>{" "}
          {(["neutral", "clear-day", "overcast", "rain-preview", "night"] as LightingMode[]).map((mode) => (
            <button key={mode} onClick={() => setLightingMode(mode)}
              style={{ padding: "2px 6px", margin: "0 2px", borderRadius: 3, background: lightingMode === mode ? "#4a90e2" : "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}
            >{mode}</button>
          ))}
        </div>
        <div>
          <strong>Background:</strong>{" "}
          {(["light-gray", "dark-gray", "warm-gray"] as BackgroundMode[]).map((mode) => (
            <button key={mode} onClick={() => setBackgroundMode(mode)}
              style={{ padding: "2px 6px", margin: "0 2px", borderRadius: 3, background: backgroundMode === mode ? "#4a90e2" : "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}
            >{mode}</button>
          ))}
        </div>
        <button onClick={handleResetView} style={{ padding: "2px 8px", borderRadius: 3, background: "#555", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Reset View</button>
        <div>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Grid</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showAxis} onChange={(e) => setShowAxis(e.target.checked)} /> Axis</label>
          <label style={{ marginRight: 8 }}><input type="checkbox" checked={showBounds} onChange={(e) => setShowBounds(e.target.checked)} /> Bounds</label>
          <label><input type="checkbox" checked={turntable} onChange={(e) => setTurntable(e.target.checked)} /> Turntable</label>
        </div>
      </div>
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
