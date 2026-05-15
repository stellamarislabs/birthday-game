import { describe, expect, it } from "vitest";
import { LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC } from "../game/puzzles/lanternSequence/lanternSequenceContent";
import {
  checkLanternSequenceAnswer,
  createInitialLanternSequenceState,
  getLanternSequenceProgress,
  inputLantern,
  resetAttempt
} from "../game/puzzles/lanternSequence/lanternSequenceLogic";

const spec = LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC;

describe("Lantern Sequence logic", () => {
  it("starts at progress 0", () => {
    expect(getLanternSequenceProgress(spec, createInitialLanternSequenceState(spec))).toEqual({ current: 0, total: 4 });
  });

  it("correct first input advances progress", () => {
    const state = inputLantern(spec, createInitialLanternSequenceState(spec), "north");
    expect(state.attempt).toEqual(["north"]);
  });

  it("wrong input creates gentle wrong state", () => {
    const state = inputLantern(spec, createInitialLanternSequenceState(spec), "west");
    expect(state.feedback).toBe(spec.wrongText);
    expect(state.attempt).toEqual([]);
    expect(checkLanternSequenceAnswer(spec, state).reason).toBe("wrong");
  });

  it("resetAttempt clears the current attempt", () => {
    const state = inputLantern(spec, createInitialLanternSequenceState(spec), "north");
    expect(resetAttempt(spec, state).attempt).toEqual([]);
  });

  it("full North East South East sequence solves", () => {
    let state = createInitialLanternSequenceState(spec);
    for (const lanternId of ["north", "east", "south", "east"]) {
      state = inputLantern(spec, state, lanternId);
    }

    const result = checkLanternSequenceAnswer(spec, state);
    expect(result.solved).toBe(true);
    expect(result.feedback).toContain("The garden opens the path.");
    expect(result.feedback).toContain("A blue ribbon waits on the bench.");
  });

  it("defines four lanterns", () => {
    expect(spec.lanterns.map((lantern) => lantern.id)).toEqual(["north", "east", "south", "west"]);
  });
});
