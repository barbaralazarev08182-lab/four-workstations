"use client";

import { useState } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { DoubleSide } from "three";
import type { InteractionEvent, OfficeUser } from "@/lib/types";
import { ACCENT_COLORS, DECORATION_COLORS, type Vector3Tuple } from "@/components/office-3d/scene-config";

interface LowPolyWorkstationProps {
  user: OfficeUser;
  index: number;
  position: Vector3Tuple;
  rotation: number;
  isNight: boolean;
  onComputerClick: () => void;
  coffeeGift?: InteractionEvent;
  canClaimCoffee: boolean;
  onClaimCoffee: (interactionId: string) => void;
}

function DeskLamp({ color, isOn }: { color: string; isOn: boolean }) {
  return (
    <group position={[1.15, 1.02, -0.12]}>
      <mesh castShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.08, 12]} />
        <meshStandardMaterial color="#565950" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0]} rotation={[0, 0, -0.22]}>
        <cylinderGeometry args={[0.035, 0.035, 0.78, 8]} />
        <meshStandardMaterial color="#666a61" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.13, 0.8, 0]} rotation={[0, 0, 0.22]}>
        <coneGeometry args={[0.22, 0.35, 12, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.72} side={DoubleSide} />
      </mesh>
      {isOn && <pointLight position={[0.13, 0.66, 0.08]} intensity={2.1} distance={2.6} color="#ffd998" decay={2} />}
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, 1.25]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.95, 0.18, 0.9]} />
        <meshStandardMaterial color="#768078" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.03, 0.4]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.95, 0.9, 0.15]} />
        <meshStandardMaterial color="#7f8981" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.58, 8]} />
        <meshStandardMaterial color="#50544f" roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3, 4].map((arm) => (
        <mesh key={arm} castShadow position={[Math.sin(arm * 1.256) * 0.34, 0.06, Math.cos(arm * 1.256) * 0.34]} rotation={[0, arm * 1.256, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.045, 0.6, 6]} />
          <meshStandardMaterial color="#50544f" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function LowPolyWorkstation({ user, index, position, rotation, isNight, onComputerClick, coffeeGift, canClaimCoffee, onClaimCoffee }: LowPolyWorkstationProps) {
  const [hovered, setHovered] = useState(false);
  const [coffeeHovered, setCoffeeHovered] = useState(false);
  useCursor(hovered || coffeeHovered);
  const accent = ACCENT_COLORS[user.accent];
  const lampOn = user.status !== "offWork" && (!isNight || user.status === "overtime" || user.status === "working" || user.status === "studying" || user.status === "busy");

  const handleComputerClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onComputerClick();
  };

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh receiveShadow castShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[3.05, 0.24, 1.35]} />
        <meshStandardMaterial color="#cfa574" roughness={0.82} />
      </mesh>
      {[-1.25, 1.25].flatMap((x) => [-0.48, 0.48].map((z) => (
        <mesh key={`${x}-${z}`} castShadow position={[x, 0.4, z]}>
          <boxGeometry args={[0.14, 0.82, 0.14]} />
          <meshStandardMaterial color="#9e7858" roughness={0.88} />
        </mesh>
      )))}

      <group
        position={[0, 1.28, -0.08]}
        onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onClick={handleComputerClick}
        scale={hovered ? 1.035 : 1}
      >
        <mesh castShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[1.35, 0.82, 0.12]} />
          <meshStandardMaterial color="#424b49" roughness={0.62} emissive={hovered ? accent : "#000000"} emissiveIntensity={hovered ? 0.28 : 0} />
        </mesh>
        <mesh position={[0, 0.25, -0.066]}>
          <planeGeometry args={[1.16, 0.64]} />
          <meshStandardMaterial color={isNight ? "#7da5b1" : "#b9d7d3"} emissive={isNight ? "#517a86" : "#7aa29d"} emissiveIntensity={isNight ? 0.65 : 0.18} />
        </mesh>
        <mesh castShadow position={[0, -0.28, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial color="#505957" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.43, 0.04]}>
          <boxGeometry args={[0.58, 0.08, 0.34]} />
          <meshStandardMaterial color="#505957" roughness={0.7} />
        </mesh>
      </group>

      <mesh castShadow position={[-0.8, 0.99, 0.3]}>
        <boxGeometry args={[0.7, 0.05, 0.34]} />
        <meshStandardMaterial color={DECORATION_COLORS[index]} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-1.12, 1.04, 0.2]} rotation={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.24, 12]} />
        <meshStandardMaterial color="#f4eee3" roughness={0.8} />
      </mesh>
      {coffeeGift ? (
        <group
          position={[-1.08, 1.16, -0.32]}
          scale={coffeeHovered ? 1.08 : 1}
          onPointerEnter={(event) => { event.stopPropagation(); if (canClaimCoffee) setCoffeeHovered(true); }}
          onPointerLeave={() => setCoffeeHovered(false)}
          onClick={(event) => {
            event.stopPropagation();
            if (canClaimCoffee) onClaimCoffee(coffeeGift.id);
          }}
          userData={{ interactionId: coffeeGift.id, kind: "gifted-coffee" }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.13, 0.3, 12]} />
            <meshStandardMaterial color="#f8f0df" roughness={0.75} emissive={coffeeHovered ? "#d79b63" : "#000000"} emissiveIntensity={coffeeHovered ? 0.3 : 0} />
          </mesh>
          <mesh castShadow position={[0.17, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.035, 7, 12, Math.PI * 1.6]} />
            <meshStandardMaterial color="#f8f0df" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.018, 12]} />
            <meshStandardMaterial color="#80543a" roughness={0.9} />
          </mesh>
          <pointLight position={[0, 0.32, 0]} intensity={0.45} distance={1.2} color="#ffc980" />
        </group>
      ) : null}
      <DeskLamp color={accent} isOn={lampOn} />
      <Chair />
      <mesh receiveShadow position={[0, 0.018, 0.05]}>
        <boxGeometry args={[3.5, 0.035, 2.8]} />
        <meshStandardMaterial color={accent} transparent opacity={0.12} roughness={1} />
      </mesh>
    </group>
  );
}
