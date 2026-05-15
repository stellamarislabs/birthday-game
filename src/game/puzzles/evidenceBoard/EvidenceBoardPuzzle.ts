import {
  checkEvidenceBoardAnswer,
  createInitialEvidenceBoardState,
  linkSelectedEvidenceToMeaning,
  resetEvidenceBoard,
  selectConclusionChoice,
  selectEvidence,
  unlinkEvidence
} from "./evidenceBoardLogic";
import {
  escapeHtml,
  getCardDescription,
  getEvidenceLinkedToMeaningLabel,
  getLinkedMeaningLabel
} from "./evidenceBoardRenderer";
import type { EvidenceBoardSpec, EvidenceBoardState } from "./evidenceBoardTypes";

interface EvidenceBoardPuzzleOptions {
  spec: EvidenceBoardSpec;
  onSolved: () => void;
}

export class EvidenceBoardPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: EvidenceBoardSpec;
  private state: EvidenceBoardState;

  constructor(options: EvidenceBoardPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialEvidenceBoardState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "evidence-board-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel evidence-board-panel">
        <p class="puzzle-kicker">Connect the Case</p>
        <h1>${escapeHtml(this.spec.title)}</h1>
        <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        <div class="evidence-board-grid">
          <section class="evidence-board-column" aria-label="Evidence cards">
            <h2>Evidence</h2>
            <div class="evidence-board-card-list">
              ${this.spec.evidenceCards.map((card) => this.renderEvidenceCard(card.id, card.label)).join("")}
            </div>
          </section>
          <section class="evidence-board-column" aria-label="Meaning cards">
            <h2>Meanings</h2>
            <div class="evidence-board-card-list">
              ${this.spec.meaningCards.map((card) => this.renderMeaningCard(card.id, card.label)).join("")}
            </div>
          </section>
        </div>
        ${this.renderConclusionQuestion()}
        <div class="evidence-board-summary" data-testid="evidence-board-summary" aria-live="polite">
          ${this.renderSummary()}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-evidence-board">Reset Board</button>
          <button type="button" class="primary-button" data-testid="submit-evidence-board">Submit Board</button>
        </div>
        <p class="puzzle-feedback" data-testid="evidence-board-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderEvidenceCard(id: string, label: string): string {
    const card = this.spec.evidenceCards.find((candidate) => candidate.id === id);
    const selected = this.state.selectedEvidenceId === id;
    const linkedMeaning = getLinkedMeaningLabel(this.spec, this.state, id);

    return `
      <button
        type="button"
        class="evidence-board-card evidence-card${selected ? " is-selected" : ""}${linkedMeaning ? " is-linked" : ""}"
        data-evidence-id="${escapeHtml(id)}"
        data-testid="evidence-board-evidence-${escapeHtml(id)}"
        aria-pressed="${selected}"
      >
        <strong>${escapeHtml(label)}</strong>
        ${card ? getCardDescription(card) : ""}
        <em>${linkedMeaning ? `Current link: ${escapeHtml(linkedMeaning)}` : "Tap this card first."}</em>
      </button>
    `;
  }

  private renderMeaningCard(id: string, label: string): string {
    const card = this.spec.meaningCards.find((candidate) => candidate.id === id);
    const linkedEvidence = getEvidenceLinkedToMeaningLabel(this.spec, this.state, id);
    const selectedForCurrentEvidence = this.state.selectedEvidenceId
      ? this.state.links[this.state.selectedEvidenceId] === id
      : false;

    return `
      <button
        type="button"
        class="evidence-board-card meaning-card${selectedForCurrentEvidence ? " is-selected" : ""}${linkedEvidence ? " is-linked" : ""}"
        data-meaning-id="${escapeHtml(id)}"
        data-testid="evidence-board-meaning-${escapeHtml(id)}"
      >
        <strong>${escapeHtml(label)}</strong>
        ${card ? getCardDescription(card) : ""}
        <em>${linkedEvidence ? `Used by: ${escapeHtml(linkedEvidence)}` : this.state.selectedEvidenceId ? "Tap to connect." : "Select evidence first."}</em>
      </button>
    `;
  }

  private renderConclusionQuestion(): string {
    if (!this.spec.conclusionQuestion) {
      return "";
    }

    return `
      <section class="evidence-board-conclusion" aria-label="Case conclusion">
        <h2>${escapeHtml(this.spec.conclusionQuestion.prompt)}</h2>
        <div class="evidence-board-conclusion-choices">
          ${this.spec.conclusionQuestion.choices
            .map(
              (choice) => `
                <button
                  type="button"
                  class="evidence-board-choice${this.state.conclusionChoiceId === choice.id ? " is-selected" : ""}"
                  data-conclusion-id="${escapeHtml(choice.id)}"
                  data-testid="evidence-board-conclusion-${escapeHtml(choice.id)}"
                  aria-pressed="${this.state.conclusionChoiceId === choice.id}"
                >
                  ${escapeHtml(choice.label)}
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  private renderSummary(): string {
    const selectedEvidence = this.state.selectedEvidenceId
      ? this.spec.evidenceCards.find((card) => card.id === this.state.selectedEvidenceId)?.label ?? this.state.selectedEvidenceId
      : "none";
    const links = this.spec.evidenceCards
      .map((card) => {
        const linkedMeaning = getLinkedMeaningLabel(this.spec, this.state, card.id);
        return `<li>${escapeHtml(card.label)} <span aria-hidden="true">→</span> <strong>${linkedMeaning ? escapeHtml(linkedMeaning) : "not linked yet"}</strong></li>`;
      })
      .join("");

    return [
      `<p>Selected evidence: <strong>${escapeHtml(selectedEvidence)}</strong></p>`,
      `<p>Links filed: ${Object.keys(this.state.links).length} / ${this.spec.evidenceCards.length}</p>`,
      `<ol class="evidence-board-links">${links}</ol>`
    ].join("");
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-evidence-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const evidenceId = button.dataset.evidenceId;
        if (!evidenceId) {
          return;
        }

        this.state = selectEvidence(this.spec, this.state, evidenceId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-meaning-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const meaningId = button.dataset.meaningId;
        if (!meaningId) {
          return;
        }

        this.state = linkSelectedEvidenceToMeaning(this.spec, this.state, meaningId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-conclusion-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const choiceId = button.dataset.conclusionId;
        if (!choiceId) {
          return;
        }

        this.state = selectConclusionChoice(this.spec, this.state, choiceId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-evidence-board"]')?.addEventListener("click", () => {
      this.state = resetEvidenceBoard(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-evidence-board"]')?.addEventListener("click", () => {
      const result = checkEvidenceBoardAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });

    this.root.querySelectorAll<HTMLButtonElement>(".evidence-board-card.is-linked[data-evidence-id]").forEach((button) => {
      button.addEventListener("dblclick", () => {
        const evidenceId = button.dataset.evidenceId;
        if (!evidenceId) {
          return;
        }

        this.state = unlinkEvidence(this.spec, this.state, evidenceId);
        this.render(onSolved);
      });
    });
  }
}
