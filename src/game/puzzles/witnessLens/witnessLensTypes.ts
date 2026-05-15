export interface WitnessStatement {
  id: string;
  label: string;
  text: string;
  hint: string;
}

export interface WitnessLensSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  evidenceNote: string;
  statements: WitnessStatement[];
  correctStatementId: string;
  lensLabel: string;
  stampLabel: string;
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export type WitnessTool = "lens" | "stamp";

export interface WitnessLensState {
  inspectedStatementId: string | null;
  markedStatementId: string | null;
  selectedTool: WitnessTool | null;
  solved: boolean;
  feedback: string;
}

export interface WitnessLensCheckResult {
  state: WitnessLensState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
