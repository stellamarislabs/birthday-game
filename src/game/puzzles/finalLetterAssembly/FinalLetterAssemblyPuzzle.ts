import {
  FINAL_LETTER_ASSEMBLY_COPY,
  createFinalLetterAssemblyState,
  getOrderedFinalLetterCards,
  moveFinalLetterCardDown,
  moveFinalLetterCardUp,
  resetFinalLetterAssemblyState,
  submitFinalLetterAssembly
} from "./finalLetterAssemblyLogic";
import type { FinalLetterAssemblyCardId, FinalLetterAssemblyState } from "./finalLetterAssemblyTypes";

interface FinalLetterAssemblyPuzzleOptions {
  onSolved: () => void;
}

export class FinalLetterAssemblyPuzzle {
  private readonly root: HTMLDivElement;
  private state: FinalLetterAssemblyState = createFinalLetterAssemblyState();
  private feedbackText = "";

  constructor(options: FinalLetterAssemblyPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "final-letter-assembly-puzzle";
    this.root.setAttribute("aria-label", FINAL_LETTER_ASSEMBLY_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const orderedCards = getOrderedFinalLetterCards(this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel final-letter-panel">
        <p class="puzzle-kicker">Final letter assembly</p>
        <h1>${FINAL_LETTER_ASSEMBLY_COPY.title}</h1>
        <p class="puzzle-instruction">${FINAL_LETTER_ASSEMBLY_COPY.instruction}</p>
        <ol class="document-card-list final-letter-card-list" data-testid="final-letter-card-list">
          ${orderedCards
            .map(
              (card, index) => `
                <li class="document-card final-letter-card" data-card-id="${card.id}" data-testid="final-letter-card-${card.id}">
                  <div class="document-card-copy">
                    <strong>${index + 1}. ${card.title}</strong>
                    <span>Move this word until the verdict reads true.</span>
                  </div>
                  <div class="document-card-actions">
                    <button type="button" data-action="up" data-card-id="${card.id}" data-testid="move-up-final-${card.id}" ${
                      index === 0 ? "disabled" : ""
                    }>Up</button>
                    <button type="button" data-action="down" data-card-id="${card.id}" data-testid="move-down-final-${card.id}" ${
                      index === orderedCards.length - 1 ? "disabled" : ""
                    }>Down</button>
                  </div>
                </li>
              `
            )
            .join("")}
        </ol>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-final-letter">${FINAL_LETTER_ASSEMBLY_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-final-letter">${FINAL_LETTER_ASSEMBLY_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="final-letter-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardId = button.dataset.cardId as FinalLetterAssemblyCardId | undefined;
        if (!cardId) {
          return;
        }

        this.state =
          button.dataset.action === "up"
            ? moveFinalLetterCardUp(this.state, cardId)
            : moveFinalLetterCardDown(this.state, cardId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-final-letter"]')?.addEventListener("click", () => {
      this.state = resetFinalLetterAssemblyState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-final-letter"]')?.addEventListener("click", () => {
      const submission = submitFinalLetterAssembly(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
