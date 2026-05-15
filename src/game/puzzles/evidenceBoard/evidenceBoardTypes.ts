export interface EvidenceBoardCard {
  id: string;
  label: string;
  description?: string;
}

export interface EvidenceBoardCorrectLink {
  evidenceId: string;
  meaningId: string;
}

export interface EvidenceBoardConclusionChoice {
  id: string;
  label: string;
}

export interface EvidenceBoardConclusionQuestion {
  prompt: string;
  choices: EvidenceBoardConclusionChoice[];
  correctChoiceId: string;
  successText: string;
  wrongText: string;
}

export interface EvidenceBoardSpec {
  levelId: number;
  title: string;
  exhibitName: string;
  instruction: string;
  evidenceCards: EvidenceBoardCard[];
  meaningCards: EvidenceBoardCard[];
  correctLinks: EvidenceBoardCorrectLink[];
  conclusionQuestion?: EvidenceBoardConclusionQuestion;
  allowDuplicateMeanings?: boolean;
  successText: string;
  wrongText: string;
  incompleteText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export type EvidenceBoardLinks = Record<string, string>;

export interface EvidenceBoardState {
  selectedEvidenceId: string | null;
  links: EvidenceBoardLinks;
  conclusionChoiceId: string | null;
  solved: boolean;
  feedback: string;
}

export interface EvidenceBoardCheckResult {
  state: EvidenceBoardState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
