import {
  DOCUMENT_ORDERING_COPY,
  createDocumentOrderingState,
  getOrderedDocumentCards,
  moveDocumentCardDown,
  moveDocumentCardUp,
  resetDocumentOrderingState,
  submitDocumentOrdering
} from "./documentOrderingLogic";
import type { DocumentOrderingCardId, DocumentOrderingState } from "./documentOrderingTypes";

interface DocumentOrderingPuzzleOptions {
  onSolved: () => void;
}

export class DocumentOrderingPuzzle {
  private readonly root: HTMLDivElement;
  private state: DocumentOrderingState = createDocumentOrderingState();
  private feedbackText = "";

  constructor(options: DocumentOrderingPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "document-ordering-puzzle";
    this.root.setAttribute("aria-label", DOCUMENT_ORDERING_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const orderedCards = getOrderedDocumentCards(this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel">
        <p class="puzzle-kicker">Document-ordering</p>
        <h1>${DOCUMENT_ORDERING_COPY.title}</h1>
        <p class="puzzle-instruction">${DOCUMENT_ORDERING_COPY.instruction}</p>
        <ol class="document-card-list" data-testid="document-card-list">
          ${orderedCards
            .map(
              (card, index) => `
                <li class="document-card" data-card-id="${card.id}" data-testid="document-card-${card.id}">
                  <div class="document-card-copy">
                    <strong>${card.title}</strong>
                    <span>${card.prompt}</span>
                  </div>
                  <div class="document-card-actions">
                    <button type="button" data-action="up" data-card-id="${card.id}" data-testid="move-up-${card.id}" ${
                      index === 0 ? "disabled" : ""
                    }>Up</button>
                    <button type="button" data-action="down" data-card-id="${card.id}" data-testid="move-down-${card.id}" ${
                      index === orderedCards.length - 1 ? "disabled" : ""
                    }>Down</button>
                  </div>
                </li>
              `
            )
            .join("")}
        </ol>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-document-order">Reset</button>
          <button type="button" class="primary-button" data-testid="submit-document-order">${DOCUMENT_ORDERING_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="puzzle-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardId = button.dataset.cardId as DocumentOrderingCardId | undefined;
        if (!cardId) {
          return;
        }

        this.state =
          button.dataset.action === "up"
            ? moveDocumentCardUp(this.state, cardId)
            : moveDocumentCardDown(this.state, cardId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-document-order"]')?.addEventListener("click", () => {
      this.state = resetDocumentOrderingState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-document-order"]')?.addEventListener("click", () => {
      const submission = submitDocumentOrdering(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
