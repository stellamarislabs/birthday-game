export const FINAL_VERDICT_FINAL_ASSET_FILENAME = "FinalVerdict01.webp";

const finalVerdictAssetUrls = import.meta.glob("../../assets/final/finalVerdict/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface FinalVerdictFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getFinalVerdictFinalAsset(
  assetUrls: Record<string, string> = finalVerdictAssetUrls
): FinalVerdictFinalAsset {
  return {
    filename: FINAL_VERDICT_FINAL_ASSET_FILENAME,
    imageUrl: assetUrls[`../../assets/final/finalVerdict/${FINAL_VERDICT_FINAL_ASSET_FILENAME}`]
  };
}
