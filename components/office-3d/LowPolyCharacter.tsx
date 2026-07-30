"use client";

import { useState } from "react";
import { Html, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { STATUS_DEFINITIONS, getDurationLabel } from "@/lib/status";
import type { OfficeUser } from "@/lib/types";
import { ACCENT_COLORS, type Vector3Tuple } from "@/components/office-3d/scene-config";

interface LowPolyCharacterProps {
  user: OfficeUser;
  position: Vector3Tuple;
  rotation: number;
  onClick: () => void;
}

const SKIN_TONES = ["#e8b993", "#f0c6a5", "#d59b77", "#ecc09e"];
const HAIR_COLORS = ["#3e332d", "#342d2a", "#4c382c", "#2c3033"];

export function LowPolyCharacter({ user, position, rotation, onClick }: LowPolyCharacterProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const accent = ACCENT_COLORS[user.accent];
  const userIndex = Math.max(0, ["ming", "hong", "jie", "qixi"].indexOf(user.id));

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
      scale={hovered ? 1.04 : 1}
    >
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.47, 16, 12]} />
        <meshStandardMaterial color={SKIN_TONES[userIndex]} roughness={0.86} emissive={hovered ? accent : "#000000"} emissiveIntensity={hovered ? 0.12 : 0} />
      </mesh>
      <mesh castShadow position={[0, 2.08, -0.04]} scale={[1.03, 0.55, 1.02]}>
        <sphereGeometry args={[0.48, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
        <meshStandardMaterial color={HAIR_COLORS[userIndex]} roughness={0.96} />
      </mesh>
      <mesh castShadow position={[0, 1.08, 0]}>
        <capsuleGeometry args={[0.38, 0.7, 5, 10]} />
        <meshStandardMaterial color={accent} roughness={0.86} />
      </mesh>
      {[-0.47, 0.47].map((x) => (
        <mesh key={`arm-${x}`} castShadow position={[x, 1.12, 0]} rotation={[0, 0, x > 0 ? -0.16 : 0.16]}>
          <capsuleGeometry args={[0.11, 0.58, 4, 8]} />
          <meshStandardMaterial color={SKIN_TONES[userIndex]} roughness={0.86} />
        </mesh>
      ))}
      {[-0.2, 0.2].map((x) => (
        <group key={`leg-${x}`} position={[x, 0.36, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.13, 0.58, 4, 8]} />
            <meshStandardMaterial color="#48515a" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.42, 0.1]} scale={[1, 0.7, 1.55]}>
            <sphereGeometry args={[0.16, 10, 8]} />
            <meshStandardMaterial color="#3d413e" roughness={0.9} />
          </mesh>
        </group>
      ))}
      <Html center position={[0, 2.8, 0]} zIndexRange={[20, 10]}>
        <button type="button" className={`character-3d-label accent-${user.accent}`} onClick={onClick}>
          <strong>{user.name}</strong>
          <span>{STATUS_DEFINITIONS[user.status].shortLabel} · {getDurationLabel(user.statusSince)}</span>
        </button>
      </Html>
    </group>
  );
}
