"use client";

import { useState, type ReactNode } from "react";
import { Html, RoundedBox, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { ObjectKind } from "@/lib/types";
import { FURNITURE_POSITIONS, MAT, matColor, type Vector3Tuple } from "@/components/office-3d/scene-config";

interface InteractiveFurnitureProps {
  kind: ObjectKind;
  label: string;
  position: Vector3Tuple;
  rotation?: number;
  labelPosition?: Vector3Tuple;
  children: ReactNode;
  onClick: (kind: ObjectKind) => void;
}

function InteractiveFurniture({ kind, label, position, rotation = 0, labelPosition = [0, 2.25, 0], children, onClick }: InteractiveFurnitureProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick(kind);
  };

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      scale={hovered ? 1.018 : 1}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {children}
      {hovered ? (
        <Html center position={labelPosition} zIndexRange={[16, 8]}>
          <span className="furniture-3d-tooltip">{label}</span>
        </Html>
      ) : null}
      {hovered ? <pointLight position={[0, 1.2, 0]} intensity={0.65} distance={3.2} color="#ffe5ae" /> : null}
    </group>
  );
}

function MeetingTable({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Table top — warm wood, gently rounded */}
      <RoundedBox args={[3.7, 0.2, 1.55]} radius={0.05} smoothness={3} castShadow receiveShadow position={[0, 0.72, 0]}>
        <meshStandardMaterial color={matColor(MAT.woodTop, isNight)} roughness={MAT.woodTop.roughness} />
      </RoundedBox>
      {[-1.45, 1.45].flatMap((x) => [-0.52, 0.52].map((z) => (
        <mesh key={`${x}-${z}`} castShadow position={[x, 0.34, z]}>
          <boxGeometry args={[0.12, 0.72, 0.12]} />
          <meshStandardMaterial color={matColor(MAT.woodLeg, isNight)} roughness={MAT.woodLeg.roughness} />
        </mesh>
      )))}
      <mesh castShadow position={[-0.75, 0.84, 0.1]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.72, 0.035, 0.5]} />
        <meshStandardMaterial color="#f0e8d6" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0.6, 0.86, -0.04]}>
        <boxGeometry args={[0.7, 0.08, 0.48]} />
        <meshStandardMaterial color={matColor(MAT.plasticLight, isNight)} roughness={MAT.plasticLight.roughness} />
      </mesh>
      <mesh castShadow position={[0.6, 1.17, -0.25]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.7, 0.48, 0.05]} />
        <meshStandardMaterial color={matColor(MAT.screen, isNight)} roughness={MAT.screen.roughness} metalness={0} />
      </mesh>
      <mesh castShadow position={[0, 1.55, -0.85]}>
        <boxGeometry args={[1.5, 0.85, 0.06]} />
        <meshStandardMaterial color="#e2ddd0" roughness={0.95} />
      </mesh>
      <mesh position={[-0.35, 1.68, -0.81]}>
        <boxGeometry args={[0.6, 0.05, 0.02]} />
        <meshStandardMaterial color="#7396b8" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 1.55, -0.81]}>
        <boxGeometry args={[0.7, 0.05, 0.02]} />
        <meshStandardMaterial color="#9aa4b0" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 1.42, -0.81]}>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshStandardMaterial color="#9aa4b0" roughness={0.9} />
      </mesh>
    </group>
  );
}

function DiningTable({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Round top — warm wood */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.2, 20]} />
        <meshStandardMaterial color={matColor(MAT.woodTop, isNight)} roughness={MAT.woodTop.roughness} />
      </mesh>
      <mesh castShadow position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 0.72, 12]} />
        <meshStandardMaterial color={matColor(MAT.woodLeg, isNight)} roughness={MAT.woodLeg.roughness} />
      </mesh>
      {[[-0.52, -0.25], [0.44, 0.28], [0.12, -0.5]].map(([x, z], index) => (
        <group key={index} position={[x, 0.85, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.045, 16]} />
            <meshStandardMaterial color="#f4eee1" roughness={0.88} />
          </mesh>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.38, 0.12, 0.28]} />
            <meshStandardMaterial color={index === 1 ? "#8fa694" : "#c97f63"} roughness={0.82} />
          </mesh>
        </group>
      ))}
      <mesh castShadow position={[0.7, 0.98, -0.25]}>
        <cylinderGeometry args={[0.1, 0.09, 0.3, 12]} />
        <meshStandardMaterial color="#88a9b0" transparent opacity={0.82} roughness={0.65} />
      </mesh>
    </group>
  );
}

