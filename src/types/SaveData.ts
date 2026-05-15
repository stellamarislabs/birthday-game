export type GameProgress = "new" | "in-progress" | "complete";

export interface SaveData {
  saveVersion: number;
  completedLevelIds: number[];
  unlockedLevelIds: number[];
  currentLevelId: number;
  gameCompleted: boolean;
  muted: boolean;
  reduceMotion: boolean;
  lastUpdatedAt: string;
}
