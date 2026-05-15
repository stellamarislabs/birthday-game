import Phaser from "phaser";
import { setSceneStatus } from "../../ui/sceneStatus";
import { drawNonVnPresentationShell } from "../presentation/presentationShell";
import { SaveManager } from "../systems/SaveManager";
import { getChapterAvailability, getChapterLaunchLevelId } from "../systems/ChapterBridge";
import { findChapterVisualNovelSceneId, findVisualNovelSceneId } from "../systems/VnFlow";
import { LevelSelectMenu } from "../ui/LevelSelectMenu";
import { getChapterById } from "../../content/chapters";
import { requestOpeningMainMenuMusic } from "../audio/openingMainMenuMusic";
import { getAudioManager } from "../systems/AudioManager";

export class LevelSelectScene extends Phaser.Scene {
  private menu: LevelSelectMenu | null = null;
  private readonly statusText = "Case Archive. Completed chapters can be replayed; the next chapter is available when unlocked.";

  constructor() {
    super("LevelSelectScene");
  }

  create(): void {
    const saveManager = new SaveManager();
    const save = saveManager.load();

    this.updateSceneStatus();
    requestOpeningMainMenuMusic(getAudioManager());
    drawNonVnPresentationShell(this, { stageWidth: 862, stageHeight: 456, stageAlpha: 0.86, innerAlpha: 0.28 });

    this.menu = new LevelSelectMenu({
      save,
      onSelectChapter: (chapterId) => {
        const chapter = getChapterById(chapterId);
        if (!chapter) {
          this.scene.start("ComingSoonScene", { levelId: getChapterLaunchLevelId(chapterId) });
          return;
        }

        const availability = getChapterAvailability(chapter, saveManager.load());
        if (availability.playable) {
          const levelId = availability.legacyLevelId;
          saveManager.setCurrentLevelId(levelId);
          const chapterVisualNovelSceneId = findChapterVisualNovelSceneId(chapterId, "before-platformer");
          if (chapterVisualNovelSceneId) {
            this.scene.start("VisualNovelScene", { sceneId: chapterVisualNovelSceneId });
            return;
          }

          const visualNovelSceneId = levelId >= 2 ? findVisualNovelSceneId(levelId, "before-platformer") : null;
          if (visualNovelSceneId) {
            this.scene.start("VisualNovelScene", { sceneId: visualNovelSceneId });
            return;
          }

          this.scene.start("PlatformerScene", { levelId });
          return;
        }

        this.scene.start("ComingSoonScene", { levelId: availability.legacyLevelId });
      },
      onBackToTitle: () => this.scene.start("TitleScene")
    });
    this.time.delayedCall(0, () => this.updateSceneStatus());
    window.requestAnimationFrame(() => this.updateSceneStatus());
    window.setTimeout(() => this.updateSceneStatus(), 100);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.menu?.destroy();
      this.menu = null;
    });

    this.input.keyboard?.once("keydown-ESC", () => this.scene.start("TitleScene"));
  }

  private updateSceneStatus(): void {
    setSceneStatus("level-select", this.statusText);
  }
}
