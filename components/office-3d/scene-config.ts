import type { AccentKey } from "@/lib/types";

export type Vector3Tuple = [number, number, number];

export const OFFICE_CAMERA = {
  position: [10.8, 11.8, 14.5] as Vector3Tuple,
  target: [0, 0.8, 0] as Vector3Tuple,
  zoom: 44,
  near: 0.1,
  far: 100,
};

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
  { position: [-3.2, 0, -2.25], rotation: 0 },
  { position: [3.2, 0, -2.25], rotation: 0 },
  { position: [-3.2, 0, 2.35], rotation: Math.PI },
  { position: [3.2, 0, 2.35], rotation: Math.PI },
];

export const DECORATION_COLORS = ["#eab96d", "#94a889", "#d98c76", "#839db5"];

export const CENTRAL_AISLE_POINT: Vector3Tuple = [0, 0, 0];
export const LEFT_AISLE_POINT: Vector3Tuple = [-5.35, 0, 0];
export const RIGHT_AISLE_POINT: Vector3Tuple = [5.25, 0, 0];
export const BACK_AISLE_POINT: Vector3Tuple = [0, 0, -4.3];
export const FRONT_AISLE_POINT: Vector3Tuple = [0, 0, 3.35];

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
  const side = index % 2 === 0 ? -1 : 1;
  const backRow = index < 2;
  const deskSeatZ = desk.position[2] + (backRow ? 1.25 : -1.25);
  const meetingX = index % 2 === 0 ? -1.35 : 1.35;
  const meetingZ = index < 2 ? 3.75 : 5.55;
  const diningX = index < 2 ? 4.65 : 6.65;
  const diningZ = index % 2 === 0 ? -2.45 : -0.95;

  return {
    deskApproachPosition: [side * 5.05, 0, deskSeatZ],
    deskSeatPosition: [desk.position[0], 0, deskSeatZ],
    meetingApproachPosition: [meetingX, 0, index < 2 ? 3.32 : 5.92],
    meetingSeatPosition: [meetingX, 0, meetingZ],
    diningApproachPosition: [index < 2 ? 4.25 : 7.05, 0, diningZ],
    diningSeatPosition: [diningX, 0, diningZ],
    sofaApproachPosition: [5.15, 0, 2.25 + index * 0.58],
    sofaPosition: [6.05, 0, 2.25 + index * 0.58],
    coffeePosition: [-1.05 + index * 0.7, 0, -5.05],
    restroomPosition: [4.15 + index * 0.42, 0, -5.35],
    entrancePosition: [-6.85, 0, 3.25 + index * 0.38],
  };
}

export const CHARACTER_POSITIONS: Record<string, CharacterPositionSet> = Object.fromEntries(
  USER_IDS.map((id, index) => [id, buildPositionSet(index)]),
);

export const FURNITURE_POSITIONS = {
  meetingTable: [0, 0, 4.65] as Vector3Tuple,
  diningTable: [5.65, 0, -1.7] as Vector3Tuple,
  sofa: [6.58, 0, 3.18] as Vector3Tuple,
  coffeeMachine: [0, 0, -5.72] as Vector3Tuple,
  restroomDoor: [4.9, 0, -6.15] as Vector3Tuple,
  entrance: [-7.62, 0, 3.9] as Vector3Tuple,
};
