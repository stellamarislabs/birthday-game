export type ReconstructionPieceId = "roof" | "window" | "lantern" | "door" | "brick-path" | "case-seal";

export type ReconstructionSlotId =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right";

export interface ReconstructionPiece {
  id: ReconstructionPieceId;
  label: string;
}

export interface ReconstructionSlot {
  id: ReconstructionSlotId;
  label: string;
}

export type ReconstructionPlacement = Record<ReconstructionSlotId, ReconstructionPieceId | null>;

export interface ReconstructionState {
  pieces: ReconstructionPiece[];
  slots: ReconstructionSlot[];
  placement: ReconstructionPlacement;
  selectedPieceId: ReconstructionPieceId | null;
  solved: boolean;
  attempts: number;
}

export interface ReconstructionResult {
  solved: boolean;
  feedback: string;
}
