import type {
  BoardSlot,
  CaseBoardCheckResult,
  CaseBoardSpec,
  CaseBoardState,
  CaseTile,
  PlacedTilesBySlotId,
  ValidConnection
} from "./caseBoardTypes";

export function createInitialCaseBoardState(spec: CaseBoardSpec): CaseBoardState {
  const placedTilesBySlotId: PlacedTilesBySlotId = {};

  for (const slot of spec.boardSlots) {
    if (slot.lockedTileId) {
      placedTilesBySlotId[slot.id] = slot.lockedTileId;
    }
  }

  return withActiveConnections(spec, {
    placedTilesBySlotId,
    selectedTileId: null,
    solved: false,
    feedback: "",
    activeConnections: []
  });
}

export function selectTile(spec: CaseBoardSpec, state: CaseBoardState, tileId: string): CaseBoardState {
  if (!getTile(spec, tileId) || isTileLockedInPlace(spec, state, tileId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedTileId: tileId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedTileInSlot(
  spec: CaseBoardSpec,
  state: CaseBoardState,
  slotId: string
): CaseBoardState {
  if (!state.selectedTileId) {
    return cloneState(state);
  }

  const slot = getSlot(spec, slotId);
  const tile = getTile(spec, state.selectedTileId);

  if (!slot || !tile || slot.lockedTileId) {
    return cloneState(state);
  }

  if (!slotAcceptsTile(slot, tile)) {
    return {
      ...cloneState(state),
      solved: false,
      feedback: "That tile does not fit this part of the path."
    };
  }

  const placedTilesBySlotId = { ...state.placedTilesBySlotId };
  for (const [placedSlotId, placedTileId] of Object.entries(placedTilesBySlotId)) {
    if (placedTileId === tile.id) {
      delete placedTilesBySlotId[placedSlotId];
    }
  }

  placedTilesBySlotId[slot.id] = tile.id;

  return withActiveConnections(spec, {
    ...cloneState(state),
    placedTilesBySlotId,
    selectedTileId: null,
    solved: false,
    feedback: ""
  });
}

export function removeTileFromSlot(spec: CaseBoardSpec, state: CaseBoardState, slotId: string): CaseBoardState {
  const slot = getSlot(spec, slotId);
  if (!slot || slot.lockedTileId) {
    return cloneState(state);
  }

  const placedTilesBySlotId = { ...state.placedTilesBySlotId };
  delete placedTilesBySlotId[slotId];

  return withActiveConnections(spec, {
    ...cloneState(state),
    placedTilesBySlotId,
    solved: false,
    feedback: ""
  });
}

export function resetCaseBoard(spec: CaseBoardSpec): CaseBoardState {
  return createInitialCaseBoardState(spec);
}

export function getActiveConnections(spec: CaseBoardSpec, state: CaseBoardState): ValidConnection[] {
  const activeConnections: ValidConnection[] = [];

  for (let index = 0; index < spec.boardSlots.length - 1; index += 1) {
    const fromSlot = spec.boardSlots[index];
    const toSlot = spec.boardSlots[index + 1];
    const fromTileId = state.placedTilesBySlotId[fromSlot.id];
    const toTileId = state.placedTilesBySlotId[toSlot.id];

    if (fromTileId && toTileId && isValidConnection(spec, fromTileId, toTileId)) {
      activeConnections.push({ fromTileId, toTileId });
    }
  }

  return activeConnections;
}

export function isConnectionActive(
  spec: CaseBoardSpec,
  state: CaseBoardState,
  fromSlotId: string,
  toSlotId: string
): boolean {
  const fromTileId = state.placedTilesBySlotId[fromSlotId];
  const toTileId = state.placedTilesBySlotId[toSlotId];

  return Boolean(fromTileId && toTileId && isValidConnection(spec, fromTileId, toTileId));
}

export function isCaseBoardComplete(spec: CaseBoardSpec, state: CaseBoardState): boolean {
  return spec.boardSlots.every((slot) => state.placedTilesBySlotId[slot.id] !== undefined);
}

export function isCaseBoardSolved(spec: CaseBoardSpec, state: CaseBoardState): boolean {
  if (!isCaseBoardComplete(spec, state)) {
    return false;
  }

  const path = spec.boardSlots.map((slot) => state.placedTilesBySlotId[slot.id]);
  return path.length === spec.requiredPath.length && path.every((tileId, index) => tileId === spec.requiredPath[index]);
}

export function checkCaseBoardAnswer(spec: CaseBoardSpec, state: CaseBoardState): CaseBoardCheckResult {
  const activeState = withActiveConnections(spec, state);

  if (!isCaseBoardComplete(spec, activeState)) {
    const nextState = {
      ...activeState,
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

  if (!isCaseBoardSolved(spec, activeState)) {
    const nextState = {
      ...activeState,
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

  const nextState = {
    ...activeState,
    solved: true,
    feedback: spec.successText
  };

  return {
    state: nextState,
    solved: true,
    feedback: spec.successText,
    reason: "correct"
  };
}

function withActiveConnections(spec: CaseBoardSpec, state: CaseBoardState): CaseBoardState {
  const nextState = cloneState(state);
  nextState.activeConnections = getActiveConnections(spec, nextState);
  return nextState;
}

function getSlot(spec: CaseBoardSpec, slotId: string): BoardSlot | undefined {
  return spec.boardSlots.find((slot) => slot.id === slotId);
}

function getTile(spec: CaseBoardSpec, tileId: string): CaseTile | undefined {
  return spec.availableTiles.find((tile) => tile.id === tileId);
}

function slotAcceptsTile(slot: BoardSlot, tile: CaseTile): boolean {
  return slot.acceptsTileTypes.includes(tile.tileType);
}

function isValidConnection(spec: CaseBoardSpec, fromTileId: string, toTileId: string): boolean {
  return spec.validConnections.some(
    (connection) => connection.fromTileId === fromTileId && connection.toTileId === toTileId
  );
}

function isTileLockedInPlace(spec: CaseBoardSpec, state: CaseBoardState, tileId: string): boolean {
  return spec.boardSlots.some((slot) => slot.lockedTileId === tileId && state.placedTilesBySlotId[slot.id] === tileId);
}

function cloneState(state: CaseBoardState): CaseBoardState {
  return {
    placedTilesBySlotId: { ...state.placedTilesBySlotId },
    selectedTileId: state.selectedTileId,
    solved: state.solved,
    feedback: state.feedback,
    activeConnections: state.activeConnections.map((connection) => ({ ...connection }))
  };
}
