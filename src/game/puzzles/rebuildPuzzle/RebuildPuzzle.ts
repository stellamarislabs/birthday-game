import {
  activateWallMark,
  checkRebuildPuzzleAnswer,
  createInitialRebuildPuzzleState,
  getRebuildPuzzleProgress,
  resetRebuildPuzzle,
  selectKey,
  useKeyOnWall
} from "./rebuildPuzzleLogic";
import { escapeHtml } from "./rebuildPuzzleRenderer";
import type { RebuildPuzzleSpec, RebuildPuzzleState } from "./rebuildPuzzleTypes";

interface RebuildPuzzleOptions {
  spec: RebuildPuzzleSpec;
  onSolved: () => void;
}

export class RebuildPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: RebuildPuzzleSpec;
  private state: RebuildPuzzleState;

  constructor(options: RebuildPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialRebuildPuzzleState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "rebuild-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const progress = getRebuildPuzzleProgress(this.spec, this.state);
    const wallState = this.state.waveMarkRevealed ? "wave-revealed" : this.state.keyTurned ? "unlocked" : "locked";

    this.root.innerHTML = `
      <section class="puzzle-panel rebuild-panel hidden-wall-panel">
        <div class="rebuild-heading">
          <p class="puzzle-kicker">Clue Interaction</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="rebuild-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="hidden-wall-stage" data-state="${wallState}">
          <aside class="hidden-wall-tools" aria-label="Hidden wall tools">
            <button
              type="button"
              class="hidden-wall-key ${this.state.keySelected ? "is-selected" : ""} ${this.state.keyTurned ? "is-used" : ""}"
              data-testid="hidden-wall-key"
              aria-pressed="${this.state.keySelected}"
              ${this.state.keyTurned ? "disabled" : ""}
            >
              ${escapeHtml(this.spec.keyLabel)}
            </button>
          </aside>

          <section class="hidden-wall-surface ${this.state.keyTurned ? "is-unlocked" : ""}" aria-label="Hidden wall">
            <button
              type="button"
              class="hidden-wall-keyhole ${this.state.keyTurned ? "is-turned" : ""}"
              data-testid="hidden-wall-keyhole"
              aria-label="${escapeHtml(this.spec.keyholeLabel)}"
              ${this.state.keyTurned ? "disabled" : ""}
            >
              ${escapeHtml(this.spec.keyholeLabel)}
            </button>

            <div class="hidden-wall-marks" aria-label="Glowing wall marks">
              ${this.spec.wallMarks.map((mark) => this.renderWallMark(mark.id, mark.label)).join("")}
            </div>

            <div class="vistula-wave-mark ${this.state.waveMarkRevealed ? "is-visible" : ""}" data-testid="vistula-wave-mark" aria-live="polite">
              ${escapeHtml(this.spec.waveMarkLabel)}
            </div>
          </section>
        </div>

        <div class="rebuild-progress" data-testid="rebuild-progress" aria-live="polite">
          <p>Wall marks: <strong>${progress.markCount} / ${progress.requiredMarkCount}</strong></p>
          <p>${this.getStepLabel(progress.currentStep)}</p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-rebuild-puzzle">Reset Wall</button>
          <button type="button" class="primary-button" data-testid="submit-rebuild-puzzle">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="rebuild-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderWallMark(markId: string, label: string): string {
    const isActive = this.state.activatedMarkIds.includes(markId);
    return `
      <button
        type="button"
        class="hidden-wall-mark ${isActive ? "is-active" : ""}"
        data-mark-id="${escapeHtml(markId)}"
        data-testid="hidden-wall-mark-${escapeHtml(markId)}"
        ${this.state.keyTurned ? "" : "disabled"}
      >
        ${escapeHtml(label)}
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelector<HTMLButtonElement>('[data-testid="hidden-wall-key"]')?.addEventListener("click", () => {
      this.state = selectKey(this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="hidden-wall-keyhole"]')?.addEventListener("click", () => {
      this.state = useKeyOnWall(this.spec, this.state);
      this.render(onSolved);
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-mark-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const markId = button.dataset.markId;
        if (!markId) {
          return;
        }

        this.state = activateWallMark(this.spec, this.state, markId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-rebuild-puzzle"]')?.addEventListener("click", () => {
      this.state = resetRebuildPuzzle(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-rebuild-puzzle"]')?.addEventListener("click", () => {
      const result = checkRebuildPuzzleAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }

  private getStepLabel(currentStep: ReturnType<typeof getRebuildPuzzleProgress>["currentStep"]): string {
    if (currentStep === "wave-revealed") {
      return "The Vistula mark is visible.";
    }

    if (currentStep === "unlocked") {
      return "The cracks are glowing.";
    }

    if (currentStep === "key-selected") {
      return "The brass key is ready.";
    }

    return "The wall is locked.";
  }
}
