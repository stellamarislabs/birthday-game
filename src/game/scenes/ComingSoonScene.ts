import Phaser from "phaser";
import { getLevelById } from "../../content/levels";
import { setSceneStatus } from "../../ui/sceneStatus";
import { THEME_HEX } from "../../ui/theme";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { drawNonVnPresentationShell } from "../presentation/presentationShell";

interface ComingSoonSceneData {
  levelId?: number;
}

export class ComingSoonScene extends Phaser.Scene {
  constructor() {
    super("ComingSoonScene");
  }

  create(data: ComingSoonSceneData): void {
    const levelId = data.levelId ?? 2;
    const level = getLevelById(levelId);

    setSceneStatus("coming-soon", `Level ${levelId} coming soon.`);
    drawNonVnPresentationShell(this, { stageWidth: 780, stageHeight: 350, stageAlpha: 0.9, innerAlpha: 0.32 });

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        [
          `Level ${levelId}: ${level?.title ?? "Coming Soon"}`,
          "",
          "This chapter is sealed from the current route.",
          "",
          "Press Enter or Tap to Return to the Case Archive"
        ].join("\n"),
        {
          fontFamily: "Georgia, serif",
          fontSize: "25px",
          color: THEME_HEX.mainCream,
          align: "center",
          lineSpacing: 9,
          wordWrap: { width: 640, useAdvancedWrap: true }
        }
      )
      .setOrigin(0.5);

    const goBack = () => this.scene.start("LevelSelectScene");
    this.input.keyboard?.once("keydown-ENTER", goBack);
    this.input.once("pointerdown", goBack);
  }
}
