import { getMosaicSlotId, getPiece, isSlotCorrect } from "./caseMosaicLogic";
import { getCaseMosaicPieceFinalAsset } from "./caseMosaicFinalAssets";
import type { CaseMosaicSpec, CaseMosaicState, MosaicPiece } from "./caseMosaicTypes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTrayPieces(spec: CaseMosaicSpec, state: CaseMosaicState): MosaicPiece[] {
  return state.trayPieceIds
    .map((pieceId) => getPiece(spec, pieceId))
    .filter((piece): piece is MosaicPiece => Boolean(piece));
}

export function getPlacedPiece(
  spec: CaseMosaicSpec,
  state: CaseMosaicState,
  row: number,
  col: number
): MosaicPiece | undefined {
  return getPiece(spec, state.placedPiecesBySlot[getMosaicSlotId(row, col)]);
}

export function getSlotStateClass(spec: CaseMosaicSpec, state: CaseMosaicState, row: number, col: number): string {
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

export function renderPieceArt(piece: MosaicPiece, size: "tray" | "slot"): string {
  const finalAsset = getCaseMosaicPieceFinalAsset(piece);
  const finalImage = finalAsset?.imageUrl
    ? `<img class="case-mosaic-piece-image" src="${escapeHtml(finalAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
    : "";
  const finalImageClass = finalAsset?.imageUrl ? " has-final-image" : "";

  return `
    <span class="case-mosaic-piece-art case-mosaic-piece-art-${escapeHtml(piece.visualKind)} ${size === "slot" ? "in-slot" : "in-tray"}${finalImageClass}" aria-hidden="true">
      ${finalImage}
      <span class="case-mosaic-mark"></span>
    </span>
  `;
}
