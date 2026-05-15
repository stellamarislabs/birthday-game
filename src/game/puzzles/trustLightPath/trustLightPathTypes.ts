export type TrustLightDirection = "north" | "east" | "south" | "west";

export type TrustMirrorRotation = 0 | 90 | 180 | 270;

export interface TrustQuestionSpec {
  id: string;
  text: string;
  description: string;
}

export interface TrustMirrorSpec {
  id: string;
  label: string;
  row: number;
  col: number;
  kind: "straight" | "corner";
  baseConnections: [TrustLightDirection, TrustLightDirection];
  initialRotation: TrustMirrorRotation;
}

export interface TrustLightEndpoint {
  label: string;
  row: number;
  col: number;
  direction: TrustLightDirection;
}

export interface TrustLightPathSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  prompt: string;
  questions: TrustQuestionSpec[];
  correctQuestionId: string;
  rows: number;
  columns: number;
  source: TrustLightEndpoint;
  target: TrustLightEndpoint;
  relayLabel: string;
  mirrors: TrustMirrorSpec[];
  successText: string;
  successFollowUp: string;
  incompleteText: string;
  wrongQuestionText: string;
  revealText: string;
  estimatedSeconds: number;
}

export interface TrustLightPathState {
  selectedQuestionId: string | null;
  mirrorRotations: Record<string, TrustMirrorRotation>;
  litMirrorIds: string[];
  solved: boolean;
  feedback: string;
}

export interface TrustLightPathProgress {
  questionCorrect: boolean;
  connected: boolean;
  litMirrorCount: number;
  totalMirrorCount: number;
  payoffVisible: boolean;
}

export interface TrustLightPathCheckResult {
  state: TrustLightPathState;
  solved: boolean;
  feedback: string;
  reason: "needs-question" | "incomplete" | "correct";
}
