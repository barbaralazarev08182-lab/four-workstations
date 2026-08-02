"use client";

/* Three.js renderer and scene state are intentionally restored when this QA component unmounts. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  ACESFilmicToneMapping, Box3, Color, Fog,
  Object3D, SRGBColorSpace, Sphere, SpotLight, Vector3,
} from "three";
import { VQ1C_ENVIRONMENT_PRESETS, type Vq1cEnvironmentMode } from "@/lib/three/vq1cEnvironmentPresets";
import { validateVq1cRuntimeScene, type Vq1cRuntimeValidation } from "@/lib/three/validateVq1cRuntimeScene";
import {
  createVq1cBackdropTexture, createVq1cRoomEnvironment,
  resolveVq1cDeskLightTransform, VQ1C_PBR_PATH,
} from "@/lib/three/vq1cRuntime";

export { VQ1C_PBR_PATH } from "@/lib/three/vq1cRuntime";

export interface Vq1cRuntimeDiagnostics {
  mode: Vq1cEnvironmentMode;
  sceneUuid: string;
  validation: Vq1cRuntimeValidation;
  anchorPosition: [number, number, number];
  anchorEncodedDirection: [number, number, number];
  anchorDirection: [number, number, number];
  cameraPosition: [number, number, number];
  deskLights: number;
  windowBackdrops: number;
  renderer: { calls: number; triangles: number; geometries: number; textures: number };
}

declare global {
  interface Window { __VQ1C_RUNTIME_QA__?: Vq1cRuntimeDiagnostics }
}

export function Vq1cHeroCornerRuntime({ mode, showBounds, onBoundsReady, onValidation, onDiagnostics }: {
  mode: Vq1cEnvironmentMode;
  showBounds: boolean;
  onBoundsReady: (sphere: Sphere, center: Vector3) => void;
  onValidation: (result: Vq1cRuntimeValidation) => void;
  onDiagnostics: (diagnostics: Vq1cRuntimeDiagnostics) => void;
}) {
  const { scene: model } = useGLTF(VQ1C_PBR_PATH);
  const { camera, gl, scene: runtimeScene } = useThree();
  const deskLightRef = useRef<SpotLight>(null);
  const deskTarget = useMemo(() => new Object3D(), []);
  const preset = VQ1C_ENVIRONMENT_PRESETS[mode];
  const textures = useMemo(() => ({
    clear: createVq1cBackdropTexture("clear", "VQ1C_RUNTIME_CLEAR_BACKDROP"),
    rain: createVq1cBackdropTexture("rain", "VQ1C_RUNTIME_RAIN_BACKDROP"),
  }), []);

  const modelData = useMemo(() => {
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    const sphere = new Sphere();
    const center = new Vector3();
    box.getBoundingSphere(sphere);
    box.getCenter(center);
    const { position, encodedDirection, direction } = resolveVq1cDeskLightTransform(model);
    return { box, sphere, center, position, encodedDirection, direction, validation: validateVq1cRuntimeScene(model) };
  }, [model]);

  useEffect(() => {
    onBoundsReady(modelData.sphere.clone(), modelData.center.clone());
    onValidation(modelData.validation);
    if (modelData.validation.ok) console.info("VQ1C_RUNTIME_MODEL_VALIDATE_OK", modelData.validation);
    else console.error("VQ1C_RUNTIME_MODEL_VALIDATE_FAIL", modelData.validation.errors);
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
    const environment = createVq1cRoomEnvironment(gl, "VQ1C_RUNTIME_ROOM_ENVIRONMENT");
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    runtimeScene.environment = environment.texture;
    return () => {
      gl.outputColorSpace = previous.outputColorSpace;
      gl.toneMapping = previous.toneMapping;
      gl.toneMappingExposure = previous.exposure;
      runtimeScene.background = previous.background;
      runtimeScene.environment = previous.environment;
      runtimeScene.environmentIntensity = previous.environmentIntensity;
      runtimeScene.fog = previous.fog;
      environment.dispose();
    };
  }, [gl, runtimeScene]);

  useEffect(() => {
    gl.toneMappingExposure = preset.toneMappingExposure;
    runtimeScene.background = new Color(preset.backgroundColor);
    runtimeScene.environmentIntensity = preset.environmentIntensity;
    runtimeScene.fog = preset.fog ? new Fog(preset.fog.color, preset.fog.near, preset.fog.far) : null;
    gl.shadowMap.needsUpdate = true;
  }, [gl, preset, runtimeScene]);

  useEffect(() => {
    const light = deskLightRef.current;
    if (!light) return;
    deskTarget.position.copy(modelData.position).addScaledVector(modelData.direction, 1.2);
    light.target = deskTarget;
    deskTarget.updateMatrixWorld(true);
  }, [deskTarget, modelData]);

  useEffect(() => {
    const diagnostic: Vq1cRuntimeDiagnostics = {
      mode,
      sceneUuid: model.uuid,
      validation: modelData.validation,
      anchorPosition: modelData.position.toArray() as [number, number, number],
      anchorEncodedDirection: modelData.encodedDirection.toArray() as [number, number, number],
      anchorDirection: modelData.direction.toArray() as [number, number, number],
      cameraPosition: camera.position.toArray() as [number, number, number],
      deskLights: runtimeScene.getObjectsByProperty("name", "VQ1C_RUNTIME_DESK_LAMP").length,
      windowBackdrops: runtimeScene.getObjectsByProperty("name", "VQ1C_RUNTIME_WINDOW_BACKDROP").length,
      renderer: {
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      },
    };
    window.__VQ1C_RUNTIME_QA__ = diagnostic;
    onDiagnostics(diagnostic);
    if (modelData.validation.ok) {
      console.info(mode === "clear-day" ? "VQ1C_RUNTIME_CLEAR_DAY_VALIDATE_OK" : "VQ1C_RUNTIME_RAIN_MOOD_VALIDATE_OK", diagnostic);
    }
  }, [camera, gl, mode, model, modelData, onDiagnostics, runtimeScene]);

  useEffect(() => () => {
    textures.clear.dispose();
    textures.rain.dispose();
    delete window.__VQ1C_RUNTIME_QA__;
  }, [textures]);

  return (
    <>
      <primitive object={model} />
      <primitive object={deskTarget} />
      <hemisphereLight name="VQ1C_RUNTIME_HEMISPHERE" color={preset.hemisphere.skyColor}
        groundColor={preset.hemisphere.groundColor} intensity={preset.hemisphere.intensity} />
      <directionalLight name="VQ1C_RUNTIME_DIRECTIONAL" color={preset.directional.color}
        intensity={preset.directional.intensity} position={preset.directional.position}
        castShadow={preset.directional.castShadow} shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} shadow-camera-left={-4} shadow-camera-right={4}
        shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-near={0.5}
        shadow-camera-far={14} shadow-bias={-0.00015} />
      <spotLight ref={deskLightRef} name="VQ1C_RUNTIME_DESK_LAMP" position={modelData.position}
        color={preset.deskLamp.color} intensity={preset.deskLamp.intensity}
        distance={preset.deskLamp.distance} angle={preset.deskLamp.angle}
        penumbra={preset.deskLamp.penumbra} visible={preset.deskLamp.enabled} castShadow={false} />
      <mesh name="VQ1C_RUNTIME_WINDOW_BACKDROP" position={[0.85, 2.08, 1.6]}
        rotation={[Math.PI / 2, 0, 0]} castShadow={false} receiveShadow={false}>
        <planeGeometry args={[1.82, 1.48]} />
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

useGLTF.preload(VQ1C_PBR_PATH);
