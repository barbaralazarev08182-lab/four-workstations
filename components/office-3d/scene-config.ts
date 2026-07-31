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
  { position: [-4.5, 0, -1.8], rotation: Math.PI / 2 },
  { position: [4.5, 0, 2.5], rotation: -Math.PI / 2 },
  { position: [-4.5, 0, 2.5], rotation: Math.PI / 2 },
  { position: [4.5, 0, -1.8], rotation: -Math.PI / 2 },
];

export const DECORATION_COLORS = ["#eab96d", "#94a889", "#d98c76", "#839db5"];

export const CENTRAL_AISLE_POINT: Vector3Tuple = [0, 0, 0.3];
export const LEFT_AISLE_POINT: Vector3Tuple = [-6.2, 0, 0.3];
export const RIGHT_AISLE_POINT: Vector3Tuple = [6.8, 0, -0.5];
export const BACK_AISLE_POINT: Vector3Tuple = [0, 0, -4.2];
export const FRONT_AISLE_POINT: Vector3Tuple = [0, 0, 4.8];

export const CAT_ZONE_CENTER: Vector3Tuple = [1.5, 0, 4.5];
export const CAT_ZONE_RADIUS = 1.4;

export const WINDOW_POSITION: Vector3Tuple = [2.5, 2.6, -6.22];
export const WINDOW_SIZE: Vector3Tuple = [3.2, 1.8, 0.1];

export const MEETING_CARPET_CENTER: Vector3Tuple = [5.2, 0.015, 4.5];
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
  const approachX = isLeft ? -2.2 : 2.2;

  const meetingSeats: Vector3Tuple[] = [
    [4.35, 0, 3.7], [6.05, 0, 3.7], [4.35, 0, 4.9], [6.05, 0, 4.9],
  ];
  const diningSeats: Vector3Tuple[] = [
    [4.9, 0, -3.5], [5.8, 0, -2.6], [6.7, 0, -3.5], [5.8, 0, -4.4],
  ];
  const sofaSeats: Vector3Tuple[] = [
    [-4.5, 0, 3.5], [-4.5, 0, 4.2], [-4.5, 0, 4.9], [-4.5, 0, 5.5],
  ];

  return {
    deskApproachPosition: [approachX, 0, desk.position[2]],
    deskSeatPosition: [seatX, 0, desk.position[2]],
    meetingApproachPosition: [3.3, 0, index < 2 ? 3.2 : 4.6],
    meetingSeatPosition: meetingSeats[index],
    diningApproachPosition: [4.2, 0, diningSeats[index][2]],
    diningSeatPosition: diningSeats[index],
    sofaApproachPosition: [-3.2, 0, sofaSeats[index][2]],
    sofaPosition: sofaSeats[index],
    coffeePosition: [-0.9 + index * 0.6, 0, -4.5],
    restroomPosition: [-5.5 + index * 0.4, 0, -5.2],
    entrancePosition: [-6.5, 0, 2.8 + index * 0.45],
  };
}

export const CHARACTER_POSITIONS: Record<string, CharacterPositionSet> = Object.fromEntries(
  USER_IDS.map((id, index) => [id, buildPositionSet(index)]),
);

export const FURNITURE_POSITIONS = {
  meetingTable: [5.2, 0, 4.3] as Vector3Tuple,
  diningTable: [5.8, 0, -3.5] as Vector3Tuple,
  sofa: [-5.5, 0, 4.5] as Vector3Tuple,
  coffeeMachine: [0, 0, -5.5] as Vector3Tuple,
  restroomDoor: [-5.5, 0, -6.1] as Vector3Tuple,
  entrance: [-7.58, 0, 3.5] as Vector3Tuple,
};
