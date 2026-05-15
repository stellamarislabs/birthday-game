import type {
  CaseTimelineCheckResult,
  CaseTimelineProgress,
  CaseTimelineSpec,
  CaseTimelineState,
  TimelineSlot,
  TimelineTask
} from "./caseTimelineTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialCaseTimelineState(spec: CaseTimelineSpec): CaseTimelineState {
  return {
    selectedTaskId: null,
    trayTaskIds: spec.initialTrayOrder.filter((taskId) => taskExists(spec, taskId)),
    placedTasksBySlotId: {},
    solved: false,
    feedback: ""
  };
}

export function selectTask(state: CaseTimelineState, taskId: string): CaseTimelineState {
  if (!state.trayTaskIds.includes(taskId) && !Object.values(state.placedTasksBySlotId).includes(taskId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedTaskId: taskId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedTaskInSlot(
  spec: CaseTimelineSpec,
  state: CaseTimelineState,
  slotId: string
): CaseTimelineState {
  if (!state.selectedTaskId || !getSlot(spec, slotId)) {
    return cloneState(state);
  }

  const selectedTaskId = state.selectedTaskId;
  const sourceSlotId = findTaskSlotId(state, selectedTaskId);
  const targetTaskId = state.placedTasksBySlotId[slotId];
  const placedTasksBySlotId = { ...state.placedTasksBySlotId };
  let trayTaskIds = state.trayTaskIds.filter((taskId) => taskId !== selectedTaskId);

  if (sourceSlotId) {
    delete placedTasksBySlotId[sourceSlotId];
  }

  if (targetTaskId && sourceSlotId) {
    placedTasksBySlotId[sourceSlotId] = targetTaskId;
  } else if (targetTaskId) {
    trayTaskIds = addTaskToTray(trayTaskIds, targetTaskId, spec);
  }

  placedTasksBySlotId[slotId] = selectedTaskId;

  return {
    selectedTaskId: null,
    trayTaskIds,
    placedTasksBySlotId,
    solved: false,
    feedback: ""
  };
}

export function removeTaskFromSlot(
  spec: CaseTimelineSpec,
  state: CaseTimelineState,
  slotId: string
): CaseTimelineState {
  if (!getSlot(spec, slotId)) {
    return cloneState(state);
  }

  const taskId = state.placedTasksBySlotId[slotId];
  if (!taskId) {
    return cloneState(state);
  }

  const placedTasksBySlotId = { ...state.placedTasksBySlotId };
  delete placedTasksBySlotId[slotId];

  return {
    ...cloneState(state),
    trayTaskIds: addTaskToTray(state.trayTaskIds, taskId, spec),
    placedTasksBySlotId,
    solved: false,
    feedback: ""
  };
}

export function swapTasks(
  spec: CaseTimelineSpec,
  state: CaseTimelineState,
  sourceSlotId: string,
  targetSlotId: string
): CaseTimelineState {
  if (!getSlot(spec, sourceSlotId) || !getSlot(spec, targetSlotId)) {
    return cloneState(state);
  }

  const sourceTaskId = state.placedTasksBySlotId[sourceSlotId];
  const targetTaskId = state.placedTasksBySlotId[targetSlotId];
  if (!sourceTaskId && !targetTaskId) {
    return cloneState(state);
  }

  const placedTasksBySlotId = { ...state.placedTasksBySlotId };

  if (targetTaskId) {
    placedTasksBySlotId[sourceSlotId] = targetTaskId;
  } else {
    delete placedTasksBySlotId[sourceSlotId];
  }

  if (sourceTaskId) {
    placedTasksBySlotId[targetSlotId] = sourceTaskId;
  } else {
    delete placedTasksBySlotId[targetSlotId];
  }

  return {
    ...cloneState(state),
    placedTasksBySlotId,
    solved: false,
    feedback: ""
  };
}

export function resetCaseTimeline(spec: CaseTimelineSpec): CaseTimelineState {
  return createInitialCaseTimelineState(spec);
}

export function isCaseTimelineComplete(spec: CaseTimelineSpec, state: CaseTimelineState): boolean {
  return spec.slots.every((slot) => Boolean(state.placedTasksBySlotId[slot.id]));
}

export function isCaseTimelineSolved(spec: CaseTimelineSpec, state: CaseTimelineState): boolean {
  return isCaseTimelineComplete(spec, state) && getOrderedSlots(spec).every((slot, index) => {
    return state.placedTasksBySlotId[slot.id] === spec.correctSequence[index];
  });
}

export function getCaseTimelineProgress(spec: CaseTimelineSpec, state: CaseTimelineState): CaseTimelineProgress {
  const orderedSlots = getOrderedSlots(spec);

  return {
    placedCount: orderedSlots.filter((slot) => Boolean(state.placedTasksBySlotId[slot.id])).length,
    correctCount: orderedSlots.filter((slot, index) => state.placedTasksBySlotId[slot.id] === spec.correctSequence[index])
      .length,
    totalCount: spec.slots.length
  };
}

export function checkCaseTimelineAnswer(spec: CaseTimelineSpec, state: CaseTimelineState): CaseTimelineCheckResult {
  if (!isCaseTimelineComplete(spec, state)) {
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

  if (!isCaseTimelineSolved(spec, state)) {
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

export function getOrderedSlots(spec: CaseTimelineSpec): TimelineSlot[] {
  return [...spec.slots].sort((left, right) => left.orderIndex - right.orderIndex);
}

export function getTask(spec: CaseTimelineSpec, taskId: string): TimelineTask | undefined {
  return spec.tasks.find((task) => task.id === taskId);
}

export function getSlot(spec: CaseTimelineSpec, slotId: string): TimelineSlot | undefined {
  return spec.slots.find((slot) => slot.id === slotId);
}

function findTaskSlotId(state: CaseTimelineState, taskId: string): string | undefined {
  return Object.entries(state.placedTasksBySlotId).find(([, placedTaskId]) => placedTaskId === taskId)?.[0];
}

function addTaskToTray(trayTaskIds: string[], taskId: string, spec: CaseTimelineSpec): string[] {
  if (!taskExists(spec, taskId) || trayTaskIds.includes(taskId)) {
    return [...trayTaskIds];
  }

  return [...trayTaskIds, taskId];
}

function taskExists(spec: CaseTimelineSpec, taskId: string): boolean {
  return spec.tasks.some((task) => task.id === taskId);
}

function cloneState(state: CaseTimelineState): CaseTimelineState {
  return {
    selectedTaskId: state.selectedTaskId,
    trayTaskIds: [...state.trayTaskIds],
    placedTasksBySlotId: { ...state.placedTasksBySlotId },
    solved: state.solved,
    feedback: state.feedback
  };
}
