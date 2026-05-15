import Phaser from "phaser";
import { puzzles } from "../../content/puzzles";
import { storyContent } from "../../content/story";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { resolvePuzzleRegistration } from "../puzzles/PuzzleRegistry";
import { getAudioManager } from "../systems/AudioManager";
import { getArchiveDetailFinderSpec } from "../puzzles/archiveDetailFinder/archiveDetailFinderContent";
import { ArchiveDetailFinderPuzzle } from "../puzzles/archiveDetailFinder/ArchiveDetailFinderPuzzle";
import { getArgumentTowerSpec } from "../puzzles/argumentTower/argumentTowerContent";
import { ArgumentTowerPuzzle } from "../puzzles/argumentTower/ArgumentTowerPuzzle";
import { getCaseConstellationSpec } from "../puzzles/caseConstellation/caseConstellationContent";
import { CaseConstellationPuzzle } from "../puzzles/caseConstellation/CaseConstellationPuzzle";
import { getCaseMosaicSpec } from "../puzzles/caseMosaic/caseMosaicContent";
import { CaseMosaicPuzzle } from "../puzzles/caseMosaic/CaseMosaicPuzzle";
import { getCaseTimelineSpec } from "../puzzles/caseTimeline/caseTimelineContent";
import { CaseTimelinePuzzle } from "../puzzles/caseTimeline/CaseTimelinePuzzle";
import { getCaseFileSortingSpec } from "../puzzles/caseFileSorting/caseFileSortingContent";
import { CaseFileSortingPuzzle } from "../puzzles/caseFileSorting/CaseFileSortingPuzzle";
import { getDepositionOrderSpec } from "../puzzles/depositionOrder/depositionOrderContent";
import { DepositionOrderPuzzle } from "../puzzles/depositionOrder/DepositionOrderPuzzle";
import { getEchoPathSpec } from "../puzzles/echoPath/echoPathContent";
import { EchoPathPuzzle } from "../puzzles/echoPath/EchoPathPuzzle";
import { getFinalVerdictAssemblySpec } from "../puzzles/finalVerdictAssembly/finalVerdictAssemblyContent";
import { FinalVerdictAssemblyPuzzle } from "../puzzles/finalVerdictAssembly/FinalVerdictAssemblyPuzzle";
import { getLanternSequenceSpec } from "../puzzles/lanternSequence/lanternSequenceContent";
import { LanternSequencePuzzle } from "../puzzles/lanternSequence/LanternSequencePuzzle";
import { getRebuildPuzzleSpec } from "../puzzles/rebuildPuzzle/rebuildPuzzleContent";
import { RebuildPuzzle } from "../puzzles/rebuildPuzzle/RebuildPuzzle";
import { getRouteTilePuzzleSpec } from "../puzzles/routeTilePuzzle/routeTilePuzzleContent";
import { RouteTilePuzzle } from "../puzzles/routeTilePuzzle/RouteTilePuzzle";
import { getTrustLightPathSpec } from "../puzzles/trustLightPath/trustLightPathContent";
import { TrustLightPathPuzzle } from "../puzzles/trustLightPath/TrustLightPathPuzzle";
import { getWitnessLensSpec } from "../puzzles/witnessLens/witnessLensContent";
import { WitnessLensPuzzle } from "../puzzles/witnessLens/WitnessLensPuzzle";
import { requestChapterMusicForPuzzle } from "../platformer/platformerMusic";
import { findVisualNovelSceneId } from "../systems/VnFlow";

interface PuzzleSceneData {
  levelId?: number;
  chapterId?: number;
}

export class PuzzleScene extends Phaser.Scene {
  private activePuzzle:
    | CaseMosaicPuzzle
    | CaseTimelinePuzzle
    | RouteTilePuzzle
    | RebuildPuzzle
    | WitnessLensPuzzle
    | DepositionOrderPuzzle
    | ArchiveDetailFinderPuzzle
    | CaseFileSortingPuzzle
    | TrustLightPathPuzzle
    | EchoPathPuzzle
    | LanternSequencePuzzle
    | ArgumentTowerPuzzle
    | CaseConstellationPuzzle
    | FinalVerdictAssemblyPuzzle
    | null = null;
  private isSolved = false;

  constructor() {
    super("PuzzleScene");
  }

