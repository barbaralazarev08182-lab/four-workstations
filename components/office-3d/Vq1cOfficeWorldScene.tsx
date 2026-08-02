"use client";

/* Three.js renderer and scene state are intentionally restored when this visual layer unmounts. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color, Fog, Object3D, SRGBColorSpace } from "three";
import { clone as cloneScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import { OFFICE_CAMERA } from "@/components/office-3d/scene-config";
import { VQ1C_ENVIRONMENT_PRESETS } from "@/lib/three/vq1cEnvironmentPresets";
import {
  countNamedObjects,
  createVq1cBackdropTexture,
  createVq1cRoomEnvironment,
  resolveVq1cFullOfficeDeskLights,
  VQ1C_FULL_OFFICE_PBR_PATH,
} from "@/lib/three/vq1cRuntime";
import {
  validateVq1cFullOfficeRuntimeScene,
  type Vq1cFullOfficeRuntimeValidation,
} from "@/lib/three/validateVq1cFullOfficeRuntime";

export type Vq1cOfficeWorldMode = "day" | "night";

export interface Vq1cOfficeWorldDiagnostics {
  mode: Vq1cOfficeWorldMode;
  sourceSceneUuid: string;
  cloneUuid: string;
  validation: Vq1cFullOfficeRuntimeValidation;
  cameraPosition: [number, number, number];
  cameraZoom: number;
  cameraNear: number;
  cameraFar: number;
  deskLights: number;
  enabledDeskLights: number;
  deskLightPositions: [number, number, number][];
  deskLightDirections: [number, number, number][];
  windowBackdrops: number;
  rootTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

const FORMAL_DESK_LIGHT_INTENSITY = 7;

function cameraMatchesContract(camera: {
  position: { toArray: () => number[] };
  zoom?: number;
  near: number;
  far: number;
}) {
  const position = camera.position.toArray();
  return position.every((value, index) => Math.abs(value - OFFICE_CAMERA.position[index]) <= 0.00001)
    && Math.abs((camera.zoom ?? OFFICE_CAMERA.zoom) - OFFICE_CAMERA.zoom) <= 0.00001
    && Math.abs(camera.near - OFFICE_CAMERA.near) <= 0.00001
    && Math.abs(camera.far - OFFICE_CAMERA.far) <= 0.00001;
}

export function Vq1cOfficeWorldScene({ mode, onDiagnostics }: {
  mode: Vq1cOfficeWorldMode;
  onDiagnostics: (diagnostics: Vq1cOfficeWorldDiagnostics) => void;
}) {
  const { scene: sourceScene } = useGLTF(VQ1C_FULL_OFFICE_PBR_PATH);
  const model = useMemo(() => cloneScene(sourceScene), [sourceScene]);
  const { camera, gl, scene: runtimeScene } = useThree();
  const preset = VQ1C_ENVIRONMENT_PRESETS[mode === "night" ? "rain-mood" : "clear-day"];
  const textures = useMemo(() => ({
    clear: createVq1cBackdropTexture("clear", "VQ1C_OFFICEWORLD_CLEAR_BACKDROP"),
    rain: createVq1cBackdropTexture("rain", "VQ1C_OFFICEWORLD_NIGHT_BACKDROP"),
  }), []);

  const modelData = useMemo(() => {
    model.updateMatrixWorld(true);
    const validation = validateVq1cFullOfficeRuntimeScene(model);
    const root = model.getObjectByName("VQ1C_FULL_OFFICE_ROOT");
    if (!root) throw new Error("VQ1C_FULL_OFFICE_ROOT missing from cloned OfficeWorld model");
    const lamps = resolveVq1cFullOfficeDeskLights(model);
    return {
      validation,
      lamps,
      rootTransform: {
        position: root.position.toArray() as [number, number, number],
        rotation: [root.rotation.x, root.rotation.y, root.rotation.z] as [number, number, number],
        scale: root.scale.toArray() as [number, number, number],
      },
    };
  }, [model]);

  useEffect(() => {
    if (modelData.validation.ok) {
      console.info("VQ1C_OFFICEWORLD_FULL_MODEL_VALIDATE_OK", modelData.validation);
    } else {
      console.error("VQ1C_OFFICEWORLD_FULL_MODEL_VALIDATE_FAIL", modelData.validation.errors);
    }
  }, [modelData]);

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
    const environment = createVq1cRoomEnvironment(gl, "VQ1C_OFFICEWORLD_ROOM_ENVIRONMENT");
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
    runtimeScene.fog = mode === "night" ? new Fog(preset.backgroundColor, 18, 44) : null;
    gl.shadowMap.needsUpdate = true;
  }, [gl, mode, preset, runtimeScene]);

  useEffect(() => {
    const lights: Object3D[] = [];
    runtimeScene.traverse((object) => {
      if (object.name === "VQ1C_OFFICEWORLD_DESK_LIGHT") lights.push(object);
    });
    const diagnostics: Vq1cOfficeWorldDiagnostics = {
      mode,
      sourceSceneUuid: sourceScene.uuid,
      cloneUuid: model.uuid,
      validation: modelData.validation,
      cameraPosition: camera.position.toArray() as [number, number, number],
      cameraZoom: "zoom" in camera ? camera.zoom : OFFICE_CAMERA.zoom,
      cameraNear: camera.near,
      cameraFar: camera.far,
      deskLights: lights.length,
      enabledDeskLights: lights.filter((light) => light.visible && "intensity" in light && Number(light.intensity) > 0).length,
      deskLightPositions: modelData.lamps.map((lamp) => lamp.position.toArray() as [number, number, number]),
      deskLightDirections: modelData.lamps.map((lamp) => lamp.direction.toArray() as [number, number, number]),
      windowBackdrops: countNamedObjects(runtimeScene, "VQ1C_OFFICEWORLD_WINDOW_BACKDROP"),
      rootTransform: modelData.rootTransform,
    };
    onDiagnostics(diagnostics);
    if (modelData.validation.ok && cameraMatchesContract(camera)) {
      console.info("VQ1C_OFFICEWORLD_FULL_CAMERA_PRESERVED_OK", diagnostics.cameraPosition);
    }
  }, [camera, mode, model, modelData, onDiagnostics, runtimeScene, sourceScene]);

  useEffect(() => () => {
    textures.clear.dispose();
    textures.rain.dispose();
    for (const lamp of modelData.lamps) lamp.target.removeFromParent();
  }, [modelData, textures]);

  const nightEnabled = mode === "night";

  return (
    <group name="VQ1C_OFFICEWORLD_VISUAL">
      <primitive object={model} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      <hemisphereLight name="VQ1C_OFFICEWORLD_HEMISPHERE" color={preset.hemisphere.skyColor}
        groundColor={preset.hemisphere.groundColor} intensity={preset.hemisphere.intensity} />
      <directionalLight name="VQ1C_OFFICEWORLD_DIRECTIONAL" color={preset.directional.color}
        intensity={preset.directional.intensity} position={preset.directional.position}
        castShadow={preset.directional.castShadow} shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={9} shadow-camera-bottom={-9} shadow-camera-near={0.5}
        shadow-camera-far={30} shadow-bias={-0.00015} />
      {modelData.lamps.map((lamp) => (
        <group key={lamp.deskId}>
          <primitive object={lamp.target} />
          <spotLight name="VQ1C_OFFICEWORLD_DESK_LIGHT" userData={{ deskId: lamp.deskId }}
            position={lamp.position} target={lamp.target} color={preset.deskLamp.color}
            intensity={nightEnabled ? FORMAL_DESK_LIGHT_INTENSITY : 0}
            distance={2.1} angle={Math.PI / 6} penumbra={0.78}
            visible={nightEnabled} castShadow={false} />
        </group>
      ))}
      <mesh name="VQ1C_OFFICEWORLD_WINDOW_BACKDROP" position={[2.5, 2.6, -6.25]}
        castShadow={false} receiveShadow={false}>
        <planeGeometry args={[3.0, 1.6]} />
        <meshBasicMaterial map={textures[mode === "night" ? "rain" : "clear"]} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(VQ1C_FULL_OFFICE_PBR_PATH);
