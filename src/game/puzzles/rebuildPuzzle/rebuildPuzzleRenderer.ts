import { getPiece, getRebuildSlotId, isSlotCorrect } from "./rebuildPuzzleLogic";
import type { RebuildPiece, RebuildPuzzleSpec, RebuildPuzzleState } from "./rebuildPuzzleTypes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTrayPieces(spec: RebuildPuzzleSpec, state: RebuildPuzzleState): RebuildPiece[] {
  return state.trayPieceIds
    .map((pieceId) => getPiece(spec, pieceId))
    .filter((piece): piece is RebuildPiece => Boolean(piece));
}

export function getPlacedPiece(
  spec: RebuildPuzzleSpec,
  state: RebuildPuzzleState,
  row: number,
  col: number
): RebuildPiece | undefined {
  return getPiece(spec, state.placedPiecesBySlot[getRebuildSlotId(row, col)]);
}

export function getSlotStateClass(spec: RebuildPuzzleSpec, state: RebuildPuzzleState, row: number, col: number): string {
  const hasPiece = Boolean(getPlacedPiece(spec, state, row, col));
  const correct = isSlotCorrect(spec, state, row, col);

  if (correct) {
    return " is-correct";
  }

  if (hasPiece) {
    return " is-filled";
  }

  return "";
}

export function renderPieceArt(piece: RebuildPiece, rotation: number, size: "tray" | "slot"): string {
  return `
    <span
      class="rebuild-piece-art rebuild-piece-art-${escapeHtml(piece.visualKind)} ${size === "slot" ? "in-slot" : "in-tray"}"
      style="--piece-rotation: ${rotation}deg"
      aria-hidden="true"
    >
      <span class="rebuild-piece-mark"></span>
    </span>
  `;
}
