"use client";

import { Component, Suspense, useCallback, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import { OfficeWorld } from "@/components/office-3d/OfficeWorld";
import type { Vq1cOfficeWorldDiagnostics } from "@/components/office-3d/Vq1cOfficeWorldScene";
import type { CharacterDebugAction, CharacterDebugCommand } from "@/components/office-3d/character-actions";
import { OFFICE_CAMERA, WORKSTATION_LAYOUT, type CameraZoneKey, type InteractionAnchor } from "@/components/office-3d/scene-config";
import type { CatPose } from "@/components/office-3d/ChangFenCat";
import { buildDeskSlots, createSceneDebugUsers } from "@/lib/office/desk-slots";
import type { CharacterInteractionEffect, InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import type { OfficeDataMode } from "@/hooks/useCurrentStatusSync";

interface OfficeWebGLSceneProps {
  users: OfficeUser[];
  isNight: boolean;
  dataMode: OfficeDataMode;
  cameraZone?: CameraZoneKey;
  interactionEffects: Record<string, CharacterInteractionEffect>;
  coffeeGifts: InteractionEvent[];
  onClaimCoffee: (interactionId: string) => void;
  onCharacterClick: (user: OfficeUser, anchor?: InteractionAnchor) => void;
  onObjectClick: (kind: ObjectKind, ownerId?: string) => void;
  catPose?: CatPose | null;
}

interface SceneBoundaryState {
  failed: boolean;
}

interface SceneRuntimeDiagnostics {
  canvasWidth: number;
  canvasHeight: number;
  cameraPosition: [number, number, number];
  sceneChildren: number;
  rendererStatus: "initializing" | "ready" | "context-lost";
  hasNaNTransform: boolean;
  rendererCalls: number;
  rendererTriangles: number;
  rendererGeometries: number;
  rendererTextures: number;
}

const INITIAL_DIAGNOSTICS: SceneRuntimeDiagnostics = {
  canvasWidth: 0,
  canvasHeight: 0,
  cameraPosition: [...OFFICE_CAMERA.position],
  sceneChildren: 0,
  rendererStatus: "initializing",
  hasNaNTransform: false,
  rendererCalls: 0,
  rendererTriangles: 0,
  rendererGeometries: 0,
  rendererTextures: 0,
};

class SceneBoundary extends Component<{ children: ReactNode; onRetry: () => void }, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D office scene failed to render", error, errorInfo);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="office-webgl-fallback" role="alert">
          <strong>3D办公室加载失败</strong>
          <span>场景没有正常启动，可以单独重新加载 3D 办公室。</span>
          <button type="button" onClick={this.props.onRetry}>重新加载场景</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function SceneRuntimeProbe({ onUpdate }: { onUpdate: (value: SceneRuntimeDiagnostics) => void }) {
  const { camera, gl, scene, size } = useThree();
  const lastUpdate = useRef(0);

  useFrame(() => {
    const now = performance.now();
    if (now - lastUpdate.current < 1000) return;
    lastUpdate.current = now;
    let hasNaNTransform = false;
    scene.traverse((object) => {
      const values = [
        object.position.x, object.position.y, object.position.z,
        object.rotation.x, object.rotation.y, object.rotation.z,
        object.scale.x, object.scale.y, object.scale.z,
      ];
      if (values.some((value) => !Number.isFinite(value))) hasNaNTransform = true;
    });

    onUpdate({
      canvasWidth: Math.round(size.width),
      canvasHeight: Math.round(size.height),
      cameraPosition: [camera.position.x, camera.position.y, camera.position.z],
      sceneChildren: scene.children.length,
      rendererStatus: gl.getContext().isContextLost() ? "context-lost" : "ready",
      hasNaNTransform,
      rendererCalls: gl.info.render.calls,
      rendererTriangles: gl.info.render.triangles,
      rendererGeometries: gl.info.memory.geometries,
      rendererTextures: gl.info.memory.textures,
    });
  });

  return null;
}

function getDebugMemberCount() {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("sceneMembers");
  if (raw === null) return null;
  const count = Number(raw);
  return Number.isInteger(count) && count >= 0 && count <= 4 ? count : null;
}

export function OfficeWebGLScene(props: OfficeWebGLSceneProps) {
  const [fps, setFps] = useState(0);
  const [debugEnabled] = useState(() => process.env.NODE_ENV !== "production" && typeof window !== "undefined" && ["animationDebug", "sceneDebug"].some((key) => new URLSearchParams(window.location.search).get(key) === "1"));
  const [debugMemberCount] = useState(getDebugMemberCount);
  const [debugCommand, setDebugCommand] = useState<CharacterDebugCommand | null>(null);
  const [sceneVersion, setSceneVersion] = useState(0);
  const [runtimeDiagnostics, setRuntimeDiagnostics] = useState<SceneRuntimeDiagnostics>(INITIAL_DIAGNOSTICS);
  const [vq1cDiagnostics, setVq1cDiagnostics] = useState<Vq1cOfficeWorldDiagnostics | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(() => {
    if (process.env.NODE_ENV === "production" || typeof window === "undefined") return 1;
    const speed = Number(new URLSearchParams(window.location.search).get("animationSpeed"));
    return speed === 0.5 || speed === 1.5 ? speed : 1;
  });
  const commandId = useRef(0);
  const sceneUsers = useMemo(
    () => debugMemberCount === null ? props.users : createSceneDebugUsers(props.users, debugMemberCount),
    [debugMemberCount, props.users],
  );
  const memberCount = sceneUsers.filter((user) => !user.isPlaceholder).length;
  const sceneSlots = buildDeskSlots(sceneUsers).slots;
  const renderedCharacters = sceneSlots.filter((slot) => slot.member !== null).length;

  const triggerDebugAction = useCallback((action: CharacterDebugAction, scope: "current" | "all" = "current") => {
    commandId.current += 1;
    setDebugCommand({ id: commandId.current, action, scope });
  }, []);

  const reloadScene = useCallback(() => {
    setRuntimeDiagnostics(INITIAL_DIAGNOSTICS);
    setSceneVersion((version) => version + 1);
  }, []);

  return (
    <div
      className={`office-webgl-shell ${props.isNight ? "is-night" : "is-day"}`}
      data-testid="office-webgl-shell"
      data-members={memberCount}
      data-desk-slots="4"
      data-rendered-characters={renderedCharacters}
      data-renderer-status={runtimeDiagnostics.rendererStatus}
      data-nan-transform={runtimeDiagnostics.hasNaNTransform ? "true" : "false"}
      data-vq1c-validation={vq1cDiagnostics?.validation.ok ? "pass" : vq1cDiagnostics ? "fail" : "pending"}
      data-vq1c-mode={vq1cDiagnostics?.mode ?? "pending"}
      data-vq1c-source-uuid={vq1cDiagnostics?.sourceSceneUuid ?? "pending"}
      data-vq1c-clone-uuid={vq1cDiagnostics?.cloneUuid ?? "pending"}
      data-vq1c-model-meshes={vq1cDiagnostics?.validation.meshes ?? 0}
      data-vq1c-model-triangles={vq1cDiagnostics?.validation.triangles ?? 0}
      data-vq1c-model-materials={vq1cDiagnostics?.validation.materials ?? 0}
      data-vq1c-model-textures={vq1cDiagnostics?.validation.textures ?? 0}
      data-vq1c-office-anchors={vq1cDiagnostics?.validation.officeAnchors ?? 0}
      data-vq1c-internal-anchors={vq1cDiagnostics?.validation.internalAnchors ?? 0}
      data-vq1c-workstations={vq1cDiagnostics ? JSON.stringify(vq1cDiagnostics.validation.workstations) : "pending"}
      data-vq1c-root={vq1cDiagnostics ? JSON.stringify(vq1cDiagnostics.rootTransform) : "pending"}
      data-vq1c-desk-lights={vq1cDiagnostics?.deskLights ?? 0}
      data-vq1c-enabled-desk-lights={vq1cDiagnostics?.enabledDeskLights ?? 0}
      data-vq1c-desk-light-positions={vq1cDiagnostics ? JSON.stringify(vq1cDiagnostics.deskLightPositions) : "pending"}
      data-vq1c-desk-light-directions={vq1cDiagnostics ? JSON.stringify(vq1cDiagnostics.deskLightDirections) : "pending"}
      data-vq1c-window-backdrops={vq1cDiagnostics?.windowBackdrops ?? 0}
      data-vq1c-camera-position={vq1cDiagnostics?.cameraPosition.join(",") ?? "pending"}
      data-vq1c-camera-zoom={vq1cDiagnostics?.cameraZoom ?? 0}
      data-vq1c-camera-near={vq1cDiagnostics?.cameraNear ?? 0}
      data-vq1c-camera-far={vq1cDiagnostics?.cameraFar ?? 0}
      data-vq1c-desk-bindings={JSON.stringify(sceneSlots.map((slot, index) => ({
        deskKey: slot.deskKey,
        memberId: slot.member?.id ?? null,
        position: WORKSTATION_LAYOUT[index].position,
      })))}
      data-renderer-calls={runtimeDiagnostics.rendererCalls}
      data-renderer-triangles={runtimeDiagnostics.rendererTriangles}
      data-renderer-geometries={runtimeDiagnostics.rendererGeometries}
      data-renderer-textures={runtimeDiagnostics.rendererTextures}
    >
      <SceneBoundary key={sceneVersion} onRetry={reloadScene}>
        <Canvas
          className="office-webgl-canvas"
          orthographic
          camera={{ position: OFFICE_CAMERA.position, zoom: OFFICE_CAMERA.zoom, near: OFFICE_CAMERA.near, far: OFFICE_CAMERA.far }}
          dpr={[1, 1.5]}
          shadows="percentage"
          frameloop="always"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl, camera, scene, size }) => {
            gl.outputColorSpace = SRGBColorSpace;
            camera.lookAt(...OFFICE_CAMERA.target);
            camera.updateProjectionMatrix();
            setRuntimeDiagnostics({
              canvasWidth: Math.round(size.width),
              canvasHeight: Math.round(size.height),
              cameraPosition: OFFICE_CAMERA.position,
              sceneChildren: scene.children.length,
              rendererStatus: gl.getContext().isContextLost() ? "context-lost" : "ready",
              hasNaNTransform: false,
              rendererCalls: 0,
              rendererTriangles: 0,
              rendererGeometries: gl.info.memory.geometries,
              rendererTextures: gl.info.memory.textures,
            });
          }}
        >
          <Suspense fallback={null}>
            <OfficeWorld {...props} cameraZone={props.cameraZone ?? "auto"} users={sceneUsers} onFpsChange={setFps} debugCommand={debugCommand} speedMultiplier={speedMultiplier} onVq1cDiagnostics={setVq1cDiagnostics} />
            <SceneRuntimeProbe onUpdate={setRuntimeDiagnostics} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
      <div className="office-webgl-hint" aria-hidden="true">
        <span>拖动画面</span><i /> <span>滚轮缩放</span>
      </div>
      <div className="office-webgl-metrics" aria-label={`当前 ${fps || "测量中"} FPS，模型资源 0 MB`}>
        <i /> WebGL · {fps ? `${fps} FPS` : "测量中"} · GLB 0 MB
      </div>
      <div className={`office-webgl-stage-badge data-mode-${props.dataMode}`} data-testid="data-mode-indicator">
        3D 场景 · {props.dataMode === "local" ? "本地演示模式" : props.dataMode === "realtime" ? "实时联机" : props.dataMode === "reconnecting" ? "正在重连" : props.dataMode === "signedOut" ? "等待登录" : props.dataMode === "noOffice" ? "等待加入办公室" : props.dataMode === "error" ? "同步异常" : "正在连接"}
      </div>
      {debugEnabled ? (
        <aside className="animation-debug-panel" aria-label="人物动画与场景测试面板">
          <header><strong>Animation lab</strong><span>{speedMultiplier}×</span></header>
          <dl className="scene-debug-readout">
            <div><dt>members</dt><dd>{memberCount}</dd></div>
            <div><dt>deskSlots</dt><dd>4</dd></div>
            <div><dt>characters</dt><dd>{renderedCharacters}</dd></div>
            <div><dt>Canvas</dt><dd>{runtimeDiagnostics.canvasWidth} × {runtimeDiagnostics.canvasHeight}</dd></div>
            <div><dt>camera</dt><dd>{runtimeDiagnostics.cameraPosition.map((value) => value.toFixed(1)).join(", ")}</dd></div>
            <div><dt>scene children</dt><dd>{runtimeDiagnostics.sceneChildren}</dd></div>
            <div><dt>renderer</dt><dd>{runtimeDiagnostics.rendererStatus}</dd></div>
            <div><dt>NaN transform</dt><dd>{runtimeDiagnostics.hasNaNTransform ? "yes" : "no"}</dd></div>
            <div><dt>VQ1C</dt><dd>{vq1cDiagnostics?.validation.ok ? "pass" : "pending"}</dd></div>
            <div><dt>model tris</dt><dd>{vq1cDiagnostics?.validation.triangles ?? 0}</dd></div>
            <div><dt>draw calls</dt><dd>{runtimeDiagnostics.rendererCalls}</dd></div>
          </dl>
          <div className="animation-debug-grid">
            <button type="button" onClick={() => triggerDebugAction("desk")}>Walk to desk</button>
            <button type="button" onClick={() => triggerDebugAction("meeting")}>Walk to meeting</button>
            <button type="button" onClick={() => triggerDebugAction("dining")}>Walk to dining</button>
            <button type="button" onClick={() => triggerDebugAction("sofa")}>Walk to sofa</button>
            <button type="button" onClick={() => triggerDebugAction("coffee")}>Walk to coffee</button>
            <button type="button" onClick={() => triggerDebugAction("restroom")}>Walk to restroom</button>
            <button type="button" onClick={() => triggerDebugAction("entrance")}>Walk to entrance</button>
            <button type="button" onClick={() => triggerDebugAction("idle")}>Idle</button>
            <button type="button" onClick={() => triggerDebugAction("typing")}>Typing</button>
            <button type="button" onClick={() => triggerDebugAction("eating")}>Eating</button>
            <button type="button" onClick={() => triggerDebugAction("resting")}>Resting</button>
            <button type="button" onClick={() => triggerDebugAction("waving")}>Wave</button>
          </div>
          <div className="animation-debug-actions">
            <button type="button" onClick={() => triggerDebugAction("playAll", "all")}>Play all characters</button>
            <button type="button" onClick={() => triggerDebugAction("reset", "all")}>Reset positions</button>
          </div>
          <div className="animation-debug-speed" role="group" aria-label="动画速度">
            {[0.5, 1, 1.5].map((speed) => (
              <button key={speed} type="button" className={speedMultiplier === speed ? "is-active" : ""} onClick={() => setSpeedMultiplier(speed)}>{speed}×</button>
            ))}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
