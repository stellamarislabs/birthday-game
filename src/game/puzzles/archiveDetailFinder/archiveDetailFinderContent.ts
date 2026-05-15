import type { ArchiveDetailFinderSpec } from "./archiveDetailFinderTypes";

export const LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC: ArchiveDetailFinderSpec = {
  levelId: 5,
  title: "Archive Overlay: The Marginal Note",
  subtitle: "Reveal the correction in the margin.",
  instruction: "Inspect the marked margins to reveal the correction.",
  exhibitName: "The Marginal Note",
  evidencePageTitle: "Archive File 16/05",
  originalLine: "The heart was taken.",
  correctionText: "No. Given.",
  keyLabel: "Silver Key",
  details: [
    {
      id: "margin-crossout",
      label: "Crossed charge",
      meaning: "No.",
      note: "The margin refuses the old accusation.",
      x: 30,
      y: 36,
      radius: 20
    },
    {
      id: "margin-correction",
      label: "Corrected word",
      meaning: "Given.",
      note: "The second hand changes the charge.",
      x: 68,
      y: 42,
      radius: 20
    },
    {
      id: "file-spine",
      label: "File spine glint",
      meaning: "Key.",
      note: "A thin silver edge waits inside the file.",
      x: 82,
      y: 70,
      radius: 20
    }
  ],
  requiredDetailIds: ["margin-crossout", "margin-correction", "file-spine"],
  successText: "The margin reveals the truth.",
  successFollowUp: "A silver key slips from the file spine.",
  keyReadyText: "The correction is complete. Take the silver key.",
  incompleteText: "The correction is not complete yet.",
  wrongText: "The correction is not complete yet.",
  revealText: "No. Given.",
  optionalFollowUp: "The silver key points to the Courthouse of Echoes.",
  estimatedSeconds: 45
};

export const archiveDetailFinderSpecs = [
  LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC
] as const satisfies readonly ArchiveDetailFinderSpec[];

export function getArchiveDetailFinderSpec(levelId: number): ArchiveDetailFinderSpec | undefined {
  return archiveDetailFinderSpecs.find((spec) => spec.levelId === levelId);
}
