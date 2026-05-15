import {
  RECONSTRUCTION_COPY,
  CORRECT_RECONSTRUCTION_PLACEMENT,
  createReconstructionState,
  getPieceInSlot,
  placeSelectedPieceInSlot,
  resetReconstructionState,
  selectReconstructionPiece,
  submitReconstruction
} from "./reconstructionLogic";
import type { ReconstructionPieceId, ReconstructionState } from "./reconstructionTypes";

interface ReconstructionPuzzleOptions {
  onSolved: () => void;
}

export class ReconstructionPuzzle {
  private readonly root: HTMLDivElement;
  private state: ReconstructionState = createReconstructionState();
  private feedbackText = "";

  constructor(options: ReconstructionPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "reconstruction-puzzle";
    this.root.setAttribute("aria-label", RECONSTRUCTION_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.root.innerHTML = `
      <section class="puzzle-panel reconstruction-panel">
        <p class="puzzle-kicker">Reconstruction</p>
        <h1>${RECONSTRUCTION_COPY.title}</h1>
        <p class="puzzle-instruction">${RECONSTRUCTION_COPY.instruction}</p>
        <div class="reconstruction-grid" data-testid="reconstruction-grid">
          ${this.state.slots.map((slot) => this.renderSlot(slot.id, slot.label)).join("")}
        </div>
        <p class="puzzle-instruction">Tap a piece, then tap the place where it belongs. Occupied places swap safely.</p>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-reconstruction">${RECONSTRUCTION_COPY.reset}</button>
          <button type="button" class="primary-button" data-testid="submit-reconstruction">${RECONSTRUCTION_COPY.submit}</button>
        </div>
        <p class="puzzle-feedback" data-testid="reconstruction-feedback" aria-live="polite">${this.feedbackText}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderSlot(slotId: ReconstructionState["slots"][number]["id"], label: string): string {
    const piece = getPieceInSlot(this.state, slotId);
    const selectedClass = piece?.id === this.state.selectedPieceId ? " is-selected" : "";
    const targetPieceId = CORRECT_RECONSTRUCTION_PLACEMENT[slotId];
    const targetPiece = this.state.pieces.find((candidate) => candidate.id === targetPieceId);

    return `
      <button
        type="button"
        class="reconstruction-slot${selectedClass}"
        data-slot-id="${slotId}"
        data-piece-id="${piece?.id ?? ""}"
        data-testid="reconstruction-slot-${slotId}"
        aria-pressed="${piece?.id === this.state.selectedPieceId}"
      >
        <span>${label}</span>
        <strong>${piece?.label ?? "Empty"}</strong>
        <small>${targetPiece ? `Place: ${targetPiece.label}` : ""}</small>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const slotId = button.dataset.slotId as ReconstructionState["slots"][number]["id"] | undefined;
        if (!slotId) {
          return;
        }

        if (this.state.selectedPieceId) {
          this.state = placeSelectedPieceInSlot(this.state, slotId);
        } else {
          const pieceId = button.dataset.pieceId as ReconstructionPieceId | "";
          this.state = selectReconstructionPiece(this.state, pieceId || null);
        }

        this.feedbackText = "";
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-reconstruction"]')?.addEventListener("click", () => {
      this.state = resetReconstructionState();
      this.feedbackText = "";
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-reconstruction"]')?.addEventListener("click", () => {
      const submission = submitReconstruction(this.state);
      this.state = submission.state;
      this.feedbackText = submission.result.feedback;
      this.render(onSolved);

      if (submission.result.solved) {
        onSolved();
      }
    });
  }
}
