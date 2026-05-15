import type { CaseMosaicSpec } from "./caseMosaicTypes";

export const LEVEL_ONE_CASE_MOSAIC_SPEC: CaseMosaicSpec = {
  levelId: 1,
  title: "Case Mosaic: The Sealed Envelope",
  subtitle: "Rebuild the envelope.",
  instruction: "Rebuild the envelope to reveal the first route.",
  exhibitName: "The Sealed Envelope",
  keyLabel: "Brass Key",
  ticketLabel: "Tram Ticket",
  routeLabel: "Glowing Route",
  rows: 2,
  columns: 3,
  boardWidth: 540,
  boardHeight: 260,
  pieces: [
    {
      id: "envelope-top-left",
      label: "Top-left corner",
      correctRow: 0,
      correctCol: 0,
      visualKind: "envelope-top-left",
      description: "The first folded corner."
    },
    {
      id: "envelope-top-flap",
      label: "Top flap",
      correctRow: 0,
      correctCol: 1,
      visualKind: "envelope-top-flap",
      description: "The fold that closes the clue."
    },
    {
      id: "envelope-top-right",
      label: "Top-right corner",
      correctRow: 0,
      correctCol: 2,
      visualKind: "envelope-top-right",
      description: "The second folded corner."
    },
    {
      id: "envelope-bottom-left",
      label: "Bottom-left body",
      correctRow: 1,
      correctCol: 0,
      visualKind: "envelope-bottom-left",
      description: "The lower body of the clue."
    },
    {
      id: "envelope-seal",
      label: "Rose seal",
      correctRow: 1,
      correctCol: 1,
      visualKind: "envelope-seal",
      description: "The seal that makes the clue official."
    },
    {
      id: "envelope-bottom-right",
      label: "Bottom-right body",
      correctRow: 1,
      correctCol: 2,
      visualKind: "envelope-bottom-right",
      description: "The final lower edge."
    }
  ],
  initialTrayOrder: [
    "envelope-seal",
    "envelope-top-right",
    "envelope-bottom-left",
    "envelope-top-flap",
    "envelope-bottom-right",
    "envelope-top-left"
  ],
  successText: "The first clue is restored.",
  successFollowUp: "A brass key and tram ticket fall from the envelope.",
  incompleteText: "The envelope is not whole yet.",
  wrongText: "The envelope is not whole yet.",
  revealText: "Maria notices what others miss.",
  optionalFollowUp: "The first envelope is not just a clue. It is proof that every true case begins with attention.",
  estimatedSeconds: 40
};

export const caseMosaicSpecs = [LEVEL_ONE_CASE_MOSAIC_SPEC] as const satisfies readonly CaseMosaicSpec[];

export function getCaseMosaicSpec(levelId: number): CaseMosaicSpec | undefined {
  return caseMosaicSpecs.find((spec) => spec.levelId === levelId);
}
