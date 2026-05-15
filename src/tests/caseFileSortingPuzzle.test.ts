import { describe, expect, it } from "vitest";
import { LEVEL_FIVE_CASE_FILE_SORTING_SPEC } from "../game/puzzles/caseFileSorting/caseFileSortingContent";
import {
  CASE_FILE_SORTING_FINAL_ASSET_FILENAMES,
  getCaseFileSortingFinalAsset
} from "../game/puzzles/caseFileSorting/caseFileSortingFinalAssets";
import {
  checkCaseFileSortingAnswer,
  createInitialCaseFileSortingState,
  getCaseFileSlotPlacementStatus,
  getCaseFileSortingProgress,
  getTrayDocumentIds,
  isCaseFileSortingSolved,
  placeSelectedDocumentInSlot,
  resetCaseFileSorting,
  selectDocument,
  swapDocuments,
  takeCaseFileSilverKey
} from "../game/puzzles/caseFileSorting/caseFileSortingLogic";

const spec = LEVEL_FIVE_CASE_FILE_SORTING_SPEC;

function place(documentId: string, slotId: string, state = createInitialCaseFileSortingState(spec)) {
  return placeSelectedDocumentInSlot(spec, selectDocument(state, documentId), slotId);
}

describe("case-file-sorting puzzle logic", () => {
  it("starts unsolved with all documents in the tray", () => {
    const state = createInitialCaseFileSortingState(spec);

    expect(isCaseFileSortingSolved(spec, state)).toBe(false);
    expect(getCaseFileSortingProgress(spec, state)).toMatchObject({
      placedCount: 0,
      correctCount: 0,
      totalCount: 5,
      complete: false,
      correctionVisible: false,
      keyAvailable: false,
      keyTaken: false
    });
    expect(getTrayDocumentIds(spec, state)).toEqual(spec.documents.map((document) => document.id));
  });

  it("places documents without duplicating them", () => {
    let state = createInitialCaseFileSortingState(spec);
    state = place("route-reference", "file-1", state);
    state = place("route-reference", "file-2", state);

    expect(state.placedDocuments["file-1"]).toBeNull();
    expect(state.placedDocuments["file-2"]).toBe("route-reference");
    expect(getTrayDocumentIds(spec, state)).not.toContain("route-reference");
  });

  it("keeps wrong or incomplete files unsolved", () => {
    let state = createInitialCaseFileSortingState(spec);
    state = place("witness-note", "file-1", state);
    state = place("route-reference", "file-2", state);

    expect(checkCaseFileSortingAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "incomplete"
    });

    state = place("original-charge", "file-3", state);
    state = place("margin-correction", "file-4", state);
    state = place("key-receipt", "file-5", state);
    expect(checkCaseFileSortingAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "wrong"
    });
  });

  it("reveals No. Given. after correct ordering, then requires the silver key", () => {
    let state = createInitialCaseFileSortingState(spec);
    for (const [documentId, slotId] of [
      ["route-reference", "file-1"],
      ["witness-note", "file-2"],
      ["original-charge", "file-3"],
      ["margin-correction", "file-4"],
      ["key-receipt", "file-5"]
    ] as const) {
      state = place(documentId, slotId, state);
    }

    expect(getCaseFileSortingProgress(spec, state)).toMatchObject({
      correctionVisible: true,
      keyAvailable: true,
      keyTaken: false
    });
    expect(checkCaseFileSortingAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "needs-key"
    });

    state = takeCaseFileSilverKey(spec, state);
    expect(isCaseFileSortingSolved(spec, state)).toBe(true);
    expect(checkCaseFileSortingAnswer(spec, state)).toMatchObject({
      solved: true,
      reason: "correct",
      feedback: "The file is in order.\nThe margin reads: No. Given. A silver key slips from the file spine."
    });
  });

  it("can swap documents and reset the file", () => {
    let state = createInitialCaseFileSortingState(spec);
    state = place("route-reference", "file-1", state);
    state = place("witness-note", "file-2", state);
    state = swapDocuments(spec, state, "file-1", "file-2");

    expect(state.placedDocuments["file-1"]).toBe("witness-note");
    expect(state.placedDocuments["file-2"]).toBe("route-reference");

    expect(resetCaseFileSorting(spec)).toEqual(createInitialCaseFileSortingState(spec));
  });

  it("reports placement status for correct and incorrect document feedback", () => {
    let state = createInitialCaseFileSortingState(spec);

    expect(getCaseFileSlotPlacementStatus(spec, state, "file-1")).toBe("empty");

    state = place("witness-note", "file-1", state);
    expect(getCaseFileSlotPlacementStatus(spec, state, "file-1")).toBe("incorrect");

    state = place("route-reference", "file-1", state);
    expect(getCaseFileSlotPlacementStatus(spec, state, "file-1")).toBe("correct");

    const reset = resetCaseFileSorting(spec);
    expect(getCaseFileSlotPlacementStatus(spec, reset, "file-1")).toBe("empty");
  });

  it("maps optional final art assets without changing document or key mechanics", () => {
    expect(CASE_FILE_SORTING_FINAL_ASSET_FILENAMES).toEqual({
      background: "puzzle04-case-file-bg.webp",
      archiveFileBoard: "puzzle04-archive-file-board.webp",
      documentCardShell: "puzzle04-document-card-shell.webp",
      silverKey: "puzzle04-silver-key.webp"
    });

    for (const key of ["background", "archiveFileBoard", "documentCardShell", "silverKey"] as const) {
      const asset = getCaseFileSortingFinalAsset(key);

      expect(asset.filename).toBe(CASE_FILE_SORTING_FINAL_ASSET_FILENAMES[key]);
      if (asset.imageUrl) {
        expect(asset.imageUrl).toContain(CASE_FILE_SORTING_FINAL_ASSET_FILENAMES[key]);
      }
    }

    expect(spec.documents.map((document) => [document.id, document.symbol])).toEqual([
      ["route-reference", "I"],
      ["witness-note", "II"],
      ["original-charge", "III"],
      ["margin-correction", "IV"],
      ["key-receipt", "V"]
    ]);
    expect(spec.correctOrder).toEqual([
      "route-reference",
      "witness-note",
      "original-charge",
      "margin-correction",
      "key-receipt"
    ]);
    expect(takeCaseFileSilverKey(spec, createInitialCaseFileSortingState(spec)).keyTaken).toBe(false);
  });
});
