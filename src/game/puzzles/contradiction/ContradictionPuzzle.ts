import {
  CONTRADICTION_COPY,
  createContradictionState,
  resetContradictionState,
  selectContradictionStatement,
  submitContradiction
} from "./contradictionLogic";
import type { ContradictionState, ContradictionStatementId } from "./contradictionTypes";

interface ContradictionPuzzleOptions {
  onSolved: () => void;
}

export class ContradictionPuzzle {
  private readonly root: HTMLDivElement;
  private state: ContradictionState = createContradictionState();
  private feedbackText = "";

  constructor(options: ContradictionPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "contradiction-puzzle";
    this.root.setAttribute("aria-label", CONTRADICTION_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel contradiction-panel">
        <p class="puzzle-kicker">Contradiction review</p>
        <h1>${CONTRADICTION_COPY.title}</h1>
        <p class="puzzle-instruction">${CONTRADICTION_COPY.instruction}</p>
        <blockquote class="contradiction-evidence" data-testid="contradiction-evidence">
          ${this.state.evidenceText}
        </blockquote>
        <div class="contradiction-statement-list" data-testid="contradiction-statement-list">
          ${this.state.statements.map((statement) => this.renderStatement(statement.id, statement.label, statement.text)).join("")}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-contradiction">${CONTRADICTION_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-contradiction">${CONTRADICTION_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="contradiction-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderStatement(id: ContradictionStatementId, label: string, text: string): string {
    const selected = this.state.selectedStatementId === id;

    return `
      <button
        type="button"
        class="contradiction-statement${selected ? " is-selected" : ""}"
        data-statement-id="${id}"
        data-testid="contradiction-statement-${id}"
        aria-pressed="${selected}"
      >
        <strong>${label}.</strong>
        <span>${text}</span>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-statement-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const statementId = button.dataset.statementId as ContradictionStatementId | undefined;
        if (!statementId) {
          return;
        }

        this.state = selectContradictionStatement(this.state, statementId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-contradiction"]')?.addEventListener("click", () => {
      this.state = resetContradictionState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-contradiction"]')?.addEventListener("click", () => {
      const submission = submitContradiction(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
