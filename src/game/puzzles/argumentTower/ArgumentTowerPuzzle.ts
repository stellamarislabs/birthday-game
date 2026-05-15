import {
  checkArgumentTowerAnswer,
  createInitialArgumentTowerState,
  getArgumentTowerProgress,
  placeSelectedBlockInSlot,
  removeBlockFromSlot,
  resetArgumentTower,
  selectBlock
} from "./argumentTowerLogic";
import { escapeHtml, getPlacedBlock, getSlotStateClass } from "./argumentTowerRenderer";
import type { ArgumentBlock, ArgumentTowerSpec, ArgumentTowerState } from "./argumentTowerTypes";
import { createPointerDragDrop } from "../shared/dragDrop";

interface ArgumentTowerPuzzleOptions {
  spec: ArgumentTowerSpec;
  onSolved: () => void;
}

export class ArgumentTowerPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: ArgumentTowerSpec;
  private state: ArgumentTowerState;
  private destroyDragDrop: (() => void) | null = null;

  constructor(options: ArgumentTowerPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialArgumentTowerState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "argument-tower-puzzle";
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
    const progress = getArgumentTowerProgress(this.spec, this.state);

    this.root.innerHTML = `
      <section class="puzzle-panel tactile-panel argument-tower-panel">
        <div class="tactile-heading">
          <p class="puzzle-kicker">Argument Tower</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="tactile-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="argument-tower-play-area${this.state.solved ? " is-solved" : ""}">
          <section class="argument-tower-frame" aria-label="Argument tower frame">
            <div class="blue-ribbon-wrap" aria-hidden="true">BLUE RIBBON</div>
            ${this.spec.slots.map((slot) => {
              const block = getPlacedBlock(this.spec, this.state, slot.id);
              return `
                <button
                  type="button"
                  class="argument-tower-slot argument-tower-slot-${escapeHtml(slot.id)}${getSlotStateClass(this.spec, this.state, slot.id)}"
                  data-slot-id="${escapeHtml(slot.id)}"
                  data-drop-id="${escapeHtml(slot.id)}"
                  data-testid="argument-tower-slot-${escapeHtml(slot.id)}"
                >
                  <span class="argument-slot-label">${escapeHtml(slot.label)}</span>
                  ${block ? this.renderPlacedBlock(block) : `<span class="argument-slot-empty">Place block</span>`}
                </button>
              `;
            }).join("")}
          </section>

          <section class="argument-block-tray" data-drop-id="tray" data-testid="argument-tower-tray" aria-label="Evidence block tray">
            <div class="argument-progress" data-testid="argument-tower-progress" aria-live="polite">
              Placed: <strong>${progress.placedCount} / ${progress.totalCount}</strong>
              Stable: <strong>${progress.stableCount} / ${progress.totalCount}</strong>
            </div>
            <div class="argument-block-list">
              ${this.state.trayBlockIds.map((blockId) => this.renderTrayBlock(blockId)).join("")}
            </div>
          </section>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-argument-tower">Reset Tower</button>
          <button type="button" class="primary-button" data-testid="submit-argument-tower">Accept Argument</button>
        </div>
        <p class="puzzle-feedback" data-testid="argument-tower-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
    this.bindDragDrop(onSolved);
  }

  private renderTrayBlock(blockId: string): string {
    const block = this.spec.blocks.find((candidate) => candidate.id === blockId);
    if (!block) {
      return "";
    }

    return `
      <button
        type="button"
        class="argument-block${block.isDecoy ? " is-decoy" : ""}${this.state.selectedBlockId === block.id ? " is-selected" : ""}"
        data-block-id="${escapeHtml(block.id)}"
        data-drag-id="${escapeHtml(block.id)}"
        data-testid="argument-block-${escapeHtml(block.id)}"
        aria-pressed="${this.state.selectedBlockId === block.id}"
      >
        <strong>${escapeHtml(block.label)}</strong>
        <span>${escapeHtml(block.description)}</span>
      </button>
    `;
  }

  private renderPlacedBlock(block: ArgumentBlock): string {
    return `
      <span
        class="argument-placed-block${block.isDecoy ? " is-decoy" : ""}${this.state.selectedBlockId === block.id ? " is-selected" : ""}"
        data-block-id="${escapeHtml(block.id)}"
        data-drag-id="${escapeHtml(block.id)}"
      >
        <strong>${escapeHtml(block.label)}</strong>
        <span>${escapeHtml(block.description)}</span>
      </span>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLElement>("[data-block-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const blockId = button.dataset.blockId;
        if (!blockId) {
          return;
        }

        if (button.closest(".argument-tower-slot")) {
          return;
        }

        this.state = selectBlock(this.state, blockId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-slot-id]").forEach((slotButton) => {
      slotButton.addEventListener("click", () => {
        const slotId = slotButton.dataset.slotId;
        if (!slotId) {
          return;
        }

        if (this.state.selectedBlockId) {
          this.state = placeSelectedBlockInSlot(this.spec, this.state, slotId);
          this.render(onSolved);
          return;
        }

        const placedBlockId = this.state.placedBlocksBySlotId[slotId];
        if (!placedBlockId) {
          return;
        }

        this.state = removeBlockFromSlot(this.spec, this.state, slotId);
        this.state = selectBlock(this.state, placedBlockId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-argument-tower"]')?.addEventListener("click", () => {
      this.state = resetArgumentTower(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-argument-tower"]')?.addEventListener("click", () => {
      const result = checkArgumentTowerAnswer(this.spec, this.state);
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
      onDrop: (blockId, dropId) => {
        this.handleDraggedBlockDrop(blockId, dropId);
        this.render(onSolved);
      }
    });
  }

  private handleDraggedBlockDrop(blockId: string, dropId: string | null): void {
    if (!dropId) {
      return;
    }

    if (dropId === "tray") {
      const slotId = Object.entries(this.state.placedBlocksBySlotId).find(([, placedBlockId]) => placedBlockId === blockId)?.[0];
      if (slotId) {
        this.state = removeBlockFromSlot(this.spec, this.state, slotId);
      }
      return;
    }

    this.state = selectBlock(this.state, blockId);
    this.state = placeSelectedBlockInSlot(this.spec, this.state, dropId);
  }
}
