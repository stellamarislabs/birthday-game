import Phaser from "phaser";
import { parseDebugQueryParams, resolveDevSpawn } from "../debug/debugQueryParams";
import { getPlatformerGeometry } from "../platformer/levelGeometry";
import { isDevMode } from "../../utils/isDevMode";
import { getActiveChapterFlow } from "../systems/ChapterBridge";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create(): void {
    if (isDevMode()) {
      const params = new URLSearchParams(window.location.search);
      const debugQuery = parseDebugQueryParams(params, { enabled: true, maxLevel: 10 });
      const scene = debugQuery.scene;
      const chapterFlow = debugQuery.chapterId !== null ? getActiveChapterFlow(debugQuery.chapterId) : undefined;
      const levelId = scene === "puzzle" && chapterFlow ? chapterFlow.puzzleLevelId : chapterFlow?.platformerLevelId ?? debugQuery.levelId;

      if (scene === "puzzle") {
        this.scene.start("PuzzleScene", { levelId, chapterId: chapterFlow?.chapterId });
        return;
      }

      if (scene === "level-select") {
        this.scene.start("LevelSelectScene");
        return;
      }

      if (scene === "final-verdict") {
        this.scene.start("FinalVerdictScene");
        return;
      }

      if (scene === "vn") {
        this.scene.start("VisualNovelScene", { sceneId: debugQuery.vnSceneId ?? "vn-level-1-intro" });
        return;
      }

      if (scene === "platformer") {
        const geometry = getPlatformerGeometry(levelId);
        this.scene.start("PlatformerScene", {
          levelId,
          chapterId: chapterFlow?.chapterId,
          devRoute: true,
          devSpawn: resolveDevSpawn(debugQuery, geometry)
        });
        return;
      }
    }

    this.scene.start("OpeningStartScene");
  }
}
