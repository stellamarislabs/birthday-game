import type {
  WitnessLensCheckResult,
  WitnessLensSpec,
  WitnessLensState,
  WitnessTool
} from "./witnessLensTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialWitnessLensState(_spec: WitnessLensSpec): WitnessLensState {
  return {
    inspectedStatementId: null,
    markedStatementId: null,
    selectedTool: null,
    solved: false,
    feedback: ""
  };
}

export function selectWitnessTool(state: WitnessLensState, tool: WitnessTool): WitnessLensState {
  return {
    ...cloneState(state),
    selectedTool: tool,
    solved: false,
    feedback: ""
  };
}

export function inspectStatement(state: WitnessLensState, statementId: string): WitnessLensState {
  return {
    ...cloneState(state),
    inspectedStatementId: statementId,
    selectedTool: null,
    solved: false,
    feedback: ""
  };
}

export function markStatement(state: WitnessLensState, statementId: string): WitnessLensState {
  return {
    ...cloneState(state),
    markedStatementId: statementId,
    inspectedStatementId: statementId,
    selectedTool: null,
    solved: false,
    feedback: ""
  };
}

export function clearMark(state: WitnessLensState): WitnessLensState {
  return {
    ...cloneState(state),
    markedStatementId: null,
    solved: false,
    feedback: ""
  };
}

export function resetWitnessLens(spec: WitnessLensSpec): WitnessLensState {
  return createInitialWitnessLensState(spec);
}

export function isWitnessLensComplete(_spec: WitnessLensSpec, state: WitnessLensState): boolean {
  return Boolean(state.markedStatementId);
}

export function isWitnessLensSolved(spec: WitnessLensSpec, state: WitnessLensState): boolean {
  return state.markedStatementId === spec.correctStatementId;
}

export function checkWitnessLensAnswer(
  spec: WitnessLensSpec,
  state: WitnessLensState
): WitnessLensCheckResult {
  if (!isWitnessLensComplete(spec, state)) {
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

  if (!isWitnessLensSolved(spec, state)) {
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

function cloneState(state: WitnessLensState): WitnessLensState {
  return {
    inspectedStatementId: state.inspectedStatementId,
    markedStatementId: state.markedStatementId,
    selectedTool: state.selectedTool,
    solved: state.solved,
    feedback: state.feedback
  };
}
