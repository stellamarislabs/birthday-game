import {
  PATTERN_REPEAT_COPY,
  createPatternRepeatState,
  getPatternRepeatLanternLabel,
  inputPatternRepeatLantern,
  resetPatternRepeatAttempt,
  showPatternRepeatSequence
} from "./patternRepeatLogic";
import type { PatternRepeatLanternId, PatternRepeatState } from "./patternRepeatTypes";

interface PatternRepeatPuzzleOptions {
  onSolved: () => void;
}

export class PatternRepeatPuzzle {
  private readonly root: HTMLDivElement;
  private state: PatternRepeatState = createPatternRepeatState();
  private hasNotifiedSolved = false;

  constructor(options: PatternRepeatPuzzleOptions) {
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "pattern-repeat-puzzle";
    this.root.setAttribute("aria-label", PATTERN_REPEAT_COPY.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const progressText = `${this.state.inputSequence.length} / ${this.state.targetSequence.length}`;
    const patternText = this.state.targetSequence.map((lanternId) => getPatternRepeatLanternLabel(this.state, lanternId)).join(" -> ");

    this.root.innerHTML = `
      <section class="puzzle-panel pattern-repeat-panel">
        <p class="puzzle-kicker">${PATTERN_REPEAT_COPY.kicker}</p>
        <h1>${PATTERN_REPEAT_COPY.title}</h1>
        <p class="puzzle-instruction">${PATTERN_REPEAT_COPY.instruction}</p>
        <div class="pattern-repeat-status">
          <p data-testid="pattern-repeat-progress">Progress: ${progressText}</p>
          <p data-testid="pattern-repeat-sequence" aria-live="polite">
            ${this.state.sequenceVisible ? `Pattern: ${patternText}` : "Pattern: press Show Pattern when you are ready."}
          </p>
        </div>
        <div class="pattern-lantern-grid" data-testid="pattern-lantern-grid">
          ${this.state.lanterns.map((lantern) => this.renderLantern(lantern.id, lantern.label)).join("")}
        </div>
        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="show-pattern-repeat">${PATTERN_REPEAT_COPY.showPattern}</button>
          <button type="button" class="secondary-button" data-testid="reset-pattern-repeat">${PATTERN_REPEAT_COPY.resetAttempt}</button>
        </div>
        <p class="puzzle-feedback" data-testid="pattern-repeat-feedback" aria-live="polite">${this.state.feedback}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderLantern(id: PatternRepeatLanternId, label: string): string {
    const isNextExpected = this.state.sequenceVisible && this.state.targetSequence[this.state.inputSequence.length] === id && !this.state.solved;

    return `
      <button
        type="button"
        class="pattern-lantern${isNextExpected ? " is-next" : ""}${this.state.solved ? " is-solved" : ""}"
        data-lantern-id="${id}"
        data-testid="pattern-lantern-${id}"
        aria-label="${label}"
      >
        <span>${label}</span>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelector<HTMLButtonElement>('[data-testid="show-pattern-repeat"]')?.addEventListener("click", () => {
      this.state = showPatternRepeatSequence(this.state);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-pattern-repeat"]')?.addEventListener("click", () => {
      this.state = resetPatternRepeatAttempt(this.state);
      this.hasNotifiedSolved = false;
      this.render(onSolved);
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-lantern-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const lanternId = button.dataset.lanternId as PatternRepeatLanternId | undefined;
        if (!lanternId || this.hasNotifiedSolved) {
          return;
        }

        this.state = inputPatternRepeatLantern(this.state, lanternId);
        this.render(onSolved);

        if (this.state.solved && !this.hasNotifiedSolved) {
          this.hasNotifiedSolved = true;
          onSolved();
        }
      });
    });
  }

}
