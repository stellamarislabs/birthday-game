import type {
  LanternSequenceCheckResult,
  LanternSequenceProgress,
  LanternSequenceSpec,
  LanternSequenceState
} from "./lanternSequenceTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialLanternSequenceState(_spec: LanternSequenceSpec): LanternSequenceState {
  return {
    attempt: [],
    solved: false,
    feedback: "",
    previewVisible: false,
    lastWrongLanternId: null
  };
}

export function showLanternPattern(state: LanternSequenceState): LanternSequenceState {
  return {
    ...cloneState(state),
    previewVisible: true,
    feedback: ""
  };
}

export function inputLantern(
  spec: LanternSequenceSpec,
  state: LanternSequenceState,
  lanternId: string
): LanternSequenceState {
  const expected = getNextExpectedLantern(spec, state);
  if (lanternId !== expected) {
    return {
      ...cloneState(state),
      attempt: [],
      solved: false,
      feedback: spec.wrongText,
      lastWrongLanternId: lanternId
    };
  }

  const attempt = [...state.attempt, lanternId];
  const solved = attempt.length === spec.sequence.length;

  const successFeedback = getPuzzleSuccessFeedback(spec);
  return {
    ...cloneState(state),
    attempt,
    solved,
    feedback: solved ? successFeedback : "",
    lastWrongLanternId: null
  };
}

export function resetAttempt(_spec: LanternSequenceSpec, state: LanternSequenceState): LanternSequenceState {
  return {
    ...cloneState(state),
    attempt: [],
    solved: false,
    feedback: "",
    lastWrongLanternId: null
  };
}

export function resetLanternSequence(spec: LanternSequenceSpec): LanternSequenceState {
  return createInitialLanternSequenceState(spec);
}

export function isLanternSequenceSolved(_spec: LanternSequenceSpec, state: LanternSequenceState): boolean {
  return state.solved;
}

export function getLanternSequenceProgress(
  spec: LanternSequenceSpec,
  state: LanternSequenceState
): LanternSequenceProgress {
  return {
    current: state.attempt.length,
    total: spec.sequence.length
  };
}

export function getNextExpectedLantern(spec: LanternSequenceSpec, state: LanternSequenceState): string | null {
  return spec.sequence[state.attempt.length] ?? null;
}

export function checkLanternSequenceAnswer(
  spec: LanternSequenceSpec,
  state: LanternSequenceState
): LanternSequenceCheckResult {
  if (state.solved) {
    const successFeedback = getPuzzleSuccessFeedback(spec);
    return {
      state: {
        ...cloneState(state),
        feedback: successFeedback,
        solved: true
      },
      solved: true,
      feedback: successFeedback,
      reason: "correct"
    };
  }

  const reason = state.lastWrongLanternId ? "wrong" : "incomplete";
  return {
    state: {
      ...cloneState(state),
      feedback: reason === "wrong" ? spec.wrongText : spec.incompleteText,
      solved: false
    },
    solved: false,
    feedback: reason === "wrong" ? spec.wrongText : spec.incompleteText,
    reason
  };
}

function cloneState(state: LanternSequenceState): LanternSequenceState {
  return {
    attempt: [...state.attempt],
    solved: state.solved,
    feedback: state.feedback,
    previewVisible: state.previewVisible,
    lastWrongLanternId: state.lastWrongLanternId
  };
}
