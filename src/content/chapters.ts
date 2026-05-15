import type { ChapterSpec } from "../types/ChapterSpec";

export const FINAL_CHAPTER_ID = 6;
export const CHAPTER_COUNT = 6;

export const chapters = [
  {
    id: 1,
    chapterKey: "sealed-envelope",
    title: "The Sealed Envelope",
    shortTitle: "Sealed Envelope",
    oldLevelIds: [1, 2],
    storyPurpose: "Maria receives Case No. 16/05, the sealed envelope, brass key, tram ticket, and first route.",
    platformerTheme: "Kancelaria desk route ending in tram-ticket glow.",
    mainClues: ["The Sealed Envelope", "Brass Key", "Tram Ticket"],
    puzzleName: "Case Mosaic: The Sealed Envelope",
    puzzleType: "chapter-case-mosaic",
    puzzlePurpose: "Rebuild the sealed envelope so the brass key and tram ticket route feel earned.",
    vnPurpose: "Establish Maria's birthday morning, the mysterious case file, and her first careful read.",
    emotionalReveal: "Maria notices what others miss.",
    leadsToNext: "The tram ticket route seeks a golden stamp and hidden wall.",
    targetDurationSeconds: { min: 90, max: 120 },
    estimatedTotalMinutes: "1.5-2",
    implementationRisk: "low",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 1 tutorial route", "Old Level 2 tram-ticket setup"],
    devNotes: [
      "Keep first movement simple and forgiving.",
      "Active Part 45B-R2 flow keeps old Level 1 geometry and restores Case Mosaic as the Chapter 1 puzzle.",
      "Do not bring moving tram timing into the opening chapter."
    ]
  },
  {
    id: 2,
    chapterKey: "hidden-wall",
    title: "The Hidden Wall",
    shortTitle: "Hidden Wall",
    oldLevelIds: [2, 3],
    storyPurpose: "The golden stamp reveals the route; the brass key opens a hidden wall; Maria finds the river mark.",
    platformerTheme: "Tram/city timing into rebuilt street/keyhole.",
    mainClues: ["The Golden Stamp", "The Red Brick"],
    puzzleName: "Route Tile Puzzle: The Hidden Wall",
    puzzleType: "chapter-route-tile-hidden-wall",
    puzzlePurpose: "Rotate large route tiles so the stamped ticket connects through the keyhole and hidden wall to the Vistula wave mark.",
    vnPurpose: "Show ordered responsibility turning into a physical route, keyhole, and repaired city image.",
    emotionalReveal: "Responsibility and patience reveal the path.",
    leadsToNext: "The repaired wall image reveals a Vistula wave mark and witness.",
    targetDurationSeconds: { min: 120, max: 150 },
    estimatedTotalMinutes: "2-2.5",
    implementationRisk: "medium",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 2 moving tram platforms", "Old Level 3 rebuild route and Red Brick repair"],
    devNotes: [
      "Part 45B-R2 uses old Level 2 geometry and old Level 3 completion routing with a new active route tile puzzle.",
      "Part 42J expands old Level 2 with a rebuilt-street/keyhole ending while old Level 3 remains dev/source material."
    ]
  },
  {
    id: 3,
    chapterKey: "river-witness",
    title: "The River Witness",
    shortTitle: "River Witness",
    oldLevelIds: [4],
    storyPurpose: "Maria meets a witness by the Vistula; the note says the heart was not stolen.",
    platformerTheme: "Riverbank, bridge shadows, drifting papers, witness trail.",
    mainClues: ["The Witness Note"],
    puzzleName: "Deposition Order: The Witness Note",
    puzzleType: "chapter-deposition-order",
    puzzlePurpose: "Rebuild the torn witness statement so the archive code appears.",
    vnPurpose: "Let the mystery pivot from theft toward the possibility that the heart was left willingly.",
    emotionalReveal: "Maria hears the quiet version of truth.",
    leadsToNext: "An archive code appears at the bottom of the note.",
    targetDurationSeconds: { min: 90, max: 120 },
    estimatedTotalMinutes: "1.5-2",
    implementationRisk: "low",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 4 river platformer", "Old Level 4 witness-note story beat"],
    devNotes: [
      "This chapter is the cleanest standalone carryover.",
      "Active Part 45D-R2 revised flow uses old Level 4 geometry and Deposition Order.",
      "Keep the archive-code bridge visible but not wordy."
    ]
  },
  {
    id: 4,
    chapterKey: "archive-corrections",
    title: "The Archive of Corrections",
    shortTitle: "Archive Corrections",
    oldLevelIds: [5, 6],
    storyPurpose: "Maria follows the archive code, finds \"No. Given.\" in the margin, and discovers the silver key.",
    platformerTheme: "Archive drawers, keys, doors, margin notes.",
    mainClues: ["The Marginal Note", "The Silver Key"],
    puzzleName: "Case File Sorting: No. Given.",
    puzzleType: "chapter-case-file-sorting",
    puzzlePurpose: "Sort the archive documents so the margin marks align, reveal \"No. Given.\", and take the silver key.",
    vnPurpose: "Reward Maria's careful observation and make the silver key feel earned before the courthouse.",
    emotionalReveal: "Small details change the whole charge.",
    leadsToNext: "The silver key points to the Courthouse of Echoes.",
    targetDurationSeconds: { min: 120, max: 150 },
    estimatedTotalMinutes: "2-2.5",
    implementationRisk: "medium",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 5 archive key/door route", "Old Level 6 silver-key story discovery"],
    devNotes: [
      "Active Part 45D-R2 revised flow uses old Level 5 geometry and Case File Sorting.",
      "Move the silver-key reveal here without adding a separate courthouse traversal yet.",
      "Avoid pixel-hunt pressure in the archive puzzle."
    ]
  },
  {
    id: 5,
    chapterKey: "door-of-trust",
    title: "The Door of Trust",
    shortTitle: "Door of Trust",
    oldLevelIds: [6, 7, 8],
    storyPurpose:
      "Maria uses the silver key, asks the right question, opens Trust, follows lantern light, and receives blue ribbon pages.",
    platformerTheme: "Courthouse corridor to garden to argument pages, simplified into one emotional chapter.",
    mainClues: ["The Silver Key", "The Lantern", "The Blue Ribbon"],
    puzzleName: "Trust Door Light Path",
    puzzleType: "chapter-trust-light-path",
    puzzlePurpose: "Choose the right question, light the lantern, and rotate the mirror path until Trust opens.",
    vnPurpose: "Unify trust, warmth, and lived promise into one strong middle climax.",
    emotionalReveal: "Real love is proven by what remains and what is chosen again.",
    leadsToNext: "The blue ribbon releases the unfinished letter.",
    targetDurationSeconds: { min: 150, max: 180 },
    estimatedTotalMinutes: "2.5-3",
    implementationRisk: "high",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 6 Echo Path", "Old Level 7 Lantern Sequence", "Old Level 8 Argument Tower"],
    devNotes: [
      "Active Part 42L flow extends old Level 6 with one lantern reveal path and a vertical ribbon-pages ascent.",
      "Old Levels 7 and 8 remain dev/source material; their lantern/elevator ideas are reused without pasting the full routes.",
      "Part 45E-R2 replaces active Echo Path with Trust Door Light Path while retaining old Echo Path as source material."
    ]
  },
  {
    id: 6,
    chapterKey: "court-of-heart",
    title: "The Court of the Heart",
    shortTitle: "Court of Heart",
    oldLevelIds: [9, 10],
    storyPurpose:
      "Maria completes the letter, connects all prior meanings, enters the final court, assembles the seal, and hears the verdict.",
    platformerTheme: "Rooftops synthesis, prior clue memory markers, floating ascent, and ceremonial final court.",
    mainClues: ["The Unfinished Letter", "The Heart Seal"],
    puzzleName: "Final Seal",
    puzzleType: "chapter-final-case-seal",
    puzzlePurpose: "Use the unfinished letter and six chapter clues to align the final court seal and unlock the verdict.",
    vnPurpose: "Prepare the final verdict without repeating or expanding the approved final text.",
    emotionalReveal: "The seal is ready for the verdict.",
    leadsToNext: "FinalVerdictScene.",
    targetDurationSeconds: { min: 150, max: 180 },
    estimatedTotalMinutes: "2.5-3",
    implementationRisk: "high",
    active: true,
    migrationStatus: "implemented",
    absorbedOldContent: ["Old Level 9 Case Constellation", "Old Level 10 Final Verdict Assembly"],
    devNotes: [
      "Active Part 42M flow expands old Level 9 into rooftops, clue memory markers, floating ascent, final court, and heart-seal approach.",
      "Old Level 10 geometry remains available as legacy/dev source material while the active final seal puzzle uses three seal rings instead of token slots or ten ordered fragments.",
      "Keep the final VN bridge short so the verdict remains the emotional payoff."
    ]
  }
] as const satisfies readonly ChapterSpec[];

export function getChapterById(chapterId: number): ChapterSpec | undefined {
  return chapters.find((chapter) => chapter.id === chapterId);
}
