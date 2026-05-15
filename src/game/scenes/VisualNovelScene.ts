import Phaser from "phaser";
import { getVisualNovelSceneSpec } from "../../content/vnScenes";
import type { VisualNovelSceneSpec, VisualNovelSceneTarget } from "../../types/VisualNovel";
import { getSpeakerIconKey, renderUiIcon } from "../../ui/icons";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { getVisualNovelImageSequence, type FinalImagePage } from "../assets/finalAssets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { requestChapterMusicForChapter } from "../platformer/platformerMusic";
import { getAudioManager } from "../systems/AudioManager";
import { SaveManager } from "../systems/SaveManager";
import { getNextVisualNovelLineIndex, getVisualNovelTarget } from "../systems/VnFlow";
import { getVisualNovelBackgroundVariant, getVisualNovelPortrait } from "../systems/VnPresentation";

interface VisualNovelSceneData {
  sceneId?: string;
}

export class VisualNovelScene extends Phaser.Scene {
  private root: HTMLDivElement | null = null;
  private spec: VisualNovelSceneSpec | null = null;
  private imageBackedPages: FinalImagePage[] | undefined;
  private lineIndex = 0;
  private isTransitioning = false;
  private readonly handleImageBackedBodyClick = (event: MouseEvent): void => {
    if (!this.imageBackedPages || this.isTransitioning || !this.root) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && this.root.contains(target)) {
      return;
    }

