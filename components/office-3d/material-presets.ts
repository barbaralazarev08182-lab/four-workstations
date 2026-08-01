import type { MeshPhysicalMaterialParameters } from "three";

export type MaterialCategory =
  | "wall"
  | "floorWood"
  | "furnitureWood"
  | "softFabric"
  | "fabric"
  | "plastic"
  | "metal"
  | "glass"
  | "screen"
  | "ceramic"
  | "paper";

// Restrained physical material presets — differentiated micro-surface response,
// not just color. Built on three.js MeshPhysicalMaterial (no new dependency).
// envMapIntensity is kept low so the procedural Environment only adds readable
// highlights/reflections without turning the scene into a mirror showroom.
type Variant = MeshPhysicalMaterialParameters;

const PRESETS: Record<MaterialCategory, { day: Variant; night: Variant }> = {
  wall: {
    day: { color: "#efe7d7", roughness: 0.97, metalness: 0, envMapIntensity: 0.15 },
    night: { color: "#474c4b", roughness: 0.97, metalness: 0, envMapIntensity: 0.1 },
  },
  floorWood: {
    day: { color: "#d6b78c", roughness: 0.72, metalness: 0, envMapIntensity: 0.25, clearcoat: 0.18, clearcoatRoughness: 0.6 },
    night: { color: "#574c42", roughness: 0.75, metalness: 0, envMapIntensity: 0.18, clearcoat: 0.15, clearcoatRoughness: 0.6 },
  },
  furnitureWood: {
    day: { color: "#c9a173", roughness: 0.65, metalness: 0, envMapIntensity: 0.3, clearcoat: 0.12, clearcoatRoughness: 0.5 },
    night: { color: "#6e5a45", roughness: 0.68, metalness: 0, envMapIntensity: 0.2, clearcoat: 0.1, clearcoatRoughness: 0.5 },
  },
  softFabric: {
    day: { color: "#a7b0ba", roughness: 0.96, metalness: 0, envMapIntensity: 0.2, sheen: 0.5, sheenRoughness: 0.9, sheenColor: "#c8ccd2" },
    night: { color: "#5b6068", roughness: 0.96, metalness: 0, envMapIntensity: 0.15, sheen: 0.45, sheenRoughness: 0.9, sheenColor: "#6d727a" },
  },
  fabric: {
    day: { color: "#8a9d8a", roughness: 0.95, metalness: 0, envMapIntensity: 0.22, sheen: 0.4, sheenRoughness: 0.85, sheenColor: "#a4b4a4" },
    night: { color: "#4c574a", roughness: 0.95, metalness: 0, envMapIntensity: 0.15, sheen: 0.35, sheenRoughness: 0.85, sheenColor: "#5d6a5d" },
  },
  plastic: {
    day: { color: "#4a514f", roughness: 0.5, metalness: 0, envMapIntensity: 0.4, clearcoat: 0.25, clearcoatRoughness: 0.4 },
    night: { color: "#3b413f", roughness: 0.5, metalness: 0, envMapIntensity: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.4 },
  },
  metal: {
    day: { color: "#b3a586", roughness: 0.3, metalness: 0.85, envMapIntensity: 0.9 },
    night: { color: "#7d7362", roughness: 0.32, metalness: 0.85, envMapIntensity: 0.7 },
  },
  glass: {
    day: { color: "#e8eef0", roughness: 0.12, metalness: 0, envMapIntensity: 0.75, transmission: 0.7, thickness: 0.08, ior: 1.45, clearcoat: 0.2, clearcoatRoughness: 0.1, transparent: true },
    night: { color: "#3a4a55", roughness: 0.12, metalness: 0, envMapIntensity: 0.6, transmission: 0.6, thickness: 0.08, ior: 1.45, clearcoat: 0.2, clearcoatRoughness: 0.1, transparent: true },
  },
  screen: {
    day: { color: "#2e3436", roughness: 0.28, metalness: 0.1, envMapIntensity: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.15 },
    night: { color: "#2a3236", roughness: 0.28, metalness: 0.1, envMapIntensity: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.15 },
  },
  ceramic: {
    day: { color: "#f1e8d7", roughness: 0.35, metalness: 0, envMapIntensity: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.3 },
    night: { color: "#8a8272", roughness: 0.35, metalness: 0, envMapIntensity: 0.35, clearcoat: 0.25, clearcoatRoughness: 0.3 },
  },
  paper: {
    day: { color: "#f0e8d6", roughness: 0.95, metalness: 0, envMapIntensity: 0.12 },
    night: { color: "#7a7468", roughness: 0.95, metalness: 0, envMapIntensity: 0.08 },
  },
};

export function materialProps(category: MaterialCategory, isNight: boolean): Variant {
  return isNight ? PRESETS[category].night : PRESETS[category].day;
}
