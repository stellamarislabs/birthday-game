import type {
  DepositionOrderCheckResult,
  DepositionOrderProgress,
  DepositionSlotPlacementStatus,
  DepositionOrderSpec,
  DepositionOrderState
} from "./depositionOrderTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialDepositionOrderState(spec: DepositionOrderSpec): DepositionOrderState {
  return {
    selectedStripId: null,
    placedStrips: Object.fromEntries(spec.slots.map((slot) => [slot.id, null])),
    solved: false,
    feedback: ""
  };
}

export function selectStrip(state: DepositionOrderState, stripId: string): DepositionOrderState {
  return {
    ...cloneState(state),
    selectedStripId: stripId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedStripInSlot(
  spec: DepositionOrderSpec,
  state: DepositionOrderState,
  slotId: string
): DepositionOrderState {
  if (!state.selectedStripId || !isValidSlot(spec, slotId) || !isValidStrip(spec, state.selectedStripId)) {
    return cloneState(state);
  }

  return placeStripInSlot(spec, state, state.selectedStripId, slotId);
}

export function swapStrips(
  spec: DepositionOrderSpec,
  state: DepositionOrderState,
  sourceSlotId: string,
  targetSlotId: string
): DepositionOrderState {
  if (!isValidSlot(spec, sourceSlotId) || !isValidSlot(spec, targetSlotId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  const sourceStrip = nextState.placedStrips[sourceSlotId] ?? null;
  nextState.placedStrips[sourceSlotId] = nextState.placedStrips[targetSlotId] ?? null;
  nextState.placedStrips[targetSlotId] = sourceStrip;
  nextState.selectedStripId = null;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

export function removeStripFromSlot(
  spec: DepositionOrderSpec,
  state: DepositionOrderState,
  slotId: string
): DepositionOrderState {
  if (!isValidSlot(spec, slotId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  nextState.placedStrips[slotId] = null;
  nextState.selectedStripId = null;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

export function resetDepositionOrder(spec: DepositionOrderSpec): DepositionOrderState {
  return createInitialDepositionOrderState(spec);
}

export function isDepositionOrderComplete(spec: DepositionOrderSpec, state: DepositionOrderState): boolean {
  return spec.slots.every((slot) => Boolean(state.placedStrips[slot.id]));
}

export function isDepositionOrderSolved(spec: DepositionOrderSpec, state: DepositionOrderState): boolean {
  return spec.slots.every((slot, index) => state.placedStrips[slot.id] === spec.correctOrder[index]);
}

export function getDepositionOrderProgress(
  spec: DepositionOrderSpec,
  state: DepositionOrderState
): DepositionOrderProgress {
  const correctCount = spec.slots.filter((slot, index) => state.placedStrips[slot.id] === spec.correctOrder[index]).length;
  const complete = isDepositionOrderComplete(spec, state);

  return {
    placedCount: spec.slots.filter((slot) => Boolean(state.placedStrips[slot.id])).length,
    correctCount,
    totalCount: spec.slots.length,
    complete,
    archiveCodeVisible: complete && correctCount === spec.slots.length
  };
}

export function checkDepositionOrderAnswer(
  spec: DepositionOrderSpec,
  state: DepositionOrderState
): DepositionOrderCheckResult {
  const complete = isDepositionOrderComplete(spec, state);
  const solved = isDepositionOrderSolved(spec, state);

  if (!complete || !solved) {
    const feedback = complete ? spec.wrongText : spec.incompleteText;
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback
    };

    return {
      state: nextState,
      solved: false,
      feedback,
      reason: complete ? "wrong" : "incomplete"
    };
  }

  const feedback = getPuzzleSuccessFeedback(spec);
  const nextState = {
    ...cloneState(state),
    selectedStripId: null,
    solved: true,
    feedback
  };

  return {
    state: nextState,
    solved: true,
    feedback,
    reason: "correct"
  };
}

export function getStripInSlot(state: DepositionOrderState, slotId: string): string | null {
  return state.placedStrips[slotId] ?? null;
}

export function getDepositionSlotPlacementStatus(
  spec: DepositionOrderSpec,
  state: DepositionOrderState,
  slotId: string
): DepositionSlotPlacementStatus {
  const slotIndex = spec.slots.findIndex((slot) => slot.id === slotId);
  const stripId = getStripInSlot(state, slotId);

  if (slotIndex < 0 || !stripId) {
    return "empty";
  }

  return stripId === spec.correctOrder[slotIndex] ? "correct" : "incorrect";
}

export function getTrayStripIds(spec: DepositionOrderSpec, state: DepositionOrderState): string[] {
  const placed = new Set(Object.values(state.placedStrips).filter(Boolean));
  return spec.strips.map((strip) => strip.id).filter((stripId) => !placed.has(stripId));
}

export function placeStripInSlot(
  spec: DepositionOrderSpec,
  state: DepositionOrderState,
  stripId: string,
  slotId: string
): DepositionOrderState {
  if (!isValidSlot(spec, slotId) || !isValidStrip(spec, stripId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  for (const [candidateSlotId, placedStripId] of Object.entries(nextState.placedStrips)) {
    if (placedStripId === stripId) {
      nextState.placedStrips[candidateSlotId] = null;
    }
  }

  nextState.placedStrips[slotId] = stripId;
  nextState.selectedStripId = null;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

function isValidSlot(spec: DepositionOrderSpec, slotId: string): boolean {
  return spec.slots.some((slot) => slot.id === slotId);
}

function isValidStrip(spec: DepositionOrderSpec, stripId: string): boolean {
  return spec.strips.some((strip) => strip.id === stripId);
}

function cloneState(state: DepositionOrderState): DepositionOrderState {
  return {
    selectedStripId: state.selectedStripId,
    placedStrips: { ...state.placedStrips },
    solved: state.solved,
    feedback: state.feedback
  };
}
