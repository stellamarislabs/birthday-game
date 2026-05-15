import { describe, expect, it } from "vitest";
import { LEVEL_ONE_CASE_BOARD_SPEC, getCaseBoardSpec } from "../game/puzzles/caseBoard/caseBoardContent";
import {
  checkCaseBoardAnswer,
  createInitialCaseBoardState,
  getActiveConnections,
  isCaseBoardSolved,
  placeSelectedTileInSlot,
  removeTileFromSlot,
  resetCaseBoard,
  selectTile
} from "../game/puzzles/caseBoard/caseBoardLogic";

describe("Case Board puzzle logic", () => {
  it("initial state includes locked Case Start and Truth slots", () => {
    const state = createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC);

    expect(state.placedTilesBySlotId["case-start"]).toBe("case-start");
    expect(state.placedTilesBySlotId.truth).toBe("truth");
  });

  it("initial state has no placed evidence or meaning tiles", () => {
    const state = createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC);

    expect(state.placedTilesBySlotId.evidence).toBeUndefined();
    expect(state.placedTilesBySlotId.meaning).toBeUndefined();
  });

  it("selecting a tile stores selectedTileId", () => {
    const state = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "sealed-envelope");

    expect(state.selectedTileId).toBe("sealed-envelope");
  });

  it("placing selected evidence tile into Evidence slot works", () => {
    const selected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "sealed-envelope");
    const placed = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selected, "evidence");

    expect(placed.placedTilesBySlotId.evidence).toBe("sealed-envelope");
    expect(placed.selectedTileId).toBeNull();
  });

  it("placing selected meaning tile into Meaning slot works", () => {
    const selected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "attention");
    const placed = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selected, "meaning");

    expect(placed.placedTilesBySlotId.meaning).toBe("attention");
  });

  it("slot rejects wrong tile type", () => {
    const selected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "attention");
    const placed = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selected, "evidence");

    expect(placed.placedTilesBySlotId.evidence).toBeUndefined();
    expect(placed.feedback).toBe("That tile does not fit this part of the path.");
  });

  it("locked slot cannot be changed", () => {
    const selected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "sealed-envelope");
    const placed = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selected, "case-start");

    expect(placed.placedTilesBySlotId["case-start"]).toBe("case-start");
    expect(placed.placedTilesBySlotId.evidence).toBeUndefined();
  });

  it("tile cannot exist in two slots at once", () => {
    const selected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "attention");
    const placed = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selected, "meaning");
    const picked = removeTileFromSlot(LEVEL_ONE_CASE_BOARD_SPEC, placed, "meaning");
    const selectedAgain = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, picked, "attention");
    const placedAgain = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, selectedAgain, "meaning");

    expect(Object.values(placedAgain.placedTilesBySlotId).filter((tileId) => tileId === "attention")).toHaveLength(1);
  });

  it("placing into occupied movable slot replaces safely", () => {
    const speedSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "speed");
    const speedPlaced = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, speedSelected, "meaning");
    const attentionSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, speedPlaced, "attention");
    const attentionPlaced = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, attentionSelected, "meaning");

    expect(attentionPlaced.placedTilesBySlotId.meaning).toBe("attention");
    expect(Object.values(attentionPlaced.placedTilesBySlotId)).not.toContain("speed");
  });

  it("active connections are incomplete before correct placement", () => {
    const state = createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC);

    expect(getActiveConnections(LEVEL_ONE_CASE_BOARD_SPEC, state)).toEqual([]);
  });

  it("correct placement activates full path connections", () => {
    const state = placeCorrectLevelOnePath();

    expect(state.activeConnections).toEqual([
      { fromTileId: "case-start", toTileId: "sealed-envelope" },
      { fromTileId: "sealed-envelope", toTileId: "attention" },
      { fromTileId: "attention", toTileId: "truth" }
    ]);
  });

  it("incomplete board is not solved", () => {
    const state = createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC);
    const result = checkCaseBoardAnswer(LEVEL_ONE_CASE_BOARD_SPEC, state);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The case path is not complete yet.");
  });

  it("decoy meaning is not solved", () => {
    const envelopeSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "sealed-envelope");
    const envelopePlaced = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, envelopeSelected, "evidence");
    const speedSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, envelopePlaced, "speed");
    const speedPlaced = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, speedSelected, "meaning");
    const result = checkCaseBoardAnswer(LEVEL_ONE_CASE_BOARD_SPEC, speedPlaced);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("wrong");
    expect(result.feedback).toBe("The path does not reach the truth yet. Try another meaning.");
  });

  it("correct Envelope to Attention path is solved", () => {
    const state = placeCorrectLevelOnePath();
    const result = checkCaseBoardAnswer(LEVEL_ONE_CASE_BOARD_SPEC, state);

    expect(result.solved).toBe(true);
    expect(result.feedback).toBe("The first path is clear.");
    expect(isCaseBoardSolved(LEVEL_ONE_CASE_BOARD_SPEC, result.state)).toBe(true);
  });

  it("reset restores initial state", () => {
    const solved = placeCorrectLevelOnePath();
    const reset = resetCaseBoard(LEVEL_ONE_CASE_BOARD_SPEC);

    expect(solved.placedTilesBySlotId.evidence).toBe("sealed-envelope");
    expect(reset.placedTilesBySlotId.evidence).toBeUndefined();
    expect(reset.placedTilesBySlotId["case-start"]).toBe("case-start");
    expect(reset.placedTilesBySlotId.truth).toBe("truth");
  });
});

describe("Level 1 Case Board content", () => {
  it("contains correct tiles and slots", () => {
    const spec = getCaseBoardSpec(1);

    expect(spec?.boardSlots.map((slot) => slot.id)).toEqual(["case-start", "evidence", "meaning", "truth"]);
    expect(spec?.availableTiles.map((tile) => tile.id)).toEqual([
      "case-start",
      "sealed-envelope",
      "attention",
      "speed",
      "noise",
      "truth"
    ]);
  });

  it("contains the correct required path", () => {
    expect(LEVEL_ONE_CASE_BOARD_SPEC.requiredPath).toEqual(["case-start", "sealed-envelope", "attention", "truth"]);
  });
});

function placeCorrectLevelOnePath() {
  const envelopeSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, createInitialCaseBoardState(LEVEL_ONE_CASE_BOARD_SPEC), "sealed-envelope");
  const envelopePlaced = placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, envelopeSelected, "evidence");
  const attentionSelected = selectTile(LEVEL_ONE_CASE_BOARD_SPEC, envelopePlaced, "attention");

  return placeSelectedTileInSlot(LEVEL_ONE_CASE_BOARD_SPEC, attentionSelected, "meaning");
}
