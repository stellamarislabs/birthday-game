import type {
  RebuildPiece,
  RebuildPuzzleCheckResult,
  RebuildPuzzleProgress,
  RebuildPuzzleSpec,
  RebuildPuzzleState,
  RebuildRotation,
  RebuildSlotAddress
} from "./rebuildPuzzleTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialRebuildPuzzleState(spec: RebuildPuzzleSpec): RebuildPuzzleState {
  const pieceRotations: Record<string, RebuildRotation> = {};

  for (const piece of spec.pieces) {
    pieceRotations[piece.id] = spec.initialRotations[piece.id] ?? 0;
  }

  return {
    selectedPieceId: null,
    trayPieceIds: spec.initialTrayOrder.filter((pieceId) => pieceExists(spec, pieceId)),
    placedPiecesBySlot: {},
    pieceRotations,
    keySelected: false,
    keyTurned: false,
    activatedMarkIds: [],
    waveMarkRevealed: false,
    solved: false,
    feedback: ""
  };
}

export function selectKey(state: RebuildPuzzleState): RebuildPuzzleState {
  if (state.keyTurned) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    keySelected: true,
    feedback: ""
  };
}

export function useKeyOnWall(spec: RebuildPuzzleSpec, state: RebuildPuzzleState): RebuildPuzzleState {
  if (!state.keySelected && !state.keyTurned) {
    return {
      ...cloneState(state),
      feedback: spec.incompleteText
    };
  }

  return {
    ...cloneState(state),
    keySelected: false,
    keyTurned: true,
    feedback: "The key turns in the hidden wall."
  };
}

export function activateWallMark(spec: RebuildPuzzleSpec, state: RebuildPuzzleState, markId: string): RebuildPuzzleState {
  if (!state.keyTurned || !spec.wallMarks.some((mark) => mark.id === markId)) {
    return {
      ...cloneState(state),
      feedback: spec.incompleteText
    };
  }

  const activatedMarkIds = state.activatedMarkIds.includes(markId)
    ? [...state.activatedMarkIds]
    : [...state.activatedMarkIds, markId];
  const waveMarkRevealed = activatedMarkIds.length >= spec.requiredMarkCount;
  const successFeedback = getPuzzleSuccessFeedback(spec);

  return {
    ...cloneState(state),
    activatedMarkIds,
    waveMarkRevealed,
    solved: waveMarkRevealed,
    feedback: waveMarkRevealed ? successFeedback : "The wall mark begins to glow."
  };
}

