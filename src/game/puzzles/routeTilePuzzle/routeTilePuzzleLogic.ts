import { getPuzzleSuccessFeedback } from "../shared/feedback";
import type {
  RouteDirection,
  RouteRotation,
  RouteTilePuzzleCheckResult,
  RouteTilePuzzleProgress,
  RouteTilePuzzleSpec,
  RouteTilePuzzleState,
  RouteTileSpec
} from "./routeTilePuzzleTypes";

const DIRECTIONS: RouteDirection[] = ["north", "east", "south", "west"];

const DIRECTION_OFFSETS: Record<RouteDirection, { row: number; col: number }> = {
  north: { row: -1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: 1, col: 0 },
  west: { row: 0, col: -1 }
};

const OPPOSITE_DIRECTION: Record<RouteDirection, RouteDirection> = {
  north: "south",
  east: "west",
  south: "north",
  west: "east"
};

export function createInitialRouteTileState(spec: RouteTilePuzzleSpec): RouteTilePuzzleState {
  const tileRotations = Object.fromEntries(spec.tiles.map((tile) => [tile.id, tile.initialRotation])) as Record<
    string,
    RouteRotation
  >;

  return {
    tileRotations,
    connectedTileIds: getConnectedRouteTileIds(spec, tileRotations),
    solved: false,
    feedback: ""
  };
}

export function rotateTile(
  spec: RouteTilePuzzleSpec,
  state: RouteTilePuzzleState,
  tileId: string
): RouteTilePuzzleState {
  const tile = getRouteTile(spec, tileId);
  if (!tile || tile.locked) {
    return cloneState(state);
  }

  const tileRotations = {
    ...state.tileRotations,
    [tileId]: nextRotation(state.tileRotations[tileId] ?? tile.initialRotation)
  };

  return {
    ...cloneState(state),
    tileRotations,
    connectedTileIds: getConnectedRouteTileIds(spec, tileRotations),
    solved: false,
    feedback: ""
  };
}

export function resetRouteTilePuzzle(spec: RouteTilePuzzleSpec): RouteTilePuzzleState {
  return createInitialRouteTileState(spec);
}

export function getTileConnections(tile: RouteTileSpec, rotation: RouteRotation): RouteDirection[] {
  const rotationSteps = rotation / 90;

  return tile.baseConnections.map((direction) => rotateDirection(direction, rotationSteps));
}

export function isRouteConnected(spec: RouteTilePuzzleSpec, state: RouteTilePuzzleState): boolean {
  return getConnectedRouteTileIds(spec, state.tileRotations).includes(spec.targetTileId);
}

export function isRouteTilePuzzleSolved(spec: RouteTilePuzzleSpec, state: RouteTilePuzzleState): boolean {
  return state.solved && isRouteConnected(spec, state);
}

export function getRouteProgress(spec: RouteTilePuzzleSpec, state: RouteTilePuzzleState): RouteTilePuzzleProgress {
  return {
    connectedCount: state.connectedTileIds.length,
    totalCount: spec.tiles.length,
    routeConnected: isRouteConnected(spec, state)
  };
}

export function checkRouteTilePuzzleAnswer(
  spec: RouteTilePuzzleSpec,
  state: RouteTilePuzzleState
): RouteTilePuzzleCheckResult {
  const connectedTileIds = getConnectedRouteTileIds(spec, state.tileRotations);
  const routeConnected = connectedTileIds.includes(spec.targetTileId);

  if (!routeConnected) {
    const nextState = {
      ...cloneState(state),
      connectedTileIds,
      solved: false,
      feedback: spec.incompleteText
    };

    return {
      state: nextState,
      solved: false,
      feedback: spec.incompleteText,
      reason: "incomplete"
    };
  }

  const successFeedback = getPuzzleSuccessFeedback(spec);
  const nextState = {
    ...cloneState(state),
    connectedTileIds,
    solved: true,
    feedback: successFeedback
  };

  return {
    state: nextState,
    solved: true,
    feedback: successFeedback,
    reason: "correct"
  };
}

export function getConnectedRouteTileIds(
  spec: RouteTilePuzzleSpec,
  tileRotations: Record<string, RouteRotation>
): string[] {
  const startTile = getRouteTile(spec, spec.startTileId);
  if (!startTile) {
    return [];
  }

  const visited = new Set<string>();
  const queue = [startTile.id];

  while (queue.length > 0) {
    const tileId = queue.shift();
    if (!tileId || visited.has(tileId)) {
      continue;
    }

    const tile = getRouteTile(spec, tileId);
    if (!tile) {
      continue;
    }

    visited.add(tile.id);

    for (const direction of getTileConnections(tile, tileRotations[tile.id] ?? tile.initialRotation)) {
      const neighbor = getNeighborTile(spec, tile, direction);
      if (!neighbor || visited.has(neighbor.id)) {
        continue;
      }

      const neighborConnections = getTileConnections(neighbor, tileRotations[neighbor.id] ?? neighbor.initialRotation);
      if (neighborConnections.includes(OPPOSITE_DIRECTION[direction])) {
        queue.push(neighbor.id);
      }
    }
  }

  return spec.tiles.filter((tile) => visited.has(tile.id)).map((tile) => tile.id);
}

export function getRouteTile(spec: RouteTilePuzzleSpec, tileId: string): RouteTileSpec | undefined {
  return spec.tiles.find((tile) => tile.id === tileId);
}

function getNeighborTile(
  spec: RouteTilePuzzleSpec,
  tile: RouteTileSpec,
  direction: RouteDirection
): RouteTileSpec | undefined {
  const offset = DIRECTION_OFFSETS[direction];
  return spec.tiles.find((candidate) => candidate.row === tile.row + offset.row && candidate.col === tile.col + offset.col);
}

function rotateDirection(direction: RouteDirection, rotationSteps: number): RouteDirection {
  const index = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(index + rotationSteps) % DIRECTIONS.length];
}

function nextRotation(rotation: RouteRotation): RouteRotation {
  if (rotation === 0) {
    return 90;
  }

  if (rotation === 90) {
    return 180;
  }

  if (rotation === 180) {
    return 270;
  }

  return 0;
}

function cloneState(state: RouteTilePuzzleState): RouteTilePuzzleState {
  return {
    tileRotations: { ...state.tileRotations },
    connectedTileIds: [...state.connectedTileIds],
    solved: state.solved,
    feedback: state.feedback
  };
}
