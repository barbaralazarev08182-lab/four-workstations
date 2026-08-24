// FR-6 final R3 direct-only office contract validation.
// Shared by the formal OfficeWorld visual layer; the QA layer keeps the
// legacy VP2 validator for the old asset.
import { Box3, Vector3 } from "three";
import type { BufferGeometry, Material, Mesh, Object3D } from "three";
import { VQ1C_FINAL_OFFICE_EXPECTED } from "@/lib/three/vq1cRuntime";
import {
  VQ1C_FULL_OFFICE_INTERNAL_ANCHORS,
  VQ1C_FULL_OFFICE_REQUIRED_ANCHORS,
} from "@/lib/three/validateVq1cFullOfficeRuntime";

export const VQ1C_FINAL_OFFICE_WORKSTATIONS = [
  { number: 1, position: [-3.2, 0, -1.75] },
  { number: 2, position: [3.2, 0, 1.75] },
  { number: 3, position: [-3.2, 0, 1.75] },
  { number: 4, position: [3.2, 0, -1.75] },
] as const;

export interface Vq1cFinalOfficeValidation {
  ok: boolean;
  errors: string[];
  runtimeGroups: number;
  sceneMeshes: number;
  triangles: number;
  materials: number;
  primitives: number;
  uvOk: boolean;
  uv1Ok: boolean;
  uv2Count: number;
  bounds: { min: [number, number, number]; max: [number, number, number] };
  officeAnchors: number;
  internalAnchors: number;
  workstationPositionsOk: boolean;
}

function geometryTriangles(geometry: BufferGeometry) {
  return geometry.index
    ? geometry.index.count / 3
    : (geometry.attributes.position?.count ?? 0) / 3;
}

export function validateVq1cFinalOfficeScene(scene: Object3D): Vq1cFinalOfficeValidation {
  scene.updateMatrixWorld(true);
  const errors: string[] = [];

  const roots = scene.getObjectsByProperty("name", "VQ1C_FULL_OFFICE_ROOT");
  if (roots.length !== 1) errors.push(`VQ1C_FULL_OFFICE_ROOT count ${roots.length}, expected 1`);
  const root = roots[0] ?? scene;

  const runtimeGroups = new Set<string>();
  const materials = new Map<string, Material>();
  let sceneMeshes = 0;
  let triangles = 0;
  let primitives = 0;
  let uvOk = true;
  let uv1Ok = true;
  let uv2Count = 0;

  scene.traverse((object) => {
    if (typeof object.name === "string" && object.name.startsWith("Runtime_")) runtimeGroups.add(object.name);
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    sceneMeshes += 1;
    primitives += 1;
    triangles += geometryTriangles(mesh.geometry);
    if (mesh.geometry.attributes.uv === undefined) uvOk = false;
    if (mesh.geometry.attributes.uv1 === undefined) uv1Ok = false;
    if (mesh.geometry.attributes.uv2 !== undefined) uv2Count += 1;
    const assigned = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of assigned) {
      if (material?.name) materials.set(material.name, material);
    }
  });

  if (runtimeGroups.size !== VQ1C_FINAL_OFFICE_EXPECTED.runtimeGroups) {
    errors.push(`Runtime group count ${runtimeGroups.size}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.runtimeGroups}`);
  }
  if (sceneMeshes !== VQ1C_FINAL_OFFICE_EXPECTED.primitives) {
    errors.push(`Scene mesh count ${sceneMeshes}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.primitives}`);
  }
  if (triangles !== VQ1C_FINAL_OFFICE_EXPECTED.triangles) {
    errors.push(`Triangle count ${triangles}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.triangles}`);
  }
  if (materials.size !== VQ1C_FINAL_OFFICE_EXPECTED.materials) {
    errors.push(`Material count ${materials.size}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.materials}`);
  }
  if (!uvOk) errors.push("Some mesh missing geometry.attributes.uv");
  if (!uv1Ok) errors.push("Some mesh missing geometry.attributes.uv1");
  if (uv2Count !== 0) errors.push(`geometry.attributes.uv2 present on ${uv2Count} mesh objects`);

  const bounds = new Box3().setFromObject(root);
  const expectedMin = new Vector3(...VQ1C_FINAL_OFFICE_EXPECTED.boundsMin);
  const expectedMax = new Vector3(...VQ1C_FINAL_OFFICE_EXPECTED.boundsMax);
  if (bounds.min.distanceTo(expectedMin) > 0.003 || bounds.max.distanceTo(expectedMax) > 0.003) {
    errors.push(`Bounds ${bounds.min.toArray().join(",")}..${bounds.max.toArray().join(",")} differ from contract`);
  }

  const officeAnchorsRoot = root.getObjectByName("OFFICE_ANCHORS_ROOT");
  let officeAnchors = 0;
  for (const name of VQ1C_FULL_OFFICE_REQUIRED_ANCHORS) {
    const anchor = officeAnchorsRoot?.getObjectByName(name) ?? null;
    if (!anchor) errors.push(`Missing Office anchor: ${name}`);
    else if ((anchor as Mesh).isMesh) errors.push(`Office anchor rendered as Mesh: ${name}`);
    else officeAnchors += 1;
  }

  let internalAnchors = 0;
  for (const workstation of VQ1C_FINAL_OFFICE_WORKSTATIONS) {
    for (const semanticName of VQ1C_FULL_OFFICE_INTERNAL_ANCHORS) {
      const anchor = root.getObjectByName(`D${workstation.number}_${semanticName}`);
      if (!anchor) errors.push(`desk_${workstation.number} missing internal anchor: ${semanticName}`);
      else if ((anchor as Mesh).isMesh) errors.push(`desk_${workstation.number} internal anchor is Mesh: ${semanticName}`);
      else internalAnchors += 1;
    }
  }

  let workstationPositionsOk = true;
  for (const workstation of VQ1C_FINAL_OFFICE_WORKSTATIONS) {
    const workstationRoot = root.getObjectByName(`OFFICE_WORKSTATION_DESK_${workstation.number}_ROOT`);
    if (!workstationRoot) {
      errors.push(`Missing Workstation root: desk_${workstation.number}`);
      workstationPositionsOk = false;
      continue;
    }
    const position = workstationRoot.getWorldPosition(new Vector3());
    const expected = new Vector3(...workstation.position);
    if (position.distanceTo(expected) > 0.001) {
      errors.push(`desk_${workstation.number} world position ${position.toArray().join(",")} differs from contract`);
      workstationPositionsOk = false;
    }
  }

  if (officeAnchors !== VQ1C_FINAL_OFFICE_EXPECTED.officeAnchors) {
    errors.push(`Office anchor count ${officeAnchors}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.officeAnchors}`);
  }
  if (internalAnchors !== VQ1C_FINAL_OFFICE_EXPECTED.internalAnchors) {
    errors.push(`Internal anchor count ${internalAnchors}, expected ${VQ1C_FINAL_OFFICE_EXPECTED.internalAnchors}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    runtimeGroups: runtimeGroups.size,
    sceneMeshes,
    triangles,
    materials: materials.size,
    primitives,
    uvOk,
    uv1Ok,
    uv2Count,
    bounds: {
      min: [bounds.min.x, bounds.min.y, bounds.min.z],
      max: [bounds.max.x, bounds.max.y, bounds.max.z],
    },
    officeAnchors,
    internalAnchors,
    workstationPositionsOk,
  };
}
