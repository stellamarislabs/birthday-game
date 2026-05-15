import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { renderUiIcon } from "../../ui/icons";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { requestOpeningMainMenuMusic } from "../audio/openingMainMenuMusic";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { getAudioManager } from "../systems/AudioManager";

export class OpeningStartScene extends Phaser.Scene {
  private root: HTMLDivElement | null = null;
  private isStarting = false;

  constructor() {
    super("OpeningStartScene");
  }

  create(): void {
    this.isStarting = false;
    setSceneStatus("opening-start", `${storyContent.ui.openingStartTitle}. Opening start screen.`);
    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    this.drawBackdrop();
    this.createOverlay();

    this.input.keyboard?.once("keydown-ENTER", () => this.startCinematic());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroyOverlay());
  }

  private drawBackdrop(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 96, GAME_WIDTH, 192, PHASER_THEME.deepBlueNavy, 0.5);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 48, GAME_WIDTH, 96, PHASER_THEME.warmInkBrown, 0.38);
    this.add.circle(148, 104, 72, PHASER_THEME.antiqueGold, 0.06);
    this.add.circle(820, 140, 56, PHASER_THEME.roseAccent, 0.05);

    for (let index = 0; index < 14; index += 1) {
      const x = 54 + index * 68;
      const y = 250 + (index % 4) * 30;
      this.add.rectangle(x, y, 42, 92 + (index % 3) * 18, PHASER_THEME.panelNavy, 0.52);
      this.add.rectangle(x, y - 40, 24, 4, PHASER_THEME.brassHighlight, 0.16);
      this.add.circle(x + 22, y - 18, 2, PHASER_THEME.mainCream, 0.28);
    }

    this.add.rectangle(GAME_WIDTH / 2, 388, 470, 86, PHASER_THEME.leatherBrown, 0.5).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.22);
    this.add.rectangle(GAME_WIDTH / 2, 374, 310, 52, PHASER_THEME.burgundy, 0.32).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.34);
  }

  private createOverlay(): void {
    this.root = document.createElement("div");
    this.root.className = "opening-start-overlay";
    this.root.dataset.testid = "opening-start";
    this.root.innerHTML = `
      <section class="opening-start-artboard" aria-label="Opening">
        <button type="button" class="opening-start-button-overlay" data-testid="opening-start-button" aria-label="Start the case">
          ${renderUiIcon("play", "opening-start-button-icon")}
          <span>Start</span>
        </button>
      </section>
    `;
    document.getElementById("game-shell")?.appendChild(this.root);
    this.root.querySelector<HTMLButtonElement>('[data-testid="opening-start-button"]')?.addEventListener("click", () => this.startCinematic());
  }

  private startCinematic(): void {
    if (this.isStarting) {
      return;
    }

    this.isStarting = true;
    const audioManager = getAudioManager();
    audioManager.unlock();
    requestOpeningMainMenuMusic(audioManager);
    this.scene.start("OpeningCinematicScene");
  }

  private destroyOverlay(): void {
    this.root?.remove();
    this.root = null;
  }
}
