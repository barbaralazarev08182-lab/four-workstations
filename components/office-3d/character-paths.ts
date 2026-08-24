import { Vector3 } from "three";
import type { CharacterDestinationKey } from "@/components/office-3d/character-actions";
import {
  BACK_AISLE_POINT,
  CENTRAL_AISLE_POINT,
  CHARACTER_POSITIONS,
  FRONT_AISLE_POINT,
  FURNITURE_POSITIONS,
  LEFT_AISLE_POINT,
  RIGHT_AISLE_POINT,
  type CharacterPositionSet,
  type Vector3Tuple,
} from "@/components/office-3d/scene-config";

export interface CharacterDestination {
  key: CharacterDestinationKey;
  position: Vector3Tuple;
  approach: Vector3Tuple;
  rotation: number;
}

type PathNodeId = "center" | "left" | "right" | "back" | "front" | "dining" | "meeting" | "sofa" | "restroom" | "entrance";

const PATH_NODES: Record<PathNodeId, Vector3Tuple> = {
  center: CENTRAL_AISLE_POINT,
  left: LEFT_AISLE_POINT,
  right: RIGHT_AISLE_POINT,
  back: BACK_AISLE_POINT,
  front: FRONT_AISLE_POINT,
  dining: [4.4, 0, -3.9],
  meeting: [3.3, 0, 4.05],
  sofa: [-3.8, 0, 4.2],
  restroom: [-4.5, 0, -4.2],
  entrance: [-6.4, 0, 3.5],
};

const PATH_EDGES: Array<[PathNodeId, PathNodeId]> = [
  ["center", "left"],
  ["center", "right"],
  ["center", "back"],
  ["center", "front"],
  ["center", "meeting"],
  ["left", "entrance"],
  ["left", "restroom"],
  ["right", "dining"],
  ["back", "restroom"],
  ["front", "sofa"],
];

function rotationToward(from: Vector3Tuple, to: Vector3Tuple) {
  return Math.atan2(to[0] - from[0], to[2] - from[2]);
}

function getPositions(userId: string): CharacterPositionSet {
  return CHARACTER_POSITIONS[userId] ?? CHARACTER_POSITIONS.ming;
}

function offsetAwayFromFurniture(position: Vector3Tuple, furniture: Vector3Tuple, distance: number): Vector3Tuple {
  const x = position[0] - furniture[0];
  const z = position[2] - furniture[2];
  const length = Math.hypot(x, z) || 1;
  return [position[0] + (x / length) * distance, position[1], position[2] + (z / length) * distance];
}

export function getCharacterDestination(userId: string, key: CharacterDestinationKey): CharacterDestination {
  const positions = getPositions(userId);

  if (key === "meeting") {
    const position = offsetAwayFromFurniture(positions.meetingSeatPosition, FURNITURE_POSITIONS.meetingTable, 0.6);
    return {
      key,
      position,
      approach: positions.meetingApproachPosition,
      rotation: rotationToward(position, FURNITURE_POSITIONS.meetingTable),
    };
  }
  if (key === "dining") {
    const position = offsetAwayFromFurniture(positions.diningSeatPosition, FURNITURE_POSITIONS.diningTable, 0.55);
    return {
      key,
      position,
      approach: positions.diningApproachPosition,
      rotation: rotationToward(position, FURNITURE_POSITIONS.diningTable),
    };
  }
  if (key === "sofa") {
    const position: Vector3Tuple = [positions.sofaPosition[0] + 0.85, positions.sofaPosition[1], positions.sofaPosition[2]];
    return {
      key,
      position,
      approach: positions.sofaApproachPosition,
      rotation: rotationToward(position, FURNITURE_POSITIONS.sofa),
    };
  }
  if (key === "coffee") {
    return {
      key,
      position: positions.coffeePosition,
      approach: BACK_AISLE_POINT,
      rotation: Math.PI,
    };
  }
  if (key === "restroom") {
    return {
      key,
      position: positions.restroomPosition,
      approach: [-4.5, 0, -4.2],
      rotation: Math.PI,
    };
  }
  if (key === "entrance") {
    return {
      key,
      position: positions.entrancePosition,
      approach: [-6.2, 0, 3.5],
      rotation: -Math.PI / 2,
    };
  }

  const isLeftDesk = positions.deskSeatPosition[0] < 0;
  const deskStandingPosition: Vector3Tuple = [
    positions.deskSeatPosition[0] + (isLeftDesk ? 0.6 : -0.6),
    positions.deskSeatPosition[1],
    positions.deskSeatPosition[2],
  ];
  // FR-WS1 desk facing: the seat sits on the +X side of desks 1/3 (left) and
  // on the -X side of desks 2/4 (right), so the character must face the desk:
  // left desks -> -X, right desks -> +X.
  const deskFacing: Vector3Tuple = isLeftDesk
    ? [deskStandingPosition[0] - 2, 0, deskStandingPosition[2]]
    : [deskStandingPosition[0] + 2, 0, deskStandingPosition[2]];

  return {
    key: "desk",
    position: deskStandingPosition,
    approach: positions.deskApproachPosition,
    rotation: rotationToward(deskStandingPosition, deskFacing),
  };
}

