"use client";

/* VP2-4A: QA-only overlay of the approved lightmapped Coffee Corner.
   - Loads the lookdev GLB + lightmap + manifest exactly once (per office runtime mount).
   - Clones the lookdev model once; materials cloned by original UUID and shared.
   - Lightmap applied through the native MeshStandardMaterial.lightMap pipeline.
   - In QA mode only: hides the OLD coffee visual meshes (exact names under OFFICE_COFFEE_ROOT)
     and shows the new corner; restores everything on exit.
   - Never mutates the loader cache, never touches the office GLB file. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, LinearSRGBColorSpace,
  Mesh, MeshStandardMaterial, Object3D, Texture, TextureLoader, type WebGLRenderer,
} from "three";
import {
  VQ1C_COFFEE_LIGHTMAPPED_GLB_PATH, VQ1C_COFFEE_LIGHTMAP_PATH, VQ1C_COFFEE_MANIFEST_PATH,
} from "@/lib/three/vq1cRuntime";

export const VQ1C_COFFEE_LIGHTMAP_INTENSITY = 4.213;

/* Old coffee visual = exactly these 11 meshes, direct children of OFFICE_COFFEE_ROOT. */
export const VQ1C_COFFEE_VISUAL_MESH_NAMES = new Set([
  "COFFEE_ACCENT_BUTTON", "COFFEE_CABINET", "COFFEE_CABINET_TOP", "COFFEE_CONTROL_PANEL",
  "COFFEE_CUP_1", "COFFEE_CUP_2", "COFFEE_DISPENSE", "COFFEE_DRIP_TRAY",
  "COFFEE_MACHINE_BODY", "COFFEE_MACHINE_HEAD", "COFFEE_TRAY",
]);

/* Deterministic placement derived from the office contract:
   - x: centered on OFFICE_COFFEE_ROOT / OFFICE_COFFEE_INTERACTION_ANCHOR (-0.8)
   - y: ground at office floor (0)
   - z: lookdev wall front (local z=0) at office back wall inner face (-5.98)
   - rotation 180° about Y: lookdev front (-Z) faces the office room (+Z)
   - scale 1 (no adaptation needed; old footprint 1.72 x 0.59 vs new 2.65 x 0.62, no conflicts) */
export const VQ1C_COFFEE_QA_TRANSFORM = {
  position: [-0.8, 0, -5.98] as const,
  rotation: [0, Math.PI, 0] as const,
  scale: [1, 1, 1] as const,
};

export interface Vq1cCoffeeLightmapQaState {
  oldCoffeeMeshes: number;
  oldCoffeeHidden: boolean;
  lookdevVisible: boolean;
  lookdevMeshes: number;
  lookdevMaterials: number;
  lookdevTriangles: number;
  lightmapUuid: string | null;
  lightmapIntensity: number;
  manifestOk: boolean | null;
  manifestError: string | null;
  requests: { glb: number; lightmap: number; manifest: number };
}

interface CreatedBundle {
  model: Object3D;
  lightmap: Texture;
  materials: MeshStandardMaterial[];
  stats: { lookdevMeshes: number; lookdevMaterials: number; lookdevTriangles: number };
}

function createLightmapTexture(gl: WebGLRenderer): Texture {
  const texture = new TextureLoader().load(VQ1C_COFFEE_LIGHTMAP_PATH);
  texture.flipY = false;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.channel = 1;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
  texture.needsUpdate = true;
  return texture;
}

