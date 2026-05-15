import {
  checkFinalVerdictAssemblyAnswer,
  createInitialFinalVerdictAssemblyState,
  getFinalVerdictAssemblyProgress,
  isRingAligned,
  resetFinalVerdictAssembly,
  rotateFinalSealRing
} from "./finalVerdictAssemblyLogic";
import { getFinalVerdictAssemblyFinalAsset } from "./finalVerdictAssemblyFinalAssets";
import {
  escapeHtml,
  getFinalSealRingControlAriaLabel,
  getFinalSealRingControlLabel,
  getRingRotationStyle,
  getRingStateClass
} from "./finalVerdictAssemblyRenderer";
import type {
  FinalSealClueMark,
  FinalVerdictAssemblySpec,
  FinalVerdictAssemblyState
} from "./finalVerdictAssemblyTypes";

interface FinalVerdictAssemblyPuzzleOptions {
  spec: FinalVerdictAssemblySpec;
  onSolved: () => void;
}

export class FinalVerdictAssemblyPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: FinalVerdictAssemblySpec;
  private state: FinalVerdictAssemblyState;

  constructor(options: FinalVerdictAssemblyPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialFinalVerdictAssemblyState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "final-verdict-assembly-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);
    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const progress = getFinalVerdictAssemblyProgress(this.spec, this.state);
    const isSealReady = progress.litCount === progress.totalCount;
    const backgroundAsset = getFinalVerdictAssemblyFinalAsset("background");
    const boardAsset = getFinalVerdictAssemblyFinalAsset("finalSealBoard");
    const heartCoreAsset = getFinalVerdictAssemblyFinalAsset("heartCore");
    const backgroundStyle = backgroundAsset.imageUrl
      ? ` style="--final-seal-bg-image: url('${escapeHtml(backgroundAsset.imageUrl)}');"`
      : "";
    const boardImage = boardAsset.imageUrl
      ? `<img class="final-seal-board-image" src="${escapeHtml(boardAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false">`
      : "";
    const heartCoreImage = heartCoreAsset.imageUrl
      ? `<img class="final-seal-heart-image" src="${escapeHtml(heartCoreAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false">`
      : "";

    this.root.innerHTML = `
      <section class="puzzle-panel tactile-panel final-verdict-assembly-panel${backgroundAsset.imageUrl ? " has-final-background" : ""}"${backgroundStyle}>
        <div class="tactile-heading">
          <p class="puzzle-kicker">Final Seal</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="tactile-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="verdict-assembly-play-area${isSealReady ? " is-solved" : ""}">
          <div class="final-seal-board-column">
            <section class="verdict-seal final-seal-ring-board${boardAsset.imageUrl ? " has-final-board" : ""}" aria-label="Final court seal">
              ${boardImage}
              <div class="final-seal-rays${isSealReady ? " is-lit" : ""}" aria-hidden="true"></div>
              <div class="verdict-seal-core final-seal-heart${heartCoreAsset.imageUrl ? " has-final-core" : ""}" aria-hidden="true">
                ${heartCoreImage}
                <span class="final-seal-heart-label">Court<br>Heart</span>
              </div>
              ${this.spec.rings.map((ring, index) => `
                <button
                  type="button"
                  class="final-seal-ring final-seal-ring-${escapeHtml(ring.id)}${getRingStateClass(this.spec, this.state, ring)}"
                  style="${getRingRotationStyle(this.state, ring)}"
                  data-ring-id="${escapeHtml(ring.id)}"
                  data-testid="final-seal-ring-${escapeHtml(ring.id)}"
                  aria-label="Rotate ${escapeHtml(ring.label)} ring"
                  aria-pressed="${isRingAligned(this.spec, this.state, ring.id)}"
                >
                  <span class="final-seal-ring-label">${escapeHtml(ring.label)}</span>
                  <span class="final-seal-ring-index">${index + 1}</span>
                </button>
              `).join("")}
            </section>

            <div class="final-seal-ring-controls" aria-label="Final seal ring controls">
              ${this.spec.rings.map((ring) => `
                <button
                  type="button"
                  class="final-seal-ring-control${isRingAligned(this.spec, this.state, ring.id) ? " is-aligned" : ""}"
                  data-ring-id="${escapeHtml(ring.id)}"
                  data-testid="final-seal-ring-control-${escapeHtml(ring.id)}"
                  aria-label="${escapeHtml(getFinalSealRingControlAriaLabel(ring))}"
                >
                  ${escapeHtml(getFinalSealRingControlLabel(ring))}
                </button>
              `).join("")}
            </div>
          </div>

          <section class="verdict-fragment-tray final-seal-clue-panel" aria-label="Clue lights">
            <div class="verdict-progress" data-testid="verdict-assembly-progress" aria-live="polite">
              ${progress.litCount === progress.totalCount
                ? "All six clues point to the heart."
                : `Clue lights: <strong>${progress.litCount} / ${progress.totalCount}</strong>`}
            </div>
            <div class="final-seal-clue-list">
              ${this.spec.clueMarks.map((clue) => this.renderClueMark(clue, progress.litClueIds.includes(clue.id))).join("")}
            </div>
            <div class="final-seal-payoff" data-testid="final-seal-payoff">
              ${isSealReady ? `
                <strong>${escapeHtml(this.spec.successText)}</strong>
                <span>${escapeHtml(this.spec.successFollowUp ?? "")}</span>
              ` : `
                <strong>Court seal waiting</strong>
                <span>Each aligned ring lights two clues.</span>
              `}
            </div>
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-final-verdict-assembly">Reset Seal</button>
          <button type="button" class="primary-button" data-testid="submit-final-verdict-assembly">Unlock Verdict</button>
        </div>
        <p class="puzzle-feedback" data-testid="final-verdict-assembly-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderClueMark(clue: FinalSealClueMark, isLit: boolean): string {
    return `
      <div
        class="final-seal-clue${isLit ? " is-lit" : ""}"
        data-testid="final-seal-clue-${escapeHtml(clue.id)}"
      >
        <span class="final-seal-clue-chapter">Ch. ${clue.chapterId}</span>
        <strong>${escapeHtml(clue.label)}</strong>
      </div>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-ring-id]").forEach((ringButton) => {
      ringButton.addEventListener("click", () => {
        const ringId = ringButton.dataset.ringId;
        if (!ringId) {
          return;
        }
        this.state = rotateFinalSealRing(this.spec, this.state, ringId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-final-verdict-assembly"]')?.addEventListener("click", () => {
      this.state = resetFinalVerdictAssembly(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-final-verdict-assembly"]')?.addEventListener("click", () => {
      const result = checkFinalVerdictAssemblyAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }
}
