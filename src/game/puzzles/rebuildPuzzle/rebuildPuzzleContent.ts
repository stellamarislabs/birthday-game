import type { RebuildPuzzleSpec } from "./rebuildPuzzleTypes";

export const LEVEL_THREE_REBUILD_PUZZLE_SPEC: RebuildPuzzleSpec = {
  levelId: 3,
  title: "The Hidden Wall",
  subtitle: "Turn the key and reveal the river mark.",
  instruction: "Use the brass key, then open the wall.",
  exhibitName: "The Red Brick",
  keyLabel: "Brass Key",
  keyholeLabel: "Hidden Keyhole",
  waveMarkLabel: "Vistula Wave Mark",
  wallMarks: [
    { id: "upper-crack", label: "Upper crack" },
    { id: "red-brick", label: "Red brick" },
    { id: "river-scratch", label: "River scratch" }
  ],
  requiredMarkCount: 3,
  rows: 2,
  columns: 3,
  pieces: [
    {
      id: "brick-top-left",
      label: "Street corner",
      correctRow: 0,
      correctCol: 0,
      correctRotation: 0,
      visualKind: "brick-top-left",
      description: "The first careful corner of the street."
    },
    {
      id: "brick-arch",
      label: "Small arch",
      correctRow: 0,
      correctCol: 1,
      correctRotation: 0,
      visualKind: "brick-arch",
      description: "The doorway that makes the path feel held."
    },
    {
      id: "brick-top-right",
      label: "Upper brickwork",
      correctRow: 0,
      correctCol: 2,
      correctRotation: 0,
      visualKind: "brick-top-right",
      description: "The upper edge of the rebuilt street."
    },
    {
      id: "brick-path-left",
      label: "Path left",
      correctRow: 1,
      correctCol: 0,
      correctRotation: 0,
      visualKind: "brick-path-left",
      description: "The left side of the patient path."
    },
    {
      id: "brick-lamp",
      label: "Warm lamp",
      correctRow: 1,
      correctCol: 1,
      correctRotation: 0,
      visualKind: "brick-lamp",
      description: "A small light over the repaired way."
    },
    {
      id: "brick-path-right",
      label: "Path right",
      correctRow: 1,
      correctCol: 2,
      correctRotation: 0,
      visualKind: "brick-path-right",
      description: "The final brick run of the path."
    }
  ],
  initialTrayOrder: [
    "brick-lamp",
    "brick-top-right",
    "brick-path-left",
    "brick-arch",
    "brick-path-right",
    "brick-top-left"
  ],
  initialRotations: {
    "brick-lamp": 90,
    "brick-top-right": 0,
    "brick-path-left": 180,
    "brick-arch": 0,
    "brick-path-right": 270,
    "brick-top-left": 0
  },
  successText: "The wall remembers the river.",
  successFollowUp: "A wave mark points to the Vistula.",
  incompleteText: "The wall is still closed.",
  wrongText: "The wall is still closed.",
  revealText: "Strong things are built patiently, piece by piece.",
  optionalFollowUp: "Some truths are not discovered all at once. They are assembled with care.",
  estimatedSeconds: 45
};

export const rebuildPuzzleSpecs = [LEVEL_THREE_REBUILD_PUZZLE_SPEC] as const satisfies readonly RebuildPuzzleSpec[];

export function getRebuildPuzzleSpec(levelId: number): RebuildPuzzleSpec | undefined {
  return rebuildPuzzleSpecs.find((spec) => spec.levelId === levelId);
}
