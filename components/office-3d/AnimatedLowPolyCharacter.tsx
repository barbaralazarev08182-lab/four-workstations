"use client";

import { useState, type RefObject } from "react";
import { Html, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import { STATUS_DEFINITIONS, getDurationLabel } from "@/lib/status";
import type { CharacterInteractionEffect, OfficeUser } from "@/lib/types";
import type { CharacterActionState } from "@/components/office-3d/character-actions";
import { ACCENT_COLORS, type InteractionAnchor } from "@/components/office-3d/scene-config";

export interface CharacterRigRefs {
  characterRoot: RefObject<Group | null>;
  bodyGroup: RefObject<Group | null>;
  headGroup: RefObject<Group | null>;
  leftArmPivot: RefObject<Group | null>;
  rightArmPivot: RefObject<Group | null>;
  leftLegPivot: RefObject<Group | null>;
  rightLegPivot: RefObject<Group | null>;
  fishGroup: RefObject<Group | null>;
}

interface AnimatedLowPolyCharacterProps {
  user: OfficeUser;
  characterRootRef: RefObject<Group | null>;
  bodyGroupRef: RefObject<Group | null>;
  headGroupRef: RefObject<Group | null>;
  leftArmPivotRef: RefObject<Group | null>;
  rightArmPivotRef: RefObject<Group | null>;
  leftLegPivotRef: RefObject<Group | null>;
  rightLegPivotRef: RefObject<Group | null>;
  fishGroupRef: RefObject<Group | null>;
  actionState: CharacterActionState;
  isMoving: boolean;
  rendererKind?: "procedural" | "glb";
  onClick: (anchor: InteractionAnchor) => void;
  interactionEffect?: CharacterInteractionEffect;
  /** Gate 2: hide the legacy visual mesh while keeping the business root,
   *  its Html label and interaction alive. */
  hiddenVisual?: boolean;
}

const SKIN_TONES = ["#e8b993", "#f0c6a5", "#d59b77", "#ecc09e"];
const HAIR_COLORS = ["#3e332d", "#342d2a", "#4c382c", "#2c3033"];

export function AnimatedLowPolyCharacter({
  user,
  characterRootRef,
  bodyGroupRef,
  headGroupRef,
  leftArmPivotRef,
  rightArmPivotRef,
  leftLegPivotRef,
  rightLegPivotRef,
  fishGroupRef,
  actionState,
  isMoving,
  rendererKind = "procedural",
  onClick,
  interactionEffect,
  hiddenVisual = false,
}: AnimatedLowPolyCharacterProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const accent = ACCENT_COLORS[user.accent];
  const userIndex = Math.max(0, ["ming", "hong", "jie", "qixi"].indexOf(user.id));
  const skin = SKIN_TONES[userIndex];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick({ x: event.nativeEvent.clientX, y: event.nativeEvent.clientY });
  };

  return (
    <group
      ref={characterRootRef}
      name={`characterRoot-${user.id}`}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
      scale={hovered ? 1.035 : 1}
      userData={{ rendererKind }}
    >
      <group name="legacyVisualContainer" visible={!hiddenVisual}>
        <group ref={bodyGroupRef} name="bodyGroup" position={[0, 1.08, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.38, 0.7, 5, 10]} />
          <meshStandardMaterial color={accent} roughness={0.86} transparent />
        </mesh>
      </group>

      <group ref={headGroupRef} name="headGroup" position={[0, 1.8, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.47, 16, 12]} />
          <meshStandardMaterial color={skin} roughness={0.86} emissive={hovered ? accent : "#000000"} emissiveIntensity={hovered ? 0.12 : 0} transparent />
        </mesh>
        <mesh castShadow position={[0, 0.28, -0.04]} scale={[1.03, 0.55, 1.02]}>
          <sphereGeometry args={[0.48, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
          <meshStandardMaterial color={HAIR_COLORS[userIndex]} roughness={0.96} transparent />
        </mesh>
        <mesh position={[-0.16, 0.02, 0.43]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color="#2c2c2b" roughness={0.9} transparent />
        </mesh>
        <mesh position={[0.16, 0.02, 0.43]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color="#2c2c2b" roughness={0.9} transparent />
        </mesh>
      </group>

      <group ref={leftArmPivotRef} name="leftArmPivot" position={[-0.47, 1.45, 0]} rotation={[0, 0, 0.16]}>
        <mesh castShadow position={[0, -0.31, 0]}>
          <capsuleGeometry args={[0.11, 0.58, 4, 8]} />
          <meshStandardMaterial color={skin} roughness={0.86} transparent />
        </mesh>
      </group>
      <group ref={rightArmPivotRef} name="rightArmPivot" position={[0.47, 1.45, 0]} rotation={[0, 0, -0.16]}>
        <mesh castShadow position={[0, -0.31, 0]}>
          <capsuleGeometry args={[0.11, 0.58, 4, 8]} />
          <meshStandardMaterial color={skin} roughness={0.86} transparent />
        </mesh>
      </group>

      <group ref={leftLegPivotRef} name="leftLegPivot" position={[-0.2, 0.68, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.13, 0.58, 4, 8]} />
          <meshStandardMaterial color="#48515a" roughness={0.9} transparent />
        </mesh>
        <mesh castShadow position={[0, -0.72, 0.1]} scale={[1, 0.7, 1.55]}>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshStandardMaterial color="#3d413e" roughness={0.9} transparent />
        </mesh>
      </group>
      <group ref={rightLegPivotRef} name="rightLegPivot" position={[0.2, 0.68, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.13, 0.58, 4, 8]} />
          <meshStandardMaterial color="#48515a" roughness={0.9} transparent />
        </mesh>
        <mesh castShadow position={[0, -0.72, 0.1]} scale={[1, 0.7, 1.55]}>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshStandardMaterial color="#3d413e" roughness={0.9} transparent />
        </mesh>
      </group>

      <group ref={fishGroupRef} name="slackingFish" position={[0, 2.72, 0]} visible={actionState === "slacking"}>
        <mesh castShadow scale={[0.28, 0.16, 0.12]}>
          <sphereGeometry args={[1, 10, 7]} />
          <meshStandardMaterial color="#77a9bd" roughness={0.78} transparent />
        </mesh>
        <mesh castShadow position={[-0.34, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.18, 0.3, 6]} />
          <meshStandardMaterial color="#638fa3" roughness={0.82} transparent />
        </mesh>
      </group>
      </group>

      {actionState !== "hidden" ? (
        <Html center position={[0, 2.8, 0]} zIndexRange={[20, 10]}>
          <button
            type="button"
            className={`character-3d-label accent-${user.accent}`}
            data-character-id={user.id}
            data-character-action={actionState}
            data-moving={isMoving ? "true" : "false"}
            data-renderer-kind={rendererKind}
            onClick={(event) => onClick({ x: event.clientX, y: event.clientY })}
          >
            <strong>{user.name}</strong>
            <span>{isMoving ? "正在前往" : STATUS_DEFINITIONS[user.status].shortLabel} · {getDurationLabel(user.statusSince)}</span>
          </button>
        </Html>
      ) : null}
      {actionState !== "hidden" && interactionEffect?.emoji ? (
        <Html center position={[0, 3.48, 0]} zIndexRange={[24, 14]}>
          <span className="character-interaction-emoji" data-interaction-id={interactionEffect.id}>{interactionEffect.emoji}</span>
        </Html>
      ) : null}
    </group>
  );
}
