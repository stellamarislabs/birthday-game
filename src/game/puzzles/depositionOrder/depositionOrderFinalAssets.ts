export type DepositionOrderFinalAssetKey =
  | "background"
  | "witnessNotePaper"
  | "statementStripShell";

export const DEPOSITION_ORDER_FINAL_ASSET_FILENAMES: Record<DepositionOrderFinalAssetKey, string> = {
  background: "puzzle03-deposition-bg.webp",
  witnessNotePaper: "puzzle03-witness-note-paper.webp",
  statementStripShell: "puzzle03-statement-strip-shell.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface DepositionOrderFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getDepositionOrderFinalAsset(key: DepositionOrderFinalAssetKey): DepositionOrderFinalAsset {
  const filename = DEPOSITION_ORDER_FINAL_ASSET_FILENAMES[key];

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
