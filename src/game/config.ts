import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CaseFileScene } from "./scenes/CaseFileScene";
import { ComingSoonScene } from "./scenes/ComingSoonScene";
import { CreditsScene } from "./scenes/CreditsScene";
import { EvidenceRevealScene } from "./scenes/EvidenceRevealScene";
import { FinalVerdictScene } from "./scenes/FinalVerdictScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { OpeningCinematicScene } from "./scenes/OpeningCinematicScene";
import { OpeningStartScene } from "./scenes/OpeningStartScene";
import { PlatformerScene } from "./scenes/PlatformerScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { PuzzleScene } from "./scenes/PuzzleScene";
import { TitleScene } from "./scenes/TitleScene";
import { VisualNovelScene } from "./scenes/VisualNovelScene";
import { THEME_HEX } from "../ui/theme";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: THEME_HEX.midnightNavy,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    OpeningStartScene,
    OpeningCinematicScene,
    TitleScene,
    CaseFileScene,
    VisualNovelScene,
    PlatformerScene,
    PuzzleScene,
    FinalVerdictScene,
    EvidenceRevealScene,
    LevelSelectScene,
    ComingSoonScene,
    CreditsScene
  ]
};
