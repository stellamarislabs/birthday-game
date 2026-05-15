export type CaseFileSortingFinalAssetKey =
  | "background"
  | "archiveFileBoard"
  | "documentCardShell"
  | "silverKey";

export const CASE_FILE_SORTING_FINAL_ASSET_FILENAMES: Record<CaseFileSortingFinalAssetKey, string> = {
  background: "puzzle04-case-file-bg.webp",
  archiveFileBoard: "puzzle04-archive-file-board.webp",
  documentCardShell: "puzzle04-document-card-shell.webp",
  silverKey: "puzzle04-silver-key.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface CaseFileSortingFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getCaseFileSortingFinalAsset(key: CaseFileSortingFinalAssetKey): CaseFileSortingFinalAsset {
  const filename = CASE_FILE_SORTING_FINAL_ASSET_FILENAMES[key];

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
