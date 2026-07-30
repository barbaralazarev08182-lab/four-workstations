import { Vector3 } from "three";
import type { CharacterDestinationKey } from "@/components/office-3d/character-actions";
import {
  BACK_AISLE_POINT,
  CENTRAL_AISLE_POINT,
  CHARACTER_POSITIONS,
  FRONT_AISLE_POINT,
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

type PathNodeId = "center" | "left" | "right" | "back" | "front" | "dining" | "sofa" | "restroom" | "entrance";

const PATH_NODES: Record<PathNodeId, Vector3Tuple> = {
  center: CENTRAL_AISLE_POINT,
  left: LEFT_AISLE_POINT,
  right: RIGHT_AISLE_POINT,
  back: BACK_AISLE_POINT,
  front: FRONT_AISLE_POINT,
  dining: [5.25, 0, -2.85],
  sofa: [5.25, 0, 2.05],
  restroom: [5.25, 0, -4.35],
  entrance: [-6.2, 0, 3.15],
};

const PATH_EDGES: Array<[PathNodeId, PathNodeId]> = [
  ["center", "left"],
  ["center", "right"],
  ["center", "back"],
  ["center", "front"],
  ["left", "entrance"],
  ["right", "dining"],
  ["right", "sofa"],
  ["right", "restroom"],
  ["back", "restroom"],
];

function rotationToward(from: Vector3Tuple, to: Vector3Tuple) {
  return Math.atan2(to[0] - from[0], to[2] - from[2]);
}

function getPositions(userId: string): CharacterPositionSet {
  return CHARACTER_POSITIONS[userId] ?? CHARACTER_POSITIONS.ming;
}

export function getCharacterDestination(userId: string, key: CharacterDestinationKey): CharacterDestination {
  const positions = getPositions(userId);

  if (key === "meeting") {
    return {
      key,
      position: positions.meetingSeatPosition,
      approach: positions.meetingApproachPosition,
      rotation: rotationToward(positions.meetingSeatPosition, [0, 0, 4.65]),
    };
  }
  if (key === "dining") {
    return {
      key,
      position: positions.diningSeatPosition,
      approach: positions.diningApproachPosition,
      rotation: rotationToward(positions.diningSeatPosition, [5.65, 0, -1.7]),
    };
  }
  if (key === "sofa") {
    return {
      key,
      position: positions.sofaPosition,
      approach: positions.sofaApproachPosition,
      rotation: -Math.PI / 2,
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
      approach: [4.65, 0, -4.35],
      rotation: Math.PI,
    };
  }
  if (key === "entrance") {
    return {
      key,
      position: positions.entrancePosition,
      approach: [-6.2, 0, 3.15],
      rotation: -Math.PI / 2,
    };
  }

  const deskCenter = positions.deskSeatPosition[2] < 0
    ? [positions.deskSeatPosition[0], 0, positions.deskSeatPosition[2] - 1.2] as Vector3Tuple
    : [positions.deskSeatPosition[0], 0, positions.deskSeatPosition[2] + 1.2] as Vector3Tuple;

  return {
    key: "desk",
    position: positions.deskSeatPosition,
    approach: positions.deskApproachPosition,
    rotation: rotationToward(positions.deskSeatPosition, deskCenter),
  };
}

function getSourceExit(userId: string, destinationKey: CharacterDestinationKey): Vector3Tuple {
  const positions = getPositions(userId);
  if (destinationKey === "meeting") return positions.meetingApproachPosition;
  if (destinationKey === "dining") return positions.diningApproachPosition;
  if (destinationKey === "sofa") return positions.sofaApproachPosition;
  if (destinationKey === "coffee") return BACK_AISLE_POINT;
  if (destinationKey === "restroom") return [4.65, 0, -4.35];
  if (destinationKey === "entrance") return [-6.2, 0, 3.15];
  return positions.deskApproachPosition;
}

function getHubId(userId: string, destinationKey: CharacterDestinationKey): PathNodeId {
  if (destinationKey === "desk") return getPositions(userId).deskSeatPosition[0] < 0 ? "left" : "right";
  if (destinationKey === "meeting") return "front";
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
