import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";

interface NonVnPresentationShellOptions {
  stageWidth?: number;
  stageHeight?: number;
  stageAlpha?: number;
  innerAlpha?: number;
  accent?: number;
  showStage?: boolean;
  showSeal?: boolean;
}

export function drawNonVnPresentationShell(
  scene: Phaser.Scene,
  {
    stageWidth = 844,
    stageHeight = 432,
    stageAlpha = 0.88,
    innerAlpha = 0.24,
    accent = PHASER_THEME.burgundy,
    showStage = true,
    showSeal = true
  }: NonVnPresentationShellOptions = {}
): void {
  scene.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
  scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
  scene.add.rectangle(76, GAME_HEIGHT / 2, 120, GAME_HEIGHT, PHASER_THEME.burgundy, 0.18);
  scene.add.rectangle(GAME_WIDTH - 76, GAME_HEIGHT / 2, 120, GAME_HEIGHT, PHASER_THEME.burgundy, 0.15);
  scene.add.rectangle(128, GAME_HEIGHT / 2, 2, GAME_HEIGHT - 80, PHASER_THEME.antiqueGold, 0.16);
  scene.add.rectangle(GAME_WIDTH - 128, GAME_HEIGHT / 2, 2, GAME_HEIGHT - 80, PHASER_THEME.antiqueGold, 0.14);
  scene.add.circle(142, 108, 166, PHASER_THEME.antiqueGold, 0.05);
  scene.add.circle(814, 420, 188, accent, 0.075);
  scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 64, GAME_WIDTH, 128, PHASER_THEME.deepBlueNavy, 0.24);
  scene.add.rectangle(GAME_WIDTH / 2, 66, GAME_WIDTH, 132, PHASER_THEME.panelNavy, 0.16);
  scene.add.rectangle(GAME_WIDTH / 2, 116, 612, 1, PHASER_THEME.antiqueGold, 0.18);
  scene.add.rectangle(GAME_WIDTH / 2, 432, 612, 1, PHASER_THEME.antiqueGold, 0.16);

  for (let index = 0; index < 9; index += 1) {
    const x = 90 + index * 98;
    const alpha = index % 2 === 0 ? 0.15 : 0.08;
    scene.add.rectangle(x, 466 + (index % 3) * 8, 36, 2, PHASER_THEME.antiqueGold, alpha);
    scene.add.circle(x + 22, 122 + (index % 4) * 34, 2.3, PHASER_THEME.mainCream, alpha + 0.05);
  }

  if (showStage) {
    scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, stageWidth, stageHeight, PHASER_THEME.panelNavy, stageAlpha)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.58);
    scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, stageWidth - 34, stageHeight - 34, PHASER_THEME.deepBlueNavy, innerAlpha)
      .setStrokeStyle(1, PHASER_THEME.mainCream, 0.08);
  }

  if (showSeal) {
    scene.add.circle(GAME_WIDTH / 2, 96, 38, PHASER_THEME.antiqueGold, 0.08)
      .setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.3);
    scene.add.circle(GAME_WIDTH / 2, 96, 23, accent, 0.08)
      .setStrokeStyle(1, PHASER_THEME.brassHighlight, 0.18);
    scene.add.rectangle(GAME_WIDTH / 2, 96, 72, 5, PHASER_THEME.antiqueGold, 0.2);
  }
}
