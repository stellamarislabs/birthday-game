import {
  checkCaseConstellationAnswer,
  createInitialCaseConstellationState,
  getCaseConstellationProgress,
  placeSelectedStarOnNode,
  removeStarFromNode,
  resetCaseConstellation,
  selectStar
} from "./caseConstellationLogic";
import { escapeHtml, getNodeStateClass, getPlacedStar } from "./caseConstellationRenderer";
import type { CaseConstellationSpec, CaseConstellationState, ExhibitStar } from "./caseConstellationTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface CaseConstellationPuzzleOptions {
  spec: CaseConstellationSpec;
  onSolved: () => void;
}

export class CaseConstellationPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: CaseConstellationSpec;
  private state: CaseConstellationState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: CaseConstellationPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialCaseConstellationState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "case-constellation-puzzle";
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
    const progress = getCaseConstellationProgress(this.spec, this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel tactile-panel case-constellation-panel">
        <div class="tactile-heading">
          <p class="puzzle-kicker">Case Constellation</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="tactile-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="constellation-play-area${this.state.solved ? " is-solved" : ""}">
          <section class="constellation-sky" aria-label="Case constellation sky">
            <div class="unfinished-letter-core" aria-hidden="true">Letter</div>
            ${this.spec.nodes.map((node) => {
              const star = getPlacedStar(this.spec, this.state, node.id);
              return `
                <button
                  type="button"
                  class="constellation-node${getNodeStateClass(this.spec, this.state, node.id)}"
                  style="left: ${node.x}%; top: ${node.y}%;"
                  data-node-id="${escapeHtml(node.id)}"
                  data-drop-id="${escapeHtml(node.id)}"
                  data-testid="constellation-node-${escapeHtml(node.id)}"
                >
                  <span class="constellation-node-label">${escapeHtml(node.label)}</span>
                  ${star ? this.renderPlacedStar(star) : `<span class="constellation-node-empty">Place star</span>`}
                </button>
              `;
            }).join("")}
          </section>

          <section class="constellation-tray" data-drop-id="tray" data-testid="constellation-tray" aria-label="Clue stars">
            <div class="constellation-progress" data-testid="constellation-progress" aria-live="polite">
              Placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong>
              Lines: <strong>${progress.correctCount} / ${progress.totalCount}</strong>
            </div>
            <div class="constellation-star-list">
              ${this.state.trayStarIds.map((starId) => this.renderTrayStar(starId)).join("")}
            </div>
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-case-constellation">Reset Stars</button>
          <button type="button" class="primary-button" data-testid="submit-case-constellation">Complete Letter</button>
        </div>
        <p class="puzzle-feedback" data-testid="case-constellation-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderTrayStar(starId: string): string {
    const star = this.spec.stars.find((candidate) => candidate.id === starId);
    if (!star) {
      return "";
    }

    return `
      <button
        type="button"
        class="constellation-star${this.state.selectedStarId === star.id ? " is-selected" : ""}"
        data-star-id="${escapeHtml(star.id)}"
        data-drag-id="${escapeHtml(star.id)}"
        data-testid="constellation-star-${escapeHtml(star.id)}"
        aria-pressed="${this.state.selectedStarId === star.id}"
      >
        ${escapeHtml(star.label)}
      </button>
    `;
  }

  private renderPlacedStar(star: ExhibitStar): string {
    return `
      <span
        class="constellation-placed-star${this.state.selectedStarId === star.id ? " is-selected" : ""}"
        data-star-id="${escapeHtml(star.id)}"
        data-drag-id="${escapeHtml(star.id)}"
      >
        ${escapeHtml(star.label)}
      </span>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-star-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const starId = button.dataset.starId;
        if (!starId) {
          return;
        }
        if (button.closest(".constellation-node")) {
          return;
        }
        this.state = selectStar(this.state, starId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-node-id]").forEach((nodeButton) => {
      nodeButton.addEventListener("click", () => {
        const nodeId = nodeButton.dataset.nodeId;
        if (!nodeId) {
          return;
        }
        if (this.state.selectedStarId) {
          this.state = placeSelectedStarOnNode(this.spec, this.state, nodeId);
          this.render(onSolved);
          return;
        }
        const placedStarId = this.state.placedStarsByNodeId[nodeId];
        if (!placedStarId) {
          return;
        }
        this.state = removeStarFromNode(this.spec, this.state, nodeId);
        this.state = selectStar(this.state, placedStarId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-case-constellation"]')?.addEventListener("click", () => {
      this.state = resetCaseConstellation(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-case-constellation"]')?.addEventListener("click", () => {
      const result = checkCaseConstellationAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);
      if (result.solved) {
        onSolved();
      }
    });
  }

  private bindDragDrop(onSolved: () => void): void {
    this.destroyDragDrop = createPointerDragDrop({
      root: this.root,
      draggableSelector: "[data-drag-id]",
      dropTargetSelector: "[data-drop-id]",
      dragDataAttribute: "dragId",
      dropDataAttribute: "dropId",
      onDrop: (starId, dropId) => {
        this.handleDraggedStarDrop(starId, dropId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedStarDrop(starId: string, dropId: string | null): void {
    if (!dropId) {
      return;
    }
    if (dropId === "tray") {
      const nodeId = Object.entries(this.state.placedStarsByNodeId).find(([, placedStarId]) => placedStarId === starId)?.[0];
      if (nodeId) {
        this.state = removeStarFromNode(this.spec, this.state, nodeId);
      }
      return;
    }
    this.state = selectStar(this.state, starId);
    this.state = placeSelectedStarOnNode(this.spec, this.state, dropId);
  }
}
