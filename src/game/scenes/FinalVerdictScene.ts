import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { renderUiIcon } from "../../ui/icons";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME } from "../../ui/theme";
import { getFinalVerdictFinalAsset } from "../assets/finalVerdictAssets";
import { resolvePublicAssetPath } from "../assets/publicAssetPaths";
import { requestOpeningMainMenuMusic, stopOpeningMainMenuMusic } from "../audio/openingMainMenuMusic";
import { GAME_WIDTH } from "../config";
import { drawNonVnPresentationShell } from "../presentation/presentationShell";
import { getAudioManager } from "../systems/AudioManager";
import { SaveManager } from "../systems/SaveManager";
import { createFinalVerdictDocumentMarkup, escapeAttribute } from "./finalVerdictSceneMarkup";

export class FinalVerdictScene extends Phaser.Scene {
  private root: HTMLDivElement | null = null;
  private accepted = false;

  constructor() {
    super("FinalVerdictScene");
  }

  create(): void {
    this.accepted = false;
    setSceneStatus("final-verdict", storyContent.finalVerdict);
    requestOpeningMainMenuMusic(getAudioManager());
    this.drawVerdictBackdrop();

    this.root = document.createElement("div");
    this.root.className = "menu-overlay final-verdict-overlay";
    this.root.dataset.testid = "final-verdict-overlay";
    document.getElementById("game-shell")?.appendChild(this.root);

    this.renderVerdict();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.root?.remove();
      this.root = null;
    });

    this.input.keyboard?.once("keydown-ENTER", () => this.acceptVerdict());
  }

  private renderVerdict(): void {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = createFinalVerdictDocumentMarkup(getFinalVerdictFinalAsset());

    this.root.querySelector<HTMLButtonElement>('[data-testid="accept-verdict"]')?.addEventListener("click", () => {
      this.acceptVerdict();
    });
  }

  private acceptVerdict(): void {
    if (this.accepted) {
      return;
    }

    this.accepted = true;
    getAudioManager().playVerdict();
    new SaveManager().markGameCompleted();
    setSceneStatus("final-verdict-complete", storyContent.ui.caseClosed);
    this.renderComplete();
  }

  private renderComplete(): void {
    if (!this.root) {
      return;
    }

    const evidenceOfLoveUrl = resolvePublicAssetPath("video.html");

    this.root.innerHTML = `
      <section class="menu-panel final-verdict-panel final-verdict-panel--complete final-verdict-panel--bonus" aria-label="Evidence of Love unlocked" data-testid="evidence-love-unlocked">
        <div class="case-closed-seal" aria-hidden="true"></div>
        <p class="menu-kicker">Verdict accepted</p>
        <p class="case-closed-confirmation" data-testid="case-closed-message">${storyContent.ui.caseClosed}</p>
        <h1 data-testid="evidence-love-title">${storyContent.ui.evidenceLoveUnlocked}</h1>
        <div class="evidence-love-copy">
          <p>${storyContent.ui.evidenceLoveBody}</p>
          <p>${storyContent.ui.evidenceLovePrompt}</p>
          <p class="evidence-love-note">${storyContent.ui.evidenceLoveNote}</p>
        </div>
        <div class="menu-actions final-bonus-actions">
          <button type="button" class="primary-button" data-testid="open-evidence-love" data-video-target="${escapeAttribute(evidenceOfLoveUrl)}">${renderUiIcon("heart")}${storyContent.ui.openEvidenceLove}</button>
          <button type="button" class="secondary-button" data-testid="final-back-title">${renderUiIcon("case-file")}${storyContent.ui.backToTitle}</button>
        </div>
      </section>
    `;

    this.root.querySelector<HTMLButtonElement>('[data-testid="open-evidence-love"]')?.addEventListener("click", () => {
      stopOpeningMainMenuMusic(getAudioManager());
      window.location.href = evidenceOfLoveUrl;
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="final-back-title"]')?.addEventListener("click", () => {
      this.scene.start("TitleScene");
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="open-evidence-love"]')?.focus();
  }

  private drawVerdictBackdrop(): void {
    drawNonVnPresentationShell(this, { stageWidth: 872, stageHeight: 466, stageAlpha: 0.84, innerAlpha: 0.34 });

    const sealY = 93;
    this.add.circle(GAME_WIDTH / 2, sealY, 58, PHASER_THEME.antiqueGold, 0.08)
      .setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.34);
    this.add.circle(GAME_WIDTH / 2, sealY, 35, PHASER_THEME.burgundy, 0.12)
      .setStrokeStyle(1, PHASER_THEME.mainCream, 0.16);
    this.add.circle(GAME_WIDTH / 2 - 19, sealY - 2, 12, PHASER_THEME.roseAccent, 0.16);
    this.add.circle(GAME_WIDTH / 2 + 19, sealY - 2, 12, PHASER_THEME.roseAccent, 0.16);
    this.add.triangle(GAME_WIDTH / 2, sealY + 20, -26, -4, 26, -4, 0, 28, PHASER_THEME.roseAccent, 0.12);
    this.add.rectangle(GAME_WIDTH / 2, sealY, 80, 4, PHASER_THEME.antiqueGold, 0.22);

    for (let index = 0; index < 9; index += 1) {
      const x = 88 + index * 98;
      this.add.circle(x, 474, 2.5, PHASER_THEME.brassHighlight, index % 2 === 0 ? 0.22 : 0.11);
      this.add.rectangle(x + 24, 474, 34, 1, PHASER_THEME.antiqueGold, 0.08);
    }
  }
}
