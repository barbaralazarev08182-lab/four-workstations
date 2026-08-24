"use client";

/* VQ-1C Character Gate 5B: four colored QA characters in the frozen office.
 * One shared GLB geometry; 4 material instances differ ONLY in baseColorMap.
 * Two-scene rendering preserved: character scene renders once after the office
 * with color/depth preserved; the office never contains a character light. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Box3, Mesh, MeshStandardMaterial, Object3D, Scene, SpotLight, Vector3 } from "three";

import { Vq1cOfficeWorldScene } from "@/components/office-3d/Vq1cOfficeWorldScene";

export const VQ1C_CHARACTER_QA_GLB_PATH = "/models/vq1/characters/qa/vq1c-character-base-r1.glb";
const PALETTE_DIR = "/models/vq1/characters/qa/palettes/";

export const CHARACTER_VARIANTS = {
  ming: { name: "ming", scale: 0.85, position: [-1.95, 0, -1.45] as [number, number, number], yaw: Math.PI / 2 },
  hong: { name: "hong", scale: 0.85, position: [1.95, 0, 1.45] as [number, number, number], yaw: -Math.PI / 2 },
  jie: { name: "jie", scale: 0.85, position: [-1.95, 0, 1.45] as [number, number, number], yaw: Math.PI / 2 },
  qixi: { name: "qixi", scale: 0.85, position: [1.95, 0, -1.45] as [number, number, number], yaw: -Math.PI / 2 },
} as const;

const CHARACTER_SPOTLIGHTS = {
  ming: { position: [-1.40, 2.35, -1.45] as [number, number, number], target: [-1.95, 0.6, -1.45] as [number, number, number] },
  hong: { position: [1.40, 2.35, 1.45] as [number, number, number], target: [1.95, 0.6, 1.45] as [number, number, number] },
  jie: { position: [-1.40, 2.35, 1.45] as [number, number, number], target: [-1.95, 0.6, 1.45] as [number, number, number] },
  qixi: { position: [1.40, 2.35, -1.45] as [number, number, number], target: [1.95, 0.6, -1.45] as [number, number, number] },
} as const;

const SPOT = { color: "#FFE8C8", intensity: 35, distance: 4.0, angle: 0.5, penumbra: 0.75, decay: 2, castShadow: false };

export function Vq1cCharacterQaScene() {
  const { scene: sourceScene } = useGLTF(VQ1C_CHARACTER_QA_GLB_PATH);
  const { gl, scene: officeScene, camera } = useThree();
  const [spotEnabled] = useState(
    () => typeof window === "undefined" || new URLSearchParams(window.location.search).get("vq1cSpot") !== "0",
  );
  const baseColors = useTexture({
    ming: PALETTE_DIR + "vq1c-character-basecolor-ming.png",
    hong: PALETTE_DIR + "vq1c-character-basecolor-hong.png",
    jie: PALETTE_DIR + "vq1c-character-basecolor-jie.png",
    qixi: PALETTE_DIR + "vq1c-character-basecolor-qixi.png",
  });

  const characterScene = useMemo(() => new Scene(), []);
  const spotRefs = useRef<Record<string, SpotLight | null>>({});
  const [frameInfo, setFrameInfo] = useState({ office: 0, character: 0 });

  // Shared geometry: one clone of the GLB; per variant ONE mesh sharing the
  // base geometry with a material instance whose map differs only.
  useLayoutEffect(() => {
    characterScene.clear();
    const sourceMeshes: Mesh[] = [];
    sourceScene.traverse((o) => { if ((o as Mesh).isMesh) sourceMeshes.push(o as Mesh); });

    for (const key of ["ming", "hong", "jie", "qixi"] as const) {
      const v = CHARACTER_VARIANTS[key];
      const s = CHARACTER_SPOTLIGHTS[key];
      const root = new Object3D();
      root.name = `VQ1C_CHARACTER_${key.toUpperCase()}`;
      root.position.set(...v.position);
      root.rotation.set(0, v.yaw, 0);
      root.scale.set(v.scale, v.scale, v.scale);

      for (const src of sourceMeshes) {
        const mesh = new Mesh(src.geometry, src.material as never); // shares geometry
        mesh.name = src.name || key;
        root.add(mesh);
      }
      characterScene.add(root);

      // per-variant material: clone base material, swap only the map
      for (const child of root.children) {
        const m = child as Mesh;
        if (!m.isMesh) continue;
        const mat = new MeshStandardMaterial();
        const src = sourceMeshes[0]?.material as MeshStandardMaterial | undefined;
        if (src) {
          mat.map = baseColors[key];
          mat.normalMap = src.normalMap;
          mat.roughnessMap = src.roughnessMap;
          mat.metalnessMap = src.metalnessMap;
          mat.roughness = src.roughness;
          mat.metalness = src.metalness;
        }
        m.material = mat;
      }

      const target = new Object3D();
      target.position.set(...s.target);
      characterScene.add(target);
      const spot = new SpotLight(SPOT.color, SPOT.intensity, SPOT.distance, SPOT.angle, SPOT.penumbra, SPOT.decay);
      spot.position.set(...s.position);
      spot.target = target;
      spot.castShadow = false;
      spot.visible = spotEnabled;
      characterScene.add(spot);
      spotRefs.current[key] = spot;
    }

    return () => { characterScene.clear(); spotRefs.current = {}; };
  }, [baseColors, characterScene, sourceScene, spotEnabled]);

  useFrame(() => {
    const prev = gl.autoClear;
    gl.autoClear = true;
    gl.render(officeScene, camera);
    gl.autoClear = false;
    if (spotEnabled) gl.render(characterScene, camera);
    gl.autoClear = prev;
    setFrameInfo((f) => ({ office: f.office + 1, character: f.character + (spotEnabled ? 1 : 0) }));
  }, 1);

  useEffect(() => {
    const handle = window as unknown as Record<string, unknown>;
    handle.__VQ1C_FRAME__ = frameInfo;
    handle.__VQ1C_CHARACTER_QA__ = {
      frameInfo,
      variants: CHARACTER_VARIANTS,
      spotlights: CHARACTER_SPOTLIGHTS,
      spotParams: SPOT,
      spotOnlyInCharacterScene: true,
    };
    return () => { delete handle.__VQ1C_FRAME__; delete handle.__VQ1C_CHARACTER_QA__; };
  }, [frameInfo]);

  return (
    <group>
      <Vq1cOfficeWorldScene mode="day" onDiagnostics={() => undefined} />
    </group>
  );
}

useGLTF.preload(VQ1C_CHARACTER_QA_GLB_PATH);
