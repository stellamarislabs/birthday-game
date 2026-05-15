import { describe, expect, it } from "vitest";
import {
  PATTERN_REPEAT_COPY,
  PATTERN_REPEAT_TARGET_SEQUENCE,
  createPatternRepeatState,
  inputPatternRepeatLantern,
  resetPatternRepeatAttempt,
  resetPatternRepeatPuzzle,
  showPatternRepeatSequence
} from "../game/puzzles/patternRepeat/patternRepeatLogic";

describe("pattern-repeat puzzle", () => {
  it("starts with four lanterns", () => {
    const state = createPatternRepeatState();

    expect(state.lanterns.map((lantern) => lantern.label)).toEqual([
      "North Lantern",
      "East Lantern",
      "South Lantern",
      "West Lantern"
    ]);
  });

  it("uses the calm Level 7 target sequence", () => {
    expect(PATTERN_REPEAT_TARGET_SEQUENCE).toEqual(["north", "east", "south", "east"]);
  });

  it("shows the pattern on request without changing progress", () => {
    const state = showPatternRepeatSequence(createPatternRepeatState());

    expect(state.sequenceVisible).toBe(true);
    expect(state.inputSequence).toEqual([]);
  });

  it("advances progress after the first correct lantern", () => {
    const state = inputPatternRepeatLantern(createPatternRepeatState(), "north");

    expect(state.inputSequence).toEqual(["north"]);
    expect(state.solved).toBe(false);
  });

  it("marks the puzzle solved after the full correct sequence", () => {
    let state = createPatternRepeatState();

    for (const lanternId of PATTERN_REPEAT_TARGET_SEQUENCE) {
      state = inputPatternRepeatLantern(state, lanternId);
    }

    expect(state.solved).toBe(true);
    expect(state.feedback).toBe(PATTERN_REPEAT_COPY.success);
  });

  it("gives gentle feedback and clears progress after wrong input", () => {
    let state = inputPatternRepeatLantern(createPatternRepeatState(), "north");
    state = inputPatternRepeatLantern(state, "west");

    expect(state.solved).toBe(false);
    expect(state.inputSequence).toEqual([]);
    expect(state.feedback).toBe(PATTERN_REPEAT_COPY.wrong);
  });

  it("resetAttempt clears current input but preserves the target sequence", () => {
    const started = inputPatternRepeatLantern(createPatternRepeatState(), "north");
    const reset = resetPatternRepeatAttempt(started);

    expect(reset.inputSequence).toEqual([]);
    expect(reset.targetSequence).toEqual(["north", "east", "south", "east"]);
  });

  it("resetPuzzle clears solved state and input sequence", () => {
    let state = createPatternRepeatState();
    for (const lanternId of PATTERN_REPEAT_TARGET_SEQUENCE) {
      state = inputPatternRepeatLantern(state, lanternId);
    }

    const reset = resetPatternRepeatPuzzle();

    expect(state.solved).toBe(true);
    expect(reset.solved).toBe(false);
    expect(reset.inputSequence).toEqual([]);
  });
});

