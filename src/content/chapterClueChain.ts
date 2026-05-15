import type { ChapterClueChainEntry } from "../types/ChapterSpec";

export const chapterClueChain = [
  {
    chapterId: 1,
    currentClues: ["The Sealed Envelope", "Brass Key", "Tram Ticket"],
    meaningDiscovered: "Maria notices what others miss.",
    nextChapterId: 2,
    nextHintText: "The tram ticket begins to glow.",
    nextActionLabel: "Follow the ticket"
  },
  {
    chapterId: 2,
    currentClues: ["The Golden Stamp", "The Red Brick"],
    meaningDiscovered: "Responsibility and patience reveal the path.",
    nextChapterId: 3,
    nextHintText: "A wave mark points to the Vistula.",
    nextActionLabel: "Go to the river"
  },
  {
    chapterId: 3,
    currentClues: ["The Witness Note"],
    meaningDiscovered: "Maria hears the quiet version of truth.",
    nextChapterId: 4,
    nextHintText: "An archive code appears in the corner of the note.",
    nextActionLabel: "Open the archive"
  },
  {
    chapterId: 4,
    currentClues: ["The Marginal Note", "The Silver Key"],
    meaningDiscovered: "Small details change the charge.",
    nextChapterId: 5,
    nextHintText: "The silver key points to the Courthouse of Echoes.",
    nextActionLabel: "Take the key"
  },
  {
    chapterId: 5,
    currentClues: ["The Silver Key", "The Lantern", "The Blue Ribbon"],
    meaningDiscovered: "Trust is proven by what remains.",
    nextChapterId: 6,
    nextHintText: "The blue ribbon releases the unfinished letter.",
    nextActionLabel: "Read the letter"
  },
  {
    chapterId: 6,
    currentClues: ["The Unfinished Letter", "The Heart Seal"],
    meaningDiscovered: "Every clue is ready for the final court.",
    nextChapterId: null,
    nextHintText: "The final court is ready to hear the verdict.",
    nextActionLabel: "Hear the verdict"
  }
] as const satisfies readonly ChapterClueChainEntry[];

export function getChapterClueChainEntry(chapterId: number): ChapterClueChainEntry | undefined {
  return chapterClueChain.find((entry) => entry.chapterId === chapterId);
}
