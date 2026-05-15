import type { LanternSequenceSpec } from "./lanternSequenceTypes";

export const LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC: LanternSequenceSpec = {
  levelId: 7,
  title: "Lantern Sequence: The Lantern",
  subtitle: "Light the garden path.",
  instruction: "Carry the light through the garden pattern to reveal the next clue.",
  exhibitName: "The Lantern",
  lanterns: [
    { id: "north", label: "North" },
    { id: "east", label: "East" },
    { id: "south", label: "South" },
    { id: "west", label: "West" }
  ],
  sequence: ["north", "east", "south", "east"],
  successText: "The garden opens the path.",
  successFollowUp: "A blue ribbon waits on the bench.",
  incompleteText: "The lights fade gently. Try the path again.",
  wrongText: "The lights fade gently. Try the path again.",
  revealText: "Maria is warmth, calm, and home.",
  optionalFollowUp: "Some people do not need to be loud to become the safest place.",
  estimatedSeconds: 35
};

export const lanternSequenceSpecs = [LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC] as const satisfies readonly LanternSequenceSpec[];

export function getLanternSequenceSpec(levelId: number): LanternSequenceSpec | undefined {
  return lanternSequenceSpecs.find((spec) => spec.levelId === levelId);
}
