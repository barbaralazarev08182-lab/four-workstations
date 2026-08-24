"use client";

import { useEffect, useMemo, useRef } from "react";
import { Html, MapControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MapControls as MapControlsImpl } from "three-stdlib";
import type { CharacterInteractionEffect, InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import { CameraController } from "@/components/office-3d/CameraController";
import { CharacterController } from "@/components/office-3d/CharacterController";
import type { CatPose } from "@/components/office-3d/ChangFenCat";
import type { CharacterDebugCommand } from "@/components/office-3d/character-actions";
import { OfficeInteractionLayer } from "@/components/office-3d/OfficeInteractionLayer";
import { WORKSTATION_LAYOUT, type CameraZoneKey, type InteractionAnchor } from "@/components/office-3d/scene-config";
import { Vq1cOfficeWorldScene, type Vq1cOfficeWorldDiagnostics } from "@/components/office-3d/Vq1cOfficeWorldScene";
import { NewCharacterVisuals } from "@/components/office-3d/NewCharacterVisuals";
import { buildDeskSlots } from "@/lib/office/desk-slots";

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
  catPose?: CatPose | null;
  onVq1cDiagnostics: (diagnostics: Vq1cOfficeWorldDiagnostics) => void;
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

export function OfficeWorld({ users, isNight, cameraZone, onCharacterClick, onObjectClick, onFpsChange, debugCommand, speedMultiplier, interactionEffects, coffeeGifts, onClaimCoffee, onVq1cDiagnostics }: OfficeWorldProps) {
  const { slots, invalidMembers } = useMemo(() => buildDeskSlots(users), [users]);
  const controlsRef = useRef<MapControlsImpl | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && invalidMembers.length > 0) {
      console.warn("[OfficeWorld] Skipped members with an invalid or duplicate desk_key", invalidMembers.map((user) => ({ id: user.id, deskKey: user.deskKey })));
    }
  }, [invalidMembers]);

  return (
    <>
      <Vq1cOfficeWorldScene mode={isNight ? "night" : "day"} onDiagnostics={onVq1cDiagnostics} />
      <OfficeInteractionLayer slots={slots} coffeeGifts={coffeeGifts} onClaimCoffee={onClaimCoffee} onObjectClick={onObjectClick} />
      {slots.map(({ deskKey, index, member }) => {
        const layout = WORKSTATION_LAYOUT[index];
        return member ? (
          <CharacterController
            key={member.id}
            user={member}
            index={index}
            speedMultiplier={speedMultiplier}
            debugCommand={debugCommand}
            interactionEffect={interactionEffects[member.id]}
            onClick={(anchor) => onCharacterClick(member, anchor)}
            hiddenVisual
          />
        ) : (
          <Html key={deskKey} position={[layout.position[0], 2.38, layout.position[2]]} center zIndexRange={[14, 6]}>
            <div className="empty-desk-3d-label" data-empty-desk={deskKey}>等待朋友加入</div>
          </Html>
        );
      })}
      <CameraController zone={cameraZone} controlsRef={controlsRef} />
      <MapControls ref={controlsRef} makeDefault enableRotate={false} enableDamping dampingFactor={0.08} screenSpacePanning minZoom={12} maxZoom={120} maxPolarAngle={Math.PI / 2.4} target={[0, 0.8, 0]} />
      <NewCharacterVisuals users={users} />
      <PerformanceReporter onFpsChange={onFpsChange} />
    </>
  );
}
