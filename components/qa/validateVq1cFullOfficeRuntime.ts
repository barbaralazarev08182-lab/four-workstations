import { Box3, Vector3 } from "three";
import type { BufferGeometry, Material, Mesh, Object3D, Texture } from "three";

export const VQ1C_FULL_OFFICE_EXPECTED_MATERIALS = [
  "VQ_Wall_Plaster", "VQ_Floor_Wood", "VQ_Desk_Wood", "VQ_Trim_Warm",
  "VQ_Window_Frame", "VQ_Window_Glass", "VQ_Sofa_Fabric", "VQ_Sofa_Fabric_Accent",
  "VQ_Chair_Fabric", "VQ_Metal_Charcoal", "VQ_Plastic_Dark", "VQ_Keycap",
  "VQ_Screen_Glass", "VQ_Lamp_Shade", "VQ_Lamp_Inner", "VQ_Sofa_Legs",
] as const;

const TOP_LEVEL_GROUPS = [
  "OFFICE_ARCH_ROOT", "OFFICE_WORKSTATIONS_ROOT", "OFFICE_AMENITIES_ROOT", "OFFICE_ANCHORS_ROOT",
] as const;

const WORKSTATIONS = [
  { number: 1, position: [-3.2, 0, -1.75], facing: [1, 0, 0] },
  { number: 2, position: [3.2, 0, 1.75], facing: [-1, 0, 0] },
  { number: 3, position: [-3.2, 0, 1.75], facing: [1, 0, 0] },
  { number: 4, position: [3.2, 0, -1.75], facing: [-1, 0, 0] },
] as const;

export const VQ1C_FULL_OFFICE_REQUIRED_ANCHORS = [
  "OFFICE_DESK_1_CENTER_ANCHOR", "OFFICE_DESK_2_CENTER_ANCHOR",
  "OFFICE_DESK_3_CENTER_ANCHOR", "OFFICE_DESK_4_CENTER_ANCHOR",
  "OFFICE_DESK_1_SEAT_ANCHOR", "OFFICE_DESK_2_SEAT_ANCHOR",
  "OFFICE_DESK_3_SEAT_ANCHOR", "OFFICE_DESK_4_SEAT_ANCHOR",
  "OFFICE_MEETING_ANCHOR", "OFFICE_DINING_ANCHOR", "OFFICE_SOFA_ANCHOR",
  "OFFICE_COFFEE_ANCHOR", "OFFICE_RESTROOM_ANCHOR", "OFFICE_ENTRANCE_ANCHOR",
  "OFFICE_CAT_HOME_ANCHOR", "OFFICE_CAT_ACTOR_REST_ANCHOR",
] as const;

export const VQ1C_FULL_OFFICE_INTERNAL_ANCHORS = [
  "DESK_TOP_ANCHOR", "MONITOR_SOCKET", "KEYBOARD_SOCKET", "LAMP_SOCKET",
  "CHAIR_SEAT_ANCHOR", "MONITOR_BASE_ANCHOR", "KEYBOARD_BASE_ANCHOR",
  "LAMP_BASE_ANCHOR", "LIGHT_DESK_ANCHOR",
] as const;

export interface Vq1cFullOfficeWorkstationValidation {
  id: string;
  meshes: number;
  triangles: number;
  position: [number, number, number];
  facing: [number, number, number];
  internalAnchors: number;
  deviceAlignmentMaxError: number;
}

export interface Vq1cFullOfficeRuntimeValidation {
  ok: boolean;
  errors: string[];
  rootCount: number;
  meshes: number;
  triangles: number;
  materials: number;
  textures: number;
  bounds: { min: [number, number, number]; max: [number, number, number] };
  officeAnchors: number;
  internalAnchors: number;
  workstations: Vq1cFullOfficeWorkstationValidation[];
}

const TEXTURE_SLOTS = [
  "map", "roughnessMap", "metalnessMap", "normalMap", "emissiveMap", "aoMap", "alphaMap",
] as const;

function geometryTriangles(geometry: BufferGeometry) {
  return geometry.index
    ? geometry.index.count / 3
    : (geometry.attributes.position?.count ?? 0) / 3;
}

function finiteTransform(object: Object3D) {
  return object.matrixWorld.elements.every(Number.isFinite);
}

