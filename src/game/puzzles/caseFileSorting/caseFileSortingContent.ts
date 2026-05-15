import type { CaseFileSortingSpec } from "./caseFileSortingTypes";

export const LEVEL_FIVE_CASE_FILE_SORTING_SPEC: CaseFileSortingSpec = {
  levelId: 5,
  title: "Case File Sorting: No. Given.",
  subtitle: "Sort the archive file to reveal the correction.",
  instruction: "Arrange the documents so the margin marks line up.",
  exhibitName: "The Marginal Note and The Silver Key",
  documents: [
    {
      id: "route-reference",
      title: "Route Reference",
      label: "The route that brought the file here.",
      symbol: "I"
    },
    {
      id: "witness-note",
      title: "Witness Note",
      label: "The quiet statement from the river.",
      symbol: "II"
    },
    {
      id: "original-charge",
      title: "Original Charge",
      label: "The line that claimed the heart was taken.",
      symbol: "III"
    },
    {
      id: "margin-correction",
      title: "Margin Correction",
      label: "The hand that changes the charge.",
      symbol: "IV"
    },
    {
      id: "key-receipt",
      title: "Key Receipt",
      label: "A silver glint in the file spine.",
      symbol: "V"
    }
  ],
  slots: [
    { id: "file-1", label: "1" },
    { id: "file-2", label: "2" },
    { id: "file-3", label: "3" },
    { id: "file-4", label: "4" },
    { id: "file-5", label: "5" }
  ],
  correctOrder: ["route-reference", "witness-note", "original-charge", "margin-correction", "key-receipt"],
  correctionText: "No. Given.",
  keyLabel: "Silver Key",
  successText: "The file is in order.",
  successFollowUp: "The margin reads: No. Given. A silver key slips from the file spine.",
  incompleteText: "The file order still hides the correction.",
  wrongText: "The file order still hides the correction.",
  estimatedSeconds: 50
};

export const caseFileSortingSpecs = [
  LEVEL_FIVE_CASE_FILE_SORTING_SPEC
] as const satisfies readonly CaseFileSortingSpec[];

export function getCaseFileSortingSpec(levelId: number): CaseFileSortingSpec | undefined {
  return caseFileSortingSpecs.find((spec) => spec.levelId === levelId);
}
