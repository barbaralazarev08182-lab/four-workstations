"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * VQ-1C Animated Character Final Integration.
 *
 * All four office characters (ming / hong / jie / qixi) are rendered from
 * Quaternius glTF models. Each model is cloned with SkeletonUtils.clone so that
 * every SkinnedMesh is bound to the clone's OWN skeleton (the source glTF scene
 * bones are never referenced). This keeps 62/62 bones inside the proxy hierarchy.
 *
 * Characters are drawn in a dedicated `characterScene` as a second render pass
 * (Two-Scene architecture). Each character is lit by its own SpotLight. Animation
 * state (Idle / Walk) is driven by business-root movement: the business root
 * remains the single source of truth for position; Walk is an in-place clip and
 * the root is responsible for path displacement.
 */

const MING_PATH = "/models/vq1/characters/quaternius/ming/Casual_Hoodie.gltf";
const HONG_PATH = "/models/vq1/characters/quaternius/hong/Formal.gltf";
const JIE_PATH = "/models/vq1/characters/quaternius/jie/Suit.gltf";
const QIXI_PATH = "/models/vq1/characters/quaternius/qixi/Casual.gltf";

interface CharacterModelConfig {
  path: string;
  scale: number;
}

const CHARACTER_MODELS: Record<string, CharacterModelConfig> = {
  ming: { path: MING_PATH, scale: 0.905 },
  hong: { path: HONG_PATH, scale: 0.918 },
  jie: { path: JIE_PATH, scale: 0.911 },
  qixi: { path: QIXI_PATH, scale: 0.914 },
};

const MOVE_EPSILON = 0.0003;
const STILL_FRAMES_TO_IDLE = 4;
const CROSSFADE = 0.18;
const VIEW_LIGHT_DIR = new THREE.Vector3(10.8, 0, 14.5).normalize();
const VIEW_LIGHT_OFFSET = 0.55;

interface CharacterRuntime {
  clone: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  idleAction: THREE.AnimationAction | null;
  walkAction: THREE.AnimationAction | null;
  current: THREE.AnimationAction | null;
  spot: THREE.SpotLight;
  prevPos: THREE.Vector3;
  stillCount: number;
  moving: boolean;
}

function findClip(animations: THREE.AnimationClip[], names: string[]): THREE.AnimationClip | null {
  for (const n of names) {
    const found = animations.find((a) => a.name.toLowerCase() === n.toLowerCase());
    if (found) return found;
  }
  return null;
}

const _wp = new THREE.Vector3();

export function NewCharacterVisuals({ users }: { users: { id: string; displayName?: string }[] }) {
  const { scene: officeScene, camera, gl } = useThree();
  const characterScene = useMemo(() => new THREE.Scene(), []);
  const runtime = useRef<Record<string, CharacterRuntime>>({});
  const userKey = useMemo(() => users.map((u) => u.id).sort().join(","), [users]);

  const mingGltf = useGLTF(CHARACTER_MODELS.ming.path);
  const hongGltf = useGLTF(CHARACTER_MODELS.hong.path);
  const jieGltf = useGLTF(CHARACTER_MODELS.jie.path);
  const qixiGltf = useGLTF(CHARACTER_MODELS.qixi.path);

  const gltfFor = (id: string): { scene: THREE.Object3D; animations: THREE.AnimationClip[] } | null => {
    switch (id) {
      case "ming":
        return mingGltf;
      case "hong":
        return hongGltf;
      case "jie":
        return jieGltf;
      case "qixi":
        return qixiGltf;
      default:
        return null;
    }
  };

  useLayoutEffect(() => {
    const created: string[] = [];
    for (const u of users) {
      const cfg = CHARACTER_MODELS[u.id];
      const gltf = gltfFor(u.id);
      if (!cfg || !gltf) continue;

      const clone = cloneSkeleton(gltf.scene);
      clone.scale.setScalar(cfg.scale);

      const mixer = new THREE.AnimationMixer(clone);
      const idleClip = findClip(gltf.animations, ["Idle"]);
      const walkClip = findClip(gltf.animations, ["Walk"]);
      const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;

      if (idleAction) {
        idleAction.play();
        idleAction.setEffectiveWeight(1);
      }

      const spot = new THREE.SpotLight("#FFE8C8", 35, 4, 0.5, 0.75, 2);
      spot.castShadow = false;
      spot.target.position.set(0, 0.62, 0);

      characterScene.add(clone, spot, spot.target);

      runtime.current[u.id] = {
        clone,
        mixer,
        idleAction,
        walkAction,
        current: idleAction,
        spot,
        prevPos: new THREE.Vector3(),
        stillCount: 0,
        moving: false,
      };
      created.push(u.id);
    }

    return () => {
      for (const id of created) {
        const r = runtime.current[id];
        if (!r) continue;
        characterScene.remove(r.clone, r.spot, r.spot.target);
        r.mixer.stopAllAction();
        r.mixer.uncacheRoot(r.clone);
      }
      for (const id of created) delete runtime.current[id];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, mingGltf, hongGltf, jieGltf, qixiGltf]);

  useFrame((_, delta) => {
    const r = runtime.current;
    for (const id in r) {
      const rt = r[id];
      const root = officeScene.getObjectByName(`characterRoot-${id}`);
      if (!root) continue;

      root.updateWorldMatrix(true, false);
      _wp.setFromMatrixPosition(root.matrixWorld);
      const m = root.matrixWorld.elements;
      const yaw = Math.atan2(-m[8], m[10]);

      const dist = rt.prevPos.lengthSq() === 0 ? 0 : _wp.distanceTo(rt.prevPos);
      if (dist > MOVE_EPSILON) {
        rt.moving = true;
        rt.stillCount = 0;
      } else {
        rt.stillCount++;
        if (rt.stillCount > STILL_FRAMES_TO_IDLE) rt.moving = false;
      }

      rt.clone.position.set(_wp.x, _wp.y, _wp.z);
      rt.clone.rotation.y = yaw;

      const target = rt.moving ? rt.walkAction ?? rt.idleAction : rt.idleAction;
      if (target && target !== rt.current) {
        target.reset();
        target.play();
        if (rt.current) {
          rt.current.crossFadeTo(target, CROSSFADE, false);
        } else {
          target.fadeIn(CROSSFADE);
        }
        rt.current = target;
      }

      rt.mixer.update(delta);

      rt.spot.position.set(
        _wp.x + VIEW_LIGHT_DIR.x * VIEW_LIGHT_OFFSET,
        _wp.y + 2.35,
        _wp.z + VIEW_LIGHT_DIR.z * VIEW_LIGHT_OFFSET,
      );
      rt.spot.target.position.set(_wp.x, _wp.y + 0.62, _wp.z);

      rt.prevPos.copy(_wp);
    }

    const prevAutoClear = gl.autoClear;
    gl.autoClear = true;
    gl.render(officeScene, camera);
    gl.autoClear = false;
    gl.render(characterScene, camera);
    gl.autoClear = prevAutoClear;
  }, 1);

  return null;
}

useGLTF.preload(MING_PATH);
useGLTF.preload(HONG_PATH);
useGLTF.preload(JIE_PATH);
useGLTF.preload(QIXI_PATH);
