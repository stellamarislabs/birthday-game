import { describe, expect, it } from "vitest";
import {
  ARGUMENT_BUILDER_CHOICES,
  ARGUMENT_BUILDER_PROMPT_TEXT,
  createArgumentBuilderState,
  isArgumentBuilderCorrect,
  resetArgumentBuilderState,
  selectArgumentBuilderChoice,
  submitArgumentBuilder
} from "../game/puzzles/argumentBuilder/argumentBuilderLogic";

describe("argument-builder puzzle logic", () => {
  it("starts with prompt text", () => {
    const state = createArgumentBuilderState();

    expect(state.promptText).toBe(ARGUMENT_BUILDER_PROMPT_TEXT);
    expect(state.promptText).toContain("best proves the case");
  });

  it("starts with three argument choices", () => {
    const state = createArgumentBuilderState();

    expect(ARGUMENT_BUILDER_CHOICES).toHaveLength(3);
    expect(state.choices.map((choice) => choice.id)).toEqual(["coincidence", "repeated-actions", "impossible"]);
  });

  it("has no selected argument initially", () => {
    expect(createArgumentBuilderState().selectedArgumentId).toBeNull();
  });

  it("selecting an argument stores the selected id", () => {
    const state = selectArgumentBuilderChoice(createArgumentBuilderState(), "coincidence");

    expect(state.selectedArgumentId).toBe("coincidence");
  });

  it("recognizes correct choice B", () => {
    const state = selectArgumentBuilderChoice(createArgumentBuilderState(), "repeated-actions");
    const submission = submitArgumentBuilder(state);

    expect(isArgumentBuilderCorrect(state)).toBe(true);
    expect(submission.result).toEqual({
      solved: true,
      feedback: "Argument accepted."
    });
  });

  it("does not solve wrong choice A", () => {
    const state = selectArgumentBuilderChoice(createArgumentBuilderState(), "coincidence");
    const submission = submitArgumentBuilder(state);

    expect(isArgumentBuilderCorrect(state)).toBe(false);
    expect(submission.state.solved).toBe(false);
    expect(submission.result.feedback).toBe("That line sounds dramatic, but the evidence points somewhere stronger.");
  });

  it("does not solve wrong choice C", () => {
    const state = selectArgumentBuilderChoice(createArgumentBuilderState(), "impossible");
    const submission = submitArgumentBuilder(state);

    expect(isArgumentBuilderCorrect(state)).toBe(false);
    expect(submission.state.solved).toBe(false);
  });

  it("reset clears selection", () => {
    const changedState = selectArgumentBuilderChoice(createArgumentBuilderState(), "impossible");
    const resetState = resetArgumentBuilderState();

    expect(changedState.selectedArgumentId).toBe("impossible");
    expect(resetState.selectedArgumentId).toBeNull();
  });

  it("solved state is detected only when the correct answer is submitted", () => {
    const wrongA = submitArgumentBuilder(selectArgumentBuilderChoice(createArgumentBuilderState(), "coincidence"));
    const wrongC = submitArgumentBuilder(selectArgumentBuilderChoice(createArgumentBuilderState(), "impossible"));
    const correct = submitArgumentBuilder(selectArgumentBuilderChoice(createArgumentBuilderState(), "repeated-actions"));

    expect(wrongA.state.solved).toBe(false);
    expect(wrongC.state.solved).toBe(false);
    expect(correct.state.solved).toBe(true);
  });
});
