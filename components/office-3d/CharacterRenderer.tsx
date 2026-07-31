"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { ProceduralCharacter, type CharacterRigRefs } from "@/components/office-3d/ProceduralCharacter";
import { applyCharacterAnimation } from "@/components/office-3d/character-animation";
import type { CharacterActionState } from "@/components/office-3d/character-actions";
import type { InteractionAnchor } from "@/components/office-3d/scene-config";
import type { CharacterInteractionEffect, OfficeUser } from "@/lib/types";

export type CharacterRendererKind = "procedural" | "glb";

interface CharacterRendererProps {
  kind?: CharacterRendererKind;
  user: OfficeUser;
  index: number;
  characterRootRef: RefObject<Group | null>;
  actionState: CharacterActionState;
  isMoving: boolean;
  onClick: (anchor: InteractionAnchor) => void;
  interactionEffect?: CharacterInteractionEffect;
}

export function CharacterRenderer({
  kind = "procedural",
  user,
  index,
  characterRootRef,
  actionState,
  isMoving,
  onClick,
  interactionEffect,
}: CharacterRendererProps) {
  const bodyGroup = useRef<Group>(null);
  const headGroup = useRef<Group>(null);
  const leftArmPivot = useRef<Group>(null);
  const rightArmPivot = useRef<Group>(null);
  const leftLegPivot = useRef<Group>(null);
  const rightLegPivot = useRef<Group>(null);
  const fishGroup = useRef<Group>(null);
  const phaseOffset = useRef(index * 1.83 + 0.41);
  const rig: CharacterRigRefs = {
    characterRoot: characterRootRef,
    bodyGroup,
    headGroup,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    fishGroup,
  };

  useFrame(({ clock }, delta) => {
    applyCharacterAnimation({
      rig,
      action: actionState,
      status: user.status,
      elapsed: clock.elapsedTime,
      delta,
      phaseOffset: phaseOffset.current,
    });
  });

  // The GLB branch intentionally remains a renderer concern. CharacterController
  // continues to own movement, orientation, visibility and business-state changes.
  const rendererKind: CharacterRendererKind = kind === "glb" ? "procedural" : kind;

  return (
    <ProceduralCharacter
      user={user}
      characterRootRef={characterRootRef}
      bodyGroupRef={bodyGroup}
      headGroupRef={headGroup}
      leftArmPivotRef={leftArmPivot}
      rightArmPivotRef={rightArmPivot}
      leftLegPivotRef={leftLegPivot}
      rightLegPivotRef={rightLegPivot}
      fishGroupRef={fishGroup}
      actionState={actionState}
      isMoving={isMoving}
      rendererKind={rendererKind}
      onClick={onClick}
      interactionEffect={interactionEffect}
    />
  );
}
