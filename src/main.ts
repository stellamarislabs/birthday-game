import Phaser from "phaser";
import { gameConfig } from "./game/config";
import { getAudioManager, installAudioGestureUnlock, installButtonClickAudio } from "./game/systems/AudioManager";
import { SaveManager } from "./game/systems/SaveManager";
import { APP_VIEWPORT_RESIZE_EVENT, initResponsiveShell } from "./ui/responsive";
import { isDevMode } from "./utils/isDevMode";
import "./style.css";

initResponsiveShell();

window.addEventListener("load", () => {
  const saveManager = new SaveManager();
  getAudioManager().setMuted(saveManager.load().muted);
  installAudioGestureUnlock();
  installButtonClickAudio();

  const game = new Phaser.Game(gameConfig);
  let pendingScaleRefresh: number | undefined;
  const refreshGameScale = () => {
    if (pendingScaleRefresh !== undefined) {
      window.cancelAnimationFrame(pendingScaleRefresh);
    }

    pendingScaleRefresh = window.requestAnimationFrame(() => {
      pendingScaleRefresh = undefined;
      game.scale.refresh();
    });
  };

  window.addEventListener(APP_VIEWPORT_RESIZE_EVENT, refreshGameScale, { passive: true });
  window.addEventListener("orientationchange", refreshGameScale, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshGameScale, { passive: true });
  refreshGameScale();

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
