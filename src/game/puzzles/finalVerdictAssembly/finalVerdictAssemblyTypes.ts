export type FinalSealRotation = 0 | 90 | 180 | 270;

export interface FinalSealClueMark {
  id: string;
  label: string;
  chapterId: number;
}

export interface FinalSealRing {
  id: string;
  label: string;
  clueIds: readonly string[];
  initialRotation: FinalSealRotation;
  alignedRotation: FinalSealRotation;
}

export interface FinalVerdictAssemblySpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  clueMarks: readonly FinalSealClueMark[];
  rings: readonly FinalSealRing[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  estimatedSeconds: number;
}

export interface FinalVerdictAssemblyState {
  ringRotationsById: Record<string, FinalSealRotation>;
  solved: boolean;
  feedback: string;
}

export interface FinalVerdictAssemblyProgress {
  alignedRingIds: string[];
  litClueIds: string[];
  litCount: number;
  totalCount: number;
}

export interface FinalVerdictAssemblyCheckResult {
  state: FinalVerdictAssemblyState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "correct";
}
