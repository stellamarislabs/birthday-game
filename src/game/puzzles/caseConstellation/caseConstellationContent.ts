import type { CaseConstellationSpec } from "./caseConstellationTypes";

export const LEVEL_NINE_CASE_CONSTELLATION_SPEC: CaseConstellationSpec = {
  levelId: 9,
  title: "Case Constellation: The Unfinished Letter",
  subtitle: "Let the clues point to the same truth.",
  instruction: "Place the clues where they belong so the unfinished letter can speak.",
  exhibitName: "The Unfinished Letter",
  nodes: [
    { id: "attention", label: "Attention", x: 18, y: 24 },
    { id: "responsibility", label: "Responsibility", x: 50, y: 17 },
    { id: "patience", label: "Patience", x: 82, y: 25 },
    { id: "truth", label: "Truth", x: 76, y: 55 },
    { id: "details", label: "Details", x: 62, y: 80 },
    { id: "trust", label: "Trust", x: 38, y: 80 },
    { id: "warmth", label: "Warmth", x: 24, y: 55 },
    { id: "promise", label: "Promise", x: 50, y: 50 }
  ],
  stars: [
    { id: "envelope", label: "Envelope", correctNodeId: "attention" },
    { id: "stamp", label: "Stamp", correctNodeId: "responsibility" },
    { id: "brick", label: "Brick", correctNodeId: "patience" },
    { id: "witness-note", label: "Witness Note", correctNodeId: "truth" },
    { id: "marginal-note", label: "Marginal Note", correctNodeId: "details" },
    { id: "silver-key", label: "Silver Key", correctNodeId: "trust" },
    { id: "lantern", label: "Lantern", correctNodeId: "warmth" },
    { id: "blue-ribbon", label: "Blue Ribbon", correctNodeId: "promise" }
  ],
  initialTrayOrder: ["lantern", "stamp", "marginal-note", "brick", "blue-ribbon", "envelope", "silver-key", "witness-note"],
  successText: "The letter is complete.",
  successFollowUp: "The final court opens above the rooftops.",
  incompleteText: "Some clues do not point to the right truth yet.",
  wrongText: "Some clues do not point to the right truth yet.",
  revealText: "Every clue points to the same conclusion: Maria is deeply loved for who she is.",
  optionalFollowUp: "Not because of one perfect moment, but because of every small truth the case has carried.",
  estimatedSeconds: 60
};

export const caseConstellationSpecs = [LEVEL_NINE_CASE_CONSTELLATION_SPEC] as const satisfies readonly CaseConstellationSpec[];

export function getCaseConstellationSpec(levelId: number): CaseConstellationSpec | undefined {
  return caseConstellationSpecs.find((spec) => spec.levelId === levelId);
}