  create(data: PuzzleSceneData): void {
    const levelId = data.levelId ?? 1;
    const chapterId = data.chapterId;
    const puzzleSpec = puzzles.find((puzzle) => puzzle.levelId === levelId);
    const registration = resolvePuzzleRegistration(puzzleSpec?.type ?? "unsupported");

    requestChapterMusicForPuzzle(chapterId, levelId, getAudioManager());

    this.isSolved = false;
    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 850, 450, PHASER_THEME.panelNavy).setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.55);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.activePuzzle?.destroy();
      this.activePuzzle = null;
    });

    if (registration.type === "case-mosaic") {
      const caseMosaicSpec = getCaseMosaicSpec(levelId);
      if (caseMosaicSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Rebuild the first clue.`);
        this.activePuzzle = new CaseMosaicPuzzle({
          spec: caseMosaicSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Case Mosaic unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Case Mosaic is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "case-timeline") {
      const caseTimelineSpec = getCaseTimelineSpec(levelId);
      if (caseTimelineSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Put calm order on a moving day.`);
        this.activePuzzle = new CaseTimelinePuzzle({
          spec: caseTimelineSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Case Timeline unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Case Timeline is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "route-tile-puzzle") {
      const routeTilePuzzleSpec = getRouteTilePuzzleSpec(levelId);
      if (routeTilePuzzleSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Connect the stamped route.`);
        this.activePuzzle = new RouteTilePuzzle({
          spec: routeTilePuzzleSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Route Tile Puzzle unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Route Tile Puzzle is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "rebuild-puzzle") {
      const rebuildPuzzleSpec = getRebuildPuzzleSpec(levelId);
      if (rebuildPuzzleSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Turn the hidden key.`);
        this.activePuzzle = new RebuildPuzzle({
          spec: rebuildPuzzleSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Rebuild Puzzle unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Rebuild Puzzle is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "witness-lens") {
      const witnessLensSpec = getWitnessLensSpec(levelId);
      if (witnessLensSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Inspect the witness note.`);
        this.activePuzzle = new WitnessLensPuzzle({
          spec: witnessLensSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Witness Lens unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Witness Lens is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "deposition-order") {
      const depositionOrderSpec = getDepositionOrderSpec(levelId);
      if (depositionOrderSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Rebuild the witness statement.`);
        this.activePuzzle = new DepositionOrderPuzzle({
          spec: depositionOrderSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Deposition Order unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Deposition Order is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "archive-detail-finder") {
      const archiveDetailFinderSpec = getArchiveDetailFinderSpec(levelId);
      if (archiveDetailFinderSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Reveal the marginal correction.`);
        this.activePuzzle = new ArchiveDetailFinderPuzzle({
          spec: archiveDetailFinderSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Archive Detail Finder unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Archive Detail Finder is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "case-file-sorting") {
      const caseFileSortingSpec = getCaseFileSortingSpec(levelId);
      if (caseFileSortingSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Sort the archive file.`);
        this.activePuzzle = new CaseFileSortingPuzzle({
          spec: caseFileSortingSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Case File Sorting unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Case File Sorting is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "echo-path") {
      const echoPathSpec = getEchoPathSpec(levelId);
      if (echoPathSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Open the Trust door.`);
        this.activePuzzle = new EchoPathPuzzle({
          spec: echoPathSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Echo Path unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Echo Path is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "trust-light-path") {
      const trustLightPathSpec = getTrustLightPathSpec(levelId);
      if (trustLightPathSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Guide the light to Trust.`);
        this.activePuzzle = new TrustLightPathPuzzle({
          spec: trustLightPathSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Trust Door Light Path unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Trust Door Light Path is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "lantern-sequence") {
      const lanternSequenceSpec = getLanternSequenceSpec(levelId);
      if (lanternSequenceSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Light the garden path.`);
        this.activePuzzle = new LanternSequencePuzzle({
          spec: lanternSequenceSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Lantern Sequence unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Lantern Sequence is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "argument-tower") {
      const argumentTowerSpec = getArgumentTowerSpec(levelId);
      if (argumentTowerSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Build the argument tower.`);
        this.activePuzzle = new ArgumentTowerPuzzle({
          spec: argumentTowerSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Argument Tower unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Argument Tower is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "case-constellation") {
      const caseConstellationSpec = getCaseConstellationSpec(levelId);
      if (caseConstellationSpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Complete the case constellation.`);
        this.activePuzzle = new CaseConstellationPuzzle({
          spec: caseConstellationSpec,
          onSolved: () => this.completePuzzle(levelId, chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Case Constellation unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Case Constellation is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (registration.type === "final-verdict-assembly") {
      const finalVerdictAssemblySpec = getFinalVerdictAssemblySpec(levelId);
      if (finalVerdictAssemblySpec) {
        setSceneStatus(`puzzle-level-${levelId}`, `${registration.title}. Complete the final seal.`);
        this.activePuzzle = new FinalVerdictAssemblyPuzzle({
          spec: finalVerdictAssemblySpec,
          onSolved: () => this.completeFinalPuzzle(chapterId)
        });
        return;
      }

      setSceneStatus(`puzzle-level-${levelId}`, "Final Seal unavailable for this level.");
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Final Seal is sealed from this route.", {
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          color: THEME_HEX.mainCream,
          align: "center",
          wordWrap: { width: 720, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
      return;
    }

    if (import.meta.env.DEV) {
      console.warn(`Unsupported puzzle type requested: ${registration.requestedType}`);
    }

    setSceneStatus(`puzzle-placeholder-level-${levelId}`, `Unsupported puzzle route: ${registration.requestedType}`);
    const placeholderText = getPlaceholderText(levelId);

    setSceneStatus(`puzzle-level-${levelId}`, placeholderText);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "This clue review is sealed from this route.", {
        fontFamily: "Georgia, serif",
        fontSize: "24px",
        color: THEME_HEX.mainCream,
        align: "center",
        wordWrap: { width: 720, useAdvancedWrap: true }
      })
      .setOrigin(0.5);

    const text = this.children.getAt(this.children.length - 1) as Phaser.GameObjects.Text;
    text.setText(placeholderText);

    const continuePlaceholder = () => {
      const comingSoonText = getComingSoonText(levelId);
      setSceneStatus(`puzzle-placeholder-complete-level-${levelId}`, comingSoonText);
      text.setText(`${comingSoonText}\n\nPress Enter or Tap to Return to the Case Archive`);
      this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("LevelSelectScene"));
      this.input.once("pointerdown", () => this.scene.start("LevelSelectScene"));
    };

    this.input.keyboard?.once("keydown-ENTER", continuePlaceholder);
    this.input.once("pointerdown", continuePlaceholder);
  }

  private completePuzzle(levelId: number, chapterId?: number): void {
    if (this.isSolved) {
      return;
    }

    this.isSolved = true;
    getAudioManager().playPuzzleSuccess();
    this.time.delayedCall(700, () => {
      if (typeof chapterId === "number") {
        this.scene.start("EvidenceRevealScene", { levelId, chapterId });
        return;
      }

      const visualNovelSceneId = findVisualNovelSceneId(levelId, "after-puzzle");
      if (visualNovelSceneId) {
        this.scene.start("VisualNovelScene", { sceneId: visualNovelSceneId });
        return;
      }

      this.scene.start("EvidenceRevealScene", { levelId });
    });
  }

  private completeFinalPuzzle(chapterId?: number): void {
    if (this.isSolved) {
      return;
    }

    this.isSolved = true;
    getAudioManager().playPuzzleSuccess();
    this.time.delayedCall(700, () => {
      if (typeof chapterId === "number") {
        this.scene.start("FinalVerdictScene");
        return;
      }

      const visualNovelSceneId = findVisualNovelSceneId(10, "after-puzzle");
      if (visualNovelSceneId) {
        this.scene.start("VisualNovelScene", { sceneId: visualNovelSceneId });
        return;
      }

      this.scene.start("FinalVerdictScene");
    });
  }
}

function getPlaceholderText(levelId: number): string {
  if (levelId === 2) {
    return [
      storyContent.ui.levelTwoPuzzleTitle,
      "",
      storyContent.ui.levelTwoPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 3) {
    return [
      storyContent.ui.levelThreePuzzleTitle,
      "",
      storyContent.ui.levelThreePuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 4) {
    return [
      storyContent.ui.levelFourPuzzleTitle,
      "",
      storyContent.ui.levelFourPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 5) {
    return [
      storyContent.ui.levelFivePuzzleTitle,
      "",
      storyContent.ui.levelFivePuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 6) {
    return [
      storyContent.ui.levelSixPuzzleTitle,
      "",
      storyContent.ui.levelSixPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 7) {
    return [
      storyContent.ui.levelSevenPuzzleTitle,
      "",
      storyContent.ui.levelSevenPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 8) {
    return [
      storyContent.ui.levelEightPuzzleTitle,
      "",
      storyContent.ui.levelEightPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 9) {
    return [
      storyContent.ui.levelNinePuzzleTitle,
      "",
      storyContent.ui.levelNinePuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  if (levelId === 10) {
    return [
      storyContent.ui.levelTenPuzzleTitle,
      "",
      storyContent.ui.levelTenPuzzlePlaceholder,
      "",
      storyContent.ui.continuePrompt
    ].join("\n");
  }

  return "This clue review is sealed from this route.";
}

function getComingSoonText(levelId: number): string {
  if (levelId === 10) {
    return storyContent.ui.levelTenPuzzleComingSoon;
  }

  if (levelId === 9) {
    return storyContent.ui.levelNinePuzzleComingSoon;
  }

  if (levelId === 8) {
    return storyContent.ui.levelEightPuzzleComingSoon;
  }

  if (levelId === 7) {
    return storyContent.ui.levelSevenPuzzleComingSoon;
  }

  if (levelId === 6) {
    return storyContent.ui.levelSixPuzzleComingSoon;
  }

  if (levelId === 5) {
    return storyContent.ui.levelFivePuzzleComingSoon;
  }

  if (levelId === 4) {
    return storyContent.ui.levelFourPuzzleComingSoon;
  }

  if (levelId === 3) {
    return storyContent.ui.levelThreePuzzleComingSoon;
  }

  return storyContent.ui.levelTwoPuzzleComingSoon;
}
