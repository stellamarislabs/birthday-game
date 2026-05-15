import { isOrderCorrect, moveItemDown, moveItemUp } from "../shared/orderPuzzleLogic";
import type {
  FinalLetterAssemblyCard,
  FinalLetterAssemblyCardId,
  FinalLetterAssemblyResult,
  FinalLetterAssemblyState
} from "./finalLetterAssemblyTypes";

export const FINAL_LETTER_ASSEMBLY_CARDS: readonly FinalLetterAssemblyCard[] = [
  { id: "attention", title: "Attention" },
  { id: "responsibility", title: "Responsibility" },
  { id: "patience", title: "Patience" },
  { id: "truth", title: "Truth" },
  { id: "details", title: "Details" },
  { id: "trust", title: "Trust" },
  { id: "warmth", title: "Warmth" },
  { id: "promise", title: "Promise" },
  { id: "future", title: "Future" },
  { id: "love", title: "Love" }
] as const;

export const CORRECT_FINAL_LETTER_SEQUENCE: readonly FinalLetterAssemblyCardId[] = [
  "attention",
  "responsibility",
  "patience",
  "truth",
  "details",
  "trust",
  "warmth",
  "promise",
  "future",
  "love"
] as const;

const INITIAL_FINAL_LETTER_SEQUENCE: readonly FinalLetterAssemblyCardId[] = [
  "future",
  "attention",
  "truth",
  "promise",
  "details",
  "responsibility",
  "love",
  "patience",
  "warmth",
  "trust"
] as const;

export const FINAL_LETTER_ASSEMBLY_COPY = {
  title: "Case Review: The Heart Seal",
  instruction: "Assemble the final clue sequence and let the case speak.",
  submit: "File Final Clue",
  reset: "Reset Sequence",
  wrong: "The words are close, but the verdict needs the full truth in order.",
  success: "The final clue is complete."
} as const;

export function createFinalLetterAssemblyState(): FinalLetterAssemblyState {
  return {
    cards: FINAL_LETTER_ASSEMBLY_CARDS.map((card) => ({ ...card })),
    currentOrder: [...INITIAL_FINAL_LETTER_SEQUENCE],
    solved: false,
    attempts: 0
  };
}

export function moveFinalLetterCardUp(
  state: FinalLetterAssemblyState,
  cardId: FinalLetterAssemblyCardId
): FinalLetterAssemblyState {
  return {
    ...cloneState(state),
    currentOrder: moveItemUp(state.currentOrder, cardId),
    solved: false
  };
}

export function moveFinalLetterCardDown(
  state: FinalLetterAssemblyState,
  cardId: FinalLetterAssemblyCardId
): FinalLetterAssemblyState {
  return {
    ...cloneState(state),
    currentOrder: moveItemDown(state.currentOrder, cardId),
    solved: false
  };
}

export function resetFinalLetterAssemblyState(): FinalLetterAssemblyState {
  return createFinalLetterAssemblyState();
}

export function isFinalLetterAssemblyCorrect(state: Pick<FinalLetterAssemblyState, "currentOrder">): boolean {
  return isOrderCorrect(state.currentOrder, CORRECT_FINAL_LETTER_SEQUENCE);
}

export function submitFinalLetterAssembly(state: FinalLetterAssemblyState): {
  state: FinalLetterAssemblyState;
  result: FinalLetterAssemblyResult;
} {
  const solved = isFinalLetterAssemblyCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? FINAL_LETTER_ASSEMBLY_COPY.success : FINAL_LETTER_ASSEMBLY_COPY.wrong
    }
  };
}

export function getOrderedFinalLetterCards(state: FinalLetterAssemblyState): FinalLetterAssemblyCard[] {
  return state.currentOrder.map((cardId) => {
    const card = state.cards.find((candidate) => candidate.id === cardId);
    if (!card) {
      throw new Error(`Unknown final-letter card: ${cardId}`);
    }

    return { ...card };
  });
}

function cloneState(state: FinalLetterAssemblyState): FinalLetterAssemblyState {
  return {
    cards: state.cards.map((card) => ({ ...card })),
    currentOrder: [...state.currentOrder],
    solved: state.solved,
    attempts: state.attempts
  };
}
