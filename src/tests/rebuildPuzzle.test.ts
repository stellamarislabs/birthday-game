import { describe, expect, it } from "vitest";
import { LEVEL_THREE_REBUILD_PUZZLE_SPEC, getRebuildPuzzleSpec } from "../game/puzzles/rebuildPuzzle/rebuildPuzzleContent";
import {
  activateWallMark,
  checkRebuildPuzzleAnswer,
  createInitialRebuildPuzzleState,
  getRebuildPuzzleProgress,
  isRebuildPuzzleSolved,
  resetRebuildPuzzle,
  selectKey,
  useKeyOnWall
} from "../game/puzzles/rebuildPuzzle/rebuildPuzzleLogic";

describe("Chapter 2 hidden wall clue interaction logic", () => {
  it("starts locked and unsolved", () => {
    const state = createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC);

    expect(state.keySelected).toBe(false);
    expect(state.keyTurned).toBe(false);
    expect(state.activatedMarkIds).toEqual([]);
    expect(state.waveMarkRevealed).toBe(false);
    expect(state.solved).toBe(false);
  });

  it("selects the brass key", () => {
    const state = selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC));

    expect(state.keySelected).toBe(true);
    expect(state.keyTurned).toBe(false);
  });

  it("does not turn the wall keyhole before the key is selected", () => {
    const state = useKeyOnWall(LEVEL_THREE_REBUILD_PUZZLE_SPEC, createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC));

    expect(state.keyTurned).toBe(false);
    expect(state.feedback).toBe("The wall is still closed.");
  });

  it("turns the key in the hidden wall", () => {
    const selected = selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC));
    const unlocked = useKeyOnWall(LEVEL_THREE_REBUILD_PUZZLE_SPEC, selected);

    expect(unlocked.keySelected).toBe(false);
    expect(unlocked.keyTurned).toBe(true);
    expect(unlocked.feedback).toBe("The key turns in the hidden wall.");
  });

  it("wall marks cannot complete before the key is used", () => {
    const state = activateWallMark(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC),
      "upper-crack"
    );

    expect(state.activatedMarkIds).toEqual([]);
    expect(state.solved).toBe(false);
    expect(state.feedback).toBe("The wall is still closed.");
  });

  it("tapping required marks reveals the wave mark and solves the interaction", () => {
    let state = useKeyOnWall(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC))
    );

    for (const mark of LEVEL_THREE_REBUILD_PUZZLE_SPEC.wallMarks) {
      state = activateWallMark(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state, mark.id);
    }

    expect(state.activatedMarkIds).toHaveLength(3);
    expect(state.waveMarkRevealed).toBe(true);
    expect(state.solved).toBe(true);
    expect(state.feedback).toContain("The wall remembers the river.");
    expect(state.feedback).toContain("A wave mark points to the Vistula.");
  });

  it("submit remains incomplete until the wave mark appears", () => {
    const unlocked = useKeyOnWall(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC))
    );
    const result = checkRebuildPuzzleAnswer(LEVEL_THREE_REBUILD_PUZZLE_SPEC, unlocked);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The wall is still closed.");
  });

  it("solves only after the wave mark appears", () => {
    let state = useKeyOnWall(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC))
    );
    for (const mark of LEVEL_THREE_REBUILD_PUZZLE_SPEC.wallMarks) {
      state = activateWallMark(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state, mark.id);
    }
    const result = checkRebuildPuzzleAnswer(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state);

    expect(result.solved).toBe(true);
    expect(result.reason).toBe("correct");
    expect(isRebuildPuzzleSolved(LEVEL_THREE_REBUILD_PUZZLE_SPEC, result.state)).toBe(true);
  });

  it("reset returns to the locked state", () => {
    const reset = resetRebuildPuzzle(LEVEL_THREE_REBUILD_PUZZLE_SPEC);

    expect(reset.keySelected).toBe(false);
    expect(reset.keyTurned).toBe(false);
    expect(reset.activatedMarkIds).toEqual([]);
    expect(reset.waveMarkRevealed).toBe(false);
    expect(reset.solved).toBe(false);
  });

  it("progress reports wall mark count", () => {
    let state = useKeyOnWall(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC))
    );
    state = activateWallMark(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state, "upper-crack");
    const progress = getRebuildPuzzleProgress(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state);

    expect(progress.markCount).toBe(1);
    expect(progress.requiredMarkCount).toBe(3);
    expect(progress.currentStep).toBe("unlocked");
  });

  it("does not require six-piece rotation repair for active Chapter 2 solving", () => {
    let state = useKeyOnWall(
      LEVEL_THREE_REBUILD_PUZZLE_SPEC,
      selectKey(createInitialRebuildPuzzleState(LEVEL_THREE_REBUILD_PUZZLE_SPEC))
    );
    for (const mark of LEVEL_THREE_REBUILD_PUZZLE_SPEC.wallMarks) {
      state = activateWallMark(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state, mark.id);
    }

    expect(Object.keys(state.placedPiecesBySlot)).toHaveLength(0);
    expect(checkRebuildPuzzleAnswer(LEVEL_THREE_REBUILD_PUZZLE_SPEC, state).solved).toBe(true);
  });
});

describe("Level 3 hidden wall clue interaction content", () => {
  it("uses keyhole and wall mark copy", () => {
    const spec = getRebuildPuzzleSpec(3);

    expect(spec?.title).toBe("The Hidden Wall");
    expect(spec?.instruction).toBe("Use the brass key, then open the wall.");
    expect(spec?.successText).toBe("The wall remembers the river.");
    expect(spec?.wallMarks).toHaveLength(3);
  });

  it("keeps legacy repair data available without making it active", () => {
    expect(LEVEL_THREE_REBUILD_PUZZLE_SPEC.pieces).toHaveLength(6);
  });
});
