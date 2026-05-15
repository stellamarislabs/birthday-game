import {
  ARGUMENT_BUILDER_COPY,
  createArgumentBuilderState,
  resetArgumentBuilderState,
  selectArgumentBuilderChoice,
  submitArgumentBuilder
} from "./argumentBuilderLogic";
import type { ArgumentBuilderChoiceId, ArgumentBuilderState } from "./argumentBuilderTypes";

interface ArgumentBuilderPuzzleOptions {
  onSolved: () => void;
}

export class ArgumentBuilderPuzzle {
  private readonly root: HTMLDivElement;
  private state: ArgumentBuilderState = createArgumentBuilderState();
  private feedbackText = "";

  constructor(options: ArgumentBuilderPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "argument-builder-puzzle";
    this.root.setAttribute("aria-label", ARGUMENT_BUILDER_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel argument-builder-panel">
        <p class="puzzle-kicker">Argument builder</p>
        <h1>${ARGUMENT_BUILDER_COPY.title}</h1>
        <p class="puzzle-instruction">${ARGUMENT_BUILDER_COPY.instruction}</p>
        <blockquote class="argument-builder-prompt" data-testid="argument-builder-prompt">
          ${this.state.promptText}
        </blockquote>
        <div class="argument-builder-choice-list" data-testid="argument-builder-choice-list">
          ${this.state.choices.map((choice) => this.renderChoice(choice.id, choice.label, choice.text)).join("")}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-argument-builder">${ARGUMENT_BUILDER_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-argument-builder">${ARGUMENT_BUILDER_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="argument-builder-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderChoice(id: ArgumentBuilderChoiceId, label: string, text: string): string {
    const selected = this.state.selectedArgumentId === id;

    return `
      <button
        type="button"
        class="argument-builder-choice${selected ? " is-selected" : ""}"
        data-argument-id="${id}"
        data-testid="argument-builder-choice-${id}"
        aria-pressed="${selected}"
      >
        <strong>${label}.</strong>
        <span>${text}</span>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-argument-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const argumentId = button.dataset.argumentId as ArgumentBuilderChoiceId | undefined;
        if (!argumentId) {
          return;
        }

        this.state = selectArgumentBuilderChoice(this.state, argumentId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-argument-builder"]')?.addEventListener("click", () => {
      this.state = resetArgumentBuilderState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-argument-builder"]')?.addEventListener("click", () => {
      const submission = submitArgumentBuilder(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
