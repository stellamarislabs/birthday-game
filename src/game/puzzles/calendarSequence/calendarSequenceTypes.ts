export type CalendarSequenceTaskId = "prepare-facts" | "review-evidence" | "submit-deadline" | "close-note";

export interface CalendarSequenceTask {
  id: CalendarSequenceTaskId;
  title: string;
  description: string;
}

export interface CalendarSequenceState {
  tasks: CalendarSequenceTask[];
  currentOrder: CalendarSequenceTaskId[];
  solved: boolean;
  attempts: number;
}

export interface CalendarSequenceResult {
  solved: boolean;
  feedback: string;
}
