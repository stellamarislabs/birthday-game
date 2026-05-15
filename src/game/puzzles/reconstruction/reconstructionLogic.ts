import type {
  ReconstructionPiece,
  ReconstructionPieceId,
  ReconstructionPlacement,
  ReconstructionResult,
  ReconstructionSlot,
  ReconstructionSlotId,
  ReconstructionState
} from "./reconstructionTypes";

export const RECONSTRUCTION_PIECES: readonly ReconstructionPiece[] = [
  { id: "roof", label: "Roof" },
  { id: "window", label: "Window" },
  { id: "lantern", label: "Lantern" },
  { id: "door", label: "Door" },
  { id: "brick-path", label: "Brick Path" },
  { id: "case-seal", label: "Case Seal" }
] as const;

export const RECONSTRUCTION_SLOTS: readonly ReconstructionSlot[] = [
  { id: "top-left", label: "Top left" },
  { id: "top-middle", label: "Top middle" },
  { id: "top-right", label: "Top right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-middle", label: "Bottom middle" },
  { id: "bottom-right", label: "Bottom right" }
] as const;

export const CORRECT_RECONSTRUCTION_PLACEMENT: ReconstructionPlacement = {
  "top-left": "roof",
  "top-middle": "window",
  "top-right": "lantern",
  "bottom-left": "door",
  "bottom-middle": "brick-path",
  "bottom-right": "case-seal"
};

const INITIAL_RECONSTRUCTION_PLACEMENT: ReconstructionPlacement = {
  "top-left": "window",
  "top-middle": "roof",
  "top-right": "case-seal",
  "bottom-left": "brick-path",
  "bottom-middle": "door",
  "bottom-right": "lantern"
};

export const RECONSTRUCTION_COPY = {
  title: "Case Review: The Red Brick",
  instruction: "Rebuild the street facade by placing each piece where it belongs.",
  submit: "Submit Reconstruction",
  reset: "Reset Pieces",
  wrong: "The pieces are close, but the structure needs a steadier foundation.",
  success: "Street restored.",
  reveal: "Strong things are built patiently, piece by piece.",
  followUp: "Some truths are not discovered all at once. They are assembled with care."
} as const;

export function createReconstructionState(): ReconstructionState {
  return {
    pieces: RECONSTRUCTION_PIECES.map((piece) => ({ ...piece })),
    slots: RECONSTRUCTION_SLOTS.map((slot) => ({ ...slot })),
    placement: { ...INITIAL_RECONSTRUCTION_PLACEMENT },
    selectedPieceId: null,
    solved: false,
    attempts: 0
  };
}

export function selectReconstructionPiece(
  state: ReconstructionState,
  pieceId: ReconstructionPieceId | null
): ReconstructionState {
  if (pieceId && !state.pieces.some((piece) => piece.id === pieceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedPieceId: pieceId,
    solved: false
  };
}

export function placeSelectedPieceInSlot(state: ReconstructionState, slotId: ReconstructionSlotId): ReconstructionState {
  if (!state.selectedPieceId || !state.slots.some((slot) => slot.id === slotId)) {
    return cloneState(state);
  }

  return placePieceInSlot(state, state.selectedPieceId, slotId);
}

export function placePieceInSlot(
  state: ReconstructionState,
  pieceId: ReconstructionPieceId,
  slotId: ReconstructionSlotId
): ReconstructionState {
  if (!state.pieces.some((piece) => piece.id === pieceId) || !state.slots.some((slot) => slot.id === slotId)) {
    return cloneState(state);
  }

  const placement = { ...state.placement };
  const currentSlotId = findSlotForPiece(placement, pieceId);
  const displacedPieceId = placement[slotId];

  if (currentSlotId === slotId) {
    return {
      ...cloneState(state),
      selectedPieceId: null,
      solved: false
    };
  }

  placement[slotId] = pieceId;

  if (currentSlotId) {
    placement[currentSlotId] = displacedPieceId ?? null;
  }

  return {
    ...cloneState(state),
    placement,
    selectedPieceId: null,
    solved: false
  };
}

export function resetReconstructionState(): ReconstructionState {
  return createReconstructionState();
}

export function isReconstructionCorrect(state: Pick<ReconstructionState, "placement">): boolean {
  return RECONSTRUCTION_SLOTS.every((slot) => state.placement[slot.id] === CORRECT_RECONSTRUCTION_PLACEMENT[slot.id]);
}

export function submitReconstruction(state: ReconstructionState): {
  state: ReconstructionState;
  result: ReconstructionResult;
} {
  const solved = isReconstructionCorrect(state);
  const nextState = {
    ...cloneState(state),
    selectedPieceId: null,
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? RECONSTRUCTION_COPY.success : RECONSTRUCTION_COPY.wrong
    }
  };
}

export function getPieceInSlot(state: ReconstructionState, slotId: ReconstructionSlotId): ReconstructionPiece | null {
  const pieceId = state.placement[slotId];
  if (!pieceId) {
    return null;
  }

  return state.pieces.find((piece) => piece.id === pieceId) ?? null;
}

function findSlotForPiece(
  placement: ReconstructionPlacement,
  pieceId: ReconstructionPieceId
): ReconstructionSlotId | null {
  for (const slot of RECONSTRUCTION_SLOTS) {
    if (placement[slot.id] === pieceId) {
      return slot.id;
    }
  }

  return null;
}

function cloneState(state: ReconstructionState): ReconstructionState {
  return {
    pieces: state.pieces.map((piece) => ({ ...piece })),
    slots: state.slots.map((slot) => ({ ...slot })),
    placement: { ...state.placement },
    selectedPieceId: state.selectedPieceId,
    solved: state.solved,
    attempts: state.attempts
  };
}
