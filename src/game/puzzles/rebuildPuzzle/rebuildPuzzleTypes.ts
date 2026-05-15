export type RebuildRotation = 0 | 90 | 180 | 270;

export interface RebuildPiece {
  id: string;
  label: string;
  correctRow: number;
  correctCol: number;
  correctRotation: RebuildRotation;
  visualKind: string;
  description?: string;
}

export interface RebuildPuzzleSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  keyLabel: string;
  keyholeLabel: string;
  waveMarkLabel: string;
  wallMarks: Array<{
    id: string;
    label: string;
  }>;
  requiredMarkCount: number;
  rows: number;
  columns: number;
  pieces: RebuildPiece[];
  initialTrayOrder: string[];
  initialRotations: Record<string, RebuildRotation>;
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface RebuildPuzzleState {
  selectedPieceId: string | null;
  trayPieceIds: string[];
  placedPiecesBySlot: Record<string, string>;
  pieceRotations: Record<string, RebuildRotation>;
  keySelected: boolean;
  keyTurned: boolean;
  activatedMarkIds: string[];
  waveMarkRevealed: boolean;
  solved: boolean;
  feedback: string;
}

export interface RebuildPuzzleProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
  markCount: number;
  requiredMarkCount: number;
  currentStep: "locked" | "key-selected" | "unlocked" | "wave-revealed";
}

export interface RebuildPuzzleCheckResult {
  state: RebuildPuzzleState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}

export interface RebuildSlotAddress {
  row: number;
  col: number;
}
