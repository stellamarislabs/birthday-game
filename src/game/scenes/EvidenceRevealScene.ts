import Phaser from "phaser";
import { getChapterById } from "../../content/chapters";
import { getChapterClueChainEntry } from "../../content/chapterClueChain";
import { type ClueVisualMotif, getClueChainEntry } from "../../content/clueChain";
import { getLevelById } from "../../content/levels";
import { storyContent } from "../../content/story";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { getChapterRevealFinalAsset } from "../assets/finalRevealAssets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { requestChapterMusicForChapter } from "../platformer/platformerMusic";
import { drawNonVnPresentationShell } from "../presentation/presentationShell";
import { getAudioManager } from "../systems/AudioManager";
import { SaveManager } from "../systems/SaveManager";
import { getChapterCompletionLevelId } from "../systems/ChapterBridge";

interface EvidenceRevealSceneData {
  levelId?: number;
  chapterId?: number;
}

export class EvidenceRevealScene extends Phaser.Scene {
  private isComplete = false;
  private finalRevealRoot: HTMLDivElement | null = null;

  constructor() {
    super("EvidenceRevealScene");
  }

  create(data: EvidenceRevealSceneData): void {
    this.cleanupFinalRevealRoot();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupFinalRevealRoot());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.cleanupFinalRevealRoot());

    const levelId = data.levelId ?? 1;
    const chapterId = data.chapterId;
    const level = getLevelById(levelId) ?? getLevelById(1);
    const clueChainEntry = getClueChainEntry(levelId);
    const activeChapterId = typeof chapterId === "number" ? chapterId : null;
    const chapterChainEntry = activeChapterId !== null ? getChapterClueChainEntry(activeChapterId) : undefined;
    const exhibitName = chapterChainEntry
      ? getChapterRevealName(chapterChainEntry.currentClues, activeChapterId ?? undefined)
      : level?.exhibitName ?? "The Sealed Envelope";
    const emotionalReveal = chapterChainEntry?.meaningDiscovered ?? clueChainEntry?.solvedMeaning ?? level?.emotionalReveal ?? storyContent.ui.levelOneReveal;
    const nextHintText = chapterChainEntry?.nextHintText ?? clueChainEntry?.nextHintText;
    const nextLabel = chapterChainEntry?.nextActionLabel ?? clueChainEntry?.nextLabel ?? storyContent.ui.continuePrompt;
    const nextPanelTitle = chapterChainEntry?.nextActionLabel ?? clueChainEntry?.nextClueName ?? "Next clue";
    const nextVisualMotif = chapterChainEntry ? getChapterRevealMotif(activeChapterId ?? 1) : clueChainEntry?.nextVisualMotif;
    const completionLevelId = activeChapterId !== null ? getChapterCompletionLevelId(activeChapterId) : levelId;

    if (activeChapterId !== null) {
      requestChapterMusicForChapter(activeChapterId, getAudioManager());
    }

    this.isComplete = false;
    setSceneStatus(typeof chapterId === "number" ? `evidence-reveal-chapter-${chapterId}` : `evidence-reveal-level-${levelId}`, emotionalReveal);
    const accent = getRevealAccent(levelId);
    const chapterRevealAsset =
      activeChapterId !== null ? getChapterRevealFinalAsset(activeChapterId) : undefined;

    if (chapterRevealAsset?.imageUrl) {
      this.renderImageBackedReveal({
        imageUrl: chapterRevealAsset.imageUrl,
        chapterId,
        levelId,
        completionLevelId,
        exhibitName,
        emotionalReveal,
        chapterChainEntry,
        clueChainEntry
      });
      return;
    }

    this.drawCeremonialBackdrop(accent);
    this.drawCertificateFrame(accent);
    this.drawExhibitIcon(levelId, accent);

    const stamp = this.add
      .text(GAME_WIDTH / 2, 126, "CLUE FILED", {
        fontFamily: "Georgia, serif",
        fontSize: "19px",
        color: THEME_HEX.brassHighlight,
        align: "center",
        letterSpacing: 1
      })
      .setOrigin(0.5)
      .setRotation(-0.035);

    this.add.text(GAME_WIDTH / 2, 180, exhibitName, {
      fontFamily: "Georgia, serif",
      fontSize: "34px",
      color: THEME_HEX.warmInkBrown,
      align: "center",
      wordWrap: { width: 650, useAdvancedWrap: true }
    }).setOrigin(0.5);

    this.add.rectangle(GAME_WIDTH / 2, 216, 430, 1, PHASER_THEME.deepGold, 0.32);

    const text = this.add
      .text(
        GAME_WIDTH / 2,
        nextHintText ? 250 : 292,
        emotionalReveal,
        {
          fontFamily: "Georgia, serif",
          fontSize: nextHintText ? "22px" : "24px",
          color: THEME_HEX.warmInkBrown,
          align: "center",
          lineSpacing: 8,
          wordWrap: { width: 620, useAdvancedWrap: true }
        }
      )
      .setOrigin(0.5);

    if (!chapterChainEntry && clueChainEntry?.nextHintText) {
      this.drawNextCluePanel(clueChainEntry.nextVisualMotif, clueChainEntry.nextClueName ?? "Next clue", clueChainEntry.nextHintText);
    }
    if (chapterChainEntry && nextHintText && nextVisualMotif) {
      this.drawNextCluePanel(nextVisualMotif, nextPanelTitle, nextHintText);
    }

    this.drawContinueButton(430);
    const prompt = this.add
      .text(GAME_WIDTH / 2, 430, nextHintText ? nextLabel : storyContent.ui.continuePrompt, {
        fontFamily: "Georgia, serif",
        fontSize: "17px",
        color: THEME_HEX.mainCream,
        align: "center"
      })
      .setOrigin(0.5);

    const continueToComplete = () => {
      if (this.isComplete) {
        this.scene.start("LevelSelectScene");
        return;
      }

      this.isComplete = true;
      new SaveManager().markLevelCompleted(completionLevelId);
      setSceneStatus(
        typeof chapterId === "number" ? `chapter-${chapterId}-complete` : `level-${levelId}-complete`,
        typeof chapterId === "number" ? `Chapter ${chapterId} closed.` : `Clue ${levelId} filed.`
      );
      const nextLevelId = completionLevelId + 1;
      stamp.setText("FILED IN THE CASE RECORD");
      stamp.setRotation(-0.025);
      this.add.text(GAME_WIDTH / 2, 238, typeof chapterId === "number" ? `Chapter ${chapterId} closed.` : `Clue ${levelId} filed.`, {
        fontFamily: "Georgia, serif",
        fontSize: "28px",
        color: THEME_HEX.warmInkBrown,
        align: "center"
      }).setOrigin(0.5);
      text.setText(
        [
          `${exhibitName} is filed.`,
          chapterChainEntry?.nextChapterId
            ? `Next: ${getChapterById(chapterChainEntry.nextChapterId)?.title ?? "the next chapter"}.`
            : clueChainEntry?.nextClueName
              ? `Next: ${clueChainEntry.nextClueName}.`
            : `Level ${nextLevelId} will open in the next chapter.`,
        ].join("\n")
      );
      text.setY(320);
      text.setFontSize(22);
      prompt.setText("Press Enter or Tap to Open the Case Archive");
    };

    this.input.keyboard?.on("keydown-ENTER", continueToComplete);
    this.input.on("pointerdown", continueToComplete);
  }

  private renderImageBackedReveal({
    imageUrl,
    chapterId,
    levelId,
    completionLevelId,
    exhibitName,
    emotionalReveal,
    chapterChainEntry,
    clueChainEntry
  }: {
    imageUrl: string;
    chapterId?: number;
    levelId: number;
    completionLevelId: number;
    exhibitName: string;
    emotionalReveal: string;
    chapterChainEntry: ReturnType<typeof getChapterClueChainEntry>;
    clueChainEntry: ReturnType<typeof getClueChainEntry>;
  }): void {
    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    const root = document.createElement("div");
    root.className = "final-image-scene evidence-reveal-final-scene";
    root.dataset.testid = "evidence-reveal-image-backed";
    root.dataset.chapterId = typeof chapterId === "number" ? String(chapterId) : "";
    root.dataset.phase = "initial";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "final-image-button evidence-reveal-final-button";
    button.dataset.testid = "evidence-reveal-image-backed-page";
    button.setAttribute("aria-label", "Continue evidence reveal");

    const image = document.createElement("img");
    image.className = "final-image-frame evidence-reveal-final-image";
    image.src = imageUrl;
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";

    const accessibleText = document.createElement("span");
    accessibleText.className = "sr-only";
    accessibleText.dataset.testid = "evidence-reveal-accessible-text";
    accessibleText.textContent = this.getInitialRevealStatusText(exhibitName, emotionalReveal, chapterChainEntry, clueChainEntry);

    button.append(image, accessibleText);
    root.append(button);
    document.body.append(root);
    document.body.classList.add("final-image-active");
    this.finalRevealRoot = root;

    let isRoutingToArchive = false;
    const continueToComplete = () => {
      if (isRoutingToArchive) {
        return;
      }

      isRoutingToArchive = true;
      this.isComplete = true;
      new SaveManager().markLevelCompleted(completionLevelId);
      const completeLabel = typeof chapterId === "number" ? `Chapter ${chapterId} closed.` : `Clue ${levelId} filed.`;
      setSceneStatus(
        typeof chapterId === "number" ? `chapter-${chapterId}-complete` : `level-${levelId}-complete`,
        completeLabel
      );
      root.dataset.phase = "complete";
      button.setAttribute("aria-label", "Open the Case Archive");
      accessibleText.textContent = this.getCompletedRevealStatusText(
        completeLabel,
        exhibitName,
        chapterChainEntry,
        clueChainEntry,
        completionLevelId
      );
      this.cleanupFinalRevealRoot();
      this.scene.start("LevelSelectScene");
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      continueToComplete();
    });
    this.input.keyboard?.on("keydown-ENTER", continueToComplete);
  }

  private cleanupFinalRevealRoot(): void {
    this.finalRevealRoot?.remove();
    this.finalRevealRoot = null;
    document.body.classList.remove("final-image-active");
  }

  private getInitialRevealStatusText(
    exhibitName: string,
    emotionalReveal: string,
    chapterChainEntry: ReturnType<typeof getChapterClueChainEntry>,
    clueChainEntry: ReturnType<typeof getClueChainEntry>
  ): string {
    const nextText = chapterChainEntry?.nextHintText ?? clueChainEntry?.nextHintText;
    return [exhibitName, emotionalReveal, nextText].filter(Boolean).join(" ");
  }

  private getCompletedRevealStatusText(
    completeLabel: string,
    exhibitName: string,
    chapterChainEntry: ReturnType<typeof getChapterClueChainEntry>,
    clueChainEntry: ReturnType<typeof getClueChainEntry>,
    completionLevelId: number
  ): string {
    const nextLevelId = completionLevelId + 1;
    const nextText = chapterChainEntry?.nextChapterId
      ? `Next: ${getChapterById(chapterChainEntry.nextChapterId)?.title ?? "the next chapter"}.`
      : clueChainEntry?.nextClueName
        ? `Next: ${clueChainEntry.nextClueName}.`
        : `Level ${nextLevelId} will open in the next chapter.`;
    return `${completeLabel} ${exhibitName} is filed. ${nextText}`;
  }

  private drawCeremonialBackdrop(accent: number): void {
    drawNonVnPresentationShell(this, {
      stageWidth: 804,
      stageHeight: 426,
      stageAlpha: 0.86,
      innerAlpha: 0.22,
      accent,
      showSeal: false
    });
  }

  private drawCertificateFrame(accent: number): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 804, 426, PHASER_THEME.panelNavy, 0.96)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.72);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 774, 396, PHASER_THEME.softIvory, 0.96)
      .setStrokeStyle(1, PHASER_THEME.deepGold, 0.54);
    this.add.rectangle(GAME_WIDTH / 2, 104, 508, 2, accent, 0.34);
    this.add.rectangle(GAME_WIDTH / 2, 450, 508, 2, PHASER_THEME.antiqueGold, 0.32);
    this.add.rectangle(480, 270, 700, 330, PHASER_THEME.softParchment, 0.08);
    this.add.circle(GAME_WIDTH / 2, 116, 58, PHASER_THEME.antiqueGold, 0.08)
      .setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.36);
    this.add.circle(GAME_WIDTH / 2, 116, 38, accent, 0.12)
      .setStrokeStyle(1, PHASER_THEME.deepGold, 0.32);
  }

  private drawExhibitIcon(levelId: number, accent: number): void {
    const x = GAME_WIDTH / 2;
    const y = 116;
    this.add.circle(x, y, 22, PHASER_THEME.softIvory, 0.92);
    this.add.circle(x, y, 21, PHASER_THEME.antiqueGold, 0.13).setStrokeStyle(1, PHASER_THEME.deepGold, 0.58);

    if (levelId === 6) {
      this.add.circle(x - 7, y, 7, PHASER_THEME.silver, 0.92).setStrokeStyle(2, PHASER_THEME.deepBlueNavy, 0.5);
      this.add.rectangle(x + 9, y, 28, 4, PHASER_THEME.silver, 0.92);
      this.add.rectangle(x + 21, y + 5, 8, 4, PHASER_THEME.silver, 0.92);
      return;
    }

    if (levelId === 7) {
      this.add.rectangle(x, y + 1, 22, 28, PHASER_THEME.antiqueGold, 0.18).setStrokeStyle(2, PHASER_THEME.deepGold, 0.82);
      this.add.circle(x, y + 4, 9, PHASER_THEME.brassHighlight, 0.62);
      return;
    }

    if (levelId === 8) {
      this.add.rectangle(x, y - 3, 34, 9, PHASER_THEME.blueRibbon, 0.92);
      this.add.triangle(x - 10, y + 8, x - 17, y + 2, x - 5, y + 2, x - 10, y + 21, PHASER_THEME.blueRibbon, 0.86);
      this.add.triangle(x + 10, y + 8, x + 17, y + 2, x + 5, y + 2, x + 10, y + 21, PHASER_THEME.blueRibbon, 0.86);
      return;
    }

    if (levelId === 9) {
      this.add.rectangle(x, y + 1, 30, 22, PHASER_THEME.softParchment, 0.92).setStrokeStyle(1, PHASER_THEME.deepGold, 0.7);
      this.add.circle(x - 12, y - 11, 3, PHASER_THEME.silver, 0.8);
      this.add.circle(x + 11, y - 7, 2, PHASER_THEME.silver, 0.8);
      this.add.line(x, y, -12, -11, 11, -7, PHASER_THEME.antiqueGold, 0.5).setOrigin(0.5);
      return;
    }

    if (levelId === 3) {
      this.add.rectangle(x, y, 34, 22, PHASER_THEME.richWineRed, 0.82).setStrokeStyle(1, PHASER_THEME.deepGold, 0.6);
      this.add.rectangle(x, y, 34, 2, PHASER_THEME.deepGold, 0.42);
      return;
    }

    if (levelId === 2) {
      this.add.circle(x, y, 15, PHASER_THEME.antiqueGold, 0.86).setStrokeStyle(2, accent, 0.45);
      this.add.rectangle(x, y, 22, 3, PHASER_THEME.deepGold, 0.8);
      return;
    }

    this.add.rectangle(x, y, 34, 24, PHASER_THEME.softParchment, 0.94).setStrokeStyle(1, PHASER_THEME.deepGold, 0.68);
    this.add.line(x, y, -17, -12, 0, 3, PHASER_THEME.deepGold, 0.58).setOrigin(0.5);
    this.add.line(x, y, 17, -12, 0, 3, PHASER_THEME.deepGold, 0.58).setOrigin(0.5);
  }

  private drawContinueButton(y: number): void {
    this.add.rectangle(GAME_WIDTH / 2, y, 300, 46, PHASER_THEME.burgundy, 0.94)
      .setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.76);
    this.add.rectangle(GAME_WIDTH / 2, y - 17, 256, 1, PHASER_THEME.softIvory, 0.13);
    this.add.circle(GAME_WIDTH / 2 - 124, y, 6, PHASER_THEME.brassHighlight, 0.42);
    this.add.circle(GAME_WIDTH / 2 + 124, y, 6, PHASER_THEME.brassHighlight, 0.42);
  }

  private drawNextCluePanel(motif: ClueVisualMotif, nextClueName: string, nextHintText: string): void {
    const panelY = 342;
    this.add.rectangle(GAME_WIDTH / 2, panelY, 626, 112, PHASER_THEME.panelNavy, 0.92)
      .setStrokeStyle(1, PHASER_THEME.antiqueGold, 0.48);
    this.add.rectangle(GAME_WIDTH / 2, panelY, 598, 88, PHASER_THEME.softIvory, 0.9)
      .setStrokeStyle(1, PHASER_THEME.deepGold, 0.32);
    this.add.text(330, panelY - 34, "NEXT CLUE", {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: THEME_HEX.deepGold,
      align: "left"
    }).setOrigin(0, 0.5);
    this.add.text(330, panelY - 12, nextClueName, {
      fontFamily: "Georgia, serif",
      fontSize: "21px",
      color: THEME_HEX.warmInkBrown,
      align: "left"
    }).setOrigin(0, 0.5);
    this.add.text(330, panelY + 22, nextHintText, {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: THEME_HEX.warmInkBrown,
      align: "left",
      lineSpacing: 4,
      wordWrap: { width: 392, useAdvancedWrap: true }
    }).setOrigin(0, 0.5);
    this.drawNextMotif(motif, 260, panelY);
  }

  private drawNextMotif(motif: ClueVisualMotif, x: number, y: number): void {
    this.add.circle(x, y, 34, PHASER_THEME.antiqueGold, 0.12)
      .setStrokeStyle(1, PHASER_THEME.deepGold, 0.46);
    this.add.circle(x, y, 25, PHASER_THEME.softParchment, 0.88)
      .setStrokeStyle(1, PHASER_THEME.deepGold, 0.42);

    if (motif === "tram-ticket") {
      this.add.rectangle(x, y, 40, 22, PHASER_THEME.softIvory, 0.92).setStrokeStyle(1, PHASER_THEME.deepGold, 0.72);
      this.add.line(x, y, -14, -2, 14, -2, PHASER_THEME.deepGold, 0.58).setOrigin(0.5);
      this.add.circle(x + 12, y + 5, 4, PHASER_THEME.antiqueGold, 0.72);
      return;
    }

    if (motif === "wall-keyhole") {
      this.add.rectangle(x, y + 3, 42, 26, PHASER_THEME.richWineRed, 0.78).setStrokeStyle(1, PHASER_THEME.deepGold, 0.64);
      this.add.circle(x, y - 3, 5, PHASER_THEME.midnightNavy, 0.72);
      this.add.rectangle(x, y + 8, 5, 14, PHASER_THEME.midnightNavy, 0.72);
      return;
    }

    if (motif === "wave-mark") {
      this.add.rectangle(x, y + 7, 42, 8, PHASER_THEME.blueRibbon, 0.62);
      this.add.arc(x - 11, y, 12, 200, 340, false, PHASER_THEME.blueRibbon, 0.84).setStrokeStyle(3, PHASER_THEME.blueRibbon, 0.84);
      this.add.arc(x + 10, y, 12, 200, 340, false, PHASER_THEME.blueRibbon, 0.84).setStrokeStyle(3, PHASER_THEME.blueRibbon, 0.84);
      return;
    }

    if (motif === "archive-code") {
      this.add.rectangle(x, y, 38, 28, PHASER_THEME.softIvory, 0.92).setStrokeStyle(1, PHASER_THEME.deepGold, 0.66);
      this.add.rectangle(x - 2, y - 5, 24, 2, PHASER_THEME.deepGold, 0.55);
      this.add.rectangle(x - 5, y + 3, 18, 2, PHASER_THEME.deepGold, 0.45);
      this.add.text(x + 9, y + 8, "A7", { fontFamily: "Georgia, serif", fontSize: "9px", color: THEME_HEX.deepGold }).setOrigin(0.5);
      return;
    }

    if (motif === "silver-key") {
      this.add.circle(x - 9, y, 8, PHASER_THEME.silver, 0.9).setStrokeStyle(2, PHASER_THEME.deepBlueNavy, 0.42);
      this.add.rectangle(x + 8, y, 30, 4, PHASER_THEME.silver, 0.92);
      this.add.rectangle(x + 20, y + 6, 8, 4, PHASER_THEME.silver, 0.92);
      return;
    }

    if (motif === "lantern") {
      this.add.rectangle(x, y + 2, 22, 30, PHASER_THEME.antiqueGold, 0.18).setStrokeStyle(2, PHASER_THEME.deepGold, 0.82);
      this.add.circle(x, y + 5, 10, PHASER_THEME.brassHighlight, 0.62);
      return;
    }

    if (motif === "blue-ribbon") {
      this.add.rectangle(x, y - 5, 38, 9, PHASER_THEME.blueRibbon, 0.92);
      this.add.triangle(x - 10, y + 9, x - 18, y + 2, x - 5, y + 2, x - 10, y + 22, PHASER_THEME.blueRibbon, 0.86);
      this.add.triangle(x + 10, y + 9, x + 18, y + 2, x + 5, y + 2, x + 10, y + 22, PHASER_THEME.blueRibbon, 0.86);
      return;
    }

    if (motif === "unfinished-letter") {
      this.add.rectangle(x, y, 34, 26, PHASER_THEME.softIvory, 0.92).setStrokeStyle(1, PHASER_THEME.deepGold, 0.68);
      this.add.rectangle(x, y - 2, 20, 2, PHASER_THEME.deepGold, 0.52);
      this.add.rectangle(x - 4, y + 6, 16, 2, PHASER_THEME.deepGold, 0.38);
      return;
    }

    if (motif === "final-court") {
      this.add.rectangle(x, y + 11, 44, 5, PHASER_THEME.antiqueGold, 0.72);
      for (const offset of [-14, 0, 14]) {
        this.add.rectangle(x + offset, y, 5, 28, PHASER_THEME.softIvory, 0.78).setStrokeStyle(1, PHASER_THEME.deepGold, 0.42);
      }
      this.add.triangle(x, y - 18, x - 28, y - 4, x + 28, y - 4, PHASER_THEME.antiqueGold, 0.58);
      return;
    }

    this.add.circle(x - 8, y - 2, 10, PHASER_THEME.roseAccent, 0.18);
    this.add.circle(x + 8, y - 2, 10, PHASER_THEME.roseAccent, 0.18);
    this.add.triangle(x, y + 14, x - 20, y + 1, x + 20, y + 1, PHASER_THEME.roseAccent, 0.16);
  }
}

