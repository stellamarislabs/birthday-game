import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { chapters } from "../content/chapters";
import { clueChain, getClueChainEntry } from "../content/clueChain";
import { chapterPuzzlePlans } from "../content/chapterPuzzles";
import { levels } from "../content/levels";
import { openingCinematicBeats, openingCinematicTotalDurationMs } from "../content/openingCinematic";
import { puzzles } from "../content/puzzles";
import { storyContent } from "../content/story";
import { visualNovelScenes } from "../content/vnScenes";
import { ACTIVE_CHAPTER_FLOWS } from "../game/systems/ChapterBridge";
import { DEFAULT_SAVE_KEY } from "../game/systems/SaveManager";
import { PUZZLE_TYPES } from "../types/PuzzleSpec";

describe("level content", () => {
  it("defines exactly 10 planned levels", () => {
    expect(levels).toHaveLength(10);
  });

  it("uses level ids 1 through 10", () => {
    expect(levels.map((level) => level.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("does not duplicate level ids", () => {
    const ids = levels.map((level) => level.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps Level 1 as the case-mosaic puzzle", () => {
    expect(levels[0].puzzleType).toBe("case-mosaic");
    expect(puzzles.find((puzzle) => puzzle.levelId === 1)?.type).toBe("case-mosaic");
  });

  it("keeps Level 2 as the case-timeline puzzle", () => {
    expect(levels[1].puzzleType).toBe("case-timeline");
    expect(puzzles.find((puzzle) => puzzle.levelId === 2)?.type).toBe("case-timeline");
  });

  it("keeps Level 3 as the route-tile puzzle plan", () => {
    expect(levels[2].puzzleType).toBe("route-tile-puzzle");
  });

  it("keeps Level 3 puzzle spec as route-tile-puzzle", () => {
    expect(puzzles.find((puzzle) => puzzle.levelId === 3)?.type).toBe("route-tile-puzzle");
  });

  it("keeps Level 4 as the deposition-order puzzle plan", () => {
    expect(levels[3].puzzleType).toBe("deposition-order");
    expect(puzzles.find((puzzle) => puzzle.levelId === 4)?.type).toBe("deposition-order");
  });

  it("keeps Level 5 as the case-file-sorting puzzle plan", () => {
    expect(levels[4].puzzleType).toBe("case-file-sorting");
    expect(puzzles.find((puzzle) => puzzle.levelId === 5)?.type).toBe("case-file-sorting");
  });

  it("keeps revised Chapter 3 and 4 player-facing puzzles off the old active modules", () => {
    const chapterThreePuzzle = puzzles.find((puzzle) => puzzle.levelId === 4);
    const chapterFourPuzzle = puzzles.find((puzzle) => puzzle.levelId === 5);

    expect(chapterThreePuzzle).toMatchObject({
      type: "deposition-order",
      title: "Deposition Order: The Witness Note"
    });
    expect(chapterFourPuzzle).toMatchObject({
      type: "case-file-sorting",
      title: "Case File Sorting: No. Given."
    });
    expect(chapterThreePuzzle?.type).not.toBe("witness-lens");
    expect(chapterFourPuzzle?.type).not.toBe("archive-detail-finder");
    expect(JSON.stringify({ chapterThreePuzzle, chapterFourPuzzle })).not.toContain("Exhibit");
  });

  it("keeps Level 6 as the trust-light-path puzzle plan", () => {
    const chapterFivePuzzle = puzzles.find((puzzle) => puzzle.levelId === 6);

    expect(levels[5].puzzleType).toBe("trust-light-path");
    expect(chapterFivePuzzle).toMatchObject({
      type: "trust-light-path",
      title: "Trust Door Light Path"
    });
    expect(chapterFivePuzzle?.instruction).toContain("question");
    expect(chapterFivePuzzle?.instruction).toContain("light reaches Trust");
    expect(JSON.stringify(chapterFivePuzzle)).not.toContain("Exhibit");
  });

  it("keeps Level 7 as the lantern-sequence puzzle plan", () => {
    expect(levels[6].puzzleType).toBe("lantern-sequence");
    expect(puzzles.find((puzzle) => puzzle.levelId === 7)?.type).toBe("lantern-sequence");
  });

  it("keeps Level 8 as the argument-tower puzzle plan", () => {
    expect(levels[7].puzzleType).toBe("argument-tower");
    expect(puzzles.find((puzzle) => puzzle.levelId === 8)?.type).toBe("argument-tower");
  });

  it("keeps Level 9 as the case-constellation puzzle plan", () => {
    expect(levels[8].puzzleType).toBe("case-constellation");
    expect(puzzles.find((puzzle) => puzzle.levelId === 9)?.type).toBe("case-constellation");
  });

  it("keeps Level 10 as the final-verdict-assembly puzzle plan", () => {
    const finalPuzzle = puzzles.find((puzzle) => puzzle.levelId === 10);

    expect(levels[9].puzzleType).toBe("final-verdict-assembly");
    expect(finalPuzzle).toMatchObject({
      type: "final-verdict-assembly",
      title: "Final Seal: The Court of the Heart"
    });
    expect(finalPuzzle?.instruction).toContain("Rotate the seal rings");
    expect(finalPuzzle?.mobileUxNotes).toContain("tap-to-rotate");
    expect(JSON.stringify(finalPuzzle)).not.toContain("The Heart, Freely Given");
  });

  it("keeps the six chapter-facing puzzle routes on the redesigned mechanics-driven set", () => {
    const activeChapterPuzzleRoutes = [
      { chapterId: 1, levelId: 1, type: "case-mosaic", title: "Case Mosaic: The Sealed Envelope" },
      { chapterId: 2, levelId: 3, type: "route-tile-puzzle", title: "Route Tile Puzzle: The Hidden Wall" },
      { chapterId: 3, levelId: 4, type: "deposition-order", title: "Deposition Order: The Witness Note" },
      { chapterId: 4, levelId: 5, type: "case-file-sorting", title: "Case File Sorting: No. Given." },
      { chapterId: 5, levelId: 6, type: "trust-light-path", title: "Trust Door Light Path" },
      { chapterId: 6, levelId: 10, type: "final-verdict-assembly", title: "Final Seal: The Court of the Heart" }
    ] as const;

    for (const expected of activeChapterPuzzleRoutes) {
      expect(puzzles.find((puzzle) => puzzle.levelId === expected.levelId)).toMatchObject({
        type: expected.type,
        title: expected.title
      });
    }

    const activeTypes = activeChapterPuzzleRoutes.map((route) => route.type);
    expect(activeTypes).not.toContain("witness-lens");
    expect(activeTypes).not.toContain("archive-detail-finder");
    expect(activeTypes).not.toContain("echo-path");
    expect(activeTypes).not.toContain("final-letter-assembly");
  });

  it("keeps the active six-puzzle set inside Part 45G-R2 QA duration and payoff targets", () => {
    const activeChapterPuzzleQa = [
      {
        chapterId: 1,
        levelId: 1,
        type: "case-mosaic",
        minSeconds: 30,
        maxSeconds: 45,
        payoffTerms: ["envelope", "brass key", "tram ticket", "route"],
      },
      {
        chapterId: 2,
        levelId: 3,
        type: "route-tile-puzzle",
        minSeconds: 35,
        maxSeconds: 60,
        payoffTerms: ["keyhole", "hidden wall", "Vistula"],
      },
      {
        chapterId: 3,
        levelId: 4,
        type: "deposition-order",
        minSeconds: 30,
        maxSeconds: 50,
        payoffTerms: ["witness note", "archive code"],
      },
      {
        chapterId: 4,
        levelId: 5,
        type: "case-file-sorting",
        minSeconds: 35,
        maxSeconds: 60,
        payoffTerms: ["No. Given.", "Silver Key"],
      },
      {
        chapterId: 5,
        levelId: 6,
        type: "trust-light-path",
        minSeconds: 40,
        maxSeconds: 60,
        payoffTerms: ["question", "lantern", "Trust", "blue-ribbon", "unfinished letter"],
      },
      {
        chapterId: 6,
        levelId: 10,
        type: "final-verdict-assembly",
        minSeconds: 30,
        maxSeconds: 50,
        payoffTerms: ["Envelope", "Wall", "Witness", "Correction", "Trust", "Heart"],
      },
    ] as const;

    for (const expected of activeChapterPuzzleQa) {
      const puzzle = puzzles.find((candidate) => candidate.levelId === expected.levelId);
      const plan = chapterPuzzlePlans.find((candidate) => candidate.chapterId === expected.chapterId);
      const combinedCopy = JSON.stringify({ puzzle, plan });

      expect(puzzle).toMatchObject({
        type: expected.type,
      });
      expect(puzzle?.estimatedSeconds, `${puzzle?.title} estimated duration`).toBeGreaterThanOrEqual(expected.minSeconds);
      expect(puzzle?.estimatedSeconds, `${puzzle?.title} estimated duration`).toBeLessThanOrEqual(expected.maxSeconds);
      expect(puzzle?.instruction.length, `${puzzle?.title} instruction length`).toBeLessThanOrEqual(90);

      for (const term of expected.payoffTerms) {
        expect(combinedCopy, `${puzzle?.title} payoff term ${term}`).toContain(term);
      }
    }

    const activeCopy = JSON.stringify(
      activeChapterPuzzleQa.map((expected) => ({
        puzzle: puzzles.find((candidate) => candidate.levelId === expected.levelId),
        plan: chapterPuzzlePlans.find((candidate) => candidate.chapterId === expected.chapterId),
      })),
    );

    expect(activeCopy).not.toContain("Witness Lens");
    expect(activeCopy).not.toContain("Archive Detail Finder");
    expect(activeCopy).not.toContain("Echo Path");
    expect(activeCopy).not.toContain("ten fragments");
    expect(activeCopy).not.toContain("The Heart, Freely Given");
    expect(activeCopy).not.toContain("Exhibit");
  });

  it("keeps the release-readiness spine on the six active chapters and final verdict boundary", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(ACTIVE_CHAPTER_FLOWS.map((flow) => ({
      chapterId: flow.chapterId,
      platformerLevelId: flow.platformerLevelId,
      puzzleLevelId: flow.puzzleLevelId,
      completionLevelId: flow.completionLevelId,
    }))).toEqual([
      { chapterId: 1, platformerLevelId: 1, puzzleLevelId: 1, completionLevelId: 1 },
      { chapterId: 2, platformerLevelId: 2, puzzleLevelId: 3, completionLevelId: 3 },
      { chapterId: 3, platformerLevelId: 4, puzzleLevelId: 4, completionLevelId: 4 },
      { chapterId: 4, platformerLevelId: 5, puzzleLevelId: 5, completionLevelId: 5 },
      { chapterId: 5, platformerLevelId: 6, puzzleLevelId: 6, completionLevelId: 8 },
      { chapterId: 6, platformerLevelId: 9, puzzleLevelId: 10, completionLevelId: 10 },
    ]);

    const activePlatformerIds = ACTIVE_CHAPTER_FLOWS.map((flow) => flow.platformerLevelId);
    const activePuzzleIds = ACTIVE_CHAPTER_FLOWS.map((flow) => flow.puzzleLevelId);
    const activePlatformerSeconds = activePlatformerIds.reduce(
      (total, levelId) => {
        const level = levels.find((candidate) => candidate.id === levelId);
        return {
          min: total.min + (level?.targetDurationSeconds.min ?? 0),
          max: total.max + (level?.targetDurationSeconds.max ?? 0),
        };
      },
      { min: 0, max: 0 },
    );
    const activePuzzleSeconds = activePuzzleIds.reduce((total, levelId) => {
      return total + (puzzles.find((candidate) => candidate.levelId === levelId)?.estimatedSeconds ?? 0);
    }, 0);

    expect(openingCinematicTotalDurationMs).toBeLessThanOrEqual(30_000);
    expect(activePlatformerSeconds).toEqual({ min: 615, max: 795 });
    expect(activePuzzleSeconds).toBe(265);
    expect(activePlatformerSeconds.max + activePuzzleSeconds + openingCinematicTotalDurationMs / 1000).toBeLessThanOrEqual(19 * 60);

    const activePuzzleCopy = JSON.stringify(
      activePuzzleIds.map((levelId) => puzzles.find((candidate) => candidate.levelId === levelId)),
    );
    expect(activePuzzleCopy).not.toContain("Witness Lens");
    expect(activePuzzleCopy).not.toContain("Archive Detail Finder");
    expect(activePuzzleCopy).not.toContain("Echo Path");
    expect(activePuzzleCopy).not.toContain("ten fragments");
    expect(storyContent.finalVerdict).toContain("the Court finds Maria not guilty of stealing it.");
    expect(storyContent.ui.acceptVerdict).toBe("Accept Verdict");
  });

  it("uses the reframed player-facing title and Polish subtitle", () => {
    expect(storyContent.title).toBe("Maria and the Case of the Missing Heart");
    expect(storyContent.subtitle).toBe("Sprawa Zaginionego Serca");
  });

  it("uses the shortened opening start title only on the opening gate", () => {
    expect(storyContent.ui.openingStartTitle).toBe("Case of the Missing Heart");
    expect(storyContent.title).toBe("Maria and the Case of the Missing Heart");
  });

  it("preserves the approved final verdict text", () => {
    expect(storyContent.finalVerdict).toBe(`VERDICT

In the matter of Maria v. The Missing Heart,
the Court finds Maria not guilty of stealing it.

The evidence shows that the heart was given freely,
intentionally, and with full awareness of the consequences.

Sentence:
endless birthdays, brave days, quiet mornings, ridiculous jokes,
and one person who will keep choosing you.

Happy birthday, Maria.
I love you.`);
    expect(storyContent.ui.caseClosed).toBe("Case closed. Love confirmed.");
  });

  it("keeps the opening case file direct and readable", () => {
    expect(storyContent.openingCaseFile.caseNumber).toBe("Case No. 16/05");
    expect([
      storyContent.openingCaseFile.salutation,
      ...storyContent.openingCaseFile.body,
      ...storyContent.openingCaseFile.signature
    ]).toEqual([
      "Applicant Maria,",
      "A priceless heart has gone missing somewhere in Warsaw.",
      "A trail of clues is hidden across Warsaw.",
      "Follow the evidence carefully.",
      "Do not trust the loudest answer.",
      "Signed,",
      "A Secret Client"
    ]);
    expect(storyContent.openingCaseFile.body.join(" ")).toContain("A trail of clues is hidden across Warsaw.");
    expect(storyContent.openingCaseFile.body.join(" ")).not.toContain("Ten clues");
    expect(storyContent.openingCaseFile.body.join(" ")).toContain("Follow the evidence carefully.");
    expect(storyContent.openingCaseFile.body.join(" ")).toContain("Do not trust the loudest answer.");
    expect(storyContent.ui.levelTenPuzzlePlaceholder).not.toContain("Level 10");
  });

  it("does not repeat the opening cinematic case-file caption", () => {
    expect(new Set(openingCinematicBeats.map((beat) => beat.caption)).size).toBe(openingCinematicBeats.length);
    expect(openingCinematicBeats.find((beat) => beat.id === "she-sits")?.caption).not.toBe(
      openingCinematicBeats.find((beat) => beat.id === "menu-reveal")?.caption
    );
  });

  it("keeps credits honest about generated audio and external assets", () => {
    expect(storyContent.credits.lines).toContain("Maria and the Case of the Missing Heart");
    expect(JSON.stringify(storyContent.credits)).not.toContain("Maria and the Case of the Tenth Exhibit");
    expect(JSON.stringify(storyContent.credits)).not.toContain("Sprawa Dziesiątego Dowodu");
    expect(storyContent.credits.lines).toContain(
      "User-provided final art and chapter music are used with permission; sound effects are generated in code."
    );
  });

  it("keeps player-facing UI copy free of old build placeholder language", () => {
    const uiCopy = Object.values(storyContent.ui).map(String);

    expect(uiCopy.filter((copy) => /placeholder|future part|part \d|coming in part/i.test(copy))).toEqual([]);
  });

  it("keeps active player-facing content free of the old title and case-number chrome", () => {
    const activeCopy = JSON.stringify({
      storyContent,
      clueChain,
      levels,
      puzzles,
      visualNovelScenes,
      openingCinematicBeats
    });

    expect(activeCopy).not.toContain("Maria and the Case of the Tenth Exhibit");
    expect(activeCopy).not.toContain("Sprawa Dziesiątego Dowodu");
    expect(activeCopy).not.toContain("M/10");
    expect(activeCopy).not.toContain("Case No. M");
  });

  it("keeps active pre-verdict content from spoiling the final freely-given wording", () => {
    const activePreVerdictCopy = JSON.stringify({
      openingCaseFile: storyContent.openingCaseFile,
      ui: storyContent.ui,
      openingCinematicBeats,
      puzzles,
      chapterPuzzlePlans,
      activeChapterScenes: visualNovelScenes.filter((scene) => (scene.chapterId ?? 0) > 0)
    });

    expect(activePreVerdictCopy).not.toContain("The Heart, Freely Given");
    expect(activePreVerdictCopy).toContain("Final Seal: The Court of the Heart");
  });

  it("keeps Chapter 6 active puzzle naming on the final seal before the verdict", () => {
    const finalSealPuzzle = puzzles.find((puzzle) => puzzle.levelId === 10);
    const finalSealPlan = chapterPuzzlePlans.find((plan) => plan.chapterId === 6);
    const finalSealClue = clueChain.find((entry) => entry.levelId === 10);
    const chapterSixCopy = JSON.stringify({ finalSealPuzzle, finalSealPlan, finalSealClue });

    expect(finalSealPuzzle?.title).toBe("Final Seal: The Court of the Heart");
    expect(finalSealClue?.clueName).toBe("The Heart Seal");
    expect(chapterSixCopy).not.toContain("The Heart, Freely Given");
  });

  it("keeps active player-facing terms in the clue language", () => {
    const activeCopy = JSON.stringify({
      storyContent,
      clueChain,
      levels,
      puzzles,
      visualNovelScenes,
      openingCinematicBeats
    });

    expect(activeCopy).not.toContain("Exhibit admitted");
    expect(activeCopy).not.toContain("Exhibit Archive");
    expect(activeCopy).not.toContain("Next Exhibit");
    expect(activeCopy).not.toContain("Submit Exhibit");
    expect(activeCopy).not.toContain("Evidence Review");
    expect(activeCopy).toContain("Clue filed.");
    expect(activeCopy).toContain("Case Review");
  });

  it("keeps the Part 39 story bible available for future narrative rewrites", () => {
    expect(existsSync("docs/story-bible.md")).toBe(true);
  });

  it("keeps AGENTS guidance aligned to the current six-chapter Missing Heart project", () => {
    const agents = readFileSync("AGENTS.md", "utf8");

    expect(agents).toContain("Maria and the Case of the Missing Heart");
    expect(agents).toContain("Sprawa Zaginionego Serca");
    expect(agents).toContain("Active structure: 6 chapters");
    expect(agents).toContain("Active platformer geometry has been baked into canonical");
    expect(agents).toContain("Remaining root dev override files");
    expect(agents).not.toContain("Maria and the Case of the Tenth Exhibit");
    expect(agents).not.toContain("Sprawa Dziesi\u0105tego Dowodu");
  });

  it("preserves the legacy save key until a tested migration is requested", () => {
    expect(DEFAULT_SAVE_KEY).toBe("maria-tenth-exhibit-save");
  });

  it("defines a clue-chain continuity entry for every level", () => {
    expect(clueChain.map((entry) => entry.levelId)).toEqual(levels.map((level) => level.id));
  });

  it("keeps clue-chain clue names aligned with level clue names", () => {
    for (const level of levels) {
      expect(getClueChainEntry(level.id)?.clueName).toBe(level.exhibitName);
      expect(getClueChainEntry(level.id)?.solvedMeaning).toBe(level.emotionalReveal);
    }
  });

  it("points levels 1-9 to the next clue and Level 10 to the verdict", () => {
    for (const levelId of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const entry = getClueChainEntry(levelId);

      expect(entry?.nextClueName).toBe(levels[levelId]?.exhibitName);
      expect(entry?.nextHintText?.trim().length).toBeGreaterThan(0);
      expect(entry?.nextLabel.trim().length).toBeGreaterThan(0);
    }

    const finalEntry = getClueChainEntry(10);
    expect(finalEntry?.nextClueName).toBeNull();
    expect(finalEntry?.nextHintText).toBeNull();
    expect(finalEntry?.nextLabel).toBe("Hear the verdict");
  });

  it("uses only valid puzzle types", () => {
    const validTypes = new Set(PUZZLE_TYPES);

    for (const level of levels) {
      expect(validTypes.has(level.puzzleType)).toBe(true);
    }
  });

  it("defines target duration ranges for every level", () => {
    for (const level of levels) {
      expect(level.targetDurationSeconds.min).toBeGreaterThan(0);
      expect(level.targetDurationSeconds.max).toBeGreaterThanOrEqual(level.targetDurationSeconds.min);
    }
  });

  it("uses the updated bridge pacing ranges", () => {
    expect(levels.map((level) => level.targetDurationSeconds)).toEqual([
      { min: 75, max: 105 },
      { min: 105, max: 135 },
      { min: 90, max: 120 },
      { min: 90, max: 120 },
      { min: 105, max: 135 },
      { min: 120, max: 150 },
      { min: 75, max: 90 },
      { min: 100, max: 130 },
      { min: 120, max: 150 },
      { min: 120, max: 150 }
    ]);
  });

  it("defines exhibit names for every level", () => {
    for (const level of levels) {
      expect(level.exhibitName.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("puzzle content", () => {
  it("defines one puzzle spec per level", () => {
    expect(puzzles.map((puzzle) => puzzle.levelId)).toEqual(levels.map((level) => level.id));
  });
});
