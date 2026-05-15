import {
  checkCaseMosaicAnswer,
  createInitialCaseMosaicState,
  getCaseMosaicProgress,
  getMosaicSlotId,
  placeSelectedPieceInSlot,
  removePieceFromSlot,
  resetCaseMosaic,
  selectPiece
} from "./caseMosaicLogic";
import {
  escapeHtml,
  getPlacedPiece,
  getSlotStateClass,
  getTrayPieces,
  renderPieceArt
} from "./caseMosaicRenderer";
import type { CaseMosaicSpec, CaseMosaicState } from "./caseMosaicTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface CaseMosaicPuzzleOptions {
  spec: CaseMosaicSpec;
  onSolved: () => void;
}

export class CaseMosaicPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: CaseMosaicSpec;
  private state: CaseMosaicState;
  private cleanupDragDrop: (() => void) | null = null;

  constructor(options: CaseMosaicPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialCaseMosaicState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "case-mosaic-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.cleanupDragDrop?.();
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    this.cleanupDragDrop?.();
    this.cleanupDragDrop = null;

    const progress = getCaseMosaicProgress(this.spec, this.state);
    const solved = progress.correctCount === progress.totalCount;
    const feedbackText =
      this.state.feedback ||
      (solved
        ? [this.spec.successText, this.spec.successFollowUp].filter(Boolean).join(" ")
        : "");

    this.root.innerHTML = `
      <section class="puzzle-panel case-mosaic-panel">
        <div class="case-mosaic-heading">
          <p class="puzzle-kicker">Case Mosaic</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-mosaic-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="case-mosaic-play-area">
          <div class="case-mosaic-frame ${solved ? "is-solved" : ""}" aria-label="Envelope reconstruction frame">
            <div
              class="case-mosaic-board"
              data-testid="case-mosaic-board"
              style="--mosaic-columns: ${this.spec.columns}; --mosaic-rows: ${this.spec.rows};"
            >
              ${this.renderSlots()}
            </div>
            <div class="case-mosaic-stamp" aria-hidden="true">Clue Restored</div>
            ${solved ? this.renderSolvedPayoff() : ""}
          </div>

          <aside class="case-mosaic-tray" aria-label="Envelope pieces">
            <div class="case-mosaic-tray-header">
              <h2>Envelope Pieces</h2>
              <p>Tap a piece, then tap a slot.</p>
            </div>
            <div
              class="case-mosaic-piece-list"
              data-testid="case-mosaic-tray"
              data-drop-id="tray"
              aria-label="Available pieces"
            >
              ${this.renderTrayPieces()}
            </div>
          </aside>
        </div>

        <div class="case-mosaic-progress" data-testid="case-mosaic-progress" aria-live="polite">
          <p>Placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong></p>
          <p>Aligned: <strong>${progress.correctCount} / ${progress.totalCount}</strong></p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-case-mosaic">Reset Mosaic</button>
          <button type="button" class="primary-button" data-testid="submit-case-mosaic">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="case-mosaic-feedback" aria-live="polite">${escapeHtml(feedbackText)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderSlots(): string {
    const slots: string[] = [];

    for (let row = 0; row < this.spec.rows; row += 1) {
      for (let col = 0; col < this.spec.columns; col += 1) {
        const piece = getPlacedPiece(this.spec, this.state, row, col);
        const slotId = getMosaicSlotId(row, col);
        const selectedClass = piece?.id === this.state.selectedPieceId ? " is-selected" : "";

        slots.push(`
          <button
            type="button"
            class="case-mosaic-slot${getSlotStateClass(this.spec, this.state, row, col)}"
            data-testid="case-mosaic-slot-${row}-${col}"
            data-row="${row}"
            data-col="${col}"
            data-drop-id="${slotId}"
            aria-label="Envelope slot ${row + 1}, ${col + 1}"
          >
            ${
              piece
                ? `
                  <span
                    class="case-mosaic-placed-piece${selectedClass}"
                    data-piece-id="${escapeHtml(piece.id)}"
                    data-drag-id="${escapeHtml(piece.id)}"
                  >
                    ${renderPieceArt(piece, "slot")}
                    <span class="case-mosaic-piece-label">${escapeHtml(piece.label)}</span>
                  </span>
                `
                : '<span class="case-mosaic-empty">+</span>'
            }
          </button>
        `);
      }
    }

    return slots.join("");
  }

  private renderTrayPieces(): string {
    return getTrayPieces(this.spec, this.state)
      .map((piece) => {
        const selectedClass = piece.id === this.state.selectedPieceId ? " is-selected" : "";
        return `
          <button
            type="button"
            class="case-mosaic-piece${selectedClass}"
            data-testid="case-mosaic-piece-${escapeHtml(piece.id)}"
            data-piece-id="${escapeHtml(piece.id)}"
            data-drag-id="${escapeHtml(piece.id)}"
          >
            ${renderPieceArt(piece, "tray")}
            <span class="case-mosaic-piece-label">${escapeHtml(piece.label)}</span>
          </button>
        `;
      })
      .join("");
  }

  private renderSolvedPayoff(): string {
    return `
      <div class="case-mosaic-payoff" data-testid="case-mosaic-payoff" aria-label="Restored envelope payoff">
        <span class="case-mosaic-payoff-item case-mosaic-payoff-key" data-testid="case-mosaic-key-payoff">
          <span aria-hidden="true"></span>
          ${escapeHtml(this.spec.keyLabel)}
        </span>
        <span class="case-mosaic-payoff-item case-mosaic-payoff-ticket" data-testid="case-mosaic-ticket-payoff">
          <span aria-hidden="true"></span>
          ${escapeHtml(this.spec.ticketLabel)}
        </span>
        <span class="case-mosaic-payoff-item case-mosaic-payoff-route" data-testid="case-mosaic-route-payoff">
          <span aria-hidden="true"></span>
          ${escapeHtml(this.spec.routeLabel)}
        </span>
      </div>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-piece-id]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        const pieceId = element.dataset.pieceId;
        if (!pieceId) {
          return;
        }

        this.state = selectPiece(this.state, pieceId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>(".case-mosaic-slot").forEach((slot) => {
      slot.addEventListener("click", () => {
        const row = Number(slot.dataset.row);
        const col = Number(slot.dataset.col);

        if (this.state.selectedPieceId) {
          this.state = placeSelectedPieceInSlot(this.spec, this.state, row, col);
        } else {
          this.state = removePieceFromSlot(this.spec, this.state, row, col);
        }

        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-case-mosaic"]')?.addEventListener("click", () => {
      this.state = resetCaseMosaic(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-case-mosaic"]')?.addEventListener("click", () => {
      const result = checkCaseMosaicAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }

  private bindDragDrop(onSolved: () => void): void {
    this.cleanupDragDrop = createPointerDragDrop({
      root: this.root,
      draggableSelector: "[data-drag-id]",
      dropTargetSelector: "[data-drop-id]",
      dragDataAttribute: "dragId",
      dropDataAttribute: "dropId",
      onDrop: (pieceId, dropId) => {
        const sourceState = selectPiece(this.state, pieceId);
        if (!dropId || dropId === "tray") {
          const slot = Object.keys(sourceState.placedPiecesBySlot).find(
            (slotId) => sourceState.placedPiecesBySlot[slotId] === pieceId
          );
          if (slot) {
            const [rowPart, colPart] = slot.split("-");
            const row = Number(rowPart?.replace("r", ""));
            const col = Number(colPart?.replace("c", ""));
            this.state = removePieceFromSlot(this.spec, sourceState, row, col);
            this.render(onSolved);
          }
          return;
        }

        const slotMatch = /^r(\d+)-c(\d+)$/.exec(dropId);
        if (!slotMatch) {
          return;
        }

        this.state = placeSelectedPieceInSlot(this.spec, sourceState, Number(slotMatch[1]), Number(slotMatch[2]));
        this.render(onSolved);
      }
    });
  }
}
