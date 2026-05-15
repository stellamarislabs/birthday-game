import type { CaseBoardSpec } from "./caseBoardTypes";

export const LEVEL_ONE_CASE_BOARD_SPEC: CaseBoardSpec = {
  levelId: 1,
  title: "Case Board: The Sealed Envelope",
  subtitle: "Build the first path to truth.",
  exhibitName: "The Sealed Envelope",
  instruction: "Place the evidence and meaning tiles so the case can reach the truth.",
  boardSlots: [
    {
      id: "case-start",
      label: "Case Start",
      slotType: "start",
      x: 10,
      y: 50,
      acceptsTileTypes: ["start"],
      lockedTileId: "case-start"
    },
    {
      id: "evidence",
      label: "Evidence",
      slotType: "evidence",
      x: 38,
      y: 50,
      acceptsTileTypes: ["evidence"]
    },
    {
      id: "meaning",
      label: "Meaning",
      slotType: "meaning",
      x: 66,
      y: 50,
      acceptsTileTypes: ["meaning"]
    },
    {
      id: "truth",
      label: "Truth",
      slotType: "truth",
      x: 90,
      y: 50,
      acceptsTileTypes: ["truth"],
      lockedTileId: "truth"
    }
  ],
  availableTiles: [
    {
      id: "case-start",
      label: "Case Start",
      tileType: "start",
      description: "The file opens."
    },
    {
      id: "sealed-envelope",
      label: "The Sealed Envelope",
      tileType: "evidence",
      description: "The first clue in the case file."
    },
    {
      id: "attention",
      label: "Attention",
      tileType: "meaning",
      description: "Noticing what others miss."
    },
    {
      id: "speed",
      label: "Speed",
      tileType: "meaning",
      description: "Moving before understanding."
    },
    {
      id: "noise",
      label: "Noise",
      tileType: "meaning",
      description: "What distracts from the truth."
    },
    {
      id: "truth",
      label: "Truth",
      tileType: "truth",
      description: "The case can now speak."
    }
  ],
  validConnections: [
    { fromTileId: "case-start", toTileId: "sealed-envelope" },
    { fromTileId: "sealed-envelope", toTileId: "attention" },
    { fromTileId: "attention", toTileId: "truth" }
  ],
  requiredPath: ["case-start", "sealed-envelope", "attention", "truth"],
  successText: "The first path is clear.",
  incompleteText: "The case path is not complete yet.",
  wrongText: "The path does not reach the truth yet. Try another meaning.",
  revealText: "Maria notices what others miss.",
  optionalFollowUp: "The first envelope is not just a clue. It is proof that every true case begins with attention.",
  estimatedSeconds: 20
};

export const caseBoardSpecs = [LEVEL_ONE_CASE_BOARD_SPEC] as const satisfies readonly CaseBoardSpec[];

export function getCaseBoardSpec(levelId: number): CaseBoardSpec | undefined {
  return caseBoardSpecs.find((spec) => spec.levelId === levelId);
}
