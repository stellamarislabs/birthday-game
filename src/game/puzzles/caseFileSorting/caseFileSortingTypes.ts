export interface CaseFileDocumentSpec {
  id: string;
  title: string;
  label: string;
  symbol: string;
}

export interface CaseFileSlotSpec {
  id: string;
  label: string;
}

export interface CaseFileSortingSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  documents: CaseFileDocumentSpec[];
  slots: CaseFileSlotSpec[];
  correctOrder: string[];
  correctionText: string;
  keyLabel: string;
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  estimatedSeconds: number;
}

export interface CaseFileSortingState {
  selectedDocumentId: string | null;
  placedDocuments: Record<string, string | null>;
  keyTaken: boolean;
  solved: boolean;
  feedback: string;
}

export interface CaseFileSortingProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
  complete: boolean;
  correctionVisible: boolean;
  keyAvailable: boolean;
  keyTaken: boolean;
}

export interface CaseFileSortingCheckResult {
  state: CaseFileSortingState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "needs-key" | "correct";
}

export type CaseFileSlotPlacementStatus = "empty" | "correct" | "incorrect";
