import type {
  CaseMosaicCheckResult,
  CaseMosaicProgress,
  CaseMosaicSpec,
  CaseMosaicState,
  MosaicPiece,
  MosaicSlotAddress
} from "./caseMosaicTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialCaseMosaicState(spec: CaseMosaicSpec): CaseMosaicState {
  return {
    selectedPieceId: null,
    trayPieceIds: spec.initialTrayOrder.filter((pieceId) => pieceExists(spec, pieceId)),
    placedPiecesBySlot: {},
    envelopeOpened: false,
    contentsRevealed: false,
    ticketInspected: false,
    routeGlowing: false,
    solved: false,
    feedback: ""
  };
}

export function openEnvelope(spec: CaseMosaicSpec, state: CaseMosaicState): CaseMosaicState {
  if (state.envelopeOpened) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    envelopeOpened: true,
    contentsRevealed: true,
    ticketInspected: false,
    routeGlowing: false,
    solved: false,
    feedback: spec.successFollowUp ?? ""
  };
}

export function inspectTicket(spec: CaseMosaicSpec, state: CaseMosaicState): CaseMosaicState {
  if (!state.envelopeOpened || !state.contentsRevealed) {
    return {
      ...cloneState(state),
      feedback: spec.incompleteText
    };
  }

  const successFeedback = getPuzzleSuccessFeedback(spec);
  return {
    ...cloneState(state),
    ticketInspected: true,
    routeGlowing: true,
    solved: true,
    feedback: successFeedback
  };
}

export function selectPiece(state: CaseMosaicState, pieceId: string): CaseMosaicState {
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
  spec: CaseMosaicSpec,
  state: CaseMosaicState,
  row: number,
  col: number
): CaseMosaicState {
  if (!state.selectedPieceId || !isValidSlot(spec, row, col)) {
    return cloneState(state);
  }

  const selectedPieceId = state.selectedPieceId;
  const targetSlotId = getMosaicSlotId(row, col);
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
    solved: false,
    feedback: ""
  };
}

export function removePieceFromSlot(
  spec: CaseMosaicSpec,
  state: CaseMosaicState,
  row: number,
  col: number
): CaseMosaicState {
  if (!isValidSlot(spec, row, col)) {
    return cloneState(state);
  }

  const slotId = getMosaicSlotId(row, col);
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
  spec: CaseMosaicSpec,
  state: CaseMosaicState,
  source: MosaicSlotAddress,
  target: MosaicSlotAddress
): CaseMosaicState {
  if (!isValidSlot(spec, source.row, source.col) || !isValidSlot(spec, target.row, target.col)) {
    return cloneState(state);
  }

  const sourceSlotId = getMosaicSlotId(source.row, source.col);
  const targetSlotId = getMosaicSlotId(target.row, target.col);
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

export function resetCaseMosaic(spec: CaseMosaicSpec): CaseMosaicState {
  return createInitialCaseMosaicState(spec);
}

export function isSlotCorrect(spec: CaseMosaicSpec, state: CaseMosaicState, row: number, col: number): boolean {
  const pieceId = state.placedPiecesBySlot[getMosaicSlotId(row, col)];
  const piece = pieceId ? getPiece(spec, pieceId) : undefined;

  return Boolean(piece && piece.correctRow === row && piece.correctCol === col);
}

export function isCaseMosaicComplete(spec: CaseMosaicSpec, state: CaseMosaicState): boolean {
  return Object.keys(state.placedPiecesBySlot).length === spec.rows * spec.columns;
}

export function isCaseMosaicSolved(spec: CaseMosaicSpec, state: CaseMosaicState): boolean {
  if (!isCaseMosaicComplete(spec, state)) {
    return false;
  }

  for (let row = 0; row < spec.rows; row += 1) {
    for (let col = 0; col < spec.columns; col += 1) {
      if (!isSlotCorrect(spec, state, row, col)) {
        return false;
      }
    }
  }

  return true;
}

export function getCaseMosaicProgress(spec: CaseMosaicSpec, state: CaseMosaicState): CaseMosaicProgress {
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
    stepCount: correctCount,
    totalSteps: spec.rows * spec.columns,
    currentStep: correctCount === spec.rows * spec.columns ? "route-glowing" : Object.keys(state.placedPiecesBySlot).length > 0 ? "opened" : "sealed"
  };
}

export function checkCaseMosaicAnswer(spec: CaseMosaicSpec, state: CaseMosaicState): CaseMosaicCheckResult {
  if (!isCaseMosaicComplete(spec, state)) {
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

  if (!isCaseMosaicSolved(spec, state)) {
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

export function getMosaicSlotId(row: number, col: number): string {
  return `r${row}-c${col}`;
}

export function getPiece(spec: CaseMosaicSpec, pieceId: string): MosaicPiece | undefined {
  return spec.pieces.find((piece) => piece.id === pieceId);
}

function findPieceSlotId(state: CaseMosaicState, pieceId: string): string | undefined {
  return Object.entries(state.placedPiecesBySlot).find(([, placedPieceId]) => placedPieceId === pieceId)?.[0];
}

function addPieceToTray(trayPieceIds: string[], pieceId: string, spec: CaseMosaicSpec): string[] {
  if (!pieceExists(spec, pieceId) || trayPieceIds.includes(pieceId)) {
    return [...trayPieceIds];
  }

  return [...trayPieceIds, pieceId];
}

function isValidSlot(spec: CaseMosaicSpec, row: number, col: number): boolean {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && col >= 0 && row < spec.rows && col < spec.columns;
}

function pieceExists(spec: CaseMosaicSpec, pieceId: string): boolean {
  return spec.pieces.some((piece) => piece.id === pieceId);
}

function cloneState(state: CaseMosaicState): CaseMosaicState {
  return {
    selectedPieceId: state.selectedPieceId,
    trayPieceIds: [...state.trayPieceIds],
    placedPiecesBySlot: { ...state.placedPiecesBySlot },
    envelopeOpened: state.envelopeOpened,
    contentsRevealed: state.contentsRevealed,
    ticketInspected: state.ticketInspected,
    routeGlowing: state.routeGlowing,
    solved: state.solved,
    feedback: state.feedback
  };
}
