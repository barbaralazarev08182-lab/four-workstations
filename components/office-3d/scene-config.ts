import type { AccentKey } from "@/lib/types";

export type Vector3Tuple = [number, number, number];

export interface InteractionAnchor {
  x: number;
  y: number;
}

export const OFFICE_CAMERA = {
  position: [10.8, 11.8, 14.5] as Vector3Tuple,
  target: [0, 0.8, 0] as Vector3Tuple,
  zoom: 44,
  near: 0.1,
  far: 100,
};

export const CAMERA_OFFSET: Vector3Tuple = [
  OFFICE_CAMERA.position[0] - OFFICE_CAMERA.target[0],
  OFFICE_CAMERA.position[1] - OFFICE_CAMERA.target[1],
  OFFICE_CAMERA.position[2] - OFFICE_CAMERA.target[2],
];

export const ROOM_BOUNDS = {
  min: [-8.1, -0.41, -6.6] as Vector3Tuple,
  max: [8.1, 4.5, 6.6] as Vector3Tuple,
};

export const MOBILE_BREAKPOINT = 760;

export const SAFE_AREA = {
  portrait: { top: 64, bottom: 160, left: 16, right: 16 },
  landscape: { top: 48, bottom: 44, left: 24, right: 24 },
  desktop: { top: 0, bottom: 0, left: 0, right: 0 },
};

export type CameraZoneKey = "auto" | "desktop" | "workstations" | "living" | "amenities" | "overview";

export interface CameraZonePreset {
  target: Vector3Tuple;
  bounds: { min: Vector3Tuple; max: Vector3Tuple };
  margin: number;
}

export const CAMERA_ZONES: Record<Exclude<CameraZoneKey, "auto">, CameraZonePreset> = {
  desktop: {
    target: [0, 0.8, 0],
    bounds: ROOM_BOUNDS,
    margin: 0.88,
  },
  workstations: {
    target: [0, 0.5, 0.3],
    bounds: { min: [-5.5, 0, -2.8], max: [5.5, 2.0, 3.5] },
    margin: 0.92,
  },
  living: {
    target: [-0.5, 0.5, 4.5],
    bounds: { min: [-6.5, 0, 2.8], max: [7.2, 2.2, 6.2] },
    margin: 0.88,
  },
  amenities: {
    target: [0, 0.5, -4.0],
    bounds: { min: [-6.5, 0, -6.2], max: [7.0, 2.2, -1.5] },
    margin: 0.90,
  },
  overview: {
    target: [0, 0.8, 0],
    bounds: ROOM_BOUNDS,
    margin: 0.85,
  },
};

export function isMobileViewport(width: number, height: number): boolean {
  return Math.min(width, height) < MOBILE_BREAKPOINT;
}

export type SafeAreaInsets = { top: number; bottom: number; left: number; right: number };

export function getSafeArea(width: number, height: number): SafeAreaInsets {
  if (!isMobileViewport(width, height)) return SAFE_AREA.desktop;
  return height > width ? SAFE_AREA.portrait : SAFE_AREA.landscape;
}

export function resolveAutoZone(width: number, height: number): Exclude<CameraZoneKey, "auto"> {
  if (!isMobileViewport(width, height)) return "desktop";
  return height > width ? "workstations" : "overview";
}

export const ACCENT_COLORS: Record<AccentKey, string> = {
  sage: "#77906e",
  terracotta: "#d37f60",
  blue: "#7396b8",
  violet: "#9480ad",
};

export const WORKSTATION_LAYOUT: Array<{
  position: Vector3Tuple;
  rotation: number;
}> = [
  { position: [-3.2, 0, -1.75], rotation: Math.PI / 2 },
  { position: [3.2, 0, 1.75], rotation: -Math.PI / 2 },
  { position: [-3.2, 0, 1.75], rotation: Math.PI / 2 },
  { position: [3.2, 0, -1.75], rotation: -Math.PI / 2 },
];

export const DECORATION_COLORS = ["#eab96d", "#94a889", "#d98c76", "#839db5"];

export const CENTRAL_AISLE_POINT: Vector3Tuple = [0, 0, 0];
export const LEFT_AISLE_POINT: Vector3Tuple = [-5.6, 0, 0];
export const RIGHT_AISLE_POINT: Vector3Tuple = [5.6, 0, 0];
export const BACK_AISLE_POINT: Vector3Tuple = [-1.2, 0, -4.6];
export const FRONT_AISLE_POINT: Vector3Tuple = [0, 0, 4.2];

export const CAT_ZONE_CENTER: Vector3Tuple = [2.3, 0, -4.65];
export const CAT_ZONE_RADIUS = 1.3;

export const WINDOW_POSITION: Vector3Tuple = [2.5, 2.6, -6.22];
export const WINDOW_SIZE: Vector3Tuple = [3.2, 1.8, 0.1];

export const MEETING_CARPET_CENTER: Vector3Tuple = [5.3, 0.015, 4.05];
export const MEETING_CARPET_SIZE: Vector3Tuple = [3.0, 0.03, 1.8];

