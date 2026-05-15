import { escapeHtml } from "../caseMosaic/caseMosaicRenderer";
import {
  checkTrustLightPathAnswer,
  createInitialTrustLightPathState,
  getMirrorConnections,
  getTrustLightPathProgress,
  resetTrustLightPath,
  rotateMirror,
  selectQuestion
} from "./trustLightPathLogic";
import { getTrustLightPathFinalAsset } from "./trustLightPathFinalAssets";
import type { TrustLightPathSpec, TrustLightPathState, TrustMirrorSpec } from "./trustLightPathTypes";

interface TrustLightPathPuzzleOptions {
  spec: TrustLightPathSpec;
  onSolved: () => void;
}

export class TrustLightPathPuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: TrustLightPathSpec;
  private state: TrustLightPathState;

  constructor(options: TrustLightPathPuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialTrustLightPathState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "trust-light-path-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const progress = getTrustLightPathProgress(this.spec, this.state);
    const backgroundAsset = getTrustLightPathFinalAsset("background");
    const backgroundStyle = backgroundAsset.imageUrl
      ? ` style="--trust-light-bg-image: url('${escapeHtml(backgroundAsset.imageUrl)}');"`
      : "";
    const boardAsset = getTrustLightPathFinalAsset("trustBoard");
    const boardImage = boardAsset.imageUrl
      ? `<img class="trust-light-board-image" src="${escapeHtml(boardAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    this.root.innerHTML = `
      <section class="puzzle-panel trust-light-path-panel${backgroundAsset.imageUrl ? " has-final-background" : ""}"${backgroundStyle}>
        <div class="trust-light-heading">
          <p class="puzzle-kicker">Door of Trust</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="trust-light-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="trust-light-play-area ${progress.payoffVisible ? "is-ready" : ""}">
          <section class="trust-question-card" aria-label="Trust question">
            <h2>${escapeHtml(this.spec.prompt)}</h2>
            <div class="trust-question-list">
              ${this.spec.questions.map((question) => this.renderQuestion(question.id, question.text, question.description)).join("")}
            </div>
          </section>

          <section class="trust-light-board ${progress.questionCorrect ? "is-lit" : ""} ${
            progress.payoffVisible ? "is-connected" : ""
          } ${boardAsset.imageUrl ? "has-final-board" : ""}" aria-label="Lantern light path">
            ${boardImage}
            <div class="trust-light-grid" style="--trust-rows: ${this.spec.rows}; --trust-columns: ${this.spec.columns};">
              ${this.renderEndpoint("source", this.spec.source.label, this.spec.source.row, this.spec.source.col)}
              ${this.spec.mirrors.map((mirror) => this.renderMirror(mirror)).join("")}
              ${this.renderEndpoint("target", this.spec.target.label, this.spec.target.row, this.spec.target.col)}
            </div>
            <p class="trust-relay-label">${escapeHtml(this.spec.relayLabel)}</p>
          </section>

          <aside class="trust-payoff-card ${progress.payoffVisible ? "is-visible" : ""}" data-testid="trust-light-payoff">
            <span>Trust Door</span>
            <strong>${progress.payoffVisible ? escapeHtml(this.spec.successText) : "Waiting for light"}</strong>
            <p>${progress.payoffVisible ? escapeHtml(this.spec.successFollowUp) : "The blue-ribbon pages are still dark."}</p>
          </aside>
        </div>

        <div class="trust-light-progress" data-testid="trust-light-path-progress" aria-live="polite">
          <p>${progress.questionCorrect ? "Question chosen." : "Choose the question that opens Trust."}</p>
          <p>${
            progress.payoffVisible
              ? "Light reaches Trust."
              : progress.connected
                ? "Path aligned; the lantern is waiting."
                : `Mirrors lit: ${progress.litMirrorCount} / ${progress.totalMirrorCount}`
          }</p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-trust-light-path">Reset Light</button>
          <button type="button" class="primary-button" data-testid="submit-trust-light-path">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="trust-light-path-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderQuestion(questionId: string, text: string, description: string): string {
    const selected = this.state.selectedQuestionId === questionId;
    const correct = questionId === this.spec.correctQuestionId;

    return `
      <button
        type="button"
        class="trust-question-tile ${selected ? "is-selected" : ""} ${selected && correct ? "is-correct" : ""}"
        data-question-id="${escapeHtml(questionId)}"
        data-testid="trust-question-${escapeHtml(questionId)}"
        aria-pressed="${selected}"
      >
        <strong>${escapeHtml(text)}</strong>
        <span>${escapeHtml(description)}</span>
      </button>
    `;
  }

  private renderEndpoint(kind: "source" | "target", label: string, row: number, col: number): string {
    const asset = getTrustLightPathFinalAsset(kind === "source" ? "lanternSource" : "trustDoorTarget");
    const image = asset.imageUrl
      ? `<img class="trust-light-endpoint-image trust-light-endpoint-image--${kind}" src="${escapeHtml(asset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    return `
      <div
        class="trust-light-endpoint trust-light-endpoint--${kind}${asset.imageUrl ? " has-final-image" : ""}"
        data-testid="trust-light-${kind}"
        style="grid-row: ${row + 1}; grid-column: ${col + 1};"
      >
        ${image}
        <span aria-hidden="true"></span>
        <strong>${escapeHtml(label)}</strong>
      </div>
    `;
  }

  private renderMirror(mirror: TrustMirrorSpec): string {
    const rotation = this.state.mirrorRotations[mirror.id] ?? mirror.initialRotation;
    const lit = this.state.litMirrorIds.includes(mirror.id);
    const connections = getMirrorConnections(mirror, rotation).join("-");

    return `
      <button
        type="button"
        class="trust-mirror trust-mirror--${mirror.kind} ${lit ? "is-lit" : ""}"
        data-mirror-id="${escapeHtml(mirror.id)}"
        data-testid="trust-mirror-${escapeHtml(mirror.id)}"
        style="grid-row: ${mirror.row + 1}; grid-column: ${mirror.col + 1}; --mirror-turn: ${rotation}deg;"
        aria-label="${escapeHtml(mirror.label)} mirror, connections ${escapeHtml(connections)}"
      >
        <span class="trust-mirror-glyph" aria-hidden="true"></span>
        <strong>${escapeHtml(mirror.label)}</strong>
      </button>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-question-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const questionId = button.dataset.questionId;
        if (!questionId) {
          return;
        }

        this.state = selectQuestion(this.spec, this.state, questionId);
        this.render(onSolved);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-mirror-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const mirrorId = button.dataset.mirrorId;
        if (!mirrorId) {
          return;
        }

        this.state = rotateMirror(this.spec, this.state, mirrorId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-trust-light-path"]')?.addEventListener("click", () => {
      this.state = resetTrustLightPath(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-trust-light-path"]')?.addEventListener("click", () => {
      const result = checkTrustLightPathAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }
}
