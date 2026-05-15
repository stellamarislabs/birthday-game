import { describe, expect, it } from "vitest";
import { getVisualNovelSceneSpec } from "../content/vnScenes";
import { caseFileFrameImageUrl, getVisualNovelImageSequence, visualNovelImageSequences } from "../game/assets/finalAssets";
import {
  CHAPTER_REVEAL_FINAL_ASSET_FILENAMES,
  getChapterRevealFinalAsset
} from "../game/assets/finalRevealAssets";

describe("final image-backed scene assets", () => {
  it("registers the final case file frame", () => {
    expect(caseFileFrameImageUrl).toContain("CaseFileFrame01.webp");
  });

  it("detects the Chapter 1-5 evidence reveal images", () => {
    expect(CHAPTER_REVEAL_FINAL_ASSET_FILENAMES).toEqual({
      1: "RevealChapter01.webp",
      2: "RevealChapter02.webp",
      3: "RevealChapter03.webp",
      4: "RevealChapter04.webp",
      5: "RevealChapter05.webp"
    });

    for (const chapterId of [1, 2, 3, 4, 5] as const) {
      const asset = getChapterRevealFinalAsset(chapterId);
      expect(asset?.filename).toBe(`RevealChapter0${chapterId}.webp`);
      expect(asset?.imageUrl).toContain(`RevealChapter0${chapterId}.webp`);
    }
    expect(getChapterRevealFinalAsset(6)).toBeUndefined();
  });

  it("resolves image-backed evidence reveal URLs only when matching Chapter 1-5 files exist", () => {
    const mockRevealAssets = {
      "../../assets/final/reveals/RevealChapter01.webp": "/assets/RevealChapter01.hash.webp",
      "../../assets/final/reveals/RevealChapter05.webp": "/assets/RevealChapter05.hash.webp",
      "../../assets/final/reveals/RevealChapter06.webp": "/assets/RevealChapter06.hash.webp"
    };

    expect(getChapterRevealFinalAsset(1, mockRevealAssets)).toEqual({
      filename: "RevealChapter01.webp",
      imageUrl: "/assets/RevealChapter01.hash.webp"
    });
    expect(getChapterRevealFinalAsset(5, mockRevealAssets)).toEqual({
      filename: "RevealChapter05.webp",
      imageUrl: "/assets/RevealChapter05.hash.webp"
    });
    expect(getChapterRevealFinalAsset(2, mockRevealAssets)).toEqual({
      filename: "RevealChapter02.webp",
      imageUrl: undefined
    });
    expect(getChapterRevealFinalAsset(6, mockRevealAssets)).toBeUndefined();
  });

  it("maps only approved active VN scenes to designed image-backed pages", () => {
    expect(Object.keys(visualNovelImageSequences)).toEqual([
      "vn-chapter-1-intro",
      "vn-chapter-2-intro",
      "vn-chapter-2-before-puzzle",
      "vn-chapter-3-intro",
      "vn-chapter-4-intro",
      "vn-chapter-4-before-puzzle",
      "vn-chapter-5-intro",
      "vn-chapter-5-before-puzzle",
      "vn-chapter-6-intro",
      "vn-chapter-6-before-puzzle"
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-1-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("FirstNovel01.webp"),
      expect.stringContaining("FirstNovel02.webp"),
      expect.stringContaining("FirstNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-2-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("SecondNovel01.webp"),
      expect.stringContaining("SecondNovel02.webp"),
      expect.stringContaining("SecondNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-2-before-puzzle")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("HiddenWallPuzzleNovel01.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-3-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("ThirdNovel01.webp"),
      expect.stringContaining("ThirdNovel02.webp"),
      expect.stringContaining("ThirdNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-4-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("ForthNovel01.webp"),
      expect.stringContaining("ForthNovel02.webp"),
      expect.stringContaining("ForthNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-4-before-puzzle")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("MarginalNotePuzzleNovel01.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-5-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("FifthNovel01.webp"),
      expect.stringContaining("FifthNovel02.webp"),
      expect.stringContaining("FifthNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-5-before-puzzle")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("TheRightQuestionPuzzleNovel01.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-6-intro")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("SixthNovel01.webp"),
      expect.stringContaining("SixthNovel02.webp"),
      expect.stringContaining("SixthNovel03.webp")
    ]);
    expect(getVisualNovelImageSequence("vn-chapter-6-before-puzzle")?.map((page) => page.imageUrl)).toEqual([
      expect.stringContaining("TheFinalSealPuzzleNovel01.webp")
    ]);
  });

  it("keeps the underlying Chapter 1 intro VN metadata aligned with the baked images", () => {
    const spec = getVisualNovelSceneSpec("vn-chapter-1-intro");
    const imageSequence = getVisualNovelImageSequence("vn-chapter-1-intro");

    expect(spec?.lines).toHaveLength(3);
    expect(spec?.lines).toEqual([
      { speaker: "Case File", text: "Case No. 16/05 — The Missing Heart." },
      { speaker: "Narrator", text: "On Maria's birthday, one envelope waits where ordinary papers should have been." },
      { speaker: "Maria", text: "No client name. Only a key, a ticket, and a warning." }
    ]);
    expect(imageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(spec?.lines);
    expect(spec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 1, chapterId: 1 } });
  });

  it("keeps the underlying Chapter 2 image-backed VN metadata aligned with the baked images", () => {
    const introSpec = getVisualNovelSceneSpec("vn-chapter-2-intro");
    const introImageSequence = getVisualNovelImageSequence("vn-chapter-2-intro");
    const prePuzzleSpec = getVisualNovelSceneSpec("vn-chapter-2-before-puzzle");
    const prePuzzleImageSequence = getVisualNovelImageSequence("vn-chapter-2-before-puzzle");

    expect(introSpec?.lines).toHaveLength(3);
    expect(introSpec?.lines).toEqual([
      { speaker: "Narrator", text: "The tram ticket pulls Maria into the city's moving light." },
      { speaker: "Case File", text: "The route needs a stamp before it can reveal the wall." },
      { speaker: "Maria", text: "Then the key from the envelope finally has somewhere to turn." }
    ]);
    expect(introImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(introSpec?.lines);
    expect(introSpec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 2, chapterId: 2 } });

    expect(prePuzzleSpec?.lines).toHaveLength(1);
    expect(prePuzzleSpec?.lines).toEqual([
      { speaker: "Case File", text: "Turn the tiles until the stamped route reaches the wall." }
    ]);
    expect(prePuzzleImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(prePuzzleSpec?.lines);
    expect(prePuzzleSpec?.nextScene).toEqual({ scene: "PuzzleScene", data: { levelId: 3, chapterId: 2 } });
  });

  it("keeps the underlying Chapter 3 and Chapter 4 intro VN metadata aligned with the baked images", () => {
    const chapterThreeSpec = getVisualNovelSceneSpec("vn-chapter-3-intro");
    const chapterThreeImageSequence = getVisualNovelImageSequence("vn-chapter-3-intro");
    const chapterFourSpec = getVisualNovelSceneSpec("vn-chapter-4-intro");
    const chapterFourImageSequence = getVisualNovelImageSequence("vn-chapter-4-intro");

    expect(chapterThreeSpec?.lines).toHaveLength(3);
    expect(chapterThreeSpec?.lines).toEqual([
      { speaker: "Narrator", text: "By the Vistula, a witness gives Maria a note and disappears beneath the bridge." },
      { speaker: "Witness", text: "Ask the correct questions. Maybe the heart was not taken at all." },
      { speaker: "Maria", text: "Who was he? That was strange... There's something more to this case." }
    ]);
    expect(chapterThreeImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(chapterThreeSpec?.lines);
    expect(chapterThreeSpec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 4, chapterId: 3 } });

    expect(chapterFourSpec?.lines).toHaveLength(3);
    expect(chapterFourSpec?.lines).toEqual([
      { speaker: "Narrator", text: "The archive code opens a drawer no one has touched in years." },
      { speaker: "Case File", text: "The answer may be smaller than the question." },
      { speaker: "Maria", text: "Then I'll read the documents carefully. No secret can hide from me." }
    ]);
    expect(chapterFourImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(chapterFourSpec?.lines);
    expect(chapterFourSpec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 5, chapterId: 4 } });
  });

  it("keeps the underlying Chapter 4 pre-puzzle and Chapter 5 VN metadata aligned with the baked images", () => {
    const chapterFourPrePuzzleSpec = getVisualNovelSceneSpec("vn-chapter-4-before-puzzle");
    const chapterFourPrePuzzleImageSequence = getVisualNovelImageSequence("vn-chapter-4-before-puzzle");
    const chapterFiveSpec = getVisualNovelSceneSpec("vn-chapter-5-intro");
    const chapterFiveImageSequence = getVisualNovelImageSequence("vn-chapter-5-intro");
    const chapterFivePrePuzzleSpec = getVisualNovelSceneSpec("vn-chapter-5-before-puzzle");
    const chapterFivePrePuzzleImageSequence = getVisualNovelImageSequence("vn-chapter-5-before-puzzle");

    expect(chapterFourPrePuzzleSpec?.lines).toHaveLength(1);
    expect(chapterFourPrePuzzleSpec?.lines).toEqual([
      { speaker: "Case File", text: "The original case says the heart was taken. But the details say otherwise." }
    ]);
    expect(chapterFourPrePuzzleImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(
      chapterFourPrePuzzleSpec?.lines
    );
    expect(chapterFourPrePuzzleSpec?.nextScene).toEqual({ scene: "PuzzleScene", data: { levelId: 5, chapterId: 4 } });

    expect(chapterFiveSpec?.lines).toHaveLength(3);
    expect(chapterFiveSpec?.lines).toEqual([
      { speaker: "Narrator", text: "The silver key leads Maria into a courthouse of uncertain doors." },
      { speaker: "Narrator", text: "The Trust door will not open to the wrong question." },
      { speaker: "Maria", text: "Then the question matters as much as the key." }
    ]);
    expect(chapterFiveImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(chapterFiveSpec?.lines);
    expect(chapterFiveSpec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 6, chapterId: 5 } });

    expect(chapterFivePrePuzzleSpec?.lines).toHaveLength(1);
    expect(chapterFivePrePuzzleSpec?.lines).toEqual([
      { speaker: "Case File", text: "Choose the question that opens trust." }
    ]);
    expect(chapterFivePrePuzzleImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(
      chapterFivePrePuzzleSpec?.lines
    );
    expect(chapterFivePrePuzzleSpec?.nextScene).toEqual({ scene: "PuzzleScene", data: { levelId: 6, chapterId: 5 } });
  });

  it("keeps the underlying Chapter 6 image-backed VN metadata aligned with the baked images", () => {
    const chapterSixSpec = getVisualNovelSceneSpec("vn-chapter-6-intro");
    const chapterSixImageSequence = getVisualNovelImageSequence("vn-chapter-6-intro");
    const chapterSixPrePuzzleSpec = getVisualNovelSceneSpec("vn-chapter-6-before-puzzle");
    const chapterSixPrePuzzleImageSequence = getVisualNovelImageSequence("vn-chapter-6-before-puzzle");

    expect(chapterSixSpec?.lines).toHaveLength(3);
    expect(chapterSixSpec?.lines).toEqual([
      { speaker: "Narrator", text: "Above Warsaw, every clue Maria has followed glows behind her." },
      { speaker: "Narrator", text: "One unfinished letter. One final court." },
      { speaker: "Maria", text: "I've come a long way. Now the evidence will speak." }
    ]);
    expect(chapterSixImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(chapterSixSpec?.lines);
    expect(chapterSixSpec?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 9, chapterId: 6 } });

    expect(chapterSixPrePuzzleSpec?.lines).toHaveLength(1);
    expect(chapterSixPrePuzzleSpec?.lines).toEqual([
      { speaker: "Narrator", text: "Complete the seal, and the verdict will open." }
    ]);
    expect(chapterSixPrePuzzleImageSequence?.map(({ speaker, text }) => ({ speaker, text }))).toEqual(
      chapterSixPrePuzzleSpec?.lines
    );
    expect(chapterSixPrePuzzleSpec?.nextScene).toEqual({ scene: "PuzzleScene", data: { levelId: 10, chapterId: 6 } });
  });
});
