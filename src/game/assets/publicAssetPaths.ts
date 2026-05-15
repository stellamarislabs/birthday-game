export function resolvePublicAssetPath(assetPath: string, basePath = import.meta.env.BASE_URL): string {
  const normalizedBase = (basePath || "./").endsWith("/") ? (basePath || "./") : `${basePath}/`;
  const normalizedAsset = assetPath.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedAsset}`;
}
