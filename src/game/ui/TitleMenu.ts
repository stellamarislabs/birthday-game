import type { SaveData } from "../../types/SaveData";
import { storyContent } from "../../content/story";
import { renderUiIcon } from "../../ui/icons";

interface TitleMenuOptions {
  save: SaveData;
  onPrimary: () => void;
  onLevelSelect: () => void;
  onSettingsChanged: (settings: { muted: boolean; reduceMotion: boolean }) => SaveData;
  onResetConfirmed: () => void;
}

export class TitleMenu {
  private readonly root: HTMLDivElement;
  private settingsOpen = false;
  private resetOpen = false;

  constructor(private readonly options: TitleMenuOptions) {
    this.root = document.createElement("div");
    this.root.className = "menu-overlay title-menu-overlay";
    this.root.dataset.testid = "title-menu";
    document.getElementById("game-shell")?.appendChild(this.root);
    this.render();
  }

  destroy(): void {
    this.root.remove();
  }

  private render(): void {
    const hasStarted = this.options.save.unlockedLevelIds.length > 0;
    const hasCompletedLevelOne = this.options.save.completedLevelIds.includes(1);
    const primaryLabel = hasCompletedLevelOne ? "Continue Case" : "Open the Case";

    this.root.innerHTML = `
      <section class="menu-panel title-menu-panel" aria-label="Title menu">
        <h1 class="title-logo">${storyContent.title}</h1>
        <div class="menu-actions main-menu-actions">
          <button type="button" class="main-menu-button main-menu-button--primary main-menu-button--has-icon primary-button" data-testid="title-primary">${renderUiIcon("scales")}${primaryLabel}</button>
          <button type="button" class="main-menu-button main-menu-button--secondary main-menu-button--has-icon" data-testid="title-level-select" ${hasStarted ? "" : "disabled"}>${renderUiIcon("folder")}${storyContent.ui.levelSelect}</button>
          <button type="button" class="main-menu-button main-menu-button--reset main-menu-button--has-icon danger-button" data-testid="title-reset" ${hasStarted ? "" : "disabled"}>${renderUiIcon("reset")}Reset Case</button>
        </div>
        ${this.settingsOpen ? this.renderSettings() : ""}
        ${this.resetOpen ? this.renderResetConfirm() : ""}
      </section>
    `;

    this.bind();
  }

  private renderSettings(): string {
    return `
      <section class="menu-subpanel settings-panel" data-testid="settings-panel" aria-label="Settings">
        <p class="menu-kicker">Case Preferences</p>
        <h2>Settings</h2>
        <label class="settings-option-row">
          <input type="checkbox" data-testid="setting-muted" ${this.options.save.muted ? "checked" : ""} />
          <span>${renderUiIcon(this.options.save.muted ? "mute" : "sound")}Mute</span>
        </label>
        <label class="settings-option-row">
          <input type="checkbox" data-testid="setting-reduce-motion" ${this.options.save.reduceMotion ? "checked" : ""} />
          <span>${renderUiIcon("reduce-motion")}Reduce Motion</span>
        </label>
        <button type="button" data-testid="settings-close">${renderUiIcon("check")}Close</button>
      </section>
    `;
  }

  private renderResetConfirm(): string {
    return `
      <section class="menu-subpanel reset-confirmation-panel" data-testid="reset-confirmation" aria-label="Reset confirmation">
        <p class="menu-kicker">Sealed document warning</p>
        <h2>Reset case?</h2>
        <p>This clears progress for this browser only.</p>
        <div class="menu-actions-row">
          <button type="button" class="danger-button" data-testid="reset-confirm">${renderUiIcon("reset")}Reset Case</button>
          <button type="button" data-testid="reset-cancel">${renderUiIcon("lock")}Cancel</button>
        </div>
      </section>
    `;
  }

  private bind(): void {
    this.root.querySelector<HTMLButtonElement>('[data-testid="title-primary"]')?.addEventListener("click", () => {
      this.options.onPrimary();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="title-level-select"]')?.addEventListener("click", () => {
      this.options.onLevelSelect();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="title-reset"]')?.addEventListener("click", () => {
      this.resetOpen = true;
      this.settingsOpen = false;
      this.render();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="settings-close"]')?.addEventListener("click", () => {
      this.settingsOpen = false;
      this.render();
    });
    this.root.querySelector<HTMLInputElement>('[data-testid="setting-muted"]')?.addEventListener("change", (event) => {
      this.options.save = this.options.onSettingsChanged({
        muted: (event.currentTarget as HTMLInputElement).checked,
        reduceMotion: this.options.save.reduceMotion
      });
      this.render();
    });
    this.root.querySelector<HTMLInputElement>('[data-testid="setting-reduce-motion"]')?.addEventListener("change", (event) => {
      this.options.save = this.options.onSettingsChanged({
        muted: this.options.save.muted,
        reduceMotion: (event.currentTarget as HTMLInputElement).checked
      });
      this.render();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-confirm"]')?.addEventListener("click", () => {
      this.options.onResetConfirmed();
    });
    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-cancel"]')?.addEventListener("click", () => {
      this.resetOpen = false;
      this.render();
    });
  }
}
