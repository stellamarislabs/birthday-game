import {
  checkCaseBoardAnswer,
  createInitialCaseBoardState,
  placeSelectedTileInSlot,
  removeTileFromSlot,
  resetCaseBoard,
  selectTile
} from "./caseBoardLogic";
import {
  escapeHtml,
  getConnectionClass,
  getPathSummary,
  getPlacedTile,
  getSolvedStampClass,
  getTile,
  getTrayTiles,
  isSlotLocked
} from "./caseBoardRenderer";
import type { BoardSlot, CaseBoardSpec, CaseBoardState, CaseTile } from "./caseBoardTypes";

interface CaseBoardPuzzleOptions {
  spec: CaseBoardSpec;
  onSolved: () => void;
}

export class CaseBoardPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: CaseBoardSpec;
  private state: CaseBoardState;

  constructor(options: CaseBoardPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialCaseBoardState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "case-board-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const selectedTile = getTile(this.spec, this.state.selectedTileId ?? undefined);

    this.root.innerHTML = `
      <section class="puzzle-panel case-board-panel">
        <div class="case-board-heading">
          <p class="puzzle-kicker">Build the Path to Truth</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-board-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <section class="case-board-surface${getSolvedStampClass(this.spec, this.state)}" aria-label="Case path board">
          <div class="case-board-stamp" aria-hidden="true">PATH COMPLETE</div>
          <div class="case-board-path" data-testid="case-board-path">
            ${this.renderBoardPath()}
          </div>
        </section>

        <section class="case-board-tray" aria-label="Available case tiles">
          <div class="case-board-tray-header">
            <h2>Tile Tray</h2>
            <p>${selectedTile ? `Selected: ${escapeHtml(selectedTile.label)}` : "Select a tile, then choose its slot."}</p>
          </div>
          <div class="case-board-tile-list">
            ${getTrayTiles(this.spec, this.state).map((tile) => this.renderTrayTile(tile)).join("")}
            ${selectedTile && !getTrayTiles(this.spec, this.state).some((tile) => tile.id === selectedTile.id) ? this.renderHeldTile(selectedTile) : ""}
          </div>
        </section>

        <div class="case-board-summary" data-testid="case-board-summary" aria-live="polite">
          <p>Current path: <strong>${escapeHtml(getPathSummary(this.spec, this.state))}</strong></p>
          <p>Lit connections: <strong>${this.state.activeConnections.length} / ${Math.max(this.spec.boardSlots.length - 1, 1)}</strong></p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-case-board">Reset Board</button>
          <button type="button" class="primary-button" data-testid="submit-case-board">Submit Path</button>
        </div>
        <p class="puzzle-feedback" data-testid="case-board-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderBoardPath(): string {
    return this.spec.boardSlots
      .map((slot, index) => {
        const nextSlot = this.spec.boardSlots[index + 1];
        const slotMarkup = this.renderSlot(slot);
        const connectionMarkup = nextSlot ? this.renderConnection(slot, nextSlot) : "";

        return `${slotMarkup}${connectionMarkup}`;
      })
      .join("");
  }

  private renderSlot(slot: BoardSlot): string {
    const placedTile = getPlacedTile(this.spec, this.state, slot);
    const locked = isSlotLocked(slot);
    const selectedCanFit = this.state.selectedTileId
      ? slot.acceptsTileTypes.includes(getTile(this.spec, this.state.selectedTileId ?? undefined)?.tileType ?? "decoy")
      : false;

    return `
      <button
        type="button"
        class="case-board-slot${locked ? " is-locked" : ""}${placedTile ? " is-filled" : ""}${selectedCanFit && !locked ? " can-place" : ""}"
        data-slot-id="${escapeHtml(slot.id)}"
        data-testid="case-board-slot-${escapeHtml(slot.id)}"
        aria-label="${escapeHtml(slot.label)}"
      >
        <span class="case-board-slot-label">${escapeHtml(slot.label)}</span>
        <strong>${placedTile ? escapeHtml(placedTile.label) : "Empty"}</strong>
        ${placedTile?.description ? `<em>${escapeHtml(placedTile.description)}</em>` : `<em>${locked ? "Filed" : "Tap to place selected tile."}</em>`}
      </button>
    `;
  }

  private renderConnection(fromSlot: BoardSlot, toSlot: BoardSlot): string {
    return `
      <div
        class="case-board-connection${getConnectionClass(this.spec, this.state, fromSlot, toSlot)}"
        data-testid="case-board-connection-${escapeHtml(fromSlot.id)}-${escapeHtml(toSlot.id)}"
        aria-hidden="true"
      >
        <span></span>
      </div>
    `;
  }

  private renderTrayTile(tile: CaseTile): string {
    return `
      <button
        type="button"
        class="case-board-tile${this.state.selectedTileId === tile.id ? " is-selected" : ""}"
        data-tile-id="${escapeHtml(tile.id)}"
        data-testid="case-board-tile-${escapeHtml(tile.id)}"
        aria-pressed="${this.state.selectedTileId === tile.id}"
      >
        <strong>${escapeHtml(tile.label)}</strong>
        ${tile.description ? `<span>${escapeHtml(tile.description)}</span>` : ""}
      </button>
    `;
  }

  private renderHeldTile(tile: CaseTile): string {
    return `
      <button
        type="button"
        class="case-board-tile is-selected is-held"
        data-tile-id="${escapeHtml(tile.id)}"
        data-testid="case-board-tile-${escapeHtml(tile.id)}"
        aria-pressed="true"
      >
        <strong>${escapeHtml(tile.label)}</strong>
        ${tile.description ? `<span>${escapeHtml(tile.description)}</span>` : ""}
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-tile-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const tileId = button.dataset.tileId;
        if (!tileId) {
          return;
        }

        this.state = selectTile(this.spec, this.state, tileId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const slotId = button.dataset.slotId;
        if (!slotId) {
          return;
        }

        if (this.state.selectedTileId) {
          this.state = placeSelectedTileInSlot(this.spec, this.state, slotId);
          this.render(onSolved);
          return;
        }

        const placedTileId = this.state.placedTilesBySlotId[slotId];
        const slot = this.spec.boardSlots.find((candidate) => candidate.id === slotId);
        if (!placedTileId || slot?.lockedTileId) {
          return;
        }

        this.state = removeTileFromSlot(this.spec, this.state, slotId);
        this.state = selectTile(this.spec, this.state, placedTileId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-case-board"]')?.addEventListener("click", () => {
      this.state = resetCaseBoard(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-case-board"]')?.addEventListener("click", () => {
      const result = checkCaseBoardAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }
}
