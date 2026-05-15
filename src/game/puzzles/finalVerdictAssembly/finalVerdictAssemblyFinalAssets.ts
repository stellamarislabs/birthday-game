export type FinalVerdictAssemblyFinalAssetKey = "background" | "finalSealBoard" | "heartCore";

export const FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES: Record<FinalVerdictAssemblyFinalAssetKey, string> = {
  background: "puzzle06-final-seal-bg.webp",
  finalSealBoard: "puzzle06-final-seal-board.webp",
  heartCore: "puzzle06-final-seal-heart-core.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface FinalVerdictAssemblyFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getFinalVerdictAssemblyFinalAsset(
  key: FinalVerdictAssemblyFinalAssetKey
): FinalVerdictAssemblyFinalAsset {
  const filename = FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES[key];

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