export function Vq1cCoffeeLightmapQaLayer({
  active,
  officeModel,
  onState,
}: {
  active: boolean;
  officeModel: Object3D | null;
  onState?: (state: Vq1cCoffeeLightmapQaState) => void;
}) {
  const { gl } = useThree();
  const { scene: cachedScene } = useGLTF(VQ1C_COFFEE_LIGHTMAPPED_GLB_PATH);
  const manifestRef = useRef<{ ok: boolean; error: string | null }>({ ok: false, error: "not loaded" });
  const manifestLoadedRef = useRef(false);
  const hiddenRef = useRef<{ mesh: Object3D; prev: boolean }[]>([]);

  /* Single creation of the cloned model + lightmap. The lookdev GLB resolves through
     useGLTF's suspense before the first successful render, so cachedScene is ready here. */
  const [created] = useState<CreatedBundle | null>(() => {
    if (!cachedScene) return null;
    const lightmap = createLightmapTexture(gl);
    const clone = cachedScene.clone(true);
    const clones = new Map<string, MeshStandardMaterial>();
    let meshes = 0;
    let triangles = 0;
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      meshes += 1;
      const geometry = mesh.geometry;
      if (geometry) {
        triangles += geometry.index ? geometry.index.count / 3 : (geometry.attributes?.position?.count ?? 0) / 3;
      }
      const assigned = mesh.material;
      const mats = Array.isArray(assigned) ? assigned : [assigned];
      const newMats = mats.map((mat) => {
        if (!mat) return mat;
        const standard = mat as MeshStandardMaterial;
        let materialClone = clones.get(standard.uuid);
        if (!materialClone) {
          materialClone = standard.clone();
          materialClone.lightMap = lightmap;
          materialClone.lightMapIntensity = VQ1C_COFFEE_LIGHTMAP_INTENSITY;
          materialClone.needsUpdate = true;
          clones.set(standard.uuid, materialClone);
        }
        return materialClone;
      });
      mesh.material = newMats.length === 1 ? newMats[0] : newMats;
    });
    clone.visible = false;
    return {
      model: clone,
      lightmap,
      materials: [...clones.values()],
      stats: { lookdevMeshes: meshes, lookdevMaterials: clones.size, lookdevTriangles: triangles },
    };
  });

  /* Manifest: fetch + validate once. */
  useEffect(() => {
    if (manifestLoadedRef.current) return;
    manifestLoadedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(VQ1C_COFFEE_MANIFEST_PATH);
        const manifest = await response.json();
        const lm = manifest.lightmaps?.[0];
        const errors: string[] = [];
        if (manifest.rootName !== "VQ1C_CoffeeCorner_Runtime") errors.push(`rootName=${manifest.rootName}`);
        if (manifest.meshCount !== 12) errors.push(`meshCount=${manifest.meshCount}`);
        if (manifest.materialCount !== 18) errors.push(`materialCount=${manifest.materialCount}`);
        if (manifest.triangleCount !== 3420) errors.push(`triangleCount=${manifest.triangleCount}`);
        if (manifest.texcoord0Present !== true) errors.push("texcoord0Present=false");
        if (manifest.texcoord1Present !== true) errors.push("texcoord1Present=false");
        if (manifest.lightsInGlb !== 0) errors.push(`lightsInGlb=${manifest.lightsInGlb}`);
        if (manifest.camerasInGlb !== 0) errors.push(`camerasInGlb=${manifest.camerasInGlb}`);
        if (!lm || lm.uvSet !== "TEXCOORD_1") errors.push(`lightmap uvSet=${lm?.uvSet}`);
        if (!lm || Math.abs(lm.intensity - VQ1C_COFFEE_LIGHTMAP_INTENSITY) > 0.001) errors.push(`intensity=${lm?.intensity}`);
        if (!cancelled) {
          manifestRef.current = { ok: errors.length === 0, error: errors.join("; ") || null };
        }
      } catch (error) {
        if (!cancelled) manifestRef.current = { ok: false, error: String(error) };
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Apply / restore the QA overlay on mode change. */
  useEffect(() => {
    if (!officeModel || !created) return;
    if (active) {
      hiddenRef.current = [];
      const coffeeRoot = officeModel.getObjectByName("OFFICE_COFFEE_ROOT");
      if (coffeeRoot) {
        coffeeRoot.children.forEach((child) => {
          const mesh = child as unknown as { isMesh?: boolean };
          if (mesh.isMesh && VQ1C_COFFEE_VISUAL_MESH_NAMES.has(child.name)) {
            hiddenRef.current.push({ mesh: child, prev: child.visible });
            child.visible = false;
          }
        });
      }
      created.model.visible = true;
    } else {
      for (const hidden of hiddenRef.current) hidden.mesh.visible = hidden.prev;
      hiddenRef.current = [];
      created.model.visible = false;
    }
    if (onState) {
      onState({
        oldCoffeeMeshes: hiddenRef.current.length,
        oldCoffeeHidden: active && hiddenRef.current.length > 0,
        lookdevVisible: active && created.model.visible,
        lookdevMeshes: created.stats.lookdevMeshes,
        lookdevMaterials: created.stats.lookdevMaterials,
        lookdevTriangles: created.stats.lookdevTriangles,
        lightmapUuid: created.lightmap.uuid,
        lightmapIntensity: VQ1C_COFFEE_LIGHTMAP_INTENSITY,
        manifestOk: manifestRef.current.ok,
        manifestError: manifestRef.current.error,
        requests: {
          glb: performance.getEntriesByType("resource").filter((e) => e.name.includes("lightmapped-r1.glb")).length,
          lightmap: performance.getEntriesByType("resource").filter((e) => e.name.includes("coffee-corner-lightmap.png")).length,
          manifest: performance.getEntriesByType("resource").filter((e) => e.name.includes("runtime-manifest-r1.json")).length,
        },
      });
    }
  }, [active, created, officeModel, onState]);

  /* Dispose only QA-owned resources (cloned materials + lightmap texture). Shared geometry
     and the loader cache are left untouched. */
  useEffect(() => () => {
    if (!created) return;
    for (const material of created.materials) material.dispose();
    created.lightmap.dispose();
  }, [created]);

  if (!created) return null;
  return (
    <primitive
      object={created.model}
      position={VQ1C_COFFEE_QA_TRANSFORM.position}
      rotation={VQ1C_COFFEE_QA_TRANSFORM.rotation}
      scale={VQ1C_COFFEE_QA_TRANSFORM.scale}
    />
  );
}
