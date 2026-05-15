import type {
  CaseConstellationCheckResult,
  CaseConstellationProgress,
  CaseConstellationSpec,
  CaseConstellationState,
  ExhibitStar
} from "./caseConstellationTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialCaseConstellationState(spec: CaseConstellationSpec): CaseConstellationState {
  return {
    selectedStarId: null,
    trayStarIds: spec.initialTrayOrder.filter((starId) => starExists(spec, starId)),
    placedStarsByNodeId: {},
    solved: false,
    feedback: ""
  };
}

export function selectStar(state: CaseConstellationState, starId: string): CaseConstellationState {
  if (!state.trayStarIds.includes(starId) && !Object.values(state.placedStarsByNodeId).includes(starId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedStarId: starId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedStarOnNode(
  spec: CaseConstellationSpec,
  state: CaseConstellationState,
  nodeId: string
): CaseConstellationState {
  if (!state.selectedStarId || !nodeExists(spec, nodeId)) {
    return cloneState(state);
  }

  const selectedStarId = state.selectedStarId;
  const sourceNodeId = findStarNodeId(state, selectedStarId);
  const targetStarId = state.placedStarsByNodeId[nodeId];
  const placedStarsByNodeId = { ...state.placedStarsByNodeId };
  let trayStarIds = state.trayStarIds.filter((starId) => starId !== selectedStarId);

  if (sourceNodeId) {
    delete placedStarsByNodeId[sourceNodeId];
  }

  if (targetStarId && sourceNodeId) {
    placedStarsByNodeId[sourceNodeId] = targetStarId;
  } else if (targetStarId) {
    trayStarIds = addStarToTray(trayStarIds, targetStarId, spec);
  }

  placedStarsByNodeId[nodeId] = selectedStarId;

  return {
    selectedStarId: null,
    trayStarIds,
    placedStarsByNodeId,
    solved: false,
    feedback: ""
  };
}

export function removeStarFromNode(
  spec: CaseConstellationSpec,
  state: CaseConstellationState,
  nodeId: string
): CaseConstellationState {
  if (!nodeExists(spec, nodeId)) {
    return cloneState(state);
  }

  const starId = state.placedStarsByNodeId[nodeId];
  if (!starId) {
    return cloneState(state);
  }

  const placedStarsByNodeId = { ...state.placedStarsByNodeId };
  delete placedStarsByNodeId[nodeId];

  return {
    ...cloneState(state),
    trayStarIds: addStarToTray(state.trayStarIds, starId, spec),
    placedStarsByNodeId,
    solved: false,
    feedback: ""
  };
}

export function resetCaseConstellation(spec: CaseConstellationSpec): CaseConstellationState {
  return createInitialCaseConstellationState(spec);
}

export function isNodeCorrect(spec: CaseConstellationSpec, state: CaseConstellationState, nodeId: string): boolean {
  const starId = state.placedStarsByNodeId[nodeId];
  const star = starId ? getExhibitStar(spec, starId) : undefined;
  return Boolean(star && star.correctNodeId === nodeId);
}

export function isCaseConstellationComplete(spec: CaseConstellationSpec, state: CaseConstellationState): boolean {
  return spec.nodes.every((node) => Boolean(state.placedStarsByNodeId[node.id]));
}

export function isCaseConstellationSolved(spec: CaseConstellationSpec, state: CaseConstellationState): boolean {
  return spec.stars.every((star) => state.placedStarsByNodeId[star.correctNodeId] === star.id);
}

export function getCaseConstellationProgress(
  spec: CaseConstellationSpec,
  state: CaseConstellationState
): CaseConstellationProgress {
  return {
    placedCount: spec.nodes.filter((node) => Boolean(state.placedStarsByNodeId[node.id])).length,
    correctCount: spec.nodes.filter((node) => isNodeCorrect(spec, state, node.id)).length,
    totalCount: spec.nodes.length
  };
}

export function checkCaseConstellationAnswer(
  spec: CaseConstellationSpec,
  state: CaseConstellationState
): CaseConstellationCheckResult {
  if (!isCaseConstellationComplete(spec, state)) {
    return makeResult(state, false, spec.incompleteText, "incomplete");
  }

  if (!isCaseConstellationSolved(spec, state)) {
    return makeResult(state, false, spec.wrongText, "wrong");
  }

  return makeResult(state, true, getPuzzleSuccessFeedback(spec), "correct");
}

export function getExhibitStar(spec: CaseConstellationSpec, starId: string): ExhibitStar | undefined {
  return spec.stars.find((star) => star.id === starId);
}

function makeResult(
  state: CaseConstellationState,
  solved: boolean,
  feedback: string,
  reason: CaseConstellationCheckResult["reason"]
): CaseConstellationCheckResult {
  const nextState = {
    ...cloneState(state),
    solved,
    feedback
  };

  return { state: nextState, solved, feedback, reason };
}

function starExists(spec: CaseConstellationSpec, starId: string): boolean {
  return spec.stars.some((star) => star.id === starId);
}

function nodeExists(spec: CaseConstellationSpec, nodeId: string): boolean {
  return spec.nodes.some((node) => node.id === nodeId);
}

function findStarNodeId(state: CaseConstellationState, starId: string): string | undefined {
  return Object.entries(state.placedStarsByNodeId).find(([, placedStarId]) => placedStarId === starId)?.[0];
}

function addStarToTray(trayStarIds: string[], starId: string, spec: CaseConstellationSpec): string[] {
  if (!starExists(spec, starId) || trayStarIds.includes(starId)) {
    return [...trayStarIds];
  }

  return [...trayStarIds, starId];
}

function cloneState(state: CaseConstellationState): CaseConstellationState {
  return {
    selectedStarId: state.selectedStarId,
    trayStarIds: [...state.trayStarIds],
    placedStarsByNodeId: { ...state.placedStarsByNodeId },
    solved: state.solved,
    feedback: state.feedback
  };
}
