import type {
  ArgumentBlock,
  ArgumentTowerCheckResult,
  ArgumentTowerProgress,
  ArgumentTowerSpec,
  ArgumentTowerState
} from "./argumentTowerTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialArgumentTowerState(spec: ArgumentTowerSpec): ArgumentTowerState {
  return {
    selectedBlockId: null,
    trayBlockIds: spec.initialTrayOrder.filter((blockId) => blockExists(spec, blockId)),
    placedBlocksBySlotId: {},
    solved: false,
    feedback: ""
  };
}

export function selectBlock(state: ArgumentTowerState, blockId: string): ArgumentTowerState {
  if (!state.trayBlockIds.includes(blockId) && !Object.values(state.placedBlocksBySlotId).includes(blockId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedBlockId: blockId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedBlockInSlot(
  spec: ArgumentTowerSpec,
  state: ArgumentTowerState,
  slotId: string
): ArgumentTowerState {
  if (!state.selectedBlockId || !slotExists(spec, slotId)) {
    return cloneState(state);
  }

  const selectedBlockId = state.selectedBlockId;
  const sourceSlotId = findBlockSlotId(state, selectedBlockId);
  const targetBlockId = state.placedBlocksBySlotId[slotId];
  const placedBlocksBySlotId = { ...state.placedBlocksBySlotId };
  let trayBlockIds = state.trayBlockIds.filter((blockId) => blockId !== selectedBlockId);

  if (sourceSlotId) {
    delete placedBlocksBySlotId[sourceSlotId];
  }

  if (targetBlockId && sourceSlotId) {
    placedBlocksBySlotId[sourceSlotId] = targetBlockId;
  } else if (targetBlockId) {
    trayBlockIds = addBlockToTray(trayBlockIds, targetBlockId, spec);
  }

  placedBlocksBySlotId[slotId] = selectedBlockId;

  return {
    selectedBlockId: null,
    trayBlockIds,
    placedBlocksBySlotId,
    solved: false,
    feedback: ""
  };
}

export function removeBlockFromSlot(
  spec: ArgumentTowerSpec,
  state: ArgumentTowerState,
  slotId: string
): ArgumentTowerState {
  if (!slotExists(spec, slotId)) {
    return cloneState(state);
  }

  const blockId = state.placedBlocksBySlotId[slotId];
  if (!blockId) {
    return cloneState(state);
  }

  const placedBlocksBySlotId = { ...state.placedBlocksBySlotId };
  delete placedBlocksBySlotId[slotId];

  return {
    ...cloneState(state),
    trayBlockIds: addBlockToTray(state.trayBlockIds, blockId, spec),
    placedBlocksBySlotId,
    solved: false,
    feedback: ""
  };
}

export function resetArgumentTower(spec: ArgumentTowerSpec): ArgumentTowerState {
  return createInitialArgumentTowerState(spec);
}

export function isSlotStable(spec: ArgumentTowerSpec, state: ArgumentTowerState, slotId: string): boolean {
  const slot = spec.slots.find((candidate) => candidate.id === slotId);
  return Boolean(slot && state.placedBlocksBySlotId[slotId] === slot.correctBlockId);
}

export function isArgumentTowerComplete(spec: ArgumentTowerSpec, state: ArgumentTowerState): boolean {
  return spec.slots.every((slot) => Boolean(state.placedBlocksBySlotId[slot.id]));
}

export function isArgumentTowerSolved(spec: ArgumentTowerSpec, state: ArgumentTowerState): boolean {
  return spec.slots.every((slot) => state.placedBlocksBySlotId[slot.id] === slot.correctBlockId);
}

export function getArgumentTowerProgress(
  spec: ArgumentTowerSpec,
  state: ArgumentTowerState
): ArgumentTowerProgress {
  return {
    placedCount: spec.slots.filter((slot) => Boolean(state.placedBlocksBySlotId[slot.id])).length,
    stableCount: spec.slots.filter((slot) => isSlotStable(spec, state, slot.id)).length,
    totalCount: spec.slots.length
  };
}

export function checkArgumentTowerAnswer(
  spec: ArgumentTowerSpec,
  state: ArgumentTowerState
): ArgumentTowerCheckResult {
  if (!isArgumentTowerComplete(spec, state)) {
    return makeResult(state, false, spec.incompleteText, "incomplete");
  }

  if (!isArgumentTowerSolved(spec, state)) {
    return makeResult(state, false, spec.wrongText, "wrong");
  }

  return makeResult(state, true, getPuzzleSuccessFeedback(spec), "correct");
}

export function getArgumentBlock(spec: ArgumentTowerSpec, blockId: string): ArgumentBlock | undefined {
  return spec.blocks.find((block) => block.id === blockId);
}

function makeResult(
  state: ArgumentTowerState,
  solved: boolean,
  feedback: string,
  reason: ArgumentTowerCheckResult["reason"]
): ArgumentTowerCheckResult {
  const nextState = {
    ...cloneState(state),
    solved,
    feedback
  };

  return {
    state: nextState,
    solved,
    feedback,
    reason
  };
}

function blockExists(spec: ArgumentTowerSpec, blockId: string): boolean {
  return spec.blocks.some((block) => block.id === blockId);
}

function slotExists(spec: ArgumentTowerSpec, slotId: string): boolean {
  return spec.slots.some((slot) => slot.id === slotId);
}

function findBlockSlotId(state: ArgumentTowerState, blockId: string): string | undefined {
  return Object.entries(state.placedBlocksBySlotId).find(([, placedBlockId]) => placedBlockId === blockId)?.[0];
}

function addBlockToTray(trayBlockIds: string[], blockId: string, spec: ArgumentTowerSpec): string[] {
  if (!blockExists(spec, blockId) || trayBlockIds.includes(blockId)) {
    return [...trayBlockIds];
  }

  return [...trayBlockIds, blockId];
}

function cloneState(state: ArgumentTowerState): ArgumentTowerState {
  return {
    selectedBlockId: state.selectedBlockId,
    trayBlockIds: [...state.trayBlockIds],
    placedBlocksBySlotId: { ...state.placedBlocksBySlotId },
    solved: state.solved,
    feedback: state.feedback
  };
}
