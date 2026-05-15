import { describe, expect, it } from "vitest";
import { LEVEL_FOUR_DEPOSITION_ORDER_SPEC } from "../game/puzzles/depositionOrder/depositionOrderContent";
import {
  DEPOSITION_ORDER_FINAL_ASSET_FILENAMES,
  getDepositionOrderFinalAsset
} from "../game/puzzles/depositionOrder/depositionOrderFinalAssets";
import {
  checkDepositionOrderAnswer,
  createInitialDepositionOrderState,
  getDepositionSlotPlacementStatus,
  getDepositionOrderProgress,
  getTrayStripIds,
  isDepositionOrderSolved,
  placeSelectedStripInSlot,
  resetDepositionOrder,
  selectStrip,
  swapStrips
} from "../game/puzzles/depositionOrder/depositionOrderLogic";

const spec = LEVEL_FOUR_DEPOSITION_ORDER_SPEC;

function place(stripId: string, slotId: string, state = createInitialDepositionOrderState(spec)) {
  return placeSelectedStripInSlot(spec, selectStrip(state, stripId), slotId);
}

describe("deposition-order puzzle logic", () => {
  it("starts unsolved with all strips in the tray", () => {
    const state = createInitialDepositionOrderState(spec);

    expect(isDepositionOrderSolved(spec, state)).toBe(false);
    expect(getDepositionOrderProgress(spec, state)).toMatchObject({
      placedCount: 0,
      correctCount: 0,
      totalCount: 4,
      complete: false,
      archiveCodeVisible: false
    });
    expect(getTrayStripIds(spec, state)).toEqual(spec.strips.map((strip) => strip.id));
  });

  it("uses archive file copy instead of margin wording", () => {
    const archiveStrip = spec.strips.find((strip) => strip.id === "archive-margin");

    expect(archiveStrip).toMatchObject({
      shortLabel: "Archive File",
      text: "Check the archive file."
    });
    expect(spec.archiveCode).toBe("16/05-FILE");
    expect(JSON.stringify(spec)).not.toMatch(/Archive margin|archive margin|16\/05-MARGIN/);
  });

  it("selects and places strips without duplicating them", () => {
    let state = createInitialDepositionOrderState(spec);
    state = place("not-force", "line-1", state);
    state = place("not-force", "line-2", state);

    expect(state.placedStrips["line-1"]).toBeNull();
    expect(state.placedStrips["line-2"]).toBe("not-force");
    expect(getTrayStripIds(spec, state)).not.toContain("not-force");
  });

  it("keeps wrong or incomplete orders unsolved", () => {
    let state = createInitialDepositionOrderState(spec);
    state = place("left-willingly", "line-1", state);
    state = place("not-force", "line-2", state);

    expect(checkDepositionOrderAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "incomplete"
    });

    state = place("false-accusation", "line-3", state);
    state = place("archive-margin", "line-4", state);
    expect(checkDepositionOrderAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "wrong"
    });
  });

  it("solves only when the witness statement is in the correct order", () => {
    let state = createInitialDepositionOrderState(spec);
    for (const [stripId, slotId] of [
      ["not-force", "line-1"],
      ["left-willingly", "line-2"],
      ["false-accusation", "line-3"],
      ["archive-margin", "line-4"]
    ] as const) {
      state = place(stripId, slotId, state);
    }

    expect(getDepositionOrderProgress(spec, state).archiveCodeVisible).toBe(true);
    expect(checkDepositionOrderAnswer(spec, state)).toMatchObject({
      solved: true,
      reason: "correct",
      feedback: "The witness statement is restored.\nAn archive code appears at the bottom of the note."
    });
  });

  it("can swap strips and reset the statement", () => {
    let state = createInitialDepositionOrderState(spec);
    state = place("not-force", "line-1", state);
    state = place("left-willingly", "line-2", state);
    state = swapStrips(spec, state, "line-1", "line-2");

    expect(state.placedStrips["line-1"]).toBe("left-willingly");
    expect(state.placedStrips["line-2"]).toBe("not-force");

    expect(resetDepositionOrder(spec)).toEqual(createInitialDepositionOrderState(spec));
  });

  it("reports placement status for correct and incorrect strip feedback", () => {
    let state = createInitialDepositionOrderState(spec);

    expect(getDepositionSlotPlacementStatus(spec, state, "line-1")).toBe("empty");

    state = place("left-willingly", "line-1", state);
    expect(getDepositionSlotPlacementStatus(spec, state, "line-1")).toBe("incorrect");

    state = place("not-force", "line-1", state);
    expect(getDepositionSlotPlacementStatus(spec, state, "line-1")).toBe("correct");

    const reset = resetDepositionOrder(spec);
    expect(getDepositionSlotPlacementStatus(spec, reset, "line-1")).toBe("empty");
  });

  it("detects optional final art assets while preserving fallback-safe filenames", () => {
    expect(DEPOSITION_ORDER_FINAL_ASSET_FILENAMES).toEqual({
      background: "puzzle03-deposition-bg.webp",
      witnessNotePaper: "puzzle03-witness-note-paper.webp",
      statementStripShell: "puzzle03-statement-strip-shell.webp"
    });

    for (const key of ["background", "witnessNotePaper", "statementStripShell"] as const) {
      const asset = getDepositionOrderFinalAsset(key);

      expect(asset.filename).toBe(DEPOSITION_ORDER_FINAL_ASSET_FILENAMES[key]);
      expect(asset.imageUrl).toContain(DEPOSITION_ORDER_FINAL_ASSET_FILENAMES[key]);
    }
  });

  it("keeps statement ids and correct order stable for future decorative art layers", () => {
    expect(spec.strips.map((strip) => strip.id)).toEqual([
      "not-force",
      "left-willingly",
      "false-accusation",
      "archive-margin"
    ]);
    expect(spec.correctOrder).toEqual([
      "not-force",
      "left-willingly",
      "false-accusation",
      "archive-margin"
    ]);
  });
});
