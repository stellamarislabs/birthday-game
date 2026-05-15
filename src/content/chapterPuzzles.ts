import type { ChapterPuzzlePlan } from "../types/ChapterSpec";

export const chapterPuzzlePlans = [
  {
    chapterId: 1,
    puzzleName: "Case Mosaic: The Sealed Envelope",
    puzzleType: "chapter-case-mosaic",
    reusedOldPuzzleModules: ["caseMosaic"],
    deprecatedOldPuzzleRoutes: [],
    puzzleGoal: "Rebuild the sealed envelope so the first route, brass key, and tram ticket can be filed as one clue.",
    playerInteraction: "Tap or drag six envelope pieces into the 3x2 frame, then file the restored clue.",
    successText: "The first clue is restored.",
    wrongIncompleteText: "The envelope is not whole yet.",
    revealTarget: "Chapter 1 clue filed, then Chapter 2 route/stamp setup.",
    implementationRisk: "low"
  },
  {
    chapterId: 2,
    puzzleName: "Route Tile Puzzle: The Hidden Wall",
    puzzleType: "chapter-route-tile-hidden-wall",
    reusedOldPuzzleModules: ["routeTilePuzzle"],
    deprecatedOldPuzzleRoutes: ["old-level-2-case-timeline"],
    puzzleGoal: "Connect the stamped tram route through the keyhole and hidden wall to the Vistula wave mark.",
    playerInteraction: "Tap route tiles to rotate them until the stamped path reaches the wall and wave mark.",
    successText: "The wall remembers the river.",
    wrongIncompleteText: "The route has not reached the wall yet.",
    revealTarget: "Chapter 2 clue filed, then Chapter 3 Vistula witness setup.",
    implementationRisk: "medium"
  },
  {
    chapterId: 3,
    puzzleName: "Deposition Order: The Witness Note",
    puzzleType: "chapter-deposition-order",
    reusedOldPuzzleModules: ["depositionOrder"],
    deprecatedOldPuzzleRoutes: ["old-level-4-witness-lens"],
    puzzleGoal: "Rebuild the witness note statement from four torn strips so the archive code appears.",
    playerInteraction: "Tap or drag statement strips into the vertical deposition note in the correct order.",
    successText: "The witness statement is restored.",
    wrongIncompleteText: "The statement does not read clearly yet.",
    revealTarget: "Chapter 3 clue filed, then Chapter 4 archive setup.",
    implementationRisk: "low"
  },
  {
    chapterId: 4,
    puzzleName: "Case File Sorting: No. Given.",
    puzzleType: "chapter-case-file-sorting",
    reusedOldPuzzleModules: ["caseFileSorting"],
    deprecatedOldPuzzleRoutes: ["old-level-5-archive-detail-finder", "old-level-6-silver-key-reveal"],
    puzzleGoal: "Sort the archive documents so margin marks align into \"No. Given.\" and release the silver key.",
    playerInteraction: "Tap or drag five document cards into order, then tap the Silver Key when the margin correction appears.",
    successText: "The file is in order.",
    wrongIncompleteText: "The file order still hides the correction.",
    revealTarget: "Chapter 4 clue filed, then Chapter 5 courthouse setup.",
    implementationRisk: "medium"
  },
  {
    chapterId: 5,
    puzzleName: "Trust Door Light Path",
    puzzleType: "chapter-trust-light-path",
    reusedOldPuzzleModules: ["trustLightPath"],
    deprecatedOldPuzzleRoutes: ["old-level-6-echo-path", "old-level-7-lantern-sequence", "old-level-8-argument-tower"],
    puzzleGoal: "Ask the right question, light the lantern, rotate the mirrors, and guide the light through the silver key to Trust.",
    playerInteraction: "Choose the correct question tile, then tap large mirror sigils until the lantern light reaches the Trust door.",
    successText: "The Trust door opens. The lantern lights the blue-ribbon pages. The unfinished letter is released.",
    wrongIncompleteText: "The light has not reached Trust yet.",
    revealTarget: "Chapter 5 clue filed, then Chapter 6 unfinished letter setup.",
    implementationRisk: "high"
  },
  {
    chapterId: 6,
    puzzleName: "Final Seal: The Court of the Heart",
    puzzleType: "chapter-final-case-seal",
    reusedOldPuzzleModules: ["finalVerdictAssembly"],
    deprecatedOldPuzzleRoutes: ["old-level-9-case-constellation", "old-level-10-final-verdict-assembly"],
    puzzleGoal: "Align the final court seal so all six chapter clues point toward the heart, then unlock the verdict.",
    playerInteraction: "Tap three large seal rings until each ring lights two clue marks: Envelope, Wall, Witness, Correction, Trust, and Heart.",
    successText: "The final seal closes. The verdict is ready.",
    wrongIncompleteText: "The seal is not complete yet.",
    revealTarget: "FinalVerdictScene.",
    implementationRisk: "high"
  }
] as const satisfies readonly ChapterPuzzlePlan[];

export function getChapterPuzzlePlanByChapterId(chapterId: number): ChapterPuzzlePlan | undefined {
  return chapterPuzzlePlans.find((plan) => plan.chapterId === chapterId);
}
