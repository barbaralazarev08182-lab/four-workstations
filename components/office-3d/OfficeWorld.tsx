"use client";

import { useEffect, useMemo, useRef } from "react";
import { ContactShadows, Html, MapControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RectAreaLightUniformsLib, type MapControls as MapControlsImpl } from "three-stdlib";
import type { CharacterInteractionEffect, InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import { CameraController } from "@/components/office-3d/CameraController";
import { CharacterController } from "@/components/office-3d/CharacterController";
import type { CharacterDebugCommand } from "@/components/office-3d/character-actions";
import { LowPolyWorkstation } from "@/components/office-3d/LowPolyWorkstation";
import { OfficeAmenities } from "@/components/office-3d/OfficeAmenities";
import { CAT_ZONE_CENTER, CAT_ZONE_RADIUS, LIGHT_PRESETS, MEETING_CARPET_CENTER, MEETING_CARPET_SIZE, WINDOW_POSITION, WINDOW_SIZE, WORKSTATION_LAYOUT, type CameraZoneKey, type InteractionAnchor } from "@/components/office-3d/scene-config";
import { buildDeskSlots } from "@/lib/office/desk-slots";

// RectAreaLight needs its LTC lookup textures initialized once before use.
RectAreaLightUniformsLib.init();

interface OfficeWorldProps {
  users: OfficeUser[];
  isNight: boolean;
  cameraZone: CameraZoneKey;
  onCharacterClick: (user: OfficeUser, anchor?: InteractionAnchor) => void;
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
      <mesh receiveShadow position={[0, -0.32, 0]}>
        <boxGeometry args={[16.2, 0.18, 13.2]} />
        <meshStandardMaterial color={isNight ? "#2e2a26" : "#b09070"} roughness={0.95} />
      </mesh>
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
      <mesh receiveShadow position={[CAT_ZONE_CENTER[0], 0.02, CAT_ZONE_CENTER[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[CAT_ZONE_RADIUS, 24]} />
        <meshStandardMaterial color={isNight ? "#4a5568" : "#a8b8c8"} roughness={1} transparent opacity={0.35} />
      </mesh>
      <group position={[CAT_ZONE_CENTER[0], 0, CAT_ZONE_CENTER[2]]}>
        <mesh castShadow position={[-0.55, 0.16, -0.35]}>
          <cylinderGeometry args={[0.42, 0.48, 0.3, 14]} />
          <meshStandardMaterial color={isNight ? "#5a6572" : "#8b95a0"} roughness={1} />
        </mesh>
        <mesh position={[-0.55, 0.32, -0.35]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 14]} />
          <meshStandardMaterial color={isNight ? "#4a5560" : "#7a8490"} roughness={1} />
        </mesh>
        <mesh castShadow position={[0.5, 0.08, 0.45]}>
          <cylinderGeometry args={[0.2, 0.16, 0.14, 12]} />
          <meshStandardMaterial color={isNight ? "#6a7480" : "#9aa4b0"} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.15, 0.42, -0.6]}>
          <cylinderGeometry args={[0.09, 0.11, 0.82, 10]} />
          <meshStandardMaterial color={isNight ? "#5a6068" : "#8a9098"} roughness={1} />
        </mesh>
        <mesh castShadow position={[0.15, 0.86, -0.6]}>
          <sphereGeometry args={[0.14, 10, 8]} />
          <meshStandardMaterial color={isNight ? "#6a7480" : "#9aa4b0"} roughness={1} />
        </mesh>
      </group>
      <mesh receiveShadow position={MEETING_CARPET_CENTER}>
        <boxGeometry args={MEETING_CARPET_SIZE} />
        <meshStandardMaterial color={isNight ? "#4a4a52" : "#b8a890"} roughness={1} transparent opacity={0.5} />
      </mesh>
      {/* Exterior sky backdrop behind the window (soft flat color, no shadows) */}
      <mesh position={[WINDOW_POSITION[0], 3.4, -9.5]}>
        <planeGeometry args={[26, 16]} />
        <meshBasicMaterial color={isNight ? "#24303c" : "#adc0cd"} />
      </mesh>

      {/* Back wall split into 4 segments around a real window opening */}
      {/* Opening: x [0.9, 4.1], y [1.7, 3.5] */}
      <mesh receiveShadow castShadow position={[-3.4, 2.25, -6.1]}>
        <boxGeometry args={[8.6, 4.5, 0.24]} />
        <meshStandardMaterial color={isNight ? "#434847" : "#eee4d2"} roughness={0.95} />
      </mesh>
      <mesh receiveShadow castShadow position={[5.9, 2.25, -6.1]}>
        <boxGeometry args={[3.6, 4.5, 0.24]} />
        <meshStandardMaterial color={isNight ? "#434847" : "#eee4d2"} roughness={0.95} />
      </mesh>
      <mesh receiveShadow castShadow position={[WINDOW_POSITION[0], 4.0, -6.1]}>
        <boxGeometry args={[WINDOW_SIZE[0], 1.0, 0.24]} />
        <meshStandardMaterial color={isNight ? "#434847" : "#eee4d2"} roughness={0.95} />
      </mesh>
      <mesh receiveShadow castShadow position={[WINDOW_POSITION[0], 0.85, -6.1]}>
        <boxGeometry args={[WINDOW_SIZE[0], 1.7, 0.24]} />
        <meshStandardMaterial color={isNight ? "#434847" : "#eee4d2"} roughness={0.95} />
      </mesh>

      {/* Window frame (warm white, real thickness, protrudes slightly inward) */}
      <group>
        <mesh castShadow receiveShadow position={[0.9, WINDOW_POSITION[1], -5.99]}>
          <boxGeometry args={[0.12, WINDOW_SIZE[1], 0.22]} />
          <meshStandardMaterial color={isNight ? "#4a4f4e" : "#e8e0d0"} roughness={0.85} />
        </mesh>
        <mesh castShadow receiveShadow position={[4.1, WINDOW_POSITION[1], -5.99]}>
          <boxGeometry args={[0.12, WINDOW_SIZE[1], 0.22]} />
          <meshStandardMaterial color={isNight ? "#4a4f4e" : "#e8e0d0"} roughness={0.85} />
        </mesh>
        <mesh castShadow receiveShadow position={[WINDOW_POSITION[0], 3.5, -5.99]}>
          <boxGeometry args={[WINDOW_SIZE[0], 0.12, 0.22]} />
          <meshStandardMaterial color={isNight ? "#4a4f4e" : "#e8e0d0"} roughness={0.85} />
        </mesh>
        {/* Windowsill — wider and protrudes further into the room */}
        <mesh castShadow receiveShadow position={[WINDOW_POSITION[0], 1.7, -5.89]}>
          <boxGeometry args={[WINDOW_SIZE[0] + 0.24, 0.14, 0.42]} />
          <meshStandardMaterial color={isNight ? "#4a4f4e" : "#e8e0d0"} roughness={0.85} />
        </mesh>
        {/* Slim middle vertical muntin */}
        <mesh castShadow receiveShadow position={[WINDOW_POSITION[0], WINDOW_POSITION[1], -5.99]}>
          <boxGeometry args={[0.07, WINDOW_SIZE[1], 0.16]} />
          <meshStandardMaterial color={isNight ? "#4a4f4e" : "#e8e0d0"} roughness={0.85} />
        </mesh>
      </group>

      {/* Glass — thin, restrained gray-blue, sits inside wall thickness behind the frame */}
      <mesh receiveShadow position={[WINDOW_POSITION[0], WINDOW_POSITION[1], -6.16]}>
        <boxGeometry args={[WINDOW_SIZE[0], WINDOW_SIZE[1], 0.02]} />
        <meshStandardMaterial
          color={isNight ? "#3a4a55" : "#c2d0d6"}
          roughness={0.15}
          metalness={0}
          transparent
          opacity={isNight ? 0.28 : 0.22}
          depthWrite={false}
        />
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

export function OfficeWorld({ users, isNight, cameraZone, onCharacterClick, onObjectClick, onFpsChange, debugCommand, speedMultiplier, interactionEffects, coffeeGifts, onClaimCoffee }: OfficeWorldProps) {
  const { slots, invalidMembers } = useMemo(() => buildDeskSlots(users), [users]);
  const controlsRef = useRef<MapControlsImpl | null>(null);
  const light = isNight ? LIGHT_PRESETS.night : LIGHT_PRESETS.day;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && invalidMembers.length > 0) {
      console.warn("[OfficeWorld] Skipped members with an invalid or duplicate desk_key", invalidMembers.map((user) => ({ id: user.id, deskKey: user.deskKey })));
    }
  }, [invalidMembers]);

  return (
    <>
      <color attach="background" args={[light.background]} />
      <ambientLight intensity={light.ambient.intensity} color={light.ambient.color} />
      <hemisphereLight intensity={light.hemisphere.intensity} color={light.hemisphere.sky} groundColor={light.hemisphere.ground} />
      {/* Low directional key from the window direction — gentle shading + soft shadows,
          no harsh sun patch (the wall no longer punches a hard light shape through) */}
      <directionalLight
        castShadow
        position={light.key.position}
        intensity={light.key.intensity}
        color={light.key.color}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0002}
        shadow-normalBias={0.03}
        shadow-radius={6}
      />
      {/* Soft frontal fill so the space away from the window stays gentle, not black */}
      <directionalLight position={[-4, 7, 11]} intensity={light.fill.intensity} color={light.fill.color} />
      {/* Soft sky diffusion from the window (no shadow, no emissive) — brightens the
          window side and falls off toward the back of the room */}
      <rectAreaLight
        position={[WINDOW_POSITION[0], 2.8, -5.7]}
        rotation={[0, Math.PI, 0]}
        width={light.windowLight.width}
        height={light.windowLight.height}
        intensity={light.windowLight.intensity}
        color={light.windowLight.color}
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
                onClick={(anchor) => onCharacterClick(member, anchor)}
              />
            ) : (
              <Html position={[layout.position[0], 2.38, layout.position[2]]} center zIndexRange={[14, 6]}>
                <div className="empty-desk-3d-label" data-empty-desk={deskKey}>等待朋友加入</div>
              </Html>
            )}
          </group>
        );
      })}

      <ContactShadows position={[0, 0.01, 0]} opacity={light.contactShadow.opacity} scale={16} blur={light.contactShadow.blur} far={7} resolution={512} color="#5f4b3c" frames={Infinity} />
      <CameraController zone={cameraZone} controlsRef={controlsRef} />
      <MapControls ref={controlsRef} makeDefault enableRotate={false} enableDamping dampingFactor={0.08} screenSpacePanning minZoom={12} maxZoom={120} maxPolarAngle={Math.PI / 2.4} target={[0, 0.8, 0]} />
      <PerformanceReporter onFpsChange={onFpsChange} />
    </>
  );
}