function getChapterRevealName(currentClues: readonly string[], chapterId?: number): string {
  if (currentClues.length <= 1) {
    return currentClues[0] ?? "The Sealed Envelope";
  }

  if (currentClues.length === 2) {
    return `${currentClues[0]} and ${currentClues[1]}`;
  }

  if (chapterId === 1) {
    return currentClues[0] ?? "The Sealed Envelope";
  }

  if (currentClues.length === 3) {
    return `${currentClues[0]}, ${currentClues[1]}, and ${currentClues[2]}`;
  }

  return currentClues[0] ?? "The Sealed Envelope";
}

function getChapterRevealMotif(chapterId: number): ClueVisualMotif {
  if (chapterId === 1) {
    return "tram-ticket";
  }

  if (chapterId === 2) {
    return "wave-mark";
  }

  if (chapterId === 3) {
    return "archive-code";
  }

  if (chapterId === 4) {
    return "silver-key";
  }

  if (chapterId === 5) {
    return "unfinished-letter";
  }

  return "archive-code";
}

function getRevealAccent(levelId: number): number {
  if (levelId === 6) {
    return PHASER_THEME.silver;
  }

  if (levelId === 8) {
    return PHASER_THEME.blueRibbon;
  }

  if (levelId === 3) {
    return PHASER_THEME.richWineRed;
  }

  if (levelId === 7) {
    return PHASER_THEME.brassHighlight;
  }

  return PHASER_THEME.burgundy;
}
