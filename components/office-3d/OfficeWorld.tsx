"use client";

import { useEffect, useMemo, useRef } from "react";
import { ContactShadows, Html, MapControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { CharacterInteractionEffect, InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import { CharacterController } from "@/components/office-3d/CharacterController";
import type { CharacterDebugCommand } from "@/components/office-3d/character-actions";
import { LowPolyWorkstation } from "@/components/office-3d/LowPolyWorkstation";
import { OfficeAmenities } from "@/components/office-3d/OfficeAmenities";
import { WORKSTATION_LAYOUT } from "@/components/office-3d/scene-config";
import { buildDeskSlots } from "@/lib/office/desk-slots";

interface OfficeWorldProps {
  users: OfficeUser[];
  isNight: boolean;
  onCharacterClick: (user: OfficeUser) => void;
  onObjectClick: (kind: ObjectKind, ownerId?: string) => void;
  onFpsChange: (fps: number) => void;
  debugCommand: CharacterDebugCommand | null;
  speedMultiplier: number;
  interactionEffects: Record<string, CharacterInteractionEffect>;
  coffeeGifts: InteractionEvent[];
  onClaimCoffee: (interactionId: string) => void;
}

function PerformanceReporter({ onFpsChange }: { onFpsChange: (fps: number) => void }) {
  const frameCount = useRef(0);
  const sampleStartedAt = useRef(0);

  useFrame(() => {
    const now = performance.now();
    if (sampleStartedAt.current === 0) {
      sampleStartedAt.current = now;
      return;
    }
    frameCount.current += 1;
    const elapsed = now - sampleStartedAt.current;
    if (elapsed >= 1000) {
      onFpsChange(Math.round((frameCount.current * 1000) / elapsed));
      frameCount.current = 0;
      sampleStartedAt.current = now;
    }
  });

  return null;
}

function RoomShell({ isNight }: { isNight: boolean }) {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[15.4, 0.24, 12.4]} />
        <meshStandardMaterial color={isNight ? "#544a41" : "#d8bd92"} roughness={0.96} />
      </mesh>
      {Array.from({ length: 10 }, (_, index) => (
        <mesh key={`floor-line-${index}`} position={[-6.75 + index * 1.5, 0.012, 0]} receiveShadow>
          <boxGeometry args={[0.018, 0.012, 12]} />
          <meshStandardMaterial color={isNight ? "#443c36" : "#c4a375"} roughness={1} />
        </mesh>
      ))}
      <mesh receiveShadow castShadow position={[0, 2.25, -6.1]}>
        <boxGeometry args={[15.4, 4.5, 0.24]} />
        <meshStandardMaterial color={isNight ? "#434847" : "#eee4d2"} roughness={0.95} />
      </mesh>
      <mesh receiveShadow castShadow position={[-7.58, 2.25, 0]}>
        <boxGeometry args={[0.24, 4.5, 12.2]} />
        <meshStandardMaterial color={isNight ? "#3c4241" : "#e5d7bf"} roughness={0.95} />
      </mesh>

      <group position={[-4.2, 2.7, -6.24]}>
        <mesh>
          <boxGeometry args={[4.4, 2.15, 0.12]} />
          <meshStandardMaterial color="#7e8b8b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[4.1, 1.86]} />
          <meshStandardMaterial color={isNight ? "#2f4657" : "#b9d4db"} emissive={isNight ? "#152938" : "#aacbd5"} emissiveIntensity={isNight ? 0.18 : 0.1} />
        </mesh>
        <mesh position={[0, 0, -0.16]}>
          <boxGeometry args={[0.1, 2.05, 0.06]} />
          <meshStandardMaterial color="#f1eadc" />
        </mesh>
      </group>

      <group position={[-6.35, 0, -4.5]}>
        <mesh castShadow position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.38, 0.3, 0.82, 12]} />
          <meshStandardMaterial color="#b87a5f" roughness={0.9} />
        </mesh>
        {[0, 1, 2, 3, 4].map((leaf) => (
          <mesh key={leaf} castShadow position={[Math.sin(leaf * 1.25) * 0.36, 1.05 + (leaf % 2) * 0.18, Math.cos(leaf * 1.25) * 0.36]} rotation={[0.25, leaf * 1.25, 0.45]}>
            <sphereGeometry args={[0.38, 9, 7]} />
            <meshStandardMaterial color={leaf % 2 ? "#789477" : "#8da487"} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function OfficeWorld({ users, isNight, onCharacterClick, onObjectClick, onFpsChange, debugCommand, speedMultiplier, interactionEffects, coffeeGifts, onClaimCoffee }: OfficeWorldProps) {
  const { slots, invalidMembers } = useMemo(() => buildDeskSlots(users), [users]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && invalidMembers.length > 0) {
      console.warn("[OfficeWorld] Skipped members with an invalid or duplicate desk_key", invalidMembers.map((user) => ({ id: user.id, deskKey: user.deskKey })));
    }
  }, [invalidMembers]);

  return (
    <>
      <color attach="background" args={[isNight ? "#263036" : "#e8dbc5"]} />
      <ambientLight intensity={isNight ? 0.42 : 1.05} color={isNight ? "#7e8fa7" : "#fff5df"} />
      <hemisphereLight intensity={isNight ? 0.4 : 0.85} color={isNight ? "#6d7894" : "#fff7e6"} groundColor={isNight ? "#2f2926" : "#b88e63"} />
      <directionalLight
        castShadow
        position={[-6, 11, 7]}
        intensity={isNight ? 0.55 : 2.15}
        color={isNight ? "#91a7ca" : "#fff0d2"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <RoomShell isNight={isNight} />
      <OfficeAmenities onObjectClick={onObjectClick} />

      {slots.map(({ deskKey, index, member, workstationUser }) => {
        const layout = WORKSTATION_LAYOUT[index];

        return (
          <group key={deskKey}>
            <LowPolyWorkstation
              user={workstationUser}
              index={index}
              position={layout.position}
              rotation={layout.rotation}
              isNight={isNight}
              onComputerClick={() => { if (member) onObjectClick("computer", member.id); }}
              coffeeGift={member ? coffeeGifts.find((gift) => gift.receiverId === member.id) : undefined}
              canClaimCoffee={Boolean(member?.isCurrentUser)}
              onClaimCoffee={onClaimCoffee}
            />
            {member ? (
              <CharacterController
                key={member.id}
                user={member}
                index={index}
                speedMultiplier={speedMultiplier}
                debugCommand={debugCommand}
                interactionEffect={interactionEffects[member.id]}
                onClick={() => onCharacterClick(member)}
              />
            ) : (
              <Html position={[layout.position[0], 2.38, layout.position[2]]} center zIndexRange={[14, 6]}>
                <div className="empty-desk-3d-label" data-empty-desk={deskKey}>等待朋友加入</div>
              </Html>
            )}
          </group>
        );
      })}

      <ContactShadows position={[0, 0.01, 0]} opacity={isNight ? 0.24 : 0.31} scale={16} blur={2.8} far={7} resolution={256} color="#5f4b3c" frames={Infinity} />
      <MapControls makeDefault enableRotate={false} enableDamping dampingFactor={0.08} screenSpacePanning minZoom={28} maxZoom={68} maxPolarAngle={Math.PI / 2.4} target={[0, 0.8, 0]} />
      <PerformanceReporter onFpsChange={onFpsChange} />
    </>
  );
}
