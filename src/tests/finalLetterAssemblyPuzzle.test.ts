import { describe, expect, it } from "vitest";
import {
  CORRECT_FINAL_LETTER_SEQUENCE,
  createFinalLetterAssemblyState,
  getOrderedFinalLetterCards,
  isFinalLetterAssemblyCorrect,
  moveFinalLetterCardDown,
  moveFinalLetterCardUp,
  resetFinalLetterAssemblyState,
  submitFinalLetterAssembly
} from "../game/puzzles/finalLetterAssembly/finalLetterAssemblyLogic";
import type { FinalLetterAssemblyState } from "../game/puzzles/finalLetterAssembly/finalLetterAssemblyTypes";

describe("final-letter-assembly puzzle", () => {
  it("starts with 10 cards", () => {
    const state = createFinalLetterAssemblyState();

    expect(state.cards).toHaveLength(10);
    expect(state.currentOrder).toHaveLength(10);
  });

  it("recognizes the correct final sequence", () => {
    const state: FinalLetterAssemblyState = {
      ...createFinalLetterAssemblyState(),
      currentOrder: [...CORRECT_FINAL_LETTER_SEQUENCE]
    };

    expect(isFinalLetterAssemblyCorrect(state)).toBe(true);
    expect(submitFinalLetterAssembly(state).result.solved).toBe(true);
  });

  it("does not solve a wrong sequence", () => {
    const submission = submitFinalLetterAssembly(createFinalLetterAssemblyState());

    expect(submission.result.solved).toBe(false);
    expect(submission.result.feedback).toBe("The words are close, but the verdict needs the full truth in order.");
  });

  it("moves a card up and down", () => {
    const state = createFinalLetterAssemblyState();
    const movedUp = moveFinalLetterCardUp(state, "attention");
    const movedDown = moveFinalLetterCardDown(movedUp, "attention");

    expect(movedUp.currentOrder.indexOf("attention")).toBe(0);
    expect(movedDown.currentOrder.indexOf("attention")).toBe(1);
  });

  it("does not move the first card up", () => {
    const state = createFinalLetterAssemblyState();

    expect(moveFinalLetterCardUp(state, state.currentOrder[0]).currentOrder).toEqual(state.currentOrder);
  });

  it("does not move the last card down", () => {
    const state = createFinalLetterAssemblyState();

    expect(moveFinalLetterCardDown(state, state.currentOrder[state.currentOrder.length - 1]).currentOrder).toEqual(state.currentOrder);
  });

  it("reset restores the initial order", () => {
    const moved = moveFinalLetterCardUp(createFinalLetterAssemblyState(), "attention");

    expect(resetFinalLetterAssemblyState().currentOrder).not.toEqual(moved.currentOrder);
    expect(resetFinalLetterAssemblyState().currentOrder).toEqual(createFinalLetterAssemblyState().currentOrder);
  });

  it("returns ordered card data for rendering", () => {
    const orderedCards = getOrderedFinalLetterCards(createFinalLetterAssemblyState());

    expect(orderedCards[0]?.title).toBe("Future");
    expect(orderedCards.map((card) => card.id)).toEqual(createFinalLetterAssemblyState().currentOrder);
  });
});
