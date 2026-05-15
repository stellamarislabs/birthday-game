export type ClueVisualMotif =
  | "envelope"
  | "tram-ticket"
  | "stamp"
  | "wall-keyhole"
  | "wave-mark"
  | "archive-code"
  | "silver-key"
  | "trust-door"
  | "lantern"
  | "blue-ribbon"
  | "unfinished-letter"
  | "final-court"
  | "heart-seal";

export interface ClueChainEntry {
  levelId: number;
  clueName: string;
  solvedMeaning: string;
  nextClueName: string | null;
  nextLocation: string | null;
  nextHintText: string | null;
  nextLabel: string;
  nextVisualMotif: ClueVisualMotif;
  puzzleSuccessFollowUp: string;
}

export const clueChain = [
  {
    levelId: 1,
    clueName: "The Sealed Envelope",
    solvedMeaning: "Maria notices what others miss.",
    nextClueName: "The Golden Stamp",
    nextLocation: "The Tram of Deadlines",
    nextHintText: "Inside the restored envelope, a brass key and tram ticket begin to glow.",
    nextLabel: "Follow the tram ticket",
    nextVisualMotif: "tram-ticket",
    puzzleSuccessFollowUp: "A key and tram ticket fall from the envelope."
  },
  {
    levelId: 2,
    clueName: "The Golden Stamp",
    solvedMeaning: "Maria carries responsibility with grace.",
    nextClueName: "The Red Brick",
    nextLocation: "The Rebuilt Street",
    nextHintText: "The stamp burns a route onto the ticket: a rebuilt street, a hidden wall, and a waiting keyhole.",
    nextLabel: "Find the hidden wall",
    nextVisualMotif: "wall-keyhole",
    puzzleSuccessFollowUp: "A hidden wall appears on the stamped route."
  },
  {
    levelId: 3,
    clueName: "The Red Brick",
    solvedMeaning: "Strong things are built patiently, piece by piece.",
    nextClueName: "The Witness Note",
    nextLocation: "The Vistula Deposition",
    nextHintText: "The repaired wall image reveals a wave mark pointing toward the Vistula.",
    nextLabel: "Go to the river",
    nextVisualMotif: "wave-mark",
    puzzleSuccessFollowUp: "A wave mark points to the Vistula."
  },
  {
    levelId: 4,
    clueName: "The Witness Note",
    solvedMeaning: "Maria hears the quiet version of truth.",
    nextClueName: "The Marginal Note",
    nextLocation: "The Archive of Tiny Details",
    nextHintText: "A tiny archive reference appears at the bottom of the note.",
    nextLabel: "Open the archive file",
    nextVisualMotif: "archive-code",
    puzzleSuccessFollowUp: "An archive code appears in the corner of the note."
  },
  {
    levelId: 5,
    clueName: "The Marginal Note",
    solvedMeaning: "Small details become evidence when someone truly loves you.",
    nextClueName: "The Silver Key",
    nextLocation: "The Courthouse of Echoes",
    nextHintText: "Behind the corrected page, a silver key slides from the file spine.",
    nextLabel: "Take the silver key",
    nextVisualMotif: "silver-key",
    puzzleSuccessFollowUp: "A silver key slips from the file spine."
  },
  {
    levelId: 6,
    clueName: "The Silver Key",
    solvedMeaning: "Real love is proven by choosing each other again.",
    nextClueName: "The Lantern",
    nextLocation: "The Garden of Quiet Evidence",
    nextHintText: "The Trust door opens to a quiet lantern burning in the dark.",
    nextLabel: "Follow the lantern",
    nextVisualMotif: "lantern",
    puzzleSuccessFollowUp: "A lantern waits beyond the echo."
  },
  {
    levelId: 7,
    clueName: "The Lantern",
    solvedMeaning: "Maria is warmth, calm, and home.",
    nextClueName: "The Blue Ribbon",
    nextLocation: "The Tower of Arguments",
    nextHintText: "The lantern path leads to a bench where a blue ribbon holds several pages together.",
    nextLabel: "Read the ribboned pages",
    nextVisualMotif: "blue-ribbon",
    puzzleSuccessFollowUp: "A blue ribbon waits on the bench."
  },
  {
    levelId: 8,
    clueName: "The Blue Ribbon",
    solvedMeaning: "The strongest argument is not spoken once. It is lived.",
    nextClueName: "The Unfinished Letter",
    nextLocation: "The Rooftops Before the Verdict",
    nextHintText: "The ribbon releases an unfinished letter, its missing meaning scattered above the rooftops.",
    nextLabel: "Climb to the rooftops",
    nextVisualMotif: "unfinished-letter",
    puzzleSuccessFollowUp: "An unfinished letter is released."
  },
  {
    levelId: 9,
    clueName: "The Unfinished Letter",
    solvedMeaning: "Every clue points to the same conclusion: Maria is deeply loved for who she is.",
    nextClueName: "The Heart Seal",
    nextLocation: "The Court of the Heart",
    nextHintText: "The completed sentence opens the final court: the Court of the Heart.",
    nextLabel: "Enter the final court",
    nextVisualMotif: "final-court",
    puzzleSuccessFollowUp: "The final court opens above the rooftops."
  },
  {
    levelId: 10,
    clueName: "The Heart Seal",
    solvedMeaning: "The seal is ready for the verdict.",
    nextClueName: null,
    nextLocation: null,
    nextHintText: null,
    nextLabel: "Hear the verdict",
    nextVisualMotif: "heart-seal",
    puzzleSuccessFollowUp: "The verdict is ready."
  }
] as const satisfies readonly ClueChainEntry[];

export function getClueChainEntry(levelId: number): ClueChainEntry | undefined {
  return clueChain.find((entry) => entry.levelId === levelId);
}
