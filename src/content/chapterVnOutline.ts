import type { ChapterVnOutline } from "../types/ChapterSpec";

export const chapterVnOutlines = [
  {
    chapterId: 1,
    introPurpose: "Establish birthday morning, the sealed case file, the envelope, key, ticket, and Maria's first read.",
    prePuzzlePurpose: "Retained for dev routes; active flow lets the puzzle instruction frame the envelope quickly.",
    postPuzzlePurpose: "Merged into the clue reveal: the first clue is filed and the ticket points onward.",
    suggestedSceneIds: {
      intro: "vn-chapter-1-intro",
      beforePuzzle: "vn-chapter-1-before-puzzle",
      afterPuzzle: "vn-chapter-1-after-puzzle"
    }
  },
  {
    chapterId: 2,
    introPurpose: "Carry Maria from the tram route into the rebuilt street and hidden wall.",
    prePuzzlePurpose: "Frame ordering the stamped route and repairing what the wall remembers.",
    postPuzzlePurpose: "Merged into the clue reveal: the Vistula wave mark sends Maria toward the witness.",
    suggestedSceneIds: {
      intro: "vn-chapter-2-intro",
      beforePuzzle: "vn-chapter-2-before-puzzle",
      afterPuzzle: "vn-chapter-2-after-puzzle"
    }
  },
  {
    chapterId: 3,
    introPurpose: "Establish the Vistula witness, the warning, and the folded note.",
    prePuzzlePurpose: "Retained for dev routes; active flow lets the puzzle instruction frame the contradiction.",
    postPuzzlePurpose: "Merged into the clue reveal: the archive code shifts the case away from simple theft.",
    suggestedSceneIds: {
      intro: "vn-chapter-3-intro",
      beforePuzzle: "vn-chapter-3-before-puzzle",
      afterPuzzle: "vn-chapter-3-after-puzzle"
    }
  },
  {
    chapterId: 4,
    introPurpose: "Establish the archive drawer, old file, and marginal correction.",
    prePuzzlePurpose: "Frame finding \"No. Given.\" and the hidden silver key.",
    postPuzzlePurpose: "Merged into the clue reveal: the correction and silver key point toward the Courthouse of Echoes.",
    suggestedSceneIds: {
      intro: "vn-chapter-4-intro",
      beforePuzzle: "vn-chapter-4-before-puzzle",
      afterPuzzle: "vn-chapter-4-after-puzzle"
    }
  },
  {
    chapterId: 5,
    introPurpose: "Establish the courthouse, Trust door, lantern, and ribbon as one emotional test.",
    prePuzzlePurpose: "Frame the right question, silver key, lantern path, and ribboned pages as one tactile sequence.",
    postPuzzlePurpose: "Merged into the clue reveal: the blue ribbon releases the unfinished letter.",
    suggestedSceneIds: {
      intro: "vn-chapter-5-intro",
      beforePuzzle: "vn-chapter-5-before-puzzle",
      afterPuzzle: "vn-chapter-5-after-puzzle"
    }
  },
  {
    chapterId: 6,
    introPurpose: "Establish rooftops synthesis and the final court opening above the city.",
    prePuzzlePurpose: "Frame clue meaning placement and final seal completion.",
    postPuzzlePurpose: "Retained for dev routes; active flow sends the final seal directly to the verdict.",
    suggestedSceneIds: {
      intro: "vn-chapter-6-intro",
      beforePuzzle: "vn-chapter-6-before-puzzle",
      afterPuzzle: "vn-chapter-6-after-puzzle"
    }
  }
] as const satisfies readonly ChapterVnOutline[];

export function getChapterVnOutlineByChapterId(chapterId: number): ChapterVnOutline | undefined {
  return chapterVnOutlines.find((outline) => outline.chapterId === chapterId);
}
