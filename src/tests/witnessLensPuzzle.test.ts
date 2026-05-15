import { describe, expect, it } from "vitest";
import { LEVEL_FOUR_WITNESS_LENS_SPEC, getWitnessLensSpec } from "../game/puzzles/witnessLens/witnessLensContent";
import {
  checkWitnessLensAnswer,
  createInitialWitnessLensState,
  inspectStatement,
  isWitnessLensSolved,
  markStatement,
  resetWitnessLens,
  selectWitnessTool
} from "../game/puzzles/witnessLens/witnessLensLogic";

describe("Witness Lens puzzle logic", () => {
  it("initial state has no inspected statement", () => {
    const state = createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC);

    expect(state.inspectedStatementId).toBeNull();
  });

  it("initial state has no marked statement", () => {
    const state = createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC);

    expect(state.markedStatementId).toBeNull();
  });

  it("inspecting statement stores inspectedStatementId", () => {
    const state = inspectStatement(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "taken-by-force");

    expect(state.inspectedStatementId).toBe("taken-by-force");
  });

  it("marking statement stores markedStatementId", () => {
    const state = markStatement(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "taken-by-force");

    expect(state.markedStatementId).toBe("taken-by-force");
  });

  it("tap-friendly stamp flow marks and inspects the selected contradiction", () => {
    const state = markStatement(
      selectWitnessTool(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "stamp"),
      "taken-by-force"
    );

    expect(state.markedStatementId).toBe("taken-by-force");
    expect(state.inspectedStatementId).toBe("taken-by-force");
    expect(state.selectedTool).toBeNull();
  });

  it("only one statement can be marked", () => {
    let state = markStatement(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "taken-by-force");
    state = markStatement(state, "left-willingly");

    expect(state.markedStatementId).toBe("left-willingly");
  });

  it("wrong statement is not solved", () => {
    const result = checkWitnessLensAnswer(
      LEVEL_FOUR_WITNESS_LENS_SPEC,
      markStatement(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "left-willingly")
    );

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("wrong");
    expect(result.feedback).toBe("The marked statement does not break the evidence.");
  });

  it("correct statement A is solved", () => {
    const result = checkWitnessLensAnswer(
      LEVEL_FOUR_WITNESS_LENS_SPEC,
      markStatement(createInitialWitnessLensState(LEVEL_FOUR_WITNESS_LENS_SPEC), "taken-by-force")
    );

    expect(result.solved).toBe(true);
    expect(result.feedback).toContain("The contradiction is found.");
    expect(result.feedback).toContain("An archive code appears in the corner of the note.");
    expect(isWitnessLensSolved(LEVEL_FOUR_WITNESS_LENS_SPEC, result.state)).toBe(true);
  });

  it("reset clears inspected and marked state", () => {
    const reset = resetWitnessLens(LEVEL_FOUR_WITNESS_LENS_SPEC);

    expect(reset.inspectedStatementId).toBeNull();
    expect(reset.markedStatementId).toBeNull();
  });
});

describe("Level 4 Witness Lens content", () => {
  it("has 3 statements", () => {
    expect(getWitnessLensSpec(4)?.statements).toHaveLength(3);
  });

  it("uses statement A as the correct contradiction", () => {
    expect(LEVEL_FOUR_WITNESS_LENS_SPEC.correctStatementId).toBe("taken-by-force");
    expect(LEVEL_FOUR_WITNESS_LENS_SPEC.statements[0]?.label).toBe("A");
  });

  it("uses concise archive-code payoff copy", () => {
    expect(LEVEL_FOUR_WITNESS_LENS_SPEC.successText).toBe("The contradiction is found.");
    expect(LEVEL_FOUR_WITNESS_LENS_SPEC.successFollowUp).toBe("An archive code appears in the corner of the note.");
    expect(LEVEL_FOUR_WITNESS_LENS_SPEC.statements.map((statement) => statement.hint)).toEqual([
      "Contradicts the note.",
      "Matches the note.",
      "Unsupported by the note."
    ]);
  });

  it("keeps active player-facing copy out of old exhibit language", () => {
    const playerFacingCopy = [
      LEVEL_FOUR_WITNESS_LENS_SPEC.title,
      LEVEL_FOUR_WITNESS_LENS_SPEC.subtitle,
      LEVEL_FOUR_WITNESS_LENS_SPEC.instruction,
      LEVEL_FOUR_WITNESS_LENS_SPEC.evidenceNote,
      LEVEL_FOUR_WITNESS_LENS_SPEC.successText,
      LEVEL_FOUR_WITNESS_LENS_SPEC.successFollowUp,
      LEVEL_FOUR_WITNESS_LENS_SPEC.incompleteText,
      LEVEL_FOUR_WITNESS_LENS_SPEC.wrongText,
      ...LEVEL_FOUR_WITNESS_LENS_SPEC.statements.flatMap((statement) => [statement.text, statement.hint])
    ].join(" ");

    expect(playerFacingCopy).not.toMatch(/Exhibit/i);
  });
});
