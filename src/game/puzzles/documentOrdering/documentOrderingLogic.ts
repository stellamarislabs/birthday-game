import type {
  DocumentOrderingCard,
  DocumentOrderingCardId,
  DocumentOrderingResult,
  DocumentOrderingState
} from "./documentOrderingTypes";

export const DOCUMENT_ORDERING_CARDS: readonly DocumentOrderingCard[] = [
  {
    id: "facts",
    title: "Facts",
    prompt: "What do we know?"
  },
  {
    id: "evidence",
    title: "Evidence",
    prompt: "What proves it?"
  },
  {
    id: "argument",
    title: "Argument",
    prompt: "What does it mean?"
  },
  {
    id: "conclusion",
    title: "Conclusion",
    prompt: "What is the truth?"
  }
] as const;

export const CORRECT_DOCUMENT_ORDER: readonly DocumentOrderingCardId[] = [
  "facts",
  "evidence",
  "argument",
  "conclusion"
] as const;

const INITIAL_DOCUMENT_ORDER: readonly DocumentOrderingCardId[] = [
  "evidence",
  "facts",
  "conclusion",
  "argument"
] as const;

export const DOCUMENT_ORDERING_COPY = {
  title: "Case Review: The Sealed Envelope",
  instruction: "Arrange the case file in the order Maria would build the truth.",
  submit: "Submit Evidence",
  wrong: "The order is close, but the argument needs stronger foundations.",
  success: "Clue filed.",
  reveal: "Maria notices what others miss.",
  followUp: "The first envelope is not just a clue. It is proof that every true case begins with attention."
} as const;

export function createDocumentOrderingState(): DocumentOrderingState {
  return {
    cards: DOCUMENT_ORDERING_CARDS.map((card) => ({ ...card })),
    currentOrder: [...INITIAL_DOCUMENT_ORDER],
    solved: false,
    attempts: 0
  };
}

export function moveDocumentCardUp(state: DocumentOrderingState, cardId: DocumentOrderingCardId): DocumentOrderingState {
  const index = state.currentOrder.indexOf(cardId);
  if (index <= 0) {
    return cloneState(state);
  }

  return moveCard(state, index, index - 1);
}

export function moveDocumentCardDown(
  state: DocumentOrderingState,
  cardId: DocumentOrderingCardId
): DocumentOrderingState {
  const index = state.currentOrder.indexOf(cardId);
  if (index === -1 || index >= state.currentOrder.length - 1) {
    return cloneState(state);
  }

  return moveCard(state, index, index + 1);
}

export function resetDocumentOrderingState(): DocumentOrderingState {
  return createDocumentOrderingState();
}

export function isDocumentOrderingCorrect(state: Pick<DocumentOrderingState, "currentOrder">): boolean {
  return state.currentOrder.every((cardId, index) => cardId === CORRECT_DOCUMENT_ORDER[index]);
}

export function submitDocumentOrdering(state: DocumentOrderingState): {
  state: DocumentOrderingState;
  result: DocumentOrderingResult;
} {
  const solved = isDocumentOrderingCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? DOCUMENT_ORDERING_COPY.success : DOCUMENT_ORDERING_COPY.wrong
    }
  };
}

export function getOrderedDocumentCards(state: DocumentOrderingState): DocumentOrderingCard[] {
  return state.currentOrder.map((cardId) => {
    const card = state.cards.find((candidate) => candidate.id === cardId);
    if (!card) {
      throw new Error(`Unknown document-ordering card: ${cardId}`);
    }

    return { ...card };
  });
}

function moveCard(state: DocumentOrderingState, fromIndex: number, toIndex: number): DocumentOrderingState {
  const currentOrder = [...state.currentOrder];
  const [cardId] = currentOrder.splice(fromIndex, 1);
  currentOrder.splice(toIndex, 0, cardId);

  return {
    ...cloneState(state),
    currentOrder,
    solved: false
  };
}

function cloneState(state: DocumentOrderingState): DocumentOrderingState {
  return {
    cards: state.cards.map((card) => ({ ...card })),
    currentOrder: [...state.currentOrder],
    solved: state.solved,
    attempts: state.attempts
  };
}
