export type FinalLetterAssemblyCardId =
  | "attention"
  | "responsibility"
  | "patience"
  | "truth"
  | "details"
  | "trust"
  | "warmth"
  | "promise"
  | "future"
  | "love";

export interface FinalLetterAssemblyCard {
  id: FinalLetterAssemblyCardId;
  title: string;
}

export interface FinalLetterAssemblyState {
  cards: FinalLetterAssemblyCard[];
  currentOrder: FinalLetterAssemblyCardId[];
  solved: boolean;
  attempts: number;
}

export interface FinalLetterAssemblyResult {
  solved: boolean;
  feedback: string;
}
