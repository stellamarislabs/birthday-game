import type {
  EchoPathCheckResult,
  EchoPathSpec,
  EchoPathState
} from "./echoPathTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialEchoPathState(_spec: EchoPathSpec): EchoPathState {
  return {
    selectedQuestionId: null,
    placedQuestionId: null,
    selectedKey: false,
    keyPlacedDoorId: null,
    solved: false,
    feedback: ""
  };
}

export function selectQuestion(state: EchoPathState, questionId: string): EchoPathState {
  return {
    ...cloneState(state),
    selectedQuestionId: questionId,
    selectedKey: false,
    solved: false,
    feedback: ""
  };
}

export function placeQuestionInSlot(
  spec: EchoPathSpec,
  state: EchoPathState,
  questionId: string
): EchoPathState {
  if (!spec.questions.some((question) => question.id === questionId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedQuestionId: null,
    placedQuestionId: questionId,
    selectedKey: false,
    keyPlacedDoorId: null,
    solved: false,
    feedback: ""
  };
}

export function removeQuestionFromSlot(state: EchoPathState): EchoPathState {
  return {
    ...cloneState(state),
    placedQuestionId: null,
    selectedQuestionId: null,
    keyPlacedDoorId: null,
    solved: false,
    feedback: ""
  };
}

export function selectKey(state: EchoPathState): EchoPathState {
  return {
    ...cloneState(state),
    selectedQuestionId: null,
    selectedKey: true,
    solved: false,
    feedback: ""
  };
}

export function placeKeyOnDoor(
  spec: EchoPathSpec,
  state: EchoPathState,
  doorId: string
): EchoPathState {
  if (!isDoorUnlocked(spec, state, doorId)) {
    return {
      ...cloneState(state),
      selectedKey: false,
      solved: false,
      feedback: spec.wrongText
    };
  }

  return {
    ...cloneState(state),
    selectedKey: false,
    keyPlacedDoorId: doorId,
    solved: doorId === spec.correctDoorId,
    feedback: spec.readyText
  };
}

export function resetEchoPath(spec: EchoPathSpec): EchoPathState {
  return createInitialEchoPathState(spec);
}

export function isCorrectQuestionPlaced(spec: EchoPathSpec, state: EchoPathState): boolean {
  return state.placedQuestionId === spec.correctQuestionId;
}

export function isDoorUnlocked(spec: EchoPathSpec, state: EchoPathState, doorId: string): boolean {
  return isCorrectQuestionPlaced(spec, state) && doorId === spec.correctDoorId;
}

export function isEchoPathComplete(_spec: EchoPathSpec, state: EchoPathState): boolean {
  return Boolean(state.keyPlacedDoorId);
}

export function isEchoPathSolved(spec: EchoPathSpec, state: EchoPathState): boolean {
  return state.placedQuestionId === spec.correctQuestionId && state.keyPlacedDoorId === spec.correctDoorId;
}

export function checkEchoPathAnswer(spec: EchoPathSpec, state: EchoPathState): EchoPathCheckResult {
  if (!state.placedQuestionId || !state.keyPlacedDoorId) {
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback: spec.incompleteText
    };

    return {
      state: nextState,
      solved: false,
      feedback: spec.incompleteText,
      reason: "incomplete"
    };
  }

  if (!isEchoPathSolved(spec, state)) {
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback: spec.wrongText
    };

    return {
      state: nextState,
      solved: false,
      feedback: spec.wrongText,
      reason: "wrong"
    };
  }

  const successFeedback = getPuzzleSuccessFeedback(spec);
  const nextState = {
    ...cloneState(state),
    solved: true,
    feedback: successFeedback
  };

  return {
    state: nextState,
    solved: true,
    feedback: successFeedback,
    reason: "correct"
  };
}

function cloneState(state: EchoPathState): EchoPathState {
  return {
    selectedQuestionId: state.selectedQuestionId,
    placedQuestionId: state.placedQuestionId,
    selectedKey: state.selectedKey,
    keyPlacedDoorId: state.keyPlacedDoorId,
    solved: state.solved,
    feedback: state.feedback
  };
}
