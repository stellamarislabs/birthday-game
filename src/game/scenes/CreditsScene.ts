import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { renderUiIcon } from "../../ui/icons";
import { setSceneStatus } from "../../ui/sceneStatus";
import { drawNonVnPresentationShell } from "../presentation/presentationShell";

export class CreditsScene extends Phaser.Scene {
  private root: HTMLDivElement | null = null;

  constructor() {
    super("CreditsScene");
  }

  create(): void {
    setSceneStatus("credits", "Credits. Made with love by Alper. For Maria.");
    drawNonVnPresentationShell(this, { stageWidth: 824, stageHeight: 424, stageAlpha: 0.88, innerAlpha: 0.3 });

    this.root = document.createElement("div");
    this.root.className = "menu-overlay credits-overlay";
    this.root.dataset.testid = "credits-overlay";
    document.getElementById("game-shell")?.appendChild(this.root);
    this.render();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.root?.remove();
      this.root = null;
    });

    this.input.keyboard?.once("keydown-ESC", () => this.scene.start("TitleScene"));
  }

  private render(): void {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = `
      <section class="menu-panel credits-panel credits-panel--document" aria-label="Credits">
        <div class="credits-seal" aria-hidden="true"></div>
        <p class="menu-kicker">${storyContent.title}</p>
        <h1>${storyContent.credits.title}</h1>
        <div class="credits-lines">
          ${storyContent.credits.lines.map((line) => `<p class="credit-line">${escapeHtml(line)}</p>`).join("")}
        </div>
        <div class="menu-actions">
          <button type="button" class="primary-button" data-testid="credits-level-select">${renderUiIcon("folder")}${storyContent.ui.levelSelect}</button>
          <button type="button" data-testid="credits-back-title">${renderUiIcon("case-file")}${storyContent.ui.backToTitle}</button>
        </div>
      </section>
    `;

    this.root.querySelector<HTMLButtonElement>('[data-testid="credits-level-select"]')?.addEventListener("click", () => {
      this.scene.start("LevelSelectScene");
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="credits-back-title"]')?.addEventListener("click", () => {
      this.scene.start("TitleScene");
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
