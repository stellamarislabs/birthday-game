import { describe, expect, it } from "vitest";
import {
  LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC,
  getRouteTilePuzzleSpec
} from "../game/puzzles/routeTilePuzzle/routeTilePuzzleContent";
import {
  ROUTE_TILE_FINAL_ASSET_FILENAMES,
  getRouteTileFinalAsset
} from "../game/puzzles/routeTilePuzzle/routeTileFinalAssets";
import {
  checkRouteTilePuzzleAnswer,
  createInitialRouteTileState,
  getRouteProgress,
  getTileConnections,
  isRouteConnected,
  isRouteTilePuzzleSolved,
  resetRouteTilePuzzle,
  rotateTile
} from "../game/puzzles/routeTilePuzzle/routeTilePuzzleLogic";

function rotateToSolution() {
  let state = createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC);

  for (const tileId of ["golden-stamp", "keyhole", "hidden-wall", "vistula-route"]) {
    state = rotateTile(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, state, tileId);
  }

  return state;
}

describe("Chapter 2 Route Tile Puzzle logic", () => {
  it("starts disconnected and unsolved", () => {
    const state = createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC);

    expect(state.solved).toBe(false);
    expect(isRouteConnected(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, state)).toBe(false);
    expect(state.connectedTileIds).toContain("stamped-ticket");
    expect(state.connectedTileIds).not.toContain("wave-mark");
  });

  it("rotates a tappable tile by 90 degrees", () => {
    const initial = createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC);
    const rotated = rotateTile(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, initial, "golden-stamp");

    expect(initial.tileRotations["golden-stamp"]).toBe(90);
    expect(rotated.tileRotations["golden-stamp"]).toBe(180);
  });

  it("does not rotate locked start or target tiles", () => {
    const initial = createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC);
    const rotatedStart = rotateTile(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, initial, "stamped-ticket");
    const rotatedTarget = rotateTile(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, initial, "wave-mark");

    expect(rotatedStart.tileRotations["stamped-ticket"]).toBe(0);
    expect(rotatedTarget.tileRotations["wave-mark"]).toBe(0);
  });

  it("returns rotated tile connections", () => {
    const tile = LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC.tiles.find((candidate) => candidate.id === "golden-stamp");

    expect(tile).toBeDefined();
    expect(getTileConnections(tile!, 90)).toEqual(["south", "north"]);
    expect(getTileConnections(tile!, 180)).toEqual(["west", "east"]);
  });

  it("does not solve a disconnected route", () => {
    const result = checkRouteTilePuzzleAnswer(
      LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC,
      createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC)
    );

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The route has not reached the wall yet.");
  });

  it("solves when the route connects from stamped ticket to wave mark", () => {
    const solvedState = rotateToSolution();
    const progress = getRouteProgress(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, solvedState);
    const result = checkRouteTilePuzzleAnswer(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, solvedState);

    expect(progress.routeConnected).toBe(true);
    expect(solvedState.connectedTileIds).toEqual([
      "stamped-ticket",
      "golden-stamp",
      "keyhole",
      "wave-mark",
      "vistula-route",
      "hidden-wall"
    ]);
    expect(result.solved).toBe(true);
    expect(result.reason).toBe("correct");
    expect(result.feedback).toContain("The wall remembers the river.");
    expect(result.feedback).toContain("A wave mark points to the Vistula.");
    expect(isRouteTilePuzzleSolved(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, result.state)).toBe(true);
  });

  it("reset restores the initial disconnected rotations", () => {
    const solvedState = rotateToSolution();
    const reset = resetRouteTilePuzzle(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC);

    expect(isRouteConnected(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, solvedState)).toBe(true);
    expect(reset.tileRotations).toEqual(createInitialRouteTileState(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC).tileRotations);
    expect(isRouteConnected(LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC, reset)).toBe(false);
  });
});

describe("Level 3 Route Tile Puzzle content", () => {
  it("uses route tile copy for active Chapter 2", () => {
    const spec = getRouteTilePuzzleSpec(3);

    expect(spec?.title).toBe("Route Tile Puzzle: The Hidden Wall");
    expect(spec?.instruction).toBe("Turn the tiles until the stamped route reaches the wall.");
    expect(spec?.successText).toBe("The wall remembers the river.");
    expect(spec?.successFollowUp).toBe("A wave mark points to the Vistula.");
    expect(spec?.tiles).toHaveLength(6);
  });

  it("detects the optional final art assets while preserving fallback-safe filenames", () => {
    expect(ROUTE_TILE_FINAL_ASSET_FILENAMES).toEqual({
      background: "puzzle02-hidden-wall-bg.webp",
      tileShell: "puzzle02-route-tile-shell.webp",
      hiddenWallMarker: "puzzle02-hidden-wall-marker.webp",
      keyholeMarker: "puzzle02-keyhole-marker.webp"
    });

    for (const key of ["background", "tileShell", "hiddenWallMarker", "keyholeMarker"] as const) {
      const asset = getRouteTileFinalAsset(key);

      expect(asset.filename).toBe(ROUTE_TILE_FINAL_ASSET_FILENAMES[key]);
      expect(asset.imageUrl).toContain(ROUTE_TILE_FINAL_ASSET_FILENAMES[key]);
    }
  });

  it("keeps route tile ids and marker roles stable for future decorative art layers", () => {
    const tileMarkers = LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC.tiles.map((tile) => [tile.id, tile.marker ?? "route"]);

    expect(tileMarkers).toEqual([
      ["stamped-ticket", "start"],
      ["golden-stamp", "stamp"],
      ["keyhole", "keyhole"],
      ["wave-mark", "target"],
      ["vistula-route", "route"],
      ["hidden-wall", "wall"]
    ]);
  });
});