export interface CharacterPositionSet {
  deskApproachPosition: Vector3Tuple;
  deskSeatPosition: Vector3Tuple;
  meetingApproachPosition: Vector3Tuple;
  meetingSeatPosition: Vector3Tuple;
  diningApproachPosition: Vector3Tuple;
  diningSeatPosition: Vector3Tuple;
  sofaApproachPosition: Vector3Tuple;
  sofaPosition: Vector3Tuple;
  coffeePosition: Vector3Tuple;
  restroomPosition: Vector3Tuple;
  entrancePosition: Vector3Tuple;
}

const USER_IDS = ["ming", "hong", "jie", "qixi"] as const;

function buildPositionSet(index: number): CharacterPositionSet {
  const desk = WORKSTATION_LAYOUT[index];
  const isLeft = desk.position[0] < 0;
  const seatX = desk.position[0] + (isLeft ? 0.95 : -0.95);
  const approachX = isLeft ? -1.8 : 1.8;

  const meetingSeats: Vector3Tuple[] = [
    [4.45, 0, 3.0], [6.15, 0, 3.0], [4.45, 0, 5.1], [6.15, 0, 5.1],
  ];
  const diningSeats: Vector3Tuple[] = [
    [6.0, 0, -2.75], [7.0, 0, -3.9], [6.0, 0, -5.05], [5.0, 0, -3.9],
  ];
  const sofaSeats: Vector3Tuple[] = [
    [-5.2, 0, 3.3], [-5.2, 0, 3.9], [-5.2, 0, 4.5], [-5.2, 0, 5.1],
  ];

  return {
    deskApproachPosition: [approachX, 0, desk.position[2]],
    deskSeatPosition: [seatX, 0, desk.position[2]],
    meetingApproachPosition: [3.3, 0, index < 2 ? 3.0 : 5.1],
    meetingSeatPosition: meetingSeats[index],
    diningApproachPosition: [4.4, 0, -3.9],
    diningSeatPosition: diningSeats[index],
    sofaApproachPosition: [-3.8, 0, sofaSeats[index][2]],
    sofaPosition: sofaSeats[index],
    coffeePosition: [-1.5 + index * 0.45, 0, -4.5],
    restroomPosition: [-5.5 + index * 0.4, 0, -5.2],
    entrancePosition: [-6.5, 0, 2.8 + index * 0.45],
  };
}

export const CHARACTER_POSITIONS: Record<string, CharacterPositionSet> = Object.fromEntries(
  USER_IDS.map((id, index) => [id, buildPositionSet(index)]),
);

export const FURNITURE_POSITIONS = {
  meetingTable: [5.3, 0, 4.05] as Vector3Tuple,
  diningTable: [6.0, 0, -3.9] as Vector3Tuple,
  sofa: [-5.2, 0, 4.2] as Vector3Tuple,
  coffeeMachine: [-0.8, 0, -5.45] as Vector3Tuple,
  restroomDoor: [-5.5, 0, -6.1] as Vector3Tuple,
  entrance: [-7.58, 0, 3.5] as Vector3Tuple,
};

export interface LightPreset {
  background: string;
  ambient: { intensity: number; color: string };
  hemisphere: { intensity: number; sky: string; ground: string };
  key: { intensity: number; color: string; position: Vector3Tuple };
  fill: { intensity: number; color: string };
  windowLight: { intensity: number; color: string; width: number; height: number };
  contactShadow: { opacity: number; blur: number };
}

// Grouped by condition so future weather variants (dayOvercast / rainy / nightRain)
// can be added alongside these without restructuring the scene lights.
// A low directional key keeps gentle window-direction shading + soft shadows,
// while the RectAreaLight at the window provides the soft sky diffusion.
// Future rainy direction: lower key, cooler/softer windowLight, slightly lower
// ambient, softer shadows, interior stays warm and visible.
export const LIGHT_PRESETS: Record<"day" | "night", LightPreset> = {
  day: {
    background: "#eae3d3",
    ambient: { intensity: 0.55, color: "#fdf8ef" },
    hemisphere: { intensity: 0.65, sky: "#fdf9f0", ground: "#c9a884" },
    key: { intensity: 1.3, color: "#fff4df", position: [2.5, 8.5, -5.5] },
    fill: { intensity: 0.3, color: "#e6ebf0" },
    windowLight: { intensity: 1.8, color: "#fff3df", width: 3.0, height: 1.7 },
    contactShadow: { opacity: 0.27, blur: 3.2 },
  },
  night: {
    background: "#263036",
    ambient: { intensity: 0.3, color: "#93a3b8" },
    hemisphere: { intensity: 0.32, sky: "#7280a0", ground: "#3a3430" },
    key: { intensity: 0.28, color: "#9db2d4", position: [2.5, 8.5, -5.5] },
    fill: { intensity: 0.2, color: "#5f6f8a" },
    windowLight: { intensity: 0.4, color: "#a8b8cc", width: 3.0, height: 1.7 },
    contactShadow: { opacity: 0.2, blur: 3.4 },
  },
};
