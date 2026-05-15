export type RouteDirection = "north" | "east" | "south" | "west";

export type RouteRotation = 0 | 90 | 180 | 270;

export interface RouteTileSpec {
  id: string;
  label: string;
  row: number;
  col: number;
  baseConnections: RouteDirection[];
  initialRotation: RouteRotation;
  locked?: boolean;
  marker?: "start" | "stamp" | "keyhole" | "wall" | "route" | "target";
}

export interface RouteTilePuzzleSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  startLabel: string;
  targetLabel: string;
  rows: number;
  columns: number;
  tiles: RouteTileSpec[];
  startTileId: string;
  targetTileId: string;
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface RouteTilePuzzleState {
  tileRotations: Record<string, RouteRotation>;
  connectedTileIds: string[];
  solved: boolean;
  feedback: string;
}

export interface RouteTilePuzzleProgress {
  connectedCount: number;
  totalCount: number;
  routeConnected: boolean;
}

export interface RouteTilePuzzleCheckResult {
  state: RouteTilePuzzleState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "correct";
}
