import type { CaseTimelineSpec } from "./caseTimelineTypes";

export const LEVEL_TWO_CASE_TIMELINE_SPEC: CaseTimelineSpec = {
  levelId: 2,
  title: "Case Timeline: The Golden Stamp",
  subtitle: "Stamp the route.",
  instruction: "Put the tram route in order so the validator can stamp the ticket.",
  exhibitName: "The Golden Stamp",
  slots: [
    { id: "start", label: "Start", orderIndex: 0 },
    { id: "review", label: "Review", orderIndex: 1 },
    { id: "prepare", label: "Prepare", orderIndex: 2 },
    { id: "submit", label: "Submit", orderIndex: 3 }
  ],
  tasks: [
    {
      id: "read-case",
      label: "Read the Case",
      description: "Start with the route inside the envelope.",
      visualKind: "case-file"
    },
    {
      id: "check-evidence",
      label: "Check the Evidence",
      description: "Check each stop before the city moves on.",
      visualKind: "evidence"
    },
    {
      id: "prepare-note",
      label: "Prepare the Note",
      description: "Prepare the ticket for the validator.",
      visualKind: "note"
    },
    {
      id: "submit-deadline",
      label: "Submit Before Deadline",
      description: "Let the golden stamp reveal the path.",
      visualKind: "stamp"
    }
  ],
  correctSequence: ["read-case", "check-evidence", "prepare-note", "submit-deadline"],
  initialTrayOrder: ["prepare-note", "read-case", "submit-deadline", "check-evidence"],
  successText: "The route is sealed.",
  successFollowUp: "A hidden wall appears on the stamped route.",
  incompleteText: "The ticket is not ready to reveal the path yet.",
  wrongText: "The ticket is not ready to reveal the path yet.",
  revealText: "Maria carries responsibility with grace.",
  optionalFollowUp: "Even when the city moves fast, she knows what matters first.",
  estimatedSeconds: 35
};

export const caseTimelineSpecs = [LEVEL_TWO_CASE_TIMELINE_SPEC] as const satisfies readonly CaseTimelineSpec[];

export function getCaseTimelineSpec(levelId: number): CaseTimelineSpec | undefined {
  return caseTimelineSpecs.find((spec) => spec.levelId === levelId);
}