function getSourceExit(userId: string, destinationKey: CharacterDestinationKey): Vector3Tuple {
  const positions = getPositions(userId);
  if (destinationKey === "meeting") return positions.meetingApproachPosition;
  if (destinationKey === "dining") return positions.diningApproachPosition;
  if (destinationKey === "sofa") return positions.sofaApproachPosition;
  if (destinationKey === "coffee") return BACK_AISLE_POINT;
  if (destinationKey === "restroom") return [-4.5, 0, -4.2];
  if (destinationKey === "entrance") return [-6.2, 0, 3.5];
  return positions.deskApproachPosition;
}

function getHubId(userId: string, destinationKey: CharacterDestinationKey): PathNodeId {
  if (destinationKey === "desk") return getPositions(userId).deskSeatPosition[0] < 0 ? "left" : "right";
  if (destinationKey === "meeting") return "meeting";
  if (destinationKey === "dining") return "dining";
  if (destinationKey === "sofa") return "sofa";
  if (destinationKey === "coffee") return "back";
  if (destinationKey === "restroom") return "restroom";
  return "entrance";
}

function distanceBetweenNodes(a: PathNodeId, b: PathNodeId) {
  return new Vector3(...PATH_NODES[a]).distanceTo(new Vector3(...PATH_NODES[b]));
}

function findShortestNodeRoute(start: PathNodeId, goal: PathNodeId): PathNodeId[] {
  if (start === goal) return [start];
  const ids = Object.keys(PATH_NODES) as PathNodeId[];
  const distance = new Map<PathNodeId, number>(ids.map((id) => [id, id === start ? 0 : Number.POSITIVE_INFINITY]));
  const previous = new Map<PathNodeId, PathNodeId>();
  const unvisited = new Set(ids);

  while (unvisited.size) {
    let current: PathNodeId | null = null;
    let best = Number.POSITIVE_INFINITY;
    unvisited.forEach((id) => {
      const value = distance.get(id) ?? Number.POSITIVE_INFINITY;
      if (value < best) {
        current = id;
        best = value;
      }
    });
    if (!current || current === goal) break;
    unvisited.delete(current);

    PATH_EDGES.forEach(([a, b]) => {
      const neighbor = a === current ? b : b === current ? a : null;
      if (!neighbor || !unvisited.has(neighbor)) return;
      const candidate = best + distanceBetweenNodes(current as PathNodeId, neighbor);
      if (candidate < (distance.get(neighbor) ?? Number.POSITIVE_INFINITY)) {
        distance.set(neighbor, candidate);
        previous.set(neighbor, current as PathNodeId);
      }
    });
  }

  const route: PathNodeId[] = [goal];
  let cursor = goal;
  while (cursor !== start) {
    const next = previous.get(cursor);
    if (!next) return [start, "center", goal];
    route.unshift(next);
    cursor = next;
  }
  return route;
}

function getNearestHub(position: Vector3): PathNodeId {
  let closest: PathNodeId = "center";
  let closestDistance = Number.POSITIVE_INFINITY;
  (Object.keys(PATH_NODES) as PathNodeId[]).forEach((id) => {
    const distance = position.distanceTo(new Vector3(...PATH_NODES[id]));
    if (distance < closestDistance) {
      closest = id;
      closestDistance = distance;
    }
  });
  return closest;
}

function dedupeWaypoints(points: Vector3Tuple[]) {
  const result: Vector3[] = [];
  for (const point of points) {
    const vector = new Vector3(...point);
    const previous = result[result.length - 1];
    if (!previous || previous.distanceTo(vector) > 0.12) result.push(vector);
  }
  return result;
}

export function buildCharacterPath(
  userId: string,
  currentPosition: Vector3,
  sourceDestinationKey: CharacterDestinationKey,
  destinationKey: CharacterDestinationKey,
  skipSourceExit = false,
) {
  const destination = getCharacterDestination(userId, destinationKey);
  const sourceExit = getSourceExit(userId, sourceDestinationKey);
  const sourceHub = skipSourceExit ? getNearestHub(currentPosition) : getHubId(userId, sourceDestinationKey);
  const destinationHub = getHubId(userId, destinationKey);
  const nodeRoute = findShortestNodeRoute(sourceHub, destinationHub).map((id) => PATH_NODES[id]);
  const path = dedupeWaypoints([
    [currentPosition.x, 0, currentPosition.z],
    ...(skipSourceExit ? [] : [sourceExit]),
    ...nodeRoute,
    destination.approach,
    destination.position,
  ]);

  return { destination, path: path.slice(1) };
}
