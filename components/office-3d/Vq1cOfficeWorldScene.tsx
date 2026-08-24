"use client";

/* FR-6 final R3 direct-only lightmapped office (the approved final visual).
 * Replaces the legacy VP2 office GLB visual while keeping the component's
 * external API (mode, onDiagnostics) and the camera contract untouched.
 * Three.js renderer and scene state are intentionally restored on unmount. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  AgXToneMapping,
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import type { Mesh, MeshStandardMaterial, Texture } from "three";
import { clone as cloneScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import { OFFICE_CAMERA } from "@/components/office-3d/scene-config";
import {
  FINAL_OFFICE_CONTRAST,
  VQ1C_FINAL_OFFICE_GLB_PATH,
  VQ1C_FINAL_OFFICE_LIGHTMAP_0_PATH,
  VQ1C_FINAL_OFFICE_LIGHTMAP_1_PATH,
  VQ1C_FINAL_OFFICE_LIGHTMAP_INTENSITY,
  VQ1C_FINAL_OFFICE_MANIFEST_PATH,
} from "@/lib/three/vq1cRuntime";
import {
  validateVq1cFinalOfficeScene,
  VQ1C_FINAL_OFFICE_WORKSTATIONS,
  type Vq1cFinalOfficeValidation,
} from "@/lib/three/validateVq1cFinalOfficeRuntime";
import type { Vq1cFullOfficeRuntimeValidation } from "@/lib/three/validateVq1cFullOfficeRuntime";

export type Vq1cOfficeWorldMode = "day" | "night";

export interface Vq1cOfficeWorldDiagnostics {
  mode: Vq1cOfficeWorldMode;
  sourceSceneUuid: string;
  cloneUuid: string;
  validation: Vq1cFullOfficeRuntimeValidation;
  finalValidation: Vq1cFinalOfficeValidation;
  lightmapResolved: number;
  lightmapAssigned: number;
  materialInstances: number;
  contrastEnabled: boolean;
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

function toLegacyValidation(validation: Vq1cFinalOfficeValidation): Vq1cFullOfficeRuntimeValidation {
  return {
    ok: validation.ok,
    errors: validation.errors,
    rootCount: 1,
    meshes: validation.sceneMeshes,
    triangles: validation.triangles,
    materials: validation.materials,
    textures: 0,
    bounds: validation.bounds,
    officeAnchors: validation.officeAnchors,
    internalAnchors: validation.internalAnchors,
    workstations: VQ1C_FINAL_OFFICE_WORKSTATIONS.map((workstation) => ({
      id: `desk_${workstation.number}`,
      meshes: 0,
      triangles: 0,
      position: [...workstation.position],
      facing: [0, 0, 0],
      internalAnchors: 0,
      deviceAlignmentMaxError: 0,
    })),
  };
}

// Module-level cache: the manifest + lightmap textures are loaded once and
// shared by every mount (mirrors drei useGLTF caching). Repeated
// mount/unmount must not reload the atlases nor grow texture count.
let finalOfficeLightingPromise: Promise<{
  assignments: Record<string, number>;
  lightmaps: [Texture, Texture];
} | null> | null = null;

function loadFinalOfficeLighting() {
  if (finalOfficeLightingPromise === null) {
    finalOfficeLightingPromise = (async () => {
      const manifest = await (await fetch(VQ1C_FINAL_OFFICE_MANIFEST_PATH)).json();
      const loader = new TextureLoader();
      const [lightmap0, lightmap1] = await Promise.all([
        loader.loadAsync(VQ1C_FINAL_OFFICE_LIGHTMAP_0_PATH),
        loader.loadAsync(VQ1C_FINAL_OFFICE_LIGHTMAP_1_PATH),
      ]);
      for (const texture of [lightmap0, lightmap1]) {
        texture.flipY = false;
        texture.colorSpace = LinearSRGBColorSpace;
        texture.channel = 1;
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 8;
        texture.needsUpdate = true;
      }
      return {
        assignments: (manifest as { meshLightmapAssignments: Record<string, number> }).meshLightmapAssignments,
        lightmaps: [lightmap0, lightmap1] as [Texture, Texture],
      };
    })().catch((error) => {
      console.error("VQ1C_FINAL_OFFICE_LIGHTMAPS_LOAD_FAIL", error);
      return null;
    });
  }
  return finalOfficeLightingPromise;
}

export function Vq1cOfficeWorldScene({ mode, onDiagnostics }: {
  mode: Vq1cOfficeWorldMode;
  onDiagnostics: (diagnostics: Vq1cOfficeWorldDiagnostics) => void;
}) {
  const { scene: sourceScene } = useGLTF(VQ1C_FINAL_OFFICE_GLB_PATH);
  const model = useMemo(() => cloneScene(sourceScene), [sourceScene]);
  const { camera, gl, scene: runtimeScene } = useThree();

  const [lighting, setLighting] = useState<{
    assignments: Record<string, number>;
    lightmaps: [Texture, Texture];
  } | null>(null);
  const [resolution, setResolution] = useState<{ resolved: number; assigned: number; materialInstances: number } | null>(null);
  const [contrastEnabled] = useState(
    () => typeof window === "undefined" || new URLSearchParams(window.location.search).get("finalContrast") !== "0",
  );

  // load manifest + lightmaps (cached module-level; frozen contract:
  // channel 1, flipY false, LinearSRGB, ClampToEdge, mipmaps, anisotropy <= 8)
  useEffect(() => {
    let disposed = false;
    (async () => {
      const data = await loadFinalOfficeLighting();
      if (!disposed && data) setLighting(data);
    })();
    return () => {
      disposed = true;
    };
  }, []);

  // apply lightmaps to cloned materials only; resolve the runtime group by
  // walking the parent chain; a mesh without an assignment is a contract error.
  useEffect(() => {
    if (!lighting) return;
    let disposed = false;
    (async () => {
      await Promise.resolve();
      if (disposed) return;
      const { assignments, lightmaps } = lighting;
      const clonedByKey = new Map<string, MeshStandardMaterial>();
      let resolved = 0;
      model.traverse((object) => {
        if (!(object as Mesh).isMesh) return;
        const mesh = object as Mesh;
        let node: { name: string; parent: typeof node | null } = object as never;
        let group: string | null = null;
        while (node) {
          if (node.name && assignments[node.name] !== undefined) {
            group = node.name;
            break;
          }
          node = node.parent as never;
        }
        if (!group) throw new Error(`VQ1C_FINAL_OFFICE: no runtime group assignment for mesh "${object.name}"`);
        resolved += 1;
        const atlasIndex = assignments[group];
        const rawMaterials = mesh.material;
        const materialList = Array.isArray(rawMaterials) ? rawMaterials : [rawMaterials];
        const replaced = materialList.map((material) => {
          if (!material) return material;
          const key = `${material.uuid}|${atlasIndex}`;
          let clone = clonedByKey.get(key);
          if (!clone) {
            clone = material.clone() as MeshStandardMaterial;
            clone.lightMap = lightmaps[atlasIndex];
            clone.lightMapIntensity = VQ1C_FINAL_OFFICE_LIGHTMAP_INTENSITY;
            clone.needsUpdate = true;
            clonedByKey.set(key, clone);
          }          return clone;
        });
        mesh.material = materialList.length === 1 ? replaced[0] : replaced;
      });
      if (!disposed) setResolution({ resolved, assigned: resolved, materialInstances: clonedByKey.size });
    })();
    return () => {
      disposed = true;
    };
  }, [model, lighting]);

  // renderer + scene state: AgX, exposure 1.0, SRGB; lighting comes entirely
  // from the baked lightmap (environmentIntensity 0, no LookDev lights).
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
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = AgXToneMapping;
    gl.toneMappingExposure = 1.0;
    runtimeScene.background = new Color(0x2e3847);
    runtimeScene.environmentIntensity = 0;
    runtimeScene.fog = null;
    return () => {
      gl.outputColorSpace = previous.outputColorSpace;
      gl.toneMapping = previous.toneMapping;
      gl.toneMappingExposure = previous.exposure;
      runtimeScene.background = previous.background;
      runtimeScene.environment = previous.environment;
      runtimeScene.environmentIntensity = previous.environmentIntensity;
      runtimeScene.fog = previous.fog;
    };
  }, [gl, runtimeScene]);

  // display contrast applied to the WebGL canvas element only; DOM HUD
  // overlays are never filtered.
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.filter = contrastEnabled ? `contrast(${FINAL_OFFICE_CONTRAST})` : "";
    return () => {
      canvas.style.filter = "";
    };
  }, [gl, contrastEnabled]);

  const modelData = useMemo(() => {
    model.updateMatrixWorld(true);
    const validation = validateVq1cFinalOfficeScene(model);
    const root = model.getObjectByName("VQ1C_FULL_OFFICE_ROOT");
    if (!root) throw new Error("VQ1C_FULL_OFFICE_ROOT missing from cloned OfficeWorld model");
    return {
      validation,
      rootTransform: {
        position: root.position.toArray() as [number, number, number],
        rotation: [root.rotation.x, root.rotation.y, root.rotation.z] as [number, number, number],
        scale: root.scale.toArray() as [number, number, number],
      },
    };
  }, [model]);

  useEffect(() => {
    if (modelData.validation.ok) {
      console.info("VQ1C_FINAL_OFFICE_VALIDATE_OK", modelData.validation);
    } else {
      console.error("VQ1C_FINAL_OFFICE_VALIDATE_FAIL", modelData.validation.errors);
    }
  }, [modelData]);

  useEffect(() => {
    const diagnostics: Vq1cOfficeWorldDiagnostics = {
      mode,
      sourceSceneUuid: sourceScene.uuid,
      cloneUuid: model.uuid,
      validation: toLegacyValidation(modelData.validation),
      finalValidation: modelData.validation,
      lightmapResolved: resolution?.resolved ?? 0,
      lightmapAssigned: resolution?.assigned ?? 0,
      materialInstances: resolution?.materialInstances ?? 0,
      contrastEnabled,
      cameraPosition: camera.position.toArray() as [number, number, number],
      cameraZoom: "zoom" in camera ? camera.zoom : OFFICE_CAMERA.zoom,
      cameraNear: camera.near,
      cameraFar: camera.far,
      deskLights: 0,
      enabledDeskLights: 0,
      deskLightPositions: [],
      deskLightDirections: [],
      windowBackdrops: 0,
      rootTransform: modelData.rootTransform,
    };
    onDiagnostics(diagnostics);
    if (modelData.validation.ok && cameraMatchesContract(camera)) {
      console.info("VQ1C_FINAL_OFFICE_CAMERA_PRESERVED_OK", diagnostics.cameraPosition);
    }
  }, [camera, contrastEnabled, mode, model, modelData, onDiagnostics, resolution, sourceScene]);

  return (
    <group name="VQ1C_OFFICEWORLD_VISUAL">
      <primitive object={model} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
    </group>
  );
}

useGLTF.preload(VQ1C_FINAL_OFFICE_GLB_PATH);
