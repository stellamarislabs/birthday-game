import type { PatternRepeatLantern, PatternRepeatLanternId, PatternRepeatState } from "./patternRepeatTypes";

export const PATTERN_REPEAT_LANTERNS: readonly PatternRepeatLantern[] = [
  { id: "north", label: "North Lantern" },
  { id: "east", label: "East Lantern" },
  { id: "south", label: "South Lantern" },
  { id: "west", label: "West Lantern" }
] as const;

export const PATTERN_REPEAT_TARGET_SEQUENCE: readonly PatternRepeatLanternId[] = ["north", "east", "south", "east"] as const;

export const PATTERN_REPEAT_COPY = {
  title: "Case Review: The Lantern",
  kicker: "Pattern repeat",
  instruction: "Watch the lanterns, then repeat the quiet pattern.",
  showPattern: "Show Pattern",
  resetAttempt: "Try Again",
  wrong: "The lights fade gently. Try the pattern again.",
  success: "The garden answers softly.",
  reveal: "Maria is warmth, calm, and home.",
  followUp: "Some people do not need to be loud to become the safest place."
} as const;

export function createPatternRepeatState(): PatternRepeatState {
  return {
    lanterns: PATTERN_REPEAT_LANTERNS.map((lantern) => ({ ...lantern })),
    targetSequence: [...PATTERN_REPEAT_TARGET_SEQUENCE],
    inputSequence: [],
    sequenceVisible: false,
    solved: false,
    feedback: ""
  };
}

export function showPatternRepeatSequence(state: PatternRepeatState): PatternRepeatState {
  return {
    ...clonePatternRepeatState(state),
    sequenceVisible: true,
    feedback: ""
  };
}

export function inputPatternRepeatLantern(
  state: PatternRepeatState,
  lanternId: PatternRepeatLanternId
): PatternRepeatState {
  if (state.solved || !state.lanterns.some((lantern) => lantern.id === lanternId)) {
    return clonePatternRepeatState(state);
  }

  const expectedLanternId = state.targetSequence[state.inputSequence.length];

  if (lanternId !== expectedLanternId) {
    return {
      ...clonePatternRepeatState(state),
      inputSequence: [],
      solved: false,
      feedback: PATTERN_REPEAT_COPY.wrong
    };
  }

  const inputSequence = [...state.inputSequence, lanternId];
  const solved = isPatternRepeatSequenceCorrect(inputSequence, state.targetSequence);

  return {
    ...clonePatternRepeatState(state),
    inputSequence,
    solved,
    feedback: solved ? PATTERN_REPEAT_COPY.success : ""
  };
}

export function resetPatternRepeatAttempt(state: PatternRepeatState): PatternRepeatState {
  return {
    ...clonePatternRepeatState(state),
    inputSequence: [],
    solved: false,
    feedback: ""
  };
}

export function resetPatternRepeatPuzzle(): PatternRepeatState {
  return createPatternRepeatState();
}

export function isPatternRepeatSequenceCorrect(
  inputSequence: readonly PatternRepeatLanternId[],
  targetSequence: readonly PatternRepeatLanternId[] = PATTERN_REPEAT_TARGET_SEQUENCE
): boolean {
  return inputSequence.length === targetSequence.length && inputSequence.every((lanternId, index) => lanternId === targetSequence[index]);
}

export function getPatternRepeatLanternLabel(state: PatternRepeatState, lanternId: PatternRepeatLanternId): string {
  return state.lanterns.find((lantern) => lantern.id === lanternId)?.label ?? lanternId;
}

function clonePatternRepeatState(state: PatternRepeatState): PatternRepeatState {
  return {
    lanterns: state.lanterns.map((lantern) => ({ ...lantern })),
    targetSequence: [...state.targetSequence],
    inputSequence: [...state.inputSequence],
    sequenceVisible: state.sequenceVisible,
    solved: state.solved,
    feedback: state.feedback
  };
}

