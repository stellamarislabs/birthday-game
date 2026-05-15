import {
  EVIDENCE_LINKING_COPY,
  createEvidenceLinkingState,
  linkSelectedExhibitToMeaning,
  resetEvidenceLinkingState,
  selectEvidenceLinkingExhibit,
  submitEvidenceLinking
} from "./evidenceLinkingLogic";
import type { EvidenceLinkingExhibitId, EvidenceLinkingMeaningId, EvidenceLinkingState } from "./evidenceLinkingTypes";

interface EvidenceLinkingPuzzleOptions {
  onSolved: () => void;
}

export class EvidenceLinkingPuzzle {
  private readonly root: HTMLDivElement;
  private state: EvidenceLinkingState = createEvidenceLinkingState();
  private feedbackText = "";

  constructor(options: EvidenceLinkingPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "evidence-linking-puzzle";
    this.root.setAttribute("aria-label", EVIDENCE_LINKING_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel evidence-linking-panel">
        <p class="puzzle-kicker">${EVIDENCE_LINKING_COPY.kicker}</p>
        <h1>${EVIDENCE_LINKING_COPY.title}</h1>
        <p class="puzzle-instruction">${EVIDENCE_LINKING_COPY.instruction}</p>
        <div class="evidence-linking-board">
          <section class="evidence-linking-column" aria-label="Clues">
            <h2>Clues</h2>
            <div class="evidence-linking-card-list" data-testid="evidence-linking-exhibits">
              ${this.state.exhibits.map((exhibit) => this.renderExhibit(exhibit.id, exhibit.text)).join("")}
            </div>
          </section>
          <section class="evidence-linking-column" aria-label="Meanings">
            <h2>Meanings</h2>
            <div class="evidence-linking-card-list" data-testid="evidence-linking-meanings">
              ${this.state.meanings.map((meaning) => this.renderMeaning(meaning.id, meaning.label, meaning.text)).join("")}
            </div>
          </section>
        </div>
        <div class="evidence-linking-summary" data-testid="evidence-linking-summary" aria-live="polite">
          ${this.renderSummary()}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-evidence-linking">${EVIDENCE_LINKING_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-evidence-linking">${EVIDENCE_LINKING_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="evidence-linking-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderExhibit(id: EvidenceLinkingExhibitId, text: string): string {
    const selected = this.state.selectedExhibitId === id;
    const linkedMeaningId = this.state.links[id];
    const linkedMeaning = this.getMeaningText(linkedMeaningId);
    const linkedMeaningLabel = this.getMeaningLabel(linkedMeaningId);

    return `
      <button
        type="button"
        class="evidence-linking-card exhibit-card${selected ? " is-selected" : ""}${linkedMeaning ? " is-linked" : ""}"
        data-exhibit-id="${id}"
        data-testid="evidence-exhibit-${id}"
        aria-pressed="${selected}"
      >
        <strong>${text}</strong>
        <span>${linkedMeaning ? `Filed link: ${linkedMeaningLabel}. ${linkedMeaning}` : "Tap this clue, then choose a meaning."}</span>
      </button>
    `;
  }

  private renderMeaning(id: EvidenceLinkingMeaningId, label: string, text: string): string {
    const selectedExhibit = this.state.selectedExhibitId;
    const linkedToSelected = selectedExhibit ? this.state.links[selectedExhibit] === id : false;
    const linkedExhibitId = this.getExhibitLinkedToMeaning(id);
    const linkedExhibit = linkedExhibitId ? this.getExhibitText(linkedExhibitId) : "";

    return `
      <button
        type="button"
        class="evidence-linking-card meaning-card${linkedToSelected ? " is-selected" : ""}${linkedExhibit ? " is-linked" : ""}"
        data-meaning-id="${id}"
        data-testid="evidence-meaning-${id}"
      >
        <strong>${label}.</strong>
        <span>${text}</span>
        <em>${linkedExhibit ? `Used by: ${linkedExhibit}` : selectedExhibit ? "Tap to file this link." : "Select a clue first."}</em>
      </button>
    `;
  }

  private renderSummary(): string {
    const linkedCount = Object.keys(this.state.links).length;
    const selected = this.state.selectedExhibitId ? this.getExhibitText(this.state.selectedExhibitId) : "none";
    const filedLinks = this.state.exhibits
      .map((exhibit) => {
        const meaningId = this.state.links[exhibit.id];
        const meaning = this.getMeaningText(meaningId);
        const meaningLabel = this.getMeaningLabel(meaningId);
        return `<li>${exhibit.text}: <strong>${meaning ? `${meaningLabel}. ${meaning}` : "not linked yet"}</strong></li>`;
      })
      .join("");

    return [
      `<p>Selected clue: <strong>${selected}</strong></p>`,
      `<p>Links filed: ${linkedCount} / ${this.state.exhibits.length}</p>`,
      `<ol class="evidence-linking-filed-links">${filedLinks}</ol>`
    ].join("");
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-exhibit-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const exhibitId = button.dataset.exhibitId as EvidenceLinkingExhibitId | undefined;
        if (!exhibitId) {
          return;
        }

        this.state = selectEvidenceLinkingExhibit(this.state, exhibitId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-meaning-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const meaningId = button.dataset.meaningId as EvidenceLinkingMeaningId | undefined;
        if (!meaningId) {
          return;
        }

        this.state = linkSelectedExhibitToMeaning(this.state, meaningId);
        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-evidence-linking"]')?.addEventListener("click", () => {
      this.state = resetEvidenceLinkingState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-evidence-linking"]')?.addEventListener("click", () => {
      const submission = submitEvidenceLinking(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }

  private getExhibitText(exhibitId: EvidenceLinkingExhibitId): string {
    return this.state.exhibits.find((exhibit) => exhibit.id === exhibitId)?.text ?? exhibitId;
  }

  private getMeaningText(meaningId: EvidenceLinkingMeaningId | undefined): string {
    return meaningId ? this.state.meanings.find((meaning) => meaning.id === meaningId)?.text ?? "" : "";
  }

  private getMeaningLabel(meaningId: EvidenceLinkingMeaningId | undefined): string {
    return meaningId ? this.state.meanings.find((meaning) => meaning.id === meaningId)?.label ?? meaningId : "";
  }

  private getExhibitLinkedToMeaning(meaningId: EvidenceLinkingMeaningId): EvidenceLinkingExhibitId | undefined {
    const entry = Object.entries(this.state.links).find(([, linkedMeaningId]) => linkedMeaningId === meaningId);

    return entry?.[0] as EvidenceLinkingExhibitId | undefined;
  }
}
