import { describe, expect, it } from "vitest";
import { LEVEL_EIGHT_ARGUMENT_TOWER_SPEC } from "../game/puzzles/argumentTower/argumentTowerContent";
import {
  checkArgumentTowerAnswer,
  createInitialArgumentTowerState,
  getArgumentTowerProgress,
  isArgumentTowerSolved,
  isSlotStable,
  placeSelectedBlockInSlot,
  resetArgumentTower,
  selectBlock
} from "../game/puzzles/argumentTower/argumentTowerLogic";

const spec = LEVEL_EIGHT_ARGUMENT_TOWER_SPEC;

function place(blockId: string, slotId: string, state = createInitialArgumentTowerState(spec)) {
  return placeSelectedBlockInSlot(spec, selectBlock(state, blockId), slotId);
}

describe("Argument Tower logic", () => {
  it("starts with empty tower slots", () => {
    expect(createInitialArgumentTowerState(spec).placedBlocksBySlotId).toEqual({});
  });

  it("placing correct block in correct slot stabilizes it", () => {
    const state = place("evidence", "foundation");
    expect(isSlotStable(spec, state, "foundation")).toBe(true);
  });

  it("wrong block does not stabilize a slot", () => {
    const state = place("words-only", "foundation");
    expect(isSlotStable(spec, state, "foundation")).toBe(false);
  });

  it("block cannot exist twice", () => {
    let state = place("evidence", "foundation");
    state = place("evidence", "top", state);
    expect(Object.values(state.placedBlocksBySlotId).filter((blockId) => blockId === "evidence")).toHaveLength(1);
    expect(state.placedBlocksBySlotId.top).toBe("evidence");
  });

  it("all correct blocks solve", () => {
    let state = createInitialArgumentTowerState(spec);
    state = place("evidence", "foundation", state);
    state = place("patience", "support-left", state);
    state = place("showing-up", "support-right", state);
    state = place("promise", "top", state);

    expect(isArgumentTowerSolved(spec, state)).toBe(true);
    expect(checkArgumentTowerAnswer(spec, state).feedback).toContain("The argument holds.");
    expect(checkArgumentTowerAnswer(spec, state).feedback).toContain("An unfinished letter is released.");
  });

  it("reset clears the tower", () => {
    const state = place("evidence", "foundation");
    expect(state.placedBlocksBySlotId.foundation).toBe("evidence");
    expect(resetArgumentTower(spec).placedBlocksBySlotId).toEqual({});
  });

  it("reports progress", () => {
    const state = place("evidence", "foundation");
    expect(getArgumentTowerProgress(spec, state)).toEqual({ placedCount: 1, stableCount: 1, totalCount: 4 });
  });

  it("defines correct Level 8 slots and blocks", () => {
    expect(spec.slots.map((slot) => slot.id)).toEqual(["foundation", "support-left", "support-right", "top"]);
    expect(spec.blocks).toHaveLength(6);
  });
});
