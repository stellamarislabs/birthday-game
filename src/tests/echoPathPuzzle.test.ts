import { describe, expect, it } from "vitest";
import { LEVEL_SIX_ECHO_PATH_SPEC } from "../game/puzzles/echoPath/echoPathContent";
import {
  checkEchoPathAnswer,
  createInitialEchoPathState,
  isDoorUnlocked,
  isEchoPathSolved,
  placeKeyOnDoor,
  placeQuestionInSlot,
  resetEchoPath
} from "../game/puzzles/echoPath/echoPathLogic";

const spec = LEVEL_SIX_ECHO_PATH_SPEC;

describe("Echo Path logic", () => {
  it("starts with no placed question or key state", () => {
    const state = createInitialEchoPathState(spec);

    expect(state.placedQuestionId).toBeNull();
    expect(state.keyPlacedDoorId).toBeNull();
    expect(state.selectedQuestionId).toBeNull();
  });

  it("wrong question does not unlock the Trust door", () => {
    const state = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "who-benefits");

    expect(isDoorUnlocked(spec, state, "trust")).toBe(false);
    expect(isEchoPathSolved(spec, state)).toBe(false);
  });

  it("correct question unlocks the Trust door", () => {
    const state = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "what-remains");

    expect(isDoorUnlocked(spec, state, "trust")).toBe(true);
    expect(isDoorUnlocked(spec, state, "doubt")).toBe(false);
  });

  it("key cannot solve before the correct question is placed", () => {
    const state = placeKeyOnDoor(spec, createInitialEchoPathState(spec), "trust");

    expect(state.keyPlacedDoorId).toBeNull();
    expect(isEchoPathSolved(spec, state)).toBe(false);
    expect(state.feedback).toBe(spec.wrongText);
  });

  it("key on wrong door does not solve", () => {
    const questionPlaced = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "what-remains");
    const state = placeKeyOnDoor(spec, questionPlaced, "fear");

    expect(state.keyPlacedDoorId).toBeNull();
    expect(isEchoPathSolved(spec, state)).toBe(false);
    expect(state.feedback).toBe(spec.wrongText);
  });

  it("key on Trust after correct question solves", () => {
    const questionPlaced = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "what-remains");
    const state = placeKeyOnDoor(spec, questionPlaced, "trust");
    const result = checkEchoPathAnswer(spec, state);

    expect(state.feedback).toBe(spec.readyText);
    expect(result.solved).toBe(true);
    expect(result.feedback).toContain("The Trust door opens.");
    expect(result.feedback).toContain("The lantern lights the pages beyond it.");
    expect(result.feedback).toContain("The blue ribbon releases the unfinished letter.");
  });

  it("wrong or incomplete state returns gentle feedback", () => {
    const wrongQuestion = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "receipt");
    const result = checkEchoPathAnswer(spec, wrongQuestion);

    expect(result.solved).toBe(false);
    expect(result.feedback).toBe(spec.incompleteText);
  });

  it("reset clears question and key state", () => {
    const questionPlaced = placeQuestionInSlot(spec, createInitialEchoPathState(spec), "what-remains");
    const solved = placeKeyOnDoor(spec, questionPlaced, "trust");

    expect(solved.keyPlacedDoorId).toBe("trust");
    expect(resetEchoPath(spec)).toEqual(createInitialEchoPathState(spec));
  });

  it("defines Level 6 question and door content", () => {
    expect(spec.questions).toHaveLength(3);
    expect(spec.questions.map((question) => question.text)).toEqual([
      "Who benefits?",
      "Where is the receipt?",
      "What remains when things are difficult?"
    ]);
    expect(spec.correctQuestionId).toBe("what-remains");
    expect(spec.correctDoorId).toBe("trust");
    expect(spec.successRevealSteps.map((step) => step.label)).toEqual([
      "Lantern path",
      "Blue ribbon pages",
      "Unfinished letter"
    ]);
    expect(JSON.stringify(spec)).not.toContain("Exhibit");
  });
});
