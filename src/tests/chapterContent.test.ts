import { describe, expect, it } from "vitest";

import {
  CHAPTER_COUNT,
  FINAL_CHAPTER_ID,
  chapters,
  getChapterById,
} from "../content/chapters";
import {
  chapterClueChain,
  getChapterClueChainEntry,
} from "../content/chapterClueChain";
import {
  chapterPuzzlePlans,
  getChapterPuzzlePlanByChapterId,
} from "../content/chapterPuzzles";
import {
  chapterVnOutlines,
  getChapterVnOutlineByChapterId,
} from "../content/chapterVnOutline";
import { clueChain } from "../content/clueChain";
import { levels } from "../content/levels";
import { puzzles } from "../content/puzzles";
import { storyContent } from "../content/story";
import { visualNovelScenes } from "../content/vnScenes";

describe("future 6-chapter content model", () => {
  it("defines exactly six implemented chapters", () => {
    expect(chapters).toHaveLength(6);
    expect(CHAPTER_COUNT).toBe(6);
    expect(FINAL_CHAPTER_ID).toBe(6);

    expect(chapters.map((chapter) => chapter.active)).toEqual([true, true, true, true, true, true]);
    expect(chapters.map((chapter) => chapter.migrationStatus)).toEqual([
      "implemented",
      "implemented",
      "implemented",
      "implemented",
      "implemented",
      "implemented",
    ]);
  });

  it("keeps Chapters 3 and 4 focused on witness and archive clues", () => {
    expect(getChapterById(3)?.mainClues).toEqual(["The Witness Note"]);
    expect(getChapterById(4)?.mainClues).toEqual(["The Marginal Note", "The Silver Key"]);
    expect(getChapterClueChainEntry(3)).toMatchObject({
      nextChapterId: 4,
      nextActionLabel: "Open the archive",
    });
    expect(getChapterClueChainEntry(4)).toMatchObject({
      nextChapterId: 5,
      nextActionLabel: "Take the key",
    });
  });

  it("keeps Chapter 3 continuity focused on witness, note, and archive code", () => {
    const chapter = getChapterById(3);
    const clueEntry = getChapterClueChainEntry(3);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(3);

    expect(chapter?.targetDurationSeconds).toEqual({ min: 90, max: 120 });
    expect(chapter?.estimatedTotalMinutes).toBe("1.5-2");
    expect(chapter?.platformerTheme.toLowerCase()).toContain("witness trail");
    expect(chapter?.storyPurpose.toLowerCase()).toContain("witness");
    expect(chapter?.storyPurpose.toLowerCase()).toContain("note");
    expect(clueEntry?.nextHintText).toContain("archive code");
    expect(puzzlePlan?.puzzleGoal.toLowerCase()).toContain("witness note");
    expect(puzzlePlan?.successText).toBe("The witness statement is restored.");
  });

  it("keeps Chapter 4 continuity focused on No. Given, silver key, and courthouse handoff", () => {
    const chapter = getChapterById(4);
    const clueEntry = getChapterClueChainEntry(4);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(4);

    expect(chapter?.targetDurationSeconds).toEqual({ min: 120, max: 150 });
    expect(chapter?.estimatedTotalMinutes).toBe("2-2.5");
    expect(chapter?.storyPurpose).toContain("\"No. Given.\"");
    expect(chapter?.mainClues).toContain("The Silver Key");
    expect(chapter?.leadsToNext).toContain("Courthouse of Echoes");
    expect(clueEntry?.nextHintText).toContain("silver key");
    expect(clueEntry?.nextHintText).toContain("Courthouse of Echoes");
    expect(puzzlePlan?.puzzleGoal).toContain("silver key");
  });

  it("keeps Chapter 1 continuity focused on envelope, key, ticket, and route", () => {
    const chapter = getChapterById(1);
    const clueEntry = getChapterClueChainEntry(1);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(1);

    expect(chapter?.targetDurationSeconds).toEqual({ min: 90, max: 120 });
    expect(chapter?.estimatedTotalMinutes).toBe("1.5-2");
    expect(chapter?.mainClues).toEqual(["The Sealed Envelope", "Brass Key", "Tram Ticket"]);
    expect(chapter?.platformerTheme.toLowerCase()).toContain("tram-ticket glow");
    expect(clueEntry?.nextHintText).toContain("tram ticket");
    expect(puzzlePlan?.puzzleGoal).toContain("sealed envelope");
    expect(puzzlePlan?.puzzleGoal).toContain("tram ticket");
  });

  it("keeps Chapter 2 continuity focused on stamp, hidden wall, and Vistula handoff", () => {
    const chapter = getChapterById(2);
    const clueEntry = getChapterClueChainEntry(2);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(2);

    expect(chapter?.targetDurationSeconds).toEqual({ min: 120, max: 150 });
    expect(chapter?.estimatedTotalMinutes).toBe("2-2.5");
    expect(chapter?.mainClues).toEqual(["The Golden Stamp", "The Red Brick"]);
    expect(chapter?.storyPurpose.toLowerCase()).toContain("hidden wall");
    expect(chapter?.storyPurpose.toLowerCase()).toContain("river mark");
    expect(clueEntry?.nextHintText).toContain("wave mark");
    expect(clueEntry?.nextHintText).toContain("Vistula");
    expect(puzzlePlan?.puzzleGoal).toContain("stamped tram route");
    expect(puzzlePlan?.puzzleGoal).toContain("hidden wall");
  });

  it("preserves the approved final verdict text during chapter expansion work", () => {
    const { finalVerdict } = storyContent;

    expect(finalVerdict).toBe(`VERDICT

In the matter of Maria v. The Missing Heart,
the Court finds Maria not guilty of stealing it.

The evidence shows that the heart was given freely,
intentionally, and with full awareness of the consequences.

Sentence:
endless birthdays, brave days, quiet mornings, ridiculous jokes,
and one person who will keep choosing you.

Happy birthday, Maria.
I love you.`);
  });

  it("keeps Chapters 5 and 6 focused on trust and verdict clues", () => {
    expect(getChapterById(5)?.mainClues).toEqual(["The Silver Key", "The Lantern", "The Blue Ribbon"]);
    expect(getChapterById(6)?.mainClues).toEqual(["The Unfinished Letter", "The Heart Seal"]);
    expect(getChapterClueChainEntry(5)).toMatchObject({
      nextChapterId: 6,
      nextActionLabel: "Read the letter",
    });
    expect(getChapterClueChainEntry(6)).toMatchObject({
      nextChapterId: null,
      nextActionLabel: "Hear the verdict",
    });
  });

  it("uses chapter ids 1 through 6", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("keeps every chapter complete enough for future routing", () => {
    for (const chapter of chapters) {
      expect(chapter.title.length).toBeGreaterThan(0);
      expect(chapter.shortTitle.length).toBeGreaterThan(0);
      expect(chapter.storyPurpose.length).toBeGreaterThan(0);
      expect(chapter.platformerTheme.length).toBeGreaterThan(0);
      expect(chapter.mainClues.length).toBeGreaterThan(0);
      expect(chapter.puzzleName.length).toBeGreaterThan(0);
      expect(chapter.puzzleType.length).toBeGreaterThan(0);
      expect(chapter.puzzlePurpose.length).toBeGreaterThan(0);
      expect(chapter.vnPurpose.length).toBeGreaterThan(0);
      expect(chapter.emotionalReveal.length).toBeGreaterThan(0);
      expect(chapter.leadsToNext.length).toBeGreaterThan(0);
      expect(chapter.oldLevelIds.length).toBeGreaterThan(0);
      expect(chapter.targetDurationSeconds.min).toBeGreaterThan(0);
      expect(chapter.targetDurationSeconds.max).toBeGreaterThan(
        chapter.targetDurationSeconds.min,
      );
      expect(chapter.estimatedTotalMinutes.length).toBeGreaterThan(0);
    }
  });

  it("maps every absorbed old level id to existing 10-level content", () => {
    const activeLevelIds = new Set(levels.map((level) => level.id));

    for (const chapter of chapters) {
      for (const oldLevelId of chapter.oldLevelIds) {
        expect(activeLevelIds.has(oldLevelId)).toBe(true);
      }
    }
  });

  it("marks Chapter 5 and Chapter 6 as high implementation risk", () => {
    expect(getChapterById(5)?.implementationRisk).toBe("high");
    expect(getChapterById(6)?.implementationRisk).toBe("high");
  });

  it("keeps Chapter 5 continuity focused on Trust, lantern light, blue ribbon, and the unfinished letter", () => {
    const chapter = getChapterById(5);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(5);
    const clueEntry = getChapterClueChainEntry(5);
    const continuityText = [
      chapter?.storyPurpose,
      chapter?.platformerTheme,
      chapter?.puzzlePurpose,
      chapter?.leadsToNext,
      puzzlePlan?.puzzleGoal,
      puzzlePlan?.successText,
      clueEntry?.nextHintText
    ].join(" ");

    expect(chapter?.targetDurationSeconds).toEqual({ min: 150, max: 180 });
    expect(chapter?.estimatedTotalMinutes).toBe("2.5-3");
    expect(continuityText).toContain("silver key");
    expect(continuityText).toContain("Trust");
    expect(continuityText).toContain("lantern");
    expect(continuityText).toContain("blue ribbon");
    expect(continuityText).toContain("unfinished letter");
    expect(puzzlePlan?.reusedOldPuzzleModules).toEqual(["trustLightPath"]);
    expect(puzzlePlan?.deprecatedOldPuzzleRoutes).toEqual([
      "old-level-6-echo-path",
      "old-level-7-lantern-sequence",
      "old-level-8-argument-tower"
    ]);
    expect(puzzlePlan?.playerInteraction).toContain("mirror");
  });

  it("keeps Chapter 6 continuity focused on prior clues, final court, heart seal, and verdict handoff", () => {
    const chapter = getChapterById(6);
    const puzzlePlan = getChapterPuzzlePlanByChapterId(6);
    const clueEntry = getChapterClueChainEntry(6);
    const outline = getChapterVnOutlineByChapterId(6);
    const continuityText = [
      chapter?.storyPurpose,
      chapter?.platformerTheme,
      chapter?.puzzlePurpose,
      chapter?.leadsToNext,
      puzzlePlan?.puzzleGoal,
      puzzlePlan?.successText,
      clueEntry?.nextHintText,
      outline?.introPurpose,
      outline?.prePuzzlePurpose,
      outline?.postPuzzlePurpose
    ].join(" ");

    expect(chapter?.targetDurationSeconds).toEqual({ min: 150, max: 180 });
    expect(chapter?.estimatedTotalMinutes).toBe("2.5-3");
    expect(continuityText).toContain("unfinished letter");
    expect(continuityText).toContain("prior clue");
    expect(continuityText).toContain("final court");
    expect(continuityText).toContain("seal");
    expect(continuityText).toContain("verdict");
    expect(continuityText).not.toContain("The Heart, Freely Given");
  });

  it("keeps legacy 10-level source material intact while chapters are active", () => {
    expect(levels).toHaveLength(10);
    expect(puzzles).toHaveLength(10);
    expect(clueChain).toHaveLength(10);
    expect(
      visualNovelScenes.filter((scene) => (scene.levelId ?? 0) > 0),
    ).toHaveLength(30);
    expect(
      visualNovelScenes.filter((scene) => (scene.chapterId ?? 0) > 0),
    ).toHaveLength(18);
  });

  it("defines one future puzzle plan for every chapter", () => {
    expect(chapterPuzzlePlans).toHaveLength(CHAPTER_COUNT);
    expect(chapterPuzzlePlans.map((plan) => plan.chapterId)).toEqual(
      chapters.map((chapter) => chapter.id),
    );

    for (const plan of chapterPuzzlePlans) {
      expect(plan.puzzleName.length).toBeGreaterThan(0);
      expect(plan.puzzleType.length).toBeGreaterThan(0);
      expect(plan.reusedOldPuzzleModules.length).toBeGreaterThan(0);
      expect(plan.puzzleGoal.length).toBeGreaterThan(0);
      expect(plan.playerInteraction.length).toBeGreaterThan(0);
      expect(plan.successText.length).toBeGreaterThan(0);
      expect(plan.wrongIncompleteText.length).toBeGreaterThan(0);
      expect(plan.revealTarget.length).toBeGreaterThan(0);
    }
  });

  it("defines one future VN outline for every chapter", () => {
    expect(chapterVnOutlines).toHaveLength(CHAPTER_COUNT);
    expect(chapterVnOutlines.map((outline) => outline.chapterId)).toEqual(
      chapters.map((chapter) => chapter.id),
    );

    for (const outline of chapterVnOutlines) {
      expect(outline.introPurpose.length).toBeGreaterThan(0);
      expect(outline.prePuzzlePurpose.length).toBeGreaterThan(0);
      expect(outline.postPuzzlePurpose.length).toBeGreaterThan(0);
      expect(outline.suggestedSceneIds.intro).toBe(
        `vn-chapter-${outline.chapterId}-intro`,
      );
      expect(outline.suggestedSceneIds.beforePuzzle).toBe(
        `vn-chapter-${outline.chapterId}-before-puzzle`,
      );
      expect(outline.suggestedSceneIds.afterPuzzle).toBe(
        `vn-chapter-${outline.chapterId}-after-puzzle`,
      );
    }
  });

  it("defines one future chapter clue-chain entry for every chapter", () => {
    expect(chapterClueChain).toHaveLength(CHAPTER_COUNT);
    expect(chapterClueChain.map((entry) => entry.chapterId)).toEqual(
      chapters.map((chapter) => chapter.id),
    );

    for (const entry of chapterClueChain) {
      expect(entry.currentClues.length).toBeGreaterThan(0);
      expect(entry.meaningDiscovered.length).toBeGreaterThan(0);
      expect(entry.nextHintText.length).toBeGreaterThan(0);
      expect(entry.nextActionLabel.length).toBeGreaterThan(0);
    }
  });

  it("points Chapters 1-5 to the next chapter and Chapter 6 to final verdict", () => {
    for (let chapterId = 1; chapterId < FINAL_CHAPTER_ID; chapterId += 1) {
      expect(getChapterClueChainEntry(chapterId)?.nextChapterId).toBe(
        chapterId + 1,
      );
    }

    const finalEntry = getChapterClueChainEntry(FINAL_CHAPTER_ID);
    expect(finalEntry?.nextChapterId).toBeNull();
    expect(finalEntry?.nextActionLabel).toBe("Hear the verdict");
    expect(finalEntry?.nextHintText).toContain("verdict");
  });

  it("resolves chapter helper lookups", () => {
    expect(getChapterById(1)?.title).toBe("The Sealed Envelope");
    expect(getChapterById(99)).toBeUndefined();
    expect(getChapterPuzzlePlanByChapterId(1)?.puzzleName).toBe("Case Mosaic: The Sealed Envelope");
    expect(getChapterPuzzlePlanByChapterId(1)?.successText).toBe("The first clue is restored.");
    expect(getChapterPuzzlePlanByChapterId(2)?.puzzleType).toBe("chapter-route-tile-hidden-wall");
    expect(getChapterPuzzlePlanByChapterId(2)?.playerInteraction).toContain("route tiles");
    expect(getChapterPuzzlePlanByChapterId(2)?.wrongIncompleteText).toBe("The route has not reached the wall yet.");
    expect(getChapterPuzzlePlanByChapterId(3)?.successText).toBe("The witness statement is restored.");
    expect(getChapterPuzzlePlanByChapterId(4)?.successText).toBe("The file is in order.");
    expect(getChapterPuzzlePlanByChapterId(5)?.successText).toContain("The Trust door opens.");
    expect(getChapterPuzzlePlanByChapterId(5)?.successText).toContain("The lantern lights the blue-ribbon pages.");
    expect(getChapterPuzzlePlanByChapterId(5)?.successText).toContain("The unfinished letter is released.");
    expect(getChapterPuzzlePlanByChapterId(6)?.successText).toBe("The final seal closes. The verdict is ready.");
    expect(getChapterPuzzlePlanByChapterId(6)?.puzzleName).toBe("Final Seal: The Court of the Heart");
    expect(getChapterPuzzlePlanByChapterId(6)?.playerInteraction).toContain("seal rings");
    expect(getChapterPuzzlePlanByChapterId(6)?.playerInteraction).toContain("Envelope");
    expect(getChapterPuzzlePlanByChapterId(6)?.wrongIncompleteText).toBe("The seal is not complete yet.");
    expect(getChapterPuzzlePlanByChapterId(99)).toBeUndefined();
    expect(getChapterVnOutlineByChapterId(3)?.suggestedSceneIds.intro).toBe(
      "vn-chapter-3-intro",
    );
    expect(getChapterVnOutlineByChapterId(99)).toBeUndefined();
    expect(getChapterClueChainEntry(4)?.currentClues).toContain(
      "The Marginal Note",
    );
    expect(getChapterClueChainEntry(99)).toBeUndefined();
  });
});
