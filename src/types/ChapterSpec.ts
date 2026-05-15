export type ChapterImplementationRisk = "low" | "medium" | "high";

export type ChapterMigrationStatus = "planned" | "in-progress" | "implemented";

export interface ChapterDurationRangeSeconds {
  min: number;
  max: number;
}

export interface ChapterSpec {
  id: number;
  chapterKey: string;
  title: string;
  shortTitle: string;
  oldLevelIds: readonly number[];
  storyPurpose: string;
  platformerTheme: string;
  mainClues: readonly string[];
  puzzleName: string;
  puzzleType: string;
  puzzlePurpose: string;
  vnPurpose: string;
  emotionalReveal: string;
  leadsToNext: string;
  targetDurationSeconds: ChapterDurationRangeSeconds;
  estimatedTotalMinutes: string;
  implementationRisk: ChapterImplementationRisk;
  active: boolean;
  migrationStatus: ChapterMigrationStatus;
  absorbedOldContent: readonly string[];
  devNotes: readonly string[];
}

export interface ChapterPuzzlePlan {
  chapterId: number;
  puzzleName: string;
  puzzleType: string;
  reusedOldPuzzleModules: readonly string[];
  deprecatedOldPuzzleRoutes: readonly string[];
  puzzleGoal: string;
  playerInteraction: string;
  successText: string;
  wrongIncompleteText: string;
  revealTarget: string;
  implementationRisk: ChapterImplementationRisk;
}

export interface ChapterVnOutline {
  chapterId: number;
  introPurpose: string;
  prePuzzlePurpose: string;
  postPuzzlePurpose: string;
  suggestedSceneIds: {
    intro: string;
    beforePuzzle: string;
    afterPuzzle: string;
  };
}

export interface ChapterClueChainEntry {
  chapterId: number;
  currentClues: readonly string[];
  meaningDiscovered: string;
  nextChapterId: number | null;
  nextHintText: string;
  nextActionLabel: string;
}
