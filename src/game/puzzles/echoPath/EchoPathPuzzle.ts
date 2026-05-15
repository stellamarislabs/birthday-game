import {
  checkEchoPathAnswer,
  createInitialEchoPathState,
  isCorrectQuestionPlaced,
  placeKeyOnDoor,
  placeQuestionInSlot,
  removeQuestionFromSlot,
  resetEchoPath,
  selectKey,
  selectQuestion
} from "./echoPathLogic";
import {
  escapeHtml,
  getDoorStateClass,
  getQuestionStateClass
} from "./echoPathRenderer";
import type { EchoDoor, EchoPathSpec, EchoPathState, EchoQuestion } from "./echoPathTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface EchoPathPuzzleOptions {
  spec: EchoPathSpec;
  onSolved: () => void;
}

export class EchoPathPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: EchoPathSpec;
  private state: EchoPathState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: EchoPathPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialEchoPathState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "echo-path-puzzle";
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

    const placedQuestion = this.state.placedQuestionId
      ? this.spec.questions.find((question) => question.id === this.state.placedQuestionId)
      : undefined;

    this.root.innerHTML = `
      <section class="puzzle-panel echo-path-panel">
        <div class="echo-path-heading">
          <p class="puzzle-kicker">Echo Path</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="echo-path-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="echo-path-play-area${this.state.solved ? " is-solved" : ""}">
          <section class="echo-prompt-card" data-testid="echo-path-prompt">
            <span>Echo Prompt</span>
            <p>${escapeHtml(this.spec.prompt)}</p>
          </section>

          <section class="echo-question-stage" aria-label="Question slot">
            <button
              type="button"
              class="echo-question-slot${placedQuestion ? " is-filled" : ""}${isCorrectQuestionPlaced(this.spec, this.state) ? " is-correct" : ""}"
              data-drop-id="question-slot"
              data-testid="echo-question-slot"
            >
              ${placedQuestion ? this.renderPlacedQuestion(placedQuestion) : `<span class="echo-slot-empty">Place one question here</span>`}
            </button>
            <div class="echo-question-tray" data-testid="echo-question-tray" aria-label="Question tiles">
              ${this.spec.questions.map((question) => this.renderQuestion(question)).join("")}
            </div>
          </section>

          <section class="echo-door-stage" aria-label="Courthouse doors">
            ${this.spec.doors.map((door) => this.renderDoor(door)).join("")}
          </section>

          <section class="echo-key-stage" aria-label="Silver Key">
            <button
              type="button"
              class="echo-key-token${this.state.selectedKey ? " is-selected" : ""}${this.state.keyPlacedDoorId ? " is-placed" : ""}"
              data-drag-id="silver-key"
              data-testid="echo-key-token"
              aria-pressed="${this.state.selectedKey}"
            >
              <span class="echo-key-icon" aria-hidden="true"></span>
              <span>${escapeHtml(this.spec.keyLabel)}</span>
            </button>
            <p>${this.state.keyPlacedDoorId ? "The key has reached the right door." : "Drag the key to a glowing door, or tap key then door."}</p>
            ${this.renderSuccessReveal()}
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-echo-path">Reset Echo</button>
          <button type="button" class="primary-button" data-testid="submit-echo-path">Open Door</button>
        </div>
        <p class="puzzle-feedback" data-testid="echo-path-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderQuestion(question: EchoQuestion): string {
    if (this.state.placedQuestionId === question.id) {
      return "";
    }

    return `
      <button
        type="button"
        class="echo-question-tile${getQuestionStateClass(this.state, question)}"
        data-question-id="${escapeHtml(question.id)}"
        data-drag-id="${escapeHtml(question.id)}"
        data-testid="echo-question-${escapeHtml(question.id)}"
        aria-pressed="${this.state.selectedQuestionId === question.id}"
      >
        <strong>${escapeHtml(question.text)}</strong>
        <span>${escapeHtml(question.description)}</span>
      </button>
    `;
  }

  private renderPlacedQuestion(question: EchoQuestion): string {
    return `
      <span
        class="echo-placed-question${this.state.selectedQuestionId === question.id ? " is-selected" : ""}"
        data-question-id="${escapeHtml(question.id)}"
        data-drag-id="${escapeHtml(question.id)}"
      >
        <strong>${escapeHtml(question.text)}</strong>
        <span>${escapeHtml(question.description)}</span>
      </span>
    `;
  }

  private renderDoor(door: EchoDoor): string {
    return `
      <button
        type="button"
        class="echo-door${getDoorStateClass(this.spec, this.state, door)}"
        data-door-id="${escapeHtml(door.id)}"
        data-drop-id="door-${escapeHtml(door.id)}"
        data-testid="echo-door-${escapeHtml(door.id)}"
      >
        <span class="echo-door-arch" aria-hidden="true"></span>
        <span>${escapeHtml(door.label)}</span>
      </button>
    `;
  }

  private renderSuccessReveal(): string {
    if (!this.state.solved) {
      return `
        <div class="echo-success-reveal is-waiting" data-testid="echo-success-reveal">
          <span>Lantern and ribbon wait beyond Trust.</span>
        </div>
      `;
    }

    return `
      <div class="echo-success-reveal is-lit" data-testid="echo-success-reveal">
        ${this.spec.successRevealSteps.map((step) => `
          <span>
            <strong>${escapeHtml(step.label)}</strong>
            <em>${escapeHtml(step.detail)}</em>
          </span>
        `).join("")}
      </div>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-question-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const questionId = button.dataset.questionId;
        if (!questionId) {
          return;
        }

        this.state = selectQuestion(this.state, questionId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="echo-question-slot"]')?.addEventListener("click", () => {
      if (this.state.selectedQuestionId) {
        this.state = placeQuestionInSlot(this.spec, this.state, this.state.selectedQuestionId);
        this.render(onSolved);
        return;
      }

      if (this.state.placedQuestionId) {
        const placedQuestionId = this.state.placedQuestionId;
        this.state = removeQuestionFromSlot(this.state);
        this.state = selectQuestion(this.state, placedQuestionId);
        this.render(onSolved);
      }
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="echo-key-token"]')?.addEventListener("click", () => {
      this.state = selectKey(this.state);
      this.render(onSolved);
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-door-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const doorId = button.dataset.doorId;
        if (!doorId || !this.state.selectedKey) {
          return;
        }

        this.state = placeKeyOnDoor(this.spec, this.state, doorId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-echo-path"]')?.addEventListener("click", () => {
      this.state = resetEchoPath(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-echo-path"]')?.addEventListener("click", () => {
      const result = checkEchoPathAnswer(this.spec, this.state);
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
      onDrop: (dragId, dropId) => {
        this.handleDraggedDrop(dragId, dropId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedDrop(dragId: string, dropId: string | null): void {
    if (!dropId) {
      return;
    }

    if (dropId === "question-slot") {
      this.state = placeQuestionInSlot(this.spec, this.state, dragId);
      return;
    }

    if (dragId === "silver-key" && dropId.startsWith("door-")) {
      this.state = placeKeyOnDoor(this.spec, this.state, dropId.replace("door-", ""));
    }
  }
}
