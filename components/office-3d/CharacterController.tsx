"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils, Mesh, MeshStandardMaterial, Vector3, type Group, type Material } from "three";
import type { CharacterInteractionEffect, OfficeUser } from "@/lib/types";
import { CharacterRenderer } from "@/components/office-3d/CharacterRenderer";
import {
  getActionForStatus,
  getDestinationForStatus,
  isHiddenStatus,
  type CharacterActionState,
  type CharacterDebugCommand,
  type CharacterDestinationKey,
} from "@/components/office-3d/character-actions";
import { buildCharacterPath, getCharacterDestination } from "@/components/office-3d/character-paths";
import type { InteractionAnchor } from "@/components/office-3d/scene-config";

interface CharacterControllerProps {
  user: OfficeUser;
  index: number;
  speedMultiplier: number;
  debugCommand: CharacterDebugCommand | null;
  onClick: (anchor: InteractionAnchor) => void;
  interactionEffect?: CharacterInteractionEffect;
  /** Gate 2: hide the legacy procedural visual (business root stays the
   *  transform source of truth; the new Two-Scene visual follows it). */
  hiddenVisual?: boolean;
}

const DEBUG_DESTINATIONS: CharacterDestinationKey[] = ["desk", "meeting", "dining", "sofa", "coffee", "restroom", "entrance"];

function isDestinationAction(value: string): value is CharacterDestinationKey {
  return DEBUG_DESTINATIONS.includes(value as CharacterDestinationKey);
}

function lerpAngle(current: number, target: number, alpha: number) {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * alpha;
}

function updateMaterialOpacity(root: Group, opacity: number) {
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material: Material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      material.transparent = true;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.35;
    });
  });
}

