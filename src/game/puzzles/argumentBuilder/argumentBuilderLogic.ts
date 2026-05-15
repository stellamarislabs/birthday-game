import type {
  ArgumentBuilderChoice,
  ArgumentBuilderChoiceId,
  ArgumentBuilderResult,
  ArgumentBuilderState
} from "./argumentBuilderTypes";

export const ARGUMENT_BUILDER_PROMPT_TEXT = "Which argument best proves the case?";

export const ARGUMENT_BUILDER_CHOICES: readonly ArgumentBuilderChoice[] = [
  {
    id: "coincidence",
    label: "A",
    text: "Love is a coincidence."
  },
  {
    id: "repeated-actions",
    label: "B",
    text: "Love is a promise repeated through actions."
  },
  {
    id: "impossible",
    label: "C",
    text: "Love is impossible to prove."
  }
] as const;

export const CORRECT_ARGUMENT_BUILDER_CHOICE_ID: ArgumentBuilderChoiceId = "repeated-actions";

export const ARGUMENT_BUILDER_COPY = {
  title: "Case Review: The Blue Ribbon",
  instruction: "Choose the argument that can stand on evidence, not only on words.",
  submit: "Submit Argument",
  reset: "Clear Choice",
  wrong: "That line sounds dramatic, but the evidence points somewhere stronger.",
  success: "Argument accepted.",
  reveal: "The strongest argument is not spoken once. It is lived.",
  followUp: "It appears in patience, in showing up, and in choosing each other again."
} as const;

export function createArgumentBuilderState(): ArgumentBuilderState {
  return {
    promptText: ARGUMENT_BUILDER_PROMPT_TEXT,
    choices: ARGUMENT_BUILDER_CHOICES.map((choice) => ({ ...choice })),
    selectedArgumentId: null,
    solved: false,
    attempts: 0
  };
}

export function selectArgumentBuilderChoice(
  state: ArgumentBuilderState,
  argumentId: ArgumentBuilderChoiceId | null
): ArgumentBuilderState {
  if (argumentId && !state.choices.some((choice) => choice.id === argumentId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedArgumentId: argumentId,
    solved: false
  };
}

export function resetArgumentBuilderState(): ArgumentBuilderState {
  return createArgumentBuilderState();
}

export function isArgumentBuilderCorrect(state: Pick<ArgumentBuilderState, "selectedArgumentId">): boolean {
  return state.selectedArgumentId === CORRECT_ARGUMENT_BUILDER_CHOICE_ID;
}

export function submitArgumentBuilder(state: ArgumentBuilderState): {
  state: ArgumentBuilderState;
  result: ArgumentBuilderResult;
} {
  const solved = isArgumentBuilderCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? ARGUMENT_BUILDER_COPY.success : ARGUMENT_BUILDER_COPY.wrong
    }
  };
}

function cloneState(state: ArgumentBuilderState): ArgumentBuilderState {
  return {
    promptText: state.promptText,
    choices: state.choices.map((choice) => ({ ...choice })),
    selectedArgumentId: state.selectedArgumentId,
    solved: state.solved,
    attempts: state.attempts
  };
}
