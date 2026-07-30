import type { StatusKey } from "@/lib/types";

export type CharacterActionState =
  | "idle"
  | "walking"
  | "sitting"
  | "typing"
  | "eating"
  | "drinking"
  | "resting"
  | "slacking"
  | "waving"
  | "hidden";

export type CharacterDestinationKey = "desk" | "meeting" | "dining" | "sofa" | "coffee" | "restroom" | "entrance";

export type CharacterDebugAction = CharacterActionState | CharacterDestinationKey | "playAll" | "reset";

export interface CharacterDebugCommand {
  id: number;
  action: CharacterDebugAction;
  scope: "current" | "all";
}

export function getDestinationForStatus(status: StatusKey): CharacterDestinationKey {
  if (status === "meeting") return "meeting";
  if (status === "eating") return "dining";
  if (status === "coffee") return "coffee";
  if (status === "resting" || status === "napping") return "sofa";
  if (status === "restroom") return "restroom";
  if (status === "outside" || status === "offWork") return "entrance";
  return "desk";
}

export function getActionForStatus(status: StatusKey): CharacterActionState {
  if (status === "working" || status === "studying" || status === "busy" || status === "overtime") return "typing";
  if (status === "meeting" || status === "clockedIn") return "sitting";
  if (status === "eating") return "eating";
  if (status === "coffee") return "drinking";
  if (status === "resting" || status === "napping") return "resting";
  if (status === "slacking") return "slacking";
  if (status === "restroom" || status === "outside" || status === "offWork") return "hidden";
  return "idle";
}

export function isHiddenStatus(status: StatusKey) {
  return status === "restroom" || status === "outside" || status === "offWork";
}
