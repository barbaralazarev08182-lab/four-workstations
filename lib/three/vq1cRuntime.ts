import {
  CanvasTexture, LinearFilter, Object3D, PMREMGenerator, Quaternion,
  SRGBColorSpace, Vector3, type WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const VQ1C_PBR_PATH = "/models/vq1/vq1c-hero-corner-pbr.glb";
export const VQ1C_FULL_OFFICE_PBR_PATH = "/models/vq1/vq1c-officeworld-full-pbr.glb";

export interface Vq1cFullOfficeDeskLightTransform {
  deskId: string;
  workstationRoot: Object3D;
  anchor: Object3D;
  position: Vector3;
  direction: Vector3;
  target: Object3D;
}

export function resolveVq1cDeskLightTransform(root: Object3D) {
  root.updateMatrixWorld(true);
  const anchor = root.getObjectByName("LIGHT_DESK_ANCHOR");
  if (!anchor) throw new Error("LIGHT_DESK_ANCHOR missing from VQ-1C PBR model");
  const position = anchor.getWorldPosition(new Vector3());
  const quaternion = anchor.getWorldQuaternion(new Quaternion());
  const encodedDirection = new Vector3(0, 0, -1).applyQuaternion(quaternion).normalize();
  const direction = encodedDirection.y < -0.5
    ? encodedDirection.clone()
    : new Vector3(0, -1, 0).applyQuaternion(quaternion).normalize();
  return { anchor, position, encodedDirection, direction };
}

export function resolveVq1cFullOfficeDeskLights(root: Object3D): Vq1cFullOfficeDeskLightTransform[] {
  root.updateMatrixWorld(true);
  return [1, 2, 3, 4].map((number) => {
    const workstationRoot = root.getObjectByName(`OFFICE_WORKSTATION_DESK_${number}_ROOT`);
    const anchor = workstationRoot?.getObjectByName(`D${number}_LIGHT_DESK_ANCHOR`);
    if (!workstationRoot || !anchor) {
      throw new Error(`desk_${number} LIGHT_DESK_ANCHOR missing from full-office GLB`);
    }
    const position = anchor.getWorldPosition(new Vector3());
    const direction = new Vector3(0, -1, 0);
    const target = new Object3D();
    target.position.copy(position).addScaledVector(direction, 1.2);
    target.updateMatrixWorld(true);
    return { deskId: `desk_${number}`, workstationRoot, anchor, position, direction, target };
  });
}

export function countNamedObjects(root: Object3D, name: string) {
  let count = 0;
  root.traverse((object) => { if (object.name === name) count += 1; });
  return count;
}

export function createVq1cRoomEnvironment(gl: WebGLRenderer, name: string) {
  const pmrem = new PMREMGenerator(gl);
  const environmentScene = new RoomEnvironment();
  const texture = pmrem.fromScene(environmentScene, 0.04).texture;
  environmentScene.dispose();
  texture.name = name;
  return {
    texture,
    dispose: () => {
      texture.dispose();
      pmrem.dispose();
    },
  };
}

export function createVq1cBackdropTexture(kind: "clear" | "rain", name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  if (kind === "clear") {
    gradient.addColorStop(0, "#adc9d8");
    gradient.addColorStop(0.7, "#d9e2df");
    gradient.addColorStop(1, "#eee7d9");
  } else {
    gradient.addColorStop(0, "#607482");
    gradient.addColorStop(0.65, "#87959c");
    gradient.addColorStop(1, "#a8ada9");
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  if (kind === "rain") {
    context.strokeStyle = "rgba(220, 230, 234, 0.13)";
    context.lineWidth = 1;
    for (let x = 18; x < 256; x += 29) {
      context.beginPath();
      context.moveTo(x, 12 + (x % 21));
      context.lineTo(x - 10, 102 + (x % 47));
      context.stroke();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.name = name;
  return texture;
}