    this.advanceLine();
  };

  constructor() {
    super("VisualNovelScene");
  }

  create(data: VisualNovelSceneData): void {
    this.spec = getVisualNovelSceneSpec(data.sceneId) ?? null;
    this.imageBackedPages = getVisualNovelImageSequence(this.spec?.id);
    this.lineIndex = 0;
    this.isTransitioning = false;

    if (!this.spec) {
      setSceneStatus("visual-novel-missing", "Visual novel scene unavailable.");
      this.scene.start("TitleScene");
      return;
    }

    if (this.spec.chapterId) {
      requestChapterMusicForChapter(this.spec.chapterId, getAudioManager());
    }

    const reduceMotion = new SaveManager().load().reduceMotion;

    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
    this.add.rectangle(GAME_WIDTH / 2, 438, GAME_WIDTH, 120, PHASER_THEME.panelNavy, 0.14);
    this.add.rectangle(GAME_WIDTH / 2, 106, 760, 2, PHASER_THEME.antiqueGold, 0.24);
    this.add.rectangle(GAME_WIDTH / 2, 432, 760, 2, PHASER_THEME.burgundy, 0.22);

    this.root = document.createElement("div");
    this.root.className = "vn-overlay";
    this.root.dataset.testid = "visual-novel-scene";
    this.root.dataset.sceneId = this.spec.id;
    this.root.dataset.reduceMotion = reduceMotion ? "true" : "false";
    if (this.imageBackedPages) {
      document.body.classList.add("final-image-active");
      document.body.addEventListener("click", this.handleImageBackedBodyClick);
    }
    const overlayParent = this.imageBackedPages ? document.body : document.getElementById("game-shell");
    overlayParent?.appendChild(this.root);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroyOverlay());
    this.input.keyboard?.on("keydown-ENTER", this.advanceLine, this);
    this.input.keyboard?.on("keydown-SPACE", this.advanceLine, this);
    this.input.keyboard?.on("keydown-ESC", this.skipScene, this);
    this.input.keyboard?.on("keydown-S", this.skipScene, this);

    this.render();
  }

  private render(): void {
    if (!this.root || !this.spec) {
      return;
    }

    const line = this.spec.lines[this.lineIndex];
    const imageBackedPage = this.imageBackedPages?.[this.lineIndex];
    if (imageBackedPage) {
      this.renderImageBacked(line.speaker, line.text, imageBackedPage);
      return;
    }

    const portrait = getVisualNovelPortrait(line);
    const backgroundVariant = getVisualNovelBackgroundVariant(this.spec);
    this.root.className = `vn-overlay vn-bg-${backgroundVariant}`;
    this.root.dataset.backgroundVariant = backgroundVariant;
    this.root.dataset.activeSpeaker = portrait.speakerId;
    setSceneStatus(`visual-novel-${this.spec.id}`, `${this.spec.title ?? "Visual Novel"}. ${line.speaker}: ${line.text}`);

    this.root.innerHTML = `
      <section class="vn-panel" aria-label="${escapeHtml(this.spec.title ?? "Visual novel scene")}">
        <div class="vn-header">
          <p class="vn-kicker">Case Moment</p>
          <h1>${escapeHtml(this.spec.title ?? "Case File")}</h1>
          <p class="vn-counter" data-testid="vn-line-counter">${this.lineIndex + 1} / ${this.spec.lines.length}</p>
        </div>
        <div class="vn-stage" data-testid="vn-portrait-stage" aria-hidden="true">
          <div class="vn-portrait vn-portrait-${escapeAttribute(portrait.portraitKey)} vn-portrait-${escapeAttribute(portrait.side)} is-active" data-testid="vn-active-portrait" data-speaker-id="${escapeAttribute(portrait.speakerId)}">
            <span class="vn-portrait-glow"></span>
            <span class="vn-portrait-mark">${escapeHtml(portrait.monogram)}</span>
            <span class="vn-portrait-label">${escapeHtml(portrait.label)}</span>
          </div>
          <div class="vn-scene-mark">
            <span>Case No. 16/05</span>
            <span>${escapeHtml(formatPlacementLabel(this.spec.placement))}</span>
          </div>
        </div>
        <button type="button" class="vn-card" data-testid="vn-dialogue-card" aria-label="Continue dialogue">
          <span class="vn-speaker vn-speaker-${escapeAttribute(portrait.portraitKey)}" data-testid="vn-speaker">${renderUiIcon(getSpeakerIconKey(portrait.speakerId))}${escapeHtml(line.speaker)}</span>
          <span class="vn-text" data-testid="vn-text">${escapeHtml(line.text)}</span>
          <span class="vn-continue-indicator">${renderUiIcon("play")}Continue</span>
        </button>
        <div class="vn-actions">
          <button type="button" class="secondary-button" data-testid="vn-skip">${renderUiIcon("reset")}Skip</button>
          <button type="button" class="primary-button" data-testid="vn-continue">${renderUiIcon("play")}Continue</button>
        </div>
      </section>
    `;

    this.root.querySelector<HTMLButtonElement>('[data-testid="vn-dialogue-card"]')?.addEventListener("click", () => {
      this.advanceLine();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="vn-continue"]')?.addEventListener("click", () => {
      this.advanceLine();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="vn-skip"]')?.addEventListener("click", () => {
      this.skipScene();
    });
  }

  private renderImageBacked(speaker: string, text: string, page: FinalImagePage): void {
    if (!this.root || !this.spec || !this.imageBackedPages) {
      return;
    }

    this.root.className = "vn-overlay vn-image-backed";
    this.root.dataset.backgroundVariant = "final-image";
    this.root.dataset.activeSpeaker = speaker.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    this.root.dataset.imageBacked = "true";
    this.root.dataset.pageIndex = String(this.lineIndex + 1);
    this.root.dataset.pageCount = String(this.imageBackedPages.length);
    setSceneStatus(`visual-novel-${this.spec.id}`, `${this.spec.title ?? "Visual Novel"}. ${speaker}: ${text}`);

    this.root.innerHTML = `
      <button type="button" class="final-image-button vn-final-image-button" data-testid="vn-image-backed-page" aria-label="Continue dialogue">
        <img class="final-image-frame vn-final-image-frame" src="${page.imageUrl}" alt="" decoding="async" />
        <span class="sr-only" data-testid="vn-line-counter">${this.lineIndex + 1} / ${this.imageBackedPages.length}</span>
        <span class="sr-only" data-testid="vn-speaker">${escapeHtml(speaker)}</span>
        <span class="sr-only" data-testid="vn-text">${escapeHtml(text)}</span>
      </button>
    `;

    this.root.querySelector<HTMLButtonElement>('[data-testid="vn-image-backed-page"]')?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.advanceLine();
    });
  }

  private advanceLine(): void {
    if (!this.spec || this.isTransitioning) {
      return;
    }

    getAudioManager().playUiClick();
    const nextIndex = getNextVisualNovelLineIndex(this.lineIndex, this.spec.lines.length);
    if (nextIndex === null) {
      this.startTarget(getVisualNovelTarget(this.spec, "next"));
      return;
    }

    this.lineIndex = nextIndex;
    this.render();
  }

  private skipScene(): void {
    if (!this.spec || this.isTransitioning) {
      return;
    }

    getAudioManager().playUiClick();
    this.startTarget(getVisualNovelTarget(this.spec, "skip"));
  }

  private startTarget(target: VisualNovelSceneTarget): void {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.scene.start(target.scene, target.data);
  }

  private destroyOverlay(): void {
    document.body.classList.remove("final-image-active");
    document.body.removeEventListener("click", this.handleImageBackedBodyClick);
    this.input.keyboard?.off("keydown-ENTER", this.advanceLine, this);
    this.input.keyboard?.off("keydown-SPACE", this.advanceLine, this);
    this.input.keyboard?.off("keydown-ESC", this.skipScene, this);
    this.input.keyboard?.off("keydown-S", this.skipScene, this);
    this.root?.remove();
    this.root = null;
    this.imageBackedPages = undefined;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, "");
}

function formatPlacementLabel(value: string): string {
  return value.replace(/-/g, " ");
}
