import { chapters, CHAPTER_COUNT } from "../../content/chapters";
import type { SaveData } from "../../types/SaveData";
import { getExhibitIconKey, renderUiIcon } from "../../ui/icons";
import { getChapterAvailability, getClosedChapterCount, type ChapterAvailability } from "../systems/ChapterBridge";

interface LevelSelectMenuOptions {
  save: SaveData;
  onSelectChapter: (chapterId: number) => void;
  onBackToTitle: () => void;
}

export interface LevelSelectChapterRow {
  chapterId: number;
  legacyLevelId: number;
  title: string;
  mainClues: readonly string[];
  leadHint: string;
  availability: ChapterAvailability;
}

export function getLevelSelectChapterRows(save: SaveData): LevelSelectChapterRow[] {
  return chapters.map((chapter) => {
    const availability = getChapterAvailability(chapter, save);

    return {
      chapterId: chapter.id,
      legacyLevelId: availability.legacyLevelId,
      title: chapter.title,
      mainClues: chapter.mainClues,
      leadHint: chapter.leadsToNext,
      availability
    };
  });
}

export class LevelSelectMenu {
  private readonly root: HTMLDivElement;

  constructor(private readonly options: LevelSelectMenuOptions) {
    this.root = document.createElement("div");
    this.root.className = "menu-overlay level-select-overlay";
    this.root.dataset.testid = "level-select-menu";
    document.getElementById("game-shell")?.appendChild(this.root);
    this.render();
  }

  destroy(): void {
    this.root.remove();
  }

  private render(): void {
    const rows = getLevelSelectChapterRows(this.options.save);
    const completedCount = getClosedChapterCount(chapters, this.options.save);

    this.root.innerHTML = `
      <section class="menu-panel level-select-panel" aria-label="Case Archive">
        <header class="level-select-header">
          <p class="menu-kicker">Case Archive</p>
          <h1>Case Archive</h1>
          <p class="level-select-summary">${completedCount}/${CHAPTER_COUNT} chapters closed</p>
        </header>
        ${this.options.save.gameCompleted ? '<p class="case-closed-banner" data-testid="case-closed-banner">Verdict Accepted. Case Closed.</p>' : ""}
        <div class="level-list">
          ${rows
            .map((row) => {
              const { availability } = row;
              const buttonLabel =
                availability.playable && availability.status === "completed"
                  ? row.chapterId === CHAPTER_COUNT ? "Replay Finale" : "Replay"
                  : availability.playable
                    ? availability.label
                    : availability.label;

              return `
                <article class="level-row level-row--${availability.status}" data-testid="chapter-row-${row.chapterId}" data-status="${availability.status}">
                  <div class="level-row-copy">
                    <span class="level-number-chip">${renderUiIcon(getExhibitIconKey(availability.legacyLevelId))}Chapter ${row.chapterId}</span>
                    <strong>${row.title}</strong>
                  </div>
                  <button type="button" data-chapter-id="${row.chapterId}" data-level-id="${availability.legacyLevelId}" data-testid="chapter-select-${row.chapterId}" ${
                    availability.playable ? "" : "disabled"
                  } aria-label="${buttonLabel}: ${row.title}">${renderUiIcon(availability.playable ? "play" : "lock")}${buttonLabel}</button>
                </article>
              `;
            })
            .join("")}
        </div>
        <button type="button" data-testid="level-select-back">${renderUiIcon("case-file")}Back to Title</button>
      </section>
    `;

    this.bind();
  }

  private bind(): void {
    this.root.querySelector<HTMLButtonElement>('[data-testid="level-select-back"]')?.addEventListener("click", () => {
      this.options.onBackToTitle();
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-level-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const chapterId = Number(button.dataset.chapterId);
        if (Number.isFinite(chapterId)) {
          this.options.onSelectChapter(chapterId);
        }
      });
    });
  }
}
