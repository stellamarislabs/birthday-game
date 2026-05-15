import type { RouteTilePuzzleSpec } from "./routeTilePuzzleTypes";

export const LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC: RouteTilePuzzleSpec = {
  levelId: 3,
  title: "Route Tile Puzzle: The Hidden Wall",
  subtitle: "Connect the route to the river mark.",
  instruction: "Turn the tiles until the stamped route reaches the wall.",
  exhibitName: "The Red Brick",
  startLabel: "Stamped Ticket",
  targetLabel: "Wave Mark",
  rows: 2,
  columns: 3,
  startTileId: "stamped-ticket",
  targetTileId: "wave-mark",
  tiles: [
    {
      id: "stamped-ticket",
      label: "Stamped Ticket",
      row: 0,
      col: 0,
      baseConnections: ["east"],
      initialRotation: 0,
      locked: true,
      marker: "start"
    },
    {
      id: "golden-stamp",
      label: "Golden Stamp",
      row: 0,
      col: 1,
      baseConnections: ["east", "west"],
      initialRotation: 90,
      marker: "stamp"
    },
    {
      id: "keyhole",
      label: "Keyhole",
      row: 0,
      col: 2,
      baseConnections: ["south", "west"],
      initialRotation: 270,
      marker: "keyhole"
    },
    {
      id: "wave-mark",
      label: "Wave Mark",
      row: 1,
      col: 0,
      baseConnections: ["east"],
      initialRotation: 0,
      locked: true,
      marker: "target"
    },
    {
      id: "vistula-route",
      label: "Vistula Route",
      row: 1,
      col: 1,
      baseConnections: ["east", "west"],
      initialRotation: 90,
      marker: "route"
    },
    {
      id: "hidden-wall",
      label: "Hidden Wall",
      row: 1,
      col: 2,
      baseConnections: ["north", "west"],
      initialRotation: 270,
      marker: "wall"
    }
  ],
  successText: "The wall remembers the river.",
  successFollowUp: "A wave mark points to the Vistula.",
  incompleteText: "The route has not reached the wall yet.",
  wrongText: "The route has not reached the wall yet.",
  revealText: "Responsibility and patience reveal the path.",
  optionalFollowUp: "The stamp, keyhole, and wall now draw one quiet line toward the river.",
  estimatedSeconds: 45
};

export const routeTilePuzzleSpecs = [LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC] as const satisfies readonly RouteTilePuzzleSpec[];

export function getRouteTilePuzzleSpec(levelId: number): RouteTilePuzzleSpec | undefined {
  return routeTilePuzzleSpecs.find((spec) => spec.levelId === levelId);
}
