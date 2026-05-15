import { describe, expect, it } from "vitest";
import {
  getInitialGameFlowState,
  getLevelFlowStates,
  getNextGameFlowState,
  getPuzzlePlaceholderExitState
} from "../game/systems/GameFlow";

describe("GameFlow", () => {
  it("starts at the title", () => {
    expect(getInitialGameFlowState()).toEqual({ phase: "title" });
  });

  it("calculates the next state after title, opening, level, puzzle, and reveal", () => {
    const opening = getNextGameFlowState({ phase: "title" });
    const firstLevel = getNextGameFlowState(opening);
    const firstPuzzle = getNextGameFlowState(firstLevel);
    const firstReveal = getNextGameFlowState(firstPuzzle);
    const levelComplete = getNextGameFlowState(firstReveal);
    const levelSelect = getNextGameFlowState(levelComplete);

    expect(opening).toEqual({ phase: "opening-case-file" });
    expect(firstLevel).toEqual({ phase: "platformer-level", levelId: 1 });
    expect(firstPuzzle).toEqual({ phase: "puzzle", levelId: 1 });
    expect(firstReveal).toEqual({ phase: "evidence-reveal", levelId: 1 });
    expect(levelComplete).toEqual({ phase: "level-complete", levelId: 1 });
    expect(levelSelect).toEqual({ phase: "level-select" });
  });

  it("keeps the next level locked until a future part implements it", () => {
    expect(getNextGameFlowState({ phase: "next-level-locked", levelId: 2 })).toEqual({
      phase: "next-level-locked",
      levelId: 2
    });
  });

  it("routes returning player default action to level select", async () => {
    const { getTitleDefaultState } = await import("../game/systems/GameFlow");

    expect(getTitleDefaultState(false)).toEqual({ phase: "opening-case-file" });
    expect(getTitleDefaultState(true)).toEqual({ phase: "level-select" });
  });

  it("routes level select choices to replay or coming soon", async () => {
    const { getLevelSelectChoiceState } = await import("../game/systems/GameFlow");

    expect(getLevelSelectChoiceState(1, true)).toEqual({ phase: "platformer-level", levelId: 1 });
    expect(getLevelSelectChoiceState(2, false)).toEqual({ phase: "next-level-locked", levelId: 2 });
    expect(getLevelSelectChoiceState(2, true)).toEqual({ phase: "platformer-level", levelId: 2 });
    expect(getLevelSelectChoiceState(3, false)).toEqual({ phase: "next-level-locked", levelId: 3 });
    expect(getLevelSelectChoiceState(3, true)).toEqual({ phase: "platformer-level", levelId: 3 });
    expect(getLevelSelectChoiceState(4, false)).toEqual({ phase: "next-level-locked", levelId: 4 });
    expect(getLevelSelectChoiceState(4, true)).toEqual({ phase: "platformer-level", levelId: 4 });
    expect(getLevelSelectChoiceState(5, false)).toEqual({ phase: "next-level-locked", levelId: 5 });
    expect(getLevelSelectChoiceState(5, true)).toEqual({ phase: "platformer-level", levelId: 5 });
    expect(getLevelSelectChoiceState(6, false)).toEqual({ phase: "next-level-locked", levelId: 6 });
    expect(getLevelSelectChoiceState(6, true)).toEqual({ phase: "platformer-level", levelId: 6 });
    expect(getLevelSelectChoiceState(7, false)).toEqual({ phase: "next-level-locked", levelId: 7 });
    expect(getLevelSelectChoiceState(7, true)).toEqual({ phase: "platformer-level", levelId: 7 });
    expect(getLevelSelectChoiceState(8, false)).toEqual({ phase: "next-level-locked", levelId: 8 });
    expect(getLevelSelectChoiceState(8, true)).toEqual({ phase: "platformer-level", levelId: 8 });
    expect(getLevelSelectChoiceState(9, false)).toEqual({ phase: "next-level-locked", levelId: 9 });
    expect(getLevelSelectChoiceState(9, true)).toEqual({ phase: "platformer-level", levelId: 9 });
    expect(getLevelSelectChoiceState(10, false)).toEqual({ phase: "next-level-locked", levelId: 10 });
    expect(getLevelSelectChoiceState(10, true)).toEqual({ phase: "platformer-level", levelId: 10 });
  });

  it("routes Level 2 platformer completion to Puzzle Level 2", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 2 })).toEqual({ phase: "puzzle", levelId: 2 });
  });

  it("routes Level 2 puzzle solved to Evidence Reveal Level 2", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 2 })).toEqual({ phase: "evidence-reveal", levelId: 2 });
  });

  it("routes Level 2 placeholder puzzle back to level select without completing it", () => {
    expect(getPuzzlePlaceholderExitState(2)).toEqual({ phase: "level-select" });
  });

  it("routes Level 3 platformer completion to the placeholder Puzzle Level 3", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 3 })).toEqual({ phase: "puzzle", levelId: 3 });
  });

  it("routes Level 3 puzzle solved to Evidence Reveal Level 3", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 3 })).toEqual({ phase: "evidence-reveal", levelId: 3 });
  });

  it("routes Level 4 platformer completion to Puzzle Level 4", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 4 })).toEqual({ phase: "puzzle", levelId: 4 });
  });

  it("routes Level 4 puzzle solved to Evidence Reveal Level 4", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 4 })).toEqual({ phase: "evidence-reveal", levelId: 4 });
  });

  it("routes Level 5 platformer completion to Puzzle Level 5", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 5 })).toEqual({ phase: "puzzle", levelId: 5 });
  });

  it("routes future placeholder puzzles back to level select without completing them", () => {
    expect(getPuzzlePlaceholderExitState(8)).toEqual({ phase: "level-select" });
  });

  it("routes Level 5 puzzle solved to Evidence Reveal Level 5", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 5 })).toEqual({ phase: "evidence-reveal", levelId: 5 });
  });

  it("routes Level 6 platformer completion to Puzzle Level 6", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 6 })).toEqual({ phase: "puzzle", levelId: 6 });
  });

  it("routes Level 6 placeholder puzzle back to level select without completing it", () => {
    expect(getPuzzlePlaceholderExitState(6)).toEqual({ phase: "level-select" });
  });

  it("routes Level 6 puzzle solved to Evidence Reveal Level 6", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 6 })).toEqual({ phase: "evidence-reveal", levelId: 6 });
  });

  it("routes Level 7 platformer completion to Puzzle Level 7", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 7 })).toEqual({ phase: "puzzle", levelId: 7 });
  });

  it("routes Level 7 puzzle solved to Evidence Reveal Level 7", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 7 })).toEqual({ phase: "evidence-reveal", levelId: 7 });
  });

  it("routes Level 8 platformer completion to Puzzle Level 8", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 8 })).toEqual({ phase: "puzzle", levelId: 8 });
  });

  it("routes Level 8 placeholder puzzle back to level select without completing it", () => {
    expect(getPuzzlePlaceholderExitState(8)).toEqual({ phase: "level-select" });
  });

  it("routes Level 8 puzzle solved to Evidence Reveal Level 8", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 8 })).toEqual({ phase: "evidence-reveal", levelId: 8 });
  });

  it("routes Level 9 platformer completion to Puzzle Level 9", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 9 })).toEqual({ phase: "puzzle", levelId: 9 });
  });

  it("routes Level 9 puzzle solved to Evidence Reveal Level 9", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 9 })).toEqual({ phase: "evidence-reveal", levelId: 9 });
  });

  it("routes Level 9 evidence reveal back toward level select, not the final verdict", () => {
    expect(getNextGameFlowState({ phase: "evidence-reveal", levelId: 9 })).toEqual({ phase: "level-complete", levelId: 9 });
  });

  it("routes Level 10 platformer completion to Puzzle Level 10", () => {
    expect(getNextGameFlowState({ phase: "platformer-level", levelId: 10 })).toEqual({ phase: "puzzle", levelId: 10 });
  });

  it("routes Level 10 puzzle solved to the final verdict", () => {
    expect(getNextGameFlowState({ phase: "puzzle", levelId: 10 })).toEqual({ phase: "final-verdict" });
  });

  it("keeps placeholder exit helper safe for unsupported future puzzles", () => {
    expect(getPuzzlePlaceholderExitState(10)).toEqual({ phase: "level-select" });
  });

  it("routes the final evidence reveal to the final verdict", () => {
    expect(getNextGameFlowState({ phase: "evidence-reveal", levelId: 10 })).toEqual({ phase: "final-verdict" });
  });

  it("routes accepted final verdict to game completion and then level select", () => {
    const completed = getNextGameFlowState({ phase: "final-verdict" });

    expect(completed).toEqual({ phase: "game-complete" });
    expect(getNextGameFlowState(completed)).toEqual({ phase: "level-select" });
  });

  it("can describe the future flow for a specific level", () => {
    expect(getLevelFlowStates(4)).toEqual([
      { phase: "platformer-level", levelId: 4 },
      { phase: "puzzle", levelId: 4 },
      { phase: "evidence-reveal", levelId: 4 }
    ]);
  });
});
