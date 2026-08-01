"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Low-cost procedural reflection environment (no HDR download).
 * Gives metal and glass something readable to reflect without replacing the
 * Phase 1B-2 scene lighting. Rendered once (frames={1}) at low resolution.
 * envMapIntensity is kept low per-material so this only adds restrained
 * highlights/reflections — it does not light the whole scene.
 */
export function MaterialEnvironment() {
  return (
    <Environment background={false} frames={1} resolution={128}>
      {/* Warm soft top light */}
      <Lightformer intensity={1.1} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]} color="#fff3e0" />
      {/* Cool window-direction soft light (from the back/window side) */}
      <Lightformer intensity={0.8} position={[2.5, 3, -6]} rotation={[0, 0, 0]} scale={[4, 3, 1]} color="#cfe0ea" />
      {/* Low-intensity frontal fill */}
      <Lightformer intensity={0.4} position={[0, 3, 8]} rotation={[0, Math.PI, 0]} scale={[8, 5, 1]} color="#f0ece2" />
    </Environment>
  );
}
