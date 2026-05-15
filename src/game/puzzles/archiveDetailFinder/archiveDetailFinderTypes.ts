export interface ArchiveDetail {
  id: string;
  label: string;
  meaning: string;
  note: string;
  x: number;
  y: number;
  radius: number;
}

export interface ArchiveDetailFinderSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  evidencePageTitle: string;
  originalLine: string;
  correctionText: string;
  keyLabel: string;
  details: ArchiveDetail[];
  requiredDetailIds: string[];
  successText: string;
  successFollowUp?: string;
  keyReadyText: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export type ArchiveTool = "magnifier" | "bookmark";

export interface ArchiveDetailState {
  magnifier: {
    x: number;
    y: number;
  };
  discoveredDetailIds: string[];
  markedDetailIds: string[];
  selectedTool: ArchiveTool | null;
  keyTaken: boolean;
  solved: boolean;
  feedback: string;
}

export interface ArchiveDetailProgress {
  discoveredCount: number;
  markedCount: number;
  totalCount: number;
  correctionComplete: boolean;
  keyAvailable: boolean;
  keyTaken: boolean;
}

export interface ArchiveDetailCheckResult {
  state: ArchiveDetailState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "correct";
}
