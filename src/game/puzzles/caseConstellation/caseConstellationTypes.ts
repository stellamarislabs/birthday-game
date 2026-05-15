export interface ConstellationNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface ExhibitStar {
  id: string;
  label: string;
  correctNodeId: string;
}

export interface CaseConstellationSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  nodes: ConstellationNode[];
  stars: ExhibitStar[];
  initialTrayOrder: string[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface CaseConstellationState {
  selectedStarId: string | null;
  trayStarIds: string[];
  placedStarsByNodeId: Record<string, string>;
  solved: boolean;
  feedback: string;
}

export interface CaseConstellationProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
}

export interface CaseConstellationCheckResult {
  state: CaseConstellationState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
