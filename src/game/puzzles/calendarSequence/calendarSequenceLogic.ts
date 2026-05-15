import { isOrderCorrect, moveItemDown, moveItemUp } from "../shared/orderPuzzleLogic";
import type {
  CalendarSequenceResult,
  CalendarSequenceState,
  CalendarSequenceTask,
  CalendarSequenceTaskId
} from "./calendarSequenceTypes";

export const CALENDAR_SEQUENCE_TASKS: readonly CalendarSequenceTask[] = [
  {
    id: "prepare-facts",
    title: "Prepare the facts",
    description: "Understand what truly happened."
  },
  {
    id: "review-evidence",
    title: "Review the evidence",
    description: "Check what supports the story."
  },
  {
    id: "submit-deadline",
    title: "Submit before deadline",
    description: "Act with calm precision."
  },
  {
    id: "close-note",
    title: "Close the case note",
    description: "Leave the file clear for tomorrow."
  }
] as const;

export const CORRECT_CALENDAR_SEQUENCE_ORDER: readonly CalendarSequenceTaskId[] = [
  "prepare-facts",
  "review-evidence",
  "submit-deadline",
  "close-note"
] as const;

const INITIAL_CALENDAR_SEQUENCE_ORDER: readonly CalendarSequenceTaskId[] = [
  "review-evidence",
  "prepare-facts",
  "close-note",
  "submit-deadline"
] as const;

export const CALENDAR_SEQUENCE_COPY = {
  title: "Case Review: The Golden Stamp",
  instruction: "Put Maria's case tasks in the order that turns pressure into clarity.",
  submit: "Submit Schedule",
  reset: "Reset Order",
  wrong: "The timing is close, but the case needs a calmer order.",
  success: "Deadline met.",
  reveal: "Maria carries responsibility with grace.",
  followUp: "Even when the city moves fast, she knows what matters first."
} as const;

export function createCalendarSequenceState(): CalendarSequenceState {
  return {
    tasks: CALENDAR_SEQUENCE_TASKS.map((task) => ({ ...task })),
    currentOrder: [...INITIAL_CALENDAR_SEQUENCE_ORDER],
    solved: false,
    attempts: 0
  };
}

export function moveCalendarTaskUp(state: CalendarSequenceState, taskId: CalendarSequenceTaskId): CalendarSequenceState {
  return {
    ...cloneState(state),
    currentOrder: moveItemUp(state.currentOrder, taskId),
    solved: false
  };
}

export function moveCalendarTaskDown(state: CalendarSequenceState, taskId: CalendarSequenceTaskId): CalendarSequenceState {
  return {
    ...cloneState(state),
    currentOrder: moveItemDown(state.currentOrder, taskId),
    solved: false
  };
}

export function resetCalendarSequenceState(): CalendarSequenceState {
  return createCalendarSequenceState();
}

export function isCalendarSequenceCorrect(state: Pick<CalendarSequenceState, "currentOrder">): boolean {
  return isOrderCorrect(state.currentOrder, CORRECT_CALENDAR_SEQUENCE_ORDER);
}

export function submitCalendarSequence(state: CalendarSequenceState): {
  state: CalendarSequenceState;
  result: CalendarSequenceResult;
} {
  const solved = isCalendarSequenceCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? CALENDAR_SEQUENCE_COPY.success : CALENDAR_SEQUENCE_COPY.wrong
    }
  };
}

export function getOrderedCalendarTasks(state: CalendarSequenceState): CalendarSequenceTask[] {
  return state.currentOrder.map((taskId) => {
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) {
      throw new Error(`Unknown calendar-sequence task: ${taskId}`);
    }

    return { ...task };
  });
}

function cloneState(state: CalendarSequenceState): CalendarSequenceState {
  return {
    tasks: state.tasks.map((task) => ({ ...task })),
    currentOrder: [...state.currentOrder],
    solved: state.solved,
    attempts: state.attempts
  };
}
