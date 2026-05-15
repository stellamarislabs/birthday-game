import type { MosaicPiece } from "./caseMosaicTypes";

export const CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES: Record<string, string> = {
  "envelope-top-left": "puzzle01-envelope-piece-top-left.webp",
  "envelope-top-flap": "puzzle01-envelope-piece-top-flap.webp",
  "envelope-top-right": "puzzle01-envelope-piece-top-right.webp",
  "envelope-bottom-left": "puzzle01-envelope-piece-bottom-left.webp",
  "envelope-seal": "puzzle01-envelope-piece-seal.webp",
  "envelope-bottom-right": "puzzle01-envelope-piece-bottom-right.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface CaseMosaicPieceFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getCaseMosaicPieceFinalAsset(piece: Pick<MosaicPiece, "id">): CaseMosaicPieceFinalAsset | undefined {
  const filename = CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES[piece.id];
  if (!filename) {
    return undefined;
  }

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
