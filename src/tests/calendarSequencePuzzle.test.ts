import { describe, expect, it } from "vitest";
import {
  CORRECT_CALENDAR_SEQUENCE_ORDER,
  createCalendarSequenceState,
  getOrderedCalendarTasks,
  isCalendarSequenceCorrect,
  moveCalendarTaskDown,
  moveCalendarTaskUp,
  resetCalendarSequenceState,
  submitCalendarSequence
} from "../game/puzzles/calendarSequence/calendarSequenceLogic";
import type { CalendarSequenceTaskId } from "../game/puzzles/calendarSequence/calendarSequenceTypes";

describe("calendar-sequence puzzle logic", () => {
  it("starts with four tasks", () => {
    const state = createCalendarSequenceState();

    expect(state.tasks).toHaveLength(4);
    expect(getOrderedCalendarTasks(state).map((task) => task.id)).toEqual([
      "review-evidence",
      "prepare-facts",
      "close-note",
      "submit-deadline"
    ]);
  });

  it("defines the correct order", () => {
    expect(CORRECT_CALENDAR_SEQUENCE_ORDER).toEqual([
      "prepare-facts",
      "review-evidence",
      "submit-deadline",
      "close-note"
    ]);
  });

  it("does not solve a wrong order", () => {
    const result = submitCalendarSequence(createCalendarSequenceState());

    expect(result.result.solved).toBe(false);
    expect(result.state.solved).toBe(false);
  });

  it("moves a task up", () => {
    const state = moveCalendarTaskUp(createCalendarSequenceState(), "prepare-facts");

    expect(state.currentOrder).toEqual(["prepare-facts", "review-evidence", "close-note", "submit-deadline"]);
  });

  it("moves a task down", () => {
    const state = moveCalendarTaskDown(createCalendarSequenceState(), "review-evidence");

    expect(state.currentOrder).toEqual(["prepare-facts", "review-evidence", "close-note", "submit-deadline"]);
  });

  it("does not move the first task up", () => {
    const initial = createCalendarSequenceState();
    const state = moveCalendarTaskUp(initial, "review-evidence");

    expect(state.currentOrder).toEqual(initial.currentOrder);
  });

  it("does not move the last task down", () => {
    const initial = createCalendarSequenceState();
    const state = moveCalendarTaskDown(initial, "submit-deadline");

    expect(state.currentOrder).toEqual(initial.currentOrder);
  });

  it("reset restores the initial order", () => {
    const moved = moveCalendarTaskUp(createCalendarSequenceState(), "prepare-facts");
    const reset = resetCalendarSequenceState();

    expect(moved.currentOrder).not.toEqual(reset.currentOrder);
    expect(reset.currentOrder).toEqual(["review-evidence", "prepare-facts", "close-note", "submit-deadline"]);
  });

  it("detects solved state only when correct", () => {
    const wrong = createCalendarSequenceState();
    const correct = {
      ...wrong,
      currentOrder: [
        "prepare-facts",
        "review-evidence",
        "submit-deadline",
        "close-note"
      ] satisfies CalendarSequenceTaskId[]
    };

    expect(isCalendarSequenceCorrect(wrong)).toBe(false);
    expect(isCalendarSequenceCorrect(correct)).toBe(true);
    expect(submitCalendarSequence(correct).state.solved).toBe(true);
  });
});
