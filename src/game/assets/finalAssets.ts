export interface FinalImagePage {
  imageUrl: string;
  speaker: string;
  text: string;
}

export const caseFileFrameImageUrl = new URL("../../assets/final/CaseFileFrame01.webp", import.meta.url).href;

export const visualNovelImageSequences: Record<string, FinalImagePage[]> = {
  "vn-chapter-1-intro": [
    {
      imageUrl: new URL("../../assets/final/FirstNovel01.webp", import.meta.url).href,
      speaker: "Case File",
      text: "Case No. 16/05 — The Missing Heart."
    },
    {
      imageUrl: new URL("../../assets/final/FirstNovel02.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "On Maria's birthday, one envelope waits where ordinary papers should have been."
    },
    {
      imageUrl: new URL("../../assets/final/FirstNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "No client name. Only a key, a ticket, and a warning."
    }
  ],
  "vn-chapter-2-intro": [
    {
      imageUrl: new URL("../../assets/final/SecondNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "The tram ticket pulls Maria into the city's moving light."
    },
    {
      imageUrl: new URL("../../assets/final/SecondNovel02.webp", import.meta.url).href,
      speaker: "Case File",
      text: "The route needs a stamp before it can reveal the wall."
    },
    {
      imageUrl: new URL("../../assets/final/SecondNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "Then the key from the envelope finally has somewhere to turn."
    }
  ],
  "vn-chapter-2-before-puzzle": [
    {
      imageUrl: new URL("../../assets/final/HiddenWallPuzzleNovel01.webp", import.meta.url).href,
      speaker: "Case File",
      text: "Turn the tiles until the stamped route reaches the wall."
    }
  ],
  "vn-chapter-3-intro": [
    {
      imageUrl: new URL("../../assets/final/ThirdNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "By the Vistula, a witness gives Maria a note and disappears beneath the bridge."
    },
    {
      imageUrl: new URL("../../assets/final/ThirdNovel02.webp", import.meta.url).href,
      speaker: "Witness",
      text: "Ask the correct questions. Maybe the heart was not taken at all."
    },
    {
      imageUrl: new URL("../../assets/final/ThirdNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "Who was he? That was strange... There's something more to this case."
    }
  ],
  "vn-chapter-4-intro": [
    {
      imageUrl: new URL("../../assets/final/ForthNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "The archive code opens a drawer no one has touched in years."
    },
    {
      imageUrl: new URL("../../assets/final/ForthNovel02.webp", import.meta.url).href,
      speaker: "Case File",
      text: "The answer may be smaller than the question."
    },
    {
      imageUrl: new URL("../../assets/final/ForthNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "Then I'll read the documents carefully. No secret can hide from me."
    }
  ],
  "vn-chapter-4-before-puzzle": [
    {
      imageUrl: new URL("../../assets/final/MarginalNotePuzzleNovel01.webp", import.meta.url).href,
      speaker: "Case File",
      text: "The original case says the heart was taken. But the details say otherwise."
    }
  ],
  "vn-chapter-5-intro": [
    {
      imageUrl: new URL("../../assets/final/FifthNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "The silver key leads Maria into a courthouse of uncertain doors."
    },
    {
      imageUrl: new URL("../../assets/final/FifthNovel02.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "The Trust door will not open to the wrong question."
    },
    {
      imageUrl: new URL("../../assets/final/FifthNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "Then the question matters as much as the key."
    }
  ],
  "vn-chapter-5-before-puzzle": [
    {
      imageUrl: new URL("../../assets/final/TheRightQuestionPuzzleNovel01.webp", import.meta.url).href,
      speaker: "Case File",
      text: "Choose the question that opens trust."
    }
  ],
  "vn-chapter-6-intro": [
    {
      imageUrl: new URL("../../assets/final/SixthNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "Above Warsaw, every clue Maria has followed glows behind her."
    },
    {
      imageUrl: new URL("../../assets/final/SixthNovel02.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "One unfinished letter. One final court."
    },
    {
      imageUrl: new URL("../../assets/final/SixthNovel03.webp", import.meta.url).href,
      speaker: "Maria",
      text: "I've come a long way. Now the evidence will speak."
    }
  ],
  "vn-chapter-6-before-puzzle": [
    {
      imageUrl: new URL("../../assets/final/TheFinalSealPuzzleNovel01.webp", import.meta.url).href,
      speaker: "Narrator",
      text: "Complete the seal, and the verdict will open."
    }
  ]
};

export function getVisualNovelImageSequence(sceneId: string | undefined): FinalImagePage[] | undefined {
  return sceneId ? visualNovelImageSequences[sceneId] : undefined;
}