function collectSubtreeStats(root: Object3D) {
  let meshes = 0;
  let triangles = 0;
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    meshes += 1;
    triangles += geometryTriangles(mesh.geometry);
  });
  return { meshes, triangles };
}

function exactSubtreeObject(root: Object3D, expectedName: string) {
  let exact: Object3D | null = null;
  let suffixed: Object3D | null = null;
  root.traverse((object) => {
    if (object.name === expectedName) exact = object;
    else if (new RegExp(`^${expectedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.\\d{3}$`).test(object.name)) {
      suffixed = object;
    }
  });
  return exact ?? suffixed;
}

function tuple(vector: Vector3): [number, number, number] {
  return [vector.x, vector.y, vector.z];
}

export function validateVq1cFullOfficeRuntimeScene(scene: Object3D): Vq1cFullOfficeRuntimeValidation {
  scene.updateMatrixWorld(true);
  const errors: string[] = [];
  const roots: Object3D[] = [];
  const materials = new Map<string, Material>();
  const textures = new Map<string, Texture>();
  let meshes = 0;
  let triangles = 0;

  scene.traverse((object) => {
    if (object.name === "VQ1C_FULL_OFFICE_ROOT") roots.push(object);
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    meshes += 1;
    triangles += geometryTriangles(mesh.geometry);
    const assigned = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (!assigned.length || assigned.some((material) => !material)) {
      errors.push(`Mesh without material: ${mesh.name || mesh.uuid}`);
      return;
    }
    for (const material of assigned) {
      if (!material.name) errors.push(`Unnamed material on mesh: ${mesh.name || mesh.uuid}`);
      else materials.set(material.name, material);
      const record = material as unknown as Record<string, unknown>;
      for (const slot of TEXTURE_SLOTS) {
        const texture = record[slot] as Texture | undefined;
        if (texture?.isTexture) textures.set(texture.uuid, texture);
      }
    }
  });

  if (roots.length !== 1) errors.push(`VQ1C_FULL_OFFICE_ROOT count ${roots.length}, expected 1`);
  const root = roots[0] ?? scene;
  if (roots.length === 1) {
    const rotationError = Math.max(Math.abs(root.rotation.x), Math.abs(root.rotation.y), Math.abs(root.rotation.z));
    if (root.position.length() > 0.00001 || rotationError > 0.00001 || root.scale.distanceTo(new Vector3(1, 1, 1)) > 0.00001) {
      errors.push("VQ1C_FULL_OFFICE_ROOT transform is not identity");
    }
    for (const name of TOP_LEVEL_GROUPS) {
      const matches = root.children.filter((child) => child.name === name);
      if (matches.length !== 1) errors.push(`${name} direct-child count ${matches.length}, expected 1`);
    }
  }
  for (const forbidden of ["VQ1C_POLISHED_HERO_ROOT", "HERO_ARCH_ROOT", "VQ1C_HERO_ROOT"]) {
    if (scene.getObjectByName(forbidden)) errors.push(`Forbidden Hero Corner root present: ${forbidden}`);
  }

  for (const name of VQ1C_FULL_OFFICE_EXPECTED_MATERIALS) {
    if (!materials.has(name)) errors.push(`Missing material: ${name}`);
  }
  for (const name of materials.keys()) {
    if (/clay|preview|temp/i.test(name)) errors.push(`Forbidden production material: ${name}`);
  }
  const windowGlass = materials.get("VQ_Window_Glass");
  const screenGlass = materials.get("VQ_Screen_Glass");
  if (windowGlass && screenGlass && windowGlass === screenGlass) {
    errors.push("Window glass and screen glass share one material object");
  }

  const bounds = new Box3().setFromObject(root);
  const expectedMin = new Vector3(-8.1, -0.41, -6.6);
  const expectedMax = new Vector3(8.1, 4.5, 6.6);
  if (bounds.min.distanceTo(expectedMin) > 0.003 || bounds.max.distanceTo(expectedMax) > 0.003) {
    errors.push(`Bounds ${tuple(bounds.min).join(",")}..${tuple(bounds.max).join(",")} differ from contract`);
  }

  const officeAnchorsRoot = root.getObjectByName("OFFICE_ANCHORS_ROOT");
  let officeAnchors = 0;
  for (const name of VQ1C_FULL_OFFICE_REQUIRED_ANCHORS) {
    const anchor = officeAnchorsRoot ? exactSubtreeObject(officeAnchorsRoot, name) : null;
    if (!anchor) errors.push(`Missing Office anchor: ${name}`);
    else if ((anchor as Mesh).isMesh) errors.push(`Office anchor rendered as Mesh: ${name}`);
    else if (!finiteTransform(anchor)) errors.push(`Office anchor transform is not finite: ${name}`);
    else officeAnchors += 1;
  }

  const workstationResults: Vq1cFullOfficeWorkstationValidation[] = [];
  let internalAnchors = 0;
  for (const workstation of WORKSTATIONS) {
    const id = `desk_${workstation.number}`;
    const workstationRoot = root.getObjectByName(`OFFICE_WORKSTATION_DESK_${workstation.number}_ROOT`);
    if (!workstationRoot) {
      errors.push(`Missing Workstation root: ${id}`);
      continue;
    }
    const position = workstationRoot.getWorldPosition(new Vector3());
    const expectedPosition = new Vector3(...workstation.position);
    if (position.distanceTo(expectedPosition) > 0.001) errors.push(`${id} world position differs from contract`);
    const facing = new Vector3(0, 0, 1).applyQuaternion(workstationRoot.getWorldQuaternion(workstationRoot.quaternion.clone())).normalize();
    const expectedFacing = new Vector3(...workstation.facing);
    if (facing.distanceTo(expectedFacing) > 0.00001) errors.push(`${id} facing differs from contract`);
    const subtreeStats = collectSubtreeStats(workstationRoot);
    if (subtreeStats.meshes !== 73) errors.push(`${id} mesh count ${subtreeStats.meshes}, expected 73`);
    if (subtreeStats.triangles !== 12_544) errors.push(`${id} triangles ${subtreeStats.triangles}, expected 12544`);

    let workstationAnchors = 0;
    for (const semanticName of VQ1C_FULL_OFFICE_INTERNAL_ANCHORS) {
      const expectedName = `D${workstation.number}_${semanticName}`;
      const anchor = exactSubtreeObject(workstationRoot, expectedName);
      if (!anchor) errors.push(`${id} missing internal anchor: ${semanticName}`);
      else if ((anchor as Mesh).isMesh) errors.push(`${id} internal anchor is Mesh: ${semanticName}`);
      else if (!finiteTransform(anchor)) errors.push(`${id} internal anchor transform is not finite: ${semanticName}`);
      else workstationAnchors += 1;
    }
    internalAnchors += workstationAnchors;

    let alignmentMax = 0;
    for (const [base, socket] of [
      ["MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"],
      ["KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"],
      ["LAMP_BASE_ANCHOR", "LAMP_SOCKET"],
    ] as const) {
      const baseAnchor = exactSubtreeObject(workstationRoot, `D${workstation.number}_${base}`);
      const socketAnchor = exactSubtreeObject(workstationRoot, `D${workstation.number}_${socket}`);
      if (baseAnchor && socketAnchor) {
        const error = baseAnchor.getWorldPosition(new Vector3()).distanceTo(socketAnchor.getWorldPosition(new Vector3()));
        alignmentMax = Math.max(alignmentMax, error);
        if (error > 0.0001) errors.push(`${id} ${base}/${socket} alignment error ${error}`);
      }
    }
    workstationResults.push({
      id,
      meshes: subtreeStats.meshes,
      triangles: subtreeStats.triangles,
      position: tuple(position),
      facing: tuple(facing),
      internalAnchors: workstationAnchors,
      deviceAlignmentMaxError: alignmentMax,
    });
  }

  if (meshes !== 359) errors.push(`Mesh count ${meshes}, expected 359`);
  if (triangles !== 57_312) errors.push(`Triangle count ${triangles}, expected 57312`);
  if (materials.size !== 16) errors.push(`Material count ${materials.size}, expected 16`);
  if (textures.size !== 10) errors.push(`Texture count ${textures.size}, expected 10`);
  if (officeAnchors !== 16) errors.push(`Required Office anchor count ${officeAnchors}, expected 16`);
  if (internalAnchors !== 36) errors.push(`Internal anchor count ${internalAnchors}, expected 36`);

  return {
    ok: errors.length === 0,
    errors,
    rootCount: roots.length,
    meshes,
    triangles,
    materials: materials.size,
    textures: textures.size,
    bounds: { min: tuple(bounds.min), max: tuple(bounds.max) },
    officeAnchors,
    internalAnchors,
    workstations: workstationResults,
  };
}
