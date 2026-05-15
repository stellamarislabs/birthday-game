import {
  checkLanternSequenceAnswer,
  createInitialLanternSequenceState,
  getLanternSequenceProgress,
  inputLantern,
  resetAttempt,
  showLanternPattern
} from "./lanternSequenceLogic";
import { escapeHtml } from "./lanternSequenceRenderer";
import type { LanternNode, LanternSequenceSpec, LanternSequenceState } from "./lanternSequenceTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface LanternSequencePuzzleOptions {
  spec: LanternSequenceSpec;
  onSolved: () => void;
}

export class LanternSequencePuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: LanternSequenceSpec;
  private state: LanternSequenceState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: LanternSequencePuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialLanternSequenceState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "lantern-sequence-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.destroyDragDrop?.();
    this.destroyDragDrop = null;
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.destroyDragDrop?.();
    this.destroyDragDrop = null;
    const progress = getLanternSequenceProgress(this.spec, this.state);
    const litLanternIds = new Set(this.state.attempt);

    this.root.innerHTML = `
      <section class="puzzle-panel tactile-panel lantern-sequence-panel">
        <div class="tactile-heading">
          <p class="puzzle-kicker">Lantern Sequence</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="tactile-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="lantern-play-area${this.state.solved ? " is-solved" : ""}">
          <section class="lantern-garden" aria-label="Garden lantern path">
            <div class="lantern-path" aria-hidden="true">
              ${this.spec.sequence.map((lanternId, index) => `<span class="${index < progress.current ? "is-lit" : ""}" data-path-step="${escapeHtml(lanternId)}"></span>`).join("")}
            </div>
            ${this.spec.lanterns.map((lantern) => this.renderLantern(lantern, litLanternIds.has(lantern.id))).join("")}
            <button
              type="button"
              class="flame-token"
              data-drag-id="flame"
              data-testid="lantern-flame-token"
              aria-label="Flame token"
            >
              Flame
            </button>
          </section>

          <section class="lantern-sidecar">
            <div class="lantern-preview" data-testid="lantern-sequence-preview">
              <h2>Quiet Pattern</h2>
              <p>${this.state.previewVisible ? this.spec.sequence.map((lanternId) => this.getLanternLabel(lanternId)).join(" -> ") : "Press Show Pattern when you are ready."}</p>
            </div>
            <div class="lantern-progress" data-testid="lantern-sequence-progress" aria-live="polite">
              Progress: <strong>${progress.current} / ${progress.total}</strong>
            </div>
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="show-lantern-sequence">Show Pattern</button>
          <button type="button" class="secondary-button" data-testid="reset-lantern-attempt">Reset Attempt</button>
          <button type="button" class="primary-button" data-testid="submit-lantern-sequence">Submit Path</button>
        </div>
        <p class="puzzle-feedback" data-testid="lantern-sequence-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderLantern(lantern: LanternNode, lit: boolean): string {
    return `
      <button
        type="button"
        class="garden-lantern garden-lantern-${escapeHtml(lantern.id)}${lit ? " is-lit" : ""}${this.state.lastWrongLanternId === lantern.id ? " is-wrong" : ""}"
        data-lantern-id="${escapeHtml(lantern.id)}"
        data-drop-id="${escapeHtml(lantern.id)}"
        data-testid="lantern-${escapeHtml(lantern.id)}"
      >
        <span class="garden-lantern-glow" aria-hidden="true"></span>
        <span>${escapeHtml(lantern.label)}</span>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelector<HTMLButtonElement>('[data-testid="show-lantern-sequence"]')?.addEventListener("click", () => {
      this.state = showLanternPattern(this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-lantern-attempt"]')?.addEventListener("click", () => {
      this.state = resetAttempt(this.spec, this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-lantern-sequence"]')?.addEventListener("click", () => {
      const result = checkLanternSequenceAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-lantern-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.handleLanternInput(button.dataset.lanternId ?? "", onSolved);
      });
    });
  }

  private bindDragDrop(onSolved: () => void): void {
    this.destroyDragDrop = createPointerDragDrop({
      root: this.root,
      draggableSelector: "[data-drag-id]",
      dropTargetSelector: "[data-drop-id]",
      dragDataAttribute: "dragId",
      dropDataAttribute: "dropId",
      onDrop: (dragId, dropId) => {
        if (dragId === "flame" && dropId) {
          this.handleLanternInput(dropId, onSolved);
        }
      }
    });
  }

  private handleLanternInput(lanternId: string, onSolved: () => void): void {
    this.state = inputLantern(this.spec, this.state, lanternId);
    this.render(onSolved);

    if (this.state.solved) {
      onSolved();
    }
  }

  private getLanternLabel(lanternId: string): string {
    return this.spec.lanterns.find((lantern) => lantern.id === lanternId)?.label ?? lanternId;
  }
}
