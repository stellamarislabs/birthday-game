import { escapeHtml } from "../caseMosaic/caseMosaicRenderer";
import { createPointerDragDrop } from "../shared/dragDrop";
import {
  checkCaseFileSortingAnswer,
  createInitialCaseFileSortingState,
  getCaseFileSlotPlacementStatus,
  getCaseFileSortingProgress,
  getDocumentInSlot,
  getTrayDocumentIds,
  placeDocumentInSlot,
  placeSelectedDocumentInSlot,
  removeDocumentFromSlot,
  resetCaseFileSorting,
  selectDocument,
  takeCaseFileSilverKey
} from "./caseFileSortingLogic";
import { getCaseFileSortingFinalAsset } from "./caseFileSortingFinalAssets";
import type { CaseFileDocumentSpec, CaseFileSortingSpec, CaseFileSortingState } from "./caseFileSortingTypes";

interface CaseFileSortingPuzzleOptions {
  spec: CaseFileSortingSpec;
  onSolved: () => void;
}

export class CaseFileSortingPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: CaseFileSortingSpec;
  private state: CaseFileSortingState;
  private cleanupDragDrop: (() => void) | null = null;

  constructor(options: CaseFileSortingPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialCaseFileSortingState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "case-file-sorting-puzzle";
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

    const progress = getCaseFileSortingProgress(this.spec, this.state);
    const backgroundAsset = getCaseFileSortingFinalAsset("background");
    const backgroundStyle = backgroundAsset.imageUrl
      ? ` style="--case-file-sorting-bg-image: url('${escapeHtml(backgroundAsset.imageUrl)}');"`
      : "";
    const boardAsset = getCaseFileSortingFinalAsset("archiveFileBoard");
    const boardImage = boardAsset.imageUrl
      ? `<img class="case-file-board-image" src="${escapeHtml(boardAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    this.root.innerHTML = `
      <section class="puzzle-panel document-order-panel case-file-sorting-panel${backgroundAsset.imageUrl ? " has-final-background" : ""}"${backgroundStyle}>
        <div class="case-mosaic-heading document-order-heading">
          <p class="puzzle-kicker">Case File Sorting</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-mosaic-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="document-order-play-area case-file-sorting-play-area ${progress.correctionVisible ? "is-solved" : ""}">
          <aside class="document-tray case-file-document-tray" aria-label="Archive documents">
            <h2>Archive Documents</h2>
            <p>Tap a document, then tap a file slot.</p>
            <div class="document-card-list" data-drop-id="tray">
              ${this.renderTrayDocuments()}
            </div>
          </aside>

          <section class="document-file case-file-board${boardAsset.imageUrl ? " has-final-board" : ""}" aria-label="Sorted case file">
            ${boardImage}
            <div class="document-file-title">Archive File</div>
            <div class="case-file-slots">
              ${this.spec.slots.map((slot) => this.renderSlot(slot.id, slot.label)).join("")}
            </div>
            ${progress.correctionVisible ? "" : this.renderCorrectionPlaceholder()}
            ${this.renderSilverKey(progress.keyAvailable)}
          </section>
        </div>

        <div class="case-mosaic-progress document-order-progress" data-testid="case-file-sorting-progress" aria-live="polite">
          <p>Documents placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong></p>
          <p>${progress.keyTaken ? "Silver Key taken." : progress.correctionVisible ? "Correction aligned." : "Margin marks are still scattered."}</p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-case-file-sorting">Reset File</button>
          <button type="button" class="primary-button" data-testid="submit-case-file-sorting">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="case-file-sorting-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderTrayDocuments(): string {
    return getTrayDocumentIds(this.spec, this.state)
      .map((documentId) => this.renderDocument(this.getDocument(documentId), "tray"))
      .join("");
  }

  private renderSlot(slotId: string, label: string): string {
    const documentId = getDocumentInSlot(this.state, slotId);
    const placementStatus = getCaseFileSlotPlacementStatus(this.spec, this.state, slotId);
    const placementClass =
      placementStatus === "correct" ? " is-correct" : placementStatus === "incorrect" ? " is-incorrect" : "";
    const selected = documentId !== null && documentId === this.state.selectedDocumentId;

    return `
      <button
        type="button"
        class="document-slot case-file-slot${placementClass} ${this.state.selectedDocumentId ? "is-drop-available" : ""}"
        data-slot-id="${escapeHtml(slotId)}"
        data-drop-id="${escapeHtml(slotId)}"
        data-testid="case-file-slot-${escapeHtml(slotId)}"
        data-placement-status="${escapeHtml(placementStatus)}"
        aria-label="File position ${escapeHtml(label)}"
      >
        <span class="document-slot-label">${escapeHtml(label)}</span>
        ${
          documentId
            ? this.renderDocument(this.getDocument(documentId), "slot", selected, placementStatus)
            : '<span class="document-empty-slot">Place file</span>'
        }
      </button>
    `;
  }

  private renderDocument(
    document: CaseFileDocumentSpec,
    _location: "tray" | "slot",
    selected = false,
    placementStatus: "empty" | "correct" | "incorrect" = "empty"
  ): string {
    const selectedClass = selected || document.id === this.state.selectedDocumentId ? " is-selected" : "";
    const placementClass =
      placementStatus === "correct"
        ? " is-placement-correct"
        : placementStatus === "incorrect"
          ? " is-placement-incorrect"
          : "";
    const shellAsset = getCaseFileSortingFinalAsset("documentCardShell");
    const shellImage = shellAsset.imageUrl
      ? `<img class="case-file-card-shell-image" src="${escapeHtml(shellAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    return `
      <span
        class="document-card case-file-card${shellAsset.imageUrl ? " has-final-shell" : ""}${selectedClass}${placementClass}"
        data-document-id="${escapeHtml(document.id)}"
        data-drag-id="${escapeHtml(document.id)}"
        data-testid="case-file-document-${escapeHtml(document.id)}"
      >
        ${shellImage}
        <span class="case-file-symbol">${escapeHtml(document.symbol)}</span>
        <strong>${escapeHtml(document.title)}</strong>
        <span>${escapeHtml(document.label)}</span>
      </span>
    `;
  }

  private renderCorrectionPlaceholder(): string {
    return `
      <div class="case-file-correction" data-testid="case-file-correction" aria-live="polite">
        <span>File status</span>
        <strong>...</strong>
      </div>
    `;
  }

  private renderSilverKey(available: boolean): string {
    if (!available) {
      return "";
    }

    const keyAsset = getCaseFileSortingFinalAsset("silverKey");
    const keyImage = keyAsset.imageUrl
      ? `<img class="case-file-silver-key-image" src="${escapeHtml(keyAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    return `
      <div class="case-file-key-cta${this.state.keyTaken ? " is-taken" : ""}" data-testid="case-file-key-cta" aria-live="polite">
        <p>${this.state.keyTaken ? "Silver Key taken." : "The file is aligned. Take the key."}</p>
        <button type="button" class="case-file-silver-key${keyAsset.imageUrl ? " has-final-key" : ""} ${this.state.keyTaken ? "is-taken" : ""}" data-testid="case-file-silver-key" aria-pressed="${this.state.keyTaken}">
          ${keyImage}
          <span aria-hidden="true"></span>
          ${this.state.keyTaken ? "Key taken" : "Take the key"}
        </button>
      </div>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-document-id]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        const documentId = element.dataset.documentId;
        if (!documentId) {
          return;
        }

        this.state = selectDocument(this.state, documentId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((slot) => {
      slot.addEventListener("click", () => {
        const slotId = slot.dataset.slotId;
        if (!slotId) {
          return;
        }

        if (this.state.selectedDocumentId) {
          this.state = placeSelectedDocumentInSlot(this.spec, this.state, slotId);
        } else {
          this.state = removeDocumentFromSlot(this.spec, this.state, slotId);
        }

        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="case-file-silver-key"]')?.addEventListener("click", () => {
      this.state = takeCaseFileSilverKey(this.spec, this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-case-file-sorting"]')?.addEventListener("click", () => {
      this.state = resetCaseFileSorting(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-case-file-sorting"]')?.addEventListener("click", () => {
      const result = checkCaseFileSortingAnswer(this.spec, this.state);
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
      onDrop: (documentId, slotId) => {
        if (!slotId || slotId === "tray") {
          return;
        }

        this.state = placeDocumentInSlot(this.spec, this.state, documentId, slotId);
        this.render(onSolved);
      }
    });
  }

  private getDocument(documentId: string): CaseFileDocumentSpec {
    const document = this.spec.documents.find((candidate) => candidate.id === documentId);
    if (!document) {
      throw new Error(`Unknown case file document: ${documentId}`);
    }

    return document;
  }
}
