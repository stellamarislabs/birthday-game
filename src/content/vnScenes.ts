import type { VisualNovelPlacement, VisualNovelSceneSpec } from "../types/VisualNovel";

export const visualNovelScenes: VisualNovelSceneSpec[] = [
  {
    id: "vn-chapter-1-intro",
    chapterId: 1,
    placement: "before-platformer",
    title: "The First Envelope",
    backgroundVariant: "kancelaria",
    lines: [
      { speaker: "Case File", text: "Case No. 16/05 — The Missing Heart." },
      { speaker: "Narrator", text: "On Maria's birthday, one envelope waits where ordinary papers should have been." },
      { speaker: "Maria", text: "No client name. Only a key, a ticket, and a warning." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 1, chapterId: 1 } }
  },
  {
    id: "vn-chapter-1-before-puzzle",
    chapterId: 1,
    placement: "before-puzzle",
    title: "The Envelope Rebuilt",
    backgroundVariant: "kancelaria",
    lines: [
      { speaker: "Case File", text: "Rebuild the envelope. The route is inside." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 1, chapterId: 1 } }
  },
  {
    id: "vn-chapter-1-after-puzzle",
    chapterId: 1,
    placement: "after-puzzle",
    title: "The Route Begins",
    backgroundVariant: "kancelaria",
    lines: [
      { speaker: "Narrator", text: "The tram ticket begins to glow." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 1, chapterId: 1 } }
  },
  {
    id: "vn-chapter-2-intro",
    chapterId: 2,
    placement: "before-platformer",
    title: "The Stamped Route",
    backgroundVariant: "tram-night",
    lines: [
      { speaker: "Narrator", text: "The tram ticket pulls Maria into the city's moving light." },
      { speaker: "Case File", text: "The route needs a stamp before it can reveal the wall." },
      { speaker: "Maria", text: "Then the key from the envelope finally has somewhere to turn." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 2, chapterId: 2 } }
  },
  {
    id: "vn-chapter-2-before-puzzle",
    chapterId: 2,
    placement: "before-puzzle",
    title: "The Hidden Wall",
    backgroundVariant: "rebuilt-street",
    lines: [
      { speaker: "Case File", text: "Turn the tiles until the stamped route reaches the wall." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 3, chapterId: 2 } }
  },
  {
    id: "vn-chapter-2-after-puzzle",
    chapterId: 2,
    placement: "after-puzzle",
    title: "The River Mark",
    backgroundVariant: "rebuilt-street",
    lines: [
      { speaker: "Narrator", text: "The connected route reveals a wave mark." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 3, chapterId: 2 } }
  },
  {
    id: "vn-chapter-3-intro",
    chapterId: 3,
    placement: "before-platformer",
    title: "The Running Witness",
    backgroundVariant: "vistula",
    lines: [
      { speaker: "Narrator", text: "By the Vistula, a witness gives Maria a note and disappears beneath the bridge." },
      { speaker: "Witness", text: "Ask the correct questions. Maybe the heart was not taken at all." },
      { speaker: "Maria", text: "Who was he? That was strange... There's something more to this case." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 4, chapterId: 3 } }
  },
  {
    id: "vn-chapter-3-before-puzzle",
    chapterId: 3,
    placement: "before-puzzle",
    title: "The Witness Note",
    backgroundVariant: "vistula",
    lines: [
      { speaker: "Case File", text: "The note says the heart was left willingly. Find the line that denies it." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 4, chapterId: 3 } }
  },
  {
    id: "vn-chapter-3-after-puzzle",
    chapterId: 3,
    placement: "after-puzzle",
    title: "The Archive Code",
    backgroundVariant: "vistula",
    lines: [
      { speaker: "Narrator", text: "A tiny archive code appears." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 4, chapterId: 3 } }
  },
  {
    id: "vn-chapter-4-intro",
    chapterId: 4,
    placement: "before-platformer",
    title: "The Drawer No One Opened",
    backgroundVariant: "archive",
    lines: [
      { speaker: "Narrator", text: "The archive code opens a drawer no one has touched in years." },
      { speaker: "Case File", text: "The answer may be smaller than the question." },
      { speaker: "Maria", text: "Then I'll read the documents carefully. No secret can hide from me." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 5, chapterId: 4 } }
  },
  {
    id: "vn-chapter-4-before-puzzle",
    chapterId: 4,
    placement: "before-puzzle",
    title: "The Marginal Note",
    backgroundVariant: "archive",
    lines: [
      { speaker: "Case File", text: "The original case says the heart was taken. But the details say otherwise." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 5, chapterId: 4 } }
  },
  {
    id: "vn-chapter-4-after-puzzle",
    chapterId: 4,
    placement: "after-puzzle",
    title: "No. Given.",
    backgroundVariant: "archive",
    lines: [
      { speaker: "Narrator", text: "The correction reads: No. Given. A silver key slips free." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 5, chapterId: 4 } }
  },
  {
    id: "vn-chapter-5-intro",
    chapterId: 5,
    placement: "before-platformer",
    title: "The Door of Trust",
    backgroundVariant: "courthouse",
    lines: [
      { speaker: "Narrator", text: "The silver key leads Maria into a courthouse of uncertain doors." },
      { speaker: "Narrator", text: "The Trust door will not open to the wrong question." },
      { speaker: "Maria", text: "Then the question matters as much as the key." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 6, chapterId: 5 } }
  },
  {
    id: "vn-chapter-5-before-puzzle",
    chapterId: 5,
    placement: "before-puzzle",
    title: "The Right Question",
    backgroundVariant: "courthouse",
    lines: [
      { speaker: "Case File", text: "Choose the question that opens trust." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 6, chapterId: 5 } }
  },
  {
    id: "vn-chapter-5-after-puzzle",
    chapterId: 5,
    placement: "after-puzzle",
    title: "The Letter Released",
    backgroundVariant: "garden",
    lines: [
      { speaker: "Narrator", text: "The blue ribbon releases the unfinished letter." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 6, chapterId: 5 } }
  },
  {
    id: "vn-chapter-6-intro",
    chapterId: 6,
    placement: "before-platformer",
    title: "Before the Verdict",
    backgroundVariant: "rooftops",
    lines: [
      { speaker: "Narrator", text: "Above Warsaw, every clue Maria has followed glows behind her." },
      { speaker: "Narrator", text: "One unfinished letter. One final court." },
      { speaker: "Maria", text: "I've come a long way. Now the evidence will speak." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 9, chapterId: 6 } }
  },
  {
    id: "vn-chapter-6-before-puzzle",
    chapterId: 6,
    placement: "before-puzzle",
    title: "The Final Seal",
    backgroundVariant: "court-heart",
    lines: [
      { speaker: "Narrator", text: "Complete the seal, and the verdict will open." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 10, chapterId: 6 } }
  },
  {
    id: "vn-chapter-6-after-puzzle",
    chapterId: 6,
    placement: "after-puzzle",
    title: "The Verdict Is Ready",
    backgroundVariant: "court-heart",
    lines: [
      { speaker: "Narrator", text: "The seal closes. The verdict is ready." }
    ],
    nextScene: { scene: "FinalVerdictScene" }
  },
  {
    id: "vn-level-1-intro",
    levelId: 1,
    placement: "before-platformer",
    title: "The First Envelope",
    lines: [
      { speaker: "Case File", text: "Case No. 16/05 — The City v. The Missing Heart." },
      { speaker: "Narrator", text: "On Maria's birthday, one envelope waits where ordinary papers should have been." },
      { speaker: "Maria", text: "No client name. Only a case number." },
      { speaker: "Case File", text: "Inside are three things: a brass key, a tram ticket, and a warning." },
      { speaker: "Maria", text: "Then the first clue is not the answer. It is the beginning." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 1 } }
  },
  {
    id: "vn-level-1-before-puzzle",
    levelId: 1,
    placement: "before-puzzle",
    title: "The Sealed Envelope",
    lines: [
      { speaker: "Narrator", text: "Maria opens the envelope carefully. The key is small, but heavier than it should be." },
      { speaker: "Case File", text: "Rebuild the first clue. Then read what it is asking you to notice." },
      { speaker: "Maria", text: "Every true case begins with attention." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 1 } }
  },
  {
    id: "vn-level-1-after-puzzle",
    levelId: 1,
    placement: "after-puzzle",
    title: "The First Clue",
    lines: [
      { speaker: "Narrator", text: "The envelope becomes whole, and the tram ticket inside begins to glow." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "A route. A key. And a city waiting to be read." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 1 } }
  },
  {
    id: "vn-level-2-intro",
    levelId: 2,
    placement: "before-platformer",
    title: "The Stamped Route",
    lines: [
      { speaker: "Narrator", text: "The tram ticket pulls Maria into the city's moving light." },
      { speaker: "Case File", text: "The route will not reveal itself until the day is put in order." },
      { speaker: "Maria", text: "Then I should not chase the city. I should read the stops." },
      { speaker: "Narrator", text: "At the end of the line, an old brass validator waits." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 2 } }
  },
  {
    id: "vn-level-2-before-puzzle",
    levelId: 2,
    placement: "before-puzzle",
    title: "The Golden Stamp",
    lines: [
      { speaker: "Narrator", text: "Maria places the ticket into the validator. The machine waits for order." },
      { speaker: "Case File", text: "A deadline is not only pressure. Sometimes it reveals the path." },
      { speaker: "Maria", text: "Then the case needs order before it needs speed." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 2 } }
  },
  {
    id: "vn-level-2-after-puzzle",
    levelId: 2,
    placement: "after-puzzle",
    title: "The Route Appears",
    lines: [
      { speaker: "Narrator", text: "The golden stamp lands, and a hidden route burns across the ticket." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "The next mark is a wall. And this key finally has a lock." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 2 } }
  },
  {
    id: "vn-level-3-intro",
    levelId: 3,
    placement: "before-platformer",
    title: "The Wall That Remembers",
    lines: [
      { speaker: "Narrator", text: "The stamped route ends at a rebuilt street where one brick does not match." },
      { speaker: "Case File", text: "Some doors do not look like doors until the right key is used." },
      { speaker: "Maria", text: "Then the envelope was waiting for this wall." },
      { speaker: "Narrator", text: "The brass key turns, and the bricks begin to move." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 3 } }
  },
  {
    id: "vn-level-3-before-puzzle",
    levelId: 3,
    placement: "before-puzzle",
    title: "The Red Brick",
    lines: [
      { speaker: "Narrator", text: "Behind the wall is a broken image of the city, split into pieces." },
      { speaker: "Case File", text: "Repair what the street remembers." },
      { speaker: "Maria", text: "If the path is broken, the next clue may be hidden in the repair." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 3 } }
  },
  {
    id: "vn-level-3-after-puzzle",
    levelId: 3,
    placement: "after-puzzle",
    title: "The River Mark",
    lines: [
      { speaker: "Narrator", text: "The repaired image reveals a path toward the Vistula." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "A wave mark. The next answer is by the river." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 3 } }
  },
  {
    id: "vn-level-4-intro",
    levelId: 4,
    placement: "before-platformer",
    title: "The Running Witness",
    lines: [
      { speaker: "Narrator", text: "By the Vistula, papers drift like statements no one wanted to keep." },
      { speaker: "Witness", text: "Don't ask who took it. Ask whether it was taken at all." },
      { speaker: "Narrator", text: "The witness presses a folded note into Maria's hand and disappears." },
      { speaker: "Maria", text: "That sounded less like fear, and more like warning." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 4 } }
  },
  {
    id: "vn-level-4-before-puzzle",
    levelId: 4,
    placement: "before-puzzle",
    title: "The Witness Note",
    lines: [
      { speaker: "Narrator", text: "The note is brief. That makes every word dangerous." },
      { speaker: "Case File", text: "The heart was not taken by force. It was left willingly." },
      { speaker: "Maria", text: "Then the contradiction should reveal itself." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 4 } }
  },
  {
    id: "vn-level-4-after-puzzle",
    levelId: 4,
    placement: "after-puzzle",
    title: "The Archive Reference",
    lines: [
      { speaker: "Narrator", text: "The false statement falls away, and an archive code appears on the note." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "The note does not end here. It points to a file." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 4 } }
  },
  {
    id: "vn-level-5-intro",
    levelId: 5,
    placement: "before-platformer",
    title: "The File in the Margin",
    lines: [
      { speaker: "Narrator", text: "The witness code opens a drawer no one has touched in years." },
      { speaker: "Case File", text: "The answer may be smaller than the question." },
      { speaker: "Maria", text: "Small details have changed bigger cases than this." },
      { speaker: "Narrator", text: "A correction waits in the margin of an old page." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 5 } }
  },
  {
    id: "vn-level-5-before-puzzle",
    levelId: 5,
    placement: "before-puzzle",
    title: "The Marginal Note",
    lines: [
      { speaker: "Narrator", text: "The original line says the heart was taken." },
      { speaker: "Maria", text: "And the margin says otherwise." },
      { speaker: "Case File", text: "Find what others passed over." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 5 } }
  },
  {
    id: "vn-level-5-after-puzzle",
    levelId: 5,
    placement: "after-puzzle",
    title: "No. Given.",
    lines: [
      { speaker: "Narrator", text: "The marginal note becomes clear: \"No. Given.\"" },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "If it was given, then the court is asking the wrong question." },
      { speaker: "Narrator", text: "A silver key slides from the spine of the file." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 5 } }
  },
  {
    id: "vn-level-6-intro",
    levelId: 6,
    placement: "before-platformer",
    title: "The Door of Trust",
    lines: [
      { speaker: "Narrator", text: "The silver key leads Maria into a courthouse corridor of uncertain doors." },
      { speaker: "Case File", text: "Doubt, fear, distance, hope, trust. Every door asks a different question." },
      { speaker: "Maria", text: "Then the key is not enough. The question matters too." },
      { speaker: "Narrator", text: "The Trust door waits without a handle." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 6 } }
  },
  {
    id: "vn-level-6-before-puzzle",
    levelId: 6,
    placement: "before-puzzle",
    title: "The Silver Key",
    lines: [
      { speaker: "Narrator", text: "The echo asks the same question again and again." },
      { speaker: "Case File", text: "How do you know this love is real?" },
      { speaker: "Maria", text: "Not by advantage. By what remains when things are difficult." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 6 } }
  },
  {
    id: "vn-level-6-after-puzzle",
    levelId: 6,
    placement: "after-puzzle",
    title: "Behind the Trust Door",
    lines: [
      { speaker: "Narrator", text: "The Trust door opens, and the echo grows quiet." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "A door opened by the right question is not forced." },
      { speaker: "Narrator", text: "Inside, a lantern burns steadily." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 6 } }
  },
  {
    id: "vn-level-7-intro",
    levelId: 7,
    placement: "before-platformer",
    title: "The Quiet Garden",
    lines: [
      { speaker: "Narrator", text: "The lantern leads Maria into a garden hidden between the city and the court." },
      { speaker: "Case File", text: "Some evidence does not shout. Some evidence lights the way." },
      { speaker: "Maria", text: "Good. Some truths should be reached gently." },
      { speaker: "Narrator", text: "The garden answers only in soft light." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 7 } }
  },
  {
    id: "vn-level-7-before-puzzle",
    levelId: 7,
    placement: "before-puzzle",
    title: "The Lantern",
    lines: [
      { speaker: "Narrator", text: "The lanterns wait in a pattern, each one answering the last." },
      { speaker: "Case File", text: "Follow the light. Do not hurry it." },
      { speaker: "Maria", text: "The case is quieter here, but not weaker." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 7 } }
  },
  {
    id: "vn-level-7-after-puzzle",
    levelId: 7,
    placement: "after-puzzle",
    title: "The Ribbon on the Bench",
    lines: [
      { speaker: "Narrator", text: "The path glows to a bench where a blue ribbon holds several pages together." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "An argument tied together. That sounds deliberate." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 7 } }
  },
  {
    id: "vn-level-8-intro",
    levelId: 8,
    placement: "before-platformer",
    title: "The Argument That Holds",
    lines: [
      { speaker: "Narrator", text: "The ribboned pages lead upward into a tower of clauses and promises." },
      { speaker: "Case File", text: "An argument can climb high only if its foundation holds." },
      { speaker: "Maria", text: "Then I will not build it on noise." },
      { speaker: "Narrator", text: "At the top, the missing sentence waits." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 8 } }
  },
  {
    id: "vn-level-8-before-puzzle",
    levelId: 8,
    placement: "before-puzzle",
    title: "The Blue Ribbon",
    lines: [
      { speaker: "Narrator", text: "The ribbon marks the pages that can stand together." },
      { speaker: "Case File", text: "Choose what gives the case weight." },
      { speaker: "Maria", text: "Words are easy. Evidence is what stays." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 8 } }
  },
  {
    id: "vn-level-8-after-puzzle",
    levelId: 8,
    placement: "after-puzzle",
    title: "The Unfinished Letter",
    lines: [
      { speaker: "Narrator", text: "The argument steadies, and the blue ribbon releases a folded letter." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "The letter is unfinished. It has been waiting for all the previous clues." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 8 } }
  },
  {
    id: "vn-level-9-intro",
    levelId: 9,
    placement: "before-platformer",
    title: "The Letter Above the City",
    lines: [
      { speaker: "Narrator", text: "Above Warsaw, every place Maria has visited glows below her." },
      { speaker: "Case File", text: "Eight clues. One unfinished letter. One conclusion waiting." },
      { speaker: "Maria", text: "Then this is where the case starts to speak for itself." },
      { speaker: "Narrator", text: "The letter opens, but its meaning is scattered across the sky." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 9 } }
  },
  {
    id: "vn-level-9-before-puzzle",
    levelId: 9,
    placement: "before-puzzle",
    title: "The Unfinished Letter",
    lines: [
      { speaker: "Narrator", text: "Envelope, stamp, brick, note, margin, key, lantern, and ribbon shine above." },
      { speaker: "Case File", text: "Place the clues where they belong. The sentence will finish itself." },
      { speaker: "Maria", text: "Every clue has been leading here." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 9 } }
  },
  {
    id: "vn-level-9-after-puzzle",
    levelId: 9,
    placement: "after-puzzle",
    title: "The Sentence Completes",
    lines: [
      { speaker: "Narrator", text: "The constellation forms, and the letter finally speaks." },
      { speaker: "Case File", text: "Clue filed." },
      { speaker: "Maria", text: "The heart was never stolen. It was given." },
      { speaker: "Narrator", text: "A final court opens above the rooftops." }
    ],
    nextScene: { scene: "EvidenceRevealScene", data: { levelId: 9 } }
  },
  {
    id: "vn-level-10-intro",
    levelId: 10,
    placement: "before-platformer",
    title: "The Final Court",
    lines: [
      { speaker: "Narrator", text: "The final door opens into a court made of every clue before it." },
      { speaker: "Case File", text: "The charge is ready to be heard." },
      { speaker: "Maria", text: "Then let the evidence speak." },
      { speaker: "Narrator", text: "At the center, a seal glows like both a legal mark and a heart." }
    ],
    nextScene: { scene: "PlatformerScene", data: { levelId: 10 } }
  },
  {
    id: "vn-level-10-before-puzzle",
    levelId: 10,
    placement: "before-puzzle",
    title: "The Heart Seal",
    lines: [
      { speaker: "Narrator", text: "The final clue is not hidden. It is waiting to be understood." },
      { speaker: "Case File", text: "Complete the seal, and the verdict will open." },
      { speaker: "Maria", text: "No more missing pieces." }
    ],
    nextScene: { scene: "PuzzleScene", data: { levelId: 10 } }
  },
  {
    id: "vn-level-10-after-puzzle",
    levelId: 10,
    placement: "after-puzzle",
    title: "Before the Verdict",
    lines: [
      { speaker: "Narrator", text: "The seal closes, and the whole court becomes still." },
      { speaker: "Case File", text: "Final clue filed." },
      { speaker: "Maria", text: "Then the verdict is ready." }
    ],
    nextScene: { scene: "FinalVerdictScene" }
  }
];

export function getVisualNovelSceneSpec(id: string | null | undefined): VisualNovelSceneSpec | undefined {
  if (!id) {
    return undefined;
  }

  return visualNovelScenes.find((scene) => scene.id === id);
}

export function getVisualNovelSceneByPlacement(
  levelId: number,
  placement: VisualNovelPlacement
): VisualNovelSceneSpec | undefined {
  return visualNovelScenes.find((scene) => scene.levelId === levelId && scene.placement === placement);
}

export function getVisualNovelChapterSceneByPlacement(
  chapterId: number,
  placement: VisualNovelPlacement
): VisualNovelSceneSpec | undefined {
  return visualNovelScenes.find((scene) => scene.chapterId === chapterId && scene.placement === placement);
}
