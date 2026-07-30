import { MathUtils } from "three";
import type { StatusKey } from "@/lib/types";
import type { CharacterRigRefs } from "@/components/office-3d/ProceduralCharacter";
import type { CharacterActionState } from "@/components/office-3d/character-actions";

interface CharacterAnimationFrame {
  rig: CharacterRigRefs;
  action: CharacterActionState;
  status: StatusKey;
  elapsed: number;
  delta: number;
  phaseOffset: number;
}

function damp(current: number, target: number, delta: number, speed = 10) {
  return MathUtils.damp(current, target, speed, Math.min(delta, 0.05));
}

function setPose(rig: CharacterRigRefs, action: CharacterActionState, status: StatusKey, elapsed: number, delta: number, phaseOffset: number) {
  const body = rig.bodyGroup.current;
  const head = rig.headGroup.current;
  const leftArm = rig.leftArmPivot.current;
  const rightArm = rig.rightArmPivot.current;
  const leftLeg = rig.leftLegPivot.current;
  const rightLeg = rig.rightLegPivot.current;
  if (!body || !head || !leftArm || !rightArm || !leftLeg || !rightLeg) return;

  const time = elapsed + phaseOffset;
  const idleBreath = Math.sin(time * 1.25) * 0.012;
  const slowShift = Math.sin(time * 0.29) * 0.035;

  let bodyY = 1.08 + idleBreath;
  let bodyRotX = 0;
  let bodyRotZ = 0;
  let headY = 1.8 + idleBreath;
  let headRotY = slowShift;
  let headRotZ = 0;
  let leftArmX = Math.sin(time * 0.52) * 0.018;
  let rightArmX = -Math.sin(time * 0.52) * 0.018;
  let leftArmZ = 0.16;
  let rightArmZ = -0.16;
  let leftLegX = 0;
  let rightLegX = 0;
  let leftLegZ = 0;
  let rightLegZ = 0;
  let hipY = 0.68;

  if (action === "walking") {
    const walkPhase = elapsed * 8 + phaseOffset;
    const swing = Math.sin(walkPhase);
    leftLegX = swing * 0.46;
    rightLegX = -swing * 0.46;
    leftArmX = -swing * 0.36;
    rightArmX = swing * 0.36;
    bodyY = 1.08 + Math.abs(Math.sin(walkPhase * 2)) * 0.025;
    headY = 1.8 + Math.abs(Math.sin(walkPhase * 2)) * 0.018;
    headRotZ = -swing * 0.018;
  } else if (action === "sitting" || action === "typing" || action === "eating" || action === "slacking") {
    bodyY = 0.82 + idleBreath;
    headY = 1.54 + idleBreath;
    hipY = 0.53;
    leftLegX = -1.22;
    rightLegX = -1.22;
    leftLegZ = -0.04;
    rightLegZ = 0.04;

    if (action === "typing") {
      const typePhase = Math.sin(time * 9);
      leftArmX = -1.04 + typePhase * 0.07;
      rightArmX = -1.04 - typePhase * 0.07;
      leftArmZ = 0.09;
      rightArmZ = -0.09;
      bodyRotX = -0.06;
      headRotY = Math.sin(time * 0.7) * 0.025;
    } else if (action === "eating") {
      const bite = (Math.sin(time * 2.8) + 1) / 2;
      leftArmX = -0.78;
      rightArmX = -0.72 - bite * 0.85;
      bodyRotX = -0.04;
      headRotZ = Math.sin(time * 1.4) * 0.018;
    } else if (action === "slacking") {
      bodyRotX = 0.11;
      rightArmX = -0.78;
      rightArmZ = -0.28;
      leftArmX = -0.22;
      headRotY = Math.sin(time * 0.8) * 0.09;
    } else {
      leftArmX = -0.38 + Math.sin(time * 0.6) * 0.025;
      rightArmX = -0.32;
      if (status === "meeting") {
        rightArmX = -0.48 + Math.max(0, Math.sin(time * 0.9)) * -0.32;
        headRotZ = Math.sin(time * 1.05) * 0.025;
      }
    }
  } else if (action === "drinking") {
    const sip = (Math.sin(time * 2) + 1) / 2;
    rightArmX = -0.75 - sip * 0.78;
    rightArmZ = -0.12;
    leftArmX = -0.12;
    headRotZ = -sip * 0.025;
  } else if (action === "resting") {
    const napping = status === "napping";
    bodyY = napping ? 0.62 + idleBreath : 0.76 + idleBreath;
    headY = napping ? 1.18 + idleBreath : 1.45 + idleBreath;
    hipY = napping ? 0.42 : 0.5;
    bodyRotX = napping ? -0.18 : 0.1;
    bodyRotZ = napping ? -0.82 : -0.08;
    headRotZ = napping ? -0.65 : -0.06;
    leftArmX = napping ? -0.18 : -0.32;
    rightArmX = napping ? 0.12 : -0.2;
    leftLegX = napping ? -0.22 : -1.05;
    rightLegX = napping ? 0.15 : -1.0;
  } else if (action === "waving") {
    rightArmZ = -2.55;
    rightArmX = Math.sin(time * 7) * 0.32;
    headRotZ = Math.sin(time * 1.4) * 0.035;
  }

  body.position.y = damp(body.position.y, bodyY, delta, 11);
  body.rotation.x = damp(body.rotation.x, bodyRotX, delta, 9);
  body.rotation.z = damp(body.rotation.z, bodyRotZ, delta, 9);
  head.position.y = damp(head.position.y, headY, delta, 11);
  head.rotation.y = damp(head.rotation.y, headRotY, delta, 5);
  head.rotation.z = damp(head.rotation.z, headRotZ, delta, 7);
  leftArm.position.y = damp(leftArm.position.y, action === "walking" ? 1.45 : bodyY + 0.37, delta, 11);
  rightArm.position.y = damp(rightArm.position.y, action === "walking" ? 1.45 : bodyY + 0.37, delta, 11);
  leftArm.rotation.x = damp(leftArm.rotation.x, leftArmX, delta, action === "walking" ? 18 : 10);
  rightArm.rotation.x = damp(rightArm.rotation.x, rightArmX, delta, action === "walking" ? 18 : 10);
  leftArm.rotation.z = damp(leftArm.rotation.z, leftArmZ, delta, 10);
  rightArm.rotation.z = damp(rightArm.rotation.z, rightArmZ, delta, 10);
  leftLeg.position.y = damp(leftLeg.position.y, hipY, delta, 11);
  rightLeg.position.y = damp(rightLeg.position.y, hipY, delta, 11);
  leftLeg.rotation.x = damp(leftLeg.rotation.x, leftLegX, delta, action === "walking" ? 18 : 10);
  rightLeg.rotation.x = damp(rightLeg.rotation.x, rightLegX, delta, action === "walking" ? 18 : 10);
  leftLeg.rotation.z = damp(leftLeg.rotation.z, leftLegZ, delta, 10);
  rightLeg.rotation.z = damp(rightLeg.rotation.z, rightLegZ, delta, 10);
}

export function applyCharacterAnimation(frame: CharacterAnimationFrame) {
  setPose(frame.rig, frame.action, frame.status, frame.elapsed, frame.delta, frame.phaseOffset);
  const fish = frame.rig.fishGroup.current;
  if (fish) {
    fish.visible = frame.action === "slacking";
    fish.position.y = 2.72 + Math.sin((frame.elapsed + frame.phaseOffset) * 2) * 0.08;
    fish.rotation.y = Math.sin((frame.elapsed + frame.phaseOffset) * 0.75) * 0.28;
  }
}
