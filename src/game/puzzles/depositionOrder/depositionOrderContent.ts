import type { DepositionOrderSpec } from "./depositionOrderTypes";

export const LEVEL_FOUR_DEPOSITION_ORDER_SPEC: DepositionOrderSpec = {
  levelId: 4,
  title: "Deposition Order: The Witness Note",
  subtitle: "Rebuild the witness statement.",
  instruction: "Arrange the note strips so the witness statement makes sense.",
  exhibitName: "The Witness Note",
  strips: [
    {
      id: "not-force",
      shortLabel: "Not force",
      text: "The heart was not taken by force."
    },
    {
      id: "left-willingly",
      shortLabel: "Left willingly",
      text: "It was left willingly."
    },
    {
      id: "false-accusation",
      shortLabel: "False accusation",
      text: "The loudest accusation is false."
    },
    {
      id: "archive-margin",
      shortLabel: "Archive File",
      text: "Check the archive file."
    }
  ],
  slots: [
    { id: "line-1", label: "Line 1" },
    { id: "line-2", label: "Line 2" },
    { id: "line-3", label: "Line 3" },
    { id: "line-4", label: "Line 4" }
  ],
  correctOrder: ["not-force", "left-willingly", "false-accusation", "archive-margin"],
  archiveCodeLabel: "Archive code",
  archiveCode: "16/05-FILE",
  successText: "The witness statement is restored.",
  successFollowUp: "An archive code appears at the bottom of the note.",
  incompleteText: "The statement does not read clearly yet.",
  wrongText: "The statement does not read clearly yet.",
  estimatedSeconds: 40
};

export const depositionOrderSpecs = [
  LEVEL_FOUR_DEPOSITION_ORDER_SPEC
] as const satisfies readonly DepositionOrderSpec[];

export function getDepositionOrderSpec(levelId: number): DepositionOrderSpec | undefined {
  return depositionOrderSpecs.find((spec) => spec.levelId === levelId);
}
