import type { MemoryMatchCard, MemoryMatchCardId, MemoryMatchPairId, MemoryMatchState } from "./memoryMatchTypes";

export const MEMORY_MATCH_PAIRS: readonly MemoryMatchPairId[] = ["warmth", "attention", "patience", "joy"] as const;

export const MEMORY_MATCH_CARDS: readonly MemoryMatchCard[] = [
  { id: "quiet-smile", pairId: "warmth", text: "A quiet smile" },
  { id: "warmth", pairId: "warmth", text: "Warmth" },
  { id: "careful-note", pairId: "attention", text: "A careful note" },
  { id: "attention", pairId: "attention", text: "Attention" },
  { id: "hard-day", pairId: "patience", text: "A hard day" },
  { id: "patience", pairId: "patience", text: "Patience" },
  { id: "tiny-joke", pairId: "joy", text: "A tiny joke" },
  { id: "joy", pairId: "joy", text: "Joy" }
] as const;

export const DEFAULT_MEMORY_MATCH_ORDER: readonly MemoryMatchCardId[] = [
  "quiet-smile",
  "careful-note",
  "warmth",
  "hard-day",
  "attention",
  "tiny-joke",
  "patience",
  "joy"
] as const;

export const MEMORY_MATCH_COPY = {
  title: "Case Review: The Marginal Note",
  instruction: "Match the tiny details with what they quietly prove.",
  reset: "Reset Matches",
  wrong: "These details belong to different pages.",
  success: "Details matched.",
  reveal: "Small details become evidence when someone truly loves you.",
  followUp: "The smallest notes in the margin sometimes explain the whole case."
} as const;

export function createMemoryMatchState(order: readonly MemoryMatchCardId[] = DEFAULT_MEMORY_MATCH_ORDER): MemoryMatchState {
  return {
    cards: order.map((cardId) => {
      const card = getMemoryMatchCard(cardId);
      return { ...card };
    }),
    selectedCardIds: [],
    matchedPairIds: [],
    feedback: "",
    solved: false,
    attempts: 0
  };
}

export function selectMemoryMatchCard(state: MemoryMatchState, cardId: MemoryMatchCardId): MemoryMatchState {
  const selectedCard = state.cards.find((card) => card.id === cardId);
  if (!selectedCard || state.matchedPairIds.includes(selectedCard.pairId)) {
    return cloneState(state);
  }

  if (state.selectedCardIds.length === 0) {
    return {
      ...cloneState(state),
      selectedCardIds: [cardId],
      feedback: "",
      solved: false
    };
  }

  const [firstCardId] = state.selectedCardIds;
  if (firstCardId === cardId) {
    return cloneState(state);
  }

  const firstCard = state.cards.find((card) => card.id === firstCardId);
  if (!firstCard) {
    return {
      ...cloneState(state),
      selectedCardIds: [cardId],
      feedback: "",
      solved: false
    };
  }

  if (firstCard.pairId === selectedCard.pairId) {
    const matchedPairIds = uniquePairs([...state.matchedPairIds, selectedCard.pairId]);
    const solved = matchedPairIds.length === MEMORY_MATCH_PAIRS.length;

    return {
      ...cloneState(state),
      selectedCardIds: [],
      matchedPairIds,
      feedback: solved ? MEMORY_MATCH_COPY.success : "",
      solved,
      attempts: state.attempts + 1
    };
  }

  return {
    ...cloneState(state),
    selectedCardIds: [],
    feedback: MEMORY_MATCH_COPY.wrong,
    solved: false,
    attempts: state.attempts + 1
  };
}

export function resetMemoryMatchState(): MemoryMatchState {
  return createMemoryMatchState();
}

export function isMemoryMatchSolved(state: Pick<MemoryMatchState, "matchedPairIds">): boolean {
  return MEMORY_MATCH_PAIRS.every((pairId) => state.matchedPairIds.includes(pairId));
}

export function getMemoryMatchCard(cardId: MemoryMatchCardId): MemoryMatchCard {
  const card = MEMORY_MATCH_CARDS.find((candidate) => candidate.id === cardId);
  if (!card) {
    throw new Error(`Unknown memory-match card: ${cardId}`);
  }

  return card;
}

function uniquePairs(pairIds: MemoryMatchPairId[]): MemoryMatchPairId[] {
  return MEMORY_MATCH_PAIRS.filter((pairId) => pairIds.includes(pairId));
}

function cloneState(state: MemoryMatchState): MemoryMatchState {
  return {
    cards: state.cards.map((card) => ({ ...card })),
    selectedCardIds: [...state.selectedCardIds],
    matchedPairIds: [...state.matchedPairIds],
    feedback: state.feedback,
    solved: state.solved,
    attempts: state.attempts
  };
}
