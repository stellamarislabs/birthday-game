import {
  checkWitnessLensAnswer,
  createInitialWitnessLensState,
  inspectStatement,
  markStatement,
  resetWitnessLens,
  selectWitnessTool
} from "./witnessLensLogic";
import { escapeHtml, getStatementStateClass } from "./witnessLensRenderer";
import type { WitnessLensSpec, WitnessLensState, WitnessStatement, WitnessTool } from "./witnessLensTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface WitnessLensPuzzleOptions {
  spec: WitnessLensSpec;
  onSolved: () => void;
}

export class WitnessLensPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: WitnessLensSpec;
  private state: WitnessLensState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: WitnessLensPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialWitnessLensState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "witness-lens-puzzle";
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

    this.root.innerHTML = `
      <section class="puzzle-panel witness-lens-panel">
        <div class="witness-lens-heading">
          <p class="puzzle-kicker">Witness Lens</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="witness-lens-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="witness-lens-play-area${this.state.solved ? " is-solved" : ""}">
          <section class="witness-note-card" data-testid="witness-lens-evidence" aria-label="Witness note evidence">
            <span class="witness-note-label">Evidence Note</span>
            <p>${escapeHtml(this.spec.evidenceNote)}</p>
            ${this.state.solved ? this.renderArchiveCodeReveal() : ""}
          </section>

          <section class="witness-toolbox" aria-label="Evidence tools">
            <p class="witness-toolbox-hint">Tap a statement to inspect. Use the stamp to mark the contradiction.</p>
            ${this.renderTool("lens", this.spec.lensLabel)}
            ${this.renderTool("stamp", this.spec.stampLabel)}
          </section>

          <section class="witness-statement-board" aria-label="Witness statement strips">
            ${this.spec.statements.map((statement) => this.renderStatement(statement)).join("")}
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="clear-witness-mark">Clear Mark</button>
          <button type="button" class="secondary-button" data-testid="reset-witness-lens">Reset Lens</button>
          <button type="button" class="primary-button" data-testid="submit-witness-lens">${this.state.solved ? "File Clue" : "Submit Contradiction"}</button>
        </div>
        <p class="puzzle-feedback" data-testid="witness-lens-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderTool(tool: WitnessTool, label: string): string {
    const selectedClass = this.state.selectedTool === tool ? " is-selected" : "";
    const testId = tool === "lens" ? "witness-lens-tool" : "witness-stamp-tool";

    return `
      <button
        type="button"
        class="witness-tool witness-tool-${tool}${selectedClass}"
        data-tool-id="${tool}"
        data-drag-id="${tool}"
        data-testid="${testId}"
        aria-pressed="${this.state.selectedTool === tool}"
      >
        <span class="witness-tool-icon" aria-hidden="true"></span>
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }

  private renderStatement(statement: WitnessStatement): string {
    const hint = this.state.inspectedStatementId === statement.id
      ? `<span class="witness-hint" data-testid="witness-hint-${escapeHtml(statement.id)}">${escapeHtml(statement.hint)}</span>`
      : `<span class="witness-hint is-hidden">Tap to inspect.</span>`;
    const stamp = this.state.markedStatementId === statement.id
      ? `<span class="witness-stamp-mark" aria-hidden="true">${escapeHtml(this.spec.stampLabel)}</span>`
      : "";

    return `
      <button
        type="button"
        class="witness-statement${getStatementStateClass(this.state, statement)}"
        data-statement-id="${escapeHtml(statement.id)}"
        data-drop-id="${escapeHtml(statement.id)}"
        data-testid="witness-statement-${escapeHtml(statement.id)}"
        aria-label="Statement ${escapeHtml(statement.label)}"
      >
        <span class="witness-statement-letter">${escapeHtml(statement.label)}</span>
        <span class="witness-statement-copy">${escapeHtml(statement.text)}</span>
        ${hint}
        ${stamp}
      </button>
    `;
  }

  private renderArchiveCodeReveal(): string {
    return `
      <div class="witness-archive-code" data-testid="witness-archive-code" aria-label="Archive code revealed">
        <span>Archive code</span>
        <strong>V-16/05</strong>
      </div>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-tool-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const tool = button.dataset.toolId as WitnessTool | undefined;
        if (tool !== "lens" && tool !== "stamp") {
          return;
        }

        this.state = selectWitnessTool(this.state, tool);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-statement-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const statementId = button.dataset.statementId;
        if (!statementId) {
          return;
        }

        if (this.state.selectedTool === "stamp") {
          this.state = checkWitnessLensAnswer(this.spec, markStatement(this.state, statementId)).state;
        } else {
          this.state = inspectStatement(this.state, statementId);
        }

        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="clear-witness-mark"]')?.addEventListener("click", () => {
      this.state = {
        ...this.state,
        markedStatementId: null,
        solved: false,
        feedback: ""
      };
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-witness-lens"]')?.addEventListener("click", () => {
      this.state = resetWitnessLens(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-witness-lens"]')?.addEventListener("click", () => {
      const result = checkWitnessLensAnswer(this.spec, this.state);
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
      onDrop: (toolId, statementId) => {
        this.handleDraggedToolDrop(toolId, statementId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedToolDrop(toolId: string, statementId: string | null): void {
    if (!statementId) {
      return;
    }

    if (toolId === "lens") {
      this.state = inspectStatement(this.state, statementId);
      return;
    }

    if (toolId === "stamp") {
      this.state = checkWitnessLensAnswer(this.spec, markStatement(this.state, statementId)).state;
    }
  }
}
