import { getArgumentBlock, isSlotStable } from "./argumentTowerLogic";
import type { ArgumentTowerSpec, ArgumentTowerState } from "./argumentTowerTypes";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getPlacedBlock(spec: ArgumentTowerSpec, state: ArgumentTowerState, slotId: string) {
  const blockId = state.placedBlocksBySlotId[slotId];
  return blockId ? getArgumentBlock(spec, blockId) : undefined;
}

export function getSlotStateClass(spec: ArgumentTowerSpec, state: ArgumentTowerState, slotId: string): string {
  const classes: string[] = [];
  if (state.placedBlocksBySlotId[slotId]) {
    classes.push("is-filled");
  }

  if (isSlotStable(spec, state, slotId)) {
    classes.push("is-stable");
  } else if (state.placedBlocksBySlotId[slotId]) {
    classes.push("is-unstable");
  }

  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}
