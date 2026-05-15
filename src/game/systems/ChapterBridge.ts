import type { ChapterSpec } from "../../types/ChapterSpec";
import type { SaveData } from "../../types/SaveData";
import type { LevelAvailabilityStatus } from "./LevelAvailability";

export interface ChapterBridgeRoute {
  chapterId: number;
  legacyLevelId: number;
}

export interface ChapterAvailability {
  chapterId: number;
  legacyLevelId: number;
  playable: boolean;
  status: LevelAvailabilityStatus;
  label: string;
}

export interface ChapterRuntimeFlow {
  chapterId: number;
  platformerLevelId: number;
  puzzleLevelId: number;
  completionLevelId: number;
  introSceneId: string;
  beforePuzzleSceneId: string;
  afterPuzzleSceneId: string;
}

export const CHAPTER_BRIDGE_ROUTES = [
  { chapterId: 1, legacyLevelId: 1 },
  { chapterId: 2, legacyLevelId: 2 },
  { chapterId: 3, legacyLevelId: 4 },
  { chapterId: 4, legacyLevelId: 5 },
  { chapterId: 5, legacyLevelId: 6 },
  { chapterId: 6, legacyLevelId: 9 }
] as const satisfies readonly ChapterBridgeRoute[];

export const ACTIVE_CHAPTER_FLOWS = [
  {
    chapterId: 1,
    platformerLevelId: 1,
    puzzleLevelId: 1,
    completionLevelId: 1,
    introSceneId: "vn-chapter-1-intro",
    beforePuzzleSceneId: "vn-chapter-1-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-1-after-puzzle"
  },
  {
    chapterId: 2,
    platformerLevelId: 2,
    puzzleLevelId: 3,
    completionLevelId: 3,
    introSceneId: "vn-chapter-2-intro",
    beforePuzzleSceneId: "vn-chapter-2-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-2-after-puzzle"
  },
  {
    chapterId: 3,
    platformerLevelId: 4,
    puzzleLevelId: 4,
    completionLevelId: 4,
    introSceneId: "vn-chapter-3-intro",
    beforePuzzleSceneId: "vn-chapter-3-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-3-after-puzzle"
  },
  {
    chapterId: 4,
    platformerLevelId: 5,
    puzzleLevelId: 5,
    completionLevelId: 5,
    introSceneId: "vn-chapter-4-intro",
    beforePuzzleSceneId: "vn-chapter-4-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-4-after-puzzle"
  },
  {
    chapterId: 5,
    platformerLevelId: 6,
    puzzleLevelId: 6,
    completionLevelId: 8,
    introSceneId: "vn-chapter-5-intro",
    beforePuzzleSceneId: "vn-chapter-5-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-5-after-puzzle"
  },
  {
    chapterId: 6,
    platformerLevelId: 9,
    puzzleLevelId: 10,
    completionLevelId: 10,
    introSceneId: "vn-chapter-6-intro",
    beforePuzzleSceneId: "vn-chapter-6-before-puzzle",
    afterPuzzleSceneId: "vn-chapter-6-after-puzzle"
  }
] as const satisfies readonly ChapterRuntimeFlow[];

const CHAPTER_COMPLETION_LEVEL_IDS = new Map<number, number>([
  [1, 1],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 8],
  [6, 10]
]);

const CHAPTER_UNLOCK_PROGRESS_LEVEL_IDS = new Map<number, readonly number[]>([
  [1, [1]],
  [2, [2, 3]],
  [3, [4]],
  [4, [5, 6]],
  [5, [6, 7, 8]],
  [6, [9, 10]]
]);

export function getChapterLaunchLevelId(chapterId: number): number {
  return getActiveChapterFlow(chapterId)?.platformerLevelId
    ?? CHAPTER_BRIDGE_ROUTES.find((route) => route.chapterId === chapterId)?.legacyLevelId
    ?? 1;
}

export function getActiveChapterFlow(chapterId: number): ChapterRuntimeFlow | undefined {
  return ACTIVE_CHAPTER_FLOWS.find((flow) => flow.chapterId === chapterId);
}

export function getChapterCompletionLevelId(chapterId: number): number {
  return getActiveChapterFlow(chapterId)?.completionLevelId ?? CHAPTER_COMPLETION_LEVEL_IDS.get(chapterId) ?? 1;
}

export function getChapterAvailability(
  chapter: Pick<ChapterSpec, "id">,
  save: Pick<SaveData, "completedLevelIds" | "unlockedLevelIds" | "gameCompleted">,
): ChapterAvailability {
  const legacyLevelId = getChapterLaunchLevelId(chapter.id);
  const completed = isChapterCompleted(chapter.id, save);

  if (completed) {
    return {
      chapterId: chapter.id,
      legacyLevelId,
      playable: true,
      status: "completed",
      label: chapter.id === 6 && save.gameCompleted ? "Verdict Accepted. Case Closed." : chapter.id === 6 ? "Completed / Replay Finale" : "Completed / Replay"
    };
  }

  if (isChapterUnlocked(chapter.id, save)) {
    return {
      chapterId: chapter.id,
      legacyLevelId,
      playable: true,
      status: "playable",
      label: chapter.id === 1 ? "Play" : chapter.id === 6 ? "Finale" : "Next Clue"
    };
  }

  return {
    chapterId: chapter.id,
    legacyLevelId,
    playable: false,
    status: "locked",
    label: "Locked"
  };
}

export function getClosedChapterCount(
  chapters: readonly Pick<ChapterSpec, "id">[],
  save: Pick<SaveData, "completedLevelIds" | "unlockedLevelIds" | "gameCompleted">,
): number {
  return chapters.filter((chapter) => isChapterCompleted(chapter.id, save)).length;
}

export function isChapterCompleted(
  chapterId: number,
  save: Pick<SaveData, "completedLevelIds" | "gameCompleted">,
): boolean {
  if (save.gameCompleted) {
    return true;
  }

  const completionLevelId = CHAPTER_COMPLETION_LEVEL_IDS.get(chapterId);
  return completionLevelId !== undefined && save.completedLevelIds.includes(completionLevelId);
}

export function isChapterUnlocked(
  chapterId: number,
  save: Pick<SaveData, "completedLevelIds" | "unlockedLevelIds" | "gameCompleted">,
): boolean {
  if (chapterId === 1 || save.gameCompleted || isChapterCompleted(chapterId, save)) {
    return true;
  }

  if (isChapterCompleted(chapterId - 1, save)) {
    return true;
  }

  return hasLegacyProgress(CHAPTER_UNLOCK_PROGRESS_LEVEL_IDS.get(chapterId) ?? [], save);
}

function hasLegacyProgress(
  levelIds: readonly number[],
  save: Pick<SaveData, "completedLevelIds" | "unlockedLevelIds">,
): boolean {
  return levelIds.some((levelId) => save.completedLevelIds.includes(levelId) || save.unlockedLevelIds.includes(levelId));
}
