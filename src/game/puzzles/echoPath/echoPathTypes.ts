export interface EchoQuestion {
  id: string;
  text: string;
  description: string;
}

export interface EchoDoor {
  id: string;
  label: string;
}

export interface EchoSuccessRevealStep {
  label: string;
  detail: string;
}

export interface EchoPathSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  prompt: string;
  questions: EchoQuestion[];
  doors: EchoDoor[];
  correctQuestionId: string;
  correctDoorId: string;
  keyLabel: string;
  successText: string;
  successFollowUp?: string;
  successRevealSteps: readonly EchoSuccessRevealStep[];
  readyText: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface EchoPathState {
  selectedQuestionId: string | null;
  placedQuestionId: string | null;
  selectedKey: boolean;
  keyPlacedDoorId: string | null;
  solved: boolean;
  feedback: string;
}

export interface EchoPathCheckResult {
  state: EchoPathState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
