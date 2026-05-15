export const PUZZLE_TYPES = [
  "case-mosaic",
  "case-timeline",
  "route-tile-puzzle",
  "rebuild-puzzle",
  "deposition-order",
  "witness-lens",
  "case-file-sorting",
  "archive-detail-finder",
  "trust-light-path",
  "echo-path",
  "lantern-sequence",
  "argument-tower",
  "case-constellation",
  "final-verdict-assembly"
] as const;

export type PuzzleType = (typeof PUZZLE_TYPES)[number];

export interface PuzzleSpec {
  id: string;
  levelId: number;
  type: PuzzleType;
  title: string;
  instruction: string;
  estimatedSeconds: number;
  emotionalPurpose: string;
  mobileUxNotes: string;
}
