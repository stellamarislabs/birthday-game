export type RouteTileFinalAssetKey =
  | "background"
  | "tileShell"
  | "hiddenWallMarker"
  | "keyholeMarker";

export const ROUTE_TILE_FINAL_ASSET_FILENAMES: Record<RouteTileFinalAssetKey, string> = {
  background: "puzzle02-hidden-wall-bg.webp",
  tileShell: "puzzle02-route-tile-shell.webp",
  hiddenWallMarker: "puzzle02-hidden-wall-marker.webp",
  keyholeMarker: "puzzle02-keyhole-marker.webp"
};

const finalPuzzleAssetUrls = import.meta.glob("../../../assets/final/puzzles/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface RouteTileFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getRouteTileFinalAsset(key: RouteTileFinalAssetKey): RouteTileFinalAsset {
  const filename = ROUTE_TILE_FINAL_ASSET_FILENAMES[key];

  return {
    filename,
    imageUrl: finalPuzzleAssetUrls[`../../../assets/final/puzzles/${filename}`]
  };
}
