export interface DepositionStripSpec {
  id: string;
  text: string;
  shortLabel: string;
}

export interface DepositionSlotSpec {
  id: string;
  label: string;
}

export interface DepositionOrderSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  strips: DepositionStripSpec[];
  slots: DepositionSlotSpec[];
  correctOrder: string[];
  archiveCodeLabel: string;
  archiveCode: string;
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  estimatedSeconds: number;
}

export interface DepositionOrderState {
  selectedStripId: string | null;
  placedStrips: Record<string, string | null>;
  solved: boolean;
  feedback: string;
}

export interface DepositionOrderProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
  complete: boolean;
  archiveCodeVisible: boolean;
}

export interface DepositionOrderCheckResult {
  state: DepositionOrderState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}

export type DepositionSlotPlacementStatus = "empty" | "correct" | "incorrect";
