import { describe, expect, it } from "vitest";
import {
  CONTRADICTION_EVIDENCE_TEXT,
  CONTRADICTION_STATEMENTS,
  createContradictionState,
  isContradictionCorrect,
  resetContradictionState,
  selectContradictionStatement,
  submitContradiction
} from "../game/puzzles/contradiction/contradictionLogic";

describe("contradiction puzzle logic", () => {
  it("starts with evidence text", () => {
    const state = createContradictionState();

    expect(state.evidenceText).toBe(CONTRADICTION_EVIDENCE_TEXT);
    expect(state.evidenceText).toContain("not taken by force");
  });

  it("starts with three statements", () => {
    const state = createContradictionState();

    expect(CONTRADICTION_STATEMENTS).toHaveLength(3);
    expect(state.statements.map((statement) => statement.id)).toEqual([
      "taken-by-force",
      "left-willingly",
      "never-real"
    ]);
  });

  it("has no selected statement initially", () => {
    expect(createContradictionState().selectedStatementId).toBeNull();
  });

  it("selecting a statement stores the selected id", () => {
    const state = selectContradictionStatement(createContradictionState(), "left-willingly");

    expect(state.selectedStatementId).toBe("left-willingly");
  });

  it("recognizes the correct contradiction", () => {
    const state = selectContradictionStatement(createContradictionState(), "taken-by-force");
    const submission = submitContradiction(state);

    expect(isContradictionCorrect(state)).toBe(true);
    expect(submission.result).toEqual({
      solved: true,
      feedback: "Contradiction found."
    });
  });

  it("does not solve a wrong statement", () => {
    const state = selectContradictionStatement(createContradictionState(), "left-willingly");
    const submission = submitContradiction(state);

    expect(isContradictionCorrect(state)).toBe(false);
    expect(submission.state.solved).toBe(false);
    expect(submission.result.feedback).toBe("Look again. The quiet truth is already in the note.");
  });

  it("reset clears selection", () => {
    const changedState = selectContradictionStatement(createContradictionState(), "never-real");
    const resetState = resetContradictionState();

    expect(changedState.selectedStatementId).toBe("never-real");
    expect(resetState.selectedStatementId).toBeNull();
  });

  it("solved state is detected only when the correct answer is submitted", () => {
    const wrong = submitContradiction(selectContradictionStatement(createContradictionState(), "never-real"));
    const correct = submitContradiction(selectContradictionStatement(createContradictionState(), "taken-by-force"));

    expect(wrong.state.solved).toBe(false);
    expect(correct.state.solved).toBe(true);
  });
});
