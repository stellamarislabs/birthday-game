import {
  CALENDAR_SEQUENCE_COPY,
  createCalendarSequenceState,
  getOrderedCalendarTasks,
  moveCalendarTaskDown,
  moveCalendarTaskUp,
  resetCalendarSequenceState,
  submitCalendarSequence
} from "./calendarSequenceLogic";
import type { CalendarSequenceState, CalendarSequenceTaskId } from "./calendarSequenceTypes";

interface CalendarSequencePuzzleOptions {
  onSolved: () => void;
}

export class CalendarSequencePuzzle {
  private readonly root: HTMLDivElement;
  private state: CalendarSequenceState = createCalendarSequenceState();
  private feedbackText = "";

  constructor(options: CalendarSequencePuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "calendar-sequence-puzzle";
    this.root.setAttribute("aria-label", CALENDAR_SEQUENCE_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const orderedTasks = getOrderedCalendarTasks(this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel">
        <p class="puzzle-kicker">Calendar sequence</p>
        <h1>${CALENDAR_SEQUENCE_COPY.title}</h1>
        <p class="puzzle-instruction">${CALENDAR_SEQUENCE_COPY.instruction}</p>
        <ol class="document-card-list" data-testid="calendar-task-list">
          ${orderedTasks
            .map(
              (task, index) => `
                <li class="document-card" data-task-id="${task.id}" data-testid="calendar-task-${task.id}">
                  <div class="document-card-copy">
                    <strong>${task.title}</strong>
                    <span>${task.description}</span>
                  </div>
                  <div class="document-card-actions">
                    <button type="button" data-action="up" data-task-id="${task.id}" data-testid="move-up-${task.id}" ${
                      index === 0 ? "disabled" : ""
                    }>Up</button>
                    <button type="button" data-action="down" data-task-id="${task.id}" data-testid="move-down-${task.id}" ${
                      index === orderedTasks.length - 1 ? "disabled" : ""
                    }>Down</button>
                  </div>
                </li>
              `
            )
            .join("")}
        </ol>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-calendar-sequence">${CALENDAR_SEQUENCE_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-calendar-sequence">${CALENDAR_SEQUENCE_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="calendar-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const taskId = button.dataset.taskId as CalendarSequenceTaskId | undefined;
        if (!taskId) {
          return;
        }

        this.state =
          button.dataset.action === "up"
            ? moveCalendarTaskUp(this.state, taskId)
            : moveCalendarTaskDown(this.state, taskId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-calendar-sequence"]')?.addEventListener("click", () => {
      this.state = resetCalendarSequenceState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-calendar-sequence"]')?.addEventListener("click", () => {
      const submission = submitCalendarSequence(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
