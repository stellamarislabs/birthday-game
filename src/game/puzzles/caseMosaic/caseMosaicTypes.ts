export type MosaicVisualKind =
  | "envelope-top-left"
  | "envelope-top-flap"
  | "envelope-top-right"
  | "envelope-bottom-left"
  | "envelope-seal"
  | "envelope-bottom-right";

export interface MosaicPiece {
  id: string;
  label: string;
  correctRow: number;
  correctCol: number;
  visualKind: MosaicVisualKind;
  description?: string;
}

export interface CaseMosaicSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  keyLabel: string;
  ticketLabel: string;
  routeLabel: string;
  rows: number;
  columns: number;
  boardWidth: number;
  boardHeight: number;
  pieces: MosaicPiece[];
  initialTrayOrder: string[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export type PlacedPiecesBySlot = Record<string, string>;

export interface CaseMosaicState {
  selectedPieceId: string | null;
  trayPieceIds: string[];
  placedPiecesBySlot: PlacedPiecesBySlot;
  envelopeOpened: boolean;
  contentsRevealed: boolean;
  ticketInspected: boolean;
  routeGlowing: boolean;
  solved: boolean;
  feedback: string;
}

export interface CaseMosaicProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
  stepCount: number;
  totalSteps: number;
  currentStep: "sealed" | "opened" | "route-glowing";
}

export interface CaseMosaicCheckResult {
  state: CaseMosaicState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}

export interface MosaicSlotAddress {
  row: number;
  col: number;
}
