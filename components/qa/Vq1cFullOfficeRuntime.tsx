"use client";

/* Runtime state is restored on unmount; cached GLTF geometry and materials are never mutated. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  ACESFilmicToneMapping, Box3, CanvasTexture, Color, Fog, LinearFilter,
  Object3D, PMREMGenerator, SRGBColorSpace, Sphere, Vector3,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { VQ1C_ENVIRONMENT_PRESETS, type Vq1cEnvironmentMode } from "./vq1cEnvironmentPresets";
import {
  validateVq1cFullOfficeRuntimeScene,
  type Vq1cFullOfficeRuntimeValidation,
} from "./validateVq1cFullOfficeRuntime";

export const VQ1C_FULL_OFFICE_PBR_PATH = "/models/vq1/vq1c-officeworld-full-pbr.glb";
const FULL_OFFICE_DESK_LIGHT_INTENSITY = 7;

export interface Vq1cFullOfficeRuntimeDiagnostics {
  mode: Vq1cEnvironmentMode;
  sceneUuid: string;
  cameraUuid: string;
  cameraPosition: [number, number, number];
  validation: Vq1cFullOfficeRuntimeValidation;
  deskLights: number;
  enabledDeskLights: number;
  deskLightPositions: [number, number, number][];
  deskLightDirections: [number, number, number][];
  windowBackdrops: number;
  modeChanges: number;
  observedFps: number;
  renderer: { calls: number; triangles: number; geometries: number; textures: number };
}

declare global {
  interface Window { __VQ1C_FULL_OFFICE_QA__?: Vq1cFullOfficeRuntimeDiagnostics }
}

function makeBackdropTexture(kind: "clear" | "rain") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  if (kind === "clear") {
    gradient.addColorStop(0, "#adc9d8");
    gradient.addColorStop(0.7, "#d9e2df");
    gradient.addColorStop(1, "#eee7d9");
  } else {
    gradient.addColorStop(0, "#607482");
    gradient.addColorStop(0.65, "#87959c");
    gradient.addColorStop(1, "#a8ada9");
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  if (kind === "rain") {
    context.strokeStyle = "rgba(220, 230, 234, 0.13)";
    context.lineWidth = 1;
    for (let x = 18; x < 256; x += 29) {
      context.beginPath();
      context.moveTo(x, 12 + (x % 21));
      context.lineTo(x - 10, 102 + (x % 47));
      context.stroke();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.name = `VQ1C_FULL_OFFICE_${kind.toUpperCase()}_BACKDROP`;
  return texture;
}

function countNamedPrefix(root: Object3D, prefix: string) {
  let count = 0;
  root.traverse((object) => { if (object.name.startsWith(prefix)) count += 1; });
  return count;
}

export function Vq1cFullOfficeRuntime({ mode, showBounds, onBoundsReady, onValidation, onDiagnostics }: {
  mode: Vq1cEnvironmentMode;
  showBounds: boolean;
  onBoundsReady: (sphere: Sphere, center: Vector3) => void;
  onValidation: (result: Vq1cFullOfficeRuntimeValidation) => void;
  onDiagnostics: (diagnostics: Vq1cFullOfficeRuntimeDiagnostics) => void;
}) {
  const { scene: cachedModel } = useGLTF(VQ1C_FULL_OFFICE_PBR_PATH);
  const model = useMemo(() => cachedModel.clone(true), [cachedModel]);
  const { camera, gl, scene: runtimeScene } = useThree();
  const preset = VQ1C_ENVIRONMENT_PRESETS[mode];
  const textures = useMemo(() => ({ clear: makeBackdropTexture("clear"), rain: makeBackdropTexture("rain") }), []);
  const modeChangesRef = useRef(0);
  const fpsRef = useRef({ elapsed: 0, frames: 0, value: 0 });

  useFrame((_, delta) => {
    const sample = fpsRef.current;
    sample.elapsed += delta;
    sample.frames += 1;
    if (sample.elapsed >= 1) {
      sample.value = sample.frames / sample.elapsed;
      sample.elapsed = 0;
      sample.frames = 0;
      const diagnostic = window.__VQ1C_FULL_OFFICE_QA__;
      if (diagnostic?.sceneUuid === model.uuid) {
        diagnostic.observedFps = sample.value;
        diagnostic.cameraPosition = camera.position.toArray() as [number, number, number];
        diagnostic.renderer = {
          calls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
        };
      }
    }
  });

  const modelData = useMemo(() => {
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    const sphere = new Sphere();
    const center = new Vector3();
    box.getBoundingSphere(sphere);
    box.getCenter(center);
    const lamps = [1, 2, 3, 4].map((number) => {
      const workstation = model.getObjectByName(`OFFICE_WORKSTATION_DESK_${number}_ROOT`);
      const anchor = workstation?.getObjectByName(`D${number}_LIGHT_DESK_ANCHOR`);
      if (!workstation || !anchor) throw new Error(`desk_${number} LIGHT_DESK_ANCHOR missing from full-office GLB`);
      return {
        deskId: `desk_${number}`,
        position: anchor.getWorldPosition(new Vector3()),
        direction: new Vector3(0, -1, 0),
        target: new Object3D(),
      };
    });
    const validation = validateVq1cFullOfficeRuntimeScene(model);
    return { box, sphere, center, lamps, validation };
  }, [model]);

  useEffect(() => {
    onBoundsReady(modelData.sphere.clone(), modelData.center.clone());
    onValidation(modelData.validation);
    if (modelData.validation.ok) console.info("VQ1C_FULL_OFFICE_RUNTIME_MODEL_VALIDATE_OK", modelData.validation);
    else console.error("VQ1C_FULL_OFFICE_RUNTIME_MODEL_VALIDATE_FAIL", modelData.validation.errors);
  }, [modelData, onBoundsReady, onValidation]);

  useEffect(() => {
    const previous = {
      outputColorSpace: gl.outputColorSpace,
      toneMapping: gl.toneMapping,
      exposure: gl.toneMappingExposure,
      background: runtimeScene.background,
      environment: runtimeScene.environment,
      environmentIntensity: runtimeScene.environmentIntensity,
      fog: runtimeScene.fog,
    };
    const pmrem = new PMREMGenerator(gl);
    const environmentScene = new RoomEnvironment();
    const environment = pmrem.fromScene(environmentScene, 0.04).texture;
    environmentScene.dispose();
    environment.name = "VQ1C_FULL_OFFICE_ROOM_ENVIRONMENT";
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    runtimeScene.environment = environment;
    return () => {
      gl.outputColorSpace = previous.outputColorSpace;
      gl.toneMapping = previous.toneMapping;
      gl.toneMappingExposure = previous.exposure;
      runtimeScene.background = previous.background;
      runtimeScene.environment = previous.environment;
      runtimeScene.environmentIntensity = previous.environmentIntensity;
      runtimeScene.fog = previous.fog;
      environment.dispose();
      pmrem.dispose();
    };
  }, [gl, runtimeScene]);

  useEffect(() => {
    gl.toneMappingExposure = preset.toneMappingExposure;
    runtimeScene.background = new Color(preset.backgroundColor);
    runtimeScene.environmentIntensity = preset.environmentIntensity;
    runtimeScene.fog = preset.fog ? new Fog(preset.fog.color, 18, 44) : null;
    gl.shadowMap.needsUpdate = true;
  }, [gl, preset, runtimeScene]);

  useEffect(() => {
    for (const lamp of modelData.lamps) {
      lamp.target.position.copy(lamp.position).addScaledVector(lamp.direction, 1.2);
      lamp.target.updateMatrixWorld(true);
    }
  }, [modelData]);

  useEffect(() => {
    modeChangesRef.current += 1;
    const lights: Object3D[] = [];
    runtimeScene.traverse((object) => {
      if (object.name === "VQ1C_FULL_OFFICE_DESK_LIGHT") lights.push(object);
    });
    const diagnostic: Vq1cFullOfficeRuntimeDiagnostics = {
      mode,
      sceneUuid: model.uuid,
      cameraUuid: camera.uuid,
      cameraPosition: camera.position.toArray() as [number, number, number],
      validation: modelData.validation,
      deskLights: lights.length,
      enabledDeskLights: lights.filter((light) => light.visible && "intensity" in light && Number(light.intensity) > 0).length,
      deskLightPositions: modelData.lamps.map((lamp) => lamp.position.toArray() as [number, number, number]),
      deskLightDirections: modelData.lamps.map((lamp) => lamp.direction.toArray() as [number, number, number]),
      windowBackdrops: countNamedPrefix(runtimeScene, "VQ1C_FULL_OFFICE_WINDOW_BACKDROP"),
      modeChanges: modeChangesRef.current,
      observedFps: fpsRef.current.value,
      renderer: {
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      },
    };
    window.__VQ1C_FULL_OFFICE_QA__ = diagnostic;
    onDiagnostics(diagnostic);
    if (modelData.validation.ok) {
      console.info(mode === "clear-day"
        ? "VQ1C_FULL_OFFICE_CLEAR_DAY_VALIDATE_OK"
        : "VQ1C_FULL_OFFICE_RAIN_MOOD_VALIDATE_OK", diagnostic);
    }
    return () => {
      if (window.__VQ1C_FULL_OFFICE_QA__?.sceneUuid === model.uuid) {
        delete window.__VQ1C_FULL_OFFICE_QA__;
      }
    };
  }, [camera, gl, mode, model, modelData, onDiagnostics, runtimeScene]);

  useEffect(() => () => {
    textures.clear.dispose();
    textures.rain.dispose();
    for (const lamp of modelData.lamps) lamp.target.removeFromParent();
  }, [modelData, textures]);

  const rainEnabled = mode === "rain-mood";

  return (
    <>
      <primitive object={model} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      <hemisphereLight name="VQ1C_FULL_OFFICE_HEMISPHERE" color={preset.hemisphere.skyColor}
        groundColor={preset.hemisphere.groundColor} intensity={preset.hemisphere.intensity} />
      <directionalLight name="VQ1C_FULL_OFFICE_DIRECTIONAL" color={preset.directional.color}
        intensity={preset.directional.intensity} position={preset.directional.position}
        castShadow={preset.directional.castShadow} shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={9} shadow-camera-bottom={-9} shadow-camera-near={0.5}
        shadow-camera-far={30} shadow-bias={-0.00015} />
      {modelData.lamps.map((lamp) => (
        <group key={lamp.deskId}>
          <primitive object={lamp.target} />
          <spotLight name="VQ1C_FULL_OFFICE_DESK_LIGHT" userData={{ deskId: lamp.deskId }}
            position={lamp.position} target={lamp.target} color={preset.deskLamp.color}
            intensity={rainEnabled ? FULL_OFFICE_DESK_LIGHT_INTENSITY : 0}
            distance={2.1} angle={Math.PI / 6} penumbra={0.78}
            visible={rainEnabled} castShadow={false} />
        </group>
      ))}
      <mesh name="VQ1C_FULL_OFFICE_WINDOW_BACKDROP" position={[2.5, 2.6, -6.25]}
        castShadow={false} receiveShadow={false}>
        <planeGeometry args={[3.0, 1.6]} />
        <meshBasicMaterial map={textures[preset.windowBackdrop]} toneMapped={false} />
      </mesh>
      {showBounds && (
        <mesh position={modelData.center}>
          <boxGeometry args={modelData.box.getSize(new Vector3()).toArray()} />
          <meshBasicMaterial color="#ff0000" wireframe />
        </mesh>
      )}
    </>
  );
}

useGLTF.preload(VQ1C_FULL_OFFICE_PBR_PATH);
