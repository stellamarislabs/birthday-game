export const CHAPTER_REVEAL_FINAL_ASSET_FILENAMES: Record<number, string> = {
  1: "RevealChapter01.webp",
  2: "RevealChapter02.webp",
  3: "RevealChapter03.webp",
  4: "RevealChapter04.webp",
  5: "RevealChapter05.webp"
};

const finalRevealAssetUrls = import.meta.glob("../../assets/final/reveals/*.webp", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export interface ChapterRevealFinalAsset {
  filename: string;
  imageUrl?: string;
}

export function getChapterRevealFinalAsset(
  chapterId: number,
  assetUrls: Record<string, string> = finalRevealAssetUrls
): ChapterRevealFinalAsset | undefined {
  const filename = CHAPTER_REVEAL_FINAL_ASSET_FILENAMES[chapterId];
  if (!filename) {
    return undefined;
  }

  return {
    filename,
    imageUrl: assetUrls[`../../assets/final/reveals/${filename}`]
  };
}
