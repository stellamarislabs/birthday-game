import { describe, expect, it } from "vitest";
import {
  CORRECT_DOCUMENT_ORDER,
  createDocumentOrderingState,
  getOrderedDocumentCards,
  isDocumentOrderingCorrect,
  moveDocumentCardDown,
  moveDocumentCardUp,
  resetDocumentOrderingState,
  submitDocumentOrdering
} from "../game/puzzles/documentOrdering/documentOrderingLogic";
import type { DocumentOrderingCardId } from "../game/puzzles/documentOrdering/documentOrderingTypes";

describe("document-ordering puzzle logic", () => {
  it("starts with four cards", () => {
    const state = createDocumentOrderingState();

    expect(state.cards).toHaveLength(4);
    expect(getOrderedDocumentCards(state).map((card) => card.id)).toEqual([
      "evidence",
      "facts",
      "conclusion",
      "argument"
    ]);
  });

  it("defines the correct order as Facts, Evidence, Argument, Conclusion", () => {
    expect(CORRECT_DOCUMENT_ORDER).toEqual(["facts", "evidence", "argument", "conclusion"]);
  });

  it("does not solve a wrong order", () => {
    const state = createDocumentOrderingState();
    const result = submitDocumentOrdering(state);

    expect(result.result.solved).toBe(false);
    expect(result.state.solved).toBe(false);
  });

  it("moves a card up", () => {
    const state = moveDocumentCardUp(createDocumentOrderingState(), "facts");

    expect(state.currentOrder).toEqual(["facts", "evidence", "conclusion", "argument"]);
  });

  it("moves a card down", () => {
    const state = moveDocumentCardDown(createDocumentOrderingState(), "evidence");

    expect(state.currentOrder).toEqual(["facts", "evidence", "conclusion", "argument"]);
  });

  it("does not move the first card up", () => {
    const initial = createDocumentOrderingState();
    const state = moveDocumentCardUp(initial, "evidence");

    expect(state.currentOrder).toEqual(initial.currentOrder);
  });

  it("does not move the last card down", () => {
    const initial = createDocumentOrderingState();
    const state = moveDocumentCardDown(initial, "argument");

    expect(state.currentOrder).toEqual(initial.currentOrder);
  });

  it("reset restores the initial order", () => {
    const moved = moveDocumentCardUp(createDocumentOrderingState(), "facts");
    const reset = resetDocumentOrderingState();

    expect(moved.currentOrder).not.toEqual(reset.currentOrder);
    expect(reset.currentOrder).toEqual(["evidence", "facts", "conclusion", "argument"]);
  });

  it("detects solved state only when correct", () => {
    const wrong = createDocumentOrderingState();
    const correct = {
      ...wrong,
      currentOrder: ["facts", "evidence", "argument", "conclusion"] satisfies DocumentOrderingCardId[]
    };

    expect(isDocumentOrderingCorrect(wrong)).toBe(false);
    expect(isDocumentOrderingCorrect(correct)).toBe(true);
    expect(submitDocumentOrdering(correct).state.solved).toBe(true);
  });
});
