import Phaser from "phaser";
import { openingCinematicBeats, type OpeningCinematicBeat } from "../../content/openingCinematic";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { resolvePublicAssetPath } from "../assets/publicAssetPaths";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { SaveManager } from "../systems/SaveManager";

const REDUCED_MOTION_DURATION_MS = 900;

export class OpeningCinematicScene extends Phaser.Scene {
  private root: HTMLDivElement | null = null;
  private imageLayers: HTMLImageElement[] = [];
  private activeLayerIndex = 0;
  private isEnding = false;
  private reduceMotion = false;
  private delayedCall?: Phaser.Time.TimerEvent;
  private captionShowCall?: Phaser.Time.TimerEvent;
  private captionHideCall?: Phaser.Time.TimerEvent;
  private preloadedImages: HTMLImageElement[] = [];

  constructor() {
    super("OpeningCinematicScene");
  }

  create(): void {
    this.isEnding = false;
    this.activeLayerIndex = 0;
    this.imageLayers = [];
    this.preloadedImages = [];
    this.reduceMotion = new SaveManager().load().reduceMotion;
    setSceneStatus("opening-cinematic", "Opening cinematic. Warsaw wakes quietly.");
    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    this.drawBackdrop();
    this.createOverlay();
    this.preloadImages();
    this.showBeat(0);

    this.input.keyboard?.on("keydown-ESC", this.skipToMenu, this);
    this.input.keyboard?.on("keydown-ENTER", this.skipToMenu, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());
  }

  private drawBackdrop(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PHASER_THEME.midnightNavy);
  }

  private createOverlay(): void {
    this.root = document.createElement("div");
    this.root.className = "opening-cinematic-overlay";
    this.root.dataset.testid = "opening-cinematic";
    this.root.dataset.reduceMotion = String(this.reduceMotion);
    this.root.innerHTML = `
      <section class="opening-cinematic-stage" aria-label="Opening cinematic">
        <div class="opening-cinematic-visual" data-testid="opening-cinematic-visual" aria-hidden="true">
          <img class="opening-cinematic-frame" data-testid="opening-cinematic-frame-a" alt="" decoding="async" />
          <img class="opening-cinematic-frame" data-testid="opening-cinematic-frame-b" alt="" decoding="async" />
          <span class="opening-cinematic-vignette" aria-hidden="true"></span>
        </div>
        <p class="opening-cinematic-caption" data-testid="opening-cinematic-caption" aria-live="polite"></p>
        <button type="button" class="opening-skip-button" data-testid="opening-skip" aria-label="Skip opening cinematic">Skip</button>
      </section>
    `;
    document.getElementById("game-shell")?.appendChild(this.root);
    this.imageLayers = Array.from(this.root.querySelectorAll<HTMLImageElement>(".opening-cinematic-frame"));
    this.root.querySelector<HTMLButtonElement>('[data-testid="opening-skip"]')?.addEventListener("click", () => this.skipToMenu());
  }

  private preloadImages(): void {
    this.preloadedImages = openingCinematicBeats.map((beat) => {
      const image = new Image();
      image.decoding = "async";
      image.src = resolvePublicAssetPath(beat.imagePath);
      return image;
    });
  }

  private showBeat(index: number): void {
    if (!this.root || this.isEnding) {
      return;
    }

    const beat = openingCinematicBeats[index];
    if (!beat) {
      this.finishToMenu();
      return;
    }

    this.root.dataset.beat = beat.id;
    this.root.dataset.visual = beat.visualKey;
    this.root.dataset.image = beat.imagePath;
    this.updateCaption(beat);
    setSceneStatus("opening-cinematic", `Opening cinematic. ${beat.caption}`);

    const incomingLayerIndex = index === 0 ? this.activeLayerIndex : 1 - this.activeLayerIndex;
    const incomingLayer = this.imageLayers[incomingLayerIndex];
    const outgoingLayer = this.imageLayers[this.activeLayerIndex];

    if (incomingLayer) {
      this.applyBeatImage(incomingLayer, beat);
    }

    this.time.delayedCall(this.reduceMotion ? 20 : 80, () => {
      incomingLayer?.classList.add("is-active");
      incomingLayer?.classList.toggle("is-kenburns", !this.reduceMotion);
      if (outgoingLayer && outgoingLayer !== incomingLayer) {
        outgoingLayer.classList.remove("is-active", "is-kenburns");
      }
      this.activeLayerIndex = incomingLayerIndex;
    });

    this.delayedCall?.remove(false);
    this.delayedCall = this.time.delayedCall(this.getBeatDuration(beat), () => {
      this.showBeat(index + 1);
    });
  }

  private applyBeatImage(image: HTMLImageElement, beat: OpeningCinematicBeat): void {
    const imageUrl = resolvePublicAssetPath(beat.imagePath);
    image.classList.remove("is-missing", "is-active", "is-kenburns");
    image.dataset.imagePath = beat.imagePath;
    image.onerror = () => {
      image.classList.add("is-missing");
      image.removeAttribute("src");
      if (import.meta.env.DEV || import.meta.env.MODE === "test") {
        console.warn(`Opening cinematic image failed to load: ${beat.imagePath}`);
      }
    };
    image.src = imageUrl;
  }

  private updateCaption(beat: OpeningCinematicBeat): void {
    const caption = this.root?.querySelector<HTMLElement>('[data-testid="opening-cinematic-caption"]');
    if (caption) {
      this.captionShowCall?.remove(false);
      this.captionHideCall?.remove(false);
      caption.classList.remove("is-visible");
      caption.dataset.beat = beat.id;
      caption.textContent = beat.caption;
      const showDelayMs = this.reduceMotion ? 40 : 320;
      const hideDelayMs = Math.max(showDelayMs + 250, this.getBeatDuration(beat) - (this.reduceMotion ? 120 : 650));
      this.captionShowCall = this.time.delayedCall(showDelayMs, () => {
        caption.classList.add("is-visible");
      });
      this.captionHideCall = this.time.delayedCall(hideDelayMs, () => {
        caption.classList.remove("is-visible");
      });
    }
  }

  private getBeatDuration(beat: OpeningCinematicBeat): number {
    return this.reduceMotion ? Math.min(REDUCED_MOTION_DURATION_MS, beat.durationMs) : beat.durationMs;
  }

  private skipToMenu(): void {
    if (this.isEnding) {
      return;
    }

    setSceneStatus("opening-cinematic-skip", "Opening cinematic skipped. Opening the case file menu.");
    this.finishToMenu();
  }

  private finishToMenu(): void {
    if (this.isEnding) {
      return;
    }

    this.isEnding = true;
    this.delayedCall?.remove(false);
    this.root?.classList.add("is-ending");
    this.time.delayedCall(this.reduceMotion ? 80 : 420, () => {
      this.scene.start("TitleScene");
    });
  }

  private cleanup(): void {
    this.delayedCall?.remove(false);
    this.captionShowCall?.remove(false);
    this.captionHideCall?.remove(false);
    this.delayedCall = undefined;
    this.captionShowCall = undefined;
    this.captionHideCall = undefined;
    for (const image of this.preloadedImages) {
      image.onload = null;
      image.onerror = null;
    }
    this.preloadedImages = [];
    this.imageLayers = [];
    this.input.keyboard?.off("keydown-ESC", this.skipToMenu, this);
    this.input.keyboard?.off("keydown-ENTER", this.skipToMenu, this);
    this.root?.remove();
    this.root = null;
  }
}
