import type { PuzzleType } from "./PuzzleSpec";

export type LevelDifficulty = "intro" | "gentle" | "moderate" | "confident" | "finale";

export interface DurationRangeSeconds {
  min: number;
  max: number;
}

export interface LevelSpec {
  id: number;
  title: string;
  shortTitle: string;
  settingSummary: string;
  briefingText: string;
  platformerFocus: string;
  platformerMechanicFamily: string;
  exhibitName: string;
  puzzleType: PuzzleType;
  emotionalReveal: string;
  targetDurationSeconds: DurationRangeSeconds;
  difficulty: LevelDifficulty;
  designRole: string;
}
