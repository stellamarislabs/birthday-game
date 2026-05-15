import type { WitnessLensSpec } from "./witnessLensTypes";

export const LEVEL_FOUR_WITNESS_LENS_SPEC: WitnessLensSpec = {
  levelId: 4,
  title: "Witness Lens: The Witness Note",
  subtitle: "Find the line that breaks the evidence.",
  instruction: "Inspect the witness note and mark the statement that breaks the evidence.",
  exhibitName: "The Witness Note",
  evidenceNote: "The witness note says the heart was not taken by force. It was left willingly.",
  statements: [
    {
      id: "taken-by-force",
      label: "A",
      text: "The heart was taken by force.",
      hint: "Contradicts the note."
    },
    {
      id: "left-willingly",
      label: "B",
      text: "The heart was left willingly.",
      hint: "Matches the note."
    },
    {
      id: "never-real",
      label: "C",
      text: "The heart was never real.",
      hint: "Unsupported by the note."
    }
  ],
  correctStatementId: "taken-by-force",
  lensLabel: "Evidence Lens",
  stampLabel: "Contradiction",
  successText: "The contradiction is found.",
  successFollowUp: "An archive code appears in the corner of the note.",
  incompleteText: "The marked statement does not break the evidence.",
  wrongText: "The marked statement does not break the evidence.",
  revealText: "Maria hears the quiet version of truth.",
  optionalFollowUp: "She does not need the loudest voice. She follows the clearest evidence.",
  estimatedSeconds: 35
};

export const witnessLensSpecs = [LEVEL_FOUR_WITNESS_LENS_SPEC] as const satisfies readonly WitnessLensSpec[];

export function getWitnessLensSpec(levelId: number): WitnessLensSpec | undefined {
  return witnessLensSpecs.find((spec) => spec.levelId === levelId);
}
