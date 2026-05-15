export interface LanternNode {
  id: string;
  label: string;
}

export interface LanternSequenceSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  lanterns: LanternNode[];
  sequence: string[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface LanternSequenceState {
  attempt: string[];
  solved: boolean;
  feedback: string;
  previewVisible: boolean;
  lastWrongLanternId: string | null;
}

export interface LanternSequenceProgress {
  current: number;
  total: number;
}

export interface LanternSequenceCheckResult {
  state: LanternSequenceState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
