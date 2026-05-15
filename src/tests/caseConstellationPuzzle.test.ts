import { describe, expect, it } from "vitest";
import { LEVEL_NINE_CASE_CONSTELLATION_SPEC } from "../game/puzzles/caseConstellation/caseConstellationContent";
import {
  checkCaseConstellationAnswer,
  createInitialCaseConstellationState,
  getCaseConstellationProgress,
  isCaseConstellationSolved,
  isNodeCorrect,
  placeSelectedStarOnNode,
  resetCaseConstellation,
  selectStar
} from "../game/puzzles/caseConstellation/caseConstellationLogic";

const spec = LEVEL_NINE_CASE_CONSTELLATION_SPEC;

function place(starId: string, nodeId: string, state = createInitialCaseConstellationState(spec)) {
  return placeSelectedStarOnNode(spec, selectStar(state, starId), nodeId);
}

describe("Case Constellation logic", () => {
  it("starts with empty nodes", () => {
    expect(createInitialCaseConstellationState(spec).placedStarsByNodeId).toEqual({});
  });

  it("placing a star on a node works", () => {
    const state = place("envelope", "attention");
    expect(state.placedStarsByNodeId.attention).toBe("envelope");
  });

  it("wrong star/node pair is not correct", () => {
    const state = place("stamp", "attention");
    expect(isNodeCorrect(spec, state, "attention")).toBe(false);
  });

  it("correct star/node pair is correct", () => {
    const state = place("envelope", "attention");
    expect(isNodeCorrect(spec, state, "attention")).toBe(true);
  });

  it("star cannot exist twice", () => {
    let state = place("envelope", "attention");
    state = place("envelope", "warmth", state);
    expect(Object.values(state.placedStarsByNodeId).filter((starId) => starId === "envelope")).toHaveLength(1);
    expect(state.placedStarsByNodeId.warmth).toBe("envelope");
  });

  it("all correct placements solve", () => {
    let state = createInitialCaseConstellationState(spec);
    for (const star of spec.stars) {
      state = place(star.id, star.correctNodeId, state);
    }
    expect(isCaseConstellationSolved(spec, state)).toBe(true);
    expect(checkCaseConstellationAnswer(spec, state).feedback).toContain("The letter is complete.");
    expect(checkCaseConstellationAnswer(spec, state).feedback).toContain("The final court opens above the rooftops.");
  });

  it("reset clears constellation", () => {
    const state = place("envelope", "attention");
    expect(state.placedStarsByNodeId.attention).toBe("envelope");
    expect(resetCaseConstellation(spec).placedStarsByNodeId).toEqual({});
  });

  it("reports progress", () => {
    const state = place("envelope", "attention");
    expect(getCaseConstellationProgress(spec, state)).toEqual({ placedCount: 1, correctCount: 1, totalCount: 8 });
  });

  it("defines exhibit stars and meaning nodes", () => {
    expect(spec.stars).toHaveLength(8);
    expect(spec.nodes).toHaveLength(8);
  });
});