function Sofa({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Body — fabric base */}
      <RoundedBox args={[1.35, 0.45, 3.05]} radius={0.07} smoothness={3} castShadow receiveShadow position={[0, 0.5, 0]}>
        <meshStandardMaterial color={matColor(MAT.fabric, isNight)} roughness={MAT.fabric.roughness} />
      </RoundedBox>
      {/* Backrest — fabric */}
      <RoundedBox args={[0.3, 1.1, 3.05]} radius={0.07} smoothness={3} castShadow position={[0.52, 1.12, 0]}>
        <meshStandardMaterial color={matColor(MAT.fabric, isNight)} roughness={MAT.fabric.roughness} />
      </RoundedBox>
      {/* Seat cushions — slightly lighter, gently rounded */}
      {[-1.02, 0, 1.02].map((z) => (
        <RoundedBox key={z} args={[0.84, 0.2, 0.86]} radius={0.06} smoothness={3} castShadow position={[-0.08, 0.78, z]}>
          <meshStandardMaterial color={matColor(MAT.fabricSoft, isNight)} roughness={MAT.fabricSoft.roughness} />
        </RoundedBox>
      ))}
      {/* Side table — wood */}
      <mesh castShadow position={[-0.95, 0.38, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 16]} />
        <meshStandardMaterial color={matColor(MAT.woodTop, isNight)} roughness={MAT.woodTop.roughness} />
      </mesh>
    </group>
  );
}

function CoffeeMachine({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Body — machine plastic */}
      <RoundedBox args={[1.45, 1.6, 0.75]} radius={0.05} smoothness={3} castShadow position={[0, 0.8, 0]}>
        <meshStandardMaterial color={matColor(MAT.machine, isNight)} roughness={MAT.machine.roughness} />
      </RoundedBox>
      {/* Display panel — dark, no glow */}
      <mesh castShadow position={[0, 1.23, 0.4]}>
        <boxGeometry args={[1.1, 0.42, 0.08]} />
        <meshStandardMaterial color={matColor(MAT.screen, isNight)} roughness={MAT.screen.roughness} metalness={0} />
      </mesh>
      {/* Dispense area — darker plastic */}
      <mesh castShadow position={[0, 0.72, 0.44]}>
        <boxGeometry args={[0.8, 0.46, 0.08]} />
        <meshStandardMaterial color={matColor(MAT.plastic, isNight)} roughness={MAT.plastic.roughness} />
      </mesh>
      {/* Cup — ceramic */}
      <mesh castShadow position={[0, 0.38, 0.52]}>
        <cylinderGeometry args={[0.16, 0.13, 0.3, 12]} />
        <meshStandardMaterial color="#f1e8d7" roughness={0.86} />
      </mesh>
    </group>
  );
}

function Door({ restroom = false }: { restroom?: boolean }) {
  return (
    <group>
      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[2, 2.7, 0.2]} />
        <meshStandardMaterial color={restroom ? "#c38b68" : "#97a69a"} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, 0.12]}>
        <boxGeometry args={[1.5, 2.22, 0.05]} />
        <meshStandardMaterial color={restroom ? "#7aa2a0" : "#d9e2dd"} roughness={0.84} />
      </mesh>
      <mesh castShadow position={[-0.55, 1.35, 0.22]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color="#e6c57d" metalness={0.18} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function OfficeAmenities({ onObjectClick, isNight }: { onObjectClick: (kind: ObjectKind) => void; isNight: boolean }) {
  return (
    <>
      <InteractiveFurniture kind="meeting" label="会议桌" position={FURNITURE_POSITIONS.meetingTable} labelPosition={[0, 2.45, 0]} onClick={onObjectClick}>
        <MeetingTable isNight={isNight} />
      </InteractiveFurniture>
      <InteractiveFurniture kind="dining" label="餐桌" position={FURNITURE_POSITIONS.diningTable} labelPosition={[0, 2.05, 0]} onClick={onObjectClick}>
        <DiningTable isNight={isNight} />
      </InteractiveFurniture>
      <InteractiveFurniture kind="sofa" label="沙发休息区" position={FURNITURE_POSITIONS.sofa} rotation={Math.PI} labelPosition={[0, 2.1, 0]} onClick={onObjectClick}>
        <Sofa isNight={isNight} />
      </InteractiveFurniture>
      <InteractiveFurniture kind="coffee" label="咖啡机" position={FURNITURE_POSITIONS.coffeeMachine} labelPosition={[0, 2.2, 0]} onClick={onObjectClick}>
        <CoffeeMachine isNight={isNight} />
      </InteractiveFurniture>
      <InteractiveFurniture kind="restroom" label="卫生间" position={FURNITURE_POSITIONS.restroomDoor} labelPosition={[0, 3.05, 0]} onClick={onObjectClick}>
        <Door restroom />
      </InteractiveFurniture>
      <InteractiveFurniture kind="entrance" label="入口" position={FURNITURE_POSITIONS.entrance} rotation={Math.PI / 2} labelPosition={[0, 3.05, 0]} onClick={onObjectClick}>
        <Door />
      </InteractiveFurniture>
    </>
  );
}
