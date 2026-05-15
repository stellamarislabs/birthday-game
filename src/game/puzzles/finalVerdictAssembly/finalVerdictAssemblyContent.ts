import type { FinalVerdictAssemblySpec } from "./finalVerdictAssemblyTypes";

export const LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC: FinalVerdictAssemblySpec = {
  levelId: 10,
  title: "Final Seal: The Court of the Heart",
  subtitle: "Align the clues and open the verdict.",
  instruction: "Rotate the seal rings until the clues point to the heart.",
  exhibitName: "The Heart Seal",
  clueMarks: [
    { id: "envelope", label: "Envelope", chapterId: 1 },
    { id: "wall", label: "Wall", chapterId: 2 },
    { id: "witness", label: "Witness", chapterId: 3 },
    { id: "correction", label: "Correction", chapterId: 4 },
    { id: "trust", label: "Trust", chapterId: 5 },
    { id: "heart", label: "Heart", chapterId: 6 }
  ],
  rings: [
    {
      id: "outer",
      label: "Envelope / Wall",
      clueIds: ["envelope", "wall"],
      initialRotation: 270,
      alignedRotation: 0
    },
    {
      id: "middle",
      label: "Witness / Correction",
      clueIds: ["witness", "correction"],
      initialRotation: 180,
      alignedRotation: 0
    },
    {
      id: "inner",
      label: "Trust / Heart",
      clueIds: ["trust", "heart"],
      initialRotation: 90,
      alignedRotation: 0
    }
  ],
  successText: "The final seal closes.",
  successFollowUp: "The verdict is ready.",
  incompleteText: "The seal is not complete yet.",
  wrongText: "The seal is not complete yet.",
  revealText: "The final court is ready to hear the verdict.",
  estimatedSeconds: 40
};

export const finalVerdictAssemblySpecs = [
  LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC
] as const satisfies readonly FinalVerdictAssemblySpec[];

export function getFinalVerdictAssemblySpec(levelId: number): FinalVerdictAssemblySpec | undefined {
  return finalVerdictAssemblySpecs.find((spec) => spec.levelId === levelId);
}
