export interface ArgumentTowerSlot {
  id: string;
  label: string;
  correctBlockId: string;
}

export interface ArgumentBlock {
  id: string;
  label: string;
  description: string;
  isDecoy?: boolean;
}

export interface ArgumentTowerSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  slots: ArgumentTowerSlot[];
  blocks: ArgumentBlock[];
  initialTrayOrder: string[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface ArgumentTowerState {
  selectedBlockId: string | null;
  trayBlockIds: string[];
  placedBlocksBySlotId: Record<string, string>;
  solved: boolean;
  feedback: string;
}

export interface ArgumentTowerProgress {
  placedCount: number;
  stableCount: number;
  totalCount: number;
}

export interface ArgumentTowerCheckResult {
  state: ArgumentTowerState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