export function selectPiece(state: RebuildPuzzleState, pieceId: string): RebuildPuzzleState {
  if (!state.trayPieceIds.includes(pieceId) && !Object.values(state.placedPiecesBySlot).includes(pieceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedPieceId: pieceId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedPieceInSlot(
  spec: RebuildPuzzleSpec,
  state: RebuildPuzzleState,
  row: number,
  col: number
): RebuildPuzzleState {
  if (!state.selectedPieceId || !isValidSlot(spec, row, col)) {
    return cloneState(state);
  }

  const selectedPieceId = state.selectedPieceId;
  const targetSlotId = getRebuildSlotId(row, col);
  const sourceSlotId = findPieceSlotId(state, selectedPieceId);
  const targetPieceId = state.placedPiecesBySlot[targetSlotId];
  const placedPiecesBySlot = { ...state.placedPiecesBySlot };
  let trayPieceIds = state.trayPieceIds.filter((pieceId) => pieceId !== selectedPieceId);

  if (sourceSlotId) {
    delete placedPiecesBySlot[sourceSlotId];
  }

  if (targetPieceId && sourceSlotId) {
    placedPiecesBySlot[sourceSlotId] = targetPieceId;
  } else if (targetPieceId) {
    trayPieceIds = addPieceToTray(trayPieceIds, targetPieceId, spec);
  }

  placedPiecesBySlot[targetSlotId] = selectedPieceId;

  return {
    ...cloneState(state),
    selectedPieceId: null,
    trayPieceIds,
    placedPiecesBySlot,
    pieceRotations: { ...state.pieceRotations },
    solved: false,
    feedback: ""
  };
}

export function rotateSelectedPiece(spec: RebuildPuzzleSpec, state: RebuildPuzzleState): RebuildPuzzleState {
  if (!state.selectedPieceId) {
    return cloneState(state);
  }

  return rotatePiece(spec, state, state.selectedPieceId);
}

export function rotatePiece(spec: RebuildPuzzleSpec, state: RebuildPuzzleState, pieceId: string): RebuildPuzzleState {
  if (!pieceExists(spec, pieceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    pieceRotations: {
      ...state.pieceRotations,
      [pieceId]: nextRotation(state.pieceRotations[pieceId] ?? 0)
    },
    solved: false,
    feedback: ""
  };
}

export function removePieceFromSlot(
  spec: RebuildPuzzleSpec,
  state: RebuildPuzzleState,
  row: number,
  col: number
): RebuildPuzzleState {
  if (!isValidSlot(spec, row, col)) {
    return cloneState(state);
  }

  const slotId = getRebuildSlotId(row, col);
  const pieceId = state.placedPiecesBySlot[slotId];
  if (!pieceId) {
    return cloneState(state);
  }

  const placedPiecesBySlot = { ...state.placedPiecesBySlot };
  delete placedPiecesBySlot[slotId];

  return {
    ...cloneState(state),
    trayPieceIds: addPieceToTray(state.trayPieceIds, pieceId, spec),
    placedPiecesBySlot,
    solved: false,
    feedback: ""
  };
}

export function swapPieces(
  spec: RebuildPuzzleSpec,
  state: RebuildPuzzleState,
  source: RebuildSlotAddress,
  target: RebuildSlotAddress
): RebuildPuzzleState {
  if (!isValidSlot(spec, source.row, source.col) || !isValidSlot(spec, target.row, target.col)) {
    return cloneState(state);
  }

  const sourceSlotId = getRebuildSlotId(source.row, source.col);
  const targetSlotId = getRebuildSlotId(target.row, target.col);
  const sourcePieceId = state.placedPiecesBySlot[sourceSlotId];
  const targetPieceId = state.placedPiecesBySlot[targetSlotId];
  if (!sourcePieceId && !targetPieceId) {
    return cloneState(state);
  }

  const placedPiecesBySlot = { ...state.placedPiecesBySlot };
  if (targetPieceId) {
    placedPiecesBySlot[sourceSlotId] = targetPieceId;
  } else {
    delete placedPiecesBySlot[sourceSlotId];
  }

  if (sourcePieceId) {
    placedPiecesBySlot[targetSlotId] = sourcePieceId;
  } else {
    delete placedPiecesBySlot[targetSlotId];
  }

  return {
    ...cloneState(state),
    placedPiecesBySlot,
    solved: false,
    feedback: ""
  };
}

export function resetRebuildPuzzle(spec: RebuildPuzzleSpec): RebuildPuzzleState {
  return createInitialRebuildPuzzleState(spec);
}

export function isSlotCorrect(spec: RebuildPuzzleSpec, state: RebuildPuzzleState, row: number, col: number): boolean {
  const pieceId = state.placedPiecesBySlot[getRebuildSlotId(row, col)];
  const piece = pieceId ? getPiece(spec, pieceId) : undefined;

  return Boolean(
    piece &&
      piece.correctRow === row &&
      piece.correctCol === col &&
      (state.pieceRotations[piece.id] ?? 0) === piece.correctRotation
  );
}

export function isRebuildPuzzleComplete(_spec: RebuildPuzzleSpec, state: RebuildPuzzleState): boolean {
  return state.waveMarkRevealed;
}

export function isRebuildPuzzleSolved(spec: RebuildPuzzleSpec, state: RebuildPuzzleState): boolean {
  return isRebuildPuzzleComplete(spec, state) && state.keyTurned;
}

export function getRebuildPuzzleProgress(spec: RebuildPuzzleSpec, state: RebuildPuzzleState): RebuildPuzzleProgress {
  let correctCount = 0;

  for (let row = 0; row < spec.rows; row += 1) {
    for (let col = 0; col < spec.columns; col += 1) {
      if (isSlotCorrect(spec, state, row, col)) {
        correctCount += 1;
      }
    }
  }

  return {
    placedCount: Object.keys(state.placedPiecesBySlot).length,
    correctCount,
    totalCount: spec.rows * spec.columns,
    markCount: state.activatedMarkIds.length,
    requiredMarkCount: spec.requiredMarkCount,
    currentStep: state.waveMarkRevealed
      ? "wave-revealed"
      : state.keyTurned
        ? "unlocked"
        : state.keySelected
          ? "key-selected"
          : "locked"
  };
}

export function checkRebuildPuzzleAnswer(
  spec: RebuildPuzzleSpec,
  state: RebuildPuzzleState
): RebuildPuzzleCheckResult {
  if (!isRebuildPuzzleComplete(spec, state)) {
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

  if (!isRebuildPuzzleSolved(spec, state)) {
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

export function getRebuildSlotId(row: number, col: number): string {
  return `r${row}-c${col}`;
}

export function getPiece(spec: RebuildPuzzleSpec, pieceId: string): RebuildPiece | undefined {
  return spec.pieces.find((piece) => piece.id === pieceId);
}

function nextRotation(rotation: RebuildRotation): RebuildRotation {
  if (rotation === 0) {
    return 90;
  }

  if (rotation === 90) {
    return 180;
  }

  if (rotation === 180) {
    return 270;
  }

  return 0;
}

function findPieceSlotId(state: RebuildPuzzleState, pieceId: string): string | undefined {
  return Object.entries(state.placedPiecesBySlot).find(([, placedPieceId]) => placedPieceId === pieceId)?.[0];
}

function addPieceToTray(trayPieceIds: string[], pieceId: string, spec: RebuildPuzzleSpec): string[] {
  if (!pieceExists(spec, pieceId) || trayPieceIds.includes(pieceId)) {
    return [...trayPieceIds];
  }

  return [...trayPieceIds, pieceId];
}

function isValidSlot(spec: RebuildPuzzleSpec, row: number, col: number): boolean {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && col >= 0 && row < spec.rows && col < spec.columns;
}

function pieceExists(spec: RebuildPuzzleSpec, pieceId: string): boolean {
  return spec.pieces.some((piece) => piece.id === pieceId);
}

function cloneState(state: RebuildPuzzleState): RebuildPuzzleState {
  return {
    selectedPieceId: state.selectedPieceId,
    trayPieceIds: [...state.trayPieceIds],
    placedPiecesBySlot: { ...state.placedPiecesBySlot },
    pieceRotations: { ...state.pieceRotations },
    keySelected: state.keySelected,
    keyTurned: state.keyTurned,
    activatedMarkIds: [...state.activatedMarkIds],
    waveMarkRevealed: state.waveMarkRevealed,
    solved: state.solved,
    feedback: state.feedback
  };
}
