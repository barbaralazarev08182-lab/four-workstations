"use client";

/* QA-only lighting prototype (VP2-3A): soft directional window light, GTAO
 * contact occlusion and AgX output via the official three.js addon passes.
 * The component mounts only while the "shader-day" environment is active;
 * it restores every renderer property it touches and disposes all GPU
 * resources (composer, passes, render targets) on unmount.
 */
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AgXToneMapping,
  Box3,
  PCFSoftShadowMap,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type ShadowMapType,
  type ToneMapping,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { VQ1C_FULL_OFFICE_EXPECTED } from "@/lib/three/vq1cRuntime";

const AO_SCALE = 0.5;
const AO_RADIUS = 0.8;
const AO_BLEND_INTENSITY = 1.0;
const AO_SAMPLES = 16;

interface ShaderLook {
  composer: EffectComposer;
  gtao: GTAOPass;
}

interface RendererStateSnapshot {
  toneMapping: ToneMapping;
  toneMappingExposure: number;
  shadowMapType: ShadowMapType;
  outputColorSpace: string;
}

declare global {
  interface Window {
    __VQ1C_SHADER_DAY_DEBUG__?: {
      gl: THREE.WebGLRenderer;
      gtao: GTAOPass | null;
      liveComposers: number;
      composerCreations: number;
    };
  }
}

let composerCreations = 0;
let liveComposers = 0;

export function Vq1cFullOfficeShaderLook({ exposure }: { exposure: number }) {
  const { gl, scene, camera, size } = useThree();
  const lookRef = useRef<ShaderLook | null>(null);
  const snapshotRef = useRef<RendererStateSnapshot | null>(null);

  useEffect(() => {
    const buffer = gl.getDrawingBufferSize(new Vector2());
    const aoWidth = Math.max(1, Math.floor(buffer.x * AO_SCALE));
    const aoHeight = Math.max(1, Math.floor(buffer.y * AO_SCALE));

    composerCreations += 1;
    liveComposers += 1;
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));

    const gtao = new GTAOPass(scene, camera, aoWidth, aoHeight);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.blendIntensity = AO_BLEND_INTENSITY;
    gtao.updateGtaoMaterial({
      radius: AO_RADIUS,
      distanceExponent: 1,
      thickness: 1,
      distanceFallOff: 1,
      scale: 1,
      samples: AO_SAMPLES,
      screenSpaceRadius: false,
    });
    gtao.setSceneClipBox(new Box3(
      new Vector3(...VQ1C_FULL_OFFICE_EXPECTED.boundsMin),
      new Vector3(...VQ1C_FULL_OFFICE_EXPECTED.boundsMax),
    ));
    composer.addPass(gtao);
    // OutputPass applies AgX tone mapping + sRGB conversion exactly once.
    composer.addPass(new OutputPass());
    composer.addPass(new SMAAPass());
    // AO renders at half resolution; the final image stays at full resolution.
    gtao.setSize(aoWidth, aoHeight);
    lookRef.current = { composer, gtao };

    snapshotRef.current = {
      toneMapping: gl.toneMapping,
      toneMappingExposure: gl.toneMappingExposure,
      shadowMapType: gl.shadowMap.type,
      outputColorSpace: gl.outputColorSpace,
    };
    gl.toneMapping = AgXToneMapping;
    gl.toneMappingExposure = exposure;
    gl.outputColorSpace = SRGBColorSpace;
    if (gl.shadowMap.type !== PCFSoftShadowMap) {
      gl.shadowMap.type = PCFSoftShadowMap;
      gl.shadowMap.needsUpdate = true;
    }

    return () => {
      const snapshot = snapshotRef.current;
      if (snapshot) {
        gl.toneMapping = snapshot.toneMapping;
        gl.toneMappingExposure = snapshot.toneMappingExposure;
        gl.outputColorSpace = snapshot.outputColorSpace;
        if (gl.shadowMap.type !== snapshot.shadowMapType) {
          gl.shadowMap.type = snapshot.shadowMapType;
          gl.shadowMap.needsUpdate = true;
        }
      }
      for (const pass of composer.passes) {
        if (typeof (pass as { dispose?: () => void }).dispose === "function") {
          (pass as { dispose: () => void }).dispose();
        }
      }
      composer.dispose();
      lookRef.current = null;
      liveComposers -= 1;
    };
  }, [gl, scene, camera, exposure]);

  useEffect(() => {
    const buffer = gl.getDrawingBufferSize(new Vector2());
    const aoWidth = Math.max(1, Math.floor(buffer.x * AO_SCALE));
    const aoHeight = Math.max(1, Math.floor(buffer.y * AO_SCALE));
    lookRef.current?.composer.setSize(size.width, size.height);
    lookRef.current?.gtao.setSize(aoWidth, aoHeight);
  }, [gl, size.width, size.height]);

  useEffect(() => {
    const handle = {
      gl,
      get gtao() { return lookRef.current?.gtao ?? null; },
      get liveComposers() { return liveComposers; },
      get composerCreations() { return composerCreations; },
    };
    window.__VQ1C_SHADER_DAY_DEBUG__ = handle;
    return () => {
      if (window.__VQ1C_SHADER_DAY_DEBUG__ === handle) {
        delete window.__VQ1C_SHADER_DAY_DEBUG__;
      }
    };
  }, [gl]);

  useFrame((state, delta) => {
    const look = lookRef.current;
    if (!look) return;
    // Safety net: re-assert AgX in case any other renderer prop re-apply
    // (e.g. R3F Canvas gl props) resets the tone mapping between frames.
    if (gl.toneMapping !== AgXToneMapping) {
      gl.toneMapping = AgXToneMapping;
      gl.shadowMap.needsUpdate = true;
    }
    state.scene.updateMatrixWorld(true);
    look.composer.render(delta);
  }, 1);

  return null;
}
