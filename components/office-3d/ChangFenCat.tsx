"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MAT, matColor } from "@/components/office-3d/scene-config";

export type CatPose = "idle" | "lying" | "walking";

interface ChangFenCatProps {
  isNight: boolean;
  /** Dev-only pose override (QA). When set, the automatic cycle is paused. */
  forcedPose?: CatPose | null;
  /** Facing (rotation.y) used when idle/lying — toward the room center. */
  restRotation?: number;
  onClick?: () => void;
}

// Small lazy patrol ellipse around the foreground resting spot (relative to the
// cat's parent group placed at CAT_ACTOR_CENTER). Kept tiny so the cat never
// leaves the red-circle area or crosses the dock / workstations / paths.
const WALK_RADIUS_X = 0.3;
const WALK_RADIUS_Z = 0.22;
const WALK_SPEED = 0.5; // slow, lazy

// Deterministic pseudo-random in [0,1) from a counter.
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ChangFenCat({ isNight, forcedPose = null, restRotation = 0, onClick }: ChangFenCatProps) {
  const root = useRef<Group>(null);
  const bodyPivot = useRef<Group>(null);
  const head = useRef<Group>(null);
  const tail = useRef<Group>(null);
  const eyeL = useRef<Group>(null);
  const eyeR = useRef<Group>(null);
  const legFL = useRef<Group>(null);
  const legFR = useRef<Group>(null);
  const legBL = useRef<Group>(null);
  const legBR = useRef<Group>(null);

  const pose = useRef<CatPose>("idle");
  const poseTime = useRef(0);
  const duration = useRef(12);
  const cycleStep = useRef(0);
  const walkAngle = useRef(0);
  const walkPhase = useRef(0);
  const blinkTimer = useRef(3);
  const blinkPhase = useRef(0); // 0 = not blinking
  // Interpolated pose values
  const bodyY = useRef(0);
  const bodySquash = useRef(1);
  const legTuck = useRef(1);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const activePose: CatPose = forcedPose ?? pose.current;

    // Advance the local pose cycle (only when not overridden)
    if (!forcedPose) {
      poseTime.current += d;
      if (poseTime.current >= duration.current) {
        poseTime.current = 0;
        cycleStep.current += 1;
        const step = cycleStep.current % 4;
        // idle -> walking -> idle -> lying
        if (step === 0) { pose.current = "idle"; duration.current = 10 + jitter(cycleStep.current) * 8; }
        else if (step === 1) { pose.current = "walking"; duration.current = 3 + jitter(cycleStep.current) * 3; }
        else if (step === 2) { pose.current = "idle"; duration.current = 6 + jitter(cycleStep.current) * 6; }
        else { pose.current = "lying"; duration.current = 10 + jitter(cycleStep.current) * 10; }
      }
    }

    // Pose targets
    const lying = activePose === "lying";
    const walking = activePose === "walking";
    const targetBodyY = lying ? -0.15 : 0;
    const targetSquash = lying ? 0.66 : 1;
    const targetTuck = lying ? 0.35 : 1;
    bodyY.current += (targetBodyY - bodyY.current) * Math.min(1, d * 5);
    bodySquash.current += (targetSquash - bodySquash.current) * Math.min(1, d * 5);
    legTuck.current += (targetTuck - legTuck.current) * Math.min(1, d * 5);

    // Breathing
    const breath = 1 + Math.sin(t * 1.8) * 0.02;

    if (bodyPivot.current) {
      bodyPivot.current.position.y = bodyY.current;
      bodyPivot.current.scale.set(1, bodySquash.current * breath, 1);
    }

    // Walking movement along a small ellipse around the resting spot
    if (root.current) {
      if (walking) {
        walkAngle.current += WALK_SPEED * d;
        walkPhase.current += d * 7;
        const a = walkAngle.current;
        root.current.position.set(
          Math.cos(a) * WALK_RADIUS_X,
          0,
          Math.sin(a) * WALK_RADIUS_Z,
        );
        root.current.rotation.y = Math.atan2(-Math.sin(a) * WALK_RADIUS_X, Math.cos(a) * WALK_RADIUS_Z);
      } else {
        // Ease back toward the resting spot and the rest facing
        root.current.position.x += (0 - root.current.position.x) * Math.min(1, d * 2);
        root.current.position.z += (0 - root.current.position.z) * Math.min(1, d * 2);
        const dr = Math.atan2(Math.sin(restRotation - root.current.rotation.y), Math.cos(restRotation - root.current.rotation.y));
        root.current.rotation.y += dr * Math.min(1, d * 2);
        walkPhase.current *= 1 - Math.min(1, d * 4);
      }
    }

    // Leg swing (walking) / tucked (lying)
    const swing = walking ? Math.sin(walkPhase.current) * 0.45 : 0;
    if (legFL.current) { legFL.current.rotation.x = swing; legFL.current.scale.y = legTuck.current; }
    if (legBR.current) { legBR.current.rotation.x = swing; legBR.current.scale.y = legTuck.current; }
    if (legFR.current) { legFR.current.rotation.x = -swing; legFR.current.scale.y = legTuck.current; }
    if (legBL.current) { legBL.current.rotation.x = -swing; legBL.current.scale.y = legTuck.current; }

    // Gentle body bob while walking
    if (bodyPivot.current && walking) {
      bodyPivot.current.position.y += Math.abs(Math.sin(walkPhase.current)) * 0.02;
    }

    // Tail sway
    if (tail.current) {
      const sway = lying ? 0.35 + Math.sin(t * 0.8) * 0.05 : Math.sin(t * 1.5) * 0.22;
      tail.current.rotation.z = sway;
    }

    // Head stays level; slight lift while lying
    if (head.current) {
      head.current.position.y = 0.42 + (lying ? 0.04 : 0) + Math.sin(t * 1.8) * 0.006;
    }

    // Blinking — half-lidded base, occasional full blink
    blinkTimer.current -= d;
    if (blinkPhase.current > 0) {
      blinkPhase.current -= d;
    } else if (blinkTimer.current <= 0) {
      blinkPhase.current = 0.14;
      blinkTimer.current = 2.5 + jitter(Math.floor(t)) * 3;
    }
    const eyeOpen = blinkPhase.current > 0 ? 0.12 : 0.55; // half-lidded grumpy default
    if (eyeL.current) eyeL.current.scale.y = eyeOpen;
    if (eyeR.current) eyeR.current.scale.y = eyeOpen;
  });

  const body = matColor(MAT.catBody, isNight);
  const light = matColor(MAT.catLight, isNight);
  const earInner = matColor(MAT.catEarInner, isNight);
  const nose = matColor(MAT.catNose, isNight);
  const eye = matColor(MAT.catEye, isNight);
  const pupil = matColor(MAT.catPupil, isNight);

  return (
    <group ref={root} name="changfen-cat" position={[0, 0, 0]} onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
      <group ref={bodyPivot}>
        {/* Stocky body — wide, rounded */}
        <mesh castShadow receiveShadow position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.18, 1, 1]}>
          <capsuleGeometry args={[0.3, 0.42, 5, 12]} />
          <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
        </mesh>
        {/* Broad chest */}
        <mesh castShadow position={[0, 0.32, 0.24]} scale={[1.1, 1, 0.9]}>
          <sphereGeometry args={[0.28, 12, 10]} />
          <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
        </mesh>

        {/* Head — large, wider than tall */}
        <group ref={head} position={[0, 0.42, 0.42]}>
          <mesh castShadow receiveShadow scale={[1.22, 1.0, 1.05]}>
            <sphereGeometry args={[0.3, 14, 12]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
          {/* Thick cheeks */}
          <mesh castShadow position={[-0.2, -0.06, 0.14]}>
            <sphereGeometry args={[0.16, 10, 8]} />
            <meshStandardMaterial color={light} roughness={MAT.catLight.roughness} metalness={0} />
          </mesh>
          <mesh castShadow position={[0.2, -0.06, 0.14]}>
            <sphereGeometry args={[0.16, 10, 8]} />
            <meshStandardMaterial color={light} roughness={MAT.catLight.roughness} metalness={0} />
          </mesh>
          {/* Short flat muzzle */}
          <mesh position={[0, -0.07, 0.26]} scale={[1.2, 0.8, 0.8]}>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color={light} roughness={MAT.catLight.roughness} metalness={0} />
          </mesh>
          {/* Nose */}
          <mesh position={[0, -0.03, 0.35]} scale={[1.3, 0.9, 0.7]}>
            <sphereGeometry args={[0.045, 8, 6]} />
            <meshStandardMaterial color={nose} roughness={MAT.catNose.roughness} metalness={0} />
          </mesh>
          {/* Eyes — golden, half-lidded (scaled in useFrame) */}
          <group ref={eyeL} position={[-0.13, 0.05, 0.24]}>
            <mesh scale={[1, 1, 0.55]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color={eye} roughness={MAT.catEye.roughness} metalness={0} />
            </mesh>
            <mesh position={[0, 0, 0.03]} scale={[0.5, 0.85, 0.4]}>
              <sphereGeometry args={[0.05, 8, 6]} />
              <meshStandardMaterial color={pupil} roughness={MAT.catPupil.roughness} metalness={0} />
            </mesh>
          </group>
          <group ref={eyeR} position={[0.13, 0.05, 0.24]}>
            <mesh scale={[1, 1, 0.55]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color={eye} roughness={MAT.catEye.roughness} metalness={0} />
            </mesh>
            <mesh position={[0, 0, 0.03]} scale={[0.5, 0.85, 0.4]}>
              <sphereGeometry args={[0.05, 8, 6]} />
              <meshStandardMaterial color={pupil} roughness={MAT.catPupil.roughness} metalness={0} />
            </mesh>
          </group>
          {/* Small wide-set ears + inner */}
          <mesh castShadow position={[-0.19, 0.26, 0.02]} rotation={[0, 0, 0.28]}>
            <coneGeometry args={[0.09, 0.16, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
          <mesh position={[-0.19, 0.25, 0.05]} rotation={[0, 0, 0.28]}>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial color={earInner} roughness={MAT.catEarInner.roughness} metalness={0} />
          </mesh>
          <mesh castShadow position={[0.19, 0.26, 0.02]} rotation={[0, 0, -0.28]}>
            <coneGeometry args={[0.09, 0.16, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
          <mesh position={[0.19, 0.25, 0.05]} rotation={[0, 0, -0.28]}>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial color={earInner} roughness={MAT.catEarInner.roughness} metalness={0} />
          </mesh>
        </group>

        {/* Short thick legs */}
        <group ref={legFL} position={[-0.17, 0.16, 0.22]}>
          <mesh castShadow position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.095, 0.2, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
        </group>
        <group ref={legFR} position={[0.17, 0.16, 0.22]}>
          <mesh castShadow position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.095, 0.2, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
        </group>
        <group ref={legBL} position={[-0.17, 0.16, -0.22]}>
          <mesh castShadow position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.095, 0.2, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
        </group>
        <group ref={legBR} position={[0.17, 0.16, -0.22]}>
          <mesh castShadow position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.095, 0.2, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
        </group>

        {/* Thick short tail with rounded tip */}
        <group ref={tail} position={[0, 0.34, -0.34]}>
          <mesh castShadow position={[0, 0.12, -0.06]} rotation={[0.7, 0, 0]}>
            <capsuleGeometry args={[0.075, 0.26, 4, 8]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
          <mesh position={[0, 0.28, -0.16]}>
            <sphereGeometry args={[0.09, 8, 6]} />
            <meshStandardMaterial color={body} roughness={MAT.catBody.roughness} metalness={0} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
