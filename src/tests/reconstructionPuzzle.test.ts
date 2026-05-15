import { describe, expect, it } from "vitest";
import {
  CORRECT_RECONSTRUCTION_PLACEMENT,
  RECONSTRUCTION_PIECES,
  RECONSTRUCTION_SLOTS,
  createReconstructionState,
  isReconstructionCorrect,
  placePieceInSlot,
  placeSelectedPieceInSlot,
  resetReconstructionState,
  selectReconstructionPiece,
  submitReconstruction
} from "../game/puzzles/reconstruction/reconstructionLogic";
import type { ReconstructionState } from "../game/puzzles/reconstruction/reconstructionTypes";

describe("reconstruction puzzle logic", () => {
  it("starts with six pieces", () => {
    expect(RECONSTRUCTION_PIECES).toHaveLength(6);
    expect(createReconstructionState().pieces).toHaveLength(6);
  });

  it("has six slots", () => {
    expect(RECONSTRUCTION_SLOTS).toHaveLength(6);
    expect(createReconstructionState().slots).toHaveLength(6);
  });

  it("recognizes the correct arrangement", () => {
    const state = {
      ...createReconstructionState(),
      placement: { ...CORRECT_RECONSTRUCTION_PLACEMENT }
    };

    expect(isReconstructionCorrect(state)).toBe(true);
    expect(submitReconstruction(state).result).toEqual({
      solved: true,
      feedback: "Street restored."
    });
  });

  it("does not solve a wrong arrangement", () => {
    const submission = submitReconstruction(createReconstructionState());

    expect(submission.result.solved).toBe(false);
    expect(submission.result.feedback).toBe("The pieces are close, but the structure needs a steadier foundation.");
  });

  it("selecting a piece works", () => {
    const state = selectReconstructionPiece(createReconstructionState(), "roof");

    expect(state.selectedPieceId).toBe("roof");
  });

  it("placing a selected piece into an empty slot works", () => {
    const state: ReconstructionState = {
      ...createReconstructionState(),
      placement: {
        ...createReconstructionState().placement,
        "top-left": null
      },
      selectedPieceId: "roof"
    };

    const nextState = placeSelectedPieceInSlot(state, "top-left");

    expect(nextState.placement["top-left"]).toBe("roof");
    expect(nextState.selectedPieceId).toBeNull();
  });

  it("placing a piece into an occupied slot swaps safely", () => {
    const nextState = placePieceInSlot(createReconstructionState(), "roof", "top-left");

    expect(nextState.placement["top-left"]).toBe("roof");
    expect(nextState.placement["top-middle"]).toBe("window");
  });

  it("reset restores the initial shuffled arrangement", () => {
    const changedState = placePieceInSlot(createReconstructionState(), "roof", "top-left");
    const resetState = resetReconstructionState();

    expect(changedState.placement).not.toEqual(resetState.placement);
    expect(resetState.placement).toEqual(createReconstructionState().placement);
  });

  it("solved state is detected only when correct", () => {
    const wrong = submitReconstruction(createReconstructionState());
    const correct = submitReconstruction({
      ...createReconstructionState(),
      placement: { ...CORRECT_RECONSTRUCTION_PLACEMENT }
    });

    expect(wrong.state.solved).toBe(false);
    expect(correct.state.solved).toBe(true);
  });
});
