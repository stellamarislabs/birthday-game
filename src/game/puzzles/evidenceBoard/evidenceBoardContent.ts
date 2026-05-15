import type { EvidenceBoardSpec } from "./evidenceBoardTypes";

export const LEVEL_ONE_EVIDENCE_BOARD_SPEC: EvidenceBoardSpec = {
  levelId: 1,
  title: "Evidence Board: The Sealed Envelope",
  exhibitName: "The Sealed Envelope",
  instruction: "Connect the first clue to what it quietly proves.",
  evidenceCards: [
    {
      id: "sealed-envelope",
      label: "The Sealed Envelope",
      description: "The first clue in the case file."
    }
  ],
  meaningCards: [
    {
      id: "attention",
      label: "Attention",
      description: "Noticing what others miss."
    },
    {
      id: "speed",
      label: "Speed",
      description: "Moving before understanding."
    },
    {
      id: "noise",
      label: "Noise",
      description: "What distracts from the truth."
    }
  ],
  correctLinks: [{ evidenceId: "sealed-envelope", meaningId: "attention" }],
  allowDuplicateMeanings: false,
  successText: "The first link is clear.",
  incompleteText: "Select the clue, then choose what it proves.",
  wrongText: "That meaning does not fit the first clue. Look at what the envelope asks Maria to do.",
  revealText: "Maria notices what others miss.",
  optionalFollowUp: "The first envelope is not just a clue. It is proof that every true case begins with attention.",
  estimatedSeconds: 15
};

export const evidenceBoardSpecs = [LEVEL_ONE_EVIDENCE_BOARD_SPEC] as const satisfies readonly EvidenceBoardSpec[];

export function getEvidenceBoardSpec(levelId: number): EvidenceBoardSpec | undefined {
  return evidenceBoardSpecs.find((spec) => spec.levelId === levelId);
}
