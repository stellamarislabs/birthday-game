import { escapeHtml } from "../caseMosaic/caseMosaicRenderer";
import { createPointerDragDrop } from "../shared/dragDrop";
import { getDepositionOrderFinalAsset } from "./depositionOrderFinalAssets";
import {
  checkDepositionOrderAnswer,
  createInitialDepositionOrderState,
  getDepositionSlotPlacementStatus,
  getDepositionOrderProgress,
  getStripInSlot,
  getTrayStripIds,
  placeSelectedStripInSlot,
  placeStripInSlot,
  removeStripFromSlot,
  resetDepositionOrder,
  selectStrip
} from "./depositionOrderLogic";
import type { DepositionOrderSpec, DepositionOrderState, DepositionStripSpec } from "./depositionOrderTypes";

interface DepositionOrderPuzzleOptions {
  spec: DepositionOrderSpec;
  onSolved: () => void;
}

export class DepositionOrderPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: DepositionOrderSpec;
  private state: DepositionOrderState;
  private cleanupDragDrop: (() => void) | null = null;

  constructor(options: DepositionOrderPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialDepositionOrderState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "deposition-order-puzzle";
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

    const progress = getDepositionOrderProgress(this.spec, this.state);
    const backgroundAsset = getDepositionOrderFinalAsset("background");
    const backgroundStyle = backgroundAsset.imageUrl
      ? ` style="--deposition-bg-image: url('${escapeHtml(backgroundAsset.imageUrl)}');"`
      : "";
    const notePaperAsset = getDepositionOrderFinalAsset("witnessNotePaper");
    const notePaperImage = notePaperAsset.imageUrl
      ? `<img class="deposition-note-paper-image" src="${escapeHtml(notePaperAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    this.root.innerHTML = `
      <section class="puzzle-panel document-order-panel deposition-order-panel${backgroundAsset.imageUrl ? " has-final-background" : ""}"${backgroundStyle}>
        <div class="case-mosaic-heading document-order-heading">
          <p class="puzzle-kicker">Deposition Order</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-mosaic-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="document-order-play-area deposition-order-play-area ${progress.archiveCodeVisible ? "is-solved" : ""}">
          <aside class="document-tray deposition-strip-tray" aria-label="Statement strips">
            <h2>Statement Strips</h2>
            <p>Tap a strip, then tap a line.</p>
            <div class="document-card-list" data-drop-id="tray">
              ${this.renderTrayStrips()}
            </div>
          </aside>

          <section class="document-file deposition-note${notePaperAsset.imageUrl ? " has-final-paper" : ""}" aria-label="Witness note">
            ${notePaperImage}
            <div class="document-file-title">Witness Note</div>
            ${this.spec.slots.map((slot) => this.renderSlot(slot.id, slot.label)).join("")}
            <div class="document-archive-code ${progress.archiveCodeVisible ? "is-visible" : ""}" data-testid="deposition-archive-code" aria-live="polite">
              <span>${escapeHtml(this.spec.archiveCodeLabel)}</span>
              <strong>${progress.archiveCodeVisible ? escapeHtml(this.spec.archiveCode) : "..."}</strong>
            </div>
          </section>
        </div>

        <div class="case-mosaic-progress document-order-progress" data-testid="deposition-order-progress" aria-live="polite">
          <p>Lines placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong></p>
          <p>${progress.archiveCodeVisible ? "Archive code revealed." : "Statement still being rebuilt."}</p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-deposition-order">Reset Statement</button>
          <button type="button" class="primary-button" data-testid="submit-deposition-order">File Clue</button>
        </div>
        <p class="puzzle-feedback${this.state.feedback ? "" : " is-empty"}" data-testid="deposition-order-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderTrayStrips(): string {
    return getTrayStripIds(this.spec, this.state)
      .map((stripId) => this.renderStrip(this.getStrip(stripId), "tray"))
      .join("");
  }

  private renderSlot(slotId: string, label: string): string {
    const stripId = getStripInSlot(this.state, slotId);
    const placementStatus = getDepositionSlotPlacementStatus(this.spec, this.state, slotId);
    const placementClass =
      placementStatus === "correct" ? " is-correct" : placementStatus === "incorrect" ? " is-incorrect" : "";
    const selected = stripId !== null && stripId === this.state.selectedStripId;

    return `
      <button
        type="button"
        class="document-slot deposition-slot${placementClass}"
        data-slot-id="${escapeHtml(slotId)}"
        data-drop-id="${escapeHtml(slotId)}"
        data-testid="deposition-slot-${escapeHtml(slotId)}"
        data-placement-status="${escapeHtml(placementStatus)}"
        aria-label="${escapeHtml(label)}"
      >
        <span class="document-slot-label">${escapeHtml(label)}</span>
        ${
          stripId
            ? this.renderStrip(this.getStrip(stripId), "slot", selected, placementStatus)
            : '<span class="document-empty-slot">Place strip</span>'
        }
      </button>
    `;
  }

  private renderStrip(
    strip: DepositionStripSpec,
    _location: "tray" | "slot",
    selected = false,
    placementStatus: "empty" | "correct" | "incorrect" = "empty"
  ): string {
    const selectedClass = selected || strip.id === this.state.selectedStripId ? " is-selected" : "";
    const placementClass =
      placementStatus === "correct"
        ? " is-placement-correct"
        : placementStatus === "incorrect"
          ? " is-placement-incorrect"
          : "";
    const stripShellAsset = getDepositionOrderFinalAsset("statementStripShell");
    // Keep the asset mapping active for future art passes, but use the cleaner CSS parchment strip in the live build.
    const stripShellImage = "";

    return `
      <span
        class="document-card deposition-strip${stripShellAsset.imageUrl ? " has-final-shell" : ""}${selectedClass}${placementClass}"
        data-strip-id="${escapeHtml(strip.id)}"
        data-drag-id="${escapeHtml(strip.id)}"
        data-testid="deposition-strip-${escapeHtml(strip.id)}"
      >
        ${stripShellImage}
        <strong>${escapeHtml(strip.shortLabel)}</strong>
        <span>${escapeHtml(strip.text)}</span>
      </span>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-strip-id]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        const stripId = element.dataset.stripId;
        if (!stripId) {
          return;
        }

        this.state = selectStrip(this.state, stripId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((slot) => {
      slot.addEventListener("click", () => {
        const slotId = slot.dataset.slotId;
        if (!slotId) {
          return;
        }

        if (this.state.selectedStripId) {
          this.state = placeSelectedStripInSlot(this.spec, this.state, slotId);
        } else {
          this.state = removeStripFromSlot(this.spec, this.state, slotId);
        }

        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-deposition-order"]')?.addEventListener("click", () => {
      this.state = resetDepositionOrder(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-deposition-order"]')?.addEventListener("click", () => {
      const result = checkDepositionOrderAnswer(this.spec, this.state);
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
      onDrop: (stripId, slotId) => {
        if (!slotId || slotId === "tray") {
          return;
        }

        this.state = placeStripInSlot(this.spec, this.state, stripId, slotId);
        this.render(onSolved);
      }
    });
  }

  private getStrip(stripId: string): DepositionStripSpec {
    const strip = this.spec.strips.find((candidate) => candidate.id === stripId);
    if (!strip) {
      throw new Error(`Unknown deposition strip: ${stripId}`);
    }

    return strip;
  }
}
