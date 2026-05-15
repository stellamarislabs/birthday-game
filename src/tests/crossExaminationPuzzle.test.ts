import { describe, expect, it } from "vitest";
import {
  CROSS_EXAMINATION_CHOICES,
  CROSS_EXAMINATION_PROMPT_TEXT,
  createCrossExaminationState,
  isCrossExaminationCorrect,
  resetCrossExaminationState,
  selectCrossExaminationChoice,
  submitCrossExamination
} from "../game/puzzles/crossExamination/crossExaminationLogic";

describe("cross-examination puzzle logic", () => {
  it("starts with prompt text", () => {
    const state = createCrossExaminationState();

    expect(state.promptText).toBe(CROSS_EXAMINATION_PROMPT_TEXT);
    expect(state.promptText).toContain("love is real");
  });

  it("starts with three answer choices", () => {
    const state = createCrossExaminationState();

    expect(CROSS_EXAMINATION_CHOICES).toHaveLength(3);
    expect(state.choices.map((choice) => choice.id)).toEqual(["who-benefits", "what-remains", "receipt"]);
  });

  it("has no selected choice initially", () => {
    expect(createCrossExaminationState().selectedChoiceId).toBeNull();
  });

  it("selecting a choice stores the selected id", () => {
    const state = selectCrossExaminationChoice(createCrossExaminationState(), "who-benefits");

    expect(state.selectedChoiceId).toBe("who-benefits");
  });

  it("recognizes correct choice B", () => {
    const state = selectCrossExaminationChoice(createCrossExaminationState(), "what-remains");
    const submission = submitCrossExamination(state);

    expect(isCrossExaminationCorrect(state)).toBe(true);
    expect(submission.result).toEqual({
      solved: true,
      feedback: "The echo answers honestly."
    });
  });

  it("does not solve wrong choice A", () => {
    const state = selectCrossExaminationChoice(createCrossExaminationState(), "who-benefits");
    const submission = submitCrossExamination(state);

    expect(isCrossExaminationCorrect(state)).toBe(false);
    expect(submission.state.solved).toBe(false);
    expect(submission.result.feedback).toBe("That question sounds clever, but it does not reach the heart of the case.");
  });

  it("does not solve wrong choice C", () => {
    const state = selectCrossExaminationChoice(createCrossExaminationState(), "receipt");
    const submission = submitCrossExamination(state);

    expect(isCrossExaminationCorrect(state)).toBe(false);
    expect(submission.state.solved).toBe(false);
  });

  it("reset clears selection", () => {
    const changedState = selectCrossExaminationChoice(createCrossExaminationState(), "receipt");
    const resetState = resetCrossExaminationState();

    expect(changedState.selectedChoiceId).toBe("receipt");
    expect(resetState.selectedChoiceId).toBeNull();
  });

  it("solved state is detected only when the correct answer is submitted", () => {
    const wrong = submitCrossExamination(selectCrossExaminationChoice(createCrossExaminationState(), "who-benefits"));
    const correct = submitCrossExamination(selectCrossExaminationChoice(createCrossExaminationState(), "what-remains"));

    expect(wrong.state.solved).toBe(false);
    expect(correct.state.solved).toBe(true);
  });
});
