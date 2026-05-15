import { describe, expect, it } from "vitest";
import { LEVEL_TWO_CASE_TIMELINE_SPEC, getCaseTimelineSpec } from "../game/puzzles/caseTimeline/caseTimelineContent";
import {
  checkCaseTimelineAnswer,
  createInitialCaseTimelineState,
  getCaseTimelineProgress,
  isCaseTimelineSolved,
  placeSelectedTaskInSlot,
  removeTaskFromSlot,
  resetCaseTimeline,
  selectTask,
  swapTasks
} from "../game/puzzles/caseTimeline/caseTimelineLogic";

describe("Case Timeline puzzle logic", () => {
  it("initial state has 4 tray tasks", () => {
    const state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);

    expect(state.trayTaskIds).toEqual(LEVEL_TWO_CASE_TIMELINE_SPEC.initialTrayOrder);
  });

  it("initial state has empty timeline slots", () => {
    const state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);

    expect(state.placedTasksBySlotId).toEqual({});
  });

  it("selecting a task stores selectedTaskId", () => {
    const state = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");

    expect(state.selectedTaskId).toBe("read-case");
  });

  it("placing selected task into empty slot works", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");

    expect(placed.placedTasksBySlotId.start).toBe("read-case");
    expect(placed.selectedTaskId).toBeNull();
  });

  it("placing selected task removes it from tray", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");

    expect(placed.trayTaskIds).not.toContain("read-case");
  });

  it("placing into occupied slot replaces safely from tray", () => {
    const readSelected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const readPlaced = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, readSelected, "start");
    const checkSelected = selectTask(readPlaced, "check-evidence");
    const replaced = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, checkSelected, "start");

    expect(replaced.placedTasksBySlotId.start).toBe("check-evidence");
    expect(replaced.trayTaskIds).toContain("read-case");
    expect(replaced.trayTaskIds).not.toContain("check-evidence");
  });

  it("task cannot exist in two slots", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");
    const selectedAgain = selectTask(placed, "read-case");
    const moved = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selectedAgain, "review");

    expect(moved.placedTasksBySlotId.start).toBeUndefined();
    expect(moved.placedTasksBySlotId.review).toBe("read-case");
    expect(Object.values(moved.placedTasksBySlotId).filter((taskId) => taskId === "read-case")).toHaveLength(1);
  });

  it("moving a placed task into an occupied slot swaps tasks", () => {
    let state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);
    state = selectTask(state, "read-case");
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "start");
    state = selectTask(state, "check-evidence");
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "review");
    state = selectTask(state, "read-case");
    const swapped = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "review");

    expect(swapped.placedTasksBySlotId.review).toBe("read-case");
    expect(swapped.placedTasksBySlotId.start).toBe("check-evidence");
  });

  it("explicit slot swap swaps tasks", () => {
    let state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);
    state = selectTask(state, "read-case");
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "start");
    state = selectTask(state, "check-evidence");
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "review");
    const swapped = swapTasks(LEVEL_TWO_CASE_TIMELINE_SPEC, state, "start", "review");

    expect(swapped.placedTasksBySlotId.start).toBe("check-evidence");
    expect(swapped.placedTasksBySlotId.review).toBe("read-case");
  });

  it("remove task returns it to tray", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");
    const removed = removeTaskFromSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, placed, "start");

    expect(removed.placedTasksBySlotId.start).toBeUndefined();
    expect(removed.trayTaskIds).toContain("read-case");
  });

  it("incomplete timeline is not solved", () => {
    const result = checkCaseTimelineAnswer(
      LEVEL_TWO_CASE_TIMELINE_SPEC,
      createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC)
    );

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The ticket is not ready to reveal the path yet.");
  });

  it("wrong order is not solved", () => {
    const result = checkCaseTimelineAnswer(LEVEL_TWO_CASE_TIMELINE_SPEC, placeWrongCompleteTimeline());

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("wrong");
    expect(result.feedback).toBe("The ticket is not ready to reveal the path yet.");
  });

  it("correct sequence is solved", () => {
    const result = checkCaseTimelineAnswer(LEVEL_TWO_CASE_TIMELINE_SPEC, placeCorrectTimeline());

    expect(result.solved).toBe(true);
    expect(result.feedback).toContain("The route is sealed.");
    expect(result.feedback).toContain("A hidden wall appears on the stamped route.");
    expect(isCaseTimelineSolved(LEVEL_TWO_CASE_TIMELINE_SPEC, result.state)).toBe(true);
  });

  it("progress reports placed count", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");

    expect(getCaseTimelineProgress(LEVEL_TWO_CASE_TIMELINE_SPEC, placed).placedCount).toBe(1);
  });

  it("progress reports correct count", () => {
    const selected = selectTask(createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC), "read-case");
    const placed = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, selected, "start");

    expect(getCaseTimelineProgress(LEVEL_TWO_CASE_TIMELINE_SPEC, placed).correctCount).toBe(1);
  });

  it("reset restores scrambled tray and empty slots", () => {
    const solved = placeCorrectTimeline();
    const reset = resetCaseTimeline(LEVEL_TWO_CASE_TIMELINE_SPEC);

    expect(Object.keys(solved.placedTasksBySlotId)).toHaveLength(4);
    expect(reset.trayTaskIds).toEqual(LEVEL_TWO_CASE_TIMELINE_SPEC.initialTrayOrder);
    expect(reset.placedTasksBySlotId).toEqual({});
  });
});

describe("Level 2 Case Timeline content", () => {
  it("has 4 slots and 4 tasks", () => {
    const spec = getCaseTimelineSpec(2);

    expect(spec?.slots).toHaveLength(4);
    expect(spec?.tasks).toHaveLength(4);
  });

  it("uses the Read -> Check -> Prepare -> Submit sequence", () => {
    expect(LEVEL_TWO_CASE_TIMELINE_SPEC.correctSequence).toEqual([
      "read-case",
      "check-evidence",
      "prepare-note",
      "submit-deadline"
    ]);
  });
});

function placeCorrectTimeline() {
  let state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);
  const placements = [
    { taskId: "read-case", slotId: "start" },
    { taskId: "check-evidence", slotId: "review" },
    { taskId: "prepare-note", slotId: "prepare" },
    { taskId: "submit-deadline", slotId: "submit" }
  ];

  for (const placement of placements) {
    state = selectTask(state, placement.taskId);
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, placement.slotId);
  }

  return state;
}

function placeWrongCompleteTimeline() {
  let state = createInitialCaseTimelineState(LEVEL_TWO_CASE_TIMELINE_SPEC);
  const placements = [
    { taskId: "check-evidence", slotId: "start" },
    { taskId: "read-case", slotId: "review" },
    { taskId: "prepare-note", slotId: "prepare" },
    { taskId: "submit-deadline", slotId: "submit" }
  ];

  for (const placement of placements) {
    state = selectTask(state, placement.taskId);
    state = placeSelectedTaskInSlot(LEVEL_TWO_CASE_TIMELINE_SPEC, state, placement.slotId);
  }

  return state;
}
