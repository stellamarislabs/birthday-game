import type {
  CaseFileSortingCheckResult,
  CaseFileSlotPlacementStatus,
  CaseFileSortingProgress,
  CaseFileSortingSpec,
  CaseFileSortingState
} from "./caseFileSortingTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

export function createInitialCaseFileSortingState(spec: CaseFileSortingSpec): CaseFileSortingState {
  return {
    selectedDocumentId: null,
    placedDocuments: Object.fromEntries(spec.slots.map((slot) => [slot.id, null])),
    keyTaken: false,
    solved: false,
    feedback: ""
  };
}

export function selectDocument(state: CaseFileSortingState, documentId: string): CaseFileSortingState {
  return {
    ...cloneState(state),
    selectedDocumentId: documentId,
    solved: false,
    feedback: ""
  };
}

export function placeSelectedDocumentInSlot(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState,
  slotId: string
): CaseFileSortingState {
  if (!state.selectedDocumentId || !isValidDocument(spec, state.selectedDocumentId) || !isValidSlot(spec, slotId)) {
    return cloneState(state);
  }

  return placeDocumentInSlot(spec, state, state.selectedDocumentId, slotId);
}

export function swapDocuments(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState,
  sourceSlotId: string,
  targetSlotId: string
): CaseFileSortingState {
  if (!isValidSlot(spec, sourceSlotId) || !isValidSlot(spec, targetSlotId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  const sourceDocument = nextState.placedDocuments[sourceSlotId] ?? null;
  nextState.placedDocuments[sourceSlotId] = nextState.placedDocuments[targetSlotId] ?? null;
  nextState.placedDocuments[targetSlotId] = sourceDocument;
  nextState.selectedDocumentId = null;
  nextState.keyTaken = false;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

export function removeDocumentFromSlot(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState,
  slotId: string
): CaseFileSortingState {
  if (!isValidSlot(spec, slotId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  nextState.placedDocuments[slotId] = null;
  nextState.selectedDocumentId = null;
  nextState.keyTaken = false;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

export function resetCaseFileSorting(spec: CaseFileSortingSpec): CaseFileSortingState {
  return createInitialCaseFileSortingState(spec);
}

export function isCaseFileSortingComplete(spec: CaseFileSortingSpec, state: CaseFileSortingState): boolean {
  return spec.slots.every((slot) => Boolean(state.placedDocuments[slot.id]));
}

export function isCaseFileSortingOrderCorrect(spec: CaseFileSortingSpec, state: CaseFileSortingState): boolean {
  return spec.slots.every((slot, index) => state.placedDocuments[slot.id] === spec.correctOrder[index]);
}

export function isCaseFileSortingSolved(spec: CaseFileSortingSpec, state: CaseFileSortingState): boolean {
  return isCaseFileSortingOrderCorrect(spec, state) && state.keyTaken;
}

export function takeCaseFileSilverKey(spec: CaseFileSortingSpec, state: CaseFileSortingState): CaseFileSortingState {
  if (!isCaseFileSortingOrderCorrect(spec, state)) {
    return {
      ...cloneState(state),
      keyTaken: false,
      solved: false,
      feedback: spec.incompleteText
    };
  }

  return {
    ...cloneState(state),
    selectedDocumentId: null,
    keyTaken: true,
    solved: true,
    feedback: getPuzzleSuccessFeedback(spec)
  };
}

export function getCaseFileSortingProgress(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState
): CaseFileSortingProgress {
  const correctCount = spec.slots.filter((slot, index) => state.placedDocuments[slot.id] === spec.correctOrder[index]).length;
  const orderCorrect = correctCount === spec.slots.length;

  return {
    placedCount: spec.slots.filter((slot) => Boolean(state.placedDocuments[slot.id])).length,
    correctCount,
    totalCount: spec.slots.length,
    complete: isCaseFileSortingComplete(spec, state),
    correctionVisible: orderCorrect,
    keyAvailable: orderCorrect,
    keyTaken: state.keyTaken
  };
}

export function checkCaseFileSortingAnswer(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState
): CaseFileSortingCheckResult {
  if (!isCaseFileSortingComplete(spec, state)) {
    const nextState = { ...cloneState(state), solved: false, feedback: spec.incompleteText };
    return { state: nextState, solved: false, feedback: spec.incompleteText, reason: "incomplete" };
  }

  if (!isCaseFileSortingOrderCorrect(spec, state)) {
    const nextState = { ...cloneState(state), solved: false, feedback: spec.wrongText };
    return { state: nextState, solved: false, feedback: spec.wrongText, reason: "wrong" };
  }

  if (!state.keyTaken) {
    const feedback = "The margin is aligned. Take the silver key.";
    const nextState = { ...cloneState(state), solved: false, feedback };
    return { state: nextState, solved: false, feedback, reason: "needs-key" };
  }

  const feedback = getPuzzleSuccessFeedback(spec);
  const nextState = { ...cloneState(state), solved: true, feedback };
  return { state: nextState, solved: true, feedback, reason: "correct" };
}

export function getDocumentInSlot(state: CaseFileSortingState, slotId: string): string | null {
  return state.placedDocuments[slotId] ?? null;
}

export function getCaseFileSlotPlacementStatus(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState,
  slotId: string
): CaseFileSlotPlacementStatus {
  const slotIndex = spec.slots.findIndex((slot) => slot.id === slotId);
  const documentId = getDocumentInSlot(state, slotId);

  if (slotIndex < 0 || !documentId) {
    return "empty";
  }

  return documentId === spec.correctOrder[slotIndex] ? "correct" : "incorrect";
}

export function getTrayDocumentIds(spec: CaseFileSortingSpec, state: CaseFileSortingState): string[] {
  const placed = new Set(Object.values(state.placedDocuments).filter(Boolean));
  return spec.documents.map((document) => document.id).filter((documentId) => !placed.has(documentId));
}

export function placeDocumentInSlot(
  spec: CaseFileSortingSpec,
  state: CaseFileSortingState,
  documentId: string,
  slotId: string
): CaseFileSortingState {
  if (!isValidDocument(spec, documentId) || !isValidSlot(spec, slotId)) {
    return cloneState(state);
  }

  const nextState = cloneState(state);
  for (const [candidateSlotId, placedDocumentId] of Object.entries(nextState.placedDocuments)) {
    if (placedDocumentId === documentId) {
      nextState.placedDocuments[candidateSlotId] = null;
    }
  }

  nextState.placedDocuments[slotId] = documentId;
  nextState.selectedDocumentId = null;
  nextState.keyTaken = false;
  nextState.solved = false;
  nextState.feedback = "";
  return nextState;
}

function isValidSlot(spec: CaseFileSortingSpec, slotId: string): boolean {
  return spec.slots.some((slot) => slot.id === slotId);
}

function isValidDocument(spec: CaseFileSortingSpec, documentId: string): boolean {
  return spec.documents.some((document) => document.id === documentId);
}

function cloneState(state: CaseFileSortingState): CaseFileSortingState {
  return {
    selectedDocumentId: state.selectedDocumentId,
    placedDocuments: { ...state.placedDocuments },
    keyTaken: state.keyTaken,
    solved: state.solved,
    feedback: state.feedback
  };
}
