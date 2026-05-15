import { getVisualNovelChapterSceneByPlacement, getVisualNovelSceneByPlacement, getVisualNovelSceneSpec } from "../../content/vnScenes";
import type { VisualNovelPlacement, VisualNovelSceneSpec, VisualNovelSceneTarget } from "../../types/VisualNovel";

export function findVisualNovelSceneId(levelId: number, placement: VisualNovelPlacement): string | null {
  return getVisualNovelSceneByPlacement(levelId, placement)?.id ?? null;
}

export function findChapterVisualNovelSceneId(chapterId: number, placement: VisualNovelPlacement): string | null {
  return getVisualNovelChapterSceneByPlacement(chapterId, placement)?.id ?? null;
}

export function getVisualNovelTarget(spec: VisualNovelSceneSpec, mode: "next" | "skip" = "next"): VisualNovelSceneTarget {
  if (mode === "skip" && spec.skipScene) {
    return spec.skipScene;
  }

  return spec.nextScene;
}

export function getVisualNovelTargetById(
  sceneId: string,
  mode: "next" | "skip" = "next"
): VisualNovelSceneTarget | null {
  const spec = getVisualNovelSceneSpec(sceneId);
  if (!spec) {
    return null;
  }

  return getVisualNovelTarget(spec, mode);
}

export function getNextVisualNovelLineIndex(currentIndex: number, lineCount: number): number | null {
  const nextIndex = currentIndex + 1;
  return nextIndex < lineCount ? nextIndex : null;
}
