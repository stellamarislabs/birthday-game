import {
  isConnectionActive,
  isCaseBoardSolved
} from "./caseBoardLogic";
import type { BoardSlot, CaseBoardSpec, CaseBoardState, CaseTile } from "./caseBoardTypes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTile(spec: CaseBoardSpec, tileId: string | undefined): CaseTile | undefined {
  if (!tileId) {
    return undefined;
  }

  return spec.availableTiles.find((tile) => tile.id === tileId);
}

export function getPlacedTile(spec: CaseBoardSpec, state: CaseBoardState, slot: BoardSlot): CaseTile | undefined {
  return getTile(spec, state.placedTilesBySlotId[slot.id]);
}

export function getTrayTiles(spec: CaseBoardSpec, state: CaseBoardState): CaseTile[] {
  const placedTileIds = new Set(Object.values(state.placedTilesBySlotId));

  return spec.availableTiles.filter((tile) => !placedTileIds.has(tile.id) && tile.tileType !== "start" && tile.tileType !== "truth");
}

export function isSlotLocked(slot: BoardSlot): boolean {
  return Boolean(slot.lockedTileId);
}

export function getConnectionClass(spec: CaseBoardSpec, state: CaseBoardState, fromSlot: BoardSlot, toSlot: BoardSlot): string {
  const fromTileId = state.placedTilesBySlotId[fromSlot.id];
  const toTileId = state.placedTilesBySlotId[toSlot.id];

  if (isConnectionActive(spec, state, fromSlot.id, toSlot.id)) {
    return " is-active";
  }

  if (fromTileId && toTileId) {
    return " is-wrong";
  }

  return "";
}

export function getPathSummary(spec: CaseBoardSpec, state: CaseBoardState): string {
  return spec.boardSlots
    .map((slot) => getPlacedTile(spec, state, slot)?.label ?? slot.label)
    .join(" -> ");
}

export function getSolvedStampClass(spec: CaseBoardSpec, state: CaseBoardState): string {
  return isCaseBoardSolved(spec, state) || state.solved ? " is-complete" : "";
}
