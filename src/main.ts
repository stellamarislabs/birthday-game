import Phaser from "phaser";
import { gameConfig } from "./game/config";
import { getAudioManager, installAudioGestureUnlock, installButtonClickAudio } from "./game/systems/AudioManager";
import { SaveManager } from "./game/systems/SaveManager";
import { initResponsiveShell } from "./ui/responsive";
import { isDevMode } from "./utils/isDevMode";
import "./style.css";

initResponsiveShell();

window.addEventListener("load", () => {
  const saveManager = new SaveManager();
  getAudioManager().setMuted(saveManager.load().muted);
  installAudioGestureUnlock();
  installButtonClickAudio();

  new Phaser.Game(gameConfig);

  if (isDevMode()) {
    const params = new URLSearchParams(window.location.search);
    const completeLevelId = Number(params.get("completeLevel") ?? "");

    if (Number.isFinite(completeLevelId) && completeLevelId >= 1) {
      saveManager.markLevelCompleted(completeLevelId);
    }

    if (params.get("gameCompleted") === "true") {
      saveManager.markGameCompleted();
    }
  }
});
