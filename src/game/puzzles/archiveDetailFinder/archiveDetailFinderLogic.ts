import type {
  ArchiveDetail,
  ArchiveDetailCheckResult,
  ArchiveDetailFinderSpec,
  ArchiveDetailProgress,
  ArchiveDetailState,
  ArchiveTool
} from "./archiveDetailFinderTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialArchiveDetailState(_spec: ArchiveDetailFinderSpec): ArchiveDetailState {
  return {
    magnifier: { x: 50, y: 50 },
    discoveredDetailIds: [],
    markedDetailIds: [],
    selectedTool: null,
    keyTaken: false,
    solved: false,
    feedback: ""
  };
}

export function selectArchiveTool(state: ArchiveDetailState, tool: ArchiveTool): ArchiveDetailState {
  return {
    ...cloneState(state),
    selectedTool: tool,
    solved: false,
    feedback: ""
  };
}

export function moveMagnifierTo(state: ArchiveDetailState, x: number, y: number): ArchiveDetailState {
  return {
    ...cloneState(state),
    magnifier: {
      x: clampPercent(x),
      y: clampPercent(y)
    },
    solved: false,
    feedback: ""
  };
}

export function inspectAt(
  spec: ArchiveDetailFinderSpec,
  state: ArchiveDetailState,
  x: number,
  y: number
): ArchiveDetailState {
  const nextState = moveMagnifierTo(state, x, y);
  const discoveredDetailIds = [...nextState.discoveredDetailIds];

  for (const detail of spec.details) {
    if (isPointInsideDetail(detail, nextState.magnifier.x, nextState.magnifier.y) && !discoveredDetailIds.includes(detail.id)) {
      discoveredDetailIds.push(detail.id);
    }
  }

  return {
    ...nextState,
    discoveredDetailIds,
    selectedTool: null
  };
}

export function markDetail(state: ArchiveDetailState, detailId: string): ArchiveDetailState {
  if (!state.discoveredDetailIds.includes(detailId)) {
    return {
      ...cloneState(state),
      selectedTool: null,
      solved: false
    };
  }

  return {
    ...cloneState(state),
    markedDetailIds: addUnique(state.markedDetailIds, detailId),
    selectedTool: null,
    solved: false,
    feedback: ""
  };
}

export function unmarkDetail(state: ArchiveDetailState, detailId: string): ArchiveDetailState {
  return {
    ...cloneState(state),
    markedDetailIds: state.markedDetailIds.filter((markedDetailId) => markedDetailId !== detailId),
    solved: false,
    feedback: ""
  };
}

export function resetArchiveDetailFinder(spec: ArchiveDetailFinderSpec): ArchiveDetailState {
  return createInitialArchiveDetailState(spec);
}

export function isDetailDiscovered(state: ArchiveDetailState, detailId: string): boolean {
  return state.discoveredDetailIds.includes(detailId);
}

export function isDetailMarked(state: ArchiveDetailState, detailId: string): boolean {
  return state.markedDetailIds.includes(detailId);
}

export function isArchiveDetailComplete(spec: ArchiveDetailFinderSpec, state: ArchiveDetailState): boolean {
  return spec.requiredDetailIds.every((detailId) => state.discoveredDetailIds.includes(detailId));
}

export function isArchiveDetailSolved(spec: ArchiveDetailFinderSpec, state: ArchiveDetailState): boolean {
  return isArchiveDetailComplete(spec, state) && state.keyTaken;
}

export function isArchiveSilverKeyAvailable(spec: ArchiveDetailFinderSpec, state: ArchiveDetailState): boolean {
  return isArchiveDetailComplete(spec, state);
}

export function takeArchiveSilverKey(spec: ArchiveDetailFinderSpec, state: ArchiveDetailState): ArchiveDetailState {
  if (!isArchiveSilverKeyAvailable(spec, state)) {
    return {
      ...cloneState(state),
      keyTaken: false,
      solved: false,
      feedback: spec.incompleteText
    };
  }

  const successFeedback = getPuzzleSuccessFeedback(spec);

  return {
    ...cloneState(state),
    keyTaken: true,
    solved: true,
    selectedTool: null,
    feedback: successFeedback
  };
}

export function getArchiveDetailProgress(
  spec: ArchiveDetailFinderSpec,
  state: ArchiveDetailState
): ArchiveDetailProgress {
  return {
    discoveredCount: spec.requiredDetailIds.filter((detailId) => state.discoveredDetailIds.includes(detailId)).length,
    markedCount: spec.requiredDetailIds.filter((detailId) => state.markedDetailIds.includes(detailId)).length,
    totalCount: spec.requiredDetailIds.length,
    correctionComplete: isArchiveDetailComplete(spec, state),
    keyAvailable: isArchiveSilverKeyAvailable(spec, state),
    keyTaken: state.keyTaken
  };
}

export function checkArchiveDetailAnswer(
  spec: ArchiveDetailFinderSpec,
  state: ArchiveDetailState
): ArchiveDetailCheckResult {
  if (!isArchiveDetailSolved(spec, state)) {
    const correctionComplete = isArchiveDetailComplete(spec, state);
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback: correctionComplete ? spec.keyReadyText : spec.incompleteText
    };

    return {
      state: nextState,
      solved: false,
      feedback: nextState.feedback,
      reason: "incomplete"
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

export function getArchiveDetail(spec: ArchiveDetailFinderSpec, detailId: string): ArchiveDetail | undefined {
  return spec.details.find((detail) => detail.id === detailId);
}

function isPointInsideDetail(detail: ArchiveDetail, x: number, y: number): boolean {
  return Math.hypot(detail.x - x, detail.y - y) <= detail.radius;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function addUnique(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return [...values];
  }

  return [...values, value];
}

function cloneState(state: ArchiveDetailState): ArchiveDetailState {
  return {
    magnifier: { ...state.magnifier },
    discoveredDetailIds: [...state.discoveredDetailIds],
    markedDetailIds: [...state.markedDetailIds],
    selectedTool: state.selectedTool,
    keyTaken: state.keyTaken,
    solved: state.solved,
    feedback: state.feedback
  };
}
