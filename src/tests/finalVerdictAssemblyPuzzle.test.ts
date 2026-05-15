import { describe, expect, it } from "vitest";
import { LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC } from "../game/puzzles/finalVerdictAssembly/finalVerdictAssemblyContent";
import {
  FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES,
  getFinalVerdictAssemblyFinalAsset
} from "../game/puzzles/finalVerdictAssembly/finalVerdictAssemblyFinalAssets";
import {
  getFinalSealRingControlAriaLabel,
  getFinalSealRingControlLabel
} from "../game/puzzles/finalVerdictAssembly/finalVerdictAssemblyRenderer";
import {
  checkFinalVerdictAssemblyAnswer,
  createInitialFinalVerdictAssemblyState,
  getFinalVerdictAssemblyProgress,
  getRingAlignment,
  isFinalVerdictAssemblySolved,
  isRingAligned,
  resetFinalVerdictAssembly,
  rotateFinalSealRing
} from "../game/puzzles/finalVerdictAssembly/finalVerdictAssemblyLogic";

const spec = LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC;

function solveRings() {
  let state = createInitialFinalVerdictAssemblyState(spec);
  for (const ring of spec.rings) {
    while (!isRingAligned(spec, state, ring.id)) {
      state = rotateFinalSealRing(spec, state, ring.id);
    }
  }
  return state;
}

describe("Final Verdict Assembly logic", () => {
  it("defines the active six-clue final seal ring puzzle", () => {
    expect(spec.title).toBe("Final Seal: The Court of the Heart");
    expect(spec.exhibitName).toBe("The Heart Seal");
    expect(spec.subtitle).toBe("Align the clues and open the verdict.");
    expect(spec.instruction).toContain("Rotate the seal rings");
    expect(spec.clueMarks.map((clue) => clue.label)).toEqual([
      "Envelope",
      "Wall",
      "Witness",
      "Correction",
      "Trust",
      "Heart"
    ]);
    expect(spec.rings.map((ring) => ring.clueIds)).toEqual([
      ["envelope", "wall"],
      ["witness", "correction"],
      ["trust", "heart"]
    ]);
    expect(JSON.stringify(spec)).not.toContain("The Heart, Freely Given");
    expect(JSON.stringify(spec)).not.toContain("Exhibit");
  });

  it("starts with unaligned rings and no lit clues", () => {
    const state = createInitialFinalVerdictAssemblyState(spec);

    expect(state.solved).toBe(false);
    expect(state.ringRotationsById).toEqual({
      outer: 270,
      middle: 180,
      inner: 90
    });
    expect(getFinalVerdictAssemblyProgress(spec, state)).toEqual({
      alignedRingIds: [],
      litClueIds: [],
      litCount: 0,
      totalCount: 6
    });
  });

  it("rotating a ring changes its alignment", () => {
    const state = createInitialFinalVerdictAssemblyState(spec);
    const rotated = rotateFinalSealRing(spec, state, "outer");

    expect(getRingAlignment(spec, rotated, "outer")).toBe(0);
    expect(isRingAligned(spec, rotated, "outer")).toBe(true);
  });

  it("defines mobile-friendly ring controls for the same ring ids", () => {
    expect(spec.rings.map((ring) => [ring.id, getFinalSealRingControlLabel(ring)])).toEqual([
      ["outer", "⟳ Outer"],
      ["middle", "⟳ Middle"],
      ["inner", "⟳ Inner"]
    ]);
    expect(spec.rings.map((ring) => getFinalSealRingControlAriaLabel(ring))).toEqual([
      "Rotate outer ring",
      "Rotate middle ring",
      "Rotate inner ring"
    ]);
  });

  it("unknown rings do not mutate state", () => {
    const state = createInitialFinalVerdictAssemblyState(spec);
    expect(rotateFinalSealRing(spec, state, "missing")).toEqual(state);
  });

  it("incomplete alignment is not solved", () => {
    const state = rotateFinalSealRing(spec, createInitialFinalVerdictAssemblyState(spec), "outer");
    const result = checkFinalVerdictAssemblyAnswer(spec, state);

    expect(isFinalVerdictAssemblySolved(spec, state)).toBe(false);
    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The seal is not complete yet.");
  });

  it("solves when all six clue lights are complete", () => {
    const state = solveRings();
    const progress = getFinalVerdictAssemblyProgress(spec, state);
    const result = checkFinalVerdictAssemblyAnswer(spec, state);

    expect(progress.litCount).toBe(6);
    expect(progress.litClueIds).toEqual(["envelope", "wall", "witness", "correction", "trust", "heart"]);
    expect(result.solved).toBe(true);
    expect(result.feedback).toContain("The final seal closes.");
    expect(result.feedback).toContain("The verdict is ready.");
  });

  it("reset clears ring progress", () => {
    const state = solveRings();
    expect(isFinalVerdictAssemblySolved(spec, state)).toBe(true);
    expect(resetFinalVerdictAssembly(spec)).toEqual(createInitialFinalVerdictAssemblyState(spec));
  });

  it("does not keep token-slot matching or old ten ordered fragments in the active spec", () => {
    expect("fragments" in spec).toBe(false);
    expect("slots" in spec).toBe(false);
    expect(spec.clueMarks).toHaveLength(6);
    expect(spec.rings).toHaveLength(3);
    expect(spec.clueMarks.map((clue) => clue.label)).not.toContain("Responsibility");
  });

  it("maps optional final seal art without changing ring or clue ownership", () => {
    expect(FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES).toEqual({
      background: "puzzle06-final-seal-bg.webp",
      finalSealBoard: "puzzle06-final-seal-board.webp",
      heartCore: "puzzle06-final-seal-heart-core.webp"
    });

    for (const key of Object.keys(FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES) as Array<
      keyof typeof FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES
    >) {
      const asset = getFinalVerdictAssemblyFinalAsset(key);
      expect(asset.filename).toBe(FINAL_VERDICT_ASSEMBLY_FINAL_ASSET_FILENAMES[key]);
      if (asset.imageUrl) {
        expect(asset.imageUrl).toContain(asset.filename);
      }
    }

    expect(spec.rings.map((ring) => [ring.id, ring.initialRotation, ring.alignedRotation])).toEqual([
      ["outer", 270, 0],
      ["middle", 180, 0],
      ["inner", 90, 0]
    ]);
    expect(spec.clueMarks.map((clue) => clue.id)).toEqual([
      "envelope",
      "wall",
      "witness",
      "correction",
      "trust",
      "heart"
    ]);
  });
});