export function CharacterController({ user, index, speedMultiplier, debugCommand, onClick, interactionEffect, hiddenVisual = false }: CharacterControllerProps) {
  const sceneKey = user.sceneKey ?? user.id;
  const initialDestination = getCharacterDestination(sceneKey, getDestinationForStatus(user.status));
  const initialAction = getActionForStatus(user.status);
  const [visualAction, setVisualAction] = useState<CharacterActionState>(initialAction);
  const [moving, setMoving] = useState(false);
  const [interactionAction, setInteractionAction] = useState<CharacterActionState | null>(null);

  const characterRoot = useRef<Group>(null);

  const currentPosition = useRef(new Vector3(...initialDestination.position));
  const targetPosition = useRef(new Vector3(...initialDestination.position));
  const currentRotation = useRef(initialDestination.rotation);
  const targetRotation = useRef(initialDestination.rotation);
  const movementPath = useRef<Vector3[]>([]);
  const currentWaypointIndex = useRef(0);
  const isMoving = useRef(false);
  const actionState = useRef<CharacterActionState>(initialAction);
  const targetAction = useRef<CharacterActionState>(initialAction);
  const isVisible = useRef(!isHiddenStatus(user.status));
  const opacity = useRef(isHiddenStatus(user.status) ? 0 : 1);
  const targetOpacity = useRef(isHiddenStatus(user.status) ? 0 : 1);
  const pendingHide = useRef(isHiddenStatus(user.status));
  const sourceDestination = useRef<CharacterDestinationKey>(getDestinationForStatus(user.status));
  const initialized = useRef(false);
  const interactionAge = useRef(0);
  const activeInteractionKind = useRef<CharacterInteractionEffect["kind"] | null>(null);

  const setAction = useCallback((action: CharacterActionState) => {
    actionState.current = action;
    setVisualAction((current) => current === action ? current : action);
  }, [setVisualAction]);

  const finishJourney = useCallback(() => {
    isMoving.current = false;
    setMoving(false);
    targetPosition.current.copy(currentPosition.current);
    setAction(targetAction.current === "hidden" ? "idle" : targetAction.current);
    if (targetAction.current === "hidden") {
      pendingHide.current = true;
      targetOpacity.current = 0;
    }
  }, [setAction]);

  const startJourney = useCallback((destinationKey: CharacterDestinationKey, finalAction: CharacterActionState, previousDestination: CharacterDestinationKey) => {
    const root = characterRoot.current;
    if (root) currentPosition.current.copy(root.position);
    const next = buildCharacterPath(sceneKey, currentPosition.current, previousDestination, destinationKey, isMoving.current);

    movementPath.current = next.path;
    currentWaypointIndex.current = 0;
    targetAction.current = finalAction;
    targetRotation.current = next.destination.rotation;
    pendingHide.current = false;
    isVisible.current = true;
    targetOpacity.current = 1;
    if (root) root.visible = true;
    sourceDestination.current = destinationKey;

    if (next.path.length === 0 || currentPosition.current.distanceTo(new Vector3(...next.destination.position)) < 0.08) {
      currentPosition.current.set(...next.destination.position);
      if (root) root.position.copy(currentPosition.current);
      finishJourney();
      return;
    }

    targetPosition.current.copy(next.path[0]);
    isMoving.current = true;
    setMoving(true);
    setAction("walking");
  }, [finishJourney, sceneKey, setAction]);

  const resetToDesk = useCallback(() => {
    const destination = getCharacterDestination(sceneKey, "desk");
    currentPosition.current.set(...destination.position);
    targetPosition.current.copy(currentPosition.current);
    currentRotation.current = destination.rotation;
    targetRotation.current = destination.rotation;
    movementPath.current = [];
    currentWaypointIndex.current = 0;
    isMoving.current = false;
    isVisible.current = true;
    opacity.current = 1;
    targetOpacity.current = 1;
    pendingHide.current = false;
    if (characterRoot.current) {
      characterRoot.current.position.copy(currentPosition.current);
      characterRoot.current.rotation.y = destination.rotation;
      characterRoot.current.visible = true;
      updateMaterialOpacity(characterRoot.current, 1);
    }
    setMoving(false);
    setAction("idle");
    sourceDestination.current = "desk";
  }, [sceneKey, setAction]);

  useEffect(() => {
    const root = characterRoot.current;
    if (!root) return;
    root.position.copy(currentPosition.current);
    root.rotation.y = currentRotation.current;
    root.visible = isVisible.current;
    updateMaterialOpacity(root, opacity.current);
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    const destinationKey = getDestinationForStatus(user.status);
    const nextAction = getActionForStatus(user.status);
    const previous = sourceDestination.current;
    startJourney(destinationKey, nextAction, previous);
  }, [startJourney, user.status, user.statusSince]);

  useEffect(() => {
    if (!interactionEffect) return;
    interactionAge.current = 0;
    activeInteractionKind.current = interactionEffect.kind;
    const shouldWave = interactionEffect.kind === "poke" || interactionEffect.kind === "send_coffee";
    const startTimer = window.setTimeout(() => { if (shouldWave) setInteractionAction("waving"); }, 0);
    const timer = window.setTimeout(() => {
      setInteractionAction(null);
      activeInteractionKind.current = null;
    }, 1500);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(timer);
    };
  }, [interactionEffect]);

  useEffect(() => {
    if (!debugCommand) return;
    const isTarget = debugCommand.scope === "all" || user.isCurrentUser;
    if (!isTarget) return;
    const timer = window.setTimeout(() => {
      if (debugCommand.action === "reset") {
        resetToDesk();
        return;
      }
      if (debugCommand.action === "playAll") {
        const destinations: CharacterDestinationKey[] = ["meeting", "dining", "sofa", "coffee"];
        const destination = destinations[index % destinations.length];
        const finalActions: CharacterActionState[] = ["sitting", "eating", "resting", "drinking"];
        startJourney(destination, finalActions[index % finalActions.length], sourceDestination.current);
        return;
      }
      if (isDestinationAction(debugCommand.action)) {
        const finalActionByDestination: Record<CharacterDestinationKey, CharacterActionState> = {
          desk: "typing",
          meeting: "sitting",
          dining: "eating",
          sofa: "resting",
          coffee: "drinking",
          restroom: "hidden",
          entrance: "hidden",
        };
        startJourney(debugCommand.action, finalActionByDestination[debugCommand.action], sourceDestination.current);
        return;
      }

      movementPath.current = [];
      isMoving.current = false;
      setMoving(false);
      targetAction.current = debugCommand.action;
      setAction(debugCommand.action);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [debugCommand, index, resetToDesk, setAction, startJourney, user.isCurrentUser]);

  useFrame((_, delta) => {
    const root = characterRoot.current;
    if (!root) return;
    const safeDelta = Math.min(delta, 0.05);

    if (isMoving.current) {
      const waypoint = movementPath.current[currentWaypointIndex.current];
      if (waypoint) {
        const direction = waypoint.clone().sub(currentPosition.current);
        direction.y = 0;
        const distance = direction.length();

        if (distance < 0.08) {
          currentPosition.current.copy(waypoint);
          currentWaypointIndex.current += 1;
          const nextWaypoint = movementPath.current[currentWaypointIndex.current];
          if (nextWaypoint) targetPosition.current.copy(nextWaypoint);
          else finishJourney();
        } else {
          direction.normalize();
          const step = Math.min(distance, 1.62 * speedMultiplier * safeDelta);
          currentPosition.current.addScaledVector(direction, step);
          targetRotation.current = Math.atan2(direction.x, direction.z);
        }
      } else {
        finishJourney();
      }
    }

    const turnAlpha = 1 - Math.exp(-9 * safeDelta);
    currentRotation.current = lerpAngle(currentRotation.current, targetRotation.current, turnAlpha);
    root.position.copy(currentPosition.current);
    if (activeInteractionKind.current === "poke") {
      interactionAge.current += safeDelta;
      const elapsed = interactionAge.current;
      if (elapsed >= 0 && elapsed < 0.8) root.position.y += Math.max(0, Math.sin(elapsed * Math.PI * 2.5)) * 0.16;
    }
    root.rotation.y = currentRotation.current;

    opacity.current = MathUtils.damp(opacity.current, targetOpacity.current, 6.5, safeDelta);
    if (Math.abs(opacity.current - targetOpacity.current) > 0.004) updateMaterialOpacity(root, opacity.current);
    if (pendingHide.current && opacity.current < 0.025) {
      pendingHide.current = false;
      isVisible.current = false;
      root.visible = false;
      setAction("hidden");
    }

  });

  const showRestroomMarker = visualAction === "hidden" && user.status === "restroom";

  return (
    <>
      <CharacterRenderer
        user={user}
        index={index}
        characterRootRef={characterRoot}
        actionState={interactionAction ?? visualAction}
        isMoving={moving}
        interactionEffect={interactionEffect}
        onClick={onClick}
        hiddenVisual={hiddenVisual}
      />
      {showRestroomMarker ? (
        <Html center position={[4.9, 2.65, -5.92]} zIndexRange={[18, 8]}>
          <div className="restroom-status-marker"><strong>{user.name}</strong><span>马上回来</span></div>
        </Html>
      ) : null}
    </>
  );
}
