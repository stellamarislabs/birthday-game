import {
  MEMORY_MATCH_COPY,
  createMemoryMatchState,
  resetMemoryMatchState,
  selectMemoryMatchCard
} from "./memoryMatchLogic";
import type { MemoryMatchCardId, MemoryMatchState } from "./memoryMatchTypes";

interface MemoryMatchPuzzleOptions {
  onSolved: () => void;
}

export class MemoryMatchPuzzle {
  private readonly root: HTMLDivElement;
  private state: MemoryMatchState = createMemoryMatchState();
  private hasNotifiedSolved = false;

  constructor(options: MemoryMatchPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "memory-match-puzzle";
    this.root.setAttribute("aria-label", MEMORY_MATCH_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel memory-match-panel">
        <p class="puzzle-kicker">Memory match</p>
        <h1>${MEMORY_MATCH_COPY.title}</h1>
        <p class="puzzle-instruction">${MEMORY_MATCH_COPY.instruction}</p>
        <div class="memory-card-grid" data-testid="memory-card-grid">
          ${this.state.cards.map((card) => this.renderCard(card.id, card.text)).join("")}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-memory-match">${MEMORY_MATCH_COPY.reset}</button>
        </div>
        <p class="puzzle-feedback" data-testid="memory-match-feedback" aria-live="polite">${this.state.feedback}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderCard(cardId: MemoryMatchCardId, text: string): string {
    const card = this.state.cards.find((candidate) => candidate.id === cardId);
    const matched = card ? this.state.matchedPairIds.includes(card.pairId) : false;
    const selected = this.state.selectedCardIds.includes(cardId);

    return `
      <button
        type="button"
        class="memory-card${selected ? " is-selected" : ""}${matched ? " is-matched" : ""}"
        data-card-id="${cardId}"
        data-testid="memory-card-${cardId}"
        aria-pressed="${selected || matched}"
      >
        ${text}
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardId = button.dataset.cardId as MemoryMatchCardId | undefined;
        if (!cardId || this.hasNotifiedSolved) {
          return;
        }

        this.state = selectMemoryMatchCard(this.state, cardId);
        this.render(onSolved);

        if (this.state.solved && !this.hasNotifiedSolved) {
          this.hasNotifiedSolved = true;
          onSolved();
        }
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-memory-match"]')?.addEventListener("click", () => {
      this.state = resetMemoryMatchState();
      this.hasNotifiedSolved = false;
      this.render(onSolved);
    });
  }
}
