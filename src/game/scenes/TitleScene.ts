import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { requestOpeningMainMenuMusic } from "../audio/openingMainMenuMusic";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { getAudioManager } from "../systems/AudioManager";
import { SaveManager } from "../systems/SaveManager";
import { TitleMenu } from "../ui/TitleMenu";

export class TitleScene extends Phaser.Scene {
  private isTransitioning = false;
  private titleMenu: TitleMenu | null = null;
  private saveManager!: SaveManager;

  constructor() {
    super("TitleScene");
  }

  create(): void {
    this.isTransitioning = false;
    this.saveManager = new SaveManager();
    const save = this.saveManager.load();
    const hasCompletedLevelOne = this.saveManager.isLevelCompleted(1);
    setSceneStatus("title", `${storyContent.title}. ${hasCompletedLevelOne ? "Continue Case" : "Start New Case"}`);
    requestOpeningMainMenuMusic(getAudioManager());
    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 78, GAME_WIDTH, 156, PHASER_THEME.deepBlueNavy, 0.35);
    for (let index = 0; index < 16; index += 1) {
      const x = 54 + index * 58;
      const y = 444 + (index % 4) * 18;
      this.add.rectangle(x, y, 18 + (index % 3) * 9, 5, PHASER_THEME.brassHighlight, 0.12);
      this.add.circle(x + 38, y - 36, 2.2, PHASER_THEME.mainCream, 0.3);
    }
    this.add.rectangle(GAME_WIDTH / 2, 430, GAME_WIDTH, 110, PHASER_THEME.panelNavy, 0.22);
    for (let index = 0; index < 9; index += 1) {
      const x = 86 + index * 104;
      const y = 92 + (index % 3) * 42;
      this.add.rectangle(x, y, 70, 12, PHASER_THEME.mainCream, 0.08);
      this.add.rectangle(x + 18, y + 22, 42, 7, PHASER_THEME.antiqueGold, 0.1);
    }
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 820, 390, PHASER_THEME.panelNavy, 0.94).setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.72);
    this.add.circle(GAME_WIDTH / 2, 126, 42, PHASER_THEME.antiqueGold, 0.08).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.34);
    this.add.circle(GAME_WIDTH / 2, 126, 27, PHASER_THEME.burgundy, 0.09).setStrokeStyle(1, PHASER_THEME.mainCream, 0.22);
    this.add.rectangle(GAME_WIDTH / 2, 126, 58, 6, PHASER_THEME.antiqueGold, 0.26);
    this.add.circle(GAME_WIDTH / 2 - 20, 126, 10, PHASER_THEME.antiqueGold, 0.16).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.32);
    this.add.circle(GAME_WIDTH / 2 + 20, 126, 10, PHASER_THEME.antiqueGold, 0.16).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.32);
    this.add.rectangle(GAME_WIDTH / 2, 168, 520, 2, PHASER_THEME.roseAccent, 0.7);
    this.add.rectangle(GAME_WIDTH / 2, 372, 520, 2, PHASER_THEME.antiqueGold, 0.58);
    this.add.circle(398, 374, 16, PHASER_THEME.burgundy, 0.18).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.42);
    this.add.circle(562, 374, 16, PHASER_THEME.burgundy, 0.18).setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.42);
    this.add.rectangle(GAME_WIDTH / 2, 374, 138, 4, PHASER_THEME.antiqueGold, 0.28);

    this.add
      .text(GAME_WIDTH / 2, 208, storyContent.title, {
        fontFamily: "Georgia, serif",
        fontSize: "42px",
        color: THEME_HEX.mainCream,
        align: "center",
        wordWrap: { width: 760, useAdvancedWrap: true }
      })
      .setOrigin(0.5);

    this.titleMenu = new TitleMenu({
      save,
      onPrimary: () => this.handlePrimaryAction(),
      onLevelSelect: () => this.startScene("LevelSelectScene"),
      onSettingsChanged: (settings) => {
        let updatedSave = this.saveManager.setMuted(settings.muted);
        updatedSave = this.saveManager.setReduceMotion(settings.reduceMotion);
        getAudioManager().setMuted(updatedSave.muted);
        setSceneStatus("settings", `Settings. Mute ${updatedSave.muted ? "on" : "off"}. Reduce motion ${updatedSave.reduceMotion ? "on" : "off"}.`);
        return updatedSave;
      },
      onResetConfirmed: () => {
        this.saveManager.reset();
        setSceneStatus("title", `${storyContent.title}. Progress reset.`);
        this.scene.restart();
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.titleMenu?.destroy();
      this.titleMenu = null;
    });

    this.input.keyboard?.once("keydown-ENTER", () => this.handlePrimaryAction());
  }

  private handlePrimaryAction(): void {
    if (this.saveManager.isLevelCompleted(1)) {
      this.startScene("LevelSelectScene");
      return;
    }

    this.startScene("CaseFileScene");
  }

  private startScene(sceneKey: string): void {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.scene.start(sceneKey);
  }
}
