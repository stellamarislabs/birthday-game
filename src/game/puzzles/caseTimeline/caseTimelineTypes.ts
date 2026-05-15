export interface CaseTimelineSpec {
  levelId: number;
  title: string;
  subtitle: string;
  instruction: string;
  exhibitName: string;
  slots: TimelineSlot[];
  tasks: TimelineTask[];
  correctSequence: string[];
  initialTrayOrder: string[];
  successText: string;
  successFollowUp?: string;
  incompleteText: string;
  wrongText: string;
  revealText: string;
  optionalFollowUp?: string;
  estimatedSeconds: number;
}

export interface TimelineSlot {
  id: string;
  label: string;
  orderIndex: number;
}

export interface TimelineTask {
  id: string;
  label: string;
  description: string;
  visualKind?: "case-file" | "evidence" | "note" | "stamp";
}

export interface CaseTimelineState {
  selectedTaskId: string | null;
  trayTaskIds: string[];
  placedTasksBySlotId: Record<string, string>;
  solved: boolean;
  feedback: string;
}

export interface CaseTimelineProgress {
  placedCount: number;
  correctCount: number;
  totalCount: number;
}

export interface CaseTimelineCheckResult {
  state: CaseTimelineState;
  solved: boolean;
  feedback: string;
  reason: "incomplete" | "wrong" | "correct";
}
