import type {
  CrossExaminationChoice,
  CrossExaminationChoiceId,
  CrossExaminationResult,
  CrossExaminationState
} from "./crossExaminationTypes";

export const CROSS_EXAMINATION_PROMPT_TEXT = "How do you know this love is real?";

export const CROSS_EXAMINATION_CHOICES: readonly CrossExaminationChoice[] = [
  {
    id: "who-benefits",
    label: "A",
    text: "Who benefits?"
  },
  {
    id: "what-remains",
    label: "B",
    text: "What remains when things are difficult?"
  },
  {
    id: "receipt",
    label: "C",
    text: "Where is the receipt?"
  }
] as const;

export const CORRECT_CROSS_EXAMINATION_CHOICE_ID: CrossExaminationChoiceId = "what-remains";

export const CROSS_EXAMINATION_COPY = {
  title: "Case Review: The Silver Key",
  instruction: "Choose the question that leads the echo toward the truth.",
  submit: "Submit Question",
  reset: "Clear Choice",
  wrong: "That question sounds clever, but it does not reach the heart of the case.",
  success: "The echo answers honestly.",
  reveal: "Real love is proven by choosing each other again.",
  followUp: "Not once, not only on easy days, but again and again."
} as const;

export function createCrossExaminationState(): CrossExaminationState {
  return {
    promptText: CROSS_EXAMINATION_PROMPT_TEXT,
    choices: CROSS_EXAMINATION_CHOICES.map((choice) => ({ ...choice })),
    selectedChoiceId: null,
    solved: false,
    attempts: 0
  };
}

export function selectCrossExaminationChoice(
  state: CrossExaminationState,
  choiceId: CrossExaminationChoiceId | null
): CrossExaminationState {
  if (choiceId && !state.choices.some((choice) => choice.id === choiceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedChoiceId: choiceId,
    solved: false
  };
}

export function resetCrossExaminationState(): CrossExaminationState {
  return createCrossExaminationState();
}

export function isCrossExaminationCorrect(state: Pick<CrossExaminationState, "selectedChoiceId">): boolean {
  return state.selectedChoiceId === CORRECT_CROSS_EXAMINATION_CHOICE_ID;
}

export function submitCrossExamination(state: CrossExaminationState): {
  state: CrossExaminationState;
  result: CrossExaminationResult;
} {
  const solved = isCrossExaminationCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? CROSS_EXAMINATION_COPY.success : CROSS_EXAMINATION_COPY.wrong
    }
  };
}

function cloneState(state: CrossExaminationState): CrossExaminationState {
  return {
    promptText: state.promptText,
    choices: state.choices.map((choice) => ({ ...choice })),
    selectedChoiceId: state.selectedChoiceId,
    solved: state.solved,
    attempts: state.attempts
  };
}
