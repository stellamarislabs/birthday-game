import {
  checkArchiveDetailAnswer,
  createInitialArchiveDetailState,
  getArchiveDetailProgress,
  inspectAt,
  isArchiveSilverKeyAvailable,
  markDetail,
  resetArchiveDetailFinder,
  selectArchiveTool,
  takeArchiveSilverKey
} from "./archiveDetailFinderLogic";
import {
  escapeHtml,
  getDetailStateClass
} from "./archiveDetailFinderRenderer";
import type {
  ArchiveDetail,
  ArchiveDetailFinderSpec,
  ArchiveDetailState,
  ArchiveTool
} from "./archiveDetailFinderTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface ArchiveDetailFinderPuzzleOptions {
  spec: ArchiveDetailFinderSpec;
  onSolved: () => void;
}

export class ArchiveDetailFinderPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: ArchiveDetailFinderSpec;
  private state: ArchiveDetailState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: ArchiveDetailFinderPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialArchiveDetailState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "archive-detail-finder-puzzle";
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

    const progress = getArchiveDetailProgress(this.spec, this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel archive-detail-panel">
        <div class="archive-detail-heading">
          <p class="puzzle-kicker">Archive Overlay</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="archive-detail-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="archive-detail-play-area${this.state.solved ? " is-solved" : ""}">
          <section
            class="archive-page"
            data-testid="archive-page"
            aria-label="${escapeHtml(this.spec.evidencePageTitle)}"
          >
            <div class="archive-page-title">${escapeHtml(this.spec.evidencePageTitle)}</div>
            <div class="archive-original-line" data-testid="archive-original-line">${escapeHtml(this.spec.originalLine)}</div>
            <div class="archive-lines" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            ${this.spec.details.map((detail) => this.renderDetail(detail)).join("")}
            ${this.renderCorrection(progress.correctionComplete)}
            ${this.renderSilverKey()}
            <div
              class="archive-magnifier-position"
              style="left: ${this.state.magnifier.x}%; top: ${this.state.magnifier.y}%;"
              aria-hidden="true"
            ></div>
            <div class="archive-stamp" aria-hidden="true">NO. GIVEN.</div>
          </section>

          <section class="archive-toolbox" aria-label="Archive tools">
            ${this.renderTool("magnifier", "Magnifier")}
            ${this.renderTool("bookmark", "Margin Tab")}
            <div class="archive-progress" data-testid="archive-detail-progress" aria-live="polite">
              <p>Margins: <strong>${progress.discoveredCount} / ${progress.totalCount}</strong></p>
              <p>Key: <strong>${progress.keyTaken ? "Taken" : progress.keyAvailable ? "Ready" : "Hidden"}</strong></p>
            </div>
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-archive-detail">Reset Archive</button>
          <button type="button" class="primary-button" data-testid="submit-archive-detail">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="archive-detail-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderCorrection(isComplete: boolean): string {
    return `
      <div class="archive-correction-reveal${isComplete ? " is-visible" : ""}" data-testid="archive-correction-reveal" aria-live="polite">
        <span>Correction</span>
        <strong>${isComplete ? escapeHtml(this.spec.correctionText) : "..."}</strong>
      </div>
    `;
  }

  private renderSilverKey(): string {
    if (!isArchiveSilverKeyAvailable(this.spec, this.state)) {
      return "";
    }

    const takenClass = this.state.keyTaken ? " is-taken" : "";

    return `
      <button
        type="button"
        class="archive-silver-key${takenClass}"
        data-testid="archive-silver-key"
        aria-pressed="${this.state.keyTaken}"
      >
        <span aria-hidden="true"></span>
        ${escapeHtml(this.spec.keyLabel)}
      </button>
    `;
  }

  private renderTool(tool: ArchiveTool, label: string): string {
    const selectedClass = this.state.selectedTool === tool ? " is-selected" : "";

    return `
      <button
        type="button"
        class="archive-tool archive-tool-${tool}${selectedClass}"
        data-tool-id="${tool}"
        data-drag-id="${tool}"
        data-testid="archive-${tool}-tool"
        aria-pressed="${this.state.selectedTool === tool}"
      >
        <span class="archive-tool-icon" aria-hidden="true"></span>
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }

  private renderDetail(detail: ArchiveDetail): string {
    const discovered = this.state.discoveredDetailIds.includes(detail.id);
    const marked = this.state.markedDetailIds.includes(detail.id);
    const detailCopy = discovered
      ? `<span class="archive-detail-label">${escapeHtml(detail.label)}</span><span class="archive-detail-meaning">${escapeHtml(detail.meaning)}</span><span class="archive-detail-note">${escapeHtml(detail.note)}</span>`
      : `<span class="archive-detail-label">Faint margin mark</span><span class="archive-detail-note">Inspect with the magnifier.</span>`;
    const bookmark = marked ? `<span class="archive-bookmark-mark" aria-hidden="true">Bookmarked</span>` : "";

    return `
      <button
        type="button"
        class="archive-detail-zone${getDetailStateClass(this.state, detail)}"
        style="left: ${detail.x}%; top: ${detail.y}%;"
        data-detail-id="${escapeHtml(detail.id)}"
        data-drop-id="${escapeHtml(detail.id)}"
        data-testid="archive-detail-${escapeHtml(detail.id)}"
        aria-label="${escapeHtml(detail.label)}"
      >
        ${detailCopy}
        ${bookmark}
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-tool-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const tool = button.dataset.toolId as ArchiveTool | undefined;
        if (tool !== "magnifier" && tool !== "bookmark") {
          return;
        }

        this.state = selectArchiveTool(this.state, tool);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLElement>('[data-testid="archive-page"]')?.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.closest("[data-detail-id]")) {
        return;
      }

      if (this.state.selectedTool !== "magnifier") {
        return;
      }

      const page = event.currentTarget as HTMLElement;
      const rect = page.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      this.state = inspectAt(this.spec, this.state, x, y);
      this.updateKeyReadyFeedback();
      this.render(onSolved);
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-detail-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const detailId = button.dataset.detailId;
        const detail = this.spec.details.find((candidate) => candidate.id === detailId);
        if (!detail) {
          return;
        }

        if (this.state.selectedTool === "bookmark") {
          this.state = markDetail(this.state, detail.id);
        } else {
          this.state = inspectAt(this.spec, this.state, detail.x, detail.y);
          this.updateKeyReadyFeedback();
        }

        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="archive-silver-key"]')?.addEventListener("click", () => {
      this.state = takeArchiveSilverKey(this.spec, this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-archive-detail"]')?.addEventListener("click", () => {
      this.state = resetArchiveDetailFinder(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-archive-detail"]')?.addEventListener("click", () => {
      const result = checkArchiveDetailAnswer(this.spec, this.state);
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
      onDrop: (toolId, detailId) => {
        this.handleDraggedToolDrop(toolId, detailId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedToolDrop(toolId: string, detailId: string | null): void {
    if (!detailId) {
      return;
    }

    const detail = this.spec.details.find((candidate) => candidate.id === detailId);
    if (!detail) {
      return;
    }

    if (toolId === "magnifier") {
      this.state = inspectAt(this.spec, this.state, detail.x, detail.y);
      this.updateKeyReadyFeedback();
      return;
    }

    if (toolId === "bookmark") {
      this.state = markDetail(this.state, detail.id);
    }
  }

  private updateKeyReadyFeedback(): void {
    if (isArchiveSilverKeyAvailable(this.spec, this.state) && !this.state.keyTaken) {
      this.state = {
        ...this.state,
        feedback: this.spec.keyReadyText
      };
    }
  }
}
