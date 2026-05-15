export type TrustLightPathFinalAssetKey =
  | "background"
  | "trustBoard"
  | "lanternSource"
  | "trustDoorTarget";

export const TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES: Record<TrustLightPathFinalAssetKey, string> = {
  background: "puzzle05-trust-light-bg.webp",
  trustBoard: "puzzle05-trust-board.webp",
  lanternSource: "puzzle05-lantern-source.webp",
  trustDoorTarget: "puzzle05-trust-door-target.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface TrustLightPathFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getTrustLightPathFinalAsset(key: TrustLightPathFinalAssetKey): TrustLightPathFinalAsset {
  const filename = TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES[key];

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
