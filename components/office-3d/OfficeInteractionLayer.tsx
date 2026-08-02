"use client";

import { useState } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import { FURNITURE_POSITIONS, WORKSTATION_LAYOUT, type Vector3Tuple } from "@/components/office-3d/scene-config";

interface InteractionSlot {
  deskKey: string;
  index: number;
  member: OfficeUser | null;
}

interface OfficeInteractionLayerProps {
  slots: InteractionSlot[];
  coffeeGifts: InteractionEvent[];
  onClaimCoffee: (interactionId: string) => void;
  onObjectClick: (kind: ObjectKind, ownerId?: string) => void;
}

const AMENITY_HOTSPOTS: Array<{ kind: ObjectKind; position: Vector3Tuple; size: Vector3Tuple }> = [
  { kind: "meeting", position: FURNITURE_POSITIONS.meetingTable, size: [3.7, 2.4, 1.8] },
  { kind: "dining", position: FURNITURE_POSITIONS.diningTable, size: [2.6, 2.1, 2.6] },
  { kind: "sofa", position: FURNITURE_POSITIONS.sofa, size: [2.3, 2.1, 3.2] },
  { kind: "coffee", position: FURNITURE_POSITIONS.coffeeMachine, size: [1.4, 2.2, 1.2] },
  { kind: "restroom", position: FURNITURE_POSITIONS.restroomDoor, size: [2, 3.2, 0.7] },
  { kind: "entrance", position: FURNITURE_POSITIONS.entrance, size: [1.2, 3.2, 2.2] },
];

function InvisibleHotspot({ name, position, rotation = 0, size, onClick }: {
  name: string;
  position: Vector3Tuple;
  rotation?: number;
  size: Vector3Tuple;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      name={name}
      position={[position[0], position[1] + size[1] / 2, position[2]]}
      rotation={[0, rotation, 0]}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
    </mesh>
  );
}

export function OfficeInteractionLayer({ slots, coffeeGifts, onClaimCoffee, onObjectClick }: OfficeInteractionLayerProps) {
  return (
    <group name="VQ1C_OFFICEWORLD_INTERACTIONS">
      {slots.map(({ deskKey, index, member }) => {
        const layout = WORKSTATION_LAYOUT[index];
        const gift = member ? coffeeGifts.find((candidate) => candidate.receiverId === member.id) : undefined;
        return (
          <group key={deskKey} position={layout.position} rotation={[0, layout.rotation, 0]}>
            <InvisibleHotspot
              name={`VQ1C_INTERACTION_COMPUTER_${deskKey}`}
              position={[0, 0, -0.08]}
              size={[1.35, 1.7, 0.7]}
              onClick={(event) => { event.stopPropagation(); if (member) onObjectClick("computer", member.id); }}
            />
            {gift ? (
              <group
                name={`VQ1C_INTERACTION_COFFEE_GIFT_${deskKey}`}
                position={[-1.08, 1.16, -0.32]}
                onClick={(event) => { event.stopPropagation(); if (member?.isCurrentUser) onClaimCoffee(gift.id); }}
                userData={{ interactionId: gift.id, kind: "gifted-coffee" }}
              >
                <mesh castShadow={false} receiveShadow={false}>
                  <cylinderGeometry args={[0.16, 0.13, 0.3, 12]} />
                  <meshStandardMaterial color="#f8f0df" roughness={0.75} />
                </mesh>
                <mesh position={[0, 0.17, 0]} castShadow={false} receiveShadow={false}>
                  <cylinderGeometry args={[0.11, 0.13, 0.018, 12]} />
                  <meshStandardMaterial color="#80543a" roughness={0.9} />
                </mesh>
              </group>
            ) : null}
          </group>
        );
      })}
      {AMENITY_HOTSPOTS.map(({ kind, position, size }) => (
        <InvisibleHotspot
          key={kind}
          name={`VQ1C_INTERACTION_${kind.toUpperCase()}`}
          position={position}
          size={size}
          onClick={(event) => { event.stopPropagation(); onObjectClick(kind); }}
        />
      ))}
    </group>
  );
}
