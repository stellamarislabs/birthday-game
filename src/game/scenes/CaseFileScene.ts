import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { caseFileFrameImageUrl } from "../assets/finalAssets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";

export class CaseFileScene extends Phaser.Scene {
  private isTransitioning = false;
  private root: HTMLDivElement | null = null;
  private readonly handleBodyContinue = (event: MouseEvent): void => {
    if (!this.root || this.isTransitioning) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && this.root.contains(target)) {
      return;
    }

    this.continueToPlaceholder();
  };

  constructor() {
    super("CaseFileScene");
  }

  create(): void {
    this.isTransitioning = false;
    setSceneStatus(
      "case-file",
      `${storyContent.openingCaseFile.caseNumber}. ${storyContent.openingCaseFile.caseTitle}. ${storyContent.ui.continuePrompt}`
    );
    this.cameras.main.setBackgroundColor(THEME_HEX.deepBlueNavy);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.deepBlueNavy);
    document.body.classList.add("final-image-active");
    document.body.addEventListener("click", this.handleBodyContinue);
    this.createImageBackedOverlay();

    this.input.keyboard?.once("keydown-ENTER", this.continueToPlaceholder, this);
    this.input.once("pointerdown", this.continueToPlaceholder, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroyOverlay());
  }

  private createImageBackedOverlay(): void {
    const accessibleCaseFile = [
      storyContent.openingCaseFile.caseNumber,
      storyContent.openingCaseFile.caseTitle,
      "",
      storyContent.openingCaseFile.salutation,
      "",
      ...storyContent.openingCaseFile.body,
      "",
      ...storyContent.openingCaseFile.signature
    ].join("\n");

    this.root = document.createElement("div");
    this.root.className = "final-image-scene final-case-file-scene";
    this.root.dataset.testid = "case-file-scene";
    this.root.innerHTML = `
      <button type="button" class="final-image-button" data-testid="case-file-final-frame" aria-label="Continue from case file">
        <img class="final-image-frame" src="${caseFileFrameImageUrl}" alt="" decoding="async" />
        <span class="sr-only" data-testid="case-file-accessible-text">${escapeHtml(accessibleCaseFile)}</span>
      </button>
    `;
    document.body.appendChild(this.root);
    this.root.querySelector<HTMLButtonElement>('[data-testid="case-file-final-frame"]')?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.continueToPlaceholder();
    });
  }

  private continueToPlaceholder(): void {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.scene.start("VisualNovelScene", { sceneId: "vn-chapter-1-intro" });
  }

  private destroyOverlay(): void {
    document.body.classList.remove("final-image-active");
    document.body.removeEventListener("click", this.handleBodyContinue);
    this.root?.remove();
    this.root = null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
