import {
  CROSS_EXAMINATION_COPY,
  createCrossExaminationState,
  resetCrossExaminationState,
  selectCrossExaminationChoice,
  submitCrossExamination
} from "./crossExaminationLogic";
import type { CrossExaminationChoiceId, CrossExaminationState } from "./crossExaminationTypes";

interface CrossExaminationPuzzleOptions {
  onSolved: () => void;
}

export class CrossExaminationPuzzle {
  private readonly root: HTMLDivElement;
  private state: CrossExaminationState = createCrossExaminationState();
  private feedbackText = "";

  constructor(options: CrossExaminationPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "cross-examination-puzzle";
    this.root.setAttribute("aria-label", CROSS_EXAMINATION_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel cross-examination-panel">
        <p class="puzzle-kicker">Cross-examination</p>
        <h1>${CROSS_EXAMINATION_COPY.title}</h1>
        <p class="puzzle-instruction">${CROSS_EXAMINATION_COPY.instruction}</p>
        <blockquote class="cross-examination-prompt" data-testid="cross-examination-prompt">
          ${this.state.promptText}
        </blockquote>
        <div class="cross-examination-choice-list" data-testid="cross-examination-choice-list">
          ${this.state.choices.map((choice) => this.renderChoice(choice.id, choice.label, choice.text)).join("")}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-cross-examination">${CROSS_EXAMINATION_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-cross-examination">${CROSS_EXAMINATION_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="cross-examination-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderChoice(id: CrossExaminationChoiceId, label: string, text: string): string {
    const selected = this.state.selectedChoiceId === id;

    return `
      <button
        type="button"
        class="cross-examination-choice${selected ? " is-selected" : ""}"
        data-choice-id="${id}"
        data-testid="cross-examination-choice-${id}"
        aria-pressed="${selected}"
      >
        <strong>${label}.</strong>
        <span>${text}</span>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-choice-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const choiceId = button.dataset.choiceId as CrossExaminationChoiceId | undefined;
        if (!choiceId) {
          return;
        }

        this.state = selectCrossExaminationChoice(this.state, choiceId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-cross-examination"]')?.addEventListener("click", () => {
      this.state = resetCrossExaminationState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-cross-examination"]')?.addEventListener("click", () => {
      const submission = submitCrossExamination(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
