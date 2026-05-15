import { escapeHtml } from "../caseMosaic/caseMosaicRenderer";
import { getRouteTileFinalAsset } from "./routeTileFinalAssets";
import {
  checkRouteTilePuzzleAnswer,
  createInitialRouteTileState,
  getRouteProgress,
  getTileConnections,
  resetRouteTilePuzzle,
  rotateTile
} from "./routeTilePuzzleLogic";
import type { RouteDirection, RouteTilePuzzleSpec, RouteTilePuzzleState, RouteTileSpec } from "./routeTilePuzzleTypes";

interface RouteTilePuzzleOptions {
  spec: RouteTilePuzzleSpec;
  onSolved: () => void;
}

const END_POINTS: Record<RouteDirection, { x: number; y: number }> = {
  north: { x: 50, y: 0 },
  east: { x: 100, y: 50 },
  south: { x: 50, y: 100 },
  west: { x: 0, y: 50 }
};

export class RouteTilePuzzle {
  private readonly root: HTMLDivElement;
  private readonly spec: RouteTilePuzzleSpec;
  private state: RouteTilePuzzleState;

  constructor(options: RouteTilePuzzleOptions) {
    this.spec = options.spec;
    this.state = createInitialRouteTileState(options.spec);
    this.root = document.createElement("div");
    this.root.className = "puzzle-overlay";
    this.root.dataset.testid = "route-tile-puzzle";
    this.root.setAttribute("aria-label", this.spec.title);

    document.getElementById("game-shell")?.appendChild(this.root);
    this.render(options.onSolved);
  }

  destroy(): void {
    this.root.remove();
  }

  private render(onSolved: () => void): void {
    const progress = getRouteProgress(this.spec, this.state);
    const backgroundAsset = getRouteTileFinalAsset("background");
    const backgroundStyle = backgroundAsset.imageUrl
      ? ` style="--route-tile-bg-image: url('${escapeHtml(backgroundAsset.imageUrl)}');"`
      : "";

    this.root.innerHTML = `
      <section class="puzzle-panel route-tile-panel${backgroundAsset.imageUrl ? " has-final-background" : ""}"${backgroundStyle}>
        <div class="case-mosaic-heading route-tile-heading">
          <p class="puzzle-kicker">Route Tile Puzzle</p>
          <h1>${escapeHtml(this.spec.title)}</h1>
          <p class="case-mosaic-subtitle">${escapeHtml(this.spec.subtitle)}</p>
          <p class="puzzle-instruction">${escapeHtml(this.spec.instruction)}</p>
        </div>

        <div class="route-tile-body">
          <div class="route-tile-story">
            <span>${escapeHtml(this.spec.startLabel)}</span>
            <span>Golden Stamp</span>
            <span>Keyhole</span>
            <span>Hidden Wall</span>
            <span>${escapeHtml(this.spec.targetLabel)}</span>
          </div>

          <div
            class="route-tile-board ${progress.routeConnected ? "is-connected" : ""}"
            data-testid="route-tile-board"
            style="--route-columns: ${this.spec.columns}; --route-rows: ${this.spec.rows};"
          >
            ${this.spec.tiles.map((tile) => this.renderTile(tile)).join("")}
          </div>

          <div class="route-tile-payoff ${progress.routeConnected ? "is-visible" : ""}" data-testid="route-tile-wave-reveal" aria-live="polite">
            <span class="route-tile-keyhole-light">Keyhole lit</span>
            <strong>Vistula wave mark revealed</strong>
          </div>
        </div>

        <div class="case-mosaic-progress route-tile-progress" data-testid="route-tile-progress" aria-live="polite">
          <p>Route: <strong>${progress.connectedCount} / ${progress.totalCount}</strong></p>
          <p>${progress.routeConnected ? "The route reaches the wall." : "The stamped path is still broken."}</p>
        </div>

        <div class="puzzle-actions">
          <button type="button" class="secondary-button" data-testid="reset-route-tile-puzzle">Reset Route</button>
          <button type="button" class="primary-button" data-testid="submit-route-tile-puzzle">File Clue</button>
        </div>
        <p class="puzzle-feedback" data-testid="route-tile-feedback" aria-live="polite">${escapeHtml(this.state.feedback)}</p>
      </section>
    `;

    this.bindButtons(onSolved);
  }

  private renderTile(tile: RouteTileSpec): string {
    const rotation = this.state.tileRotations[tile.id] ?? tile.initialRotation;
    const connections = getTileConnections(tile, rotation);
    const connected = this.state.connectedTileIds.includes(tile.id);
    const locked = Boolean(tile.locked);
    const marker = tile.marker ?? "route";
    const shellAsset = getRouteTileFinalAsset("tileShell");
    const markerAsset =
      marker === "wall"
        ? getRouteTileFinalAsset("hiddenWallMarker")
        : marker === "keyhole"
          ? getRouteTileFinalAsset("keyholeMarker")
          : undefined;
    const shellImage = shellAsset.imageUrl
      ? `<img class="route-tile-shell-image" src="${escapeHtml(shellAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";
    const markerImage = markerAsset?.imageUrl
      ? `<img class="route-tile-marker-image" src="${escapeHtml(markerAsset.imageUrl)}" alt="" aria-hidden="true" draggable="false" />`
      : "";

    return `
      <button
        type="button"
        class="route-tile ${connected ? "is-connected" : ""} ${locked ? "is-locked" : ""}"
        data-testid="route-tile-${escapeHtml(tile.id)}"
        data-tile-id="${escapeHtml(tile.id)}"
        data-marker="${escapeHtml(marker)}"
        aria-label="${escapeHtml(tile.label)}${locked ? " locked" : ", tap to rotate"}"
        style="grid-column: ${tile.col + 1}; grid-row: ${tile.row + 1};"
        ${locked ? "disabled" : ""}
      >
        <span class="route-tile-art${shellAsset.imageUrl ? " has-final-shell" : ""}${markerAsset?.imageUrl ? " has-final-marker" : ""}" aria-hidden="true">
          ${shellImage}
          ${markerImage}
          ${this.renderTileLines(connections)}
        </span>
        <span class="route-tile-label">${escapeHtml(tile.label)}</span>
      </button>
    `;
  }

  private renderTileLines(connections: RouteDirection[]): string {
    const lines = connections
      .map((direction) => {
        const point = END_POINTS[direction];
        return `<line x1="50" y1="50" x2="${point.x}" y2="${point.y}" />`;
      })
      .join("");

    return `
      <svg viewBox="0 0 100 100" focusable="false">
        ${lines}
        <circle cx="50" cy="50" r="9" />
      </svg>
    `;
  }

  private bindButtons(onSolved: () => void): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-tile-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const tileId = button.dataset.tileId;
        if (!tileId) {
          return;
        }

        this.state = rotateTile(this.spec, this.state, tileId);
        this.render(onSolved);
      });
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="reset-route-tile-puzzle"]')?.addEventListener("click", () => {
      this.state = resetRouteTilePuzzle(this.spec);
      this.render(onSolved);
    });

    this.root.querySelector<HTMLButtonElement>('[data-testid="submit-route-tile-puzzle"]')?.addEventListener("click", () => {
      const result = checkRouteTilePuzzleAnswer(this.spec, this.state);
      this.state = result.state;
      this.render(onSolved);

      if (result.solved) {
        onSolved();
      }
    });
  }
}
