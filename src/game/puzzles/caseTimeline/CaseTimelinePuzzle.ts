import {
  checkCaseTimelineAnswer,
  createInitialCaseTimelineState,
  getCaseTimelineProgress,
  getOrderedSlots,
  placeSelectedTaskInSlot,
  removeTaskFromSlot,
  resetCaseTimeline,
  selectTask
} from "./caseTimelineLogic";
import {
  escapeHtml,
  getPlacedTask,
  getSlotStateClass,
  getTrayTasks,
  isTimelineSegmentLit,
  renderTaskIcon
} from "./caseTimelineRenderer";
import type { CaseTimelineSpec, CaseTimelineState, TimelineSlot, TimelineTask } from "./caseTimelineTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface CaseTimelinePuzzleOptions {
  spec: CaseTimelineSpec;
  onSolved: () => void;
}

export class CaseTimelinePuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: CaseTimelineSpec;
  private state: CaseTimelineState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: CaseTimelinePuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialCaseTimelineState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "case-timeline-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.destroyDragDrop?.();
    this.destroyDragDrop = null;
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.destroyDragDrop?.();
    this.destroyDragDrop = null;

    const progress = getCaseTimelineProgress(this.spec, this.state);
    const selectedTask = this.state.selectedTaskId
      ? this.spec.tasks.find((task) => task.id === this.state.selectedTaskId)
      : undefined;

    this.root.innerHTML = `
      <section class="puzzle-panel case-timeline-panel">
        <div class="case-timeline-heading">
          <p class="puzzle-kicker">Case Timeline</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-timeline-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <section class="case-timeline-board${this.state.solved ? " is-solved" : ""}" aria-label="Golden tram timeline">
          <div class="case-timeline-stamp" aria-hidden="true">SCHEDULE SEALED</div>
          <div class="case-timeline-rail" data-testid="case-timeline-rail">
            ${this.renderRailStops()}
          </div>
        </section>

        <section class="case-timeline-tray" aria-label="Case task tray">
          <div class="case-timeline-tray-header">
            <h2>Task Tray</h2>
            <p>${selectedTask ? `Selected: ${escapeHtml(selectedTask.label)}` : "Drag a task to a stop, or tap task then stop."}</p>
          </div>
          <div class="case-timeline-task-list" data-drop-id="tray" data-testid="case-timeline-tray-drop">
            ${getTrayTasks(this.spec, this.state).map((task) => this.renderTrayTask(task)).join("")}
          </div>
        </section>

        <div class="case-timeline-progress" data-testid="case-timeline-progress" aria-live="polite">
          <p>Placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong></p>
          <p>In order: <strong>${progress.correctCount} / ${progress.totalCount}</strong></p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-case-timeline">Reset Timeline</button>
          <button type="button" class="primary-button" data-testid="submit-case-timeline">Stamp Schedule</button>
        </div>
        <p class="puzzle-feedback" data-testid="case-timeline-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderRailStops(): string {
    return getOrderedSlots(this.spec)
      .map((slot, index) => {
        const task = getPlacedTask(this.spec, this.state, slot.id);
        const nextSegment =
          index < this.spec.slots.length - 1
            ? `<span class="case-timeline-segment${isTimelineSegmentLit(this.spec, this.state, index) ? " is-lit" : ""}" aria-hidden="true"></span>`
            : "";

        return `
          <div class="case-timeline-stop-wrap">
            ${this.renderSlot(slot, task)}
          </div>
          ${nextSegment}
        `;
      })
      .join("");
  }

  private renderSlot(slot: TimelineSlot, task: TimelineTask | undefined): string {
    return `
      <button
        type="button"
        class="case-timeline-slot${getSlotStateClass(this.spec, this.state, slot)}"
        data-slot-id="${escapeHtml(slot.id)}"
        data-drop-id="${escapeHtml(slot.id)}"
        data-testid="case-timeline-slot-${escapeHtml(slot.id)}"
        aria-label="${escapeHtml(slot.label)} timeline stop"
      >
        <span class="case-timeline-stop-label">${escapeHtml(slot.label)}</span>
        ${
          task
            ? this.renderPlacedTask(task)
            : `<span class="case-timeline-empty">Awaiting task</span>`
        }
      </button>
    `;
  }

  private renderTrayTask(task: TimelineTask): string {
    return `
      <button
        type="button"
        class="case-timeline-task${this.state.selectedTaskId === task.id ? " is-selected" : ""}"
        data-task-id="${escapeHtml(task.id)}"
        data-drag-id="${escapeHtml(task.id)}"
        data-testid="case-timeline-task-${escapeHtml(task.id)}"
        aria-pressed="${this.state.selectedTaskId === task.id}"
      >
        ${renderTaskIcon(task)}
        <span class="case-timeline-task-copy">
          <strong>${escapeHtml(task.label)}</strong>
          <span>${escapeHtml(task.description)}</span>
        </span>
      </button>
    `;
  }

  private renderPlacedTask(task: TimelineTask): string {
    return `
      <span
        class="case-timeline-placed-task${this.state.selectedTaskId === task.id ? " is-selected" : ""}"
        data-task-id="${escapeHtml(task.id)}"
        data-drag-id="${escapeHtml(task.id)}"
      >
        ${renderTaskIcon(task)}
        <span class="case-timeline-task-copy">
          <strong>${escapeHtml(task.label)}</strong>
          <span>${escapeHtml(task.description)}</span>
        </span>
      </span>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-task-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const taskId = button.dataset.taskId;
        if (!taskId) {
          return;
        }

        if (button.closest(".case-timeline-slot")) {
          return;
        }

        this.state = selectTask(this.state, taskId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const slotId = button.dataset.slotId;
        if (!slotId) {
          return;
        }

        if (this.state.selectedTaskId) {
          this.state = placeSelectedTaskInSlot(this.spec, this.state, slotId);
          this.render(onSolved);
          return;
        }

        const placedTaskId = this.state.placedTasksBySlotId[slotId];
        if (!placedTaskId) {
          return;
        }

        this.state = removeTaskFromSlot(this.spec, this.state, slotId);
        this.state = selectTask(this.state, placedTaskId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-case-timeline"]')?.addEventListener("click", () => {
      this.state = resetCaseTimeline(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-case-timeline"]')?.addEventListener("click", () => {
      const result = checkCaseTimelineAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }

  private bindDragDrop(onSolved: () => void): void {
    this.destroyDragDrop = createPointerDragDrop({
      root: this.root,
      draggableSelector: "[data-drag-id]",
      dropTargetSelector: "[data-drop-id]",
      dragDataAttribute: "dragId",
      dropDataAttribute: "dropId",
      onDrop: (taskId, dropId) => {
        this.handleDraggedTaskDrop(taskId, dropId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedTaskDrop(taskId: string, dropId: string | null): void {
    if (!dropId) {
      return;
    }

    if (dropId === "tray") {
      this.state = this.removeTaskById(taskId);
      return;
    }

    this.state = selectTask(this.state, taskId);
    this.state = placeSelectedTaskInSlot(this.spec, this.state, dropId);
  }

  private removeTaskById(taskId: string): CaseTimelineState {
    const slotId = Object.entries(this.state.placedTasksBySlotId).find(([, placedTaskId]) => placedTaskId === taskId)?.[0];
    if (!slotId) {
      return this.state;
    }

    return removeTaskFromSlot(this.spec, this.state, slotId);
  }
}
