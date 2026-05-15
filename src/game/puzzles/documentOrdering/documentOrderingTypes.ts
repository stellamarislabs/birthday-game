export type DocumentOrderingCardId = "facts" | "evidence" | "argument" | "conclusion";

export interface DocumentOrderingCard {
  id: DocumentOrderingCardId;
  title: string;
  prompt: string;
}

export interface DocumentOrderingState {
  cards: DocumentOrderingCard[];
  currentOrder: DocumentOrderingCardId[];
  solved: boolean;
  attempts: number;
}

export interface DocumentOrderingResult {
  solved: boolean;
  feedback: string;
}
