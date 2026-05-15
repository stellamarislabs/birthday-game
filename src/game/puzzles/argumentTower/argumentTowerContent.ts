import type { ArgumentTowerSpec } from "./argumentTowerTypes";

export const LEVEL_EIGHT_ARGUMENT_TOWER_SPEC: ArgumentTowerSpec = {
  levelId: 8,
  title: "Argument Tower: The Blue Ribbon",
  subtitle: "Build the argument that can stand.",
  instruction: "Build the argument that can stand and release the letter.",
  exhibitName: "The Blue Ribbon",
  slots: [
    { id: "foundation", label: "Foundation", correctBlockId: "evidence" },
    { id: "support-left", label: "Support Left", correctBlockId: "patience" },
    { id: "support-right", label: "Support Right", correctBlockId: "showing-up" },
    { id: "top", label: "Top", correctBlockId: "promise" }
  ],
  blocks: [
    { id: "evidence", label: "Evidence", description: "What the case can stand on." },
    { id: "patience", label: "Patience", description: "The left support, steady over time." },
    { id: "showing-up", label: "Showing Up", description: "The right support, proven by action." },
    { id: "promise", label: "Promise", description: "The ribbon at the top of the structure." },
    { id: "words-only", label: "Words Only", description: "A block that sounds tall but wobbles.", isDecoy: true },
    { id: "coincidence", label: "Coincidence", description: "Too accidental to hold the tower.", isDecoy: true }
  ],
  initialTrayOrder: ["words-only", "evidence", "showing-up", "coincidence", "patience", "promise"],
  successText: "The argument holds.",
  successFollowUp: "An unfinished letter is released.",
  incompleteText: "The tower does not stand on the strongest evidence yet.",
  wrongText: "The tower does not stand on the strongest evidence yet.",
  revealText: "The strongest argument is not spoken once. It is lived.",
  optionalFollowUp: "It appears in patience, in showing up, and in choosing each other again.",
  estimatedSeconds: 45
};

export const argumentTowerSpecs = [LEVEL_EIGHT_ARGUMENT_TOWER_SPEC] as const satisfies readonly ArgumentTowerSpec[];

export function getArgumentTowerSpec(levelId: number): ArgumentTowerSpec | undefined {
  return argumentTowerSpecs.find((spec) => spec.levelId === levelId);
}
