import type { BufferGeometry, Material, Mesh, Object3D } from "three";

export const VQ1C_EXPECTED_MATERIALS = [
  "VQ_Wall_Plaster", "VQ_Floor_Wood", "VQ_Desk_Wood", "VQ_Trim_Warm",
  "VQ_Window_Frame", "VQ_Window_Glass", "VQ_Sofa_Fabric", "VQ_Sofa_Fabric_Accent",
  "VQ_Chair_Fabric", "VQ_Metal_Charcoal", "VQ_Plastic_Dark", "VQ_Keycap",
  "VQ_Screen_Glass", "VQ_Lamp_Shade", "VQ_Lamp_Inner", "VQ_Sofa_Legs",
] as const;

export const VQ1C_REQUIRED_ROOTS = [
  "VQ1C_POLISHED_HERO_ROOT", "HERO_ARCH_ROOT", "POLISHED_WORKSTATION_ROOT",
  "POLISHED_SOFA_ROOT", "POLISHED_DESK_ROOT", "POLISHED_CHAIR_ROOT",
  "POLISHED_MONITOR_ROOT", "POLISHED_KEYBOARD_ROOT", "POLISHED_LAMP_ROOT",
] as const;

export const VQ1C_REQUIRED_ANCHORS = [
  "DESK_TOP_ANCHOR", "MONITOR_SOCKET", "KEYBOARD_SOCKET", "LAMP_SOCKET",
  "CHAIR_SEAT_ANCHOR", "MONITOR_BASE_ANCHOR", "KEYBOARD_BASE_ANCHOR",
  "LAMP_BASE_ANCHOR", "LIGHT_DESK_ANCHOR",
] as const;

export interface Vq1cRuntimeValidation {
  ok: boolean; errors: string[]; meshes: number; triangles: number;
  materials: number; roots: number; anchors: number;
}

function geometryTriangles(geometry: BufferGeometry) {
  return geometry.index ? geometry.index.count / 3 : (geometry.attributes.position?.count ?? 0) / 3;
}

export function validateVq1cRuntimeScene(scene: Object3D): Vq1cRuntimeValidation {
  const errors: string[] = [];
  const materials = new Map<string, Material>();
  let meshes = 0;
  let triangles = 0;
  scene.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    meshes += 1;
    triangles += geometryTriangles(mesh.geometry);
    const assigned = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (!assigned.length || assigned.some((material) => !material)) {
      errors.push(`Mesh without material: ${mesh.name || mesh.uuid}`);
      return;
    }
    for (const material of assigned) if (material.name) materials.set(material.name, material);
  });
  for (const name of VQ1C_REQUIRED_ROOTS) {
    const matches: Object3D[] = [];
    scene.traverse((object) => { if (object.name === name) matches.push(object); });
    if (matches.length !== 1) errors.push(`${name} count ${matches.length}, expected 1`);
  }
  for (const name of VQ1C_REQUIRED_ANCHORS) {
    const anchor = scene.getObjectByName(name);
    if (!anchor) errors.push(`Missing anchor: ${name}`);
    else if ((anchor as Mesh).isMesh) errors.push(`Anchor rendered as mesh: ${name}`);
  }
  for (const name of VQ1C_EXPECTED_MATERIALS) if (!materials.has(name)) errors.push(`Missing material: ${name}`);
  for (const name of materials.keys()) if (/clay|preview|temp/i.test(name)) errors.push(`Forbidden production material: ${name}`);
  const windowGlass = materials.get("VQ_Window_Glass");
  const screenGlass = materials.get("VQ_Screen_Glass");
  if (windowGlass && screenGlass && windowGlass === screenGlass) errors.push("Window glass and screen glass share one material object");
  if (meshes !== 96) errors.push(`Mesh count ${meshes}, expected 96`);
  if (triangles !== 18_376) errors.push(`Triangle count ${triangles}, expected 18376`);
  if (materials.size !== 16) errors.push(`Material count ${materials.size}, expected 16`);
  return {
    ok: errors.length === 0, errors, meshes, triangles, materials: materials.size,
    roots: VQ1C_REQUIRED_ROOTS.filter((name) => scene.getObjectByName(name)).length,
    anchors: VQ1C_REQUIRED_ANCHORS.filter((name) => scene.getObjectByName(name)).length,
  };
}
