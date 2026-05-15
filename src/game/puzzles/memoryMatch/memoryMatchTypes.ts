export type MemoryMatchPairId = "warmth" | "attention" | "patience" | "joy";

export type MemoryMatchCardId =
  | "quiet-smile"
  | "warmth"
  | "careful-note"
  | "attention"
  | "hard-day"
  | "patience"
  | "tiny-joke"
  | "joy";

export interface MemoryMatchCard {
  id: MemoryMatchCardId;
  pairId: MemoryMatchPairId;
  text: string;
}

export interface MemoryMatchState {
  cards: MemoryMatchCard[];
  selectedCardIds: MemoryMatchCardId[];
  matchedPairIds: MemoryMatchPairId[];
  feedback: string;
  solved: boolean;
  attempts: number;
}
