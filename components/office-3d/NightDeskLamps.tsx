"use client";

/* VQ-1C Night Desk Lamp Gate 2B: four desk lamps (validated 2A.1 params).
 * Positions measured from R5 GLB Runtime_Lamps shade clusters (never guessed
 * mirror flips); targets = L + (deskCenter - L) * 0.63 @ y 0.73.
 * One shared SphereGeometry + one shared MeshBasicMaterial for the 4 proxies.
 * Day mode renders nothing. */

import { useEffect, useMemo, useRef } from "react";
import { MeshBasicMaterial, SphereGeometry } from "three";
import type { Object3D, SpotLight } from "three";

const LAMP_PARAMS = {
  color: "#FFD6A3",
  intensity: 10,
  angle: 0.45,
  penumbra: 0.75,
  distance: 0.95,
  decay: 2,
} as const;

export const NIGHT_DESK_LAMPS = [
  { key: "desk1", position: [-3.48, 1.1, -2.3] as [number, number, number], target: [-3.3, 0.73, -1.95] as [number, number, number] },
  { key: "desk2", position: [3.48, 1.1, 2.3] as [number, number, number], target: [3.3, 0.73, 1.95] as [number, number, number] },
  { key: "desk3", position: [-3.48, 1.1, 1.2] as [number, number, number], target: [-3.3, 0.73, 1.55] as [number, number, number] },
  { key: "desk4", position: [3.48, 1.1, -1.2] as [number, number, number], target: [3.3, 0.73, -1.55] as [number, number, number] },
] as const;

export const NIGHT_LAMP_PROXY = {
  radius: 0.045,
  scale: [1, 0.55, 1] as [number, number, number],
  y: 1.14,
  color: "#FFD6A3",
} as const;

export function NightDeskLamps({ mode }: { mode: "day" | "night" }) {
  const spotRefs = useRef<(SpotLight | null)[]>([]);
  const targetRefs = useRef<(Object3D | null)[]>([]);
  const sharedGeo = useMemo(() => new SphereGeometry(NIGHT_LAMP_PROXY.radius, 16, 12), []);
  const sharedMat = useMemo(() => new MeshBasicMaterial({ color: NIGHT_LAMP_PROXY.color }), []);

  useEffect(() => {
    NIGHT_DESK_LAMPS.forEach((_, i) => {
      if (spotRefs.current[i] && targetRefs.current[i]) {
        spotRefs.current[i]!.target = targetRefs.current[i]!;
      }
    });
  }, [mode]);

  useEffect(() => {
    console.info("[NightDeskLamps] mode=" + mode,
      "spotlights=" + (mode === "night" ? 4 : 0),
      "proxy=" + (mode === "night" ? 4 : 0));
  }, [mode]);

  if (mode !== "night") return null;

  return (
    <group>
      {NIGHT_DESK_LAMPS.map((lamp, i) => (
        <group key={lamp.key}>
          <object3D
            ref={(o) => { targetRefs.current[i] = o; }}
            name={`NIGHT_LAMP_TARGET_${lamp.key}`}
            position={lamp.target}
          />
          <spotLight
            ref={(o) => { spotRefs.current[i] = o; }}
            name={`NIGHT_LAMP_${lamp.key}`}
            color={LAMP_PARAMS.color}
            intensity={LAMP_PARAMS.intensity}
            angle={LAMP_PARAMS.angle}
            penumbra={LAMP_PARAMS.penumbra}
            distance={LAMP_PARAMS.distance}
            decay={LAMP_PARAMS.decay}
            castShadow={false}
            position={lamp.position}
          />
          <mesh
            name={`NIGHT_LAMP_GLOW_${lamp.key}`}
            geometry={sharedGeo}
            material={sharedMat}
            position={[lamp.position[0], NIGHT_LAMP_PROXY.y, lamp.position[2]]}
            scale={NIGHT_LAMP_PROXY.scale}
          />
        </group>
      ))}
    </group>
  );
}
