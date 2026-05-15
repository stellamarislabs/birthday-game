export type CaseBoardSlotType = "start" | "evidence" | "meaning" | "truth" | "flexible";

export type CaseTileType = "start" | "evidence" | "meaning" | "truth" | "decoy";

export interface BoardSlot {
  id: string;
  label: string;
  slotType: CaseBoardSlotType;
  x: number;
  y: number;
  acceptsTileTypes: CaseTileType[];
  lockedTileId?: string;
}

export interface CaseTile {
  id: string;
  label: string;
  tileType: CaseTileType;
  description?: string;
}

export interface ValidConnection {
  fromTileId: string;
  toTileId: string;
}

export interface CaseBoardSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  boardSlots: BoardSlot[];
  availableTiles: CaseTile[];
  validConnections: ValidConnection[];
  requiredPath: string[];
  successText: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export type PlacedTilesBySlotId = Record<string, string>;

export interface CaseBoardState {
  placedTilesBySlotId: PlacedTilesBySlotId;
  selectedTileId: string | null;
  solved: boolean;
  feedback: string;
  activeConnections: ValidConnection[];
}

export interface CaseBoardCheckResult {
  state: CaseBoardState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
