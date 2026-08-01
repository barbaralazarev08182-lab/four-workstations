"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Grid, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3 } from "three";
import type { Group, Mesh } from "three";

// Whitelist of GLB assets in public/models/vq1/
const GLB_WHITELIST = [
  { id: "vq1-pipeline-smoke", label: "VQ1 Pipeline Smoke Test", path: "/models/vq1/vq1-pipeline-smoke.glb" },
];

type LightingMode = "neutral" | "clear-day" | "overcast" | "rain-preview" | "night";
type BackgroundMode = "light-gray" | "dark-gray" | "warm-gray";

const LIGHTING_CONFIG: Record<LightingMode, { ambient: number; key: number; keyColor: string; envIntensity: number }> = {
  "neutral": { ambient: 0.6, key: 1.0, keyColor: "#ffffff", envIntensity: 0.5 },
  "clear-day": { ambient: 0.5, key: 1.5, keyColor: "#fff5e0", envIntensity: 0.7 },
  "overcast": { ambient: 0.7, key: 0.8, keyColor: "#e0e5ea", envIntensity: 0.6 },
  "rain-preview": { ambient: 0.4, key: 0.5, keyColor: "#c0c8d0", envIntensity: 0.4 },
  "night": { ambient: 0.2, key: 0.3, keyColor: "#8090a0", envIntensity: 0.2 },
};

const BACKGROUND_COLORS: Record<BackgroundMode, string> = {
  "light-gray": "#e0e0e0",
  "dark-gray": "#404040",
  "warm-gray": "#d0c8c0",
};

function AssetModel({ path, wireframe, showBounds }: { path: string; wireframe: boolean; showBounds: boolean }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh) {
          (mesh.material as { wireframe?: boolean }).wireframe = wireframe;
        }
      });
    }
  }, [scene, wireframe]);

  const bounds = useMemo(() => {
    if (!scene) return null;
    const box = new Box3().setFromObject(scene);
    return box;
  }, [scene]);

  return (
    <>
      <primitive object={scene} />
      {showBounds && bounds && (
        <mesh position={[
          (bounds.max.x + bounds.min.x) / 2,
          (bounds.max.y + bounds.min.y) / 2,
          (bounds.max.z + bounds.min.z) / 2,
        ]}>
          <boxGeometry args={[
            bounds.max.x - bounds.min.x,
            bounds.max.y - bounds.min.y,
            bounds.max.z - bounds.min.z,
          ]} />
          <meshBasicMaterial color="#ff0000" wireframe />
        </mesh>
      )}
    </>
  );
}

function SceneStats({ onStats }: { onStats: (stats: { triangles: number; drawCalls: number; textures: number }) => void }) {
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
  const [stats, setStats] = useState({ triangles: 0, drawCalls: 0, textures: 0 });

  const lighting = LIGHTING_CONFIG[lightingMode];
  const bgColor = BACKGROUND_COLORS[backgroundMode];

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "#2a2a2a", color: "#fff", display: "flex", gap: "16px", alignItems: "center" }}>
        <strong>Asset Lab</strong>
        <select
          value={selectedAsset.id}
          onChange={(e) => setSelectedAsset(GLB_WHITELIST.find((a) => a.id === e.target.value) || GLB_WHITELIST[0])}
          style={{ padding: "4px 8px", borderRadius: 4 }}
        >
          {GLB_WHITELIST.map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.label}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: "#aaa" }}>
          Triangles: {stats.triangles.toLocaleString()} | Draw Calls: {stats.drawCalls} | Textures: {stats.textures}
        </span>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <color attach="background" args={[bgColor]} />
          <ambientLight intensity={lighting.ambient} />
          <directionalLight position={[5, 5, 5]} intensity={lighting.key} color={lighting.keyColor} castShadow />

          <Environment preset="studio" environmentIntensity={lighting.envIntensity} />

          <Turntable enabled={turntable}>
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
              <AssetModel path={selectedAsset.path} wireframe={wireframe} showBounds={showBounds} />
            </Suspense>
          </Turntable>

          {showGrid && <Grid infiniteGrid fadeDistance={10} />}
          {showAxis && <axesHelper args={[5]} />}

          <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
          <SceneStats onStats={setStats} />
        </Canvas>
      </div>

      {/* Controls */}
      <div style={{ padding: "12px 16px", background: "#2a2a2a", color: "#fff", display: "flex", gap: "16px", flexWrap: "wrap", fontSize: 12 }}>
        <div>
          <strong>Lighting:</strong>{" "}
          {(["neutral", "clear-day", "overcast", "rain-preview", "night"] as LightingMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setLightingMode(mode)}
              style={{
                padding: "2px 6px",
                margin: "0 2px",
                borderRadius: 3,
                background: lightingMode === mode ? "#4a90e2" : "#444",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
        <div>
          <strong>Background:</strong>{" "}
          {(["light-gray", "dark-gray", "warm-gray"] as BackgroundMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setBackgroundMode(mode)}
              style={{
                padding: "2px 6px",
                margin: "0 2px",
                borderRadius: 3,
                background: backgroundMode === mode ? "#4a90e2" : "#444",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
        <div>
          <label><input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Grid</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={showAxis} onChange={(e) => setShowAxis(e.target.checked)} /> Axis</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={showBounds} onChange={(e) => setShowBounds(e.target.checked)} /> Bounds</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={turntable} onChange={(e) => setTurntable(e.target.checked)} /> Turntable</label>
        </div>
      </div>
    </div>
  );
}
